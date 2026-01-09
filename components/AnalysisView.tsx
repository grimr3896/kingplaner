
import React, { useState, useEffect } from 'react';
import { AnalysisResult, UserPlan, RoadmapPhase, TaskNode, TaskChoice } from '../types';
import Button from './Button';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  count?: number;
  isOpen: boolean;
  onToggle: (id: string) => void;
  accent?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'stone' | 'violet';
}

const Section: React.FC<SectionProps> = ({ id, title, children, count, isOpen, onToggle, accent = 'indigo' }) => {
  const accentColors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    stone: 'bg-stone-50 text-stone-600 border-stone-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100'
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden mb-4 transition-all duration-300">
      <button 
        onClick={() => onToggle(id)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          {count !== undefined && (
            <span className={`${accentColors[accent]} px-2.5 py-0.5 rounded-full text-xs font-bold border`}>
              {count}
            </span>
          )}
        </div>
        <svg 
          className={`w-6 h-6 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-8 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
};

interface AnalysisViewProps {
  result: AnalysisResult;
  plan: UserPlan;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, plan, onReset }) => {
  const isProblem = result.resultType === 'problem_resolution';
  
  const [openSections, setOpenSections] = useState<string[]>(['roadmap', 'risks', 'summary', 'resources']);
  const [taskChoices, setTaskChoices] = useState<Record<string, TaskChoice>>({});
  const [whatIfQuery, setWhatIfQuery] = useState('');
  
  const initialScore = isProblem ? (result.confidenceScore ?? 0) : (result.qualityScore ?? 0);
  const [dynamicPrimaryScore, setDynamicPrimaryScore] = useState(initialScore);
  const [dynamicRisk, setDynamicRisk] = useState(result.riskScore);

  const isDevelop = plan.mode === 'develop';

  const toggleSection = (id: string) => {
    setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleTaskChoice = (taskId: string, choice: TaskChoice) => {
    setTaskChoices(prev => ({ ...prev, [taskId]: choice }));
  };

  useEffect(() => {
    const choicesList = Object.values(taskChoices);
    if (choicesList.length === 0) return;

    const mitCount = choicesList.filter(c => c === 'Mitigate').length;
    const acceptCount = choicesList.filter(c => c === 'Accept').length;
    const avoidCount = choicesList.filter(c => c === 'Avoid').length;

    const newScore = initialScore + (mitCount * 0.5) - (acceptCount * 0.2) + (avoidCount * 0.3);
    const newRisk = result.riskScore - (mitCount * 1.2) + (acceptCount * 0.8) - (avoidCount * 1.5);

    setDynamicPrimaryScore(Math.min(100, Math.max(0, parseFloat(newScore.toFixed(1)))));
    setDynamicRisk(Math.min(100, Math.max(0, parseFloat(newRisk.toFixed(1)))));
  }, [taskChoices, initialScore, result.riskScore]);

  const phases = result?.phases ?? [];
  const detectedIssues = result?.detectedIssues ?? [];
  const domains = result?.domainAnalysis ?? {};

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className={`md:col-span-7 ${isProblem ? 'bg-indigo-900' : 'bg-slate-900'} text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors duration-700`}>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50" />
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                {isProblem ? 'Resolution Engine' : (isDevelop ? 'Architect Phase' : 'Audit Phase')}
              </span>
              <span className={`px-3 py-1 ${dynamicPrimaryScore >= 90 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'} rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20`}>
                {isProblem ? 'Validated Path' : (dynamicPrimaryScore >= 95 ? '95% Certified' : 'Iterating QVE...')}
              </span>
              <span className="px-3 py-1 bg-white/10 text-stone-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                {plan.riskPreference} Risk Layer
              </span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">
                {isProblem ? 'Step-by-Step Resolution' : (isDevelop ? 'The Strategic Forest' : 'Plan Verification')}
              </h1>
              <p className="text-indigo-100 mt-4 text-lg leading-relaxed max-w-xl">
                {result.executiveSummary}
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isProblem ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  )}
                </svg>
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 leading-relaxed">
               {result.certificationReasoning}
             </p>
          </div>
        </div>

        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[40px] border border-stone-200 p-8 flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="relative w-32 h-32">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke={isProblem ? "#4f46e5" : "#10b981"} strokeWidth="12" 
                    strokeDasharray={351.8} strokeDashoffset={351.8 - (351.8 * dynamicPrimaryScore) / 100} 
                    className="transition-all duration-1000 stroke-cap-round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-black text-3xl text-slate-800">{dynamicPrimaryScore}%</span>
                </div>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400">
              {isProblem ? 'Resolution Confidence' : 'Dynamic Quality'}
            </p>
          </div>

          <div className="bg-white rounded-[40px] border border-stone-200 p-8 flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="relative w-32 h-32">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke={dynamicRisk > 50 ? '#ef4444' : '#10b981'} strokeWidth="12" 
                    strokeDasharray={351.8} strokeDashoffset={351.8 - (351.8 * (100 - dynamicRisk)) / 100} 
                    className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-black text-3xl text-slate-800">{dynamicRisk}%</span>
                </div>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400">Residual Failure Probability</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* UNDERSTANDING SYNC */}
        <Section id="summary" title={isProblem ? "Problem Definition" : "Vision Alignment"} isOpen={openSections.includes('summary')} onToggle={toggleSection} accent="stone">
          <p className="text-stone-600 leading-relaxed text-xl font-light italic bg-stone-50 p-8 rounded-[40px] border border-stone-100">
            "{result.understanding}"
          </p>
        </Section>

        {/* RESOURCES (PROBLEM MODE ONLY) */}
        {isProblem && result.resourcesNeeded && (
          <Section id="resources" title="Resources Needed" isOpen={openSections.includes('resources')} onToggle={toggleSection} accent="amber">
            <div className="flex flex-wrap gap-3">
              {result.resourcesNeeded.map((res, i) => (
                <span key={i} className="px-4 py-2 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl text-sm font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {res}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* INTERACTIVE ROADMAP / RESOLUTION PATH */}
        <Section id="roadmap" title={isProblem ? "Resolution Path" : "Interactive Multi-Phase Forest"} count={phases.length} isOpen={openSections.includes('roadmap')} onToggle={toggleSection} accent={isProblem ? "indigo" : "emerald"}>
          <div className="space-y-12 py-8 px-2">
            {phases.map((phase, pIdx) => (
              <div key={phase.id} className={`relative pl-12 border-l-2 ${isProblem ? 'border-indigo-100' : 'border-emerald-100'} last:border-transparent`}>
                <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full ${isProblem ? 'bg-indigo-500' : 'bg-emerald-500'} ring-4 ring-white shadow-xl flex items-center justify-center`}>
                   <span className="text-white text-[10px] font-black">{pIdx + 1}</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{phase.name}</h4>
                    <p className={`text-xs font-bold ${isProblem ? 'text-indigo-600' : 'text-emerald-600'} uppercase tracking-widest mt-1`}>
                      {isProblem ? 'Stage Goal' : 'Milestone'}: {phase.milestone}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(phase.tasks || []).map((task) => {
                      const choice = taskChoices[task.id];
                      return (
                        <div key={task.id} className={`bg-white p-8 rounded-[32px] border-2 border-stone-100 hover:border-indigo-200 hover:shadow-2xl transition-all group relative`}>
                          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${task.status === 'Critical' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-indigo-50 text-indigo-500 border-indigo-100'}`}>
                            {task.status}
                          </div>
                          <div className="mb-4">
                            <h5 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight mb-2">{task.title}</h5>
                            <p className="text-sm text-stone-500 leading-relaxed">{task.description}</p>
                            {isProblem && task.expectedOutcome && (
                              <div className="mt-3 text-[11px] font-bold text-emerald-600 flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                <span>Outcome: {task.expectedOutcome}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-6 mt-6">
                            <div className="flex flex-col gap-2">
                               <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Implementation Priority</p>
                               <div className="flex gap-2">
                                  {(['Mitigate', 'Accept', 'Avoid'] as TaskChoice[]).map((c) => (
                                    <button
                                      key={c}
                                      onClick={() => handleTaskChoice(task.id, c)}
                                      className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl border-2 transition-all ${
                                        choice === c 
                                          ? (isProblem ? 'bg-indigo-600 border-indigo-600' : 'bg-emerald-600 border-emerald-600') + ' text-white scale-105 shadow-lg' 
                                          : 'bg-white border-stone-100 text-stone-400 hover:border-indigo-200 hover:text-indigo-600'
                                      }`}
                                    >
                                      {c === 'Mitigate' ? (isProblem ? 'Solve' : 'Mitigate') : c}
                                    </button>
                                  ))}
                               </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* SCENARIO WHAT-IF MODULE */}
        <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl space-y-8">
           <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight italic">{isProblem ? 'Stress Testing Resolution' : 'Scenario Simulation Lab'}</h3>
              <p className="text-stone-400 text-sm">Input a disruption to see how the plan reacts.</p>
           </div>
           <div className="flex gap-4">
              <input 
                value={whatIfQuery}
                onChange={(e) => setWhatIfQuery(e.target.value)}
                placeholder={isProblem ? "Ex: What if the first fix attempt fails?" : "Ex: What if local feed prices double?"}
                className="flex-1 bg-white/10 border border-white/20 rounded-3xl px-8 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-white/30 font-medium"
              />
              <Button 
                variant="secondary" 
                className="rounded-3xl px-8 bg-white text-slate-950 hover:bg-stone-50"
                onClick={() => {
                  alert(`Simulation triggered. Dynamic metrics updating...`);
                  setDynamicPrimaryScore(q => q - 8);
                }}
              >
                Test
              </Button>
           </div>
        </div>

        {/* DOMAIN VALIDATION */}
        <Section id="domains" title="Systemic Impact Analysis" isOpen={openSections.includes('domains')} onToggle={toggleSection} accent="stone">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
             {Object.entries(domains).map(([domain, text]) => (
               <div key={domain} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 block">{domain}</span>
                 <p className="text-xs text-stone-500 leading-relaxed line-clamp-4">{text as string}</p>
               </div>
             ))}
          </div>
        </Section>

        {result.refinedVersion && (
          <Section id="refined" title={isProblem ? "Resolution Master File" : "Architected Master Blueprint"} isOpen={openSections.includes('refined')} onToggle={toggleSection} accent="stone">
            <div className="font-mono text-sm bg-stone-900 text-stone-300 p-12 rounded-[50px] overflow-x-auto leading-relaxed border border-stone-800 shadow-3xl whitespace-pre-wrap">
              {result.refinedVersion}
            </div>
          </Section>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 pt-16 border-t border-stone-200">
        <Button variant="secondary" className="flex-1 rounded-3xl py-6 font-black uppercase tracking-[0.2em]" onClick={onReset}>
          {isProblem ? 'Solve Another Issue' : 'Review New Idea'}
        </Button>
        <Button variant="outline" className="flex-1 rounded-3xl py-6 font-black uppercase tracking-[0.2em]" onClick={() => window.print()}>
          Export Intelligence Brief
        </Button>
      </div>

      <footer className="py-20 text-center space-y-4">
        <div className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em]">
          PlanPulse Multi-Intent Engine v3.5 — Planning & Solving Sync
        </div>
      </footer>
    </div>
  );
};

export default AnalysisView;
