import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  RecoveryPlan: undefined;
  ExerciseLibrary: { filterStageId?: string } | undefined;
  Progress: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ExerciseDetail: { exerciseId: string };
  Emergency: undefined;
};
