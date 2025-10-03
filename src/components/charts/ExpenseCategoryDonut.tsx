// src/components/charts/ExpenseCategoryDonut.tsx
"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Transaction } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseCategoryDonut({ transactions }: { transactions: Transaction[] }) {
  const expenses = transactions.filter(t => t.type === "expense");
  const totals = expenses.reduce<Record<string, number>>((acc, t) => {
    const name = t.category && typeof t.category === "object" ? t.category.name : String(t.category ?? "-");
    acc[name] = (acc[name] ?? 0) + t.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(totals),
    datasets: [
      {
        data: Object.values(totals),
        backgroundColor: ["#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a78bfa"],
      },
    ],
  };

  return (
    <div className="w-80 h-80">
      <Doughnut data={data} />
    </div>
  );
}