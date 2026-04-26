# Publishing & Paperclip Integration

This document outlines how to test the TeamMedAgents adapter locally within a live Paperclip codebase, and how to publish the finalized packages to NPM.

## 1. Local Testing with Paperclip (Without Publishing)

If you are developing inside a cloned `paperclip` repository (e.g. `references/paperclip`), you can test the adapter locally without publishing it to NPM.

### Step 1: Build the Adapter
In this `teammedagents-paperclip` repository, build both the core and adapter packages:
```bash
pnpm run build
```

### Step 2: Symlink into the Paperclip Server
Navigate to the `server` directory of your cloned Paperclip repository and use `pnpm link` to point directly to your local compiled packages:
```bash
cd /path/to/your/paperclip/server
pnpm link /path/to/teammedagents-paperclip/packages/core
pnpm link /path/to/teammedagents-paperclip/packages/adapter
```
*(This bypasses global linking issues and safely injects your local build directly into the Paperclip server's `node_modules`.)*

### Step 3: Register the Adapter in Paperclip
Inside the Paperclip repository, open `server/src/adapters/registry.ts`. 

1. **Import your adapter** at the top alongside the other adapters:
   ```typescript
   import teammedagentsAdapter from "@teammedagents-paperclip/adapter";
   ```
2. **Add it to the registry array** inside the `registerBuiltInAdapters()` function:
   ```typescript
   function registerBuiltInAdapters() {
     for (const adapter of [
       // ... existing adapters ...
       httpAdapter,
       teammedagentsAdapter as ServerAdapterModule,
     ]) {
       adaptersByType.set(adapter.type, adapter);
     }
   }
   ```

### Step 4: Run the Paperclip App!
Run `pnpm install` then `pnpm run dev` in your Paperclip root. Open the Paperclip UI, click "Create Agent", and "TeamMedAgents" will natively appear in the LLM Provider dropdown! You can attach it to any workflow and watch the multi-agent deliberation execute live.

## 2. Publishing to NPM

Once verified locally, you can publish the `@teammedagents-paperclip/core` and `@teammedagents-paperclip/adapter` packages.

### Step 1: Bump Versions
Update the version numbers in both `packages/core/package.json` and `packages/adapter/package.json`.

### Step 2: Build & Publish
```bash
pnpm run build
pnpm -r publish --access public
```

*Note: Ensure you are authenticated with `npm login` and have the proper permissions for the `@teammedagents-paperclip` scope.*