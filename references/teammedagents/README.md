# TeamMedAgents Reference

This directory points to the external TeamMedAgents research repository. It is **not vendored** — it is read-only reference material for porting the ICML algorithm into TypeScript.

## Repository Location

**Local path:** `E:\SLM-TeamMedAgents\`

This contains both:
- **paperclip/** — Upstream Paperclip orchestration framework
- **teammedagents/** — The canonical TeamMedAgents ICML implementation

## What to Extract

When porting the algorithm to `packages/core/src/`:

1. **docs/teammedagent.md** — Algorithm specification and workflow. Copy the canonical version of this file into the project's `docs/teammedagent.md`.
2. **Benchmark cases** — Medical reasoning test cases used for evaluation.
3. **Specialist agent prompts** — Role definitions for cardiologist, radiologist, generalist, etc.
4. **Deliberation logic** — Round-based reasoning and consensus mechanisms.

## Usage in This Project

- **Source of Truth:** The TeamMedAgents repo remains the canonical source. Any changes to the core algorithm must be updated here first, then ported to TypeScript.
- **No Imports:** Core code does not import from this repo. It is ported, not wrapped.
- **Reference Only:** Read this repo, document patterns, cite in commit messages, but do not copy code without understanding intent.

## See Also

- [START.md § 2: Architecture](../../START.md#2-architecture-at-a-glance)
- [ADR 0001: Pure TypeScript Core](../../docs/decisions/0001-ts-core-first.md)
