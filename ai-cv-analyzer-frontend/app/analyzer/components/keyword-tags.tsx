'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface KeywordTagsProps {
  keywords: string[];
  delay: number;
}

export function KeywordTags({ keywords, delay }: KeywordTagsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <h3 className="font-semibold text-foreground mb-4">Recommended Keywords to Add</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <motion.div
            key={keyword}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: delay + index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <Badge variant="secondary" className="cursor-default hover:shadow-md transition-shadow">
              {keyword}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
