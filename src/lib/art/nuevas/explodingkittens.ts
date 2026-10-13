// Exploding Kittens: Siete vidas, Antibombas y Kabum.
// El color propio del juego es el naranja de su ficha: el fondo durazno, las tejas, el collar, el casco y el fuego.
// Nada del gato de las cartas: los gatos son gatos de verdad (en silueta, de perfil o por la cola) y el resto se
// cuenta con objetos (la bomba de hierro, el cable cortado, el casco antibombas, el hongo).
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'

// El naranja de la ficha (#E8590C), con su sombra y su luz, y el durazno del fondo.
const NAR = '#E8590C', NAR_D = '#9C3907', NAR_L = '#F7AE78'
const DURAZNO = '#F3BF98', DURAZNO_G = '#E69864'
// El hierro de la bomba, el rosa del chicle y el hollín.
const HIERRO = '#2A3352', HIERRO_D = '#0E1430'
const CHICLE = '#EF8DB3', CHICLE_D = '#C05683'
const HOLLIN = '#1A1E2E'

/** Fondo de Exploding Kittens: el papel con el durazno granulado hacia los bordes. */
const fondo = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(DURAZNO, 0.5, 0.46, 0.7, 0, 1), DURAZNO_G, 0.5)

/** Escenario durazno: un disco claro con el borde granulado. */
const escenario = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FBE8D8"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(DURAZNO, 0.5, 0.5, 0.5, 0, 1), DURAZNO_G, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${NAR}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Varilla entintada: la tinta gruesa y el color encima, con un brillo opcional (cables, alambres, mechas). */
const rod = (d: string, c: string, w: number, hi?: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (hi ? `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.35 -.35)"/>` : '')

/** Mecha trenzada de la bomba. */
const fuse = (d: string) => rod(d, '#C9A16B', 1.7) + `<path d="${d}" fill="none" stroke="${P.brownD}" stroke-width="1.7" stroke-dasharray=".45 1.05"/>`

/** Bomba de hierro: esfera de radio R en (0,0) con el cuello torneado girado `ang` grados (hacia arriba a la derecha).
 * `rich` le suma el zuncho remachado y más grabado (para las de oro). La punta del cuello queda en
 * (1.34R·sen ang, −1.34R·cos ang). */
function bomb(k: Kit, R: number, ang: number, rich = false) {
  const ball = ellipse(0, 0, R, R)
  const nw = f(R * 0.32), top = f(-R * 1.34)
  const neck = `M${-nw} ${f(-R * 0.8)}V${top}H${nw}V${f(-R * 0.8)}Z`
  const lip = ellipse(0, top, f(nw + 0.9), f(R * 0.12))
  const knurl = Array.from({ length: 6 }, (_, i) => { const x = -nw + ((i + 0.5) * 2 * nw) / 6; return `M${f(x)} ${f(-R * 0.97)}V${f(top + 0.8)}` }).join('')
  const rivets = rich
    ? Array.from({ length: 9 }, (_, i) => {
        const t = 0.1 + i * 0.1, x = -R * Math.cos(Math.PI * t), y = R * 0.3 * Math.sin(Math.PI * t)
        return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(R * 0.05)}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".25"/><circle cx="${f(x - R * 0.015)}" cy="${f(y - R * 0.015)}" r="${f(R * 0.02)}" fill="#fff"/>`
      }).join('')
    : ''
  const band = rich
    ? `<g transform="rotate(-24)"><path d="M${-R} 0A${R} ${f(R * 0.3)} 0 0 0 ${R} 0" fill="none" stroke="${P.ink}" stroke-width="${f(R * 0.2)}"/>` +
      `<path d="M${-R} 0A${R} ${f(R * 0.3)} 0 0 0 ${R} 0" fill="none" stroke="${P.mid}" stroke-width="${f(R * 0.15)}"/>` +
      `<path d="M${-R} ${f(-R * 0.04)}A${R} ${f(R * 0.3)} 0 0 0 ${R} ${f(-R * 0.04)}" fill="none" stroke="${P.sky}" stroke-width=".35" opacity=".8"/>` + rivets + `</g>`
    : ''
  // Grabado: arcos de contorno que dan la curva, del lado de la sombra.
  const contour = [0.35, 0.55, 0.75].map((s) => hair(R * s * 0.2, R * 0.96, R * s * 1.05, R * s * 0.9, R * 0.97, R * (0.1 - s * 0.2), R * 0.035, P.mid, 0.7)).join('')
  return (
    `<g transform="rotate(${ang})">` +
    k.draw([
      { d: neck, fill: P.mid, inner: k.sh(neck, 0, 0, 1, 0, 0, 0.9, HIERRO_D, 0.5) + `<path d="${knurl}" stroke="${P.sky}" stroke-width=".35" opacity=".7"/>` + `<path d="M${f(-nw + 0.5)} ${f(-R * 0.95)}V${f(top + 0.6)}" stroke="#fff" stroke-width=".5" opacity=".8"/>` },
      { d: lip, fill: P.sky2, inner: k.sh(lip, 0, 0, 1, 0, 0, 0.8, P.mid, 0.4) },
    ], 0.6) +
    `<path d="${ellipse(0, top, f(nw * 0.62), f(R * 0.06))}" fill="${HIERRO_D}"/>` +
    `</g>` +
    k.draw([{
      d: ball, fill: HIERRO,
      inner:
        k.sh(ball, 0, 0, 1, 1, 0, 0.95, HIERRO_D, 0.55) + contour + band +
        `<path d="${ellipse(-R * 0.36, -R * 0.38, R * 0.52, R * 0.36)}" fill="${k.rad('#ffffff', 0.5, 0.5, 0.5, 0.5, 0)}" transform="rotate(-38 ${f(-R * 0.36)} ${f(-R * 0.38)})"/>` +
        hair(-R * 0.8, -R * 0.1, -R * 0.74, -R * 0.62, -R * 0.24, -R * 0.82, R * 0.08, '#fff', 0.85) +
        hair(-R * 0.56, -R * 0.16, -R * 0.48, -R * 0.44, -R * 0.16, -R * 0.56, R * 0.045, '#fff', 0.6) +
        hair(-R * 0.97, R * 0.14, -R * 0.84, R * 0.8, -R * 0.12, R * 0.97, R * 0.09, NAR_L, 0.85),
    }], 0.85)
  )
}

/** Gato caminando de perfil hacia la derecha, en silueta, con las patas en y=0. Las partes se superponen y `draw`
 * entinta sólo el contorno de afuera; la luz de la luna le marca el borde de arriba. */
function walkingCat(k: Kit, c: string, rim: string) {
  const back = [
    taper(-5.4, -10.4, -6.6, -5.4, -3.6, -0.8, 4.2, 2.1),
    taper(6.6, -10.4, 4.8, -5, 8.4, -3, 3.4, 2.1),
    ellipse(-2.6, -0.9, 2, 0.95), ellipse(9.4, -2.9, 1.9, 0.95),
  ]
  const front = [
    'M-13.6 -12.4C-14 -17 -6 -18.8 2 -18.4C9 -18 13.8 -16.2 13.8 -12C13.8 -8.6 9 -7.2 2 -7.6C-6 -8 -13.2 -8.2 -13.6 -12.4Z',
    taper(-9, -12.6, -15.4, -6.8, -12.2, -0.8, 7, 2.4),
    taper(9.8, -10.4, 10.6, -5.2, 12, -0.8, 3.8, 2.3),
    'M7.6 -16.4C9.6 -19.6 12.4 -22 14.6 -21.8L16.8 -15.4C13.6 -14 10.6 -12 8.8 -10.4Z',
    'M12.4 -20.4C12.6 -24 15 -25.6 17.8 -25.4C20.4 -25.2 21.8 -23.4 22.2 -21.4C23.6 -20.8 24.8 -19.6 24.6 -18.4C24.4 -17 23 -16.2 21.4 -16C20 -14.6 17.4 -14 15 -14.6C13 -15.2 12.2 -17.6 12.4 -20.4Z',
    'M14.2 -23.2L15.2 -30L19.2 -24.4Z',
    'M18.2 -24.8L21.4 -30L22 -22.8Z',
    ellipse(-10.8, -0.9, 2.2, 1), ellipse(12.8, -0.9, 2.1, 1),
  ]
  const tail = [taper(-12.6, -13.6, -23, -17, -19.4, -29, 3.8, 2.4), taper(-19.4, -29, -18, -33.6, -14.2, -33.4, 2.4, 2)]
  const rimLine = (d: string) => `<path d="${d}" fill="none" stroke="${rim}" stroke-width=".6" opacity=".6" transform="translate(.4 .5)"/>`
  const sh = (d: string) => k.sh(d, 0, 0, 0, 1, 0, 0.7, HIERRO_D, 0.4)
  return (
    k.draw(back.map((d) => ({ d, fill: c, inner: sh(d) })), 0.6) +
    k.draw([...tail, ...front].map((d, i) => ({ d, fill: c, inner: sh(d) + ([0, 1, 2, 5, 6, 7, 8].includes(i) ? rimLine(d) : '') })), 0.6) +
    hair(-8, -16, -2, -17.2, 6, -16.8, 0.45, rim, 0.5) + hair(-12.4, -11.6, -12.6, -9.4, -11, -8, 0.4, rim, 0.35) +
    hair(23.6, -17.8, 27.4, -19.2, 30.6, -18.2, 0.32, P.night) + hair(23.4, -17, 27.4, -17, 30.4, -15.6, 0.32, P.night) + hair(23, -16.4, 26, -15.4, 28.6, -13.4, 0.28, P.night)
  )
}

/** Alicate de corte, con el eje en (0,0), las mandíbulas hacia −x y los mangos de goma naranja hacia +x. `open` abre en grados. */
function cutters(k: Kit, open: number) {
  const jaw = 'M1.4 -1.4C-3 -4 -8.6 -4.6 -13.2 -2.2C-14 -1.8 -14 -.8 -13.2 -.6C-9 0 -4 0 1 .6Z'
  const shank = 'M-1.6 -1.8C2 -3.8 5 -2.6 7.4 .8L8.4 2.8C6.4 4 5.4 4 4.6 3.4C3.4 1.6 1.4 .6 -1.2 1.6Z'
  const grip = taper(7.2, 2.6, 17.4, 5.6, 29, 6, 4.6, 3.8)
  const arm = (sy: number, rot: number) =>
    `<g transform="rotate(${rot}) scale(1 ${sy})">` +
    k.draw([
      { d: grip, fill: NAR, inner: k.sh(grip, 0, 0, 0, 1, 0, 0.95, NAR_D, 0.5) + [12, 15, 18, 21, 24].map((x) => `<path d="M${x} ${f(2.4 + x * 0.12)}V${f(7.6 + x * 0.05)}" stroke="${NAR_D}" stroke-width=".45"/>`).join('') + hair(9, 3.4, 18, 4.4, 27, 4.6, 0.55, NAR_L, 0.9) },
      { d: shank, fill: P.sky1, inner: k.sh(shank, 0, 0, 1, 1, 0, 0.9, P.blue, 0.45) },
      { d: jaw, fill: P.sky1, inner: k.sh(jaw, 0, 0, 0, 1, 0, 0.9, P.blue, 0.5) + `<path d="M-12.6 -1C-8 -.6 -4 -.4 0 .2" stroke="#fff" stroke-width=".45"/>` + hair(-10, -3, -6, -3.6, -1.6, -2.6, 0.4, P.blue) },
    ], 0.55) +
    `</g>`
  return (
    arm(-1, -open) + arm(1, open) +
    `<circle cx="0" cy="0" r="3" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".6"/><circle cx="0" cy="0" r="1.6" fill="${P.sky1}" stroke="${P.mid}" stroke-width=".4"/><circle cx="-.6" cy="-.7" r=".55" fill="#fff"/>`
  )
}

/** Cable cortado: el corte de la vaina y los hilos de cobre abiertos, en (x,y) mirando hacia `a` grados. */
const cutEnd = (x: number, y: number, a: number) =>
  `<g transform="translate(${x} ${y}) rotate(${a})">` +
  `<path d="M0 -.9L2.4 -1.5M0 -.3L2.8 -.4M0 .3L2.6 .7M0 .9L2 1.6" stroke="${P.goldD}" stroke-width=".55" stroke-linecap="round"/>` +
  `<path d="M0 -.6L2.6 -.9M0 .5L2.4 1" stroke="${P.goldL}" stroke-width=".3" stroke-linecap="round"/>` +
  `<ellipse cx="0" cy="0" rx=".7" ry="1.75" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".45"/><ellipse cx="0" cy="0" rx=".3" ry=".9" fill="${P.gold}"/></g>`

/** Clip doblado (alambre de acero), a lo largo del eje x desde (0,0). */
const CLIP = 'M0 -2.4H10A2.4 2.4 0 0 1 10 2.4H-1A1.8 1.8 0 0 1 -1 -1.2H8A1.2 1.2 0 0 1 8 1.2H2'

export const EXPLODINGKITTENS_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Siete vidas ────────────────────────────────────────────────────

  // Tres ganadas: el gato camina por la cumbrera de tejas, recortado contra la luna llena.
  'Gato de tejado': (u) => {
    const k = kit(u)
    const ry = (x: number) => 78.4 - (x - 8) * 0.0692
    const roof = `M8 ${f(ry(8))}L112 ${f(ry(112))}V112H8Z`
    const W = 8, courses = [5.6, 11.6, 18.4, 26.2, 35]
    // Tejas españolas: columnas de cobijas (convexas, con luz a la izquierda) y canales (hundidos), cada hilada con su boca.
    let conv = '', canal = '', lips = '', mouths = ''
    for (let i = 0; i < 14; i++) {
      const x = 4 + i * W, top = ry(x + W / 2) - 0.6
      if (i % 2) canal += `M${f(x)} ${f(top)}H${f(x + W)}V112H${f(x)}Z`
      else conv += `M${f(x)} ${f(top)}H${f(x + W)}V112H${f(x)}Z`
      for (const dy of courses) {
        const y = top + dy
        if (i % 2) lips += `M${f(x + 0.3)} ${f(y + 1.2)}Q${f(x + W / 2)} ${f(y - 0.6)} ${f(x + W - 0.3)} ${f(y + 1.2)}`
        else {
          lips += `M${f(x + 0.2)} ${f(y)}Q${f(x + W / 2)} ${f(y + 3.4)} ${f(x + W - 0.2)} ${f(y)}`
          mouths += `M${f(x + 0.8)} ${f(y + 0.3)}Q${f(x + W / 2)} ${f(y + 3)} ${f(x + W - 0.8)} ${f(y + 0.3)}Q${f(x + W / 2)} ${f(y + 1.4)} ${f(x + 0.8)} ${f(y + 0.3)}Z`
        }
      }
    }
    const cap = `M8 ${f(ry(8) - 3)}L112 ${f(ry(112) - 3)}V${f(ry(112) + 1.8)}L8 ${f(ry(8) + 1.8)}Z`
    const capSeg = Array.from({ length: 12 }, (_, i) => { const x = 10 + i * 9; return `M${x} ${f(ry(x) - 3)}C${f(x - 1.8)} ${f(ry(x) - 1.6)} ${f(x - 1.8)} ${f(ry(x) + 0.6)} ${x} ${f(ry(x) + 1.8)}` }).join('')
    const craters = [[50, 36, 3.6], [70, 40, 2.6], [65, 56, 4.2], [48, 54, 2.2], [76, 30, 1.8], [57, 28, 1.5], [41, 44, 1.4]]
    const moon = ellipse(60, 46, 25, 25)
    return (
      k.night() +
      k.shade(FULL, k.rad(NAR, 0.5, 1, 0.6, 0.75, 0), NAR, 0.35) +
      k.shade(ellipse(60, 46, 38, 38), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.55, 0), P.goldL, 0.35) +
      k.draw([{
        d: moon, fill: '#F6EBCF',
        inner:
          k.sh(moon, 0, 0, 1, 1, 0, 0.75, P.sky2, 0.45) +
          craters.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.sky2}" opacity=".45"/><path d="M${f(x - r * 0.8)} ${f(y + r * 0.5)}A${r} ${r} 0 0 0 ${f(x + r * 0.8)} ${f(y + r * 0.5)}" fill="none" stroke="#fff" stroke-width=".5" opacity=".8"/>`).join('') +
          '',
      }], 0.6) +
      `<g transform="translate(55.4 ${f(ry(55.4) - 3)}) scale(1.18)">` + walkingCat(k, HOLLIN, P.goldL) + `</g>` +
      k.draw([{
        d: roof, fill: NAR,
        inner:
          `<path d="${conv}" fill="${k.lin(NAR_L, 0, 0, 1, 0, 0.5, 0)}"/>` + `<path d="${canal}" fill="${NAR_D}" opacity=".6"/>` +
          `<path d="${mouths}" fill="${NAR_D}"/>` +
          `<path d="${lips}" fill="none" stroke="${P.wine}" stroke-width=".55"/>` +
          k.sh(roof, 0, 0, 0, 1, 0.05, 0.8, P.night, 0.45) + k.sh(roof, 0, 0, 1, 0, 0, 0.45, P.night, 0.3),
      }, {
        d: cap, fill: NAR,
        inner: k.sh(cap, 0, 0, 0, 1, 0, 0.8, NAR_D, 0.45) + `<path d="${capSeg}" fill="none" stroke="${NAR_D}" stroke-width=".55"/>` + `<path d="M8 ${f(ry(8) - 2.3)}L112 ${f(ry(112) - 2.3)}" stroke="${P.goldL}" stroke-width=".8" opacity=".9"/>`,
      }], 0.6) +
      sparkle(31, 38, 1.8, P.goldL) + sparkle(89, 32, 1.4, '#fff') + sparkle(91, 56, 1, '#fff') + sparkle(29, 58, 1, '#fff') +
      k.defs()
    )
  },

  // Doce ganadas: el collar de cuero con siete vidas en tachas de oro, y el cascabel que lo dice.
  'Siete vidas': (u) => {
    const k = kit(u)
    const cx = 60, c1 = 46, c2 = 53.4, rx = 27, ry = 11.6
    const front = `M${cx - rx} ${c1}A${rx} ${ry} 0 0 0 ${cx + rx} ${c1}V${c2}A${rx} ${ry} 0 0 1 ${cx - rx} ${c2}Z`
    const back = `M${cx - rx} ${c1}A${rx} ${ry} 0 0 1 ${cx + rx} ${c1}V${c2}A${rx} ${ry} 0 0 0 ${cx - rx} ${c2}Z`
    const heart = 'M0 2.6C-3.6 .2 -3.8 -2.6 -1.9 -3C-1 -3.2 -.2 -2.7 0 -1.9C.2 -2.7 1 -3.2 1.9 -3C3.8 -2.6 3.6 .2 0 2.6Z'
    const hearts = Array.from({ length: 7 }, (_, i) => {
      const t = Math.PI * (0.16 + (i * 0.68) / 6), x = cx + rx * Math.cos(t), y = (c1 + c2) / 2 + ry * Math.sin(t) - 0.2, sx = Math.pow(Math.sin(t), 0.8)
      return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(sx)} 1)"><path d="${heart}" fill="${P.ink}" transform="translate(.4 .5)"/><path d="${heart}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
        `<path d="M-1.9 -2C-2.6 -1.4 -2.4 -.2 -1.4 .6" fill="none" stroke="${P.goldL}" stroke-width=".55" stroke-linecap="round"/><path d="M1.2 1.2C2 .4 2.4 -.4 2.2 -1.4" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-linecap="round"/></g>`
    }).join('')
    const stitch = (y: number, sweep: number) => `M${cx - rx + 1.4} ${y}A${rx - 1.4} ${ry} 0 0 ${sweep} ${cx + rx - 1.4} ${y}`
    const bell = ellipse(60, 75.6, 7.6, 7.6)
    return (
      fondo(k) +
      k.sun(60, 54, 16, 47, 28, false) +
      k.shade(ellipse(60, 56, 28, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      `<g transform="rotate(-7 60 60)">` +
      k.draw([{ d: back, fill: NAR_D, inner: k.sh(back, 0, 0, 1, 0, 0.2, 0.9, P.wine, 0.5) + `<path d="${stitch(c1 + 1.3, 1)}M${cx - rx + 1.4} ${c2 - 1.3}A${rx - 1.4} ${ry} 0 0 1 ${cx + rx - 1.4} ${c2 - 1.3}" fill="none" stroke="${NAR_L}" stroke-width=".4" stroke-dasharray="1.2 .9" opacity=".6"/>` }], 0.6) +
      k.floor(60, 70, 20, 3, NAR_D) +
      k.draw([{
        d: front, fill: NAR,
        inner:
          k.sh(front, 0, 0, 1, 0, 0, 0.95, NAR_D, 0.5) + `<path d="M30 40H44V70H30Z" fill="${k.lin(NAR_L, 0, 0, 1, 0, 0.7, 0)}"/>` +
          `<path d="${stitch(c1 + 1.3, 0)}M${cx - rx + 1.4} ${c2 - 1.3}A${rx - 1.4} ${ry} 0 0 0 ${cx + rx - 1.4} ${c2 - 1.3}" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-dasharray="1.2 .9"/>` +
          `<path d="M${cx - rx + 0.6} ${c1 + 0.5}A${rx - 0.6} ${ry} 0 0 0 ${cx + rx - 0.6} ${c1 + 0.5}" fill="none" stroke="${NAR_L}" stroke-width=".7"/>` +
          hair(36, 56, 44, 61, 52, 62.6, 0.45, NAR_D, 0.7) + hair(70, 62.4, 77, 60.6, 83, 56.4, 0.45, NAR_D, 0.7),
      }], 0.7) +
      hearts +
      `</g>` +
      // Argolla y cascabel.
      `<path d="M57.2 64.4C57.2 68.8 62.8 68.8 62.8 64.4" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M57.2 64.4C57.2 68.8 62.8 68.8 62.8 64.4" fill="none" stroke="${P.gold}" stroke-width="1.1" stroke-linecap="round"/>` +
      `<path d="${ellipse(60, 68.4, 1.5, 1.5)}" fill="none" stroke="${P.ink}" stroke-width="1.8"/><path d="${ellipse(60, 68.4, 1.5, 1.5)}" fill="none" stroke="${P.goldL}" stroke-width=".8"/>` +
      `<g transform="translate(60 77) scale(1.15) translate(-60 -77)">` +
      k.cast([bell], 1.6, 1.8, NAR_D) +
      k.draw([{
        d: bell, fill: P.gold,
        inner:
          k.sh(bell, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.55) + `<path d="${ellipse(57.4, 72.6, 3, 2)}" fill="${k.rad('#ffffff', 0.5, 0.5, 0.5, 0.8, 0)}" transform="rotate(-30 57.4 72.6)"/>` +
          `<path d="M52.2 75.4Q60 78.4 67.8 75.4" fill="none" stroke="${P.goldD}" stroke-width=".8"/><path d="M52.4 74.6Q60 77.6 67.6 74.6" fill="none" stroke="${P.goldL}" stroke-width=".45"/>`,
      }], 0.65) +
      // La ranura del cascabel, recta y abajo, con la bolita adentro.
      `<path d="M53.6 80.4H66.4" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M54.4 80.1H65.6" stroke="${HIERRO_D}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="M54.6 81.4H65.4" stroke="${P.goldL}" stroke-width=".4" stroke-linecap="round"/>` +
      `<path d="M55.6 70.2C57 69.4 58.6 69.2 60 69.4" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` +
      Array.from({ length: 7 }, (_, i) => `<circle cx="${f(54.6 + i * 1.8)}" cy="${f(76.5 + 1.5 * (1 - ((i - 3) * 1.8 / 7.8) ** 2))}" r=".32" fill="${P.goldL}"/>`).join('') +
      sparkle(54.6, 71.6, 1.4, '#fff') + `</g>` +
      sparkle(88, 36, 2.4, '#fff') + sparkle(32, 70, 1.8) +
      k.defs()
    )
  },

  // Treinta y cinco ganadas: el casco de obra con orejas de gato, sobre el chaleco antiexplosivos acolchado.
  'Gato con casco': (u) => {
    const k = kit(u)
    const dome = 'M38.6 69C37.6 54 46 42.6 60 42.6C74 42.6 82.4 54 81.4 69Z'
    const earL = 'M42.6 54.2C42.8 47.8 44.2 41.4 46.6 36.8C49.8 38.8 53.4 42.2 55.4 45.6C50.8 47.4 46.4 50.4 42.6 54.2Z'
    const earR = 'M77.4 54.2C77.2 47.8 75.8 41.4 73.4 36.8C70.2 38.8 66.6 42.2 64.6 45.6C69.2 47.4 73.6 50.4 77.4 54.2Z'
    const rib = 'M56.4 43C55.8 51 55.8 60 56.2 69H63.8C64.2 60 64.2 51 63.6 43C62 42.6 58 42.6 56.4 43Z'
    const brim = 'M33.4 70.4C33.4 67.6 45 66.2 60 66.2C75 66.2 86.6 67.6 86.6 70.4C86.6 73.2 75 75 60 75C45 75 33.4 73.2 33.4 70.4Z'
    const peak = 'M41.6 72.6C46.6 81.4 73.4 81.4 78.4 72.6C71 75.4 49 75.4 41.6 72.6Z'
    const badge = 'M53.4 50.6H66.6V56.8C66.6 61 63.4 63.4 60 64.6C56.6 63.4 53.4 61 53.4 56.8Z'
    // El chaleco antiexplosivos doblado, de almohadón: gajos acolchados, cuello y dos cinchas naranjas con hebilla.
    const top = 'M41.6 74.6H78.4L83.4 79.4H36.6Z'
    const front = 'M36.6 79.4H83.4V88.6C83.4 90.6 82 91.6 80 91.6H40C38 91.6 36.6 90.6 36.6 88.6Z'
    const quilt = [42.4, 48.2, 54, 66, 71.8, 77.6].map((x) => hair(x, 79.8, x + 0.3, 85.4, x, 91.2, 0.55, P.night, 0.8)).join('')
    const neck = 'M50.4 79.4L60 88.6L69.6 79.4H66L60 84.8L54 79.4Z'
    const band = 'M36.6 86.4H83.4V89H36.6Z'
    const rivet = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="1.2" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(x - 0.35)}" cy="${f(y - 0.35)}" r=".4" fill="#fff"/>`
    return (
      fondo(k) +
      k.sun(60, 54, 16, 48, 28, false) +
      k.shade(ellipse(60, 54, 28, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(48, 100, 28, 92, 25, 62, 8) + laurel(72, 100, 92, 92, 95, 62, 8, true) +
      k.floor(60, 92, 26, 2.6, NAR_D) +
      k.draw([
        { d: top, fill: P.blue, inner: k.sh(top, 0, 0, 1, 0, 0, 0.7, P.mid, 0.4) + `<path d="M44 76.4H76" stroke="${P.sky}" stroke-width=".6"/>` },
        {
          d: front, fill: P.mid,
          inner: k.sh(front, 0, 0, 1, 0, 0, 0.9, P.night, 0.5) + `<path d="M36 79H44V92H36Z" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.55, 0)}"/>` + quilt +
            `<path d="M36.6 80.2H83.4" stroke="${P.sky}" stroke-width=".6"/>` + k.sh('M36 86H84V92H36Z', 0, 0, 0, 1, 0, 0.7, P.night, 0.3),
        },
      ], 0.7) +
      `<path d="M54 79.4L60 84.8L66 79.4Z" fill="${P.night}"/>` +
      k.draw([{ d: neck, fill: P.blue, inner: k.sh(neck, 0, 0, 1, 1, 0, 0.8, P.mid, 0.4) + `<path d="M51.6 79.8L60 87.6" stroke="${P.sky}" stroke-width=".5"/>` }], 0.45) +
      `<path d="${band}" fill="${P.sky1}"/>` + k.sh(band, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M36.6 87.4H83.4" stroke="#fff" stroke-width=".6"/><path d="${band}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
      `<g transform="translate(0 -4.6)">` +
      k.floor(60, 77.6, 24, 3, P.night) +
      k.draw([
        { d: brim, fill: NAR, inner: k.sh(brim, 0, 0, 1, 1, 0, 0.9, NAR_D, 0.5) + `<path d="M35.6 70C42 67.8 50 67.2 57 67.2" fill="none" stroke="${NAR_L}" stroke-width=".8" stroke-linecap="round"/>` },
        {
          d: `${earL} ${earR}`, fill: NAR,
          inner: k.sh(`${earL} ${earR}`, 0, 0, 1, 0, 0, 0.8, NAR_D, 0.45) + hair(45, 50, 46, 44, 47.4, 39.6, 0.7, NAR_L) + hair(75, 50, 74, 44, 72.6, 39.6, 0.5, NAR_D) +
            `<path d="M46 47.6C47 44 48.4 41.6 49.6 40.4M74 47.6C73 44 71.6 41.6 70.4 40.4" fill="none" stroke="${NAR_D}" stroke-width=".5"/>`,
        },
        {
          d: dome, fill: NAR,
          inner:
            k.sh('M62 40C74 46 80 56 80 72H90V40Z', 0, 0, 1, 0, 0, 0.95, NAR_D, 0.5) + k.sh('M36 64H84V70H36Z', 0, 0, 0, 1, 0, 0.6, NAR_D, 0.35) +
            `<path d="M36 42H50V70H36Z" fill="${k.lin(NAR_L, 0, 0, 1, 0, 0.75, 0)}"/>` +
            hair(43.4, 64, 42.4, 54, 48, 47, 1.2, '#fff', 0.8) + hair(49, 64, 48.4, 56, 51.6, 50, 0.5, NAR_L) +
            hair(47.6, 48.4, 46.6, 58, 47.6, 68, 0.5, NAR_D, 0.8) + hair(72.4, 48.4, 73.4, 58, 72.4, 68, 0.5, NAR_D, 0.8),
        },
        { d: rib, fill: NAR, line: 0.35, inner: k.sh(rib, 0, 0, 1, 0, 0, 0.9, NAR_D, 0.45) + `<path d="M57.4 44V68" stroke="${NAR_L}" stroke-width=".7"/>` },
        { d: peak, fill: NAR, inner: k.sh(peak, 0, 0, 0, 1, 0, 0.9, NAR_D, 0.5) + `<path d="M45 74.6C52 76.6 68 76.6 75 74.6" fill="none" stroke="${NAR_D}" stroke-width=".45"/>` },
      ], 0.75) +
      rivet(41.6, 66.4) + rivet(78.4, 66.4) +
      k.draw([{ d: badge, fill: P.gold, inner: k.sh(badge, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M54.6 51.8H65.4V56.8C65.4 60.2 62.8 62.2 60 63.2C57.2 62.2 54.6 60.2 54.6 56.8Z" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.5) +
      `<g fill="${NAR_D}" stroke="${P.ink}" stroke-width=".25"><path d="${ellipse(60, 58.4, 2.6, 2)}"/><path d="${ellipse(56.6, 55.2, 0.95, 1.25)}"/><path d="${ellipse(58.8, 53.8, 0.95, 1.3)}"/><path d="${ellipse(61.2, 53.8, 0.95, 1.3)}"/><path d="${ellipse(63.4, 55.2, 0.95, 1.25)}"/></g>` +
      `<circle cx="55.8" cy="51.8" r=".5" fill="${P.goldL}"/><circle cx="64.2" cy="51.8" r=".5" fill="${P.goldL}"/>` +
      `</g>` +
      sparkle(46.4, 37.4, 2.4, '#fff') + sparkle(88, 36, 2) + sparkle(31, 44, 1.6) +
      k.defs()
    )
  },

  // ── Antibombas ─────────────────────────────────────────────────────

  // Cinco desactivadas: el alicate acaba de cortar el cable rojo; el reloj se quedó en un segundo.
  'Cable rojo': (u) => {
    const k = kit(u)
    const box = roundRect(23.6, 55, 45.4, 75, 2.4)
    const screen = roundRect(26.4, 58, 42.6, 66, 1)
    const wire = (d: string, c: string, dk: string) => rod(d, c, 2.6, '#fff') + `<path d="${d}" fill="none" stroke="${dk}" stroke-width=".7" stroke-linecap="round" transform="translate(.45 .55)" opacity=".6"/>`
    return (
      fondo(k) +
      escenario(k, 60, 62, 33) +
      k.floor(36, 76.4, 12, 1.8, NAR_D) +
      wire('M45 72C56 73 60 84 72 84.4C82 84.8 88 78 99 74', P.sky, P.mid) +
      wire('M45 65C51 65 55 67.4 60.4 70.6', P.red, P.wine) +
      wire('M67.4 73.6C74 76.6 80 73.6 86 69.4C90 66.6 95 66.4 99 68', P.red, P.wine) +
      cutEnd(61, 71, 31) + cutEnd(67, 73.4, 205) +
      k.draw([{
        d: box, fill: P.mid,
        inner: k.sh(box, 0, 0, 1, 1, 0, 0.9, P.night, 0.5) + `<path d="M23 54H30V76H23Z" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.5, 0)}"/>` + `<path d="M24.4 70H44.6" stroke="${P.night}" stroke-width=".5"/>`,
      }], 0.7) +
      `<path d="${screen}" fill="${HIERRO_D}" stroke="${P.ink}" stroke-width=".5"/>` + k.shade(screen, k.rad(NAR, 0.5, 0.5, 0.6, 0.5, 0), NAR, 0.3) +
      `<text x="34.5" y="64.6" ${GEORGIA} font-weight="700" font-size="6" fill="${NAR_L}" text-anchor="middle">0:01</text>` +
      [28, 33, 38].map((x) => `<circle cx="${x}" cy="72.4" r="1" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/><path d="M${f(x - 0.6)} 72.4H${f(x + 0.6)}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<circle cx="43.2" cy="72.4" r=".9" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<g transform="translate(73.4 61.6) rotate(-42)">` + cutters(k, 11) + `</g>` +
      hair(56, 66, 54.6, 63.4, 55, 60.4, 0.6, P.goldD) + hair(64.6, 76, 66.6, 78.6, 66.4, 81.4, 0.6, P.goldD) +
      sparkle(63.6, 66.6, 2.2, P.goldL) + sparkle(86, 40, 2) + sparkle(36, 84, 1.4) +
      k.defs()
    )
  },

  // Veinte desactivadas: el casco de la brigada, con el visor que refleja la bomba y el cuello acolchado.
  'Brigada antibombas': (u) => {
    const k = kit(u)
    const shell = 'M37.4 64C35.4 44 44.4 27.6 60 27.6C75.6 27.6 84.6 44 82.6 64L81.4 76.4H38.6Z'
    const frame = 'M40.2 45.4C40.2 42 43 40.2 46.4 40.2H73.6C77 40.2 79.8 42 79.8 45.4L78.8 68.8C78.6 72.2 76 74 72.6 74H47.4C44 74 41.4 72.2 41.2 68.8Z'
    const visor = 'M42.2 45.8C42.2 43.6 44.2 42.2 46.6 42.2H73.4C75.8 42.2 77.8 43.6 77.8 45.8L76.9 68.4C76.7 70.6 74.9 72 72.5 72H47.5C45.1 72 43.3 70.6 43.1 68.4Z'
    const brow = 'M39 42.6C42.4 34.6 77.6 34.6 81 42.6L80.6 45.4C76 40.4 44 40.4 39.4 45.4Z'
    const pod = (x: number) => ellipse(x, 58.4, 3.8, 9.6)
    const lamp = roundRect(54.4, 26.6, 65.6, 31.6, 2)
    const armor = 'M20 108C20 90 27 79 37.6 72.6C41 80.6 49 85 60 85C71 85 79 80.6 82.4 72.6C93 79 100 90 100 108Z'
    const plate = 'M45.4 89C45.4 87.2 46.8 86.2 48.6 86.2H71.4C73.2 86.2 74.6 87.2 74.6 89V108H45.4Z'
    const quilt = [27, 32.4, 37.8, 82.2, 87.6, 93].map((x) => hair(x + (60 - x) * 0.06, 78 + Math.abs(x - 60) * 0.12, x - (60 - x) * 0.02, 94, x - (60 - x) * 0.06, 108, 0.6, P.night, 0.75)).join('')
    // Reflejo en el visor: la ventana del cuarto, la bomba (achatada por la curva) con su chispa, y el naranja del piso.
    const refl =
      `<path d="M45 44H55L47.4 66H43.4Z" fill="#fff" opacity=".7"/><path d="M57.6 44H61.4L53.8 66H50Z" fill="#fff" opacity=".4"/>` +
      `<g transform="translate(66 61.4) rotate(-8) scale(1.2 .9)" opacity=".85"><circle cx="0" cy="0" r="4.6" fill="${P.night}"/><path d="M1.8 -3.8L3.6 -6L5 -4.8L3.4 -2.8Z" fill="${P.night}"/><path d="M4.4 -5.4C6 -7.6 8.4 -7.2 9.4 -9.4" fill="none" stroke="${P.night}" stroke-width=".8" stroke-linecap="round"/><path d="M-3.4 -1.2A3.8 3.8 0 0 1 -1 -3.6" fill="none" stroke="${P.sky}" stroke-width=".6" stroke-linecap="round"/></g>` +
      sparkle(77.4, 50.6, 2.8, NAR_L) +
      `<path d="M42 66C52 70 68 70 78 66V73H42Z" fill="${NAR}" opacity=".5"/>`
    return (
      fondo(k) +
      escenario(k, 60, 58, 33) +
      k.draw([{
        d: armor, fill: P.mid,
        inner:
          k.sh(armor, 0, 0, 1, 0, 0, 0.9, P.night, 0.5) + `<path d="M18 70H34V108H18Z" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.55, 0)}"/>` + quilt +
          `<path d="M38 74C42 82 50 86.4 60 86.4C70 86.4 78 82 82 74" fill="none" stroke="${P.sky}" stroke-width=".7"/>`,
      }], 0.8) +
      k.draw([{
        d: plate, fill: P.blue,
        inner: k.sh(plate, 0, 0, 1, 0, 0, 0.85, P.mid, 0.5) + `<path d="M45.4 90.4H74.6V94H45.4Z" fill="${NAR}"/><path d="M45.4 91.6H74.6" stroke="${P.paper}" stroke-width=".8"/>` +
          `<path d="M45.4 90.4H74.6M45.4 94H74.6M45.4 99.4H74.6" stroke="${P.ink}" stroke-width=".4"/>` + hair(47.6, 88, 54, 87.4, 60, 87.6, 0.6, P.sky1, 0.8),
      }], 0.6) +
      k.draw([
        { d: pod(36.6), fill: P.mid, inner: k.sh(pod(36.6), 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + [52, 55, 58, 61, 64].map((y) => `<path d="M35 ${y}H38.6" stroke="${P.night}" stroke-width=".7" stroke-linecap="round"/>`).join('') },
        { d: pod(83.4), fill: P.mid, inner: k.sh(pod(83.4), 0, 0, 1, 0, 0.3, 0.95, P.night, 0.5) + [52, 55, 58, 61, 64].map((y) => `<path d="M81.6 ${y}H85.2" stroke="${P.night}" stroke-width=".7" stroke-linecap="round"/>`).join('') },
        {
          d: shell, fill: P.mid,
          inner:
            k.sh(shell, 0, 0, 1, 1, 0, 0.9, P.night, 0.55) + `<path d="M34 28H48V78H34Z" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.6, 0)}"/>` +
            hair(40, 56, 40, 42, 49, 32.6, 1.1, '#fff', 0.7) + hair(80.4, 46, 81.6, 56, 81, 68, 0.6, P.night),
        },
      ], 0.8) +
      k.draw([{ d: lamp, fill: P.sky2, inner: k.sh(lamp, 0, 0, 1, 0, 0, 0.8, P.mid, 0.4) }], 0.45) +
      `<circle cx="60" cy="29.1" r="1.8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><circle cx="59.5" cy="28.6" r=".6" fill="#fff"/>` +
      k.draw([{ d: brow, fill: P.mid, inner: k.sh(brow, 0, 0, 1, 0, 0, 0.8, P.night, 0.45) + `<path d="M41 41.6C46 36.6 74 36.6 79 41.6" fill="none" stroke="${P.sky}" stroke-width=".6"/>` }], 0.5) +
      k.draw([{ d: frame, fill: P.night, inner: k.sh(frame, 0, 0, 1, 1, 0, 0.6, '#0B1230', 0.4) + [[42.4, 44], [77.6, 44], [42.8, 70], [77.2, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".6" fill="${P.sky}"/>`).join('') }], 0.6) +
      `<path d="${visor}" fill="${P.sky}"/>` +
      k.clip(visor, `<path d="M40 40H80V74H40Z" fill="${k.lin(P.mid, 0, 0, 0, 1, 0.15, 0.9)}"/>` + k.sh(visor, 0, 0, 1, 1, 0, 0.55, P.night, 0.4) + refl) +
      `<path d="${visor}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      sparkle(32, 36, 2.2) + sparkle(89, 38, 1.6) +
      k.defs()
    )
  },

  // Sesenta desactivadas: la bomba de hierro, con la mecha apretada por un clip y apagada con un chicle.
  'Gato MacGyver': (u) => {
    const k = kit(u)
    const R = 20, bx = 52, by = 69, ang = 34
    const tipX = bx + 1.34 * R * Math.sin((ang * Math.PI) / 180), tipY = by - 1.34 * R * Math.cos((ang * Math.PI) / 180)
    const fd = `M${f(tipX)} ${f(tipY)}C${f(tipX + 1.6)} ${f(tipY - 5.8)} ${f(tipX + 8)} ${f(tipY - 9.2)} ${f(tipX + 13.6)} ${f(tipY - 7.8)}C${f(tipX + 19)} ${f(tipY - 6.4)} ${f(tipX + 21)} ${f(tipY - 1.8)} ${f(tipX + 19.6)} ${f(tipY + 3.6)}`
    const gx = tipX + 19.4, gy = tipY + 5
    const gum = 'M-3.4 .4C-3.8 -2 -1.6 -3.6 .6 -3.2C2.8 -3 4 -1.2 3.6 .8C3.4 2.6 1.6 3.6 -.4 3.4C-2.2 3.2 -3.2 2 -3.4 .4Z'
    return (
      fondo(k) +
      k.sun(56, 58, 16, 48, 28, false) +
      k.shade(ellipse(55, 64, 30, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(48, 100, 28, 92, 25, 64, 8) + laurel(72, 100, 92, 92, 95, 64, 8, true) +
      k.floor(54, 90, 21, 3, NAR_D) +
      `<g transform="translate(${bx} ${by})">` + bomb(k, R, ang, true) + `</g>` +
      fuse(fd) +
      // El clip aprieta la mecha en lo alto de la curva y el chicle tapa la punta.
      `<g transform="translate(${f(tipX + 11.6)} ${f(tipY - 12.2)}) rotate(78) scale(1.12)">` + rod(CLIP, P.sky1, 0.7, '#fff') + `</g>` +
      `<g transform="translate(${f(gx)} ${f(gy)}) rotate(-10) scale(1.3)">` +
      k.draw([{ d: gum, fill: CHICLE, inner: k.sh(gum, 0, 0, 1, 1, 0, 0.9, CHICLE_D, 0.5) + `<path d="M-1.6 -1.6C-.6 -2.4 .8 -2.4 1.6 -1.6" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` + hair(-2, 1.4, 0, 2.2, 2.2, 1, 0.4, CHICLE_D) }], 0.45) +
      `</g>` +
      hair(gx - 1, gy + 3.6, gx - 1.6, gy + 6, gx - 0.6, gy + 8.4, 0.7, CHICLE_D) + `<circle cx="${f(gx - 0.6)}" cy="${f(gy + 8.6)}" r=".7" fill="${CHICLE}" stroke="${CHICLE_D}" stroke-width=".3"/>` +
      hair(gx + 2.4, gy - 3.4, gx + 6.4, gy - 6.6, gx + 4, gy - 11, 0.8, P.blue, 0.7) + hair(gx + 0.4, gy - 4, gx + 1.6, gy - 7.6, gx - 0.6, gy - 10.4, 0.55, P.blue, 0.55) +
      sparkle(38.6, 52, 2.6, '#fff') + sparkle(30, 38, 2) + sparkle(88, 70, 1.8) +
      k.defs()
    )
  },

  // ── Kabum ──────────────────────────────────────────────────────────

  // Tres explosiones: el gato atigrado sentado de espaldas, con el pelo parado y chamuscado, y el humito que sube.
  'Pelo chamuscado': (u) => {
    const k = kit(u)
    const body = 'M60 55.4C69.4 55.4 73.6 62 75.6 70C78.4 78 84 85.6 82.4 92C80.8 96.6 72 98.6 60 98.6C48 98.6 39.2 96.6 37.6 92C36 85.6 41.6 78 44.4 70C46.4 62 50.6 55.4 60 55.4Z'
    const head = 'M60 37.4C67.6 37.4 72.4 42.4 72.4 48.2C72.4 54.4 67 58.6 60 58.6C53 58.6 47.6 54.4 47.6 48.2C47.6 42.4 52.4 37.4 60 37.4Z'
    const earL = 'M48.6 44.4L48.8 31.4C49 30.4 49.8 30.2 50.4 30.8L58.4 38.6Z'
    const earR = 'M71.4 44.4L71.2 31.4C71 30.4 70.2 30.2 69.6 30.8L61.6 38.6Z'
    const tail = taper(76.4, 90, 92, 88, 89, 70, 5.8, 4.2)
    const tailTip = taper(89, 70, 87.6, 64, 84.6, 61.4, 4.2, 3.6)
    // Rayas atigradas: chevrones que bajan desde el lomo.
    const stripes = [62, 67, 72.4, 78, 84, 90].map((y, i) => {
      const w = 9 + i * 2.6
      return hair(60, y, 60 - w * 0.5, y + 1.6, 60 - w, y + 4.6, 1.5, NAR_D, 0.85) + hair(60, y, 60 + w * 0.5, y + 1.6, 60 + w, y + 4.6, 1.5, NAR_D, 0.85)
    }).join('')
    // El pelo parado: mechones que salen del contorno, con las puntas quemadas.
    const spikes = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n: number, l: number) =>
      Array.from({ length: n }, (_, i) => {
        const a = ((a0 + ((a1 - a0) * i) / (n - 1)) * Math.PI) / 180, jit = 0.7 + 0.3 * Math.abs(Math.sin(i * 2.1 + cx)), bend = (i % 2 ? 1 : -1) * 0.9
        const x0 = cx + Math.cos(a) * rx * 0.86, y0 = cy + Math.sin(a) * ry * 0.86, x1 = cx + Math.cos(a) * (rx + l * jit), y1 = cy + Math.sin(a) * (ry + l * jit)
        return hair(x0, y0, (x0 + x1) / 2 - Math.sin(a) * bend, (y0 + y1) / 2 + Math.cos(a) * bend, x1, y1, 1, i % 3 === 1 ? NAR_D : HOLLIN, 0.95) +
          (i % 4 === 0 ? `<path d="M${f(x1)} ${f(y1)}a.7 .7 0 1 ${i % 2} ${f(Math.sin(a) * 1)} ${f(-Math.cos(a) * 1)}" fill="none" stroke="${HOLLIN}" stroke-width=".4"/>` : '')
      }).join('')
    return (
      fondo(k) +
      escenario(k, 60, 60, 33) +
      k.floor(60, 98, 26, 3.2, NAR_D) +
      spikes(60, 47.6, 12.4, 10.8, 190, 350, 25, 5.2) + spikes(60, 74, 17.6, 19, 198, 238, 8, 4.4) + spikes(60, 74, 17.6, 19, 302, 342, 8, 4.4) +
      k.draw([
        { d: `${tail} ${tailTip}`, fill: NAR, inner: k.sh(`${tail} ${tailTip}`, 0, 0, 1, 0, 0, 0.9, NAR_D, 0.5) + hair(80, 92.6, 85.4, 90.6, 88.6, 86.6, 1.4, NAR_D) + hair(88.4, 80.6, 90.6, 77, 89.6, 73, 1.4, NAR_D) + k.sh(tailTip, 0, 1, 0, 0, 0, 1, HOLLIN, 0.5) },
        {
          d: body, fill: NAR,
          inner:
            k.sh(body, 0, 0, 1, 0, 0.1, 0.9, NAR_D, 0.5) + `<path d="M36 56H50V100H36Z" fill="${k.lin(NAR_L, 0, 0, 1, 0, 0.6, 0)}"/>` + stripes +
            hair(60, 57, 60.6, 76, 60, 96, 0.6, NAR_D, 0.7) + k.sh(body, 0, 0, 0, 1, 0, 0.6, NAR_D, 0.35) + k.sh(body, 0, 0.35, 0, 0, 0, 0.75, HOLLIN, 0.35),
        },
        { d: `${earL} ${earR}`, fill: NAR, inner: k.sh(`${earL} ${earR}`, 0, 0.55, 0, 0, 0, 0.95, HOLLIN, 0.5) + `<path d="M50.4 41.6L50.6 34.4M69.6 41.6L69.4 34.4" stroke="${NAR_D}" stroke-width=".6"/>` },
        { d: head, fill: NAR, inner: k.sh(head, 0, 0, 1, 0, 0, 0.9, NAR_D, 0.45) + `<path d="M46 37H54V60H46Z" fill="${k.lin(NAR_L, 0, 0, 1, 0, 0.6, 0)}"/>` + hair(56.6, 39.4, 56, 44, 57, 48.6, 1.2, NAR_D, 0.85) + hair(60, 38.6, 60.4, 44, 60, 49.6, 1.3, NAR_D, 0.85) + hair(63.4, 39.4, 64, 44, 63, 48.6, 1.2, NAR_D, 0.85) + hair(50, 49, 51, 52, 53.6, 54.6, 1, NAR_D, 0.7) + hair(70, 49, 69, 52, 66.4, 54.6, 1, NAR_D, 0.7) + k.sh(head, 0, 0.6, 0, 0, 0, 0.8, HOLLIN, 0.4) },
      ], 0.75) +
      `<g fill="none" stroke-linecap="round">${[[44.4, 77.6, 41.4, 80], [75.6, 77.6, 78.6, 80]].map(([x0, y0, x1, y1]) => `<path d="M${x0} ${y0}Q${f((x0 + x1) / 2)} ${f(y0 - 1.6)} ${x1} ${y1}" stroke="${NAR_D}" stroke-width=".6"/>`).join('')}</g>` +
      hair(57.4, 33.4, 52.6, 28.6, 56, 23.4, 1.2, P.blue, 0.75) + hair(63.6, 33.4, 68.4, 28.6, 64.6, 23, 1, P.blue, 0.7) + hair(60.4, 30.6, 61.6, 26, 59.6, 21.4, 0.7, P.blue, 0.55) +
      `<circle cx="41.6" cy="62" r=".55" fill="${P.goldL}"/><circle cx="78.6" cy="60.6" r=".55" fill="${P.goldL}"/>` +
      sparkle(38, 42, 1.6, P.goldL) + sparkle(84, 44, 1.4, P.goldL) + sparkle(31, 70, 1.8, '#fff') +
      k.defs()
    )
  },

  // Diez explosiones: el gato atigrado de perfil, con la cara negra de hollín, el bigote enrulado y el ojo a media asta.
  'Cara tiznada': (u) => {
    const k = kit(u)
    const head =
      'M34.4 59.4C35.4 55.6 37.6 52.4 40.6 50.2C43 48.4 45.6 46.2 47.6 43.6L50.6 26.6C51 25.6 51.8 25.6 52.4 26.2L63.4 37.6' +
      'C64.6 37.2 65.8 37 67 37.2L70.4 25.6C70.8 24.8 71.6 24.8 72 25.4L79.4 40.4C86 45 89.4 53 90.4 62C91.4 72 94 82 100 92' +
      'L100 112H58C57 100 55.4 88 52.4 80C50.6 76.6 48 74.4 45.4 73.6C42.6 72.8 40 71.4 39 69.4C38.4 68.2 38.2 67.2 38.6 66.4' +
      'C36.6 66.2 35 65 34.6 63.4C34.2 62 34 60.6 34.4 59.4Z'
    const earIn = 'M49.6 42.6L51.6 30.4L60.6 39.2C56.6 39.4 52.6 40.6 49.6 42.6Z'
    const earInF = 'M70.8 30L71.6 28.4L77.4 39.2C75 38.6 72.6 38.4 70.8 38.8Z'
    const eye = 'M42.4 54.6C44 51.6 47.6 50.4 51.4 51.4C50.2 54.6 46.6 56.4 42.4 54.6Z'
    const lid = 'M42 54.4C43.6 50.8 47.6 49.4 51.8 51.2L51.6 52.8C47.6 52 44.4 52.8 42.6 55Z'
    const nose = 'M34.4 59.4C35.6 58.6 37.2 59 37.6 60.2C37 61.6 35.6 62.2 34.6 61.6C34.2 61 34.2 60.2 34.4 59.4Z'
    const furOn = (pts: number[][], c: string, w: number, op: number) => pts.map(([x0, y0, cx, cy, x1, y1]) => hair(x0, y0, cx, cy, x1, y1, w, c, op)).join('')
    const sootFur = [[56, 46, 60, 50, 62, 56], [52, 58, 57, 60, 60, 64], [44, 62, 49, 64, 52, 68], [60, 42, 66, 44, 70, 48], [64, 52, 68, 55, 70, 60], [48, 68, 53, 70, 56, 74], [70, 42, 75, 45, 78, 50]]
    const neckFur = [[82, 64, 84, 70, 83, 76], [86, 74, 88, 80, 87, 86], [74, 84, 76, 90, 75, 96], [66, 78, 67, 84, 66, 90], [78, 50, 81, 54, 82, 58], [62, 88, 63, 94, 62, 100]]
    const stripes = [[84, 52, 79, 56, 77, 62], [88, 62, 82, 66, 80, 72], [90, 72, 84, 76, 82, 82], [92, 82, 86, 86, 84, 92], [76, 74, 70, 78, 68, 84], [72, 88, 67, 90, 64, 96]]
    const whisker = (y0: number, x1: number, y1: number, c: number) =>
      hair(40, y0, (40 + x1) / 2, y0 + c, x1, y1, 0.75, P.ink) + hair(40, y0, (40 + x1) / 2, y0 + c, x1, y1, 0.45, P.white) +
      `<path d="M${x1} ${y1}c-1.2 -.2 -1.8 .8 -1.2 1.6c.6 .8 1.8 .2 1.4 -.6" fill="none" stroke="${HOLLIN}" stroke-width=".45" stroke-linecap="round"/>`
    return (
      fondo(k) +
      escenario(k, 60, 60, 33) +
      k.draw([{
        d: head, fill: NAR,
        inner:
          k.sh(head, 0, 0, 1, 0, 0.1, 0.8, NAR_D, 0.4) + furOn(stripes, NAR_D, 2, 0.9) +
          k.shade(head, k.rad(HOLLIN, 0.12, 0.34, 0.62, 1, 0), HOLLIN, 0.75) +
          `<path d="${head}" fill="${k.rad(HOLLIN, 0.1, 0.32, 0.42, 0.9, 0)}"/>` +
          `<path d="${earIn} ${earInF}" fill="#C98378"/>` + k.sh(`${earIn} ${earInF}`, 0, 0, 1, 1, 0, 0.9, HOLLIN, 0.6) +
          hair(51.4, 41.4, 52.6, 37, 55, 34, 0.5, P.paper, 0.8) + hair(53.4, 41, 55.4, 38, 58, 36.6, 0.45, P.paper, 0.7) +
          furOn(sootFur, P.mid, 0.6, 0.85) + furOn(neckFur, NAR_L, 0.7, 0.85) +
          hair(36.6, 57.2, 38.6, 53.4, 42, 50.4, 0.6, P.sky, 0.7) + hair(47.6, 45, 52, 41.6, 57, 40.6, 0.5, P.sky, 0.55),
      }], 0.8) +
      // Ojo de gato, natural, a media asta.
      `<path d="${eye}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.clip(eye, `<path d="M42 50H52V56H42Z" fill="${k.rad(P.goldD, 0.5, 0.5, 0.6, 0, 0.8)}"/><path d="M47.2 51V55.6" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/>`) +
      `<path d="${lid}" fill="${HOLLIN}" stroke="${P.ink}" stroke-width=".4"/><circle cx="45.4" cy="53.6" r=".45" fill="#fff"/>` +
      `<path d="${nose}" fill="${P.ink}"/>` +
      hair(38.8, 66.6, 41.4, 67.4, 43.4, 66.8, 0.5, P.sky, 0.8) +
      [[38.6, 63.4], [40.4, 63.8], [39.4, 65.2], [41.4, 65.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".35" fill="${P.sky}"/>`).join('') +
      whisker(63.6, 22, 58.6, -1.6) + whisker(64.4, 20.6, 64.6, 0) + whisker(65.2, 22.4, 70.6, 1.6) +
      hair(44, 49, 41, 45, 38, 44, 0.6, P.ink) + hair(44, 49, 41, 45, 38, 44, 0.35, P.white) +
      // Puntas de las orejas chamuscadas y el humo.
      [[-150, 2.6], [-115, 3.2], [-80, 3.4], [-45, 2.8], [-10, 2.2]].map(([a, l]) => { const r = (a * Math.PI) / 180; return hair(51.4, 27, 51.4 + Math.cos(r) * l * 0.5 + 0.4, 27 + Math.sin(r) * l * 0.5, 51.4 + Math.cos(r) * l, 27 + Math.sin(r) * l, 0.6, HOLLIN) }).join('') +
      [[-150, 2.2], [-100, 2.8], [-60, 2.6], [-20, 2]].map(([a, l]) => { const r = (a * Math.PI) / 180; return hair(71.2, 26.2, 71.2 + Math.cos(r) * l * 0.5 + 0.4, 26.2 + Math.sin(r) * l * 0.5, 71.2 + Math.cos(r) * l, 26.2 + Math.sin(r) * l, 0.55, HOLLIN) }).join('') +
      hair(51.6, 23.4, 47, 20.4, 50.6, 16.6, 1.2, P.blue, 0.7) + hair(71.6, 22.6, 76, 19.4, 72.4, 16, 1, P.blue, 0.65) + hair(57, 30, 60, 26, 58, 21.4, 0.8, P.blue, 0.55) + hair(46.6, 26, 43, 23, 44.6, 19.6, 0.7, P.blue, 0.5) +
      sparkle(84, 40, 1.8, P.goldL) + sparkle(30, 48, 1.4, NAR) +
      k.defs()
    )
  },

  // Treinta explosiones: el hongo se ve desde la estación espacial (y tiene, apenas, orejas de gato).
  'Hongo nuclear': (u) => {
    const k = kit(u)
    const puffs: [number, number, number][] = [[60, 40, 11.4], [48.6, 44, 9], [71.4, 44, 9], [39.6, 50.4, 6.6], [80.4, 50.4, 6.6], [50, 52, 8.4], [70, 52, 8.4], [60, 52.6, 9]]
    const earL = 'M57 37.4C56 33.4 53.6 29.6 50.6 26.6C48 30.6 46.4 35.4 46 41Z'
    const earR = 'M74 41C73.6 35.4 72 30.6 69.4 26.6C66.4 29.6 64 33.4 63 37.4Z'
    const cap = puffs.map(([x, y, r]) => ellipse(x, y, r, r)).join('') + earL + earR
    const stem = 'M54.2 58C55 68 53.6 79 50.6 89H69.4C66.4 79 65 68 65.8 58Z'
    const ring = ellipse(60, 70, 11, 3.2) + Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (0.06 + i * 0.11); return ellipse(f(60 + Math.cos(a) * 10.4), f(70.4 + Math.sin(a) * 2.6), 2, 2) }).join('')
    const base: [number, number, number][] = [[60, 89, 8], [51, 90.4, 7.4], [69, 90.4, 7.4], [42.4, 93, 6], [77.6, 93, 6], [35, 95.6, 4.4], [85, 95.6, 4.4]]
    const baseD = base.map(([x, y, r]) => ellipse(x, y, r, r)).join('') + 'M30 96H90V97.4H30Z'
    const curl = ([x, y, r]: [number, number, number], c: string) => hair(x - r * 0.62, y + r * 0.42, x + r * 0.1, y + r * 0.86, x + r * 0.72, y + r * 0.1, 0.6, c, 0.85) + `<path d="M${f(x + r * 0.3)} ${f(y + r * 0.2)}a${f(r * 0.22)} ${f(r * 0.22)} 0 1 0 ${f(-r * 0.3)} ${f(-r * 0.2)}" fill="none" stroke="${c}" stroke-width=".45" opacity=".8"/>`
    const station =
      `<g transform="translate(81.6 35.4) rotate(-18)">` +
      `<path d="M-9.4 -.3H9.4" stroke="${P.ink}" stroke-width="1"/><path d="M-9.4 -.3H9.4" stroke="${P.sky1}" stroke-width=".4"/>` +
      [-8.6, -4.8, 4.8, 8.6].map((x) => `<rect x="${f(x - 1.6)}" y="-3.4" width="3.2" height="6.2" fill="${P.blue}" stroke="${P.ink}" stroke-width=".35"/><path d="M${f(x)} -3.4V2.8M${f(x - 1.6)} -.3H${f(x + 1.6)}" stroke="${P.sky1}" stroke-width=".2"/>`).join('') +
      `<rect x="-2.2" y="-1.4" width="4.4" height="2.4" rx=".8" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><circle cx="0" cy="-.2" r=".45" fill="${P.gold}"/></g>`
    return (
      k.night() +
      k.sun(60, 50, 14, 50, 28, false) +
      k.shade(ellipse(60, 52, 34, 32), k.rad(NAR, 0.5, 0.5, 0.5, 0.75, 0), NAR, 0.45) +
      k.shade(ellipse(60, 48, 22, 18), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      station + sparkle(36, 30, 1.4, '#fff') + sparkle(30, 44, 1, '#fff') +
      k.draw([{
        d: baseD, fill: P.sky2,
        inner: k.sh(baseD, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + `<path d="M28 82H92V92C70 88 50 88 28 92Z" fill="${k.lin(NAR_L, 0, 0, 0, 1, 0.8, 0)}"/>` + base.map((p) => curl(p, P.mid)).join(''),
      }, {
        d: stem, fill: P.goldL,
        inner: k.sh(stem, 0, 0, 1, 0, 0, 0.9, NAR, 0.5) + k.sh(stem, 0, 0, 0, 1, 0, 0.6, NAR_D, 0.35) +
          hair(57, 60, 56.4, 74, 54.4, 88, 0.6, NAR, 0.9) + hair(62.4, 60, 63, 74, 64.6, 88, 0.6, NAR_D, 0.9) + hair(56, 62, 55.6, 70, 55, 80, 0.8, '#fff', 0.7),
      }], 0.75) +
      k.draw([{ d: ring, fill: P.paper, inner: k.sh(ring, 0, 0, 1, 1, 0, 0.9, NAR, 0.5) + `<path d="${ellipse(60, 69.4, 6, 1.2)}" fill="${NAR}" opacity=".55"/>` + hair(50, 69, 54, 67.6, 58, 67.4, 0.6, '#fff', 0.9) }], 0.55) +
      k.draw([{
        d: cap, fill: P.goldL,
        inner:
          `<path d="${cap}" fill="${k.rad(P.paper, 0.4, 0.2, 0.55, 0.9, 0)}"/>` +
          k.sh(cap, 0, 0, 0, 1, 0.1, 1, NAR, 0.5) + k.sh(cap, 0, 0, 1, 0, 0, 0.6, NAR_D, 0.4) +
          `<path d="M36 56C46 63 74 63 84 56V64H36Z" fill="${NAR_D}" opacity=".55"/>` +
          puffs.map((p) => curl(p, NAR_D)).join('') +
          hair(46, 40, 50, 34, 56, 31.6, 0.9, '#fff', 0.85) + hair(50.4, 30, 51, 33, 52.6, 35.6, 0.5, NAR_D) + hair(69.6, 30, 69, 33, 67.4, 35.6, 0.5, NAR_D),
      }], 0.8) +
      sparkle(60, 26, 2.4, '#fff') + sparkle(86, 70, 1.4, P.goldL) + sparkle(32, 66, 1.4, P.goldL) +
      k.defs()
    )
  },
}
