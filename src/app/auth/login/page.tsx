"use client";

import Link from "next/link";
import Image from "next/image";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#auth-sign-up"
    ) {
      setView("sign_up");
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        //  เมื่อ Login สำเร็จ → redirect ได้เลย
        const email = session.user.email;   //src/app/auth/login/page.tsx

        if (email === "tk.kam23132@gmail.com" || email === "youremail@example.com") {  
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-gradient-to-r from-[#0B1F2D] via-[#123445] to-[#1B3A4B] shadow-lg border-b border-[#123445]/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/csfinanceLogo.png"
                alt="CS Finance Logo"
                width={140}
                height={50}
                priority
              />
            </Link>

            {/* Menu */}
            <div className="flex space-x-4 sm:space-x-6">
              <Link
                href="/auth/login"
                className="px-4 py-2 font-medium rounded-lg border border-white/30 text-white bg-gradient-to-r from-[#0D3C5D] to-[#10577A] shadow-md hover:from-[#10577A] hover:to-[#0D3C5D] hover:scale-105 transition-transform duration-300"
              >
                Login
              </Link>
              <Link
                href="/auth/login#auth-sign-up"
                className="px-4 py-2 font-medium rounded-lg border border-white/30 text-white bg-gradient-to-r from-[#0F2A48] to-[#145C7A] shadow-md hover:from-[#145C7A] hover:to-[#0F2A48] hover:scale-105 transition-transform duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Container */}
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#07121C] via-[#0B1F2D] to-[#123445]">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    inputText: "#fff", // สีตัวอักษรขาว
                    inputBorder: "rgba(255,255,255,0.3)",
                    messageText: "#f87171", // สีข้อความ error
                  },
                },
              },
              className: {
                button:
                  "bg-gradient-to-r from-[#0D3C5D] to-[#10577A] text-white font-bold py-3 px-5 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300",
                input:
                  "bg-white/10 border border-white/30 text-white rounded-lg px-3 py-2 placeholder-white/70 focus:ring-2 focus:ring-[#0D6EAA] focus:outline-none transition",
                label: "text-sm font-semibold text-white/80 mb-1 block",
                message:
                  "text-sm text-red-400 bg-white/10 px-2 py-1 rounded-md mt-1",
              },
            }}
            view={view}
            socialLayout="horizontal"
            providers={["google", "github"]}
          />
        </div>
      </div>
    </div>
  );
}
