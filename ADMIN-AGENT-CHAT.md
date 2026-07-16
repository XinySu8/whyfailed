# Agent Admin Chat

This is the shared, visible coordination log for the developer, Codex, and Claude Code. It records task delegation, questions, evidence, decisions, and handoffs in one place.

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
