import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Grid, OrbitControls } from '@react-three/drei'
import { Mannequin } from './Mannequin'
import { PosePanel } from './PosePanel'
import { usePose } from './usePose'

const GROUND = -0.92

export function Viewport() {
  const { pose, hands, lift, selected, rotate, setHand, select, apply, reset } = usePose()
  const [fineJoints, setFineJoints] = useState(false)

  return (
    <div className="viewport">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.55, 3.4], fov: 45 }}
        onPointerMissed={() => select(null)}
      >
        <color attach="background" args={['#14161b']} />

        <ambientLight intensity={0.55} />
        <directionalLight
          position={[3, 6, 3]}
          intensity={2.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-4, 2, -3]} intensity={0.55} color="#8fa7ff" />

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
          cellColor="#262b35"
          sectionColor="#39404f"
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
        selected={selected}
        fineJoints={fineJoints}
        onFineJoints={setFineJoints}
        hands={hands}
        onHand={setHand}
        onApply={apply}
        onReset={reset}
      />
    </div>
  )
}