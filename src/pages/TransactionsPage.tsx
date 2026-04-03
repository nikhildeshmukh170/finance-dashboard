import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { exportTransactionsToCSV } from '@/utils/csvExport';
import type { Transaction } from '@/types';

export const TransactionsPage = () => {
  const { role, getFilteredTransactions } = useFinanceStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);

  const isAdmin = role === 'admin';

  const handleEdit = (txn: Transaction) => {
    setEditingTxn(txn);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTxn(null);
    setModalOpen(true);
  };

  const handleExport = () => {
    exportTransactionsToCSV(getFilteredTransactions());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <div className="flex-1">
          <h2 className="font-display font-bold text-xl text-foreground">All Transactions</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Search, filter, and manage your transaction history
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
          {isAdmin && (
            <motion.button
              onClick={handleAdd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-blue text-white text-sm font-semibold hover:opacity-90 transition-all shadow-glow-blue"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <TransactionFilters />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <TransactionTable onEdit={handleEdit} />
      </motion.div>

      {/* Modal (admin only) */}
      {isAdmin && (
        <TransactionModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingTxn(null); }}
          editingTransaction={editingTxn}
        />
      )}
    </motion.div>
  );
};
