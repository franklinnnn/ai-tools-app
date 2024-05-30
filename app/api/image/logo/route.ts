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
    const { file } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!file) {
      return new NextResponse("File is required", { status: 400 });
    }

      
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();


    if(!freeTrial && !isPro) {
      return new NextResponse('Free trial has expired.', {status: 403})
    }

    const response = await replicate.run(
      "smoretalk/rembg-enhance:4067ee2a58f6c161d434a9c077cfa012820b8e076efa2772aa171e26557da919",
      {
        input: {
          file: file,
        },
      }
    );

    if(isPro) {
      await increaseApiLimit();
    }


    return NextResponse.json(response);
  } catch (error) {
    console.log("LOGO_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
