
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
    <div className="flex h-screen bg-slate-900 text-white">
      {/* 🔹 Mobile Overlay เมื่อ Sidebar เปิด */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* 🔹 ส่วนหลัก */}
      <div className="flex-1 flex flex-col">
        {/* 🔸 Navbar */}
        <nav className="border-b border-slate-700 shadow-md w-full sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              
              {/* ปุ่มเปิด Sidebar สำหรับมือถือ */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu size={24} />
              </button>

              {/* โลโก้ */}
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/csfinanceLogo.png"
                    alt="Logo"
                    width={140}
                    height={100}
                    className="drop-shadow-lg"
                  />
                </Link>
              </div>

              {/* ส่วนขวา: email + logout */}
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

        {/* 🔸 โครงหลักของ Dashboard */}
        <div className="flex flex-1 overflow-hidden">
          {/* 🔹 Sidebar */}
          <div
            className={`fixed md:static top-16 bottom-0 left-0 w-64 bg-slate-950 border-r border-slate-800 p-4 transform transition-transform duration-300 ease-in-out z-50
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
          >
            <Sidebar />
          </div>

          {/* 🔹 Main content */}
          <main className="flex-1 overflow-y-auto p-6 bg-slate-900/80 backdrop-blur-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
