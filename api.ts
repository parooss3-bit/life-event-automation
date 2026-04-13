import { Message, Conversation } from './messaging'

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api'

// API Client
class APIClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Messages API
  async getConversations(userId: string): Promise<Conversation[]> {
    return this.request(`/conversations?userId=${userId}`)
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    return this.request(`/conversations/${conversationId}`)
  }

  async getMessages(conversationId: string, page = 0, limit = 50): Promise<Message[]> {
    return this.request(
      `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    )
  }

  async sendMessage(
    conversationId: string,
    content: string,
    senderId: string,
    attachments?: string[]
  ): Promise<Message> {
    return this.request(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        senderId,
        attachments,
      }),
    })
  }

  async markAsRead(conversationId: string, messageIds: string[]): Promise<void> {
    return this.request(`/conversations/${conversationId}/messages/read`, {
      method: 'PUT',
      body: JSON.stringify({ messageIds }),
    })
  }

  async deleteConversation(conversationId: string): Promise<void> {
    return this.request(`/conversations/${conversationId}`, {
      method: 'DELETE',
    })
  }

  async searchMessages(query: string, userId: string): Promise<Message[]> {
    return this.request(
      `/messages/search?q=${encodeURIComponent(query)}&userId=${userId}`
    )
  }

  // File Upload API
  async uploadFile(file: File): Promise<{ url: string; id: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseURL}/files/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('File upload failed')
    }

    return response.json()
  }

  // Notifications API
  async subscribeToNotifications(userId: string, endpoint: string): Promise<void> {
    return this.request('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify({ userId, endpoint }),
    })
  }

  async sendNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<void> {
    return this.request('/notifications/send', {
      method: 'POST',
      body: JSON.stringify({ userId, title, body, data }),
    })
  }
}

export const apiClient = new APIClient()

// WebSocket Client for real-time messaging
export class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private listeners: Map<string, Set<Function>> = new Map()

  constructor(url: string = process.env.VITE_WS_URL || 'ws://localhost:3001') {
    this.url = url
  }

  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${this.url}?userId=${userId}`)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data)
          this.emit(data.type, data.payload)
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.attemptReconnect(userId)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect(userId).catch(console.error)
      }, this.reconnectDelay)
    }
  }

  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off(event: string, callback: Function) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback)
    }
  }

  private emit(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => callback(data))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

export const wsClient = new WebSocketClient()
