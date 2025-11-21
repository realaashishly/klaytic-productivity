
'use server'
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Task, TaskStatus, TaskAnalysis, AITextOperation, JobOpportunity, CareerPathResult, CareerChatMessage, GlobalAnalysisResult, TrendDeepDive, GlobalChatMessage, MiniAppChat } from "../types";

// Helper to ensure unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to clean markdown from JSON response
const cleanJsonText = (text: string): string => {
  if (!text) return "{}";
  return text.replace(/```json\n?|\n?```/g, '').trim();
};

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Uses Gemini 3 Pro (Preview) to break down a complex goal into actionable tasks.
 */
export const generateProjectPlan = async (goal: string): Promise<Task[]> => {
  const prompt = `
    I have a project goal: "${goal}".
    Please break this down into 3-6 actionable tasks for a productivity board.
    Keep titles concise and descriptions helpful.
    Suggest appropriate tags.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 2048 }, 
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              tags: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "description", "tags"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const parsed = JSON.parse(jsonText);
    
    return parsed.map((item: any) => ({
      id: generateId(),
      title: item.title,
      description: item.description,
      status: TaskStatus.TODO,
      tags: item.tags,
      priority: 0,
      aiGenerated: true
    }));
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

/**
 * Uses Gemini 3 Pro to perform a "Deep Dive" analysis on a specific task.
 */
export const analyzeTaskDeepDive = async (task: Task): Promise<TaskAnalysis> => {
  const prompt = `
    Analyze this task deeply: "${task.title}".
    Description: "${task.description}".
    
    1. Break it down into 3-5 concrete sub-steps (subtasks).
    2. Identify potential risks or blockers.
    3. Estimate the effort (e.g., "2 hours", "3 days").
    4. Give one sentence of strategic advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Higher thinking budget for deep analysis
        thinkingConfig: { thinkingBudget: 4096 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN }
                }
              }
            },
            risks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedEffort: { type: Type.STRING },
            strategicAdvice: { type: Type.STRING }
          }
        }
      }
    });

    const jsonText = response.text;
    return JSON.parse(jsonText || "{}");
  } catch (error) {
    console.error("Error analyzing task:", error);
    throw error;
  }
};

/**
 * Uses Gemini 3 Pro to generate an executive summary for the dashboard.
 * UPDATED: Requests simple language.
 */
export const generateBoardInsights = async (tasks: Task[]): Promise<string> => {
  if (tasks.length === 0) return "No tasks available for analysis.";

  const taskSummary = tasks.map(t => `- [${t.status}] ${t.title} (${t.tags.join(', ')})`).join('\n');
  
  const prompt = `
    You are an elite productivity coach. Analyze the following project board state:
    
    ${taskSummary}
    
    Provide a 3-sentence executive summary. 
    1. Identify the biggest bottleneck or focus area.
    2. Comment on the balance of the workload.
    3. Suggest the next best move.
    
    IMPORTANT: Use simple, easy-to-understand English. Avoid complex vocabulary or corporate jargon. Be clear and direct.
    Do NOT use markdown formatting like **bold**. Keep it plain text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 },
      }
    });
    return response.text || "Unable to generate insights.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "AI is currently offline.";
  }
};

/**
 * Generates a unique, fresh joke for the companion.
 */
export const generateJoke = async (): Promise<string> => {
  const prompt = "Tell me a unique, short, and witty joke about programming, AI, cybersecurity, or the future. Ensure it is funny and NOT a common cliché. Keep it under 20 words.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 1.2 // High creativity to avoid repetition
      }
    });
    return response.text || "I'm out of jokes for now.";
  } catch (e) {
    return "I'm buffering...";
  }
};

/**
 * Generates a personalized, persona-based message for the Dashboard.
 */
export const generateDashboardMessage = async (tasks: Task[]): Promise<{message: string, mood: 'strict' | 'funny' | 'motivational'}> => {
    const overdueCount = tasks.filter(t => {
        if (!t.dueDate) return false;
        return new Date(t.dueDate) < new Date() && t.status !== TaskStatus.DONE;
    }).length;
    const completedCount = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const totalCount = tasks.length;
    
    let context = `User has ${totalCount} tasks. ${overdueCount} are overdue. ${completedCount} are completed.`;
    let toneInstruction = "Be balanced.";
    
    if (overdueCount > 0) {
        toneInstruction = "Be STRICT and URGENT. Scold the user slightly for missing deadlines.";
    } else if (completedCount > totalCount / 2 && totalCount > 0) {
        toneInstruction = "Be FUNNY and CELEBRATORY. Crack a joke about how productive they are.";
    } else if (totalCount === 0) {
        toneInstruction = "Be INQUISITIVE. Ask where the work is.";
    } else {
        toneInstruction = "Be MOTIVATIONAL and stoic.";
    }

    const prompt = `
      ${context}
      ${toneInstruction}
      Write a short, punchy message (max 20 words) directly to the user. 
      Return JSON: { "message": "string", "mood": "strict" | "funny" | "motivational" }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || '{"message": "Stay focused.", "mood": "motivational"}');
    } catch (e) {
        return { message: "Systems online. Ready for input.", mood: "motivational" };
    }
};

export const generateEmailBriefContent = async (tasks: Task[]): Promise<string> => {
  const taskSummary = tasks.map(t => `- ${t.title} (Due: ${t.dueDate || 'N/A'})`).join('\n');
  const prompt = `Write a professional, motivating daily briefing email for a user with these tasks:\n${taskSummary}\nKeep it concise and formatted as an email body.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 1024 } }
    });
    return response.text || "Brief generated.";
  } catch (e) {
      return "Error generating brief.";
  }
};

/**
 * Uses Nano Banana (Gemini 2.5 Flash Image) or Imagen to generate visualization assets.
 * ENFORCES REALISTIC STYLE AND NO TEXT.
 */
export const generateVisualization = async (prompt: string): Promise<string> => {
  // Force realistic style, explicitly forbid text
  const enhancedPrompt = `Photorealistic, 8k, hyper-realistic, cinematic photography, highly detailed, ${prompt}. DO NOT INCLUDE TEXT, WORDS, LETTERS, OR NUMBERS. PURE VISUAL ART.`;

  try {
    // Attempt 1: Nano Banana (Fast, efficient)
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [
          { parts: [{ text: enhancedPrompt }] }
        ],
        config: {
          responseModalities: [Modality.IMAGE]
        }
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData?.data) {
         return `data:image/png;base64,${part.inlineData.data}`;
      }
    } catch (nanoError) {
      console.warn("Nano Banana generation failed, attempting fallback...", nanoError);
    }
    
    // Attempt 2: Imagen 4.0 (High Quality fallback)
    try {
      const imagenResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: enhancedPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9'
        }
      });

      const imageBytes = imagenResponse.generatedImages?.[0]?.image?.imageBytes;
      if (imageBytes) {
        return `data:image/jpeg;base64,${imageBytes}`;
      }
    } catch (imagenError) {
      console.error("Imagen fallback failed", imagenError);
    }

    // Fallback: Return a high-quality placeholder if all AI fails
    console.warn("All image models failed. Returning placeholder.");
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

  } catch (error) {
    console.error("Error in visualization service:", error);
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"; 
  }
};

/**
 * Executes a Custom Mini App Prompt using Gemini 3.
 */
export const runCustomAppChat = async (systemInstruction: string, history: MiniAppChat[], userContent: string): Promise<string> => {
  
  const historyPrompt = history.map(h => `${h.role}: ${h.text}`).join('\n');
  const finalPrompt = `
    System: ${systemInstruction}
    
    History:
    ${historyPrompt}
    
    User: ${userContent}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: finalPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Error running custom prompt:", error);
    return "Error communicating with the AI model.";
  }
};

export const aiTextEdit = async (text: string, operation: AITextOperation): Promise<string> => {
  let prompt = "";
  let instruction = "";

  switch (operation) {
    case 'summarize':
      prompt = `Summarize the following note into a concise paragraph: \n\n"${text}"`;
      instruction = "You are an expert editor. Provide a sharp, executive summary.";
      break;
    case 'fix_grammar':
      prompt = `Correct the grammar and spelling of the following text, maintaining the original meaning: \n\n"${text}"`;
      instruction = "You are a professional copy editor.";
      break;
    case 'expand':
      prompt = `Expand upon the following ideas, adding relevant details and depth: \n\n"${text}"`;
      instruction = "You are a creative writer. Flesh out the concepts provided.";
      break;
    case 'professional_tone':
      prompt = `Rewrite the following text to sound more professional and corporate: \n\n"${text}"`;
      instruction = "You are a corporate communications expert.";
      break;
    case 'continue':
      prompt = `Continue writing the following text naturally, completing the thought or adding the next logical section: \n\n"${text}"`;
      instruction = "You are a co-writer. Continue the user's flow of thought seamlessly.";
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: instruction,
        thinkingConfig: { thinkingBudget: 1024 } 
      }
    });
    return response.text || text;
  } catch (error) {
    console.error("Error editing text:", error);
    throw error;
  }
};

// --- NEW CAPABILITIES ---

export const findJobs = async (role: string): Promise<JobOpportunity[]> => {
    const prompt = `Find 5 active or typical job listings for the role of "${role}".
    Include company, location, salary range, and a link to apply (or company site).
    
    Output strict JSON in this format:
    [
      {
        "role": "string",
        "company": "string",
        "location": "string",
        "salaryRange": "string",
        "link": "string",
        "postedAt": "string",
        "description": "string",
        "requirements": ["string"]
      }
    ]
    Do not use markdown code blocks.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      
      const text = cleanJsonText(response.text || "[]");
      const data = JSON.parse(text);
      return data.map((item: any) => ({...item, id: generateId()}));
    } catch (e) {
      console.error("Job search failed", e);
      return [];
    }
};

// Career Chat Agent
export const careerCounselorChat = async (history: CareerChatMessage[], newMessage: string): Promise<CareerChatMessage> => {
    const historyContext = history.map(h => `${h.role}: ${h.content}`).join('\n');
    
    const prompt = `
      You are a SOTA Career Counsellor Agent.
      
      Conversation History:
      ${historyContext}
      
      User Input: "${newMessage}"
      
      Logic:
      1. If the user is unsure, ask probing questions (1-2 max) to determine their interests.
      2. If the user has a clear direction, provide a comprehensive analysis.
      3. If you have enough info to give a final recommendation, output JSON for the result card.
      
      Output Format:
      - If asking questions/chatting: Just return plain text.
      - If giving final recommendation: Return strictly JSON with keys: { "roleTitle": string, "salaryRange": string, "growthTrend": string, "roadmap": string[], "recommendedSkills": string[] }.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
           thinkingConfig: { thinkingBudget: 4096 }
        }
      });
      
      const text = response.text || "";
      const cleanedText = cleanJsonText(text);
      
      // Detect if output is JSON (Recommendation)
      if (cleanedText.startsWith('{') && cleanedText.endsWith('}')) {
         try {
            const data = JSON.parse(cleanedText);
            return {
              id: generateId(),
              role: 'ai',
              content: "Here is the career path I've designed for you based on our analysis.",
              type: 'result',
              data: data
            };
         } catch (e) {
            // Fallback if parse fails
         }
      }

      return {
        id: generateId(),
        role: 'ai',
        content: text,
        type: 'text'
      };

    } catch (e) {
      console.error(e);
      return { id: generateId(), role: 'ai', content: "I'm having trouble connecting to the career database. Please try again.", type: 'text' };
    }
};

export const getSearchSuggestions = async (partialQuery: string): Promise<string[]> => {
    if (!partialQuery || partialQuery.length < 2) return [];
    
    const prompt = `Suggest 5 popular job titles, global trends, or topics starting with or related to "${partialQuery}". Return only a JSON array of strings.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) {
        return [];
    }
};


// --- DYNAMIC GLOBAL INTELLIGENCE GENERATOR ---

export const searchGlobalIntelligence = async (query: string): Promise<GlobalAnalysisResult> => {
  const prompt = `
    You are the Klaytic Planetary Engine.
    User Query: "${query}"
    
    Task:
    1. Analyze the query to determine the intent (e.g., looking for weather, jobs, economy, culture).
    2. Determine which continents are most relevant.
    3. GENERATE A DYNAMIC UI LAYOUT (Widgets) to best display the answer.
    
    Available Widget Types:
    - 'stat': Display a number, percentage, or key metric. (e.g., "25°C", "$120k", "High Demand")
    - 'list': Display a list of items. (e.g., "Top Companies", "Forecast")
    - 'tags': Display pills/keywords. (e.g., "Skills", "Technologies")
    - 'text': A short paragraph of info.
    - 'insight': A special highlighted box for key takeaway.

    Icon Names: Use standard Lucide icon names (e.g., "cloud", "sun", "dollar-sign", "briefcase", "code", "trending-up", "users").

    Output strict JSON structure:
    {
      "summary": "A 2-sentence high-level overview of the query results.",
      "relevantContinents": ["North America", "Europe"], // List names of relevant continents
      "widgets": [
         {
           "id": "unique_id_1",
           "type": "stat",
           "title": "Average Salary",
           "icon": "dollar-sign",
           "width": "half",
           "content": { "value": "$140,000", "trend": "+12%", "label": "Senior Level" }
         },
         {
           "id": "unique_id_2",
           "type": "list",
           "title": "Top Tech Hubs",
           "icon": "building-2",
           "width": "half",
           "content": { "items": ["San Francisco", "London", "Berlin", "Bangalore"] }
         },
         // ... generate 4-6 widgets that best answer the query
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4096 } // High budget for layout logic
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Global Search Error:", e);
    return { 
        summary: "Planetary Engine offline. Unable to process query.", 
        relevantContinents: [], 
        widgets: [] 
    };
  }
};

export const analyzeTrendDeepDive = async (topic: string, location: string): Promise<TrendDeepDive> => {
  const prompt = `
    Provide a deep dive explanation for the trend "${topic}" in ${location}.
    Explain why it's trending and its impact.
    Also, write a highly visual, artistic prompt to generate an image representing this trend.
    
    Return JSON:
    {
      "explanation": "string",
      "visualPrompt": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { explanation: "Data unavailable.", visualPrompt: "" };
  }
};

export const chatWithGlobalIntel = async (history: GlobalChatMessage[], context: GlobalAnalysisResult, newMessage: string): Promise<GlobalChatMessage> => {
    const contextStr = JSON.stringify(context);
    const historyStr = history.map(h => `${h.role}: ${h.content}`).join('\n');

    const prompt = `
      You are the Klaytic Planetary Interface.
      
      Context (Current Data on Screen):
      ${contextStr}
      
      Chat History:
      ${historyStr}
      
      User Input: "${newMessage}"
      
      Answer the user's question based on the Context data provided above. If the answer isn't in the data, use your general knowledge but mention that it's outside the current report. Be concise and futuristic.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 1024 } }
        });
        
        return {
            id: generateId(),
            role: 'ai',
            content: response.text || "Signal lost."
        };
    } catch (e) {
        return { id: generateId(), role: 'ai', content: "Uplink failed." };
    }
};
