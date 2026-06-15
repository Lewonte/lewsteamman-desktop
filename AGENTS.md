# Agent Notes

This repository is the Electron + React desktop client for LewSteamMan.

The Python API server lives in a separate repository named `LewSteamMan`.
Do not assume both repos share one git history.

## Windows PowerShell

Do not call bare `npm` in PowerShell. `npm.ps1` may be blocked by execution
policy. Use `npm.cmd` explicitly:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' install
& 'C:\Program Files\nodejs\npm.cmd' run dev
& 'C:\Program Files\nodejs\npm.cmd' run typecheck
& 'C:\Program Files\nodejs\npm.cmd' run build
```

## Local Backend

The desktop app expects a running LewSteamMan API server, usually:

```text
http://localhost:8000
```

Configure the API URL and bearer token in the in-app Settings UI. Do not commit
tokens, `.env`, generated installers, `out/`, `dist/`, or `node_modules/`.

## Release Builds

Tagged runs in `.github/workflows/release.yml` build the Windows installer and
create a GitHub Release. The workflow runs electron-builder with
`--publish never`, then creates the release with `gh release create`.
