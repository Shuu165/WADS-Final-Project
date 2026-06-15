"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { useChatModal } from "@/store/use-chat-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = {
    role: "user" | "model";
    text: string;
};

type Props = {
    language: string;
};

export const ChatModal = ({ language }: Props) => {
    const { isOpen, close } = useChatModal();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Start chat when modal opens
    useEffect(() => {
        if (isOpen && !hasStarted) {
            setHasStarted(true);
            startChat();
        }
        if (!isOpen) {
            // Reset on close
            setMessages([]);
            setHasStarted(false);
            setInput("");
        }
    }, [isOpen]);

    const startChat = async () => {
        setIsLoading(true);
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Start the chat with a greeting and ask me something simple.",
                history: [],
                language,
            }),
        });
        const data = await res.json();
        setMessages([{ role: "model", text: data.reply }]);
        setIsLoading(false);
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        const updatedMessages: Message[] = [...messages, { role: "user", text: userMessage }];
        setMessages(updatedMessages);
        setIsLoading(true);

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: userMessage,
                history: messages,
                language,
            }),
        });

        const data = await res.json();
        setMessages([...updatedMessages, { role: "model", text: data.reply }]);
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Parse corrections from AI text
    const renderMessageText = (text: string) => {
        // Highlight corrections: ✗ ... → ✓ ...
        const parts = text.split(/(✗[^✓]*→\s*✓[^\n]*)/g);
        return parts.map((part, i) => {
            if (part.match(/✗[^✓]*→\s*✓/)) {
                return (
                    <span key={i} className="block mt-1 text-sm bg-amber-50 border border-amber-200 rounded px-2 py-1 text-amber-700">
                        {part}
                    </span>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col h-[600px] max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <div className="flex items-center gap-x-2">
                        <MessageCircle className="h-5 w-5 text-green-500" />
                        <h2 className="font-bold text-lg text-neutral-700">
                            Practice {language}
                        </h2>
                    </div>
                    <button onClick={close} className="text-neutral-400 hover:text-neutral-600 transition">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-y-3">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex",
                                msg.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-sky-500 text-white rounded-br-sm"
                                        : "bg-neutral-100 text-neutral-700 rounded-bl-sm"
                                )}
                            >
                                {renderMessageText(msg.text)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-neutral-100 rounded-2xl rounded-bl-sm px-4 py-2">
                                <div className="flex gap-x-1 items-center h-5">
                                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t flex items-center gap-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Reply in ${language} or English...`}
                        disabled={isLoading}
                        className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        size="sm"
                        className="rounded-full w-9 h-9 p-0 bg-sky-500 hover:bg-sky-600"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};