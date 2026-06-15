import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";

export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <Menu className="text-white" />
            </SheetTrigger>
            <VisuallyHidden>
                <DialogTitle>Sidebar</DialogTitle>
            </VisuallyHidden>
            <SheetContent className="pt-0 z-[100]" side="left">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
};