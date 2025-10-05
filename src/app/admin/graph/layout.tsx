"use client";
import { LogoutButton } from "@/components/logout_buton";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Sidebar from "@/components/tutorial/Sidebar";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => data.subscription?.unsubscribe();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-tr from-[#07121C] via-[#0B1F2D] to-[#123445] text-white">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col">
        {/* ✅ Navbar */}
        <nav className="border-b border-[#123445]/30 shadow-lg w-full sticky top-0 z-40 backdrop-blur-md bg-gradient-to-r from-[#0B1F2D] via-[#123445] to-[#1B3A4B]">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <button
                className="md:hidden hover:scale-110 transition-transform duration-200"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu size={24} />
              </button>

              {/* ✅ Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/csfinanceLogo.png"
                  alt="Logo"
                  width={140}
                  height={50}
                  priority
                />
              </Link>

              {/* ✅ User & Logout */}
              <div className="flex items-center gap-3">
                {email && <span className="text-white/80 text-sm">{email}</span>}
                <LogoutButton />
              </div>
            </div>
          </div>
        </nav>

        {/* ✅ Sidebar + Main */}
        <div className="flex flex-1 overflow-hidden">
          <div
            className={`fixed md:static top-16 bottom-0 left-0 w-64 bg-gradient-to-b from-[#0B1F2D] via-[#123445] to-[#1B3A4B] p-4 transform transition-transform duration-300 z-50 border-r border-[#123445]/40
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
          >
            <Sidebar />
          </div>

          <main className="flex-1 overflow-y-auto p-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
