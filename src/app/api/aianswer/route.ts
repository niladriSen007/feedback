import { createOpenAI, openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
  });

  return result.toAIStreamResponse();
  } catch (error) {
    if(error instanceof Error){
      return NextResponse.json({
        error: error.message,
        status: 400,
        success: false,
      });
    }else{
      return new Response('An error occurred', { status: 500 });
    }
  }
}