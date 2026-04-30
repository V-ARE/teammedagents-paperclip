import { ModelStrategy, TracingInfo } from './types.js';
import { z } from 'zod';

export class LLMClient {
  constructor(private config: ModelStrategy, private trace: TracingInfo) {}

  async generateText(prompt: string, tier: 'light' | 'heavy' | 'image', images?: string[], system?: string): Promise<string> {
    const start = Date.now();
    let tokensUsed = 0;
    
    let attempt = 0;
    let result = '';
    
    while (attempt < 3) {
      try {
        const modelName = tier === 'light' ? this.config.light : tier === 'image' ? (this.config.image || this.config.heavy) : this.config.heavy;
        const provider = this.config.apiProvider || 'openai';
        const apiKey = this.config.apiKey || process.env.API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

        if (!apiKey) throw new Error("API Key required.");

        if (provider === 'openai' || provider === 'custom') {
            const endpoint = this.config.customEndpoint || 'https://api.openai.com/v1/chat/completions';
            const messages = [];
            if (system) messages.push({ role: 'system', content: system });
            
            let content = prompt;
            if (images && images.length > 0) {
              content = prompt + "\n[Images included in context]";
            }
            messages.push({ role: 'user', content });

            const payload = {
                model: modelName,
                messages,
                temperature: 0.2
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    ...(this.config.customHeaders || {})
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`OpenAI API Error: ${response.status} - ${errText}`);
            }

            const data: any = await response.json();
            result = data.choices[0]?.message?.content || "";
            tokensUsed = data.usage?.total_tokens || 0;
        } else if (provider === 'anthropic') {
            const endpoint = this.config.customEndpoint || 'https://api.anthropic.com/v1/messages';
            const payload: any = {
                model: modelName,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 4096,
                temperature: 0.2
            };
            if (system) payload.system = system;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    ...(this.config.customHeaders || {})
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Anthropic API Error: ${response.status} - ${errText}`);
            }

            const data: any = await response.json();
            result = data.content?.[0]?.text || "";
            tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
        } else if (provider === 'google') {
            const endpoint = this.config.customEndpoint || `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
            const payload: any = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.2 },
            };
            if (system) {
                payload.systemInstruction = { parts: [{ text: system }] };
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.config.customHeaders || {})
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Google API Error: ${response.status} - ${errText}`);
            }

            const data: any = await response.json();
            result = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            tokensUsed = data.usageMetadata?.totalTokenCount || 0;
        } else if (provider === 'vertex') {
            const vProject = this.config.vertexProjectId || process.env.VERTEX_PROJECT_ID;
            const vLocation = this.config.vertexLocation || process.env.VERTEX_LOCATION || 'us-central1';
            const vToken = this.config.apiKey || process.env.VERTEX_ACCESS_TOKEN || process.env.API_KEY || apiKey;
            
            if (!vProject) throw new Error("Vertex AI requires vertexProjectId (or VERTEX_PROJECT_ID env var)");
            
            const endpoint = this.config.customEndpoint || `https://${vLocation}-aiplatform.googleapis.com/v1/projects/${vProject}/locations/${vLocation}/publishers/google/models/${modelName}:generateContent`;
            
            const payload: any = {
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.2 },
            };
            if (system) {
                payload.systemInstruction = { parts: [{ text: system }] };
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${vToken}`,
                    ...(this.config.customHeaders || {})
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Vertex API Error: ${response.status} - ${errText}`);
            }

            const data: any = await response.json();
            result = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            tokensUsed = data.usageMetadata?.totalTokenCount || 0;
        } else {
             throw new Error(`Provider ${provider} not fully integrated in adapter yet.`);
        }
        break; 
      } catch (e) {
        attempt++;
        if (attempt >= 3) {
            console.error(`LLMClient failed after 3 retries: ${String(e)}`);
            throw e;
        }
        await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt))); 
      }
    }

    const latency = Date.now() - start;
    this.trace.totalTokens += tokensUsed;
    this.trace.totalLatencyMs += latency;
    
    return result;
  }

  async generateJSON<T>(prompt: string, schema: z.Schema<T>, system?: string): Promise<T> {
     const fullPrompt = `${prompt}\n\nYou MUST return raw valid JSON. Do not include markdown codeblocks (\`\`\`json). Just the JSON object.`;
     const text = await this.generateText(fullPrompt, 'heavy', [], system);
     try {
        let cleanText = text.trim();
        if (cleanText.startsWith('\`\`\`json')) cleanText = cleanText.substring(7);
        if (cleanText.startsWith('\`\`\`')) cleanText = cleanText.substring(3);
        if (cleanText.endsWith('\`\`\`')) cleanText = cleanText.substring(0, cleanText.length - 3);
        
        const obj = JSON.parse(cleanText.trim());
        return schema.parse(obj);
     } catch (e) {
        throw new Error(`Failed to parse or validate JSON output:\n${text}\nError: ${e}`);
     }
  }
}

