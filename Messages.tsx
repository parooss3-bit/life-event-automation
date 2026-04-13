import { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft, Search } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useMessaging } from '../lib/messaging'

export default function Messages() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedConversation])

  const filteredConversations = conversations.filter(c =>
    c.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contractorName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentConversation = selectedConversation
    ? conversations.find(c => c.id === selectedConversation)
    : null

  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : []

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return

    sendMessage(
      selectedConversation,
      messageText,
      currentUserId,
      currentUserType === 'contractor' ? 'You' : 'Your Store',
      currentUserType
    )
    setMessageText('')
  }

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    markAsRead(conversationId)
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
                <div></div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map(message => (
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
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
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
