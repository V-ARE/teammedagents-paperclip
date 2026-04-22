# TeamMedAgents Paperclip Adapter

Shipping TeamMedAgents as a first-class citizen of the Paperclip orchestration platform. Phase v0.1 focuses on a pure TypeScript adapter that runs the full TeamMedAgents algorithmic team as one natively managed employee component.

**📖 Start here:** Read [START.md](START.md) — it is the source of truth for this project.

## 🚀 Implemented Features

- **✅ Model-Agnostic Setup:** The adapter cleanly supports arbitrary execution across OpenAI, Anthropic, or Custom APIs natively without heavy library bindings.
- **✅ Full TeamMedAgents Algorithm:** Implements Phase 1 (Dynamic Recruitment), Phase 2 (Independent Assessment & SMM), Phase 3 (Multi-Turn Deliberation with Leader Critique), and Phase 4 (Borda/Weighted Consensus Aggregation). 
- **✅ Multimodal Setup:** Built-in hooks ready to pass image context straight to configured multimodal heavyweight endpoint tiers.
- **✅ Configurable Execution:** Teams can debate sequentially or parallelly based on exact configuration schemas.
- **✅ Comprehensive Tracing:** Accurate phase-level tracking of execution latencies and LLM payload tokens natively returned in the adapter logs.

## 📦 Usage, Verification & API Keys

### Verifying Locally without Paperclip (CLI Test)

You can rigorously verify the logic engine with your own tokens before pushing it to Paperclip.
1. Stay in the root directory: `E:\teammedagents-paperclip\`
2. Create your local environment variables file by copying the created example template:
   ```bash
   cp .env.example .env
   ```
3. Open your new `.env` file at the root and insert your API keys for the providers you wish to test (e.g., `OPENAI_API_KEY`, `GOOGLE_API_KEY`).
4. Select your specific Models and Provider manually! Open `packages/core/examples/cli.ts` (or `cli-open-ended.ts`) in your editor and modify the `const config: TeamConfig` variable. 
   - By default, it's set to test Google AI Studio modes. You can swap `apiProvider` to `'openai'` and swap the `light`/`heavy` models fields over to `gpt-5.4` based on the matrix below!
5. Execute the built-in isolated tests natively from the root: 
   ```bash
   pnpm run test:cli
   
   # Or to test the open-ended case:
   pnpm run test:cli:open
   ```
*This will execute the entire TeamMedAgent architecture in your terminal, emitting logs and final traces securely.*

### Usage inside Paperclip (Adapter)
No `.env` files are necessary when operated as an adapter! The `@teammedagents-paperclip/adapter` exposes a fully structured `AgentConfigurationDoc` generated inside `ui/build-config.ts`. Once successfully bound to Paperclip, the AI Studio orchestration dashboard will automatically generate UI dropdowns asking the user for their keys safely, choosing Light/Heavy base models, and configuring rules via frontend parameters globally.

## 🤖 Verified Supported Models Matrix

When you operate this wrapper, these are the confirmed stable endpoints natively typed and passed into the LLM Client via the orchestration map:

**OpenAI (`api_provider: 'openai'`)**
- `gpt-5.4` (Heavy flagship, Complex Reasoning)
- `gpt-5.4-pro` (Ultra-Heavy, Deep Research)
- `gpt-5.4-mini` (Light, High-Efficiency)

**Anthropic (`api_provider: 'anthropic'`)**
- `claude-opus-4-7` (Heavy flagship)
- `claude-sonnet-4-6` (Heavy, Fast Agentic)
- `claude-haiku-4-5` (Light, Cost-efficient)

**Google AI Studio (`api_provider: 'google'`)**
- `gemini-2.5-pro` (Heavy flagship, 1M+ Context)
- `gemini-2.5-flash` (Medium, Fast Agentic)
- `gemini-2.5-flash-lite` (Light, High volume)

**Google Cloud Vertex AI (`api_provider: 'vertex'`)**
- Supports all Gemini models (e.g. `gemini-2.5-pro`, `gemini-2.5-flash`) mapped directly to your GCP Project and Region endpoints using an OAuth Bearer token or Service Account impersonation.

## 🛠 Compilation and Building

```bash
# Install dependencies
pnpm install

# Typecheck all packages natively (Strict)
pnpm -r typecheck

# Build all packages into `dist/` directories
pnpm -r build
```

## Architecture

```
Paperclip ←→ Adapter ←→ Core (pure TS)
             ↓
      Paperclip conventions
      (build-config schema, streaming, parse-stdout)
```

- **Core (`packages/core`):** Zero Paperclip imports. Generic TS runtime for TeamMedAgents (Holds the Prompts, Orchestrator execution engine, and LLM Fetch Clients).
- **Adapter (`packages/adapter`):** Thin wrapper handling Paperclip UI specs and Server mappings (`@paperclipai/adapter-utils`).
- **Plugin (`packages/plugin`):** Deferred to v0.2+ after core and adapter are tested securely against high-traffic workloads.
