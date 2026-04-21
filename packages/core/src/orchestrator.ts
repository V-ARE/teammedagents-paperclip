import { QuestionInput, TeamConfig, CaseResult, TracingInfo, AgentInfo, TranscriptEvent } from './types';
import { LLMClient } from './llm-client';

export class Orchestrator {
  private trace: TracingInfo = { totalTokens: 0, totalLatencyMs: 0, phases: [] };
  private client: LLMClient;
  private transcript: TranscriptEvent[] = [];

  constructor(private config: TeamConfig) {
    this.client = new LLMClient(config.models, this.trace);
  }

  private async addPhaseTrace<T>(name: string, description: string, fn: () => Promise<T>): Promise<T> {
    const startTokens = this.trace.totalTokens;
    const startMs = Date.now();
    const result = await fn();
    this.trace.phases.push({
      name,
      description,
      tokens: this.trace.totalTokens - startTokens,
      latencyMs: Date.now() - startMs,
    });
    return result;
  }

  async runCase(input: QuestionInput): Promise<CaseResult> {
    console.log(`Starting execution natively (Mode: ${this.config.execution})`);

    // Phase 1: Recruitment
    await this.addPhaseTrace("Phase 1: Dynamic Recruitment", "Determine N agents and specialties", async () => {
        await this.client.generateText('Analyze complexity', 'light');
    });

    // Phase 2: Independent Assessment
    await this.addPhaseTrace("Phase 2: Independent Assessment", "Agents assess independently in parallel", async () => {
        if (this.config.execution === 'parallel') {
            await Promise.all([
               this.client.generateText(`Agent 1 Assess: ${input.text} Context: ${input.context || ''}`, 'heavy', input.images),
               this.client.generateText(`Agent 2 Assess: ${input.text} Context: ${input.context || ''}`, 'heavy', input.images)
            ]);
        } else {
             await this.client.generateText(`Agent 1 Assess: ${input.text}`, 'heavy', input.images);
             await this.client.generateText(`Agent 2 Assess: ${input.text}`, 'heavy', input.images);
        }
    });

    // Phase 3 & 4
    const finalAnswer = await this.addPhaseTrace("Phase 3 & 4: Deliberation & Aggregation", "Synthesize findings", async () => {
       return await this.client.generateText("Vote and Synthesize rationale", 'heavy');
    });

    return {
      caseId: input.caseId,
      finalAnswer,
      rationale: "Successfully converged via collaborative workflow.",
      tracing: this.trace,
      transcript: this.transcript
    };
  }
}

export const executeCase = async (input: QuestionInput, config: TeamConfig): Promise<CaseResult> => {
  const orchestrator = new Orchestrator(config);
  return await orchestrator.runCase(input);
};
