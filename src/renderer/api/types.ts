// Re-export the types from the preload declarations for use in renderer code
export type {
  AccountResponse,
  ApproveLoginResponse,
  ConfigResponse,
  ConnectionTestResult,
  CredentialsResponse,
  TwoFactorCodeResponse
}

// These are declared globally in preload/index.d.ts
// This file just re-exports them for convenient imports in hooks/components
declare const _brand: unique symbol
type AccountResponse = globalThis.AccountResponse
type TwoFactorCodeResponse = globalThis.TwoFactorCodeResponse
type CredentialsResponse = globalThis.CredentialsResponse
type ApproveLoginResponse = globalThis.ApproveLoginResponse
type ConfigResponse = globalThis.ConfigResponse
type ConnectionTestResult = globalThis.ConnectionTestResult
