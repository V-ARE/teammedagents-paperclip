import { executeCase, QuestionInput, TeamConfig } from '../src';
import * as dotenv from 'dotenv';
dotenv.config();

const main = async () => {
    // Open-ended input (no options provided)
    const input: QuestionInput = {
        caseId: 'test-open-ended-1',
        text: 'A 28-year-old software engineer is designing a highly scalable, distributed queuing system to handle 10 million events per second. What architecture pattern should they prioritize and what are the primary trade-offs?',
    };

    const config: TeamConfig = {
        models: {
            light: 'gemini-2.5-flash',
            heavy: 'gemini-2.5-pro',
            apiProvider: 'google',
            apiKey: process.env.GOOGLE_API_KEY
        },
        execution: 'parallel',
        maxTurns: 2,
        useTrustNetwork: true,
        useSMM: true
    };

    console.log("Running Open-Ended Case with Native LLM Setup...");
    try {
        const result = await executeCase(input, config);
        console.log("\n=== FINAL RESULT ===");
        console.log(result.finalAnswer);

        console.log("\n=== TRACES ===");
        console.log(`Total Tokens: ${result.tracing.totalTokens}`);
        console.log(`Total Latency: ${result.tracing.totalLatencyMs}ms`);
        result.tracing.phases.forEach(p => {
            console.log(`- ${p.name}: ${p.tokens} tokens | ${p.latencyMs}ms`);
        });
    } catch (e) {
        console.error("Execution failed:", e);
    }
};

main();
