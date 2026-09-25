import { useCallback, useEffect, useState } from 'react'
import { SplitPane } from './layout/SplitPane'
import { Viewport } from './viewport/Viewport'
import { DrawingPanel } from './drawing/DrawingPanel'
import { Toolbar } from './drawing/Toolbar'
import { useStrokes } from './drawing/useStrokes'
import { toPng } from './drawing/paint'
import type { Box, Tool } from './types'

export default function App() {
  const { strokes, add, undo, redo, clear, canUndo, canRedo } = useStrokes()
  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState('#1b1b1f')
  const [size, setSize] = useState(4)
  const [box, setBox] = useState<Box>({ width: 0, height: 0 })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const shortcut = event.ctrlKey || event.metaKey
      if (!shortcut || event.key.toLowerCase() !== 'z') return
      event.preventDefault()
      if (event.shiftKey) redo()
      else undo()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo])

  const exportPng = useCallback(() => {
    if (box.width === 0 || box.height === 0) return
    const link = document.createElement('a')
    link.href = toPng(strokes, box)
    link.download = `estudo-${Date.now()}.png`
    link.click()
  }, [strokes, box])

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">
          reference<b>3d</b>
        </span>
        <span className="app-hint">arraste no 3D para girar · scroll para aproximar</span>
      </header>

      <SplitPane
        left={<Viewport />}
        right={
          <div className="drawing">
            <Toolbar
              tool={tool}
              color={color}
              size={size}
              canUndo={canUndo}
              canRedo={canRedo}
              onToolChange={setTool}
              onColorChange={setColor}
              onSizeChange={setSize}
              onUndo={undo}
              onRedo={redo}
              onClear={clear}
              onExport={exportPng}
            />
            <DrawingPanel
              strokes={strokes}
              tool={tool}
              color={color}
              size={size}
              onStrokeEnd={add}
              onResize={setBox}
            />
          </div>
        }
      />
    </div>
  )
}