import { QuestionInput, TeamConfig, CaseResult, TracingInfo, AgentInfo, TranscriptEvent } from './types.js';
import { LLMClient } from './llm-client.js';
import { z } from 'zod';
import {
  RECRUITMENT_PROMPT,
  SPECIALIST_ASSESSMENT_PROMPT,
  SMM_EXTRACTION_PROMPT,
  DELIBERATION_PROMPT,
  MONITORING_PROMPT,
  CONSENSUS_PROMPT
} from './prompts.js';

export class Orchestrator {
  private trace: TracingInfo = { totalTokens: 0, totalLatencyMs: 0, phases: [] };
  private client: LLMClient;
  private transcript: TranscriptEvent[] = [];

  constructor(private config: TeamConfig) {
    this.client = new LLMClient(config.models, this.trace);
  }

  private emit(event: Omit<TranscriptEvent, 'timestamp'>) {
      this.transcript.push({ ...event, timestamp: new Date().toISOString() });
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

    const recruitmentSchema = z.object({
      specialists: z.array(z.object({
        role: z.string(),
        specialty: z.string(),
        weight: z.number()
      }))
    });

    const contextStr = input.context ? `Additional Context: ${input.context}\n` : '';
    const questionStr = `Question: ${input.text}\nOptions: ${input.options?.join(', ') || 'None (Open-ended)'}`;

    // Phase 1: Recruitment
    const agents: AgentInfo[] = await this.addPhaseTrace("Phase 1: Dynamic Recruitment", "Determine N agents and specialties", async () => {
        const data = await this.client.generateJSON(`${contextStr}${questionStr}`, recruitmentSchema, RECRUITMENT_PROMPT);
        return data.specialists.map((s, idx) => ({
            id: `agent_${idx}`,
            role: s.role,
            specialty: s.specialty,
            trustScore: 0.8,
            weight: s.weight
        }));
    });

    // Phase 2: Independent Assessment
    const assessments: Record<string, string> = await this.addPhaseTrace("Phase 2: Independent Assessment", "Agents assess independently in parallel", async () => {
        const results: Record<string, string> = {};
        const runAgent = async (agent: AgentInfo) => {
            const system = SPECIALIST_ASSESSMENT_PROMPT
               .replace('{ROLE}', agent.role)
               .replace('{SPECALTY}', agent.specialty);
            const ans = await this.client.generateText(`${contextStr}${questionStr}`, 'heavy', input.images, system);
            return { id: agent.id, ans };
        };

        if (this.config.execution === 'parallel') {
            const promResults = await Promise.all(agents.map(runAgent));
            for (const r of promResults) results[r.id] = r.ans;
        } else {
             for (const agent of agents) {
                 const r = await runAgent(agent);
                 results[r.id] = r.ans;
             }
        }
        return results;
    });

    // Phase 2b: SMM Extraction
    let smm: string = "";
    if (this.config.useSMM) {
         smm = await this.addPhaseTrace("Phase 2b: SMM Extraction", "Generate shared mental model", async () => {
             const allAssessments = agents.map(a => `${a.role} (${a.specialty}):\n${assessments[a.id]}`).join('\n\n');
             const output = await this.client.generateText(`Assessments:\n${allAssessments}`, 'heavy', [], SMM_EXTRACTION_PROMPT);
             this.emit({ type: 'smm_update', payload: { model: output } });
             return output;
         });
    }

    // Phase 3: Deliberation
    let debateHistory = agents.map(a => `${a.role}:\n${assessments[a.id]}`).join('\n\n');
    let currentSMM = smm;

    await this.addPhaseTrace("Phase 3: Collaborative Deliberation", "Multi-turn debate and critiques", async () => {
        for (let turn = 0; turn < this.config.maxTurns; turn++) {
            const monitoring = await this.client.generateText(`Debate History:\n${debateHistory}`, 'light', [], MONITORING_PROMPT);
            this.emit({ type: 'leader_intervention', payload: { critique: monitoring } });
            
            const turnResults: Record<string, string> = {};
            const runTurn = async (agent: AgentInfo) => {
                const system = DELIBERATION_PROMPT
                   .replace('{ROLE}', agent.role)
                   .replace('{SPECIALTY}', agent.specialty);
                const prompt = `Current Shared Mental Model:\n${currentSMM}\n\nLast Round of Debate:\n${debateHistory}\n\nLeader Critique (address if targeted at you):\n${monitoring}`;
                return await this.client.generateText(prompt, 'heavy', [], system);
            };

            if (this.config.execution === 'parallel') {
                 const promResults = await Promise.all(agents.map(async a => ({ id: a.id, ans: await runTurn(a) })));
                 for (const r of promResults) turnResults[r.id] = r.ans;
            } else {
                 for (const agent of agents) {
                     turnResults[agent.id] = await runTurn(agent);
                 }
            }

            if (this.config.useTrustNetwork) {
               agents.forEach(a => {
                   a.trustScore += (Math.random() - 0.3) * 0.1; // Simulated trust eval integration
                   a.trustScore = Math.max(0.1, Math.min(1.0, a.trustScore));
               });
               this.emit({ type: 'trust_update', payload: { agents: agents.map(a => ({ id: a.id, score: a.trustScore })) } });
            }

            debateHistory = agents.map(a => `${a.role}:\n${turnResults[a.id]}`).join('\n\n');
            this.emit({ type: 'deliberation', payload: { history: debateHistory } });
        }
    });

    // Phase 4: Aggregation
    const finalAnswer = await this.addPhaseTrace("Phase 4: Trust-Weighted Consensus", "Synthesize findings", async () => {
       const agentStateList = agents.map(a => `Role: ${a.role}, Specialty: ${a.specialty}, Weight: ${a.weight.toFixed(2)}, Trust Score: ${a.trustScore.toFixed(2)}`).join('\n');
       const consensusPrompt = `Agents:\n${agentStateList}\n\nDebate conclusion:\n${debateHistory}\n\nOriginal Question: ${input.text}\nOptions: ${input.options?.join(', ') || 'None'}\n\nReview the agents' final positions. In open-ended mode, synthesize their valid points taking into account their reliability and weights. If options are provided, select the option most supported by the reliable agents. Output your final answer and rationale clearly.`;
       
       const output = await this.client.generateText(consensusPrompt, 'heavy', [], CONSENSUS_PROMPT);
       this.emit({ type: 'consensus', payload: { result: output } });
       return output;
    });

    return {
      caseId: input.caseId,
      finalAnswer,
      rationale: finalAnswer,
      tracing: this.trace,
      transcript: this.transcript
    };
  }
}

export const executeCase = async (input: QuestionInput, config: TeamConfig): Promise<CaseResult> => {
  const orchestrator = new Orchestrator(config);
  return await orchestrator.runCase(input);
};
