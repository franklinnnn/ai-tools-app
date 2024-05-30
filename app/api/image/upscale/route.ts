import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { url, scale, enhance } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!url) {
      return new NextResponse("Image url or file is required", { status: 400 });
    }

    if(!scale) {
      return new NextResponse("Scale is required", { status: 400 });
    }

      
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();


    if(!freeTrial && !isPro) {
      return new NextResponse('Free trial has expired.', {status: 403})
    }

    const response = await replicate.run(
      "nightmareai/real-esrgan:350d32041630ffbe63c8352783a26d94126809164e54085352f8326e53999085",
      {
        input: {
          image: url,
          scale: scale,
          face_enhance: enhance
        },
      }
    );

    if(isPro) {
      await increaseApiLimit();
    }

    console.log("BACKGROUND RESPONSE", response)


    return NextResponse.json(response);
  } catch (error) {
    console.log("BACKGROUND_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
