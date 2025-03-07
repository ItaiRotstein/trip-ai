import Link from "next/link";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetDescription 
} from "@/components/shadcn/sheet";
import { Button } from "@/components/shadcn/button";
import { FaBars } from "react-icons/fa";

export default function NavbarMobile() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-12 w-12">
            <FaBars className="h-8 w-8" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-full">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation links for Trip AI
          </SheetDescription>
          <nav className="flex flex-col gap-4 mt-8">
            <Link 
              href="/" 
              className="text-lg hover:text-gray-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-lg hover:text-gray-600 transition-colors"
            >
              About
            </Link>
            <Link 
              href="/destinations" 
              className="text-lg hover:text-gray-600 transition-colors"
            >
              Destinations
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
} 