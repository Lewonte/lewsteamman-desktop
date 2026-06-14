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
  const method = options.method || 'GET'
  console.info(`[apiFetch] ${method} ${path}`)
  const resp = await net.fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { ...apiHeaders(), ...(options.headers as Record<string, string>) }
  })
  if (!resp.ok) {
    const body = await resp.text()
    console.error(`[apiFetch] ${method} ${path} failed: ${resp.status}`, body)
    throw new Error(`API ${resp.status}: ${body}`)
  }
  console.info(`[apiFetch] ${method} ${path} succeeded: ${resp.status}`)
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

  ipcMain.handle('create-account', (_e, account) =>
    apiFetch('/accounts', {
      method: 'POST',
      body: JSON.stringify(account)
    })
  )

  ipcMain.handle('update-account', (_e, steamId: string, account) =>
    apiFetch(`/accounts/${encodeURIComponent(steamId)}`, {
      method: 'PATCH',
      body: JSON.stringify(account)
    })
  )

  ipcMain.handle('sync-marvel-account', (_e, steamId: string) =>
    apiFetch(`/accounts/${encodeURIComponent(steamId)}/marvel/sync`, {
      method: 'POST'
    })
  )

  ipcMain.handle('request-marvel-update', (_e, steamId: string) =>
    apiFetch(`/accounts/${encodeURIComponent(steamId)}/marvel/request-update`, {
      method: 'POST'
    })
  )

  ipcMain.handle('get-code', (_e, steamId: string) =>
    apiFetch(`/accounts/${encodeURIComponent(steamId)}/code`)
  )

  ipcMain.handle('get-credentials', (_e, steamId: string) =>
    apiFetch(`/accounts/${encodeURIComponent(steamId)}/credentials`)
  )

  ipcMain.handle('approve-login', async (_e, steamId: string, challengeUrl: string) => {
    console.info('[approve-login] request', {
      steamId,
      challengeUrlPreview: previewChallengeUrl(challengeUrl),
      challengeUrlLength: challengeUrl.length
    })
    const result = await apiFetch(`/accounts/${encodeURIComponent(steamId)}/approve-login`, {
      method: 'POST',
      body: JSON.stringify({ challenge_url: challengeUrl })
    })
    console.info('[approve-login] response', result)
    return result
  })

  ipcMain.handle('get-confirmations', (_e, steamId: string) =>
    apiFetch(`/accounts/${encodeURIComponent(steamId)}/confirmations`)
  )

  ipcMain.handle('approve-confirmation', (_e, steamId: string, confId: string, nonce: string) =>
    apiFetch(
      `/accounts/${encodeURIComponent(steamId)}/confirmations/${encodeURIComponent(confId)}/approve`,
      {
        method: 'POST',
        body: JSON.stringify({ nonce })
      }
    )
  )

  ipcMain.handle('deny-confirmation', (_e, steamId: string, confId: string, nonce: string) =>
    apiFetch(
      `/accounts/${encodeURIComponent(steamId)}/confirmations/${encodeURIComponent(confId)}/deny`,
      {
        method: 'POST',
        body: JSON.stringify({ nonce })
      }
    )
  )
}

function previewChallengeUrl(challengeUrl: string): string {
  const trimmed = challengeUrl.trim()
  if (trimmed.length <= 60) return trimmed
  return `${trimmed.slice(0, 40)}...${trimmed.slice(-12)}`
}
