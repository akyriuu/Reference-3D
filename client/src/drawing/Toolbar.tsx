import type { Tool } from '../types'

type Props = {
  tool: Tool
  color: string
  size: number
  canUndo: boolean
  canRedo: boolean
  onToolChange: (tool: Tool) => void
  onColorChange: (color: string) => void
  onSizeChange: (size: number) => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onExport: () => void
}

const SWATCHES = ['#1b1b1f', '#6b6b76', '#b03a2e', '#1f6f8b', '#2e7d32']

export function Toolbar({
  tool,
  color,
  size,
  canUndo,
  canRedo,
  onToolChange,
  onColorChange,
  onSizeChange,
  onUndo,
  onRedo,
  onClear,
  onExport,
}: Props) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button
          className={tool === 'pen' ? 'is-active' : ''}
          onClick={() => onToolChange('pen')}
          title="Lápis"
        >
          Lápis
        </button>
        <button
          className={tool === 'eraser' ? 'is-active' : ''}
          onClick={() => onToolChange('eraser')}
          title="Borracha"
        >
          Borracha
        </button>
      </div>

      <div className="toolbar-group">
        {SWATCHES.map((swatch) => (
          <button
            key={swatch}
            className={`swatch ${color === swatch ? 'is-active' : ''}`}
            style={{ background: swatch }}
            onClick={() => {
              onColorChange(swatch)
              onToolChange('pen')
            }}
            title={swatch}
          />
        ))}
        <input
          type="color"
          className="color-input"
          value={color}
          onChange={(event) => onColorChange(event.target.value)}
          title="Cor personalizada"
        />
      </div>

      <label className="toolbar-group size">
        <span>{size}px</span>
        <input
          type="range"
          min={1}
          max={48}
          value={size}
          onChange={(event) => onSizeChange(Number(event.target.value))}
        />
      </label>

      <div className="toolbar-group">
        <button onClick={onUndo} disabled={!canUndo} title="Desfazer (Ctrl+Z)">
          Desfazer
        </button>
        <button onClick={onRedo} disabled={!canRedo} title="Refazer (Ctrl+Shift+Z)">
          Refazer
        </button>
        <button onClick={onClear} title="Limpar tudo">
          Limpar
        </button>
        <button className="is-primary" onClick={onExport} title="Baixar PNG">
          PNG
        </button>
      </div>
    </div>
  )
}