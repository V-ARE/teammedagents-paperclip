import { executeCase } from '../src';
import * as dotenv from 'dotenv';
import { loadConfig } from './config-loader';
dotenv.config();
const main = async () => {
    const input = {
        caseId: 'test-finance-1',
        text: 'A highly leveraged software company (Debt-to-Equity ratio of 3.5) is planning to acquire a fast-growing AI startup for $500M. The startup has $50M in Net Operating Losses (NOLs). Should the acquisition be structured as an asset purchase or a stock purchase? Outline the tax implications, debt restructuring needs, and risks.',
    };
    const config = await loadConfig();
    console.log("Running Finance Case with Native LLM Setup...");
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
//# sourceMappingURL=cli-finance.js.map