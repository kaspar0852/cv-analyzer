'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalaryData } from '@/lib/types';
import { DollarSign } from 'lucide-react';

interface SalaryDisplayProps {
  salaryData: SalaryData;
  delay?: number;
}

export function SalaryDisplay({ salaryData, delay = 0 }: SalaryDisplayProps) {
  const salaryRangePercent = ((salaryData.median - salaryData.min) / (salaryData.max - salaryData.min)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            {salaryData.position} - {salaryData.location}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Range Visualization */}
          <div className="space-y-2">
            <div className="relative h-12 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-lg overflow-hidden">
              {/* Current Offer Indicator */}
              <motion.div
                className="absolute top-0 bottom-0 w-1 bg-primary shadow-lg"
                style={{
                  left: `${salaryRangePercent}%`,
                }}
                animate={{ boxShadow: ['0 0 0 0 rgba(var(--primary), 0.7)', '0 0 0 10px rgba(var(--primary), 0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Labels */}
              <div className="absolute inset-0 flex items-end justify-between px-4 pb-2 text-xs font-semibold text-white drop-shadow">
                <span>${salaryData.min.toLocaleString()}</span>
                <span>${salaryData.max.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Three Column Display */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Minimum', value: salaryData.min, color: 'text-green-600 dark:text-green-400' },
              { label: 'Target Offer', value: salaryData.median, color: 'text-primary font-bold' },
              { label: 'Maximum', value: salaryData.max, color: 'text-red-600 dark:text-red-400' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + (index * 0.1) }}
                className="text-center"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p className={`text-lg font-semibold ${item.color}`}>
                  ${item.value.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Info */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Currency: {salaryData.currency}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
