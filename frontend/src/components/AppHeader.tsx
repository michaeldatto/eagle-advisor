import { ActivePanel } from '../App'

interface AppHeaderProps {
  activePanel: ActivePanel
  onPanelChange: (panel: ActivePanel) => void
}

export default function AppHeader({ activePanel, onPanelChange }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] relative z-20"
      style={{ background: 'rgba(8,13,26,0.9)', backdropFilter: 'blur(20px)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #003087, #0055a5)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#C9A84C" strokeWidth="1.5" fill="none"/>
            <path d="M12 7v10M7.5 9.5l4.5 2.5 4.5-2.5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold tracking-wide text-white">Eagle Advisor</div>
          <div className="text-[10px] text-white/40 tracking-widest uppercase">FGCU · Entrepreneurship</div>
        </div>
      </div>

      {/* Panel Toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={() => onPanelChange('planner')}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
            activePanel === 'planner'
              ? 'text-white shadow-sm'
              : 'text-white/40 hover:text-white/70'
          }`}
          style={activePanel === 'planner' ? { background: 'rgba(201,168,76,0.15)', color: '#E8CC7A', border: '1px solid rgba(201,168,76,0.2)' } : {}}
        >
          Course Planner
        </button>
        <button
          onClick={() => onPanelChange('chat')}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
            activePanel === 'chat'
              ? 'text-white shadow-sm'
              : 'text-white/40 hover:text-white/70'
          }`}
          style={activePanel === 'chat' ? { background: 'rgba(201,168,76,0.15)', color: '#E8CC7A', border: '1px solid rgba(201,168,76,0.2)' } : {}}
        >
          AI Advisor
        </button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-white/40">Advisor Online</span>
      </div>
    </header>
  )
}
