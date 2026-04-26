import { executeCase, ModelStrategy, TeamConfig, QuestionInput } from '@teammedagents-paperclip/core';
import type { AdapterExecutionContext, AdapterExecutionResult } from '@paperclipai/adapter-utils';

export async function execute(ctx: AdapterExecutionContext): Promise<AdapterExecutionResult> {
    const config = (ctx.agent.adapterConfig as Record<string, any>) || {};
    
    const models: ModelStrategy = {
       light: config.model_light,
       heavy: config.model_heavy,
       apiProvider: config.api_provider || 'google',
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
        caseId: ctx.runId || 'default-case',
        text: (ctx.context.question as string) || (ctx.context.prompt as string) || '',
    };

    try {
        const result = await executeCase(input, teamConfig);
        return {
            exitCode: 0,
            signal: null,
            timedOut: false,
            resultJson: { finalAnswer: result.finalAnswer, tracing: result.tracing },
            usage: {
                inputTokens: result.tracing.totalTokens,
                outputTokens: 0,
            }
        };
    } catch (e: any) {
        return {
            exitCode: 1,
            signal: null,
            timedOut: false,
            errorMessage: e.message,
            errorCode: 'EXECUTION_FAILED'
        };
    }
}
