import { Message } from './messaging'
import { apiClient } from './api'

export interface SearchResult {
  message: Message
  conversationId: string
  conversationName: string
  relevance: number
}

export class MessageSearchService {
  /**
   * Local search through messages (for client-side filtering)
   */
  searchLocal(
    messages: Message[],
    query: string,
    conversationId?: string
  ): Message[] {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    return messages.filter(msg => {
      const matchesQuery =
        msg.content.toLowerCase().includes(lowerQuery) ||
        msg.senderName.toLowerCase().includes(lowerQuery)

      const matchesConversation = !conversationId || msg.id.includes(conversationId)

      return matchesQuery && matchesConversation
    })
  }

  /**
   * Server-side search through all messages
   */
  async searchServer(query: string, userId: string): Promise<SearchResult[]> {
    try {
      const results = await apiClient.searchMessages(query, userId)
      return results.map(msg => ({
        message: msg,
        conversationId: msg.id,
        conversationName: msg.senderName,
        relevance: this.calculateRelevance(msg.content, query),
      }))
    } catch (error) {
      console.error('Search failed:', error)
      return []
    }
  }

  /**
   * Calculate relevance score for search results
   */
  private calculateRelevance(content: string, query: string): number {
    const lowerContent = content.toLowerCase()
    const lowerQuery = query.toLowerCase()

    let score = 0

    // Exact match
    if (lowerContent === lowerQuery) score += 100

    // Starts with query
    if (lowerContent.startsWith(lowerQuery)) score += 50

    // Contains query
    if (lowerContent.includes(lowerQuery)) score += 25

    // Word match
    const words = lowerContent.split(/\s+/)
    const queryWords = lowerQuery.split(/\s+/)
    const matchedWords = queryWords.filter(qw => words.some(w => w.includes(qw)))
    score += matchedWords.length * 10

    return score
  }

  /**
   * Highlight search query in text
   */
  highlightQuery(text: string, query: string): string {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  /**
   * Get context around search result (preview)
   */
  getPreview(text: string, query: string, contextLength = 100): string {
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const index = lowerText.indexOf(lowerQuery)

    if (index === -1) return text.substring(0, contextLength) + '...'

    const start = Math.max(0, index - contextLength / 2)
    const end = Math.min(text.length, index + contextLength / 2)

    let preview = text.substring(start, end)
    if (start > 0) preview = '...' + preview
    if (end < text.length) preview = preview + '...'

    return preview
  }

  /**
   * Advanced search with filters
   */
  advancedSearch(
    messages: Message[],
    options: {
      query?: string
      from?: string
      to?: string
      startDate?: Date
      endDate?: Date
      unreadOnly?: boolean
    }
  ): Message[] {
    let results = [...messages]

    // Text search
    if (options.query) {
      results = this.searchLocal(results, options.query)
    }

    // From filter
    if (options.from) {
      results = results.filter(m =>
        m.senderName.toLowerCase().includes(options.from!.toLowerCase())
      )
    }

    // To filter
    if (options.to) {
      results = results.filter(m =>
        m.recipientId.toLowerCase().includes(options.to!.toLowerCase())
      )
    }

    // Date range filter
    if (options.startDate) {
      results = results.filter(m => new Date(m.timestamp) >= options.startDate!)
    }

    if (options.endDate) {
      results = results.filter(m => new Date(m.timestamp) <= options.endDate!)
    }

    // Unread filter
    if (options.unreadOnly) {
      results = results.filter(m => !m.read)
    }

    return results
  }

  /**
   * Get search suggestions based on previous searches
   */
  getSuggestions(
    messages: Message[],
    query: string,
    limit = 5
  ): string[] {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    const suggestions = new Set<string>()

    messages.forEach(msg => {
      const words = msg.content.toLowerCase().split(/\s+/)
      words.forEach(word => {
        if (word.startsWith(lowerQuery) && word.length > lowerQuery.length) {
          suggestions.add(word)
        }
      })
    })

    return Array.from(suggestions).slice(0, limit)
  }
}

export const messageSearchService = new MessageSearchService()
