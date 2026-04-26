import { execute } from './server/execute';
import { testEnvironment } from './server/test';
import { agentConfigurationDoc } from './ui/build-config';

export const type = "teammedagents_local";
export const label = "TeamMedAgents";

export {
  execute,
  testEnvironment,
  agentConfigurationDoc
};
