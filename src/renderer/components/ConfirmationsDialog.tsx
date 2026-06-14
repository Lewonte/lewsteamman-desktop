import { Check, Loader2, RefreshCw, ShieldCheck, X } from 'lucide-react'
import {
  useApproveConfirmation,
  useConfirmations,
  useDenyConfirmation
} from '../hooks/useConfirmations'
import { toast } from 'sonner'

interface Props {
  steamId: string
  onClose: () => void
}

export function ConfirmationsDialog({ steamId, onClose }: Props) {
  const { data, isLoading, isFetching, error, refetch } = useConfirmations(steamId, true)
  const approveMutation = useApproveConfirmation(steamId)
  const denyMutation = useDenyConfirmation(steamId)
  const acting = approveMutation.isPending || denyMutation.isPending

  const handleApprove = async (confId: string, nonce: string) => {
    try {
      const result = await approveMutation.mutateAsync({ confId, nonce })
      result.success ? toast.success('Approval confirmed') : toast.error('Approval failed')
    } catch (err) {
      toast.error(String(err))
    }
  }

  const handleDeny = async (confId: string, nonce: string) => {
    try {
      const result = await denyMutation.mutateAsync({ confId, nonce })
      result.success ? toast.success('Approval denied') : toast.error('Deny failed')
    } catch (err) {
      toast.error(String(err))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="flex max-h-[82vh] w-[min(92vw,560px)] flex-col rounded-xl border border-slate-700 bg-slate-800 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <ShieldCheck size={18} className="shrink-0 text-blue-300" />
            <h2 className="truncate text-sm font-semibold text-white">Approvals</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded p-1.5 hover:bg-slate-700 disabled:text-slate-500"
              title="Refresh approvals"
            >
              <RefreshCw
                size={16}
                className={isFetching ? 'animate-spin text-slate-500' : 'text-slate-300'}
              />
            </button>
            <button onClick={onClose} className="rounded p-1.5 hover:bg-slate-700">
              <X size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 size={22} className="animate-spin text-blue-400" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
            {String(error)}
          </div>
        ) : data?.length ? (
          <div className="min-h-0 space-y-2 overflow-y-auto pr-1">
            {data.map((confirmation) => (
              <div
                key={`${confirmation.conf_id}-${confirmation.nonce}`}
                className="rounded-lg border border-slate-700 bg-slate-900/70 p-3"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {formatConfirmationType(confirmation.conf_type)}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-xs text-slate-300">
                      {confirmation.description || 'No description'}
                    </p>
                    {confirmation.creator_id && (
                      <p className="mt-1 truncate text-[11px] text-slate-500">
                        Creator {confirmation.creator_id}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 rounded bg-slate-800 px-2 py-1 text-[11px] uppercase text-slate-400">
                    {confirmation.conf_type}
                  </span>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleDeny(confirmation.conf_id, confirmation.nonce)}
                    disabled={acting}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 transition-colors hover:bg-slate-700 disabled:text-slate-500"
                  >
                    <X size={13} />
                    Deny
                  </button>
                  <button
                    onClick={() => handleApprove(confirmation.conf_id, confirmation.nonce)}
                    disabled={acting}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500"
                  >
                    <Check size={13} />
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/50 text-sm text-slate-400">
            No pending approvals
          </div>
        )}
      </div>
    </div>
  )
}

function formatConfirmationType(type: string): string {
  if (type === 'trade') return 'Trade confirmation'
  if (type === 'market') return 'Market confirmation'
  return 'Confirmation'
}
