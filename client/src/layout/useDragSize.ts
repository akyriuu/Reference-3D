import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
  } from 'react'
  
  type DragSizeOptions = {
    axis: 'x' | 'y'
    min: number
    max: (container: number) => number
    initial: number | (() => number)
    invert?: boolean // painel de baixo cresce arrastando pra cima
    inset?: number // recuo do painel em relação à borda do container
    onCommit?: (size: number) => void
  }
  
  export function useDragSize({
    axis,
    min,
    max,
    initial,
    invert = false,
    inset = 0,
    onCommit,
  }: DragSizeOptions) {
    const containerRef = useRef<HTMLDivElement>(null)
    const frameRef = useRef(0)
    const pendingRef = useRef(0)
    const expandedRef = useRef<number | null>(null)
  
    const [size, setSize] = useState<number>(initial)
    const [isDragging, setDragging] = useState(false)
  
    // espelhos: mantêm clamp/startDrag estáveis mesmo com callbacks inline no caller
    const sizeRef = useRef(size)
    const initialRef = useRef(size)
    const maxRef = useRef(max)
    const commitRef = useRef(onCommit)
    sizeRef.current = size
    maxRef.current = max
    commitRef.current = onCommit
  
    const clamp = useCallback(
      (value: number) => {
        const container = containerRef.current
        const available = container
          ? axis === 'x'
            ? container.clientWidth
            : container.clientHeight
          : 0
        const ceiling = Math.max(min, maxRef.current(available))
        return Math.round(Math.min(ceiling, Math.max(min, value)))
      },
      [axis, min],
    )
  
    // re-clampa quando a janela muda de tamanho, senão guardar pixel quebra o layout
    useLayoutEffect(() => {
      const container = containerRef.current
      if (!container) return
  
      const observer = new ResizeObserver(() => {
        setSize((current) => {
          const next = clamp(current)
          return next === current ? current : next
        })
      })
  
      observer.observe(container)
      return () => observer.disconnect()
    }, [clamp])
  
    const startDrag = useCallback(
      (event: ReactPointerEvent<HTMLElement>) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return
  
        const container = containerRef.current
        if (!container) return
  
        const handle = event.currentTarget
        const rect = container.getBoundingClientRect()
  
        pendingRef.current = sizeRef.current
        handle.setPointerCapture(event.pointerId)
        setDragging(true)
        document.body.dataset.resizing = axis
  
        const move = (moveEvent: PointerEvent) => {
          const distance =
            axis === 'x'
              ? moveEvent.clientX - rect.left + container.scrollLeft
              : moveEvent.clientY - rect.top + container.scrollTop
          const span = axis === 'x' ? rect.width : rect.height
  
          pendingRef.current = clamp(invert ? span - inset - distance : distance - inset)
  
          // sem o rAF, cada pointermove dispara o replay de todos os traços no DrawingPanel
          if (frameRef.current) return
          frameRef.current = requestAnimationFrame(() => {
            frameRef.current = 0
            setSize(pendingRef.current)
          })
        }
  
        const stop = () => {
          handle.removeEventListener('pointermove', move)
          handle.removeEventListener('pointerup', stop)
          handle.removeEventListener('pointercancel', stop)
  
          if (frameRef.current) {
            cancelAnimationFrame(frameRef.current)
            frameRef.current = 0
          }
  
          setSize(pendingRef.current)
          setDragging(false)
          delete document.body.dataset.resizing
          commitRef.current?.(pendingRef.current)
        }
  
        handle.addEventListener('pointermove', move)
        handle.addEventListener('pointerup', stop)
        handle.addEventListener('pointercancel', stop)
      },
      [axis, clamp, inset, invert],
    )
  
    const toggle = useCallback(() => {
      const current = sizeRef.current
      const isOpen = current > min
  
      if (isOpen) expandedRef.current = current
      const next = isOpen ? min : clamp(expandedRef.current ?? initialRef.current)
  
      setSize(next)
      commitRef.current?.(next)
    }, [clamp, min])
  
    return { size, isDragging, containerRef, startDrag, toggle }
  }