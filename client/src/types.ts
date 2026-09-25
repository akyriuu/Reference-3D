export type Tool = 'pen' | 'eraser'

export type Point = [number, number]

export type Stroke = {
  points: Point[]
  color: string
  size: number
  tool: Tool
}

export type Box = { width: number; height: number }