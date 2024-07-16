import { Book, Captions, Code, Eraser, ImageIcon, Languages, MessageSquare, Pickaxe, Sparkles, Video } from "lucide-react";

export const tools = [
    {
      name: "Conversations",
      title: "Chat Away, Anytime",
      description: "Here to make your life easier, day or night.",
      features: [
        {
          title: "Research topics",
          icon: Book,
          media: "/landing-conversation-research.png",
          url: "/conversation",
        },
        {
          title: "Translate text quickly",
          icon: Languages,
          media: "/landing-conversation-translation.png",
          url: "/conversation",
        },
        {
          title: "Write code",
          icon: Code,
          media: "/landing-conversation-code.png",
          url: "/conversation",
        },
      ],
      icon: MessageSquare,
    },
    {
      name: "Images",
      title: "Get Creative with Your Visuals",
      description: "Turn ideas into awesome images with a few clicks.",
      features: [
        {
          title: "Generate image from prompt",
          icon: ImageIcon,
          media: "/image-generate.png",
          url: "/image/generate",
        },
        {
          title: "Remove background from image",
          icon: Eraser,
          media: "/landing-image-background.png",
          url: "/mage/background",
        },
        {
          title: "Upscale image quality",
          icon: Sparkles,
          media: "/landing-image-upscale.png",
          url: "/image/upscale",
        },
      ],
      icon: ImageIcon,
    },
    {
      name: "Videos",
      title: "Video Creation Made Simple",
      description:
        "Make video creation a breeze, so you can share your story in style.",
      features: [
        {
          title: "Generate video from prompt",
          icon: Video,
          media: "/video-generate-thumbnail.gif",
          url: "/video/generate",
        },
        {
          title: "Extract foreground of a video",
          icon: Pickaxe,
          media: "/video-foreground-thumbnail.gif",
          url: "/video/foreground",
        },
        {
          title: "Automatically add captions",
          icon: Captions,
          media: "/video-caption-thumbnail.gif",
          url: "/video/caption",
        },
      ],
      icon: Video,
    },
  ];