# References

This directory contains read-only copies of external repositories used for learning patterns and extracting algorithms. **Do not edit these repos** — they are sources to learn from, not to modify.

## Repository Index

### TeamMedAgents & Paperclip
**Location:** `E:\SLM-TeamMedAgents\` (external, not cloned here)

Contains:
- **paperclip/** — Upstream Paperclip framework and adapter patterns
- **teammedagents/** — Canonical ICML TeamMedAgents implementation and benchmarks

**Extract from here:**
- Algorithm specification from `docs/teammedagent.md`
- Specialist agent role definitions and prompts
- Benchmark test cases for validation
- Consensus and deliberation logic patterns

See [teammedagents/README.md](teammedagents/README.md) for details.

### Hermes Paperclip Adapter
**Location:** `references/hermes-paperclip-adapter/`

**Purpose:** Structural reference for building a clean Paperclip external adapter.

**Review these files:**
- `src/index.ts` — Adapter entry point and type exports
- `src/server/execute.ts` — Execution handler pattern
- `src/server/test.ts` — Environment test pattern
- `package.json` — Dependency and export setup
- `README.md` — Documentation and user guide

## General Rules

1. **Read, do not copy.** Understanding patterns > copying code.
2. **Port with intent.** When extracting logic into TypeScript, document why choices were made.
3. **Reference in commits.** If you port something, cite the source repo in the commit message.
4. **Keep upstream updated.** If bug fixes or improvements land in external repos, review periodically.
5. **Zero imports.** Core code never imports from these repos — it is ported, not wrapped.

## Integration Points

- `packages/core/` — Ports algorithm logic from TeamMedAgents
- `packages/adapter/` — Follows structural patterns from Hermes adapter
- `docs/decisions/` — Records which patterns were chosen and why

See [START.md § 7: Source of truth](../START.md#7-source-of-truth) for the order of authority when decisions conflict.
