"use client";

import Image from "next/image";
import { Loader } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";

export const Header = () => {
  const [user, loading] = useAuthState(auth);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        <div className="flex items-center gap-x-3">
          <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-sky-400 tracking-wide">
            BinLingo
          </h1>
        </div>

        <div>
          {(!mounted || loading) && <Loader className="h-5 w-5 text-muted-foreground animate-spin" />}

          {mounted && !loading && user && (
            <button onClick={() => {
              signOut(auth);
              fetch("api/auth/session", { method: "DELETE" });
              router.push("/");
            }}>
              <Image src={user.photoURL || "/default-profile.png"} alt="Profile" width={36} height={36} className="rounded-full cursor-pointer hover:opacity-80 transition"/>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};