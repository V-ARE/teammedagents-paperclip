# TeamMedAgents Paperclip Adapter

Shipping TeamMedAgents as a first-class citizen of the Paperclip orchestration platform. Phase v0.1 focuses on a pure TypeScript adapter that runs the full TeamMedAgents team as one managed employee.

**📖 Start here:** Read [START.md](START.md) — it is the source of truth for this project.

## Status: Phase 0 ✅ Complete

### What's Done
- ✅ Monorepo scaffolding: `packages/core`, `packages/adapter`, `packages/plugin`
- ✅ TypeScript configuration (`tsconfig.base.json`, strict mode)
- ✅ pnpm workspace setup with root `package.json`
- ✅ Placeholder source files in core and adapter
- ✅ ADR 0001: Pure TypeScript core (no Python service)
- ✅ Example minimal medical case (`examples/minimal-case.json`)
- ✅ `pnpm install` succeeds (2 packages resolved)
- ✅ Reference repo cloned: `paperclip/`
- ✅ `.gitignore` configured for TypeScript/Node.js monorepo

### Blockers for Phase 1
- ⏳ **docs/teammedagent.md** — Copy or link the research repo spec (required to start Phase 1)
- ⏳ **TeamMedAgents repository URL** — Where to get the canonical algorithm and benchmarks
- ⏳ **hermes-paperclip-adapter URL** (optional) — External adapter pattern reference

## Next: Phase 1 — Core Implementation

Implement the TeamMedAgents workflow runtime in `packages/core/` based on the algorithm in `docs/teammedagent.md`. Goal: run one benchmark case end-to-end in TypeScript without any Paperclip code.

Key deliverables:
- Type definitions for workflow state, specialist agents, and case results
- Orchestration logic for deliberation rounds
- Token usage tracking and aggregation
- One passing test case

## Quick Start

```bash
# Install dependencies
pnpm install

# Typecheck all packages
pnpm typecheck

# Build all packages
pnpm build

# Run tests (Phase 1+)
pnpm test
```

## Architecture

```
Paperclip ←→ Adapter ←→ Core (pure TS)
             ↓
      Paperclip conventions
      (session codec, streaming, usage aggregation)
```

- **Core:** Zero Paperclip imports. Generic TS runtime for TeamMedAgents.
- **Adapter:** Thin wrapper handling Paperclip integration (`@paperclipai/adapter-utils`).
- **Plugin:** Deferred to v0.2+ after core and adapter are stable.

## Resources

- [Architecture decision: pure TypeScript core](docs/decisions/0001-ts-core-first.md)
- [Phase milestones and checklist](START.md#9-phases-and-milestones)
- [Non-negotiable principles](START.md#8-non-negotiable-principles)
- [Working session checklist](START.md#12-working-session-checklist)
