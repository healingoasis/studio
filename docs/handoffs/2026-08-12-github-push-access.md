# GitHub push access on Daniel's Mac

## What is happening

Commits are landing locally but `git push origin main` hangs and never completes.
Cause: `credential.helper` is `osxkeychain` with no stored GitHub credential, and the
GitHub CLI is not installed, so git sits waiting on a username/password prompt that a
non-interactive session cannot answer.

```
$ git remote -v
origin  https://github.com/healingoasis/studio.git

$ which gh
gh not found

$ git config --get credential.helper
osxkeychain
```

Practical effect: **Dan cannot see Daniel's progress.** Two commits are sitting on
Daniel's machine only —

- `8bff76d` Studio scaffold
- `d5451ce` Idea: student intake portal, with a mockup Daniel can click

## What Dan needs to do

Pick whichever is easiest to support:

1. Install the GitHub CLI and run `gh auth login` with Daniel (browser flow, no token
   for Daniel to copy or store), which also wires git's credential helper; or
2. Create a fine-grained personal access token scoped to `healingoasis/studio` and store
   it in the keychain for `https://github.com`; or
3. Switch the remote to SSH and add a key for Daniel's Mac.

Option 1 is probably the kindest — nothing for Daniel to keep track of.

Worth confirming afterwards that `git push` completes without prompting, since the whole
"commit and push often so Dan sees progress" flow in `AGENTS.md` depends on it.

## Related

- `docs/handoffs/2026-08-12-shopify-access.md` — same setup pass on the same machine.
