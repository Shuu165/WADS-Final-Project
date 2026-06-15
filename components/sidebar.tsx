"use client";

import Image from "next/image";
import { Loader } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "@/components/sidebar-item";

type Props = {
    className?: string;
};

export const Sidebar = ({ className }: Props) => {
  const [user, loading] = useAuthState(auth);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

    return (
        <div className={cn("flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
            className,
        )}>
            <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
                <h1 className="text-2xl font-extrabold text-sky-400 tracking-wide">
                    BinLingo
                </h1>
            </div>

            <div className="flex flex-col gap-y-2 flex-1">
                <SidebarItem label="Learn" href="/learn" iconSrc="/learn.svg" />
                <SidebarItem label="Quests" href="/quests" iconSrc="/quests.svg" />
                <SidebarItem label="Shop" href="/shop" iconSrc="/shop.svg" />
            </div>

            <div className="p-4">
                {(!mounted || loading) && <Loader className="h-5 w-5 text-muted-foreground animate-spin" />}

                {mounted && !loading && user && (
                <button onClick={() => {
                    signOut(auth);
                    fetch("/api/auth/session", { method: "DELETE" });
                    router.push("/");
                }} className="flex items-center gap-x-2 text-sm text-muted-foreground hover:text-primary transition">
                    <Image src={user.photoURL ?? "/mascot.svg"} alt="Profile" width={32} height={32} className="rounded-full"/>
                    <h1 className="font-bold">
                        Sign out
                    </h1>
                </button>
            )}
            </div>
        </div> 
    );
};