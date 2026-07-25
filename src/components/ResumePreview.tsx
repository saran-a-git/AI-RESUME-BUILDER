import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, BookOpen, Briefcase, FileText, Code, Languages, Star } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  scale?: number;
  highlightedKeywords?: string[];
  id?: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, scale = 1, highlightedKeywords = [], id = "resume-print-area" }) => {
  const {
    personalInfo,
    summary,
    skills,
    experience,
    education,
    projects,
    internships,
    certifications,
    achievements,
    languages,
    hobbies,
    references,
    primaryColor,
    fontFamily,
    fontSize,
    showPhoto,
    layoutOrder,
    templateId
  } = data;

  // Custom styling settings
  const containerStyle = {
    fontFamily: fontFamily || "'Poppins', sans-serif",
    fontSize: fontSize === 'sm' ? '12px' : fontSize === 'lg' ? '16px' : '14px',
    lineHeight: '1.6',
    color: '#334155'
  };

  const highlightText = (text: string) => {
    if (!highlightedKeywords || highlightedKeywords.length === 0) return text;
    let result: React.ReactNode[] = [text];
    
    highlightedKeywords.forEach(keyword => {
      if (!keyword) return;
      const newResult: React.ReactNode[] = [];
      result.forEach(part => {
        if (typeof part !== 'string') {
          newResult.push(part);
          return;
        }
        const regex = new RegExp(`(${keyword})`, 'gi');
        const splitText = part.split(regex);
        splitText.forEach((segment, idx) => {
          if (segment.toLowerCase() === keyword.toLowerCase()) {
            newResult.push(<span key={`${keyword}-${idx}`} className="bg-yellow-200 px-0.5 rounded font-medium text-slate-900">{segment}</span>);
          } else if (segment) {
            newResult.push(segment);
          }
        });
      });
      result = newResult;
    });
    
    return <>{result}</>;
  };

  // Sections Render Mapping
  const renderSummary = () => {
    if (!summary) return null;
    return (
      <div key="summary" className="mb-5 section-block">
        <h3 className="font-bold border-b pb-1 mb-2 text-md flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor, borderColor: `${primaryColor}22` }}>
          <FileText className="w-4 h-4 print:hidden" />
          Professional Summary
        </h3>
        <p className="text-justify leading-relaxed">{highlightText(summary)}</p>
      </div>
    );
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;
    return (
      <div key="skills" className="mb-5 section-block">
        <h3 className="font-bold border-b pb-1 mb-2 text-md flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor, borderColor: `${primaryColor}22` }}>
          <Code className="w-4 h-4 print:hidden" />
          Technical & Soft Skills
        </h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {skills.map((skill, idx) => (
            <span 
              key={idx} 
              className="px-2.5 py-1 text-xs rounded border bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
              style={{ borderColor: `${primaryColor}22` }}
            >
              {highlightText(skill)}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    if (!experience || experience.length === 0) return null;
    return (
      <div key="experience" className="mb-5 section-block">
        <h3 className="font-bold border-b pb-1 mb-2 text-md flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor, borderColor: `${primaryColor}22` }}>
          <Briefcase className="w-4 h-4 print:hidden" />
          Professional Experience
        </h3>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="relative pl-1">
              <div className="flex flex-col sm:flex-row justify-between mb-1">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{highlightText(exp.role)}</h4>
                  <p className="text-xs text-slate-500 font-medium">{highlightText(exp.company)} &bull; {exp.location}</p>
                </div>
                <div className="text-right sm:text-right text-xs text-slate-500 font-medium">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              <ul className="list-disc list-outside pl-5 text-xs text-slate-600 space-y-1">
                {exp.description.map((bullet, idx) => (
                  <li key={idx}>{highlightText(bullet)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (!education || education.length === 0) return null;
    return (
      <div key="education" className="mb-5 section-block">
        <h3 className="font-bold border-b pb-1 mb-2 text-md flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor, borderColor: `${primaryColor}22` }}>
          <BookOpen className="w-4 h-4 print:hidden" />
          Education
        </h3>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="flex flex-col sm:flex-row justify-between text-xs">
              <div>
                <h4 className="font-semibold text-slate-800">{highlightText(edu.degree)}</h4>
                <p className="text-slate-500">{highlightText(edu.school)} &bull; {edu.location}</p>
                {edu.gpa && <p className="text-slate-500 text-xs mt-0.5">GPA: <span className="font-medium text-slate-700">{edu.gpa}</span></p>}
                {edu.details && <p className="text-slate-400 italic text-[11px] mt-0.5">{edu.details}</p>}
              </div>
              <div className="text-slate-500 font-medium sm:text-right text-[11px] mt-1 sm:mt-0">
                Graduated: {edu.gradDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <div key="projects" className="mb-5 section-block">
        <h3 className="font-bold border-b pb-1 mb-2 text-md flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor, borderColor: `${primaryColor}22` }}>
          <Code className="w-4 h-4 print:hidden" />
          Projects
        </h3>
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="pl-1">
              <div className="flex flex-col sm:flex-row justify-between mb-0.5">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">
                    {highlightText(proj.name)}
                    {proj.link && <span className="text-xs text-slate-400 font-normal ml-2">({proj.link})</span>}
                  </h4>
                  {proj.tech && <p className="text-[11px] text-slate-500 font-semibold mb-1" style={{ color: primaryColor }}>Tech Stack: {proj.tech}</p>}
                </div>
              </div>
              <ul className="list-disc list-outside pl-5 text-xs text-slate-600 space-y-1">
                {proj.description.map((bullet, idx) => (
                  <li key={idx}>{highlightText(bullet)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInternships = () => {
    if (!internships || internships.length === 0) return null;
    return (
      <div key="internships" className="mb-5 section-block">
        <h3 className="font-bold border-b pb-1 mb-2 text-md flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor, borderColor: `${primaryColor}22` }}>
          <Briefcase className="w-4 h-4 print:hidden" />
          Internships
        </h3>
        <div className="space-y-3">
          {internships.map((intl) => (
            <div key={intl.id}>
              <div className="flex justify-between text-xs mb-1">
                <div>
                  <h4 className="font-semibold text-slate-800">{highlightText(intl.role)}</h4>
                  <p className="text-slate-500 font-medium">{highlightText(intl.company)}</p>
                </div>
                <div className="text-slate-500 text-right text-[11px]">
                  {intl.startDate} - {intl.endDate}
                </div>
              </div>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-0.5">
                {intl.description.map((b, idx) => (
                  <li key={idx}>{highlightText(b)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (!certifications || certifications.length === 0) return null;
    return (
      <div key="certifications" className="mb-5 section-block">
        <h3 className="font-bold border-b pb-1 mb-2 text-md flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor, borderColor: `${primaryColor}22` }}>
          <Award className="w-4 h-4 print:hidden" />
          Certifications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-2 border rounded bg-slate-50/50 flex flex-col justify-between" style={{ borderColor: `${primaryColor}11` }}>
              <div>
                <h4 className="font-semibold text-slate-800">{highlightText(cert.name)}</h4>
                <p className="text-slate-500 text-[11px]">{highlightText(cert.issuer)}</p>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Acquired: {cert.date}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (!achievements || achievements.length === 0) return null;
    return (
      <div key="achievements" className="mb-5 section-block">
        <h3 className="font-bold border-b pb-1 mb-2 text-md flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor, borderColor: `${primaryColor}22` }}>
          <Star className="w-4 h-4 print:hidden" />
          Key Achievements
        </h3>
        <div className="space-y-2 text-xs text-slate-600">
          {achievements.map((ach) => (
            <div key={ach.id} className="flex gap-2">
              <span className="text-amber-500">🏆</span>
              <div>
                <strong className="text-slate-800 font-semibold">{highlightText(ach.title)}:</strong> {highlightText(ach.description)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return null;
    return (
      <div key="languages" className="mb-5 section-block">
        <h3 className="font-bold border-b pb-1 mb-2 text-md flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor, borderColor: `${primaryColor}22` }}>
          <Languages className="w-4 h-4 print:hidden" />
          Languages & Hobbies
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <h4 className="font-semibold text-slate-700 mb-1">Languages</h4>
            <p className="text-slate-600">{languages.join(', ')}</p>
          </div>
          {hobbies && hobbies.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-700 mb-1">Interests & Hobbies</h4>
              <p className="text-slate-600">{hobbies.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReferences = () => {
    if (!references) return null;
    return (
      <div key="references" className="mb-5 section-block">
        <h3 className="font-bold border-b pb-1 mb-2 text-md flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor, borderColor: `${primaryColor}22` }}>
          <Briefcase className="w-4 h-4 print:hidden" />
          References
        </h3>
        <p className="text-xs italic text-slate-500">{references}</p>
      </div>
    );
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary': return renderSummary();
      case 'skills': return renderSkills();
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'projects': return renderProjects();
      case 'internships': return renderInternships();
      case 'certifications': return renderCertifications();
      case 'achievements': return renderAchievements();
      case 'languages': return renderLanguages();
      case 'references': return renderReferences();
      default: return null;
    }
  };

  // Rendering Layouts based on selected template category
  const renderTemplateHeader = () => {
    const isSidebarTemplate = ['modern-1', 'creative-1', 'swe-1', 'designer-1', 'creative-2'].includes(templateId);

    // Sidebar templates get special headers or we render generic beautifully
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 pb-4 mb-6" style={{ borderColor: primaryColor }}>
        <div className="flex items-center gap-4">
          {showPhoto && personalInfo.photoUrl && (
            <img 
              src={personalInfo.photoUrl} 
              alt={personalInfo.name} 
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 object-cover object-center shadow"
              style={{ borderColor: primaryColor }}
            />
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{highlightText(personalInfo.name)}</h1>
            <p className="text-sm sm:text-md font-semibold mt-1" style={{ color: primaryColor }}>{highlightText(personalInfo.title)}</p>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-0 flex flex-col items-start sm:items-end text-xs text-slate-500 space-y-1">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1 justify-start sm:justify-end">
            {personalInfo.linkedin && (
              <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-[11px]" style={{ color: primaryColor }}>
                <Linkedin className="w-3 h-3" />
                <span>LinkedIn</span>
              </a>
            )}
            {personalInfo.github && (
              <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-[11px]" style={{ color: primaryColor }}>
                <Github className="w-3 h-3" />
                <span>GitHub</span>
              </a>
            )}
            {personalInfo.portfolio && (
              <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-[11px]" style={{ color: primaryColor }}>
                <Globe className="w-3 h-3" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Modern Dual-Column split if layout calls for it
  const isSplitLayout = ['modern-1', 'creative-1', 'swe-1', 'designer-1', 'creative-2'].includes(templateId);

  if (isSplitLayout) {
    // Left: Personal, Skills, Education, Certifications, Languages
    // Right: Summary, Experience, Projects, Achievements, References
    const rightSideSections = ['summary', 'experience', 'projects', 'achievements', 'references'];
    const leftSideSections = ['skills', 'education', 'certifications', 'languages'];
    
    // respect custom layout order by filtering
    const orderedRight = layoutOrder.filter(s => rightSideSections.includes(s));
    const orderedLeft = layoutOrder.filter(s => leftSideSections.includes(s));

    return (
      <div 
        id={id} 
        className="w-full bg-white text-slate-800 p-6 md:p-8 border rounded shadow-md mx-auto transition-transform"
        style={{ ...containerStyle, transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        {renderTemplateHeader()}
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar Left Column */}
          <div className="md:col-span-4 space-y-4 pr-2 border-r border-slate-100 print:col-span-4">
            {orderedLeft.map(sec => renderSection(sec))}
          </div>

          {/* Main Right Column */}
          <div className="md:col-span-8 space-y-4 print:col-span-8">
            {orderedRight.map(sec => renderSection(sec))}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise standard Single-Column Layout
  return (
    <div 
      id={id} 
      className="w-full bg-white text-slate-800 p-6 md:p-8 border rounded shadow-md mx-auto transition-all"
      style={{ ...containerStyle, transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {renderTemplateHeader()}
      
      <div className="space-y-5">
        {layoutOrder.map(sectionId => renderSection(sectionId))}
      </div>
    </div>
  );
};
