// src/components/charts/IncomeCategoryDonut.tsx
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

export default function IncomeCategoryDonut({ transactions }: { transactions: Transaction[] }) {
  const income = transactions.filter(t => t.type === "income");
  const totals = income.reduce<Record<string, number>>((acc, t) => {
    const name = t.category && typeof t.category === "object" ? t.category.name : String(t.category ?? "-");
    acc[name] = (acc[name] ?? 0) + t.amount;
    return acc;
  }, {});

  const labels = Object.keys(totals);
  const values = Object.values(totals);
  const total = values.reduce((sum, v) => sum + v, 0);

  const colors = ["#38bdf8", "#60a5fa", "#a78bfa", "#4ade80", "#facc15", "#fb7185"];

  const data = {
    labels,
    datasets: [
      { data: values, backgroundColor: colors, borderColor: "#0f172a", borderWidth: 2, hoverOffset: 10 },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "70%",
    plugins: {
      legend: { position: "bottom", labels: { color: "#e2e8f0", font: { size: 13 } } },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.9)",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed;
            const percent = total ? ((val / total) * 100).toFixed(1) : 0;
            return `${ctx.label}: ${val.toLocaleString("th-TH")} บาท (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="relative w-[320px] h-[320px] mx-auto flex items-center justify-center">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <p className="text-slate-300 text-sm mb-1">รายรับรวม</p>
        <p className="text-xl font-extrabold text-white drop-shadow-lg">
          {total.toLocaleString("th-TH", { style: "currency", currency: "THB" })}
        </p>
      </div>
    </div>
  );
}
