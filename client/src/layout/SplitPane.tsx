import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
  left: ReactNode
  right: ReactNode
}

const MIN = 0.25
const MAX = 0.75

export function SplitPane({ left, right }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [ratio, setRatio] = useState(0.55)

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const container = containerRef.current
      if (!draggingRef.current || !container) return
      const rect = container.getBoundingClientRect()
      const next = (event.clientX - rect.left) / rect.width
      setRatio(Math.min(MAX, Math.max(MIN, next)))
    }

    const stop = () => {
      draggingRef.current = false
      document.body.classList.remove('is-resizing')
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [])

  const start = () => {
    draggingRef.current = true
    document.body.classList.add('is-resizing')
  }

  return (
    <div className="split" ref={containerRef}>
      <div className="split-pane" style={{ flexBasis: `${ratio * 100}%` }}>
        {left}
      </div>
      <div className="split-divider" onPointerDown={start} role="separator" aria-orientation="vertical" />
      <div className="split-pane">{right}</div>
    </div>
  )
}