"use client";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 
                 bg-gradient-to-r from-red-600/70 to-red-500/60 text-white font-medium 
                 hover:from-red-600 hover:to-red-500 hover:shadow-lg hover:shadow-red-900/40 
                 transition-all duration-200 ease-in-out"
    >
      <LogOut size={18} className="opacity-90" />
      ออกจากระบบ
    </button>
  );
}
