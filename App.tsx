
import React, { useState, useEffect } from 'react';
import { AppState, UserPlan, AnalysisResult } from './types';
import Landing from './components/Landing';
import PlanInput from './components/PlanInput';
import AnalysisView from './components/AnalysisView';
import { analyzePlan } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('landing');
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => setState('input');

  const handleAnalyze = async (userPlan: UserPlan) => {
    setPlan(userPlan);
    setState('analyzing');
    setError(null);
    
    try {
      const result = await analyzePlan(userPlan);
      setAnalysis(result);
      setState('result');
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Analysis failed. This might be due to an invalid API key or content restrictions. Please try again.");
      setState('input');
    }
  };

  const handleReset = () => {
    setState('input');
    setAnalysis(null);
    setPlan(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <nav className="p-6 md:px-12 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-50 border-b border-stone-100">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setState('landing')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-800">PlanPulse</span>
        </div>
        <div className="hidden md:flex gap-8 items-center text-sm font-bold text-stone-400 uppercase tracking-widest">
          <span className="hover:text-indigo-600 transition-colors cursor-pointer">Method</span>
          <span className="hover:text-indigo-600 transition-colors cursor-pointer">About</span>
          <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-[10px] border border-stone-200">Beta</span>
        </div>
      </nav>

      <main className="pb-24">
        {state === 'landing' && (
          <Landing onStart={handleStart} />
        )}

        {state === 'input' && (
          <div className="pt-8">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Define Your Plan</h2>
              <p className="text-stone-500 max-w-xl mx-auto text-lg">
                The more specific you are, the better my analysis will be. Paste your thoughts below.
              </p>
              {error && (
                <div className="max-w-md mx-auto bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
                  {error}
                </div>
              )}
            </div>
            <PlanInput onAnalyze={handleAnalyze} />
          </div>
        )}

        {state === 'analyzing' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 p-4">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-stone-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg animate-pulse">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
              </div>
            </div>
            <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h2 className="text-2xl font-bold text-slate-800">Reviewing your blueprint...</h2>
              <p className="text-stone-500 max-w-sm mx-auto">
                Identifying flaws, calculating risks, and hunting for logical gaps without changing your original vision.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        {state === 'result' && analysis && plan && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <AnalysisView result={analysis} plan={plan} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
