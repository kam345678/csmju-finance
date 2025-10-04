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
      const validCategory = typeof category === "number" && !isNaN(category) ? category : transaction.category;
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
      }finally {
        setLoading(false);
      }
  };

  if (!show || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 z-40 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded shadow-lg min-w-[340px] relative">
        <div className="flex justify-between items-center mb-4">
          <button
            className="absolute right-2 top-2 bg-red-600 border rounded text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            x 
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
            <option value="income">รายรับ</option>
            <option value="expense">รายจ่าย</option>
          </select>

          <select
            value={category || ""}
            onChange={(e) => {
              if (e.target.value === "add") {
                window.location.href = "/admin/category";
              } else {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) {
                  setCategory(val);
                }
              }
            }}
          >
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.name}
              </option>
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

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

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
            className="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-600 dark:file:text-violet-100 dark:hover:file:bg-violet-500"
          />

          <div className="flex justify-end items-center">
            <button
              type="button"
              className="mr-2 px-4 py-2 rounded bg-red-500 hover:bg-gray-400"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionForm;