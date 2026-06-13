import { useAccounts } from '../hooks/useAccounts'
import { AccountCard } from './AccountCard'
import { AddAccountDialog } from './AddAccountDialog'
import { Loader2, AlertCircle, Plus } from 'lucide-react'
import { useState } from 'react'

export function AccountList() {
  const [showAdd, setShowAdd] = useState(false)
  const { data: accounts, isLoading, error, refetch } = useAccounts()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="text-blue-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-400">
        <AlertCircle size={32} />
        <p className="text-sm">Failed to load accounts</p>
        <p className="text-xs text-slate-500">{String(error)}</p>
      </div>
    )
  }

  if (!accounts?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <p className="text-sm">No accounts found</p>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white transition-colors"
        >
          <Plus size={16} />
          Add Account
        </button>
        {showAdd && (
          <AddAccountDialog
            onAdded={() => {
              setShowAdd(false)
              refetch()
            }}
            onClose={() => setShowAdd(false)}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <div className="p-4 pb-0 flex justify-end">
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white transition-colors"
        >
          <Plus size={16} />
          Add Account
        </button>
      </div>
      <div className="space-y-3 p-4 overflow-y-auto max-h-[calc(100vh-168px)]">
        {accounts.map((account) => (
          <AccountCard
            key={account.steam_id}
            steamId={account.steam_id}
            username={account.username}
            displayName={account.display_name}
            uid={account.uid}
            gameUsername={account.game_username}
            rank={account.rank}
            level={account.level}
            characterName={account.character_name}
            nameplateUrl={account.nameplate_url}
            lastMarvelSyncAt={account.last_marvel_sync_at}
            lastMarvelUpdateRequestedAt={account.last_marvel_update_requested_at}
            note={account.note}
            hasAuthenticator={account.has_authenticator}
            onUpdated={() => refetch()}
          />
        ))}
      </div>
      {showAdd && (
        <AddAccountDialog
          onAdded={() => {
            setShowAdd(false)
            refetch()
          }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  )
}
