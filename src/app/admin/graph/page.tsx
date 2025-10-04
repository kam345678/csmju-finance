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
    <div className="p-4 sm:p-6 min-h-screen bg-slate-900 text-white space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
           สรุปรายงานกราฟทางการเงิน
        </h1>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "ทั้งหมด", key: "all" as const },
            { label: "เดือนนี้", key: "month" as const },
            { label: "ปีนี้", key: "year" as const },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all shadow-md text-sm sm:text-base ${
                filter === btn.key
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-lg overflow-x-auto">
        <SummaryCards transactions={transactions} />
      </div>

      {/* Charts */}
      <section className="space-y-10">
        {/* Donut Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[ExpenseIncomeDonut, ExpenseCategoryDonut, IncomeCategoryDonut].map(
            (Chart, i) => (
              <div
                key={i}
                className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md hover:shadow-blue-900/40 transition-all flex justify-center items-center overflow-x-auto"
              >
                <div className="min-w-[280px] sm:min-w-[300px] md:min-w-[350px] max-w-full flex justify-center items-center">
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
              className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md hover:shadow-blue-900/40 transition-all flex justify-center items-center overflow-x-auto"
            >
              <div className="min-w-[300px] sm:min-w-[340px] md:min-w-[400px] max-w-full flex justify-center items-center">
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
              className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md hover:shadow-blue-900/40 transition-all flex justify-center items-center overflow-x-auto"
            >
              <div className="min-w-[300px] sm:min-w-[340px] md:min-w-[400px] max-w-full flex justify-center items-center">
                <Chart transactions={transactions} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
