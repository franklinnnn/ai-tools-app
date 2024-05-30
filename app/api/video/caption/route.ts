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
    const { video_file_input, transcript_file_input, color, highlight_color, subs_position } = body;

    console.log("ROUTE_URL", body)

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!video_file_input) {
      return new NextResponse("Video url or file is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();


    if(!freeTrial && !isPro) {
      return new NextResponse('Free trial has expired.', {status: 403})
    }

    
    const response = await replicate.run(
      "fictions-ai/autocaption:18a45ff0d95feb4449d192bbdc06b4a6df168fa33def76dfc51b78ae224b599b",
      {
        input: {
          font: "Poppins/Poppins-Bold.ttf",
          color: color,
          kerning: 0,
          opacity: 0,
          MaxChars: 20,
          fontsize: 6,
          translate: true,
          output_video: true,
          stroke_color: "black",
          stroke_width: 0.6,
          right_to_left: false,
          subs_position: subs_position,
          highlight_color: highlight_color,
          video_file_input: video_file_input,
          output_transcript: true,
          transcript_file_input: transcript_file_input
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
