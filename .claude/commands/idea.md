---
description: Capture a new idea into ideas/ and back it up
argument-hint: [the idea, in a sentence or two]
---

Daniel has a new idea: $ARGUMENTS

1. If the idea is empty or vague, ask him to describe it in his own words. Ask at most
   two or three short, plain-language follow-ups (who it helps, what "working" looks
   like). Do not interrogate; capture the spark.
2. Write it to `ideas/<today's date>-<short-slug>.md` using `ideas/_template.md`,
   status `spark`. Today's date comes from the environment context.
3. Read the write-up back to him in two or three plain sentences and ask if it
   captures it. Adjust if not.
4. Commit and push with a message like `Idea: <name>`. Tell him it is saved and backed
   up, and offer: shape it further now, prototype it, or leave it for later.
