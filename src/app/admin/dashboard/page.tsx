"use client";
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabase/client";
import { Transaction } from "../../../types/index";
import SummaryCards from "../../../components/SummaryCards";
import TransactionsTable from "../../../components/TransactionsTable";
import SimpleDonutChart from "../../../components/SimpleDonutChart";
import AddTransactionForm from "../../../components/AddTransactionForm";

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
    if (error) return console.error("fetch error", error.message);
    setTransactions((data as Transaction[]) ?? []);
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
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-700">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-white">
               ระบบบัญชีรายรับรายจ่าย
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              จัดการข้อมูลทางการเงินของคุณได้อย่างง่ายและปลอดภัย
            </p>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-lg">
          <SummaryCards transactions={transactions} />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transactions */}
            <div className="bg-slate-800/90 rounded-xl border border-slate-700 shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  รายการล่าสุด
                </h2>
                <div className="text-slate-400 text-sm">
                  {transactions.length} รายการ
                </div>
              </div>
              {loading ? (
                <div className="text-slate-400 text-center py-6 animate-pulse">
                  กำลังโหลดข้อมูล...
                </div>
              ) : (
                <TransactionsTable transactions={transactions} />
              )}
            </div>
          </div>

          {/* Right section */}
          <aside className="space-y-6">
            {/* Donut chart */}
            <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col items-center">
              <h3 className="text-lg font-medium mb-3 text-white">
                สัดส่วนรายจ่าย
              </h3>
              <div className="flex justify-center items-center w-full min-h-[280px]">
                <SimpleDonutChart transactions={transactions} />
              </div>
            </div>

            {/* Add form */}
            <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 shadow-lg">
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
