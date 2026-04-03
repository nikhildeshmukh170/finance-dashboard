import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Transaction,
  SavingsGoal,
  Card,
  MonthlyData,
  ExpenseBreakdown,
  UserRole,
  TransactionFilters,
  FinancialSummary,
} from '@/types';
import {
  mockTransactions,
  mockSavingsGoals,
  mockCards,
  mockMonthlyData,
  mockExpenseBreakdown,
} from '@/data/mockData';

export const defaultFilters: TransactionFilters = {
  search: '',
  type: 'all',
  category: 'all',
  dateFrom: '',
  dateTo: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

function computeSummary(transactions: Transaction[]): FinancialSummary {
  const income = transactions
    .filter((t) => t.type === 'income' && t.status !== 'failed')
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === 'expense' && t.status !== 'failed')
    .reduce((acc, t) => acc + t.amount, 0);
  const savings = income - expense;
  return {
    totalBalance: 128320 + savings,
    totalIncome: income,
    totalExpense: expense,
    totalSavings: savings,
    balanceChange: 23.12,
    incomeChange: 11.09,
    expenseChange: -4.33,
    savingsChange: 11.09,
  };
}

function applyFilters(transactions: Transaction[], filters: TransactionFilters): Transaction[] {
  let result = [...transactions];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q) ?? false)
    );
  }
  if (filters.type !== 'all') result = result.filter((t) => t.type === filters.type);
  if (filters.category !== 'all') result = result.filter((t) => t.category === filters.category);
  if (filters.dateFrom) result = result.filter((t) => new Date(t.date) >= new Date(filters.dateFrom));
  if (filters.dateTo) result = result.filter((t) => new Date(t.date) <= new Date(filters.dateTo + 'T23:59:59Z'));
  result.sort((a, b) => {
    let cmp = 0;
    if (filters.sortBy === 'date') cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
    else if (filters.sortBy === 'amount') cmp = a.amount - b.amount;
    else if (filters.sortBy === 'title') cmp = a.title.localeCompare(b.title);
    return filters.sortOrder === 'asc' ? cmp : -cmp;
  });
  return result;
}

interface FinanceStore {
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  cards: Card[];
  monthlyData: MonthlyData[];
  expenseBreakdown: ExpenseBreakdown[];
  role: UserRole;
  filters: TransactionFilters;
  isLoading: boolean;
  activeCardId: string;
  getSummary: () => FinancialSummary;
  getFilteredTransactions: () => Transaction[];
  setRole: (role: UserRole) => void;
  addTransaction: (txn: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
  setActiveCard: (id: string) => void;
  addCard: (card: Omit<Card, 'id'>) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  deleteGoal: (id: string) => void;
  updateGoal: (id: string, data: Partial<SavingsGoal>) => void;
  setLoading: (v: boolean) => void;
}

const genId = () => `txn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      savingsGoals: mockSavingsGoals,
      cards: mockCards,
      monthlyData: mockMonthlyData,
      expenseBreakdown: mockExpenseBreakdown,
      role: 'admin',
      filters: defaultFilters,
      isLoading: false,
      activeCardId: mockCards[0].id,
      getSummary: () => computeSummary(get().transactions),
      getFilteredTransactions: () => applyFilters(get().transactions, get().filters),
      setRole: (role) => set({ role }),
      addTransaction: (txn) =>
        set((s) => ({ transactions: [{ ...txn, id: genId() }, ...s.transactions] })),
      updateTransaction: (id, data) =>
        set((s) => ({ transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),
      setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
      resetFilters: () => set({ filters: defaultFilters }),
      setActiveCard: (id) => set({ activeCardId: id }),
      addCard: (card) => set((s) => {
        const newCard: Card = {
          ...card,
          id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        };
        return { cards: [...s.cards, newCard], activeCardId: newCard.id };
      }),
      addGoal: (goal) =>
        set((s) => ({
          savingsGoals: [
            ...s.savingsGoals,
            { ...goal, id: `goal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` },
          ],
        })),
      deleteGoal: (id) =>
        set((s) => ({ savingsGoals: s.savingsGoals.filter((g) => g.id !== id) })),
      updateGoal: (id, data) =>
        set((s) => ({
          savingsGoals: s.savingsGoals.map((g) => (g.id === id ? { ...g, ...data } : g)),
        })),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'finio-finance-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ transactions: s.transactions, savingsGoals: s.savingsGoals, role: s.role, activeCardId: s.activeCardId }),
    }
  )
);
