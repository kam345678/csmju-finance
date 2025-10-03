// src/components/charts/IncomeExpenseLine.tsx
"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Transaction } from "@/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function IncomeExpenseLine({ transactions }: { transactions: Transaction[] }) {
  // สมมุติว่า filter ตามวันที่
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const labels = sorted.map(t => new Date(t.date).toLocaleDateString("th-TH"));

  const incomeData = sorted.map(t => (t.type === "income" ? t.amount : 0));
  const expenseData = sorted.map(t => (t.type === "expense" ? t.amount : 0));

  const data = {
    labels,
    datasets: [
      { label: "รายรับ", data: incomeData, borderColor: "#22c55e", backgroundColor: "#22c55e" },
      { label: "รายจ่าย", data: expenseData, borderColor: "#ef4444", backgroundColor: "#ef4444" },
    ],
  };

  return (
    <div className="w-full h-96">
      <Line data={data} />
    </div>
  );
}