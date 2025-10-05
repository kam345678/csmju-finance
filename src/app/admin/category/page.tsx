"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Categories } from "@/types/index";
import AddCategoryForm from "@/components/AddCategoryForm";
import { Trash2 } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-tr from-[#07121C] via-[#0B1F2D] to-[#123445] text-white font-sans p-6">
      
      {/* Back button */}
      <button
        onClick={() => router.push("/admin/dashboard")}
        className="mb-6 px-5 py-2.5 font-medium rounded-xl border border-white/30 text-white bg-gradient-to-r from-[#0D3C5D] to-[#10577A] shadow-md hover:from-[#10577A] hover:to-[#0D3C5D] hover:scale-105 transition-transform duration-300 flex items-center gap-2"
      >
        ← กลับไปหน้าแดชบอร์ด
      </button>

      <h1 className="text-3xl font-bold mb-6 text-white tracking-wide">
        🗂️ จัดการหมวดหมู่
      </h1>

      {/* Add Category Form */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl mb-8">
        <AddCategoryForm onAdded={fetchCategories} />
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <p className="text-white/70 text-center mt-10 text-lg animate-pulse">
          ไม่มีหมวดหมู่ในระบบ
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.category_id}
              className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:shadow-[#0D6EAA]/40 hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <span className="text-lg font-semibold text-[#0D6EAA] mb-2 flex items-center gap-2">
                📂 {cat.name}
              </span>
              <span className="text-sm text-white/70 mb-3">รหัส: {cat.category_id}</span>

              {/* Delete Button */}
              <button className="self-start px-3 py-1 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 shadow-md rounded-lg text-sm flex items-center gap-1 transition-all">
                <Trash2 size={16} /> ลบ
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
