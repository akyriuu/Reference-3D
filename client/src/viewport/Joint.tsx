import { useState, type ReactNode } from 'react'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { SKELETON, type Euler, type JointName } from './skeleton'

const SENSITIVITY = 0.008

export type PoseControls = {
  pose: Record<JointName, Euler>
  selected: JointName | null
  onSelect: (name: JointName | null) => void
  onRotate: (name: JointName, rotation: Euler) => void
}

type Props = PoseControls & {
  name: JointName
  position: [number, number, number]
  handle?: number
  handleAt?: [number, number, number]
  children: ReactNode
}

export function Joint({
  name,
  position,
  handle = 0.05,
  handleAt = [0, 0, 0],
  children,
  pose,
  selected,
  onSelect,
  onRotate,
}: Props) {
  // makeDefault no OrbitControls é o que publica a instância aqui
  const controls = useThree((state) => state.controls) as { enabled: boolean } | null
  const [hovered, setHovered] = useState(false)

  const spec = SKELETON[name]
  const isSelected = selected === name

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    onSelect(name)

    const origin = { x: event.clientX, y: event.clientY }
    const start = pose[name]

    // o listener do R3F roda antes do OrbitControls, que checa `enabled` na entrada
    if (controls) controls.enabled = false

    const move = (moveEvent: PointerEvent) => {
      const bend = start[0] + (moveEvent.clientY - origin.y) * SENSITIVITY
      const base = spec.spin === 'y' ? start[1] : start[2]
      const twist = base - (moveEvent.clientX - origin.x) * SENSITIVITY

      onRotate(name, spec.spin === 'y' ? [bend, twist, start[2]] : [bend, start[1], twist])
    }

    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      if (controls) controls.enabled = true
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  return (
    <group position={position} rotation={pose[name]}>
      <mesh
        position={handleAt}
        renderOrder={2}
        onPointerDown={startDrag}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[handle, 16, 16]} />
        <meshBasicMaterial
          color={isSelected ? '#6c8cff' : hovered ? '#ffd166' : '#ffffff'}
          transparent
          opacity={isSelected || hovered ? 0.9 : 0.3}
          depthTest={false}
        />
      </mesh>
      {children}
    </group>
  )
}