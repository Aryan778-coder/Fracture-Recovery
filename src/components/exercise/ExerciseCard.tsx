import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '../../types/recovery';
import { useTheme } from '../../context/ThemeContext';
import { useRecovery } from '../../context/RecoveryContext';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPress,
}) => {
  const { colors, typography, layout } = useTheme();
  const { isStageUnlocked, isExerciseCompletedToday, getStageUnlockReason } = useRecovery();

  const unlocked = isStageUnlocked(exercise.stageNumber);
  const completed = isExerciseCompletedToday(exercise.id);
  const lockReason = getStageUnlockReason(exercise.stageNumber);

  const getDifficultyColor = () => {
    switch (exercise.difficulty) {
      case 'Gentle':
        return colors.success;
      case 'Mild':
        return colors.info;
      case 'Moderate':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  return (
    <Pressable
      onPress={unlocked ? onPress : undefined}
      disabled={!unlocked}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${exercise.title}, ${exercise.difficulty} difficulty, ${exercise.durationMinutes} minutes, ${
        unlocked ? (completed ? 'completed today' : 'ready to start') : 'locked exercise'
      }`}
      accessibilityHint={unlocked ? 'Double tap to open exercise tutorial and video' : lockReason}
      android_ripple={{
        color: unlocked ? colors.primaryMuted : 'transparent',
        borderless: false,
      }}
      style={({ pressed }) => [
        styles.cardContainer,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: completed ? colors.success : colors.borderSubtle,
          borderRadius: layout.borderRadius.lg,
          opacity: unlocked ? (pressed && Platform.OS !== 'android' ? 0.92 : 1) : 0.85,
        },
        layout.shadows.light,
      ]}
    >
      {/* Thumbnail with overlay tags */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: exercise.thumbnailUrl }}
          style={[styles.thumbnail, { opacity: unlocked ? 1 : 0.4 }]}
          resizeMode="cover"
        />

        {/* Stage & Difficulty Badges */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
            ]}
          >
            <Text style={[typography.caption, { color: colors.textPrimary, fontWeight: '700' }]}>
              Stage {exercise.stageNumber}
            </Text>
          </View>

          <View
            style={[
              styles.badge,
              { backgroundColor: getDifficultyColor() + '25', borderColor: getDifficultyColor() },
            ]}
          >
            <Text
              style={[
                typography.caption,
                { color: getDifficultyColor(), fontWeight: '700' },
              ]}
            >
              {exercise.difficulty}
            </Text>
          </View>
        </View>

        {/* Completed Checkmark overlay */}
        {completed && (
          <View style={[styles.completedBadge, { backgroundColor: colors.success }]}>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={[typography.caption, { color: '#FFFFFF', marginLeft: 4, fontWeight: '700' }]}>
              Done Today
            </Text>
          </View>
        )}

        {/* Locked stage overlay */}
        {!unlocked && (
          <View style={[styles.lockedOverlay, { backgroundColor: colors.overlay }]}>
            <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
            <Text style={[typography.bodyBold, { color: '#FFFFFF', marginTop: 6, textAlign: 'center' }]}>
              Stage {exercise.stageNumber} Locked
            </Text>
            <Text
              style={[
                typography.bodySmall,
                { color: '#CBD5E1', textAlign: 'center', marginTop: 4, paddingHorizontal: 16 },
              ]}
            >
              {lockReason}
            </Text>
          </View>
        )}
      </View>

      {/* Exercise Information Details */}
      <View style={styles.content}>
        <Text
          style={[
            typography.h3,
            { color: unlocked ? colors.textPrimary : colors.textMuted },
          ]}
          numberOfLines={2}
        >
          {exercise.title}
        </Text>

        <Text
          style={[
            typography.bodySmall,
            { color: colors.textSecondary, marginTop: 4 },
          ]}
          numberOfLines={2}
        >
          {exercise.summary}
        </Text>

        {/* Meta Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={18} color={colors.primary} />
            <Text style={[typography.bodySmallBold, { color: colors.textPrimary, marginLeft: 4 }]}>
              {exercise.durationMinutes} mins
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="repeat-outline" size={18} color={colors.primary} />
            <Text style={[typography.bodySmallBold, { color: colors.textPrimary, marginLeft: 4 }]}>
              {exercise.sets} sets × {exercise.reps} reps
            </Text>
          </View>

          {exercise.holdSeconds && (
            <View style={styles.statItem}>
              <Ionicons name="timer-outline" size={18} color={colors.primary} />
              <Text style={[typography.bodySmallBold, { color: colors.textPrimary, marginLeft: 4 }]}>
                {exercise.holdSeconds}s hold
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 8,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 16,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
