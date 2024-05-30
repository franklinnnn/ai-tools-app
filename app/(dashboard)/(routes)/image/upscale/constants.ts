import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 4;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg']

export const formSchema = z.object({
  url: z.string().url().min(1),
  scale: z.coerce.number().int().positive().min(1).max(10),
  enhance: z.boolean()
});

export const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    // .refine((file) => ACCEPTED_FILE_TYPES.includes(file[0]?.type), 'Must be an image file'),
    .optional(),
    scale: z.coerce.number().int().positive().min(1).max(10),
    enhance: z.boolean()
})