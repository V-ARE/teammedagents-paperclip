import { TranscriptEvent, CaseResult } from '@paranoid17/teammedagents-paperclip-core';

export function parseResult(result: CaseResult): string {
    return `Final Consensus: ${result.finalAnswer}\nRationale: ${result.rationale}`;
}
