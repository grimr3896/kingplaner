
import React, { useState } from 'react';
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
  const [openSections, setOpenSections] = useState<string[]>(['summary', 'concepts', 'roadmap', 'causes']);
  const toggleSection = (id: string) => {
    setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const renderInformation = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-violet-600 text-white rounded-[40px] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-6">
          <span className="px-4 py-1.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest border border-white/30">Knowledge Mode</span>
          <h1 className="text-5xl font-black tracking-tighter">{result.topic || "Understanding Concepts"}</h1>
          <p className="text-xl text-violet-100 max-w-2xl leading-relaxed">{result.executiveSummary}</p>
        </div>
      </div>

      <Section id="concepts" title="Key Concepts" isOpen={openSections.includes('concepts')} onToggle={toggleSection} accent="violet">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.keyConcepts?.map((c, i) => (
            <div key={i} className="p-8 rounded-[32px] bg-stone-50 border border-stone-100 hover:border-violet-200 transition-all group">
              <h4 className="text-xl font-black text-slate-800 mb-2 group-hover:text-violet-600 transition-colors">{c.concept}</h4>
              <p className="text-stone-500 leading-relaxed">{c.explanation}</p>
            </div>
          ))}
        </div>
      </Section>

      {result.commonMisunderstandings && (
        <Section id="misunderstandings" title="Common Misunderstandings" isOpen={openSections.includes('misunderstandings')} onToggle={toggleSection} accent="rose">
          <div className="space-y-4">
            {result.commonMisunderstandings.map((m, i) => (
              <div key={i} className="flex gap-4 p-6 bg-rose-50 rounded-2xl border border-rose-100 text-rose-700 font-medium">
                <span className="text-xl">⚠️</span>
                {m}
              </div>
            ))}
          </div>
        </Section>
      )}

      {result.realWorldContext && (
        <Section id="context" title="Real-World Application" isOpen={openSections.includes('context')} onToggle={toggleSection} accent="amber">
          <p className="text-lg text-stone-600 leading-relaxed italic border-l-4 border-amber-200 pl-6">{result.realWorldContext}</p>
        </Section>
      )}
    </div>
  );

  const renderProblemSolving = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-emerald-600 text-white rounded-[40px] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest border border-white/30">Resolution Mode</span>
            <span className="px-4 py-1.5 bg-emerald-400 text-emerald-900 rounded-full text-xs font-black uppercase tracking-widest">{result.confidenceScore}% Confidence</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter">The Resolution Path</h1>
          <p className="text-xl text-emerald-100 max-w-2xl leading-relaxed">{result.executiveSummary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <Section id="roadmap" title="Step-by-Step Fix" isOpen={openSections.includes('roadmap')} onToggle={toggleSection} accent="emerald">
            <div className="space-y-8">
              {result.phases?.map((phase, pi) => (
                <div key={pi} className="relative pl-10 border-l-2 border-emerald-100 pb-8 last:pb-0">
                  <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-black">{pi+1}</div>
                  <h4 className="text-2xl font-black text-slate-800 mb-6">{phase.name}</h4>
                  <div className="space-y-4">
                    {phase.tasks.map((task, ti) => (
                      <div key={ti} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg transition-all">
                        <h5 className="font-black text-slate-800 text-lg mb-1">{task.title}</h5>
                        <p className="text-stone-500 text-sm mb-4">{task.description}</p>
                        <div className="flex flex-wrap gap-3">
                          <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg border border-emerald-100">Expected: {task.expectedOutcome}</span>
                          {task.mitigation && <span className="text-[10px] font-black uppercase bg-amber-50 text-amber-600 px-3 py-1 rounded-lg border border-amber-100">Safety: {task.mitigation}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
        <div className="md:col-span-4 space-y-6">
          <Section id="causes" title="Root Causes" isOpen={openSections.includes('causes')} onToggle={toggleSection} accent="rose">
            <ul className="space-y-3">
              {result.rootCauses?.map((rc, i) => (
                <li key={i} className="text-sm font-medium text-stone-600 flex gap-2">
                  <span className="text-rose-400">●</span> {rc}
                </li>
              ))}
            </ul>
          </Section>
          <Section id="resources" title="Resources Needed" isOpen={openSections.includes('resources')} onToggle={toggleSection} accent="indigo">
            <div className="flex flex-wrap gap-2">
              {result.resourcesNeeded?.map((r, i) => (
                <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-xl border border-indigo-100">{r}</span>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );

  const renderPlanning = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Existing high-fidelity Planning Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-slate-900 text-white rounded-[40px] p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-6">
             <span className="px-4 py-1.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest border border-white/30">Strategic Mode</span>
             <h1 className="text-5xl font-black tracking-tighter">The Strategic Forest</h1>
             <p className="text-xl text-stone-300 max-w-2xl leading-relaxed">{result.executiveSummary}</p>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 leading-relaxed">{result.certificationReasoning}</p>
          </div>
        </div>
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[40px] border border-stone-200 p-8 flex flex-col items-center justify-center shadow-sm">
             <span className="text-4xl font-black text-emerald-600 mb-2">{result.qualityScore}%</span>
             <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 text-center">Plan Quality Score</span>
          </div>
          <div className="bg-white rounded-[40px] border border-stone-200 p-8 flex flex-col items-center justify-center shadow-sm">
             <span className="text-4xl font-black text-rose-600 mb-2">{result.riskScore}%</span>
             <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 text-center">Residual Risk</span>
          </div>
        </div>
      </div>

      <Section id="roadmap" title="Growth Roadmap" isOpen={openSections.includes('roadmap')} onToggle={toggleSection} accent="emerald">
        <div className="space-y-12 py-6">
          {result.phases?.map((phase, pi) => (
            <div key={pi} className="relative pl-12 border-l-2 border-emerald-100 last:border-transparent">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-white shadow-xl flex items-center justify-center text-white text-[10px] font-black">{pi+1}</div>
              <div className="mb-8">
                <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{phase.name}</h4>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Milestone: {phase.milestone}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {phase.tasks.map((task, ti) => (
                  <div key={ti} className="bg-stone-50 p-8 rounded-[32px] border-2 border-stone-100 hover:border-emerald-200 hover:bg-white transition-all group">
                    <h5 className="text-xl font-black text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">{task.title}</h5>
                    <p className="text-sm text-stone-500 leading-relaxed mb-6">{task.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-stone-200/50">
                       <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Base Risk: {task.baseRisk}%</span>
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Residual: {task.residualRisk}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
      {result.intent === 'information' && renderInformation()}
      {result.intent === 'problem_solving' && renderProblemSolving()}
      {(result.intent === 'strategic_plan' || result.intent === 'mixed') && renderPlanning()}

      {/* Footer Controls */}
      <div className="pt-12 border-t border-stone-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="space-y-2">
            <h5 className="text-xs font-black uppercase tracking-widest text-stone-400">Next Options</h5>
            <div className="flex flex-wrap gap-2">
              {result.nextOptions.map((opt, i) => (
                <button key={i} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-xs font-bold transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <Button variant="secondary" className="rounded-3xl py-6 px-12" onClick={onReset}>
            New Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
