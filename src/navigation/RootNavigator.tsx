import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useRecovery } from '../context/RecoveryContext';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { TabNavigator } from './TabNavigator';
import { ExerciseDetailScreen } from '../screens/ExerciseDetailScreen';
import { EmergencyScreen } from '../screens/EmergencyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { profile, isLoading } = useRecovery();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const initialRoute = profile?.disclaimerAccepted ? 'MainTabs' : 'Onboarding';
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...baseTheme,
        dark: isDark,
        colors: {
          ...baseTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.borderSubtle,
          notification: colors.emergency,
        },
      }}
    >
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="ExerciseDetail"
          component={ExerciseDetailScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="Emergency"
          component={EmergencyScreen}
          options={{
            animation: 'fade_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
