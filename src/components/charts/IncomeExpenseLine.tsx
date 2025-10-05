// src/components/charts/IncomeExpenseLine.tsx
"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Transaction } from "@/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function IncomeExpenseLine({ transactions }: { transactions: Transaction[] }) {
  // 🔹 เรียงข้อมูลตามวันที่
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const labels = sorted.map((t) => new Date(t.date).toLocaleDateString("th-TH"));

  // 🔹 แยกข้อมูลรายรับ-รายจ่าย
  const incomeData = sorted.map((t) => (t.type === "income" ? t.amount : 0));
  const expenseData = sorted.map((t) => (t.type === "expense" ? t.amount : 0));

  const data = {
    labels,
    datasets: [
      {
        label: "รายรับ",
        data: incomeData,
        borderColor: "#4ade80",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
        borderWidth: 2,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#22c55e",
      },
      {
        label: "รายจ่าย",
        data: expenseData,
        borderColor: "#f87171",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.4,
        borderWidth: 2,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#ef4444",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e2e8f0",
          font: { size: 13 },
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.9)",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        borderColor: "#475569",
        borderWidth: 1,
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString("th-TH")} บาท`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1", font: { size: 12 } },
        grid: { color: "rgba(100,116,139,0.1)" },
      },
      y: {
        ticks: {
          color: "#cbd5e1",
          font: { size: 12 },
          callback: (val) =>
            val.toLocaleString("th-TH", { maximumFractionDigits: 0 }),
        },
        grid: { color: "rgba(100,116,139,0.1)" },
      },
    },
  };

  return (
  <div className="w-full h-[420px] bg-slate-900/60 border border-slate-700 rounded-xl p-4 shadow-lg">
    <div className="w-full h-full">
      <Line
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false, // ✅ ทำให้กราฟเต็ม container
          plugins: {
            legend: {
              position: "top",
              labels: {
                color: "#e2e8f0",
                font: { size: 13 },
              },
            },
            tooltip: {
              backgroundColor: "rgba(15,23,42,0.9)",
              titleColor: "#fff",
              bodyColor: "#cbd5e1",
            },
          },
          scales: {
            x: {
              ticks: { color: "#cbd5e1" },
              grid: { color: "rgba(100,116,139,0.1)" },
            },
            y: {
              ticks: { color: "#cbd5e1" },
              grid: { color: "rgba(100,116,139,0.1)" },
            },
          },
        }}
        className="w-full h-full"
      />
    </div>
  </div>
);


}
