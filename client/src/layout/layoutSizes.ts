export const LAYOUT_SIZES_KEY = 'reference3d.layoutSizes.v1'

export const MIN_VIEWPORT = 360 // 3D navegavel ainda
export const MIN_DRAWING = 480 // Canva ainda desenhável
export const MIN_PANEL = 60
export const MIN_STAGE = 240 // 3D que o painel nunca pode cobrir
export const PANEL_INSET = 14 // igual ao bottom/left/right de .pose-panel

type LayoutSizes = { viewport: number; panel: number }

const isSize = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0

export function readLayoutSizes(): Partial<LayoutSizes> {
  try {
    const raw = localStorage.getItem(LAYOUT_SIZES_KEY)
    if (!raw) return {}

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}

    const { viewport, panel } = parsed as Record<keyof LayoutSizes, unknown>
    return {
      ...(isSize(viewport) ? { viewport } : {}),
      ...(isSize(panel) ? { panel } : {}),
    }
  } catch {
    return {}
  }
}

export function writeLayoutSizes(patch: Partial<LayoutSizes>) {
  try {
    localStorage.setItem(LAYOUT_SIZES_KEY, JSON.stringify({ ...readLayoutSizes(), ...patch }))
  } catch {
    // storage bloqueado: o layout segue funcionando só em memória
  }
}