"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cvApiClient } from '@/lib/api-client';
import { FileText, Calendar, ChevronRight, TrendingUp, Search, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export function HistorySection() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await cvApiClient.getRecentAnalysis();
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="mt-24 space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) return null;

  return (
    <div className="mt-24 border-t border-border pt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Your Analysis History
          </h2>
          <p className="text-muted-foreground">Revisit your past CV optimizations and tracking scores.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search history..." 
            className="bg-muted/50 border border-border rounded-full pl-10 pr-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="cursor-pointer group"
            onClick={() => window.location.href = `/analyzer?id=${item.uploadId}`}
          >
            <Card className="h-full border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant={item.overallScore > 70 ? "default" : "secondary"}>
                    {item.overallScore}% Match
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                  {item.candidateName || "Untitled CV"}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-medium">{item.industry}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.overallScore}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <div className="flex items-center justify-end pt-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
