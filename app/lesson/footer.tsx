import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

type Props = {
    onCheck: () => void;
    status: "correct" | "wrong" | "none" | "completed";
    disabled?: boolean;
    lessonId?: number;
    onHint?: () => void;
    hintsUsed?: number;
    isPro?: boolean;
};

export const Footer = ({ onCheck, status, disabled, lessonId, onHint, hintsUsed = 0, isPro = false }: Props) => {
    useKey("Enter", onCheck, {}, [onCheck]);
    const isMobile = useMedia("(max-width: 1024px)");
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true) }, []);

    const hintLimitReached = !isPro && hintsUsed >= 3;

    return (
        <footer className={cn("lg:h-[140px] h-[100px] border-t-2",
            status === "correct" && "border-transparent bg-green-100",
            status === "wrong" && "border-transparent bg-rose-100"
        )}>
            <div className="max-w-[1140px] h-full mx-auto flex items-center justify-center px-6 lg:px-10">
                {status === "correct" && (
                    <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center">
                        <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
                        Noice
                    </div>
                )}
                {status === "wrong" && (
                    <div className="flex items-center gap-x-4">
                        <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center">
                            <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
                            Try again.
                        </div>
                        <Button
                            variant="ghost"
                            size={mounted && isMobile ? "sm" : "lg"}
                            onClick={onHint}
                            disabled={hintLimitReached}
                            className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 flex items-center gap-x-2"
                        >
                            <Lightbulb className="h-4 w-4" />
                            {hintLimitReached ? "No hints left" : `Hint ${isPro ? "" : `(${Math.max(0, 3 - hintsUsed)} left)`}`}
                        </Button>
                    </div>
                )}
                {status === "completed" && (
                    <Button variant="default" size={mounted && isMobile ? "sm" : "lg"} onClick={() => window.location.href = `/lesson/${lessonId}`}>
                        Practice again
                    </Button>
                )}
                <Button disabled={disabled} className="ml-auto" onClick={onCheck} size={mounted && isMobile ? "sm" : "lg"}
                    variant={status === "wrong" ? "danger" : "secondary"}>
                    {status === "none" && "Check"}
                    {status === "correct" && "Next"}
                    {status === "wrong" && "Retry"}
                    {status === "completed" && "Continue"}
                </Button>
            </div>
        </footer>
    );
};