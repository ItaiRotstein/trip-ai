import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
        <ul className="">
            <li className="flex items-center gap-8 text-sm">
                <Link href="/" className="hover:underline">Home</Link>
                <Link href="/about" className="hover:underline">About</Link>
                <Link href="/destinations" className="hover:underline">Destinations</Link>
            </li>
        </ul>
    </nav>
  )
}