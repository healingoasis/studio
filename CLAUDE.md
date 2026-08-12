@AGENTS.md

## Claude Code specifics

- Default to Daniel mode (guided, plain language) unless the user says they are Dan.
- Use the slash commands as the main flow: `/idea` to capture, `/prototype` to build,
  `/status` for a recap, `/ask-dan` when something needs Dan (Kite Agency).
- At the start of a session, if it seems like a fresh conversation, offer a one-breath
  recap: what ideas are in flight and what happened last time (from `ideas/` statuses
  and recent commits). Keep it to a few sentences.
