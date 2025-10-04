"use client";
import React from "react";
import { Transaction } from "@/types";

interface Props {
  filter: { date?: string; month?: string; year?: string };
  onFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  transactions: Transaction[];
}

export default function FilterSection({
  filter,
  onFilterChange,
  transactions,
}: Props) {
  const years = Array.from(
    new Set(transactions.map((t) => t.date?.split("-")[0]).filter(Boolean))
  );

  // ✅ รีเซ็ตทั้งหมดในครั้งเดียว
  const handleReset = () => {
    const resetEvent = {
      target: { name: "reset", value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onFilterChange(resetEvent);
  };

  return (
    <div className="flex flex-wrap items-end gap-3 mb-6 bg-slate-900/80 border border-slate-700 rounded-xl p-4 shadow-md">
      {/* วันที่ */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1">วันที่</label>
        <input
          type="date"
          name="date"
          value={filter.date || ""}
          onChange={onFilterChange}
          className="bg-slate-800 border border-slate-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* เดือน */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1">เดือน</label>
        <select
          name="month"
          value={filter.month || ""}
          onChange={onFilterChange}
          className="bg-slate-800 border border-slate-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">ทั้งหมด</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
              เดือน {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* ปี */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1">ปี</label>
        <select
          name="year"
          value={filter.year || ""}
          onChange={onFilterChange}
          className="bg-slate-800 border border-slate-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">ทั้งหมด</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* ปุ่มรีเซ็ต */}
      <button
        type="button"
        className="ml-auto bg-emerald-600/80 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm shadow-md transition-all"
        onClick={handleReset}
      >
        🔄 รีเซ็ตตัวกรอง
      </button>
    </div>
  );
}
