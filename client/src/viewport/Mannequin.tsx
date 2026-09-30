import { Hand } from './Hand'
import { Joint, type PoseControls } from './Joint'
import { FIGURE_RIG, localOf, type RigNode, type RigPart, type Vec3 } from './rig'
import { SKELETON, type HandId, type HandPose } from './skeleton'

const SKIN = '#d2d2d7'
const ROOT: Vec3 = [0, 0, 0]

export type MannequinControls = PoseControls & {
  fineJoints: boolean
  hands: Record<HandId, HandPose>
}

function PartMesh({ part, origin }: { part: RigPart; origin: Vec3 }) {
  const position = localOf(part.position, origin)

  if (part.kind === 'capsule') {
    return (
      <mesh castShadow receiveShadow position={position} rotation={part.rotation} scale={part.scale}>
        <capsuleGeometry args={[part.radius, part.length, 6, 18]} />
        <meshStandardMaterial color={SKIN} roughness={0.62} metalness={0.05} />
      </mesh>
    )
  }

  if (part.kind === 'sphere') {
    return (
      <mesh castShadow receiveShadow position={position} scale={part.scale}>
        <sphereGeometry args={[part.radius, 28, 28]} />
        <meshStandardMaterial color={SKIN} roughness={0.62} metalness={0.05} />
      </mesh>
    )
  }

  return (
    <mesh castShadow receiveShadow position={position}>
      <boxGeometry args={part.size} />
      <meshStandardMaterial color={SKIN} roughness={0.62} />
    </mesh>
  )
}

function RigView({
  node,
  parent,
  fineJoints,
  hands,
  ...controls
}: MannequinControls & { node: RigNode; parent: Vec3 }) {
  const showHandle = SKELETON[node.name].tier === 'primary' || fineJoints
  const handId: HandId | null = node.hand === 1 ? 'handR' : node.hand === -1 ? 'handL' : null

  return (
    <Joint
      {...controls}
      name={node.name}
      position={localOf(node.pivot, parent)}
      handle={node.handle}
      handleAt={node.handleAt}
      showHandle={showHandle}
    >
      {node.parts.map((part, index) => (
        <PartMesh key={index} part={part} origin={node.pivot} />
      ))}
      {handId && node.hand && <Hand side={node.hand} pose={hands[handId]} />}
      {node.children.map((child) => (
        <RigView
          key={child.name}
          node={child}
          parent={node.pivot}
          fineJoints={fineJoints}
          hands={hands}
          {...controls}
        />
      ))}
    </Joint>
  )
}

type Props = MannequinControls & { lift: number }

export function Mannequin({ lift, ...controls }: Props) {
  return (
    <group position={[0, -0.92 + lift, 0]}>
      <RigView node={FIGURE_RIG} parent={ROOT} {...controls} />
    </group>
  )
}