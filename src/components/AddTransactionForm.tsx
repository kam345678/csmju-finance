import { register } from '../types/actions/TransFormAction'
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/client";
import Link from "next/link";
export default function AddTransactionForm({ onAdded }: { onAdded: () => void }) {
  const [type, setType] = useState<'income'|'expense'>('expense');
  const [category, setCategory] = useState<number | null>(null); // เก็บ category_id
  const [categories, setCategories] = useState<{ category_id: number; name: string }[]>([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // ดึงหมวดหมู่จาก Supabase
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('Categories').select('category_id, name');
      if (error) return alert('เกิดข้อผิดพลาดในการโหลดหมวดหมู่: ' + error.message);
      setCategories(data || []);
    }
    fetchCategories();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const a = parseFloat(amount || '0');
    if (!a) return alert('ใส่จำนวนเงินที่ถูกต้อง');
    if (!category) return alert('เลือกหมวดหมู่ด้วย');
    
    setLoading(true);
    const { error } = await supabase.from('Transactions').insert([{ type, category, amount: a, date, note }]);
    setLoading(false);
    if (error) return alert('เกิดข้อผิดพลาด: ' + error.message);
    
    // รีเซ็ต form
    setAmount('');
    setNote('');
    setCategory(null);
    setType('expense');
    onAdded();
  }

  return (
    <form onSubmit={submit} action={register} encType="multipart/form-data" className="bg-white/20 p-4 rounded-lg shadow space-y-3">
      <div className="gap-2">
        <select value={type} onChange={e => setType(e.target.value as any)} className="border p-2 rounded w-1/3">
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>

        {/* Select category */}
        <select 
            value={category || ''} 
            onChange={e => {
            if (e.target.value === 'add') {
            // ไปหน้าเพิ่มหมวดหมู่
            window.location.href = '/admin/category';
            } else {
            setCategory(parseInt(e.target.value));
            }
        }} 
          className="border p-2 rounded w-1/3"
        >
          <option >เลือกหมวดหมู่</option>
          {categories.map(c => (
            <option key={c.category_id} value={c.category_id}>{c.name}</option>
          ))}
          
          <option value="add">เพิ่มหมวดหมู่</option>
        </select>
          
       <input value={note} onChange={e => setNote(e.target.value)} className="border p-2 rounded flex-1" placeholder="บันทึกเพิ่มเติม (ถ้ามี)" />
      </div>

      <div className="flex gap-2">
        <input value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 rounded w-1/3" placeholder="จำนวนเงิน" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded" />
      </div>
        <input
            className='rounded-md px-4 py-2 bg-inherit border '
            id="file"
            type="file"
            name='attachment'
            required
        />
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={loading}>
          {loading ? 'กำลังบันทึก...' : 'เพิ่ม'}
        </button>
      </div>
    </form>
  );
}

