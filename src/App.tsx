import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, CheckCircle, Shield, ArrowRight, Star, HelpCircle, 
  Menu, X, Sun, Moon, LogIn, LogOut, ChevronDown, Award, TrendingUp, HelpCircle as HelpIcon, Bell 
} from 'lucide-react';

// Core Sub-module Components
import { ResumeBuilder } from './components/ResumeBuilder';
import { ResumePreview } from './components/ResumePreview';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { JobMatcher } from './components/JobMatcher';
import { CareerCoach } from './components/CareerCoach';
import { DashboardView } from './components/DashboardView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';

// Shared Data
import { SAVED_RESUMES_MOCK, FAQ_ITEMS, PRICING_PACKAGES, TEMPLATES, COLORS, FONTS } from './data';
import { ResumeData, SavedResume } from './types';

export default function App() {
  // Navigation & View Router State
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'builder' | 'analyzer' | 'matcher' | 'coach' | 'admin'>('landing');
  
  // App-wide Light/Dark Mode State (Tailwind based)
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // Authenticated User State
  const [userEmail, setUserEmail] = useState<string | null>('saran8248850@gmail.com'); // Mock initialized
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Resume State Management
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>(SAVED_RESUMES_MOCK);
  const [currentResumeId, setCurrentResumeId] = useState<string>(SAVED_RESUMES_MOCK[0].id);

  // Toast System State
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'error' | 'info' }[]>([]);

  // Pricing Interval Toggle
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // FAQ Expanded index state
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(null);

  // Find active resume item
  const activeSavedResume = savedResumes.find(r => r.id === currentResumeId) || savedResumes[0];
  const [currentResumeData, setCurrentResumeData] = useState<ResumeData>(activeSavedResume.data);

  // Sync state whenever selection changes
  useEffect(() => {
    const selected = savedResumes.find(r => r.id === currentResumeId);
    if (selected) {
      setCurrentResumeData(selected.data);
    }
  }, [currentResumeId, savedResumes]);

  // Toast adder function
  const addToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Light/Dark mode toggling effects
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    addToast(`Switched to ${!darkMode ? 'Dark Mode' : 'Light Mode'}`, 'info');
  };

  // Resume lifecycle updates
  const handleUpdateResume = (updatedData: ResumeData) => {
    setCurrentResumeData(updatedData);
    
    // Also save back to SavedResumes history
    setSavedResumes(prev => prev.map(item => {
      if (item.id === currentResumeId) {
        return {
          ...item,
          data: updatedData,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));
  };

  const handleSelectResume = (id: string) => {
    setCurrentResumeId(id);
    setActiveTab('builder');
  };

  const handleDeleteResume = (id: string) => {
    setSavedResumes(prev => prev.filter(item => item.id !== id));
    if (currentResumeId === id) {
      const remaining = savedResumes.filter(item => item.id !== id);
      if (remaining.length > 0) {
        setCurrentResumeId(remaining[0].id);
      }
    }
    addToast('Resume draft deleted!', 'info');
  };

  const handleToggleFavorite = (id: string) => {
    setSavedResumes(prev => prev.map(item => {
      if (item.id === id) {
        const nextScore = item.atsScore === 95 ? 78 : 95; // simulation toggle
        addToast(nextScore === 95 ? 'Draft added to favorites!' : 'Draft removed from favorites', 'success');
        return { ...item, atsScore: nextScore };
      }
      return item;
    }));
  };

  const handleRenameResume = (id: string, newTitle: string) => {
    setSavedResumes(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, title: newTitle };
      }
      return item;
    }));
  };

  const handleCreateNewResume = () => {
    const newId = `resume-${Date.now()}`;
    const newDraft: SavedResume = {
      id: newId,
      title: `ATS Draft V${savedResumes.length + 1}`,
      updatedAt: new Date().toISOString(),
      atsScore: 70,
      data: {
        id: newId,
        title: `ATS Draft V${savedResumes.length + 1}`,
        personalInfo: {
          name: 'Alex Mercer',
          title: 'Senior Software Architect',
          email: 'alex.mercer@devmail.com',
          phone: '+1 (555) 019-2834',
          location: 'San Francisco, CA',
          github: 'github.com/alexmercer',
          linkedin: 'linkedin.com/in/alexmercer',
          portfolio: 'alexmercer.dev'
        },
        summary: 'Driven developer seeking to build and optimize next generation SaaS platforms.',
        experience: [
          {
            id: 'exp-1',
            role: 'Software Architect',
            company: 'NextGen Systems',
            location: 'San Francisco, CA',
            startDate: '2024-01',
            endDate: '',
            current: true,
            description: [
              'Pioneered backend API migrations utilizing high throughput structures.',
              'Spearheaded deployment automation routines reducing downtime margins.'
            ]
          }
        ],
        education: [
          {
            id: 'edu-1',
            degree: 'B.S. Computer Science',
            school: 'Stanford University',
            location: 'Stanford, CA',
            gradDate: '2020-05',
            gpa: '3.90',
            details: 'Dean\'s list honors.'
          }
        ],
        skills: ['React', 'NodeJS', 'GraphQL', 'AWS', 'PostgreSQL', 'Docker'],
        projects: [
          {
            id: 'proj-1',
            name: 'Micro-Service Ingress',
            role: 'Lead Developer',
            tech: 'React, Go, Docker',
            description: ['Handled heavy transaction loads through optimized message structures.']
          }
        ],
        internships: [],
        certifications: [
          {
            id: 'cert-1',
            name: 'AWS Solutions Architect Associate',
            issuer: 'Amazon',
            date: '2023-11'
          }
        ],
        achievements: [],
        languages: ['English'],
        hobbies: [],
        references: 'Available upon request.',
        templateId: 'swe-1',
        primaryColor: '#4f46e5',
        fontFamily: "'Poppins', sans-serif",
        fontSize: 'md',
        layoutOrder: ['summary', 'experience', 'education', 'skills'],
        showPhoto: false,
        updatedAt: new Date().toISOString()
      }
    };

    setSavedResumes(prev => [...prev, newDraft]);
    setCurrentResumeId(newId);
    setActiveTab('builder');
    addToast('New ATS Draft version successfully initialized!', 'success');
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative overflow-hidden ${darkMode ? 'dark bg-[#05070a] text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Background Orbs (Immersive UI) */}
      {darkMode && (
        <>
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none z-0"></div>
        </>
      )}

      {/* Toast Notification Stream Overlay */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 transition-all duration-300 translate-y-0 pointer-events-auto ${
              t.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-500/30 dark:text-emerald-200' : 
              t.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800 dark:bg-rose-950/90 dark:border-rose-500/30 dark:text-rose-200' : 
              'bg-slate-900 border-slate-950 text-white dark:bg-slate-900/90 dark:border-white/10'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
            <p className="text-xs font-semibold leading-tight">{t.msg}</p>
          </div>
        ))}
      </div>

      {/* HEADER SECTION */}
      <header className={`sticky top-0 z-40 border-b transition-all ${darkMode ? 'bg-[#05070a]/80 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
          
          {/* Logo Brand */}
          <div 
            onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(34,211,238,0.25)] group-hover:scale-105 transition-all">
              R
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider text-slate-900 dark:text-white uppercase">ResumeAI <span className="text-cyan-400">Pro</span></h1>
              <span className="text-[9px] text-slate-400 font-bold block uppercase -mt-1 tracking-widest">Core Portal v3.6</span>
            </div>
          </div>

          {/* Desktop Nav Routing Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-bold">
            {[
              { id: 'landing', label: 'Home' },
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'builder', label: 'AI Resume Builder' },
              { id: 'analyzer', label: 'Resume Analyzer' },
              { id: 'matcher', label: 'Job Matcher' },
              { id: 'coach', label: 'Career Coach' },
              { id: 'admin', label: 'Admin' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-3 py-1.5 rounded-lg transition-all duration-300 border ${
                  activeTab === tab.id 
                    ? (darkMode ? 'bg-white/10 text-white border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'bg-slate-900 text-white border-slate-900') 
                    : (darkMode ? 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent' : 'text-slate-600 hover:bg-slate-100 border-transparent')
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Quick Action bar icons, Dark Mode toggle & User session Profile */}
          <div className="flex items-center gap-2 relative z-10">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition ${darkMode ? 'text-amber-400 bg-white/5 border border-white/10 hover:bg-white/10' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}
              title="Toggle Theme Colorways"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Auth Session Button */}
            {userEmail ? (
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-white/10 pl-2">
                <div className="hidden sm:block text-right">
                  <span className="text-[10px] font-bold text-slate-800 dark:text-white block leading-none">{userEmail.split('@')[0]}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">SaaS Member</span>
                </div>
                <button 
                  onClick={() => { setUserEmail(null); addToast('User Session logged out successfully.', 'info'); }}
                  className={`p-2 rounded-xl transition ${darkMode ? 'bg-rose-950/40 text-rose-400 border border-rose-900/30 hover:bg-rose-950/70' : 'p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100/50'}`}
                  title="Logout Account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className={`px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1 ${
                  darkMode 
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black rounded-full shadow-[0_0_15px_rgba(34,211,238,0.35)]' 
                    : 'bg-slate-900 text-white rounded-xl shadow hover:opacity-90'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

            {/* Mobile Nav Menu Drawer Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu overlay list */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-1.5 bg-white dark:bg-slate-950 flex flex-col text-xs font-bold">
            {[
              { id: 'landing', label: 'Home Page' },
              { id: 'dashboard', label: 'User Dashboard' },
              { id: 'builder', label: 'AI Resume Builder' },
              { id: 'analyzer', label: 'ATS Analyzer Check' },
              { id: 'matcher', label: 'JD Job Matcher' },
              { id: 'coach', label: 'Coach Carter Chat' },
              { id: 'admin', label: 'Platform Admin' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setMobileMenuOpen(false); }}
                className={`w-full text-left p-3 rounded-xl transition ${activeTab === tab.id ? 'bg-slate-900 dark:bg-slate-900 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* CORE PORTAL APP VIEWS ROUTER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: SAAS LANDING PAGE */}
        {activeTab === 'landing' && (
          <div className="space-y-20 py-6 animate-fade-in">
            
            {/* HERO SECTION */}
            <section className="text-center space-y-6 max-w-4xl mx-auto relative pt-8">
              <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10" />
              
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-cyan-400 border border-indigo-100 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Voted #1 ATS Optimization platform of 2026
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                Build an <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">ATS-Friendly</span> Resume That Gets You Hired
              </h2>

              <p className="text-md text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Create, analyze, and optimize your career trajectory with real-time AI intelligence and job-match scoring. Bypass enterprise applicant screening filters with ease.
              </p>

              {/* Responsive Hero buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-4">
                <button
                  onClick={() => setActiveTab('builder')}
                  className={`px-6 py-3.5 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:brightness-110 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] rounded-2xl' 
                      : 'bg-slate-900 text-white hover:opacity-95 rounded-2xl shadow-xl'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  Build Resume
                </button>
                <button
                  onClick={() => setActiveTab('analyzer')}
                  className={`px-6 py-3.5 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    darkMode 
                      ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl shadow-sm'
                  }`}
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Upload & Analyze
                </button>
                <button
                  onClick={() => setActiveTab('matcher')}
                  className={`px-6 py-3.5 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    darkMode 
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)] rounded-full' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl shadow-xl'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-cyan-300" />
                  Check ATS Score
                </button>
              </div>

              {/* Micro statistical blocks */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-center">
                {[
                  { value: '100,000+', label: 'Resumes Created' },
                  { value: '95%+', label: 'ATS Compatibilities', special: true },
                  { value: 'Gemini 3.6', label: 'AI Integration Engine' },
                  { value: 'Instant', label: 'Analysis Speed' }
                ].map((stat, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border shadow-sm transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gradient-to-br from-cyan-500/5 to-transparent border-white/5 backdrop-blur-sm' 
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <h4 className={`text-xl font-extrabold ${stat.special && darkMode ? 'text-cyan-400' : 'text-slate-800 dark:text-white'}`}>{stat.value}</h4>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* THREE SYSTEM CARDS SECTION */}
            <section className="space-y-10">
              <div className="text-center space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-cyan-400">Suite Arsenal</span>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Three High-Performance Engines. One Central Portal.</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'AI Resume Builder',
                    desc: 'Split-screen real-time editor featuring section reordering, professional templates (Modern, Minimalist, Elegant, Creative), and instant Google X-Y-Z bullet auto-expansions.',
                    tab: 'builder',
                    color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-100',
                    badge: 'Interactive Builder'
                  },
                  {
                    title: 'AI Analyzer & Corrector',
                    desc: 'Durable drag-and-drop parser mapping structural gaps, present keyword densities, formatting red-flags, and grammatical errors with a quick "One-Click Optimize" correction toggle.',
                    tab: 'analyzer',
                    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-100',
                    badge: 'Robot ATS Scan'
                  },
                  {
                    title: 'Job Matcher & Coach Carter',
                    desc: 'Paste any LinkedIn or Google target job description to compute instant compatibility levels, draft tailored Cover Letters across multiple vocal tones, and chat with Coach Carter.',
                    tab: 'matcher',
                    color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-100',
                    badge: 'Persuasive Copywriter'
                  }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`border rounded-3xl p-6 shadow-md transition-all duration-350 flex flex-col justify-between space-y-4 ${
                      darkMode 
                        ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20 hover:shadow-[0_0_25px_rgba(99,102,241,0.1)]' 
                        : `bg-gradient-to-br ${item.color} hover:shadow-xl`
                    }`}
                  >
                    <div className="space-y-2">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${
                        darkMode 
                          ? 'bg-white/5 border-white/10 text-cyan-400' 
                          : 'bg-white/80 border-slate-100 text-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                      <h4 className="text-md font-bold text-slate-800 dark:text-white pt-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                    
                    <button
                      onClick={() => setActiveTab(item.tab as any)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                        darkMode 
                          ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:brightness-110 text-white shadow-md border border-white/10' 
                          : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                      }`}
                    >
                      Initialize Module
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* HIGH FIDELITY TESTIMONIALS */}
            <section className={`rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-2xl ${
              darkMode ? 'bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-transparent border border-white/10' : 'bg-slate-900 text-white'
            }`}>
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-4 space-y-3">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Testimonials</span>
                  <h3 className="text-2xl font-black leading-tight text-white">Loved by 100,000+ <br />Career Builders</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Hear from real developers, project leads, and product designers who bypassed strict resume screen filters globally.</p>
                </div>

                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { quote: "ResumeAI completely rewrote my achievements following Google X-Y-Z protocols. Received 4 senior engineer callbacks in 1 week!", author: "Alex M. (Senior Full-Stack)", role: "Offer at Stripe" },
                    { quote: "The One-Click Corrector is sheer magic. Restored bullet grammar and instantly boosted my score from 62% to 94% compatibility.", author: "Clarissa K. (Product Designer)", role: "SaaS Enterprise applicant" }
                  ].map((item, i) => (
                    <div key={i} className={`p-5 rounded-2xl space-y-4 shadow-sm border ${
                      darkMode ? 'bg-[#05070a]/60 border-white/10' : 'bg-slate-800/80 border-slate-750'
                    }`}>
                      <div className="text-amber-400 text-xs">★★★★★</div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">"{item.quote}"</p>
                      <div className="border-t border-slate-700/50 pt-2.5">
                        <strong className="text-xs block text-slate-200">{item.author}</strong>
                        <span className="text-[10px] text-cyan-400 block mt-0.5">{item.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FLEXIBLE INTERACTIVE PRICING TABLE */}
            <section className="space-y-8">
              <div className="text-center space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-cyan-400">Flexible Pricing</span>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Fair, transparent subscriptions tailored to your career goals.</h3>
                
                {/* Billing toggle */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className={`text-xs font-bold ${billingPeriod === 'monthly' ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>Monthly</span>
                  <button 
                    onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                    className={`w-10 h-6 rounded-full p-1 transition-all flex items-center relative ${
                      darkMode ? 'bg-white/10 border border-white/10' : 'bg-slate-900'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${billingPeriod === 'yearly' ? 'translate-x-4' : ''}`} />
                  </button>
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${billingPeriod === 'yearly' ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                    Yearly
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded font-extrabold uppercase">Save 20%</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {PRICING_PACKAGES.map((plan, idx) => {
                  const isPopular = plan.popular;
                  return (
                    <div 
                      key={idx} 
                      className={`border rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                        isPopular 
                          ? (darkMode ? 'bg-gradient-to-br from-cyan-950/20 to-indigo-950/20 border-cyan-500 shadow-[0_0_25px_rgba(34,211,238,0.15)] ring-1 ring-cyan-500' : 'bg-white border-indigo-500 ring-1 ring-indigo-500')
                          : (darkMode ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]' : 'bg-white border-slate-100')
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-bl-xl tracking-wider">Most Popular</div>
                      )}
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">{plan.name}</h4>
                          <span className={`border px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide mt-1 inline-block ${
                            darkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 text-slate-500'
                          }`}>{plan.period}</span>
                        </div>

                        <div className="flex items-baseline gap-1 pt-2">
                          <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{plan.price}</span>
                        </div>

                        <ul className="space-y-2 pt-2 text-xs">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-400">
                              <span className="text-cyan-400 font-bold">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => { addToast(`Subscribed to the ${plan.name} subscription successfully!`, 'success'); }}
                        className={`w-full py-2.5 mt-6 rounded-xl text-xs font-bold transition shadow-sm ${
                          isPopular 
                            ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white' 
                            : (darkMode ? 'bg-white/10 hover:bg-white/20 border border-white/10 text-white' : 'bg-slate-900 hover:opacity-90 text-white')
                        }`}
                      >
                        {plan.cta}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ACCORDION FAQ SECTION */}
            <section className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-cyan-400">FAQ</span>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Frequently Asked Inquiries</h3>
              </div>

              <div className="space-y-2.5">
                {FAQ_ITEMS.map((faq, i) => {
                  const isExpanded = expandedFaqIdx === i;
                  return (
                    <div 
                      key={i} 
                      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                        darkMode 
                          ? 'bg-[#05070a]/60 border-white/10 hover:border-cyan-500/20' 
                          : 'bg-white border-slate-100 shadow-sm'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedFaqIdx(isExpanded ? null : i)}
                        className="w-full px-5 py-4 text-left flex justify-between items-center text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-all ${isExpanded ? 'transform rotate-180' : ''}`} />
                      </button>
                      
                      {isExpanded && (
                        <div className={`px-5 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t pt-3 ${
                          darkMode ? 'border-white/10' : 'border-slate-100'
                        }`}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* FOOTER SECTION */}
            <footer className="border-t dark:border-white/10 pt-10 pb-6 text-center text-xs space-y-4">
              <div className="flex justify-center items-center gap-1.5 font-bold uppercase text-slate-900 dark:text-white tracking-widest">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md">
                  R
                </div>
                ResumeAI Pro
              </div>
              <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">The ultimate recruiter-aligned builder, corrector, and behavioral coach platform powered by Gemini.</p>
              <div className="flex justify-center gap-6 text-slate-400 pt-2 font-medium">
                <a href="#privacy" className="hover:text-cyan-400 transition">Privacy Policy</a>
                <a href="#terms" className="hover:text-cyan-400 transition">Terms of Service</a>
                <a href="#support" className="hover:text-cyan-400 transition">Secure Status</a>
              </div>
              <p className="text-[10px] text-slate-500 pt-4">&copy; 2026 ResumeAI Pro Technologies Inc. All benchmarks protected by industry filters.</p>
            </footer>

          </div>
        )}

        {/* VIEW 2: WORKSPACE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <DashboardView 
              savedResumes={savedResumes}
              currentResumeId={currentResumeId}
              onSelectResume={handleSelectResume}
              onDeleteResume={handleDeleteResume}
              onToggleFavorite={handleToggleFavorite}
              onRenameResume={handleRenameResume}
              onCreateNewResume={handleCreateNewResume}
              addToast={addToast}
            />
          </div>
        )}

        {/* VIEW 3: SPLIT RESUME BUILDER */}
        {activeTab === 'builder' && (
          <div className="animate-fade-in">
            <ResumeBuilder 
              initialData={currentResumeData} 
              onSave={handleUpdateResume}
              templates={TEMPLATES}
              colors={COLORS}
              fonts={FONTS}
              addToast={addToast}
            />
          </div>
        )}

        {/* VIEW 4: ATS RESUME ANALYZER */}
        {activeTab === 'analyzer' && (
          <div className="animate-fade-in">
            <div className="space-y-4 max-w-4xl mx-auto">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">AI Resume Analyzer & ATS Corrector</h2>
                <p className="text-xs text-slate-400 mt-0.5">Upload existing drafts, find compatibility red flags, and trigger one-click optimizations.</p>
              </div>
              <ResumeAnalyzer 
                currentResume={currentResumeData}
                onUpdateResume={handleUpdateResume}
                addToast={addToast}
              />
            </div>
          </div>
        )}

        {/* VIEW 5: JOB MATCH DESCRIPTION COMPARATOR */}
        {activeTab === 'matcher' && (
          <div className="animate-fade-in">
            <div className="space-y-4 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Job Matching Analysis & Cover Letter Builder</h2>
                <p className="text-xs text-slate-400 mt-0.5">Test resume compatibility with target jobs, find keyword variances, and generate custom letters.</p>
              </div>
              <JobMatcher 
                currentResume={currentResumeData}
                addToast={addToast}
              />
            </div>
          </div>
        )}

        {/* VIEW 6: CAREER COACH SUITE & INTERVIEW QUESTIONS */}
        {activeTab === 'coach' && (
          <div className="animate-fade-in">
            <div className="space-y-4 max-w-5xl mx-auto">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">AI Career Coach Carter & Interview Prep</h2>
                <p className="text-xs text-slate-400 mt-0.5">Converse with custom recruiter models, isolate mock STAR behavioral prompts, and review skill timelines.</p>
              </div>
              <CareerCoach 
                currentResume={currentResumeData}
                addToast={addToast}
              />
            </div>
          </div>
        )}

        {/* VIEW 7: ADMINISTRATIVE UTILITIES PANEL */}
        {activeTab === 'admin' && (
          <div className="animate-fade-in">
            <div className="space-y-4 max-w-5xl mx-auto">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">ResumeAI Pro Platforms Command Center</h2>
                <p className="text-xs text-slate-400 mt-0.5">Fine-tune dynamic Gemini prompting weights, view system checkpoints, and review customer feedback loops.</p>
              </div>
              <AdminPanel 
                addToast={addToast}
              />
            </div>
          </div>
        )}

      </main>

      {/* LOGIN OVERLAY MODAL */}
      {isAuthOpen && (
        <AuthModal 
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(email) => { setUserEmail(email); }}
          addToast={addToast}
        />
      )}

    </div>
  );
}
