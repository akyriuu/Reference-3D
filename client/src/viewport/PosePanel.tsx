import { PRESETS, SKELETON, type HandId, type HandPose, type JointName, type PresetName } from './skeleton'

type Props = {
  selected: JointName | null
  fineJoints: boolean
  onFineJoints: (value: boolean) => void
  hands: Record<HandId, HandPose>
  onHand: (id: HandId, patch: Partial<HandPose>) => void
  onApply: (name: PresetName) => void
  onReset: () => void
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
  selected,
  fineJoints,
  onFineJoints,
  hands,
  onHand,
  onApply,
  onReset,
}: Props) {
  return (
    <div className="pose-panel">
      <div className="pose-presets">
        {ORDER.map((name) => (
          <button key={name} onClick={() => onApply(name)}>
            {PRESETS[name].label}
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

      <p className="pose-status">
        {selected
          ? `${SKELETON[selected].label} · arraste ↕ / ↔`
          : fineJoints
            ? 'Clavícula, pulso, tornozelo e pescoço visíveis'
            : 'Clique numa esfera para posar · Juntas finas mostra o resto'}
      </p>
    </div>
  )
}