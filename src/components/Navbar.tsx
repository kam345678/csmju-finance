// src/components/Navbar.tsx
"use client";

import Link from "next/link";
// import { usePathname } from "next/navigation";

export default function Navbar() {
  // const pathname = usePathname();

  return (
    <nav className="border-b border-b-foreground/20 shadow-md w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            MyApp
          </Link>

          {/* Menu */}
          <div className="flex space-x-6">
            {/* <Link
              href="/"
              className={`${
                pathname === "/" ? "text-blue-600 font-semibold" : "text-gray-700"
              } hover:text-blue-500`}
            >
              Home
            </Link> */}

            {/* ปุ่ม Login */}
            <Link
              href="/auth/login/#auth-sign-in"
              className= "text-white px-4 py-2 rounded-lg hover:bg-blue-700/30 transition border border-white"
            >
              sign in
            </Link>
            <Link
              href="/auth/login/#auth-sign-up"
              className= "text-white px-4 py-2 rounded-lg hover:bg-blue-700/30 transition border border-white"
            >
              sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}