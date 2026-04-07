import { Message } from '../App'

interface ChatMessageProps {
  message: Message
  isLast: boolean
  isTyping: boolean
}

function formatContent(text: string): string {
  // Convert markdown-like formatting to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^### (.*$)/gm, '<h3 class="text-white font-bold text-base mt-3 mb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-white font-bold text-lg mt-3 mb-1">$2</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-white font-bold text-xl mt-3 mb-1">$1</h1>')
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/(<li.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>')
}

export default function ChatMessage({ message, isLast, isTyping }: ChatMessageProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div
          className="max-w-[80%] px-4 py-3 rounded-2xl text-white text-sm leading-relaxed"
          style={{
            background: '#0066CC',
            borderBottomRightRadius: '4px',
          }}
        >
          {message.content}
        </div>
      </div>
    )
  }

  // Skip empty AI messages that are being typed
  if (!message.content && isTyping) {
    return null
  }

  return (
    <div className="flex justify-start animate-fade-in">
      <div
        className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderLeft: '3px solid #00843D',
          backdropFilter: 'blur(10px)',
          color: 'rgba(255, 255, 255, 0.88)',
        }}
      >
        {message.content ? (
          <div
            className="message-content"
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
        ) : null}
        {message.isStreaming && message.content && (
          <span
            className="inline-block w-2 h-4 ml-0.5 bg-green-400 animate-cursor align-middle"
            style={{ verticalAlign: 'text-bottom' }}
          />
        )}
      </div>
    </div>
  )
}
