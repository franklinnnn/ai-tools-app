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
    const { url, mask } = body;

    console.log("ROUTE_URL", url, mask)

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!url) {
      return new NextResponse("Video url or file is required", { status: 400 });
    }

    if (!mask) {
      return new NextResponse("Mask type is required", { status: 400 });
    }
      
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();


    if(!freeTrial && !isPro) {
      return new NextResponse('Free trial has expired.', {status: 403})
    }

    
    const response = await replicate.run(
      "arielreplicate/robust_video_matting:73d2128a371922d5d1abf0712a1d974be0e4e2358cc1218e4e34714767232bac",
      {
        input: {
          input_video: url,
          output_type: mask,
        }
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
