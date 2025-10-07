import Link from "next/link";
import Image from "next/image";
import { SupabaseLogo } from "../components/supabase-logo";
import { NextLogo } from "../components/next-logo";


export default function Home() {
  return (
    <div>
      
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-gradient-to-r from-[#0B1F2D] via-[#123445] to-[#1B3A4B] shadow-lg border-b border-[#123445]/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between h-16 items-center">
           
            <Link href="/" className="flex items-center">
              <Image
                src="/csfinanceLogo.png"
                alt="CS Finance Logo"
                width={140}
                height={50}
                priority
              />
            </Link>

            
            <div className="flex space-x-4 sm:space-x-6">
              <Link
                href="/auth/login"
                className="px-4 py-2 font-medium rounded-lg border border-white/30 text-white bg-gradient-to-r from-[#0D3C5D] to-[#10577A] shadow-md hover:from-[#10577A] hover:to-[#0D3C5D] hover:scale-105 transition-transform duration-300"
              >
                Sign In
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
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 ">
        <div className="flex flex-col items-center gap-6">
          <div className="max-w-3xl flex flex-col items-center ">
            <div className="flex gap-2">
              <h1 className="text-9xl sm:text-5xl font-bold mb-4 text-green-700 ">Csmju</h1>
              <h1 className="text-9xl sm:text-5xl font-bold mb-4"> Finance</h1>
            </div>
            <p className="text-lg sm:text-xl text-gray-200 mb-8">
              ระบบจัดการรายรับรายจ่ายสำหรับนักศึกษา <br/>
              คณะวิทยาศาสตร์ สาขาวิทยาการคอมพิวเตอร์ และบุคลากรมหาวิทยาลัยแม่โจ้<br/>
              ที่ช่วยให้ติดตามการเงินได้ง่าย จัดหมวดหมู่รายจ่าย และวิเคราะห์พฤติกรรมทางการเงิน
            </p>
           
          </div>


        
          <div className="mt-16 flex gap-6 justify-center items-center opacity-80">
            <a
              href="https://supabase.com/"
              target="_blank"
              rel="noreferrer"
            >
              <SupabaseLogo />
            </a>
            <p>|</p>
            <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
              <NextLogo />
            </a>
            <p>|</p>
            <Image
              src="/favicon.ico"
              alt="Vercel Logo"
              width={50}
              height={50}
              priority
            />
          </div>
          <Link
              href="/auth/login"
              className="px-6 py-3 text-lg font-medium rounded-lg border border-white/30 bg-gradient-to-r from-green-600/50 to-green-700/50
               hover:from-green-700/50 hover:to-green-600/50 shadow-md hover:scale-105 transition-transform duration-300"
            >
              เริ่มต้นใช้งาน
            </Link>
        </div>
       
      </main>
    </div>
  );
}