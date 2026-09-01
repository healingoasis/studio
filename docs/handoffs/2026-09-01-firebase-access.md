# Firebase access, and which project we actually mean

> **RESOLVED THE SAME DAY — 1 September 2026. Nothing here needs Dan any more.**
>
> Daniel chose to authenticate through the Google Cloud CLI rather than wait for a
> service account key, and did it himself. `gcloud` is installed at
> `~/.local/google-cloud-sdk` (with a self-contained Python 3.12 at
> `~/.local/gcloud-python`, because macOS ships 3.9 and gcloud will not run on it —
> the SDK's own bundled Python is x86-only and this is an arm64 Mac). Daniel signed in
> as `daniel@healingoasis.edu`. No key was issued and none is needed.
>
> **The project question is settled: `gcloud projects list` returns exactly one
> project, `healing-oasis`. There is no `healing-io` and there never was.** The repo had
> been carrying a project name that does not exist since it was set up, which is the
> whole reason Firebase never connected. `.env.example`, `docs/tools.md` and `.env.local`
> are corrected.
>
> **The student documents were never missing.** Firestore holds 76 order documents — 24
> with a filled application, all 76 with a signature, 18 with documents attached — and
> the Storage bucket holds 172 files (62 MB) of PDFs and license photographs. The
> enrollments portal reported "Missing" because it was asking a project that does not
> exist.
>
> Two things below are still real and still yours, unchanged by any of this:
> **`read_draft_orders` on the Shopify app**, and **the durable-storage decision** —
> where the office's own records get written, admin portal versus intake portal. Read
> access to existing documents does not answer either one.

Daniel asked for this directly on 1 September: he sent the Firebase console link and
said he wants the studio to be able to reach it. This is the third time Firebase has
come up — item 3 of `2026-08-25-portal-storage-and-scopes.md`, and again in
`2026-09-01-everything-waiting-on-dan.md` — but the first time Daniel has pointed at a
specific project himself. That turned up a discrepancy worth settling before anything
is wired.

## Read this first: the project name does not match

Daniel's link:

```
https://console.firebase.google.com/u/1/project/healing-oasis/overview
```

That is project **`healing-oasis`**. But this repo has been set up against
**`healing-io`** since the beginning — both `.env.example` and `docs/tools.md` name it,
and `.env.example` expects the key at
`./.secrets/healing-io-service-account.json`.

Two possibilities, and they lead to different work:

- **They are the same project** and one of the two names is stale — in which case the
  repo's files need correcting so nobody wires up a project that does not exist.
- **They are two different projects** — in which case we need to know which one holds
  the enrollment applications, signatures and student documents, because that is the
  one the portal has been trying to read.

Nothing should be connected until this is answered. Guessing here means pointing at the
wrong store of student PII.

## What is blocking

Firebase is not wired on this machine at all. Concretely:

- `FIREBASE_PROJECT_ID` is empty in `.env.local` (`bash scripts/check-env.sh` reports it
  MISSING). Shopify's credentials are set and working; Firebase's are not.
- There is no service account key. `.env.example` points at
  `.secrets/healing-io-service-account.json`; no such file exists.
- Neither `gcloud` nor the `firebase` CLI is installed. `node` and `pnpm` are.

A console link does not grant an agent access — it opens the browser for Daniel, signed
in as himself. Reading Firebase from here needs a credential file on the machine.

## What Dan needs to do

1. **Confirm the project.** `healing-oasis` or `healing-io` — and which one holds the
   enrollment applications, signatures and student documents. If the repo's name is the
   stale one, say so and it gets corrected in `.env.example` and `docs/tools.md`.

2. **Provide a service account key, scoped as tightly as it can be.** This is student
   PII, and everything asked for so far is reading: opening the documents students have
   already sent, so the Admissions tab stops reading "Missing" for people who did send
   things in. **Read-only on Firestore and Storage is enough for that** — please do not
   issue a broader key than the job needs. Put it in `.secrets/` (gitignored) and set
   `FIREBASE_PROJECT_ID` and `GOOGLE_APPLICATION_CREDENTIALS` in `.env.local`.

3. **Say whether you want a CLI installed**, and which. Nothing here needs one — the
   Admin SDK with a key file is enough for reads — so this is only worth doing if you
   want it for your own work on this machine.

4. **Note this is separate from the durable-storage decision**, still open from
   25 August. Reading the documents students already sent is a different thing from
   choosing where the office's own records get written. Granting read access does not
   settle the write path, and per Daniel's own framing on 31 August the write path is
   meant to become the Student Intake Portal
   (`apps/student-intake-portal` in this repo), with the admin portal reading from it
   under per-programme permission. Worth not letting a read key quietly become the
   answer to a question nobody decided.

## Notes

- Whatever comes back, real student records stay on Daniel's machine. Nothing from
  Firebase gets copied into files in this repo or onto any shared link — same rule the
  portal already runs under.
- Daniel is the owner of the Firebase project, so he can generate a key himself from the
  console in a few minutes if waiting is the slow part. He was told that option exists.
  It is written up here rather than done that way because a key is a credential, and
  credentials are your lane.
