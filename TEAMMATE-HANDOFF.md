# AgentEval New-Account Handoff

Welcome. This repository is being built from the two product documents into a local, developer-facing MVP for detecting MCP tool-discoverability regressions. This handoff is designed for a teammate using a new Codex account, a new Claude Code account, and a new OpenAI API account.

## What transfers and what does not

The repository transfers: source, documentation, agent roles, intent suites, hooks, and the visible admin chat.

The following do **not** transfer and must be configured by the new user: Codex app automations, Codex thread history, Claude Code login/session/quota, OpenAI API key and billing, local Git hook activation, installed dependencies, and any local `.env` file. Never copy another person's API key, Claude session, or account cookies.

## Start here

1. Read [`AGENTS.md`](AGENTS.md) for project rules and ownership.
2. Read [`ADMIN-AGENT-CHAT.md`](ADMIN-AGENT-CHAT.md) for the visible coordination history.
3. Read [`AgentEval-Technical-Outline.md`](AgentEval-Technical-Outline.md) for the target architecture and requirements.
4. Read [`AgentEval-Final-Hackathon-Proposal.md`](AgentEval-Final-Hackathon-Proposal.md) for the product story and demo goals.

## Current state

The repository now contains the initial project contract only:

- `package.json` defines a Node.js ESM CLI project and runtime dependencies.
- `.env.example` is the only configuration a developer should need for live model evaluation.
- `intents/travel-policy.yaml` is the first deterministic intent suite.
- `.agents/` contains role prompts and a collaboration playbook.
- `ADMIN-AGENT-CHAT.md` is the shared visible handoff log.

Dependency installation was intentionally stopped before completion so the workspace could be handed over cleanly. There is no application code yet; `src/` and `demo/` still need to be created.

## New-account setup

1. Clone or open this repository in the new user's Codex desktop app.
2. Install a supported Node.js version (20 or later), Claude Code, and Git.
3. Sign in to Claude Code using the new user's account. Confirm `claude --version` works.
4. Create an OpenAI API key under the new user's account; do not place it in a chat message or commit it.
5. Complete the local setup below.

## Resume commands

PowerShell execution policy can block `npm`; use `npm.cmd`:

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd run hooks:install
```

Replay mode must work without `.env`. Live mode requires setting `OPENAI_API_KEY` in `.env`; the configured model defaults to `gpt-5.6` and may be changed with `AGENTEVAL_MODEL`.

Before starting autonomous work, run the no-key replay path once after it exists. Do not test live mode until the new user has added their own `OPENAI_API_KEY` to `.env`.

## Recreate autonomous continuation

The previous Codex automation is account-local and will not follow this repository. The new user must create a new recurring local Codex automation from their own app, targeting this repository. Configure it to:

- run at a modest recurring interval;
- use a cost-conscious Codex coordinator;
- read `AGENTS.md`, this handoff, and `ADMIN-AGENT-CHAT.md` first;
- use Sonnet for normal Claude Code tasks and reserve Fable for difficult architectural reviews or review tie-breakers;
- stop a run after one bounded task, log outcomes, and retry later after Claude quota/rate-limit failures;
- run tests and the adversarial review gate before committing;
- never expose secrets, change account credentials, purchase usage, deploy, publish, force-push, or bypass the review gate.

The new user should review and approve the automation prompt in their own Codex app before enabling it.

## Recommended build order

1. Install dependencies and create `src/` and `demo/`.
2. Build the deterministic core first: suite loader, trace types, scorer, aggregation, JSON/terminal/HTML reporters, and unit tests.
3. Add the demo MCP server with baseline/candidate tool descriptions and local stdio transport.
4. Add replay mode with checked-in captured trial fixtures; make this the default demo path.
5. Add live mode behind `OPENAI_API_KEY`, using real MCP tool discovery and a configurable model.
6. Build the `agenteval compare` CLI, update README instructions, and run the full test suite.

## Acceptance criteria for the MVP

- `agenteval compare --mode replay --suite intents/travel-policy.yaml` works with no API key.
- It produces terminal, JSON, and HTML behavior-diff output.
- The report shows raw trial counts, rates, deltas, thresholds, and wrong-tool trace evidence.
- Baseline and candidate MCP tool definitions are discovered and saved independently in live mode.
- Live mode uses only environment variables for credentials/configuration.
- Scoring and aggregation are deterministic from saved traces and covered by tests.
- The README includes install, replay, live, and CI usage.

## Working with Codex and Claude Code

Codex is the lead coordinator. Before delegating work or taking a new task, add a concise entry to `ADMIN-AGENT-CHAT.md` using its template. Keep file ownership non-overlapping, record validation commands, and do not present replay output as live output.

For Claude Code, prefer Sonnet for routine implementation. Use Fable only for short architecture or difficult-debugging reviews, and record the resulting recommendation in the admin chat.

## Account readiness checklist

- [ ] New Codex account can open this repository and create its own automation.
- [ ] `node --version` reports Node 20 or newer.
- [ ] `npm.cmd install` completes and creates a lockfile.
- [ ] `claude --version` works while signed into the new Claude account.
- [ ] `npm.cmd run hooks:install` configures the local pre-commit hook.
- [ ] `.env` exists locally, is ignored by Git, and contains only the new user's OpenAI key/model settings.
- [ ] `ADMIN-AGENT-CHAT.md` contains a fresh entry naming the new lead and the first task.

## Known caveat

This is a fresh scaffold. Validate the exact current APIs of `@modelcontextprotocol/sdk` and the OpenAI SDK while implementing the live evaluator rather than assuming the proposal's pseudocode is an executable integration.
