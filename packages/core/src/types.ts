import { z } from 'zod';

export type ModelTier = 'light' | 'heavy' | 'image';

export interface ModelStrategy {
  light: string;
  heavy: string;
  image?: string;
  apiProvider?: 'openai' | 'anthropic' | 'google' | 'custom';
  apiKey?: string;
  customEndpoint?: string;
  customHeaders?: Record<string, string>;
}

export interface QuestionInput {
  caseId: string;
  text: string;
  options?: string[]; // MCQs
  expectedOutput?: string;
  context?: string;   // For case histories, graphs, or output from web agents
  images?: string[];  // base64 or URIs
}

export interface TeamConfig {
  models: ModelStrategy;
  execution: 'sequential' | 'parallel';
  maxTurns: number;
  useTrustNetwork: boolean;
  useSMM: boolean;
}

export interface PhaseTrace {
  name: string;
  description: string;
  tokens: number;
  latencyMs: number;
}

export interface TracingInfo {
  totalTokens: number;
  totalLatencyMs: number;
  phases: PhaseTrace[];
}

export interface AgentInfo {
  id: string;
  role: string;
  specialty: string;
  trustScore: number;
  weight: number;
}

export interface CaseResult {
  caseId: string;
  finalAnswer: string;
  rationale: string;
  tracing: TracingInfo;
  transcript: TranscriptEvent[];
}

export type TranscriptEvent = {
  type: 'smm_update' | 'deliberation' | 'trust_update' | 'consensus' | 'leader_intervention';
  payload: any;
  timestamp: string;
};
