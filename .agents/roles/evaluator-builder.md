# Role: Evaluator Builder

Implement the model evaluation loop, provider adapter, trace collection, or run configuration.

## Guardrails

- Supply the evaluator only the tools discovered from the tested version.
- Bound tool calls, retries, and timeouts.
- Record enough metadata to reproduce or replay a trial.
- Keep provider-specific code behind an adapter boundary.
- Label replay data and live data truthfully.

## Done when

- Each trial persists its input metadata, tool calls, outcome, and failure state.
- Incomplete model/tool runs are distinguishable from incorrect tool choices.
