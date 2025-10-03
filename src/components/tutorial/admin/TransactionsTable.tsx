// src/components/TransactionsTable.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Transaction } from "@/types";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, category:Categories(name, category_id)")
      .order("date", { ascending: false });

    if (error) console.error(error);
    else setTransactions(data ?? []);
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("transactions").delete().eq("transaction_id", id);
    if (!error) fetchTransactions();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100/20">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Note</th>
            <th className="px-4 py-2">image</th>
            <th className="px-4 py-2">manage</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.transaction_id} className="border-t">
              <td className="px-4 py-2">
                {new Date(tx.date).toLocaleDateString("th-TH")} {tx.time}
              </td>
              <td className="px-4 py-2">
                {typeof tx.category === "object" ? tx.category.name : tx.category}
              </td>
              <td className="px-4 py-2">{tx.type === "income" ? "รายรับ" : "รายจ่าย"}</td>
              <td className="px-4 py-2">
                {tx.amount.toLocaleString("th-TH", { style: "currency", currency: "THB" })}
              </td>
              <td className="px-4 py-2">{tx.note ?? "-"}</td>
              <td className="px-4 py-2">
                {tx.attachment_URL ? (
                  <a
                    href={tx.attachment_URL}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    ดูรูป
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => handleDelete(tx.transaction_id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  ลบ
                </button>
                <button
                  onClick={() => alert("TODO: implement edit")}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  แก้ไข
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}