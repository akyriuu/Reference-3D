import type { ThreeElements } from '@react-three/fiber'
import { Joint, type PoseControls } from './Joint'
import type { JointName } from './skeleton'

const SKIN = '#d9d2c7'

type PartProps = ThreeElements['mesh'] & {
  radius: number
  length: number
}

function Part({ radius, length, ...props }: PartProps) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <capsuleGeometry args={[radius, length, 6, 18]} />
      <meshStandardMaterial color={SKIN} roughness={0.62} metalness={0.05} />
    </mesh>
  )
}

type LimbProps = PoseControls & { side: 1 | -1 }

function Arm({ side, ...controls }: LimbProps) {
  const shoulder: JointName = side === 1 ? 'shoulderR' : 'shoulderL'
  const elbow: JointName = side === 1 ? 'elbowR' : 'elbowL'

  return (
    <Joint {...controls} name={shoulder} position={[0.21 * side, 0.22, 0]} handle={0.055}>
      <Part radius={0.065} length={0.22} position={[0, -0.175, 0]} />
      <Joint {...controls} name={elbow} position={[0, -0.35, 0]} handle={0.045}>
        <Part radius={0.055} length={0.2} position={[0, -0.16, 0]} />
        <Part radius={0.05} length={0.05} position={[0, -0.34, 0]} scale={[1, 1.1, 0.6]} />
      </Joint>
    </Joint>
  )
}

function Leg({ side, ...controls }: LimbProps) {
  const hip: JointName = side === 1 ? 'hipR' : 'hipL'
  const knee: JointName = side === 1 ? 'kneeR' : 'kneeL'

  return (
    <Joint {...controls} name={hip} position={[0.1 * side, 0, 0]} handle={0.05} handleAt={[0, -0.02, 0]}>
      <Part radius={0.09} length={0.38} position={[0, -0.28, 0]} />
      <Joint {...controls} name={knee} position={[0, -0.56, 0]} handle={0.05}>
        <Part radius={0.07} length={0.36} position={[0, -0.25, 0]} />
        <mesh position={[0, -0.535, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.07, 0.22]} />
          <meshStandardMaterial color={SKIN} roughness={0.62} />
        </mesh>
      </Joint>
    </Joint>
  )
}

type Props = PoseControls & { lift: number }

export function Mannequin({ lift, ...controls }: Props) {
  return (
    <group position={[0, -0.92 + lift, 0]}>
      <Joint {...controls} name="hips" position={[0, 1.14, 0]} handle={0.06} handleAt={[0, -0.08, 0]}>
        <Part
          radius={0.13}
          length={0.16}
          position={[0, -0.02, 0]}
          rotation={[0, 0, Math.PI / 2]}
          scale={[1, 1, 0.75]}
        />

        <Leg {...controls} side={1} />
        <Leg {...controls} side={-1} />

        <Joint {...controls} name="torso" position={[0, 0.14, 0]} handle={0.06}>
          <Part radius={0.17} length={0.2} position={[0, 0.04, 0]} scale={[1, 1, 0.72]} />
          <Part radius={0.05} length={0.06} position={[0, 0.35, 0]} />

          <Joint {...controls} name="head" position={[0, 0.4, 0]} handle={0.05}>
            <mesh position={[0, 0.1, 0]} scale={[1, 1.15, 1]} castShadow>
              <sphereGeometry args={[0.125, 28, 28]} />
              <meshStandardMaterial color={SKIN} roughness={0.62} />
            </mesh>
          </Joint>

          <Arm {...controls} side={1} />
          <Arm {...controls} side={-1} />
        </Joint>
      </Joint>
    </group>
  )
}