import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, Star } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatters';

const initialContacts = [
  { id: '1', name: 'Alex M.', initials: 'AM', color: '#3b82f6', transferCount: 5 },
  { id: '2', name: 'Sara J.', initials: 'SJ', color: '#8b5cf6', transferCount: 2 },
  { id: '3', name: 'Chris T.', initials: 'CT', color: '#10b981', transferCount: 8 },
  { id: '4', name: 'Dana K.', initials: 'DK', color: '#f59e0b', transferCount: 1 },
  { id: '5', name: 'Mike R.', initials: 'MR', color: '#ec4899', transferCount: 3 },
];

export const QuickTransfer = () => {
  const { role, addTransaction } = useFinanceStore();
  const [selectedContact, setSelectedContact] = useState(initialContacts[0].id);
  const [amount, setAmount] = useState('');
  const [sent, setSent] = useState(false);
  const [recentTransfers, setRecentTransfers] = useState<
    { id: string; contactName: string; amount: number; time: string }[]
  >([]);

  const isReadOnly = role === 'viewer';
  const selectedContactObj = initialContacts.find((c) => c.id === selectedContact);
  const isFavorite = selectedContactObj && selectedContactObj.transferCount >= 5;

  const handleSend = () => {
    if (!amount || isReadOnly || !selectedContactObj) return;
    
    const amountNum = parseFloat(amount);
    
    // Add transaction to store
    addTransaction({
      title: `Quick Transfer to ${selectedContactObj.name}`,
      amount: amountNum,
      type: 'transfer',
      category: 'Other',
      date: new Date().toISOString(),
      description: `Quick transfer sent to ${selectedContactObj.name}`,
      status: 'completed',
    });

    // Add to recent transfers
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setRecentTransfers((prev) => [
      { id: Date.now().toString(), contactName: selectedContactObj.name, amount: amountNum, time: timeStr },
      ...prev.slice(0, 2),
    ]);

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setAmount('');
    }, 2000);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display font-semibold text-base text-foreground">Quick Transfer</p>
        {isReadOnly && (
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
            Viewer Mode
          </span>
        )}
      </div>

      {/* Selected Contact Summary */}
      {selectedContactObj && (
        <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-3 mb-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: selectedContactObj.color }}
          >
            {selectedContactObj.initials}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{selectedContactObj.name}</p>
            <p className="text-xs text-muted-foreground">
              {selectedContactObj.transferCount > 0 && `${selectedContactObj.transferCount} previous transfers`}
            </p>
          </div>
          {isFavorite && (
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-yellow-600 dark:text-yellow-400 fill-current" />
              <span className="text-xs text-yellow-700 dark:text-yellow-300 font-semibold">Favorite</span>
            </div>
          )}
        </div>
      )}

      {/* Contact selector */}
      <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-1">
        {initialContacts.map((c) => (
          <button
            key={c.id}
            onClick={() => !isReadOnly && setSelectedContact(c.id)}
            disabled={isReadOnly}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div
              className={cn(
                'w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all',
                selectedContact === c.id && !isReadOnly
                  ? 'ring-2 ring-offset-2 ring-brand-500 scale-110'
                  : 'opacity-70 hover:opacity-100'
              )}
              style={{ background: c.color }}
            >
              {c.initials}
            </div>
            <p className="text-[10px] text-muted-foreground whitespace-nowrap">{c.name.split(' ')[0]}</p>
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div className="mb-3">
        <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
            ₹
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            disabled={isReadOnly}
            className={cn(
              'w-full pl-7 pr-4 py-2.5 rounded-xl border border-border bg-muted/40',
              'text-sm font-semibold text-foreground placeholder:text-muted-foreground/50',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all',
              isReadOnly && 'opacity-50 cursor-not-allowed'
            )}
          />
        </div>
      </div>

      {/* Fee info */}
      {amount && (
        <div className="flex items-center justify-between mb-3 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-xs">
          <span className="text-green-700 dark:text-green-300 font-semibold">No transfer fee</span>
          <span className="text-green-600 dark:text-green-400 font-semibold">Instant transfer</span>
        </div>
      )}

      {/* Send button */}
      <motion.button
        onClick={handleSend}
        disabled={isReadOnly || !amount}
        whileTap={!isReadOnly && amount ? { scale: 0.97 } : {}}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
          sent
            ? 'bg-emerald-500 text-white'
            : !isReadOnly && amount
            ? 'bg-gradient-blue text-white hover:opacity-90 shadow-glow-blue'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        {sent ? (
          <>
            <Check className="w-4 h-4" />
            ✓ Sent!
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Money
          </>
        )}
      </motion.button>

      {/* Recent Transfers */}
      {recentTransfers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground font-semibold mb-3">Recent Transfers</p>
          <div className="space-y-2">
            {recentTransfers.map((transfer) => (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="text-xs font-semibold text-foreground">{transfer.contactName}</p>
                  <p className="text-[10px] text-muted-foreground">{transfer.time}</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  -{formatCurrency(transfer.amount, 'INR', true)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
