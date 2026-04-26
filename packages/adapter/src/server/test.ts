import type { AdapterEnvironmentTestContext, AdapterEnvironmentTestResult } from '@paperclipai/adapter-utils';

export async function testEnvironment(ctx: AdapterEnvironmentTestContext): Promise<AdapterEnvironmentTestResult> {
    const config = ctx.config || {};
    if (config.api_provider !== 'custom' && !config.api_key && !process.env.API_KEY) {
        return {
            adapterType: ctx.adapterType,
            status: "fail",
            testedAt: new Date().toISOString(),
            checks: [{
                code: "MISSING_API_KEY",
                level: "error",
                message: "Missing API Key for non-custom provider"
            }]
        };
    }
    return {
        adapterType: ctx.adapterType,
        status: "pass",
        testedAt: new Date().toISOString(),
        checks: []
    };
}
