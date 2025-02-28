import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
        <ul className="">
            <li className="flex items-center gap-4 text-sm">
                <Link href="/" className="hover:underline">Home</Link>
                <Link href="/about" className="hover:underline">About</Link>
                <Link href="/contact" className="hover:underline">Contact</Link>
                <Link href="/destinations" className="hover:underline">Destinations</Link>
                <Link href="/blog" className="hover:underline">Blog</Link>
                <Link href="/login" className="hover:underline">Login</Link>
                <Link href="/register" className="hover:underline">Register</Link>
            </li>
        </ul>
    </nav>
  )
}