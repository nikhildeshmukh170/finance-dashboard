import { motion } from 'framer-motion';
import { Sun, Moon, Shield, Eye, Trash2, Download } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useTheme } from '@/hooks/useTheme';
import { exportTransactionsToCSV } from '@/utils/csvExport';
import { cn } from '@/utils/cn';

export const SettingsPage = () => {
  const { role, setRole, transactions } = useFinanceStore();
  const { resolvedTheme, setTheme } = useTheme();

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This will reset to mock data on next reload.')) {
      localStorage.removeItem('finio-finance-store');
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl space-y-5"
    >
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your preferences and account</p>
      </div>

      {/* Appearance */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-4">
        <p className="font-display font-semibold text-base text-foreground">Appearance</p>
        <div className="grid grid-cols-3 gap-3">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                (t === 'system' ? resolvedTheme : t) === resolvedTheme && t !== 'system'
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-border hover:border-brand-300'
              )}
            >
              {t === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> :
               t === 'dark' ? <Moon className="w-5 h-5 text-blue-500" /> :
               <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" style={{background:'linear-gradient(135deg, #fff 50%, #1e293b 50%)'}} />}
              <span className="text-xs font-semibold text-foreground capitalize">{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Role */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-4">
        <div>
          <p className="font-display font-semibold text-base text-foreground">User Role</p>
          <p className="text-xs text-muted-foreground mt-0.5">Controls what actions you can perform</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'admin', label: 'Admin', desc: 'Full read & write access', Icon: Shield, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
            { value: 'viewer', label: 'Viewer', desc: 'Read-only access', Icon: Eye, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          ] as const).map(({ value, label, desc, Icon, color, bg }) => (
            <button
              key={value}
              onClick={() => setRole(value)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left',
                role === value ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10' : 'border-border hover:border-brand-300'
              )}
            >
              <div className={cn('p-2 rounded-lg mt-0.5', bg)}>
                <Icon className={cn('w-4 h-4', color)} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              {role === value && (
                <div className="ml-auto w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center text-white text-[10px] mt-0.5">✓</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-4">
        <p className="font-display font-semibold text-base text-foreground">Data Management</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => exportTransactionsToCSV(transactions)}
            className="flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-xl border border-border bg-muted/40 text-sm font-semibold text-foreground hover:bg-muted transition-all"
          >
            <Download className="w-4 h-4" />
            Export All Data
          </button>
          <button
            onClick={handleClearData}
            className="flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-sm font-semibold text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Reset All Data
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Data is stored locally in your browser. Exporting creates a CSV file. Resetting clears localStorage and reloads with default data.
        </p>
      </div>

      {/* About */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
        <p className="font-display font-semibold text-base text-foreground mb-3">About Finio</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Version <span className="text-foreground font-medium">1.0.0</span></p>
          <p>Built with React + TypeScript + Tailwind + Zustand + Recharts</p>
          <p className="text-xs">© 2024 Finio Finance Dashboard</p>
        </div>
      </div>
    </motion.div>
  );
};
