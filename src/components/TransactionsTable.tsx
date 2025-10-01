"use client"
import React from "react";
import { Transaction } from "../types/index";

function formatCurrencyTHB(n: number) {
  return n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 2 });
}

export default function TransactionsTable({ transactions, onDelete }: { transactions: Transaction[]; onDelete: (id: number) => void }) {
  return (
    <div className="bg-white/20 rounded-lg shadow overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="text-left border-b">
          <tr>
            <th className="px-4 py-3">วันที่</th>
            <th className="px-4 py-3">หมวดหมู่</th>
            <th className="px-4 py-3">ประเภท</th>
            <th className="px-4 py-3">จำนวนเงิน</th>
            <th className="px-4 py-3">บันทึก</th>
            <th className="px-4 py-3">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString("th-TH")}</td>
              <td className="px-4 py-3">{tx.category}</td>
              <td className="px-4 py-3">{tx.type === 'income' ? 'รายรับ' : 'รายจ่าย'}</td>
              <td className="px-4 py-3">{formatCurrencyTHB(tx.amount)}</td>
              <td className="px-4 py-3">{tx.note ?? '-'}</td>
              <td className="px-4 py-3">
                <button onClick={() => onDelete(tx.id)} className="px-2 py-1 rounded bg-red-100 text-red-700">ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}