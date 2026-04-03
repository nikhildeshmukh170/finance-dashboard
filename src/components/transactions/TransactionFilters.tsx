import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/utils/cn';
import type { TransactionCategory, TransactionType } from '@/types';

const categories: (TransactionCategory | 'all')[] = [
  'all', 'Shopping', 'Food & Dining', 'Transportation', 'Housing',
  'Entertainment', 'Healthcare', 'Education', 'Travel',
  'Salary', 'Freelance', 'Investment', 'Other',
];

export const TransactionFilters = () => {
  const { filters, setFilters, resetFilters } = useFinanceStore();
  const debouncedSearch = useDebounce(filters.search, 300);

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '' ||
    filters.search !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-card border border-border rounded-2xl p-4 shadow-card space-y-3"
    >
      {/* Search + reset row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <motion.input
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            whileFocus={{ scale: 1.01 }}
          />
          {filters.search && (
            <motion.button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.1 }}
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>

        {hasActiveFilters && (
          <motion.button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors whitespace-nowrap"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </motion.button>
        )}
      </motion.div>

      {/* Filter row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Type */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="flex items-center gap-1 bg-muted/60 rounded-xl p-1"
        >
          {(['all', 'income', 'expense', 'transfer'] as (TransactionType | 'all')[]).map((t, idx) => (
            <motion.button
              key={t}
              onClick={() => setFilters({ type: t })}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all',
                filters.type === t
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t === 'all' ? 'All Types' : t}
            </motion.button>
          ))}
        </motion.div>

        {/* Category */}
        <motion.select
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.24, duration: 0.2 }}
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value as TransactionCategory | 'all' })}
          className="px-3 py-2 rounded-xl border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'All Categories' : c}
            </option>
          ))}
        </motion.select>

        {/* Date range */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.26, duration: 0.2 }}
          className="flex items-center gap-2"
        >
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ dateFrom: e.target.value })}
            className="px-3 py-2 rounded-xl border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ dateTo: e.target.value })}
            className="px-3 py-2 rounded-xl border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
          />
        </motion.div>

        {/* Sort */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.28, duration: 0.2 }}
          className="flex items-center gap-2 ml-auto"
        >
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder];
              setFilters({ sortBy, sortOrder });
            }}
            className="px-3 py-2 rounded-xl border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
          >
            <option value="date-desc">Date (newest)</option>
            <option value="date-asc">Date (oldest)</option>
            <option value="amount-desc">Amount (high)</option>
            <option value="amount-asc">Amount (low)</option>
            <option value="title-asc">Name (A-Z)</option>
            <option value="title-desc">Name (Z-A)</option>
          </select>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
