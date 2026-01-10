
export type FocusArea = 'Logic' | 'Cost' | 'Time' | 'Risk' | 'Feasibility' | 'Everything';
export type PlanMode = 'review' | 'develop';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'full';
export type TaskChoice = 'Accept' | 'Mitigate' | 'Avoid';
export type IntentType = 'information' | 'problem_solving' | 'strategic_plan' | 'mixed';

export interface Concept {
  concept: string;
  explanation: string;
}

export interface RiskMetadata {
  baseRisk: number;
  residualRisk: number;
  type: 'Operational' | 'Financial' | 'Legal' | 'Environmental' | 'Social' | 'Ethical';
  mitigation: string;
  impactIfIgnored: string;
}

export interface TaskNode {
  id: string;
  title: string;
  description: string;
  expectedOutcome?: string;
  baseRisk: number;
  residualRisk: number;
  dependencies: string[];
  status: 'Normal' | 'Critical' | 'Blocked' | 'Contingent';
  mitigation?: string;
}

export interface RoadmapPhase {
  id: string;
  name: string;
  goals: string[];
  tasks: TaskNode[];
  milestone: string;
}

export interface AnalysisResult {
  intent: IntentType;
  // Common
  understanding: string;
  executiveSummary: string;
  
  // Information Mode
  topic?: string;
  keyConcepts?: Concept[];
  realWorldContext?: string;
  commonMisunderstandings?: string[];
  depthLevel?: 'Introductory' | 'Intermediate' | 'Advanced';
  
  // Problem Solving Mode
  problemStatement?: string;
  rootCauses?: string[];
  confidenceScore?: number;
  resourcesNeeded?: string[];
  
  // Planning Mode
  qualityScore?: number;
  riskScore?: number;
  certificationReasoning?: string;
  
  // Shared structural components
  phases?: RoadmapPhase[]; // Used as 'Resolution Path' or 'Growth Roadmap'
  domainAnalysis?: {
    legal: string;
    economic: string;
    social: string;
    ethical: string;
    environmental: string;
  };
  refinedVersion?: string;
  nextOptions: string[];
}

export type AppState = 'landing' | 'input' | 'analyzing' | 'result';

export interface UserPlan {
  text: string;
  type: 'Business' | 'Study' | 'Tech' | 'General';
  focusAreas: FocusArea[];
  mode: PlanMode;
  riskPreference: RiskLevel;
}
