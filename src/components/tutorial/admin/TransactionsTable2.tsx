"use client";
import { useState } from "react";
import { Categories, Transaction } from "@/types";

interface Props {
  transactions: Transaction[];
  loading: boolean;
  selectedRows: number[];
  setSelectedRows: (ids: number[]) => void;
  handleDelete: (id: number) => void;
  handleDeleteSelected: () => void;
  handleEdit: (t: Transaction) => void;
  categories: Categories[];
}

export default function TransactionsTable2({
  transactions,
  loading,
  selectedRows,
  setSelectedRows,
  handleDelete,
  handleDeleteSelected,
  handleEdit,
  categories,
}: Props) {
  const handleSelectRow = (id: number, checked: boolean) => {
    const newSelected = checked
      ? [...selectedRows, id]
      : selectedRows.filter((rowId) => rowId !== id);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? transactions.map((t) => t.transaction_id) : []);
  };

  const getCategoryName = (
    category:
      | number
      | { category_id: number; name: string }
      | null
      | undefined,
    categories: Categories[]
  ): string => {
    if (category && typeof category === "object") return category.name;
    const cat = categories.find((c) => c.category_id === category);
    return cat ? cat.name : "-";
  };

  const RowActions = ({ transaction }: { transaction: Transaction }) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1.5 rounded-md hover:bg-slate-700 transition"
        >
          <svg width="18" height="18" fill="currentColor" className="text-slate-300">
            <circle cx="4" cy="9" r="1.5" />
            <circle cx="9" cy="9" r="1.5" />
            <circle cx="14" cy="9" r="1.5" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg w-28 z-20">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/80"
              onClick={() => {
                setOpen(false);
                handleEdit(transaction);
              }}
            >
               แก้ไข
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600/40 hover:text-white"
              onClick={() => {
                setOpen(false);
                handleDelete(transaction.transaction_id);
              }}
            >
               ลบ
            </button>
          </div>
        )}
      </div>
    );
  };

  //  เพิ่มแถบเครื่องมือด้านบน (แสดงจำนวนที่เลือก + ปุ่มลบ)
  const Toolbar = () => (
    <div className="flex items-center justify-between mb-3 bg-slate-800/70 border border-slate-700 rounded-lg px-4 py-2">
      {selectedRows.length > 0 ? (
        <>
          <p className="text-sm text-emerald-400">
            เลือก {selectedRows.length} รายการ
          </p>
          <button
            onClick={() => {
              if (
                confirm(`คุณต้องการลบ ${selectedRows.length} รายการนี้หรือไม่?`)
              ) {
                handleDeleteSelected();
              }
            }}
            className="bg-red-600/80 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md transition shadow-md"
          >
             ลบที่เลือก
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-400">ยังไม่มีรายการที่เลือก</p>
      )}
    </div>
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 shadow-lg p-3">
      <Toolbar />

      <table className="min-w-full table-fixed text-sm text-slate-300">
        <thead className="bg-slate-800/90 border-b border-slate-700">
          <tr>
            <th className="w-[40px] p-3 text-center">
              <input
                type="checkbox"
                checked={
                  transactions.length > 0 &&
                  selectedRows.length === transactions.length
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="accent-emerald-500"
              />
            </th>
            <th className="w-[120px] text-center p-3">วันที่</th>
            <th className="w-[100px] text-center p-3">เวลา</th>
            <th className="w-[90px] text-center p-3">ประเภท</th>
            <th className="w-[140px] text-center p-3">หมวดหมู่</th>
            <th className="w-[120px] text-right p-3">จำนวนเงิน</th>
            <th className="w-[200px] text-left p-3">คำอธิบาย</th>
            <th className="w-[100px] text-center p-3">ไฟล์แนบ</th>
            <th className="w-[80px] text-center p-3">การดำเนินการ</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={9}
                className="text-center py-6 text-slate-400 animate-pulse"
              >
                กำลังโหลดข้อมูล...
              </td>
            </tr>
          ) : (
            transactions.map((t: Transaction) => (
              <tr
                key={t.transaction_id}
                className={`border-b border-slate-700 hover:bg-slate-700/60 transition-all ${
                  selectedRows.includes(t.transaction_id)
                    ? "bg-emerald-700/20"
                    : ""
                }`}
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(t.transaction_id)}
                    onChange={(e) =>
                      handleSelectRow(t.transaction_id, e.target.checked)
                    }
                    className="accent-emerald-500"
                  />
                </td>
                <td className="p-3 text-center whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString("th-TH")}
                </td>
                <td className="p-3 text-center whitespace-nowrap">
                  {t.time?.slice(0, 5) || "-"}
                </td>
                <td className="p-3 text-center">
                  {t.type === "income" ? (
                    <span className="text-emerald-400 font-medium">รายรับ</span>
                  ) : (
                    <span className="text-rose-400 font-medium">รายจ่าย</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {getCategoryName(t.category, categories)}
                </td>
                <td className="p-3 text-right font-semibold text-slate-100">
                  {t.amount.toLocaleString("th-TH", {
                    style: "currency",
                    currency: "THB",
                  })}
                </td>
                <td className="p-3">{t.note || "-"}</td>
                <td className="p-3 text-center">
                  {t.attachment_URL ? (
                    <a
                      href={t.attachment_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      ดูรูป
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-3 text-center">
                  <RowActions transaction={t} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
