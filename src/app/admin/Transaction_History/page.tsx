"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import SummaryCards from "@/components/SummaryCards";
import TransactionsTable from "@/components/tutorial/admin/TransactionsTable2";
import FilterSection from "@/components/tutorial/admin/FilterSection";
import AddTransactionForm2 from "@/components/tutorial/admin/AddTransactionForm";
import EditTransactionForm from "@/components/tutorial/admin/EditTransactionForm";
import { Transaction, Categories } from "@/types";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<{ date?: string; month?: string; year?: string }>({});
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [categories, setCategories] = useState<Categories[]>([]);

  async function fetchCategories() {
  const { data, error } = await supabase.from('Categories').select('*');
  if (error) return console.error(error.message);
  setCategories(data ?? []);
}

  async function fetchTransactions() {
    setLoading(true);
    let query = supabase
      .from('transactions')
      .select("*, category:Categories(name)")
      .order('date', { ascending: false });
    if (filter.date) query = query.eq('date', filter.date);
    if (filter.month) query = query.ilike('date', `${filter.year || ''}-${filter.month.padStart(2,'0')}-%`);
    if (filter.year && !filter.month) query = query.ilike('date', `${filter.year}-%`);
    const { data, error } = await query;
    setLoading(false);
    if (error) return console.error(error.message);
    setTransactions(data ?? []);
    setSelectedRows([]);
  }

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    const channel = supabase
      .channel('public:transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchTransactions());

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Subscribed to transactions changes");
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  } , []);

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleDelete(id: number) {
    if (!confirm('ลบรายการนี้?')) return;
    const { error } = await supabase.from('transactions').delete().eq('transaction_id', id);
    if (error) return alert(error.message);
    setTransactions(prev => prev.filter(t => t.transaction_id !== id));
    setSelectedRows(prev => prev.filter(row => row !== id));
  }

  function handleEdit(transaction: Transaction) {
    setEditTransaction(transaction);
    setShowEditForm(true);
  }

  async function handleDeleteSelected() {
    if (selectedRows.length === 0) return;
    if (!confirm(`ลบ ${selectedRows.length} รายการที่เลือก?`)) return;
    const { error } = await supabase.from('transactions').delete().in('transaction_id', selectedRows);
    if (error) return alert(error.message);
    setTransactions(prev => prev.filter(t => !selectedRows.includes(t.transaction_id)));
    setSelectedRows([]);
  }

  return (
    <>
      <SummaryCards transactions={transactions} />
      <div className="p-6 relative">
        <h1 className="text-xl font-bold mb-4">ประวัติการทำรายการ</h1>

        <FilterSection
          filter={filter}
          onFilterChange={handleFilterChange}
          transactions={transactions}
        />

        <TransactionsTable
          transactions={transactions}
          loading={loading}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          handleDelete={handleDelete}
          handleDeleteSelected={handleDeleteSelected}
          handleEdit={handleEdit}
          categories={categories} // ต้องมีตัวแปร categories
        />

        <button
          ref={addButtonRef}
          className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 text-2xl"
          title="เพิ่มรายการ"
          onClick={() => setShowAddForm(true)}
        >+</button>

        <AddTransactionForm2
          show={showAddForm}
          onClose={() => setShowAddForm(false)}
          onAdded={() => { setShowAddForm(false); fetchTransactions(); }}
          onCancel={() => setShowEditForm(false)} 
        />

        {/* <EditTransactionForm
          show={showEditForm}
          transaction={editTransaction}
          onClose={() => { setShowEditForm(false); setEditTransaction(null); }}
          onUpdated={() => { setShowEditForm(false); setEditTransaction(null); fetchTransactions(); }}
        /> */}
        <EditTransactionForm
          show={showEditForm}
          transaction={editTransaction}
          onUpdated={() => { setShowEditForm(false); fetchTransactions(); }}
          onClose={() => setShowEditForm(false)}
          onCancel={() => setShowEditForm(false)}   // ✅ ส่งมา
        />
      </div>
    </>
  );
}