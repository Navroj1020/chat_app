import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import ChatHeader from './ChatHeader'
import NoChatHistoryPlaceHolder from './NoChatHistoryPlaceHolder'
import MessageInput from './MessageInput'
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton'

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
  } = useChatStore()

  const { authUser } = useAuthStore()
  const messageRef = useRef(null)

  useEffect(() => {
    getMessagesByUserId(selectedUser._id)
  }, [selectedUser, getMessagesByUserId])
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" })
    }
  },[messages])


  return (
    <div className="flex flex-col h-full bg-linear -to-b from-base-200 to-base-300">

      {/* Sticky Header */}
      <div className="sticky  top-0 z-10 backdrop-blur bg-base-100/80 border-b border-base-300">
        <ChatHeader />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 scroll-smooth">
        {messages.length > 0 && !isMessagesLoading ? (

          <div className="max-w-4xl mx-auto space-y-3">

            {messages.map((msg) => {
              const isMe = msg.senderId === authUser._id

              return (
                <div
                  key={msg._id}
                  className={`chat ${isMe ? 'chat-end' : 'chat-start'} animate-fadeIn`}
                >
                  {/* Avatar */}
                  <div className="chat-image avatar">
                    <div className="w-9 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2">
                      <img
                        src={isMe ? authUser.profilePic : selectedUser.profilePic}
                        alt="avatar"
                      />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="chat-header text-sm font-medium">
                    <time className="text-xs opacity-50 ml-2">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>

                  {/* Bubble */}
                  <div
                    className={`
                      chat-bubble
                      shadow-md
                      hover:shadow-lg
                      transition
                      max-w-[65%]
                      px-4 py-2
                      ${isMe
                        ? 'bg-cyan-600 text-white'
                        : 'bg-base-100 text-base-content'
                      }
                    `}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="shared"
                        className="rounded-xl mb-2 h-48 w-full object-cover border border-base-300"
                      />
                    )}

                    {msg.text && (
                      <p className="leading-relaxed wrap-break-words">{msg.text}</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="chat-footer text-xs opacity-50">
                    {isMe ? 'Delivered' : 'Seen'}
                  </div>
                </div>
              )
            })}
            {/* scroll target */}
            <div ref={messageRef} />
          </div>
        ) : isMessagesLoading ? (
          <div className="max-w-3xl mx-auto">
            <MessagesLoadingSkeleton />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <NoChatHistoryPlaceHolder name={selectedUser.fullName} />
          </div>
        )}
      </div>

      {/* Sticky Input */}
      <div className="sticky bottom-0 bg-base-100 border-t border-base-300 backdrop-blur shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <MessageInput />
      </div>
    </div>
  )
}

export default ChatContainer
