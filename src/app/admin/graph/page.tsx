// src/app/admin/graph/page.tsx
"use client";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchData();
  }, [filter]);

  async function fetchData() {
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
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Graphs</h1>

      {/* Filter */}
      <div className="flex gap-2">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded ${filter==="all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          All
        </button>
        <button onClick={() => setFilter("month")} className={`px-4 py-2 rounded ${filter==="month" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          This Month
        </button>
        <button onClick={() => setFilter("year")} className={`px-4 py-2 rounded ${filter==="year" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          This Year
        </button>
      </div>
        <SummaryCards transactions={transactions} />
      {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpenseIncomeDonut transactions={transactions} />
            <ExpenseCategoryDonut transactions={transactions} />
            <IncomeCategoryDonut transactions={transactions} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IncomeExpenseBar transactions={transactions} />
            <ExpenseByCategoryBar transactions={transactions} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IncomeExpenseLine transactions={transactions} />
            <LineByCategoryChart transactions={transactions} />
        </div>
    </div>
  );
}