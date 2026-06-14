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
  uid: string | null
  game_username: string | null
  rank: string | null
  level: string | null
  character_name: string | null
  nameplate_url: string | null
  ranked_wins: number | null
  ranked_losses: number | null
  season_wins: number | null
  last_marvel_sync_at: number | null
  last_marvel_update_requested_at: number | null
  note: string | null
  has_authenticator: boolean
}

interface TwoFactorCodeResponse {
  code: string
  valid_from: number
  valid_until: number
}

interface CredentialsResponse {
  username: string
  password: string
  guard_code: string | null
  valid_until: number | null
}

interface CreateAccountRequest {
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
}

interface UpdateAccountRequest {
  display_name?: string
  uid?: string
  game_username?: string
  rank?: string
  level?: string
  character_name?: string
  nameplate_url?: string
  note?: string
}

interface ApproveLoginResponse {
  success: boolean
}

interface ConfirmationResponse {
  conf_id: string
  nonce: string
  conf_type: 'trade' | 'market' | 'other'
  creator_id: string
  description: string
}

interface ConfirmationActionResponse {
  success: boolean
}

interface MarvelUpdateResponse {
  account: AccountResponse
  message: string
}

interface ElectronAPI {
  getConfig(): Promise<ConfigResponse>
  setConfig(apiUrl: string, token: string): Promise<void>
  testConnection(): Promise<ConnectionTestResult>
  getAccounts(): Promise<AccountResponse[]>
  createAccount(account: CreateAccountRequest): Promise<AccountResponse>
  updateAccount(steamId: string, account: UpdateAccountRequest): Promise<AccountResponse>
  syncMarvelAccount(steamId: string): Promise<AccountResponse>
  requestMarvelUpdate(steamId: string): Promise<MarvelUpdateResponse>
  getCode(steamId: string): Promise<TwoFactorCodeResponse>
  getCredentials(steamId: string): Promise<CredentialsResponse>
  approveLogin(steamId: string, challengeUrl: string): Promise<ApproveLoginResponse>
  getConfirmations(steamId: string): Promise<ConfirmationResponse[]>
  approveConfirmation(
    steamId: string,
    confId: string,
    nonce: string
  ): Promise<ConfirmationActionResponse>
  denyConfirmation(
    steamId: string,
    confId: string,
    nonce: string
  ): Promise<ConfirmationActionResponse>
  copyToClipboard(text: string): void
  readClipboardImage(): string | null
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
