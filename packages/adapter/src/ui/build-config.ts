export const agentConfigurationDoc: any = {
  fields: [
    {
      name: 'model_light',
      label: 'Lightweight Model',
      type: 'string',
      required: true,
      description: 'Suggested: gemini-2.5-flash, gpt-5.4-mini, or claude-haiku-4-5',
      default: 'gemini-2.5-flash'
    },
    {
      name: 'model_heavy',
      label: 'Heavyweight Model',
      type: 'string',
      required: true,
      description: 'Suggested: gemini-2.5-pro, gpt-5.4, or claude-opus-4-7',
      default: 'gemini-2.5-pro'
    },
    {
      name: 'execution_mode',
      label: 'Execution Mode',
      type: 'enum',
      options: ['sequential', 'parallel'],
      default: 'parallel',
      required: true,
    },
    {
      name: 'api_provider',
      label: 'API Provider',
      type: 'enum',
      options: ['openai', 'anthropic', 'google', 'vertex', 'custom'],
      default: 'anthropic',
      required: true
    },
    {
      name: 'api_key',
      label: 'API Key (Optional if managed env)',
      type: 'string',
      required: false,
    },
    {
      name: 'custom_endpoint',
      label: 'Custom HTTP Endpoint',
      type: 'string',
      required: false,
    },
    {
      name: 'vertex_project_id',
      label: 'Vertex AI Project ID',
      type: 'string',
      required: false,
    },
    {
      name: 'vertex_location',
      label: 'Vertex AI Location (e.g. us-central1)',
      type: 'string',
      required: false,
    }
  ]
};
