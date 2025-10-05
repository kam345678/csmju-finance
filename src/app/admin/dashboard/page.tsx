"use client";
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Transaction } from "@/types";
import SummaryCards from "@/components/SummaryCards";
import TransactionsTable from "@/components/TransactionsTable";
import SimpleDonutChart from "@/components/SimpleDonutChart";
import AddTransactionForm from "@/components/AddTransactionForm";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*, category:Categories(name)")
      .order("date", { ascending: false });
    setLoading(false);
    if (error) console.error("Fetch error:", error.message);
    else setTransactions((data as Transaction[]) ?? []);
  }, []);

  useEffect(() => {
    fetchTransactions();
    const sub = supabase
      .channel("public:transactions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => fetchTransactions()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(sub);
    };
  }, [fetchTransactions]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#07121C] via-[#0B1F2D] to-[#123445] text-white font-inter p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="pb-4 border-b border-white/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-wide text-white">
              💰 ระบบบัญชีรายรับรายจ่าย
            </h1>
            <p className="text-white/70 text-sm mt-1">
              จัดการข้อมูลทางการเงินของคุณอย่างง่ายและปลอดภัย
            </p>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-[#0D6EAA]/40 transition-all">
          <SummaryCards transactions={transactions} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Transactions */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-5 hover:shadow-[#0D6EAA]/40 transition-all">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  รายการล่าสุด
                </h2>
                <span className="text-white/70 text-sm">
                  {transactions.length} รายการ
                </span>
              </div>

              {loading ? (
                <div className="text-white/60 text-center py-6 animate-pulse">
                  กำลังโหลดข้อมูล...
                </div>
              ) : (
                <TransactionsTable transactions={transactions} />
              )}
            </div>
          </div>

          {/* Charts + Form */}
          <aside className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl flex flex-col items-center hover:shadow-[#0D6EAA]/40 transition-all">
              <h3 className="text-lg font-medium mb-3 text-white">
                สัดส่วนรายจ่าย
              </h3>
              <div className="flex justify-center items-center w-full min-h-[280px]">
                <SimpleDonutChart transactions={transactions} />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl hover:shadow-[#0D6EAA]/40 transition-all">
              <h3 className="text-lg font-medium mb-3 text-white">
                เพิ่มรายการใหม่
              </h3>
              <AddTransactionForm onAdded={fetchTransactions} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
