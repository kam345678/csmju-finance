"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type MenuItem = {
  name: string;
  href: string;
};

const MENU_ITEMS: MenuItem[] = [
  { name: "แดชบอร์ด", href: "/admin/dashboard" },
  { name: "รายการ", href: "/admin/Transaction_History" },
  { name: "กราฟ", href: "/admin/graph" },
  { name: "หมวดหมู่", href: "/admin/category" },
];

export default function Sidebar() {
  const [email, setEmail] = useState<string | null>(null);
  const pathname = usePathname(); // ใช้ดึง path ปัจจุบัน

  useEffect(() => {
    // ดึง session ปัจจุบัน
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => data.subscription?.unsubscribe();
  }, []);

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <div className="mb-8 font-bold text-lg"></div>

      <nav className="flex-1 flex flex-col gap-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg transition ${
                isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700/50"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {email && <div className="mt-auto text-sm text-gray-300">{email}</div>}
    </aside>
  );
}