import { useState, useEffect } from 'react'

const SUGGESTED_QUESTIONS = [
  "What courses do I need to graduate with a B.S. in Entrepreneurship?",
  "What's the recommended course sequence by semester?",
  "What are the minor requirements for Entrepreneurship?",
  "What resources are available to entrepreneurship students?",
  "What are FGCU's graduation requirements?",
]

const SUBTITLES = [
  "What do I actually need to graduate?",
  "Am I taking the right courses this semester?",
  "Why won't anyone just give me a straight answer?",
]

interface HeroSectionProps {
  onSuggestedQuestion: (question: string) => void
}

export default function HeroSection({ onSuggestedQuestion }: HeroSectionProps) {
  const [subtitleIndex, setSubtitleIndex] = useState(0)
  const [subtitleVisible, setSubtitleVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleVisible(false)
      setTimeout(() => {
        setSubtitleIndex(prev => (prev + 1) % SUBTITLES.length)
        setSubtitleVisible(true)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 gap-8 animate-fade-in">
      {/* Main tagline */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-white">
          The advisor that actually answers.
        </h1>
        <div className="h-8 flex items-center justify-center">
          <p
            className="text-lg text-blue-300 font-medium transition-opacity duration-400"
            style={{ opacity: subtitleVisible ? 1 : 0, transition: 'opacity 0.4s ease-in-out' }}
          >
            "{SUBTITLES[subtitleIndex]}"
          </p>
        </div>
      </div>

      {/* Suggested question chips */}
      <div className="flex flex-col gap-3 w-full max-w-xl">
        <p className="text-center text-sm text-gray-400 font-medium uppercase tracking-wider">
          Quick Questions
        </p>
        {SUGGESTED_QUESTIONS.map((question, idx) => (
          <button
            key={idx}
            onClick={() => onSuggestedQuestion(question)}
            className="text-left px-4 py-3 rounded-xl text-sm text-gray-200 font-medium transition-all duration-200 hover:text-white group"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(0, 102, 204, 0.6)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0, 102, 204, 0.2)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(0, 102, 204, 0.1)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(255, 255, 255, 0.1)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <span className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>
              <span>{question}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
