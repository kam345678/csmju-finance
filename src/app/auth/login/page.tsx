"use client";

import Link from "next/link";
import { Auth } from "@supabase/auth-ui-react";
// import { useSearchParams } from 'next/navigation'
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react"; // ✅ เพิ่ม useState
import { useRouter } from "next/navigation";


export default function AuthPage() {
  const router = useRouter();
  // const searchParams = useSearchParams()
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in') // ✅ เพิ่ม useState

  useEffect(() => {
    // ตรวจสอบ hash เพื่อเปลี่ยน view
    if (typeof window !== 'undefined' && window.location.hash === '#auth-sign-up') {
      setView('sign_up');
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        //  เมื่อ Login สำเร็จ → redirect ได้เลย
        const email = session.user.email;

        if (email === "tk.kam23132@gmail.com"|| email === "khumpeechaiaranon@gmail.com") {
          router.push("/admin/dashboard");
        } else if (email === "b@example.com") {
          router.push("/pageB");
        } else {
          router.push("/user/dashboard");
        }
        
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div>
       <nav className="border-b border-b-foreground/20 shadow-md w-full sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-white">
              MyApp
            </Link>
            {/* Menu */}
            <div className="flex space-x-6">
              {/* ปุ่ม Login */}
            <Link
                 href="/auth/login"
                 className=" text-white px-4 py-2 rounded-lg hover:bg-blue-700/30 transition border border-white">
                 Login
               </Link>
              {/* ปุ่ม Sign Up */}
               <Link
                 href="/auth/login#auth-sign-up"
                 className=" text-white px-4 py-2 rounded-lg hover:bg-blue-700/30 transition border border-white">
                 Sign Up
               </Link>
             </div>
           </div>
         </div>
       </nav> 
      

      <div className="flex items-center justify-center min-h-screen bg-gray-950/10 ">
        <div className="max-w-md w-full bg-gray-900/60 p-6 rounded-2xl  shadow-md border-1 border-gray-300/60">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    inputText: "#900", // บังคับให้ข้อความ input เป็นสีขาว
                  },
                },
              },
              className: {
                button: "bg-green-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg",
                input: "border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-400",
                label: "text-sm font-medium text-gray-700",
                message: " bg-bg-gray-950/10 text-red-500 text-sm", // error message
              }, 
            }}
            view={view} // ✅ ใช้ view จาก state
            socialLayout="horizontal"
            providers={['google', 'github']}
          />
        </div>
      </div>
    </div>
  );
}