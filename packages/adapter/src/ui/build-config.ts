export const agentConfigurationDoc: any = {
  fields: [
    {
      name: 'model_light',
      label: 'Lightweight Model',
      type: 'string',
      required: true,
      default: 'claude-3-haiku-20240307' // fallback default string
    },
    {
      name: 'model_heavy',
      label: 'Heavyweight Model',
      type: 'string',
      required: true,
      default: 'claude-3-opus-20240229'
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
      options: ['openai', 'anthropic', 'google', 'custom'],
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
    }
  ]
};
