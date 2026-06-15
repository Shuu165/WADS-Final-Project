import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                <Button size="lg" variant="ghost" className="text-sm"> 
                    <Image src="/US.svg" height={32} width={40} alt="United States" className="mr-4 rounded-md"/>
                    English
                </Button>
                <Button size="lg" variant="ghost" className="text-sm"> 
                    <Image src="/ID.svg" height={32} width={40} alt="Indonesia" className="mr-4 rounded-md"/>
                    Indonesian
                </Button>
                <Button size="lg" variant="ghost" className="text-sm"> 
                    <Image src="/CN.svg" height={32} width={40} alt="China" className="mr-4 rounded-md"/>
                    Chinese
                </Button>
                <Button size="lg" variant="ghost" className="text-sm"> 
                    <Image src="/JP.svg" height={32} width={40} alt="Japan" className="mr-4 rounded-md"/>
                    Japanese
                </Button>
                <Button size="lg" variant="ghost" className="text-sm"> 
                    <Image src="/KR.svg" height={32} width={40} alt="South Korea" className="mr-4 rounded-md"/>
                    Korean
                </Button>
            </div>
        </footer>
    );
};
