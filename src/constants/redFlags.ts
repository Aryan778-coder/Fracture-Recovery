export interface RedFlagSymptom {
  id: string;
  title: string;
  description: string;
  urgency: 'immediate' | 'urgent';
  icon: string;
}

export const RED_FLAG_SYMPTOMS: RedFlagSymptom[] = [
  {
    id: 'numbness_tingling',
    title: 'Severe Numbness or "Pins & Needles"',
    description:
      'Loss of sensation or constant numbness in fingers, toes, or below the fracture area. May indicate nerve compression or Compartment Syndrome.',
    urgency: 'immediate',
    icon: 'hand-left-outline',
  },
  {
    id: 'color_temp_change',
    title: 'Color or Temperature Changes',
    description:
      'Skin turning pale, bluish, dusky purple, or unusually cold to the touch. This could indicate compromised arterial blood flow.',
    urgency: 'immediate',
    icon: 'water-outline',
  },
  {
    id: 'severe_swelling_tightness',
    title: 'Rapid Swelling or Cast Tightness',
    description:
      'Sudden severe swelling, skin looking stretched and shiny, or a cast/splint feeling uncomfortably tight and burning.',
    urgency: 'immediate',
    icon: 'bandage-outline',
  },
  {
    id: 'uncontrolled_pain',
    title: 'Sudden Unbearable Pain (7-10/10)',
    description:
      'Severe pain that continues to escalate rapidly even after taking prescribed pain relief, elevating the limb, and resting.',
    urgency: 'urgent',
    icon: 'flash-outline',
  },
  {
    id: 'deformity_bone_shift',
    title: 'Visible Deformity or Bone Shift',
    description:
      'Limb looks visibly crooked, bent, shortened, or you heard/felt a snap, pop, or shift in the bone structure.',
    urgency: 'immediate',
    icon: 'body-outline',
  },
  {
    id: 'fever_infection',
    title: 'High Fever, Chills, or Foul Odor',
    description:
      'Fever above 38°C (100.4°F), red streaks spreading from surgical incisions, hot skin around fracture, or bad odor from cast.',
    urgency: 'urgent',
    icon: 'thermometer-outline',
  },
];

export const GENERAL_DISCLAIMER =
  'IMPORTANT MEDICAL NOTICE: This application is strictly an educational physiotherapy guide and rehabilitation tracker. It does NOT diagnose injuries, provide medical consultations, or replace professional orthopedic or physical therapy care. Always consult your orthopedic doctor or licensed physiotherapist before initiating, continuing, or progressing any exercise.';

export const EXERCISE_SAFETY_RULE =
  'Perform only after your doctor or physiotherapist approves. Never force movement past acute pain.';
