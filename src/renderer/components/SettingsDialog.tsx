import { useEffect, useState } from 'react'
import { Loader2, CheckCircle, XCircle, Settings } from 'lucide-react'

interface Props {
  onConfigured: () => void
  fullPage?: boolean
}

export function SettingsDialog({ onConfigured, fullPage = false }: Props) {
  const [apiUrl, setApiUrl] = useState('')
  const [token, setToken] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; error?: string } | null>(null)

  useEffect(() => {
    window.api.getConfig().then((config) => {
      setApiUrl(config.apiUrl || 'http://localhost:8000')
    })
  }, [])

  const handleSave = async () => {
    setTesting(true)
    setTestResult(null)

    // Save config first so test-connection uses it
    await window.api.setConfig(apiUrl, token)

    const result = await window.api.testConnection()
    setTestResult(result)
    setTesting(false)

    if (result.success) {
      setTimeout(onConfigured, 800)
    }
  }

  const content = (
    <div className="space-y-4 w-80">
      <div className="flex items-center gap-2">
        <Settings size={18} className="text-blue-400" />
        <h2 className="text-sm font-semibold text-white">
          {fullPage ? 'Welcome to LewSteamMan' : 'Settings'}
        </h2>
      </div>

      {fullPage && (
        <p className="text-xs text-slate-400">
          Connect to your LewSteamMan API server to get started.
        </p>
      )}

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-500">API URL</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:8000"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500">API Token</label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Bearer token"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!apiUrl || !token || testing}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-sm font-medium transition-colors"
      >
        {testing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : testResult?.success ? (
          <CheckCircle size={16} className="text-green-400" />
        ) : testResult && !testResult.success ? (
          <XCircle size={16} className="text-red-400" />
        ) : null}
        {testing ? 'Testing...' : testResult?.success ? 'Connected!' : 'Save & Connect'}
      </button>

      {testResult && !testResult.success && (
        <p className="text-xs text-red-400">
          Connection failed: {testResult.error}
        </p>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          {content}
        </div>
      </div>
    )
  }

  return content
}
