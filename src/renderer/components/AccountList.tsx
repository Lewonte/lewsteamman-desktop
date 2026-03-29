import { useAccounts } from '../hooks/useAccounts'
import { AccountCard } from './AccountCard'
import { Loader2, AlertCircle } from 'lucide-react'

export function AccountList() {
  const { data: accounts, isLoading, error } = useAccounts()

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
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-400">
        <p className="text-sm">No accounts found</p>
        <p className="text-xs text-slate-500">Import accounts via the API first</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
      {accounts.map((account) => (
        <AccountCard
          key={account.steam_id}
          steamId={account.steam_id}
          username={account.username}
          displayName={account.display_name}
        />
      ))}
    </div>
  )
}
