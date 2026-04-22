/**
 * TeamMedAgents Base Configuration
 * This file acts as the fallback configuration for CLI testing and standalone environments.
 * It is overridden by local `.env` variables if they are present.
 * 
 * Available `apiProvider` options: 'openai' | 'anthropic' | 'google' | 'vertex' | 'custom'
 * See README.md for the Verified Supported Models Matrix.
 */
export default {
    models: {
        light: 'gemini-2.5-flash', // Suggested: gemini-2.5-flash, gpt-5.4-mini, or claude-haiku-4-5
        heavy: 'gemini-2.5-pro',   // Suggested: gemini-2.5-pro, gpt-5.4, or claude-opus-4-7
        apiProvider: 'google'
    },
    execution: 'parallel', // 'sequential' | 'parallel'
    maxTurns: 2,
    useTrustNetwork: true,
    useSMM: true
};
