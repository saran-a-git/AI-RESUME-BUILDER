import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Google Gemini API SDK
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Google Gen AI client initialized successfully.");
  } catch (err) {
    console.error("Error initializing Google Gen AI Client:", err);
  }
} else {
  console.warn("WARNING: GEMINI_API_KEY not found or is a placeholder. Server will run in demo/fallback mode.");
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// HELPER FOR WRITING ROBUST PROMPTS AND HANDLING API KEY CHECK
const generateWithGemini = async (prompt: string, responseSchema?: any, systemInstruction?: string) => {
  if (!ai) {
    throw new Error("Gemini API key is not configured. Please configure it in Settings > Secrets.");
  }
  
  const config: any = {
    temperature: 0.7,
  };

  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }

  if (responseSchema) {
    config.responseMimeType = "application/json";
    config.responseSchema = responseSchema;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: config,
    });
    return response.text || "";
  } catch (error: any) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
};

// ==========================================
// API ROUTES
// ==========================================

// Health / Status Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    apiConfigured: !!ai,
    environment: process.env.NODE_ENV || "development",
  });
});

// 1. AI Resume Analyzer & ATS Score Checker
app.post("/api/ai/analyze-resume", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required." });
    }

    const systemInstruction = `You are an expert HR recruiter, ATS system engineer, and career coach. Your task is to analyze the provided resume text thoroughly and check its compatibility with ATS algorithms, grammatical correctness, and general resume standards. If a job description is provided, compute a specialized Job Match score.`;

    let prompt = `Analyze this resume text:
"${resumeText}"
`;

    if (jobDescription) {
      prompt += `\nAnd match it against this target Job Description:\n"${jobDescription}"`;
    }

    // Standardize Schema for JSON output
    const analysisSchema = {
      type: Type.OBJECT,
      properties: {
        overallAtsScore: { type: Type.INTEGER, description: "ATS score out of 100" },
        formattingScore: { type: Type.INTEGER, description: "Formatting rating out of 100" },
        keywordScore: { type: Type.INTEGER, description: "Keyword density/relevance score out of 100" },
        experienceScore: { type: Type.INTEGER, description: "Experience section quality score out of 100" },
        educationScore: { type: Type.INTEGER, description: "Education section score out of 100" },
        skillsScore: { type: Type.INTEGER, description: "Skills list strength score out of 100" },
        readabilityScore: { type: Type.INTEGER, description: "Readability & formatting score out of 100" },
        grammarScore: { type: Type.INTEGER, description: "Spelling & Grammar score out of 100" },
        jobMatchScore: { type: Type.INTEGER, description: "Job description fit score out of 100 (0 if no JD given)" },
        
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of 3-5 key resume strengths",
        },
        weaknesses: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of 3-5 specific resume weaknesses or critical red flags",
        },
        suggestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Actionable concrete improvements the user should make",
        },
        keywordDensity: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              frequency: { type: Type.INTEGER },
              status: { type: Type.STRING, description: "Optimal, Missing, Overused" },
            },
            required: ["keyword", "frequency", "status"],
          },
          description: "Key professional terms check",
        },
        grammarIssues: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING },
              corrected: { type: Type.STRING },
              explanation: { type: Type.STRING },
              type: { type: Type.STRING, description: "Grammar, Spelling, Tone, Wording" },
            },
            required: ["original", "corrected", "explanation", "type"],
          },
          description: "Grammar and word choice concerns found",
        },
        formattingChecks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              checkName: { type: Type.STRING },
              passed: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
            },
            required: ["checkName", "passed", "feedback"],
          },
          description: "Checklists for headers, bullet points, font indicators, columns",
        },
        recommendedKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Highly sought keywords/skills missing from this resume",
        },
      },
      required: [
        "overallAtsScore", "formattingScore", "keywordScore", "experienceScore",
        "educationScore", "skillsScore", "readabilityScore", "grammarScore",
        "strengths", "weaknesses", "suggestions", "keywordDensity", "grammarIssues",
        "formattingChecks", "recommendedKeywords"
      ],
    };

    const responseText = await generateWithGemini(prompt, analysisSchema, systemInstruction);
    const parsedData = JSON.parse(responseText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze resume" });
  }
});

// 2. One-click Resume Corrector & ATS Optimizer
app.post("/api/ai/correct-resume", async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: "Resume data is required." });
    }

    const systemInstruction = `You are a professional resume writer. Your job is to correct the input resume data. Enhance grammar, substitute weak verbs with power/action verbs, remove filler words, format summaries to be high-impact, and optimize experience statements to follow the Google X-Y-Z formula (Accomplished [X], as measured by [Y], by doing [Z]). Make sure you return the exact same sections but with improved ATS-friendly contents.`;

    const prompt = `Rewrite and optimize the following resume details. Fix all grammatical and structural weaknesses. Maintain the exact user details but elevate the language.

Resume Data:
${JSON.stringify(resumeData, null, 2)}`;

    // Schema to return optimized segments
    const correctionSchema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: "Corrected and rewritten high-impact summary" },
        skills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Refined and expanded technical/soft skills",
        },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              company: { type: Type.STRING },
              duration: { type: Type.STRING },
              description: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Rewritten bullet points matching Google XYZ formulas and action verbs",
              },
            },
            required: ["role", "company", "description"],
          },
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              tech: { type: Type.STRING },
              description: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Impactful project bullets",
              },
            },
            required: ["name", "description"],
          },
        },
        achievements: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Quantified and clear achievements list",
        },
        certifications: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Recommended relevant certificates based on role",
        },
      },
      required: ["summary", "skills", "experience", "projects", "achievements"],
    };

    const responseText = await generateWithGemini(prompt, correctionSchema, systemInstruction);
    const parsedData = JSON.parse(responseText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Corrector Error:", error);
    res.status(500).json({ error: error.message || "Failed to correct resume" });
  }
});

// 3. AI Text Generators (Professional Summary, Experience bullets, Skills gap suggestions)
app.post("/api/ai/generate-field", async (req, res) => {
  try {
    const { fieldType, context } = req.body;
    if (!fieldType || !context) {
      return res.status(400).json({ error: "fieldType and context are required." });
    }

    let prompt = "";
    let systemInstruction = "You are ResumeAI Pro, an elite professional resume writer.";

    if (fieldType === "summary") {
      prompt = `Based on the following career details, generate a powerful, concise 3-4 sentence professional summary that is highly ATS-optimized, features keywords, and has zero buzzwords:
Career context: ${JSON.stringify(context)}`;
    } else if (fieldType === "experience") {
      prompt = `Write 3-4 high-impact resume achievement bullet points for a ${context.role} role at ${context.company}. Follow the Google X-Y-Z formula (Accomplished X, as measured by Y, by doing Z). Use powerful action verbs.`;
    } else if (fieldType === "skills") {
      prompt = `For a candidate targeting a ${context.targetRole} position with experience in: ${context.currentSkills}. Suggest 10 of the most in-demand technical and soft skills to optimize their ATS score.`;
    } else if (fieldType === "certifications") {
      prompt = `Suggest 5 globally recognized and highly valuable professional certifications for a candidate in the field of: ${context.industry}. Provide a 1-sentence value statement for each.`;
    } else if (fieldType === "achievements") {
      prompt = `Based on these project/work details: ${JSON.stringify(context)}, construct 3 key quantitative achievements. Add metrics, percentages, or dollar values where appropriate to make them highly impressive.`;
    } else {
      return res.status(400).json({ error: "Invalid fieldType." });
    }

    const text = await generateWithGemini(prompt, undefined, systemInstruction);
    res.json({ result: text });
  } catch (error: any) {
    console.error("Field Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate field" });
  }
});

// 4. AI Cover Letter Generator
app.post("/api/ai/generate-cover-letter", async (req, res) => {
  try {
    const { resumeText, jobDescription, companyName, position, tone } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "Resume context is required." });
    }

    const systemInstruction = `You are a highly persuasive professional copywriter. Write a tailored, executive cover letter that connects the candidate's achievements to the requirements of the job description in an authentic, impactful tone. No generic templates or placeholders.`;

    const prompt = `Create a custom Cover Letter using the following inputs:
- Candidate Resume Summary/Details: "${resumeText.substring(0, 4000)}"
- Target Company: "${companyName || "the target employer"}"
- Target Position: "${position || "the advertised role"}"
- Target Tone: "${tone || "Professional"}"
- Target Job Description: "${jobDescription || ""}"

Structure the letter professionally:
1. Contact Header Details / Date
2. Hook: Passionate, tailored opening mentioning the position.
3. Mid Section: Focus on 2-3 specific quantifiable matching achievements from the resume that prove they fit the target job.
4. Value Add: Explain why they want this company specifically.
5. Call to Action: Polite, assertive request for interview.
`;

    const text = await generateWithGemini(prompt, undefined, systemInstruction);
    res.json({ coverLetter: text });
  } catch (error: any) {
    console.error("Cover Letter Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate cover letter" });
  }
});

// 5. Career Coach Chatbot (Session Based)
app.post("/api/ai/chat-coach", async (req, res) => {
  try {
    const { messages, resumeContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required." });
    }

    const systemInstruction = `You are "Coach Carter", the elite Career Coach and Interview Strategist at ResumeAI Pro. 
- You are friendly, encouraging, highly analytical, and strategic.
- Use your candidate context (resume details provided) to offer hyper-personalized, ultra-specific advice.
- When answering career questions, provide concrete bullet points, structured checklists, or exact phrasing they can use in an interview.
- Keep answers professional, concise, and highly actionable.
- Candidate Resume Context: ${resumeContext ? JSON.stringify(resumeContext) : "Not uploaded yet. Ask them to upload or fill their resume details for deeper advice!"}`;

    // Format the conversation history for the prompt
    let conversationHistory = "";
    messages.forEach((msg: any) => {
      const sender = msg.role === "user" ? "Candidate" : "Coach Carter";
      conversationHistory += `${sender}: ${msg.content}\n\n`;
    });

    const prompt = `${conversationHistory}Coach Carter:`;

    const text = await generateWithGemini(prompt, undefined, systemInstruction);
    res.json({ reply: text });
  } catch (error: any) {
    console.error("Chat Coach Error:", error);
    res.status(500).json({ error: error.message || "Failed to consult Career Coach" });
  }
});

// 6. AI Interview Prep Questions & Roadmap Generator
app.post("/api/ai/career-tools", async (req, res) => {
  try {
    const { toolType, resumeText, roleName, industry } = req.body;
    
    let prompt = "";
    let systemInstruction = "You are ResumeAI Pro's Chief Career Strategist.";
    let responseSchema: any = null;

    if (toolType === "interview-prep") {
      prompt = `Generate a set of 5 custom, highly relevant job interview questions for the role "${roleName || "Target Role"}" in the industry "${industry || "General"}". Provide suggested high-impact answer frameworks for each, tailored to this resume context:
Resume: ${resumeText || "General Candidate"}`;

      responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            questionType: { type: Type.STRING, description: "Behavioral, Technical, Situational" },
            whyAsked: { type: Type.STRING, description: "What the interviewer is actually testing" },
            answerFramework: { type: Type.STRING, description: "Detailed guide on how to structure the answer (e.g. STAR method)" },
            samplePerfectAnswer: { type: Type.STRING, description: "An impressive, professional mock response using metrics" },
          },
          required: ["question", "questionType", "whyAsked", "answerFramework", "samplePerfectAnswer"],
        }
      };
    } else if (toolType === "career-roadmap") {
      prompt = `Based on this candidate profile, generate an actionable 5-step, 12-month Career Roadmap and Skill Gap Analysis to advance to the next career level (e.g., senior, lead, manager) in the "${industry || "target field"}":
Resume: ${resumeText || "General candidate details"}`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          currentStanding: { type: Type.STRING, description: "Brief analysis of where the candidate stands today" },
          skillGapAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                priority: { type: Type.STRING, description: "High, Medium, Low" },
                resources: { type: Type.STRING, description: "Recommended courses or projects to learn it" },
              },
              required: ["skill", "priority", "resources"],
            },
          },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING, description: "e.g., Month 1-3, Month 4-6" },
                milestone: { type: Type.STRING, description: "What to achieve in this phase" },
                actions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exact items to work on" },
              },
              required: ["phase", "milestone", "actions"],
            },
          },
          salaryEstimate: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              low: { type: Type.STRING },
              median: { type: Type.STRING },
              high: { type: Type.STRING },
            },
            required: ["role", "low", "median", "high"],
          },
        },
        required: ["currentStanding", "skillGapAnalysis", "timeline", "salaryEstimate"],
      };
    } else {
      return res.status(400).json({ error: "Invalid toolType requested." });
    }

    const text = await generateWithGemini(prompt, responseSchema, systemInstruction);
    const parsedData = JSON.parse(text);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Career Tools Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate career intelligence" });
  }
});

// ==========================================
// VITE DEV SERVER & PRODUCTION ROUTING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static build from /dist");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
