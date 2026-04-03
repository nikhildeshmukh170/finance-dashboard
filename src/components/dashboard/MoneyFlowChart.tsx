import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import type { ChartPeriod } from '@/types';

const PERIODS: { label: string; value: ChartPeriod; months: number }[] = [
  { label: '1M', value: '1M', months: 1 },
  { label: '3M', value: '3M', months: 3 },
  { label: '6M', value: '6M', months: 6 },
  { label: '1Y', value: '1Y', months: 12 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-card-hover">
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      {payload.map((entry: { color: string; name: string; value: number }) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-semibold tabular-nums">{formatCurrency(entry.value, 'INR', true)}</span>
        </div>
      ))}
    </div>
  );
};

export const MoneyFlowChart = () => {
  const { monthlyData, transactions } = useFinanceStore();
  const [period, setPeriod] = useState<ChartPeriod>('6M');
  const [activeLines, setActiveLines] = useState({ income: true, expense: true, savings: true });

  // Generate data based on period
  const getData = () => {
    const today = new Date();
    
    if (period === '1M') {
      // Generate day-wise data for the current month (from 1st to today)
      const days: Record<string, { day: string; income: number; expense: number; savings: number }> = {};
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      // Start from 1st of current month
      const startDate = new Date(currentYear, currentMonth, 1);
      
      for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const dayTransactions = transactions.filter(txn => txn.date.startsWith(dateStr));
        const dayIncome = dayTransactions
          .filter(t => t.type === 'income' && t.status !== 'failed')
          .reduce((sum, t) => sum + t.amount, 0);
        const dayExpense = dayTransactions
          .filter(t => t.type === 'expense' && t.status !== 'failed')
          .reduce((sum, t) => sum + t.amount, 0);
        
        days[dayName] = {
          day: dayName,
          income: dayIncome,
          expense: dayExpense,
          savings: dayIncome - dayExpense,
        };
      }
      
      return Object.values(days);
    } else {
      // Generate monthly data dynamically based on current date
      const months = PERIODS.find((p) => p.value === period)?.months ?? 6;
      const monthsData: { month: string; income: number; expense: number; savings: number }[] = [];
      
      // Calculate start date based on the current date
      const startDate = new Date(today);
      startDate.setMonth(startDate.getMonth() - (months - 1));
      startDate.setDate(1);
      
      // Generate data for each month in the range
      for (let i = 0; i < months; i++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + i);
        
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        // Filter transactions for this month
        const monthTransactions = transactions.filter(txn => {
          const txnDate = new Date(txn.date);
          return txnDate >= monthStart && txnDate <= monthEnd;
        });
        
        const monthIncome = monthTransactions
          .filter(t => t.type === 'income' && t.status !== 'failed')
          .reduce((sum, t) => sum + t.amount, 0);
        const monthExpense = monthTransactions
          .filter(t => t.type === 'expense' && t.status !== 'failed')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        monthsData.push({
          month: monthLabel,
          income: monthIncome,
          expense: monthExpense,
          savings: monthIncome - monthExpense,
        });
      }
      
      return monthsData;
    }
  };

  const data = getData();
  const dataKey = period === '1M' ? 'day' : 'month';

  const toggleLine = (key: keyof typeof activeLines) => {
    setActiveLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-card"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1">
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-900/20">
            <TrendingUp className="w-4 h-4 text-brand-500" />
          </div>
          <div>
            <p className="font-display font-semibold text-base text-foreground">Money Flow</p>
            <p className="text-xs text-muted-foreground">
              {period === '1M' ? 'Daily breakdown' : 'Income vs Expenses'}
            </p>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground ml-2" />
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                period === p.value
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend toggles */}
      <div className="flex items-center gap-4 mb-4">
        {(
          [
            { key: 'income', label: 'Income', color: '#10b981' },
            { key: 'expense', label: 'Expense', color: '#ef4444' },
            { key: 'savings', label: 'Savings', color: '#3b82f6' },
          ] as { key: keyof typeof activeLines; label: string; color: string }[]
        ).map((item) => (
          <button
            key={item.key}
            onClick={() => toggleLine(item.key)}
            className={cn(
              'flex items-center gap-1.5 text-xs font-medium transition-opacity',
              !activeLines[item.key] && 'opacity-40'
            )}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: activeLines[item.key] ? item.color : '#9ca3af' }}
            />
            {item.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey={dataKey}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />

            {activeLines.income && (
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#incomeGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
              />
            )}
            {activeLines.expense && (
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2.5}
                fill="url(#expenseGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
              />
            )}
            {activeLines.savings && (
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#savingsGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
