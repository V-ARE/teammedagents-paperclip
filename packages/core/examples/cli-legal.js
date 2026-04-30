import { executeCase } from '../src';
import * as dotenv from 'dotenv';
import { loadConfig } from './config-loader';
dotenv.config();
const main = async () => {
    const input = {
        caseId: 'test-legal-1',
        text: 'A software developer working at a major tech firm builds a side project over the weekends. They use their company-issued laptop to write 10% of the code, but everything else is done on their own time. The side project becomes highly profitable. Who owns the intellectual property, and what are the liability risks for the developer under standard California PIIA (Proprietary Information and Inventions Agreement) laws?',
    };
    const config = await loadConfig();
    console.log("Running Legal Case with Native LLM Setup...");
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
//# sourceMappingURL=cli-legal.js.map