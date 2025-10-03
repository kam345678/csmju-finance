import React, { useState, useEffect,useRef } from "react";
import { register } from "../types/actions/TransFormAction";
import { supabase } from "../lib/supabase/client";

interface AddTransactionFormProps {
  onAdded?: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAdded }) => {
  const formatTime = (date: Date) => {
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

  useEffect(() => {
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
      // formData.append("category",category.toString());
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
      setCategory(0);
      setAmount("");
      setDate("");
      setTime(formatTime(new Date()));
      setNote("");
      setAttachment(null);
      if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ล้างไฟล์
}

      if (onAdded) {
        onAdded();
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

  return (
    <form onSubmit={handleSubmit}>
      <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
        <option value="income" >รายรับ</option>
        <option value="expense" >รายจ่าย</option>
      </select>

      <select value={category || ''} onChange={(e) => {
        if (e.target.value === 'add'){
          window.location.href = '/admin/category'
          return;
        } else {
          setCategory(parseInt(e.target.value));
        }
      }}>
         {categories.map(c => (
             <option key={c.category_id} value={c.category_id}>{c.name}</option>
         ))}
          <option value="add">เพิ่ม</option>
      </select>
 
      <input
        type="number"
        value={amount}
        placeholder="จำนวนเงิน"
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <input
        placeholder="รายละเอียด"
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default AddTransactionForm;