import { NextResponse } from 'next/server';
import axios from 'axios';

const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY!;
const AZURE_API_ENDPOINT = "https://openai-prod-west-001.openai.azure.com";
const DEPLOYMENT_NAME = "gpt-4o-mini";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const chatPrompt = [
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
          text: prompt,
        },
      ],
    },
  ];

  try {
    const response = await axios.post(
      `${AZURE_API_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/completions?api-version=2024-05-01-preview`,
      {
        model: DEPLOYMENT_NAME,
        messages: chatPrompt,
        max_tokens: 800,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null,
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': `${AZURE_OPENAI_KEY}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error with OpenAI API:', JSON.stringify(error));
    return NextResponse.json({ error: 'Error with OpenAI API' }, { status: 500 });
  }
}