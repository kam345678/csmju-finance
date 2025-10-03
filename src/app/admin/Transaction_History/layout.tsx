"use client";
import { LogoutButton} from "@/components/logout_buton"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Sidebar from "@/components/tutorial/Sidebar";

export default function TransactionHistoryLayout({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // ดึง session ปัจจุบัน
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? null);
    });

    // subscribe การเปลี่ยนแปลงของ auth state (login/logout)
    const { data} = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => data.subscription?.unsubscribe();
  }, []);

  return (
    <div>
      <nav className="border-b border-b-foreground/20 shadow-md w-full sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-white">
              MyApp
            </Link>
            <div>
              {/* Email ของ user */}
              {email && <span className="text-white mr-4">{email}</span>}
              {/* ปุ่ม Login */}
              <LogoutButton />
             </div>
          </div>
        </div>
      </nav>
      <div className="flex">
          <Sidebar />
        <div className="flex-1 flex flex-col gap-20 p-5 h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}