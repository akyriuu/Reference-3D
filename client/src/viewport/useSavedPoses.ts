import { useCallback, useState } from 'react'
import {
  makeSavedPose,
  readSavedPoses,
  writeSavedPoses,
  type SavedPose,
} from './savedPoses'
import type { HandId, HandPose, Pose } from './skeleton'

type Snapshot = {
  pose: Pose
  hands: Record<HandId, HandPose>
  lift: number
}

export function useSavedPoses() {
  const [entries, setEntries] = useState<SavedPose[]>(readSavedPoses)

  const persist = useCallback((next: SavedPose[]) => {
    setEntries(next)
    writeSavedPoses(next)
  }, [])

  const save = useCallback((name: string, snapshot: Snapshot) => {
    const trimmed = name.trim()
    if (!trimmed) return null

    const existing = entries.find((entry) => entry.name.toLowerCase() === trimmed.toLowerCase())
    const saved = makeSavedPose(trimmed, snapshot, existing)

    persist(
      existing
        ? entries.map((entry) => (entry.id === existing.id ? saved : entry))
        : [saved, ...entries],
    )

    return saved
  }, [entries, persist])

  const remove = useCallback((id: string) => {
    persist(entries.filter((entry) => entry.id !== id))
  }, [entries, persist])

  return { entries, save, remove }
}