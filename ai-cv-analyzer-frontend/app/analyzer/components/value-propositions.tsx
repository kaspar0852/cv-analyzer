'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ValuePropositionsProps {
  propositions: string[];
  delay?: number;
}

export function ValuePropositions({ propositions, delay = 0 }: ValuePropositionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Value Propositions</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Use these points when negotiating
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {propositions.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + index * 0.1 }}
              className="flex gap-3 items-start"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ delay: delay + (index * 0.1) + 0.3, duration: 2, repeat: Infinity }}
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              </motion.div>
              <p className="text-sm text-foreground leading-relaxed">{prop}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
