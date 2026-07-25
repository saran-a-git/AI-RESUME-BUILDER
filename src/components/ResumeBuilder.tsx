import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData, WorkExperience, Education, Project, Certification, Achievement } from '../types';
import { ResumePreview } from './ResumePreview';
import { TEMPLATES, COLORS, FONTS } from '../data';
import { 
  User, Mail, Phone, MapPin, Linkedin, Github, Globe, FileText, Code, 
  Briefcase, BookOpen, Award, Star, Languages, Settings, Sparkles, Plus, 
  Trash2, MoveUp, MoveDown, Download, Printer, Copy, Check, Palette, Type, RefreshCw, Eye, X
} from 'lucide-react';

interface ResumeBuilderProps {
  initialData: ResumeData;
  onSave: (data: ResumeData) => void;
  templates?: any[];
  colors?: any[];
  fonts?: any[];
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ 
  initialData, 
  onSave, 
  templates = TEMPLATES, 
  colors = COLORS, 
  fonts = FONTS, 
  addToast 
}) => {
  const [resume, setResume] = useState<ResumeData>(initialData);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'export'>('content');
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatusText, setExportStatusText] = useState<string>('');
  const [isPreviewPdfMode, setIsPreviewPdfMode] = useState<boolean>(false);

  // State for adding items temporarily
  const [newSkill, setNewSkill] = useState<string>('');
  const [newLanguage, setNewLanguage] = useState<string>('');
  const [newHobby, setNewHobby] = useState<string>('');

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const updated = { ...resume };
    let current: any = updated;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setResume(updated);
    onSave(updated);
  };

  const addArrayItem = (section: 'experience' | 'education' | 'projects' | 'certifications' | 'achievements', newItem: any) => {
    const updatedList = [...(resume[section] as any[]), { ...newItem, id: `${section}-${Date.now()}` }];
    updateField(section, updatedList);
    addToast(`Added item to ${section}`, 'success');
  };

  const removeArrayItem = (section: 'experience' | 'education' | 'projects' | 'certifications' | 'achievements', id: string) => {
    const updatedList = (resume[section] as any[]).filter(item => item.id !== id);
    updateField(section, updatedList);
    addToast(`Removed item from ${section}`, 'info');
  };

  const updateArrayItemField = (section: 'experience' | 'education' | 'projects' | 'certifications' | 'achievements', id: string, field: string, value: any) => {
    const updatedList = (resume[section] as any[]).map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateField(section, updatedList);
  };

  // Reorder sections
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...resume.layoutOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    updateField('layoutOrder', newOrder);
    addToast('Layout sections reordered!', 'success');
  };

  // AI Assistance triggers via express backend proxy
  const callAIHelp = async (type: string, fieldContext: any, callback: (res: string) => void) => {
    setIsLoading(true);
    addToast(`AI is generating ${type}...`, 'info');
    try {
      const response = await fetch('/api/ai/generate-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldType: type, context: fieldContext })
      });
      
      const data = await response.json();
      if (data.result) {
        callback(data.result);
        addToast(`AI successfully optimized ${type}!`, 'success');
      } else {
        throw new Error(data.error || "Generation error");
      }
    } catch (err: any) {
      console.warn("AI generation failed, fallback local mock text triggered:", err);
      // fallback
      if (type === 'summary') {
        callback(`Highly competent and goal-oriented ${resume.personalInfo.title || 'Professional'} with hands-on expertise in industry standards. Exceptional track record in delivering robust solutions, driving customer satisfaction metrics, and implementing state-of-the-art architectures.`);
      } else if (type === 'experience') {
        callback(`- Delivered core architectural upgrades, improving system processing speed by 35%.\n- Led engineering workflows, reducing deployment timeline cycles from 5 days to 2 hours.\n- Collaborated on scalable database designs, resolving 100% of data race conditions.`);
      } else {
        callback('AWS, Kubernetes, Next.js, Redux Toolkit, Webpack, Figma, System Design');
      }
      addToast('Generated standard optimized text (Demo Mode)', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewriteSummary = () => {
    callAIHelp('summary', { title: resume.personalInfo.title, skills: resume.skills }, (res) => {
      updateField('summary', res);
    });
  };

  // Export functions
  const handlePrint = () => {
    window.print();
  };

  // Mathematically accurate OKLCH to RGB conversion
  const oklchToRgb = (oklchStr: string): string => {
    try {
      const match = oklchStr.match(/oklch\s*\(([^)]+)\)/i);
      if (!match) return oklchStr;
      
      const partsStr = match[1].trim();
      const parts = partsStr.split(/[\s,/]+/).filter(Boolean);
      if (parts.length < 3) return oklchStr;

      let L = parseFloat(parts[0]);
      if (parts[0].includes('%')) L = L / 100;
      if (isNaN(L)) L = 0;

      let C = parseFloat(parts[1]);
      if (parts[1].includes('%')) C = C / 100;
      if (isNaN(C)) C = 0;

      let H = 0;
      if (parts[2]) {
        H = parseFloat(parts[2]);
        if (parts[2].includes('rad')) {
          H = H * (180 / Math.PI);
        } else if (parts[2].includes('grad')) {
          H = H * 0.9;
        } else if (parts[2].includes('turn')) {
          H = H * 360;
        }
        if (isNaN(H)) H = 0;
      }

      let A = 1;
      if (parts[3]) {
        A = parseFloat(parts[3]);
        if (parts[3].includes('%')) A = A / 100;
        if (isNaN(A)) A = 1;
      }

      const hRad = (H * Math.PI) / 180;
      const okl_a = C * Math.cos(hRad);
      const okl_b = C * Math.sin(hRad);

      const l_lms = L + 0.3963377774 * okl_a + 0.2158037573 * okl_b;
      const m_lms = L - 0.1055613458 * okl_a - 0.0638541728 * okl_b;
      const s_lms = L - 0.0894841775 * okl_a - 1.2914855480 * okl_b;

      const l = Math.pow(Math.max(0, l_lms), 3);
      const m = Math.pow(Math.max(0, m_lms), 3);
      const s = Math.pow(Math.max(0, s_lms), 3);

      const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
      const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
      const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076137010 * s;

      const gamma = (c: number) => {
        const absC = Math.abs(c);
        const res = absC <= 0.0031308 ? 12.92 * absC : 1.055 * Math.pow(absC, 1 / 2.4) - 0.055;
        return c < 0 ? -res : res;
      };

      const rgb_r = Math.min(255, Math.max(0, Math.round(gamma(r_lin) * 255)));
      const rgb_g = Math.min(255, Math.max(0, Math.round(gamma(g_lin) * 255)));
      const rgb_b = Math.min(255, Math.max(0, Math.round(gamma(b_lin) * 255)));

      if (A < 1) {
        return `rgba(${rgb_r}, ${rgb_g}, ${rgb_b}, ${A})`;
      }
      return `rgb(${rgb_r}, ${rgb_g}, ${rgb_b})`;
    } catch (e) {
      console.error('Failed to convert oklch:', oklchStr, e);
      return 'rgb(0, 0, 0)';
    }
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById(isPreviewPdfMode ? 'resume-print-area-modal' : 'resume-print-area');
    if (!element) {
      addToast('Resume preview element not found.', 'error');
      return;
    }

    setIsExportingPdf(true);
    setExportProgress(10);
    setExportStatusText('Preparing document...');
    addToast('Generating PDF document...', 'info');

    // Yield to let UI update
    await new Promise(resolve => setTimeout(resolve, 50));

    // Create a temporary clone container off-screen
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.width = '794px'; // ~8.27in (A4 standard) at 96 DPI
    clone.style.height = 'auto';
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.padding = '0'; // Adjusted for standard print styles
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';
    clone.style.backgroundColor = '#ffffff';
    clone.style.color = '#1e293b';

    // To ensure exact print styling, we map the computed styles from the original elements
    // to inline styles on the clone, converting any oklch/color() to rgb so html2canvas understands it.
    const originalElements = [element, ...Array.from(element.getElementsByTagName('*'))] as HTMLElement[];
    const clonedElements = [clone, ...Array.from(clone.getElementsByTagName('*'))] as HTMLElement[];

    setExportProgress(30);
    setExportStatusText('Applying print styles...');
    await new Promise(resolve => setTimeout(resolve, 50));

    for (let i = 0; i < originalElements.length; i++) {
      const origEl = originalElements[i];
      const cloneEl = clonedElements[i];
      
      const computed = window.getComputedStyle(origEl);
      
      // Clean problematic properties
      cloneEl.style.transition = 'none';
      cloneEl.style.animation = 'none';
      cloneEl.style.backdropFilter = 'none';
      cloneEl.style.filter = 'none';
      cloneEl.style.boxShadow = 'none';

      // Transfer and convert color properties
      const colorProps = ['color', 'backgroundColor', 'borderColor', 'borderBottomColor', 'borderTopColor', 'borderLeftColor', 'borderRightColor'];
      colorProps.forEach(prop => {
        let val = computed.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (val && val !== 'rgba(0, 0, 0, 0)' && val !== 'transparent') {
          if (val.includes('oklch')) {
            val = val.replace(/oklch\s*\(([^)]+)\)/gi, (match) => oklchToRgb(match));
          } else if (val.includes('color(') || val.includes('lab(') || val.includes('lch(')) {
            val = 'rgb(100, 116, 139)'; // Fallback color
          }
          cloneEl.style[prop as any] = val;
        }
      });
      
      // Copy font family and weight directly to ensure they are captured
      cloneEl.style.fontFamily = computed.fontFamily;
      cloneEl.style.fontWeight = computed.fontWeight;
      cloneEl.style.fontSize = computed.fontSize;
      cloneEl.style.lineHeight = computed.lineHeight;
    }

    document.body.appendChild(clone);

    setExportProgress(50);
    setExportStatusText('Rendering graphics...');
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: false,
        width: 794,
        windowWidth: 794
      });

      setExportProgress(80);
      setExportStatusText('Generating PDF...');
      await new Promise(resolve => setTimeout(resolve, 50));

      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / pdfWidth;
      const calculatedHeight = imgHeight / ratio;

      let position = 0;
      let heightLeft = calculatedHeight;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Add extra pages if content overflows a single A4 page
      while (heightLeft > 0) {
        position = heightLeft - calculatedHeight; // Moves viewport down for multi-page document spans
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      setExportProgress(100);
      setExportStatusText('Finalizing...');
      await new Promise(resolve => setTimeout(resolve, 300));

      pdf.save(`${resume.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
      addToast('Downloaded high-quality PDF successfully!', 'success');
    } catch (err) {
      console.error('PDF export error:', err);
      addToast('Failed to export PDF.', 'error');
    } finally {
      if (document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
      setIsExportingPdf(false);
      setExportProgress(0);
      setExportStatusText('');
    }
  };

  const handleDownloadTxt = () => {
    let txtContent = `==== ${resume.personalInfo.name.toUpperCase()} ====\n`;
    txtContent += `${resume.personalInfo.title}\n`;
    txtContent += `${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}\n`;
    txtContent += `LinkedIn: ${resume.personalInfo.linkedin} | GitHub: ${resume.personalInfo.github}\n\n`;
    txtContent += `== SUMMARY ==\n${resume.summary}\n\n`;
    txtContent += `== SKILLS ==\n${resume.skills.join(', ')}\n\n`;
    txtContent += `== EXPERIENCE ==\n`;
    resume.experience.forEach(exp => {
      txtContent += `• ${exp.role} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})\n`;
      exp.description.forEach(bullet => {
        txtContent += `  - ${bullet}\n`;
      });
    });
    
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.personalInfo.name.replace(/\s+/g, '_')}_Resume.txt`;
    link.click();
    addToast('Downloaded as Plain Text!', 'success');
  };

  const handleDownloadHtml = () => {
    const resumeEl = document.getElementById('resume-print-area');
    if (!resumeEl) return;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resume.personalInfo.name} Resume</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-50 py-10">
          <div class="max-w-4xl mx-auto">
            ${resumeEl.innerHTML}
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.personalInfo.name.replace(/\s+/g, '_')}_Resume.html`;
    link.click();
    addToast('Downloaded as HTML!', 'success');
  };

  const copyToClipboard = () => {
    let txtContent = `${resume.personalInfo.name}\n${resume.personalInfo.title}\n${resume.summary}`;
    navigator.clipboard.writeText(txtContent);
    setCopiedText(true);
    addToast('Copied raw details to clipboard!', 'success');
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Editor Sidebar Left */}
      <div className="lg:col-span-5 bg-white dark:bg-white/[0.02] dark:backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 p-5 overflow-hidden">
        
        {/* Builder navigation tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-950/40 p-1.5 rounded-xl border dark:border-white/10 mb-5 text-sm font-medium">
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${activeTab === 'content' ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            Resume Content
          </button>
          <button 
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${activeTab === 'design' ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <Palette className="w-4 h-4 text-emerald-400" />
            Design & Layout
          </button>
          <button 
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${activeTab === 'export' ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <Download className="w-4 h-4 text-indigo-400" />
            Export & Print
          </button>
        </div>

        {/* 1. CONTENT EDITOR TAB */}
        {activeTab === 'content' && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Horizontal Sections select badge row */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'personal', name: 'Personal', icon: User },
                { id: 'summary', name: 'Summary', icon: FileText },
                { id: 'skills', name: 'Skills', icon: Code },
                { id: 'experience', name: 'Experience', icon: Briefcase },
                { id: 'education', name: 'Education', icon: BookOpen },
                { id: 'projects', name: 'Projects', icon: Star },
                { id: 'certifications', name: 'Certifications', icon: Award },
                { id: 'languages', name: 'Languages', icon: Languages }
              ].map(sec => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 ${activeSection === sec.id ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-black shadow-md' : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {sec.name}
                  </button>
                );
              })}
            </div>

            {/* Personal Info Section */}
            {activeSection === 'personal' && (
              <div className="space-y-3 pt-1">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cyan-400" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Name</label>
                    <input 
                      type="text" 
                      value={resume.personalInfo.name}
                      onChange={(e) => updateField('personalInfo.name', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Professional Title</label>
                    <input 
                      type="text" 
                      value={resume.personalInfo.title}
                      onChange={(e) => updateField('personalInfo.title', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                    <input 
                      type="email" 
                      value={resume.personalInfo.email}
                      onChange={(e) => updateField('personalInfo.email', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                    <input 
                      type="text" 
                      value={resume.personalInfo.phone}
                      onChange={(e) => updateField('personalInfo.phone', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Location (City, State)</label>
                    <input 
                      type="text" 
                      value={resume.personalInfo.location}
                      onChange={(e) => updateField('personalInfo.location', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">LinkedIn URL</label>
                    <input 
                      type="text" 
                      value={resume.personalInfo.linkedin}
                      onChange={(e) => updateField('personalInfo.linkedin', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">GitHub Profile</label>
                    <input 
                      type="text" 
                      value={resume.personalInfo.github}
                      onChange={(e) => updateField('personalInfo.github', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Portfolio Website</label>
                    <input 
                      type="text" 
                      value={resume.personalInfo.portfolio}
                      onChange={(e) => updateField('personalInfo.portfolio', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-between p-3 border rounded-xl bg-slate-50 mt-1">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700">Display Profile Photo</h4>
                      <p className="text-[10px] text-slate-400">Check to display image slot on header (photo-friendly templates)</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={resume.showPhoto}
                      onChange={(e) => updateField('showPhoto', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                    />
                  </div>
                  {resume.showPhoto && (
                    <div className="col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Photo Image URL</label>
                      <input 
                        type="text" 
                        value={resume.personalInfo.photoUrl || ''}
                        onChange={(e) => updateField('personalInfo.photoUrl', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Professional Summary Section */}
            {activeSection === 'summary' && (
              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Professional Summary
                  </h3>
                  <button 
                    onClick={handleRewriteSummary}
                    disabled={isLoading}
                    className="px-2.5 py-1 text-[11px] font-bold bg-slate-950 text-white rounded-lg flex items-center gap-1 hover:bg-slate-800 disabled:opacity-50 transition shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    AI Rewrite Summary
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">Provide an overview of your career accomplishments, core competencies, and long term career ambitions.</p>
                <textarea 
                  rows={6}
                  value={resume.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  className="w-full p-3 border rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <div className="space-y-4 pt-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-slate-500" />
                    Core Skills
                  </h3>
                  <button
                    onClick={() => callAIHelp('skills', { targetRole: resume.personalInfo.title, currentSkills: resume.skills.join(', ') }, (res) => {
                      const list = res.split(',').map(s => s.trim()).filter(Boolean);
                      const unique = Array.from(new Set([...resume.skills, ...list]));
                      updateField('skills', unique);
                    })}
                    className="px-2.5 py-1 text-[11px] font-bold bg-slate-900 text-white rounded-lg flex items-center gap-1 hover:bg-slate-800 transition shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Suggest Skills
                  </button>
                </div>
                
                {/* Tag system */}
                <div className="flex flex-wrap gap-1.5 p-3 border rounded-xl bg-slate-50 min-h-12 max-h-40 overflow-y-auto">
                  {resume.skills.map((skill, idx) => (
                    <span key={idx} className="bg-white text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 shadow-sm">
                      {skill}
                      <button 
                        onClick={() => {
                          const updated = resume.skills.filter((_, i) => i !== idx);
                          updateField('skills', updated);
                        }}
                        className="text-slate-400 hover:text-rose-500 font-bold ml-0.5 text-[10px]"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  {resume.skills.length === 0 && <span className="text-xs text-slate-400 self-center">No skills added yet.</span>}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add manual skill (e.g., Python)..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSkill.trim()) {
                        e.preventDefault();
                        if (!resume.skills.includes(newSkill.trim())) {
                          updateField('skills', [...resume.skills, newSkill.trim()]);
                        }
                        setNewSkill('');
                      }
                    }}
                    className="flex-1 px-3 py-1.5 border rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button 
                    onClick={() => {
                      if (newSkill.trim() && !resume.skills.includes(newSkill.trim())) {
                        updateField('skills', [...resume.skills, newSkill.trim()]);
                        setNewSkill('');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <div className="space-y-4 pt-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    Work Experience
                  </h3>
                  <button
                    onClick={() => addArrayItem('experience', {
                      role: 'Software Engineer',
                      company: 'New Enterprise Corp',
                      location: 'Remote',
                      startDate: '2025-01',
                      endDate: '',
                      current: true,
                      description: ['Spearheaded the integration of secure APIs.', 'Improved code optimization metrics by 20%.']
                    })}
                    className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 text-white rounded-lg flex items-center gap-1 hover:bg-indigo-700 transition shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Work
                  </button>
                </div>

                <div className="space-y-4">
                  {resume.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-4 border rounded-xl bg-slate-50/50 space-y-3 relative group">
                      <button 
                        onClick={() => removeArrayItem('experience', exp.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1 rounded-lg bg-white shadow-sm border opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Role / Job Title</label>
                          <input 
                            type="text" 
                            value={exp.role}
                            onChange={(e) => updateArrayItemField('experience', exp.id, 'role', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Company Name</label>
                          <input 
                            type="text" 
                            value={exp.company}
                            onChange={(e) => updateArrayItemField('experience', exp.id, 'company', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Start Date (YYYY-MM)</label>
                          <input 
                            type="text" 
                            value={exp.startDate}
                            onChange={(e) => updateArrayItemField('experience', exp.id, 'startDate', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">End Date / Current</label>
                          <div className="flex items-center gap-2 mt-1">
                            <input 
                              type="text" 
                              value={exp.current ? 'Present' : exp.endDate}
                              disabled={exp.current}
                              onChange={(e) => updateArrayItemField('experience', exp.id, 'endDate', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                            />
                            <div className="flex items-center gap-1">
                              <input 
                                type="checkbox"
                                checked={exp.current}
                                id={`current-${exp.id}`}
                                onChange={(e) => updateArrayItemField('experience', exp.id, 'current', e.target.checked)}
                                className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                              />
                              <label htmlFor={`current-${exp.id}`} className="text-[10px] font-bold text-slate-500 cursor-pointer">Current</label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bullet points editor */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Achievements (Bullets)</label>
                          <button
                            onClick={() => {
                              callAIHelp('experience', { role: exp.role, company: exp.company }, (res) => {
                                const bulletPoints = res.split('\n').map(s => s.replace(/^[•\-\*\s]+/, '').trim()).filter(Boolean);
                                const updatedBullets = [...exp.description, ...bulletPoints];
                                updateArrayItemField('experience', exp.id, 'description', updatedBullets);
                              });
                            }}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white flex items-center gap-1 hover:bg-slate-800 transition"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                            AI Bullet Suggestions (Google XYZ)
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {exp.description.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex gap-1.5 items-center">
                              <input 
                                type="text" 
                                value={bullet}
                                onChange={(e) => {
                                  const updatedBullets = [...exp.description];
                                  updatedBullets[bIdx] = e.target.value;
                                  updateArrayItemField('experience', exp.id, 'description', updatedBullets);
                                }}
                                className="flex-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              />
                              <button 
                                onClick={() => {
                                  const updatedBullets = exp.description.filter((_, idx) => idx !== bIdx);
                                  updateArrayItemField('experience', exp.id, 'description', updatedBullets);
                                }}
                                className="text-slate-400 hover:text-rose-500 p-1 bg-white border rounded-lg shadow-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const updatedBullets = [...exp.description, 'Accomplished [action Verb] to deliver [quantifiable metric] resulting in [technical outcome].'];
                              updateArrayItemField('experience', exp.id, 'description', updatedBullets);
                            }}
                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-1 pl-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add bullet point
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <div className="space-y-4 pt-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    Education Details
                  </h3>
                  <button
                    onClick={() => addArrayItem('education', {
                      degree: 'M.S. in Software Engineering',
                      school: 'Stanford University',
                      location: 'Stanford, CA',
                      gradDate: '2022-06',
                      gpa: '3.91',
                      details: 'Focus on Distributed Systems.'
                    })}
                    className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 text-white rounded-lg flex items-center gap-1 hover:bg-indigo-700 transition shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Education
                  </button>
                </div>

                <div className="space-y-4">
                  {resume.education.map((edu, idx) => (
                    <div key={edu.id} className="p-4 border rounded-xl bg-slate-50/50 space-y-3 relative group">
                      <button 
                        onClick={() => removeArrayItem('education', edu.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1 rounded bg-white shadow-sm border opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Degree & Major</label>
                          <input 
                            type="text" 
                            value={edu.degree}
                            onChange={(e) => updateArrayItemField('education', edu.id, 'degree', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">School / University</label>
                          <input 
                            type="text" 
                            value={edu.school}
                            onChange={(e) => updateArrayItemField('education', edu.id, 'school', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Graduation Date (YYYY-MM)</label>
                          <input 
                            type="text" 
                            value={edu.gradDate}
                            onChange={(e) => updateArrayItemField('education', edu.id, 'gradDate', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">GPA (Optional)</label>
                          <input 
                            type="text" 
                            value={edu.gpa || ''}
                            onChange={(e) => updateArrayItemField('education', edu.id, 'gpa', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Location (City, State)</label>
                          <input 
                            type="text" 
                            value={edu.location}
                            onChange={(e) => updateArrayItemField('education', edu.id, 'location', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Additional details (Honors, Awards)</label>
                          <input 
                            type="text" 
                            value={edu.details || ''}
                            onChange={(e) => updateArrayItemField('education', edu.id, 'details', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {activeSection === 'projects' && (
              <div className="space-y-4 pt-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-slate-500" />
                    Key Projects
                  </h3>
                  <button
                    onClick={() => addArrayItem('projects', {
                      name: 'Cryptosure Dashboard',
                      tech: 'Vue.js, Express, Chart.js',
                      link: 'github.com/myaccount/cryptosure',
                      description: ['Engineered a modular tracking dashboard.', 'Reduced client render paint load cycles by 10%.']
                    })}
                    className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 text-white rounded-lg flex items-center gap-1 hover:bg-indigo-700 transition shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </button>
                </div>

                <div className="space-y-4">
                  {resume.projects.map((proj, idx) => (
                    <div key={proj.id} className="p-4 border rounded-xl bg-slate-50/50 space-y-3 relative group">
                      <button 
                        onClick={() => removeArrayItem('projects', proj.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1 rounded bg-white shadow-sm border opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Project Title</label>
                          <input 
                            type="text" 
                            value={proj.name}
                            onChange={(e) => updateArrayItemField('projects', proj.id, 'name', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Core Technologies (CSV)</label>
                          <input 
                            type="text" 
                            value={proj.tech}
                            onChange={(e) => updateArrayItemField('projects', proj.id, 'tech', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Project Link (e.g. GitHub URL)</label>
                          <input 
                            type="text" 
                            value={proj.link || ''}
                            onChange={(e) => updateArrayItemField('projects', proj.id, 'link', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Project bullet point editor */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Project Description Bullets</label>
                        <div className="space-y-1.5">
                          {proj.description.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex gap-1.5 items-center">
                              <input 
                                type="text" 
                                value={bullet}
                                onChange={(e) => {
                                  const updatedBullets = [...proj.description];
                                  updatedBullets[bIdx] = e.target.value;
                                  updateArrayItemField('projects', proj.id, 'description', updatedBullets);
                                }}
                                className="flex-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              />
                              <button 
                                onClick={() => {
                                  const updatedBullets = proj.description.filter((_, idx) => idx !== bIdx);
                                  updateArrayItemField('projects', proj.id, 'description', updatedBullets);
                                }}
                                className="text-slate-400 hover:text-rose-500 p-1 bg-white border rounded-lg shadow-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const updatedBullets = [...proj.description, 'Implemented key modules resulting in higher efficiency performance.'];
                              updateArrayItemField('projects', proj.id, 'description', updatedBullets);
                            }}
                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-1 pl-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add project bullet
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications Section */}
            {activeSection === 'certifications' && (
              <div className="space-y-4 pt-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-slate-500" />
                    Certifications
                  </h3>
                  <button
                    onClick={() => addArrayItem('certifications', {
                      name: 'Google Cloud Architect Professional',
                      issuer: 'Google Cloud Platform',
                      date: '2024-05'
                    })}
                    className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 text-white rounded-lg flex items-center gap-1 hover:bg-indigo-700 transition shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Certificate
                  </button>
                </div>

                <div className="space-y-4">
                  {resume.certifications.map((cert) => (
                    <div key={cert.id} className="p-4 border rounded-xl bg-slate-50/50 space-y-3 relative group">
                      <button 
                        onClick={() => removeArrayItem('certifications', cert.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1 rounded bg-white shadow-sm border opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3 text-xs bg-transparent">
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Certification Name</label>
                          <input 
                            type="text" 
                            value={cert.name}
                            onChange={(e) => updateArrayItemField('certifications', cert.id, 'name', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Issuer</label>
                          <input 
                            type="text" 
                            value={cert.issuer}
                            onChange={(e) => updateArrayItemField('certifications', cert.id, 'issuer', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Date Acquired (YYYY-MM)</label>
                          <input 
                            type="text" 
                            value={cert.date}
                            onChange={(e) => updateArrayItemField('certifications', cert.id, 'date', e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages & Hobbies Section */}
            {activeSection === 'languages' && (
              <div className="space-y-4 pt-1">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mb-2">
                    <Languages className="w-4 h-4 text-slate-500" />
                    Spoken Languages
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {resume.languages.map((lang, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-semibold border">
                        {lang}
                        <button 
                          onClick={() => {
                            const updated = resume.languages.filter((_, i) => i !== idx);
                            updateField('languages', updated);
                          }}
                          className="text-slate-400 hover:text-rose-500 text-[10px]"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add language (e.g. German - Fluent)..."
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newLanguage.trim()) {
                          e.preventDefault();
                          updateField('languages', [...resume.languages, newLanguage.trim()]);
                          setNewLanguage('');
                        }
                      }}
                      className="flex-1 px-2.5 py-1.5 border rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                        if (newLanguage.trim()) {
                          updateField('languages', [...resume.languages, newLanguage.trim()]);
                          setNewLanguage('');
                        }
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mb-2">
                    <Star className="w-4 h-4 text-slate-500" />
                    Interests & Hobbies
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {resume.hobbies.map((h, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-semibold border">
                        {h}
                        <button 
                          onClick={() => {
                            const updated = resume.hobbies.filter((_, i) => i !== idx);
                            updateField('hobbies', updated);
                          }}
                          className="text-slate-400 hover:text-rose-500 text-[10px]"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add hobby (e.g. Chess)..."
                      value={newHobby}
                      onChange={(e) => setNewHobby(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newHobby.trim()) {
                          e.preventDefault();
                          updateField('hobbies', [...resume.hobbies, newHobby.trim()]);
                          setNewHobby('');
                        }
                      }}
                      className="flex-1 px-2.5 py-1.5 border rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                        if (newHobby.trim()) {
                          updateField('hobbies', [...resume.hobbies, newHobby.trim()]);
                          setNewHobby('');
                        }
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. DESIGN & LAYOUT TAB */}
        {activeTab === 'design' && (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Choose Template Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                Select Resume Template
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => updateField('templateId', tpl.id)}
                    className={`p-3 border rounded-xl text-left transition relative flex flex-col justify-between cursor-pointer ${resume.templateId === tpl.id ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500 text-slate-900 dark:text-white' : 'hover:bg-slate-50 dark:hover:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200'}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xl">{tpl.thumbnail}</span>
                      <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{tpl.category}</span>
                    </div>
                    <div className="mt-2">
                      <h5 className="text-xs font-semibold">{tpl.name}</h5>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">{tpl.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Palettes */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                Primary Accent Color
              </h4>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => updateField('primaryColor', c.value)}
                    className={`w-7 h-7 rounded-full border-2 transition relative flex items-center justify-center cursor-pointer`}
                    style={{ backgroundColor: c.value, borderColor: resume.primaryColor === c.value ? '#22d3ee' : 'transparent' }}
                    title={c.name}
                  >
                    {resume.primaryColor === c.value && (
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Fonts choice */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-cyan-400" />
                Select Typography
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {fonts.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => updateField('fontFamily', f.value)}
                    className={`px-3 py-2 border rounded-xl text-xs font-medium text-left transition cursor-pointer ${resume.fontFamily === f.value ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500 text-slate-900 dark:text-white' : 'hover:bg-slate-50 dark:hover:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200'}`}
                    style={{ fontFamily: f.value }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizing toggle options */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Base Font Size</h4>
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-950/40 p-1 rounded-lg border dark:border-white/10">
                {(['sm', 'md', 'lg'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => updateField('fontSize', sz)}
                    className={`flex-1 py-1 text-xs font-bold rounded capitalize transition cursor-pointer ${resume.fontSize === sz ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
                  >
                    {sz === 'sm' ? 'Compact' : sz === 'md' ? 'Standard' : 'Larger'}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Reorder simulation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Section Layout Order</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-2">Adjust which resume parts print first using quick direction arrows.</p>
              <div className="space-y-1 bg-slate-50 dark:bg-slate-950/20 p-2.5 rounded-xl border dark:border-white/10">
                {resume.layoutOrder.map((sectionId, idx) => (
                  <div key={sectionId} className="flex justify-between items-center p-2 rounded bg-white dark:bg-slate-950 shadow-sm border border-slate-100 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                    <span>{sectionId}</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => moveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded disabled:opacity-30 cursor-pointer"
                      >
                        <MoveUp className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </button>
                      <button 
                        onClick={() => moveSection(idx, 'down')}
                        disabled={idx === resume.layoutOrder.length - 1}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded disabled:opacity-30 cursor-pointer"
                      >
                        <MoveDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. EXPORT OPTIONS TAB */}
        {activeTab === 'export' && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="p-4 border border-indigo-100 rounded-2xl bg-indigo-50/30 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-500 mx-auto animate-pulse" />
              <h4 className="text-sm font-bold text-slate-800">ATS Optimized & Ready</h4>
              <p className="text-xs text-slate-500">Your resume sections have been structured using clean, standardized formatting rules designed to bypass corporate screening bots.</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setIsPreviewPdfMode(true)}
                className="w-full py-2.5 px-4 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm border border-indigo-200 dark:border-indigo-800/50 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                Preview PDF Layout
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-bold rounded-xl text-xs transition relative overflow-hidden shadow-md cursor-pointer disabled:opacity-80"
              >
                {isExportingPdf && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-indigo-900/40 transition-all duration-300"
                    style={{ width: `${exportProgress}%` }} 
                  />
                )}
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isExportingPdf ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      {exportStatusText || 'Generating PDF...'} {exportProgress}%
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download High-Quality PDF
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={handlePrint}
                className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/15 text-white dark:text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print / Save as PDF
              </button>
              
              <button
                onClick={handleDownloadHtml}
                className="w-full py-2.5 px-4 bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white dark:text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <Code className="w-4 h-4" />
                Download as HTML Format
              </button>

              <button
                onClick={handleDownloadTxt}
                className="w-full py-2.5 px-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-white/10 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                Download Plain Text (TXT)
              </button>

              <button
                onClick={copyToClipboard}
                className="w-full py-2.5 px-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-white/10 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                Copy Raw Details
              </button>
            </div>

            <div className="p-3 border rounded-xl bg-slate-50 text-[10px] text-slate-400 space-y-1 mt-4">
              <strong className="text-slate-600">💡 Pro Tip for PDF Export:</strong>
              <p>When the print window opens, select <b>"Save as PDF"</b> as the destination, check the box for <b>"Background graphics"</b>, and set margins to <b>"Default"</b> or <b>"None"</b> for the cleanest document finish.</p>
            </div>
          </div>
        )}
      </div>

      {/* Live PDF Preview Right Column */}
      <div className="lg:col-span-7 bg-slate-100 rounded-2xl p-4 md:p-6 shadow-inner border border-slate-200 overflow-y-auto max-h-[85vh] sticky top-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">A4 Live Document Canvas</h4>
          </div>
          <div className="text-xs text-slate-400">
            {resume.personalInfo.name || "Alex Mercer"} &bull; Live Preview
          </div>
        </div>

        {/* Scaled Preview Wrapper to guarantee clean A4 constraints */}
        <div className="rounded-xl overflow-hidden border shadow-xl bg-white">
          <ResumePreview data={resume} />
        </div>
      </div>

      {/* Full-Screen PDF Preview Modal */}
      {isPreviewPdfMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 md:p-8 overflow-y-auto">
          <div className="relative w-full max-w-[850px] bg-slate-100 rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white rounded-t-2xl">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-500" />
                  PDF Export Preview
                </h3>
                <p className="text-xs text-slate-500">This is exactly how your resume will look when exported to PDF.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    await handleDownloadPdf();
                    setIsPreviewPdfMode(false);
                  }}
                  disabled={isExportingPdf}
                  className="py-2 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-bold rounded-lg text-xs transition relative overflow-hidden shadow cursor-pointer disabled:opacity-80"
                >
                  {isExportingPdf && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-indigo-900/40 transition-all duration-300"
                      style={{ width: `${exportProgress}%` }} 
                    />
                  )}
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isExportingPdf ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        {exportProgress}%
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download PDF
                      </>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setIsPreviewPdfMode(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition cursor-pointer text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Fixed A4 width for exact visual match */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100 flex justify-center">
              <div 
                className="bg-white shadow-lg overflow-hidden pointer-events-none"
                style={{ 
                  width: '794px', // A4 width at 96dpi
                  minHeight: '1123px', // A4 height at 96dpi
                  transformOrigin: 'top center',
                  // Scale down on smaller screens, otherwise 1
                  transform: 'scale(var(--preview-scale, 1))' 
                }}
              >
                <style>{`
                  @media (max-width: 850px) {
                    :root { --preview-scale: 0.8; }
                  }
                  @media (max-width: 600px) {
                    :root { --preview-scale: 0.5; }
                  }
                  @media (max-width: 400px) {
                    :root { --preview-scale: 0.4; }
                  }
                `}</style>
                <ResumePreview data={resume} id="resume-print-area-modal" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
