import { AzureOpenAI, AzureClientOptions } from "openai";

const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY!;
const AZURE_API_ENDPOINT = "https://alric-m8a7ll8r-eastus2.openai.azure.com/";

export async function getGenerativeResponse(message: string): Promise<string> {
  // Initialize the DefaultAzureCredential
  const apiVersion = "2024-05-01-preview";
  const deployment = "gpt-4o-mini-hackathon";

  const config: AzureClientOptions = {
    endpoint: AZURE_API_ENDPOINT,
    apiKey: AZURE_OPENAI_KEY,
    apiVersion,
    deployment
  }

  // Initialize the AzureOpenAI client with Entra ID (Azure AD) authentication
  const client = new AzureOpenAI(config);

  const result = await client.chat.completions.create({
    model: deployment,
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: 'You are an AI assistant that helps people find information.',
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: message,
          },
        ],
      },
    ],
    max_tokens: 800,
    temperature: 0.7,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: null
  });

  return result.choices[0].message.content! ?? "";
}