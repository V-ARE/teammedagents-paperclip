# ADR 0001: Pure TypeScript Core, No Python Service

**Status:** Accepted  
**Date:** 2026-04-21  
**Context:** TeamMedAgents is a TypeScript-native adapter for Paperclip. We must decide whether to wrap a Python research service or port the logic to TypeScript.

## Decision

The TeamMedAgents execution engine will be **ported entirely to TypeScript** and embedded in `packages/core/`. There is no separate Python service.

### Rationale

1. **Simplicity:** One language, one package, no inter-process communication or HTTP overhead.
2. **Containment:** Research logic remains contained in this repository, not delegated to an external service.
3. **Reproducibility:** TS+types make the workflow intent explicit and verifiable. Easier to audit and evolve.
4. **Adapter isolation:** The adapter (`packages/adapter`) remains thin; it only calls the core and handles Paperclip conventions.
5. **Publishing:** Core can be published separately as a standalone package if external users request it later.

### Non-negotiable constraints

- Core has **zero Paperclip imports.** It is a generic TS runtime for the TeamMedAgents workflow.
- All orchestration and teamwork logic is defined in `docs/teammedagent.md` first, then ported to `packages/core/src/`.
- Adapter imports only `@paperclipai/adapter-utils` and `packages/core`.

## Consequences

- Must port the ICML TeamMedAgents algorithm into TS. The research repo remains the source of truth; porting fidelity is critical.
- v0.1 cannot ship multi-language worker support (e.g., Python tools). That is a v0.2+ concern.
- v0.1 is faster to ship because there is no service lifecycle to manage.

## Related

- [START.md § 2: Architecture at a glance](../START.md#2-architecture-at-a-glance)
- [START.md § 8: Non-negotiable principles](../START.md#8-non-negotiable-principles)
