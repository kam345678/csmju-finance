"use server";
import { v4 as uuidv4 } from "uuid";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
}

export async function register(formData: FormData): Promise<void> {
  const transaction_id = formData.get("transaction_id") as string | null;    // รับบข้อมูลจากฟอร์ม
  const user_id = formData.get("user_id") as string;
  const type = formData.get("type") as "income" | "expense";
  const categoryStr = formData.get("category") as string | null;
  if (!categoryStr || isNaN(Number(categoryStr))) {
    throw new Error("Category must be a valid number");
  }
  const category = parseInt(categoryStr);
  const amount = parseFloat(formData.get("amount") as string);
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const note = formData.get("note") as string;
  const file = formData.get("attachment") as File | null;
  
  // Removed unused cookieStore variable as per instruction
  // Changed to use cookies() directly (Next.js 15 synchronous)
  const supabase = createServerComponentClient({ cookies });
  let attachment_URL: string | null = null; // Explicitly null when no file uploaded

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,      //เชื่อมกับ supabase
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  );

  if (!user_id) {
    throw new Error("ไม่พบ user ต้องล็อกอินก่อน");
  }

  // Check if category exists in Categories table
  const { data: categoryData, error: categoryError } = await supabase     //ตรวจสอบว่าหมวดหมู่ที่ผู้ใช้เลือก มีอยู่จริง
     .from("Categories")
    .select("category_id")
    .eq("category_id", category)
    .maybeSingle();

  if (categoryError) {
    throw new Error(`Error checking category: ${categoryError.message}`);
  }
  if (!categoryData) {
    throw new Error(`Category with id ${category} does not exist`);
  }

  let insertedTransactionId = transaction_id;      

<<<<<<< HEAD
  if (transaction_id) {
    // Update using supabaseAdmin to bypass RLS and prevent duplicate key errors
    const { error } = await supabaseAdmin
=======
  if (transaction_id) {             //ถ้ามี transaction_id -> update รายการนั้น
    //  Update
    const { error } = await supabase
>>>>>>> asdfg
      .from("transactions")
      .update({ type, category, amount, date, time, note })
      .eq("transaction_id", transaction_id);

    if (error) throw new Error(error.message);
    console.log("Update successful! ID:", transaction_id);
  } else {         //นอกนั้นเพิ่มข้อมูลหรือถ้ายังไม่มีข้อมูลเช่น ถ้ายังไม่มี transaction_id เป็นการ insert นะ 
    // Upload file first if exists
<<<<<<< HEAD
    if (file && file.size > 0) {
      if (file.size > 20 * 1024 * 1024) throw new Error("File too large, max 20 MB");
      // const fileExt = file.name.split(".").pop();

      // Prepend uuidv4 to file name to ensure uniqueness (changed as per instruction)
      const safeFileName = sanitizeFileName(file.name);
      const fileName = `${uuidv4()}_${safeFileName}`;
      const { error: uploadError } = await supabase.storage.from("attachments").upload(fileName, file);
      if (uploadError) throw new Error(uploadError.message);
      const { data: urlData } = supabase.storage.from("attachments").getPublicUrl(fileName);
      attachment_URL = urlData.publicUrl;
    } else {
      attachment_URL = null; // Explicitly set to null when no file uploaded
=======
    let attachment_URL = ""; 

    if (file && file.size > 0) {
      if (file.size > 20 * 1024 * 1024) throw new Error("File too large, max 20 MB");      // กำหนดขนาด ไฟล์
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;                                                          //แปลงชื่อไฟล์ เป็น URL
      const { error: uploadError } = await supabase.storage.from("attachments").upload(fileName, file);
      if (uploadError) throw new Error(uploadError.message);
      const { data: urlData } = supabase.storage.from("attachments").getPublicUrl(fileName);              
      attachment_URL = urlData.publicUrl;                                                           //สร้าง public URL
>>>>>>> asdfg
    }

    // Prepare transaction data
    const transactionInsertData: {       //เตรียมข้อมูล สำหรับการทำธุรกรรม
      user_id: string;
      type: "income" | "expense";
      category: number;
      amount: number;
      date: string;
      time: string;
      note: string;
      attachment_URL?: string;
    } = { user_id, type, category, amount, date, time, note };
    // เพิ่มเฉพาะเมื่อมีไฟล์จริงเท่านั้น
    if (attachment_URL && attachment_URL !== "null" && attachment_URL !== "undefined") {
      const { data: existingFile } = await supabase
        .from("transactions")
        .select("transaction_id")
        .eq("attachment_URL", attachment_URL)
        .maybeSingle();

      if (existingFile) {
        console.warn("Attachment URL already exists, skipping attachment_URL to avoid duplicate:", attachment_URL);
      } else {
        transactionInsertData.attachment_URL = attachment_URL;
      }
    }

<<<<<<< HEAD
    console.log("attachment_URL before insert:", attachment_URL);

    // Insert using supabaseAdmin to bypass RLS and prevent duplicate key errors (changed as per instruction)
    const { data, error } = await supabaseAdmin.from("transactions").insert([transactionInsertData]).select();
=======
    const { data, error } = await supabase.from("transactions").insert([transactionInsertData]).select(); 
>>>>>>> asdfg
    if (error) throw new Error(error.message);
    insertedTransactionId = data![0].transaction_id;
    console.log("Insert successful! ID:", insertedTransactionId);
  }

  // Upload file ถ้ามี and transaction_id exists (update case)
  if (file && file.size > 0 && transaction_id) {
    if (file.size > 20 * 1024 * 1024) { // 20 MB
      throw new Error("File too large, max 20 MB");
    }

    // const fileExt = file.name.split(".").pop();
    // Prepend uuidv4 to file name for uniqueness (changed as per instruction)
    const safeFileName = sanitizeFileName(file.name);
    const fileName = `${uuidv4()}_${safeFileName}`;

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

    // ตรวจสอบก่อนว่า URL นี้ถูกใช้ในตารางหรือยัง
    const { data: existingFile } = await supabase
      .from("transactions")
      .select("transaction_id")
      .eq("attachment_URL", attachment_URL)
      .maybeSingle();

    // ถ้ายังไม่ถูกใช้ หรือเป็น transaction เดียวกัน ค่อยอัปเดต
    if (!existingFile || existingFile.transaction_id === insertedTransactionId) {
      // Update using supabaseAdmin to bypass RLS and prevent duplicate key errors (changed as per instruction)
      const { error: updateRowError } = await supabaseAdmin
        .from("transactions")
        .update({ attachment_URL: attachment_URL || null })
        .eq("transaction_id", insertedTransactionId);

      if (updateRowError) {
        console.error("Update attachment URL error:", updateRowError);
        throw new Error(updateRowError.message);
      }
    } else {
      console.warn("Attachment URL already used, skipping update:", attachment_URL);
    }

  }

  // Fetch transaction details for email content (after attachment_URL update)
  const { data: transactionData, error: transactionError } = await supabase             // เตรียมข้อมูลธุรกรรม สำหรับการส่งอีเมล
    .from("transactions")
    .select("*")
    .eq("transaction_id", insertedTransactionId)
    .single();

  if (transactionError) {
    console.error("Error fetching transaction for email:", transactionError);
    throw new Error(transactionError.message);
  }
  const {error: testError } = await supabaseAdmin.auth.admin.listUsers();
    if (testError) {
      console.error("Admin test error:", testError.message);
      throw new Error("Service key invalid or unauthorized");
    }
  // Fetch user who performed the action
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id);       // ดึงข้อมูลผู้ส่ง admin/คนที่ทำธุรกรรม
  if (userError) {
    console.error("Error fetching user info for email:", userError);
    throw new Error(userError.message);
  }

  // Fetch all users to send email
  const { data: allUsers, error: allUsersError } = await supabaseAdmin.auth.admin.listUsers();         // ดึงข้อมูล ผู้รับอีเมล
  if (allUsersError) {
    console.error("Error fetching all users for email:", allUsersError);
    throw new Error(allUsersError.message);
  }

  // Setup nodemailer transporter (example using SMTP, adjust as needed)
  const transporter = nodemailer.createTransport({                            // เชื่อมต่อกับ nodemailer 
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Compose email content
  const emailSubject = transaction_id ? "Transaction Updated" : "New Transaction Registered";       // เนืื้อหาที่จะส่งในอีเมลมีอะไรบ้าง
  const emailBody = `
    <p>A transaction has been ${transaction_id ? "updated" : "registered"} by user: ${userData.user.email} (ID: ${user_id})</p>
    <p><strong>Transaction Details:</strong></p>
    <ul>
      <li>Type: ${transactionData.type}</li>
      <li>Category: ${transactionData.category}</li>
      <li>Amount: ${transactionData.amount}</li>
      <li>Date: ${transactionData.date}</li>
      <li>Time: ${transactionData.time}</li>
      <li>Note: ${transactionData.note}</li>
      <li>Attachment URL: ${attachment_URL ? attachment_URL : "None"}</li>
    </ul>
  `;

  // Send email to all users                      // วนลูปส่ง email ตามอีเมล ที่มีอยู่ใน ตาราง user (Authentication)
  for (const user of allUsers.users) {
    if (user.email) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"Finance App" <no-reply@example.com>',
          to: user.email,
          subject: emailSubject,
          html: emailBody,
        });
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError);
      }
    }
  }

  console.log("Register + upload successful! File URL:", attachment_URL);
}
