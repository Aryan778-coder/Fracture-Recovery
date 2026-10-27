import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 100
  totalSteps?: number;
  completedSteps?: number;
  subtitle?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  size = 140,
  strokeWidth = 12,
  progress,
  totalSteps,
  completedSteps,
  subtitle = 'completed',
}) => {
  const { colors, typography } = useTheme();

  // Clamp progress between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * normalizedProgress) / 100;

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: normalizedProgress }}
      accessibilityLabel={`Recovery progress: ${Math.round(normalizedProgress)} percent ${subtitle}`}
    >
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.borderSubtle}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={normalizedProgress === 100 ? colors.success : colors.primary}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>

      <View style={styles.textContainer}>
        {totalSteps !== undefined && completedSteps !== undefined ? (
          <>
            <Text
              style={[
                typography.h2,
                { color: colors.textPrimary, fontWeight: '700' },
              ]}
            >
              {completedSteps}
              <Text style={{ fontSize: 16, color: colors.textMuted }}>/{totalSteps}</Text>
            </Text>
            <Text
              style={[
                typography.caption,
                { color: colors.textSecondary, textTransform: 'uppercase' },
              ]}
            >
              {subtitle}
            </Text>
          </>
        ) : (
          <>
            <Text
              style={[
                typography.h2,
                { color: colors.textPrimary, fontWeight: '700' },
              ]}
            >
              {Math.round(normalizedProgress)}%
            </Text>
            <Text
              style={[
                typography.caption,
                { color: colors.textSecondary, textTransform: 'uppercase' },
              ]}
            >
              {subtitle}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
