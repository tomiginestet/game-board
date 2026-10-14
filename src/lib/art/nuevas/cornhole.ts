// Cornhole: la tabla inclinada de madera con su agujero y su franja pintada, y las bolsitas de tela rellenas de maíz,
// con la costura. La familia es toda de maíz: el choclo que brota del agujero, la humita en chala que cae como una
// bolsita, y el pochoclo que revienta.
import { f } from '../helpers'
import { ellipse, hair, kit, P, sparkle, type Kit } from '../kit'
import { cylSide, glow, NEGRA_D, rotulo, WOOD, WOOD_D, WOOD_G, WOOD_L } from './_bar-piezas'

/** Chala (hojas del choclo) y su nervadura. */
const CHALA = '#C9C27A', CHALA_D = '#8E8A45', CHALA_L = '#E6E0A8', LEAF = '#8DA453', LEAF_D = '#5E7434'
/** Granos del choclo. */
const KERNEL = '#F2C760', KERNEL_D = '#C98F2E'

// ── Piezas del cornhole ──────────────────────────────────────────────

interface Board { svg: string; hx: number; hy: number; hrx: number; hry: number }
/** Tabla en perspectiva: el borde lejano en yF (ancho wF) y el cercano en yN (ancho wN), centrada en cx; el agujero
 * cerca del borde lejano. Devuelve también dónde quedó el agujero. */
function board(k: Kit, cx: number, yF: number, yN: number, wF: number, wN: number): Board {
  const top = `M${f(cx - wF / 2)} ${yF}H${f(cx + wF / 2)}L${f(cx + wN / 2)} ${yN}H${f(cx - wN / 2)}Z`
  const front = `M${f(cx - wN / 2)} ${yN}H${f(cx + wN / 2)}V${f(yN + 3.4)}H${f(cx - wN / 2)}Z`
  const side = `M${f(cx + wN / 2)} ${yN}L${f(cx + wF / 2)} ${yF}V${f(yF + 2)}L${f(cx + wN / 2)} ${f(yN + 3.4)}Z`
  const leg = `M${f(cx + wF / 2 - 3)} ${f(yF + 1)}h2.6v${f((yN - yF) * 0.55)}h-2.6Z`
  const at = (t: number) => ({ y: yF + (yN - yF) * t, w: wF + (wN - wF) * t })
  const h = at(0.24), hrx = h.w * 0.17, hry = hrx * 0.42
  // Franja pintada que cruza la tabla en diagonal (de un lado al otro, en perspectiva).
  const b0 = at(0.5), b1 = at(0.66)
  const band = `M${f(cx - b0.w / 2)} ${f(b0.y)}H${f(cx + b0.w / 2)}L${f(cx + b1.w / 2)} ${f(b1.y)}H${f(cx - b1.w / 2)}Z`
  const planks = [-0.25, 0.25].map((q) => `M${f(cx + q * wF)} ${yF}L${f(cx + q * wN)} ${yN}`).join('')
  const svg =
    k.draw([
      { d: leg, fill: WOOD_D },
      { d: side, fill: WOOD_D, inner: k.sh(side, 0, 0, 1, 0, 0, 0.6, WOOD_G, 0.4) },
      { d: front, fill: WOOD, inner: k.sh(front, 0, 0, 1, 0, 0, 0.7, WOOD_G, 0.45) + `<path d="M${f(cx - wN / 2)} ${f(yN + 0.5)}H${f(cx + wN / 2)}" stroke="${WOOD_L}" stroke-width=".5"/>` },
      {
        d: top, fill: WOOD_L,
        inner: `<path d="${band}" fill="${P.mid}"/><path d="${band}" fill="none" stroke="${P.white}" stroke-width=".6"/>` +
          `<path d="${planks}" stroke="${WOOD}" stroke-width=".35"/>` + k.sh(top, 0, 0, 1, 1, 0, 0.6, WOOD_D, 0.35) +
          hair(cx - wF * 0.3, yF + 3, cx - wN * 0.3, (yF + yN) / 2, cx - wN * 0.35, yN - 3, 0.4, WOOD) + hair(cx + wF * 0.2, yF + 6, cx + wN * 0.22, (yF + yN) / 2 + 4, cx + wN * 0.25, yN - 2, 0.4, WOOD) +
          `<path d="${ellipse(cx, f(h.y), f(hrx + 1.2), f(hry + 0.8))}" fill="${P.white}" opacity=".7"/>` +
          `<path d="${ellipse(cx, f(h.y), f(hrx), f(hry))}" fill="${NEGRA_D}" stroke="${WOOD_G}" stroke-width=".5"/>` +
          k.clip(ellipse(cx, f(h.y), f(hrx), f(hry)), `<path d="${ellipse(cx, f(h.y + hry * 0.9), f(hrx), f(hry))}" fill="${WOOD_G}"/>`),
      },
    ], 0.65)
  return { svg, hx: cx, hy: h.y, hrx, hry }
}

/** Bolsita de tela rellena, vista de arriba en perspectiva, centrada en (x,y): almohadón con la costura y el relieve
 * de los granos. */
function bag(k: Kit, x: number, y: number, s: number, rot: number, c = P.red, cd = P.wine, o: { open?: boolean } = {}) {
  const d = 'M-9 -6.6C-4 -8 4 -8 9 -6.6C10.4 -2 10.4 2 9 6.6C4 8 -4 8 -9 6.6C-10.4 2 -10.4 -2 -9 -6.6Z'
  const seam = 'M-7.6 -5.4C-3.6 -6.4 3.6 -6.4 7.6 -5.4C8.6 -1.8 8.6 1.8 7.6 5.4C3.6 6.4 -3.6 6.4 -7.6 5.4C-8.6 1.8 -8.6 -1.8 -7.6 -5.4Z'
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s} ${f(s * 0.82)})">` +
    k.draw([{
      d, fill: c,
      inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, cd, 0.45) + `<path d="${ellipse(-2, -2, 6, 3.6)}" fill="${k.rad('#ffffff', 0.5, 0.5, 0.5, 0.45, 0)}"/>` +
        `<path d="${seam}" fill="none" stroke="${P.white}" stroke-width=".5" stroke-dasharray="1 .8" opacity=".85"/>` +
        hair(-6, 1, -2, 3, 2, 1.6, 0.5, cd) + hair(1, -3, 4, -1.6, 6, -3, 0.45, cd) +
        (o.open ? `<path d="M3 -8L5 -2L2 1L6 6L4 9H12V-9Z" fill="${NEGRA_D}"/>` : ''),
    }], f(0.6 / s)) +
    `</g>`
  )
}

/** Choclo parado con la base en (x,y): granos en hileras, sombreado redondo y las chalas que se abren. */
function choclo(k: Kit, x: number, y: number, s: number, o: { open?: number } = {}) {
  const cob = 'M0 -26C3.6 -26 5.4 -21 5.6 -14C5.8 -6 5.2 0 4.6 4H-4.6C-5.2 0 -5.8 -6 -5.6 -14C-5.4 -21 -3.6 -26 0 -26Z'
  let kern = ''
  for (let r = 0; r < 12; r++) {
    const yy = -23.6 + r * 2.4
    for (let c = -2; c <= 2; c++) {
      const xx = c * 2.1 + (r % 2 ? 1.05 : 0)
      if (Math.abs(xx) > 4.6) continue
      kern += `<path d="${ellipse(f(xx), f(yy), 0.95, 1.05)}" fill="${KERNEL}" stroke="${KERNEL_D}" stroke-width=".3"/>`
    }
  }
  const op = o.open ?? 1
  const husk = (sx: number, ang: number, l: number) => {
    const tx = sx * (6 + 10 * op), ty = -l
    const d = `M${sx * 1} 6C${f(sx * 7 * op + sx * 4)} 0 ${f(tx)} ${f(ty * 0.5)} ${f(tx)} ${f(ty)}C${f(tx - sx * 3)} ${f(ty * 0.6)} ${sx * 3} -4 ${sx * -2} 4Z`
    return { d, t: `rotate(${ang})`, fill: sx * ang > 0 ? LEAF_D : LEAF, inner: k.sh(d, 0, 0, 1, 1, 0, 0.6, LEAF_D, 0.4) + `<path d="M${sx * 1} 5C${f(sx * 5 * op + sx * 3)} 0 ${f(tx - sx * 1.6)} ${f(ty * 0.5)} ${f(tx - sx * 0.6)} ${f(ty + 2)}" fill="none" stroke="${CHALA_L}" stroke-width=".4"/>` }
  }
  return (
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    k.draw([husk(-1, 0, 20), husk(1, 0, 22)], f(0.6 / s)) +
    k.draw([{ d: cob, fill: KERNEL, inner: kern + k.sh(cob, 0, 0, 1, 0, 0, 0.8, KERNEL_D, 0.45) + `<path d="M-5 -24H-1.6V4H-5Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` }], f(0.6 / s)) +
    k.draw([husk(-1, 8, 12), husk(1, -6, 14)], f(0.6 / s)) +
    `<path d="M-.4 -26C-1 -30 -3 -32 -5 -33M.4 -26C1.4 -30 3 -31 5.4 -31.6M0 -26C0 -30 .6 -33 1 -35" fill="none" stroke="${P.brown}" stroke-width=".5"/>` +
    `</g>`
  )
}

/** Un pochoclo: cuatro lóbulos blancos con el corazón dorado. */
function pop(k: Kit, x: number, y: number, s: number, r = 0) {
  const d = 'M0 -4.6C2.6 -5.6 4.8 -3.6 4.2 -1.2C6 -.4 5.8 2.8 3.4 3.4C2.8 5.4 -.4 5.8 -1.6 4C-3.8 4.6 -5.6 2.4 -4.4 .2C-5.8 -1.6 -4 -4.4 -1.6 -3.8C-1.2 -4.4 -.6 -4.6 0 -4.6Z'
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
    k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.6, P.goldL, 0.45) + `<path d="M-.6 .6C.4 -.4 1.6 -.2 1.8 .8" fill="none" stroke="${P.goldD}" stroke-width=".5"/><circle cx=".6" cy="1.4" r=".8" fill="${P.gold}"/>` + `<path d="M-2.6 -2C-1.6 -3.2 0 -3.4 1 -3" fill="none" stroke="#fff" stroke-width=".6"/>` }], f(0.45 / s)) +
    `</g>`
}

export const CORNHOLE_ART: Record<string, (u: number) => string> = {
  // Cinco ganadas: recién salido de la planta, el choclo tierno brota del agujero de la tabla; al lado, la bolsita.
  'Choclo tierno': (u) => {
    const k = kit(u)
    const B = board(k, 60, 52, 96, 34, 62)
    return (
      k.day() +
      k.sun(60, 42, 14, 44, 32, true) +
      glow(k, 60, 44, 18, 18, 0.7) +
      B.svg +
      k.clip(`M0 0H120V${f(B.hy)}H0Z${ellipse(B.hx, f(B.hy), f(B.hrx), f(B.hry))}`, choclo(k, B.hx, B.hy + 3, 1.15)) +
      bag(k, 72, 82, 1.1, 16) +
      hair(46, 30, 48, 34, 47, 38, 0.6, LEAF_D) + hair(74, 30, 72, 34, 73, 38, 0.6, LEAF_D) +
      sparkle(36, 48, 1.8) + sparkle(84, 54, 1.4) +
      k.defs()
    )
  },

  // Veinte victorias: la humita en chala, atada con su tirita, cae en la tabla como una bolsita. Todavía humea.
  'Humita en chala': (u) => {
    const k = kit(u)
    const B = board(k, 60, 56, 98, 32, 60)
    const parcel = 'M-14 -6C-8 -10 8 -10 14 -6C16 -2 16 2 14 6C8 10 -8 10 -14 6C-16 2 -16 -2 -14 -6Z'
    const tie = 'M-2 -9.4H2V9.4H-2Z'
    const ends = (sx: number) => `M${sx * 14} -5C${sx * 18} -8 ${sx * 22} -7 ${sx * 23} -3C${sx * 21} -1 ${sx * 21} 1 ${sx * 23} 3C${sx * 22} 7 ${sx * 18} 8 ${sx * 14} 5Z`
    const veins = Array.from({ length: 7 }, (_, i) => { const yy = -6 + i * 2; return `M-13.6 ${yy}C-6 ${yy - 1} 6 ${yy - 1} 13.6 ${yy}` }).join('')
    return (
      k.day() +
      k.stage(60, 56, 34) +
      B.svg +
      k.floor(62, 74, 22, 4, WOOD_G) +
      `<g transform="translate(60 62) rotate(-8)">` +
      k.draw([
        { d: ends(-1), fill: CHALA_L, inner: k.sh(ends(-1), 0, 0, 1, 1, 0, 0.6, CHALA_D, 0.4) + `<path d="M-15 0H-22M-15 -3L-21 -5M-15 3L-21 5" stroke="${CHALA_D}" stroke-width=".4"/>` },
        { d: ends(1), fill: CHALA, inner: k.sh(ends(1), 0, 0, 1, 1, 0, 0.7, CHALA_D, 0.45) + `<path d="M15 0H22M15 -3L21 -5M15 3L21 5" stroke="${CHALA_D}" stroke-width=".4"/>` },
        { d: parcel, fill: CHALA, inner: `<path d="${veins}" fill="none" stroke="${CHALA_D}" stroke-width=".35"/>` + k.sh(parcel, 0, 0, 1, 1, 0, 0.8, CHALA_D, 0.45) + `<path d="M-12 -5C-6 -8 2 -8 8 -7" fill="none" stroke="${CHALA_L}" stroke-width="1" stroke-linecap="round"/>` },
        { d: tie, fill: CHALA_D, inner: `<path d="M-2 -9.4H-.6V9.4H-2Z" fill="${CHALA_L}" opacity=".6"/>` },
      ], 0.65) +
      `<path d="M-1.6 9C-3 12 -4.6 13 -6 13.4M1.6 9C3 12 5 12.4 6.4 12" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-1.6 9C-3 12 -4.6 13 -6 13.4M1.6 9C3 12 5 12.4 6.4 12" fill="none" stroke="${CHALA_D}" stroke-width=".7" stroke-linecap="round"/>` +
      `</g>` +
      [52, 60, 68].map((x, i) => hair(x, 50, x - 3, 44, x, 38 - i, 0.9, P.blue, 0.8) + hair(x, 38 - i, x + 3, 33, x, 28 - i, 0.7, P.blue, 0.6)).join('') +
      rotulo(86, 40, 5.4, '¡quema!', { rot: 10, c: P.mid, bold: true }) +
      sparkle(32, 44, 1.6) + sparkle(88, 70, 1.4) +
      k.defs()
    )
  },

  // Cincuenta ganadas: la olla revienta, la tapa vuela y la bolsita se abre en una lluvia de pochoclo.
  'Pochoclo explosivo': (u) => {
    const k = kit(u)
    const pot = cylSide(60, 74, 17, 5, 18)
    const rim = ellipse(60, 74, 17, 5)
    const lid = ellipse(0, 0, 15, 4.4)
    const knob = 'M-2.6 -3.6C-2.6 -6 2.6 -6 2.6 -3.6Z'
    const handles = `M41 78C38 78 37 80 38 82H43M79 78C82 78 83 80 82 82H77`
    const pops: number[][] = [[60, 62, 1.5, 0], [50, 58, 1.3, 30], [70, 58, 1.3, -20], [42, 50, 1.1, 60], [78, 48, 1.2, 10], [56, 48, 1.2, -40], [66, 44, 1.1, 80], [86, 36, 0.9, -30], [48, 36, 1, 45], [62, 32, 0.9, -10], [92, 58, 0.8, 0], [74, 28, 0.8, 30]]
    return (
      k.day() +
      k.sun(60, 54, 16, 50, 32, false) +
      glow(k, 60, 56, 28, 24, 0.85) +
      k.floor(60, 93, 24, 2.8) +
      [[38, 44, 30, 36], [82, 42, 90, 34], [60, 40, 60, 28], [44, 62, 34, 62], [76, 62, 86, 62]].map(([a, b, c, d]) => hair(a, b, (a + c) / 2, (b + d) / 2, c, d, 0.8, P.goldD)).join('') +
      pops.slice(0, 7).map(([x, y, s, r]) => pop(k, x, y, s, r)).join('') +
      k.draw([
        { d: pot, fill: P.sky2, inner: k.sh(pot, 0, 0, 1, 0, 0, 0.85, P.mid, 0.5) + `<path d="${pot}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` + `<path d="M43 84A17 5 0 0 0 77 84" fill="none" stroke="${P.blue}" stroke-width=".6"/>` },
        { d: rim, fill: NEGRA_D, inner: `<path d="${ellipse(60, 76, 17, 5)}" fill="#3A2A18"/>` },
      ], 0.7) +
      `<path d="${handles}" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="${handles}" fill="none" stroke="${P.mid}" stroke-width="1" stroke-linecap="round"/>` +
      pop(k, 52, 74, 1.1, 10) + pop(k, 62, 73, 1.2, -30) + pop(k, 70, 75, 1, 50) +
      pops.slice(7).map(([x, y, s, r]) => pop(k, x, y, s, r)).join('') +
      `<g transform="translate(86 46) rotate(28)">` + k.draw([{ d: lid, fill: P.sky1, inner: k.sh(lid, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) + `<path d="${ellipse(0, 0, 11, 3)}" fill="none" stroke="${P.blue}" stroke-width=".4"/>` }, { d: knob, fill: P.ink }], 0.6) + `</g>` +
      `<g transform="translate(33 48)">` + bag(k, 0, 0, 1.1, -24, P.mid, P.ink, { open: true }) + `</g>` +
      pop(k, 42, 42, 0.8, 20) + pop(k, 40, 36, 0.7, -20) +
      sparkle(26, 70, 2, '#fff') + sparkle(94, 72, 1.6, '#fff') + sparkle(60, 22, 2, '#fff') +
      k.defs()
    )
  },
}
