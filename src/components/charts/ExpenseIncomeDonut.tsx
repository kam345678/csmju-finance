// src/components/charts/ExpenseIncomeDonut.tsx
"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Transaction } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseIncomeDonut({ transactions }: { transactions: Transaction[] }) {
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const total = income + expense;

  const data = {
    labels: ["รายรับ", "รายจ่าย"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#4ade80", "#f87171"],
        borderColor: ["#15803d", "#b91c1c"],
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#e2e8f0", font: { size: 13 }, padding: 16 },
      },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.9)",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        borderColor: "#334155",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed;
            const p = total ? ((v / total) * 100).toFixed(1) : 0;
            return `${ctx.label}: ${v.toLocaleString("th-TH")} บาท (${p}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="relative w-[320px] h-[320px] mx-auto flex items-center justify-center">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <p className="text-slate-300 text-sm mb-1">ยอดรวมทั้งหมด</p>
        <p className="text-xl font-extrabold text-white drop-shadow-lg">
          {total.toLocaleString("th-TH", { style: "currency", currency: "THB" })}
        </p>
      </div>
    </div>
  );
}
