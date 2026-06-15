# Contributing

LewSteamMan Desktop is a companion app for the LewSteamMan API server. It can
display sensitive account credentials, so changes should preserve the split
between renderer UI, IPC bridge, and main-process API access.

## Development Setup

From this repository on Windows PowerShell:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' install
& 'C:\Program Files\nodejs\npm.cmd' run dev
```

The app needs a running LewSteamMan API server. Configure the API URL and bearer
token in the Settings UI on first launch.

## Checks

Run these before opening a pull request:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run typecheck
& 'C:\Program Files\nodejs\npm.cmd' run build
```

## Secrets And Generated Files

Do not commit:

- `.env`
- API tokens
- account credentials
- generated installers in `dist/`
- compiled output in `out/`
- `node_modules/`

Screenshots and GIFs are welcome only if they use fake accounts, fake IDs, and
no real tokens or credentials.

## Code Style

- Keep API calls in the Electron main process.
- Keep the renderer behind the preload `contextBridge` API.
- Keep `contextIsolation: true` and `nodeIntegration: false`.
- Prefer existing React/TanStack Query patterns for new UI flows.
- Use lucide-react icons for toolbar/action buttons when possible.
