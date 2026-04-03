import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({
  icon = '📭',
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className={cn('flex flex-col items-center justify-center py-16 text-center px-4', className)}
  >
    <div className="text-5xl mb-4 animate-float">{icon}</div>
    <p className="font-display font-bold text-lg text-foreground mb-2">{title}</p>
    {description && (
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-5">
        {description}
      </p>
    )}
    {action && (
      <button
        onClick={action.onClick}
        className="px-5 py-2.5 rounded-xl bg-gradient-blue text-white text-sm font-semibold hover:opacity-90 transition-all shadow-glow-blue"
      >
        {action.label}
      </button>
    )}
  </motion.div>
);
