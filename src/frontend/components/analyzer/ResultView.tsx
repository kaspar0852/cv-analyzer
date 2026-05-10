'use client';

import { motion } from 'framer-motion';
import { 
  Trophy, TrendingUp, Briefcase, FileSearch, 
  Mail, Banknote, CheckCircle2, AlertTriangle,
  Globe, Zap, Target, Star, Copy, ExternalLink
} from 'lucide-react';

interface ResultViewProps {
  data: any;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export const ResultView = ({ data }: ResultViewProps) => {
  if (!data || !data.results) return null;

  const { 
    stage1_extraction: extraction,
    stage2_context: context,
    stage3_scoring: scoring,
    stage4_recommendations: recommendations,
    stage5_ats: ats,
    stage6_cover_letter: coverLetter,
    stage7_salary: salary
  } = data.results;

  const overallScorePercent = (scoring?.overallScore || data.overallScore || 0) * 10;
  const atsScore = ats?.atsScore || data.atsScore || 0;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6 pb-24"
    >
      {/* 1. Header: The Big Picture */}
      <motion.div variants={item} className="relative overflow-hidden bg-primary/10 border border-primary/20 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="bg-card border rounded-3xl p-6 shadow-sm">
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

        <motion.div variants={item} className="bg-card border rounded-3xl p-6 shadow-sm">
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

        <motion.div variants={item} className="bg-card border rounded-3xl p-6 shadow-sm">
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
      </div>

      {/* 3. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Technical & Strategic */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Wins Checklist */}
          <motion.div variants={item} className="bg-card border rounded-[2.5rem] p-8 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-yellow-500/10 text-yellow-600 rounded-lg">
                <Trophy className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black">Strategic Quick Wins</h2>
            </div>
            <div className="grid gap-6">
              {recommendations?.quickWins?.map((win: any, idx: number) => (
                <div key={idx} className="group flex items-start gap-5 p-5 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-muted/50 transition-all">
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
          <motion.div variants={item} className="bg-card border rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black">Impact Reframing</h2>
            </div>
            <div className="space-y-6">
              {recommendations?.achievementReframing?.slice(0, 2).map((ref: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-muted-foreground flex gap-3 italic">
                    <span className="font-bold text-red-500 not-italic uppercase">Before:</span> {ref.original}
                  </div>
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-sm font-medium text-emerald-900 flex gap-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/40" />
                    <span className="font-bold text-emerald-600 uppercase text-[10px] mt-0.5">Recommended:</span> 
                    {ref.improved}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column: Salary & Market */}
        <div className="space-y-8">
          
          {/* Salary Potential Card */}
          <motion.div variants={item} className="bg-card border rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                <Banknote className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black">Earning Potential</h2>
            </div>

            <div className="space-y-8">
              {/* Local Market */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <Globe className="w-3 h-3" /> Nepal (Local)
                </div>
                <div className="p-6 rounded-2xl bg-muted/30 border">
                   <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-black text-emerald-600">
                       NPR {salary?.nepalLocalMarket?.salaryRange?.median?.toLocaleString()}
                     </span>
                     <span className="text-[10px] font-bold text-muted-foreground">/mo</span>
                   </div>
                   <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                     <span>Range: {salary?.nepalLocalMarket?.salaryRange?.min?.toLocaleString()} - {salary?.nepalLocalMarket?.salaryRange?.max?.toLocaleString()}</span>
                   </div>
                </div>
              </div>

              {/* International Market */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest text-blue-500">
                  <ExternalLink className="w-3 h-3" /> International Remote
                </div>
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                   <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-black text-blue-600">
                       USD {salary?.internationalRemote?.salaryRange?.median?.toLocaleString()}
                     </span>
                     <span className="text-[10px] font-bold text-muted-foreground">/mo</span>
                   </div>
                   <p className="mt-2 text-[10px] text-blue-600/70 font-bold italic leading-relaxed">
                     Tip: {salary?.internationalRemote?.negotiationTips?.[0]}
                   </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ATS Parsing Risks */}
          <motion.div variants={item} className="bg-card border border-red-500/10 rounded-[2.5rem] p-8 shadow-sm">
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

        </div>
      </div>

      {/* 4. Technical Skill Inventory */}
      <motion.div variants={item} className="bg-card border rounded-[2.5rem] p-8 shadow-sm">
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
                  <span key={sIdx} className="px-3 py-1 bg-muted/50 rounded-lg text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
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
          <div key={idx} className="p-6 rounded-3xl bg-card border hover:border-primary/40 transition-colors shadow-sm">
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
             <div className="p-6 rounded-3xl bg-card border shadow-sm">
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

             <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Growth Tip
                </h3>
                <p className="text-xs leading-relaxed font-medium">
                  {coverLetter?.templateStructure}
                </p>
             </div>

             <div className="p-6 rounded-3xl bg-card border shadow-sm">
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
  );
};
