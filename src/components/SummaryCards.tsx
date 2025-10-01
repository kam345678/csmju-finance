"use client"
import React from "react";
import { Transaction } from "../types/index";

function formatCurrencyTHB(n: number) {
  return n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 2 });
}

export default function SummaryCards({ transactions }: { transactions: Transaction[] }) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="p-4 rounded-lg shadow bg-white/20">
        <div className="text-sm">รายรับทั้งหมด</div>
        <div className="text-2xl font-semibold">{formatCurrencyTHB(totalIncome)}</div>
      </div>
      <div className="p-4 rounded-lg shadow bg-white/20">
        <div className="text-sm">รายจ่ายทั้งหมด</div>
        <div className="text-2xl font-semibold">{formatCurrencyTHB(totalExpense)}</div>
      </div>
      <div className="p-4 rounded-lg shadow bg-white/20">
        <div className="text-sm">คงเหลือ</div>
        <div className="text-2xl font-semibold">{formatCurrencyTHB(balance)}</div>
      </div>
    </div>
  );
}