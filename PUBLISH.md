# Publishing & Paperclip Integration Guide

This guide provides extremely detailed, step-by-step instructions on how to take your compiled `teammedagents-paperclip` adapter and bind it locally into a live Paperclip codebase. It also covers how to publish the packages to NPM once you are finished testing.

---

## 1. Local Testing with Paperclip (Without Publishing)

If you have cloned the main Paperclip monorepo to your machine (for example, into the `references/paperclip` directory), you can inject your adapter directly into it without needing to publish to NPM first.

### Step 1: Install and Build the Adapter
Before you can link the adapter, you must ensure it is fully built.
Open your terminal and navigate to the root of the **`teammedagents-paperclip`** repository.
```bash
# 1. Install dependencies
pnpm install

# 2. Build the core and adapter packages
pnpm run build
```

> [!IMPORTANT]
> **Strict ESM Resolution:** Paperclip's development environment requires strict ESM compliance. When writing code in the `src/` directories, all relative imports **MUST** include the `.js` extension (e.g., `import { foo } from './bar.js'`), even if the source file is a `.ts` file. If you omit these, the Paperclip server will throw `ERR_MODULE_NOT_FOUND` errors.

### Step 2: Install Paperclip Dependencies
Now, navigate to your cloned **Paperclip** repository. You must run a clean install here before trying to link anything, otherwise TypeScript will throw `Cannot find module` errors.
```bash
# Navigate to the paperclip root
cd /path/to/your/paperclip

# Install all workspace dependencies
pnpm install
```

### Step 3: Symlink the Packages into the Paperclip Server
We will use `pnpm link` to create a direct symlink from your Paperclip server to your compiled adapter packages. This bypasses the need for global links.

Navigate to the `server` directory *inside* your Paperclip clone:
```bash
cd server
```

Then, run the following commands, replacing the paths with the **absolute paths** to your `teammedagents-paperclip` packages on your machine:
```bash
# Link the Core package
pnpm link "E:/teammedagents-paperclip/packages/core"

# Link the Adapter package
pnpm link "E:/teammedagents-paperclip/packages/adapter"
```
*(You should see a message saying node_modules updated to point to those directories).*

### Step 4: Register the Adapter in Paperclip's Server Code
Paperclip needs to know that your adapter exists on the backend. You must manually add it to the adapter registry list.

1. Open `server/src/adapters/registry.ts` inside the Paperclip repository.
2. At the top of the file, add this import statement:
   ```typescript
   import * as teammedagentsAdapter from "@paranoid17/teammedagents-paperclip-adapter";
   import type { ServerAdapterModule } from "./types.js";
   ```
3. Scroll down to the `registerBuiltInAdapters()` function.
4. Add `teammedagentsAdapter` to the array of adapters. It should look exactly like this:
   ```typescript
   function registerBuiltInAdapters() {
     for (const adapter of [
       claudeLocalAdapter,
       codexLocalAdapter,
       openCodeLocalAdapter,
       piLocalAdapter,
       cursorLocalAdapter,
       geminiLocalAdapter,
       openclawGatewayAdapter,
       hermesLocalAdapter,
       processAdapter,
       httpAdapter,
       // --- ADD THIS LINE BELOW ---
       teammedagentsAdapter as ServerAdapterModule,
     ]) {
       adaptersByType.set(adapter.type, adapter);
     }
   }
   ```

### Step 5: Register the Adapter in Paperclip's UI
Because we injected the adapter as a "built-in" component to bypass NPM, we also must tell the frontend to render it.

1. Open `ui/src/adapters/registry.ts`
2. Scroll to `registerBuiltInUIAdapters()` and add the TeamMedAgents adapter definition to the array:
   ```typescript
   function registerBuiltInUIAdapters() {
     for (const adapter of [
       // ... existing UI adapters ...
       httpUIAdapter,
       // --- ADD THIS DEFINITION ---
       {
         type: "teammedagents_local",
         label: "TeamMedAgents",
         parseStdoutLine: processUIAdapter.parseStdoutLine,
         ConfigFields: SchemaConfigFields,
         buildAdapterConfig: buildSchemaAdapterConfig,
       } as UIAdapterModule,
     ]) {
   ```
3. Open `ui/src/adapters/adapter-display-registry.ts`
4. Add the display metadata to `adapterDisplayMap`:
   ```typescript
   const adapterDisplayMap: Record<string, AdapterDisplayInfo> = {
     // ... existing entries ...
     teammedagents_local: {
       label: "TeamMedAgents",
       description: "TeamMedAgents multi-agent framework",
       icon: Sparkles,
       recommended: true,
     },
   };
   ```

### Step 6: Verify Types and Run!
Still inside the `server` directory, run a quick typecheck to ensure everything compiles:
```bash
pnpm run typecheck
```
If it passes with 0 errors, you are ready!

Navigate back to the root of the Paperclip repository and start the development server:
```bash
cd ..
pnpm run dev
```
Open the Paperclip UI in your browser. Click **"Create Agent"**, and **TeamMedAgents** will natively appear in the LLM Provider dropdown! 

---

## 2. Publishing to NPM

Once you have verified that the adapter works perfectly inside Paperclip locally, you can publish it to the official NPM registry for other users to install.

### Step 1: Bump Versions
Open both `packages/core/package.json` and `packages/adapter/package.json`.
Manually increment the `"version"` field (e.g., from `"0.0.1"` to `"0.0.2"`).

### Step 2: Build
Ensure you have the latest compiled files:
```bash
pnpm run build
```

### Step 3: Publish
Authenticate with NPM and publish all packages recursively:
```bash
npm login

# If your NPM account does NOT have 2FA enabled for publishing:
pnpm -r publish --access public --no-git-checks

# If your NPM account HAS 2FA enabled for publishing, you must provide an OTP code from your authenticator app:
# pnpm -r publish --access public --no-git-checks --otp=123456
```

*Note: Ensure you have the proper permissions for the `@paranoid17` NPM scope.*
---

## 3. Installing and Using the Adapter in Paperclip

Now that your adapter is successfully published to NPM as @paranoid17/teammedagents-paperclip-adapter, any Paperclip user can install and use it in their agentic workflows!

### Step 1: Install the External Adapter
1. Open your terminal and navigate to the root of your live Paperclip instance.
2. Run the Paperclip Plugin Manager to install your new adapter dynamically:
   ```ash
   pnpm paperclipai plugin install @paranoid17/teammedagents-paperclip-adapter
   ```
   *Note: Paperclip's plugin manager will automatically download the NPM package, inject it into the server's runtime registry, and dynamically create the UI bindings. You do NOT need to restart the server!*

### Step 2: Create a TeamMedAgents Orchestrator
1. Open the Paperclip UI in your browser.
2. Navigate to **Company -> Agents** and click **"Create Agent"**.
3. In the adapter selection grid, look for the **External Adapters** section. You will see **TeamMedAgents** listed automatically.
4. Click **TeamMedAgents**.
5. You will be presented with the dynamic configuration form we defined in ui/build-config.ts. Fill out:
   - **Lightweight Model:** (e.g., gemini-2.5-flash)
   - **Heavyweight Model:** (e.g., gemini-2.5-pro)
   - **API Provider:** Select your preferred provider (Google, OpenAI, Anthropic).
   - **API Key:** Paste your API key here (securely stored in the database).
   - **Execution Mode:** Choose parallel or sequential.
6. Name your agent (e.g., "Medical Review Board") and click **Save**.

### Step 3: Run a Workflow
Because the TeamMedAgents adapter implements the execute method to resolve abstract QuestionInput schemas into a finalized CaseResult consensus, it acts as a fully autonomous "Employee" within Paperclip.

1. Navigate to **Tasks -> New Task**.
2. Assign the task to your newly created "Medical Review Board" agent.
3. In the prompt/question box, provide a complex medical or scientific scenario.
4. Click **Run**.
5. As the task executes, you will see real-time streaming logs as the Orchestrator dynamically recruits specialists, evaluates trust networks, and aggregates the Borda consensus—all natively embedded in Paperclip's run viewer!

