"use client";
import { Categories, Transaction } from "@/types";
import { useState } from "react";

interface Props {
  transactions: Transaction[];
  loading: boolean;
  selectedRows: number[];
  setSelectedRows: (ids: number[]) => void;
  handleDelete: (id: number) => void;
  handleDeleteSelected: () => void;
  handleEdit: (t: Transaction) => void;
  categories: Categories[]; // เพิ่มตรงนี้
}

export default function TransactionsTable({
  transactions,
  loading,
  selectedRows,
  setSelectedRows,
  handleDelete,
  handleDeleteSelected,
  handleEdit,
  categories
}: Props) {

  function handleSelectRow(id: number, checked: boolean) {
  const newSelected = checked
    ? [...selectedRows, id]
    : selectedRows.filter(rowId => rowId !== id);
  setSelectedRows(newSelected);
}

  function handleSelectAll(checked: boolean) {
    setSelectedRows(checked ? transactions.map(t => t.transaction_id) : []);
  }

  function RowActions({ transaction }: { transaction: Transaction }) {
    const [open, setOpen] = useState(false);



    return (
      <div className="relative">
        <button onClick={() => setOpen(o => !o)}>
          <svg width="20" height="20" fill="currentColor">
            <circle cx="4" cy="10" r="2" />
            <circle cx="10" cy="10" r="2" />
            <circle cx="16" cy="10" r="2" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 z-20 bg-white/50 border rounded shadow py-1 w-28">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setOpen(false); handleEdit(transaction); }}>แก้ไข</button>
            <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100" onClick={() => { setOpen(false); handleDelete(transaction.transaction_id); }}>ลบ</button>
          </div>
        )}
      </div>
    );
  }
    function getCategoryName(
  category: number | { category_id: number; name: string } | null | undefined,
  categories: Categories[]
  ): string {
    if (category && typeof category === "object") return category.name; // เช็ก category ไม่เป็น null
    const cat = categories.find(c => c.category_id === category);
    return cat ? cat.name : "-";
  }

  return (
    <div className="relative">
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2 mb-3 px-2 py-2 bg-gray-50/20 border rounded shadow-sm">
          <button onClick={() => handleSelectAll(selectedRows.length !== transactions.length)}>
            {selectedRows.length === transactions.length ? "ยกเลิกเลือกทั้งหมด" : "เลือกทั้งหมด"}
          </button>
          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleDeleteSelected}>ลบที่เลือก</button>
        </div>
      )}
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full">
          <thead>
            <tr>
              <th><input type="checkbox" checked={transactions.length>0 && selectedRows.length===transactions.length} onChange={e=>handleSelectAll(e.target.checked)} /></th>
              <th>วันที่</th>
              <th>เวลา</th>
              <th>ประเภท</th>
              <th>หมวดหมู่</th>
              <th>จำนวนเงิน</th>
              <th>คำอธิบาย</th>
              <th>ไฟล์แนบ</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={8}>Loading...</td></tr> :
              transactions.map(t => (
                <tr key={t.transaction_id} className={selectedRows.includes(t.transaction_id) ? "bg-blue-50/30" : ""}>
                  <td><input type="checkbox" checked={selectedRows.includes(t.transaction_id)} onChange={e=>handleSelectRow(t.transaction_id, e.target.checked)} /></td>
                  <td>{t.date}</td>
                  <td>{t.time}</td>
                  <td>{t.type === "income" ? "รายรับ" : "รายจ่าย"}</td>
                  <td>{getCategoryName(t.category, categories)}</td>
                  <td>{t.amount}</td>
                  <td>{t.note}</td>
                  <td>{t.attachment_URL ? <a href={t.attachment_URL} target="_blank">ดูรูป</a> : "-"}</td>
                  <td className="text-right"><RowActions transaction={t} /></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
