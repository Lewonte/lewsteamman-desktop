import { ipcMain, net } from 'electron'
import { getApiToken, getApiUrl, hasConfig, setApiToken, setApiUrl } from './store'

function apiHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getApiToken()}`,
    'Content-Type': 'application/json'
  }
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<unknown> {
  const baseUrl = getApiUrl().replace(/\/$/, '')
  const resp = await net.fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { ...apiHeaders(), ...(options.headers as Record<string, string>) }
  })
  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`API ${resp.status}: ${body}`)
  }
  return resp.json()
}

export function registerIpcHandlers(): void {
  // Config
  ipcMain.handle('get-config', () => ({
    apiUrl: getApiUrl(),
    hasToken: Boolean(getApiToken()),
    isConfigured: hasConfig()
  }))

  ipcMain.handle('set-config', (_e, apiUrl: string, token: string) => {
    setApiUrl(apiUrl)
    setApiToken(token)
  })

  ipcMain.handle('test-connection', async () => {
    try {
      await apiFetch('/accounts')
      return { success: true }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  })

  // Accounts
  ipcMain.handle('get-accounts', () => apiFetch('/accounts'))

  ipcMain.handle('get-code', (_e, steamId: string) =>
    apiFetch(`/accounts/${steamId}/code`)
  )

  ipcMain.handle('get-credentials', (_e, steamId: string) =>
    apiFetch(`/accounts/${steamId}/credentials`)
  )

  ipcMain.handle('approve-login', (_e, steamId: string, challengeUrl: string) =>
    apiFetch(`/accounts/${steamId}/approve-login`, {
      method: 'POST',
      body: JSON.stringify({ challenge_url: challengeUrl })
    })
  )
}
