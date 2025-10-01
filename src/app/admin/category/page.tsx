"use client"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Categories } from "@/types/index";
import AddCategoryForm from "@/components/AddCategoryForm";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Categories[]>([]);

  async function fetchCategories() {
    const { data, error } = await supabase.from("categories").select("*").order("id", { ascending: true });
    if (!error && data) setCategories(data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-2xl font-bold mb-4">จัดการหมวดหมู่</h1>
      <AddCategoryForm onAdded={fetchCategories} />
      <ul className="mt-6 space-y-2">
        {categories.map((cat) => (
          <li key={cat.category_id} className="p-2 bg-white rounded shadow">
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}