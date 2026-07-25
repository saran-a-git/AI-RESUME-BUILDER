import React, { useState } from 'react';
import { Settings, Users, Sparkles, AlertCircle, BarChart2, CheckSquare, MessageSquare, Shield, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AdminPanelProps {
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ addToast }) => {
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('analyzer');
  const [editingPrompt, setEditingPrompt] = useState<string>(
    `You are an expert HR recruiter, ATS system engineer, and career coach. Your task is to analyze the provided resume text thoroughly and check its compatibility with ATS algorithms, grammatical correctness, and general resume standards. If a job description is provided, compute a specialized Job Match score.`
  );

  const mockFeedbackList = [
    { id: 'fb-1', user: 'saran8248850@gmail.com', rate: 5, comment: 'Bypassed Stripe and Canva resume screens flawlessly! Amazing score precision.', date: '2026-07-20' },
    { id: 'fb-2', user: 'johndoe@webdev.com', rate: 4, comment: 'The Google XYZ bullet generator is stellar, saved me hours of head-scratching.', date: '2026-07-18' },
    { id: 'fb-3', user: 'clarissa.k@design.io', rate: 5, comment: 'Glassmorphic design options look incredibly premium. Best resume suite ever!', date: '2026-07-15' }
  ];

  const adminStats = [
    { label: 'Total Registered Users', value: '14,284', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Resumes Generated', value: '104,821', icon: BarChart2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'AI Api Calls / Day', value: '824', icon: Sparkles, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
    { label: 'Average Platform Score', value: '84.2%', icon: CheckSquare, color: 'text-amber-600 bg-amber-50 border-amber-100' }
  ];

  const promptCategories = [
    { id: 'analyzer', name: 'Resume Analyzer System Prompt', desc: 'Dictates ATS checklist weightings and red-flags extraction rules.' },
    { id: 'corrector', name: 'One-Click Corrector Instructions', desc: 'Directs the Google X-Y-Z formula bullet formatting logic.' },
    { id: 'cover-letter', name: 'Cover Letter Copywriter Prompt', desc: 'Sets vocal guidelines and hook persuasiveness scales.' },
    { id: 'coach', name: 'Coach Carter Chat personality', desc: 'Isolates friendly mentorship scales and contextual filters.' }
  ];

  const handleUpdatePrompt = () => {
    addToast(`Successfully updated ${selectedPromptCategory} system prompt parameters!`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner warning */}
      <div className="p-4 border border-rose-500/20 rounded-2xl bg-rose-500/10 text-xs flex gap-3 items-start">
        <Shield className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-rose-400 font-bold">Platform Administrators Authorization Gate:</strong>
          <p className="text-rose-300/80 mt-1">You are currently accessing the ResumeAI Pro Administrative Panel. Actions executed here actively re-tune system models, prompt schemas, and analytics logs.</p>
        </div>
      </div>

      {/* Admin stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {adminStats.map((item, idx) => {
          const Icon = item.icon;
          // Determine custom icon backgrounds for immersive dark look
          let iconBg = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
          if (idx === 1) iconBg = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
          if (idx === 2) iconBg = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
          if (idx === 3) iconBg = 'text-amber-400 bg-amber-500/10 border-amber-500/20';

          return (
            <div key={idx} className="bg-white dark:bg-white/[0.02] dark:backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 p-4 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block tracking-wider">{item.label}</span>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mt-1">{item.value}</h3>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Core management modules split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Prompts manager Left Column */}
        <div className="lg:col-span-8 bg-white dark:bg-white/[0.02] dark:backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 p-5 shadow space-y-4">
          <div className="flex justify-between items-center border-b dark:border-white/10 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
                Manage System AI Prompts
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Adjust real-time models instructions to alter parsing accuracy.</p>
            </div>
            <button
              onClick={handleUpdatePrompt}
              className="px-3 py-1.5 bg-slate-900 dark:bg-cyan-500 hover:bg-slate-800 dark:hover:bg-cyan-400 text-white dark:text-black text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Apply Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* list prompt channels left */}
            <div className="md:col-span-4 space-y-1.5 border-r border-slate-50 dark:border-white/10 pr-2">
              {promptCategories.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setSelectedPromptCategory(tpl.id);
                    if (tpl.id === 'analyzer') {
                      setEditingPrompt(`You are an expert HR recruiter, ATS system engineer, and career coach. Your task is to analyze the provided resume text thoroughly and check its compatibility with ATS algorithms, grammatical correctness, and general resume standards. If a job description is provided, compute a specialized Job Match score.`);
                    } else if (tpl.id === 'corrector') {
                      setEditingPrompt(`You are a professional resume writer. Your job is to correct the input resume data. Enhance grammar, substitute weak verbs with power/action verbs, remove filler words, format summaries to be high-impact, and optimize experience statements to follow the Google X-Y-Z formula.`);
                    } else if (tpl.id === 'cover-letter') {
                      setEditingPrompt(`You are a highly persuasive professional copywriter. Write a tailored, executive cover letter that connects the candidate's achievements to the requirements of the job description in an authentic, impactful tone. No generic templates or placeholders.`);
                    } else {
                      setEditingPrompt(`You are "Coach Carter", the elite Career Coach and Interview Strategist at ResumeAI Pro. You are friendly, encouraging, highly analytical, and strategic.`);
                    }
                    addToast(`Loaded ${tpl.name} prompt context!`, 'info');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition ${selectedPromptCategory === tpl.id ? 'bg-slate-50 dark:bg-white/10 border-l-2 border-cyan-500 dark:border-cyan-400' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                >
                  <h5 className="text-[11px] font-bold text-slate-800 dark:text-white truncate">{tpl.name}</h5>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">{tpl.desc}</p>
                </button>
              ))}
            </div>

            {/* Prompt editing text area right */}
            <div className="md:col-span-8 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">Active System Prompt Payload</label>
              <textarea 
                rows={7}
                value={editingPrompt}
                onChange={(e) => setEditingPrompt(e.target.value)}
                className="w-full mt-1.5 p-3 border dark:border-white/10 bg-slate-50/50 dark:bg-slate-950 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 focus:outline-none leading-relaxed"
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 italic block mt-1">Variables injected at runtime: <b>{"{resumeText}"}</b>, <b>{"{jobDescription}"}</b></span>
            </div>
          </div>
        </div>

        {/* Feedback logs list Right Column */}
        <div className="lg:col-span-4 bg-white dark:bg-white/[0.02] dark:backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 p-5 shadow space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <MessageSquare className="w-4.5 h-4.5 text-slate-400" />
              SaaS Feedback Reports
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Real-time user satisfaction metrics.</p>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {mockFeedbackList.map((fb) => (
              <div key={fb.id} className="p-3 border dark:border-white/10 rounded-xl text-xs space-y-1.5 bg-slate-50/30 dark:bg-slate-950/40 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  <span className="truncate max-w-[140px]">{fb.user}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {fb.date}
                  </span>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {Array.from({ length: fb.rate }).map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="italic leading-normal">{fb.comment}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
