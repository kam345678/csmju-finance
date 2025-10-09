import React, { useState, useEffect,useRef } from "react";
import { register } from "../../../types/actions/TransFormAction";
import { supabase } from "../../../lib/supabase/client";



interface AddTransactionFormProps {
  onAdded?: () => void;
  onClose: () => void;
  onCancel: () => void;
  show: boolean;
}

const AddTransactionForm2: React.FC<AddTransactionFormProps> = ({  show, onClose,onAdded }) => {
  
  const formatTime = (date: Date) => { //จัดรูปแบบเวลา
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
 
  const [type, setType] = useState<"income" | "expense">("income");

  const [categories, setCategories] = useState<{ category_id: number; name: string }[]>([]);
  const [category, setCategory] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  const now = new Date();
  const [time, setTime] = useState<string>(formatTime(now));
  const [date, setDate] = useState<string>(now.toISOString().slice(0, 10));

  const [note, setNote] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { //ดึงข้อมูลหมวดหมู่ จาก Categories 
    async function fetchCategories() {
      const { data, error } = await supabase.from('Categories').select('category_id, name');
      if (error) {
        alert('เกิดข้อผิดพลาดในการโหลดหมวดหมู่: ' + error.message);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in before submitting.");
        setLoading(false);
        return;
      }

      // Use current date and time if not provided
      const inputTime = time && time !== "" ? time : formatTime(new Date());
      
      
      const currentDate = new Date();
      const inputDate = date ? date : currentDate.toISOString().slice(0, 10);
      // const inputTime = time ? time : formatTime(new Date());

      const combinedDateTime = new Date(`${inputDate}T${inputTime}:00`);
      const isoDateTime = combinedDateTime.toISOString();
      const formData = new FormData();
      formData.append("type", type);
      formData.append("category", category!.toString());
    
      formData.append("amount", amount);
      formData.append("date", isoDateTime);
      formData.append("time", inputTime);
      formData.append("note", note);
      if (attachment) {
        formData.append("attachment", attachment);
      }
      formData.append("user_id", user.id);

      await register(formData);

      setType("income");
      if (categories.length > 0) setCategory(categories[0].category_id);
      setAmount("");
      setDate("");
      setTime(formatTime(new Date()));
      setNote("");
      setAttachment(null);
      if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ล้างไฟล์ หลังกดบันทึก
}

      if (onAdded) {
        onAdded();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  if (!show) return null;
  return (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
    {/* กล่อง Modal */}
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-2xl w-full max-w-md relative">
      {/* ปุ่มปิด */}
      <button
        className="absolute right-3 top-3 text-gray-400 hover:text-red-400 transition"
        onClick={onClose}
      >
        ✕
      </button>

      {/* หัวข้อ */}
      <h2 className="text-lg font-semibold text-emerald-400 mb-5">
         เพิ่ม/แก้ไข รายการธุรกรรม
      </h2>

      {/* ฟอร์ม */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* ประเภท */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">ประเภท</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
            className="w-full bg-slate-800 border border-slate-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
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
                setCategory(parseInt(e.target.value));
              }
            }}
            className="w-full bg-slate-800 border border-slate-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
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
        <div>
          <label className="block text-sm text-gray-300 mb-1">จำนวนเงิน</label>
          <input
            type="number"
            value={amount}
            placeholder="จำนวนเงิน (บาท)"
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
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
              className="w-full bg-slate-800 border border-slate-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-300 mb-1">เวลา</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* รายละเอียด */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">รายละเอียด</label>
          <input
            placeholder="เช่น ค่ากาแฟ, รายรับจากงานพิเศษ"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* แนบไฟล์ */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">แนบไฟล์ (ถ้ามี)</label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) =>
              setAttachment(e.target.files ? e.target.files[0] : null)
            }
            className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-white hover:file:bg-emerald-500 cursor-pointer"
          />
        </div>

        {/* ปุ่ม */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-gray-200 transition"
            onClick={onClose}
          >
            ❌ ยกเลิก
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default AddTransactionForm2;