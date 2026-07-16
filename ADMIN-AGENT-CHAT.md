# Agent Admin Chat

This is the shared, visible coordination log for the developer, Codex, and Claude Code. It records task delegation, questions, evidence, decisions, and handoffs in one place.

Account note: this file transfers with the repository, but Codex automations, Claude sessions, API keys, billing, and local Git-hook activation do not. A new owner should begin with `NEW-ACCOUNT-TAKEOVER.md` and add a fresh takeover entry.

## How it works

- **Codex lead** opens a task entry, assigns scope, and records the final decision.
- **Claude Code** reads the current task entry before working and adds its response under the same task.
- **Developer** can add direction, questions, or a decision anywhere in the log.
- Keep entries concise. Do not paste secrets, full logs, or large traces; link to file paths instead.
- This is a coordination record, not a replacement for source control, tests, or code review.

## Entry format

```markdown
## Task: short-name — YYYY-MM-DD

**From:** Codex | Claude Code | Developer
**To:** Codex | Claude Code | Developer
**Status:** proposed | working | needs-input | review | complete

Message: Concise question, instruction, decision, or handoff.

Scope: Allowed files/components (if work is requested).
Evidence: Tests, report, trace, or artifact paths (when available).
Next: Named owner and concrete next action.
```

---

## Task: coordination-setup — 2026-07-16

**From:** Codex
**To:** Developer and Claude Code
**Status:** complete

Message: Created the visible shared coordination log. Codex remains the lead coordinator; Claude Code may use this file to ask scoped questions and provide handoffs.

Scope: `AGENTS.md`, `.agents/`, and this coordination log.
Evidence: `.agents/README.md` contains the multi-agent workflow and model-selection guidance.
Next: Developer provides the first implementation task; Codex records delegation here before asking Claude Code to work.

---

## Task: build-agenteval-mvp — 2026-07-16

**From:** Developer
**To:** Codex and Claude Code
**Status:** working

Message: Build the AgentEval project to a usable end state. Agents may edit files and run tests. The developer wants the remaining manual setup limited to filling environment variables for live model use.

Scope: Full repository, with a focused local CLI, demo MCP targets, intent suite, deterministic replay mode, reporting, tests, and setup documentation.
Evidence: Product and technical requirements are in `AgentEval-Final-Hackathon-Proposal.md` and `AgentEval-Technical-Outline.md`.
Next: Codex establishes the implementation plan and delegates independent discovery/review work to Claude Code.

### Coordination update — model usage policy

**From:** Developer
**To:** Codex
**Status:** accepted

Message: Manage model usage. Reserve Fable for short, high-value architecture or difficult-debugging reviews; use Sonnet for routine Claude Code implementation and testing. Codex should keep its own coordination concise and delegate only work that materially advances the project.

Next: Codex creates the initial scaffold locally, then assigns a small Sonnet task after the module boundaries are in place.

---

## Task: teammate-handoff — 2026-07-16

**From:** Codex
**To:** Developer and teammate
**Status:** complete

Message: Created `TEAMMATE-HANDOFF.md` so another Codex session can resume the build without relying on chat history. The in-progress dependency install was stopped intentionally; the handoff states the exact resume command and build order.

Scope: Handoff documentation only. No application code has been started beyond the project contract files.
Evidence: `TEAMMATE-HANDOFF.md`, `package.json`, `.env.example`, and `intents/travel-policy.yaml`.
Next: Teammate or Codex resumes with `npm.cmd install`, then implements deterministic replay/scoring before live MCP/model integration.

---

## Task: adversarial-commit-gate — 2026-07-16

**From:** Codex
**To:** Developer and teammate
**Status:** complete

Message: Added a Bun-inspired commit gate: two isolated Sonnet adversarial reviewers inspect the staged diff, and Fable is used only as a tie-breaker if they disagree. Lint/tests are run first, high-severity findings block the commit, and a local JSON review record is written for inspection.

Scope: `.githooks/pre-commit`, `scripts/adversarial-review.mjs`, `.agents/ADVERSARIAL-REVIEW.md`, and agent rules.
Evidence: Install with `npm.cmd run hooks:install` after dependencies are installed. See `.agents/ADVERSARIAL-REVIEW.md` for usage and model-cost controls.
Next: Verify the gate after `npm.cmd install` and tune the prompts only through reviewed commits.

---

## Task: quota-aware-continuation — 2026-07-16

**From:** Codex
**To:** Developer, Codex, and Claude Code
**Status:** active

Message: The recurring coordinator now has authority to build the project autonomously: edit files, install dependencies, run tests, use Claude Code, pass the adversarial review gate, and commit verified milestones. It uses a low-cost Codex model, schedules at most one bounded Sonnet task per run, and records Claude quota/rate-limit/auth failures as a paused checkpoint instead of repeatedly burning usage. Fable remains reserved for genuine architecture deadlocks or reviewer disagreement.

Scope: AgentEval continuation through completed MVP milestones. It may commit coherent verified work; it may not change credentials, purchase/upgrade plans, deploy, publish packages, delete user data, force-push, or bypass the review gate.
Evidence: Automation `agenteval-claude-quota-aware-continuation` is active in the Codex app.
Next: The coordinator resumes the next queued handoff task only when Claude Code is available.
