export default function ApiKeyBanner() {
  return (
    <div
      className="px-4 py-3 flex items-center gap-3 flex-shrink-0"
      style={{
        background: 'rgba(220, 38, 38, 0.2)',
        borderBottom: '1px solid rgba(220, 38, 38, 0.4)',
      }}
    >
      <span className="text-red-400">⚠️</span>
      <p className="text-red-300 text-sm font-medium">
        API key not configured. Add <code className="bg-red-900/30 px-1 rounded">ANTHROPIC_API_KEY</code> to your environment variables.
      </p>
    </div>
  )
}
