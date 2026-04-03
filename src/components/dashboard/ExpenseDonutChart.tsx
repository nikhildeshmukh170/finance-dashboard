import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { BarChart2 } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.95}
      />
    </g>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-card-hover">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
        <p className="text-sm font-semibold text-foreground">{d.category}</p>
      </div>
      <p className="text-xs text-muted-foreground">
        {formatCurrency(d.amount)} · {d.percentage}%
      </p>
    </div>
  );
};

export const ExpenseDonutChart = () => {
  const { expenseBreakdown } = useFinanceStore();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const total = expenseBreakdown.reduce((acc, d) => acc + d.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
          <BarChart2 className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <p className="font-display font-semibold text-base text-foreground">All Expenses</p>
          <p className="text-xs text-muted-foreground">Breakdown by category</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseBreakdown}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={2}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] text-muted-foreground font-medium">Total</p>
            <p className="font-display font-bold text-sm text-foreground tabular-nums">
              ${(total / 1000).toFixed(1)}k
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 min-w-0">
          {expenseBreakdown.slice(0, 5).map((item, index) => (
            <div
              key={item.category}
              className={cn(
                'flex items-center gap-2 cursor-pointer transition-opacity',
                activeIndex !== undefined && activeIndex !== index ? 'opacity-40' : 'opacity-100'
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: item.color }}
              />
              <p className="text-xs text-muted-foreground flex-1 truncate">{item.category}</p>
              <p className="text-xs font-semibold text-foreground tabular-nums">
                {item.percentage}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
