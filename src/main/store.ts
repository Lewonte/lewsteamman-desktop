import { safeStorage } from 'electron'
import Store from 'electron-store'

interface StoreSchema {
  apiUrl: string
  encryptedToken: string
}

const store = new Store<StoreSchema>({
  defaults: {
    apiUrl: '',
    encryptedToken: ''
  }
})

export function getApiUrl(): string {
  return store.get('apiUrl')
}

export function setApiUrl(url: string): void {
  store.set('apiUrl', url)
}

export function getApiToken(): string {
  const encrypted = store.get('encryptedToken')
  if (!encrypted) return ''
  try {
    return safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
  } catch {
    return ''
  }
}

export function setApiToken(token: string): void {
  if (safeStorage.isEncryptionAvailable()) {
    const encrypted = safeStorage.encryptString(token)
    store.set('encryptedToken', encrypted.toString('base64'))
  } else {
    // Fallback: store as-is (less secure, mainly affects Linux without keyring)
    store.set('encryptedToken', Buffer.from(token).toString('base64'))
  }
}

export function hasConfig(): boolean {
  return Boolean(getApiUrl() && getApiToken())
}
