"use client";

import React from "react";
import { Transaction } from "@/types";

interface TransactionsClientTableProps {
  transactions: Transaction[];
}

export default function TransactionsClientTable({
  transactions,
}: TransactionsClientTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-lg">
      <table className="min-w-full table-auto text-sm text-slate-300">
        <thead className="bg-slate-800/90 text-slate-200 border-b border-slate-700">
          <tr>
            <th className="px-5 py-3 text-left font-medium">วันที่</th>
            <th className="px-5 py-3 text-left font-medium">หมวดหมู่</th>
            <th className="px-5 py-3 text-left font-medium">ประเภท</th>
            <th className="px-5 py-3 text-right font-medium">จำนวนเงิน</th>
            <th className="px-5 py-3 text-left font-medium">บันทึก</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-slate-500">
                ไม่มีข้อมูลรายการ
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr
                key={tx.transaction_id}
                className="border-b border-slate-700 hover:bg-slate-800/60 transition-all"
              >
                <td className="px-5 py-3 whitespace-nowrap">
                  {new Date(tx.date).toLocaleDateString("th-TH")}
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  {tx.category && typeof tx.category === "object"
                    ? tx.category.name
                    : tx.category ?? "-"}
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  {tx.type === "income" ? (
                    <span className="text-emerald-400 font-medium">รายรับ</span>
                  ) : (
                    <span className="text-rose-400 font-medium">รายจ่าย</span>
                  )}
                </td>
                {/* ✅ ชิดขวาแนวเดียวกัน */}
                <td className="px-5 py-3 text-right whitespace-nowrap font-semibold text-slate-100">
                  {tx.amount.toLocaleString("th-TH", {
                    style: "currency",
                    currency: "THB",
                  })}
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-slate-400">
                  {tx.note ?? "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
