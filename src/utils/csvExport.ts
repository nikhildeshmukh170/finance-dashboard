import type { Transaction } from '@/types';
import { formatDate, formatCurrency } from './formatters';

// ─── CSV Export ───────────────────────────────────────────────────────────────

const escapeCSV = (value: string | number): string => {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const exportTransactionsToCSV = (transactions: Transaction[]): void => {
  const headers = ['ID', 'Title', 'Amount', 'Type', 'Category', 'Date', 'Status', 'Description'];

  const rows = transactions.map((t) => [
    t.id,
    t.title,
    formatCurrency(t.amount),
    t.type,
    t.category,
    formatDate(t.date),
    t.status,
    t.description ?? '',
  ]);

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `finio-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportSummaryToCSV = (
  data: { label: string; value: string | number }[]
): void => {
  const csvContent = [
    'Label,Value',
    ...data.map((d) => `${escapeCSV(d.label)},${escapeCSV(d.value)}`),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `finio-summary-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
