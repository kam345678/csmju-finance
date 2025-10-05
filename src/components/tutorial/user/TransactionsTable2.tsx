"use client";

import { Categories, Transaction } from "@/types";

interface Props {
  transactions: Transaction[];
  loading: boolean;
  categories: Categories[];
}

export default function TransactionsTable2({
  transactions,
  loading, 
  categories,
}: Props) {
  
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

  
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 shadow-lg p-3">
      

      <table className="min-w-full table-fixed text-sm text-slate-300">
        <thead className="bg-slate-800/90 border-b border-slate-700">
          <tr>
            
            <th className="w-[120px] text-center p-3">วันที่</th>
            <th className="w-[100px] text-center p-3">เวลา</th>
            <th className="w-[90px] text-center p-3">ประเภท</th>
            <th className="w-[140px] text-center p-3">หมวดหมู่</th>
            <th className="w-[120px] text-right p-3">จำนวนเงิน</th>
            <th className="w-[200px] text-left p-3">คำอธิบาย</th>
            <th className="w-[100px] text-center p-3">ไฟล์แนบ</th>
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
              <tr key={t.transaction_id}className= "border-b border-slate-700 hover:bg-slate-700/60 transition-all ">
                
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
               
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
