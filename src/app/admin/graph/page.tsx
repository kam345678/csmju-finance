"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Transaction } from "@/types";
import ExpenseIncomeDonut from "@/components/charts/ExpenseIncomeDonut";
import ExpenseCategoryDonut from "@/components/charts/ExpenseCategoryDonut";
import IncomeExpenseLine from "@/components/charts/IncomeExpenseLine";
import IncomeExpenseBar from "@/components/charts/IncomeExpenseBar";
import ExpenseByCategoryBar from "@/components/charts/ExpenseByCategoryBar";
import LineByCategoryChart from "@/components/charts/LineByCategoryChart";
import SummaryCards from "@/components/SummaryCards";
import IncomeCategoryDonut from "@/components/charts/IncomeCategoryDonut";

export default function GraphPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "month" | "year">("all");

  const fetchData = useCallback(async () => {
    let query = supabase
      .from("transactions")
      .select("*, category:Categories(name, category_id)");

    if (filter === "month") {
      const start = new Date();
      start.setDate(1);
      query = query.gte("date", start.toISOString().split("T")[0]);
    } else if (filter === "year") {
      const start = new Date(new Date().getFullYear(), 0, 1);
      query = query.gte("date", start.toISOString().split("T")[0]);
    }

    const { data, error } = await query;
    if (!error && data) setTransactions(data);
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-5 sm:p-8 min-h-screen bg-gradient-to-tr from-[#07121C] via-[#0B1F2D] to-[#123445] text-white space-y-8">
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-white">
          📊 สรุปรายงานกราฟทางการเงิน
        </h1>

        {/* ✅ Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "ทั้งหมด", key: "all" as const },
            { label: "เดือนนี้", key: "month" as const },
            { label: "ปีนี้", key: "year" as const },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all shadow-md text-sm sm:text-base border border-white/30 ${
                filter === btn.key
                  ? "bg-gradient-to-r from-[#0D3C5D] to-[#10577A] text-white shadow-lg hover:from-[#10577A] hover:to-[#0D3C5D]"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Summary Cards */}
      <div className="bg-white/10 p-5 rounded-2xl border border-white/20 shadow-xl backdrop-blur-md">
        <SummaryCards transactions={transactions} />
      </div>

      {/* ✅ Charts Section */}
      <section className="space-y-10">
        {/* Donut Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[ExpenseIncomeDonut, ExpenseCategoryDonut, IncomeCategoryDonut].map(
            (Chart, i) => (
              <div
                key={i}
                className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-lg hover:shadow-[#10577A]/40 transition-all flex justify-center items-center backdrop-blur-md"
              >
                <div className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] flex justify-center items-center">
                  <Chart transactions={transactions} />
                </div>
              </div>
            )
          )}
        </div>

        {/* Bar Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[IncomeExpenseBar, ExpenseByCategoryBar].map((Chart, i) => (
            <div
              key={i}
              className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-lg hover:shadow-[#10577A]/40 transition-all flex justify-center items-center backdrop-blur-md"
            >
              <div className="min-w-[300px] sm:min-w-[340px] md:min-w-[400px] flex justify-center items-center">
                <Chart transactions={transactions} />
              </div>
            </div>
          ))}
        </div>

        {/* Line Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[IncomeExpenseLine, LineByCategoryChart].map((Chart, i) => (
            <div
              key={i}
              className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-lg hover:shadow-[#10577A]/40 transition-all flex justify-center items-center backdrop-blur-md"
            >
              <div className="min-w-[300px] sm:min-w-[340px] md:min-w-[400px] flex justify-center items-center">
                <Chart transactions={transactions} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
