// server-only
import { createClient } from "@supabase/supabase-js";

export const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// เป็น “Supabase client สำหรับฝั่ง Server เท่านั้น” หรือเรียกง่าย ๆ ว่า Server Admin Client ห้ฝั่ง Server (เช่น API routes หรือ Server Actions)
// สามารถเข้าถึงฐานข้อมูลได้ เต็มสิทธิ์

// Anon Key จำกัดสิทธิ์   (ขึ้นอยู่กับ RLS)        ฝั่ง Client (เช่นหน้าเว็บ)

// Service Role Key   สิทธิ์เต็ม (Admin)      เฉพาะฝั่ง Server เท่านั้น
