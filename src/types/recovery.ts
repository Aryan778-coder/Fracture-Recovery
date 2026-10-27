export type BodyPart =
  | 'arm'
  | 'wrist'
  | 'hand'
  | 'leg'
  | 'ankle'
  | 'foot'
  | 'collarbone'
  | 'spine';

export type FractureType =
  | 'hairline'
  | 'stable_closed'
  | 'displaced'
  | 'compound_open'
  | 'comminuted'
  | 'stress';

export interface UserProfile {
  id: string;
  name: string;
  bodyPart: BodyPart;
  fractureType: FractureType;
  injuryDate: string; // ISO string YYYY-MM-DD
  hadSurgery: boolean;
  doctorConsulted: boolean;
  disclaimerAccepted: boolean;
  disclaimerAcceptedAt?: string;
  notes?: string;
}

export interface Stage {
  id: string;
  stageNumber: number;
  name: string;
  subtitle: string;
  durationWeeksRange: string;
  durationDays: number;
  description: string;
  allowedActivities: string[];
  restrictions: string[];
  clinicalGoal: string;
}

export type ExerciseDifficulty = 'Gentle' | 'Mild' | 'Moderate';

export interface Exercise {
  id: string;
  title: string;
  bodyPart: BodyPart;
  stageId: string;
  stageNumber: number;
  difficulty: ExerciseDifficulty;
  durationMinutes: number;
  sets: number;
  reps: number;
  holdSeconds?: number;
  videoUrl: string;
  thumbnailUrl: string;
  summary: string;
  steps: string[];
  commonMistakes: string[];
  stopIf: string[];
  targetMuscles: string[];
  safetyNote: string;
}

export interface PainLog {
  id: string;
  date: string; // YYYY-MM-DD
  painLevel: number; // 0 to 10
  timestamp: string;
  notes?: string;
  triggeredAlert?: boolean;
}

export interface DailyExerciseLog {
  date: string; // YYYY-MM-DD
  completedExerciseIds: string[];
}

export interface RecoveryProgressState {
  profile: UserProfile | null;
  dailyLogs: Record<string, string[]>; // date -> completedExerciseIds
  painLogs: PainLog[];
  completedMilestones: string[];
}
