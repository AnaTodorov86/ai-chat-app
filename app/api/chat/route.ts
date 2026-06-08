import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";

const gateway = createOpenAI({
  baseURL: process.env.MOCK_GATEWAY_URL ? `${process.env.MOCK_GATEWAY_URL}/v1` : "http://localhost:8000/v1",
  apiKey: "mock-key",
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // Ovde pokušaj da proslediš model direktno kao string
    // umesto preko gateway funkcije ako se buni oko putanje
    model: gateway.chat("gpt-4o-mock"), 
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}