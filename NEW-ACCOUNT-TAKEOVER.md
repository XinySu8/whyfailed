# New Account Takeover Guide

Use this guide when a different person takes over AgentEval with their own Codex, Claude Code, and OpenAI accounts.

## 1. Open the repository

Open the repository root in the new user's Codex desktop app. Read these files in order:

1. `TEAMMATE-HANDOFF.md`
2. `AGENTS.md`
3. `ADMIN-AGENT-CHAT.md`
4. `AgentEval-Technical-Outline.md`

The authoritative implementation status is in `TEAMMATE-HANDOFF.md`; the admin chat is an audit trail, not a source of secrets or credentials.

## 2. Set up accounts locally

Each person uses their own account and local secrets:

| Service | New-user action | Repository location |
| --- | --- | --- |
| Codex | Sign in through the Codex app; create any automation from that account. | No token stored in the repository. |
| Claude Code | Install/sign in; verify the `claude` command works. | No token/session stored in the repository. |
| OpenAI API | Create an API key; set it in a local `.env`. | `.env` is ignored; use `.env.example` as the template. |
| Git | Configure name/email for the new user and enable the repo hook. | Run `npm.cmd run hooks:install`. |

## 3. Verify the machine before assigning agents

```powershell
node --version
claude --version
npm.cmd install
npm.cmd run hooks:install
git status
```

Do not start live evaluation until replay mode and the unit tests pass. The currently committed project contract is a scaffold; application modules still need implementation according to the build order in `TEAMMATE-HANDOFF.md`.

## 4. Resume safely

Create a new entry at the top of `ADMIN-AGENT-CHAT.md` with the new lead, current date, and the first bounded task. Then have Codex coordinate the work using `.agents/` roles. Claude Code should receive only non-overlapping tasks and report changed files, commands run, and risks back into the admin chat.

## 5. Set up autonomous continuation

Create a new account-owned Codex automation rather than attempting to reuse a previous user's automation. It should run in this repository, use an economical coordinator, make one bounded task attempt per cycle, and interpret Claude quota/rate-limit errors as a pause condition. It should retry on later cycles and preserve the next task in the admin chat.

Do not authorize the automation to change account credentials, buy usage, deploy, publish packages, delete data, force-push, or bypass the adversarial commit gate.

## 6. Copy-paste starter prompt for the new Codex

Paste this as the first message in the new Codex task after opening the repository:

```text
You are taking over the AgentEval repository at [REPOSITORY PATH]. You are the lead coordinator and may edit files, install project dependencies, run tests, use Claude Code for bounded non-overlapping tasks, and create commits only after the adversarial pre-commit review passes.

First read these files completely, in order:
1. TEAMMATE-HANDOFF.md
2. AGENTS.md
3. .agents/README.md
4. .agents/ADVERSARIAL-REVIEW.md
5. ADMIN-AGENT-CHAT.md
6. AgentEval-Technical-Outline.md
7. AgentEval-Final-Hackathon-Proposal.md

This is a new Codex, Claude, and OpenAI account. Do not rely on any previous account's automation, Claude session, API key, local .env, or Git settings. Never request or copy another user's credentials.

Setup:
- Confirm Node 20+, Git, and Claude Code are available.
- Run `npm.cmd install` on Windows PowerShell, then `npm.cmd run hooks:install`.
- Copy `.env.example` to `.env` only if the new owner has supplied their own OpenAI API key. Replay mode must work without a key.
- Add a new takeover entry to ADMIN-AGENT-CHAT.md naming yourself as the lead and stating the first task.

Build objective:
Finish the focused AgentEval MVP described in the product and technical documents: a local CLI that compares baseline and candidate MCP servers; deterministic replay mode; demo baseline/candidate travel-policy MCP targets; intent suite loading; trace capture; deterministic scoring and aggregation; terminal, JSON, and HTML behavior-diff reports; optional live OpenAI evaluation using only .env configuration; tests; and clear README instructions.

Build order:
1. Install dependencies and inspect the actual current SDK APIs.
2. Implement the deterministic core and tests first.
3. Add replay mode and a no-key end-to-end demo.
4. Add demo MCP targets and local discovery.
5. Add optional live OpenAI/MCP evaluation.
6. Finish reporting, README, and final verification.

Agent policy:
- Codex is the lead and owns final integration and verification.
- Use Sonnet for normal Claude Code implementation/review tasks.
- Use Fable only for a difficult architecture/debugging deadlock or an adversarial-review tie-breaker.
- Assign one owner per file/module at a time. Require every worker to report changed files, commands run, results, and risks in ADMIN-AGENT-CHAT.md.
- If Claude hits quota/rate-limit/auth/model-availability errors, record a paused checkpoint and retry later; do not repeatedly burn usage in the same run.
- Before each commit, run the adversarial review gate. Do not bypass it except with an explicitly recorded emergency reason.

Safety boundaries:
- You may edit, test, install project dependencies, and commit verified milestones.
- Do not change account credentials, buy/upgrade usage, deploy, publish packages, delete user data, force-push, or bypass review safeguards.
- Never commit .env files, keys, tokens, traces marked live without proof, or fabricated model results.

Start by inspecting the current repository state, add your takeover entry to the admin chat, state the next smallest implementation milestone, and implement it with tests. Keep going until the MVP acceptance criteria in TEAMMATE-HANDOFF.md are satisfied.
```
