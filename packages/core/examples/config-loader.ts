import { TeamConfig, ApiProvider } from '../src';
import * as path from 'path';
import * as fs from 'fs';
import { pathToFileURL } from 'url';

export const loadConfig = async (): Promise<TeamConfig> => {
    // Default fallback config
    let config: TeamConfig = {
        models: {
            light: 'gemini-2.5-flash',
            heavy: 'gemini-2.5-pro',
            apiProvider: 'google',
            apiKey: process.env.GOOGLE_API_KEY || process.env.API_KEY
        },
        execution: 'parallel',
        maxTurns: 2,
        useTrustNetwork: true,
        useSMM: true
    };

    // Try to load from root teammedagents.config.ts
    try {
        const rootConfigPath = path.resolve(process.cwd(), 'teammedagents.config.ts');
        if (fs.existsSync(rootConfigPath)) {
            const rootConfig = (await import(pathToFileURL(rootConfigPath).href)).default;
            if (rootConfig) {
                config = {
                    ...config,
                    ...rootConfig,
                    models: { ...config.models, ...rootConfig.models }
                };
            }
        }
    } catch (e) {
        console.warn("Could not load teammedagents.config.ts fallback", e);
    }

    // Override with ENV vars if present
    if (process.env.LLM_PROVIDER) config.models.apiProvider = process.env.LLM_PROVIDER as ApiProvider;
    if (process.env.LLM_LIGHT_MODEL) config.models.light = process.env.LLM_LIGHT_MODEL;
    if (process.env.LLM_HEAVY_MODEL) config.models.heavy = process.env.LLM_HEAVY_MODEL;
    if (process.env.EXECUTION_MODE) config.execution = process.env.EXECUTION_MODE as any;
    if (process.env.MAX_TURNS) config.maxTurns = parseInt(process.env.MAX_TURNS, 10);

    // Resolve proper API keys based on provider
    const provider = config.models.apiProvider;
    if (provider === 'google') config.models.apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (provider === 'openai') config.models.apiKey = process.env.OPENAI_API_KEY;
    if (provider === 'anthropic') config.models.apiKey = process.env.ANTHROPIC_API_KEY;
    if (provider === 'vertex') {
        config.models.vertexProjectId = process.env.VERTEX_PROJECT_ID;
        config.models.vertexLocation = process.env.VERTEX_LOCATION;
        config.models.apiKey = process.env.VERTEX_ACCESS_TOKEN;
    }

    return config;
};
