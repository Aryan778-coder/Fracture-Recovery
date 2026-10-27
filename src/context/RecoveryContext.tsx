import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PainLog, Stage, UserProfile } from '../types/recovery';
import { RECOVERY_STAGES } from '../data/mockData';

interface RecoveryContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  daysSinceInjury: number;
  currentStage: Stage;
  completedExercisesToday: string[];
  painLogs: PainLog[];
  todayPainLevel: number | null;
  saveProfile: (profile: UserProfile) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  toggleExerciseCompletion: (exerciseId: string) => Promise<void>;
  isExerciseCompletedToday: (exerciseId: string) => boolean;
  logPainLevel: (level: number, notes?: string) => Promise<boolean>;
  isStageUnlocked: (stageNumber: number) => boolean;
  getStageUnlockReason: (stageNumber: number) => string;
  resetAllData: () => Promise<void>;
}

const STORAGE_KEYS = {
  PROFILE: '@ossacare_user_profile',
  DAILY_LOGS: '@ossacare_daily_logs',
  PAIN_LOGS: '@ossacare_pain_logs',
};

const getTodayDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const calculateDays = (dateString?: string): number => {
  if (!dateString) return 0;
  const injury = new Date(dateString);
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - injury.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const determineStage = (days: number): Stage => {
  if (days <= 21) {
    return RECOVERY_STAGES[0]; // Stage 1 (Weeks 0-3)
  } else if (days <= 42) {
    return RECOVERY_STAGES[1]; // Stage 2 (Weeks 4-6)
  } else if (days <= 84) {
    return RECOVERY_STAGES[2]; // Stage 3 (Weeks 7-12)
  } else {
    return RECOVERY_STAGES[3]; // Stage 4 (Weeks 13+)
  }
};

const RecoveryContext = createContext<RecoveryContextType | undefined>(undefined);

export const RecoveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dailyLogs, setDailyLogs] = useState<Record<string, string[]>>({});
  const [painLogs, setPainLogs] = useState<PainLog[]>([]);

  // Load persisted state on app start
  useEffect(() => {
    const hydrateState = async () => {
      try {
        const [savedProfile, savedDaily, savedPain] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
          AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS),
          AsyncStorage.getItem(STORAGE_KEYS.PAIN_LOGS),
        ]);

        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
        if (savedDaily) {
          setDailyLogs(JSON.parse(savedDaily));
        }
        if (savedPain) {
          setPainLogs(JSON.parse(savedPain));
        }
      } catch (error) {
        console.error('Failed to hydrate recovery state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateState();
  }, []);

  const daysSinceInjury = profile?.injuryDate ? calculateDays(profile.injuryDate) : 0;
  const currentStage = determineStage(daysSinceInjury);

  const today = getTodayDateString();
  const completedExercisesToday = dailyLogs[today] || [];

  const todayPainEntry = painLogs.find((p) => p.date === today);
  const todayPainLevel = todayPainEntry ? todayPainEntry.painLevel : null;

  const saveProfile = async (newProfile: UserProfile) => {
    try {
      setProfile(newProfile);
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const merged = { ...profile, ...updates };
    await saveProfile(merged);
  };

  const toggleExerciseCompletion = async (exerciseId: string) => {
    const currentCompleted = dailyLogs[today] || [];
    const exists = currentCompleted.includes(exerciseId);
    const updatedToday = exists
      ? currentCompleted.filter((id) => id !== exerciseId)
      : [...currentCompleted, exerciseId];

    const updatedLogs = {
      ...dailyLogs,
      [today]: updatedToday,
    };

    setDailyLogs(updatedLogs);
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(updatedLogs));
  };

  const isExerciseCompletedToday = (exerciseId: string): boolean => {
    return completedExercisesToday.includes(exerciseId);
  };

  /**
   * Safety Compliance: Log pain level (0-10) and trigger an emergency warning if pain >= 7
   */
  const logPainLevel = async (level: number, notes?: string): Promise<boolean> => {
    const isHighPain = level >= 7;

    const newEntry: PainLog = {
      id: Date.now().toString(),
      date: today,
      painLevel: level,
      timestamp: new Date().toISOString(),
      notes,
      triggeredAlert: isHighPain,
    };

    // Filter out previous entry for today and prepend new one
    const updated = [newEntry, ...painLogs.filter((p) => p.date !== today)];
    setPainLogs(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.PAIN_LOGS, JSON.stringify(updated));

    if (isHighPain) {
      Alert.alert(
        '⚠️ Severe Pain Alert (7+/10)',
        'You reported severe pain. Please STOP all rehabilitation exercises immediately. Rest the limb, keep it elevated, and apply cold therapy only if approved by your doctor.\n\nIf this pain persists, increases suddenly, or is accompanied by swelling/numbness, contact your orthopedic surgeon or emergency clinic immediately.',
        [{ text: 'Understood & Resting', style: 'destructive' }]
      );
    }

    return isHighPain;
  };

  /**
   * Safety Compliance: Stage Lock Rule
   * Users can NEVER access exercises for future stages they haven't reached.
   */
  const isStageUnlocked = (stageNumber: number): boolean => {
    return stageNumber <= currentStage.stageNumber;
  };

  const getStageUnlockReason = (stageNumber: number): string => {
    if (stageNumber <= currentStage.stageNumber) {
      return 'Unlocked';
    }
    const daysNeeded = stageNumber === 2 ? 22 : stageNumber === 3 ? 43 : 85;
    const remainingDays = Math.max(0, daysNeeded - daysSinceInjury);

    return `Locked for bone protection. Unlocks around Day ${daysNeeded} (~${remainingDays} days remaining) or when clinically cleared by your physician.`;
  };

  const resetAllData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.PROFILE,
        STORAGE_KEYS.DAILY_LOGS,
        STORAGE_KEYS.PAIN_LOGS,
      ]);
      setProfile(null);
      setDailyLogs({});
      setPainLogs([]);
    } catch (e) {
      console.error('Error clearing data:', e);
    }
  };

  return (
    <RecoveryContext.Provider
      value={{
        profile,
        isLoading,
        daysSinceInjury,
        currentStage,
        completedExercisesToday,
        painLogs,
        todayPainLevel,
        saveProfile,
        updateProfile,
        toggleExerciseCompletion,
        isExerciseCompletedToday,
        logPainLevel,
        isStageUnlocked,
        getStageUnlockReason,
        resetAllData,
      }}
    >
      {children}
    </RecoveryContext.Provider>
  );
};

export const useRecovery = (): RecoveryContextType => {
  const context = useContext(RecoveryContext);
  if (!context) {
    throw new Error('useRecovery must be used within a RecoveryProvider');
  }
  return context;
};
