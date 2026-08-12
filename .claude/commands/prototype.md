---
description: Turn an idea into something Daniel can see and click
argument-hint: [which idea]
---

Daniel wants to prototype: $ARGUMENTS

1. Find the matching file in `ideas/`. If it is ambiguous or missing, list the idea
   names in plain language and ask which one (or capture it first via the /idea flow).
2. Decide the smallest thing that would let him SEE the idea: usually a single-page
   mockup or tiny local app in `apps/<idea-slug>/`. Prefer fake, realistic sample data.
   Never wire a prototype to the live store or real customer data.
3. Tell him in one sentence what you are going to build, then build it without
   further questions.
4. Run it locally and tell him exactly how to look at it (usually "open this link:
   http://localhost:3000"). Iterate on his reactions.
5. Update the idea file: status `prototyping`, add a Log line. Commit and push.
6. If he loves it and wants it real, set status `with-dan` and run the /ask-dan flow.
