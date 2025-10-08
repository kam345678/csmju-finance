import React, { useState, useEffect, useRef } from "react";
import { register } from "../../../types/actions/TransFormAction";
import { supabase } from "../../../lib/supabase/client";
import { Transaction } from "@/types";



interface EditTransactionFormProps {
  show: boolean;
  transaction: Transaction | null;
  onUpdated?: () => void;
  onClose: () => void;
  onCancel?: () => void;
}


const EditTransactionForm: React.FC<EditTransactionFormProps> = ({
  show,
  transaction,
  onUpdated,
  onClose,
}) => {
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [type, setType] = useState<"income" | "expense">("income");
  const [categories, setCategories] = useState<{ category_id: number; name: string }[]>([]);
  const [category, setCategory] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>(formatTime(new Date()));
  const [note, setNote] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // โหลด categories
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from("Categories").select("category_id, name");
      if (!error && data) setCategories(data);
    }
    fetchCategories();
  }, []);

  // โหลดข้อมูล transaction ที่จะแก้ไข
  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setCategory(Number(transaction.category));
      setAmount(String(transaction.amount));
      setDate(transaction.date.slice(0, 10));
      setTime(transaction.time.slice(0, 5));
      setNote(transaction.note || "");
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!transaction) return;



    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in before submitting.");
        setLoading(false);
        return;
      }

      const inputTime = time || formatTime(new Date());
      const inputDate = date || new Date().toISOString().slice(0, 10);
      const combinedDateTime = new Date(`${inputDate}T${inputTime}:00`);
      const isoDateTime = combinedDateTime.toISOString();

      const formData = new FormData();
      formData.append("transaction_id", transaction.transaction_id.toString()); // ส่ง id ไปด้วย
      formData.append("type", type);
      const validCategory = categories.find(c => c.category_id === category)?.category_id;
      if (!validCategory) {
        alert("กรุณาเลือกหมวดหมู่ที่ถูกต้อง");
        setLoading(false);
        return;
      }
      formData.append("category", validCategory.toString());
      formData.append("amount", amount);
      formData.append("date", isoDateTime);
      formData.append("time", inputTime);
      formData.append("note", note);
      if (attachment) {
        formData.append("attachment", attachment);
      }
      formData.append("user_id", user.id);

      await register(formData); // ใช้ action เดิม

      if (onUpdated) {
        onUpdated();
      } else if (onClose) {
        onClose();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 w-screen h-screen flex items-center justify-center">
      {/* กล่อง Modal */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 relative animate-fadeIn">
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-red-400 transition"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-emerald-400">
           แก้ไขข้อมูล
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* ประเภท */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">ประเภท</label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "income" | "expense")
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="income">รายรับ</option>
              <option value="expense">รายจ่าย</option>
            </select>
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">หมวดหมู่</label>
            <select
              value={category || ""}
              onChange={(e) => {
                if (e.target.value === "add") {
                  window.location.href = "/admin/category";
                } else {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) setCategory(val);
                }
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
              <option value="add">➕ เพิ่มหมวดหมู่ใหม่</option>
            </select>
          </div>

          {/* จำนวนเงิน */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">จำนวนเงิน</label>
            <input
              type="number"
              value={amount}
              placeholder="จำนวนเงิน (บาท)"
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* วันที่ + เวลา */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">วันที่</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">เวลา</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">รายละเอียด</label>
            <input
              type="text"
              placeholder="รายละเอียดเพิ่มเติม"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* แนบไฟล์ */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">แนบไฟล์</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) =>
                setAttachment(e.target.files ? e.target.files[0] : null)
              }
              className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-white hover:file:bg-emerald-500 cursor-pointer"
            />
          </div>

          {/* ปุ่ม */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-200 transition"
              onClick={onClose}
            >
              ❌ ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
            >
              {loading ? "กำลังอัปเดต..." : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default EditTransactionForm;