export type JointName =
  | 'hips'
  | 'spineLower'
  | 'spineUpper'
  | 'chest'
  | 'neck'
  | 'head'
  | 'clavicleR'
  | 'shoulderR'
  | 'elbowR'
  | 'wristR'
  | 'clavicleL'
  | 'shoulderL'
  | 'elbowL'
  | 'wristL'
  | 'hipR'
  | 'kneeR'
  | 'ankleR'
  | 'hipL'
  | 'kneeL'
  | 'ankleL'

export type Euler = [number, number, number]
export type Axis = 'x' | 'y' | 'z'
export type JointTier = 'primary' | 'secondary'
export type HandId = 'handR' | 'handL'

type Range = [number, number]

export type JointSpec = {
  label: string
  rest: Euler
  drag: { vertical: Axis; horizontal: Axis }
  limits: { x: Range; y: Range; z: Range }
  tier: JointTier
}

export const SKELETON: Record<JointName, JointSpec> = {
  hips: {
    label: 'Quadril',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'y' },
    limits: { x: [-0.4, 0.4], y: [-0.9, 0.9], z: [-0.3, 0.3] },
    tier: 'primary',
  },
  spineLower: {
    label: 'Lombar',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'y' },
    limits: { x: [-0.45, 0.5], y: [-0.45, 0.45], z: [-0.25, 0.25] },
    tier: 'primary',
  },
  spineUpper: {
    label: 'Torácica',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'y' },
    limits: { x: [-0.35, 0.4], y: [-0.4, 0.4], z: [-0.2, 0.2] },
    tier: 'secondary',
  },
  chest: {
    label: 'Peito',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'y' },
    limits: { x: [-0.3, 0.4], y: [-0.55, 0.55], z: [-0.2, 0.2] },
    tier: 'primary',
  },
  neck: {
    label: 'Pescoço',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'y' },
    limits: { x: [-0.6, 0.5], y: [-0.7, 0.7], z: [-0.4, 0.4] },
    tier: 'secondary',
  },
  head: {
    label: 'Cabeça',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'y' },
    limits: { x: [-0.4, 0.35], y: [-0.5, 0.5], z: [-0.3, 0.3] },
    tier: 'primary',
  },
  clavicleR: {
    label: 'Clavícula direita',
    rest: [0, 0, 0],
    drag: { vertical: 'z', horizontal: 'y' },
    limits: { x: [-0.15, 0.15], y: [-0.35, 0.35], z: [-0.2, 0.5] },
    tier: 'secondary',
  },
  shoulderR: {
    label: 'Ombro direito',
    rest: [0, 0, 0.22],
    drag: { vertical: 'x', horizontal: 'z' },
    limits: { x: [-2.8, 1.2], y: [-0.8, 0.8], z: [-0.3, 2.7] },
    tier: 'primary',
  },
  elbowR: {
    label: 'Cotovelo direito',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'y' },
    limits: { x: [-2.5, 0], y: [-1.4, 1.4], z: [-0.2, 0.2] },
    tier: 'primary',
  },
  wristR: {
    label: 'Pulso direito',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'z' },
    limits: { x: [-1.2, 0.85], y: [-1.1, 1.1], z: [-0.55, 0.55] },
    tier: 'secondary',
  },
  clavicleL: {
    label: 'Clavícula esquerda',
    rest: [0, 0, 0],
    drag: { vertical: 'z', horizontal: 'y' },
    limits: { x: [-0.15, 0.15], y: [-0.35, 0.35], z: [-0.5, 0.2] },
    tier: 'secondary',
  },
  shoulderL: {
    label: 'Ombro esquerdo',
    rest: [0, 0, -0.22],
    drag: { vertical: 'x', horizontal: 'z' },
    limits: { x: [-2.8, 1.2], y: [-0.8, 0.8], z: [-2.7, 0.3] },
    tier: 'primary',
  },
  elbowL: {
    label: 'Cotovelo esquerdo',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'y' },
    limits: { x: [-2.5, 0], y: [-1.4, 1.4], z: [-0.2, 0.2] },
    tier: 'primary',
  },
  wristL: {
    label: 'Pulso esquerdo',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'z' },
    limits: { x: [-1.2, 0.85], y: [-1.1, 1.1], z: [-0.55, 0.55] },
    tier: 'secondary',
  },
  hipR: {
    label: 'Coxa direita',
    rest: [0, 0, 0.03],
    drag: { vertical: 'x', horizontal: 'z' },
    limits: { x: [-1.8, 0.7], y: [-0.5, 0.5], z: [-0.2, 1.0] },
    tier: 'primary',
  },
  kneeR: {
    label: 'Joelho direito',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'y' },
    limits: { x: [0, 2.3], y: [-0.3, 0.3], z: [-0.15, 0.15] },
    tier: 'primary',
  },
  ankleR: {
    label: 'Tornozelo direito',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'z' },
    limits: { x: [-0.7, 0.55], y: [-0.25, 0.25], z: [-0.4, 0.4] },
    tier: 'secondary',
  },
  hipL: {
    label: 'Coxa esquerda',
    rest: [0, 0, -0.03],
    drag: { vertical: 'x', horizontal: 'z' },
    limits: { x: [-1.8, 0.7], y: [-0.5, 0.5], z: [-1.0, 0.2] },
    tier: 'primary',
  },
  kneeL: {
    label: 'Joelho esquerdo',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'y' },
    limits: { x: [0, 2.3], y: [-0.3, 0.3], z: [-0.15, 0.15] },
    tier: 'primary',
  },
  ankleL: {
    label: 'Tornozelo esquerdo',
    rest: [0, 0, 0],
    drag: { vertical: 'x', horizontal: 'z' },
    limits: { x: [-0.7, 0.55], y: [-0.25, 0.25], z: [-0.4, 0.4] },
    tier: 'secondary',
  },
}

export type Pose = Record<JointName, Euler>

export const JOINT_NAMES = Object.keys(SKELETON) as JointName[]

export const REST_POSE: Pose = JOINT_NAMES.reduce((pose, name) => {
  pose[name] = SKELETON[name].rest
  return pose
}, {} as Pose)

export type HandPose = {
  grip: number
  spread: number
  thumb: number
}

export const REST_HAND: HandPose = { grip: 0.12, spread: 0.28, thumb: 0.22 }

export const REST_HANDS: Record<HandId, HandPose> = {
  handR: REST_HAND,
  handL: REST_HAND,
}

const clamp = (value: number, [min, max]: Range) => Math.min(max, Math.max(min, value))

export function clampJoint(name: JointName, rotation: Euler): Euler {
  const { limits } = SKELETON[name]
  return [
    clamp(rotation[0], limits.x),
    clamp(rotation[1], limits.y),
    clamp(rotation[2], limits.z),
  ]
}

export function clampHand(hand: HandPose): HandPose {
  return {
    grip: clamp(hand.grip, [0, 1]),
    spread: clamp(hand.spread, [0, 1]),
    thumb: clamp(hand.thumb, [0, 1]),
  }
}

export type PresetName = 'repouso' | 'tpose' | 'contraposto' | 'corrida' | 'sentado'

export type Preset = {
  label: string
  lift?: number
  pose: Partial<Pose>
  hands?: Partial<Record<HandId, Partial<HandPose>>>
}

export const PRESETS: Record<PresetName, Preset> = {
  repouso: {
    label: 'Repouso',
    pose: {},
  },
  tpose: {
    label: 'T',
    pose: {
      shoulderR: [0, 0, 1.57],
      shoulderL: [0, 0, -1.57],
      hipR: [0, 0, 0.06],
      hipL: [0, 0, -0.06],
    },
    hands: {
      handR: { grip: 0.05, spread: 0.45, thumb: 0.15 },
      handL: { grip: 0.05, spread: 0.45, thumb: 0.15 },
    },
  },
  contraposto: {
    label: 'Contraposto',
    pose: {
      hips: [0, 0.22, 0],
      spineLower: [0.02, -0.06, 0],
      spineUpper: [0.015, -0.07, 0],
      chest: [0.005, -0.05, 0],
      neck: [0, -0.15, 0],
      head: [-0.05, -0.15, 0],
      shoulderR: [-0.15, 0, 0.35],
      elbowR: [-0.7, -0.3, 0],
      wristR: [-0.15, 0, 0.1],
      shoulderL: [0.1, 0, -0.2],
      elbowL: [-0.35, 0, 0],
      hipR: [-0.12, 0, 0.14],
      kneeR: [0.45, 0, 0],
      hipL: [0.08, 0, -0.05],
      kneeL: [0.1, 0, 0],
    },
  },
  corrida: {
    label: 'Corrida',
    pose: {
      spineLower: [0.08, 0.04, 0],
      spineUpper: [0.06, 0.04, 0],
      chest: [0.04, 0.04, 0],
      neck: [-0.06, 0.05, 0],
      head: [-0.06, 0.05, 0],
      shoulderR: [-1.25, 0, 0.3],
      elbowR: [-1.7, 0, 0],
      wristR: [-0.2, 0, 0],
      shoulderL: [0.95, 0, -0.3],
      elbowL: [-1.35, 0, 0],
      wristL: [0.15, 0, 0],
      hipR: [-0.95, 0, 0.1],
      kneeR: [0.55, 0, 0],
      ankleR: [0.2, 0, 0],
      hipL: [0.5, 0, -0.1],
      kneeL: [1.7, 0, 0],
      ankleL: [-0.15, 0, 0],
    },
    hands: {
      handR: { grip: 0.7, spread: 0.15, thumb: 0.55 },
      handL: { grip: 0.65, spread: 0.15, thumb: 0.5 },
    },
  },
  sentado: {
    label: 'Sentado',
    lift: -0.6,
    pose: {
      spineLower: [0.04, 0, 0],
      spineUpper: [0.03, 0, 0],
      chest: [0.01, 0, 0],
      shoulderR: [-0.25, 0, 0.18],
      elbowR: [-0.6, 0, 0],
      shoulderL: [-0.25, 0, -0.18],
      elbowL: [-0.6, 0, 0],
      hipR: [-1.5, 0, 0.12],
      kneeR: [1.45, 0, 0],
      ankleR: [-0.1, 0, 0],
      hipL: [-1.5, 0, -0.12],
      kneeL: [1.45, 0, 0],
      ankleL: [-0.1, 0, 0],
    },
    hands: {
      handR: { grip: 0.35, spread: 0.2, thumb: 0.3 },
      handL: { grip: 0.35, spread: 0.2, thumb: 0.3 },
    },
  },
}

export function buildPose(partial: Partial<Pose>): Pose {
  return { ...REST_POSE, ...partial }
}

export function buildHands(partial?: Partial<Record<HandId, Partial<HandPose>>>): Record<HandId, HandPose> {
  return {
    handR: clampHand({ ...REST_HAND, ...partial?.handR }),
    handL: clampHand({ ...REST_HAND, ...partial?.handL }),
  }
}