import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */

// สร้าง Supabase Client สำหรับใช้งานในฝั่ง Server ของ Next.js หรือพูดง่าย ๆ ก็คือ “ตัวเชื่อมระหว่าง Next.js Server กับ Supabase”

export async function createClient() {
  const cookieStore = await cookies();   // สร้างตัวแปร cookieStore เพื่อเก็บ cookie ของผู้ใช้ที่กำลังส่ง request เข้ามา
                                        //  จากนั้นจะส่ง cookie นี้ให้ Supabase ใช้ตรวจสอบ session (ว่าใครล็อกอินอยู่)
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

