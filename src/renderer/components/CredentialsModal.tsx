import { useState } from 'react'
import { Copy, Check, Eye, EyeOff, X } from 'lucide-react'
import { useCredentials } from '../hooks/useCredentials'
import { toast } from 'sonner'

interface Props {
  steamId: string
  onClose: () => void
}

export function CredentialsModal({ steamId, onClose }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const { data, isLoading } = useCredentials(steamId, true)

  const copyField = (value: string, label: string) => {
    window.api.copyToClipboard(value)
    toast.success(`${label} copied`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl p-5 w-80 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Credentials</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-700">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : data ? (
          <div className="space-y-3">
            <CredField label="Username" value={data.username} onCopy={copyField} />
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Password</label>
              <div className="flex items-center gap-2">
                <span className="flex-1 font-mono text-sm text-white bg-slate-900 rounded px-2 py-1.5 truncate">
                  {showPassword ? data.password : '\u2022'.repeat(12)}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded hover:bg-slate-700"
                >
                  {showPassword ? <EyeOff size={14} className="text-slate-400" /> : <Eye size={14} className="text-slate-400" />}
                </button>
                <CopyButton onClick={() => copyField(data.password, 'Password')} />
              </div>
            </div>
            <CredField label="Guard Code" value={data.guard_code} onCopy={copyField} />
          </div>
        ) : (
          <p className="text-sm text-red-400">Failed to load</p>
        )}
      </div>
    </div>
  )
}

function CredField({ label, value, onCopy }: { label: string; value: string; onCopy: (v: string, l: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-slate-500">{label}</label>
      <div className="flex items-center gap-2">
        <span className="flex-1 font-mono text-sm text-white bg-slate-900 rounded px-2 py-1.5 truncate">
          {value}
        </span>
        <CopyButton onClick={() => onCopy(value, label)} />
      </div>
    </div>
  )
}

function CopyButton({ onClick }: { onClick: () => void }) {
  const [copied, setCopied] = useState(false)

  const handle = () => {
    onClick()
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button onClick={handle} className="p-1.5 rounded hover:bg-slate-700">
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-slate-400" />}
    </button>
  )
}
