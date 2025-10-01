"use client";

import React, { useState } from "react";
import { supabase } from "../lib/supabase/client";
import { Categories } from "../types/index";

export default function AddCategoryForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

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
    }
  }

  return (
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
    </form>
  );
}