


// src/types/index.ts
export type Transaction = {
  transaction_id: number;
  type: 'income' | 'expense';
  category: number | { category_id: number; name: string }; // ✅ รองรับ join
  amount: number;
  date: string;
  time: string;
  note?: string;
  attachment_URL?: string;
};

export type Categories = {
  category_id: number;
  name: string;
};

// export type Transaction = {
//   transaction_id: number;
//   type: 'income' | 'expense';
//   category: number;
//   amount: number;
//   date: string;
//   time: string;
//   note?: string;
//   attachment_URL?: string;
// };

// export type Categories ={
//     category_id: number;
//     name: string;
// }