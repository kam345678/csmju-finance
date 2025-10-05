"use client";
import React from "react";
import { Transaction } from "../types/index";

function formatCurrencyTHB(n: number) {
  return n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 2,
  });
}

export default function SummaryCards({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      {/* รายรับ */}
      <div className="p-5 rounded-xl bg-emerald-600/12 border border-emerald-500/30 text-emerald-300 shadow-md hover:scale-[1.02] transition-all">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">รายรับสะสมทั้งหมด</span>
        </div>
        <div className="text-3xl font-bold tracking-tight">
          {formatCurrencyTHB(totalIncome)}
        </div>
      </div>

      {/* รายจ่าย */}
      <div className="p-5 rounded-xl bg-rose-600/12 border border-rose-500/30 text-rose-300 shadow-md hover:scale-[1.02] transition-all">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">รายจ่ายสะสมทั้งหมด</span>
        </div>
        <div className="text-3xl font-bold tracking-tight">
          {formatCurrencyTHB(totalExpense)}
        </div>
      </div>

      {/* คงเหลือ */}
      <div
        className={`p-5 rounded-xl border shadow-md hover:scale-[1.02] transition-all ${
          balance >= 0
            ? "bg-sky-600/12 border-sky-500/30 text-sky-300"
            : "bg-yellow-600/20 border-yellow-500/30 text-yellow-300"
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">ยอดคงเหลือ</span>
        </div>
        <div className="text-3xl font-bold tracking-tight">
          {formatCurrencyTHB(balance)}
        </div>
      </div>
    </div>
  );
}
