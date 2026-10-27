import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { BodyPart, FractureType, UserProfile } from '../types/recovery';
import { useTheme } from '../context/ThemeContext';
import { useRecovery } from '../context/RecoveryContext';
import { BODY_PARTS, FRACTURE_TYPES } from '../data/mockData';
import { GENERAL_DISCLAIMER } from '../constants/redFlags';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { colors, typography, layout } = useTheme();
  const { saveProfile } = useRecovery();

  // Form State
  const [name, setName] = useState<string>('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>('wrist');
  const [selectedFractureType, setSelectedFractureType] = useState<FractureType>('stable_closed');
  const [weeksAgo, setWeeksAgo] = useState<number>(1);
  const [hadSurgery, setHadSurgery] = useState<boolean>(false);
  const [doctorConsulted, setDoctorConsulted] = useState<boolean>(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);

  const calculateInjuryDate = (weeks: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - weeks * 7);
    return d.toISOString().split('T')[0];
  };

  const handleFinish = async () => {
    if (!disclaimerAccepted) {
      Alert.alert(
        'Medical Disclaimer Required',
        'You must acknowledge and accept the medical disclaimer before accessing recovery tutorials. This app cannot replace direct orthopedic evaluation.',
        [{ text: 'Review Disclaimer' }]
      );
      return;
    }

    if (!doctorConsulted) {
      Alert.alert(
        'Doctor Consultation Essential',
        'Please have your fracture evaluated by an orthopedic doctor or emergency physician before attempting any physical therapy exercises.',
        [
          { text: 'Go Back', style: 'cancel' },
          {
            text: 'I Understand & Will Consult',
            onPress: () => submitProfile(),
          },
        ]
      );
      return;
    }

    await submitProfile();
  };

  const submitProfile = async () => {
    const profile: UserProfile = {
      id: Date.now().toString(),
      name: name.trim() || 'Patient',
      bodyPart: selectedBodyPart,
      fractureType: selectedFractureType,
      injuryDate: calculateInjuryDate(weeksAgo),
      hadSurgery,
      doctorConsulted,
      disclaimerAccepted: true,
      disclaimerAcceptedAt: new Date().toISOString(),
    };

    await saveProfile(profile);
    navigation.replace('MainTabs');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryMuted }]}>
          <Ionicons name="fitness" size={32} color={colors.primary} />
        </View>
        <Text style={[typography.h1, { color: colors.textPrimary, marginTop: 12 }]}>
          Welcome to OssaCare
        </Text>
        <Text style={[typography.subtitle, { color: colors.textSecondary, textAlign: 'center' }]}>
          Your stage-wise physiotherapy & bone healing companion
        </Text>
      </View>

      {/* Mandatory Disclaimer Gate */}
      <Card variant="outlined" style={{ borderColor: disclaimerAccepted ? colors.success : colors.warning }}>
        <View style={styles.disclaimerHeader}>
          <Ionicons
            name={disclaimerAccepted ? 'shield-checkmark' : 'alert-circle'}
            size={24}
            color={disclaimerAccepted ? colors.success : colors.warning}
          />
          <Text style={[typography.h3, { color: colors.textPrimary, marginLeft: 8 }]}>
            Mandatory Medical Disclaimer
          </Text>
        </View>

        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
          {GENERAL_DISCLAIMER}
        </Text>

        <Pressable
          onPress={() => setDisclaimerAccepted(!disclaimerAccepted)}
          accessible={true}
          accessibilityRole="checkbox"
          accessibilityLabel="I accept that this app does not replace a doctor or physiotherapist"
          accessibilityState={{ checked: disclaimerAccepted }}
          style={styles.checkboxRow}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: disclaimerAccepted ? colors.primary : colors.border,
                backgroundColor: disclaimerAccepted ? colors.primary : 'transparent',
              },
            ]}
          >
            {disclaimerAccepted && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
          </View>
          <Text
            style={[
              typography.bodyBold,
              {
                color: disclaimerAccepted ? colors.primary : colors.textPrimary,
                flex: 1,
                marginLeft: 10,
              },
            ]}
          >
            I understand and accept that this app is not medical diagnosis and I will only exercise with clinician approval.
          </Text>
        </Pressable>
      </Card>

      {/* Section 1: User Name (Optional) */}
      <View style={styles.section}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>What should we call you?</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Alex"
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceCard,
              color: colors.textPrimary,
              borderColor: colors.border,
              borderRadius: layout.borderRadius.md,
            },
          ]}
          accessibilityLabel="Enter your name"
        />
      </View>

      {/* Section 2: Affected Body Part */}
      <View style={styles.section}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>Which bone was fractured?</Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: 8 }]}>
          This customizes your safe range-of-motion routines.
        </Text>

        <View style={styles.chipsContainer}>
          {BODY_PARTS.map((part) => {
            const isSelected = selectedBodyPart === part.id;
            return (
              <Pressable
                key={part.id}
                onPress={() => setSelectedBodyPart(part.id)}
                accessible={true}
                accessibilityRole="radio"
                accessibilityLabel={part.label}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceCard,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={part.icon as any}
                  size={20}
                  color={isSelected ? '#FFFFFF' : colors.textPrimary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    typography.bodyBold,
                    { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {part.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Section 3: Fracture Type */}
      <View style={styles.section}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>Fracture Classification</Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: 8 }]}>
          Found in your orthopedist's X-ray or discharge report.
        </Text>

        {FRACTURE_TYPES.map((type) => {
          const isSelected = selectedFractureType === type.id;
          return (
            <Card
              key={type.id}
              variant={isSelected ? 'elevated' : 'outlined'}
              onPress={() => setSelectedFractureType(type.id)}
              style={{
                borderColor: isSelected ? colors.primary : colors.borderSubtle,
                borderWidth: isSelected ? 2 : 1,
              }}
              accessibilityLabel={`${type.label}: ${type.description}`}
            >
              <View style={styles.radioRow}>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {isSelected && (
                    <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>
                    {type.label}
                  </Text>
                  <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>
                    {type.description}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      {/* Section 4: Injury Timeline */}
      <View style={styles.section}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>When did the injury occur?</Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: 8 }]}>
          Used to calculate your current biological bone healing stage.
        </Text>

        <View style={styles.chipsContainer}>
          {[
            { label: 'This week (< 7 days)', weeks: 0 },
            { label: '1 - 2 weeks ago', weeks: 2 },
            { label: '3 - 4 weeks ago', weeks: 4 },
            { label: '5 - 6 weeks ago', weeks: 6 },
            { label: '7+ weeks ago', weeks: 8 },
          ].map((item) => {
            const isSelected = weeksAgo === item.weeks;
            return (
              <Pressable
                key={item.weeks}
                onPress={() => setWeeksAgo(item.weeks)}
                accessible={true}
                accessibilityRole="radio"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.timelineChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceCard,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.bodyBold,
                    { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Section 5: Clinical Toggles */}
      <View style={styles.section}>
        <Card variant="flat">
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>
                Did you undergo surgery?
              </Text>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                Plates, screws, pins, or ORIF fixation
              </Text>
            </View>
            <Switch
              value={hadSurgery}
              onValueChange={setHadSurgery}
              thumbColor={hadSurgery ? colors.primary : '#FFFFFF'}
              trackColor={{ false: colors.disabled, true: colors.primaryMuted }}
              accessibilityLabel="Did you undergo surgery switch"
            />
          </View>

          <View style={[styles.toggleRow, { marginTop: 16, borderTopWidth: 1, borderTopColor: colors.borderSubtle, paddingTop: 16 }]}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>
                Have you consulted a doctor?
              </Text>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                Mandatory for professional treatment
              </Text>
            </View>
            <Switch
              value={doctorConsulted}
              onValueChange={setDoctorConsulted}
              thumbColor={doctorConsulted ? colors.primary : '#FFFFFF'}
              trackColor={{ false: colors.disabled, true: colors.primaryMuted }}
              accessibilityLabel="Have you consulted a doctor switch"
            />
          </View>
        </Card>
      </View>

      {/* Complete Button */}
      <View style={styles.submitSection}>
        <Button
          title="Begin Recovery Journey"
          onPress={handleFinish}
          variant="primary"
          size="lg"
          rightIcon={<Ionicons name="arrow-forward" size={22} color="#FFFFFF" />}
          accessibilityLabel="Complete onboarding and begin recovery"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    minHeight: 48,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: 22,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
    marginTop: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    minHeight: 48, // 48dp minimum
    borderRadius: 24,
    borderWidth: 1.5,
  },
  timelineChip: {
    paddingHorizontal: 16,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  submitSection: {
    marginTop: 30,
  },
});
