import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface RestTimerProps {
  initialSeconds?: number;
  onTimerComplete?: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 45,
  onTimerComplete,
}) => {
  const { colors, typography, layout } = useTheme();
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      if (onTimerComplete) {
        onTimerComplete();
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, onTimerComplete]);

  const toggleTimer = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(initialSeconds);
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(initialSeconds);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceVariant,
          borderColor: colors.borderSubtle,
          borderRadius: layout.borderRadius.lg,
        },
      ]}
      accessible={true}
      accessibilityRole="timer"
      accessibilityLabel={`Rest interval timer, ${secondsLeft} seconds remaining`}
    >
      <View style={styles.leftSection}>
        <Ionicons name="hourglass-outline" size={24} color={colors.primary} />
        <View style={styles.textContainer}>
          <Text style={[typography.bodySmallBold, { color: colors.textSecondary }]}>
            Rest Between Sets
          </Text>
          <Text
            style={[
              typography.h2,
              {
                color: secondsLeft === 0 ? colors.success : colors.textPrimary,
                fontVariant: ['tabular-nums'],
              },
            ]}
          >
            {formatTime(secondsLeft)}
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          onPress={toggleTimer}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isActive ? 'Pause rest timer' : 'Start rest timer'}
          android_ripple={{ color: colors.primaryMuted, borderless: true }}
          style={[
            styles.actionButton,
            { backgroundColor: isActive ? colors.warning : colors.primary },
          ]}
        >
          <Ionicons
            name={isActive ? 'pause' : 'play'}
            size={22}
            color="#FFFFFF"
          />
        </Pressable>

        <Pressable
          onPress={resetTimer}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Reset rest timer"
          android_ripple={{ color: colors.primaryMuted, borderless: true }}
          style={[
            styles.actionButton,
            { backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.border },
          ]}
        >
          <Ionicons name="refresh" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 48, // 48dp minimum
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
