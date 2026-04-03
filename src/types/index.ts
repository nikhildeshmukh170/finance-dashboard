// ─── Core Domain Types ─────────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionCategory =
  | 'Shopping'
  | 'Food & Dining'
  | 'Transportation'
  | 'Housing'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Other';

export type UserRole = 'admin' | 'viewer';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // ISO string
  description?: string;
  status: 'completed' | 'pending' | 'failed';
  avatar?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  color: string;
  icon: string;
}

export interface Card {
  id: string;
  name: string;
  number: string;
  expiry: string;
  balance: number;
  currency: string;
  type: 'visa' | 'mastercard' | 'amex';
  isDefault: boolean;
  gradient: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  balanceChange: number;
  incomeChange: number;
  expenseChange: number;
  savingsChange: number;
}

// ─── Store Types ────────────────────────────────────────────────────────────

export interface TransactionFilters {
  search: string;
  type: TransactionType | 'all';
  category: TransactionCategory | 'all';
  dateFrom: string;
  dateTo: string;
  sortBy: 'date' | 'amount' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface FinanceStore {
  // State
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  cards: Card[];
  monthlyData: MonthlyData[];
  expenseBreakdown: ExpenseBreakdown[];
  role: UserRole;
  filters: TransactionFilters;
  isLoading: boolean;
  activeCardId: string;

  // Computed
  summary: FinancialSummary;
  filteredTransactions: Transaction[];

  // Actions
  setRole: (role: UserRole) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
  setActiveCard: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

// ─── Component Prop Types ───────────────────────────────────────────────────

export interface SummaryCardProps {
  label: string;
  value: number;
  change: number;
  type: 'balance' | 'income' | 'expense' | 'savings';
  isLoading?: boolean;
}

export type ChartPeriod = '1M' | '3M' | '6M' | '1Y';
