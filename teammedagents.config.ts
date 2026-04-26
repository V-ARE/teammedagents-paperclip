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
        light: 'gpt-5.4-mini',
        heavy: 'gpt-5.4',
        apiProvider: 'openai'
    },
    execution: 'parallel', // 'sequential' | 'parallel'
    maxTurns: 2,
    useTrustNetwork: true,
    useSMM: true
};
