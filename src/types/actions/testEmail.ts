import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // ชี้ไปที่ไฟล์จริง

import nodemailer from "nodemailer";

(async () => {
  console.log("SMTP_USER:", process.env.SMTP_USER); // debug
  console.log("SMTP_PASS:", process.env.SMTP_PASS);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: "your_test_email@gmail.com",
    subject: "Test Email",
    text: "SMTP test from nodemailer + dotenv",
  });

  console.log("✅ Email sent successfully!");
})();