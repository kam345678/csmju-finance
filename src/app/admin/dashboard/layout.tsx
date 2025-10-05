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
    <div className="flex h-screen bg-gradient-to-br from-[#07121C] via-[#0B1F2D] to-[#123445] text-white font-inter">
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 w-full bg-[#0D2A3C]/90 backdrop-blur-md shadow-lg border-b border-[#123445]/40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              
              {/* Mobile toggle */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-[#123445]/40 transition"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu size={24} />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/csfinanceLogo.png"
                  alt="Logo"
                  width={140}
                  height={100}
                  className="drop-shadow-2xl"
                />
              </Link>

              {/* Email + logout */}
              <div className="flex items-center gap-3">
                {email && (
                  <span className="hidden sm:inline text-gray-300 text-sm">
                    {email}
                  </span>
                )}
                <LogoutButton />
              </div>
            </div>
          </div>
        </nav>

        {/* Main section */}
        <div className="flex flex-1 overflow-hidden">
          {/* ✅ Sidebar (เปลี่ยนให้เหมือนหน้า graph) */}
          <div
            className={`fixed md:static top-16 bottom-0 left-0 w-72 
            bg-gradient-to-b from-[#0B1F2D] via-[#123445] to-[#1B3A4B] 
            border-r border-[#123445]/40 p-4 transform transition-transform duration-300 ease-in-out z-50
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 
            rounded-r-xl shadow-2xl`}
          >
            <Sidebar />
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-[#0B1F2D]/70 backdrop-blur-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
