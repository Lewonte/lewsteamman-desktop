import { useEffect, useState } from 'react'
import { Settings } from 'lucide-react'
import { AccountList } from './components/AccountList'
import { SettingsDialog } from './components/SettingsDialog'

export function App() {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    window.api.getConfig().then((config) => {
      setConfigured(config.isConfigured)
    })
  }, [])

  // Loading state
  if (configured === null) {
    return <div className="flex items-center justify-center h-screen" />
  }

  // First-launch onboarding
  if (!configured) {
    return (
      <SettingsDialog
        fullPage
        onConfigured={() => setConfigured(true)}
      />
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <h1 className="text-sm font-semibold text-white tracking-wide">LewSteamMan</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Settings"
        >
          <Settings size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Settings panel (inline) */}
      {showSettings && (
        <div className="border-b border-slate-800 p-4">
          <SettingsDialog onConfigured={() => setShowSettings(false)} />
        </div>
      )}

      {/* Account list */}
      <div className="flex-1 overflow-hidden">
        <AccountList />
      </div>
    </div>
  )
}
