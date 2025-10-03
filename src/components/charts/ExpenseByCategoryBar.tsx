// src/components/charts/ExpenseByCategoryBar.tsx
"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Transaction } from "@/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ExpenseByCategoryBar({ transactions }: { transactions: Transaction[] }) {
  const expenses = transactions.filter(t => t.type === "expense");
  const totals = expenses.reduce<Record<string, number>>((acc, t) => {
    const catName = t.category && typeof t.category === "object"
  ? t.category.name
  : String(t.category ?? "-");
    acc[catName] = (acc[catName] ?? 0) + t.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(totals),
    datasets: [
      {
        label: "รายจ่ายตามหมวดหมู่ (บาท)",
        data: Object.values(totals),
        backgroundColor: "#ef4444",
      },
    ],
  };

  return <div className="w-full h-96"><Bar data={data} /></div>;
}