import { executeCase } from '../src';
import * as dotenv from 'dotenv';
import { loadConfig } from './config-loader';
dotenv.config();
const main = async () => {
    const input = {
        caseId: 'test-creative-1',
        text: 'Design a highly consistent magic system based on the laws of thermodynamics, where "entropy" functions as a literal physical currency that mages extract from the environment. Outline the rules, the societal impact on non-mages, and one potential catastrophic loophole in the system.',
    };
    const config = await loadConfig();
    console.log("Running Creative Worldbuilding Case with Native LLM Setup...");
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
    }
    catch (e) {
        console.error("Execution failed:", e);
    }
};
main();
//# sourceMappingURL=cli-creative.js.map