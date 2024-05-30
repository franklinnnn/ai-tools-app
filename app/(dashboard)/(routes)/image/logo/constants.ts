import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Logo prompt is required",
  }),
  amount: z.string().min(1),
  resolution: z.string().min(1),
  width: z.string().min(1),
  height: z.string().min(1),
});

export const amountOptions = [
  {
    value: "1",
    label: "1 Image",
  },
  {
    value: "2",
    label: "2 Images",
  },
  {
    value: "3",
    label: "3 Images",
  },
  {
    value: "4",
    label: "4 Images",
  },
];

export const resolutionOptions = [
  {
    value: "512x512",
    label: "512x512",
    width: "512",
    height: "512"
  },
  {
    value: "1024x1024",
    label: "1024x1024",
    width: "1024",
    height: "1024"
  },
  {
    value: "2048x2048",
    label: "2048x2048",
    width: "2048",
    height: "2048"
  },
  // {
  //   value: "4096x4096",
  //   label: "4096x4096",
  //   width: 2048,
  //   height: 2048
  // },
];
