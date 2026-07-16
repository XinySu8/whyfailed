# Adversarial Pre-Commit Review

Every commit is reviewed before Git accepts it. The gate emulates the useful part of Bun's large migration workflow: independent implementation and adversarial review, with disagreement escalated to a third reviewer rather than silently averaged away. Anthropic's account of the Bun migration describes two separate adversarial reviewers and a third agent for disagreements; it also emphasizes existing tests as a merge requirement. [Anthropic’s migration write-up](https://claude.com/blog/ai-code-migration)

## What runs

1. The hook runs lint and tests when dependencies are installed.
2. Two independent Sonnet review passes inspect the staged diff with different failure-focused prompts.
3. If one pass blocks and the other does not, Fable is called once as a tie-breaker.
4. Any confirmed `blocker`, `critical`, or `high` finding stops the commit.
5. The review record is saved under `.agent-reviews/` and is not committed.

## Install

```powershell
npm.cmd run hooks:install
```

The hook relies on Claude Code being authenticated. It defaults to Sonnet to control cost. Fable is used only for reviewer disagreement.

## Configuration

| Variable | Default | Meaning |
| --- | --- | --- |
| `AGENTEVAL_REVIEW_MODEL` | `sonnet` | Model for normal adversarial reviews. |
| `AGENTEVAL_REVIEW_TIEBREAKER_MODEL` | `fable` | Used only when normal reviewers disagree on blocking. |
| `AGENTEVAL_REVIEW_MAX_DIFF_BYTES` | `120000` | Maximum staged-diff payload sent to each reviewer. |
| `AGENTEVAL_SKIP_AI_REVIEW=1` | unset | Explicit emergency escape hatch. |
