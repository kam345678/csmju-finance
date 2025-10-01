export type Transaction = {
  id: number;
  type: 'income' | 'expense';
  category: number;
  amount: number;
  date: string;
  note?: string;
};

export type Categories ={
    category_id: number;
    name: string;
}