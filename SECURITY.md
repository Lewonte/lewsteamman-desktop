# Security

LewSteamMan Desktop can request and display Steam account credentials from a
LewSteamMan API server. Treat the configured API token and any visible account
data as sensitive.

## Supported Use

Use the desktop client only with an API server you control. Avoid configuring it
against a public or shared server unless that server is protected by a private
network and a strong bearer token.

## Token Handling

The app stores the API token through Electron safeStorage and proxies API calls
through the main process. The renderer should not directly construct API
requests or access the bearer token.

Do not commit or share:

- API tokens
- real account credentials
- screenshots showing usernames, passwords, UID values, or live 2FA codes
- generated builds containing local configuration

## Reporting Issues

This repository does not yet have a formal security advisory process. Until one
is published, avoid posting live tokens, credentials, or account-specific data in
public issues. Open a minimal public issue describing the affected area without
sensitive details.

## Current Limitations

- Anyone with access to the configured desktop session may be able to request
  stored credentials from the API server.
- The app trusts the configured API server.
- The app is intended for private use, not shared kiosk or multi-user machines.
