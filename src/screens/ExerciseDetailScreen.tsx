import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useRecovery } from '../context/RecoveryContext';
import { MOCK_EXERCISES } from '../data/mockData';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { RestTimer } from '../components/exercise/RestTimer';
import { EmergencyModal } from '../components/common/EmergencyModal';

type ExerciseDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'ExerciseDetail'>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { exerciseId } = route.params;
  const { colors, typography } = useTheme();
  const {
    isExerciseCompletedToday,
    toggleExerciseCompletion,
    isStageUnlocked,
    getStageUnlockReason,
  } = useRecovery();

  const [emergencyModalVisible, setEmergencyModalVisible] = useState<boolean>(false);

  const exercise = MOCK_EXERCISES.find((e) => e.id === exerciseId);
  const videoSource = exercise?.videoUrl ?? null;
  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
  });

  if (!exercise) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.emergency} />
        <Text style={[typography.h3, { color: colors.textPrimary, marginTop: 12 }]}>
          Exercise Not Found
        </Text>
        <Button
          title="Return to Library"
          onPress={() => navigation.goBack()}
          variant="secondary"
          accessibilityLabel="Go back to exercise library"
        />
      </View>
    );
  }

  const unlocked = isStageUnlocked(exercise.stageNumber);
  const isCompleted = isExerciseCompletedToday(exercise.id);

  // Safety protection: if user opened via direct link or deep link to a locked stage
  if (!unlocked) {
    return (
      <View style={[styles.lockedScreen, { backgroundColor: colors.background }]}>
        <Ionicons name="lock-closed" size={64} color={colors.emergency} />
        <Text style={[typography.h2, { color: colors.textPrimary, marginTop: 16, textAlign: 'center' }]}>
          Exercise Locked for Safety
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 24 },
          ]}
        >
          {getStageUnlockReason(exercise.stageNumber)}
        </Text>
        <View style={{ marginTop: 24 }}>
          <Button
            title="Return to Current Stage"
            onPress={() => navigation.goBack()}
            variant="primary"
            accessibilityLabel="Return back to safety"
          />
        </View>
      </View>
    );
  }

  const handleToggleCompletion = async () => {
    await toggleExerciseCompletion(exercise.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Navigation Bar with Back & Red Flags Action */}
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderSubtle,
          },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back to previous screen"
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color={colors.textPrimary} />
        </Pressable>

        <Text
          style={[
            typography.h3,
            { color: colors.textPrimary, flex: 1, marginHorizontal: 8 },
          ]}
          numberOfLines={1}
        >
          Exercise Tutorial
        </Text>

        <Pressable
          onPress={() => setEmergencyModalVisible(true)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="When to call doctor emergency guide"
          style={[styles.emergencyBadge, { backgroundColor: colors.emergencyLight }]}
        >
          <Ionicons name="warning" size={18} color={colors.emergency} />
          <Text style={[typography.caption, { color: colors.emergency, fontWeight: '700', marginLeft: 4 }]}>
            Red Flags
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Player Container */}
        <View style={[styles.videoContainer, { backgroundColor: '#000000' }]}>
          <VideoView
            player={player}
            style={styles.videoPlayer}
            nativeControls={true}
            contentFit="contain"
          />
        </View>

        {/* Title and Overview */}
        <View style={styles.contentPadding}>
          <Text style={[typography.h1, { color: colors.textPrimary }]}>
            {exercise.title}
          </Text>

          <View style={styles.tagsRow}>
            <View style={[styles.tag, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
              <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
                Stage {exercise.stageNumber}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
              <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700' }]}>
                {exercise.difficulty}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
              <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700' }]}>
                {exercise.durationMinutes} mins
              </Text>
            </View>
          </View>

          {/* Mandatory Clinical Approval Rule */}
          <DisclaimerBanner
            variant="approval"
            text={exercise.safetyNote}
          />

          {/* Prescription Dosage Card */}
          <Card variant="flat" style={styles.dosageCard}>
            <View style={styles.dosageItem}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>SETS</Text>
              <Text style={[typography.h2, { color: colors.primary }]}>{exercise.sets}</Text>
            </View>
            <View style={styles.dosageDivider} />
            <View style={styles.dosageItem}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>REPETITIONS</Text>
              <Text style={[typography.h2, { color: colors.primary }]}>{exercise.reps}</Text>
            </View>
            {exercise.holdSeconds && (
              <>
                <View style={styles.dosageDivider} />
                <View style={styles.dosageItem}>
                  <Text style={[typography.caption, { color: colors.textMuted }]}>HOLD TIME</Text>
                  <Text style={[typography.h2, { color: colors.primary }]}>{exercise.holdSeconds}s</Text>
                </View>
              </>
            )}
          </Card>

          {/* Set Rest Timer */}
          <RestTimer initialSeconds={45} />

          {/* Step-by-Step Instructions */}
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={22} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={[typography.h2, { color: colors.textPrimary }]}>
              Step-by-Step Execution
            </Text>
          </View>

          {exercise.steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={[styles.stepNumberBadge, { backgroundColor: colors.primary }]}>
                <Text style={[typography.bodyBold, { color: '#FFFFFF' }]}>{index + 1}</Text>
              </View>
              <Text
                style={[
                  typography.body,
                  { color: colors.textPrimary, flex: 1, marginLeft: 12 },
                ]}
              >
                {step}
              </Text>
            </View>
          ))}

          {/* Common Mistakes to Avoid */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Ionicons name="close-circle-outline" size={22} color={colors.warning} style={{ marginRight: 6 }} />
            <Text style={[typography.h2, { color: colors.textPrimary }]}>
              Common Mistakes to Avoid
            </Text>
          </View>

          <Card variant="outlined" style={{ borderColor: colors.warning }}>
            {exercise.commonMistakes.map((mistake, index) => (
              <View key={index} style={styles.bulletRow}>
                <Ionicons name="close" size={20} color={colors.warning} style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={[typography.body, { color: colors.textPrimary, flex: 1 }]}>
                  {mistake}
                </Text>
              </View>
            ))}
          </Card>

          {/* MANDATORY: STOP IF YOU FEEL SECTION */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Ionicons name="hand-left" size={22} color={colors.emergency} style={{ marginRight: 6 }} />
            <Text style={[typography.h2, { color: colors.emergency }]}>
              Stop Immediately If:
            </Text>
          </View>

          <Card
            variant="flat"
            style={{
              backgroundColor: colors.emergencyLight,
              borderColor: colors.emergency,
              borderWidth: 1.5,
            }}
          >
            {exercise.stopIf.map((rule, index) => (
              <View key={index} style={styles.bulletRow}>
                <Ionicons name="alert" size={20} color={colors.emergency} style={{ marginRight: 8, marginTop: 2 }} />
                <Text
                  style={[
                    typography.bodyBold,
                    { color: colors.emergency, flex: 1 },
                  ]}
                >
                  {rule}
                </Text>
              </View>
            ))}
          </Card>

          {/* Target Muscles */}
          <View style={{ marginTop: 20 }}>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              TARGET ANATOMY / MUSCLE GROUPS:
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>
              {exercise.targetMuscles.join(' • ')}
            </Text>
          </View>

          {/* Footer Mandatory Medical Disclaimer */}
          <DisclaimerBanner
            variant="disclaimer"
            title="App Medical Policy"
            text="All exercise descriptions are [PLACEHOLDER – requires physio review]. Never perform exercises against direct orthopedic contraindications."
          />
        </View>
      </ScrollView>

      {/* Primary Action Button (Fixed Bottom Bar) */}
      <View
        style={[
          styles.bottomActionBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.borderSubtle,
          },
        ]}
      >
        <Button
          title={isCompleted ? '✓ Completed for Today' : 'Mark Exercise Complete'}
          onPress={handleToggleCompletion}
          variant={isCompleted ? 'secondary' : 'primary'}
          size="lg"
          leftIcon={
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={24}
              color={isCompleted ? colors.success : '#FFFFFF'}
            />
          }
          accessibilityLabel={
            isCompleted
              ? 'Mark exercise as incomplete for today'
              : 'Mark exercise as completed for today'
          }
          fullWidth
        />
      </View>

      {/* Global Emergency Red Flags Modal */}
      <EmergencyModal
        visible={emergencyModalVisible}
        onClose={() => setEmergencyModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  lockedScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    minHeight: 40,
    borderRadius: 20,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  videoContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  videoOverlayPlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentPadding: {
    padding: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  dosageCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    marginVertical: 12,
  },
  dosageItem: {
    alignItems: 'center',
  },
  dosageDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#CBD5E1',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  stepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  bottomActionBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
});
