interface ConfigResponse {
  apiUrl: string
  hasToken: boolean
  isConfigured: boolean
}

interface ConnectionTestResult {
  success: boolean
  error?: string
}

interface AccountResponse {
  steam_id: string
  username: string
  display_name: string | null
}

interface TwoFactorCodeResponse {
  code: string
  valid_from: number
  valid_until: number
}

interface CredentialsResponse {
  username: string
  password: string
  guard_code: string
  valid_until: number
}

interface ApproveLoginResponse {
  success: boolean
}

interface ElectronAPI {
  getConfig(): Promise<ConfigResponse>
  setConfig(apiUrl: string, token: string): Promise<void>
  testConnection(): Promise<ConnectionTestResult>
  getAccounts(): Promise<AccountResponse[]>
  getCode(steamId: string): Promise<TwoFactorCodeResponse>
  getCredentials(steamId: string): Promise<CredentialsResponse>
  approveLogin(steamId: string, challengeUrl: string): Promise<ApproveLoginResponse>
  copyToClipboard(text: string): void
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
