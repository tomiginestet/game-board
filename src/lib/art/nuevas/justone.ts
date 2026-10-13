// Just One, el de la palabra única y las pistas que se borran, en clave heroica. Manda el ámbar de la ficha del juego
// (#F59F00): el papel lleva su grano amarillo, como de lápiz negro de escuela, y los dorados se vuelven miel. Nada de
// caras: los gemelos son dos tazas iguales y el que escribe es un lápiz.
import { f } from '../helpers'
import { along, ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** Ámbar de la ficha de Just One, con su sombra (miel tostada), su luz y un amarillo pálido de papel. */
const JO = '#F59F00', JO_D = '#A86200', JO_L = '#FFD36E', JO_XL = '#FFF2CF'
/** Cobre del alambre de las bobinas. */
const COPPER = '#C8743A', COPPER_D = '#7E3F17'
/** Pizarra de la pizarrita y negro de la baquelita. */
const SLATE = '#2E3B3A', BAKE = '#2A2320'

/** Papel del día con el borde granulado en el ámbar de la ficha. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#F8D27C', 0.5, 0.46, 0.7, 0, 1), '#EDB341', 0.5)

/** Escenario ámbar: un disco amarillo pálido con el borde granulado. */
const stageY = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${JO_XL}"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(JO_L, 0.5, 0.5, 0.5, 0, 1), JO_L, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${JO}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Resplandor dorado suave. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7, c = P.goldL) => k.shade(ellipse(cx, cy, rx, ry), k.rad(c, 0.5, 0.5, 0.5, a, 0), c, 0.45)

/** Cordón (cable, soga, alambre): tinta por fuera, color y un brillo fino. */
const cord = (d: string, c: string, w = 1.2, hi = '#fff') =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 1.9)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" opacity=".55" transform="translate(-.25 -.25)"/>`

/** Hexágono de punta arriba. */
const hexD = (cx: number, cy: number, r: number) =>
  'M' + Array.from({ length: 6 }, (_, i) => { const a = ((-90 + i * 60) * Math.PI) / 180; return `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}` }).join('L') + 'Z'

/** Lápiz negro de escuela, amarillo, de punta en (0,0) hacia la izquierda y largo `len`. */
function pencil(k: Kit, len: number) {
  const wood = 'M0 0L9 -2.9V2.9Z'
  const body = `M9 -2.9H${len - 7}V2.9H9Z`
  const ferrule = `M${len - 7} -3.1H${len - 2.6}V3.1H${len - 7}Z`
  const eraser = `M${len - 2.6} -2.9H${len}C${len + 1.6} -2.9 ${len + 1.6} 2.9 ${len} 2.9H${len - 2.6}Z`
  return (
    k.draw([
      { d: wood, fill: '#F1D2A6', inner: k.sh(wood, 0, 0, 0, 1, 0, 0.7, P.brown, 0.4) + `<path d="M0 0L3.4 -1.1V1.1Z" fill="${P.ink}"/>` },
      {
        d: body, fill: JO,
        inner:
          `<path d="M9 -2.9H${len}V-1H9Z" fill="${JO_L}"/>` + `<path d="M9 1H${len}V2.9H9Z" fill="${JO_D}" opacity=".7"/>` +
          `<path d="M9 -1H${len - 7}M9 1H${len - 7}" stroke="${JO_D}" stroke-width=".35"/>` + hair(11, -2, len * 0.5, -2.3, len - 9, -2, 0.5, '#fff', 0.8),
      },
      { d: ferrule, fill: P.sky1, inner: k.sh(ferrule, 0, 0, 0, 1, 0, 0.9, P.blue, 0.5) + `<path d="M${len - 5.6} -3.1V3.1M${len - 4} -3.1V3.1" stroke="${P.blue}" stroke-width=".4"/>` },
      { d: eraser, fill: '#EE8E8A', inner: k.sh(eraser, 0, 0, 0, 1, 0, 0.8, '#B5534F', 0.4) },
    ], 0.55) +
    `<path d="M9 -2.9C8 -1.6 8 1.6 9 2.9" fill="none" stroke="${P.ink}" stroke-width=".4"/>`
  )
}

/** Abeja de verdad vista desde arriba, mirando hacia arriba, centrada en el tórax (0,0). */
function bee(k: Kit) {
  const wing = 'M0 0C-3 -4 -9 -6 -12 -4C-13.6 -2.6 -12 0 -8 .8C-5 1.4 -2 1 0 0Z'
  const wing2 = 'M0 1C-2 1.6 -6 3.6 -7 5.6C-7.4 7 -5.6 7.4 -4 6.4C-2 5 -.6 3 0 1Z'
  const abd = 'M0 1.6C3 1.6 4.2 5 4 8.6C3.8 12 2 14.6 0 15.6C-2 14.6 -3.8 12 -4 8.6C-4.2 5 -3 1.6 0 1.6Z'
  const leg = (s: number) => `<path d="M${s * 1.6} -.4L${s * 5} -2.4L${s * 6.6} -5M${s * 2} 1L${s * 5.6} 2L${s * 7} 4.6M${s * 1.6} 2.4L${s * 4.4} 6L${s * 5} 9.4" fill="none" stroke="${P.ink}" stroke-width=".5" stroke-linecap="round" stroke-linejoin="round"/>`
  return (
    leg(1) + leg(-1) +
    k.draw([
      { d: abd, fill: JO, inner: `<path d="M-5 6H5V7.8H-5ZM-5 9.8H5V11.6H-5ZM-5 13.4H5V15H-5Z" fill="${BAKE}"/>` + k.sh(abd, 0, 0, 1, 0, 0, 0.8, JO_D, 0.45) + hair(-1.6, 4, -2.2, 8, -1.6, 12, 0.5, '#fff', 0.7) },
      { d: ellipse(0, 0, 2.8, 2.6), fill: '#8A5A1E', inner: k.sh(ellipse(0, 0, 2.8, 2.6), 0, 0, 1, 1, 0, 0.9, BAKE, 0.5) + hair(-1.6, -1.4, -0.4, -2.2, 1, -1.6, 0.5, JO_L) },
      { d: ellipse(0, -3.6, 1.9, 1.5), fill: BAKE },
    ], 0.45) +
    `<ellipse cx="-1.5" cy="-3.9" rx=".6" ry=".9" fill="#5A4636"/><ellipse cx="1.5" cy="-3.9" rx=".6" ry=".9" fill="#5A4636"/>` +
    `<path d="M-.6 -4.8C-1.4 -6.4 -2.6 -7.2 -3.6 -7.2M.6 -4.8C1.4 -6.4 2.6 -7.2 3.6 -7.2" fill="none" stroke="${P.ink}" stroke-width=".45" stroke-linecap="round"/>` +
    [1, -1].map((s) => `<g transform="scale(${s} 1)"><path d="${wing}" fill="#fff" opacity=".75" stroke="${P.ink}" stroke-width=".4"/><path d="${wing2}" fill="#fff" opacity=".65" stroke="${P.ink}" stroke-width=".35"/><path d="M-1 0C-4 -2 -7 -3.4 -10.6 -3.4M-4 -2.4L-6 .4" fill="none" stroke="${P.blue}" stroke-width=".3"/></g>`).join('')
  )
}

export const JUSTONE_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Sintonía ───────────────────────────────────────────────────────

  // Nueve de trece: hay interferencia, pero se escucha. La radio a galena: la bobina de cobre y el bigote de gato.
  'Radio a galena': (u) => {
    const k = kit(u)
    const top = 'M38 77.4H82L86 83H34Z', front = 'M34 83H86V88.4H34Z'
    const coil = 'M38 46.6V77C38 78.6 42.4 80 48 80C53.6 80 58 78.6 58 77V46.6Z'
    const coilTop = ellipse(48, 46.6, 10, 2.6)
    const turns = Array.from({ length: 24 }, (_, i) => {
      const y = f(50 + i * 1.12)
      return `M38 ${y}A10 2.6 0 0 0 58 ${y}`
    }).join('')
    const cup = 'M70 71.4H80L79 76.6H71Z'
    const crystal = 'M71 71.6L72.4 67.6L75 66.6L77.6 67.8L79 71.6Z'
    const post = 'M84.6 60.6H87V77.4H84.6Z'
    const knob = (x: number, y: number) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M${x - 2.2} ${y}V${y - 2}A2.2 1 0 0 1 ${x + 2.2} ${y - 2}V${y}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="${x}" cy="${y - 2}" rx="2.2" ry="1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>`
    const zig = (x: number, y: number, s: number) => `<path d="M${x} ${y}l${s * 1.6} ${-s * 2}l${s * 1.2} ${s * 3}l${s * 1.6} ${-s * 3.4}l${s * 1.2} ${s * 3}l${s * 1.4} ${-s * 2}" fill="none" stroke="${JO_D}" stroke-width=".7" stroke-linejoin="round" stroke-linecap="round"/>`
    return (
      field(k) +
      stageY(k, 60, 60, 34) +
      glow(k, 58, 56, 30, 26, 0.7) +
      // La antena: el alambre que sube y se va del cuadro.
      cord('M55 47.4C60 40 66 30 74 21', COPPER, 0.7, P.goldL) +
      k.floor(60, 85, 28, 3, JO_D) +
      k.draw([
        { d: front, fill: P.brownD, inner: k.sh(front, 0, 0, 1, 0, 0, 0.8, '#4A2A14', 0.4) + hair(36, 85.6, 60, 84.8, 84, 85.6, 0.4, P.brown) },
        { d: top, fill: P.brown, inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, P.brownD, 0.4) + hair(40, 79, 60, 78.4, 80, 79, 0.45, P.brownD, 0.8) + hair(38, 81.6, 56, 81, 74, 81.8, 0.4, P.brownD, 0.7) + hair(44, 78.2, 48, 80, 52, 81.6, 0.3, P.goldL, 0.6) },
      ], 0.7) +
      // La bobina: tubo de cartón con las vueltas de alambre de cobre.
      k.draw([
        {
          d: coil, fill: COPPER,
          inner:
            `<path d="${turns}" fill="none" stroke="${COPPER_D}" stroke-width=".45"/>` + `<path d="${turns}" fill="none" stroke="${P.goldL}" stroke-width=".3" transform="translate(-.2 -.45)" opacity=".7"/>` +
            k.sh('M48 44H60V82H48Z', 0, 0, 1, 0, 0, 0.9, COPPER_D, 0.5) + `<path d="M37 44H44V82H37Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.5, 0)}"/>` +
            `<path d="M38 46H58V49.2C54 50.8 42 50.8 38 49.2Z" fill="${JO_XL}"/><path d="M38 76.6C42 78.4 54 78.4 58 76.6V80H38Z" fill="${JO_XL}"/>` + k.sh('M38 74H58V82H38Z', 0, 0, 0, 1, 0, 0.6, JO_D, 0.3),
        },
        { d: coilTop, fill: JO_XL, inner: `<path d="${ellipse(48, 46.8, 7.6, 1.8)}" fill="${JO_D}" opacity=".5"/>` },
      ], 0.7) +
      // El cursor de sintonía: la varilla de bronce con la corredera.
      `<path d="M60.6 48.6V77" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M60.6 48.6V77" stroke="${P.gold}" stroke-width="1.2" stroke-linecap="round"/><path d="M60.2 49V76.6" stroke="${P.goldL}" stroke-width=".35"/>` +
      k.draw([{ d: 'M58.6 59H63V64H58.6Z', fill: P.gold, inner: k.sh('M58.6 59H63V64H58.6Z', 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) }], 0.45) +
      `<path d="M58.6 61.4H57.4" stroke="${P.ink}" stroke-width=".6"/><circle cx="62.6" cy="58.2" r="1.4" fill="${BAKE}" stroke="${P.ink}" stroke-width=".4"/>` +
      // El detector: la piedra de galena en su copa y el bigote de gato que la toca.
      k.draw([
        { d: post, fill: P.gold, inner: k.sh(post, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
        { d: cup, fill: P.gold, inner: k.sh(cup, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M70.4 73H79.6" stroke="${P.goldD}" stroke-width=".35"/>` },
        { d: crystal, fill: '#9AA4B4', inner: `<path d="M72.4 67.6L74.4 71.6L75 66.6ZM75 66.6L76 71.6L77.6 67.8Z" fill="#C9D1DD"/><path d="M71 71.6L72.4 67.6L74.4 71.6Z" fill="#6D7586"/>` + `<path d="M72.4 67.6L74.4 71.6M75 66.6L76 71.6M77.6 67.8L76 71.6" stroke="${P.ink}" stroke-width=".25"/>` },
      ], 0.5) +
      sparkle(73.6, 68.4, 1.4, '#fff') +
      cord('M85.8 61C83 58 78 58 76 62', P.gold, 0.7) +
      `<path d="M76 62C75.4 63.6 76.6 64 76 65.4C75.6 66.4 76.4 66.8 75.8 67.4" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
      `<ellipse cx="85.8" cy="58.8" rx="2.2" ry="1.6" fill="${BAKE}" stroke="${P.ink}" stroke-width=".45"/><path d="M84.6 58.2A1.2 .8 0 0 1 86.4 57.8" fill="none" stroke="#7A6A62" stroke-width=".45"/>` +
      // Bornes al frente.
      knob(40, 82.6) + knob(80, 82.6) +
      // Interferencia, pero se escucha.
      zig(68, 38, 1) + zig(74, 46, 0.8) +
      `<g transform="translate(84 34) rotate(12)"><ellipse cx="0" cy="0" rx="2.2" ry="1.6" transform="rotate(-24)" fill="${P.ink}"/><path d="M1.8 -.6V-9C3 -7 5.4 -6.6 5.6 -4.2" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/></g>` +
      sparkle(34, 40, 1.8, '#fff') + sparkle(88, 66, 1.4, P.goldD) +
      k.defs()
    )
  },

  // Once de trece: Radio Mitre, Radio Rivadavia, la que sea, pero la misma. La radio capilla y la onda que no se desafina.
  'Misma frecuencia': (u) => {
    const k = kit(u)
    const body = 'M40 86V52C40 35 48 25 60 25C72 25 80 35 80 52V86Z'
    const plinth = 'M37.6 85.4H82.4V90H37.6Z'
    const grille = 'M47 66V51C47 41 52.6 34 60 34C67.4 34 73 41 73 51V66Z'
    const dial = 'M50.6 69.6H69.4V76.4H50.6Z'
    const fret =
      'M53.4 66V50.6M66.6 66V50.6M60 66V51.4M53.4 51.4Q53.4 46 56.7 43.4Q60 46 60 51.4Q60 46 63.3 43.4Q66.6 46 66.6 51.4' +
      'M47.4 52.6Q50.4 50 53.4 51.4M72.6 52.6Q69.6 50 66.6 51.4M47 59H73'
    let wave = ''
    for (let i = 0; i <= 96; i++) { const x = 18 + i * 0.875; wave += (i ? 'L' : 'M') + f(x) + ' ' + f(46 + Math.sin((x - 18) * 0.42) * 5) }
    const scale = Array.from({ length: 15 }, (_, i) => `M${f(52.4 + i * 1.08)} 71.2V${i % 2 ? 72.2 : 73}`).join('')
    const knob = (x: number) => `<circle cx="${x}" cy="80.4" r="3" fill="${BAKE}" stroke="${P.ink}" stroke-width=".55"/><circle cx="${x}" cy="80.4" r="2" fill="none" stroke="#6E5E54" stroke-width=".4" stroke-dasharray=".5 .5"/><circle cx="${x - 0.8}" cy="79.6" r=".6" fill="#8C7B70"/>`
    return (
      field(k) +
      k.sun(60, 54, 20, 50, 32, false) +
      glow(k, 60, 52, 32, 30, 0.7) +
      // Dos ondas de dos radios distintas, una sobre la otra: misma frecuencia.
      cord(wave, JO, 1.6, '#fff') + `<path d="${wave}" fill="none" stroke="${P.red}" stroke-width=".55" stroke-dasharray="2 1.4" transform="translate(0 0)"/>` +
      k.floor(60, 90, 24, 2.6, JO_D) +
      k.cast([body], 2.4, 2.2, JO_D) +
      k.draw([
        { d: plinth, fill: P.brownD, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.8, '#4A2A14', 0.4) + `<path d="M38 87H82" stroke="${P.goldL}" stroke-width=".4" opacity=".6"/>` },
        {
          d: body, fill: P.brown,
          inner:
            k.sh('M62 22H84V88H62Z', 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + `<path d="M38 22H47V88H38Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.55, 0)}"/>` +
            hair(43, 50, 42.6, 66, 43.4, 82, 0.5, P.brownD) + hair(77, 50, 77.4, 66, 76.6, 82, 0.5, P.brownD) + hair(45, 36, 50, 30, 56, 28, 0.5, P.goldL, 0.8) +
            `<path d="M42.6 86V52.6C42.6 37 49.6 28 60 28C70.4 28 77.4 37 77.4 52.6V86" fill="none" stroke="${P.brownD}" stroke-width=".5"/>`,
        },
      ], 0.8) +
      k.draw([{
        d: grille, fill: JO_XL,
        inner:
          `<path d="${grille}" fill="${k.lin(JO_L, 0, 0, 0, 1, 0.3, 0.9)}"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${46 + i * 2.4} 32V67" stroke="${JO}" stroke-width=".3" opacity=".6"/>`).join('') +
          cord(fret, P.brown, 1.3, P.goldL) + `<circle cx="60" cy="40.4" r="2.4" fill="none" stroke="${P.ink}" stroke-width="2.4"/><circle cx="60" cy="40.4" r="2.4" fill="none" stroke="${P.brown}" stroke-width="1.2"/>` +
          k.sh(grille, 0, 0, 1, 1, 0, 0.6, P.brownD, 0.35),
      }], 0.5) +
      k.draw([{ d: dial, fill: JO_XL, inner: `<path d="${scale}" stroke="${P.ink}" stroke-width=".3"/>` + `<text x="60" y="75.6" ${GEORGIA} font-size="2.2" fill="${P.ink}" text-anchor="middle">550 · 790 · 1600</text>` + k.sh(dial, 0, 0, 0, 1, 0, 0.5, JO_D, 0.3) }], 0.45) +
      `<path d="M60.6 69.8V76.2" stroke="${P.red}" stroke-width=".7"/>` + `<path d="M50.6 69.6H69.4V76.4H50.6Z" fill="none" stroke="${P.gold}" stroke-width=".6"/>` +
      knob(47.6) + knob(72.4) +
      `<path d="M54 80.4H66" stroke="${P.gold}" stroke-width=".7"/><circle cx="60" cy="80.4" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
      sparkle(86, 30, 2.2, '#fff') + sparkle(32, 74, 1.6, '#fff') +
      k.defs()
    )
  },

  // Trece de trece: perfecto, ni el Prode sale tan redondo. La boleta con los trece aciertos y el sello de oro.
  'Trece de trece': (u) => {
    const k = kit(u)
    const card = roundRect(41, 22, 79, 90, 1.6)
    const head = 'M41 23.6C41 22.7 41.7 22 42.6 22H77.4C78.3 22 79 22.7 79 23.6V31H41Z'
    const picks = [1, 0, 2, 0, 1, 1, 0, 2, 0, 0, 2, 1, 0]
    const rows = picks.map((p, i) => {
      const y = 36.4 + i * 4
      const boxes = [0, 1, 2].map((j) => `<rect x="${58 + j * 6}" y="${f(y - 1.5)}" width="4.2" height="3" fill="${P.white}" stroke="${JO_D}" stroke-width=".35"/>`).join('')
      const x = 58 + p * 6
      return `<text x="49.4" y="${f(y + 1)}" ${GEORGIA} font-size="2.6" fill="${P.ink}" text-anchor="end">${i + 1}</text>` + `<path d="M50.6 ${f(y + 1.4)}H56.4" stroke="${P.sky}" stroke-width=".4" stroke-dasharray=".6 .6"/>` + boxes +
        `<path d="M${f(x + 0.6)} ${f(y - 1)}L${f(x + 3.6)} ${f(y + 1.2)}M${f(x + 3.6)} ${f(y - 1)}L${f(x + 0.6)} ${f(y + 1.2)}" stroke="${P.ink}" stroke-width=".65" stroke-linecap="round"/>`
    }).join('')
    const seal = starPath(0, 0, 11, 9.2, 24)
    return (
      field(k) +
      k.sun(60, 56, 20, 50, 36, false) +
      glow(k, 60, 56, 34, 34, 0.75) +
      laurel(50, 99, 29, 90, 26, 60, 8) + laurel(70, 99, 91, 90, 94, 60, 8, true) +
      `<g transform="translate(60 57) rotate(-5) scale(.84) translate(-60 -56)">` +
      k.cast([card], 2.4, 2.4, JO_D) +
      k.draw([{
        d: card, fill: P.white,
        inner:
          `<path d="${card}" fill="${JO_XL}" opacity=".6"/>` + k.sh('M64 20H82V92H64Z', 0, 0, 1, 0, 0, 0.5, JO_D, 0.3) +
          `<path d="${head}" fill="${P.red}"/>` + k.sh(head, 0, 0, 1, 0, 0, 0.7, P.wine, 0.4) +
          `<text x="60" y="29" ${GEORGIA} font-weight="700" font-size="6.4" fill="${P.white}" text-anchor="middle" letter-spacing=".6">PRODE</text>` +
          ['L', 'E', 'V'].map((c, j) => `<text x="${60.1 + j * 6}" y="34" ${GEORGIA} font-weight="700" font-size="2.4" fill="${P.red}" text-anchor="middle">${c}</text>`).join('') +
          rows + `<path d="M41 88.6H79" stroke="${P.sky}" stroke-width=".5" stroke-dasharray="1 .8"/>`,
      }], 0.75) +
      `</g>` +
      // El sello de oro con cintas: trece aciertos.
      `<g transform="translate(74.6 79) scale(.92)">` +
      k.draw([
        { d: 'M-5 6L-8.4 17L-4.6 15.4L-2.4 19L0 7Z', fill: P.red, inner: k.sh('M-9 6H0V19H-9Z', 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) },
        { d: 'M5 6L8.4 17L4.6 15.4L2.4 19L0 7Z', fill: P.red, inner: k.sh('M0 6H9V19H0Z', 0, 0, 1, 0, 0.2, 0.9, P.wine, 0.45) },
      ], 0.5) +
      k.draw([{ d: seal, fill: P.gold, inner: k.sh(seal, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-12 -12H0V0C-5 -1 -9 -5 -12 -9Z" fill="${k.lin('#fff', 0, 0, 1, 1, 0.55, 0)}"/>` }], 0.65) +
      `<circle cx="0" cy="0" r="7.4" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".6"/><circle cx="0" cy="0" r="6.4" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1.1" stroke-linecap="round"/>` +
      `<text x="0" y="2.4" ${GEORGIA} font-weight="700" font-size="7" fill="${P.ink}" text-anchor="middle">13</text>` +
      `</g>` +
      sparkle(32, 40, 2.4, '#fff') + sparkle(88, 34, 1.8, '#fff') + sparkle(60, 15, 2, '#fff') +
      k.defs()
    )
  },

  // ── Mentes gemelas ─────────────────────────────────────────────────

  // Tres veces pensaron lo mismo: lindo, pero no sirve. Dos tazas iguales, con el mismo vapor.
  'Gemelos': (u) => {
    const k = kit(u)
    const bowl = 'M-11 -10H11C11 -2 8 5.6 0 6.6C-8 5.6 -11 -2 -11 -10Z'
    const rim = ellipse(0, -10, 11, 2.8), coffee = ellipse(0, -9.8, 9.2, 2)
    const saucer = 'M-15.4 6.6C-15.4 4.6 -8.6 3.6 0 3.6C8.6 3.6 15.4 4.6 15.4 6.6C15.4 8.8 8.6 10 0 10C-8.6 10 -15.4 8.8 -15.4 6.6Z'
    const band = 'M-10.8 -6.4C-4 -4.2 4 -4.2 10.8 -6.4L10.4 -3.6C4 -1.4 -4 -1.4 -10.4 -3.6Z'
    const cup = (x: number) =>
      `<g transform="translate(${x} 74)">` +
      k.draw([{ d: saucer, fill: P.white, inner: k.sh(saucer, 0, 0, 1, 1, 0, 0.8, P.blue, 0.35) + `<path d="${ellipse(0, 6.4, 9.6, 1.8)}" fill="none" stroke="${P.gold}" stroke-width=".5"/>` }], 0.6) +
      cord('M10 -7.4C15.4 -8.6 16.6 -2.6 9.6 -.6', P.white, 1.6) +
      k.draw([
        {
          d: bowl, fill: P.white,
          inner: `<path d="${band}" fill="${JO}"/>` + `<path d="M-10.6 -5C-4 -2.8 4 -2.8 10.6 -5" fill="none" stroke="${P.gold}" stroke-width=".5" stroke-dasharray="1 .8"/>` +
            k.sh('M2 -12H13V8H2Z', 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + hair(-8.6, -8, -8.4, -2, -5, 3, 0.9, '#fff', 0.9),
        },
        { d: rim, fill: P.white, inner: `<path d="${coffee}" fill="${P.brown}"/>` + k.sh(coffee, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M-5 -10.4C-2 -11.2 2 -11.2 4 -10.6" fill="none" stroke="${JO_L}" stroke-width=".5"/>` },
      ], 0.65) +
      `<path d="${ellipse(0, -10, 11, 2.8)}" fill="none" stroke="${P.gold}" stroke-width=".6"/>` +
      // El vapor: las dos tazas largan exactamente el mismo.
      hair(-2, -14, -6, -20, -1.6, -26, 1, P.blue, 0.75) + hair(-1.6, -26, 3, -32, -1, -38, 0.85, P.blue, 0.6) + hair(2.6, -14.4, 5.6, -19, 2.4, -23, 0.7, P.blue, 0.6) +
      `</g>`
    return (
      field(k) +
      stageY(k, 60, 62, 34) +
      glow(k, 60, 60, 32, 26, 0.6) +
      k.floor(45, 84, 15, 2.4, JO_D) + k.floor(75, 84, 15, 2.4, JO_D) +
      cup(44.4) + cup(75.6) +
      `<path d="M56.4 44.6H63.6M56.4 48.4H63.6" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M56.4 44.6H63.6M56.4 48.4H63.6" stroke="${P.gold}" stroke-width="1.1" stroke-linecap="round"/>` +
      sparkle(32, 46, 1.8, '#fff') + sparkle(88, 44, 1.8, '#fff') +
      k.defs()
    )
  },

  // Diez pistas repetidas: escriben con el mismo lápiz. El lápiz amarillo sobre el papel carbónico, y la copia igualita.
  'Fotocopia': (u) => {
    const k = kit(u)
    const sheet = roundRect(-13, -17, 13, 17, 0.8)
    const lines = (c: string) => [-11, -6.8, 7.4, 11.6].map((y, i) => `<path d="M-9.6 ${y}H${i === 3 ? 3 : 9.6}" stroke="${c}" stroke-width=".5" opacity=".6"/>`).join('')
    const word = (c: string, op = 1) => `<text x="0" y="2.2" ${GEORGIA} font-style="italic" font-size="7.6" fill="${c}" text-anchor="middle"${op < 1 ? ` opacity="${op}"` : ''}>asado</text>`
    const CARBON = '#1F2E5C'
    return (
      field(k) +
      stageY(k, 60, 60, 34) +
      glow(k, 56, 54, 30, 26, 0.6) +
      `<g transform="rotate(-6 60 60)">` +
      // La copia (abajo), el carbónico y el original.
      `<g transform="translate(73.4 70)">` + k.cast([sheet], 2, 2, JO_D) + k.draw([{ d: sheet, fill: P.white, inner: lines(P.sky) + word(P.blue, 0.9) + k.sh(sheet, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) }], 0.55) + `</g>` +
      `<g transform="translate(49.6 52.8)">` + k.draw([{ d: sheet, fill: CARBON, inner: k.sh(sheet, 0, 0, 1, 1, 0, 0.8, '#0A1430', 0.4) + hair(-11, 15.4, 0, 14.6, 11, 15.6, 0.5, P.mid, 0.9) }], 0.55) + `</g>` +
      `<g transform="translate(47 50)">` + k.draw([{ d: sheet, fill: P.white, inner: `<path d="M-13 -17H13V-14H-13Z" fill="${JO_XL}"/>` + lines(P.sky) + word(P.mid) + k.sh(sheet, 0, 0, 1, 1, 0, 0.45, P.blue, 0.3) }], 0.6) + `</g>` +
      `</g>` +
      // El lápiz, escribiendo la última letra.
      `<g transform="translate(57.6 51) rotate(-48)">` + k.cast(['M0 0L9 -2.9H36V2.9H9Z'], 1.6, 1.8, JO_D) + pencil(k, 36) + `</g>` +
      hair(50, 54, 53, 55.4, 56.4, 53.4, 0.45, P.mid, 0.8) +
      sparkle(34, 36, 1.8, '#fff') + sparkle(88, 76, 1.6, '#fff') + sparkle(30, 72, 1.4, JO_D) +
      k.defs()
    )
  },

  // Veinticinco borradas: originales como el pan con manteca. El panal de miel, todas las celdas iguales.
  'Mente colmena': (u) => {
    const k = kit(u)
    const s = 6.4, cx = 60, cy = 57
    const cells: [number, number][] = []
    for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) if (Math.abs(q + r) <= 2) cells.push([cx + s * Math.sqrt(3) * (q + r / 2), cy + s * 1.5 * r])
    const capped = new Set([0, 4, 9, 13, 17])
    const drip = 'M53.6 83C53.4 86 52.6 88 52.6 90.4C52.6 92.6 54 93.8 55.4 93.8C56.8 93.8 58.2 92.6 58 90.4C57.8 88 56.8 86 56.6 83Z'
    const drip2 = 'M66.6 82.6C66.6 84.4 66 85.4 66 86.6C66 87.8 66.8 88.4 67.6 88.4C68.4 88.4 69.2 87.8 69 86.6C68.8 85.4 68.4 84.4 68.4 82.6Z'
    return (
      field(k) +
      k.sun(60, 57, 22, 50, 36, false) +
      glow(k, 60, 57, 36, 34, 0.8) +
      k.cast(cells.map(([x, y]) => hexD(x, y, s)), 2.4, 2.6, JO_D) +
      k.draw(cells.map(([x, y]) => ({ d: hexD(x, y, s + 0.2), fill: P.gold })), 0.8) +
      cells.map(([x, y], i) => {
        const inner = hexD(x, y, s - 1.3)
        if (capped.has(i)) {
          return `<path d="${inner}" fill="${JO_XL}" stroke="${JO_D}" stroke-width=".4"/>` + k.shade(inner, k.rad(JO_L, 0.62, 0.66, 0.6, 0, 0.9), JO_L, 0.4) +
            hair(x - 2.6, y - 1, x - 1.6, y - 3, x + 0.6, y - 3.4, 0.6, '#fff', 0.9)
        }
        return `<path d="${inner}" fill="${JO}" stroke="${JO_D}" stroke-width=".45"/>` + k.shade(inner, k.rad(JO_D, 0.6, 0.65, 0.6, 0.1, 0.95), JO_D, 0.4) +
          `<path d="${hexD(x, y, s - 2.6)}" fill="none" stroke="${P.gold}" stroke-width=".35" opacity=".8"/>` +
          `<ellipse cx="${f(x - 1.8)}" cy="${f(y - 1.8)}" rx="1.3" ry=".7" fill="#fff" opacity=".85" transform="rotate(-35 ${f(x - 1.8)} ${f(y - 1.8)})"/>`
      }).join('') +
      // Las aristas de cera, con su luz arriba a la izquierda.
      cells.map(([x, y]) => hair(x - s * 0.86, y - s * 0.5 + 0.3, x - s * 0.5, y - s * 0.86, x, y - s + 0.3, 0.4, P.goldL, 0.9)).join('') +
      k.draw([{ d: drip, fill: JO, inner: k.sh(drip, 0, 0, 1, 0, 0, 0.8, JO_D, 0.45) + hair(53.8, 86, 53.6, 89, 54.2, 92, 0.5, '#fff', 0.8) }, { d: drip2, fill: JO, inner: k.sh(drip2, 0, 0, 1, 0, 0, 0.8, JO_D, 0.45) }], 0.5) +
      `<g transform="translate(80.6 36.6) rotate(38) scale(.95)">` + bee(k) + `</g>` +
      `<path d="M75 44C70 46 68 42 64 44" fill="none" stroke="${JO_D}" stroke-width=".5" stroke-dasharray="1.2 1.1" stroke-linecap="round"/>` +
      sparkle(34, 36, 2.4, '#fff') + sparkle(30, 76, 1.6, '#fff') + sparkle(90, 72, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Una palabra basta ──────────────────────────────────────────────

  // Dos partidas ganadas con la pizarrita en mano: una sola palabra, en tiza.
  'Pizarrita': (u) => {
    const k = kit(u)
    const frame = 'M33 38H87V77H33Z', slate = 'M37 42H83V73H37Z'
    const tray = 'M31.6 76.4H88.4V80H31.6Z'
    const leg = (d: string) => cord(d, P.brown, 1.8, P.goldL)
    return (
      field(k) +
      stageY(k, 60, 60, 34) +
      glow(k, 60, 56, 32, 26, 0.55) +
      k.floor(60, 95, 24, 2.6, JO_D) +
      // El atril: la pata de atrás y las dos de adelante.
      leg('M60 36L62 94') + leg('M42 70L35 96') + leg('M78 70L85 96') +
      k.cast([frame], 2.4, 2.6, JO_D) +
      k.draw([
        { d: frame, fill: P.brown, inner: k.sh(frame, 0, 0, 1, 1, 0, 0.85, P.brownD, 0.5) + `<path d="M31 36H40V79H31Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.5, 0)}"/>` + hair(36, 39.6, 60, 39, 84, 39.6, 0.5, P.goldL, 0.8) + `<path d="M33 38L37 42M87 38L83 42M33 77L37 73M87 77L83 73" stroke="${P.brownD}" stroke-width=".5"/>` },
        {
          d: slate, fill: SLATE,
          inner:
            k.sh(slate, 0, 0, 1, 1, 0, 0.7, '#121A19', 0.5) +
            // Lo que se borró antes (las pistas repetidas).
            k.shade(ellipse(48, 51, 9, 3.4), k.rad('#fff', 0.5, 0.5, 0.5, 0.35, 0), '#fff', 0.15) + k.shade(ellipse(73, 66, 8, 3), k.rad('#fff', 0.5, 0.5, 0.5, 0.3, 0), '#fff', 0.15) +
            hair(41, 50, 48, 49, 56, 51, 0.5, '#fff', 0.25) + hair(67, 67, 73, 65.4, 80, 66.6, 0.5, '#fff', 0.2),
        },
        { d: tray, fill: P.brown, inner: k.sh(tray, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.5) },
      ], 0.75) +
      `<text x="60" y="64" ${GEORGIA} font-style="italic" font-size="15" fill="#F6F2E8" text-anchor="middle" transform="rotate(-4 60 60)">mate</text>` +
      `<path d="M44 67.6C54 66 66 65.6 76 65.8" fill="none" stroke="#F6F2E8" stroke-width=".7" stroke-linecap="round" opacity=".85" transform="rotate(-4 60 60)"/>` +
      k.draw([{ d: 'M66 73.8H74.4V76.6H66Z', fill: P.white, inner: k.sh('M66 73.8H74.4V76.6H66Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.35) }], 0.45) +
      `<circle cx="70" cy="70" r=".4" fill="#fff" opacity=".7"/><circle cx="72" cy="71.4" r=".3" fill="#fff" opacity=".6"/>` +
      sparkle(88, 32, 2, '#fff') + sparkle(32, 32, 1.6, JO_D) +
      k.defs()
    )
  },

  // Seis victorias: dicen todo con una palabra, como en el correo de antes. El manipulador de bronce y la cinta en Morse.
  'Telegrama': (u) => {
    const k = kit(u)
    const top = 'M36 74.6H84L88.6 80.6H31.4Z', front = 'M31.4 80.6H88.6V85.8H31.4Z'
    const lever = 'M43 58.6L80 63.4V66.4L43 61.6Z'
    const knobTop = ellipse(41.6, 55.6, 7.6, 2.6)
    const knobSkirt = 'M34 55.6C34 57.6 37 59.4 41.6 59.4C46.2 59.4 49.2 57.6 49.2 55.6V58C49.2 60 46.2 61.8 41.6 61.8C37 61.8 34 60 34 58Z'
    const yoke = 'M72 75.6V60.6C72 58.6 73.4 57.6 75 57.6H80C81.6 57.6 83 58.6 83 60.6V75.6H80V62C80 61 79.4 60.6 78.6 60.6H76.4C75.6 60.6 75 61 75 62V75.6Z'
    const post = (x: number) => `M${x - 1.2} 75.6V${69.4}H${x + 1.2}V75.6Z`
    // La cinta de papel con el Morse: "GANAMOS".
    const T0 = [92, 66], TC = [70, 18], T1 = [26, 40]
    const morse = '--. .- -. .- -- --- ...'
    const marks: string[] = []
    let t = 0.08
    for (const ch of morse) {
      if (ch === ' ') { t += 0.04; continue }
      const len = ch === '-' ? 0.05 : 0.018
      const [a, b] = along(T0[0], T0[1], TC[0], TC[1], T1[0], T1[1], [t, t + len])
      marks.push(`<path d="M${f(a.x)} ${f(a.y)}L${f(b.x)} ${f(b.y)}" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/>`)
      t += len + 0.025
    }
    const tape = taper(T0[0], T0[1], TC[0], TC[1], T1[0], T1[1], 4.6, 4.6)
    return (
      field(k) +
      k.sun(60, 58, 18, 48, 32, false) +
      glow(k, 60, 60, 32, 28, 0.7) +
      k.draw([{ d: tape, fill: P.white, inner: k.sh(tape, 0, 0, 0, 1, 0, 0.6, JO_D, 0.3) + `<path d="${tape}" fill="${JO_XL}" opacity=".5"/>` }], 0.45) +
      marks.join('') +
      `<path d="M24.6 38.4C22.6 40.6 23.4 43.6 26 43.6" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      k.floor(60, 86, 28, 2.8, JO_D) +
      k.draw([
        { d: front, fill: P.brownD, inner: k.sh(front, 0, 0, 1, 0, 0, 0.8, '#4A2A14', 0.4) + hair(34, 83.4, 60, 82.6, 86, 83.4, 0.4, P.brown) },
        { d: top, fill: P.brown, inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, P.brownD, 0.4) + hair(38, 76.6, 60, 76, 82, 76.6, 0.45, P.brownD, 0.8) + hair(36, 79, 54, 78.6, 72, 79.2, 0.4, P.brownD, 0.7) },
      ], 0.7) +
      // Contactos, resorte y bornes de bronce.
      k.draw([{ d: post(46), fill: P.gold, inner: k.sh(post(46), 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) }, { d: post(62), fill: P.gold, inner: k.sh(post(62), 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) }], 0.45) +
      `<path d="M62 69.4V63.6" stroke="${P.ink}" stroke-width="1.6"/><path d="M62 69.4C60.6 68.4 63.4 67.4 62 66.4C60.6 65.4 63.4 64.4 62 63.4" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` +
      k.cast([lever], 1.6, 2.4, JO_D) +
      k.draw([
        { d: yoke, fill: P.gold, inner: k.sh(yoke, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + hair(73.2, 74, 73, 66, 73.6, 60, 0.5, '#fff', 0.8) },
        { d: lever, fill: P.gold, inner: k.sh(lever, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + hair(46, 59.6, 62, 61.4, 78, 63.8, 0.5, '#fff', 0.9) + `<path d="M50 59.6L50 62.4M56 60.4L56 63.2" stroke="${P.goldD}" stroke-width=".4"/>` },
      ], 0.6) +
      `<circle cx="77.4" cy="64.4" r="1.6" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/><circle cx="77.4" cy="64.4" r=".5" fill="${P.goldD}"/>` +
      // La perilla de baquelita.
      `<path d="M40.4 59.6H42.8V61.4H40.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([{ d: knobSkirt, fill: BAKE, inner: k.sh(knobSkirt, 0, 0, 1, 0, 0, 0.8, '#000', 0.4) }, { d: knobTop, fill: '#4A3E38', inner: k.sh(knobTop, 0, 0, 1, 1, 0, 0.8, BAKE, 0.4) + hair(36, 55, 39.6, 54, 44, 54, 0.6, '#8C7B70') }], 0.6) +
      [38, 82].map((x) => `<ellipse cx="${x}" cy="78" rx="2" ry=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M${x - 2} 78V76.4A2 .9 0 0 1 ${x + 2} 76.4V78" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="${x}" cy="76.4" rx="2" ry=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>`).join('') +
      sparkle(46, 66.4, 2.2, '#fff') +
      sparkle(88, 40, 1.8, '#fff') + sparkle(30, 62, 1.4, '#fff') +
      k.defs()
    )
  },

  // Quince victorias: cero palabras de más. La pulga de pocas pulgas, grabada como en los libros viejos, bajo la lupa.
  'Pocas pulgas': (u) => {
    const k = kit(u)
    const L = { x: 56, y: 54, r: 25.6 }
    const lens = ellipse(L.x, L.y, L.r, L.r)
    const ring = `${ellipse(L.x, L.y, L.r + 3.6, L.r + 3.6)} ${ellipse(L.x, L.y, L.r, L.r)}`
    const rid = k.id('rim')
    const handle = 'M-2.4 0H2.4L2.8 13.6C2.8 15.4 -2.8 15.4 -2.8 13.6Z'
    const neck = 'M-1.8 -4H1.8V.6H-1.8Z'
    // La pulga, de perfil hacia la izquierda: coraza de placas, cabeza chica y las patas de atrás, enormes, para saltar.
    const body = 'M-11 -4C-9 -11.6 -1 -15.4 7 -14.6C14 -13.8 18.4 -8.6 18.4 -1.6C18.4 5.4 13.4 9.8 5 10.4C-3 11 -9 8.6 -11 3Z'
    const head = 'M-10.6 -4.6C-13.6 -6.4 -17.6 -5.2 -19 -2C-20 .6 -18.6 3.6 -15 4.2L-10.8 3.4Z'
    const plates = [-5.4, 0, 5, 9.8, 14].map((x, i) => `M${x} ${f(-14.6 + i * 0.7)}C${f(x + 2.4)} -6 ${f(x + 2.4)} 2 ${f(x - 0.4)} ${f(10.6 - i * 0.5)}`).join('')
    const CH = '#A9621C', CH_D = '#4A2408', LEGC = '#B8732A'
    const seg = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w0: number, w1: number) => ({ d: taper(x0, y0, cx, cy, x1, y1, w0, w1), fill: LEGC, inner: k.sh(taper(x0, y0, cx, cy, x1, y1, w0, w1), 0, 0, 1, 1, 0, 0.8, CH_D, 0.4) })
    const legs: [number, number, number, number, number, number, number, number][] = [
      [-9, 3, -10.6, 7, -11, 10, 2.6, 2], [-11, 10, -14, 11.4, -16.6, 13.4, 2, 1.6], [-16.6, 13.4, -17.4, 17, -18, 20.4, 1.4, 1.1], [-18, 20.4, -21, 21.2, -24, 21.4, 1, 0.6],
      [-2, 8, -3, 10.6, -3.4, 13, 2.6, 2], [-3.4, 13, -6.6, 14.6, -9, 16.4, 1.8, 1.4], [-9, 16.4, -9.8, 19, -10.6, 21.2, 1.3, 1], [-10.6, 21.2, -13.6, 21.8, -16.4, 22, 0.9, 0.6],
      [8, 6, 10.6, 9.6, 10.8, 13.6, 4.8, 3.6], [10.8, 13.6, 7, 16, 2.6, 17.4, 3, 2.2], [2.6, 17.4, 8, 19.4, 13.4, 20.6, 2, 1.4], [13.4, 20.6, 18, 21.6, 23, 22, 1.2, 0.7],
    ]
    // Cerdas: en el borde de cada placa y a lo largo de las tibias.
    const spines =
      [-5.4, 0, 5, 9.8, 14].map((x, i) => { const y = -14.6 + i * 0.7; return hair(x + 0.4, y + 0.6, x + 2, y - 0.8, x + 3.6, y - 0.6, 0.4, P.ink) + hair(x + 2, y + 6, x + 3.4, y + 5.4, x + 4.6, y + 6.4, 0.35, CH_D) }).join('') +
      [[-17.4, 17, -1], [-9.8, 19, -1], [8, 19.4, 1], [5, 18.6, 1], [11, 20.2, 1]].map(([x, y, s]) => hair(x, y, x + s * 0.6, y - 1.4, x + s * 1.6, y - 2.2, 0.3, P.ink)).join('')
    const flea =
      k.draw(legs.map((l) => seg(...l)), 0.45) +
      k.draw([
        {
          d: body, fill: CH,
          inner:
            k.sh(body, 0, 0, 1, 1, 0, 0.95, CH_D, 0.5) + `<path d="M-12 -16H6V-4C-2 -4 -8 -2 -12 0Z" fill="${k.lin(JO_L, 0, 0, 1, 1, 0.75, 0)}"/>` +
            `<path d="${plates}" fill="none" stroke="${CH_D}" stroke-width=".55"/>` + `<path d="${plates}" fill="none" stroke="${JO_L}" stroke-width=".3" transform="translate(-.6 0)" opacity=".7"/>` +
            hair(-8, -6, -2, -12, 8, -12, 0.9, '#fff', 0.85) + hair(2, 4, 8, 6, 14, 2, 0.5, CH_D, 0.8),
        },
        { d: head, fill: CH, inner: k.sh(head, 0, 0, 1, 1, 0, 0.9, CH_D, 0.5) + hair(-17.6, -3, -16, -5.4, -12.6, -5.4, 0.5, '#fff', 0.8) },
      ], 0.55) +
      spines +
      `<ellipse cx="-15.6" cy="-1.8" rx="1" ry=".9" fill="${P.ink}"/><circle cx="-15.9" cy="-2.1" r=".3" fill="#fff"/>` +
      `<path d="M-18.6 2L-17.6 8.4" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/><path d="M-12.6 -4.6C-11.6 -6.6 -10 -7.4 -9 -7" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>`
    return (
      field(k) +
      k.sun(56, 54, 30, 50, 36, false) +
      glow(k, 56, 54, 34, 34, 0.6) +
      // El mango de la lupa.
      `<g transform="translate(76.6 74.6) rotate(-45)">` + k.cast([handle], 1.6, 1.6, JO_D) +
      k.draw([
        { d: handle, fill: P.brownD, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.9, '#3A1C0B', 0.5) + hair(-1.2, 2, -1.6, 7, -1.4, 13, 0.6, P.goldL, 0.8) + `<path d="M-2.6 4.6H2.6M-2.7 9.2H2.7" stroke="${P.gold}" stroke-width=".7"/>` },
        { d: neck, fill: P.gold, inner: k.sh(neck, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
      ], 0.6) + `</g>` +
      k.cast([ellipse(L.x, L.y, L.r + 3.6, L.r + 3.6)], 2.2, 2.4, JO_D) +
      // El vidrio: el mundo agrandado, con la pulga adentro.
      k.clip(lens,
        `<path d="${lens}" fill="${JO_XL}"/>` + k.shade(lens, k.rad(P.sky2, 0.5, 0.5, 0.5, 0.1, 0.8), P.sky2, 0.4) +
        `<g transform="translate(${L.x + 1} ${L.y - 4}) scale(.98)">${k.floor(0, 22.6, 24, 2.2, JO_D)}${flea}</g>` +
        hair(L.x - 18, L.y - 8, L.x - 15, L.y - 17, L.x - 6, L.y - 21, 1.4, '#fff', 0.9) + hair(L.x - 19.6, L.y + 1, L.x - 19.4, L.y - 3, L.x - 18, L.y - 6, 0.8, '#fff', 0.7)) +
      // El aro de bronce, grabado.
      `<path d="${ring}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.6 .7)"/>` +
      `<path d="${ring}" fill-rule="evenodd" fill="none" stroke="${P.ink}" stroke-width="1.5"/>` +
      `<path d="${ring}" fill-rule="evenodd" fill="${P.gold}"/>` +
      `<clipPath id="${rid}"><path d="${ring}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${rid})">` + k.sh(ellipse(L.x, L.y, L.r + 4, L.r + 4), 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M28 26H50V60H28Z" fill="${k.lin('#fff', 0, 0, 1, 1, 0.6, 0)}"/>` + `</g>` +
      `<circle cx="${L.x}" cy="${L.y}" r="${f(L.r + 1.8)}" fill="none" stroke="${P.goldD}" stroke-width=".45" stroke-dasharray=".01 1.3" stroke-linecap="round"/>` +
      sparkle(L.x - 14, L.y - 16, 2.4, '#fff') + sparkle(90, 34, 2, '#fff') + sparkle(30, 84, 1.6, '#fff') +
      k.defs()
    )
  },
}
