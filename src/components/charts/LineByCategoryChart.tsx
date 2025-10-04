// src/components/charts/LineByCategoryChart.tsx
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

export default function LineByCategoryChart({ transactions }: { transactions: Transaction[] }) {
  // 🔹 จัดกลุ่ม transactions ตาม category
  const categories: Record<string, Transaction[]> = {};
  transactions.forEach((t) => {
    const catName =
      t.category && typeof t.category === "object"
        ? t.category.name
        : String(t.category ?? "-");
    if (!categories[catName]) categories[catName] = [];
    categories[catName].push(t);
  });

  // 🔹 หา labels (วันที่) แบบ unique และเรียงลำดับ
  const dateSet = new Set(
    transactions.map((t) => new Date(t.date).toLocaleDateString("th-TH"))
  );
  const labels = Array.from(dateSet).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // 🔹 สร้าง datasets แยกตาม category
  const palette = [
    "#ef4444", // แดง
    "#f59e0b", // เหลือง
    "#10b981", // เขียว
    "#3b82f6", // น้ำเงิน
    "#8b5cf6", // ม่วง
    "#ec4899", // ชมพู
    "#14b8a6", // ฟ้าอมเขียว
  ];

  const datasets = Object.keys(categories).map((cat, i) => {
    const catTransactions = categories[cat];
    const data = labels.map((dateLabel) => {
      const dayTotal = catTransactions
        .filter(
          (t) => new Date(t.date).toLocaleDateString("th-TH") === dateLabel
        )
        .reduce((sum, t) => sum + t.amount, 0);
      return dayTotal;
    });

    return {
      label: cat,
      data,
      borderColor: palette[i % palette.length],
      backgroundColor: palette[i % palette.length] + "33", // โปร่งใส 20%
      tension: 0.4,
      borderWidth: 2,
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: palette[i % palette.length],
    };
  });

  const data = { labels, datasets };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#e2e8f0",
          font: { size: 13 },
          boxWidth: 16,
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
        ticks: {
          color: "#cbd5e1",
          font: { size: 12 },
        },
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
      <Line data={data} options={options} className="w-full h-full" />
    </div>
  </div>
);

}
