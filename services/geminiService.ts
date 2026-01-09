
import { GoogleGenAI, Type } from "@google/genai";
import { UserPlan, AnalysisResult } from "../types";
import { SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePlan = async (plan: UserPlan): Promise<AnalysisResult> => {
  const context = `
    OPERATION: ${plan.mode.toUpperCase()}
    USER RISK APPETITE: ${plan.riskPreference.toUpperCase()}
    STRATEGIC DOMAINS: Law, Economics, Environment, Social, Ethics
    FOCUS: ${plan.focusAreas.join(", ")}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `${context}\n\nUSER INPUT (PLAN OR PROBLEM):\n${plan.text}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          resultType: { type: Type.STRING, description: "'strategic_plan' or 'problem_resolution'" },
          understanding: { type: Type.STRING },
          executiveSummary: { type: Type.STRING },
          qualityScore: { type: Type.NUMBER },
          confidenceScore: { type: Type.NUMBER },
          riskScore: { type: Type.NUMBER },
          resourcesNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
          certificationReasoning: { type: Type.STRING },
          detectedIssues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                riskMetadata: {
                  type: Type.OBJECT,
                  properties: {
                    baseRisk: { type: Type.NUMBER },
                    residualRisk: { type: Type.NUMBER },
                    type: { type: Type.STRING },
                    mitigation: { type: Type.STRING },
                    impactIfIgnored: { type: Type.STRING },
                    acceptanceFlag: { type: Type.STRING }
                  },
                  required: ["baseRisk", "residualRisk", "mitigation"]
                }
              },
              required: ["id", "title", "description", "suggestion"]
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
            },
            required: ["legal", "economic", "social", "ethical", "environmental"]
          },
          stressTests: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                factor: { type: Type.STRING },
                domain: { type: Type.STRING },
                impact: { type: Type.STRING },
                mitigation: { type: Type.STRING }
              },
              required: ["factor", "impact", "mitigation"]
            }
          },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                milestone: { type: Type.STRING },
                phaseRiskScore: { type: Type.NUMBER },
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
                      domainTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                      status: { type: Type.STRING }
                    },
                    required: ["id", "title", "description", "baseRisk", "residualRisk"]
                  }
                }
              },
              required: ["id", "name", "tasks", "milestone"]
            }
          },
          refinedVersion: { type: Type.STRING }
        },
        required: ["resultType", "executiveSummary", "riskScore", "detectedIssues", "phases", "domainAnalysis", "stressTests"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};
