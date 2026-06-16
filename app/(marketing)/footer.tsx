import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                <Button size="lg" variant="ghost" className="text-sm"> 
                    <Image src="/id.svg" height={32} width={40} alt="Indonesia" className="mr-4 rounded-md" unoptimized/>
                    Indonesian
                </Button>
                <Button size="lg" variant="ghost" className="text-sm"> 
                    <Image src="/cn.svg" height={32} width={40} alt="China" className="mr-4 rounded-md" unoptimized/>
                    Chinese
                </Button>
                <Button size="lg" variant="ghost" className="text-sm"> 
                    <Image src="/jp.svg" height={32} width={40} alt="Japan" className="mr-4 rounded-md" unoptimized/>
                    Japanese
                </Button>
                <Button size="lg" variant="ghost" className="text-sm"> 
                    <Image src="/kr.svg" height={32} width={40} alt="South Korea" className="mr-4 rounded-md" unoptimized/>
                    Korean
                </Button>
                <Button size="lg" variant="ghost" className="text-sm"> 
                    <Image src="/de.svg" height={32} width={40} alt="Deutch" className="mr-4 rounded-md" unoptimized/>
                    Deutch
                </Button>
            </div>
        </footer>
    );
};
