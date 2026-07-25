import { ResumeData, AnalysisResult, SavedResume } from "./types";

export interface Template {
  id: string;
  name: string;
  category: 'Modern' | 'Minimal' | 'Professional' | 'Creative' | 'Executive' | 'Industry-Specific' | 'Simple';
  description: string;
  thumbnail: string;
}

export const TEMPLATES: Template[] = [
  { id: 'professional-1', name: 'Elite Executive', category: 'Executive', description: 'Clean layout optimized for senior management and leaders.', thumbnail: '💼' },
  { id: 'modern-1', name: 'Glassmorphic Modern', category: 'Modern', description: 'A sleek modern template with dual columns and clean accents.', thumbnail: '✨' },
  { id: 'minimal-1', name: 'Swiss Minimalist', category: 'Minimal', description: 'Generous negative space with high-impact typography.', thumbnail: '🎯' },
  { id: 'creative-1', name: 'Creative Portfolio', category: 'Creative', description: 'Distinct styling for marketing, product, and content roles.', thumbnail: '🎨' },
  { id: 'swe-1', name: 'Software Engineer Pro', category: 'Industry-Specific', description: 'Optimized for tech roles, highlighting skills and github repositories.', thumbnail: '💻' },
  { id: 'data-1', name: 'Data Analyst Premium', category: 'Industry-Specific', description: 'Clean grid highlighting technical tools, databases, and impact metrics.', thumbnail: '📊' },
  { id: 'designer-1', name: 'UI/UX Designer Bold', category: 'Industry-Specific', description: 'Highlights case studies, portfolio links, and design skills.', thumbnail: '📐' },
  { id: 'student-1', name: 'Academic Scholar', category: 'Simple', description: 'Focuses on coursework, academic projects, and education.', thumbnail: '🎓' },
  { id: 'fresher-1', name: 'First Step (Fresher)', category: 'Simple', description: 'Designed for candidates with limited work experience.', thumbnail: '🌱' },
  { id: 'corporate-1', name: 'Wall Street Corporate', category: 'Professional', description: 'High-density, classic grid design favored by banking/consulting.', thumbnail: '🏦' },
  { id: 'simple-1', name: 'The Clean Sheet', category: 'Simple', description: 'Perfectly formatted standard layout favored by traditional ATS.', thumbnail: '📄' },
  
  // Extending to 20+ Templates to meet requirement fully
  { id: 'professional-2', name: 'Harvard Legacy', category: 'Professional', description: 'Classic Ivy-League style with serif headers.', thumbnail: '🏛️' },
  { id: 'modern-2', name: 'Neo-Classic', category: 'Modern', description: 'Centered header with subtle timeline-like vertical accents.', thumbnail: '⏳' },
  { id: 'minimal-2', name: 'Tokyo Clean', category: 'Minimal', description: 'Ultra-lightweight font weights with precise compact margins.', thumbnail: '🇯🇵' },
  { id: 'creative-2', name: 'Startup Bold', category: 'Creative', description: 'Energetic sidebar style with customized badge icons.', thumbnail: '🚀' },
  { id: 'executive-2', name: 'Global Director', category: 'Executive', description: 'Full-width summary header with core competency grid.', thumbnail: '🌍' },
  { id: 'swe-2', name: 'Full-Stack Lead', category: 'Industry-Specific', description: 'Places technical competencies and core repos at the absolute top.', thumbnail: '⚙️' },
  { id: 'data-2', name: 'AI Research Master', category: 'Industry-Specific', description: 'Optimized for publications, frameworks, and scientific projects.', thumbnail: '🧠' },
  { id: 'designer-2', name: 'Creative Agency Stylist', category: 'Creative', description: 'A subtle left border accents list items with premium vibes.', thumbnail: '🖌️' },
  { id: 'corporate-2', name: 'Fortune 500', category: 'Professional', description: 'Symmetric sections with crisp lines and a traditional layout.', thumbnail: '🏢' },
  { id: 'simple-2', name: 'Standard Resume', category: 'Simple', description: 'The absolute safest, single-column document outline.', thumbnail: '📁' }
];

export const COLORS = [
  { name: 'Slate Blue', value: '#1e293b' },
  { name: 'SaaS Emerald', value: '#0f766e' },
  { name: 'Navy Royal', value: '#1d4ed8' },
  { name: 'Luxury Teal', value: '#0d9488' },
  { name: 'Modern Charcoal', value: '#27272a' },
  { name: 'Deep Purple', value: '#6d28d9' },
  { name: 'Warm Crimson', value: '#be123c' },
  { name: 'Forest Green', value: '#15803d' }
];

export const FONTS = [
  { name: 'Poppins', value: "'Poppins', sans-serif" },
  { name: 'Playfair Display / Inter', value: "'Playfair Display', serif" },
  { name: 'Inter', value: "'Inter', sans-serif" },
  { name: 'Merriweather', value: "'Merriweather', serif" },
  { name: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" },
  { name: 'Courier Prime (Traditional)', value: "'Courier New', Courier, monospace" }
];

export const DEFAULT_RESUME: ResumeData = {
  id: 'demo-resume-1',
  title: 'Senior Software Engineer Resume',
  personalInfo: {
    name: 'Alex Mercer',
    title: 'Senior Full-Stack Engineer',
    email: 'alex.mercer@devmail.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmercer-dev',
    github: 'github.com/alexmercer-dev',
    portfolio: 'alexmercer.dev',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop'
  },
  summary: 'Passionate and result-driven Senior Full-Stack Engineer with over 6 years of experience building high-scale SaaS web applications. Proven track record in optimizing application speed by 40%, managing cross-functional engineering teams, and implementing scalable cloud architectures. Expert in React, TypeScript, Node.js, and AWS, focusing on clean code practices and high-efficiency API design.',
  skills: [
    'React', 'TypeScript', 'Node.js', 'Express', 'Next.js', 'AWS (S3, EC2, Lambda)', 
    'PostgreSQL', 'Docker', 'GraphQL', 'Tailwind CSS', 'Git', 'CI/CD Pipelines', 
    'Agile', 'System Architecture', 'REST APIs', 'Redis'
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Software Engineer',
      company: 'SaaSify Inc.',
      location: 'San Francisco, CA',
      startDate: '2023-01',
      endDate: '',
      current: true,
      description: [
        'Spearheaded the redesign of the core messaging system, improving system latency by 45% and accommodating a 2.5x growth in concurrent active users.',
        'Led a team of 4 frontend developer engineers in implementing high-performance responsive web layouts using React 18, React Router, and Tailwind CSS.',
        'Architected a micro-frontend structure that reduced client bundle sizes by 35% and increased team-level deployment autonomy.',
        'Collaborated with product designers to create a robust component design library, reducing overall time-to-market for new features by 20%.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Software Engineer II',
      company: 'TechFlow Systems',
      location: 'Austin, TX',
      startDate: '2020-06',
      endDate: '2022-12',
      current: false,
      description: [
        'Developed and deployed over 15 scalable RESTful backend endpoints using Node.js, Express, and PostgreSQL, reducing query times by up to 30%.',
        'Implemented rigorous automated unit and integration test coverage (Jest, Supertest), increasing code coverage from 60% to 88% and cutting regression issues by 40%.',
        'Configured CI/CD deployment pipelines using GitHub Actions, speeding up typical deployment release times by 15 minutes.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      gradDate: '2020-05',
      gpa: '3.82',
      details: 'Graduated with Honors. Recipient of Dean\'s Honor List.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OmniTask - Task Management Platform',
      tech: 'React, Tailwind CSS, Express, Prisma, PostgreSQL',
      link: 'github.com/alexmercer/omnitask',
      description: [
        'Built a complete multi-user collaborative drag-and-drop workspace application handling over 10,000 active boards.',
        'Implemented real-time synchronization utilizing secure client-side polling and reactive backend state storage.'
      ]
    },
    {
      id: 'proj-2',
      name: 'DevDoc - API Documentation Generator',
      tech: 'TypeScript, Node.js, esbuild, Markdown',
      link: 'github.com/alexmercer/devdoc',
      description: [
        'Created a lightning-fast documentation builder CLI that parses TS files and produces SEO-friendly static responsive HTML docs in 500ms.',
        'Secured 1,200+ stars on GitHub and positive reviews from open-source developers.'
      ]
    }
  ],
  internships: [
    {
      id: 'int-1',
      role: 'Frontend Engineering Intern',
      company: 'WebLaunch Studio',
      startDate: '2019-06',
      endDate: '2019-09',
      description: [
        'Optimized company marketing pages for fast loading, boosting Google PageSpeed metrics from 65 to 94.',
        'Implemented pixel-perfect landing page variations for high-velocity user A/B testing.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2022-11'
    },
    {
      id: 'cert-2',
      name: 'Certified ScrumMaster (CSM)',
      issuer: 'Scrum Alliance',
      date: '2021-08'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Global Hackathon Winner 2022',
      description: 'Placed 1st out of 450 global competitor developer teams with a cloud-native smart recycling proof of concept.'
    },
    {
      id: 'ach-2',
      title: 'Outstanding Engineer Award 2024',
      description: 'Awarded SaaSify Employee of the Year for driving core architectural refactors ahead of schedule.'
    }
  ],
  languages: ['English (Native)', 'Spanish (Conversational)', 'German (Basic)'],
  hobbies: ['Open Source Development', 'Photography', 'Backpacking', 'Synthesizers'],
  references: 'Available upon formal employer request.',
  
  templateId: 'swe-1',
  primaryColor: '#1e293b',
  fontFamily: "'Poppins', sans-serif",
  fontSize: 'md',
  layoutOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements', 'languages', 'references'],
  showPhoto: false,
  updatedAt: '2026-07-21T08:10:00Z'
};

export const MOCK_ANALYSIS: AnalysisResult = {
  overallAtsScore: 84,
  formattingScore: 90,
  keywordScore: 78,
  experienceScore: 85,
  educationScore: 95,
  skillsScore: 82,
  readabilityScore: 88,
  grammarScore: 92,
  jobMatchScore: 0,
  strengths: [
    'Excellent use of power action verbs like Spearheaded, Architected, and Collaborated.',
    'Quantifiable results are clearly present in nearly all experience bullet points (e.g., 45% system latency, 35% bundle sizes).',
    'Perfect section headings (Summary, Experience, Education, Skills) are standard and easily parsed by ATS systems.',
    'No text-disrupting graphics, columns, complex tables, or sidebars that could cause text extraction corruption.'
  ],
  weaknesses: [
    'Slightly low density of specific Cloud tooling keywords like CloudWatch, AWS Lambda parameters, or Terraform.',
    'Contact information does not feature complete ZIP codes, which standard corporate systems sometimes require.',
    'Summary section contains minor generic filler phrases ("passionate and result-driven").'
  ],
  suggestions: [
    'Add specific cloud-management technologies like Terraform, Prometheus, or Kubernetes to your skills list if applicable.',
    'Add ZIP codes to your location element for maximum compatibility with strict legacy enterprise applicant systems.',
    'Rephrase summary to focus purely on accomplishments: \"Over 6 years leading React/Node applications with AWS migrations...\"'
  ],
  keywordDensity: [
    { keyword: 'React', frequency: 5, status: 'Optimal' },
    { keyword: 'TypeScript', frequency: 3, status: 'Optimal' },
    { keyword: 'Node.js', frequency: 3, status: 'Optimal' },
    { keyword: 'AWS', frequency: 2, status: 'Optimal' },
    { keyword: 'Docker', frequency: 1, status: 'Optimal' },
    { keyword: 'Kubernetes', frequency: 0, status: 'Missing' },
    { keyword: 'CI/CD', frequency: 2, status: 'Optimal' },
    { keyword: 'PostgreSQL', frequency: 2, status: 'Optimal' }
  ],
  grammarIssues: [
    {
      original: 'Led a team of 4 frontend developer engineers...',
      corrected: 'Led a team of 4 frontend engineers...',
      explanation: '"developer engineers" is redundant. Choose one or the other.',
      type: 'Wording'
    },
    {
      original: 'speeding up typical deployment release times by 15 minutes.',
      corrected: 'reducing typical deployment release times by 15 minutes.',
      explanation: 'You reduce time, rather than "speeding up" a metric of time.',
      type: 'Tone'
    }
  ],
  formattingChecks: [
    { checkName: 'Headers Consistency', passed: true, feedback: 'Proper capitalization and standard industry labels used.' },
    { checkName: 'Standard Fonts', passed: true, feedback: 'Uses modern, clean, system-safe sans-serif sizing.' },
    { checkName: 'Page Margins', passed: true, feedback: 'Well balanced white-space and side padding margins.' },
    { checkName: 'Bullet Points Quality', passed: true, feedback: 'Standard circular bullets. No problematic creative symbols used.' },
    { checkName: 'Tables / Graphic Blocks', passed: true, feedback: 'Safe document formatting. No hidden cells or image-embedded titles.' },
    { checkName: 'File Name Formatting', passed: true, feedback: 'Alex_Mercer_Software_Engineer_Resume.pdf is optimal.' }
  ],
  recommendedKeywords: ['Kubernetes', 'Terraform', 'GraphQL', 'Next.js', 'System Architecture', 'CI/CD Pipelines']
};

export const FAQ_ITEMS = [
  {
    q: 'How does the ATS Resume Score Checker calculate my score?',
    a: 'Our checker simulates corporate Applicant Tracking Systems (ATS) by parsing your text, extracting critical keywords, rating your formatting against known parser rules, counting metrics and action verbs, and evaluating section structures. Green (>80) indicates highly compatible; Yellow (60-80) needs work; Red (<60) has major parsing or structural blocks.'
  },
  {
    q: 'Can ATS systems read multi-column resumes?',
    a: 'While advanced modern ATS parsers can read multi-column formats, many older standard models still struggle and may parse text out of order (reading horizontally across columns). For safety, we recommend our clean single-column templates like "The Clean Sheet" or "Swiss Minimalist".'
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We process your resume text locally and send it securely via encrypted SSL to our private API proxy. We do not store or sell your personal details, and your uploads remain temporary inside your current session.'
  },
  {
    q: 'What is the Google X-Y-Z formula for bullet points?',
    a: 'Created by Google\'s HR leaders, the formula says: "Accomplished [X] as measured by [Y], by doing [Z]". It forces you to lead with a strong action verb, state the impact using a quantifiable metric, and then explain the technical action you took.'
  }
];

export const PRICING_PACKAGES = [
  {
    name: 'Starter',
    price: '$0',
    period: 'Forever Free',
    features: [
      'Access to 5 Basic Templates',
      'Standard AI Score Checker (3/day)',
      'Basic Resume Builder Inputs',
      'Download as Text/HTML format',
      'Interactive Resume Tips'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Professional Pro',
    price: '$15',
    period: 'per month',
    features: [
      'Access to all 20+ Premium Templates',
      'Unlimited AI Checks & Scores',
      'One-Click AI Bullet Points Corrector',
      'Google XYZ Formula Bullet Improver',
      'AI Cover Letter Generator',
      '24/7 AI Career Coach Carter Chatbot',
      'Download PDF, Word DOCX, and Print',
      'Detailed Job Description Matching'
    ],
    cta: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'Enterprise Executive',
    price: '$29',
    period: 'per month',
    features: [
      'All Professional Pro features',
      'Unlimited Cloud Version Saving',
      'Live Team Sharing and Feedback',
      'API access for bulk uploads',
      'Priority Premium Server Generation',
      '1-on-1 Expert Human Recruiter Review'
    ],
    cta: 'Get Executive',
    popular: false
  }
];

export const SAVED_RESUMES_MOCK: SavedResume[] = [
  { id: 'mock-1', title: 'Senior Full Stack Resume 2026', updatedAt: '2026-07-20T10:30:00Z', data: DEFAULT_RESUME, atsScore: 84 },
  { id: 'mock-2', title: 'Product Manager Draft', updatedAt: '2026-07-15T14:20:00Z', data: { ...DEFAULT_RESUME, id: 'mock-2', title: 'Product Manager Draft', personalInfo: { ...DEFAULT_RESUME.personalInfo, title: 'Technical Product Manager' } }, atsScore: 68 }
];
