
import { GoogleGenAI, Type } from "@google/genai";
import { UserPlan, AnalysisResult } from "../types";
import { SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePlan = async (plan: UserPlan): Promise<AnalysisResult> => {
  const context = `
    OPERATION_MODE: ${plan.mode.toUpperCase()}
    USER_RISK_SETTING: ${plan.riskPreference.toUpperCase()}
    SELECTED_FOCUS: ${plan.focusAreas.join(", ")}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `${context}\n\nUSER INPUT:\n${plan.text}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          intent: { type: Type.STRING, description: "information | problem_solving | strategic_plan | mixed" },
          understanding: { type: Type.STRING },
          executiveSummary: { type: Type.STRING },
          // Info Mode Fields
          topic: { type: Type.STRING },
          keyConcepts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                concept: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          },
          realWorldContext: { type: Type.STRING },
          commonMisunderstandings: { type: Type.ARRAY, items: { type: Type.STRING } },
          depthLevel: { type: Type.STRING },
          // Problem Mode Fields
          problemStatement: { type: Type.STRING },
          rootCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
          confidenceScore: { type: Type.NUMBER },
          resourcesNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
          // Plan Mode Fields
          qualityScore: { type: Type.NUMBER },
          riskScore: { type: Type.NUMBER },
          certificationReasoning: { type: Type.STRING },
          // Structural
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                milestone: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      expectedOutcome: { type: Type.STRING },
                      baseRisk: { type: Type.NUMBER },
                      residualRisk: { type: Type.NUMBER },
                      dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
                      status: { type: Type.STRING },
                      mitigation: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          },
          domainAnalysis: {
            type: Type.OBJECT,
            properties: {
              legal: { type: Type.STRING },
              economic: { type: Type.STRING },
              social: { type: Type.STRING },
              ethical: { type: Type.STRING },
              environmental: { type: Type.STRING }
            }
          },
          refinedVersion: { type: Type.STRING },
          nextOptions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["intent", "understanding", "executiveSummary", "nextOptions"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};
