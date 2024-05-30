import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 20;
const ACCEPTED_FILE_TYPES = ['video/mp4']

const transcriptSchema = z
  .instanceof(File)
  .refine((file) => {
    return file.type !== 'application/json'
  }, 'Must be a JSON file')
  .optional()

export const formSchema = z.object({
  video: z
    .instanceof(File)
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max file is 20MB.')
    // .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type), 'Must be a video file'),
  // transcriptFile: transcriptSchema,
  ,
  transcript :z
    .instanceof(File)
    .optional(),
  // output_video: z.boolean().optional(),
  // output_transcript: z.boolean().optional(),
  subs_position: z.string().min(1).optional(),
  color: z.string().optional(),
  highlight_color: z.string().optional(),
  // font_size: z.coerce.number().int().positive().min(1).max(10).optional(),
  // max_chars: z.coerce.number().int().positive().min(5).max(25).optional(),
  // opacity: z.coerce.number().int().positive().min(1).max(100).optional(),
  font: z.string().min(1).optional(),
  // stroke_color: z.string().optional(),
  // stroke_width: z.coerce.number().int().positive().min(1).max(10).optional(),
  // kerning: z.coerce.number().int().max(10).optional(),
  // right_to_left: z.boolean().optional(),
  // translate: z.boolean().optional()
});




export const subsPositionOptions = [
  {
    value: "bottom75",
    label: "Bottom 75%"
  },
  {
    value: "center",
    label: "Center"
  },
  {
    value: "top",
    label: "Top"
  },
  {
    value: "bottom",
    label: 'Bottom'
  },
  {
    value: "left",
    label: 'Left'
  },
  {
    value: "right",
    label: 'Right'
  },
]

export const fontOptions = [
  {
    value: "Poppins/Poppins-Bold.ttf",
    label: "Poppins Bold",
    style: {fontFamily: 'Poppins', fontWeight: '700'}
  },
  {
    value: "Poppins/Poppins-BoldItalic.ttf",
    label: "Poppins Bold Italic",
    style: {fontFamily: 'Poppins', fontWeight: '700', fontStyle: 'italic'}

  },
  {
    value: "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf",
    label: "Atkinson Hyperlegible Bold",
    style: {fontFamily: 'Atkinson Hyperlegible', fontWeight: '700'}
  },
  {
    value: "Atkinson_Hyperlegible/AtkinsonHyperlegible-BoldItalic.ttf",
    label: "Atkinson Hyperlegible Bold Italic",
    style: {fontFamily: 'Atkinson Hyperlegible', fontWeight: '700', fontStyle: 'italic'}
  },
  {
    value: "M_PLUS_Rounded_1c/MPLUSRounded1c-ExtraBold.ttf",
    label: "M Plus Rounded 1c",
    style: {fontFamily: 'M PLUS Rounded 1c', fontWeight: '900'}
  },
  {
    value: "Arial/Arial_Bold.ttf",
    label: "Arial",
    style: {fontFamily: 'Arial', fontWeight: 'bold'}
  },
  {
    value: "Tajawal/Tajawal-Bold.ttf",
    label: "Tajawal",
    style: {fontFamily: 'Tajawal', fontWeight: '700'}
  },
]