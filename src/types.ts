export type EducationLevel = 'School' | 'College' | 'Undergraduate';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type Topic = 
  | 'Auto Detect Topic'
  | 'Algebra'
  | 'Equations'
  | 'Functions'
  | 'Geometry'
  | 'Trigonometry'
  | 'Calculus'
  | 'Differential Equations'
  | 'Linear Algebra'
  | 'Probability'
  | 'Statistics'
  | 'Complex Numbers'
  | 'Other';

export interface InvestigationRequest {
  problem: string;
  solution: string;
  topic?: Topic;
  educationLevel?: EducationLevel;
  difficulty?: DifficultyLevel;
}

export interface StudentStep {
  stepNumber: number;
  content: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface InvestigationResult {
  isSolutionCorrect: boolean;
  detectedTopic: string;
  caseSummary: {
    problemStatement: string;
    studentApproachSummary: string;
  };
  stepsBreakdown: StudentStep[];
  mistakeDetails?: {
    stepNumber: number;
    incorrectStepContent: string;
    whatWentWrong: string;
    misconceptionReason: string;
  };
  hints: {
    level1: string; // Small conceptual hint
    level2: string; // More specific hint
    level3: string; // Strong hint almost guiding to fix
  };
  conceptToReview: {
    title: string;
    explanation: string;
  };
  tryAgainNextStep: string;
  fullStepByStepSolution: string;
  encouragingClosing: string;
}

export interface SimilarProblemResponse {
  originalConcept: string;
  newProblem: string;
  hintForNewProblem: string;
  expectedFinalAnswerSummary?: string;
}

export interface CheckSolutionRequest {
  problem: string;
  studentSolution: string;
  expectedConcept: string;
}

export interface CheckSolutionResult {
  isCorrect: boolean;
  conceptMastered: boolean;
  feedback: string;
  firstMistakeIfAny?: string;
  encouragement: string;
}

export interface TeachMeMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isQuestion?: boolean;
}

export interface SampleCase {
  id: string;
  title: string;
  topic: Topic;
  educationLevel: EducationLevel;
  difficulty: DifficultyLevel;
  problem: string;
  solution: string;
  description: string;
}
