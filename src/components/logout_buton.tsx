"use client";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
      <button
        onClick={handleLogout}
        className="border border-gray-300/60 px-4 py-2 bg-red-600/60 text-white rounded-lg  hover:bg-red-600/80 "
      >
        sign out
      </button>
  );
}