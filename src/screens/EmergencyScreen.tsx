import React from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { RED_FLAG_SYMPTOMS } from '../constants/redFlags';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

type EmergencyScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Emergency'>;
};

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({ navigation }) => {
  const { colors, typography } = useTheme();

  const handleCallEmergency = () => {
    Linking.openURL('tel:911').catch((err) =>
      console.log('Error opening phone dialer:', err)
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Urgent Header */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.emergencyLight,
            borderBottomColor: colors.emergency,
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
          <Ionicons name="arrow-back" size={26} color={colors.emergency} />
        </Pressable>

        <Text
          style={[
            typography.h2,
            { color: colors.emergency, flex: 1, marginLeft: 8 },
          ]}
        >
          When to Call a Doctor
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.alertBanner}>
          <Ionicons name="warning" size={32} color={colors.emergency} />
          <Text
            style={[
              typography.bodyBold,
              { color: colors.emergency, flex: 1, marginLeft: 12 },
            ]}
          >
            RED-FLAG ORTHOPEDIC SYMPTOMS: Do not wait for your scheduled appointment if you observe any of the following:
          </Text>
        </View>

        {RED_FLAG_SYMPTOMS.map((symptom) => (
          <Card
            key={symptom.id}
            variant="elevated"
            style={{
              borderColor: symptom.urgency === 'immediate' ? colors.emergency : colors.warning,
              borderLeftWidth: 6,
              borderLeftColor: symptom.urgency === 'immediate' ? colors.emergency : colors.warning,
              marginVertical: 8,
            }}
          >
            <View style={styles.cardHeader}>
              <Ionicons
                name={symptom.icon as any}
                size={24}
                color={symptom.urgency === 'immediate' ? colors.emergency : colors.warning}
                style={{ marginRight: 10 }}
              />
              <Text
                style={[
                  typography.h3,
                  {
                    color: symptom.urgency === 'immediate' ? colors.emergency : colors.textPrimary,
                    flex: 1,
                  },
                ]}
              >
                {symptom.title}
              </Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      symptom.urgency === 'immediate'
                        ? colors.emergencyLight
                        : colors.warningLight,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption,
                    {
                      color:
                        symptom.urgency === 'immediate'
                          ? colors.emergency
                          : colors.warning,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                    },
                  ]}
                >
                  {symptom.urgency}
                </Text>
              </View>
            </View>

            <Text
              style={[
                typography.body,
                { color: colors.textSecondary, marginTop: 8 },
              ]}
            >
              {symptom.description}
            </Text>
          </Card>
        ))}

        <View style={{ marginTop: 20 }}>
          <Button
            title="Call 911 / Local Emergency Services"
            onPress={handleCallEmergency}
            variant="danger"
            size="lg"
            leftIcon={<Ionicons name="call" size={24} color="#FFFFFF" />}
            accessibilityLabel="Call local emergency services"
            fullWidth
          />
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 10,
    paddingBottom: 14,
    borderBottomWidth: 2,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
