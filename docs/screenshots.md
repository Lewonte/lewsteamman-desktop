# Screenshots

Use this folder to track public-safe screenshots and GIFs for the README and
release pages.

## Capture Checklist

- Use fake Steam accounts, fake Marvel UIDs, and fake display names.
- Hide or replace passwords, bearer tokens, live 2FA codes, and challenge URLs.
- Prefer the main account list, Settings dialog, QR approval dialog, and
  confirmations flow.
- Capture on Windows first, because the first packaged release target is
  Windows.
- Keep images reasonably small for the README, usually under 1 MB each.

## Suggested Assets

Place assets in `docs/assets/`:

- `account-list.png`
- `settings.png`
- `qr-approval.png`
- `confirmations.png`
- `overview.gif`

When real assets are ready, link them from the README using relative paths such
as:

```markdown
![Account list](docs/assets/account-list.png)
```
