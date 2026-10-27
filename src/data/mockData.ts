import { BodyPart, Exercise, FractureType, Stage } from '../types/recovery';

export const BODY_PARTS: { id: BodyPart; label: string; icon: string }[] = [
  { id: 'wrist', label: 'Wrist & Forearm', icon: 'hand-left-outline' },
  { id: 'arm', label: 'Arm & Elbow', icon: 'fitness-outline' },
  { id: 'hand', label: 'Hand & Fingers', icon: 'hand-right-outline' },
  { id: 'ankle', label: 'Ankle & Foot', icon: 'footsteps-outline' },
  { id: 'leg', label: 'Leg & Knee', icon: 'walk-outline' },
  { id: 'collarbone', label: 'Clavicle / Shoulder', icon: 'shield-outline' },
  { id: 'spine', label: 'Spine & Vertebrae', icon: 'body-outline' },
];

export const FRACTURE_TYPES: { id: FractureType; label: string; description: string }[] = [
  {
    id: 'hairline',
    label: 'Hairline / Stress Fracture',
    description: 'A thin crack in the bone caused by repetitive stress or minor impact.',
  },
  {
    id: 'stable_closed',
    label: 'Stable Non-Displaced Fracture',
    description: 'Bone is broken but aligned properly; skin is intact.',
  },
  {
    id: 'displaced',
    label: 'Displaced Fracture',
    description: 'Bone fragments have shifted out of anatomical alignment.',
  },
  {
    id: 'compound_open',
    label: 'Compound / Open Fracture',
    description: 'Bone pierced the skin; higher infection risk and surgical fixation.',
  },
  {
    id: 'comminuted',
    label: 'Comminuted Fracture',
    description: 'Bone broke into three or more pieces, often requiring plates/pins.',
  },
];

export const RECOVERY_STAGES: Stage[] = [
  {
    id: 'stage_1',
    stageNumber: 1,
    name: 'Stage 1: Immobilization & Protection',
    subtitle: 'Healing Bone Matrix & Reducing Edema',
    durationWeeksRange: 'Weeks 0 - 3',
    durationDays: 21,
    description:
      'The bone is forming a soft fibrocartilaginous callus. The primary focus is strict protection, swelling reduction (elevation/icing), and gentle movement of uninjured adjacent joints.',
    allowedActivities: [
      'Gentle wiggle and movement of fingers or toes outside cast',
      'Elevation of limb above heart level to drain edema',
      'Gentle shoulder and neck mobility to prevent frozen joint stiffness',
      'Taking prescribed calcium, vitamin D, and medications',
    ],
    restrictions: [
      'NO weight-bearing or pushing through injured limb',
      'NO twisting, torquing, or active movement of fractured bone',
      'NO wetting or removing cast/splint without doctor approval',
      'NO heavy lifting (> 0.5 kg)',
    ],
    clinicalGoal: 'Stabilize fracture site, reduce inflammatory swelling, prevent stiffness in adjacent joints.',
  },
  {
    id: 'stage_2',
    stageNumber: 2,
    name: 'Stage 2: Early Mobility & Range of Motion',
    subtitle: 'Gentle Unloaded Movement',
    durationWeeksRange: 'Weeks 4 - 6',
    durationDays: 42,
    description:
      'Hard bone callus has started bridging the fracture line. Radiographs typically verify early union. Your physiotherapist will initiate active-assisted or active range-of-motion exercises without added resistance.',
    allowedActivities: [
      'Gentle active range of motion exercises within pain-free boundaries',
      'Warm water soak before exercises (if incision is completely healed & approved)',
      'Light day-to-day tasks: holding a cup, turning a light page',
      'Scar massage after sutures are removed and wound is closed',
    ],
    restrictions: [
      'NO sudden ballistic or jerking movements',
      'NO loaded resistance bands or dumbbells yet',
      'NO high-impact activities or contact sports',
      'Stop if acute sharp pain exceeds 4/10',
    ],
    clinicalGoal: 'Restore joint mobility, decrease tendon adhesions, and re-establish neuromuscular control.',
  },
  {
    id: 'stage_3',
    stageNumber: 3,
    name: 'Stage 3: Progressive Strengthening',
    subtitle: 'Restoring Muscle Power & Resistance',
    durationWeeksRange: 'Weeks 7 - 12',
    durationDays: 84,
    description:
      'Bone consolidation is well established. Under clinical guidance, resistance training, isometric holds, and functional loading are introduced to rebuild atrophy and joint stability.',
    allowedActivities: [
      'Gradual isometric contractions and light elastic resistance',
      'Grip strengthening with therapy putty or soft foam balls',
      'Proprioception and balance retraining',
      'Light household chores and moderate daily activities',
    ],
    restrictions: [
      'NO heavy bench pressing, overhead lifts, or maximal loading',
      'NO competitive sports with impact risks without physician sign-off',
      'Avoid pushing through sharp joint pain',
    ],
    clinicalGoal: 'Rebuild muscle mass, regain 80%+ strength, and improve endurance.',
  },
  {
    id: 'stage_4',
    stageNumber: 4,
    name: 'Stage 4: Return to Full Activity & Sports',
    subtitle: 'Functional Integration & Impact Tolerance',
    durationWeeksRange: 'Weeks 13+',
    durationDays: 120,
    description:
      'Full clinical union confirmed by orthopedic surgeon. Focus on sports-specific agility, power output, heavy loading, and psychological confidence.',
    allowedActivities: [
      'Dynamic plyometrics and sport-specific drills',
      'Full weight-bearing resistance and gym workouts',
      'High-level endurance and agility training',
    ],
    restrictions: [
      'Always perform a thorough 10-minute warm-up',
      'Cease activity if abnormal swelling or deep bone ache resurfaces',
    ],
    clinicalGoal: '100% functional independence and symmetric strength compared to uninjured limb.',
  },
];

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex_wrist_01',
    title: '[PLACEHOLDER – requires physio review] Gentle Finger Tendon Gliding',
    bodyPart: 'wrist',
    stageId: 'stage_1',
    stageNumber: 1,
    difficulty: 'Gentle',
    durationMinutes: 4,
    sets: 2,
    reps: 10,
    holdSeconds: 3,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
    summary:
      '[PLACEHOLDER – requires physio review] Keeps the forearm flexor and extensor tendons moving smoothly while the wrist remains stabilized in a cast or splint.',
    steps: [
      '[PLACEHOLDER – requires physio review] Sit comfortably with your arm rested on a pillow or armrest at heart level.',
      '[PLACEHOLDER – requires physio review] Start with your hand open, fingers straight and pointing upwards towards ceiling.',
      '[PLACEHOLDER – requires physio review] Slowly bend only your top knuckles to make a hook fist. Hold gently for 3 seconds.',
      '[PLACEHOLDER – requires physio review] Unfurl fingers back to straight, then curl into a soft full fist without squeezing hard.',
      '[PLACEHOLDER – requires physio review] Repeat for 10 slow, controlled repetitions. Do not move or stress the fractured wrist.',
    ],
    commonMistakes: [
      'Twisting or cocking the immobilized wrist joint while moving fingers.',
      'Squeezing the fist tightly (this causes excessive tendon tension on the bone).',
      'Holding breath or rushing through repetitions.',
    ],
    stopIf: [
      'You experience sharp, throbbing pain radiating into the wrist or forearm.',
      'Fingers feel tingling, cold, or increasingly numb.',
      'You feel burning tightness beneath the plaster cast or brace.',
    ],
    targetMuscles: ['Flexor digitorum profundus', 'Extensor digitorum', 'Lumbricals'],
    safetyNote:
      'Perform only after your doctor or physiotherapist approves. Keep the wrist completely immobilized throughout this movement.',
  },
  {
    id: 'ex_wrist_02',
    title: '[PLACEHOLDER – requires physio review] Active Wrist Flexion & Extension',
    bodyPart: 'wrist',
    stageId: 'stage_2',
    stageNumber: 2,
    difficulty: 'Mild',
    durationMinutes: 5,
    sets: 3,
    reps: 10,
    holdSeconds: 5,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    summary:
      '[PLACEHOLDER – requires physio review] Restores basic up-and-down flexibility of the wrist joint once cast removal is authorized by your orthopedist.',
    steps: [
      '[PLACEHOLDER – requires physio review] Sit beside a table. Rest your forearm flat on a folded towel with your hand hanging over the edge.',
      '[PLACEHOLDER – requires physio review] Keep your fingers gently relaxed in a natural curve.',
      '[PLACEHOLDER – requires physio review] Slowly lift your hand upward toward the ceiling until you feel a gentle, comfortable stretch. Hold for 5 seconds.',
      '[PLACEHOLDER – requires physio review] Slowly lower your hand downward toward the floor in a controlled motion. Hold for 5 seconds.',
      '[PLACEHOLDER – requires physio review] Return to the neutral starting level. That is 1 repetition.',
    ],
    commonMistakes: [
      'Forcing the wrist past the point of initial mild stiffness into sharp pain.',
      'Lifting the elbow or forearm off the table to cheat range of motion.',
      'Jerking or bouncing at the end of the movement range.',
    ],
    stopIf: [
      'Sharp or stinging bone pain occurs at the fracture location.',
      'Sudden swelling or redness develops around the wrist joint.',
      'Pain does not subside after 2 minutes of resting.',
    ],
    targetMuscles: ['Extensor carpi radialis', 'Flexor carpi ulnaris', 'Wrist extensors'],
    safetyNote:
      'Perform only after your doctor or physiotherapist approves. Do NOT use weights, dumbbells, or resistance bands during this early mobility stage.',
  },
  {
    id: 'ex_wrist_03',
    title: '[PLACEHOLDER – requires physio review] Forearm Pronation & Supination',
    bodyPart: 'wrist',
    stageId: 'stage_2',
    stageNumber: 2,
    difficulty: 'Mild',
    durationMinutes: 5,
    sets: 3,
    reps: 8,
    holdSeconds: 4,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
    summary:
      '[PLACEHOLDER – requires physio review] Gentle rotation of the forearm to regain palm-up and palm-down rotational range.',
    steps: [
      '[PLACEHOLDER – requires physio review] Stand or sit tall with your elbow bent at 90 degrees, tucked closely to your side.',
      '[PLACEHOLDER – requires physio review] Start with your thumb pointing straight up (hand in neutral handshake position).',
      '[PLACEHOLDER – requires physio review] Slowly rotate your palm to face upwards toward the ceiling (supination). Hold 4 seconds.',
      '[PLACEHOLDER – requires physio review] Slowly rotate back through neutral until your palm faces the floor (pronation). Hold 4 seconds.',
    ],
    commonMistakes: [
      'Flaring the elbow away from the ribcage to compensate for tight rotation.',
      'Twisting the torso instead of isolating the forearm.',
    ],
    stopIf: [
      'Clicking sensation accompanied by sudden sharp pain.',
      'Pain rating spikes above 4/10.',
    ],
    targetMuscles: ['Pronator teres', 'Pronator quadratus', 'Supinator'],
    safetyNote:
      'Perform only after your doctor or physiotherapist approves. Movement should be smooth and slow.',
  },
  {
    id: 'ex_wrist_04',
    title: '[PLACEHOLDER – requires physio review] Gentle Foam Ball Grip Squeeze',
    bodyPart: 'wrist',
    stageId: 'stage_3',
    stageNumber: 3,
    difficulty: 'Moderate',
    durationMinutes: 6,
    sets: 3,
    reps: 12,
    holdSeconds: 5,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&auto=format&fit=crop&q=80',
    summary:
      '[PLACEHOLDER – requires physio review] Progressive isometric loading to restore grip strength and forearm muscular endurance.',
    steps: [
      '[PLACEHOLDER – requires physio review] Hold a soft stress ball or therapy sponge in the palm of your hand.',
      '[PLACEHOLDER – requires physio review] Squeeze gently at 30% of your maximum effort. Hold for 5 seconds.',
      '[PLACEHOLDER – requires physio review] Slowly release tension over 3 seconds.',
      '[PLACEHOLDER – requires physio review] Rest for 10 seconds between sets.',
    ],
    commonMistakes: [
      'Squeezing aggressively at 100% effort too soon in recovery.',
      'Bending the wrist awkwardly while squeezing.',
    ],
    stopIf: [
      'Deep, aching bone pain flares up.',
      'Numbness or tingling shoots into fingertips.',
    ],
    targetMuscles: ['Flexor digitorum', 'Thenar intrinsic hand muscles'],
    safetyNote:
      'Perform only after your doctor or physiotherapist approves. Use only soft-density therapy balls.',
  },
];
