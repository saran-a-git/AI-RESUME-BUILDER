import React, { useState } from 'react';
import { SavedResume } from '../types';
import { 
  FileText, Calendar, Trash2, Star, Download, Sparkles, BarChart2, 
  Settings, User, Plus, Edit2, Check, Clock, TrendingUp, Heart
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

interface DashboardViewProps {
  savedResumes: SavedResume[];
  currentResumeId: string;
  onSelectResume: (id: string) => void;
  onDeleteResume: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRenameResume: (id: string, newTitle: string) => void;
  onCreateNewResume: () => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  savedResumes,
  currentResumeId,
  onSelectResume,
  onDeleteResume,
  onToggleFavorite,
  onRenameResume,
  onCreateNewResume,
  addToast
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState<string>('');

  // Sample analytics data for Recharts
  const scoreHistoryData = [
    { date: 'July 01', score: 62 },
    { date: 'July 05', score: 68 },
    { date: 'July 10', score: 72 },
    { date: 'July 15', score: 78 },
    { date: 'July 21', score: 94 }
  ];

  const skillDistributionData = [
    { name: 'Core Languages', density: 85 },
    { name: 'SaaS Frameworks', density: 92 },
    { name: 'Database / SQL', density: 78 },
    { name: 'Cloud Deployments', density: 65 },
    { name: 'CI/CD Pipelines', density: 80 }
  ];

  const handleStartRename = (resume: SavedResume) => {
    setEditingId(resume.id);
    setRenameTitle(resume.title);
  };

  const handleFinishRename = (id: string) => {
    if (renameTitle.trim()) {
      onRenameResume(id, renameTitle.trim());
      addToast('Resume draft renamed successfully!', 'success');
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Metric Counter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Saved Drafts', value: savedResumes.length, desc: 'Active resume versions', icon: FileText, color: 'text-indigo-500 bg-indigo-50 border-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20' },
          { label: 'Average ATS Index', value: '81%', desc: 'Optimized score ratio', icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20' },
          { label: 'Cloud Downloads', value: '14', desc: 'SaaS PDF exports', icon: Download, color: 'text-cyan-500 bg-cyan-50 border-cyan-100 dark:text-cyan-400 dark:bg-cyan-500/10 dark:border-cyan-500/20' },
          { label: 'Favorites Starred', value: savedResumes.filter(r => r.atsScore && r.atsScore >= 80).length, desc: 'Drafts with high compatibility', icon: Star, color: 'text-amber-500 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white/95 dark:bg-white/[0.02] backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 p-4 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{item.label}</span>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{item.value}</h3>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">{item.desc}</span>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytical Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Area Chart score tracker */}
        <div className="bg-white dark:bg-white/[0.02] dark:backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 p-5 shadow space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-cyan-400">ATS Progress History Timeline</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Timeline tracking of average score improvements over time.</p>
          </div>
          <div className="h-48 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[50, 100]} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Bar Chart core competency ratings */}
        <div className="bg-white dark:bg-white/[0.02] dark:backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 p-5 shadow space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-cyan-400">Resume Competency Densities</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Rating distributions on core resume segments.</p>
          </div>
          <div className="h-48 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Bar dataKey="density" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Saved Resumes Lists */}
      <div className="bg-white dark:bg-white/[0.02] dark:backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 p-5 shadow space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Saved Resume Versions ({savedResumes.length})</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Select drafts to edit on Builder, toggle priority stars, or download.</p>
          </div>
          
          <button
            onClick={onCreateNewResume}
            className="px-3 py-1.5 bg-slate-900 dark:bg-cyan-500 hover:bg-slate-800 dark:hover:bg-cyan-400 text-white dark:text-black text-xs font-bold rounded-xl flex items-center gap-1 transition shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Draft
          </button>
        </div>

        <div className="space-y-3">
          {savedResumes.map((resume) => {
            const isActive = currentResumeId === resume.id;
            return (
              <div 
                key={resume.id} 
                className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition relative ${
                  isActive 
                    ? 'border-slate-800 bg-slate-50/50 dark:border-cyan-500/40 dark:bg-white/[0.04] ring-1 ring-slate-800 dark:ring-cyan-500/40' 
                    : 'hover:bg-slate-50/30 dark:hover:bg-white/[0.02] border-slate-100 dark:border-white/5'
                }`}
              >
                {/* Draft details left */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isActive 
                      ? 'bg-slate-900 text-white border-slate-950 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-500/30' 
                      : 'bg-slate-50 border-slate-100 text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-slate-400'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  
                  <div>
                    {editingId === resume.id ? (
                      <div className="flex gap-1.5 items-center">
                        <input 
                          type="text"
                          value={renameTitle}
                          onChange={(e) => setRenameTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleFinishRename(resume.id)}
                          className="px-2 py-0.5 border dark:border-white/10 bg-white dark:bg-slate-950 text-slate-800 dark:text-white rounded text-xs focus:ring-1 focus:ring-cyan-500"
                        />
                        <button 
                          onClick={() => handleFinishRename(resume.id)}
                          className="p-1 bg-indigo-50 dark:bg-cyan-500/20 text-indigo-600 dark:text-cyan-400 rounded hover:bg-indigo-100 dark:hover:bg-cyan-500/30"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-white">{resume.title}</h5>
                        <button 
                          onClick={() => handleStartRename(resume)}
                          className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2.5 text-[10px] text-slate-400 mt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        Modified {new Date(resume.updatedAt).toLocaleDateString()}
                      </span>
                      {resume.atsScore && (
                        <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[9px] ${
                          resume.atsScore >= 80 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-500/20' 
                            : 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-500/20'
                        }`}>
                          ATS: {resume.atsScore}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Draft management buttons right */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                  <button
                    onClick={() => {
                      onSelectResume(resume.id);
                      addToast(`Selected draft "${resume.title}" on builder!`, 'info');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                      isActive 
                        ? 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 dark:border-transparent' 
                        : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {isActive ? 'Currently Editing' : 'Load into Builder'}
                  </button>

                  <button 
                    onClick={() => onToggleFavorite(resume.id)}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 border border-slate-200 dark:border-white/10 rounded-lg transition"
                    title="Toggle Favorite draft"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => {
                      if (savedResumes.length <= 1) {
                        addToast('Cannot delete the last remaining resume version.', 'error');
                        return;
                      }
                      onDeleteResume(resume.id);
                    }}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 rounded-lg transition"
                    title="Delete Draft version"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
