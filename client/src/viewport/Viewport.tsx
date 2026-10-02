import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Grid, OrbitControls } from '@react-three/drei'
import {
  MIN_PANEL,
  MIN_STAGE,
  PANEL_INSET,
  readLayoutSizes,
  writeLayoutSizes,
} from '../layout/layoutSizes'
import { useDragSize } from '../layout/useDragSize'
import { Mannequin } from './Mannequin'
import { PosePanel } from './PosePanel'
import { usePose } from './usePose'
import { useSavedPoses } from './useSavedPoses'

const GROUND = -0.92

const defaultPanel = () => readLayoutSizes().panel ?? 220

export function Viewport() {
  const { pose, hands, lift, selected, rotate, setHand, select, apply, restore, reset } = usePose()
  const { entries, save, remove } = useSavedPoses()
  const [fineJoints, setFineJoints] = useState(false)

  const panel = useDragSize({
    axis: 'y',
    min: MIN_PANEL,
    max: (container) => Math.max(MIN_PANEL, container - MIN_STAGE),
    initial: defaultPanel,
    invert: true,
    inset: PANEL_INSET,
    onCommit: (height) => writeLayoutSizes({ panel: height }),
  })

  return (
    <div className="viewport" ref={panel.containerRef}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.55, 3.4], fov: 45 }}
        onPointerMissed={() => select(null)}
      >
        <color attach="background" args={['#000000']} />


        <ambientLight intensity={0.55} />
        <directionalLight
          position={[3, 6, 3]}
          intensity={2.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#ffffff" />


        <Mannequin
          pose={pose}
          lift={lift}
          selected={selected}
          onSelect={select}
          onRotate={rotate}
          fineJoints={fineJoints}
          hands={hands}
        />

        <ContactShadows position={[0, GROUND, 0]} opacity={0.45} blur={2.5} scale={6} far={2.5} />
        <Grid
          position={[0, GROUND, 0]}
          infiniteGrid
          fadeDistance={22}
          cellSize={0.25}
          sectionSize={1}
          cellColor="#1c1c1e"
          sectionColor="#3a3a3c"
        />

        <OrbitControls
          makeDefault
          target={[0, 0.05, 0]}
          enablePan={false}
          minDistance={1.6}
          maxDistance={8}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 1.9}
        />
      </Canvas>

      <PosePanel
        height={panel.size}
        isResizing={panel.isDragging}
        onResizeStart={panel.startDrag}
        onResizeToggle={panel.toggle}
        selected={selected}
        fineJoints={fineJoints}
        onFineJoints={setFineJoints}
        hands={hands}
        onHand={setHand}
        onApply={apply}
        onReset={reset}
        saved={entries}
        onSave={(name) => save(name, { pose, hands, lift })}
        onRestore={restore}
        onRemove={remove}
      />
    </div>
  )
}