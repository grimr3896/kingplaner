
import React, { useState, useMemo } from 'react';
import { UserPlan, FocusArea, PlanMode, RiskLevel } from '../types';
import { FOCUS_AREAS } from '../constants';
import Button from './Button';

interface PlanInputProps {
  onAnalyze: (plan: UserPlan) => void;
}

const PlanInput: React.FC<PlanInputProps> = ({ onAnalyze }) => {
  const [text, setText] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<FocusArea[]>(['Everything']);
  const [mode, setMode] = useState<PlanMode>('review');
  const [riskPref, setRiskPref] = useState<RiskLevel>('moderate');

  const stats = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    let type: UserPlan['type'] = 'General';
    if (/business|market|product|revenue|customer/i.test(text)) type = 'Business';
    else if (/study|exam|learn|course|degree/i.test(text)) type = 'Study';
    else if (/code|tech|architecture|api|server/i.test(text)) type = 'Tech';

    return { words, type };
  }, [text]);

  const toggleFocus = (area: FocusArea) => {
    if (area === 'Everything') {
      setSelectedFocus(['Everything']);
      return;
    }
    const newFocus = selectedFocus.filter(f => f !== 'Everything');
    if (newFocus.includes(area)) {
      const filtered = newFocus.filter(f => f !== area);
      setSelectedFocus(filtered.length === 0 ? ['Everything'] : filtered);
    } else {
      if (newFocus.length < 3) setSelectedFocus([...newFocus, area]);
    }
  };

  const riskOptions: { id: RiskLevel; label: string; icon: string; desc: string; color: string }[] = [
    { id: 'low', label: 'Low Risk', icon: '🛡️', desc: 'Safest path (~0-20% risk)', color: 'border-emerald-200 hover:bg-emerald-50 text-emerald-700' },
    { id: 'moderate', label: 'Moderate', icon: '⚖️', desc: 'Balanced (~30-50% risk)', color: 'border-indigo-200 hover:bg-indigo-50 text-indigo-700' },
    { id: 'high', label: 'High Risk', icon: '🚀', desc: 'Aggressive (~50-80% risk)', color: 'border-amber-200 hover:bg-amber-50 text-amber-700' },
    { id: 'full', label: 'Full Control', icon: '💀', desc: 'No risk filtering', color: 'border-rose-200 hover:bg-rose-50 text-rose-700' },
  ];

  const handleSubmit = () => {
    if (text.length < 10) return;
    onAnalyze({
      text,
      type: stats.type,
      focusAreas: selectedFocus,
      mode: mode,
      riskPreference: riskPref
    });
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex bg-stone-200/50 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setMode('review')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'review' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Plan Audit
          </button>
          <button 
            onClick={() => setMode('develop')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'develop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Strategic Expansion
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={mode === 'review' 
              ? "Paste your detailed plan. I'll run the QVE loop to find vulnerabilities..." 
              : "Describe your seed idea. I'll architect a multi-phase strategic forest..."}
            className="w-full h-[350px] p-8 text-lg text-slate-700 bg-transparent border-none focus:ring-0 resize-none placeholder:text-stone-300"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-[0.2em]">Risk Appetite</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {riskOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRiskPref(opt.id)}
                className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all text-center gap-1 ${
                  riskPref === opt.id ? 'bg-white border-indigo-600 shadow-lg scale-105 z-10' : `bg-white border-transparent ${opt.color}`
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="text-sm font-bold">{opt.label}</span>
                <span className="text-[10px] opacity-70 leading-tight">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-[0.2em]">Analysis Focus</h3>
          <div className="flex flex-wrap gap-2">
            {FOCUS_AREAS.map((area) => (
              <button
                key={area.id}
                onClick={() => toggleFocus(area.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedFocus.includes(area.id)
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                }`}
              >
                {area.icon} {area.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8 h-fit lg:sticky lg:top-8">
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-800">Engine Config</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-stone-50">
                <span className="text-stone-500 text-sm">Mode</span>
                <span className="font-bold text-sm text-indigo-600">{mode === 'develop' ? 'Architect' : 'Auditor'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-50">
                <span className="text-stone-500 text-sm">Risk Layer</span>
                <span className="font-bold text-sm uppercase">{riskPref}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-50">
                <span className="text-stone-500 text-sm">Domain Sync</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 text-xs text-stone-500 italic leading-relaxed">
            "Every node in your plan will be validated against its Base Risk vs. Residual Risk after my strategic interventions."
          </div>

          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full py-5 rounded-2xl shadow-xl shadow-stone-200" 
            disabled={text.length < 15}
            onClick={handleSubmit}
          >
            {mode === 'develop' ? 'Generate Forest' : 'Run QVE Audit'}
          </Button>
          
          <p className="text-[10px] text-center text-stone-400 font-bold tracking-widest uppercase">
            PlanPulse Strategic v3.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanInput;
