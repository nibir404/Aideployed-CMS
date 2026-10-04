<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Memory & Session Continuity Protocol (MANDATORY)

Every AI assistant working in this repository MUST activate and adhere to the `memory` skill and keep `MEMORY.md` evergreen:

1. **ON ARRIVAL (BOOT PHASE)**:
   - Always read `MEMORY.md` first (or run `npm run memory status`) to recover full project context, see where the project was left off, review completed milestones, and check active objectives.
   - Do NOT start implementing or exploring blindly without verifying current baseline.

2. **DURING EXECUTION (INVARIANTS)**:
   - Adhere strictly to invariants documented in `MEMORY.md` Section 6:
     - All git commits MUST use `--author="Nick404 <nibirimtiaz1@gmail.com>"`. Never use "betopia".
     - Maintain micro-monolith domain boundaries under `src/modules/<domain>/`.
     - Ensure all UI components support both Light and Dark themes with WCAG AA accessibility contrast.

3. **AFTER EVERY CHANGE (SELF-UPDATE & SYNC)**:
   - Always update `MEMORY.md` before concluding your turn:
     - Run `npm run memory log --type <FEAT|FIX|ARCH|REFACTOR> --title "<title>" --desc "<desc>"` (or edit `MEMORY.md` directly).
     - Mark completed objectives in Section 5 (`npm run memory done "<task>"`).
     - Update Section 1 with the latest status and where the project is left off.
   - Commit `MEMORY.md` along with your code changes.
