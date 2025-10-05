// src/components/charts/ExpenseByCategoryBar.tsx
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

export default function ExpenseByCategoryBar({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const totals = expenses.reduce<Record<string, number>>((acc, t) => {
    const catName =
      t.category && typeof t.category === "object"
        ? t.category.name
        : String(t.category ?? "-");
    acc[catName] = (acc[catName] ?? 0) + t.amount;
    return acc;
  }, {});

  const labels = Object.keys(totals);
  const values = Object.values(totals);

  const colors = [
    "#f87171",
    "#fb923c",
    "#facc15",
    "#4ade80",
    "#60a5fa",
    "#a78bfa",
    "#f472b6",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "รายจ่ายตามหมวดหมู่ (บาท)",
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderRadius: 10,
        borderSkipped: false,
        hoverBackgroundColor: "#f43f5e",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 10 },
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
        backgroundColor: "rgba(15,23,42,0.95)",
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
        ticks: { color: "#cbd5e1", font: { size: 12 } },
        grid: { color: "rgba(100,116,139,0.08)" },
      },
      y: {
        ticks: {
          color: "#cbd5e1",
          font: { size: 12 },
          callback: (val) =>
            val.toLocaleString("th-TH", { maximumFractionDigits: 0 }),
        },
        grid: { color: "rgba(100,116,139,0.08)" },
      },
    },
  };

  return (
    <div className="w-full h-[420px] bg-slate-900/60 border border-slate-700 rounded-xl p-5 shadow-lg flex items-center justify-center">
      <div className="w-full h-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
