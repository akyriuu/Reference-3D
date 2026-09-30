import { useState, type ReactNode } from 'react'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { SKELETON, type Axis, type Euler, type JointName } from './skeleton'

const SENSITIVITY = 0.008
const AXIS_INDEX: Record<Axis, 0 | 1 | 2> = { x: 0, y: 1, z: 2 }

export type PoseControls = {
  pose: Record<JointName, Euler>
  selected: JointName | null
  onSelect: (name: JointName | null) => void
  onRotate: (name: JointName, rotation: Euler) => void
  showHandle?: boolean
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
  showHandle = true,
}: Props) {
  const controls = useThree((state) => state.controls) as { enabled: boolean } | null
  const [hovered, setHovered] = useState(false)

  const spec = SKELETON[name]
  const isSelected = selected === name
  const visible = showHandle || isSelected

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    onSelect(name)

    const origin = { x: event.clientX, y: event.clientY }
    const start = pose[name]
    const vertical = AXIS_INDEX[spec.drag.vertical]
    const horizontal = AXIS_INDEX[spec.drag.horizontal]

    if (controls) controls.enabled = false

    const move = (moveEvent: PointerEvent) => {
      const next: Euler = [start[0], start[1], start[2]]
      next[vertical] = start[vertical] + (moveEvent.clientY - origin.y) * SENSITIVITY
      next[horizontal] = start[horizontal] - (moveEvent.clientX - origin.x) * SENSITIVITY
      onRotate(name, next)
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
      {visible && (
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
            color={isSelected ? '#ffffff' : hovered ? '#d1d1d6' : '#f5f5f7'}
            transparent
            opacity={isSelected || hovered ? 0.9 : 0.3}
            depthTest={false}
          />
        </mesh>
      )}
      {children}
    </group>
  )
}