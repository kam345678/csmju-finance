"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/client";
import { Categories } from "../types/index";

export default function AddCategoryForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);

  async function fetchCategories() {
    const { data, error } = await supabase.from("Categories").select("*");
    if (!error && data) {
      setCategories(data);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return alert("กรุณากรอกชื่อหมวดหมู่");

    setLoading(true);
    const { error } = await supabase
      .from("Categories")
      .insert([{ name }]);
    setLoading(false);

    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      setName("");
      onAdded();
      fetchCategories();
    }
  }

  async function handleDelete(category_id: number) {
    if (!confirm("คุณแน่ใจว่าต้องการลบหมวดหมู่นี้หรือไม่?")) return;
    setLoadingDeleteId(category_id);
    const { error } = await supabase.from("Categories").delete().eq("category_id", category_id);
    setLoadingDeleteId(null);
    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      onAdded();
      fetchCategories();
    }
  }

  return ( //saiko
    <form onSubmit={submit} className="bg-white/20 p-4 rounded-lg shadow space-y-3">
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="ชื่อหมวดหมู่ใหม่"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white"
          disabled={loading}
        >
          {loading ? "กำลังบันทึก..." : "เพิ่มหมวดหมู่"}
        </button>
      </div>
      <div>
        <ul>
          {categories.map((category) => (
            <li key={category.category_id} className="flex justify-between items-center border-b py-1">
              <span>{category.name}</span>
              <button
                type="button"
                className="px-2 py-1 bg-red-600 text-white rounded"
                disabled={loadingDeleteId === category.category_id}
                onClick={() => handleDelete(category.category_id)}
              >
                {loadingDeleteId === category.category_id ? "กำลังลบ..." : "ลบ"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}