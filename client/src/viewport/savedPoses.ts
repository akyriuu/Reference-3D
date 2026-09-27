import {
    buildHands,
    clampJoint,
    JOINT_NAMES,
    REST_POSE,
    type HandId,
    type HandPose,
    type Pose,
  } from './skeleton'
  
  export const SAVED_POSES_KEY = 'reference3d.savedPoses.v1'
  
  export type SavedPose = {
    id: string
    name: string
    createdAt: number
    lift: number
    pose: Pose
    hands: Record<HandId, HandPose>
  }
  
  type Snapshot = {
    pose: Pose
    hands: Record<HandId, HandPose>
    lift: number
  }
  
  function sanitizePose(raw: unknown): Pose {
    const source = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
    const next = { ...REST_POSE }
  
    for (const name of JOINT_NAMES) {
      const value = source[name]
      if (!Array.isArray(value) || value.length !== 3) continue
      if (!value.every((n) => typeof n === 'number' && Number.isFinite(n))) continue
      next[name] = clampJoint(name, [value[0], value[1], value[2]])
    }
  
    return next
  }
  
  function sanitizeSaved(raw: unknown): SavedPose | null {
    if (!raw || typeof raw !== 'object') return null
    const entry = raw as Record<string, unknown>
    if (typeof entry.id !== 'string' || typeof entry.name !== 'string') return null
  
    const name = entry.name.trim()
    if (!name) return null
  
    return {
      id: entry.id,
      name,
      createdAt: typeof entry.createdAt === 'number' ? entry.createdAt : Date.now(),
      lift: typeof entry.lift === 'number' && Number.isFinite(entry.lift) ? entry.lift : 0,
      pose: sanitizePose(entry.pose),
      hands: buildHands(entry.hands as Partial<Record<HandId, Partial<HandPose>>> | undefined),
    }
  }
  
  export function readSavedPoses(): SavedPose[] {
    try {
      const raw = localStorage.getItem(SAVED_POSES_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return parsed.map(sanitizeSaved).filter((entry): entry is SavedPose => entry !== null)
    } catch {
      return []
    }
  }
  
  export function writeSavedPoses(entries: SavedPose[]) {
    localStorage.setItem(SAVED_POSES_KEY, JSON.stringify(entries))
  }
  
  export function makeSavedPose(name: string, snapshot: Snapshot, existing?: SavedPose): SavedPose {
    return {
      id: existing?.id ?? crypto.randomUUID(),
      name: name.trim(),
      createdAt: existing?.createdAt ?? Date.now(),
      lift: snapshot.lift,
      pose: sanitizePose(snapshot.pose),
      hands: buildHands(snapshot.hands),
    }
  }