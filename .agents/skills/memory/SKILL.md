---
name: memory
description: Maintains and automatically updates evergreen codebase memory and context after every change. Recalls where the project was left off, completed milestones, architectural decisions, and active next steps across sessions.
---

# Codebase Memory & Context Synchronization Skill (`memory`)

This skill enforces a persistent, self-updating memory system for the repository. It guarantees that any AI assistant or developer returning to this project immediately recalls **where the project was left off**, **how much is done**, **architectural decisions**, and **pending next steps** without cold starts or lost context.

---

## 1. When to Activate This Skill

Activate this skill **automatically**:
1. **At the start of every session or task**:
   - When the user asks to "continue", "resume", "where did we leave off?", "what is done?", or gives a new prompt.
   - To immediately load project status, active objectives, and invariants.
2. **After making ANY code, asset, or schema changes**:
   - Before completing your response or concluding a task.
   - To record an atomic entry of what changed, update completion percentages, and check off completed objectives.
3. **Before any git commit or push**:
   - Ensure `MEMORY.md` is committed alongside code changes so repository memory travels in lockstep with the code.

---

## 2. The 3-Phase Memory Lifecycle

```
┌──────────────────────────────┐      ┌──────────────────────────────┐      ┌──────────────────────────────┐
│    PHASE 1: BOOT & RECALL    │ ───▶ │     PHASE 2: DEVELOPMENT     │ ───▶ │     PHASE 3: SELF-UPDATE     │
│ Read MEMORY.md / status      │      │ Track files & APIs changed   │      │ Record atomic log entry      │
│ Know where project was left  │      │ Adhere to project invariants │      │ Check off completed tasks    │
└──────────────────────────────┘      └──────────────────────────────┘      └──────────────────────────────┘
```

### Phase 1: Boot & Context Recovery (Start of Session)

**Rule: Never write code blind.** Always recover project context first:

1. **Run the Memory Status Command**:
   ```bash
   node scripts/memory.mjs status
   # or: npm run memory status
   ```
   Or directly inspect [MEMORY.md](file:///Users/betopiagroup/Downloads/Aideployed-CMS/MEMORY.md).

2. **Verify Working Tree Baseline**:
   ```bash
   git status --short
   git log -1 --oneline
   ```
   Identify:
   - What was the last completed milestone?
   - What are the open items in `5. Active Objectives & Next Steps`?
   - Are there uncommitted files from a prior turn?

3. **Align on Intent**:
   Confirm to the user that context is loaded, acknowledging the current stage and what is being targeted.

---

### Phase 2: Development & Invariants Enforcement

While implementing solutions:
1. **Adhere to Documented Invariants (`MEMORY.md` Section 6)**:
   - **Git Author Identity**: Commits must use `--author="Nick404 <nibirimtiaz1@gmail.com>"`. Never use "betopia".
   - **Micro-Monolith Boundaries**: Keep code within domain folders (`src/modules/<domain>/`).
   - **Dual-Theme Accessibility**: Support both Light and Dark modes with verified WCAG contrast.
   - **Next.js 16 App Router**: Await async route params (`const { id } = await params`).
2. **Track Modified Components**:
   - Note which files are modified or created across `src/`, `prisma/`, `scripts/`, or config files.

---

### Phase 3: Self-Update & Changelog Sync (After Every Change)

**Rule: After completing any changes, update memory before concluding.**

1. **Record the Change in Evolution Log**:
   Use the helper script:
   ```bash
   node scripts/memory.mjs log \
     --type feat \
     --title "Short title of the change" \
     --desc "Comprehensive explanation of what was built or fixed" \
     --notes "Architecture decisions or key tradeoffs"
   ```
   *Available types: `FEAT`, `FIX`, `REFACTOR`, `ARCH`, `DOCS`, `CHORE`.*

2. **Update Active Objectives**:
   - If a pending objective was finished, mark it complete:
     ```bash
     node scripts/memory.mjs done "snippet of completed task"
     ```
   - If new follow-up tasks were identified, add them:
     ```bash
     node scripts/memory.mjs next "New pending task description"
     ```

3. **Verify and Update Completion Summary in `MEMORY.md`**:
   - If a major milestone was reached, update Section 1 (`Project Status & Where It Was Left Off`) and the completion level in [MEMORY.md](file:///Users/betopiagroup/Downloads/Aideployed-CMS/MEMORY.md).

4. **Commit Memory with Code**:
   ```bash
   git add MEMORY.md
   git commit --author="Nick404 <nibirimtiaz1@gmail.com>" -m "chore(memory): sync project memory and changelog"
   ```

---

## 3. Helper CLI Tool Reference (`scripts/memory.mjs`)

| Command | Purpose |
|---|---|
| `node scripts/memory.mjs status` | Instant summary of project state, where we left off, dirty files, and open tasks. |
| `node scripts/memory.mjs log --type <T> --title "<text>" --desc "<desc>"` | Appends a structured changelog entry to `MEMORY.md`, auto-capturing modified files from git. |
| `node scripts/memory.mjs next "<objective>"` | Adds a new pending item (`- [ ]`) under Active Objectives. |
| `node scripts/memory.mjs done "<objective>"` | Toggles an objective to completed (`- [x]`). |
| `node scripts/memory.mjs sync` | Refreshes the last-updated date and syncs memory with the current git status. |

---

## 4. Golden Rules for Project Memory

1. **Radical Honesty**: Only document what is implemented and working in the codebase.
2. **No Cold Starts**: Every turn begins by checking `MEMORY.md`.
3. **Self-Updating Invariant**: Every turn that modifies code MUST sync `MEMORY.md` before returning.
4. **Memory Travels With Code**: All persistent memory lives in `MEMORY.md` in version control, never lost in temporary chat logs.
