import { useRef, KeyboardEvent } from 'react'

interface InputBarProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isStreaming: boolean
}

export default function InputBar({ value, onChange, onSend, isStreaming }: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isStreaming && value.trim()) {
        onSend()
      }
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    // Auto-resize
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }

  return (
    <div
      className="flex-shrink-0 px-4 pt-3 pb-4"
      style={{
        background: 'rgba(10, 15, 30, 0.6)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="flex gap-3 items-end">
        {/* Textarea */}
        <div
          className="flex-1 relative"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocusCapture={e => {
            const div = e.currentTarget as HTMLDivElement
            div.style.borderColor = 'rgba(0, 102, 204, 0.6)'
            div.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.15)'
          }}
          onBlurCapture={e => {
            const div = e.currentTarget as HTMLDivElement
            div.style.borderColor = 'rgba(255, 255, 255, 0.12)'
            div.style.boxShadow = 'none'
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your FGCU degree..."
            rows={1}
            disabled={isStreaming}
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm resize-none outline-none px-4 py-3"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              maxHeight: '120px',
              minHeight: '44px',
            }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={isStreaming || !value.trim()}
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isStreaming ? 'rgba(0, 102, 204, 0.4)' : 'linear-gradient(135deg, #0066CC, #00843D)',
            boxShadow: isStreaming ? 'none' : '0 0 20px rgba(0, 102, 204, 0.3)',
          }}
          onMouseEnter={e => {
            if (!isStreaming) {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(0, 102, 204, 0.5)'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0, 102, 204, 0.3)'
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
          }}
        >
          {isStreaming ? (
            <div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      {/* Hint text */}
      <p className="text-xs text-gray-600 mt-2 text-center">
        Enter to send · Shift+Enter for new line
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
