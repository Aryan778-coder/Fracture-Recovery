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
import { useTheme } from '../context/ThemeContext';
import { useRecovery } from '../context/RecoveryContext';
import { RECOVERY_STAGES } from '../data/mockData';
import { Card } from '../components/common/Card';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { EmergencyModal } from '../components/common/EmergencyModal';

export const RecoveryPlanScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const { currentStage, isStageUnlocked } = useRecovery();
  const [emergencyModalVisible, setEmergencyModalVisible] = useState<boolean>(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Emergency Red Flags */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderSubtle,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[typography.h2, { color: colors.textPrimary }]}>
            Bone Healing Timeline
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            Clinical stages, permitted actions & precautions
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
          <Ionicons name="warning" size={18} color={colors.emergency} />
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
        <DisclaimerBanner
          variant="approval"
          compact
          text="Biological bone healing timelines vary according to fracture type, fixation method, age, and metabolic health. Always follow your physician's radiographs."
        />

        {RECOVERY_STAGES.map((stage, idx) => {
          const isCurrent = stage.stageNumber === currentStage.stageNumber;
          const unlocked = isStageUnlocked(stage.stageNumber);

          return (
            <Card
              key={stage.id}
              variant={isCurrent ? 'elevated' : 'outlined'}
              style={{
                borderColor: isCurrent ? colors.primary : colors.borderSubtle,
                borderLeftWidth: isCurrent ? 6 : 1,
                borderLeftColor: isCurrent ? colors.primary : colors.borderSubtle,
                marginVertical: 10,
              }}
            >
              {/* Stage Header */}
              <View style={styles.stageHeader}>
                <View
                  style={[
                    styles.stageBadge,
                    {
                      backgroundColor: isCurrent
                        ? colors.primary
                        : unlocked
                        ? colors.primaryMuted
                        : colors.disabled,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.bodyBold,
                      { color: isCurrent ? '#FFFFFF' : unlocked ? colors.primary : colors.textMuted },
                    ]}
                  >
                    Stage {stage.stageNumber}
                  </Text>
                </View>

                {isCurrent && (
                  <View style={[styles.activeTag, { backgroundColor: colors.successLight }]}>
                    <Text style={[typography.caption, { color: colors.success, fontWeight: '700' }]}>
                      YOU ARE HERE
                    </Text>
                  </View>
                )}

                {!unlocked && (
                  <View style={styles.lockedTag}>
                    <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
                    <Text style={[typography.caption, { color: colors.textMuted, marginLeft: 4 }]}>
                      Locked
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[typography.h3, { color: colors.textPrimary, marginTop: 8 }]}>
                {stage.name}
              </Text>

              <Text style={[typography.bodySmallBold, { color: colors.primary, marginTop: 2 }]}>
                {stage.durationWeeksRange} ({stage.subtitle})
              </Text>

              <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
                {stage.description}
              </Text>

              {/* What is Allowed */}
              <View style={[styles.listSection, { marginTop: 14 }]}>
                <View style={styles.listHeaderRow}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} style={{ marginRight: 6 }} />
                  <Text style={[typography.bodyBold, { color: colors.success }]}>
                    What is ALLOWED at this stage:
                  </Text>
                </View>
                {stage.allowedActivities.map((act, i) => (
                  <View key={i} style={styles.itemRow}>
                    <Ionicons name="ellipse" size={8} color={colors.success} style={{ marginTop: 8, marginRight: 8 }} />
                    <Text style={[typography.body, { color: colors.textPrimary, flex: 1 }]}>
                      {act}
                    </Text>
                  </View>
                ))}
              </View>

              {/* What is NOT Allowed */}
              <View style={[styles.listSection, { marginTop: 12 }]}>
                <View style={styles.listHeaderRow}>
                  <Ionicons name="close-circle" size={20} color={colors.emergency} style={{ marginRight: 6 }} />
                  <Text style={[typography.bodyBold, { color: colors.emergency }]}>
                    STRICT RESTRICTIONS (Do NOT do):
                  </Text>
                </View>
                {stage.restrictions.map((res, i) => (
                  <View key={i} style={styles.itemRow}>
                    <Ionicons name="close" size={16} color={colors.emergency} style={{ marginTop: 4, marginRight: 6 }} />
                    <Text style={[typography.body, { color: colors.textPrimary, flex: 1 }]}>
                      {res}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Emergency Modal */}
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 12,
    paddingBottom: 12,
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
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lockedTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listSection: {
    padding: 10,
    borderRadius: 8,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
  },
});
