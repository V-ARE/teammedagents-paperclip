# START.md — teammedagents-paperclip

Source of truth for this project. Read this file before every coding session.

**ALWAYS ask for clarity:** The algorithms involved are complex, and we aim to build a general-purpose paperclip adapter. If anything needs a tweak or is ambiguous, stop and ask the user before making major assumptions.

## 1. Goal
Ship TeamMedAgents as a first-class citizen of the Paperclip ecosystem in **two surfaces, built in sequence, not in parallel**:

- **v0.1 — Adapter (this milestone).** Paperclip runs the full TeamMedAgents team as one managed employee. One task in, one structured deliberation out. The ICML algorithm stays canonical; Paperclip gets a clean cost/usage/transcript contract.
- **v0.2+ — Plugin (deferred).** Teamwork middleware that decorates arbitrary Paperclip agent workflows with selective components (leadership, trust, monitoring). Only started after v0.1 ships and the core API has stabilized through real use.

The plugin is strategically valuable but structurally more expensive than the adapter. Adapter first keeps the research artifact intact and gives a shippable deliverable in 1 to 2 weeks. Plugin decisions come after the core abstractions have been exercised by real adapter runs.

## 2. Architecture at a glance
```text
+--------------------+   spawn+HTTP    +-----------------------------+
|  Paperclip server  | <-------------> |  Pure TS TeamMedAgents      |
|  (TypeScript)      |                 |  core + worker runtime      |
|                    |                 |  (no Python service)        |
|                    |                 +-----------------------------+
|  adapter/ execute()                               ^
|     |                                             |
|     v                                             |
|  core/ typed runtime --------------------- canonical TeamMedAgents
|                                           workflow logic ported from
|                                           teammedagent.md into TS
+--------------------+
```

Three boundaries matter:

- **Research logic becomes TypeScript.** The TeamMedAgents workflow is ported into `packages/core` and remains the source of truth in this repo.
- **Core is a thin TS runtime + types.** It is not a reimplementation of Paperclip; it is the TeamMedAgents execution engine and data model.
- **Adapter is a thin Paperclip wrapper around core.** It handles Paperclip conventions: env vars, session codec, transcript shapes, usage aggregation, config doc.

## 3. What this repo is and is not
**Is:**

- The development home for the Paperclip adapter, the deferred plugin, and a shared TS core.
- The publishing origin for any npm package derived from this work.
- The design record for architectural decisions (see `docs/decisions/`).

**Is not:**

- A fork of Paperclip.
- A Python runtime wrapper service.
- A place for experiments that are not reproducible.
- A place for UI components. The Paperclip run viewer is the UI.

## 4. Prerequisites
Check each one before starting:

- Git installed.
- Node.js 20 or higher. Run `node -v`.
- pnpm 9.15 or higher. Run `pnpm -v`.
- TeamMedAgents research repo cloned locally and runnable end to end on at least one benchmark case.
- At least one LLM provider API key for the research logic (Anthropic, OpenAI, or whatever TeamMedAgents is wired to).
- Reference repos cloned as read-only siblings (see section 5).
- A working local Paperclip dev instance, if you want to verify adapter behavior early.

## 5. Reference repos
Cloned as siblings to this repo, never edited, read only:

- `paperclip/` — upstream orchestration layer. Read `docs/adapters/` and `packages/adapters/claude-local/` as the canonical in-tree pattern. Read `packages/adapters/gemini-local/` for skill injection and model detection patterns.
- `hermes-paperclip-adapter/` — the cleanest external adapter published. Mirror its package structure, not its code.
- `TeamMedAgents/` — the ICML research repo. The source of truth for behavior.

Do not vendor any of these. Read them, reference them in commits, do not copy.

## 6. Repo layout
```text
teammedagents-paperclip/
  START.md                  - this file
  README.md                 - one paragraph plus a link here
  package.json              - pnpm workspace root
  pnpm-workspace.yaml
  tsconfig.base.json
  .nvmrc                    - node 20
  .gitignore
  packages/
    core/                   - TS types and TeamMedAgents runtime
    adapter/                - Paperclip adapter (v0.1 target)
    plugin/                 - deferred placeholder, README only
  docs/
    decisions/              - ADRs, one file per decision
    teammedagent.md         - behavior spec copied from research repo
  examples/
    minimal-case.json       - sample input for manual testing
```

## 7. Source of truth
Consult in this order, always:

1. `docs/teammedagent.md` — behavior spec.
2. `docs/decisions/*.md` — locked architectural decisions.
3. Paperclip docs/adapters/creating-an-adapter.md and external-adapters.md on master.
4. `@paperclipai/adapter-utils` types, current npm version.
5. `hermes-paperclip-adapter` as structural reference.

If any of these disagree, the local `docs/decisions/` entries win. If no decision exists, write one before coding.

## 8. Non-negotiable principles

- **Adapter before plugin.** No work on the plugin surface in v0.1.
- **Research logic is canonical.** Port the TeamMedAgents workflow into TypeScript; do not keep a Python service in this repo.
- **No Paperclip core changes.** Everything lives as an external package.
- **Core has zero Paperclip imports.** Adapter is the only layer that touches `@paperclipai/adapter-utils`.
- **All secrets via env, never in prompts or config values the model sees.**
- **All IO serializable as JSON.** Sessions, transcripts, case results, config.
- **One small change per commit.** Tests pass after each.
- **Parse agent output as untrusted.** Validate shapes, never eval, never forward commands or URLs blindly.
- **Model-Agnostic Design:** The adapter must work seamlessly with any API key provider (e.g., OpenAI, Anthropic, Grok, Google AI Studio, Gemma, etc.). Users have the power to pick their own models (light model, heavy model, image-capable model) when providing API keys.
- **Verified Model Support Matrix (April 2026):** The adapter safely supports and automatically resolves endpoints for:
   - *Google Cloud Vertex AI:* Natively routes directly to your enterprise GCP project endpoints via OAuth tokens.
   - *Google AI Studio:* `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.5-flash-lite`
   - *OpenAI:* `gpt-5.4`, `gpt-5.4-pro`, `gpt-5.4-mini`
   - *Anthropic:* `claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5`
- **Multimodal & Tiered Setup:** Support routing simple agentic collaboration to a small/light model and critical reasoning to a heavy model. Provide graceful, seamless support for image-capable models if the input contains images.
- **Flexible Inputs & Outputs:** The algorithm must be updated to accept open-ended questions (not just Question + MCQ) alongside an optional expected output. It should also accept an optional context input (e.g., case histories, graphs, charts, or output from web agents) to help curate answers.
- **Configurable Execution:** The team collaboration aspect must be user-configurable, allowing users to specify sequential-only or parallel-where-possible execution flows.
- **Comprehensive Tracing:** Properly document traces for each phase and the total span, including token counts, latency, and detailed descriptions.
- **Robustness:** Gracefully handle all API calls with retries and comprehensive error handling.

## 9. Phases and milestones

### Phase 0 — Pre-flight (this session, before any package code)
- [ ] Confirm prerequisites in section 4.
- [ ] Clone the reference repos from section 5.
- [ ] Run Paperclip locally once, if possible, and confirm the API health endpoint.
- [ ] Create this repo with the layout in section 6.
- [ ] Commit `START.md`, `README.md`, empty workspace config, and `docs/decisions/0001-ts-core-first.md` capturing the TS-core-first decision.
- [ ] Copy or symlink `teammedagent.md` from the research repo into `docs/`.

Phase 0 is done when `pnpm install` at the repo root succeeds and the package directories exist with placeholder `package.json` files.

### Phase 1 — TS core for TeamMedAgents
Goal: give the adapter one native runtime that executes TeamMedAgents entirely in TypeScript.

- [ ] Scaffold `packages/core/` with a minimal, testable implementation.
- [ ] Define the core types and workflow state.
- [ ] Port the TeamMedAgents orchestration logic from `docs/teammedagent.md`.
- [ ] Implement a single `runCase()` entry point that returns a structured `CaseResult`.
- [ ] Add unit tests for each teamwork component and the end-to-end execution path.
- [ ] Document the request/response JSON schema in `packages/core/README.md`.

Phase 1 is done when a benchmark case can run end to end in TS and return a structured result without any Paperclip code involved.

### Phase 2 — Paperclip adapter (v0.1 deliverable)
Goal: a functioning external adapter that shows up in the Paperclip UI as a hireable agent type.

Follow the structure in `hermes-paperclip-adapter` and the contract in the Paperclip adapter docs.

- [ ] `packages/adapter/src/index.ts` exports `type = "teammedagents_local"`, `label`, `models`, `agentConfigurationDoc`.
- [ ] Write `agentConfigurationDoc` as routing logic: when to use, when not to use, safety note.
- [ ] `server/execute.ts`: call the TS core, stream turns to `onLog`, aggregate usage, return `AdapterExecutionResult`.
- [ ] `server/test.ts`: check runtime health, required env keys, at least one model configuration.
- [ ] `server/parse.ts`: map internal events to adapter-structured events. Untrusted-input discipline.
- [ ] `server/index.ts`: export `execute`, `testEnvironment`, `sessionCodec`. v0.1 session codec is minimal — cases are one-shot; `clearSession: true` by default.
- [ ] `ui/parse-stdout.ts`: emit `TranscriptEntry` shapes that make specialists, shared-mental-model updates, monitoring flags, and the final consensus render cleanly in the run viewer.
- [ ] `ui/build-config.ts`: turn the create-agent form values into adapterConfig JSON.
- [ ] `cli/format-event.ts`: colored terminal output for `paperclipai run --watch`.
- [ ] Register locally via `~/.paperclip/adapter-plugins.json` for dev.
- [ ] Exercise end to end: create an agent of type `teammedagents_local` in the local Paperclip UI, assign it a case, watch it run.

Phase 2 is done when a fresh Paperclip user can install the adapter, create an agent, and run one benchmark case to completion through the UI.

### Phase 3 — Plugin (deferred, not started until Phase 2 is stable)
Re-evaluate here. The questions to answer before starting Phase 3:

- Did the core API hold up across several real adapter runs, or did it mutate?
- Are there specific teamwork components that real Paperclip users asked for at the workflow level rather than the per-case level?
- Is there enough time budget to justify the scope?

If yes, scaffold `packages/plugin/` following the `@paperclipai/plugin-sdk` contract. First plugin features, in order:

- [ ] Settings page for per-team component toggles.
- [ ] Tool `generate_leadership_plan`.
- [ ] Tool `sync_shared_mental_model`.
- [ ] Tool `score_teamwork`.
- [ ] Small dashboard panel showing active components and current trust scores.

If no, write an ADR explaining the deferral and revisit later.

## 10. Definition of done — v0.1
Milestone is shippable when all of the following are true:

- [ ] Core and adapter packages build cleanly with `pnpm -r build`.
- [ ] `pnpm -r typecheck` passes.
- [ ] Local Paperclip instance can install the adapter via `~/.paperclip/adapter-plugins.json`.
- [ ] An agent of type `teammedagents_local` runs one case in the Paperclip UI and the transcript renders with per-specialist turns.
- [ ] Cost and token usage are reported and match the adapter’s own accounting within 1 percent.
- [ ] Adapter README documents install, config, models, and a sample case.
- [ ] One ADR exists per locked architectural decision.
- [ ] No secret values appear anywhere in `adapterConfig`, prompts, or logs.

Not required for v0.1: npm publishing, awesome-paperclip submission, UI polish beyond what the Paperclip run viewer renders automatically, multi-provider failover, resume semantics.

## 11. Publishing plan
Do not publish until section 10 is green.

When ready:

- **Adapter** — publish as `@yourhandle/paperclip-adapter-teammedagents` or similar. Follow semver strictly. Pin `@paperclipai/adapter-utils` to the exact minor version tested. Tag a GitHub release with a working config example.
- **Core** — publish as a separate package only if external users ask for it. Otherwise keep it as an internal workspace dependency.
- **Plugin** — only after the adapter ships and has been used against real workflows.

You can also make the repo public, but that alone does **not** make Paperclip automatically know about the adapter. Users still need the adapter package installed, or a local file/reference entry in Paperclip’s adapter registry for development. For broader distribution, publish the adapter to the npm registry so others can install the package by name; a public Git repo is a source code host, not the install mechanism.

## 12. Working session checklist
Every time a coding session starts:

1. Read this file.
2. Read the relevant phase checklist.
3. Decide which package the current task belongs to: `core`, `adapter`, or `plugin`.
4. Make one small change.
5. Run `pnpm -r typecheck` and any relevant tests.
6. Commit with a message that cites the phase and checklist item.
7. Update the relevant checkbox in this file if the step completed a milestone item.

## 13. Open questions to answer before Phase 2 code
These are the decisions that will block progress if left ambiguous. Resolve each with an ADR in `docs/decisions/`:

- **Adapter runtime lifecycle:** should the adapter keep a warm worker, spawn per run, or rely on an external service? Recommendation: keep the runtime in-process with the adapter’s own Node/TS execution path for v0.1.
- **Config schema for `adapterConfig`:** which knobs are user-facing (component toggles, model, max turns, temperature), which are locked.
- **Transcript schema:** the exact `TranscriptEntry` kinds to emit. Once shipped, changing these invalidates stored run history.
- **Default approval gate:** should new `teammedagents_local` agents default to `requires_approval: true` given the medical domain? Recommendation: yes.
- **Session persistence:** one-shot per case in v0.1 is the plan. Confirm this matches how benchmark cases are scored.

## 14. Notes
Keep this project research-friendly:

- Preserve the original teamwork logic — keep the workflow specification in `docs/teammedagent.md` and port it carefully.
- Keep benchmarks reproducible — any change to the adapter should not change paper numbers.
- Separate experimental ideas from shipping code — experiments live in branches, not on main.
- Avoid locking into Paperclip-specific assumptions inside core — it should remain useful if the adapter is replaced by a different host later.