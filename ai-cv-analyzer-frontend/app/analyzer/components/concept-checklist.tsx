'use client';

import { motion } from 'framer-motion';
import { Concept } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface ConceptChecklistProps {
  concepts: Concept[];
  onConceptToggle: (conceptId: string) => void;
}

export function ConceptChecklist({ concepts, onConceptToggle }: ConceptChecklistProps) {
  const [expandedId, setExpandedId] = useState<string | null>(concepts[0]?.id || null);

  return (
    <div className="space-y-3">
      {concepts.map((concept, index) => (
        <motion.div
          key={concept.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="border rounded-lg overflow-hidden"
        >
          {/* Header */}
          <motion.button
            onClick={() => setExpandedId(expandedId === concept.id ? null : concept.id)}
            className="w-full p-4 flex items-center gap-3 hover:bg-accent/5 transition-colors text-left"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                onConceptToggle(concept.id);
              }}
            >
              <Checkbox
                checked={concept.learned}
                className="cursor-pointer"
              />
            </motion.div>

            <div className="flex-1">
              <h4 className={`font-semibold transition-all ${
                concept.learned
                  ? 'text-muted-foreground line-through'
                  : 'text-foreground'
              }`}>
                {concept.name}
              </h4>
            </div>

            <motion.div
              animate={{ rotate: expandedId === concept.id ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </motion.button>

          {/* Expanded Content */}
          {expandedId === concept.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t px-4 py-4 bg-muted/30"
            >
              <p className="text-sm text-muted-foreground mb-4">{concept.description}</p>

              {/* Resources */}
              {concept.resources.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Resources</p>
                  <div className="space-y-2">
                    {concept.resources.map((resource) => (
                      <motion.a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-2 p-2 rounded hover:bg-accent/10 transition-colors text-sm text-primary hover:text-primary/80"
                      >
                        <span className="flex-1">{resource.title}</span>
                        <div className="text-xs px-2 py-1 bg-primary/10 rounded">
                          {resource.type}
                        </div>
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
