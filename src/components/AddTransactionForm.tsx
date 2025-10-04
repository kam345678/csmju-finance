"use client";

import React, { useState, useEffect, useRef } from "react";
import { register } from "../types/actions/TransFormAction";
import { supabase } from "../lib/supabase/client";

interface AddTransactionFormProps {
  onAdded?: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAdded }) => {
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [type, setType] = useState<"income" | "expense">("income");
  const [categories, setCategories] = useState<
    { category_id: number; name: string }[]
  >([]);
  const [category, setCategory] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  const now = new Date();
  const [time, setTime] = useState<string>(formatTime(now));
  const [date, setDate] = useState<string>(now.toISOString().slice(0, 10));
  const [note, setNote] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("Categories")
        .select("category_id, name");
      if (error) {
        alert("เกิดข้อผิดพลาดในการโหลดหมวดหมู่: " + error.message);
        return;
      }
      setCategories(data || []);
      if (data && data.length > 0) {
        setCategory(data[0].category_id);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล");
        setLoading(false);
        return;
      }

      const inputTime = time || formatTime(new Date());
      const inputDate = date || new Date().toISOString().slice(0, 10);
      const combinedDateTime = new Date(`${inputDate}T${inputTime}:00`);
      const isoDateTime = combinedDateTime.toISOString();

      const formData = new FormData();
      formData.append("type", type);
      formData.append("category", category!.toString());
      formData.append("amount", amount);
      formData.append("date", isoDateTime);
      formData.append("time", inputTime);
      formData.append("note", note);
      if (attachment) formData.append("attachment", attachment);
      formData.append("user_id", user.id);

      await register(formData);

      // Reset form
      setType("income");
      setCategory(0);
      setAmount("");
      setDate(now.toISOString().slice(0, 10));
      setTime(formatTime(new Date()));
      setNote("");
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (onAdded) onAdded();
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/90 p-5 rounded-xl border border-slate-700 shadow-lg space-y-4 text-slate-200"
    >
      {/* ประเภท */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-slate-300">ประเภท</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>
      </div>

      {/* หมวดหมู่ */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-slate-300">หมวดหมู่</label>
        <select
          value={category || ""}
          onChange={(e) => {
            if (e.target.value === "add") {
              window.location.href = "/admin/category";
              return;
            }
            setCategory(parseInt(e.target.value));
          }}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>
              {c.name}
            </option>
          ))}
          <option value="add">+ เพิ่มหมวดหมู่ใหม่</option>
        </select>
      </div>

      {/* จำนวนเงิน */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-slate-300">จำนวนเงิน (บาท)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* วันที่ และ เวลา */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-slate-300">วันที่</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-slate-300">เวลา</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* รายละเอียด */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-slate-300">บันทึกเพิ่มเติม</label>
        <input
          type="text"
          placeholder="เช่น ค่าไฟเดือนกันยายน"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* แนบไฟล์ */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-slate-300">แนบไฟล์ (ถ้ามี)</label>
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) =>
            setAttachment(e.target.files ? e.target.files[0] : null)
          }
          className="block w-full text-sm text-slate-300
            file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600
            file:px-4 file:py-2 file:text-sm file:font-medium
            hover:file:bg-blue-700 cursor-pointer transition"
        />
      </div>

      {/* ปุ่มบันทึก */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold text-white transition-all shadow-md
          ${
            loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? "⏳ กำลังบันทึก..." : " บันทึกข้อมูล"}
      </button>
    </form>
  );
};

export default AddTransactionForm;
