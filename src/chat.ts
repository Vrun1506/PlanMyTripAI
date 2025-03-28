import OpenAI from "openai";

export async function getGenerativeResponse(message: string): Promise<string> {
  const client = new OpenAI({ apiKey: "" });

  const result = await client.chat.completions.create({
    model: "gpt-4o",
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
  });

  return result.choices[0].message.content! ?? "";
}

export async function getGenerativeResponseFromConversation(messages: string[]): Promise<string> {
  const client = new OpenAI({ apiKey: "" });

  console.log([
    {
      role: 'system',
      content: 'You are an AI assistant that helps people find information.'
    },
    ...(messages.map((message, index) => {
      return {
        role: index % 2 ? "developer" : "user" as any,
        content: message
      }
    }))
  ]);

  const result = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: 'system',
        content: 'You are an AI assistant that helps people find information.'
      },
      ...(messages.map((message, index) => {
        return {
          role: index % 2 ? "developer" : "user" as any,
          content: message
        }
      }))
    ],
  });

  return result.choices[0].message.content! ?? "";
}