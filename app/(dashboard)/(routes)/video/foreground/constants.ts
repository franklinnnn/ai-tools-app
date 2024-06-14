import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_FILE_TYPES = ['video/mp4']

export const formSchema = z.object({
  url: z.string().url().optional().or(z.literal('')),
  mask: z.string().min(1),
});


export const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    // .refine((file) => ACCEPTED_FILE_TYPES.includes(file[0]?.type), 'Must be an image file'),
    .optional(),
    mask: z.string().min(1)
})


export const maskOptions = [ 
  {
    value: "green-screen",
    label: "Green screen"
  },
  {
    value: "alpha-mask",
    label: "Alpha mask"
  },
  {
    value: "foreground-mask",
    label: "Foreground mask"
  }
]