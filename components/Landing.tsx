
import React from 'react';
import Button from './Button';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden pt-16 md:pt-32 px-6">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto text-center space-y-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-stone-100 text-xs font-bold text-indigo-600 uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Professional Plan Reviewer
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Improve your plan <br />
            <span className="text-indigo-600">without changing</span> your idea.
          </h1>
          <p className="text-xl md:text-2xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Paste your plan, and I’ll help you identify risks, fill gaps, and refine your execution—while keeping you in total control.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Button variant="secondary" size="lg" className="px-10 rounded-2xl group shadow-xl" onClick={onStart}>
            Start Plan Review
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
          <Button variant="ghost" size="lg" className="text-stone-400">
            See Example Review
          </Button>
        </div>

        <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Stay in Control', desc: 'I never hijack your vision. I only point out the blind spots so you can fix them.', icon: '🛡️' },
            { title: 'Critical Insight', desc: 'Detect logical gaps, unrealistic budgets, and timing risks before they happen.', icon: '🔍' },
            { title: 'Supportive Tone', desc: 'Honest, grounded feedback that feels like a thinking partner, not a boss.', icon: '🤝' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm text-left hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
