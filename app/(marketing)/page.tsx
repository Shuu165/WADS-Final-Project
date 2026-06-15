"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      <div className="relative w-[190px] h-[190px] lg:w-[274px] lg:h-[274px] mb-8">
        <Image src="/everyone.svg" fill alt="Everyone" />
      </div> 

      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
          Learn, Practice, and Have Fun learning and mastering new languages with Binlingo!
        </h1>
      

        {mounted && !loading && !user && (
          <div className="flex flex-col items-center gap-y-3 w-full max-w-[330px]">
            <Button onClick={() => router.push("/register")} size="lg" variant="primary" className="w-full">
              Get started
            </Button>
            <Button onClick={() => router.push("/login")} size="lg" variant="secondaryOutline" className="w-full">
              I already have an account
            </Button>
          </div>
        )}

        {mounted && !loading && user && (
          <Button onClick={() => router.push("/learn")} size="lg" variant="primary" className="w-full max-w-[330px]">
            Continue learning
          </Button>
        )}
      </div>
    </div>  
  )
}