export type JointName =
  | 'hips'
  | 'torso'
  | 'head'
  | 'shoulderR'
  | 'elbowR'
  | 'shoulderL'
  | 'elbowL'
  | 'hipR'
  | 'kneeR'
  | 'hipL'
  | 'kneeL'

export type Euler = [number, number, number]

type Range = [number, number]

/** eixo do arraste horizontal; o vertical é sempre X (flexão) */
type SpinAxis = 'y' | 'z'

export type JointSpec = {
  label: string
  rest: Euler
  spin: SpinAxis
  bend: Range
  twist: Range
}

export const SKELETON: Record<JointName, JointSpec> = {
  hips:      { label: 'Quadril',           rest: [0, 0, 0],     spin: 'y', bend: [-0.4, 0.4], twist: [-0.9, 0.9] },
  torso:     { label: 'Tronco',            rest: [0, 0, 0],     spin: 'y', bend: [-0.5, 0.7], twist: [-1.0, 1.0] },
  head:      { label: 'Cabeça',            rest: [0, 0, 0],     spin: 'y', bend: [-0.6, 0.5], twist: [-1.2, 1.2] },
  shoulderR: { label: 'Ombro direito',     rest: [0, 0, 0.22],  spin: 'z', bend: [-2.8, 1.2], twist: [-0.3, 2.7] },
  elbowR:    { label: 'Cotovelo direito',  rest: [0, 0, 0],     spin: 'y', bend: [-2.5, 0],   twist: [-1.4, 1.4] },
  shoulderL: { label: 'Ombro esquerdo',    rest: [0, 0, -0.22], spin: 'z', bend: [-2.8, 1.2], twist: [-2.7, 0.3] },
  elbowL:    { label: 'Cotovelo esquerdo', rest: [0, 0, 0],     spin: 'y', bend: [-2.5, 0],   twist: [-1.4, 1.4] },
  hipR:      { label: 'Coxa direita',      rest: [0, 0, 0.03],  spin: 'z', bend: [-1.8, 0.7], twist: [-0.2, 1.0] },
  kneeR:     { label: 'Joelho direito',    rest: [0, 0, 0],     spin: 'y', bend: [0, 2.3],    twist: [-0.3, 0.3] },
  hipL:      { label: 'Coxa esquerda',     rest: [0, 0, -0.03], spin: 'z', bend: [-1.8, 0.7], twist: [-1.0, 0.2] },
  kneeL:     { label: 'Joelho esquerdo',   rest: [0, 0, 0],     spin: 'y', bend: [0, 2.3],    twist: [-0.3, 0.3] },
}

export type Pose = Record<JointName, Euler>

export const JOINT_NAMES = Object.keys(SKELETON) as JointName[]

export const REST_POSE: Pose = JOINT_NAMES.reduce((pose, name) => {
  pose[name] = SKELETON[name].rest
  return pose
}, {} as Pose)

const clamp = (value: number, [min, max]: Range) => Math.min(max, Math.max(min, value))

export function clampJoint(name: JointName, rotation: Euler): Euler {
  const spec = SKELETON[name]
  const [x, y, z] = rotation
  return [
    clamp(x, spec.bend),
    spec.spin === 'y' ? clamp(y, spec.twist) : y,
    spec.spin === 'z' ? clamp(z, spec.twist) : z,
  ]
}

export type PresetName = 'repouso' | 'tpose' | 'contraposto' | 'corrida' | 'sentado'

/** `lift` desloca a raiz no Y, para poses que não ficam de pé */
export type Preset = {
  label: string
  lift?: number
  pose: Partial<Pose>
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
      elbowR: [0, 0, 0],
      elbowL: [0, 0, 0],
      hipR: [0, 0, 0.06],
      hipL: [0, 0, -0.06],
    },
  },
  contraposto: {
    label: 'Contraposto',
    pose: {
      hips: [0, 0.22, 0],
      torso: [0.04, -0.18, 0],
      head: [-0.05, -0.3, 0],
      shoulderR: [-0.15, 0, 0.35],
      elbowR: [-0.7, -0.3, 0],
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
      torso: [0.18, 0.12, 0],
      head: [-0.12, 0.1, 0],
      shoulderR: [-1.25, 0, 0.3],
      elbowR: [-1.7, 0, 0],
      shoulderL: [0.95, 0, -0.3],
      elbowL: [-1.35, 0, 0],
      hipR: [-0.95, 0, 0.1],
      kneeR: [0.55, 0, 0],
      hipL: [0.5, 0, -0.1],
      kneeL: [1.7, 0, 0],
    },
  },
  sentado: {
    label: 'Sentado',
    lift: -0.6,
    pose: {
      torso: [0.08, 0, 0],
      shoulderR: [-0.25, 0, 0.18],
      elbowR: [-0.6, 0, 0],
      shoulderL: [-0.25, 0, -0.18],
      elbowL: [-0.6, 0, 0],
      hipR: [-1.5, 0, 0.12],
      kneeR: [1.45, 0, 0],
      hipL: [-1.5, 0, -0.12],
      kneeL: [1.45, 0, 0],
    },
  },
}

export function buildPose(partial: Partial<Pose>): Pose {
  return { ...REST_POSE, ...partial }
}