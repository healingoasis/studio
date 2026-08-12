# GitHub push access on Daniel's Mac — RESOLVED

**No action needed.** Logged here so the setup is on record.

## What was wrong

Commits landed locally but `git push` hung forever. `credential.helper` was `osxkeychain`
with no stored GitHub credential and no GitHub CLI installed, so git sat waiting on a
prompt that a non-interactive session could never answer. Read access worked (public
repo over HTTPS), so the clone had succeeded and hidden the problem until the first push.

## What was done (2026-08-12)

- GitHub CLI v2.97.0 installed **without sudo**, matching the existing Node setup:
  unpacked to `~/.local/share/gh`, symlinked at `~/.local/bin/gh`, quarantine attribute
  stripped, and `~/.local/bin` prepended to PATH in `~/.zshrc`.
- Daniel ran `gh auth login --web` himself in the terminal. Authenticated as
  **`ApolloVantage`**, with push rights to `healingoasis/studio` — so org membership was
  already in place.
- `gh auth setup-git` was run. Note that `credential.helper` still reads `osxkeychain`;
  the credential landed in the keychain during the auth flow and pushes work, so this was
  left alone rather than layering a second helper on top.
- Verified: `8bff76d..a7ed0a2 main -> main`, working tree clean, local and origin level.

## Worth knowing

- Daniel's GitHub username is `ApolloVantage`, which does not obviously map to his name —
  handy to know when reading commit history or adding him to things.
- The `gh` install lives in his home folder, so a macOS upgrade will not remove it, but it
  will not auto-update either. Re-running the same unpack-and-symlink steps updates it.

## Related

- `docs/handoffs/2026-08-12-shopify-access.md` — still open, same setup pass.
