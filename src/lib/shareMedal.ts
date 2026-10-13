// Compartir una medalla: arma una imagen vertical (para el estado o el grupo de WhatsApp)
// con la medalla en grande, su nombre y quién la ganó, y la comparte o la descarga.

import { loadArt } from './art'
import { medalSvg, TIERS } from './medalArt'
import type { MedalFamily } from './medals'

const W = 1080
const H = 1350
const FONT = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
// Dentro de una imagen no llegan los estilos de la página: el contorno de las ilustraciones va en el SVG.
const OUTLINE_CSS = '<style>.m-ol{stroke:#2b1b12;stroke-width:2.6;stroke-linejoin:round;stroke-linecap:round}</style>'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo dibujar la medalla'))
    img.src = src
  })
}

/** Corta un texto en líneas que entren en `max` píxeles. */
function lines(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const out: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (line && ctx.measureText(next).width > max) {
      out.push(line)
      line = word
    } else line = next
  }
  if (line) out.push(line)
  return out
}

export async function medalImage(family: MedalFamily, level: number, who?: string): Promise<Blob> {
  const l = family.levels[level]
  const tier = TIERS[Math.min(level, TIERS.length - 1)]
  const accent = tier.main === 'grad' ? '#B197FC' : tier.main
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Fondo oscuro con un resplandor del color del nivel detrás de la medalla.
  ctx.fillStyle = '#0d1117'
  ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W / 2, 520, 40, W / 2, 520, 560)
  glow.addColorStop(0, accent + '66')
  glow.addColorStop(1, accent + '00')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)
  // Rayos.
  ctx.save()
  ctx.translate(W / 2, 520)
  ctx.fillStyle = accent + '22'
  for (let k = 0; k < 18; k++) {
    ctx.rotate((Math.PI * 2) / 18)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-40, -620)
    ctx.lineTo(40, -620)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
  // Abajo se apaga, para que el texto se lea limpio.
  const fade = ctx.createLinearGradient(0, 820, 0, 1000)
  fade.addColorStop(0, '#0d111700')
  fade.addColorStop(1, '#0d1117')
  ctx.fillStyle = fade
  ctx.fillRect(0, 820, W, H - 820)

  await loadArt()
  const svg = medalSvg(l.name, level, { face: l.face, glyph: l.glyph, color: l.color }).replace('<defs>', '<defs>' + OUTLINE_CSS)
  const img = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg))
  const size = 560
  ctx.drawImage(img, (W - size) / 2, 520 - size * (60 / 130) - 10, size, (size * 130) / 120)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  // Arriba: familia.
  ctx.fillStyle = '#9aa5b8'
  ctx.font = `800 34px ${FONT}`
  ctx.fillText(family.name.toUpperCase(), W / 2, 110)

  // Nivel, nombre y descripción.
  ctx.fillStyle = accent
  ctx.font = `800 32px ${FONT}`
  ctx.fillText(`${tier.name} · Nivel ${tier.roman}`.toUpperCase(), W / 2, 960)
  ctx.fillStyle = '#f0f3f8'
  ctx.font = `800 76px ${FONT}`
  ctx.fillText(l.name, W / 2, 1050, W - 120)
  ctx.fillStyle = '#9aa5b8'
  ctx.font = `400 38px ${FONT}`
  lines(ctx, l.description, W - 220)
    .slice(0, 3)
    .forEach((t, i) => ctx.fillText(t, W / 2, 1120 + i * 52))

  // Abajo: quién y la app.
  ctx.fillStyle = '#ffb400'
  ctx.font = `700 34px ${FONT}`
  ctx.fillText(who ? `${who} · Game Board` : 'Game Board', W / 2, H - 50)

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('No se pudo armar la imagen'))), 'image/png'))
}

/** Comparte la imagen de la medalla (menú de compartir del celular) o, si no se puede, la descarga. */
export async function shareMedal(family: MedalFamily, level: number, who?: string): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const l = family.levels[level]
  const blob = await medalImage(family, level, who)
  const name = `medalla-${l.name.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.png`
  const file = new File([blob], name, { type: 'image/png' })
  const text = who ? `${who} ganó la medalla "${l.name}" en Game Board 🏅` : `Medalla "${l.name}" en Game Board 🏅`
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: l.name, text })
      return 'shared'
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'cancelled'
      // Si falla por otra cosa, se descarga.
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return 'downloaded'
}
