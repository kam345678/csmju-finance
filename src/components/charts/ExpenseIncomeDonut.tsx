// src/components/charts/ExpenseIncomeDonut.tsx
"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Transaction } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseIncomeDonut({ transactions }: { transactions: Transaction[] }) {
  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  const data = {
    labels: ["รายรับ", "รายจ่าย"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="w-80 h-80">
      <Doughnut data={data} />
    </div>
  );
}