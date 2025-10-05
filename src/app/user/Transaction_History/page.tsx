"use client";
import { useEffect, useState,useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import SummaryCards from "@/components/SummaryCards";
import TransactionsTable2 from "@/components/tutorial/user/TransactionsTable2";
import FilterSection from "@/components/FilterSection";

import { Transaction, Categories } from "@/types";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState<{ date?: string; month?: string; year?: string }>({});
  
  const [categories, setCategories] = useState<Categories[]>([]);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from("Categories").select("*");
    if (error) return console.error(error.message);
    setCategories(data ?? []);
  }, []);

  const fetchTransactions = useCallback(async () => {
  setLoading(true);
  let query = supabase
    .from("transactions")
    .select("*, category:Categories(name)")
    .order("date", { ascending: false });

  // ถ้ามี filter.date → กรองเฉพาะวันนั้น
  if (filter.date) {
    query = query.eq("date", filter.date);
  }
  // ถ้ามี filter.month → กรองทั้งเดือนนั้น (ต้องมี year ด้วย)
  else if (filter.month) {
    const year = filter.year || new Date().getFullYear().toString();
    const month = filter.month.padStart(2, "0");
    const startDate = `${year}-${month}-01`;
    const endDate = new Date(Number(year), Number(month), 0) // วันสุดท้ายของเดือน
      .toISOString()
      .slice(0, 10);
    query = query.gte("date", startDate).lte("date", endDate);
  }
  // ถ้ามีแค่ filter.year → กรองทั้งปี
  else if (filter.year) {
    const startDate = `${filter.year}-01-01`;
    const endDate = `${filter.year}-12-31`;
    query = query.gte("date", startDate).lte("date", endDate);
  }

  const { data, error } = await query;
  setLoading(false);

  if (error) return console.error(error.message);
  setTransactions(data ?? []);
}, [filter]);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();

    const channel = supabase
      .channel("public:transactions")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () =>
        fetchTransactions()
      );

    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTransactions, fetchCategories]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  if (name === "resetAll") {
    setFilter({ date: "", month: "", year: "" });
    return;
  }

  setFilter((prev) => ({
    ...prev,
    [name]: value,
  }));
};


  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#07121C] via-[#0B1F2D] to-[#123445] text-white font-sans p-6">
      {/* Summary */}
      <SummaryCards transactions={transactions} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 mb-4">
        <h1 className="text-3xl font-bold tracking-wide text-white">
          💰 ประวัติการทำรายการ
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => fetchTransactions()}
            className="px-4 py-2 rounded-xl border border-white/30 text-white bg-gradient-to-r from-[#0D3C5D] to-[#10577A] shadow-md hover:from-[#10577A] hover:to-[#0D3C5D] hover:scale-105 transition-transform duration-300"
          >
            🔄 รีเฟรช
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl mb-6">
        <FilterSection
          filter={filter}
          onFilterChange={handleFilterChange}
          transactions={transactions}

        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-x-auto">
        <TransactionsTable2
          transactions={transactions}
          loading={loading}
          categories={categories}
        />
      </div>
    </div>
  );
}
