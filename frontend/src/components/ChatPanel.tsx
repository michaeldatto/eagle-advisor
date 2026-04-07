import { RefObject } from 'react'
import { Message, StudentProfile } from '../App'
interface Props { messages: Message[]; input: string; isStreaming: boolean; isTyping: boolean; onInputChange: (v: string) => void; onSend: () => void; messagesEndRef: RefObject<HTMLDivElement>; profile: StudentProfile }
function fmt(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/`(.*?)`/g,'<code>$1</code>').replace(/^- (.*$)/gm,'<li class="ml-4">$1</li>').replace(/(<li.*<\/li>)/gs,'<ul class="space-y-1">$1</ul>').replace(/\n\n/g,'</p><p class="mt-2">').replace(/\n/g,'<br/>')
}
const QQ = ['What courses should I take next semester?','What are the graduation requirements?','How does financial aid affect my credit load?','What ENT electives do you recommend?','What entrepreneur resources does FGCU offer?']
export default function ChatPanel({ messages, input, isStreaming, isTyping, onInputChange, onSend, messagesEndRef, profile }: Props) {
  const isEmpty = messages.length === 0
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center gap-8 animate-fade-up">
            <div className="text-center max-w-md">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.18)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#C9A84C" strokeWidth="1.5" fill="none"/><path d="M12 7v10M7.5 9.5l4.5 2.5 4.5-2.5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Eagle Advisor</h2>
              <p className="text-sm text-white/40 leading-relaxed">Your AI advisor for FGCU Entrepreneurship. Ask about courses, requirements, and planning.</p>
              {profile.completedCourses.length > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.14)', color: '#C9A84C' }}>
                  <span className="capitalize">{profile.gradeLevel}</span>
                  {profile.gpa && <span>· GPA {profile.gpa}</span>}
                  <span>· {profile.completedCourses.length} courses done</span>
                </div>
              )}
            </div>
            <div className="w-full max-w-lg space-y-2">
              <div className="text-[10px] text-white/25 text-center uppercase tracking-widest mb-3">Quick Questions</div>
              {QQ.map((q, i) => (
                <button key={i} onClick={() => onInputChange(q)} className="w-full text-left px-4 py-3 rounded-xl text-sm text-white/55 hover:text-white/80 transition-all group" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-[#C9A84C]/50 mr-2 group-hover:text-[#C9A84C] transition-colors">→</span>{q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center mr-2 mt-1 flex-shrink-0" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.18)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#C9A84C" strokeWidth="1.5" fill="none"/></svg>
                  </div>
                )}
                <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role==='user'?'rounded-br-sm text-white':'rounded-bl-sm'}`}
                  style={msg.role==='user'?{background:'linear-gradient(135deg,#162d6a,#0e4d96)'}:{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.87)'}}>
                  {msg.role==='assistant'&&msg.content?<div className="message-content" dangerouslySetInnerHTML={{ __html: fmt(msg.content) }} />:msg.content}
                  {msg.isStreaming&&msg.content&&<span className="inline-block w-1.5 h-4 ml-0.5 rounded-sm bg-[#C9A84C] animate-cursor align-middle" style={{ verticalAlign:'text-bottom' }} />}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-up">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center mr-2 mt-1 flex-shrink-0" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.18)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#C9A84C" strokeWidth="1.5" fill="none"/></svg>
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex gap-1.5 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] typing-dot" /><div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] typing-dot" /><div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <div className="px-6 py-4 border-t border-white/[0.05]">
        <div className="flex items-end gap-3 rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <textarea value={input} onChange={e => onInputChange(e.target.value)} onKeyDown={e => { if (e.key==='Enter'&&!e.shiftKey){e.preventDefault();onSend()} }} placeholder="Ask about your FGCU degree..." rows={1} className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/25 outline-none resize-none leading-relaxed" style={{ maxHeight:'120px',overflowY:'auto' }} disabled={isStreaming} />
          <button onClick={onSend} disabled={!input.trim()||isStreaming} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200" style={input.trim()&&!isStreaming?{background:'linear-gradient(135deg,#C9A84C,#E8CC7A)',boxShadow:'0 0 14px rgba(201,168,76,0.25)'}:{background:'rgba(255,255,255,0.07)'}}>
            {isStreaming?<div className="w-3 h-3 rounded-sm bg-white/40" />:<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12L7 2l5 10" stroke={input.trim()?'#000':'rgba(255,255,255,0.3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.5 7.5h5" stroke={input.trim()?'#000':'rgba(255,255,255,0.3)'} strokeWidth="1.5" strokeLinecap="round"/></svg>}
          </button>
        </div>
        <div className="text-[10px] text-white/20 text-center mt-2">Enter to send · Shift+Enter for new line</div>
      </div>
    </div>
  )
}
