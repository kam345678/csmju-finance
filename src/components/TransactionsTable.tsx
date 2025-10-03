"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client"; // anon key client-side
import { Transaction } from "@/types/index";

// export default function TransactionsClientTable({ onDelete }: { onDelete: (transaction_id: number) => void }) {
export default function TransactionsClientTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, category:Categories(name)")
        .order("date", { ascending: false });

      if (error) console.error(error);
      else setTransactions(data ?? []);
    }

    fetchTransactions();
  }, []);

  // async function handleDelete(transaction_id: number) {
  //   if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) return;

  //   try {
  //     const res = await fetch("/api/deleteTransaction", {
  //       method: "POST",
  //       body: JSON.stringify({ transaction_id: transaction_id }),
  //     });

  //     const result = await res.json();

  //     if (res.ok) {
  //       // update local state
  //       setTransactions(transactions.filter(tx => tx.transaction_id !== transaction_id));
  //       onDelete(transaction_id);
  //     } else {
  //       console.error("Failed to delete transaction:", result.error);
  //     }
  //   } catch (err) {
  //     console.error("Error deleting transaction:", err);
  //   }
  // }

  return (
    <table className="min-w-full table-auto">
      <thead className="text-left border-b">
        <tr>
          <th className="px-4 py-3">วันที่</th>
          <th className="px-4 py-3">หมวดหมู่</th>
          <th className="px-4 py-3">ประเภท</th>
          <th className="px-4 py-3">จำนวนเงิน</th>
          <th className="px-4 py-3">บันทึก</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx.transaction_id}>
            <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString("th-TH")}</td>
            <td className="px-4 py-3">
              {tx.category && typeof tx.category === "object"
                ? tx.category.name
                : tx.category ?? "-"}
            </td>
            <td className="px-4 py-3">{tx.type === "income" ? "รายรับ" : "รายจ่าย"}</td>
            <td className="px-4 py-3">{tx.amount.toLocaleString("th-TH", { style: "currency", currency: "THB" })}</td>
            <td className="px-4 py-3">{tx.note ?? "-"}</td>
            <td className="px-4 py-3">
            
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
