import { contextBridge, ipcRenderer, clipboard } from 'electron'

const api = {
  // Config
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConfig: (apiUrl: string, token: string) => ipcRenderer.invoke('set-config', apiUrl, token),
  testConnection: () => ipcRenderer.invoke('test-connection'),

  // Accounts
  getAccounts: () => ipcRenderer.invoke('get-accounts'),
  createAccount: (account: {
    username: string
    password: string
    account_id?: string
    display_name?: string
    uid?: string
    game_username?: string
    rank?: string
    level?: string
    character_name?: string
    nameplate_url?: string
    note?: string
  }) => ipcRenderer.invoke('create-account', account),
  updateAccount: (steamId: string, account: {
    display_name?: string
    uid?: string
    game_username?: string
    rank?: string
    level?: string
    character_name?: string
    nameplate_url?: string
    note?: string
  }) => ipcRenderer.invoke('update-account', steamId, account),
  syncMarvelAccount: (steamId: string) => ipcRenderer.invoke('sync-marvel-account', steamId),
  requestMarvelUpdate: (steamId: string) =>
    ipcRenderer.invoke('request-marvel-update', steamId),
  getCode: (steamId: string) => ipcRenderer.invoke('get-code', steamId),
  getCredentials: (steamId: string) => ipcRenderer.invoke('get-credentials', steamId),
  approveLogin: (steamId: string, challengeUrl: string) =>
    ipcRenderer.invoke('approve-login', steamId, challengeUrl),

  // Clipboard
  copyToClipboard: (text: string) => clipboard.writeText(text)
}

contextBridge.exposeInMainWorld('api', api)
