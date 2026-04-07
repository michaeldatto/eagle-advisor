import { useState, useRef, useEffect } from 'react'
import ChatMessage from './components/ChatMessage'
import HeroSection from './components/HeroSection'
import Header from './components/Header'
import InputBar from './components/InputBar'
import ApiKeyBanner from './components/ApiKeyBanner'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if API key is configured
    fetch('/api/health')
      .then(r => r.json())
      .then(data => {
        if (!data.apiKeyConfigured) {
          setApiKeyMissing(true)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return

    const userMessage: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setChatStarted(true)
    setIsStreaming(true)
    setIsTyping(true)

    const assistantMessage: Message = { role: 'assistant', content: '', isStreaming: true }
    setMessages(prev => [...prev, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let firstToken = true

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              break
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.type === 'text') {
                if (firstToken) {
                  setIsTyping(false)
                  firstToken = false
                }
                fullText += parsed.text
                setMessages(prev => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: fullText,
                    isStreaming: true
                  }
                  return updated
                })
              } else if (parsed.type === 'error') {
                fullText = 'Sorry, I encountered an error. Please try again.'
                setMessages(prev => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: fullText,
                    isStreaming: false
                  }
                  return updated
                })
              }
            } catch (e) {
              // ignore parse errors
            }
          }
        }
      }

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: fullText,
          isStreaming: false
        }
        return updated
      })
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error connecting to the server. Please try again.',
          isStreaming: false
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
      setIsTyping(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050A14]">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 animate-blob"
          style={{
            background: 'radial-gradient(circle, #003087 0%, transparent 70%)',
            top: '-100px',
            left: '-100px',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 animate-blob-delay-2"
          style={{
            background: 'radial-gradient(circle, #0066CC 0%, transparent 70%)',
            top: '30%',
            right: '-50px',
          }}
        />
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-10 animate-blob-delay-4"
          style={{
            background: 'radial-gradient(circle, #00843D 0%, transparent 70%)',
            bottom: '-200px',
            left: '20%',
          }}
        />
      </div>

      {/* Main container */}
      <div className="relative z-10 flex items-center justify-center h-full p-4">
        <div
          className="w-full max-w-3xl h-full flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10, 15, 30, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 60px rgba(0, 48, 135, 0.3)',
          }}
        >
          {/* API Key Banner */}
          {apiKeyMissing && <ApiKeyBanner />}

          {/* Header */}
          <Header />

          {/* Main content area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-4">
            {/* Hero section - shown only before first message */}
            {!chatStarted && (
              <HeroSection onSuggestedQuestion={handleSuggestedQuestion} />
            )}

            {/* Chat messages */}
            {chatStarted && (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <ChatMessage
                    key={idx}
                    message={msg}
                    isLast={idx === messages.length - 1}
                    isTyping={isTyping && idx === messages.length - 1 && msg.role === 'assistant'}
                  />
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 px-4 py-3 w-fit">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-400 typing-dot" />
                      <div className="w-2 h-2 rounded-full bg-green-400 typing-dot" />
                      <div className="w-2 h-2 rounded-full bg-green-400 typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input bar */}
          <InputBar
            value={input}
            onChange={setInput}
            onSend={() => sendMessage(input)}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  )
}

export default App
