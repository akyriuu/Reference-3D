import type { JointName } from './skeleton'

export type Vec3 = [number, number, number]

export type RigPart =
  | {
      kind: 'capsule'
      position: Vec3
      radius: number
      length: number
      rotation?: Vec3
      scale?: Vec3
    }
  | {
      kind: 'sphere'
      position: Vec3
      radius: number
      scale?: Vec3
    }
  | {
      kind: 'box'
      position: Vec3
      size: Vec3
    }

export type RigNode = {
  name: JointName
  pivot: Vec3
  handle: number
  handleAt?: Vec3
  parts: RigPart[]
  children: RigNode[]
  hand?: 1 | -1
}

export function localOf(point: Vec3, origin: Vec3): Vec3 {
  return [point[0] - origin[0], point[1] - origin[1], point[2] - origin[2]]
}

function arm(side: 1 | -1): RigNode {
  const x = 0.21 * side
  const clavX = 0.1 * side

  return {
    name: side === 1 ? 'clavicleR' : 'clavicleL',
    pivot: [clavX, 1.5, 0],
    handle: 0.035,
    handleAt: [0, 0.03, 0],
    parts: [{ kind: 'capsule', position: [0.155 * side, 1.5, 0], radius: 0.03, length: 0.08, rotation: [0, 0, Math.PI / 2] }],
    children: [
      {
        name: side === 1 ? 'shoulderR' : 'shoulderL',
        pivot: [x, 1.5, 0],
        handle: 0.055,
        parts: [{ kind: 'capsule', position: [x, 1.325, 0], radius: 0.065, length: 0.22 }],
        children: [
          {
            name: side === 1 ? 'elbowR' : 'elbowL',
            pivot: [x, 1.15, 0],
            handle: 0.045,
            parts: [{ kind: 'capsule', position: [x, 0.99, 0], radius: 0.055, length: 0.2 }],
            children: [
              {
                name: side === 1 ? 'wristR' : 'wristL',
                pivot: [x, 0.83, 0],
                handle: 0.035,
                parts: [],
                children: [],
                hand: side,
              },
            ],
          },
        ],
      },
    ],
  }
}

function leg(side: 1 | -1): RigNode {
  const x = 0.1 * side

  return {
    name: side === 1 ? 'hipR' : 'hipL',
    pivot: [x, 1.14, 0],
    handle: 0.05,
    handleAt: [0, -0.02, 0],
    parts: [{ kind: 'capsule', position: [x, 0.86, 0], radius: 0.09, length: 0.38 }],
    children: [
      {
        name: side === 1 ? 'kneeR' : 'kneeL',
        pivot: [x, 0.58, 0],
        handle: 0.05,
        parts: [{ kind: 'capsule', position: [x, 0.33, 0], radius: 0.07, length: 0.36 }],
        children: [
          {
            name: side === 1 ? 'ankleR' : 'ankleL',
            pivot: [x, 0.08, 0],
            handle: 0.04,
            parts: [{ kind: 'box', position: [x, 0.02, 0.05], size: [0.1, 0.07, 0.22] }],
            children: [],
          },
        ],
      },
    ],
  }
}

export const FIGURE_RIG: RigNode = {
  name: 'hips',
  pivot: [0, 1.14, 0],
  handle: 0.06,
  handleAt: [0, -0.08, 0],
  parts: [
    {
      kind: 'capsule',
      position: [0, 1.12, 0],
      radius: 0.13,
      length: 0.16,
      rotation: [0, 0, Math.PI / 2],
      scale: [1, 1, 0.75],
    },
  ],
  children: [
    leg(1),
    leg(-1),
    {
      name: 'spineLower',
      pivot: [0, 1.2, 0],
      handle: 0.05,
      parts: [{ kind: 'capsule', position: [0, 1.24, 0], radius: 0.13, length: 0.08, scale: [1, 1, 0.78] }],
      children: [
        {
          name: 'spineUpper',
          pivot: [0, 1.32, 0],
          handle: 0.045,
          parts: [{ kind: 'capsule', position: [0, 1.36, 0], radius: 0.15, length: 0.08, scale: [1, 1, 0.72] }],
          children: [
            {
              name: 'chest',
              pivot: [0, 1.44, 0],
              handle: 0.055,
              parts: [{ kind: 'capsule', position: [0, 1.5, 0], radius: 0.16, length: 0.08, scale: [1, 1, 0.68] }],
              children: [
                {
                  name: 'neck',
                  pivot: [0, 1.58, 0],
                  handle: 0.04,
                  parts: [{ kind: 'capsule', position: [0, 1.63, 0], radius: 0.05, length: 0.06 }],
                  children: [
                    {
                      name: 'head',
                      pivot: [0, 1.68, 0],
                      handle: 0.05,
                      parts: [{ kind: 'sphere', position: [0, 1.78, 0], radius: 0.125, scale: [1, 1.15, 1] }],
                      children: [],
                    },
                  ],
                },
                arm(1),
                arm(-1),
              ],
            },
          ],
        },
      ],
    },
  ],
}