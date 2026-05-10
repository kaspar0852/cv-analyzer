'use client';

import { motion } from 'framer-motion';
import { NegotiationMessage } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: NegotiationMessage;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isAI = message.role === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg ${
          isAI
            ? 'bg-muted text-muted-foreground'
            : 'bg-primary text-primary-foreground'
        } rounded-lg px-4 py-3 shadow-sm`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p className={`text-xs mt-1 ${isAI ? 'text-muted-foreground/60' : 'text-primary-foreground/60'}`}>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </p>
      </div>
    </motion.div>
  );
}
