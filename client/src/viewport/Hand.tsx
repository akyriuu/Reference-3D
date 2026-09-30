import type { HandPose } from './skeleton'

const SKIN = '#d2d2d7'


type DigitProps = {
  position: [number, number, number]
  splay: number
  curl: number
  lengths: [number, number]
  radius: number
}

function Digit({ position, splay, curl, lengths, radius }: DigitProps) {
  const proximal = curl * 0.95
  const distal = curl * 1.2

  return (
    <group position={position} rotation={[0, 0, splay]}>
      <group rotation={[proximal, 0, 0]}>
        <mesh position={[0, -lengths[0] / 2, 0]} castShadow>
          <capsuleGeometry args={[radius, lengths[0], 4, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.62} />
        </mesh>
        <group position={[0, -lengths[0], 0]} rotation={[distal, 0, 0]}>
          <mesh position={[0, -lengths[1] / 2, 0]} castShadow>
            <capsuleGeometry args={[radius * 0.85, lengths[1], 4, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.62} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

type Props = {
  side: 1 | -1
  pose: HandPose
}

export function Hand({ side, pose }: Props) {
  const { grip, spread, thumb } = pose
  const splay = (spread - 0.35) * 0.4

  return (
    <group position={[0, -0.04, 0]}>
      <mesh position={[0, -0.04, 0]} castShadow>
        <boxGeometry args={[0.072, 0.08, 0.026]} />
        <meshStandardMaterial color={SKIN} roughness={0.62} />
      </mesh>

      <Digit
        position={[0.026 * side, -0.085, 0.004]}
        splay={splay * 1.15 * side}
        curl={grip}
        lengths={[0.042, 0.034]}
        radius={0.011}
      />
      <Digit
        position={[0.008 * side, -0.09, 0.006]}
        splay={splay * 0.25 * side}
        curl={grip * 1.08}
        lengths={[0.048, 0.038]}
        radius={0.012}
      />
      <Digit
        position={[-0.01 * side, -0.088, 0.004]}
        splay={-splay * 0.35 * side}
        curl={grip}
        lengths={[0.044, 0.034]}
        radius={0.011}
      />
      <Digit
        position={[-0.026 * side, -0.08, 0.002]}
        splay={-splay * 1.05 * side}
        curl={grip * 0.88}
        lengths={[0.036, 0.028]}
        radius={0.01}
      />

      <group
        position={[0.02 * side, -0.018, 0.018]}
        rotation={[0.35 - thumb * 0.25, 0.75 * side, (0.45 + thumb * 0.7) * side]}
      >
        <Digit
          position={[0, 0, 0]}
          splay={0}
          curl={grip * 0.4 + thumb * 0.45}
          lengths={[0.034, 0.028]}
          radius={0.013}
        />
      </group>
    </group>
  )
}