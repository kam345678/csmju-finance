"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Categories } from "@/types/index";
import AddCategoryForm from "@/components/AddCategoryForm";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const router = useRouter();

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });
    if (!error && data) setCategories(data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-slate-900 text-white">
      <button
        onClick={() => router.push("/admin/dashboard")}
        className="mb-6 px-5 py-2.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg font-medium"
      >
        ← กลับไปหน้าแดชบอร์ด
      </button>

      <h1 className="text-3xl font-bold mb-6 text-white tracking-wide">
         จัดการหมวดหมู่
      </h1>

      {/* กล่องฟอร์มเพิ่มหมวดหมู่ */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
        <AddCategoryForm onAdded={fetchCategories} />
      </div>

      {/* ตารางหมวดหมู่ */}
      <div className="mt-8">
        {categories.length === 0 ? (
          <p className="text-slate-400 text-center mt-10">
            ยังไม่มีหมวดหมู่ในระบบ
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.category_id}
                className="p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-md hover:shadow-blue-900/40 hover:-translate-y-1 transition-transform"
              >
                <span className="text-lg font-semibold text-blue-400 block mb-1">
                  {cat.name}
                </span>
                <span className="text-sm text-slate-400">รหัส: {cat.category_id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
