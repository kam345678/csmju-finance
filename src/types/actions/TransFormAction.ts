"use server";
import { v4 as uuidv4 } from "uuid";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export async function register(formData: FormData): Promise<void> {
  const transaction_id = formData.get("transaction_id") as string | null;
  const user_id = formData.get("user_id") as string;
  const type = formData.get("type") as "income" | "expense";
  const category = parseInt(formData.get("category") as string);
  const amount = parseFloat(formData.get("amount") as string);
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const note = formData.get("note") as string;
  const file = formData.get("attachment") as File | null;
  const supabase = createServerComponentClient({ cookies });
  let attachment_URL = "";
  
  if (!user_id) {
    throw new Error("ไม่พบ user ต้องล็อกอินก่อน");
  }

  let insertedTransactionId = transaction_id;

  if (transaction_id) {
    //  Update
    const { error } = await supabase
      .from("transactions")
      .update({ type, category, amount, date, time, note })
      .eq("transaction_id", transaction_id);

    if (error) throw new Error(error.message);
    console.log("Update successful! ID:", transaction_id);
  } else {
    //  Insert
    const { data, error } = await supabase.from("transactions").insert([
      { user_id, type, category, amount, date, time, note },
    ]).select();
    if (error) throw new Error(error.message);
    insertedTransactionId = data![0].transaction_id;
    console.log("Insert successful! ID:", insertedTransactionId);
  }

  // Upload file ถ้ามี
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

    attachment_URL = urlData.publicUrl;

    // Update row ด้วย attachment_URL
    const { error: updateRowError } = await supabase
      .from("transactions")
      .update({ attachment_URL })
      .eq("transaction_id", insertedTransactionId);

    if (updateRowError) {
      console.error("Update attachment URL error:", updateRowError);
      throw new Error(updateRowError.message);
    }
  }

  console.log("Register + upload successful! File URL:", attachment_URL);
}