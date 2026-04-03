import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import { SummaryCardSkeleton } from '@/components/ui/Skeletons';

interface SummaryCardProps {
  label: string;
  value: number;
  change: number;
  type: 'balance' | 'income' | 'expense' | 'savings';
  isLoading?: boolean;
  index?: number;
}

const cardConfig = {
  balance: {
    icon: Wallet,
    gradient: 'from-blue-500 to-blue-600',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-500',
    accentColor: 'text-blue-500',
    borderAccent: 'border-l-blue-500',
  },
  income: {
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-emerald-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-500',
    accentColor: 'text-emerald-500',
    borderAccent: 'border-l-emerald-500',
  },
  expense: {
    icon: TrendingDown,
    gradient: 'from-red-500 to-red-600',
    lightBg: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-500',
    accentColor: 'text-red-500',
    borderAccent: 'border-l-red-500',
  },
  savings: {
    icon: PiggyBank,
    gradient: 'from-amber-500 to-amber-600',
    lightBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-500',
    accentColor: 'text-amber-500',
    borderAccent: 'border-l-amber-500',
  },
};

export const SummaryCard = ({ label, value, change, type, isLoading, index = 0 }: SummaryCardProps) => {
  if (isLoading) return <SummaryCardSkeleton />;

  const config = cardConfig[type];
  const Icon = config.icon;
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        'bg-card border border-border rounded-2xl p-5',
        'border-l-4 shadow-card hover:shadow-card-hover transition-shadow',
        config.borderAccent
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn('p-2 rounded-xl', config.lightBg)}>
          <Icon className={cn('w-4 h-4', config.iconColor)} strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-display font-bold text-2xl text-foreground tabular-nums leading-none">
          {formatCurrency(value, 'INR', false)}
        </p>

        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              'flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-semibold',
              isPositive
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
            )}
          >
            <TrendIcon className="w-3 h-3" />
            {Math.abs(change).toFixed(2)}%
          </div>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Row of 4 summary cards ───────────────────────────────────────────────────

interface SummaryRowProps {
  summary: {
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
    totalSavings: number;
    balanceChange: number;
    incomeChange: number;
    expenseChange: number;
    savingsChange: number;
  };
  isLoading?: boolean;
}

export const SummaryRow = ({ summary, isLoading }: SummaryRowProps) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    <SummaryCard
      label="Total Balance"
      value={summary.totalBalance}
      change={summary.balanceChange}
      type="balance"
      isLoading={isLoading}
      index={0}
    />
    <SummaryCard
      label="Total Income"
      value={summary.totalIncome}
      change={summary.incomeChange}
      type="income"
      isLoading={isLoading}
      index={1}
    />
    <SummaryCard
      label="Total Expenses"
      value={summary.totalExpense}
      change={summary.expenseChange}
      type="expense"
      isLoading={isLoading}
      index={2}
    />
    <SummaryCard
      label="Total Savings"
      value={summary.totalSavings}
      change={summary.savingsChange}
      type="savings"
      isLoading={isLoading}
      index={3}
    />
  </div>
);
