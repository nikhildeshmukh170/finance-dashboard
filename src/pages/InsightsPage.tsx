import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import {
  MonthlyComparisonChart,
  TopSpendingCategories,
  FinancialHealthScore,
  IncomeExpenseSummary,
} from '@/components/insights/InsightCharts';
import { formatCurrency } from '@/utils/formatters';
import { exportSummaryToCSV } from '@/utils/csvExport';

export const InsightsPage = () => {
  const { getSummary } = useFinanceStore();
  const summary = getSummary();

  const handleExport = () => {
    exportSummaryToCSV([
      { label: 'Total Balance', value: formatCurrency(summary.totalBalance) },
      { label: 'Total Income', value: formatCurrency(summary.totalIncome) },
      { label: 'Total Expenses', value: formatCurrency(summary.totalExpense) },
      { label: 'Net Savings', value: formatCurrency(summary.totalSavings) },
      { label: 'Income Change', value: `${summary.incomeChange}%` },
      { label: 'Expense Change', value: `${summary.expenseChange}%` },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h2 className="font-display font-bold text-xl text-foreground">Financial Insights</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Deep analysis of your spending patterns and trends
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-all"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Top grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MonthlyComparisonChart />
        <FinancialHealthScore />
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopSpendingCategories />
        <IncomeExpenseSummary />
      </div>
    </motion.div>
  );
};
