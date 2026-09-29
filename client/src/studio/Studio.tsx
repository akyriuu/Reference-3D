import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { DrawingPanel } from '../drawing/DrawingPanel'
import { toPng } from '../drawing/paint'
import { Toolbar } from '../drawing/Toolbar'
import { useStrokes } from '../drawing/useStrokes'
import { SplitPane } from '../layout/SplitPane'
import type { Box, Tool } from '../types'
import { Viewport } from '../viewport/Viewport'

export function Studio() {
  const { user, logout } = useAuth()
  const { strokes, add, undo, redo, clear, canUndo, canRedo } = useStrokes()
  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState('#1b1b1f')
  const [size, setSize] = useState(4)
  const [box, setBox] = useState<Box>({ width: 0, height: 0 })

  const exportPng = useCallback(() => {
    if (box.width === 0) return
    const link = document.createElement('a')
    link.href = toPng(strokes, box)
    link.download = 'referencia.png'
    link.click()
  }, [strokes, box])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return
      if (event.key === 'z' && event.shiftKey) {
        event.preventDefault()
        redo()
        return
      }
      if (event.key === 'z') {
        event.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          reference<b>3d</b>
        </div>
        <p className="app-hint">arraste o divisor · clique um osso para rotacionar</p>
        <div className="app-user">
          {user?.avatar && <img src={user.avatar} alt="" referrerPolicy="no-referrer" />}
          <span>{user?.name}</span>
          <button type="button" onClick={() => void logout()}>
            Sair
          </button>
        </div>
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
              color={color}
              size={size}
              tool={tool}
              onStrokeEnd={add}
              onResize={setBox}
            />
          </div>
        }
      />
    </div>
  )
}