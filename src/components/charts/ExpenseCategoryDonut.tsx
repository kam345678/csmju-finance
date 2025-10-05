// src/components/charts/ExpenseCategoryDonut.tsx
"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";
import { Transaction } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseCategoryDonut({ transactions }: { transactions: Transaction[] }) {
  const expenses = transactions.filter(t => t.type === "expense");

  const totals = expenses.reduce<Record<string, number>>((acc, t) => {
    const name =
      t.category && typeof t.category === "object"
        ? t.category.name
        : String(t.category ?? "-");
    acc[name] = (acc[name] ?? 0) + t.amount;
    return acc;
  }, {});

  const labels = Object.keys(totals);
  const values = Object.values(totals);
  const total = values.reduce((sum, val) => sum + val, 0);

  const colors = [
    "#f87171", // แดงอ่อน
    "#fb923c", // ส้ม
    "#facc15", // เหลือง
    "#4ade80", // เขียว
    "#60a5fa", // ฟ้า
    "#a78bfa", // ม่วง
    "#f472b6", // ชมพู
  ];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: "#0f172a",
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
        labels: {
          color: "#e2e8f0",
          font: { size: 13 },
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.95)",
        titleColor: "#ffffff",
        bodyColor: "#cbd5e1",
        borderColor: "#334155",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed;
            const percent = total ? ((value / total) * 100).toFixed(1) : "0";
            return `${ctx.label}: ${value.toLocaleString("th-TH")} บาท (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="relative w-[320px] h-[320px] mx-auto flex items-center justify-center">
      {/* กราฟโดนัท */}
      <Doughnut data={data} options={options} />

      {/* 🔹 ข้อความตรงกลาง */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <p className="text-slate-400 text-sm">รายจ่ายรวม</p>
        <p className="text-xl font-extrabold text-white mt-1 drop-shadow-md">
          {total.toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}
