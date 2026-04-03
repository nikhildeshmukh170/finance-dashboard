import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Shield,
  Eye,
  Search,
  Zap,
} from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import type { UserRole } from '@/types';

interface HeaderProps {
  onMenuClick: () => void;
  pageTitle: string;
}

const roleConfig: Record<UserRole, { label: string; icon: typeof Shield; color: string; bg: string }> = {
  admin: {
    label: 'Admin',
    icon: Shield,
    color: 'text-brand-600 dark:text-brand-400',
    bg: 'bg-brand-50 dark:bg-brand-900/30',
  },
  viewer: {
    label: 'Viewer',
    icon: Eye,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
};

export const Header = ({ onMenuClick, pageTitle }: HeaderProps) => {
  const { role, setRole, getFilteredTransactions } = useFinanceStore();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const roleInfo = roleConfig[role];
  const RoleIcon = roleInfo.icon;

  const notifications = [
    { id: 1, title: 'Payment received', desc: '+$1,200 from Freelance Project', time: '2m ago', unread: true },
    { id: 2, title: 'Bill due soon', desc: 'Electricity bill due in 3 days', time: '1h ago', unread: true },
    { id: 3, title: 'Savings goal reached', desc: 'Gaming PC goal is 50% complete!', time: '5h ago', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Search through transactions
  const allTransactions = getFilteredTransactions();
  const searchResults = searchQuery.trim()
    ? allTransactions.filter(txn =>
        (txn.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (txn.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
    : [];

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center h-[72px] px-4 lg:px-6 bg-background/80 backdrop-blur-md border-b border-border">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="font-display font-bold text-lg text-foreground leading-none">
            {pageTitle}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-muted-foreground text-sm"
        >
          <Search className="w-4 h-4" />
          <span className="text-xs">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded text-[10px] bg-background border border-border font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Search Modal */}
        <AnimatePresence>
          {searchOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={() => setSearchOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="fixed top-20 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 z-50 w-auto lg:w-full lg:max-w-2xl"
              >
                <div className="bg-card border border-border rounded-2xl shadow-card-hover overflow-hidden">
                  {/* Search input */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                    <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                    />
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted"
                    >
                      ESC
                    </button>
                  </div>

                  {/* Results */}
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {searchQuery.trim() === '' ? (
                      <div className="p-8 text-center">
                        <Search className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Start typing to search transactions...</p>
                        <p className="text-xs text-muted-foreground/60 mt-2">Search by description or category</p>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">No transactions found for "{searchQuery}"</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {searchResults.slice(0, 8).map((txn) => (
                          <button
                            key={txn.id}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{txn.description}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{txn.category} • {new Date(txn.date).toLocaleDateString()}</p>
                            </div>
                            <p className={cn('text-sm font-semibold tabular-nums flex-shrink-0 ml-4', txn.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                              {txn.amount >= 0 ? '+' : ''}{formatCurrency(txn.amount, 'INR', true)}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Role switcher */}
        <div className="relative">
          <button
            onClick={() => { setRoleOpen((p) => !p); setNotifOpen(false); }}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-medium',
              roleInfo.bg,
              roleInfo.color,
              'border-transparent hover:border-border'
            )}
          >
            <RoleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{roleInfo.label}</span>
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', roleOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {roleOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-card-hover overflow-hidden"
              >
                <div className="p-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 py-2">
                    Switch Role
                  </p>
                  {(['admin', 'viewer'] as UserRole[]).map((r) => {
                    const cfg = roleConfig[r];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={r}
                        onClick={() => { setRole(r); setRoleOpen(false); }}
                        className={cn(
                          'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all',
                          role === r
                            ? `${cfg.bg} ${cfg.color} font-semibold`
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <div className="text-left">
                          <p className="font-medium">{cfg.label}</p>
                          <p className="text-[10px] opacity-70">
                            {r === 'admin' ? 'Full access' : 'Read only'}
                          </p>
                        </div>
                        {role === r && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-current" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark mode toggle */}
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.9 }}
          className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <AnimatePresence mode="wait">
            {resolvedTheme === 'dark' ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((p) => !p); setRoleOpen(false); }}
            className="relative p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[9px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-card-hover overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="font-display font-semibold text-sm text-foreground">Notifications</p>
                  <span className="text-xs text-brand-500 font-medium cursor-pointer hover:text-brand-600">
                    Mark all read
                  </span>
                </div>
                <div className="divide-y divide-border max-h-72 overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div key={n.id} className={cn('flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors', n.unread && 'bg-brand-50/50 dark:bg-brand-900/10')}>
                      <div className="w-8 h-8 rounded-xl bg-gradient-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                      </div>
                      {n.unread && <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-blue flex items-center justify-center text-white font-bold text-sm shadow-glow-blue cursor-pointer ml-1">
          OG
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(roleOpen || notifOpen) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => { setRoleOpen(false); setNotifOpen(false); }}
        />
      )}
    </header>
  );
};
