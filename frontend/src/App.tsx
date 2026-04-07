import { useState, useRef, useEffect } from 'react'
import StudentProfile from './components/StudentProfile'
import CoursePlanner from './components/CoursePlanner'
import ChatPanel from './components/ChatPanel'
import AppHeader from './components/AppHeader'

export interface StudentProfile {
  gradeLevel: 'freshman' | 'sophomore' | 'junior' | 'senior'
  completedCourses: string[]
  preferences: {
    preferMorning: boolean
    preferSmallClass: boolean
    preferOnline: boolean
    interestedInMinor: boolean
    internshipFocus: boolean
  }
  financialAid: {
    hasAid: boolean
    aidType: 'none' | 'scholarship' | 'pell' | 'loan' | 'work-study' | 'multiple'
    creditLoad: 'full' | 'part'
  }
  gpa: string
  targetGradSemester: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export type ActivePanel = 'planner' | 'chat'

function App() {
  const [profile, setProfile] = useState<StudentProfile>({
    gradeLevel: 'freshman',
    completedCourses: [],
    preferences: {
      preferMorning: false,
      preferSmallClass: false,
      preferOnline: false,
      interestedInMinor: false,
      internshipFocus: false,
    },
    financialAid: {
      hasAid: false,
      aidType: 'none',
      creditLoad: 'full',
    },
    gpa: '',
    targetGradSemester: '',
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [activePanel, setActivePanel] = useState<ActivePanel>('planner')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const buildSystemContext = () => {
    const completed = profile.completedCourses.length > 0
      ? `Completed courses: ${profile.completedCourses.join(', ')}.`
      : 'No courses completed yet.'
    const prefs = []
    if (profile.preferences.preferMorning) prefs.push('prefers morning classes')
    if (profile.preferences.preferSmallClass) prefs.push('prefers small classes')
    if (profile.preferences.preferOnline) prefs.push('open to online')
    if (profile.preferences.interestedInMinor) prefs.push('interested in a minor')
    if (profile.preferences.internshipFocus) prefs.push('internship/co-op focused')
    const aid = profile.financialAid.hasAid
      ? `Financial aid: ${profile.financialAid.aidType}, ${profile.financialAid.creditLoad}-time enrollment.`
      : 'No financial aid.'
    return `Student context: ${profile.gradeLevel}, GPA: ${profile.gpa || 'unknown'}. ${completed} Preferences: ${prefs.join(', ') || 'none specified'}. ${aid} Target graduation: ${profile.targetGradSemester || 'undecided'}.`
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return
    const userMessage: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsStreaming(true)
    setIsTyping(true)
    const assistantMessage: Message = { role: 'assistant', content: '', isStreaming: true }
    setMessages(prev => [...prev, assistantMessage])
    try {
      const systemContext = buildSystemContext()
      const contextMessage: Message = {
        role: 'user',
        content: `[Student Profile] ${systemContext}`
      }
      const apiMessages = messages.length === 0
        ? [contextMessage, userMessage]
        : newMessages
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages.map(m => ({ role: m.role, content: m.content })) })
      })
      if (!response.ok) throw new Error('Failed to fetch response')
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
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              if (parsed.type === 'text') {
                if (firstToken) { setIsTyping(false); firstToken = false }
                fullText += parsed.text
                setMessages(prev => {
                  const updated = [...prev]
                  updated[updated.length - 1] = { role: 'assistant', content: fullText, isStreaming: true }
                  return updated
                })
              }
            } catch (e) {}
          }
        }
      }
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: fullText, isStreaming: false }
        return updated
      })
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: 'Connection error. Please try again.', isStreaming: false }
        return updated
      })
    } finally {
      setIsStreaming(false)
      setIsTyping(false)
    }
  }

  const handleAskAdvisor = (question: string) => {
    setActivePanel('chat')
    setTimeout(() => sendMessage(question), 100)
  }

  return (
    <div className="flex flex-col h-screen bg-[#080D1A] text-white overflow-hidden">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #1a3a7a 0%, transparent 70%)', top: '-200px', left: '-200px' }} />
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)', bottom: '-100px', right: '-100px' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #004d1f 0%, transparent 70%)', top: '40%', left: '35%' }} />
      </div>

      {/* Header */}
      <AppHeader activePanel={activePanel} onPanelChange={setActivePanel} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left: Student Profile */}
        <div className="w-72 flex-shrink-0 border-r border-white/[0.06] overflow-y-auto">
          <StudentProfile profile={profile} onProfileChange={setProfile} />
        </div>

        {/* Center/Right: Planner or Chat */}
        <div className="flex-1 overflow-hidden">
          {activePanel === 'planner' ? (
            <CoursePlanner profile={profile} onAskAdvisor={handleAskAdvisor} />
          ) : (
            <ChatPanel
              messages={messages}
              input={input}
              isStreaming={isStreaming}
              isTyping={isTyping}
              onInputChange={setInput}
              onSend={() => sendMessage(input)}
              messagesEndRef={messagesEndRef}
              profile={profile}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
