---
title: Refreshing the student portal review link
date: 2026-08-18
---

## What Daniel asked for

A link he can open and review, showing the portal as it stands now. The existing
published link (Student Intake Portal, 12 Aug) is the original `mockup.html`, which has
not changed since the first commit. Everything since — the live-shaped student data, the
program and shop pages, and the rolling photo headers — is missing from it.

## The constraint that shapes this

The running app reads **real student names, emails and orders** from Shopify at request
time, and `public/photos/` holds **identifiable students, staff and clients** (gitignored
on purpose; this repo is public). A review link is a hosted page.

Daniel chose: **real photographs, invented student records.**

## Approach

1. Add a demo source for students only — invented orders fed through the *real*
   `students_from_orders` pipeline, so tuition maths, standing, and payment history all
   behave exactly as they do live. Behind `PORTAL_DEMO=1`; the default path is untouched.
2. Shop shelves stay real: they come from the store's public `products.json`, which is
   published catalogue data, not customer data.
3. Run the app locally with demo students and capture the rendered HTML of both versions
   (`/` the portal, `/record` the student file).
4. Fold the capture into one self-contained page: the app's own stylesheet inlined, the
   photographs downscaled and embedded, the hero crossfade reimplemented in plain
   JavaScript (the React component cannot come along), and the two versions switched
   client-side so the toggle still works.
5. Publish over the existing artifact URL so the link Daniel already has keeps working.

## What the link will not be

A working app. No uploads, no live store reads, no document actions — those need the
server. It is an accurate look at the current design with believable data.
