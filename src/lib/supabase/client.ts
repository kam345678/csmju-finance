// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// เป็นโค้ดสำหรับ สร้างตัวเชื่อมต่อ client ไปยังฐานข้อมูล Supabase
// Client (Browser) หรือโค้ดที่รันบน Frontend เช่น React component, form, dashboard 