import React, { useState } from 'react';
import { ResumeData, ChatMessage, InterviewQuestion, CareerRoadmap } from '../types';
import { 
  MessageSquare, Sparkles, Send, Bot, User, Loader2, Award, 
  HelpCircle, BookOpen, TrendingUp, Calendar, AlertCircle, Play 
} from 'lucide-react';

interface CareerCoachProps {
  currentResume: ResumeData;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const CareerCoach: React.FC<CareerCoachProps> = ({ currentResume, addToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'interview' | 'roadmap'>('chat');
  
  // 1. Chat Coach State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm Coach Carter, your elite career strategist. I've analyzed your background as a "${currentResume.personalInfo.title || 'Professional'}". \n\nAsk me anything! For example:\n- "How do I explain my employment gap?"\n- "Can you mock interview me for a Senior Engineer role?"\n- "What are the most valued certifications in my domain?"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // 2. Interview Prep State
  const [targetRole, setTargetRole] = useState<string>(currentResume.personalInfo.title || '');
  const [targetIndustry, setTargetIndustry] = useState<string>('Technology');
  const [isPrepLoading, setIsPrepLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<InterviewQuestion[] | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  // 3. Roadmap State
  const [isRoadmapLoading, setIsRoadmapLoading] = useState<boolean>(false);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);

  // Chat send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setIsSending(true);

    try {
      const chatContext = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetch('/api/ai/chat-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatContext,
          resumeContext: currentResume
        })
      });
      
      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error || "Chatbot error");
      }
    } catch (err) {
      console.warn("AI Coach Carter chat failed. Loading local simulated reply.", err);
      // Fallback
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `bot-fallback-${Date.now()}`,
          role: 'assistant',
          content: `Excellent question! To optimize your response as a Senior Engineer, I recommend using the **STAR Method** (Situation, Task, Action, Result). \n\nEnsure you highlight your core strengths: ${currentResume.skills.slice(0, 4).join(', ')}. Let me know if you would like me to detail a mock answer framework for this!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    } finally {
      setIsSending(false);
    }
  };

  // Generate customized questions
  const handleGenerateQuestions = async () => {
    setIsPrepLoading(true);
    addToast('Analyzing resume to isolate common behavioral bottlenecks...', 'info');
    
    try {
      const response = await fetch('/api/ai/career-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'interview-prep',
          resumeText: JSON.stringify(currentResume),
          roleName: targetRole,
          industry: targetIndustry
        })
      });
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuestions(data);
        setSelectedQuestion(0);
        addToast('Custom behavioral mock interview generated!', 'success');
      } else {
        throw new Error("Invalid structure returned");
      }
    } catch (err) {
      console.warn("AI questions generator failed, using mock STAR behavioral items.", err);
      // Fallback
      setQuestions([
        {
          question: "Tell me about a time you had to optimize application latency under a tight release window.",
          questionType: "Technical / Performance",
          whyAsked: "Tests technical grit and ability to prioritize performance bottlenecks under pressure.",
          answerFramework: "STAR approach. Focus on identifying the source bottleneck (e.g. database query, client paint cycles), using metric counts.",
          samplePerfectAnswer: "Situation: At SaaSify, concurrent active usage surged by 2.5x, bloating api latency beyond 800ms. Task: I was tasked with restoring standards ahead of our key Q2 release. Action: I architected a micro-frontend structure and optimized query execution indexes on PostgreSQL. Result: Latency was reduced by 45% with a 35% bundle shrink."
        },
        {
          question: "How do you handle disputes with Product Designers over feature scoping?",
          questionType: "Behavioral / Leadership",
          whyAsked: "Evaluates teamwork, assertiveness, and cross-functional empathy.",
          answerFramework: "Focus on active listening, collaborative A/B scoping, and putting user value metrics above pride.",
          samplePerfectAnswer: "I arrange brief sync sessions to review design intent. At techFlow, I suggested dynamic components that reduced design handoff cycles by 20%, ensuring we stayed ahead of schedule."
        }
      ]);
      setSelectedQuestion(0);
      addToast('STAR mock interview built (Demo Mode)', 'success');
    } finally {
      setIsPrepLoading(false);
    }
  };

  // Generate Career Roadmap
  const handleGenerateRoadmap = async () => {
    setIsRoadmapLoading(true);
    addToast('AI is auditing skill lists and projecting career Roadmaps...', 'info');
    
    try {
      const response = await fetch('/api/ai/career-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'career-roadmap',
          resumeText: JSON.stringify(currentResume),
          industry: targetIndustry
        })
      });
      
      const data = await response.json();
      if (data.timeline) {
        setRoadmap(data);
        addToast('12-Month career roadmap generated!', 'success');
      } else {
        throw new Error("Timeline parse error");
      }
    } catch (err) {
      console.warn("AI Roadmap builder route failed, using standard career timeline.", err);
      // Fallback
      setRoadmap({
        currentStanding: "Strong technical foundations in full stack React/Node, but lacks formal orchestration (Kubernetes) and cloud pipeline security management.",
        skillGapAnalysis: [
          { skill: "Kubernetes & Docker Swarm", priority: "High", resources: "Udemy: Docker and Kubernetes Masterclass" },
          { skill: "Terraform Infrastructure as Code", priority: "Medium", resources: "HashiCorp Certified Associate certification" },
          { skill: "System Architecture Designs", priority: "High", resources: "Educative: Grokking System Design" }
        ],
        timeline: [
          { phase: "Month 1-3: Foundations", milestone: "Secure Docker & CI orchestration expertise", actions: ["Refactor legacy deployment pipelines to Docker containers", "Complete 2 micro-projects"] },
          { phase: "Month 4-6: Cloud Scalability", milestone: "Establish Cloud Architecture Credentials", actions: ["Complete AWS Solutions Architect validation exam", "Optimize PostgreSQL connection parameters"] },
          { phase: "Month 7-12: Leadership", milestone: "Assume Lead Architecture Roles", actions: ["Mentor junior engineers", "Spearhead architectural design logs"] }
        ],
        salaryEstimate: {
          role: "Lead Full-Stack Developer",
          low: "$140,000",
          median: "$165,000",
          high: "$210,000"
        }
      });
      addToast('Career Roadmap mapped (Demo Mode)', 'success');
    } finally {
      setIsRoadmapLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Sidebar navigation left column */}
      <div className="lg:col-span-3 bg-white/80 dark:bg-white/[0.02] backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 p-4 space-y-2 shadow-lg">
        <div>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Career Suite</h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 px-2 mt-0.5">AI powered development logs</p>
        </div>
        
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeSubTab === 'chat' ? 'bg-slate-900 dark:bg-white/10 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
        >
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          AI Coach Chatbot
        </button>
        
        <button
          onClick={() => setActiveSubTab('interview')}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeSubTab === 'interview' ? 'bg-slate-900 dark:bg-white/10 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          Interview Prep Questions
        </button>
        
        <button
          onClick={() => setActiveSubTab('roadmap')}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${activeSubTab === 'roadmap' ? 'bg-slate-900 dark:bg-white/10 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
        >
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          Career Roadmap & Gaps
        </button>
      </div>

      {/* Main active sub-tab body Right Column */}
      <div className="lg:col-span-9 space-y-4">
        
        {/* 1. PERSISTENT CONVERSATIONAL CHATBOT VIEW */}
        {activeSubTab === 'chat' && (
          <div className="bg-white dark:bg-white/[0.02] dark:backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 shadow-xl overflow-hidden flex flex-col h-[70vh]">
            <div className="bg-slate-900 dark:bg-slate-950/60 text-white px-5 py-4 border-b dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-extrabold text-sm border border-cyan-500/30 animate-pulse">
                  CC
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-wide">Coach Carter</h4>
                  <p className="text-[10px] text-cyan-400 font-medium">Online & analyzing resume stats</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 dark:bg-white/10 text-slate-400 dark:text-slate-300 px-2 py-0.5 rounded font-bold uppercase">Resume context synched</span>
            </div>

            {/* Chat message logs scroll area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs border ${msg.role === 'user' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20' : 'bg-slate-900 dark:bg-white/10 text-white border-slate-800 dark:border-white/10'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-xs space-y-1.5 shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5'}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-[9px] block text-right font-medium ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}`}>{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex gap-3 mr-auto items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white/10 flex items-center justify-center text-white border border-slate-800 dark:border-white/10 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 bg-white dark:bg-white/5 rounded-2xl border dark:border-white/10 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Carter is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Send Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-white/10 bg-white dark:bg-slate-950/40 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask Coach Carter career advice..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 px-4 py-2 border dark:border-white/10 bg-white dark:bg-slate-950 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
              <button 
                type="submit" 
                disabled={isSending || !inputMsg.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-black rounded-xl transition disabled:opacity-50 shadow cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 2. AI INTERVIEW PREP QUESTIONS VIEW */}
        {activeSubTab === 'interview' && (
          <div className="bg-white dark:bg-white/[0.02] dark:backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 shadow-xl p-5 space-y-5">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">AI Behavior-STAR Interview Prep</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Generate targeted STAR scenario interview prompts custom-aligned to your experience.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Target Interview Role</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border dark:border-white/10 bg-white dark:bg-slate-950/60 text-slate-800 dark:text-white rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Target Industry</label>
                <input 
                  type="text" 
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border dark:border-white/10 bg-white dark:bg-slate-950/60 text-slate-800 dark:text-white rounded-lg text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateQuestions}
              disabled={isPrepLoading}
              className="px-4 py-2 bg-slate-900 dark:bg-cyan-500 hover:bg-slate-800 dark:hover:bg-cyan-400 text-white dark:text-black text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
            >
              {isPrepLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Isolating STAR items...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Generate Custom Interview Questions
                </>
              )}
            </button>

            {/* Questions breakdown panel */}
            {questions && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 border-t dark:border-white/10">
                {/* Questions left list */}
                <div className="md:col-span-5 space-y-2">
                  {questions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedQuestion(idx)}
                      className={`w-full p-3 border rounded-xl text-left text-xs font-medium transition ${selectedQuestion === idx ? 'border-slate-800 dark:border-cyan-500 bg-slate-50 dark:bg-cyan-500/10 ring-1 ring-slate-800 dark:ring-cyan-500 text-slate-800 dark:text-white' : 'hover:bg-slate-50 dark:hover:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'}`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">{q.questionType}</span>
                      <p className="line-clamp-2">{q.question}</p>
                    </button>
                  ))}
                </div>

                {/* Question detailed answers Right */}
                {selectedQuestion !== null && questions[selectedQuestion] && (
                  <div className="md:col-span-7 p-4 border dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-slate-950/40 space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="text-[10px] bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-bold uppercase">{questions[selectedQuestion].questionType}</span>
                      <h5 className="font-bold text-slate-800 dark:text-white mt-2 leading-relaxed">{questions[selectedQuestion].question}</h5>
                    </div>
                    
                    <div className="border-t dark:border-white/10 pt-3 space-y-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">Why Interviewer Asks:</span>
                        <p className="italic">{questions[selectedQuestion].whyAsked}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">Answer Strategy (Framework):</span>
                        <p className="font-medium">{questions[selectedQuestion].answerFramework}</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-950/60 border dark:border-white/10 rounded-xl space-y-1 mt-2 shadow-inner">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">Sample High Impact Answer:</span>
                        <p className="leading-relaxed font-sans">{questions[selectedQuestion].samplePerfectAnswer}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. AI CAREER ROADMAP & SKILL GAP TIMELINE VIEW */}
        {activeSubTab === 'roadmap' && (
          <div className="bg-white dark:bg-white/[0.02] dark:backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 shadow-xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">12-Month Career Roadmap and Skill Gap Audit</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Calculates priority deficiencies on modern benchmarks to layout progression steps.</p>
              </div>
              <button
                onClick={handleGenerateRoadmap}
                disabled={isRoadmapLoading}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow shrink-0 cursor-pointer"
              >
                {isRoadmapLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mapping roadmap...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    Generate Career Roadmap
                  </>
                )}
              </button>
            </div>

            {/* Display Roadmap components */}
            {roadmap && (
              <div className="space-y-6 pt-4 border-t dark:border-white/10 text-xs">
                {/* Current standing */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border dark:border-white/10 rounded-2xl space-y-2">
                  <h5 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                    <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Current Career Standing
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{roadmap.currentStanding}</p>
                </div>

                {/* Skill Gaps prioritizer */}
                <div className="space-y-3">
                  <h5 className="font-bold text-slate-800 dark:text-white uppercase tracking-wide text-[11px]">Identified Skill Deficiencies</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {roadmap.skillGapAnalysis.map((item, idx) => (
                      <div key={idx} className="p-3 border dark:border-white/10 rounded-xl bg-white dark:bg-white/5 shadow-sm space-y-1.5">
                        <div className="flex justify-between items-center">
                          <h6 className="font-bold text-slate-800 dark:text-white truncate pr-1">{item.skill}</h6>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.priority === 'High' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Rec. Course: <span className="font-medium text-slate-600 dark:text-slate-300">{item.resources}</span></p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Roadmap tracker */}
                <div className="space-y-3">
                  <h5 className="font-bold text-slate-800 dark:text-white uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    12-Month Milestone Timeline
                  </h5>
                  <div className="relative pl-4 border-l border-slate-200 dark:border-white/10 ml-2 space-y-6 pt-2">
                    {roadmap.timeline.map((phase, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-indigo-500 dark:bg-cyan-500 border-2 border-white dark:border-slate-900 shadow-sm" />
                        <div>
                          <h6 className="font-bold text-slate-800 dark:text-white">{phase.phase} &bull; <span className="text-indigo-600 dark:text-cyan-400">{phase.milestone}</span></h6>
                          <ul className="list-disc pl-4 text-slate-500 dark:text-slate-400 text-[11px] mt-1 space-y-0.5">
                            {phase.actions.map((act, i) => <li key={i}>{act}</li>)}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Salary estimator gauges */}
                <div className="p-4 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl bg-emerald-50/10 dark:bg-emerald-950/5 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  <div className="sm:col-span-2">
                    <h5 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                      <TrendingUp className="w-4 h-4" />
                      Next Role Salary Projections
                    </h5>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Estimated industry scale metrics for: <b className="text-slate-600 dark:text-slate-300 font-semibold">{roadmap.salaryEstimate.role}</b></p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center sm:col-span-2">
                    <div className="p-2 bg-white dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">Low</span>
                      <strong className="text-xs text-slate-700 dark:text-slate-300 font-bold">{roadmap.salaryEstimate.low}</strong>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-950/40 rounded-xl border border-emerald-200 dark:border-emerald-500/30 shadow-md ring-1 ring-emerald-500/20 dark:ring-emerald-400/20">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase block font-bold">Median</span>
                      <strong className="text-xs text-emerald-700 dark:text-emerald-400 font-extrabold">{roadmap.salaryEstimate.median}</strong>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">High</span>
                      <strong className="text-xs text-slate-700 dark:text-slate-300 font-bold">{roadmap.salaryEstimate.high}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
