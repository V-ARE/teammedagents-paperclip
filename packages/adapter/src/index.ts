/**
 * @teammedagents-paperclip/adapter
 *
 * Paperclip external adapter.
 * Thin wrapper around @teammedagents-paperclip/core that handles Paperclip conventions.
 *
 * See START.md § 2 for architecture.
 */

export interface AdapterConfig {
  model: string;
  temperature?: number;
  maxTurns?: number;
  [key: string]: unknown;
}

export const type = "teammedagents_local";
export const label = "TeamMedAgents";

// TODO: Implement adapter handlers.
// See docs/decisions/ for open questions.
// - execute(): call core, stream to onLog, aggregate usage
// - testEnvironment(): check env, keys, model config
// - sessionCodec: one-shot codec for v0.1

export default {
  type,
  label,
};
