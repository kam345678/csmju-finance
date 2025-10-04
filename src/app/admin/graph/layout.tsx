
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
    
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col">
        <nav className="border-b border-b-foreground/20 shadow-md w-full sticky top-0 z-40 bg-slate-950 ">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              
              <button
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-3">
                <Link href="/" className="text-xl font-bold text-white">
                 <Image src="/csfinanceLogo.png" alt="Logo" width={130} height={100} />
                </Link>
              </div>

              <div>
                {email && <span className="mr-4">{email}</span>}
                <LogoutButton />
              </div>
            </div>
          </div>
        </nav>
        <div className="flex flex-1 overflow-hidden">
          <div
            className={`fixed md:static top-16 bottom-0 left-0 w-70 bg-slate-950 p-4 transform transition-transform duration-300 z-50 border-r border-r-foreground/20
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