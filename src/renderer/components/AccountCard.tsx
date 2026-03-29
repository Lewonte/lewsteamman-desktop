import { useState } from 'react'
import { Key, QrCode, User } from 'lucide-react'
import { use2FACode } from '../hooks/use2FACode'
import { CodeDisplay } from './CodeDisplay'
import { CredentialsModal } from './CredentialsModal'
import { QRApprovalDialog } from './QRApprovalDialog'
import { toast } from 'sonner'

interface Props {
  steamId: string
  username: string
  displayName: string | null
}

export function AccountCard({ steamId, username, displayName }: Props) {
  const [showCreds, setShowCreds] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const { data: code } = use2FACode(steamId)

  const handleCopyCode = () => {
    if (code) {
      window.api.copyToClipboard(code.code)
      toast.success('Code copied')
    }
  }

  return (
    <>
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <User size={18} className="text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {displayName || username}
              </p>
              {displayName && (
                <p className="text-xs text-slate-500 truncate">{username}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowCreds(true)}
              className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
              title="View credentials"
            >
              <Key size={16} className="text-slate-400" />
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
              title="Approve QR login"
            >
              <QrCode size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {code && (
          <CodeDisplay
            code={code.code}
            validUntil={code.valid_until}
            onCopy={handleCopyCode}
          />
        )}
      </div>

      {showCreds && (
        <CredentialsModal steamId={steamId} onClose={() => setShowCreds(false)} />
      )}
      {showQR && (
        <QRApprovalDialog steamId={steamId} onClose={() => setShowQR(false)} />
      )}
    </>
  )
}
