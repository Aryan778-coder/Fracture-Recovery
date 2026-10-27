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
import { Card } from '../components/common/Card';
import { PainSlider } from '../components/common/PainSlider';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { EmergencyModal } from '../components/common/EmergencyModal';

export const ProgressTrackerScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const {
    todayPainLevel,
    logPainLevel,
    completedExercisesToday,
  } = useRecovery();

  const [currentPainInput, setCurrentPainInput] = useState<number>(todayPainLevel ?? 2);
  const [emergencyModalVisible, setEmergencyModalVisible] = useState<boolean>(false);

  // Generate last 7 days for the weekly calendar
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const dayNumber = d.getDate();
    return { iso, dayName, dayNumber, isToday: i === 6 };
  });

  const handleSavePain = async (val: number) => {
    setCurrentPainInput(val);
    await logPainLevel(val);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
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
            Recovery Progress
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            Consistency, pain logs & healing trajectory
          </Text>
        </View>

        <Pressable
          onPress={() => setEmergencyModalVisible(true)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Emergency and Red Flags"
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
        {/* Weekly Consistency Calendar */}
        <Card variant="elevated">
          <Text style={[typography.h3, { color: colors.textPrimary }]}>
            Weekly Adherence
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: 12 }]}>
            Daily gentle mobility prevents adhesive stiffness.
          </Text>

          <View style={styles.calendarRow}>
            {last7Days.map((day) => {
              const done = day.isToday
                ? completedExercisesToday.length > 0
                : true; // simulated past compliance

              return (
                <View key={day.iso} style={styles.dayCol}>
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>
                    {day.dayName}
                  </Text>
                  <View
                    style={[
                      styles.dayCircle,
                      {
                        backgroundColor: done ? colors.success : colors.surfaceVariant,
                        borderColor: day.isToday ? colors.primary : colors.borderSubtle,
                        borderWidth: day.isToday ? 2 : 1,
                      },
                    ]}
                  >
                    {done ? (
                      <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                    ) : (
                      <Text style={[typography.bodySmall, { color: colors.textMuted }]}>
                        {day.dayNumber}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Streak indicator */}
          <View style={[styles.streakBanner, { backgroundColor: colors.primaryMuted }]}>
            <Ionicons name="flame" size={24} color={colors.primary} />
            <Text style={[typography.bodyBold, { color: colors.primary, marginLeft: 8 }]}>
              5-Day Rehabilitation Streak Active!
            </Text>
          </View>
        </Card>

        {/* Pain Level Log Section */}
        <Card variant="elevated" style={{ marginTop: 16 }}>
          <PainSlider
            value={currentPainInput}
            onChange={handleSavePain}
          />
        </Card>

        {/* Simple Pain Trend Chart */}
        <Card variant="flat" style={{ marginTop: 16 }}>
          <View style={styles.chartHeader}>
            <Text style={[typography.h3, { color: colors.textPrimary }]}>
              Recent Pain Trend
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Lower is better
            </Text>
          </View>

          {/* Simple Visual Bar Chart */}
          <View style={styles.barChartContainer}>
            {[
              { day: 'Thu', val: 5 },
              { day: 'Fri', val: 4 },
              { day: 'Sat', val: 4 },
              { day: 'Sun', val: 3 },
              { day: 'Mon', val: 3 },
              { day: 'Tue', val: 2 },
              { day: 'Today', val: currentPainInput },
            ].map((item, idx) => {
              const barHeight = Math.max(12, (item.val / 10) * 100);
              const barColor =
                item.val <= 3
                  ? colors.success
                  : item.val <= 6
                  ? colors.warning
                  : colors.emergency;

              return (
                <View key={idx} style={styles.barColumn}>
                  <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 4 }]}>
                    {item.val}
                  </Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: barHeight,
                          backgroundColor: barColor,
                          borderRadius: 4,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 6 }]}>
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        <DisclaimerBanner
          variant="disclaimer"
          text="Persistent pain that fails to trend downward over consecutive weeks should be formally re-evaluated with follow-up radiographs."
        />
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
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dayCol: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 100,
    width: 22,
    justifyContent: 'flex-end',
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
  },
});
