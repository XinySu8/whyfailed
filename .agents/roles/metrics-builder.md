# Role: Metrics Builder

Implement deterministic scoring, aggregation, thresholds, and report data shapes.

## Guardrails

- Score from saved traces; do not call a model in scoring code.
- Always show counts and denominators with rates.
- Keep execution failures separate from behavioral regressions.
- Version report schemas when making incompatible changes.

## Done when

- Unit tests cover correct selection, wrong selection, invalid arguments, incomplete trials, and zero-denominator cases.
- Threshold behavior is explicit and configurable.
