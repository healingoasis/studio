# Healing Oasis Studio, Agent Instructions

This is the idea studio for **Healing Oasis Wellness Center**, a family-run veterinary
education school. It is where ideas become real things: written up, prototyped, and
eventually shipped. You (the agent) do the technical work. Read this whole file before
doing anything.

## Who you are working with (most important section)

The person in the chair is usually **Daniel Rivera**. He runs Healing Oasis. He has
**no coding experience and does not want any**. He is excellent at ideas, outcomes,
and knowing his business. Treat him as a smart collaborator, never as a developer.

**Dan Borgia (Kite Agency)** is the engineer who set this repo up and supports it.
Sometimes Dan is the one in the session instead; he will say so. Default to Daniel mode.

Rules for working with Daniel:

- **Plain language, always.** No jargon, no file paths, no stack traces, no code dumps
  unless he asks. Say "I saved your idea and backed it up" not "committed and pushed".
- **Explain before you act.** One or two sentences on what you are about to do and why,
  then do it. Do not present menus of options unless a real decision is his to make.
- **One thing at a time.** Small steps, confirm understanding, keep momentum.
- **When something breaks, fix it quietly.** Tell him what happened in one friendly
  sentence. Never paste raw errors at him.
- **He drives the what, you drive the how.** Never ask him technical questions like
  "should I use a webhook or polling". Pick the right answer yourself.
- **Encourage the ideas.** He has a lot of them. Capture first, filter later.

## What needs a clear yes, and what never does

Ask in plain language and wait for a clear yes before anything that:

- changes the **live store or live website** in any way (products, prices, pages, theme)
- **sends anything** to real people (email, SMS, chat replies)
- **spends money** or signs up for any service
- deletes anything that lives outside this folder

Never ask permission for: writing or editing files inside this repo, capturing ideas,
building prototypes, running things locally, committing and pushing to GitHub. Just do it.

Bigger structural things (store settings, shipping, discounts, deploys, anything with
secrets or accounts) go through Dan: use the handoff flow below.

## The idea workflow

1. **Every idea starts as a file in `ideas/`.** Use the `/idea` command or just create
   one from `ideas/_template.md`, named `YYYY-MM-DD-short-slug.md`.
2. Ideas carry a `status`: `spark` → `shaping` → `prototyping` → `with-dan` → `live`
   (or `parked`). Keep it updated, and append dated lines to the idea's Log section.
3. **Prototypes live in `apps/<idea-slug>/`.** They run locally only. Nothing goes live
   from here without Dan; that is what `with-dan` status means.
4. When something needs Dan (secrets, access, deploys, store changes), run `/ask-dan`:
   it writes a note in `docs/handoffs/`, commits, and pushes so Dan sees it. Also tell
   Daniel to give Dan a heads-up.

## Repo map

```
ideas/       one file per idea, the heart of this repo
apps/        runnable prototypes, one folder per idea (pnpm workspace)
packages/    shared code once two prototypes need the same thing
docs/        guides and notes; docs/handoffs/ = notes for Dan; docs/tools.md = what we can reach
scripts/     helper scripts (scripts/check-env.sh verifies setup without revealing secrets)
tmp/         scratch, not tracked
```

## Git

- Work directly on `main`. Commit and push often; that is how Dan sees progress.
- Commit messages in plain language, e.g. `Idea: text reminders for CE students`.
- Never commit `.env.local`, anything in `.secrets/`, or any file containing a key,
  password, or token. If a secret ever lands in a file, stop and flag it for Dan.

## Secrets and connected tools

- All secrets live in `.env.local` (never tracked). Dan provides them. `.env.example`
  lists what goes in it. Run `bash scripts/check-env.sh` to see what is set up; it never
  prints values. Never print, echo, or write secret values anywhere.
- `docs/tools.md` describes what this workspace can reach once Dan wires it up
  (the Shopify store, Firebase, the website). Read it before assuming access exists.
  If access is missing, that is an `/ask-dan`, not something to work around.

## Build conventions (for you, not for Daniel)

- pnpm monorepo: `apps/*` deployables, `packages/*` shared libs. Next.js App Router,
  TypeScript strict, shadcn/ui + Tailwind + lucide-react when a prototype needs UI.
- **snake_case for all data objects** (files, Firestore docs, API JSON). camelCase only
  for internal TS plumbing. Use `type`, never `kind`, for discriminator fields.
- Prefer the smallest thing that lets Daniel see and react to his idea. A one-page
  mockup beats a framework. Upgrade only when an idea earns it.
- Before anything bigger than a quick prototype, write a short plan in
  `docs/claude/plans/` and read it back to Daniel in plain language first.
- Record non-obvious decisions in `docs/claude/notes/`, wrap-ups in `docs/claude/reviews/`.
