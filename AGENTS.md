# AGENTS.md

> Operational guide — loaded every session. Keep this under 60 lines.
> Conventions, architecture, and pitfalls live in `openspec/specs/conventions.md`.

---

## Build & Test

```bash
npx serve .    # start local server at http://localhost:3000
```

Open browser console (F12) — no errors = ready to commit.

## Validation

Run after every change before committing:

1. Open browser console — zero errors
2. Check that reserved p5 names are not used as variables:
   `width`, `height`, `color`, `fill`, `stroke`, `random`, `map`, `text`, `key`, `image`

Never commit with console errors.

---

## Operational Learnings

<!-- Format: "- [YYYY-MM-DD] <what you learned>" -->
