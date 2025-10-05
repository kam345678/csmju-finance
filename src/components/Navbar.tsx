// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* โลโก้ */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png" // 🔹 ใส่โลโก้ของ csmju-finance ที่โฟลเดอร์ public
              alt="CSMJU Finance Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text"
            >
              CSMJU Finance
            </Link>
          </div>

          {/* เมนู */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link
              href="/auth/login/#auth-sign-in"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                pathname === "/auth/login"
                  ? "bg-blue-600 text-white shadow-blue-500/40 shadow-md"
                  : "border border-slate-600 text-slate-200 hover:bg-blue-700/30 hover:text-white"
              }`}
            >
              <LogIn size={18} />
              <span>เข้าสู่ระบบ</span>
            </Link>

            <Link
              href="/auth/login/#auth-sign-up"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                pathname === "/auth/register"
                  ? "bg-green-600 text-white shadow-green-500/40 shadow-md"
                  : "border border-slate-600 text-slate-200 hover:bg-green-700/30 hover:text-white"
              }`}
            >
              <UserPlus size={18} />
              <span>สมัครสมาชิก</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
