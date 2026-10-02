import type { ReactNode } from 'react'
import {
  MIN_DRAWING,
  MIN_VIEWPORT,
  readLayoutSizes,
  writeLayoutSizes,
} from './layoutSizes'
import { useDragSize } from './useDragSize'

type Props = {
  left: ReactNode
  right: ReactNode
}

const defaultViewport = () =>
  readLayoutSizes().viewport ?? Math.round(window.innerWidth * 0.55)

export function SplitPane({ left, right }: Props) {
  const { size, isDragging, containerRef, startDrag } = useDragSize({
    axis: 'x',
    min: MIN_VIEWPORT,
    // largura virtual: respeita os mínimos mesmo com a janela menor que a soma deles
    max: (container) => Math.max(container, MIN_VIEWPORT + MIN_DRAWING) - MIN_DRAWING,
    initial: defaultViewport,
    onCommit: (viewport) => writeLayoutSizes({ viewport }),
  })

  return (
    <div className="split" ref={containerRef}>
      <div className="split-pane" style={{ width: size }}>
        {left}
      </div>
      <div
        className={`split-divider${isDragging ? ' is-dragging' : ''}`}
        onPointerDown={startDrag}
        role="separator"
        aria-orientation="vertical"
      />
      <div className="split-pane is-grow" style={{ minWidth: MIN_DRAWING }}>
        {right}
      </div>
    </div>
  )
}