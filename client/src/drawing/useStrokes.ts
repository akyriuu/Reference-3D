import { useCallback, useState } from 'react'
import type { Stroke } from '../types'

type History = {
  strokes: Stroke[]
  undone: Stroke[]
}

export function useStrokes() {
  const [history, setHistory] = useState<History>({ strokes: [], undone: [] })

  const add = useCallback((stroke: Stroke) => {
    setHistory((current) => ({ strokes: [...current.strokes, stroke], undone: [] }))
  }, [])

  const undo = useCallback(() => {
    setHistory((current) => {
      if (current.strokes.length === 0) return current
      const last = current.strokes[current.strokes.length - 1]
      return { strokes: current.strokes.slice(0, -1), undone: [...current.undone, last] }
    })
  }, [])

  const redo = useCallback(() => {
    setHistory((current) => {
      if (current.undone.length === 0) return current
      const last = current.undone[current.undone.length - 1]
      return { strokes: [...current.strokes, last], undone: current.undone.slice(0, -1) }
    })
  }, [])

  const clear = useCallback(() => {
    setHistory({ strokes: [], undone: [] })
  }, [])

  return {
    strokes: history.strokes,
    add,
    undo,
    redo,
    clear,
    canUndo: history.strokes.length > 0,
    canRedo: history.undone.length > 0,
  }
}