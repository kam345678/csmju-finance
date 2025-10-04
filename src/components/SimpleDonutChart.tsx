"use client";
import React, { useState } from "react";
import { Transaction } from "../types";

function formatCurrencyTHB(n: number) {
  return n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 2,
  });
}

export default function SimpleDonutChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const expenseOnly = transactions.filter((t) => t.type === "expense");

  const totals = expenseOnly.reduce<Record<string, number>>((acc, t) => {
    const catName =
      t.category && typeof t.category === "object"
        ? t.category.name
        : String(t.category ?? "-");
    acc[catName] = (acc[catName] ?? 0) + t.amount;
    return acc;
  }, {});

  const entries = Object.entries(totals);
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1;

  let cumulative = 0;
  const slices = entries.map(([cat, value], i) => {
    const start = cumulative / total;
    cumulative += value;
    const end = cumulative / total;
    const largeArc = end - start > 0.5 ? 1 : 0;
    const angleToCoord = (frac: number) => {
      const angle = 2 * Math.PI * frac - Math.PI / 2;
      return { x: 50 + 40 * Math.cos(angle), y: 50 + 40 * Math.sin(angle) };
    };
    const startC = angleToCoord(start);
    const endC = angleToCoord(end);
    const d = `M50 50 L ${startC.x} ${startC.y} A 40 40 0 ${largeArc} 1 ${endC.x} ${endC.y} Z`;
    const percent = ((value / total) * 100).toFixed(1);
    const color = `hsl(${(i * 70) % 360} 70% 60%)`;
    return { cat, value, d, color, percent };
  });

  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {/* 🔸 Donut Chart */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          width={260}
          height={260}
          className="drop-shadow-lg cursor-pointer"
          onMouseLeave={() => setHover(null)}
        >
          {slices.map((s) => (
            <path
              key={s.cat}
              d={s.d}
              fill={s.color}
              stroke="#1e293b"
              strokeWidth="0.5"
              style={{
                transformOrigin: "50% 50%",
                transform:
                  hover === s.cat ? "scale(1.05)" : "scale(1.0)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={() => setHover(s.cat)}
            />
          ))}

          {/* 🔹 วงกลาง */}
          <circle cx={50} cy={50} r={23} fill="#0f172a" />

          {/* 🔹 ข้อความกลาง donut */}
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="5"
            fontWeight="500"
          >
            รายจ่ายรวม
          </text>
          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            fill="#f8fafc"
            fontSize="7"
            fontWeight="700"
          >
            {formatCurrencyTHB(total)}
          </text>
        </svg>

        {/* 🟣 Tooltip ตอน hover */}
        {hover && (
          <div className="absolute -bottom-10 bg-slate-800/90 text-white text-xs px-3 py-1 rounded-lg border border-slate-600 shadow-lg whitespace-nowrap">
            {hover} —{" "}
            {slices.find((x) => x.cat === hover)?.percent ?? 0}% (
            {formatCurrencyTHB(
              slices.find((x) => x.cat === hover)?.value ?? 0
            )}
            )
          </div>
        )}
      </div>

      {/* 🔸 Legend ด้านล่าง */}
      <div className="flex flex-col items-center gap-2 w-full max-w-sm">
        {slices.length === 0 && (
          <div className="text-gray-400 text-sm italic text-center">
            ยังไม่มีข้อมูลรายจ่าย
          </div>
        )}

        {slices.map((s) => (
          <div
            key={s.cat}
            className={`flex justify-between items-center w-64 px-4 py-2 
                        rounded-lg text-sm shadow-md transition-all duration-200
                        ${
                          hover === s.cat
                            ? "bg-slate-700/70"
                            : "bg-slate-800/60 hover:bg-slate-700/60"
                        }`}
            onMouseEnter={() => setHover(s.cat)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-block rounded-full"
                style={{
                  width: 12,
                  height: 12,
                  background: s.color,
                  boxShadow: `0 0 6px ${s.color}`,
                }}
              />
              <span className="text-slate-200 font-medium">{s.cat}</span>
            </div>
            <span className="text-slate-100 font-semibold">
              {s.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
