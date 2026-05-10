'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  Banknote, Globe, TrendingUp, Zap, 
  AlertCircle, Briefcase, Landmark, Info,
  DollarSign, ArrowUpRight, BarChart3, ShieldCheck, Star,
  Rocket, Target, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EarningPotentialSectionProps {
  salary: any;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const shellCard =
  'relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(248,250,252,0.82))] dark:bg-[linear-gradient(145deg,rgba(24,24,27,0.92),rgba(39,39,42,0.78))] backdrop-blur-xl shadow-[0_18px_50px_-24px_rgba(15,23,42,0.45)]';

const hoverCard =
  'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(59,130,246,0.22)]';

// Helper component for the salary spectrum graph
const SalarySpectrum = ({ min, median, max, currency, label }: { min: number, median: number, max: number, currency: string, label: string }) => {
  const range = max - min;
  const medianPos = range > 0 ? ((median - min) / range) * 100 : 50;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black text-primary">{currency} {median.toLocaleString()}</span>
      </div>
      <div className="relative h-12 flex items-center">
        {/* Background Track */}
        <div className="absolute w-full h-2 bg-muted rounded-full" />
        
        {/* Gradient Range */}
        <div 
          className="absolute h-2 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full"
          style={{ width: '100%', left: '0%' }}
        />

        {/* Median Marker (The Graph Peak) */}
        <motion.div 
          initial={{ left: 0 }}
          animate={{ left: `${medianPos}%` }}
          transition={{ duration: 1.5, type: "spring" }}
          className="absolute top-0 -ml-3 flex flex-col items-center"
        >
          <div className="w-6 h-6 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-background" />
          </div>
          <div className="w-0.5 h-4 bg-primary/40 mt-1" />
        </motion.div>

        {/* Range Labels */}
        <div className="absolute top-8 left-0 text-[9px] font-bold text-muted-foreground">{min.toLocaleString()}</div>
        <div className="absolute top-8 right-0 text-[9px] font-bold text-muted-foreground">{max.toLocaleString()}</div>
      </div>
    </div>
  );
};

const ComparisonBars = ({
  localRange,
  remoteRange,
}: {
  localRange: { min: number; median: number; max: number };
  remoteRange: { min: number; median: number; max: number };
}) => {
  const categories = [
    { label: 'Minimum', local: localRange.min, remote: remoteRange.min },
    { label: 'Median', local: localRange.median, remote: remoteRange.median },
    { label: 'Maximum', local: localRange.max, remote: remoteRange.max },
  ];

  const maxValue = Math.max(...categories.flatMap((item) => [item.local, item.remote]), 1);

  return (
    <div className="space-y-5">
      {categories.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{item.label}</span>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="text-emerald-600">Local {item.local.toLocaleString()}</span>
              <span className="text-blue-600">Remote {item.remote.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 rounded-full bg-emerald-500/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                initial={{ width: 0 }}
                animate={{ width: `${(item.local / maxValue) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="h-3 rounded-full bg-blue-500/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${(item.remote / maxValue) * 100}%` }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const PremiumBars = ({ premiums }: { premiums: any[] }) => {
  const maxPremium = Math.max(...premiums.map((item) => item.premiumPercentage || 0), 1);

  return (
    <div className="space-y-4">
      {premiums.map((skill: any, i: number) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-white/50 p-4 dark:bg-white/5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="font-black text-sm">{skill.skill}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold">{skill.demand} demand</p>
            </div>
            <span className="text-lg font-black text-primary">+{skill.premiumPercentage}%</span>
          </div>
          <div className="h-3 rounded-full bg-primary/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${((skill.premiumPercentage || 0) / maxPremium) * 100}%` }}
              transition={{ duration: 1.1, ease: 'easeOut', delay: i * 0.08 }}
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{skill.reasoning}</p>
        </div>
      ))}
    </div>
  );
};

const NegotiationRange = ({
  marketMedian,
  askLabel,
  title,
  color,
}: {
  marketMedian: string;
  askLabel: string;
  title: string;
  color: 'emerald' | 'blue';
}) => {
  const track = color === 'emerald'
    ? 'from-emerald-400 via-emerald-500 to-emerald-600'
    : 'from-sky-400 via-blue-500 to-blue-600';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/50 p-5 dark:bg-white/5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-black">{title}</p>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold">Ask Range</span>
      </div>
      <div className="relative mb-3 h-3 rounded-full bg-muted overflow-hidden">
        <div className={cn('absolute inset-y-0 left-0 w-[55%] rounded-full opacity-35 bg-gradient-to-r', track)} />
        <div className={cn('absolute inset-y-0 left-[28%] w-[42%] rounded-full bg-gradient-to-r', track)} />
        <div className="absolute left-[66%] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-4 border-background bg-white shadow-lg" />
      </div>
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-muted-foreground">Median: {marketMedian}</span>
        <span className={cn(color === 'emerald' ? 'text-emerald-600' : 'text-blue-600')}>{askLabel}</span>
      </div>
    </div>
  );
};

export const EarningPotentialSection = ({ salary }: EarningPotentialSectionProps) => {
  if (!salary || salary.error) return null;

  const local = salary.nepalLocalMarket;
  const remote = salary.internationalRemote;
  const premiums = salary.skillPremiums || [];
  const trends = salary.marketTrends2026;
  const negotiation = salary.negotiationGuidance;
  const localRange = local?.salaryRange || { min: 50000, median: 100000, max: 250000 };
  const remoteRange = remote?.salaryRange || { min: 15000, median: 35000, max: 75000 };
  const currentLocalMedian = Number(localRange.median || 0);
  const next2YearsSalary = salary.careerGrowthProjection?.next2Years?.salaryProjection;
  const next5YearsSalary = salary.careerGrowthProjection?.next5Years?.salaryProjection;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 p-1"
    >
      {/* 1. Market Header & Distribution Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={item} whileHover={{ y: -6 }} className={`lg:col-span-2 ${shellCard} ${hoverCard} p-10 flex flex-col justify-between`}>
           <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -mr-40 -mt-40" />
           
           <div className="relative">
             <div className="flex items-center gap-3 mb-8">
               <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                 <BarChart3 className="w-6 h-6" />
               </div>
               <div>
                 <h2 className="text-3xl font-black italic tracking-tight">Market Value Insights</h2>
                 <p className="text-sm font-medium text-muted-foreground">Strategic analysis for the 2026 talent ecosystem</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                <SalarySpectrum 
                  label="Local Market Range (Monthly)"
                  min={localRange.min}
                  median={localRange.median}
                  max={localRange.max}
                  currency="NPR"
                />
                <SalarySpectrum 
                  label="Remote Market Range (Annual)"
                  min={remoteRange.min}
                  median={remoteRange.median}
                  max={remoteRange.max}
                  currency="USD"
                />
             </div>
           </div>

           <div className="relative flex flex-wrap gap-6 items-center pt-8 border-t">
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Percentile Standing</span>
               <div className="flex items-center gap-3">
                 <span className="text-3xl font-black text-primary">{local?.percentilePosition || '90th'}</span>
                 <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase">Top Performer</div>
               </div>
             </div>
             <div className="flex flex-col border-l pl-6">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Market Demand</span>
               <span className="text-3xl font-black text-primary">{local?.marketDemand || 'Very High'}</span>
             </div>
           </div>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -6, scale: 1.01 }} className="bg-zinc-900 text-zinc-100 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <Star className="w-32 h-32 text-primary" />
          </div>
          <div className="space-y-6 relative">
            <h3 className="font-black text-xl italic flex items-center gap-2 text-primary">
              <Zap className="w-5 h-5" /> Negotiation Strategy
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {negotiation?.recommendedAskRange?.rationale || "Your stack commands a premium in the remote market. Focus on 'Time-to-Value' metrics."}
            </p>
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Local Monthly Ask</span>
                <p className="text-xl font-black text-emerald-400">{negotiation?.recommendedAskRange?.localNPR || 'NPR 150k+'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Remote Annual Ask</span>
                <p className="text-xl font-black text-blue-400">{negotiation?.recommendedAskRange?.remoteUSD || '$45k+'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Compensation Comparison + Negotiation Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={item} whileHover={{ y: -6 }} className={`lg:col-span-2 ${shellCard} ${hoverCard} p-8`}>
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black">Local vs Remote Compensation</h3>
                <p className="text-sm text-muted-foreground">A quick visual comparison of the pay envelope at each level.</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              <Globe className="w-3.5 h-3.5" />
              Comp Range
            </div>
          </div>
          <ComparisonBars localRange={localRange} remoteRange={remoteRange} />
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -6 }} className={`bg-[linear-gradient(160deg,rgba(15,23,42,1),rgba(30,41,59,1))] text-white rounded-[2.5rem] p-8 shadow-[0_28px_80px_-24px_rgba(15,23,42,0.7)] relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_35%)]" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-white/10 text-primary">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black">Ask Range Visual</h3>
            </div>
            <div className="space-y-5">
              <NegotiationRange
                title="Local Positioning"
                marketMedian={`NPR ${localRange.median.toLocaleString()}`}
                askLabel={negotiation?.recommendedAskRange?.localNPR || 'NPR 125k - 150k'}
                color="emerald"
              />
              <NegotiationRange
                title="Remote Positioning"
                marketMedian={`USD ${remoteRange.median.toLocaleString()}`}
                askLabel={negotiation?.recommendedAskRange?.remoteUSD || '$30k - $38k'}
                color="blue"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Side-by-Side Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Local Card */}
        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-emerald-500/20 ${hoverCard}`}>
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <Landmark className="w-24 h-24" />
           </div>
           <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                 <Globe className="w-5 h-5" />
               </div>
               <h3 className="text-xl font-black">Nepal (Local)</h3>
             </div>
             <span className="text-[10px] font-bold text-muted-foreground uppercase border px-3 py-1 rounded-full">Kathmandu 2026</span>
           </div>

           <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Expected Monthly</span>
                  <p className="text-4xl font-black text-emerald-600">NPR {localRange.median?.toLocaleString()}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Annual Equivalent</span>
                  <p className="text-lg font-bold">~{local?.annualEquivalent?.median?.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <p className="text-[10px] font-black uppercase text-muted-foreground border-b pb-2">Sector Top Companies</p>
                 <div className="flex flex-wrap gap-2">
                   {(local?.topPayingCompanies || []).map((co: string, i: number) => (
                     <span key={i} className="px-3 py-1 rounded-lg bg-muted text-[10px] font-bold border border-transparent hover:border-emerald-500/20 transition-all">{co}</span>
                   ))}
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Remote Card */}
        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-blue-500/20 ${hoverCard}`}>
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <DollarSign className="w-24 h-24" />
           </div>
           <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
                 <Globe className="w-5 h-5" />
               </div>
               <h3 className="text-xl font-black">Global Remote</h3>
             </div>
             <span className="text-[10px] font-bold text-muted-foreground uppercase border px-3 py-1 rounded-full">Global Talent Market</span>
           </div>

           <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Target Annual</span>
                  <p className="text-4xl font-black text-blue-600">USD {remoteRange.median?.toLocaleString()}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Geo-Adjustment</span>
                  <p className="text-lg font-bold text-blue-400">{remote?.geographicAdjustment || '75% of US'}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-xs font-medium text-blue-900/70 italic leading-relaxed">
                  <ShieldCheck className="inline-block w-3 h-3 mr-2 -mt-1" />
                  {remote?.taxImplications || "Strategic tip: Utilize 'Wise' for direct USD deposits to save on exchange fees."}
                </p>
              </div>
           </div>
        </motion.div>
      </div>

      {/* 4. Career Roadmap Projection */}
      <motion.div variants={item} whileHover={{ y: -6 }} className="bg-zinc-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
           <TrendingUp className="w-64 h-64" />
         </div>
         <div className="relative">
           <div className="flex items-center gap-3 mb-10">
             <div className="p-3 bg-white/10 rounded-2xl text-primary">
               <ArrowUpRight className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-3xl font-black italic">Strategic Growth Projection</h2>
               <p className="text-sm text-zinc-400">Projected trajectory based on current technical velocity</p>
             </div>
           </div>

           <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Current</p>
               <p className="text-lg font-black">Mid-Level Backend Engineer</p>
               <p className="text-emerald-400 font-bold mt-1">NPR {currentLocalMedian.toLocaleString()} median</p>
             </div>
             <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Next 2 Years</p>
               <p className="text-lg font-black">{salary.careerGrowthProjection?.next2Years?.potentialRole || 'Backend Specialist'}</p>
               <p className="text-emerald-400 font-bold mt-1">{next2YearsSalary || 'NPR 130k - 170k'}</p>
             </div>
             <div className="rounded-3xl border border-primary/20 bg-primary/10 p-5">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 mb-2">Next 5 Years</p>
               <p className="text-lg font-black">{salary.careerGrowthProjection?.next5Years?.potentialRole || 'Tech Lead / Architect'}</p>
               <p className="text-primary font-bold mt-1">{next5YearsSalary || 'NPR 200k+'}</p>
             </div>
           </div>

           <div className="mb-10 px-2">
             <div className="relative flex items-center justify-between">
               <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/10" />
               <div className="absolute left-[8%] right-[12%] top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-primary" />
               {[
                 { label: 'Now', icon: Briefcase, tone: 'bg-emerald-500' },
                 { label: '2Y', icon: Rocket, tone: 'bg-sky-500' },
                 { label: '5Y', icon: Star, tone: 'bg-primary' }
               ].map((step, index) => (
                 <div key={index} className="relative z-10 flex flex-col items-center gap-2">
                   <div className={cn('flex h-12 w-12 items-center justify-center rounded-full border-4 border-zinc-900 shadow-lg', step.tone)}>
                     <step.icon className="w-5 h-5 text-white" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{step.label}</span>
                 </div>
               ))}
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 group hover:bg-white/10 transition-all">
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Next 24 Months</span>
                   <TrendingUp className="w-4 h-4 text-emerald-400" />
                 </div>
                 <div>
                   <p className="text-2xl font-black">{salary.careerGrowthProjection?.next2Years?.potentialRole || 'Senior Fullstack'}</p>
                   <p className="text-emerald-400 font-bold mt-1">{salary.careerGrowthProjection?.next2Years?.salaryProjection || 'NPR 180k+'}</p>
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {salary.careerGrowthProjection?.next2Years?.skillsToAcquire?.map((s: string, i: number) => (
                     <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{s}</span>
                   ))}
                 </div>
              </div>

              <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20 space-y-6 group hover:bg-primary/20 transition-all">
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Next 5 Years</span>
                   <Star className="w-4 h-4 text-primary" />
                 </div>
                 <div>
                   <p className="text-2xl font-black">{salary.careerGrowthProjection?.next5Years?.potentialRole || 'Tech Lead / Architect'}</p>
                   <p className="text-primary font-bold mt-1">{salary.careerGrowthProjection?.next5Years?.salaryProjection || 'NPR 350k+'}</p>
                 </div>
                 <p className="text-xs text-zinc-400 italic leading-relaxed border-l-2 border-primary/40 pl-4">
                   {salary.careerGrowthProjection?.next5Years?.strategicAdvice || 'Transition toward system architecture and strategic leadership.'}
                 </p>
              </div>
           </div>
         </div>
      </motion.div>

      {/* 5. Global Multipliers & Certs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} p-8`}>
           <h3 className="text-xl font-black mb-8 flex items-center gap-3">
             <Star className="text-yellow-600 w-6 h-6" /> Technical Value Multipliers
           </h3>
           <PremiumBars premiums={premiums} />
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} p-8`}>
           <h3 className="text-xl font-black mb-8 flex items-center gap-3">
             <ShieldCheck className="text-blue-600 w-6 h-6" /> Certification ROI
           </h3>
           <div className="space-y-4">
             {salary.certificationImpact && salary.certificationImpact.length > 0 ? (
               salary.certificationImpact.map((cert: any, i: number) => (
                 <div key={i} className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <p className="font-black text-blue-900/80 max-w-[70%] leading-tight">{cert.certification}</p>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-black uppercase",
                        cert.relevance === 'High' ? "bg-emerald-500 text-white" : "bg-zinc-200 text-zinc-600"
                      )}>{cert.relevance} Relevance</span>
                    </div>
                    <div className="mb-4 h-2 rounded-full bg-blue-500/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: cert.relevance === 'High' ? '78%' : '52%' }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Salary Boost: <span className="text-blue-600">{cert.salaryBoost}</span></span>
                      <span className="text-blue-600 underline underline-offset-4">{cert.recommendation}</span>
                    </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-16 text-muted-foreground italic text-sm border-2 border-dashed rounded-3xl">
                 No critical certification gaps identified for current role level.
               </div>
             )}
           </div>
        </motion.div>
      </div>

      {/* 6. Market Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} p-8`}>
           <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-6">Standard Benefits</h3>
           <div className="space-y-4">
             {(local?.typicalBenefits || []).map((benefit: string, i: number) => (
               <div key={i} className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                 <CheckCircle2 className="w-4 h-4 text-primary" /> {benefit}
               </div>
             ))}
           </div>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -6 }} className={`md:col-span-2 ${shellCard} ${hoverCard} p-8 relative overflow-hidden`}>
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black italic">2026 Tech Market Pulse</h3>
             <TrendingUp className="w-5 h-5 text-primary opacity-50" />
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
             <div className="space-y-4">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">High-Demand Skills</span>
               <div className="flex flex-wrap gap-2">
                 {trends?.hotSkills?.map((skill: string, i: number) => (
                   <span key={i} className="px-3 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-bold border border-primary/10">{skill}</span>
                 ))}
               </div>
             </div>
             <div className="space-y-4">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Trends</span>
               <p className="text-xs text-muted-foreground leading-relaxed italic">
                 {trends?.remoteTrends || "Remote work in Nepal is consolidating into high-value specialized consultancy roles."}
               </p>
             </div>
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
