
"use client"
import React,{ useState, useEffect } from "react";
import { Transaction } from "../types/index";

function formatCurrencyTHB(n: number) {
  return n.toLocaleString("th-TH", { style: "currency", currency: "THB" });
}

export default function SimpleDonutChart({ transactions }: { transactions: Transaction[] }) {
  const expenseOnly = transactions.filter(t => t.type === 'expense');
  const totals = expenseOnly.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount;
    return acc;
  }, {});

  const entries = Object.entries(totals);
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1;

  let cumulative = 0;
  const slices = entries.map(([cat, value], idx) => {
    const start = cumulative / total;
    cumulative += value;
    const end = cumulative / total;
    const largeArc = (end - start) > 0.5 ? 1 : 0;
    const angleToCoord = (frac: number) => {
      const angle = 2 * Math.PI * frac - Math.PI / 2;
      return { x: 50 + 40 * Math.cos(angle), y: 50 + 40 * Math.sin(angle) };
    };
    const startC = angleToCoord(start);
    const endC = angleToCoord(end);
    const d = `M50 50 L ${startC.x} ${startC.y} A 40 40 0 ${largeArc} 1 ${endC.x} ${endC.y} z`;
    return { cat, value, d };
  });

  return (
    <div className="flex gap-6 items-center">
      <svg viewBox="0 0 100 100" width={220} height={220}>
        {slices.map((s, i) => (
          <path key={s.cat} d={s.d} fill={`hsl(${(i * 75) % 360} 70% 60%)`} stroke="#fff" />
        ))}
        <circle cx={50} cy={50} r={20} fill="#fff" />
      </svg>
      <div>
        {slices.length === 0 && <div className="text-sm text-gray-500">ยังไม่มีข้อมูลรายจ่าย</div>}
        {slices.map((s, i) => (
          <div key={s.cat} className="flex items-center gap-3 text-sm py-1">
            <span style={{ width: 12, height: 12, background: `hsl(${(i * 75) % 360} 70% 60%)` }} className="inline-block rounded-sm" />
            <span className="min-w-[120px]">{s.cat}</span>
            <span className="font-semibold">{formatCurrencyTHB(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}