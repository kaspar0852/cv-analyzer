'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface InterviewFlashcardProps {
  question: {
    id: string;
    question: string;
    context: string;
    aiStrategy: string;
    difficulty: 'easy' | 'medium' | 'hard';
    isGapQuestion: boolean;
  };
  index: number;
}

export function InterviewFlashcard({ question, index }: InterviewFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800';
      case 'hard':
        return 'bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex flex-col gap-4">
        {/* Tags and Info */}
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)} Difficulty
          </Badge>
          {question.isGapQuestion && (
            <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-200 dark:text-purple-400 dark:border-purple-800">
              Gap Question
            </Badge>
          )}
        </div>

        {/* Flashcard */}
        <motion.div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative h-96 cursor-pointer perspective"
          whileHover={{ scale: 1.02 }}
        >
          <AnimatePresence mode="wait">
            {!isFlipped ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-8 flex flex-col justify-center items-center"
              >
                <p className="text-center text-foreground text-lg font-semibold leading-relaxed">
                  {question.question}
                </p>
                <p className="text-center text-muted-foreground text-sm mt-6 italic">
                  Click to reveal strategy
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="answer"
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20 rounded-xl p-8 flex flex-col"
              >
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-accent uppercase tracking-wide">Context</h4>
                  <p className="text-sm text-muted-foreground mt-2">{question.context}</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                    AI Strategy
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">{question.aiStrategy}</p>
                </div>

                <p className="text-center text-muted-foreground text-xs mt-6">
                  Click to hide strategy
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Question Counter */}
        <div className="text-center text-sm text-muted-foreground">
          Question {index + 1}
        </div>
      </div>
    </motion.div>
  );
}
