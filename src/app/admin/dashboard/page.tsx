"use client"
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase/client";
import { Transaction } from "../../../types";
import SummaryCards from "../../../components/SummaryCards";
import TransactionsTable from "../../../components/TransactionsTable";
import SimpleDonutChart from "../../../components/SimpleDonutChart";
import AddTransactionForm from "../../../components/AddTransactionForm";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTransactions() {
    setLoading(true);
    const { data, error } = await supabase.from<Transaction, Transaction>('Transactions').select('*').order('date', { ascending: false });
    setLoading(false);
    if (error) return console.error('fetch error', error.message);
    setTransactions(data ?? []);
  }

  useEffect(() => {
    fetchTransactions();
    const sub = supabase
      .channel('public:transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('ลบรายการนี้?')) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) return alert('Delete error: ' + error.message);
    setTransactions(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">ระบบบัญชีรายรับรายจ่าย</h1>
          <nav className="text-sm text-gray-600">แดชบอร์ด • รายการ • โปรไฟล์</nav>
        </header>

        <SummaryCards transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">รายการล่าสุด</h2>
              <div className="text-sm text-gray-500">{transactions.length} รายการ</div>
            </div>
            {loading ? <div>กำลังโหลด...</div> : <TransactionsTable transactions={transactions} onDelete={handleDelete} />}
          </div>

          <aside>
            <h3 className="text-lg font-medium mb-3">สัดส่วนรายจ่าย</h3>
            <div className="p-4 bg-white/20 rounded-lg shadow">
              <SimpleDonutChart transactions={transactions} />
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">เพิ่มรายการ</h3>
              <AddTransactionForm onAdded={fetchTransactions} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}