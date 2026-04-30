import { execute } from './server/execute.js';
import { testEnvironment } from './server/test.js';
import { agentConfigurationDoc } from './ui/build-config.js';

export const type = "teammedagents_local";
export const label = "TeamMedAgents";

export {
  execute,
  testEnvironment,
  agentConfigurationDoc
};
