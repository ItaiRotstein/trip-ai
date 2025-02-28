import Navbar from "./Navbar";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";
export default function Header() {
    return (
        <header className="px-4 py-2 flex justify-between items-center">
            <img src="/logo.svg" alt="Trip -AI" className="w-20 h-20" />
            <Navbar />
            <img src="/user-icon.svg" alt="Trip -AI" className="w-9 h-9" />
            <Button asChild className="">
                <Link href="/login">Login</Link>
            </Button>
        </header>
    );
}