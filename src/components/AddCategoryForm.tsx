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
    if (!error && data) setCategories(data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return alert("กรุณากรอกชื่อหมวดหมู่");

    setLoading(true);
    const { error } = await supabase.from("Categories").insert([{ name }]);
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
    const { error } = await supabase
      .from("Categories")
      .delete()
      .eq("category_id", category_id);
    setLoadingDeleteId(null);
    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      onAdded();
      fetchCategories();
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg space-y-5 transition-all"
    >
      {/* ช่องกรอกชื่อหมวดหมู่ */}
      <div>
        <label className="block text-sm text-white/80 mb-1">
          ชื่อหมวดหมู่ใหม่
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-[#0D6EAA]/60 focus:border-[#0D6EAA]/50 outline-none transition-all"
          placeholder="กรอกชื่อหมวดหมู่..."
        />
      </div>

      {/* ปุ่มเพิ่ม */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="relative px-6 py-2.5 rounded-lg font-semibold text-white
             bg-gradient-to-r from-[#0D3C5D] to-[#10577A]
             hover:from-[#10577A] hover:to-[#1390B6]
             shadow-lg shadow-[#0D3C5D]/40
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
        >
          {loading ? "กำลังบันทึก..." : "➕ เพิ่มหมวดหมู่"}
        </button>
      </div>

      {/* ตารางรายการหมวดหมู่ */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3 text-white">
          รายการหมวดหมู่ทั้งหมด
        </h2>
        {categories.length === 0 ? (
          <p className="text-white/60 text-sm text-center py-4">
            ยังไม่มีหมวดหมู่ในระบบ
          </p>
        ) : (
          <table className="w-full text-left border-collapse rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-white/10 text-white/80">
                <th className="py-2 px-4 border-b border-white/10">#</th>
                <th className="py-2 px-4 border-b border-white/10">
                  ชื่อหมวดหมู่
                </th>
                <th className="py-2 px-4 border-b border-white/10 text-right">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.category_id}
                  className="hover:bg-white/10 transition-all"
                >
                  <td className="py-2 px-4 border-b border-white/10 text-white/60">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b border-white/10 text-white">
                    {category.name}
                  </td>
                  <td className="py-2 px-4 border-b border-white/10 text-right">
                    <button
                      type="button"
                      disabled={loadingDeleteId === category.category_id}
                      onClick={() => handleDelete(category.category_id)}
                      className="px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-md shadow-red-800/30 transition-all disabled:opacity-50"
                    >
                      {loadingDeleteId === category.category_id
                        ? "กำลังลบ..."
                        : "ลบ"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </form>
  );
}
