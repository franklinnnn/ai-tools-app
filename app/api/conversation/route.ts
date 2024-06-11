import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";
import { checkSubscription } from "@/lib/subscription";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";


// const configuration = new Configuration({
//   apiKey: process.env.OPENAIA_API_KEY,
// });

const openai = new OpenAI({
  apiKey: process.env.OPENAIA_API_KEY,
});

const instructionMessage: ChatCompletionMessageParam = {
  role: "system",
  content:
    "You are a chatbot. When you asked to generate or asked about code, you must answer only in markdown code snippets, except for your explanation of the code, and always provide explanations for your code. However, you may also assist with queries that are not code-related.",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("Open API Key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if(!freeTrial && !isPro) {
      return new NextResponse('Free trial has expired.', {status: 403})
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [instructionMessage, ...messages],
    });

    if(isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("CONVERSATION_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
