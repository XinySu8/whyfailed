# AgentEval Development Guide

Codex is the lead coordinator for this project. It owns task decomposition, scope decisions, integration, final verification, and the final handoff. Read `.agents/README.md` before starting work. Select the role prompt that best fits the task, keep the change focused, and verify the affected behavior before handing work back.

Project priorities:

1. Preserve the core product question: did an MCP change alter tool discoverability?
2. Keep scoring deterministic from saved traces.
3. Make artifacts understandable without reading source code.
4. Prefer a small working vertical slice over speculative platform features.

Do not commit secrets, modify unrelated files, or present replay data as a live model run.

## Shared agent coordination

Use `ADMIN-AGENT-CHAT.md` as the visible coordination log whenever work passes between Codex, Claude Code, Fable, or the developer. Add a short structured entry before delegation and after completion. The developer may read or add entries at any time.

## Commit gate

Before every commit, run the adversarial review gate described in `.agents/ADVERSARIAL-REVIEW.md`. Do not bypass it except with an explicit, recorded emergency reason.
