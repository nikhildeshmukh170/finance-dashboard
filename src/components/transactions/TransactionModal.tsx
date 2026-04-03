import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { cn } from '@/utils/cn';
import type { Transaction, TransactionCategory, TransactionType } from '@/types';

interface TransactionFormData {
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  description: string;
  status: Transaction['status'];
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
}

const categories: TransactionCategory[] = [
  'Shopping', 'Food & Dining', 'Transportation', 'Housing',
  'Entertainment', 'Healthcare', 'Education', 'Travel',
  'Salary', 'Freelance', 'Investment', 'Other',
];

export const TransactionModal = ({ isOpen, onClose, editingTransaction }: TransactionModalProps) => {
  const { addTransaction, updateTransaction } = useFinanceStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    defaultValues: {
      type: 'expense',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (editingTransaction) {
      reset({
        ...editingTransaction,
        date: editingTransaction.date.split('T')[0],
      });
    } else {
      reset({
        type: 'expense',
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingTransaction, reset, isOpen]);

  const onSubmit = (data: TransactionFormData) => {
    const payload = {
      ...data,
      amount: Number(data.amount),
      date: new Date(data.date).toISOString(),
    };
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-card border border-border rounded-2xl shadow-card-hover w-full max-w-md pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {editingTransaction ? 'Update the transaction details' : 'Add a new transaction record'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                    Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Transaction title..."
                    className={cn(
                      'w-full px-3 py-2.5 rounded-xl border bg-muted/40 text-sm text-foreground',
                      'placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2',
                      'focus:ring-brand-500 focus:border-transparent transition-all',
                      errors.title ? 'border-red-400' : 'border-border'
                    )}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Amount + Type row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                      Amount *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register('amount', {
                          required: 'Required',
                          min: { value: 0.01, message: 'Must be > 0' },
                        })}
                        placeholder="0.00"
                        className={cn(
                          'w-full pl-7 pr-3 py-2.5 rounded-xl border bg-muted/40 text-sm text-foreground',
                          'placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2',
                          'focus:ring-brand-500 focus:border-transparent transition-all',
                          errors.amount ? 'border-red-400' : 'border-border'
                        )}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                      Type *
                    </label>
                    <select
                      {...register('type', { required: true })}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>
                </div>

                {/* Category + Date row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                      Category *
                    </label>
                    <select
                      {...register('category', { required: true })}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                      Date *
                    </label>
                    <input
                      type="date"
                      {...register('date', { required: true })}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    placeholder="Optional note..."
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-blue text-white text-sm font-semibold hover:opacity-90 transition-all shadow-glow-blue"
                  >
                    <Save className="w-4 h-4" />
                    {editingTransaction ? 'Update' : 'Save'} Transaction
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
