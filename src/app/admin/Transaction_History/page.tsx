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
      query = query.ilike(
        "date",
        `${filter.year || ""}-${filter.month.padStart(2, "0")}-%`
      );
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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => fetchTransactions()
      );

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Subscribed to transactions changes");
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTransactions, fetchCategories]);

  // ✅ ฟังก์ชันกรองข้อมูล
  function handleFilterChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }


  async function handleDelete(id: number) {
    if (!confirm("ลบรายการนี้?")) return;
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("transaction_id", id);
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
    setTransactions((prev) =>
      prev.filter((t) => !selectedRows.includes(t.transaction_id))
    );
    setSelectedRows([]);
  }

  return (
    <>
      {/* ✅ Summary */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 min-h-screen">
        <SummaryCards transactions={transactions} />

        {/* ✅ Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
             ประวัติการทำรายการ
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => fetchTransactions()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm sm:text-base font-medium shadow-md transition-all"
            >
              🔄 รีเฟรช
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm sm:text-base font-medium shadow-md transition-all"
            >
              ➕ เพิ่มรายการ
            </button>
          </div>
        </div>

        {/* ✅ Filter Section */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 shadow-md mb-6">
          <FilterSection
            filter={filter}
            onFilterChange={handleFilterChange}
            transactions={transactions}
          />
        </div>

        {/* ✅ Transactions Table */}
        <div className="bg-slate-800/90 rounded-xl border border-slate-700 shadow-lg overflow-x-auto">
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

        {/* ✅ Floating Add Button (มือถือ) */}
        <button
          ref={addButtonRef}
          className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 text-3xl sm:hidden"
          title="เพิ่มรายการ"
          onClick={() => setShowAddForm(true)}
        >
          +
        </button>

        {/* ✅ Modal Add/Edit */}
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
    </>
  );
}
