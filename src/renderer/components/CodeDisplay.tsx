import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface Props {
  code: string
  validUntil: number
  onCopy: () => void
}

export function CodeDisplay({ code, validUntil, onCopy }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, Math.ceil(validUntil - Date.now() / 1000))
      setSecondsLeft(remaining)
    }
    update()
    const interval = setInterval(update, 200)
    return () => clearInterval(interval)
  }, [validUntil])

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const progress = Math.min(secondsLeft / 30, 1)

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
          <circle
            cx="16" cy="16" r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-700"
          />
          <circle
            cx="16" cy="16" r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${progress * 88} 88`}
            className={secondsLeft <= 5 ? 'text-red-400' : 'text-blue-400'}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[10px] font-mono text-slate-400">
          {secondsLeft}
        </span>
      </div>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group"
      >
        <span className="font-mono text-xl tracking-[0.3em] text-white font-bold">
          {code}
        </span>
        {copied ? (
          <Check size={16} className="text-green-400" />
        ) : (
          <Copy size={16} className="text-slate-500 group-hover:text-slate-300" />
        )}
      </button>
    </div>
  )
}
