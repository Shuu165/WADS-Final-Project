"use client";

import { useHintModal } from "@/store/use-hint-modal";
import { Button } from "@/components/ui/button";
import { X, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown"

export const HintModal = () => {
    const { isOpen, hint, isLoading, close } = useHintModal();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2 text-amber-500 font-bold text-lg">
                        <Lightbulb className="h-6 w-6" />
                        Hint
                    </div>
                    <button onClick={close} className="text-neutral-400 hover:text-neutral-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="text-neutral-700 text-sm lg:text-base leading-relaxed">
                    {isLoading ? (
                        <div className="flex items-center gap-x-2 text-neutral-400">
                            <div className="animate-spin h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full" />
                            Generating hint...
                        </div>
                    ) : (
                        <div className="text-neutral-700 text-sm lg:text-base leading-relaxed prose prose-sm max-w-none">
                            <ReactMarkdown>{hint}</ReactMarkdown>
                        </div>
                    )}
                </div>
                <Button variant="secondary" onClick={close} className="w-full">
                    Got it!
                </Button>
            </div>
        </div>
    );
};