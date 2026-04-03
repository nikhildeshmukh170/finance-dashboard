import { cn } from '@/utils/cn';
import { CSSProperties } from 'react';

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export const Skeleton = ({ className, style }: SkeletonProps) => (
  <div className={cn('skeleton rounded-lg', className)} style={style} />
);

export const SummaryCardSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl p-5">
    <Skeleton className="h-4 w-24 mb-4" />
    <Skeleton className="h-8 w-32 mb-3" />
    <Skeleton className="h-4 w-20" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl p-5">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-28" />
    </div>
    <div className="flex items-end gap-3 h-48">
      {[40, 70, 50, 80, 60, 90, 55, 75, 45, 85, 65, 95].map((h, i) => (
        <Skeleton key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

export const TransactionRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-3 w-24" />
    </div>
    <div className="text-right space-y-2">
      <Skeleton className="h-4 w-20 ml-auto" />
      <Skeleton className="h-3 w-14 ml-auto" />
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
    <Skeleton className="h-5 w-28" />
    <Skeleton className="h-6 w-40" />
    <div className="flex gap-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);
