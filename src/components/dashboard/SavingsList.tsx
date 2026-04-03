import { motion } from 'framer-motion';
import { Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/utils/formatters';

export const SavingsList = () => {
  const navigate = useNavigate();
  const { savingsGoals } = useFinanceStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <p className="font-display font-semibold text-base text-foreground">My Savings</p>
            <p className="text-xs text-muted-foreground">{savingsGoals.length} active goals</p>
          </div>
        </div>
        <motion.button
          onClick={() => navigate('/savings')}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        >
          See all
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {savingsGoals.map((goal, index) => {
          const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.07 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{goal.icon}</span>
                  <p className="text-sm font-medium text-foreground">{goal.name}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-sm font-semibold text-foreground tabular-nums">
                    {formatCurrency(goal.current, 'INR', true)}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    / {formatCurrency(goal.target, 'INR', true)}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.07, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: goal.color }}
                />
              </div>

              <div className="flex justify-between mt-1">
                <p className="text-[10px] text-muted-foreground">{pct}% reached</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatCurrency(goal.target - goal.current, 'INR', true)} left
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
