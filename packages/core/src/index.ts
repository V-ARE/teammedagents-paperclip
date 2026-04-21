/**
 * @teammedagents-paperclip/core
 *
 * Pure TypeScript runtime for the TeamMedAgents workflow.
 * Ported from research repo, remains the source of truth.
 *
 * See docs/teammedagent.md for the canonical algorithm.
 */

export interface CaseInput {
  caseId: string;
  question: string;
  [key: string]: unknown;
}

export interface CaseResult {
  caseId: string;
  deliberation: string;
  consensus: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  [key: string]: unknown;
}

/**
 * Execute a single case through the TeamMedAgents workflow.
 *
 * @param input - Case input with question and context.
 * @param onLog - Optional callback to stream intermediate states.
 * @returns Structured result with deliberation, consensus, and token usage.
 */
export async function runCase(
  input: CaseInput,
  onLog?: (event: unknown) => void
): Promise<CaseResult> {
  // TODO: Implement TeamMedAgents workflow.
  // See docs/teammedagent.md for the canonical algorithm.
  throw new Error("runCase() not yet implemented. Waiting for teammedagent.md.");
}

export default {
  runCase,
};
