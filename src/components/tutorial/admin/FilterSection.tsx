"use client";
import React from "react";
import { Transaction } from "@/types";

interface Props {
  filter: { date?: string; month?: string; year?: string };
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  transactions: Transaction[];
}

export default function FilterSection({ filter, onFilterChange, transactions }: Props) {
  const years = Array.from(new Set(transactions.map(t => t.date?.split('-')[0]).filter(Boolean)));

  return (
    <div className="flex flex-wrap gap-2 items-end mb-4">
      <div>
        <label className="block text-xs text-gray-600 mb-1">วันที่</label>
        <input
          type="date"
          name="date"
          value={filter.date || ""}
          onChange={onFilterChange}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">เดือน</label>
        <select
          name="month"
          value={filter.month || ""}
          onChange={onFilterChange}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">ทั้งหมด</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i+1} value={String(i+1).padStart(2,'0')}>{i+1}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">ปี</label>
        <select
          name="year"
          value={filter.year || ""}
          onChange={onFilterChange}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">ทั้งหมด</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <button
        className="ml-2 px-3 py-1 rounded bg-gray-200/50 hover:bg-gray-300 text-sm"
        onClick={() =>
          onFilterChange(
            {
              target: { name: "date", value: "" },
            } as unknown as React.ChangeEvent<HTMLInputElement>
          )
        }
      >
        รีเซ็ตตัวกรอง
      </button>
    </div>
  );
}