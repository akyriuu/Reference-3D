import type { Box, Stroke } from '../types'

export function paint(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  const { points, color, size, tool } = stroke
  if (points.length === 0) return

  ctx.save()
  ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (points.length === 1) {
    const [x, y] = points[0]
    ctx.beginPath()
    ctx.arc(x, y, size / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }

  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])

  // curvas quadráticas pelos pontos médios deixam o traço macio em vez de facetado
  for (let i = 1; i < points.length - 1; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[i + 1]
    ctx.quadraticCurveTo(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2)
  }

  const last = points[points.length - 1]
  ctx.lineTo(last[0], last[1])
  ctx.stroke()
  ctx.restore()
}

export function replay(ctx: CanvasRenderingContext2D, strokes: Stroke[], box: Box) {
  ctx.clearRect(0, 0, box.width, box.height)
  for (const stroke of strokes) paint(ctx, stroke)
}

export function toPng(strokes: Stroke[], box: Box, scale = 2): string {
  // os traços vão primeiro numa camada transparente: assim a borracha apaga
  // tinta em vez de furar o fundo branco
  const layer = document.createElement('canvas')
  layer.width = box.width * scale
  layer.height = box.height * scale
  const layerCtx = layer.getContext('2d')!
  layerCtx.scale(scale, scale)
  replay(layerCtx, strokes, box)

  const output = document.createElement('canvas')
  output.width = layer.width
  output.height = layer.height
  const outputCtx = output.getContext('2d')!
  outputCtx.fillStyle = '#ffffff'
  outputCtx.fillRect(0, 0, output.width, output.height)
  outputCtx.drawImage(layer, 0, 0)

  return output.toDataURL('image/png')
}