import { useState } from 'react'
import { X, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useApproveLogin } from '../hooks/useApproveLogin'
import { toast } from 'sonner'

interface Props {
  steamId: string
  onClose: () => void
}

export function QRApprovalDialog({ steamId, onClose }: Props) {
  const [challengeUrl, setChallengeUrl] = useState('')
  const mutation = useApproveLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!challengeUrl.trim()) return

    mutation.mutate(
      { steamId, challengeUrl: challengeUrl.trim() },
      {
        onSuccess: (result) => {
          if (result.success) {
            toast.success('Login approved')
            onClose()
          } else {
            toast.error('Approval failed')
          }
        },
        onError: (err) => {
          toast.error(`Error: ${err.message}`)
        }
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl p-5 w-80 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Approve QR Login</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-700">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Challenge URL</label>
            <input
              type="text"
              value={challengeUrl}
              onChange={(e) => setChallengeUrl(e.target.value)}
              placeholder="https://s.team/q/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!challengeUrl.trim() || mutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-sm font-medium transition-colors"
          >
            {mutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : mutation.isSuccess ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : mutation.isError ? (
              <XCircle size={16} className="text-red-400" />
            ) : null}
            {mutation.isPending ? 'Approving...' : 'Approve Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
