import { useState, useCallback } from 'react'

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderType: 'contractor' | 'supplier'
  recipientId: string
  content: string
  timestamp: Date
  read: boolean
  attachments?: string[]
}

export interface Conversation {
  id: string
  contractorId: string
  contractorName: string
  supplierId: string
  supplierName: string
  lastMessage: Message | null
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

// Mock data for conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    contractorId: 'contractor-1',
    contractorName: 'John Smith',
    supplierId: 'supplier-1',
    supplierName: 'Premium Flooring Co.',
    lastMessage: {
      id: 'msg-1',
      senderId: 'contractor-1',
      senderName: 'John Smith',
      senderType: 'contractor',
      recipientId: 'supplier-1',
      content: 'Do you have Brazilian cherry hardwood in stock?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'conv-2',
    contractorId: 'contractor-2',
    contractorName: 'Sarah Johnson',
    supplierId: 'supplier-2',
    supplierName: 'Budget Flooring Warehouse',
    lastMessage: {
      id: 'msg-2',
      senderId: 'supplier-2',
      senderName: 'Budget Flooring Warehouse',
      senderType: 'supplier',
      recipientId: 'contractor-2',
      content: 'We can offer a 15% bulk discount for orders over 1000 sq ft',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    unreadCount: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'conv-3',
    contractorId: 'contractor-1',
    contractorName: 'John Smith',
    supplierId: 'supplier-3',
    supplierName: 'Tile & Stone Specialists',
    lastMessage: {
      id: 'msg-3',
      senderId: 'supplier-3',
      senderName: 'Tile & Stone Specialists',
      senderType: 'supplier',
      recipientId: 'contractor-1',
      content: 'Installation service available. Free consultation this week!',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
    unreadCount: 1,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
  },
]

// Mock messages for a conversation
export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1-1',
      senderId: 'contractor-1',
      senderName: 'John Smith',
      senderType: 'contractor',
      recipientId: 'supplier-1',
      content: 'Hi, I\'m looking for Brazilian cherry hardwood for a residential project.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 'msg-1-2',
      senderId: 'supplier-1',
      senderName: 'Premium Flooring Co.',
      senderType: 'supplier',
      recipientId: 'contractor-1',
      content: 'Great! We have premium Brazilian cherry in stock. What\'s your project size?',
      timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 'msg-1-3',
      senderId: 'contractor-1',
      senderName: 'John Smith',
      senderType: 'contractor',
      recipientId: 'supplier-1',
      content: 'About 2000 square feet. Do you have any bulk discounts?',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 'msg-1-4',
      senderId: 'supplier-1',
      senderName: 'Premium Flooring Co.',
      senderType: 'supplier',
      recipientId: 'contractor-1',
      content: 'Yes! For 2000 sq ft we can offer 10% off. Let me send you a quote.',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 'msg-1-5',
      senderId: 'contractor-1',
      senderName: 'John Smith',
      senderType: 'contractor',
      recipientId: 'supplier-1',
      content: 'Do you have Brazilian cherry hardwood in stock?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      senderId: 'contractor-2',
      senderName: 'Sarah Johnson',
      senderType: 'contractor',
      recipientId: 'supplier-2',
      content: 'Hi, I need vinyl flooring for a commercial project.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 'msg-2-2',
      senderId: 'supplier-2',
      senderName: 'Budget Flooring Warehouse',
      senderType: 'supplier',
      recipientId: 'contractor-2',
      content: 'We can offer a 15% bulk discount for orders over 1000 sq ft',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      senderId: 'contractor-1',
      senderName: 'John Smith',
      senderType: 'contractor',
      recipientId: 'supplier-3',
      content: 'Do you offer installation services?',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: 'msg-3-2',
      senderId: 'supplier-3',
      senderName: 'Tile & Stone Specialists',
      senderType: 'supplier',
      recipientId: 'contractor-1',
      content: 'Installation service available. Free consultation this week!',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
  ],
}

// Hook for managing messages
export function useMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  const sendMessage = useCallback((conversationId: string, content: string, senderId: string, senderName: string, senderType: 'contractor' | 'supplier') => {
    const conversation = conversations.find(c => c.id === conversationId)
    if (!conversation) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      senderType,
      recipientId: senderType === 'contractor' ? conversation.supplierId : conversation.contractorId,
      content,
      timestamp: new Date(),
      read: false,
    }

    // Add message to conversation
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }))

    // Update conversation
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: newMessage,
              updatedAt: new Date(),
            }
          : c
      )
    )
  }, [conversations])

  const markAsRead = useCallback((conversationId: string) => {
    setMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(m => ({
        ...m,
        read: true,
      })),
    }))

    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, unreadCount: 0 }
          : c
      )
    )
  }, [])

  const getTotalUnread = useCallback(() => {
    return conversations.reduce((sum, c) => sum + c.unreadCount, 0)
  }, [conversations])

  return {
    conversations,
    messages,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
    markAsRead,
    getTotalUnread,
  }
}
