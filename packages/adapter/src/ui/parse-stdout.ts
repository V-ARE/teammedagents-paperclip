import { TranscriptEvent } from '@teammedagents-paperclip/core';

export function parseStdoutToTranscript(event: TranscriptEvent): any {
    return {
        timestamp: event.timestamp,
        content: JSON.stringify(event.payload),
        type: event.type
    };
}
