import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, formatDate, categoryEmojis, categoryColors } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import type { Transaction } from '@/types';

interface TransactionTableProps {
  onEdit: (txn: Transaction) => void;
}

const statusConfig = {
  completed: { label: 'Completed', class: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20' },
  pending: { label: 'Pending', class: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20' },
  failed: { label: 'Failed', class: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20' },
};

const ConfirmDeleteModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
          <div className="bg-card border border-border rounded-2xl shadow-card-hover p-6 w-full max-w-sm pointer-events-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground">Delete Transaction</p>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Are you sure you want to delete <strong className="text-foreground">{title}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export const TransactionTable = ({ onEdit }: TransactionTableProps) => {
  const { getFilteredTransactions, deleteTransaction, role } = useFinanceStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const transactions = getFilteredTransactions();
  const isAdmin = role === 'admin';

  const handleDelete = (txn: Transaction) => {
    setDeleteTarget(txn);
    setOpenMenu(null);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteTransaction(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {/* Summary bar */}
        <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{transactions.length}</span> transactions
          </p>
          {!isAdmin && (
            <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg font-medium">
              👁 Viewer mode — read only
            </span>
          )}
        </div>

        {/* Table */}
        {transactions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-display font-bold text-foreground text-lg">No results found</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              Try adjusting your search filters or clearing them to see all transactions.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Transaction', 'Category', 'Date', 'Amount', 'Status', isAdmin ? 'Actions' : ''].map((h) => h && (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <AnimatePresence>
                    {transactions.map((txn, index) => (
                      <motion.tr
                        key={txn.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        {/* Transaction info */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                              style={{ background: `${categoryColors[txn.category]}18` }}
                            >
                              {categoryEmojis[txn.category] ?? '💰'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground truncate max-w-[180px]">
                                {txn.title}
                              </p>
                              {txn.description && (
                                <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                  {txn.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-3.5">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                            style={{
                              background: `${categoryColors[txn.category]}18`,
                              color: categoryColors[txn.category],
                            }}
                          >
                            {txn.category}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-3.5">
                          <p className="text-sm text-muted-foreground">{formatDate(txn.date)}</p>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-3.5">
                          <p
                            className={cn(
                              'text-sm font-bold tabular-nums',
                              txn.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                            )}
                          >
                            {txn.type === 'income' ? '+' : '-'}
                            {formatCurrency(txn.amount)}
                          </p>
                          <p className="text-[10px] text-muted-foreground capitalize">{txn.type}</p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
                              statusConfig[txn.status].class
                            )}
                          >
                            {statusConfig[txn.status].label}
                          </span>
                        </td>

                        {/* Actions (admin only) */}
                        {isAdmin && (
                          <td className="px-5 py-3.5">
                            <div className="relative">
                              <button
                                onClick={() => setOpenMenu(openMenu === txn.id ? null : txn.id)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              <AnimatePresence>
                                {openMenu === txn.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 mt-1 w-36 bg-card border border-border rounded-xl shadow-card-hover overflow-hidden z-10"
                                  >
                                    <button
                                      onClick={() => { onEdit(txn); setOpenMenu(null); }}
                                      className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                                    >
                                      <Pencil className="w-3.5 h-3.5 text-brand-500" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDelete(txn)}
                                      className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Delete
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              <AnimatePresence>
                {transactions.map((txn, index) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.04, type: 'spring', stiffness: 200, damping: 20 }}
                    className="flex items-start gap-3 px-4 py-3.5"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: `${categoryColors[txn.category]}18` }}
                    >
                      {categoryEmojis[txn.category] ?? '💰'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{txn.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{txn.category}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{formatDate(txn.date)}</span>
                      </div>
                      <span className={cn('mt-1 inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold', statusConfig[txn.status].class)}>
                        {txn.status}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={cn('text-sm font-bold tabular-nums', txn.type === 'income' ? 'text-emerald-500' : 'text-red-500')}>
                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </p>
                      {isAdmin && (
                        <div className="flex gap-2 mt-2 justify-end">
                          <button onClick={() => onEdit(txn)} className="text-brand-500 hover:text-brand-600 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(txn)} className="text-red-500 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Click outside menu */}
      {openMenu && (
        <div className="fixed inset-0 z-[5]" onClick={() => setOpenMenu(null)} />
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.title ?? ''}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};
