'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  Trophy, TrendingUp, Briefcase, FileSearch, 
  Mail, Banknote, CheckCircle2, AlertTriangle,
  Zap, Target, Star, Copy,
  MessageSquare, LayoutDashboard, Lightbulb,
  Sparkles, Wrench, ArrowRight, Layers3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InterviewPrepSection } from '@/app/analyzer/components/interview-prep-section';
import { EarningPotentialSection } from '@/app/analyzer/components/earning-potential-section';

interface ResultViewProps {
  data: any;
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

const parseMaybeJson = (value: any) => {
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const normalizeSalaryInsights = (value: any) => {
  const parsed = parseMaybeJson(value);

  if (!parsed || typeof parsed !== 'object') return null;
  if (parsed.error) return null;
  if (parsed.nepalLocalMarket || parsed.internationalRemote) return parsed;
  if (parsed.salaryInsights) return normalizeSalaryInsights(parsed.salaryInsights);
  if (parsed.salary_insights) return normalizeSalaryInsights(parsed.salary_insights);
  if (parsed.data) return normalizeSalaryInsights(parsed.data);

  return parsed;
};

const getGrowthTips = (recommendations: any, scoring: any, ats: any) => {
  const tips = [
    ...(recommendations?.technicalEnhancements || []).map((item: any) => ({
      title: item.area,
      body: item.suggestion,
      reason: item.reasoning,
      type: 'technical'
    })),
    ...(recommendations?.contentImprovements || []).map((item: any) => ({
      title: item.section,
      body: item.suggestedApproach,
      reason: item.currentIssue,
      type: 'content'
    })),
    ...(ats?.keywordOptimization?.missingCriticalKeywords || []).map((keyword: string) => ({
      title: 'Missing critical keyword',
      body: `Work "${keyword}" naturally into your summary, experience bullets, or skills section where it reflects real work.`,
      reason: 'Helps ATS match and recruiter scanability.',
      type: 'keyword'
    })),
    ...(scoring?.missingElements || []).map((item: string) => ({
      title: 'Missing element',
      body: item,
      reason: 'Adding this will make the CV more complete and easier to position.',
      type: 'missing'
    }))
  ];

  return tips.slice(0, 4);
};

const getCoverLetterTemplate = (coverLetter: any) =>
  coverLetter?.templateStructure ||
  coverLetter?.nepalSpecificGuidance?.templateStructure ||
  '';

const getRewriteSignals = (text: string) => {
  const value = text || '';

  return [
    /improv|reduc|increas|optimiz|support|scale|handl/i.test(value) ? 'Outcome-led' : null,
    /\d|%|m\+|k\b|million|daily|concurrent/i.test(value) ? 'Quantified' : null,
    /aws|go|golang|c#|signalr|api|oauth|lambda|sqs|rabbitmq|microservice|cqrs/i.test(value) ? 'Tech-specific' : null,
    /architect|designed|implemented|secured|decomposed/i.test(value) ? 'Ownership shown' : null
  ].filter((item): item is string => Boolean(item));
};

const getPriorityRoadmap = (recommendations: any) => [
  ...(recommendations?.quickWins || []).map((item: any) => ({
    title: item.issue,
    action: item.recommendation,
    support: item.category
  })),
  ...(recommendations?.missingSections || []).map((item: any) => ({
    title: item.section,
    action: item.whatToInclude,
    support: `${item.importance} priority`
  }))
].slice(0, 4);

const shellCard =
  'relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(248,250,252,0.82))] dark:bg-[linear-gradient(145deg,rgba(24,24,27,0.92),rgba(39,39,42,0.78))] backdrop-blur-xl shadow-[0_18px_50px_-24px_rgba(15,23,42,0.45)]';

const hoverCard =
  'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(59,130,246,0.22)] hover:border-primary/20';

export const ResultView = ({ data }: ResultViewProps) => {
  if (!data || !data.results) return null;

  const { 
    stage1_extraction: extraction,
    stage2_context: context,
    stage3_scoring: scoring,
    stage4_recommendations: recommendations,
    stage5_ats: ats,
    stage6_cover_letter: coverLetter,
    stage7_salary
  } = data.results;
  const salary = normalizeSalaryInsights(stage7_salary);
  const growthTips = getGrowthTips(recommendations, scoring, ats);
  const coverLetterTemplate = getCoverLetterTemplate(coverLetter);
  const priorityRoadmap = getPriorityRoadmap(recommendations);

  const overallScorePercent = (scoring?.overallScore || data.overallScore || 0) * 10;
  const atsScore = ats?.atsScore || data.atsScore || 0;

  return (
    <Tabs defaultValue="report" className="max-w-6xl mx-auto p-4 sm:p-6 pb-24">
      <div className="flex justify-center mb-8">
        <TabsList className="grid w-full max-w-[600px] grid-cols-3 rounded-full p-1 h-12 bg-muted/50 border border-border">
          <TabsTrigger value="report" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2">
            <LayoutDashboard className="w-4 h-4" /> Core Report
          </TabsTrigger>
          <TabsTrigger value="earning" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2">
            <Banknote className="w-4 h-4" /> Earning Potential
          </TabsTrigger>
          <TabsTrigger value="interview" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2">
            <MessageSquare className="w-4 h-4" /> Interview Prep
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="report" className="space-y-8 mt-0 outline-none">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
      {/* 1. Header: The Big Picture */}
      <motion.div variants={item} className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_30%),linear-gradient(145deg,rgba(255,255,255,0.96),rgba(239,246,255,0.88))] p-8 md:p-12 shadow-[0_24px_70px_-28px_rgba(37,99,235,0.45)] backdrop-blur-xl dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_30%),linear-gradient(145deg,rgba(24,24,27,0.94),rgba(15,23,42,0.88))]">
        <motion.div
          className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.8, 0.55] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 -mb-12 -ml-8 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl"
          animate={{ y: [0, -12, 0], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
              <Star className="w-3 h-3" /> {scoring?.competitiveLevel || 'Analysis Complete'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Strategic Career <br/><span className="text-primary">Insight Report</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              {context?.careerTrajectory || "We've analyzed your profile against global standards to uncover your highest value career path."}
            </p>
          </div>
          
          <div className="flex gap-8 items-center">
            {/* Overall Score Circle */}
            <div className="relative flex flex-col items-center group">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary/10" />
                <motion.circle
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={440}
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * overallScorePercent) / 100 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">{scoring?.overallScore || (overallScorePercent/10)}</span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Overall</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Quick Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} p-6`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="font-bold">ATS Score</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold">
              <span>{ats?.compatibilityLevel || 'Good'} Match</span>
              <span>{atsScore}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500" 
                initial={{ width: 0 }} 
                animate={{ width: `${atsScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} p-6`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/70 to-transparent" />
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold">Target Context</h3>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-black">{context?.targetRoleLevel || data.targetRoleLevel}</p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {context?.roleSpecialization || data.roleSpecialization}
            </p>
          </div>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} p-6`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/70 to-transparent" />
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-bold">Experience</h3>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-black">{context?.yearsOfExperience || data.yearsOfExperience} Years</p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {context?.primaryIndustry || data.primaryIndustry}
            </p>
          </div>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} p-6`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold">Focus Areas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(context?.technicalFocus || []).slice(0, 4).map((focus: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-muted/50 rounded-lg text-xs font-medium">
                {focus}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 2b. Snapshot Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} p-6`}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-black">Top Strengths</h3>
          </div>
          <div className="space-y-3">
            {(scoring?.strengths || []).slice(0, 3).map((strength: string, idx: number) => (
              <p key={idx} className="text-sm leading-relaxed text-muted-foreground">
                {strength}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} p-6`}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-black">Priority Gaps</h3>
          </div>
          <div className="space-y-3">
            {(scoring?.criticalGaps || []).slice(0, 3).map((gap: string, idx: number) => (
              <p key={idx} className="text-sm leading-relaxed text-muted-foreground">
                {gap}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} p-6`}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-sky-500/10 text-sky-600 rounded-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-black">Keyword Gaps</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(ats?.keywordOptimization?.missingCriticalKeywords || scoring?.keywordDensity?.missing || []).slice(0, 6).map((keyword: string, idx: number) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                {keyword}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 3. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Technical & Strategic */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Wins Checklist */}
          <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} rounded-[2.5rem] p-8 overflow-hidden`}>
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap className="w-32 h-32" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.12),transparent_30%)]" />
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-yellow-500/10 text-yellow-600 rounded-lg">
                <Trophy className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black">Strategic Quick Wins</h2>
            </div>
            <div className="grid gap-6">
              {recommendations?.quickWins?.map((win: any, idx: number) => (
                <div key={idx} className="group relative flex items-start gap-5 rounded-2xl border border-white/10 bg-white/50 p-5 transition-all hover:border-primary/20 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{win.category}</span>
                    <p className="font-bold text-base leading-snug">{win.recommendation}</p>
                    <p className="text-sm text-muted-foreground italic opacity-80 pt-1 group-hover:opacity-100">"{win.example}"</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievement Reframing (The "Story" Upgrade) */}
          <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} rounded-[2.5rem] p-8`}>
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Impact Reframing</h2>
                  <p className="text-sm text-muted-foreground">Turn flat responsibility bullets into stronger, outcome-driven achievements.</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                Resume Upgrade
              </div>
            </div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/50 p-4 dark:bg-white/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Step 1</p>
                <p className="text-sm font-semibold">Name the technical action</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/50 p-4 dark:bg-white/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Step 2</p>
                <p className="text-sm font-semibold">Add tools, scale, or architecture</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/50 p-4 dark:bg-white/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Step 3</p>
                <p className="text-sm font-semibold">Close with measurable impact</p>
              </div>
            </div>
            <div className="space-y-6">
              {recommendations?.achievementReframing?.slice(0, 3).map((ref: any, idx: number) => {
                const rewriteSignals = getRewriteSignals(ref.improved);

                return (
                  <div key={idx} className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.68),rgba(248,250,252,0.42))] p-5 shadow-[0_18px_44px_-30px_rgba(79,70,229,0.5)] dark:bg-[linear-gradient(160deg,rgba(39,39,42,0.5),rgba(24,24,27,0.4))]">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                        Rewrite Example {idx + 1}
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        {rewriteSignals.map((signal: string, signalIdx: number) => (
                          <span key={signalIdx} className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_40px_minmax(0,1.15fr)] items-stretch">
                      <div className="rounded-2xl bg-red-500/5 border border-red-500/10 p-4 shadow-inner">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">Before</p>
                        <p className="text-sm italic text-muted-foreground">{ref.original}</p>
                      </div>

                      <div className="hidden lg:flex items-center justify-center text-primary/60">
                        <ArrowRight className="w-5 h-5" />
                      </div>

                      <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-5 relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                        <div className="absolute top-0 left-0 h-full w-1 bg-emerald-500/40" />
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">After</p>
                        <p className="text-sm font-medium leading-relaxed text-emerald-950 dark:text-emerald-100">{ref.improved}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Why This Works</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{ref.reasoning}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} rounded-[2.5rem] p-8`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-cyan-500/10 text-cyan-600 rounded-lg">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black">Best Project Signals</h2>
            </div>
            <div className="space-y-5">
              {(extraction?.projects || []).slice(0, 3).map((project: any, idx: number) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/55 p-5 space-y-3 shadow-[0_16px_40px_-28px_rgba(14,165,233,0.45)] dark:bg-white/5">
                  <div>
                    <p className="font-bold leading-snug">{project.name}</p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{project.role}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(project.techStack || []).slice(0, 5).map((tech: string, techIdx: number) => (
                      <span key={techIdx} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description?.[0]}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column: Salary & Market Summary */}
        <div className="space-y-8">
          
          {/* Simplified Salary Potential Card */}
          <motion.div variants={item} whileHover={{ y: -6, scale: 1.01 }} className="relative overflow-hidden rounded-[2.5rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.32),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.24),transparent_30%),linear-gradient(160deg,#0f172a,#1e3a8a_55%,#0f766e)] p-8 text-primary-foreground shadow-[0_28px_80px_-24px_rgba(14,116,144,0.55)]">
            <motion.div
              className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-2xl"
              animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Banknote className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black italic">Earning Power</h2>
              </div>
              <TrendingUp className="w-6 h-6 opacity-50" />
            </div>

            <div className="space-y-6">
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Market Median (Local)</p>
                 <p className="text-3xl font-black">
                   {salary?.nepalLocalMarket?.salaryRange?.median
                     ? `NPR ${salary.nepalLocalMarket.salaryRange.median.toLocaleString()}`
                     : 'Pending'}
                 </p>
               </div>
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Remote Target (Annual)</p>
                 <p className="text-3xl font-black text-emerald-400">
                   {salary?.internationalRemote?.salaryRange?.median
                     ? `USD ${salary.internationalRemote.salaryRange.median.toLocaleString()}`
                     : 'Pending'}
                 </p>
               </div>
            </div>
          </motion.div>

          {/* ATS Parsing Risks */}
          <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} rounded-[2.5rem] border-red-500/10 p-8`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black">ATS Parsing Risks</h2>
            </div>
            <div className="space-y-4">
              {ats?.parsingRisks?.map((risk: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-red-500 uppercase">{risk.severity}</span>
                    <span className="text-[10px] text-muted-foreground">{risk.location}</span>
                  </div>
                  <p className="text-sm font-bold">{risk.issue}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 border-muted pl-3 py-1">
                    Fix: {risk.fix}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} rounded-[2.5rem] p-8`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-violet-500/10 text-violet-600 rounded-lg">
                <Layers3 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black">Priority Roadmap</h2>
            </div>
            <div className="space-y-4">
              {priorityRoadmap.map((item: any, idx: number) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/50 p-4 dark:bg-white/5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-bold leading-snug">{item.title}</p>
                    <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
                      {item.support}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.action}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* 4. Technical Skill Inventory */}
      <motion.div variants={item} whileHover={{ y: -6 }} className={`${shellCard} ${hoverCard} rounded-[2.5rem] p-8`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black">Technical Skill Inventory</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(extraction?.skills || {}).map(([category, skills]: [string, any], idx: number) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] border-b pb-2">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, sIdx: number) => (
                  <span key={sIdx} className="px-3 py-1 bg-muted/50 rounded-lg text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default hover:scale-105">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. Value Propositions (Full Width) */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coverLetter?.valuePropositions?.map((prop: any, idx: number) => (
          <div key={idx} className={`${shellCard} ${hoverCard} p-6 rounded-3xl`}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              {idx === 0 ? <Zap className="w-5 h-5" /> : idx === 1 ? <Target className="w-5 h-5" /> : <Star className="w-5 h-5" />}
            </div>
            <h4 className="font-black text-sm mb-2">{prop.proposition}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{prop.impact}</p>
          </div>
        ))}
      </motion.div>

      {/* 6. AI Cover Letter Builder */}
      <motion.div variants={item} className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-black">Strategic Cover Letter</h2>
            </div>
            <p className="text-muted-foreground font-medium">An expert-crafted narrative assembled from your deep analysis.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: The "Letter" (Paper Aesthetic) */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border shadow-xl rounded-sm p-12 md:p-16 relative overflow-hidden text-zinc-800 dark:text-zinc-200 min-h-[800px] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            
            {/* Header Placeholder */}
            <div className="space-y-1 mb-12">
              <p className="font-bold text-lg">{extraction?.personalInfo?.name || '[Your Name]'}</p>
              <p className="text-sm opacity-60">{extraction?.personalInfo?.location || '[Location]'}</p>
              <p className="text-sm opacity-60">{extraction?.personalInfo?.email || '[Email]'}</p>
            </div>

            <div className="space-y-8 flex-1 font-serif text-lg leading-relaxed">
              <p className="font-bold mb-4 italic">"{coverLetter?.openingHooks?.[0]?.text}"</p>
              
              <div className="space-y-6">
                <p>{coverLetter?.skillsNarrative?.differentiator}</p>
                <p>{coverLetter?.skillsNarrative?.technicalStory}</p>
                <p>{coverLetter?.skillsNarrative?.businessImpactAngle}</p>
              </div>

              <p className="pt-4 font-medium italic">
                {coverLetter?.closingStatements?.[0]?.text}
              </p>
            </div>

            <div className="mt-12 pt-8 border-t space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">Sincerely,</p>
                  <p className="font-serif mt-2">{extraction?.personalInfo?.name || '[Your Name]'}</p>
                </div>
                <button 
                  onClick={() => {
                    const text = `
${extraction?.personalInfo?.name}
${extraction?.personalInfo?.email}

${coverLetter?.openingHooks?.[0]?.text}

${coverLetter?.skillsNarrative?.differentiator}

${coverLetter?.skillsNarrative?.technicalStory}

${coverLetter?.skillsNarrative?.businessImpactAngle}

${coverLetter?.closingStatements?.[0]?.text}

Sincerely,
${extraction?.personalInfo?.name}
                    `.trim();
                    navigator.clipboard.writeText(text);
                    alert('Full letter copied to clipboard!');
                  }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Copy className="w-4 h-4" /> Copy Full Letter
                </button>
              </div>
            </div>
          </div>

          {/* Right: Alternative Hooks & Variations */}
          <div className="space-y-6">
             <div className={`${shellCard} ${hoverCard} p-6 rounded-3xl`}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Alternative Hooks</h3>
                <div className="space-y-4">
                  {coverLetter?.openingHooks?.slice(1).map((hook: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all text-xs italic leading-relaxed group relative cursor-pointer"
                         onClick={() => {
                           navigator.clipboard.writeText(hook.text);
                           alert('Hook copied!');
                         }}>
                      "{hook.text}"
                      <Copy className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
             </div>

             <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[linear-gradient(145deg,rgba(219,234,254,0.7),rgba(236,253,245,0.72))] p-6 shadow-[0_18px_40px_-28px_rgba(59,130,246,0.45)] dark:bg-[linear-gradient(145deg,rgba(30,41,59,0.9),rgba(15,23,42,0.84))]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28%)]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Growth Tip
                </h3>
                <div className="relative space-y-4">
                  {growthTips.map((tip: any, idx: number) => (
                    <div key={idx} className="space-y-1 rounded-2xl border border-white/20 bg-white/50 p-4 dark:bg-white/5">
                      <p className="text-xs font-black">{tip.title}</p>
                      <p className="text-xs leading-relaxed font-medium">{tip.body}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{tip.reason}</p>
                    </div>
                  ))}
                </div>
             </div>

             <div className={`${shellCard} ${hoverCard} p-6 rounded-3xl`}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Value Propositions</h3>
                <div className="space-y-4">
                  {coverLetter?.valuePropositions?.map((prop: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-xs font-black">{prop.proposition}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{prop.impact}</p>
                    </div>
                  ))}
                </div>
             </div>

             {coverLetterTemplate && (
               <div className={`${shellCard} ${hoverCard} p-6 rounded-3xl`}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Cover Letter Structure</h3>
                  <p className="text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                    {coverLetterTemplate}
                  </p>
               </div>
             )}
          </div>
        </div>
      </motion.div>

      {/* 7. CTA Footer */}

      {/* 7. CTA Footer */}
      <motion.div 
        variants={item} 
        className="bg-primary border border-primary/20 rounded-[2.5rem] p-8 md:p-12 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-black italic">Ready to deploy?</h2>
          <p className="opacity-80 font-medium">Use the generated opening hooks to personalize your next application.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => {
               navigator.clipboard.writeText(coverLetter?.openingHooks?.[0]?.text || '');
               alert('Hook copied to clipboard!');
             }}
             className="px-8 py-4 bg-white text-primary rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-transform"
            >
             <Copy className="w-5 h-5" /> Copy Opening Hook
           </button>
        </div>
      </motion.div>

        </motion.div>
      </TabsContent>

      <TabsContent value="earning" className="mt-0 outline-none">
        <motion.div variants={container} initial="hidden" animate="show" className="p-1">
          {salary ? (
            <EarningPotentialSection salary={salary} />
          ) : (
            <div className="max-w-3xl mx-auto rounded-3xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              Earning potential data is not available for this report yet.
            </div>
          )}
        </motion.div>
      </TabsContent>

      <TabsContent value="interview" className="mt-0 outline-none">
        <InterviewPrepSection data={data.results?.interview_prep?.interviewPrepPackage || data.results?.interview_prep} />
      </TabsContent>
    </Tabs>
  );
};
