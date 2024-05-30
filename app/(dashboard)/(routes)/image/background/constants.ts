import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 4;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg']

export const formSchema = z.object({
  url: z.string().url().optional().or(z.literal('')),
});

export const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    .optional()
    // .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type), 'Must be an image file')
})