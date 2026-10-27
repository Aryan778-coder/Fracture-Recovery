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
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useRecovery } from '../context/RecoveryContext';
import { MOCK_EXERCISES } from '../data/mockData';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProgressRing } from '../components/common/ProgressRing';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { EmergencyModal } from '../components/common/EmergencyModal';
import { PainSlider } from '../components/common/PainSlider';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, typography } = useTheme();
  const {
    profile,
    daysSinceInjury,
    currentStage,
    completedExercisesToday,
    toggleExerciseCompletion,
    todayPainLevel,
    logPainLevel,
  } = useRecovery();

  const [emergencyModalVisible, setEmergencyModalVisible] = useState<boolean>(false);
  const [currentPainInput, setCurrentPainInput] = useState<number>(todayPainLevel ?? 2);

  // Exercises available for current unlocked stage and body part
  const todayExercises = MOCK_EXERCISES.filter(
    (ex) => ex.bodyPart === (profile?.bodyPart || 'wrist') && ex.stageNumber <= currentStage.stageNumber
  );

  const completedCount = todayExercises.filter((ex) =>
    completedExercisesToday.includes(ex.id)
  ).length;

  const progressPercentage =
    todayExercises.length > 0
      ? Math.round((completedCount / todayExercises.length) * 100)
      : 0;

  const handleSavePain = async (val: number) => {
    setCurrentPainInput(val);
    await logPainLevel(val);
  };

  return (
    <View style={[styles.screenWrapper, { backgroundColor: colors.background }]}>
      {/* Top App Header with Emergency Red-Flag Quick-Access */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderSubtle,
          },
        ]}
      >
        <View>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            DAY {daysSinceInjury} OF HEALING
          </Text>
          <Text style={[typography.h2, { color: colors.textPrimary }]}>
            Hello, {profile?.name || 'Patient'}
          </Text>
        </View>

        <Pressable
          onPress={() => setEmergencyModalVisible(true)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Emergency and Red Flags: Tap to open urgent clinical symptoms warning"
          style={[styles.emergencyBtn, { backgroundColor: colors.emergencyLight }]}
          android_ripple={{ color: colors.emergency, borderless: false }}
        >
          <Ionicons name="warning" size={20} color={colors.emergency} />
          <Text
            style={[
              typography.caption,
              { color: colors.emergency, fontWeight: '700', marginLeft: 4 },
            ]}
          >
            Red Flags
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stage Announcement Card */}
        <Card
          variant="elevated"
          style={{
            borderLeftWidth: 6,
            borderLeftColor: colors.primary,
          }}
        >
          <View style={styles.stageCardHeader}>
            <View>
              <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
                CURRENT RECOVERY PHASE
              </Text>
              <Text style={[typography.h2, { color: colors.textPrimary, marginTop: 2 }]}>
                {currentStage.name}
              </Text>
              <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>
                {currentStage.subtitle} ({currentStage.durationWeeksRange})
              </Text>
            </View>
          </View>

          <Text style={[typography.body, { color: colors.textPrimary, marginTop: 10 }]}>
            {currentStage.clinicalGoal}
          </Text>

          <View style={styles.stageActionRow}>
            <Button
              title="View Allowed & Prohibited Activities"
              onPress={() => navigation.navigate('RecoveryPlan')}
              variant="outline"
              size="sm"
              rightIcon={<Ionicons name="arrow-forward" size={16} color={colors.primary} />}
              accessibilityLabel="View full timeline and rules for this stage"
            />
          </View>
        </Card>

        {/* Today's Goal & Progress Ring */}
        <Card variant="flat" style={styles.progressCard}>
          <Text style={[typography.h3, { color: colors.textPrimary, textAlign: 'center' }]}>
            Today's Rehab Progress
          </Text>

          <ProgressRing
            progress={progressPercentage}
            totalSteps={todayExercises.length}
            completedSteps={completedCount}
            subtitle="Exercises Done"
          />

          <Text
            style={[
              typography.bodySmall,
              { color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
            ]}
          >
            {completedCount === todayExercises.length && todayExercises.length > 0
              ? '🎉 Excellent work! All prescribed exercises for today are complete.'
              : 'Remember: Smooth, slow reps. Stop immediately if you feel sharp pain.'}
          </Text>
        </Card>

        {/* Standard Medical Approval Disclaimer */}
        <DisclaimerBanner
          variant="approval"
          compact
          text="Perform only after your doctor or physiotherapist approves. Keep all joints relaxed."
        />

        {/* Today's Exercise Checklist */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.h2, { color: colors.textPrimary }]}>
            Today's Prescribed Routine
          </Text>
          <Pressable
            onPress={() => navigation.navigate('ExerciseLibrary')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="View full exercise library"
          >
            <Text style={[typography.bodyBold, { color: colors.primary }]}>
              All Exercises
            </Text>
          </Pressable>
        </View>

        {todayExercises.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Ionicons name="checkmark-done-circle" size={48} color={colors.primary} />
            <Text style={[typography.h3, { color: colors.textPrimary, marginTop: 8 }]}>
              No Exercises Assigned Today
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
              Your current stage is focused on rest and protection.
            </Text>
          </Card>
        ) : (
          todayExercises.map((exercise) => {
            const isCompleted = completedExercisesToday.includes(exercise.id);
            return (
              <Card
                key={exercise.id}
                variant="outlined"
                style={{
                  borderColor: isCompleted ? colors.success : colors.borderSubtle,
                  backgroundColor: isCompleted ? colors.successLight + '30' : colors.surfaceCard,
                }}
              >
                <View style={styles.exerciseItemRow}>
                  {/* Accessible Checkbox */}
                  <Pressable
                    onPress={() => toggleExerciseCompletion(exercise.id)}
                    accessible={true}
                    accessibilityRole="checkbox"
                    accessibilityLabel={`Mark ${exercise.title} as ${isCompleted ? 'incomplete' : 'completed'}`}
                    accessibilityState={{ checked: isCompleted }}
                    android_ripple={{ color: colors.primaryMuted, borderless: true }}
                    style={[
                      styles.checkCircle,
                      {
                        backgroundColor: isCompleted ? colors.success : 'transparent',
                        borderColor: isCompleted ? colors.success : colors.border,
                      },
                    ]}
                  >
                    {isCompleted && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
                  </Pressable>

                  {/* Title and details */}
                  <Pressable
                    onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: exercise.id })}
                    style={{ flex: 1, marginLeft: 12 }}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Open details for ${exercise.title}`}
                  >
                    <Text
                      style={[
                        typography.bodyBold,
                        {
                          color: colors.textPrimary,
                          textDecorationLine: isCompleted ? 'line-through' : 'none',
                        },
                      ]}
                    >
                      {exercise.title}
                    </Text>
                    <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>
                      {exercise.sets} sets × {exercise.reps} reps • {exercise.durationMinutes} mins
                    </Text>
                  </Pressable>

                  {/* Open video icon */}
                  <Pressable
                    onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: exercise.id })}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Play video guide"
                    style={styles.playIconButton}
                  >
                    <Ionicons name="play-circle-outline" size={32} color={colors.primary} />
                  </Pressable>
                </View>
              </Card>
            );
          })
        )}

        {/* Daily Pain Level Monitor */}
        <Card variant="elevated" style={styles.painCard}>
          <PainSlider
            value={currentPainInput}
            onChange={handleSavePain}
          />
          <Text style={[typography.caption, { color: colors.textMuted, marginTop: 6 }]}>
            Pain entries are saved locally to monitor recovery progression and alert for inflammatory spikes.
          </Text>
        </Card>

        {/* Next Milestone */}
        <Card variant="flat" style={styles.milestoneCard}>
          <View style={styles.milestoneRow}>
            <View style={[styles.milestoneIcon, { backgroundColor: colors.infoLight }]}>
              <Ionicons name="calendar" size={24} color={colors.info} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[typography.caption, { color: colors.info, fontWeight: '700' }]}>
                NEXT MILESTONE
              </Text>
              <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>
                {currentStage.stageNumber < 4 ? 'Clinical X-Ray & Next Stage Review' : 'Final Functional Clearance'}
              </Text>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                Scheduled around Day {currentStage.durationDays} (~{Math.max(0, currentStage.durationDays - daysSinceInjury)} days remaining)
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Global Emergency Red Flags Modal */}
      <EmergencyModal
        visible={emergencyModalVisible}
        onClose={() => setEmergencyModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 48,
    borderRadius: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  stageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stageActionRow: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  progressCard: {
    marginVertical: 12,
    alignItems: 'center',
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  exerciseItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
  },
  painCard: {
    marginTop: 16,
  },
  milestoneCard: {
    marginTop: 16,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
