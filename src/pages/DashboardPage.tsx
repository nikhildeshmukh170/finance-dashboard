import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '@/store/useFinanceStore';
import { SummaryRow } from '@/components/dashboard/SummaryCards';
import { CreditCardSection } from '@/components/dashboard/CreditCard';
import { MoneyFlowChart } from '@/components/dashboard/MoneyFlowChart';
import { ExpenseDonutChart } from '@/components/dashboard/ExpenseDonutChart';
import { SavingsList } from '@/components/dashboard/SavingsList';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickTransfer } from '@/components/dashboard/QuickTransfer';

export const DashboardPage = () => {
  const { getSummary, setLoading } = useFinanceStore();
  const [isLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setLoading]);

  const summary = getSummary();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Summary cards */}
      <SummaryRow summary={summary} isLoading={isLoading} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr_360px] gap-5">
        {/* Left column */}
        <div className="space-y-5">
          <CreditCardSection />
          <QuickTransfer />
        </div>

        {/* Center column */}
        <div className="space-y-5">
          <MoneyFlowChart />
          <RecentTransactions isLoading={isLoading} limit={5} />
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <SavingsList />
          <ExpenseDonutChart />
        </div>
      </div>
    </motion.div>
  );
};
