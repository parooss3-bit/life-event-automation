import { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft, Search, Paperclip, X } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useMessaging } from '../lib/messaging'
import { fileSharingService, FileAttachment } from '../lib/fileSharing'
import { messageSearchService } from '../lib/messageSearch'
import { notificationService, emailTemplates } from '../lib/notifications'

export default function MessagesEnhanced() {
  const {
    conversations,
    messages,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
    markAsRead,
  } = useMessaging()

  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUserId] = useState('contractor-1')
  const [currentUserType] = useState<'contractor' | 'supplier'>('contractor')
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedConversation])

  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      await notificationService.init()
      const hasPermission = await notificationService.requestPermission()
      if (hasPermission) {
        await notificationService.subscribeToPushNotifications(currentUserId)
      }
    }
    initNotifications()
  }, [currentUserId])

  const filteredConversations = conversations.filter(c =>
    c.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contractorName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentConversation = selectedConversation
    ? conversations.find(c => c.id === selectedConversation)
    : null

  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : []

  // Search messages
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results = messageSearchService.searchLocal(currentMessages, query)
    setSearchResults(results)
  }

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    try {
      const fileArray = Array.from(files)
      const uploaded = await fileSharingService.uploadMultiple(fileArray)
      setAttachments(prev => [...prev, ...uploaded])
    } catch (error) {
      console.error('File upload failed:', error)
      alert('Failed to upload file')
    }
  }

  // Send message with attachments
  const handleSendMessage = async () => {
    if (!messageText.trim() && attachments.length === 0) return
    if (!selectedConversation) return

    sendMessage(
      selectedConversation,
      messageText || `Shared ${attachments.length} file(s)`,
      currentUserId,
      currentUserType === 'contractor' ? 'You' : 'Your Store',
      currentUserType
    )

    // Send notification
    if (currentConversation) {
      const template = emailTemplates.newMessage(
        currentUserType === 'contractor'
          ? currentConversation.supplierName
          : currentConversation.contractorName,
        messageText.substring(0, 50)
      )

      await notificationService.showNotification({
        title: template.subject,
        body: template.body,
        data: {
          conversationId: selectedConversation,
        },
      })
    }

    setMessageText('')
    setAttachments([])
  }

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    markAsRead(conversationId)
    setSearchResults([])
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 container py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className={`md:col-span-1 ${selectedConversation ? 'hidden md:block' : ''}`}>
          <div className="bg-gray-50 rounded-lg border border-gray-200 h-[calc(100vh-200px)] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg mb-4">Messages</h2>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map(conversation => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`w-full p-4 border-b border-gray-200 text-left hover:bg-gray-100 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-sm">
                        {currentUserType === 'contractor'
                          ? conversation.supplierName
                          : conversation.contractorName}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.lastMessage
                        ? new Date(conversation.lastMessage.timestamp).toLocaleDateString()
                        : ''}
                    </p>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-600">
                  <p>No conversations found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`md:col-span-2 ${!selectedConversation ? 'hidden md:block' : ''}`}>
          {currentConversation ? (
            <div className="bg-gray-50 rounded-lg border border-gray-200 h-[calc(100vh-200px)] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h3 className="font-semibold text-lg">
                    {currentUserType === 'contractor'
                      ? currentConversation.supplierName
                      : currentConversation.contractorName}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {currentUserType === 'contractor'
                      ? currentConversation.contractorName
                      : currentConversation.supplierName}
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search in conversation..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(searchResults.length > 0 ? searchResults : currentMessages).map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === currentUserId
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-white border border-gray-300 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1">{message.senderName}</p>
                      <p className="text-sm">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments?.map((url: string, idx: number) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs underline block"
                            >
                              📎 Attachment {idx + 1}
                            </a>
                          ))}
                        </div>
                      )}
                      <p
                        className={`text-xs mt-2 ${
                          message.senderId === currentUserId
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-200 bg-white">
                  <div className="flex flex-wrap gap-2">
                    {attachments.map(attachment => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm"
                      >
                        <span>{fileSharingService.getFileIcon(attachment.type)}</span>
                        <span className="truncate">{attachment.name}</span>
                        <span className="text-gray-500 text-xs">
                          {fileSharingService.formatFileSize(attachment.size)}
                        </span>
                        <button
                          onClick={() =>
                            setAttachments(prev => prev.filter(a => a.id !== attachment.id))
                          }
                          className="hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-outline"
                    title="Attach file"
                  >
                    <Paperclip size={20} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() && attachments.length === 0}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-2">Select a conversation to start messaging</p>
                <p className="text-gray-500 text-sm">Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
