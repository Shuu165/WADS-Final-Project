"use client";

import { MessageCircle } from "lucide-react";
import { useChatModal } from "@/store/use-chat-modal";
import { Button } from "@/components/ui/button";

export const ChatButton = () => {
    const { open } = useChatModal();

    return (
        <Button
            onClick={open}
            variant="ghost"
            className="flex items-center gap-x-2 text-sky-500 hover:text-sky-600 hover:bg-green-50 border border-green-200 rounded-xl px-4 py-2"
        >
            <MessageCircle className="h-5 w-5" />
            Practice Chat
        </Button>
    );
};