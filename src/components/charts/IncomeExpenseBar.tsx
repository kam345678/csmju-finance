// src/components/charts/IncomeExpenseBar.tsx
"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Transaction } from "@/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function IncomeExpenseBar({ transactions }: { transactions: Transaction[] }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const data = {
    labels: ["รายรับ", "รายจ่าย"],
    datasets: [
      {
        label: "จำนวนเงิน (บาท)",
        data: [income, expense],
        backgroundColor: ["#4ade80", "#f87171"],
        borderColor: "#0f172a",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e2e8f0",
          font: { size: 13 },
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.9)",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        borderColor: "#475569",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y;
            return ` ${ctx.label}: ${val.toLocaleString("th-TH")} บาท`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
          font: { size: 13 },
        },
        grid: {
          color: "rgba(100,116,139,0.1)",
        },
      },
      y: {
        ticks: {
          color: "#cbd5e1",
          font: { size: 12 },
          callback: (val) =>
            val.toLocaleString("th-TH", { maximumFractionDigits: 0 }),
        },
        grid: {
          color: "rgba(100,116,139,0.1)",
        },
      },
    },
  };

  return (
  <div className="w-full h-[400px] bg-slate-900/60 border border-slate-700 rounded-xl p-4 shadow-lg">
    <div className="w-full h-full">
      <Bar data={data} options={options} className="w-full h-full" />
    </div>
  </div>
);

}
