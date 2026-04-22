# 🚀 How to Publish the Adapter

Because we ensured flawless compilation outputs straight to `dist/` folders and exported standard `package.json` logic, the plugin is natively designed to be pushed directly via npm.

1. **Verify your build one last time:**
   Run `$ pnpm -r build` inside the root directory.
2. **Log into npm:**
   Run `$ npm login` and authenticate.
3. **Publish the Adapter:**
   Navigate into the adapter specifically (`$ cd packages/adapter`) and execute `$ npm publish --access public`. 
   
*(Ensure you've updated the exact `name`, `version`, and `author` inside `packages/adapter/package.json` before publishing so it reflects the namespace you want on the npm registry).*

# 🧪 How to Test It Actively as a Paperclip Adapter

You can bind this to the Paperclip platform locally before you ever publish it to the external world!

1. **Build the packages:** `$ pnpm -r build`.
2. **Link the Plugin Locally:** Open the global Paperclip adapter registry on your machine (usually located at `~/.paperclip/adapter-plugins.json`).
3. **Add the Path:** Add a direct file schema path pointing to your compiled local adapter folder. Example:
   ```json
   {
     "teammedagents_local": "file:///E:/teammedagents-paperclip/packages/adapter"
   }
   ```
4. **Boot Up Paperclip:**
   Start your Paperclip server instance (`$ paperclipai start` or equivalent). 
   - Once the UI launches in your browser, click **"Create Agent"**.
   - You will see **"TeamMedAgents"** appear cleanly in your provider dropdown list!
   - Because of our `ui/build-config.ts` mapping, when you select it, the right-hand panel will *automatically* render text input fields asking for your API Key, your API Provider (OpenAI/Anthropic), and toggles for sequential vs. parallel execution.
5. **Attach a Workflow:** Send a request inside Paperclip. Paperclip will forward the request natively into our `packages/adapter/src/server/execute.ts` function, and you'll see the multi-model collaboration render step-by-step directly onto your screen!