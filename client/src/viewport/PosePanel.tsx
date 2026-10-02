import { useState } from 'react'
import type { SavedPose } from './savedPoses'
import { PRESETS, SKELETON, type HandId, type HandPose, type JointName, type PresetName } from './skeleton'

type Props = {
  height: number
  isResizing: boolean
  onResizeStart: (event: React.PointerEvent<HTMLElement>) => void
  onResizeToggle: () => void
  selected: JointName | null
  fineJoints: boolean
  onFineJoints: (value: boolean) => void
  hands: Record<HandId, HandPose>
  onHand: (id: HandId, patch: Partial<HandPose>) => void
  onApply: (name: PresetName) => void
  onReset: () => void
  saved: SavedPose[]
  onSave: (name: string) => SavedPose | null
  onRestore: (saved: SavedPose) => void
  onRemove: (id: string) => void
}

const ORDER: PresetName[] = ['repouso', 'tpose', 'contraposto', 'corrida', 'sentado']

const HAND_LABEL: Record<HandId, string> = {
  handR: 'Mão dir.',
  handL: 'Mão esq.',
}

const SLIDERS: { key: keyof HandPose; label: string }[] = [
  { key: 'grip', label: 'Punho' },
  { key: 'spread', label: 'Abertura' },
  { key: 'thumb', label: 'Polegar' },
]

export function PosePanel({
  height,
  isResizing,
  onResizeStart,
  onResizeToggle,
  selected,
  fineJoints,
  onFineJoints,
  hands,
  onHand,
  onApply,
  onReset,
  saved,
  onSave,
  onRestore,
  onRemove,
}: Props) {
  const [name, setName] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const result = onSave(name)
    if (!result) {
      setNotice('Dê um nome à pose')
      return
    }
    setNotice(`Salva: ${result.name}`)
    setName('')
  }

  return (
    <div className={`pose-panel${isResizing ? ' is-resizing' : ''}`} style={{ height }}>
      <div
        className="pose-panel-handle"
        onPointerDown={onResizeStart}
        onDoubleClick={onResizeToggle}
        role="separator"
        aria-orientation="horizontal"
        title="Arraste para redimensionar · duplo clique para recolher"
      />

      <div className="pose-panel-body">
        <div className="pose-presets">
          {ORDER.map((preset) => (
            <button key={preset} onClick={() => onApply(preset)}>
              {PRESETS[preset].label}
            </button>
          ))}
          <button onClick={onReset}>Zerar</button>
          <button
            className={fineJoints ? 'is-active' : ''}
            onClick={() => onFineJoints(!fineJoints)}
          >
            Juntas finas
          </button>
        </div>

        <form className="pose-save" onSubmit={submit}>
          <input
            type="text"
            value={name}
            maxLength={48}
            placeholder="Nome da pose"
            onChange={(event) => {
              setName(event.target.value)
              setNotice(null)
            }}
          />
          <button type="submit">Salvar</button>
        </form>

        {saved.length > 0 && (
          <ul className="pose-saved">
            {saved.map((entry) => (
              <li key={entry.id}>
                <button className="pose-saved-name" onClick={() => onRestore(entry)}>
                  {entry.name}
                </button>
                <button className="pose-saved-remove" onClick={() => onRemove(entry.id)}>
                  Apagar
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="pose-hands">
          {(['handR', 'handL'] as HandId[]).map((id) => (
            <div key={id} className="pose-hand">
              <span>{HAND_LABEL[id]}</span>
              {SLIDERS.map(({ key, label }) => (
                <label key={key}>
                  {label}
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={hands[id][key]}
                    onChange={(event) => onHand(id, { [key]: Number(event.target.value) })}
                  />
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="pose-status">
        {notice
          ?? (selected
            ? `${SKELETON[selected].label} · arraste ↕ / ↔`
            : fineJoints
              ? 'Clavícula, pulso, tornozelo e pescoço visíveis'
              : 'Clique numa esfera para posar · Juntas finas mostra o resto')}
      </p>
    </div>
  )
}