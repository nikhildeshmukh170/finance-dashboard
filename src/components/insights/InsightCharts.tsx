import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, Award, Target, Zap } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, categoryColors, categoryEmojis } from '@/utils/formatters';
import { cn } from '@/utils/cn';

// ─── Monthly Comparison Bar Chart ────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-card-hover">
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      {payload.map((p: { color: string; name: string; value: number }) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold tabular-nums">{formatCurrency(p.value, 'INR', true)}</span>
        </div>
      ))}
    </div>
  );
};

export const MonthlyComparisonChart = () => {
  const { transactions } = useFinanceStore();

  // Generate last 6 months of data dynamically based on today's date
  const today = new Date();
  const monthsData: { month: string; income: number; expense: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(today);
    monthDate.setMonth(monthDate.getMonth() - i);

    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    const monthTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= monthStart && txnDate <= monthEnd;
    });

    const income = monthTransactions
      .filter((t) => t.type === 'income' && t.status !== 'failed')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter((t) => t.type === 'expense' && t.status !== 'failed')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    monthsData.push({ month: monthLabel, income, expense });
  }

  const avgIncome = Math.round(monthsData.reduce((a, b) => a + b.income, 0) / monthsData.length);
  const avgExpense = Math.round(monthsData.reduce((a, b) => a + b.expense, 0) / monthsData.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-display font-semibold text-base text-foreground">Monthly Comparison</p>
          <p className="text-xs text-muted-foreground">Income vs Expenses — last 6 months</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-500" />
            <span className="text-muted-foreground">Expense</span>
          </div>
        </div>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthsData} barCategoryGap="30%" margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<BarTooltip />} />
            <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Avg badges */}
      <div className="flex gap-3 mt-4">
        <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-3">
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Avg. Income</p>
          <p className="font-display font-bold text-emerald-700 dark:text-emerald-300 tabular-nums mt-1">
            {formatCurrency(avgIncome, 'INR', true)}
          </p>
        </div>
        <div className="flex-1 bg-red-50 dark:bg-red-900/10 rounded-xl p-3">
          <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider">Avg. Expense</p>
          <p className="font-display font-bold text-red-700 dark:text-red-300 tabular-nums mt-1">
            {formatCurrency(avgExpense, 'INR', true)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Top Spending Categories ──────────────────────────────────────────────────

export const TopSpendingCategories = () => {
  const { transactions } = useFinanceStore();

  // Calculate spending by category from transactions
  const categorySpending: Record<string, number> = {};

  transactions
    .filter((t) => t.type === 'expense' && t.status !== 'failed')
    .forEach((t) => {
      categorySpending[t.category] = (categorySpending[t.category] ?? 0) + t.amount;
    });

  const totalExpense = Object.values(categorySpending).reduce((a, b) => a + b, 0);

  const expenseBreakdown = Object.entries(categorySpending)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      color: categoryColors[category as keyof typeof categoryColors] || '#6b7280',
    }))
    .sort((a, b) => b.amount - a.amount);

  const sorted = expenseBreakdown;
  const top = sorted[0] || { category: 'N/A', amount: 0, percentage: 0, color: '#6b7280' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
          <Award className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <p className="font-display font-semibold text-base text-foreground">Top Spending</p>
          <p className="text-xs text-muted-foreground">By category this period</p>
        </div>
      </div>

      {/* Top category highlight */}
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: `${top.color}12` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${top.color}20` }}
          >
            {categoryEmojis[top.category as keyof typeof categoryEmojis] ?? '📦'}
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Highest Spend</p>
            <p className="font-display font-bold text-lg text-foreground">{top.category}</p>
            <p
              className="text-sm font-semibold tabular-nums"
              style={{ color: top.color }}
            >
              {formatCurrency(top.amount)} · {top.percentage}%
            </p>
          </div>
        </div>
      </div>

      {/* All categories list */}
      <div className="space-y-3">
        {sorted.map((item, index) => (
          <div key={item.category} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-5 text-right font-mono">{index + 1}</span>
            <div className="text-base w-8 text-center">{categoryEmojis[item.category] ?? '📦'}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-foreground truncate">{item.category}</p>
                <p className="text-xs font-semibold text-foreground tabular-nums ml-2 flex-shrink-0">
                  {formatCurrency(item.amount, 'INR', true)}
                </p>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.7, delay: index * 0.06 }}
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Financial Health Score ───────────────────────────────────────────────────

export const FinancialHealthScore = () => {
  const { getSummary } = useFinanceStore();
  const summary = getSummary();

  const savingsRate = summary.totalIncome > 0
    ? (summary.totalSavings / summary.totalIncome) * 100
    : 0;

  const score = Math.min(100, Math.round(
    (savingsRate > 20 ? 40 : savingsRate * 2) +
    (summary.totalIncome > summary.totalExpense ? 30 : 0) +
    (summary.totalSavings > 0 ? 30 : 0)
  ));

  const grade =
    score >= 80 ? { label: 'Excellent', color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-900/20' } :
    score >= 60 ? { label: 'Good', color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-900/20' } :
    score >= 40 ? { label: 'Fair', color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/20' } :
    { label: 'Poor', color: '#ef4444', bg: 'bg-red-50 dark:bg-red-900/20' };

  const metrics = [
    {
      label: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      target: '20%+',
      ok: savingsRate >= 20,
    },
    {
      label: 'Income vs Expense',
      value: formatCurrency(summary.totalIncome - summary.totalExpense, 'INR', true),
      target: 'Positive',
      ok: summary.totalIncome > summary.totalExpense,
    },
    {
      label: 'Net Savings',
      value: formatCurrency(summary.totalSavings, 'INR', true),
      target: '>$0',
      ok: summary.totalSavings > 0,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-900/20">
          <Zap className="w-4 h-4 text-brand-500" />
        </div>
        <div>
          <p className="font-display font-semibold text-base text-foreground">Financial Health</p>
          <p className="text-xs text-muted-foreground">Your overall financial score</p>
        </div>
      </div>

      {/* Score ring */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <motion.circle
              cx="40" cy="40" r="32"
              fill="none"
              stroke={grade.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 32}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - score / 100) }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-xl text-foreground">{score}</span>
          </div>
        </div>

        <div>
          <span
            className={cn('inline-block px-3 py-1 rounded-full text-sm font-bold mb-1', grade.bg)}
            style={{ color: grade.color }}
          >
            {grade.label}
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your finances are in {grade.label.toLowerCase()} shape. Keep tracking to improve!
          </p>
        </div>
      </div>

      {/* Metrics list */}
      <div className="space-y-3">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-white text-xs',
                  m.ok ? 'bg-emerald-500' : 'bg-red-400'
                )}
              >
                {m.ok ? '✓' : '!'}
              </div>
              <p className="text-sm text-foreground">{m.label}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground tabular-nums">{m.value}</p>
              <p className="text-[10px] text-muted-foreground">Target: {m.target}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Income vs Expense Summary card ──────────────────────────────────────────

export const IncomeExpenseSummary = () => {
  const { getSummary } = useFinanceStore();
  const summary = getSummary();

  const ratio = summary.totalIncome > 0
    ? (summary.totalExpense / summary.totalIncome) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20">
          <Target className="w-4 h-4 text-purple-500" />
        </div>
        <div>
          <p className="font-display font-semibold text-base text-foreground">Income vs Expenses</p>
          <p className="text-xs text-muted-foreground">Spend ratio this period</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Income */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <p className="text-sm font-medium text-foreground">Total Income</p>
            </div>
            <p className="text-sm font-bold text-emerald-500 tabular-nums">
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-full bg-emerald-500 rounded-full" />
          </div>
        </div>

        {/* Expense */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <p className="text-sm font-medium text-foreground">Total Expenses</p>
            </div>
            <p className="text-sm font-bold text-red-500 tabular-nums">
              {formatCurrency(summary.totalExpense)}
            </p>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, ratio)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: ratio > 80 ? '#ef4444' : ratio > 60 ? '#f59e0b' : '#10b981' }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">{ratio.toFixed(1)}% of income</p>
        </div>

        {/* Net */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Net Savings</p>
            <p
              className={cn(
                'text-sm font-bold tabular-nums',
                summary.totalSavings >= 0 ? 'text-emerald-500' : 'text-red-500'
              )}
            >
              {summary.totalSavings >= 0 ? '+' : ''}{formatCurrency(summary.totalSavings)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
