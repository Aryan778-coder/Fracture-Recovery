import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { BodyPart } from '../types/recovery';
import { useTheme } from '../context/ThemeContext';
import { useRecovery } from '../context/RecoveryContext';
import { BODY_PARTS, MOCK_EXERCISES, RECOVERY_STAGES } from '../data/mockData';
import { ExerciseCard } from '../components/exercise/ExerciseCard';
import { Card } from '../components/common/Card';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { EmergencyModal } from '../components/common/EmergencyModal';

type ExerciseLibraryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ExerciseLibraryScreenProps {
  navigation: ExerciseLibraryNavigationProp;
}

export const ExerciseLibraryScreen: React.FC<ExerciseLibraryScreenProps> = ({ navigation }) => {
  const { colors, typography, layout } = useTheme();
  const { profile, isStageUnlocked } = useRecovery();

  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>(profile?.bodyPart || 'wrist');
  const [selectedStageNumber, setSelectedStageNumber] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [emergencyModalVisible, setEmergencyModalVisible] = useState<boolean>(false);

  // Filter exercises
  const filteredExercises = MOCK_EXERCISES.filter((ex) => {
    const matchesBody = ex.bodyPart === selectedBodyPart;
    const matchesStage = selectedStageNumber === 'all' || ex.stageNumber === selectedStageNumber;
    const matchesQuery =
      searchQuery.trim() === '' ||
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBody && matchesStage && matchesQuery;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header with Emergency Trigger */}
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
            Physio Exercise Library
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            Prescribed safe routines for healing bones
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

      {/* Body Part Filter Horizontal Tabs (min 48dp) */}
      <View style={[styles.filterSection, { backgroundColor: colors.surface }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bodyPartScroll}
        >
          {BODY_PARTS.map((part) => {
            const isSelected = selectedBodyPart === part.id;
            return (
              <Pressable
                key={part.id}
                onPress={() => setSelectedBodyPart(part.id)}
                accessible={true}
                accessibilityRole="tab"
                accessibilityLabel={`Filter by ${part.label}`}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceCard,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={part.icon as any}
                  size={18}
                  color={isSelected ? '#FFFFFF' : colors.textPrimary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    typography.bodyBold,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontSize: 15,
                    },
                  ]}
                >
                  {part.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Stage Filter Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stageScroll}
        >
          <Pressable
            onPress={() => setSelectedStageNumber('all')}
            accessible={true}
            accessibilityRole="tab"
            accessibilityLabel="Filter: All Stages"
            accessibilityState={{ selected: selectedStageNumber === 'all' }}
            style={[
              styles.stageTab,
              {
                backgroundColor: selectedStageNumber === 'all' ? colors.primaryLight + '30' : 'transparent',
                borderColor: selectedStageNumber === 'all' ? colors.primary : colors.borderSubtle,
              },
            ]}
          >
            <Text
              style={[
                typography.bodySmallBold,
                { color: selectedStageNumber === 'all' ? colors.primary : colors.textSecondary },
              ]}
            >
              All Stages
            </Text>
          </Pressable>

          {RECOVERY_STAGES.map((stg) => {
            const isSelected = selectedStageNumber === stg.stageNumber;
            const unlocked = isStageUnlocked(stg.stageNumber);

            return (
              <Pressable
                key={stg.id}
                onPress={() => setSelectedStageNumber(stg.stageNumber)}
                accessible={true}
                accessibilityRole="tab"
                accessibilityLabel={`Filter: Stage ${stg.stageNumber} ${unlocked ? 'Unlocked' : 'Locked'}`}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.stageTab,
                  {
                    backgroundColor: isSelected ? colors.primaryLight + '30' : 'transparent',
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                  },
                ]}
              >
                {!unlocked && (
                  <Ionicons name="lock-closed" size={14} color={colors.textMuted} style={{ marginRight: 4 }} />
                )}
                <Text
                  style={[
                    typography.bodySmallBold,
                    {
                      color: isSelected
                        ? colors.primary
                        : unlocked
                        ? colors.textPrimary
                        : colors.textMuted,
                    },
                  ]}
                >
                  Stage {stg.stageNumber}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Search Input Bar */}
      <View style={[styles.searchBoxContainer, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderSubtle,
              borderRadius: layout.borderRadius.md,
            },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search exercises by title or muscle..."
            placeholderTextColor={colors.textMuted}
            style={[typography.body, { flex: 1, color: colors.textPrimary }]}
            accessibilityLabel="Search exercises input"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Clear search text"
            >
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Main Exercises List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <DisclaimerBanner
            variant="approval"
            compact
            text="Perform exercises strictly in alignment with your healing timeline. Never attempt locked stages without doctor authorization."
          />
        }
        renderItem={({ item }) => (
          <ExerciseCard
            exercise={item}
            onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item.id })}
          />
        )}
        ListEmptyComponent={
          <Card variant="flat" style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={56} color={colors.textMuted} />
            <Text style={[typography.h3, { color: colors.textPrimary, marginTop: 12 }]}>
              No Exercises Found
            </Text>
            <Text
              style={[
                typography.body,
                { color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
              ]}
            >
              No exercises match the selected filters. Check back or select a different body part.
            </Text>
          </Card>
        }
      />

      {/* Universal Emergency Modal */}
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
  filterSection: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  bodyPartScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    minHeight: 48, // 48dp Android requirement
    borderRadius: 24,
    borderWidth: 1.5,
  },
  stageScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
  },
  stageTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 40,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchBoxContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 48,
    borderWidth: 1.5,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    marginTop: 20,
  },
});
