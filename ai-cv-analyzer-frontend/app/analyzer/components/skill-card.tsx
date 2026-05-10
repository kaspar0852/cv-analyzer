'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LearningPath } from '@/lib/types';
import { Zap, Target } from 'lucide-react';

interface SkillCardProps {
  path: LearningPath;
  isSelected?: boolean;
  onClick?: () => void;
  delay?: number;
}

export function SkillCard({ path, isSelected, onClick, delay = 0 }: SkillCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const progressPercent = (path.progress || 0) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      <Card className={`h-full ${isSelected ? 'border-primary' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{path.skill}</CardTitle>
              <Badge className={getDifficultyColor(path.difficulty)}>
                {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
              </Badge>
            </div>
            <motion.div
              animate={{ rotate: isSelected ? 360 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <Target className="w-5 h-5 text-primary" />
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Time Estimate */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>{path.estimatedDays} days to complete</span>
          </div>

          {/* Concepts Count */}
          <div className="text-sm">
            <span className="text-foreground font-semibold">{path.concepts.length}</span>
            <span className="text-muted-foreground"> concepts to learn</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-semibold">{Math.round(progressPercent)}%</span>
            </div>
            <motion.div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </motion.div>
          </div>

          {/* Status */}
          {progressPercent > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-primary font-semibold"
            >
              {path.concepts.filter((c) => c.learned).length} of {path.concepts.length} concepts completed
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
