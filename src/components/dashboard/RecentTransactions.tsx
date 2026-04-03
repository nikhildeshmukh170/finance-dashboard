import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, formatRelativeDate, categoryEmojis, categoryColors } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import { TransactionRowSkeleton } from '@/components/ui/Skeletons';

interface RecentTransactionsProps {
  isLoading?: boolean;
  limit?: number;
}

const statusStyles = {
  completed: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20',
  pending: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20',
  failed: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
};

export const RecentTransactions = ({ isLoading, limit = 5 }: RecentTransactionsProps) => {
  const { transactions } = useFinanceStore();
  const recent = transactions.slice(0, limit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="bg-card border border-border rounded-2xl shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="font-display font-semibold text-base text-foreground">Recent Transactions</p>
          <p className="text-xs text-muted-foreground mt-0.5">{transactions.length} total transactions</p>
        </div>
        <Link
          to="/transactions"
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        {isLoading
          ? Array.from({ length: limit }).map((_, i) => <TransactionRowSkeleton key={i} />)
          : recent.length === 0
          ? (
            <div className="py-12 text-center">
              <p className="text-4xl mb-3">💸</p>
              <p className="font-semibold text-foreground text-sm">No transactions yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add your first transaction to get started</p>
            </div>
          )
          : recent.map((txn, index) => (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors"
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: `${categoryColors[txn.category]}15` }}
              >
                <span>{categoryEmojis[txn.category] ?? '💰'}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{txn.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{txn.category}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground">{formatRelativeDate(txn.date)}</span>
                </div>
              </div>

              {/* Amount + status */}
              <div className="text-right flex-shrink-0">
                <p
                  className={cn(
                    'text-sm font-bold tabular-nums',
                    txn.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                  )}
                >
                  {txn.type === 'income' ? '+' : '-'}
                  {formatCurrency(txn.amount)}
                </p>
                <span
                  className={cn(
                    'inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize',
                    statusStyles[txn.status]
                  )}
                >
                  {txn.status}
                </span>
              </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
};
