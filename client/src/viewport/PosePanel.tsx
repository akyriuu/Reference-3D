import { PRESETS, SKELETON, type JointName, type PresetName } from './skeleton'

type Props = {
  selected: JointName | null
  onApply: (name: PresetName) => void
  onReset: () => void
}

const ORDER: PresetName[] = ['repouso', 'tpose', 'contraposto', 'corrida', 'sentado']

export function PosePanel({ selected, onApply, onReset }: Props) {
  return (
    <div className="pose-panel">
      <div className="pose-presets">
        {ORDER.map((name) => (
          <button key={name} onClick={() => onApply(name)}>
            {PRESETS[name].label}
          </button>
        ))}
        <button onClick={onReset}>Zerar</button>
      </div>
      <p className="pose-status">
        {selected
          ? `${SKELETON[selected].label} · arraste ↕ dobra, ↔ gira`
          : 'Clique numa esfera para posar a articulação'}
      </p>
    </div>
  )
}