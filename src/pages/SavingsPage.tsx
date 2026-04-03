import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus } from 'lucide-react';
import { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/utils/formatters';

export const SavingsPage = () => {
  const { savingsGoals, addGoal, deleteGoal, updateGoal } = useFinanceStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [updateModalGoalId, setUpdateModalGoalId] = useState<string | null>(null);
  const [updateAmount, setUpdateAmount] = useState('');
  const [updateType, setUpdateType] = useState<'add' | 'set'>('add');

  const handleAddGoal = () => {
    if (goalName.trim() && targetAmount.trim()) {
      const colors = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981'];
      const icons = ['🏠', '✈️', '📚', '🎮', '🚗', '💍', '🏖️', '💻'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      
      addGoal({
        name: goalName,
        target: parseFloat(targetAmount),
        current: 0,
        color: randomColor,
        icon: randomIcon,
      });
      setShowAddModal(false);
      setGoalName('');
      setTargetAmount('');
    }
  };

  const handleUpdateGoal = () => {
    if (updateModalGoalId && updateAmount.trim()) {
      const goal = savingsGoals.find(g => g.id === updateModalGoalId);
      if (goal) {
        const amountNum = parseFloat(updateAmount);
        const newCurrent = updateType === 'add' 
          ? Math.max(0, goal.current + amountNum)
          : Math.max(0, Math.min(amountNum, goal.target));
        
        updateGoal(updateModalGoalId, { current: newCurrent });
        setUpdateModalGoalId(null);
        setUpdateAmount('');
        setUpdateType('add');
      }
    }
  };

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-foreground">Savings Goals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage your financial goals
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </motion.button>
      </div>

      {/* Overall Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-card-hover"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-purple-100 text-sm font-medium mb-1">Overall Savings Progress</p>
            <h3 className="font-display font-bold text-3xl">{overallProgress}%</h3>
          </div>
          <div className="p-4 rounded-xl bg-white/20 backdrop-blur">
            <Target className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
        <p className="text-white/80 text-sm mt-4">
          {formatCurrency(totalSaved, 'INR', true)} saved of {formatCurrency(totalTarget, 'INR', true)} target
        </p>
      </motion.div>

      {/* Savings Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {savingsGoals.map((goal, index) => {
          const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{goal.icon}</span>
                    <div>
                      <p className="font-display font-bold text-lg text-foreground">{goal.name}</p>
                      <p className="text-xs text-muted-foreground">{pct}% complete</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg text-red-500 hover:text-red-600"
                  title="Delete goal"
                >
                  ✕
                </button>
              </div>

              {/* Progress bar */}
              <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.08, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: goal.color }}
                />
              </div>

              {/* Amount info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Saved</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {formatCurrency(goal.current, 'INR', true)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Target</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {formatCurrency(goal.target, 'INR', true)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">Remaining</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                    {formatCurrency(goal.target - goal.current, 'INR', true)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    setUpdateModalGoalId(goal.id);
                    setUpdateType('add');
                    setUpdateAmount('');
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 font-semibold text-xs transition-colors"
                >
                  + Add Savings
                </button>
                <button
                  onClick={() => {
                    setUpdateModalGoalId(goal.id);
                    setUpdateType('set');
                    setUpdateAmount(String(goal.current));
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-semibold text-xs transition-colors"
                >
                  ✎ Update
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {savingsGoals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-12 text-center"
        >
          <Target className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No savings goals yet</p>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first savings goal to get started
          </p>
          <motion.button
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition-colors"
          >
            Add Your First Goal
          </motion.button>
        </motion.div>
      )}

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card border border-border rounded-2xl shadow-card-hover max-w-md w-full p-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-4">Create New Goal</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Goal Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Vacation Fund"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border outline-none text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Target Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-muted border border-border outline-none text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setGoalName('');
                      setTargetAmount('');
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-muted text-foreground font-semibold text-sm hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddGoal}
                    disabled={!goalName.trim() || !targetAmount.trim()}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Goal
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Update Goal Modal */}
      <AnimatePresence>
        {updateModalGoalId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setUpdateModalGoalId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card border border-border rounded-2xl shadow-card-hover max-w-md w-full p-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-4">
                  {updateType === 'add' ? 'Add Savings' : 'Update Savings'}
                </h2>

                <div className="space-y-4 mb-6">
                  {/* Toggle between Add and Set */}
                  <div className="flex gap-2 bg-muted/60 rounded-lg p-1">
                    <button
                      onClick={() => setUpdateType('add')}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        updateType === 'add'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      + Add Amount
                    </button>
                    <button
                      onClick={() => setUpdateType('set')}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        updateType === 'set'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Set Total
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      {updateType === 'add' ? 'Amount to Add' : 'Total Saved Amount'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={updateAmount}
                        onChange={(e) => setUpdateAmount(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-muted border border-border outline-none text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    {updateType === 'add' && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Will add to current savings
                      </p>
                    )}
                    {updateType === 'set' && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Set the exact amount saved so far
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setUpdateModalGoalId(null);
                      setUpdateAmount('');
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-muted text-foreground font-semibold text-sm hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateGoal}
                    disabled={!updateAmount.trim()}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
