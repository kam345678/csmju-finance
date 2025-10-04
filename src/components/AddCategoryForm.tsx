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
      className="bg-slate-800/70 p-6 rounded-xl shadow-lg border border-slate-700 space-y-4"
    >
      {/* ช่องกรอกชื่อหมวดหมู่ */}
      <div>
        <label className="block text-sm text-slate-300 mb-1">
          ชื่อหมวดหมู่ใหม่
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="กรอกชื่อหมวดหมู่..."
        />
      </div>

      {/* ปุ่มเพิ่ม */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow transition-all"
          disabled={loading}
        >
          {loading ? "กำลังบันทึก..." : "เพิ่มหมวดหมู่"}
        </button>
      </div>

      {/* ตารางรายการหมวดหมู่ */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3 text-slate-200">
          รายการหมวดหมู่ทั้งหมด
        </h2>
        {categories.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">
            ยังไม่มีหมวดหมู่ในระบบ
          </p>
        ) : (
          <table className="w-full text-left border-collapse border border-slate-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-700 text-slate-200 text-sm">
                <th className="py-2 px-4 border-b border-slate-600">#</th>
                <th className="py-2 px-4 border-b border-slate-600">ชื่อหมวดหมู่</th>
                <th className="py-2 px-4 border-b border-slate-600 text-right">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.category_id}
                  className="hover:bg-slate-700/50 transition"
                >
                  <td className="py-2 px-4 border-b border-slate-700 text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-white">
                    {category.name}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-right">
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm shadow"
                      disabled={loadingDeleteId === category.category_id}
                      onClick={() => handleDelete(category.category_id)}
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
