import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { HomeScreen } from '../screens/HomeScreen';
import { RecoveryPlanScreen } from '../screens/RecoveryPlanScreen';
import { ExerciseLibraryScreen } from '../screens/ExerciseLibraryScreen';
import { ProgressTrackerScreen } from '../screens/ProgressTrackerScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator: React.FC = () => {
  const { colors, typography, layout } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderSubtle,
          borderTopWidth: 1,
          height: Platform.OS === 'android' ? 68 : 88,
          paddingBottom: Platform.OS === 'android' ? 10 : 28,
          paddingTop: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          minHeight: layout.minTapTarget,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarAccessibilityLabel: 'Recovery Dashboard tab',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size || 24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="RecoveryPlan"
        component={RecoveryPlanScreen}
        options={{
          tabBarLabel: 'Timeline',
          tabBarAccessibilityLabel: 'Recovery Stage Timeline tab',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'trail-sign' : 'trail-sign-outline'}
              size={size || 24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ExerciseLibrary"
        component={ExerciseLibraryScreen}
        options={{
          tabBarLabel: 'Exercises',
          tabBarAccessibilityLabel: 'Physiotherapy Exercise Library tab',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'fitness' : 'fitness-outline'}
              size={size || 24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Progress"
        component={ProgressTrackerScreen}
        options={{
          tabBarLabel: 'Progress',
          tabBarAccessibilityLabel: 'Rehab Progress and Pain Tracker tab',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={size || 24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile and Settings tab',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size || 24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
