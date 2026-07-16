# AgentEval Technical Outline

## Product goal

AgentEval detects whether a change to an MCP server makes an AI agent less able to discover and correctly use a tool. It runs the same representative user intents against a **baseline** and a **candidate** version of an MCP server, then creates a behavior-diff report developers can use in local development or continuous integration.

The product answers a focused question:

> Did this MCP change reduce the likelihood that an agent selects the intended tool and supplies valid first-call arguments?

## Primary workflow

1. A developer defines a small intent suite for a capability they care about.
2. AgentEval starts the baseline and candidate MCP servers in isolated local processes.
3. It discovers the tools and schemas exposed by each server.
4. An evaluation agent receives each intent and the discovered tools, then is allowed to make tool calls.
5. AgentEval saves the trace, scores the first tool choice and arguments, and aggregates results across repeated trials.
6. It renders a behavior diff and returns an appropriate process exit code for local or CI use.

Example command:

```bash
agenteval compare \
  --baseline "git:main" \
  --candidate "git:HEAD" \
  --suite intents/travel-policy.yaml \
  --output artifacts/agent-eval
```

## System architecture

```text
                   +------------------+
                   | Intent suite     |
                   | + prompt variants|
                   +--------+---------+
                            |
                            v
+------------------+   +----+-----------------+   +-------------------+
| Baseline MCP     |-->| MCP process manager  |-->| Tool discovery     |
| server           |   | + isolated transport |   | + schema snapshot  |
+------------------+   +----------------------+   +---------+---------+
                                                               |
+------------------+   +----------------------+                v
| Candidate MCP    |-->| MCP process manager  |        +-------+--------+
| server           |   | + isolated transport |        | Evaluator      |
+------------------+   +----------------------+        | agent runtime  |
                                                        +-------+--------+
                                                                |
                                                                v
                                                        +-------+--------+
                                                        | Trace collector|
                                                        | + scorer       |
                                                        +-------+--------+
                                                                |
                                                                v
                                                        +-------+--------+
                                                        | Aggregator &   |
                                                        | behavior diff  |
                                                        +-------+--------+
                                                                |
                                                   +------------+------------+
                                                   v                         v
                                            Terminal/JSON report       HTML report
```

### Core components

| Component | Responsibility |
| --- | --- |
| CLI | Parses configuration, starts a run, writes artifacts, and provides a CI-safe exit code. |
| Server adapter | Starts or connects to an MCP server and manages lifecycle, timeouts, and isolation. |
| MCP discovery client | Retrieves `tools/list` definitions and preserves names, descriptions, and input schemas. |
| Intent-suite loader | Loads intents, expected tools, prompt variants, argument rules, and success predicates. |
| Evaluator runtime | Sends the intent plus available tools to the configured model and executes allowed MCP calls. |
| Trace collector | Records model input metadata, tool definitions, choices, arguments, tool responses, timings, and errors. |
| Scorer | Determines whether the first tool was intended and whether its arguments were valid. |
| Aggregator | Computes counts, rates, deltas, thresholds, and trace groupings for each intent and version. |
| Reporter | Produces machine-readable JSON and human-readable terminal/HTML behavior-diff reports. |

## Functional requirements

### MCP comparison

- Launch a baseline and candidate server from independent commands, working trees, container images, or equivalent local targets.
- Support MCP tool discovery through the standard tool-list operation.
- Keep each server version isolated: separate process, environment, transport connection, and artifact directory.
- Fail clearly when either server cannot start, initialize, or expose the expected tools.
- Save a snapshot of discovered tool definitions for every evaluated version.

### Evaluation execution

- Execute every configured intent for both server versions.
- Support meaning-preserving prompt variants and repeated runs for each variant.
- Supply the evaluator with only the tools discovered from the version under test.
- Permit normal MCP tool calls, with configurable maximum calls, timeout, and retry behavior.
- Record the complete evaluation trace, including the first tool choice.
- Support a live model mode and a replay mode using captured traces.

### Scoring

- Score intended-tool selection on the first tool call.
- Validate first-call arguments against the discovered JSON Schema and optional suite-specific rules.
- Measure tool calls before a deterministic validated outcome when the suite provides a success predicate.
- Keep raw trial results available; do not reduce results to an unexplained pass/fail result.
- Flag a regression only when configurable reliability and delta thresholds are both met.

### Reporting

- Print a compact comparison summary to the terminal.
- Write a JSON report intended for CI, scripts, and later integrations.
- Write an HTML report with per-intent metrics and trace drill-down.
- Include trial counts, rates, deltas, thresholds, tool snapshots, and links or paths to trace artifacts.
- Clearly mark replay output as replayed rather than live.

## Non-functional requirements

- **Reproducibility:** persist model identifier, run configuration, prompt-variant IDs, tool snapshots, timestamps, and random seed when available.
- **Reliability:** use bounded timeouts and make partial failures visible without silently changing the denominator.
- **Safety:** run only developer-supplied local server commands; redact configured secrets from artifacts and logs.
- **Cost control:** allow quick profiles with fewer trials and full profiles with a fixed, visible run count.
- **Portability:** support local development first; keep interfaces compatible with GitHub Actions and other CI systems.
- **Observability:** emit structured events/logs for server lifecycle, model calls, tool calls, scoring, and report generation.

## Configuration contract

An intent suite is the durable contract between a team and AgentEval. It defines what successful discovery means for a capability.

```yaml
suite: travel-policy
version: 1
defaults:
  variants_per_intent: 6
  repetitions: 4
  max_tool_calls: 3
  timeout_seconds: 30
intents:
  - id: international-travel-policy
    prompt: Find the company policy for international business travel.
    variants:
      - What are the rules for employees traveling abroad on business?
      - Show me our international work-trip policy.
    expected_first_tool: find_travel_policy
    argument_rules:
      - path: $.scope
        equals: international
    success:
      tool: find_travel_policy
      response_contains: International business travel
```

Minimum required fields are an intent identifier, a prompt, and an expected first tool. Variants, argument rules, and outcome validation are optional but recommended for meaningful coverage.

## Artifact formats

Suggested run directory:

```text
artifacts/agent-eval/2026-07-16T142500Z/
  config.resolved.yaml
  baseline.tools.json
  candidate.tools.json
  trials.jsonl
  scores.json
  report.json
  report.html
```

### Trial record

Each line in `trials.jsonl` represents one intent/variant/repetition/version evaluation.

```json
{
  "run_id": "2026-07-16T142500Z",
  "version": "candidate",
  "intent_id": "international-travel-policy",
  "variant_id": "v2",
  "repetition": 3,
  "model": "configured-model-id",
  "first_tool": "search_docs",
  "first_arguments": {"query": "international business travel"},
  "first_arguments_valid": true,
  "expected_first_tool": "find_travel_policy",
  "intended_tool_selected": false,
  "tool_call_count": 2,
  "validated_outcome": false,
  "status": "completed",
  "duration_ms": 1840
}
```

## Metrics and decision rules

For each intent and server version, AgentEval calculates:

| Metric | Definition |
| --- | --- |
| Correct-tool discoverability | Trials whose first tool call matches the expected tool ÷ completed trials. |
| Valid first-call arguments | Trials with schema-valid and rule-valid first-call arguments ÷ completed trials. |
| Calls before validated outcome | Number of calls made before the configured deterministic success predicate is met. |
| Delta | Candidate metric minus baseline metric; lower discoverability and argument validity are regressions. |

Default product policy:

- Flag a discoverability regression if the candidate declines by at least 25 percentage points **and** falls below a 75% reliability floor.
- Always display counts and denominators, e.g. `14/24 (58%)`, alongside rates.
- Treat tool/runtime failures as separately reported execution failures, not evidence of model discoverability by default.

## Integration points

### Local development

Developers run AgentEval before changing tool descriptions, names, schemas, or routing behavior.

```bash
agenteval compare --baseline "npm run mcp:main" --candidate "npm run mcp:local" --suite intents/
```

The terminal report identifies affected intents and points to the HTML trace details.

### Continuous integration

CI invokes the CLI after building the application and makes the JSON/HTML artifacts available on the job. A nonzero exit code can block a merge only for configured regression thresholds.

```yaml
- name: Evaluate MCP discoverability
  run: agenteval compare --baseline "$BASELINE_CMD" --candidate "$CANDIDATE_CMD" --suite intents/ --ci

- name: Upload AgentEval report
  uses: actions/upload-artifact@v4
  with:
    name: agent-eval-report
    path: artifacts/agent-eval/**
```

An optional later integration can turn `report.json` into a pull-request check or comment. The CLI and artifact format must remain useful without that integration.

### Model provider

The evaluator runtime is provider-adapted. The initial adapter uses the selected OpenAI model and its tool-calling interface. The adapter boundary should accept:

- system/developer instruction text;
- user intent;
- discovered MCP tool definitions;
- tool-call execution results; and
- execution limits.

This keeps AgentEval’s scorer and reporter independent from a specific provider while preserving the product’s focus on observable tool-use behavior.

### MCP server targets

Initial support should cover local stdio-launched MCP servers. A target abstraction can later add remote transports or containerized targets without changing intent suites or report formats.

## Recommended implementation boundaries

```text
src/
  cli/             command parsing and exit codes
  config/          suite/config loading and validation
  mcp/             server lifecycle, transport, discovery, tool invocation
  evaluator/       model-provider adapter and execution loop
  tracing/         trace event types and artifact writer
  scoring/         deterministic scoring and schema validation
  reporting/       aggregation, terminal, JSON, and HTML reports
  domain/          shared types for suites, trials, metrics, and runs
tests/
  unit/            scoring, aggregation, config, reporting
  integration/     demo MCP servers and end-to-end replay runs
fixtures/          tool snapshots and captured replay traces
```

Key rule: evaluation execution may be model-dependent, but scoring and aggregation must be deterministic from saved traces.

## Failure handling

| Failure | Expected behavior |
| --- | --- |
| Server does not start | Stop that comparison, preserve diagnostics, and return an execution-failure code. |
| Tool discovery differs unexpectedly | Report added, removed, and changed tool definitions before scoring results. |
| Model request fails | Mark the trial as failed; retain it in artifacts and report it separately from scored trials. |
| Tool call times out | Mark the trial incomplete; do not silently count it as a wrong tool choice. |
| Invalid suite | Validate before starting servers and show the intent/path that must be corrected. |
| No baseline or candidate completed trials | Do not calculate a behavioral delta; return an inconclusive result. |

## End state

The finished product is a developer-facing reliability check for MCP tool discoverability. A team can add a compact intent suite next to its MCP server, run one command locally or in CI, and receive a concrete answer such as:

```text
find_travel_policy
Discoverability: 23/24 (96%) → 14/24 (58%)  [-38 pts]
Status: REGRESSION
Evidence: 9 candidate trials selected search_docs first.
```

That output connects a source-level MCP change to an observable change in agent behavior, with enough trace evidence for a developer to diagnose and fix it.
