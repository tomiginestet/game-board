// Pelota paleta (frontón): la paleta de madera maciza con el mango encintado, la pelotita de goma y el frontón
// del club (la pared revocada con la faja de chapa abajo). Lo vasco aparece por la boina y el lauburu.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, sparkle, type Kit } from '../kit'
import { banner, paleta, PALETA, PINO, PINO_D, rubberBall, voluta } from './_raquetas-piezas'

/** Revoque del frontón y ladrillo que asoma. */
const REVOQUE = '#E9E1CF', REVOQUE_D = '#B9AE94', LADRILLO = '#C27A57', LADRILLO_D = '#8F4E33'
/** Verde y rojo de la ikurriña, apagados. */
const IKU_G = '#4F7A45', IKU_R = '#B8433A'
/** Astilla clara, recién arrancada. */
const ASTILLA = '#F4E1BC'

/** Astilla de madera clavada hacia afuera desde (x,y) con ángulo `a` y largo `l`. */
const splinter = (x: number, y: number, a: number, l: number, c = PINO) => {
  const r = (a * Math.PI) / 180, ux = Math.cos(r), uy = Math.sin(r), px = -uy * 0.9, py = ux * 0.9
  const d = `M${f(x + px)} ${f(y + py)}L${f(x + ux * l)} ${f(y + uy * l)}L${f(x - px)} ${f(y - py)}Z`
  return `<path d="${d}" fill="${c}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>`
}

/** Lauburu (la cruz vasca de cuatro cabezas) centrado en (0,0), de radio r. */
function lauburu(r: number) {
  const h = r / 2
  const head = `M0 0A${h} ${h} 0 0 1 ${r} 0A${h / 2} ${h / 2} 0 0 1 ${h} 0A${h / 2} ${h / 2} 0 0 0 0 0Z`
  return [0, 90, 180, 270].map((a) => `<path d="${head}" transform="rotate(${a})"/>`).join('')
}

/** Boina negra con el txirtxil arriba, vista de costado, apoyada en (0,0). */
function boina(k: Kit) {
  const d = 'M-14.6 -1.4C-16.6 -5.4 -12 -9.8 -4 -10.6C4 -11.4 13 -9.8 15.6 -5.6C17 -3.2 15.4 -.6 12 .4C5 2.2 -6 2 -11.6 1C-13.2 .6 -14.2 -.2 -14.6 -1.4Z'
  const band = 'M-12 -.4C-5 1.2 5 1.2 12.2 -.6L12 1.4C5 3.2 -5 3.2 -11.8 1.6Z'
  return k.draw([
    { d: 'M-.6 -10.4L-.2 -13.6L1.2 -13.4L.8 -10.4Z', fill: P.night },
    { d, fill: P.night, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, '#0B1130', 0.5) + `<path d="M-14 -12H2V2H-14Z" fill="${k.lin(P.mid, 0, 0, 1, 1, 0.8, 0)}"/>` + hair(-10, -5.6, -5, -9, 2, -9.6, 0.7, P.sky, 0.7) + hair(4, -9, 10, -8, 13.6, -5, 0.5, P.mid) },
    { d: band, fill: P.night, inner: `<path d="M-12 .4C-5 2 5 2 12 .2" fill="none" stroke="${P.mid}" stroke-width=".4"/>` },
  ], 0.6)
}

export const PALETA_ART: Record<string, (u: number) => string> = {
  // ── Frontón ───────────────────────────────────────────────────────

  // Cinco ganados: la paleta de pino recién cortada, con las astillas todavía paradas en el canto.
  'Paleta de pino': (u) => {
    const k = kit(u)
    const spl =
      splinter(-10.4, -34, 204, 4.6, ASTILLA) + splinter(-10.3, -31, 186, 3.4, ASTILLA) + splinter(-10.2, -22, 170, 3.8, ASTILLA) +
      splinter(10.5, -38, -18, 4.2, ASTILLA) + splinter(10.2, -20, 14, 3.4, ASTILLA) + splinter(4, -46.6, 286, 3.6, ASTILLA)
    return (
      k.day() +
      k.sun(58, 52, 15, 44, 28, false) +
      k.floor(58, 96, 14, 2, P.mid) +
      `<g transform="translate(56 80) rotate(-8)">` + k.cast([PALETA], 2, 2, P.mid) + `</g>` +
      paleta(k, 56, 80, -8, { top: spl }) +
      hair(30, 40, 33, 38, 36, 40, 0.6, PINO_D) + `<path d="M28 44l2.6 -.6l-1 2z" fill="${PINO}" stroke="${P.ink}" stroke-width=".35"/><path d="M33 46l2 .6l-1.8 1.4z" fill="${PINO}" stroke="${P.ink}" stroke-width=".35"/>` +
      rubberBall(k, 82, 82, 5.6) +
      sparkle(86, 38, 2.2) + sparkle(32, 72, 1.4) +
      k.defs()
    )
  },

  // Veinte ganados: la pared del frontón con la marca de tanto pegarle siempre en el mismo lugar, la faja de chapa
  // abajo y la paleta apoyada.
  'Pared del club': (u) => {
    const k = kit(u)
    const wallD = 'M0 0H120V84H0Z'
    const chip = 'M70 30C74 27 80 28 82 32C83 36 80 38 76 37C73 39 69 36 70 30Z'
    const chip2 = 'M30 56C33 54 37 55 37 58C37 61 33 62 31 60C29 59.6 29 57 30 56Z'
    const bricks = (x0: number, y0: number, x1: number, y1: number) => {
      let d = ''
      for (let y = y0; y < y1; y += 3) { d += `M${x0} ${y}H${x1}`; for (let x = x0 + ((y / 3) % 2 ? 0 : 3); x < x1; x += 6) d += `M${x} ${y}V${y + 3}` }
      return d
    }
    const marks = Array.from({ length: 22 }, (_, i) => {
      const a = i * 2.4, r = 3 + (i % 5) * 2.2
      return `<ellipse cx="${f(56 + Math.cos(a) * r)}" cy="${f(50 + Math.sin(a) * r * 0.9)}" rx="${f(2.2 - (i % 3) * 0.3)}" ry="${f(1.9 - (i % 3) * 0.3)}" fill="${P.ink}" opacity="${f(0.22 + (i % 3) * 0.1)}"/>`
    }).join('')
    const floorD = 'M0 84H120V130H0Z'
    return (
      `<path d="${wallD}" fill="${REVOQUE}"/>` + k.shade(wallD, k.rad(REVOQUE_D, 0.5, 0.45, 0.7, 0, 0.9), REVOQUE_D, 0.5) +
      [chip, chip2].map((d) => `<path d="${d}" fill="${LADRILLO}" stroke="${REVOQUE_D}" stroke-width=".6"/>` + k.clip(d, `<path d="${bricks(20, 24, 90, 66)}" stroke="${LADRILLO_D}" stroke-width=".45"/>`)).join('') +
      `<path d="M0 74H120V84H0Z" fill="${P.sky2}"/>` + k.sh('M0 74H120V84H0Z', 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + `<path d="M0 74H120" stroke="${P.ink}" stroke-width=".8"/><path d="M0 75.2H120" stroke="#fff" stroke-width=".5" opacity=".7"/>` +
      Array.from({ length: 7 }, (_, i) => `<circle cx="${8 + i * 17}" cy="79" r=".7" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<path d="${floorD}" fill="${P.sky1}"/>` + k.sh(floorD, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) +
      marks +
      `<path d="M56 50m-9 0a9 8 0 1 0 18 0a9 8 0 1 0 -18 0" fill="none" stroke="${P.red}" stroke-width=".8" stroke-dasharray="1.4 1.2"/>` +
      // la cuenta en tiza, palitos de a cinco
      `<path d="M30 34V41M32 34V41M34 34V41M36 34V41M28.6 39L37.6 35.4M41 34V41M43 34V41" stroke="${P.white}" stroke-width=".9" stroke-linecap="round"/>` +
      `<path d="M30 34V41M32 34V41M34 34V41M36 34V41M28.6 39L37.6 35.4M41 34V41M43 34V41" stroke="${P.blue}" stroke-width=".35" stroke-linecap="round" transform="translate(.4 .4)"/>` +
      k.floor(78, 94, 12, 2, P.mid) +
      `<g transform="translate(76 84) rotate(12) scale(.8)">` + k.cast([PALETA], 1.8, 1.4, P.mid) + `</g>` +
      paleta(k, 76, 84, 12, { s: 0.8 }) +
      rubberBall(k, 56, 50, 5.4) +
      [0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2 + 0.4; return hair(f(56 + Math.cos(a) * 7.4), f(50 + Math.sin(a) * 7), f(56 + Math.cos(a) * 9), f(50 + Math.sin(a) * 8.6), f(56 + Math.cos(a) * 11), f(50 + Math.sin(a) * 10.4), 0.7, P.ink) }).join('') +
      k.defs()
    )
  },

  // Sesenta ganados: la paleta lleva boina, el lauburu grabado en oro, y la cinta con los colores de la ikurriña.
  'Vasco del barrio': (u) => {
    const k = kit(u)
    const engr = `<g transform="translate(0 -26)" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".4">${lauburu(6.6)}</g>` +
      `<circle cx="0" cy="-26" r="8.6" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` +
      `<path d="M-7 -14.6C-4 -12.6 4 -12.6 7 -14.6" fill="none" stroke="${P.goldD}" stroke-width=".5"/>`
    return (
      k.day() +
      k.sun(60, 54, 16, 47) +
      k.shade(ellipse(60, 52, 26, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(48, 100, 30, 93, 27, 64, 8) + laurel(72, 100, 90, 93, 93, 64, 8, true) +
      k.floor(60, 94, 16, 2.2, P.mid) +
      `<g transform="translate(60 82) rotate(-4)">` + k.cast([PALETA], 2, 2, P.mid) + `</g>` +
      paleta(k, 60, 82, -4, { wood: P.goldL, woodD: P.goldD, grip: IKU_R, gripD: P.wine, over: engr, top: `<g transform="translate(-.6 -44.6) rotate(-6)">` + boina(k) + `</g>` }) +
      rubberBall(k, 83, 82, 5.4, IKU_R) +
      voluta('M36 76C33 72 34.6 68.6 37.6 69.2C39.6 69.6 39.4 72 37.8 72', P.gold) +
      banner(k, 60, 92, 32, IKU_G, '#2F5228', '¡aupa!', P.white, 4.6) +
      sparkle(86, 38, 2.4, '#fff') + sparkle(34, 44, 1.8, '#fff') +
      k.defs()
    )
  },
}
