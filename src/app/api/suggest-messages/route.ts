import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
try {
    const { messages }: { messages: UIMessage[] } = await req.json();
  
    const result = streamText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that helps people find information.',
        },
        ...convertToModelMessages(messages)],
        maxOutputTokens: 200
    });
  
    return result.toUIMessageStreamResponse();
} catch (error) {
  if (error instanceof Error) {
    return new Response(`Error occured while Ai suggestion created: ${error.message}`, { status: 500 });
  }else {
    return new Response('Unexpected error occured while Ai suggestion created', { status: 500 });
    console.log("Unexpected error occured while Ai suggestion created", error);
  }
}
}