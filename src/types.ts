export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  photoUrl?: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  gradDate: string;
  gpa?: string;
  details?: string;
}

export interface Project {
  id: string;
  name: string;
  role?: string;
  tech: string;
  link?: string;
  description: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Internship {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface ResumeData {
  id: string;
  title: string; // Internal title e.g. "Senior Frontend Resume"
  personalInfo: PersonalInfo;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  internships: Internship[];
  certifications: Certification[];
  achievements: Achievement[];
  languages: string[];
  hobbies: string[];
  references: string;
  
  // Customization options
  templateId: string;
  primaryColor: string;
  fontFamily: string;
  fontSize: 'sm' | 'md' | 'lg';
  layoutOrder: string[]; // ['summary', 'experience', 'education', 'skills', ...]
  showPhoto: boolean;
  updatedAt: string;
}

export interface SavedResume {
  id: string;
  title: string;
  updatedAt: string;
  data: ResumeData;
  atsScore?: number;
}

export interface KeywordDensity {
  keyword: string;
  frequency: number;
  status: 'Optimal' | 'Missing' | 'Overused';
}

export interface GrammarIssue {
  original: string;
  corrected: string;
  explanation: string;
  type: string; // 'Grammar' | 'Spelling' | 'Tone' | 'Wording'
}

export interface FormattingCheck {
  checkName: string;
  passed: boolean;
  feedback: string;
}

export interface AnalysisResult {
  overallAtsScore: number;
  formattingScore: number;
  keywordScore: number;
  experienceScore: number;
  educationScore: number;
  skillsScore: number;
  readabilityScore: number;
  grammarScore: number;
  jobMatchScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywordDensity: KeywordDensity[];
  grammarIssues: GrammarIssue[];
  formattingChecks: FormattingCheck[];
  recommendedKeywords: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface InterviewQuestion {
  question: string;
  questionType: string; // 'Behavioral' | 'Technical' | 'Situational'
  whyAsked: string;
  answerFramework: string;
  samplePerfectAnswer: string;
}

export interface SkillGapItem {
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  resources: string;
}

export interface RoadmapPhase {
  phase: string;
  milestone: string;
  actions: string[];
}

export interface CareerRoadmap {
  currentStanding: string;
  skillGapAnalysis: SkillGapItem[];
  timeline: RoadmapPhase[];
  salaryEstimate: {
    role: string;
    low: string;
    median: string;
    high: string;
  };
}
