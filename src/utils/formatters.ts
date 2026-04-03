import { format, formatDistanceToNow, parseISO } from 'date-fns';

// ─── Currency ─────────────────────────────────────────────────────────────────

export const formatCurrency = (
  amount: number,
  currency = 'INR',
  compact = false
): string => {
  if (compact && Math.abs(amount) >= 1000) {
    const val = amount / 1000;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(val) + 'K';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatAmount = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

// ─── Dates ────────────────────────────────────────────────────────────────────

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
};

export const formatDateShort = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d');
  } catch {
    return dateString;
  }
};

export const formatRelativeDate = (dateString: string): string => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

// ─── Numbers ──────────────────────────────────────────────────────────────────

export const formatPercentage = (value: number, decimals = 2): string =>
  `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;

export const formatCompact = (value: number): string => {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
};

// ─── Strings ──────────────────────────────────────────────────────────────────

export const maskCardNumber = (number: string): string => {
  const parts = number.split(' ');
  return parts
    .map((p, i) => (i === parts.length - 1 ? p : '••••'))
    .join(' ');
};

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

// ─── Category Helpers ─────────────────────────────────────────────────────────

export const categoryColors: Record<string, string> = {
  Shopping: '#3b82f6',
  'Food & Dining': '#f59e0b',
  Transportation: '#10b981',
  Housing: '#8b5cf6',
  Entertainment: '#ec4899',
  Healthcare: '#ef4444',
  Education: '#06b6d4',
  Travel: '#f97316',
  Salary: '#22c55e',
  Freelance: '#84cc16',
  Investment: '#a855f7',
  Other: '#94a3b8',
};

export const categoryEmojis: Record<string, string> = {
  Shopping: '🛍️',
  'Food & Dining': '🍽️',
  Transportation: '🚗',
  Housing: '🏠',
  Entertainment: '🎬',
  Healthcare: '❤️',
  Education: '📚',
  Travel: '✈️',
  Salary: '💼',
  Freelance: '💻',
  Investment: '📈',
  Other: '📦',
};
