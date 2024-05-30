"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  ImageIcon,
  MessageSquare,
  Music,
  Video,
  Zap,
} from "lucide-react";

import { useProModal } from "@/hooks/useProModal";
import { Badge } from "@/components/ui/badge";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    label: "Video Generation",
    icon: Video,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    label: "Code Generation",
    icon: MessageSquare,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

export const ProModal = () => {
  const proModal = useProModal();
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = await response.data.url;
    } catch (error) {
      console.log("STRIPE_CLIENT_ERROR", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              Upgrade to Egguheddo
              <Badge variant="premium" className="uppercase text-sm py-1">
                Pro
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
          {tools.map((tool) => (
            <Card
              key={tool.label}
              className="p-3 border-black-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-x-4">
                <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                  <tool.icon className={cn("w-6 h-6", tool.color)} />
                </div>
                <div className="font-semibold text-sm">{tool.label}</div>
              </div>
              <Check className="text-primary w-5 h-5" />
            </Card>
          ))}
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={onSubscribe}
            variant="premium"
            className="w-full"
            disabled={loading}
          >
            Upgrade <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
