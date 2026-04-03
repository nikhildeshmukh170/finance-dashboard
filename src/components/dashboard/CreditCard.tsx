import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, maskCardNumber } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import type { Card } from '@/types';

export const CreditCardSection = () => {
  const { cards, activeCardId, setActiveCard } = useFinanceStore();
  const [flipped, setFlipped] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const activeIndex = cards.findIndex((c) => c.id === activeCardId);
  const activeCard = cards[activeIndex] ?? cards[0];

  const prev = () => {
    const idx = (activeIndex - 1 + cards.length) % cards.length;
    setActiveCard(cards[idx].id);
  };

  const next = () => {
    const idx = (activeIndex + 1) % cards.length;
    setActiveCard(cards[idx].id);
  };

  const handleAddCard = () => {
    if (cardName.trim() && cardNumber.trim()) {
      const { addCard } = useFinanceStore.getState();
      const newCard: Omit<Card, 'id'> = {
        name: cardName,
        number: cardNumber.replace(/\s/g, '').padEnd(19, ' '),
        expiry: '12/26',
        balance: 0,
        currency: 'INR',
        type: 'visa',
        isDefault: false,
        gradient: 'linear-gradient(135deg, #1a56db 0%, #0ea5e9 100%)',
      };
      addCard(newCard);
      setShowAddCardModal(false);
      setCardName('');
      setCardNumber('');
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display font-semibold text-base text-foreground">My Cards</p>
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground font-mono">
            {activeIndex + 1}/{cards.length}
          </span>
          <button
            onClick={next}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card visual */}
      <div className="relative h-[180px] mb-4" style={{ perspective: 1000 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard.id}
            initial={{ opacity: 0, x: 40, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: flipped ? 180 : 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
            onClick={() => setFlipped((p) => !p)}
            className="absolute inset-0 cursor-pointer select-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-2xl p-5 overflow-hidden"
              style={{ background: activeCard.gradient, backfaceVisibility: 'hidden' }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5" />

              {/* Top row */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/60 text-xs font-medium">Finio</p>
                  <p className="text-white font-display font-bold text-sm">{activeCard.name}</p>
                </div>
                <Wifi className="w-5 h-5 text-white/80 rotate-90" />
              </div>

              {/* Card number */}
              <p className="font-mono text-white text-base tracking-widest mb-4">
                {maskCardNumber(activeCard.number)}
              </p>

              {/* Bottom row */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/50 text-[10px] uppercase tracking-wider">Card Holder</p>
                  <p className="text-white text-sm font-semibold">Omi Gusty</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[10px] uppercase tracking-wider">Expires</p>
                  <p className="text-white text-sm font-semibold">{activeCard.expiry}</p>
                </div>
                {/* Card type logo */}
                <div className="flex items-center gap-0.5">
                  {activeCard.type === 'mastercard' ? (
                    <>
                      <div className="w-7 h-7 rounded-full bg-red-500 opacity-90" />
                      <div className="w-7 h-7 rounded-full bg-amber-400 opacity-90 -ml-3" />
                    </>
                  ) : (
                    <div className="text-white font-bold italic text-lg">VISA</div>
                  )}
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-center"
              style={{
                background: activeCard.gradient,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="h-10 bg-black/40 rounded mb-4" />
              <div className="flex items-center gap-3">
                <div className="h-8 flex-1 bg-white/20 rounded" />
                <div className="bg-white/10 border border-white/30 rounded px-3 py-1">
                  <p className="text-white text-xs font-mono">***</p>
                </div>
              </div>
              <p className="text-white/50 text-[10px] text-center mt-4">CVV</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Balance info */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">Your Balance</p>
          <p className="font-display font-bold text-foreground tabular-nums">
            {formatCurrency(activeCard.balance, activeCard.currency)}
          </p>
        </div>
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">Currency</p>
          <p className="font-semibold text-sm text-foreground">{activeCard.currency} {activeCard.currency === 'INR' ? '/ Indian Rupee' : '/ US Dollar'}</p>
        </div>
      </div>

      {/* Card dots indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCard(c.id)}
            className={cn(
              'transition-all duration-200 rounded-full',
              c.id === activeCardId
                ? 'w-6 h-2 bg-brand-500'
                : 'w-2 h-2 bg-border hover:bg-muted-foreground/30'
            )}
          />
        ))}
      </div>

      {/* Add card button */}
      <button
        onClick={() => setShowAddCardModal(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-brand-300 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-all text-sm font-medium text-muted-foreground hover:text-brand-500"
      >
        <Plus className="w-4 h-4" />
        Add Card
      </button>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddCardModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowAddCardModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card border border-border rounded-2xl shadow-card-hover max-w-md w-full p-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-4">Add New Card</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Card Name</label>
                    <input
                      type="text"
                      placeholder="e.g., My Debit Card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border outline-none text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
                      className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border outline-none text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAddCardModal(false);
                      setCardName('');
                      setCardNumber('');
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-muted text-foreground font-semibold text-sm hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleAddCard}
                    disabled={!cardName.trim() || !cardNumber.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Card
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
