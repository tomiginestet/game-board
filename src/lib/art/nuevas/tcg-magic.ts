// Magic: The Gathering. Juego principal: cada medalla es un objeto heroico con trabajo de grabado.
// Nada de la marca: ni los símbolos de maná, ni el dorso de las cartas, ni ilustraciones de cartas reales.
import { f } from '../helpers'
import { ellipse, flame, hair, kit, P, roundRect, sparkle, starPath, type Kit } from '../kit'

/** Sombrero de mago (cono doblado en la punta y ala), apoyado con el centro del ala en (0,0). */
function wizardHat(k: Kit) {
  const brim = 'M-12.4 .6C-12.4 -2.2 -6.4 -3.8 0 -3.8C6.4 -3.8 12.4 -2.2 12.4 .6C12.4 3.2 6.4 4.6 0 4.6C-6.4 4.6 -12.4 3.2 -12.4 .6Z'
  const cone = 'M-7.6 -1.4C-6.4 -8 -4 -15 -.6 -20.4C1.6 -24 5 -26.6 9.6 -26C11.6 -25.8 12.6 -24.6 12.4 -23.4C9.4 -24.2 6.6 -22.6 5.4 -19.4C4.4 -15 5.6 -7.6 7.6 -1.4C3 .2 -3 .2 -7.6 -1.4Z'
  const band = 'M-7.2 -3.6C-3 -2 3 -2 7.1 -3.6L7.6 -1.4C3 .2 -3 .2 -7.6 -1.4Z'
  return (
    k.draw([
      { d: brim, fill: P.red, inner: k.sh(brim, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + `<path d="M-11 .6C-6 2.6 6 2.6 11 .6" fill="none" stroke="${P.wine}" stroke-width=".45"/>` },
      {
        d: cone, fill: P.red,
        inner: k.sh('M1 -30H16V2H1Z', 0, 0, 1, 0, 0, 0.95, P.wine, 0.5) + `<path d="M-10 -30H-1V2H-10Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.45, 0)}"/>` +
          hair(-4.4, -6, -2.4, -12, -1.6, -18, 0.5, P.wine) + hair(2.4, -5, 1.6, -11, 2.6, -17, 0.45, P.wine),
      },
    ], 0.7) +
    k.draw([{ d: band, fill: P.gold, inner: k.sh(band, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) }], 0.35) +
    `<path d="${starPath(-.2, -2.4, 1.5, .6, 5)}" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
    `<path d="${starPath(-2.4, -10, 1.7, .7, 5)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>` +
    `<path d="${starPath(2.6, -15.4, 1.3, .55, 5)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>` +
    `<path d="${starPath(-.6, -18.6, .9, .4, 5)}" fill="${P.goldL}"/>` +
    `<circle cx="11.6" cy="-23.6" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
  )
}

/** Dragón de perfil hacia la izquierda: cabeza, cuello hacia abajo a la derecha y la boca abierta en (−20,4). */
function dragonHead(k: Kit) {
  const neck = 'M8 -10C22 -10 34 0 40 18C44 30 46 42 46 56H18C18 44 16 34 12 26C8 18 2 13 -4 11Z'
  const skull =
    'M15 -9C12 -13 6 -14.6 0 -13.6C-4 -13 -7 -11 -10 -9.4C-14 -8 -19 -7 -21.6 -4.6C-23.2 -3 -23 -.6 -21.4 .4' +
    'C-18 1.8 -10 2 -4 2.4C2 3 8 4 12 2C15.6 0 17 -5 15 -9Z'
  const jaw = 'M-4 2.6C-10 4.4 -16 7 -19.6 9.4C-21 10.4 -20.4 12.2 -18.6 12C-12 11.4 -4 10.6 2 10.4C8 10.2 12 8 12 4C8 3 2 2.4 -4 2.6Z'
  const mouth = 'M-21 .6C-14 1.8 -8 2.2 -2 2.8C-8 4 -14 6.6 -19 9.2C-18.6 6 -19.6 2.6 -21 .6Z'
  const horn1 = 'M8 -12C12 -17 18 -21 27 -22.6C22 -19.6 18 -15.6 15.4 -10.4Z'
  const horn2 = 'M4 -13C6 -18 9 -23 14 -27C12 -22 11 -18 10.6 -13Z'
  const crest = 'M14 -6C20 -8 26 -5 28 -1C24 -2 20 -1.6 17 0Z'
  const brow = 'M-10 -9.6C-6 -12.4 0 -13 4 -11.4C0 -10 -4 -9 -7 -7.8Z'
  const teethUp = Array.from({ length: 5 }, (_, i) => { const x = -19 + i * 3.4; return `M${f(x)} ${f(1 + i * 0.2)}L${f(x + 0.9)} ${f(3.4 + i * 0.1)}L${f(x + 1.8)} ${f(1.2 + i * 0.2)}Z` }).join('')
  const teethDn = Array.from({ length: 4 }, (_, i) => { const x = -17 + i * 3.6; return `M${f(x)} ${f(9.4 - i * 0.6)}L${f(x + 1)} ${f(7 - i * 0.6)}L${f(x + 2)} ${f(9 - i * 0.6)}Z` }).join('')
  const plates = Array.from({ length: 7 }, (_, i) => {
    const t = i / 6, y = 14 + t * 38, x0 = -2 + t * 21 + t * t * 4, x1 = x0 + 7 + t * 2
    return `<path d="M${f(x0)} ${f(y)}Q${f((x0 + x1) / 2)} ${f(y + 2.4)} ${f(x1)} ${f(y - 0.4)}" fill="none" stroke="${P.goldD}" stroke-width=".55"/>`
  }).join('')
  const scales = Array.from({ length: 16 }, (_, i) => {
    const r = Math.floor(i / 4), c = i % 4, x = 14 + c * 5.4 + r * 4.6, y = 2 + r * 9.4 + c * 2.4
    return `<path d="M${f(x)} ${f(y)}q1.6 2 3.4 0" fill="none" stroke="${P.wine}" stroke-width=".5" opacity=".85"/>`
  }).join('')
  const spikes = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5, x = 14 + t * 26 + t * t * 6, y = -10 + t * 30 + t * t * 14, a = -38 + t * 30, s = 1 - t * 0.35
    return `<path d="M0 0C1 -3 3.4 -5.6 6.4 -6.6C5 -4 4.6 -1.6 5 .6Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${f(s)})"/>`
  }).join('')
  return (
    `<g fill="${P.wine}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round">${spikes}</g>` +
    k.draw([
      {
        d: neck, fill: P.red,
        inner: k.sh(neck, 0, 0, 1, 0, 0, 0.95, P.wine, 0.5) + `<path d="M-6 8C2 14 8 30 14 58L20 58C14 32 8 18 0 8Z" fill="${P.goldL}"/>` +
          k.sh('M-6 8C2 14 8 30 14 58L20 58C14 32 8 18 0 8Z', 0, 0, 1, 0, 0.1, 0.8, P.goldD, 0.45) + plates + scales,
      },
      { d: jaw, fill: P.red, inner: k.sh(jaw, 0, 0, 0, 1, 0.1, 0.95, P.wine, 0.5) + hair(-14, 9.6, -6, 8.6, 4, 8.4, 0.45, P.wine) },
    ], 0.75) +
    `<path d="${mouth}" fill="${P.wine}"/><path d="${teethUp}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><path d="${teethDn}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` +
    k.draw([
      { d: horn2, fill: P.goldL, inner: k.sh(horn2, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
      { d: horn1, fill: P.white, inner: k.sh(horn1, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + hair(11, -14, 16, -17.4, 22, -20, 0.4, P.goldD) },
      { d: crest, fill: P.wine },
      {
        d: skull, fill: P.red,
        inner: k.sh(skull, 0, 0, 0, 1, 0.05, 0.95, P.wine, 0.5) + `<path d="M-24 -16H16V-6C6 -9 -10 -8 -24 -4Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.5, 0)}"/>` +
          hair(-19, -4.6, -14, -6, -9, -6, 0.4, P.wine) + hair(2, -1, 7, -1, 11, -4, 0.45, P.wine) + hair(6, -11, 10, -10, 13, -7, 0.4, P.wine),
      },
    ], 0.75) +
    k.draw([{ d: brow, fill: P.wine }], 0.3) +
    `<path d="M-19.6 -4.4c.6 -.8 1.8 -1 2.4 -.4" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
    `<ellipse cx="-3" cy="-6.4" rx="2.6" ry="1.7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55" transform="rotate(-12 -3 -6.4)"/><path d="M-3 -7.9V-4.9" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/><circle cx="-4.1" cy="-7" r=".45" fill="#fff"/>`
  )
}

/** Pétalo de loto en punta, con la base en (0,0) y la punta hacia arriba. */
const PETAL = (w: number, h: number) => `M0 0C${f(-w)} ${f(-h * 0.2)} ${f(-w * 0.9)} ${f(-h * 0.7)} 0 ${f(-h)}C${f(w * 0.9)} ${f(-h * 0.7)} ${w} ${f(-h * 0.2)} 0 0Z`

/** Loto negro: tres coronas de pétalos color noche con el filo dorado y la cápsula de semillas en el centro. */
function lotus(k: Kit) {
  const petal = (a: number, w: number, h: number, sh = 1) => {
    const d = PETAL(w, h)
    return `<g transform="rotate(${a})">` +
      k.draw([{
        d, fill: P.night,
        inner:
          `<path d="${d}" fill="${k.lin(P.mid, 0, 0, 0, 1, 0.95, 0)}"/>` + k.sh(d, 0, 1, 0, 0, 0, 0.9 * sh, '#0F1736', 0.5) +
          k.sh(`M0 0H${w}V${-h}H0Z`, 0, 0, 1, 0, 0, 0.55, '#0F1736', 0.4) +
          `<path d="${d}" fill="none" stroke="${P.gold}" stroke-width=".7" transform="scale(.9) translate(0 ${f(-h * 0.04)})"/>` +
          hair(0, -2, -0.6, -h * 0.5, 0, -h * 0.9, 0.55, P.goldL) + hair(-w * 0.3, -h * 0.12, -w * 0.5, -h * 0.4, -w * 0.25, -h * 0.72, 0.4, P.gold, 0.8) +
          hair(w * 0.3, -h * 0.12, w * 0.5, -h * 0.4, w * 0.25, -h * 0.72, 0.4, P.gold, 0.8),
      }], 0.6) +
      `<circle cx="0" cy="${f(-h * 0.97)}" r=".7" fill="${P.goldL}"/></g>`
  }
  const pod = 'M-7.6 -4C-7.6 -7 -4 -8.6 0 -8.6C4 -8.6 7.6 -7 7.6 -4C7.6 -1.6 4 0 0 0C-4 0 -7.6 -1.6 -7.6 -4Z'
  const seeds = [[-4.2, -5.6], [0, -6.6], [4.2, -5.6], [-2.2, -3.2], [2.2, -3.2], [-5.4, -3.4], [5.4, -3.4], [0, -2]]
  const stamens = Array.from({ length: 13 }, (_, i) => {
    const a = (-170 + i * (160 / 12)) * Math.PI / 180, x1 = Math.cos(a) * 11, y1 = -3 + Math.sin(a) * 9
    return `<path d="M${f(Math.cos(a) * 6)} ${f(-3 + Math.sin(a) * 4)}L${f(x1)} ${f(y1)}" stroke="${P.goldD}" stroke-width=".55"/><circle cx="${f(x1)}" cy="${f(y1)}" r=".85" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>`
  }).join('')
  return (
    petal(-78, 8, 26, 0.8) + petal(78, 8, 26, 0.8) + petal(-52, 9, 32, 0.8) + petal(52, 9, 32, 0.8) + petal(-26, 9.6, 36) + petal(26, 9.6, 36) + petal(0, 10, 38) +
    stamens +
    `<g transform="translate(0 2)">` + k.draw([{ d: pod, fill: P.gold, inner: k.sh(pod, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.45) +
    seeds.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".3"/><circle cx="${f(x - 0.3)}" cy="${f(y - 0.3)}" r=".3" fill="${P.goldL}"/>`).join('') + `</g>` +
    petal(-110, 7.4, 20, 0.7) + petal(110, 7.4, 20, 0.7) + petal(-140, 6.6, 15, 0.6) + petal(140, 6.6, 15, 0.6)
  )
}

/** Engranaje: dientes trapezoidales alrededor de (cx,cy) y, si hay `holes`, ventanas entre rayos (giradas al revés
 * para que la regla nonzero las deje huecas). */
function gearPath(cx: number, cy: number, R: number, n: number, phase: number, h: number, holes?: { r1: number; r2: number; count: number; spoke: number }) {
  const step = (Math.PI * 2) / n, hp = step / 2, Rr = R - h / 2, Rt = R + h / 2
  const pt = (a: number, r: number) => `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const t = phase + i * step
    pts.push(pt(t - hp * 0.62, Rr), pt(t - hp * 0.3, Rt), pt(t + hp * 0.3, Rt), pt(t + hp * 0.62, Rr), pt(t + hp, Rr))
  }
  let d = `M${pts.join('L')}Z`
  if (holes) {
    const span = (Math.PI * 2) / holes.count
    for (let j = 0; j < holes.count; j++) {
      const a0 = phase + j * span + holes.spoke / 2, a1 = a0 + span - holes.spoke, N = 10
      const o: string[] = [], inn: string[] = []
      for (let q = 0; q <= N; q++) { o.push(pt(a1 - ((a1 - a0) * q) / N, holes.r2)); inn.push(pt(a0 + ((a1 - a0) * q) / N, holes.r1)) }
      d += `M${o.join('L')}L${inn.join('L')}Z`
    }
  }
  return d
}

/** Rubí de reloj engarzado en un chatón dorado. */
const jewel = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${f(r * 1.7)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${x}" cy="${y}" r="${f(r * 1.7)}" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1" stroke-linecap="round" transform="scale(.82) translate(${f(x / 0.82 - x)} ${f(y / 0.82 - y)})"/>` +
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${x}" cy="${y}" r="${f(r * 0.5)}" fill="${P.wine}"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.28)}" fill="#fff"/>`

/** Dorso de carta propio (no el de la marca): azul noche, filete dorado y un rosetón en el centro. Base en (0,0). */
function cardBack(k: Kit, w: number, h: number, edge = 1.4) {
  const d = roundRect(-w / 2, -h, w / 2, 0, 1.2)
  const side = `M${f(w / 2)} ${f(-h + 1)}L${f(w / 2 + edge)} ${f(-h + 1.8)}V${f(-0.6)}L${f(w / 2)} 0Z`
  return (
    k.draw([{ d: side, fill: P.white, inner: `<path d="M${f(w / 2)} ${-h}h3v${h}h-3Z" fill="${P.sky}" opacity=".6"/>` }, {
      d, fill: P.night,
      inner: `<path d="${d}" fill="${k.lin(P.mid, 0, 0, 1, 1, 0.9, 0)}"/>` + k.sh(d, 0, 0, 1, 1, 0, 0.7, '#0F1736', 0.4) +
        `<path d="${roundRect(-w / 2 + 1.4, -h + 1.4, w / 2 - 1.4, -1.4, 0.6)}" fill="none" stroke="${P.gold}" stroke-width=".5"/>` +
        `<path d="${roundRect(-w / 2 + 2.3, -h + 2.3, w / 2 - 2.3, -2.3, 0.4)}" fill="none" stroke="${P.goldD}" stroke-width=".3" stroke-dasharray=".8 .6"/>` +
        `<path d="${starPath(0, -h / 2, w * 0.3, w * 0.12, 8)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".25"/><circle cx="0" cy="${f(-h / 2)}" r="${f(w * 0.08)}" fill="${P.red}"/>` +
        `<path d="M${f(-w * 0.18)} ${f(-h * 0.2)}Q0 ${f(-h * 0.28)} ${f(w * 0.18)} ${f(-h * 0.2)}M${f(-w * 0.18)} ${f(-h * 0.8)}Q0 ${f(-h * 0.72)} ${f(w * 0.18)} ${f(-h * 0.8)}" fill="none" stroke="${P.gold}" stroke-width=".4"/>`,
    }], 0.5)
  )
}

/** Carta de isla (todas iguales): marco celeste, ventana con mar, islote y palmera, y renglones de texto. Base en (0,0). */
function islandCard(k: Kit) {
  const d = roundRect(-10, -31, 10, 0, 1.6)
  const win = 'M-7.4 -27.6H7.4V-13.6H-7.4Z'
  return (
    k.draw([{ d, fill: P.white, inner: k.sh('M2 -32H11V1H2Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) }], 0.5) +
    `<path d="${roundRect(-8.6, -29.4, 8.6, -1.6, 0.8)}" fill="none" stroke="${P.blue}" stroke-width=".6"/>` +
    k.clip(win, `<path d="${win}" fill="${P.sky1}"/><path d="M-8 -19H8V-13H-8Z" fill="${P.sky}"/>` +
      `<path d="M-6 -18.6C-4 -21.4 2 -21.6 4.6 -18.6Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<path d="M-.6 -20.6C-.6 -23 0 -24.6 1 -25.6" fill="none" stroke="${P.brownD}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="M1 -25.6C-1.4 -26.6 -3.4 -26 -4.2 -24.4M1 -25.6C3.4 -26.8 5.4 -26 6 -24.2M1 -25.6C.4 -27.8 -1.4 -28.6 -2.6 -28.2M1 -25.6C2.4 -27.6 4.4 -28 5 -27.4" fill="none" stroke="${P.greenD}" stroke-width="1" stroke-linecap="round"/>` +
      `<path d="M-7 -16.6q1 -.6 2 0t2 0M2 -15.4q1 -.6 2 0t2 0" fill="none" stroke="#fff" stroke-width=".4"/>`) +
    `<path d="${win}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
    `<path d="M-6.6 -10.6H6.6M-6.6 -8.2H6.6M-6.6 -5.8H3" stroke="${P.sky}" stroke-width=".7"/>`
  )
}

/** Corona dorada de tres puntas con perlas y una piedra roja. Base en (0,0). */
function crown(k: Kit) {
  const d = 'M-9 0L-10.4 -12L-4.6 -6.4L0 -14.6L4.6 -6.4L10.4 -12L9 0Z'
  return (
    k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-9.4 -3.4H9.4V0H-9.4Z" fill="${P.goldD}" opacity=".5"/><path d="M-9.4 -3.4H9.4" stroke="${P.ink}" stroke-width=".35"/>` }], 0.55) +
    `<circle cx="-10.4" cy="-12.6" r="1.2" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="0" cy="-15.4" r="1.3" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="10.4" cy="-12.6" r="1.2" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
    `<circle cx="0" cy="-6.4" r="1.7" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/><circle cx="-.5" cy="-6.9" r=".45" fill="#fff"/>` +
    `<circle cx="-5" cy="-1.7" r=".7" fill="${P.goldL}"/><circle cx="5" cy="-1.7" r=".7" fill="${P.goldL}"/>`
  )
}

/** Polilla de alas grises con manchas, centrada en (0,0) y vista desde arriba. */
function moth(k: Kit) {
  const wf = 'M0 -1C-3 -5 -9 -7 -11 -4C-12 -1 -8 1.6 0 1Z'
  const wb = 'M0 .6C-3 1 -7 3 -7.4 6C-7.2 8 -4 7.6 0 2.4Z'
  const wing = (sx: number) =>
    `<g transform="scale(${sx} 1)">` + k.draw([
      { d: wb, fill: '#CBB89C', inner: k.sh(wb, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.4) + `<circle cx="-4.4" cy="4.4" r="1" fill="${P.brownD}" opacity=".6"/>` },
      { d: wf, fill: '#E2D5BE', inner: k.sh(wf, 0, 0, 1, 1, 0.1, 0.8, P.brown, 0.4) + `<circle cx="-7.4" cy="-3.2" r="1.4" fill="none" stroke="${P.brownD}" stroke-width=".5"/><circle cx="-7.4" cy="-3.2" r=".5" fill="${P.brownD}"/>` + hair(-1, -.6, -5, -3, -10, -4, 0.35, P.brownD) + `<path d="M-10.6 -3.6L-11.6 -2.4M-9.6 -5.4L-10.8 -4.6" stroke="${P.brownD}" stroke-width=".35"/>` },
    ], 0.4) + `</g>`
  return (
    wing(1) + wing(-1) +
    `<ellipse cx="0" cy="1.2" rx="1.2" ry="4" fill="${P.brownD}" stroke="${P.ink}" stroke-width=".4"/>` +
    `<path d="M-.4 -2.6C-1.4 -5 -2.8 -6 -4 -6.2M.4 -2.6C1.4 -5 2.8 -6 4 -6.2" fill="none" stroke="${P.ink}" stroke-width=".4" stroke-linecap="round"/>`
  )
}

export const TCG_MAGIC_NUEVAS_ART: Record<string, (u: number) => string> = {
  // Bajaste una Montaña y ya te sentís mago: la montaña con el sombrero puesto.
  'Tierra básica': (u) => {
    const k = kit(u)
    const back = 'M6 104L26 70L32 74L40 62L50 80L58 104Z'
    const mount = 'M14 104L32 80L37 82L45 68L50 70L55.4 57.6L59 54.6H64.4L68 58.4L72 57L81 70L85 68L106 104Z'
    const lit = 'M14 104L32 80L37 82L45 68L50 70L55.4 57.6L59 54.6H62L60.6 64L57 72L59 82L53 93L55 104Z'
    const snow = 'M50.4 67L55.4 57.6L68 58.4L72 57L76.6 64L73.2 62.8L70.6 66L67.6 62.8L64.6 67L61.6 63L58.4 67.6L55 64Z'
    return (
      k.day() +
      k.sun(61, 46, 13, 44) +
      k.shade(ellipse(61, 46, 20, 20), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.draw([{ d: back, fill: P.sky1, inner: k.sh(back, 0, 0, 1, 0, 0, 0.7, P.sky2, 0.4) + hair(40, 66, 38, 76, 32, 86, 0.4, P.blue) }], 0.5) +
      k.draw([{
        d: mount, fill: P.blue,
        inner:
          `<path d="${lit}" fill="${P.sky}"/>` + k.sh(lit, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) + k.sh(mount, 0, 0, 0, 1, 0.1, 0.8, P.mid, 0.4) +
          `<path d="${snow}" fill="${P.white}"/>` + k.sh('M62 54H80V70H62Z', 0, 0, 1, 0, 0, 0.7, P.sky2, 0.5) +
          hair(62, 58, 61, 62, 57.6, 70, 0.55, P.mid) + hair(57.6, 70, 59.4, 76, 58.4, 84, 0.6, P.mid) + hair(58.4, 84, 53, 92, 55, 104, 0.6, P.mid) +
          hair(36, 92, 42, 90, 48, 91, 0.4, P.blue) + hair(40, 84, 44, 82, 48, 83, 0.35, P.blue) + hair(46, 76, 50, 74, 53, 75, 0.35, P.blue) + hair(64, 84, 70, 82, 76, 84, 0.4, P.night, 0.7) + hair(70, 94, 78, 92, 86, 94, 0.4, P.night, 0.7) + hair(72, 72, 76, 70, 79, 72, 0.35, P.night, 0.7) +
          hair(45, 68, 42, 76, 38, 88, 0.45, P.blue) + hair(37, 82, 34, 90, 28, 98, 0.4, P.blue) + hair(72, 57, 71, 66, 67, 76, 0.45, P.mid) +
          hair(81, 70, 79, 80, 73, 92, 0.45, P.mid) + hair(66, 72, 70, 80, 70, 92, 0.4, P.mid, 0.8) + hair(44, 88, 48, 94, 46, 102, 0.4, P.blue),
      }], 0.75) +
      `<g transform="translate(61.6 57) rotate(-6)">` + k.cast(['M-12.4 .6C-12.4 -2.2 -6.4 -3.8 0 -3.8C6.4 -3.8 12.4 -2.2 12.4 .6C12.4 3.2 6.4 4.6 0 4.6C-6.4 4.6 -12.4 3.2 -12.4 .6Z'], 1.2, 2, P.mid) + wizardHat(k) + `</g>` +
      sparkle(84, 30, 2.6) + sparkle(40, 36, 2) + sparkle(78, 22, 1.4) +
      k.defs()
    )
  },

  // Quince victorias: el dragón rojo vuela sobre la mesa escupiendo fuego.
  'Dragón Shivano': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(56, 50, 14, 46) +
      `<g transform="translate(69 52) scale(.94)">` + dragonHead(k) + `</g>` +
      flame(k, 'translate(50.4 56.6) rotate(74) scale(.36) translate(-60 -18)') +
      hair(30, 80, 26, 84, 24, 90, 0.5, P.goldD) + hair(36, 84, 34, 88, 34, 93, 0.4, P.goldD) +
      sparkle(26, 72, 1.8) + sparkle(30, 26, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Cuarenta partidas: valés más que un departamento en Palermo. El loto negro, en su gloria.
  'Black Lotus': (u) => {
    const k = kit(u)
    const pad = 'M24 86C24 80 40 76 60 76C80 76 96 80 96 86C96 92 80 96 60 96C40 96 24 92 24 86Z'
    return (
      k.day() +
      k.sun(60, 58, 16, 48) +
      k.shade(ellipse(60, 56, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      k.draw([{ d: pad, fill: P.sky1, inner: k.sh(pad, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) }], 0.5) +
      `<path d="M30 86C40 90 80 90 90 86M36 91C46 93.6 74 93.6 84 91" fill="none" stroke="${P.blue}" stroke-width=".5" stroke-dasharray="3 1.6"/>` +
      k.floor(60, 84, 22, 4.6, P.mid) +
      `<g transform="translate(60 84) scale(1.08)">` + lotus(k) + `</g>` +
      `<path d="${starPath(60, 21, 3.4, 1.2, 4)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="${starPath(47.4, 26, 2.4, .9, 4)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="${starPath(72.6, 26, 2.4, .9, 4)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` +
      sparkle(32, 50, 2) + sparkle(88, 46, 1.6) +
      k.defs()
    )
  },

  // Primer combo: lo explicaste diez minutos y al final era cierto. La serpiente que se muerde la cola.
  'Bucle': (u) => {
    const k = kit(u)
    const cx = 60, cy = 58, R = 23, a0 = (-118 * Math.PI) / 180, gap = 0.44, N = 72
    const at = (t: number) => a0 + t * (Math.PI * 2 - gap)
    const half = (t: number) => 4 * Math.pow(1 - t, 0.75) + 0.45
    const ring = (r: (t: number) => number) => Array.from({ length: N + 1 }, (_, i) => { const t = i / N, a = at(t), rr = r(t); return `${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}` })
    const out = ring((t) => R + half(t)), inn = ring((t) => R - half(t))
    const body = `M${out.join('L')}L${inn.reverse().join('L')}Z`
    const belly = `M${ring((t) => R - half(t) * 0.25).join('L')}L${ring((t) => R - half(t) - 1).reverse().join('L')}Z`
    const scales = Array.from({ length: 30 }, (_, i) => {
      const t = 0.03 + i * 0.031, a = at(t), w = half(t), back = -Math.min(w * 0.9, 2.2) / R
      const p = (r: number, da: number) => `${f(cx + Math.cos(a + da) * r)} ${f(cy + Math.sin(a + da) * r)}`
      return `M${p(R + w * 0.85, back)}Q${p(R + w * 0.2, 0)} ${p(R - w * 0.15, back * 0.2)}`
    }).join('')
    const ph = { x: cx + Math.cos(a0) * R, y: cy + Math.sin(a0) * R, r: (a0 * 180) / Math.PI + 90 }
    const head = 'M2.4 -4.4C-2.6 -6.6 -9 -6.6 -13.2 -4.4C-15.6 -3 -16.6 -1.4 -15.8 -.4L-7.4 .8L-15.6 2.8C-14.6 4.8 -10 6 -6 5.8C-2 5.6 1 5 2.4 4.4Z'
    return (
      k.day() +
      k.sun(cx, cy, 7, 18.4, 24) +
      k.cast([body], 2, 2.2) +
      k.draw([{ d: body, fill: P.green, inner: k.sh(body, 0, 0, 1, 1, 0, 0.9, P.greenD, 0.45) + `<path d="${belly}" fill="${P.goldL}"/>` + k.sh(belly, 0, 0, 1, 1, 0, 0.7, P.goldD, 0.4) + `<path d="${scales}" fill="none" stroke="${P.greenD}" stroke-width=".55" stroke-linecap="round"/>` }], 0.7) +
      `<g transform="translate(${f(ph.x)} ${f(ph.y)}) rotate(${f(ph.r)})">` +
      k.draw([{
        d: head, fill: P.green,
        inner: k.sh(head, 0, 0, 0, 1, 0, 0.9, P.greenD, 0.45) + `<path d="M-16 -8H3V-3C-4 -4.6 -10 -4 -16 -2Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.5, 0)}"/>` +
          `<path d="M-14.4 3.4C-10 4.6 -4 4.6 2 3.4V7H-14Z" fill="${P.goldL}"/>` + hair(-12, -3.6, -6, -5.2, 1, -3.6, 0.45, P.greenD),
      }], 0.6) +
      `<path d="M-13.6 -.2L-12.8 1.8L-12 -.1Z" fill="#fff" stroke="${P.ink}" stroke-width=".25"/>` +
      `<ellipse cx="-8.4" cy="-2.8" rx="1.9" ry="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M-8.4 -4V-1.6" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/><circle cx="-9" cy="-3.3" r=".35" fill="#fff"/>` +
      `<path d="M-11 -4.6C-9.4 -5.8 -7 -5.8 -6 -4.6" fill="none" stroke="${P.greenD}" stroke-width=".6" stroke-linecap="round"/><circle cx="-14.4" cy="-2.6" r=".4" fill="${P.ink}"/>` +
      `</g>` +
      sparkle(88, 30, 2.2) + sparkle(30, 84, 1.8) + sparkle(92, 78, 1.4) +
      k.defs()
    )
  },

  // Cinco combos: las piezas encastran como relojería suiza. Dos engranajes con rubíes sobre la platina rayada.
  'Engranaje perfecto': (u) => {
    const k = kit(u)
    const n1 = 14, R1 = 21.6, n2 = 8, p = (2 * Math.PI * R1) / n1, R2 = (n2 * p) / (2 * Math.PI), al = (-48 * Math.PI) / 180
    const c1 = { x: 49, y: 66 }, c2 = { x: c1.x + Math.cos(al) * (R1 + R2), y: c1.y + Math.sin(al) * (R1 + R2) }
    const big = gearPath(c1.x, c1.y, R1, n1, al, 4, { r1: 6.4, r2: R1 - 5.4, count: 5, spoke: 0.62 })
    const small = gearPath(c2.x, c2.y, R2, n2, al + Math.PI + Math.PI / n2, 4, { r1: 4, r2: R2 - 4.8, count: 4, spoke: 0.9 })
    const plate = ellipse(60, 60, 40, 40)
    const stripes = Array.from({ length: 9 }, (_, i) => `<path d="M${-10 + i * 16} 0L${10 + i * 16} 0L${-30 + i * 16} 130L${-50 + i * 16} 130Z" fill="${P.sky2}" opacity=".5"/>`).join('')
    const screw = (x: number, y: number, r: number) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.mid}" stroke="${P.ink}" stroke-width=".45"/><path d="M${f(x - r * 0.7)} ${f(y + r * 0.3)}L${f(x + r * 0.7)} ${f(y - r * 0.3)}" stroke="${P.night}" stroke-width=".7"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.4)}" r="${f(r * 0.25)}" fill="${P.sky}"/>`
    const teethShine = (cx: number, cy: number, r: number) => `<path d="M${f(cx - r * 0.95)} ${f(cy - r * 0.2)}A${r} ${r} 0 0 1 ${f(cx - r * 0.2)} ${f(cy - r * 0.95)}" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".8"/>`
    return (
      `<rect width="120" height="130" fill="${P.sky1}"/>` + k.clip(plate, stripes) + k.shade('M0 0H120V130H0Z', k.rad(P.sky2, 0.5, 0.46, 0.7, 0, 1), '#9EB1DB', 0.5) +
      `<circle cx="60" cy="60" r="38" fill="none" stroke="${P.blue}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      screw(30, 40, 2.2) + screw(88, 76, 2.2) + screw(74, 92, 1.8) +
      k.cast([big, small], 2.4, 2.4, P.mid) +
      k.draw([{
        d: big, fill: P.gold,
        inner: k.sh(big, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<circle cx="${c1.x}" cy="${c1.y}" r="${f(R1 - 4.2)}" fill="none" stroke="${P.goldD}" stroke-width=".5"/><circle cx="${c1.x}" cy="${c1.y}" r="${f(R1 - 6)}" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` +
          `<circle cx="${c1.x}" cy="${c1.y}" r="7.4" fill="none" stroke="${P.goldD}" stroke-width=".45"/>` + teethShine(c1.x, c1.y, R1 - 1.4),
      }, {
        d: small, fill: P.sky1,
        inner: k.sh(small, 0, 0, 1, 1, 0, 0.95, P.blue, 0.5) + `<circle cx="${f(c2.x)}" cy="${f(c2.y)}" r="${f(R2 - 4)}" fill="none" stroke="${P.blue}" stroke-width=".5"/>` + teethShine(c2.x, c2.y, R2 - 1.2),
      }], 0.7) +
      jewel(c1.x, c1.y, 2.4) + jewel(f(c2.x), f(c2.y), 1.7) +
      hair(16, 64, 18, 48, 28, 38, 0.7, P.mid) + `<path d="M26.6 36.4L29.6 37.6L27.6 40Z" fill="${P.mid}"/>` +
      hair(96, 36, 96, 24, 88, 18, 0.6, P.mid) + `<path d="M89.6 16.6L86.4 18L89 20Z" fill="${P.mid}"/>` +
      sparkle(f(c1.x + Math.cos(al) * R1), f(c1.y + Math.sin(al) * R1), 4, '#fff') +
      k.defs()
    )
  },

  // Quince combos: una carta mueve a la otra y al final se cae la corona del rival.
  'Máquina de Rube Goldberg': (u) => {
    const k = kit(u)
    const W = 12, H = 27, base = 86
    const cards: [number, number][] = [[33, 58], [49, 40], [65, 20], [81, 7]]
    return (
      k.day() +
      k.sun(60, 54, 15, 46) +
      `<path d="M14 ${base}H106" stroke="${P.blue}" stroke-width=".6" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      k.floor(60, base + 1, 34, 3, P.mid) +
      cards.map(([x, a]) => `<g transform="translate(${x - W / 2} ${base}) rotate(${a} ${W / 2} 0)">${cardBack(k, W, H)}</g>`).join('') +
      hair(30, 50, 38, 40, 48, 40, 0.6, P.mid) + hair(48, 44, 56, 36, 64, 38, 0.6, P.mid) + hair(64, 48, 70, 40, 78, 42, 0.5, P.mid) +
      `<g transform="translate(84 50) rotate(30) scale(.85)">` + crown(k) + `</g>` +
      hair(74, 50, 75, 42, 72, 36, 0.6, P.mid) + hair(80, 36, 84, 32, 90, 33, 0.5, P.mid) +
      sparkle(98, 36, 2.2, '#fff') + sparkle(26, 34, 2) +
      k.defs()
    )
  },

  // Cinco mulligans: te tocó todo Islas. Siete cartas idénticas en abanico.
  'Mano de siete tierras': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 52, 14, 44) +
      Array.from({ length: 7 }, (_, i) => `<g transform="translate(60 97) rotate(${-42 + i * 14}) translate(0 -8) scale(1.1)">${k.cast([roundRect(-10, -31, 10, 0, 1.6)], 1.6, 1.4, P.mid)}${islandCard(k)}</g>`).join('') +
      sparkle(26, 40, 2) + sparkle(94, 46, 1.6) +
      k.defs()
    )
  },

  // Veinte mulligans: barajás más que un crupier. Las cartas saltan de una mano a la otra en arco.
  'Mezclador compulsivo': (u) => {
    const k = kit(u)
    const N = 11, cx = 60, cy = 76, R = 27
    const arc = Array.from({ length: N }, (_, i) => {
      const a = Math.PI + (i + 0.5) * (Math.PI / N), x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 1.05
      return `<g transform="translate(${f(x)} ${f(y + 7)}) rotate(${f((a * 180) / Math.PI + 90)})">${cardBack(k, 11, 15, 0.8)}</g>`
    }).join('')
    const pack = (x: number, r: number) => {
      const side = 'M-9 0H9V-6H-9Z'
      const layers = Array.from({ length: 4 }, (_, i) => `<path d="M-9 ${f(-1.2 - i * 1.2)}H9" stroke="${P.blue}" stroke-width=".35"/>`).join('')
      return `<g transform="translate(${x} 90) rotate(${r})">` + k.draw([{ d: side, fill: P.white, inner: layers }], 0.55) +
        `<g transform="translate(0 -6) scale(1 .42)">${cardBack(k, 18, 24, 0)}</g></g>`
    }
    return (
      k.day() +
      k.sun(60, 60, 12, 44, 24, false) +
      arc + pack(32, -8) + pack(88, 8) +
      hair(22, 64, 24, 46, 36, 34, 0.6, P.mid) + hair(98, 64, 96, 46, 84, 34, 0.6, P.mid) + hair(18, 72, 19, 62, 24, 54, 0.45, P.mid) + hair(102, 72, 101, 62, 96, 54, 0.45, P.mid) +
      sparkle(60, 30, 2.4, '#fff') +
      k.defs()
    )
  },

  // Cincuenta mulligans: te quedaste sin cartas antes de empezar. El estuche se abre en gloria y sale una polilla.
  'Mano de cero': (u) => {
    const k = kit(u)
    const front = 'M34 66H72V97H34Z'
    const side = 'M72 66L83 58.6V89.6L72 97Z'
    const mouth = 'M34 66L45 58.6H83L72 66Z'
    const lid = 'M45 58.6H83L87.4 39H49.4Z'
    const lidEdge = 'M49.4 39H87.4L88 36.6H50Z'
    const corner = (x: number, y: number, sx: number, sy: number) =>
      `<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><path d="M0 0H7.4C6 1.4 4 2 2 2C2 4 1.4 6 0 7.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M1.6 1.6C3 3 4 3 5 2.4M1.6 1.6C3 3 3 4 2.4 5" fill="none" stroke="${P.goldD}" stroke-width=".35"/><circle cx="1.4" cy="1.4" r=".55" fill="${P.goldL}"/></g>`
    const rays = Array.from({ length: 11 }, (_, i) => {
      const a = (-176 + i * 15) * Math.PI / 180, w = 0.06
      return `M58 62L${f(58 + Math.cos(a - w) * 64)} ${f(62 + Math.sin(a - w) * 64)}L${f(58 + Math.cos(a + w) * 64)} ${f(62 + Math.sin(a + w) * 64)}Z`
    }).join('')
    const filig = `<path d="M38 72C42 68 46 68 48 72C49.4 75 52 75 53 73M68 72C64 68 60 68 58 72C56.6 75 54 75 53 73M38 91C42 95 46 95 48 91C49.4 88 52 88 53 90M68 91C64 95 60 95 58 91C56.6 88 54 88 53 90" fill="none" stroke="${P.gold}" stroke-width=".6"/>`
    return (
      k.day() +
      `<path d="${rays}" fill="${k.rad(P.gold, 0.5, 0.95, 0.75, 0.95, 0)}"/>` + k.shade(rays, k.rad(P.goldD, 0.5, 0.95, 0.75, 0.7, 0), P.goldD, 0.2) +
      k.floor(60, 97, 30, 4, P.mid) +
      k.draw([
        {
          d: lid, fill: P.wine,
          inner: `<path d="M49 42H85.6L81.6 56H47.2Z" fill="${P.red}"/>` + k.sh('M49 42H85.6L81.6 56H47.2Z', 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) +
            hair(51, 46, 66, 45, 84, 46, 0.45, P.wine) + hair(50, 51, 66, 50, 83, 51, 0.45, P.wine) + `<circle cx="66" cy="48.6" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`,
        },
        { d: lidEdge, fill: P.night },
        { d: side, fill: P.mid, inner: k.sh(side, 0, 0, 1, 0, 0, 0.8, P.night, 0.45) + hair(77, 66, 77.6, 76, 77, 88, 0.4, P.sky, 0.6) },
        { d: front, fill: P.night, inner: `<path d="${front}" fill="${k.lin(P.mid, 0, 0, 1, 1, 0.9, 0)}"/>` + k.sh(front, 0, 0, 1, 1, 0, 0.7, '#0F1736', 0.4) + filig },
      ], 0.75) +
      `<path d="${mouth}" fill="#0F1736"/>` + k.shade(mouth, k.lin(P.gold, 0, 0, 0, 1, 0.95, 0.15), P.gold, 0.4) +
      `<path d="${mouth}" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linejoin="round"/>` +
      `<path d="M35.6 67.6H70.4V95.4H35.6Z" fill="none" stroke="${P.gold}" stroke-width=".5"/>` +
      corner(34, 66, 1, 1) + corner(72, 66, -1, 1) + corner(34, 97, 1, -1) + corner(72, 97, -1, -1) +
      `<path d="${starPath(53, 81.6, 6.4, 2.8, 8)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` + jewel(53, 81.6, 1.8) +
      `<path d="M58 60C52 56 50 50 44 46" fill="none" stroke="${P.mid}" stroke-width=".55" stroke-dasharray="1.2 1.2" stroke-linecap="round"/>` +
      `<g transform="translate(38.6 41) rotate(-18) scale(1.15)">` + moth(k) + `</g>` +
      `<circle cx="30" cy="50" r=".7" fill="${P.brown}" opacity=".7"/><circle cx="33" cy="54" r=".5" fill="${P.brown}" opacity=".6"/><circle cx="28" cy="56" r=".4" fill="${P.brown}" opacity=".5"/>` +
      `<circle cx="60" cy="52" r=".6" fill="${P.goldL}"/><circle cx="66" cy="54" r=".5" fill="${P.goldL}"/><circle cx="54" cy="55" r=".45" fill="${P.goldL}"/>` +
      k.defs()
    )
  },
}
