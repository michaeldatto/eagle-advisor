export default function Header() {
  return (
    <div
      className="px-6 py-4 flex items-center justify-between flex-shrink-0"
      style={{
        background: 'rgba(10, 15, 30, 0.6)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🦅</span>
        <span
          className="text-xl font-bold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #00843D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          EAGLE ADVISOR
        </span>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center w-3 h-3">
          <div
            className="absolute w-3 h-3 rounded-full bg-green-400 opacity-40 animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <span className="text-green-400 text-sm font-medium">AI Advisor Online</span>
      </div>
    </div>
  )
}
