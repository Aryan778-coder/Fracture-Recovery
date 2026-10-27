import React from 'react';
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RED_FLAG_SYMPTOMS } from '../../constants/redFlags';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';

interface EmergencyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, typography, layout } = useTheme();

  const handleCallEmergency = () => {
    Linking.openURL('tel:911').catch((err) =>
      console.log('Error opening phone dialer:', err)
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: layout.borderRadius.xl,
              borderTopRightRadius: layout.borderRadius.xl,
            },
          ]}
        >
          {/* Header Bar */}
          <View
            style={[
              styles.header,
              { backgroundColor: colors.emergencyLight, borderColor: colors.emergency },
            ]}
          >
            <View style={styles.headerTitleRow}>
              <Ionicons name="warning" size={28} color={colors.emergency} />
              <Text
                style={[
                  typography.h2,
                  { color: colors.emergency, marginLeft: 10, flex: 1 },
                ]}
              >
                When to Call a Doctor
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close emergency warning modal"
              style={styles.closeButton}
            >
              <Ionicons name="close" size={26} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Subtitle */}
          <View style={styles.introSection}>
            <Text
              style={[
                typography.body,
                { color: colors.textPrimary, fontWeight: '500' },
              ]}
            >
              If you experience any of these <Text style={{ color: colors.emergency, fontWeight: '700' }}>RED-FLAG SYMPTOMS</Text>, do not wait for your next appointment. Seek immediate emergency evaluation:
            </Text>
          </View>

          {/* Red Flag Symptoms List */}
          <ScrollView
            style={styles.symptomsList}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {RED_FLAG_SYMPTOMS.map((symptom) => (
              <View
                key={symptom.id}
                style={[
                  styles.symptomCard,
                  {
                    backgroundColor: colors.surfaceCard,
                    borderColor: symptom.urgency === 'immediate' ? colors.emergency : colors.warning,
                  },
                ]}
              >
                <View style={styles.symptomHeader}>
                  <Ionicons
                    name={symptom.icon as any}
                    size={22}
                    color={symptom.urgency === 'immediate' ? colors.emergency : colors.warning}
                    style={{ marginRight: 8 }}
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
                      styles.urgencyBadge,
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
                    { color: colors.textSecondary, marginTop: 6 },
                  ]}
                >
                  {symptom.description}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={[styles.footer, { borderTopColor: colors.borderSubtle }]}>
            <Button
              title="Call Emergency (911 / Local EMS)"
              onPress={handleCallEmergency}
              variant="danger"
              size="lg"
              leftIcon={<Ionicons name="call" size={22} color="#FFFFFF" />}
              accessibilityLabel="Call local emergency services"
              fullWidth
            />
            <Button
              title="Close & Return to App"
              onPress={onClose}
              variant="secondary"
              size="md"
              accessibilityLabel="Dismiss emergency modal"
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'android' ? 16 : 30,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1.5,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  symptomsList: {
    paddingHorizontal: 20,
  },
  symptomCard: {
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    marginVertical: 6,
  },
  symptomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
  },
});
