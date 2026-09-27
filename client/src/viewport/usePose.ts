import { useCallback, useState } from 'react'
import {
  buildHands,
  buildPose,
  clampHand,
  clampJoint,
  PRESETS,
  REST_HANDS,
  REST_POSE,
  type Euler,
  type HandId,
  type HandPose,
  type JointName,
  type Pose,
  type PresetName,
} from './skeleton'

export function usePose() {
  const [pose, setPose] = useState<Pose>(REST_POSE)
  const [hands, setHands] = useState(REST_HANDS)
  const [lift, setLift] = useState(0)
  const [selected, setSelected] = useState<JointName | null>(null)

  const rotate = useCallback((name: JointName, rotation: Euler) => {
    setPose((current) => ({ ...current, [name]: clampJoint(name, rotation) }))
  }, [])

  const setHand = useCallback((id: HandId, patch: Partial<HandPose>) => {
    setHands((current) => ({ ...current, [id]: clampHand({ ...current[id], ...patch }) }))
  }, [])

  const select = useCallback((name: JointName | null) => {
    setSelected(name)
  }, [])

  const apply = useCallback((name: PresetName) => {
    const preset = PRESETS[name]
    setPose(buildPose(preset.pose))
    setHands(buildHands(preset.hands))
    setLift(preset.lift ?? 0)
  }, [])

  const reset = useCallback(() => {
    setPose(REST_POSE)
    setHands(REST_HANDS)
    setLift(0)
    setSelected(null)
  }, [])

  return { pose, hands, lift, selected, rotate, setHand, select, apply, reset }
}