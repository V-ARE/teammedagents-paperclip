import { executeCase, ModelStrategy, TeamConfig, QuestionInput } from '@teammedagents-paperclip/core';

export async function execute(context: any, config: Record<string, any>) {
    const models: ModelStrategy = {
       light: config.model_light,
       heavy: config.model_heavy,
       apiProvider: config.api_provider,
       apiKey: config.api_key,
       customEndpoint: config.custom_endpoint
    };

    const teamConfig: TeamConfig = {
        models,
        execution: config.execution_mode || 'parallel',
        maxTurns: config.maxTurns || 3,
        useTrustNetwork: true,
        useSMM: true
    };

    const input: QuestionInput = {
        caseId: context.id || 'default-case',
        text: context.question || '',
    };

    return await executeCase(input, teamConfig);
}
