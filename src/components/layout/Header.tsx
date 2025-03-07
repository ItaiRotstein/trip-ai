'use client';

import Navbar from "./Navbar";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";
import { FaBookmark } from "react-icons/fa";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/shadcn/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import SelectedPlacesDrawer from "@/components/SelectedPlacesDrawer";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import NavbarMobile from "./NavbarMobile";

export default function Header() {
    const { isAuthenticated, logout, userName, setUserName } = useAuth();

    useEffect(() => {
        setUserName(localStorage.getItem('user-name-tripai') || '');
    }, [isAuthenticated]);

    return (
        <header className="px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-4 md:hidden">
                <NavbarMobile />
                <Link href="/">
                    <img src="/logo.svg" alt="Trip -AI" className="w-20 h-20" />
                </Link>
            </div>
            <div className="hidden md:block">
                <Link href="/">
                    <img src="/logo.svg" alt="Trip -AI" className="w-20 h-20" />
                </Link>
            </div>
            <Navbar />
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <FaBookmark className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[100dvw] sm:w-[100dvw] md:w-auto md:max-w-md">
                        <SheetTitle className="sr-only">Saved Places</SheetTitle>
                        <SelectedPlacesDrawer />
                    </SheetContent>
                </Sheet>
                {isAuthenticated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold hover:bg-black/90"
                                title={userName || 'User'}
                            >
                                {userName?.charAt(0).toUpperCase() || "?"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                                className="text-red-600 cursor-pointer"
                                onClick={logout}
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <>
                        <Button variant="outline" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Sign Up</Link>
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}