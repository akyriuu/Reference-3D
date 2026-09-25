import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { paint, replay } from './paint'
import type { Box, Point, Stroke, Tool } from '../types'

type Props = {
  strokes: Stroke[]
  color: string
  size: number
  tool: Tool
  onStrokeEnd: (stroke: Stroke) => void
  onResize: (box: Box) => void
}

const ratio = () => Math.min(window.devicePixelRatio || 1, 2)

export function DrawingPanel({ strokes, color, size, tool, onStrokeEnd, onResize }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cacheRef = useRef<HTMLCanvasElement | null>(null)
  const liveRef = useRef<Stroke | null>(null)
  const [box, setBox] = useState<Box>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width)
      const height = Math.round(entry.contentRect.height)
      setBox((current) =>
        current.width === width && current.height === height ? current : { width, height },
      )
    })

    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  useEffect(() => onResize(box), [box, onResize])

  // desenha o cache (traços já fechados) + o traço em andamento
  const compose = useCallback(() => {
    const canvas = canvasRef.current
    const cache = cacheRef.current
    if (!canvas || !cache || box.width === 0) return

    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, box.width, box.height)
    ctx.drawImage(cache, 0, 0, box.width, box.height)
    if (liveRef.current) paint(ctx, liveRef.current)
  }, [box])

  // o cache só é reconstruído em add/undo/redo/clear/resize, nunca a cada pointermove
  useEffect(() => {
    if (box.width === 0 || box.height === 0) return
    const dpr = ratio()

    const canvas = canvasRef.current!
    canvas.width = box.width * dpr
    canvas.height = box.height * dpr
    canvas.getContext('2d')!.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cache = cacheRef.current ?? document.createElement('canvas')
    cacheRef.current = cache
    cache.width = box.width * dpr
    cache.height = box.height * dpr
    const cacheCtx = cache.getContext('2d')!
    cacheCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    replay(cacheCtx, strokes, box)

    compose()
  }, [box, strokes, compose])

  const pointFrom = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect()
    return [event.clientX - rect.left, event.clientY - rect.top]
  }

  const handleDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    liveRef.current = { points: [pointFrom(event)], color, size, tool }
    compose()
  }

  const handleMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const live = liveRef.current
    if (!live) return
    live.points.push(pointFrom(event))
    compose()
  }

  const handleUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const live = liveRef.current
    liveRef.current = null
    if (!live) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    onStrokeEnd(live)
  }

  return (
    <div className="drawing-surface" ref={wrapperRef}>
      <canvas
        ref={canvasRef}
        className={`drawing-canvas is-${tool}`}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      />
    </div>
  )
}