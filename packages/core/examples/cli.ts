import { executeCase, QuestionInput, TeamConfig } from '../src';
import * as dotenv from 'dotenv';
dotenv.config();

const main = async () => {
    const input: QuestionInput = {
        caseId: 'test-1',
        text: 'A 54-year-old male presents with sudden onset sharp chest pain that radiates to his back. His blood pressure is 180/100 mmHg. ECG shows sinus tachycardia but no ST elevation. What is the most likely diagnosis and what is the best immediate diagnostic step?',
        options: [
            'A) Myocardial Infarction; perform cardiac cath',
            'B) Pulmonary Embolism; order CT pulmonary angiogram',
            'C) Aortic Dissection; order CT aortogram',
            'D) Pericarditis; prescribe NSAIDs'
        ]
    };

    const config: TeamConfig = {
        models: {
            light: 'gpt-4o-mini',
            heavy: 'gpt-4o',
            apiProvider: 'openai',
            apiKey: process.env.OPENAI_API_KEY
        },
        execution: 'parallel',
        maxTurns: 2,
        useTrustNetwork: true,
        useSMM: true
    };

    console.log("Running Case with Native LLM Setup...");
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
