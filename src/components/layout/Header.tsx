import Navbar from "./Navbar";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";
import { FaBookmark } from "react-icons/fa";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/shadcn/sheet";
import SelectedPlacesDrawer from "@/components/SelectedPlacesDrawer";

export default function Header() {
    return (
        <header className="px-4 py-2 flex justify-between items-center">
            <Link href="/">
                <img src="/logo.svg" alt="Trip -AI" className="w-20 h-20" />
            </Link>
            <Navbar />
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <FaBookmark className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Saved Places</SheetTitle>
                        <SelectedPlacesDrawer />
                    </SheetContent>
                </Sheet>
                <img src="/user-icon.svg" alt="Trip -AI" className="w-9 h-9" />
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        </header>
    );
}