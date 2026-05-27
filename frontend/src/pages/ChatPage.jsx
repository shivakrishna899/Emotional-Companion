import {
  useState,
  useEffect,
  useRef
} from 'react'

import {
  motion,
  AnimatePresence
} from 'framer-motion'

import {
  FiMenu,
  FiPlus,
  FiX,
  FiLogOut,
  FiSettings
} from 'react-icons/fi'

import AmbientBackground
from '../components/AmbientBackground'

import { supabase }
from '../supabaseClient'

import logo
from '../assets/logo.png'

export default function ChatPage() {

  // ====================================
  // STATES
  // ====================================

  const [message, setMessage] =
    useState('')

  const [messages, setMessages] =
    useState([
      {
        sender: 'ai',
        text:
          "Hey... I'm really glad you're here."
      }
    ])

  const [savedChats, setSavedChats] =
    useState([])

  const [sidebarOpen, setSidebarOpen] =
    useState(true)

  const [user, setUser] =
    useState(null)

  const [isTyping, setIsTyping] =
    useState(false)

  // ====================================
  // AUTO SCROLL REF
  // ====================================

  const messagesEndRef =
    useRef(null)

  // ====================================
  // GET AUTH USER
  // ====================================

  useEffect(() => {

    async function getUser() {

      const {
        data: { user }
      } = await supabase.auth.getUser()

      setUser(user)
    }

    getUser()

  }, [])

  // ====================================
  // FETCH SAVED CHATS
  // ====================================

  useEffect(() => {

    if (!user?.id) return

    async function fetchChats() {

      try {

        const response =
          await fetch(

            `http://127.0.0.1:8000/saved-chats/${user.id}`
          )

        const data =
          await response.json()

        setSavedChats(data)

      } catch (error) {

        console.log(error)
      }
    }

    fetchChats()

  }, [user])

  // ====================================
  // AUTO SCROLL
  // ====================================

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: 'smooth'
      })

  }, [messages])

  // ====================================
  // LOGOUT
  // ====================================

  async function handleLogout() {

    await supabase.auth.signOut()

    window.location.href = '/login'
  }

  // ====================================
  // SEND MESSAGE
  // ====================================

  async function sendMessage() {

    if (!message.trim()) return

    const userMessage = {

      sender: 'user',

      text: message
    }

    setMessages((prev) => [

      ...prev,

      userMessage
    ])

    const currentMessage = message

    setMessage('')

    // ====================================
    // SAVE DETECTION
    // ====================================

    const savePatterns = [

      "save",
      "save this",
      "save this chat",
      "save this conversation",
      "remember this",
      "store this",
      "keep this conversation",
      "don't forget this",
      "dont forget this",
      "can you save this",
      "please save this",
      "save our chat",
      "keep this chat",
      "store our conversation"

    ]

    const lowerMessage =
      currentMessage.toLowerCase()

    const wantsToSave =
      savePatterns.some((pattern) =>
        lowerMessage.includes(pattern)
      )

    // ====================================
    // SAVE CHAT
    // ====================================

    if (wantsToSave) {

      try {

        await fetch(

          'http://127.0.0.1:8000/save-chat',

          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({

              user_id: user?.id,

              title:

                messages[0]?.text ||

                "Conversation",

              messages: [

                ...messages,

                userMessage
              ]
            })
          }
        )

        const aiMessage = {

          sender: 'ai',

          text:
            'Your conversation has been securely saved privately. 🔒'
        }

        setMessages((prev) => [

          ...prev,

          aiMessage
        ])

        // REFRESH SIDEBAR

        const response =
          await fetch(

            `http://127.0.0.1:8000/saved-chats/${user.id}`
          )

        const data =
          await response.json()

        setSavedChats(data)

      } catch (error) {

        console.log(error)
      }

      return
    }

    // ====================================
    // NORMAL CHAT
    // ====================================

    try {

      setIsTyping(true)

      const response = await fetch(

        'http://127.0.0.1:8000/chat',

        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({

            message: currentMessage,

            user_id: user?.id
          })
        }
      )

      let aiResponse = ''

      setMessages((prev) => [

        ...prev,

        {
          sender: 'ai',
          text: ''
        }
      ])

      const reader =
        response.body.getReader()

      const decoder =
        new TextDecoder()

      while (true) {

        const {
          done,
          value
        } = await reader.read()

        if (done) break

        const chunk =
          decoder.decode(value)

        aiResponse += chunk

        setMessages((prev) => {

          const updated = [...prev]

          updated[
            updated.length - 1
          ].text = aiResponse

          return updated
        })

        await new Promise(resolve =>
          setTimeout(resolve, 8)
        )
      }

      setIsTyping(false)

    } catch (error) {

      console.log(error)

      setIsTyping(false)
    }
  }

  // ====================================
  // NEW CHAT
  // ====================================

  function newConversation() {

    setMessages([
      {
        sender: 'ai',

        text:
          "New safe space created. What's on your mind?"
      }
    ])
  }

  // ====================================
  // UI
  // ====================================

  return (

    <div className="chat-page">

      <AmbientBackground />

      {/* SIDEBAR TOGGLE */}

      <button

        className="sidebar-toggle"

        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
      >

        {
          sidebarOpen
            ? <FiX />
            : <FiMenu />
        }

      </button>

      {/* SIDEBAR */}

      <AnimatePresence>

        {
          sidebarOpen && (

            <motion.div

              className="sidebar"

              initial={{
                x: -280,
                opacity: 0
              }}

              animate={{
                x: 0,
                opacity: 1
              }}

              exit={{
                x: -280,
                opacity: 0
              }}
            >

              <div>

                {/* BRAND */}

                <div className="brand-section">

                  <img

                    src={logo}

                    alt="Emotional Companion"

                    className="brand-logo"
                  />

                  <div>

                    <h1>
                      Emotional Companion
                    </h1>

                    <p>
                      A private space where
                      your thoughts stay yours.
                    </p>

                  </div>

                </div>

                {/* NEW CHAT */}

                <button

                  className="new-chat-btn"

                  onClick={newConversation}
                >

                  <FiPlus />

                  New Conversation

                </button>

                {/* SAVED CHATS */}

                <div className="saved-chats-section">

                  <h3>
                    Saved Conversations
                  </h3>

                  {
                    savedChats.length === 0 ? (

                      <p className="no-saved-chats">
                        No saved chats yet.
                      </p>

                    ) : (

                      savedChats.map((chat) => (

                        <button

                          key={chat.id}

                          className="saved-chat-item"

                          onClick={() => {

                            if (chat.messages) {

                              setMessages(chat.messages)
                            }
                          }}
                        >

                          {chat.title || "Conversation"}

                        </button>
                      ))
                    )
                  }

                </div>

              </div>

              {/* BOTTOM */}

              <div className="sidebar-bottom">

                <button
                  className="sidebar-action-btn"
                >

                  <FiSettings />

                  Settings

                </button>

                <button

                  className="sidebar-action-btn"

                  onClick={handleLogout}
                >

                  <FiLogOut />

                  Logout

                </button>

                <div className="privacy-note">

                  🔒 Conversations are not
                  stored unless you choose
                  to save them.

                </div>

              </div>

            </motion.div>
          )
        }

      </AnimatePresence>

      {/* CHAT AREA */}

      <div className="chat-container">

        {/* TOPBAR */}

        <div className="chat-topbar">

          <div className="chat-brand">

            <img

              src={logo}

              alt="Emotional Companion"

              className="chat-top-logo"
            />

            <span>
              Emotional Companion
            </span>

          </div>

        </div>

        {/* MESSAGES */}

        <div className="messages-container">

          {
            messages.map((msg, index) => (

              <motion.div

                key={index}

                className={

                  msg.sender === 'user'

                    ? 'message user-message'

                    : 'message ai-message'
                }

                initial={{
                  opacity: 0,
                  y: 10
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}
              >

                {msg.text}

              </motion.div>
            ))
          }

          <div ref={messagesEndRef} />

        </div>

        {/* TYPING */}

        {
          isTyping && (

            <div className="typing-indicator">

              Emotional Companion is typing...

            </div>
          )
        }

        {/* INPUT */}

        <div className="chat-input-container">

          <input

            type="text"

            placeholder="Talk about what’s on your mind..."

            value={message}

            onChange={(e) =>
              setMessage(e.target.value)
            }

            onKeyDown={(e) => {

              if (e.key === 'Enter') {

                sendMessage()
              }
            }}
          />

          <motion.button

            whileHover={{
              scale: 1.03
            }}

            whileTap={{
              scale: 0.97
            }}

            onClick={sendMessage}
          >

            Send

          </motion.button>

        </div>

      </div>

    </div>
  )
}