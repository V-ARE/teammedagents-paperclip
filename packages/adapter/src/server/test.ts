export async function testEnvironment(config: Record<string, any>): Promise<void> {
    if (config.api_provider !== 'custom' && !config.api_key && !process.env.API_KEY) {
        throw new Error("Missing API Key for non-custom provider");
    }
}
