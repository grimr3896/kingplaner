
export type FocusArea = 'Logic' | 'Cost' | 'Time' | 'Risk' | 'Feasibility' | 'Everything';
export type PlanMode = 'review' | 'develop';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'full';
export type TaskChoice = 'Accept' | 'Mitigate' | 'Avoid';

export interface RiskMetadata {
  baseRisk: number; // 0-100 (probability of failure before mitigation)
  residualRisk: number; // 0-100 (probability of failure after mitigation)
  type: 'Operational' | 'Financial' | 'Legal' | 'Environmental' | 'Social' | 'Ethical';
  mitigation: string;
  impactIfIgnored: string;
  acceptanceFlag: TaskChoice;
}

export interface PlanIssue {
  id: string;
  title: string;
  description: string;
  impact: string;
  suggestion: string;
  riskMetadata?: RiskMetadata;
}

export interface TaskNode {
  id: string;
  title: string;
  description: string;
  baseRisk: number;
  residualRisk: number;
  dependencies: string[];
  domainTags: string[];
  status: 'Normal' | 'Critical' | 'Blocked' | 'Contingent';
  userChoice?: TaskChoice;
  expectedOutcome?: string; // For problem solving steps
}

export interface RoadmapPhase {
  id: string;
  name: string;
  goals: string[];
  tasks: TaskNode[];
  milestone: string;
  phaseRiskScore: number;
}

export interface StressTest {
  factor: string;
  domain: string;
  impact: string;
  mitigation: string;
}

export interface AnalysisResult {
  resultType: 'strategic_plan' | 'problem_resolution';
  understanding: string;
  qualityScore?: number; // QVE Score (for plans)
  confidenceScore?: number; // Solution Confidence (for problems)
  riskScore: number; // Aggregated Residual Risk
  executiveSummary: string;
  detectedIssues: PlanIssue[];
  domainAnalysis: {
    legal: string;
    economic: string;
    social: string;
    ethical: string;
    environmental: string;
  };
  stressTests: StressTest[];
  phases: RoadmapPhase[];
  refinedVersion?: string;
  resourcesNeeded?: string[]; // Specifically for problem resolution
  certificationReasoning: string;
}

export type AppState = 'landing' | 'input' | 'analyzing' | 'result';

export interface UserPlan {
  text: string;
  type: 'Business' | 'Study' | 'Tech' | 'General';
  focusAreas: FocusArea[];
  mode: PlanMode;
  riskPreference: RiskLevel;
}
