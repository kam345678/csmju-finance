"use client";
import { useEffect, useState, useRef, useCallback } from "react";
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

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from("Categories").select("*");
    if (error) return console.error(error.message);
    setCategories(data ?? []);
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("transactions")
      .select("*, category:Categories(name)")
      .order("date", { ascending: false });

    if (filter.date) query = query.eq("date", filter.date);
    if (filter.month)
      query = query.ilike("date", `${filter.year || ""}-${filter.month.padStart(2, "0")}-%`);
    if (filter.year && !filter.month)
      query = query.ilike("date", `${filter.year}-%`);

    const { data, error } = await query;
    setLoading(false);
    if (error) return console.error(error.message);
    setTransactions(data ?? []);
    setSelectedRows([]);
  }, [filter]);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();

    const channel = supabase
      .channel("public:transactions")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () =>
        fetchTransactions()
      );

    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTransactions, fetchCategories]);

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleDelete(id: number) {
    if (!confirm("ลบรายการนี้?")) return;
    const { error } = await supabase.from("transactions").delete().eq("transaction_id", id);
    if (error) return alert(error.message);
    setTransactions((prev) => prev.filter((t) => t.transaction_id !== id));
    setSelectedRows((prev) => prev.filter((row) => row !== id));
  }

  function handleEdit(transaction: Transaction) {
    setEditTransaction(transaction);
    setShowEditForm(true);
  }

  async function handleDeleteSelected() {
    if (selectedRows.length === 0) return;
    if (!confirm(`ลบ ${selectedRows.length} รายการที่เลือก?`)) return;
    const { error } = await supabase
      .from("transactions")
      .delete()
      .in("transaction_id", selectedRows);
    if (error) return alert(error.message);
    setTransactions((prev) => prev.filter((t) => !selectedRows.includes(t.transaction_id)));
    setSelectedRows([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#07121C] via-[#0B1F2D] to-[#123445] text-white font-sans p-6">
      {/* Summary */}
      <SummaryCards transactions={transactions} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 mb-4">
        <h1 className="text-3xl font-bold tracking-wide text-white">
          💰 ประวัติการทำรายการ
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => fetchTransactions()}
            className="px-4 py-2 rounded-xl border border-white/30 text-white bg-gradient-to-r from-[#0D3C5D] to-[#10577A] shadow-md hover:from-[#10577A] hover:to-[#0D3C5D] hover:scale-105 transition-transform duration-300"
          >
            🔄 รีเฟรช
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-xl border border-white/30 text-white bg-gradient-to-r from-[#0F2A48] to-[#145C7A] shadow-md hover:from-[#145C7A] hover:to-[#0F2A48] hover:scale-105 transition-transform duration-300"
          >
            ➕ เพิ่มรายการ
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl mb-6">
        <FilterSection
          filter={filter}
          onFilterChange={handleFilterChange}
          transactions={transactions}
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-x-auto">
        <TransactionsTable
          transactions={transactions}
          loading={loading}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          handleDelete={handleDelete}
          handleDeleteSelected={handleDeleteSelected}
          handleEdit={handleEdit}
          categories={categories}
        />
      </div>

      {/* Floating Add Button (mobile) */}
      <button
        ref={addButtonRef}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#0D3C5D] to-[#10577A] hover:from-[#10577A] hover:to-[#0D3C5D] text-white rounded-full shadow-lg p-4 text-3xl sm:hidden transition-transform hover:scale-110"
        title="เพิ่มรายการ"
        onClick={() => setShowAddForm(true)}
      >
        +
      </button>

      {/* Modal Add/Edit */}
      <AddTransactionForm2
        show={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdded={() => {
          setShowAddForm(false);
          fetchTransactions();
        }}
        onCancel={() => setShowAddForm(false)}
      />

      <EditTransactionForm
        show={showEditForm}
        transaction={editTransaction}
        onUpdated={() => {
          setShowEditForm(false);
          fetchTransactions();
        }}
        onClose={() => setShowEditForm(false)}
        onCancel={() => setShowEditForm(false)}
      />
    </div>
  );
}
