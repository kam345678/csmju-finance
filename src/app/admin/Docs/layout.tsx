"use client";
import { LogoutButton } from "@/components/logout_buton";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => data.subscription?.unsubscribe();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-tr from-[#07121C] via-[#0B1F2D] to-[#123445] text-white font-sans">
      
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col">
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-gradient-to-r from-[#0B1F2D] via-[#123445] to-[#1B3A4B] shadow-lg border-b border-white/20">
          <div className="px-6 sm:px-8 lg:px-10">
            <div className="flex justify-between h-16 items-center">
              {/* Mobile toggle */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu size={24} />
              </button>

              {/* Logo */}
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Image
                  src="/csfinanceLogo.png"
                  alt="CS Finance Logo"
                  width={140}
                  height={100}
                  priority
                  className="drop-shadow-lg"
                />
              </Link>
              <div className="flex items-center gap-6">
                <Link href="admin/Docs" className="hidden sm:inline-block">
                  Docs
                </Link>
                {/* Email + Logout */}
                <div className="flex items-center gap-3">
                  {email && (
                    <span className="hidden sm:inline text-white/70 text-sm">
                      {email}
                    </span>
                  )}
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6 bg-zinc-900 backdrop-blur-sm border-l border-white/10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
