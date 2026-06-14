import { useState } from 'react'
import { Copy, Key, LockKeyhole, QrCode, RefreshCw, ShieldCheck, User } from 'lucide-react'
import { getRankLogoUrl } from '../api/rankLogos'
import { use2FACode } from '../hooks/use2FACode'
import { CodeDisplay } from './CodeDisplay'
import { CredentialsModal } from './CredentialsModal'
import { ConfirmationsDialog } from './ConfirmationsDialog'
import { EditAccountDialog } from './EditAccountDialog'
import { QRApprovalDialog } from './QRApprovalDialog'
import { toast } from 'sonner'

const DEFAULT_NAMEPLATE_URL =
  'https://rivalskins.com/wp-content/uploads/marvel-assets/items/nameplate/universal/img_rivals.webp'

function marvelErrorMessage(err: unknown): string {
  return `${String(err)} — make sure the Marvel Rivals profile is public, not hidden.`
}

interface Props {
  steamId: string
  username: string
  displayName: string | null
  uid: string | null
  gameUsername: string | null
  rank: string | null
  level: string | null
  characterName: string | null
  nameplateUrl: string | null
  rankedWins: number | null
  rankedLosses: number | null
  seasonWins: number | null
  lastMarvelSyncAt: number | null
  lastMarvelUpdateRequestedAt: number | null
  note: string | null
  hasAuthenticator: boolean
  onUpdated: () => void
}

export function AccountCard({
  steamId,
  username,
  displayName,
  uid,
  gameUsername,
  rank,
  level,
  characterName,
  nameplateUrl,
  rankedWins,
  rankedLosses,
  seasonWins,
  lastMarvelSyncAt,
  lastMarvelUpdateRequestedAt,
  note,
  hasAuthenticator,
  onUpdated
}: Props) {
  const [showCreds, setShowCreds] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showConfirmations, setShowConfirmations] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [requestingUpdate, setRequestingUpdate] = useState(false)
  const { data: code } = use2FACode(steamId, hasAuthenticator)
  const rankLogoUrl = getRankLogoUrl(rank)
  const effectiveNameplateUrl = nameplateUrl || DEFAULT_NAMEPLATE_URL
  const updateCooldownSeconds = lastMarvelUpdateRequestedAt
    ? Math.max(0, 30 * 60 - (Math.floor(Date.now() / 1000) - lastMarvelUpdateRequestedAt))
    : 0
  const updateLocked = updateCooldownSeconds > 0
  const hasRankedStats = rankedWins !== null && rankedLosses !== null
  const rankedTotal = (rankedWins ?? 0) + (rankedLosses ?? 0)
  const rankedWinRate =
    hasRankedStats && rankedTotal > 0
      ? Math.round(((rankedWins ?? 0) / rankedTotal) * 100)
      : null
  const hasStats = hasRankedStats || seasonWins !== null

  const handleCopyCode = () => {
    if (code) {
      window.api.copyToClipboard(code.code)
      toast.success('Code copied')
    }
  }

  const handleCopyUsername = () => {
    window.api.copyToClipboard(username)
    toast.success('Username copied')
  }

  const handleCopyPassword = async () => {
    try {
      const credentials = await window.api.getCredentials(steamId)
      window.api.copyToClipboard(credentials.password)
      toast.success('Password copied')
    } catch (err) {
      toast.error(String(err))
    }
  }

  const handleSyncMarvel = async () => {
    if (!uid) return
    setSyncing(true)
    try {
      await window.api.syncMarvelAccount(steamId)
      toast.success('Marvel data synced')
      onUpdated()
    } catch (err) {
      toast.error(marvelErrorMessage(err))
    } finally {
      setSyncing(false)
    }
  }

  const handleRequestMarvelUpdate = async () => {
    if (!uid || updateLocked) return
    setRequestingUpdate(true)
    try {
      await window.api.requestMarvelUpdate(steamId)
      toast.success('Marvel update queued')
      onUpdated()
    } catch (err) {
      toast.error(marvelErrorMessage(err))
    } finally {
      setRequestingUpdate(false)
    }
  }

  return (
    <>
      <div
        className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15,23,42,.72), rgba(15,23,42,.36)), url("${effectiveNameplateUrl}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="relative space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2">
              {rankLogoUrl ? (
                <img
                  src={rankLogoUrl}
                  alt=""
                  className="h-9 w-9 shrink-0 object-contain drop-shadow"
                  draggable={false}
                />
              ) : (
                <User size={18} className="mt-0.5 shrink-0 text-slate-300" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {displayName || username}
                </p>
                {displayName && (
                  <p className="truncate text-xs text-slate-300">{username}</p>
                )}
                {characterName && (
                  <p className="truncate text-xs text-blue-200">{characterName}</p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => setShowEdit(true)}
                className="px-2 py-1 rounded-lg bg-slate-950/30 text-xs text-slate-200 transition-colors hover:bg-slate-700"
                title="Edit account"
              >
                Edit
              </button>
              <button
                onClick={() => setShowCreds(true)}
                className="rounded-lg bg-slate-950/30 p-1.5 transition-colors hover:bg-slate-700"
                title="View credentials"
              >
                <Key size={16} className="text-slate-200" />
              </button>
              {hasAuthenticator && (
                <>
                  <button
                    onClick={() => setShowConfirmations(true)}
                    className="rounded-lg bg-slate-950/30 p-1.5 transition-colors hover:bg-slate-700"
                    title="View approvals"
                  >
                    <ShieldCheck size={16} className="text-slate-200" />
                  </button>
                  <button
                    onClick={() => setShowQR(true)}
                    className="rounded-lg bg-slate-950/30 p-1.5 transition-colors hover:bg-slate-700"
                    title="Approve QR login"
                  >
                    <QrCode size={16} className="text-slate-200" />
                  </button>
                </>
              )}
            </div>
          </div>

          {(gameUsername || uid || rank || level || note || hasStats) && (
            <div className="space-y-2 text-xs">
              {(gameUsername || uid || rank || level) && (
                <div className="flex flex-wrap gap-2">
                  {rank && (
                    <span className="rounded bg-blue-950/80 px-2 py-1 text-blue-100">
                      {rank}
                    </span>
                  )}
                  {level && (
                    <span className="rounded bg-slate-950/70 px-2 py-1 text-slate-100">
                      Lv {level}
                    </span>
                  )}
                  {gameUsername && (
                    <span className="rounded bg-slate-950/70 px-2 py-1 text-slate-200">
                      {gameUsername}
                    </span>
                  )}
                  {uid && (
                    <span className="rounded bg-slate-950/70 px-2 py-1 text-slate-300">
                      UID {uid}
                    </span>
                  )}
                </div>
              )}
              {hasStats && (
                <div className="flex flex-wrap gap-2">
                  {hasRankedStats && (
                    <span className="rounded bg-slate-950/70 px-2 py-1 text-slate-100">
                      Ranked {rankedWins}W / {rankedLosses}L
                      {rankedWinRate !== null && (
                        <span className="text-slate-400"> · {rankedWinRate}%</span>
                      )}
                    </span>
                  )}
                  {seasonWins !== null && (
                    <span className="rounded bg-emerald-950/70 px-2 py-1 text-emerald-100">
                      Season {seasonWins}W
                    </span>
                  )}
                </div>
              )}
              {note && (
                <p className="line-clamp-2 whitespace-pre-wrap text-slate-300">
                  {note}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyUsername}
              className="flex items-center gap-1.5 rounded-lg bg-slate-950/40 px-2.5 py-1.5 text-xs text-slate-100 transition-colors hover:bg-slate-700"
            >
              <Copy size={13} />
              Username
            </button>
            <button
              onClick={handleCopyPassword}
              className="flex items-center gap-1.5 rounded-lg bg-slate-950/40 px-2.5 py-1.5 text-xs text-slate-100 transition-colors hover:bg-slate-700"
            >
              <LockKeyhole size={13} />
              Password
            </button>
            {uid && (
              <>
                <button
                  onClick={handleSyncMarvel}
                  disabled={syncing}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-950/40 px-2.5 py-1.5 text-xs text-slate-100 transition-colors hover:bg-slate-700 disabled:text-slate-500"
                >
                  <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
                  Sync
                </button>
                <button
                  onClick={handleRequestMarvelUpdate}
                  disabled={requestingUpdate || updateLocked}
                  className="rounded-lg bg-slate-950/40 px-2.5 py-1.5 text-xs text-slate-100 transition-colors hover:bg-slate-700 disabled:text-slate-500"
                >
                  {updateLocked ? `${Math.ceil(updateCooldownSeconds / 60)}m` : 'Update'}
                </button>
              </>
            )}
          </div>

          {(lastMarvelSyncAt || lastMarvelUpdateRequestedAt) && (
            <p className="text-[11px] text-slate-400">
              {lastMarvelSyncAt && `Synced ${formatRelativeTime(lastMarvelSyncAt)}`}
              {lastMarvelSyncAt && lastMarvelUpdateRequestedAt ? ' · ' : ''}
              {lastMarvelUpdateRequestedAt &&
                `Update requested ${formatRelativeTime(lastMarvelUpdateRequestedAt)}`}
            </p>
          )}

          {hasAuthenticator && code && (
            <CodeDisplay
              code={code.code}
              validUntil={code.valid_until}
              onCopy={handleCopyCode}
            />
          )}
        </div>
      </div>

      {showCreds && (
        <CredentialsModal steamId={steamId} onClose={() => setShowCreds(false)} />
      )}
      {showEdit && (
        <EditAccountDialog
          steamId={steamId}
          displayName={displayName}
          uid={uid}
          gameUsername={gameUsername}
          rank={rank}
          level={level}
          characterName={characterName}
          nameplateUrl={nameplateUrl}
          note={note}
          onSaved={() => {
            setShowEdit(false)
            onUpdated()
          }}
          onClose={() => setShowEdit(false)}
        />
      )}
      {hasAuthenticator && showQR && (
        <QRApprovalDialog steamId={steamId} onClose={() => setShowQR(false)} />
      )}
      {hasAuthenticator && showConfirmations && (
        <ConfirmationsDialog
          steamId={steamId}
          onClose={() => setShowConfirmations(false)}
        />
      )}
    </>
  )
}

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.max(0, Math.floor(Date.now() / 1000) - timestamp)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
