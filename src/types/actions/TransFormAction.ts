"use server";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function register(formData: FormData): Promise<void> {
//   const fullname = formData.get("fullname") as string;
//   const email = formData.get("email") as string;
//   const tel = formData.get("tel") as string;
  const file = formData.get("attachment") as File | null;

  const supabase = await createClient();

  let fileUrl: string | null = null;

  if (file && file.size > 0) {
    if (file.size > 20 * 1024 * 1024) { // 20 MB
      throw new Error("File too large, max 20 MB");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;

    // อัปโหลดไฟล์
    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(uploadError.message);
    }

    // สร้าง public URL
    const { data: urlData } = supabase.storage
      .from("attachments")
      .getPublicUrl(fileName);

    fileUrl = urlData.publicUrl;
  }

  // Insert ข้อมูลลง table
  const { error } = await supabase
    .from("Transactions")
    .insert([{attachment_URL: fileUrl }]);

  if (error) {
    console.error("Insert error:", error);
    throw new Error(error.message);
  }

  console.log("Register + upload successful! File URL:", fileUrl);
}