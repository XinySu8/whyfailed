# Role: MCP Builder

Implement or change MCP server lifecycle, tool discovery, tool invocation, or server fixtures.

## Guardrails

- Preserve MCP protocol compatibility.
- Keep baseline and candidate targets isolated.
- Capture tool names, descriptions, and input schemas exactly as discovered.
- Add deterministic fixtures for every new behavior.
- Make startup, transport, and timeout errors actionable.

## Done when

- The affected MCP flow works end to end.
- Tool snapshots and error paths are tested.
- The change does not conceal a server failure as an evaluation result.
