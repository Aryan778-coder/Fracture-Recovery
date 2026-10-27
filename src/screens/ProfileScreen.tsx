import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useRecovery } from '../context/RecoveryContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmergencyModal } from '../components/common/EmergencyModal';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { colors, typography, layout, isDark, toggleTheme } = useTheme();
  const { profile, daysSinceInjury, currentStage, resetAllData } = useRecovery();
  const [emergencyModalVisible, setEmergencyModalVisible] = useState<boolean>(false);

  const handleExportData = async () => {
    try {
      const exportContent = JSON.stringify(
        {
          appName: 'OssaCare Fracture Recovery',
          exportDate: new Date().toISOString(),
          profile,
          currentStage: currentStage.name,
          daysSinceInjury,
        },
        null,
        2
      );

      await Share.share({
        message: `OssaCare Clinical Rehabilitation Report:\n\n${exportContent}`,
        title: 'OssaCare Recovery Data Export',
      });
    } catch (e) {
      console.error('Error sharing data:', e);
    }
  };

  const handleConfirmReset = () => {
    Alert.alert(
      'Delete All Recovery Data?',
      'This will erase your injury timeline, daily progress logs, and return the app to the onboarding state. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            const parentNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
            if (parentNav) {
              parentNav.reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              });
            } else {
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              });
            }
          },
        },
      ]
    );
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
            Profile & Settings
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            App preferences, injury info & data security
          </Text>
        </View>

        <Pressable
          onPress={() => setEmergencyModalVisible(true)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Emergency Red Flags"
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
        {/* User Card */}
        <Card variant="elevated">
          <View style={styles.userRow}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.primaryMuted }]}>
              <Ionicons name="person" size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[typography.h2, { color: colors.textPrimary }]}>
                {profile?.name || 'Patient'}
              </Text>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                Day {daysSinceInjury} • {currentStage.name}
              </Text>
            </View>
          </View>
        </Card>

        {/* Clinical Injury Information */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.h3, { color: colors.textPrimary }]}>
            Clinical Fracture Details
          </Text>
        </View>

        <Card variant="outlined">
          <View style={styles.detailRow}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>Injured Region</Text>
            <Text style={[typography.bodyBold, { color: colors.textPrimary, textTransform: 'capitalize' }]}>
              {profile?.bodyPart || 'Wrist'}
            </Text>
          </View>

          <View style={[styles.detailRow, styles.divider]}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>Fracture Type</Text>
            <Text style={[typography.bodyBold, { color: colors.textPrimary, textTransform: 'capitalize' }]}>
              {profile?.fractureType.replace('_', ' ') || 'Stable Closed'}
            </Text>
          </View>

          <View style={[styles.detailRow, styles.divider]}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>Surgical Fixation</Text>
            <Text style={[typography.bodyBold, { color: profile?.hadSurgery ? colors.primary : colors.textPrimary }]}>
              {profile?.hadSurgery ? 'Yes (ORIF / Hardware)' : 'No (Conservative)'}
            </Text>
          </View>

          <View style={[styles.detailRow, styles.divider]}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>Doctor Consulted</Text>
            <Text style={[typography.bodyBold, { color: colors.success }]}>
              {profile?.doctorConsulted ? 'Verified Consult' : 'Pending'}
            </Text>
          </View>
        </Card>

        {/* Preferences & Dark Mode */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.h3, { color: colors.textPrimary }]}>Preferences</Text>
        </View>

        <Card variant="flat">
          <View style={styles.settingRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={22}
                color={colors.primary}
                style={{ marginRight: 12 }}
              />
              <View>
                <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>Dark Mode</Text>
                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                  High contrast dark palette for eye comfort
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? colors.primary : '#FFFFFF'}
              trackColor={{ false: colors.disabled, true: colors.primaryMuted }}
              accessibilityLabel="Toggle Dark Theme"
            />
          </View>
        </Card>

        {/* Data Management */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.h3, { color: colors.textPrimary }]}>Data Management</Text>
        </View>

        <Card variant="outlined">
          <Button
            title="Export Rehab Logs to Doctor"
            onPress={handleExportData}
            variant="secondary"
            size="md"
            leftIcon={<Ionicons name="share-outline" size={20} color={colors.textPrimary} />}
            accessibilityLabel="Export recovery data to your physician"
            fullWidth
          />

          <View style={{ marginTop: 12 }}>
            <Button
              title="Delete All Local Data"
              onPress={handleConfirmReset}
              variant="danger"
              size="md"
              leftIcon={<Ionicons name="trash-outline" size={20} color="#FFFFFF" />}
              accessibilityLabel="Delete all local recovery logs and reset app"
              fullWidth
            />
          </View>
        </Card>

        {/* App Info & Disclaimer */}
        <View style={styles.footerNote}>
          <Text style={[typography.caption, { color: colors.textMuted, textAlign: 'center' }]}>
            OssaCare Fracture Recovery Companion v1.0.0
          </Text>
          <Text style={[typography.caption, { color: colors.textMuted, textAlign: 'center', marginTop: 4 }]}>
            All exercise data marked [PLACEHOLDER – requires physio review].
          </Text>
        </View>
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  footerNote: {
    marginTop: 24,
    marginBottom: 16,
  },
});
