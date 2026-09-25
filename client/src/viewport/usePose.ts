import { useCallback, useState } from 'react'
import {
  buildPose,
  clampJoint,
  PRESETS,
  REST_POSE,
  type Euler,
  type JointName,
  type Pose,
  type PresetName,
} from './skeleton'

export function usePose() {
  const [pose, setPose] = useState<Pose>(REST_POSE)
  const [lift, setLift] = useState(0)
  const [selected, setSelected] = useState<JointName | null>(null)

  const rotate = useCallback((name: JointName, rotation: Euler) => {
    setPose((current) => ({ ...current, [name]: clampJoint(name, rotation) }))
  }, [])

  const select = useCallback((name: JointName | null) => {
    setSelected(name)
  }, [])

  const apply = useCallback((name: PresetName) => {
    const preset = PRESETS[name]
    setPose(buildPose(preset.pose))
    setLift(preset.lift ?? 0)
  }, [])

  const reset = useCallback(() => {
    setPose(REST_POSE)
    setLift(0)
    setSelected(null)
  }, [])

  return { pose, lift, selected, rotate, select, apply, reset }
}