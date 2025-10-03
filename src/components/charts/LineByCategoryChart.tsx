// src/components/charts/LineByCategoryChart.tsx
"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Transaction } from "@/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function LineByCategoryChart({ transactions }: { transactions: Transaction[] }) {
  // จัดกลุ่ม transactions ตาม category
  const categories: Record<string, Transaction[]> = {};
  transactions.forEach(t => {
    const catName = t.category && typeof t.category === "object" ? t.category.name : String(t.category ?? "-");
    if (!categories[catName]) categories[catName] = [];
    categories[catName].push(t);
  });

  // หา labels (วันที่) แบบ unique และ sort
  const dateSet = new Set(transactions.map(t => new Date(t.date).toLocaleDateString("th-TH")));
  const labels = Array.from(dateSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // สร้าง datasets แยกตาม category
  const datasets = Object.keys(categories).map((cat, i) => {
    const catTransactions = categories[cat];
    const data = labels.map(dateLabel => {
      // รวม amount ของ category ในวันที่นั้น
      const dayTotal = catTransactions
        .filter(t => new Date(t.date).toLocaleDateString("th-TH") === dateLabel)
        .reduce((sum, t) => sum + t.amount, 0);
      return dayTotal;
    });

    const colors = ["#ef4444","#f59e0b","#10b981","#3b82f6","#8b5cf6","#ec4899"];
    return {
      label: cat,
      data,
      borderColor: colors[i % colors.length],
      backgroundColor: colors[i % colors.length],
    };
  });

  const data = { labels, datasets };

  return (
    <div className="w-full h-96">
      <Line data={data} />
    </div>
  );
}