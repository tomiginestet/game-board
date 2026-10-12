// Medallas generales redibujadas (ver el kit en ../kit.ts): Matagigantes, Campeón, Todos para uno y la
// familia genérica de cada juego (Debut soñado → Leyenda viviente).
import { f } from '../helpers'
import { chessPiece, ellipse, hair, KING, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'

/** Copa de dos asas, dorada, con la base en y=88. */
function trophy(k: Kit) {
  const bowl = 'M44 34H76V43C76 55 69 61 60 61C51 61 44 55 44 43Z'
  const stem = 'M57.4 61H62.6V69H57.4Z'
  const knot = roundRect(53, 68.4, 67, 72.4, 1.6)
  const foot = 'M48 72.4H72L74.4 81H45.6Z'
  const plinth = 'M43 81H77V88H43Z'
  const gold = (d: string, line = 0) => ({ d, fill: P.gold, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` })
  const handle = (d: string) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="4.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.goldD}" stroke-width=".7" stroke-linecap="round" transform="translate(.4 .5)"/>`
  return (
    handle('M45 37C35 36 34 52 47 53') + handle('M75 37C85 36 86 52 73 53') +
    k.draw([gold(bowl, 0.4), gold(stem), gold(knot), gold(foot), { d: plinth, fill: P.brownD, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.7, P.night, 0.3) }], 0.75) +
    `<path d="M44.6 37.4H75.4" stroke="${P.goldD}" stroke-width=".7"/><path d="${starPath(60, 46, 5.2, 2.2, 5)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".5"/>` +
    `<rect x="53" y="83" width="14" height="3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`
  )
}

export const GENERALES_C_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Matagigantes ───────────────────────────────────────────────────

  // David contra Goliat, con la gomera de cuando eras pibe.
  'La gomera': (u) => {
    const k = kit(u)
    const wood = (d: string) => ({ d, fill: P.brown, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.45) })
    return (
      k.day() +
      chessPiece(k, KING, 78, 66, 1.55, P.sky2, { rings: [-5.6, 10.6, 16, 20.8] }) +
      `<path d="M0 0H120V130H0Z" fill="${P.paper}" opacity=".28"/>` +
      `<path d="M46 58Q56 26 72 34" fill="none" stroke="${P.goldD}" stroke-width=".9" stroke-dasharray="1.6 1.8" stroke-linecap="round"/>` +
      `<g transform="translate(44 64) scale(1.35) translate(-42 -82)">` +
      `<path d="M33.6 63.4L30 84M50.4 63.4L33.4 84" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M33.6 63.4L30 84M50.4 63.4L33.4 84" fill="none" stroke="${P.red}" stroke-width="1" stroke-linecap="round"/>` +
      k.draw([
        wood(taper(42, 104, 41.4, 92, 42, 81, 4.6, 3.8)),
        wood(taper(42, 82, 37, 75, 34, 63.4, 3.8, 3)),
        wood(taper(42, 82, 47, 75, 50.4, 63.4, 3.8, 3)),
      ], 0.55) +
      `<path d="M39.6 86H44.4M39.7 88H44.3" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([{ d: ellipse(31.6, 85, 4.2, 3), fill: P.brownD }, { d: ellipse(31.6, 84.2, 2.4, 2.2), fill: P.sky2, inner: k.sh(ellipse(31.6, 84.2, 2.4, 2.2), 0, 0, 1, 1, 0, 0.9, P.mid, 0.4) }], 0.45) +
      `</g>` +
      sparkle(34, 40, 2.2) + sparkle(54, 30, 1.4) +
      k.defs()
    )
  },

  // Chiquita, pero levanta una pelota gigante.
  'Hormiga Atómica': (u) => {
    const k = kit(u)
    const ball = ellipse(60, 40, 15.4, 15.4)
    const pent = (cx: number, cy: number, r: number, rot: number) => starPath(cx, cy, r, r, 5, rot).replace(/L/g, 'L')
    const red = (d: string) => ({ d, fill: P.red, inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, P.wine, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` })
    const cape = 'M55.6 71C50 76 47 84 44.6 92C49 90 52 91 55 88C56.6 82 57.4 76 58 72Z'
    return (
      k.day() +
      k.sun(60, 60, 16, 44, 28, false) +
      k.floor(60, 95.4, 13, 2.2) +
      hair(46, 96, 50, 94.6, 53, 95.6, 0.5) + hair(67, 95.6, 70, 94.6, 74, 96, 0.5) +
      k.draw([{ d: cape, fill: P.gold, inner: k.sh(cape, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.5) +
      `<path d="M57.4 80L52.4 89L50 95.4M62.6 80L67.6 89L70 95.4M56.6 76L49 78.6L46 84M63.4 76L71 78.6L74 84" fill="none" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>` +
      k.draw([
        red(taper(57, 73, 49, 66, 48.6, 54.4, 2.6, 1.8)),
        red(taper(63, 73, 71, 66, 71.4, 54.4, 2.6, 1.8)),
        red(ellipse(60, 86, 6.6, 7.6)),
        red(ellipse(60, 75, 3.6, 4.6)),
        red(ellipse(60, 64.4, 6.4, 5.8)),
      ], 0.6) +
      `<path d="M57 59.4C54 54 50 54 48.6 51.4M63 59.4C66 54 70 54 71.4 51.4" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/><circle cx="48.4" cy="51" r="1.1" fill="${P.ink}"/><circle cx="71.6" cy="51" r="1.1" fill="${P.ink}"/>` +
      `<ellipse cx="57.2" cy="63.6" rx="2" ry="2.4" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="62.8" cy="63.6" rx="2" ry="2.4" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<circle cx="57.6" cy="62.6" r="1" fill="${P.ink}"/><circle cx="63.2" cy="62.6" r="1" fill="${P.ink}"/>` +
      hair(57.4, 67.4, 60, 69.4, 62.6, 67.4, 0.6) +
      k.draw([{
        d: ball, fill: P.white,
        inner:
          `<path d="${pent(60, 40, 4.6, -90)}" fill="${P.ink}"/>` +
          [0, 1, 2, 3, 4].map((i) => {
            const a = ((-90 + i * 72) * Math.PI) / 180
            return `<path d="M${f(60 + Math.cos(a) * 4.6)} ${f(40 + Math.sin(a) * 4.6)}L${f(60 + Math.cos(a) * 9.6)} ${f(40 + Math.sin(a) * 9.6)}" stroke="${P.ink}" stroke-width=".7"/>` +
              `<path d="${pent(60 + Math.cos(a + 0.63) * 14.6, 40 + Math.sin(a + 0.63) * 14.6, 4.4, (a + 0.63) * (180 / Math.PI) + 90)}" fill="${P.ink}"/>`
          }).join('') +
          k.sh(ball, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4),
      }], 0.75) +
      `<ellipse cx="53.4" cy="32.6" rx="3.6" ry="2" fill="#fff" opacity=".8" transform="rotate(-35 53.4 32.6)"/>` +
      hair(37, 44, 40.6, 42, 43, 38.6, 0.6) + hair(83, 44, 79.4, 42, 77, 38.6, 0.6) +
      k.defs()
    )
  },

  // Pagabas 50 a 1 y ganaste igual: la tortuga cruza la meta.
  'Batacazo': (u) => {
    const k = kit(u)
    const skin = '#B9C77A'
    const shell = 'M30 78C30 60 42 52 54 52C66 52 78 60 78 78Z'
    const rim = 'M27 76.4H81C81 79.4 79 81.4 76 81.4H32C29 81.4 27 79.4 27 76.4Z'
    const head = 'M75 72C77.6 64 85.4 61.4 90 64.6C93.2 67 93 72 89.6 74.4C86.6 76.4 82 77 78 78Z'
    const legs = ['M66.6 80.4L67.4 89.6C67.4 91.8 72.6 91.8 72.8 89.6L72.2 80.4Z', 'M36 80.4L35.2 89.6C35.2 91.8 40.4 91.8 40.6 89.6L41.4 80.4Z']
    const cloth = 'M44 54.6C50 52.6 58 52.6 64 54.6L65 66.6C58 68 50 68 43 66.6Z'
    const cap = 'M83.4 63.6C83 58.4 91.4 56.8 92.8 62.4Z'
    const greenPiece = (d: string, c = skin) => ({ d, fill: c, inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, P.greenD, 0.4) })
    const checker = Array.from({ length: 24 }, (_, i) => `<rect x="${36 + (i % 12) * 4}" y="${27 + Math.floor(i / 12) * 4}" width="4" height="4" fill="${(i + Math.floor(i / 12)) % 2 ? P.white : P.ink}"/>`).join('')
    const puff = (x: number, y: number, s: number) => {
      const d = 'M-6 2C-8 2 -8.6 -1 -6.4 -1.8C-6.6 -4.6 -2.6 -5.6 -1.2 -3.4C.4 -6 4.6 -4.8 4.4 -1.8C6.6 -1.6 7 1.8 4.6 2Z'
      return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.7, P.sky2, 0.45) }], 0.45 / s) + `</g>`
    }
    return (
      k.day() +
      k.stage(60, 62, 33) +
      `<path d="M37 35V84M83 35V84" stroke="${P.ink}" stroke-width="1.8"/><path d="M37 35V84M83 35V84" stroke="${P.white}" stroke-width=".7"/>` +
      k.draw([{ d: 'M36 27H84V35H36Z', fill: P.white, inner: checker }], 0.5) +
      `<text x="60" y="46.4" ${GEORGIA} font-style="italic" font-size="6.4" fill="${P.ink}" text-anchor="middle">50 a 1</text>` +
      k.floor(56, 91.6, 26, 2.4) +
      puff(25.6, 84, 0.9) + puff(30.4, 75, 0.7) +
      hair(20, 66, 23, 66.4, 26, 65.6, 0.6) + hair(18.6, 70.6, 22, 71, 25.6, 70.2, 0.6) +
      k.draw([...legs.map((d) => greenPiece(d)), greenPiece(head), greenPiece('M30.4 76.6L23.6 80.4L30.4 80.6Z')], 0.6) +
      k.draw([
        { d: shell, fill: P.green, inner: k.sh(shell, 0, 0, 1, 1, 0, 0.9, P.greenD, 0.45) + `<path d="M46 60L62 60L68 70L54 76L40 70Z" fill="none" stroke="${P.greenD}" stroke-width=".8"/><path d="M46 60L40 53M62 60L68 53M68 70L78 72M40 70L30 72M54 76V80" stroke="${P.greenD}" stroke-width=".8"/>` },
        { d: rim, fill: P.greenD, inner: k.sh(rim, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) },
      ], 0.75) +
      k.draw([{ d: cloth, fill: P.red, inner: k.sh(cloth, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + `<path d="M44.4 64.6C51 65.8 57 65.8 64.6 64.6" fill="none" stroke="${P.gold}" stroke-width=".8"/>` }], 0.5) +
      `<rect x="50.4" y="55.6" width="7.6" height="7.4" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><text x="54.2" y="61.6" ${GEORGIA} font-weight="700" font-size="6" fill="${P.ink}" text-anchor="middle">1</text>` +
      k.draw([{ d: cap, fill: P.red, inner: k.sh(cap, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) }, { d: 'M92.2 62.2L97.4 62.6L92.8 64.2Z', fill: P.red }], 0.45) +
      `<circle cx="87.6" cy="67" r="1.1" fill="${P.ink}"/><circle cx="87.9" cy="66.6" r=".35" fill="#fff"/><path d="M85.6 64.8L89.4 65.6" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/><path d="M88 71.6Q90 72.4 91.6 71" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round"/>` +
      k.defs()
    )
  },

  // ── Campeón ────────────────────────────────────────────────────────

  // La primera copa. Se festeja con sidra.
  'Campeón': (u) => {
    const k = kit(u)
    const bottle = 'M0 0V-22C0 -26 2 -27.6 2.8 -31V-38H7.2V-31C8 -27.6 10 -26 10 -22V0Z'
    const foam = [[78, 30, 1.8], [72, 26, 1.5], [66, 24, 1.2], [60, 24.6, 1], [84, 28, 1.3], [88, 33, 1.1], [75, 22, 1], [69, 20.6, 0.8]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>`).join('')
    const confetti = ([[32, 40, 20, P.sky], [36, 60, -30, P.red], [88, 62, 40, P.sky], [30, 76, 10, P.gold]] as const)
      .map(([x, y, r, c]) => `<rect x="${x - 2}" y="${y - 1}" width="4" height="2" fill="${c}" stroke="${P.ink}" stroke-width=".3" transform="rotate(${r} ${x} ${y})"/>`).join('')
    return (
      k.day() +
      k.sun(60, 54, 18, 44, 28, false) +
      confetti +
      `<g transform="translate(78 82) rotate(28)">` +
      k.draw([{ d: bottle, fill: P.greenD, inner: k.sh(bottle, 0, 0, 1, 0, 0, 0.9, P.night, 0.4) + `<path d="M0 -18H10V-8H0Z" fill="${P.paper}"/><path d="M2.4 -36V-26" stroke="#fff" stroke-width=".8" opacity=".4"/>` }, { d: 'M2.8 -38V-41H7.2V-38Z', fill: P.gold }], 0.6) +
      `</g>` +
      hair(85, 47, 84, 38, 78, 30, 1.2, P.white) + hair(86.6, 47.6, 88, 40, 86, 33, 0.9, P.white) + foam +
      `<g transform="translate(92 18) rotate(30)"><path d="M-2 -2.6H2V2.6H-2Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/></g>` + hair(86, 25, 88, 22, 90.4, 20.6, 0.5) +
      trophy(k) +
      sparkle(32, 30, 2) + sparkle(84, 64, 1.6) +
      k.defs()
    )
  },

  // El bombo de la hinchada ya tiene tu nombre.
  'Dale campeón': (u) => {
    const k = kit(u)
    const hoop = ellipse(60, 60, 26, 26), head = ellipse(60, 60, 20.6, 20.6)
    const mallet = (t: string) => `<g transform="${t}"><path d="M0 0V-30" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M0 0V-30" stroke="${P.brown}" stroke-width="1.3" stroke-linecap="round"/>` + k.draw([{ d: ellipse(0, -32.6, 3.6, 3.6), fill: P.white, inner: k.sh(ellipse(0, -32.6, 3.6, 3.6), 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) }], 0.5) + `</g>`
    const lugs = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      return `<rect x="${f(60 + Math.cos(a) * 23.3 - 1.3)}" y="${f(60 + Math.sin(a) * 23.3 - 1.3)}" width="2.6" height="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35" transform="rotate(${f((a * 180) / Math.PI)} ${f(60 + Math.cos(a) * 23.3)} ${f(60 + Math.sin(a) * 23.3)})"/>`
    }).join('')
    const arc = k.id('arc')
    const papelitos = Array.from({ length: 14 }, (_, i) => {
      const x = 24 + ((i * 37) % 72), y = 22 + ((i * 23) % 78), c = i % 3 ? P.white : P.sky
      return `<rect x="${x}" y="${y}" width="2.6" height="1.6" fill="${c}" stroke="${P.ink}" stroke-width=".25" transform="rotate(${(i * 47) % 180} ${x} ${y})"/>`
    }).join('')
    return (
      k.day() +
      k.stage(60, 60, 34) +
      papelitos +
      mallet('translate(40 92) rotate(-38)') + mallet('translate(80 92) rotate(38)') +
      k.cast([hoop], 2.4, 2.4) +
      k.draw([
        { d: hoop, fill: P.red, inner: k.sh(hoop, 0, 0, 1, 1, 0, 0.85, P.wine, 0.45) },
        { d: head, fill: P.white, inner: `<path d="M39 53H81V67H39Z" fill="${P.sky}"/>` + k.sh(head, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) },
      ], 0.8) +
      lugs +
      `<path d="${starPath(60, 60, 7.6, 3.2, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/>` +
      `<path id="${arc}" d="M44.6 60A15.4 15.4 0 0 1 75.4 60" fill="none"/>` +
      `<text ${GEORGIA} font-weight="700" font-size="4.4" letter-spacing=".4" fill="${P.ink}"><textPath href="#${arc}" startOffset="50%" text-anchor="middle">DALE CAMPEÓN</textPath></text>` +
      sparkle(86, 32, 2.2) + sparkle(32, 34, 1.6) +
      k.defs()
    )
  },

  // Tres torneos, tres estrellas.
  'La tercera': (u) => {
    const k = kit(u)
    const shield = 'M41 38H79V60C79 75 71 85 60 91C49 85 41 75 41 60Z'
    const leaf = 'M0 0C3 -3 8.6 -3 12 0C8.6 3 3 3 0 0Z'
    const branch = (flip: boolean) =>
      `<g${flip ? ' transform="translate(120 0) scale(-1 1)"' : ''}>` +
      `<path d="M58 96C42 92 34 80 34 62" fill="none" stroke="${P.goldD}" stroke-width="1.2"/>` +
      Array.from({ length: 6 }, (_, i) => {
        const t = i / 6, x = 58 - 22 * Math.sin(t * 1.4), y = 96 - 34 * t
        return `<path d="${leaf}" transform="translate(${f(x)} ${f(y)}) rotate(${f(-150 - t * 40)})" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="${leaf}" transform="translate(${f(x)} ${f(y)}) rotate(${f(-200 - t * 40)})" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>`
      }).join('') +
      `</g>`
    return (
      k.day() +
      k.sun(60, 58, 18, 44) +
      branch(false) + branch(true) +
      k.draw([{
        d: shield, fill: P.white, line: 0.4,
        inner: `<path d="M47 36H53V94H47ZM57 36H63V94H57ZM67 36H73V94H67Z" fill="${P.sky}"/>` + k.sh('M60 36H82V94H60Z', 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) + `<path d="M41 36H52V94H41Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>`,
      }], 0.85) +
      `<path d="M43.4 40.4H76.6V60C76.6 73.6 69.4 82.6 60 88C50.6 82.6 43.4 73.6 43.4 60Z" fill="none" stroke="${P.gold}" stroke-width="1"/>` +
      `<circle cx="60" cy="58" r="5.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/><circle cx="60" cy="58" r="3.2" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` +
      [[47, 30.6, 3.8], [60, 26, 4.6], [73, 30.6, 3.8]].map(([x, y, r]) => k.draw([{ d: starPath(x, y, r, r * 0.45, 5), fill: P.gold, inner: k.sh(starPath(x, y, r, r * 0.45, 5), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.5)).join('') +
      k.defs()
    )
  },

  // Cinco títulos y te reciben en el Obelisco.
  'La Scaloneta': (u) => {
    const k = kit(u)
    const obelisk = 'M55.4 104L57.4 33L60 25L62.6 33L64.6 104Z'
    const fw = (x: number, y: number, r: number, c: string) =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2
        return hair(x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, x + Math.cos(a) * r * 0.65, y + Math.sin(a) * r * 0.65, x + Math.cos(a) * r, y + Math.sin(a) * r, 0.55, c)
      }).join('') + `<circle cx="${x}" cy="${y}" r="${f(r * 0.12)}" fill="${c}"/>`
    const crowd = Array.from({ length: 13 }, (_, i) => {
      const x = 27 + i * 5.6, y = 91 + (i % 3) * 1.6
      return `<circle cx="${x}" cy="${y}" r="2.6" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/><path d="M${x - 3.4} ${y + 9}C${x - 3.4} ${y + 3} ${x + 3.4} ${y + 3} ${x + 3.4} ${y + 9}Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/>`
    }).join('')
    const flag = (x: number, y: number, r: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0V-14" stroke="${P.ink}" stroke-width=".8"/>` +
      `<path d="M0 -14C3 -15 6 -13 9 -14V-6C6 -5 3 -7 0 -6Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><path d="M0 -14C3 -15 6 -13 9 -14V-11.4C6 -10.4 3 -12.4 0 -11.4ZM0 -8.6C3 -9.6 6 -7.6 9 -8.6V-6C6 -5 3 -7 0 -6Z" fill="${P.sky}"/>` +
      `<circle cx="4.5" cy="-10" r=".9" fill="${P.gold}"/></g>`
    return (
      k.night() +
      fw(34, 36, 9, P.goldL) + fw(86, 34, 8, P.sky) + fw(82, 64, 5, P.paper) + fw(36, 66, 5, P.gold) +
      k.shade(obelisk, k.lin(P.goldL, 0, 1, 0, 0, 0.6, 0), P.goldL, 0.2) +
      k.draw([{
        d: obelisk, fill: P.white,
        inner: k.sh('M60 20H66V106H60Z', 0, 0, 1, 0, 0.2, 0.8, P.blue, 0.4) + `<path d="M54 64H66V67H54ZM54 70H66V73H54Z" fill="${P.sky}"/>` + `<rect x="59.2" y="36" width="1.6" height="2.6" fill="${P.night}"/>` + k.sh('M54 76H66V106H54Z', 0, 0, 0, 1, 0, 0.5, P.goldL, 0.4),
      }], 0.7) +
      crowd + flag(36, 92, -12) + flag(74, 91, 10) + flag(50, 93, 4) +
      [[44, 50, P.sky], [72, 46, P.white], [50, 30, P.gold], [70, 76, P.sky], [46, 80, P.white]].map(([x, y, c], i) => `<rect x="${x}" y="${y}" width="2.4" height="1.4" fill="${c}" transform="rotate(${i * 40} ${x} ${y})"/>`).join('') +
      k.defs()
    )
  },

  // ── Todos para uno ─────────────────────────────────────────────────

  // La primera ganada en equipo: mano sobre mano.
  'Uno para todos': (u) => {
    const k = kit(u)
    const sleeve = 'M-7.8 15H7.8V44H-7.8Z'
    const hand = 'M-7 17V-4C-7 -10 -4.6 -13 0 -13C4.6 -13 7 -10 7 -4V17Z'
    const thumb = 'M-7 6C-10.8 4.4 -12.6 0 -10.6 -2.8C-9.6 -4.2 -7.8 -3.6 -7 -2Z'
    const one = (rot: number, c: string, shade: string) =>
      `<g transform="translate(60 60) rotate(${rot}) translate(0 15)">` +
      k.draw([
        { d: sleeve, fill: c, inner: k.sh(sleeve, 0, 0, 1, 0, 0, 0.8, shade, 0.4) + `<path d="M-8 15H8V18H-8Z" fill="${P.ink}" opacity=".25"/>` },
        { d: thumb, fill: P.skin, inner: k.sh(thumb, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) },
        { d: hand, fill: P.skin, line: 0.3, inner: k.sh(hand, 0, 0, 1, 0, 0, 0.75, P.blue, 0.35) + `<ellipse cx="-2.6" cy="-9" rx="1.6" ry="1" fill="#fff" opacity=".7"/>` },
      ], 0.6) +
      hair(-3.5, -11.4, -3.6, -7, -3.4, -3, 0.5, P.blue) + hair(0, -12.4, 0, -7.6, 0, -3, 0.5, P.blue) + hair(3.5, -11.4, 3.6, -7, 3.4, -3, 0.5, P.blue) +
      `</g>`
    return (
      k.day() +
      k.sun(60, 60, 16, 44, 28, false) +
      one(0, P.sky, P.mid) + one(92, P.red, P.wine) + one(184, P.gold, P.goldD) + one(274, P.mid, P.night) +
      sparkle(84, 32, 2.2) + sparkle(36, 86, 1.6) +
      k.defs()
    )
  },

  // Cinco rescates: el grupo te tira el salvavidas a vos.
  'Equipo de rescate': (u) => {
    const k = kit(u)
    const out = ellipse(60, 56, 22, 21), inn = ellipse(60, 56, 12.2, 11.6)
    const ring = `${out} ${inn}`
    const wedges = [0, 1, 2, 3].map((i) => {
      const a0 = (i * 90 + 22) * (Math.PI / 180), a1 = (i * 90 + 67) * (Math.PI / 180)
      return `M60 56L${f(60 + Math.cos(a0) * 30)} ${f(56 + Math.sin(a0) * 30)}L${f(60 + Math.cos(a1) * 30)} ${f(56 + Math.sin(a1) * 30)}Z`
    }).join('')
    const wave = (y: number, c: string, sh: string) => {
      const d = `M10 ${y}Q20 ${y - 6} 30 ${y}T50 ${y}T70 ${y}T90 ${y}T110 ${y}V120H10Z`
      return k.draw([{ d, fill: c, inner: k.sh(d, 0, 0, 0, 1, 0, 0.7, sh, 0.35) }], 0.6) + hair(16, y - 2.6, 22, y - 5.4, 27, y - 3.4, 0.6, P.white) + hair(56, y - 2.6, 62, y - 5.4, 67, y - 3.4, 0.6, P.white) + hair(96, y - 2.6, 102, y - 5.4, 107, y - 3.4, 0.6, P.white)
    }
    const loops = [0, 1, 2, 3].map((i) => {
      const a = ((i * 90 + 44.5) * Math.PI) / 180, x = 60 + Math.cos(a) * 21.4, y = 56 + Math.sin(a) * 20.4
      return `<circle cx="${f(x)}" cy="${f(y)}" r="2.2" fill="none" stroke="${P.ink}" stroke-width="1.6"/><circle cx="${f(x)}" cy="${f(y)}" r="2.2" fill="none" stroke="${P.goldL}" stroke-width=".7"/>`
    }).join('')
    return (
      k.day() +
      `<path d="M62 35C66 26 72 20 80 14" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M62 35C66 26 72 20 80 14" fill="none" stroke="${P.goldL}" stroke-width=".8" stroke-linecap="round" stroke-dasharray="1.2 1"/>` +
      wave(78, P.sky, P.mid) +
      k.draw([{
        d: ring, fill: P.white,
        inner: `<path d="${wedges}" fill="${P.red}"/>` + k.sh(ring, 0, 0, 1, 1, 0, 0.8, P.night, 0.35) + `<path d="${ellipse(60, 56, 17, 16.2)}" fill="none" stroke="#fff" stroke-width=".8" opacity=".5"/>`,
      }], 0.85) +
      `<path d="${inn}" fill="none" stroke="${P.ink}" stroke-width="1.1"/>` +
      `<path d="${ellipse(60, 56, 21.4, 20.4)}" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="${ellipse(60, 56, 21.4, 20.4)}" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` + loops +
      wave(88, P.blue, P.night) +
      [[34, 70, 1.4], [86, 72, 1.2], [40, 64, 0.9], [82, 64, 1]].map(([x, y, r]) => `<path d="M${x} ${y - r * 1.6}C${x - r} ${y - r * 0.2} ${x - r} ${y + r} ${x} ${y + r}C${x + r} ${y + r} ${x + r} ${y - r * 0.2} ${x} ${y - r * 1.6}Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      sparkle(34, 34, 2.2) +
      k.defs()
    )
  },

  // Quince victorias en equipo: tienen traje y todo. El escudo con tres estrellas y la capa.
  'Los Increíbles': (u) => {
    const k = kit(u)
    const burst = starPath(60, 56, 40, 28, 14, -90)
    const cape = 'M42 40C38 56 34 74 30 94C40 90 46 94 52 90C56 94 64 94 68 90C74 94 80 90 90 94C86 74 82 56 78 40Z'
    const emblem = 'M60 34C68 36 76 38 78 42C78 56 72 66 60 74C48 66 42 56 42 42C44 38 52 36 60 34Z'
    const inner = 'M60 38.6C66 40.2 72 41.8 73.6 44.6C73.4 55.6 68.6 63.6 60 69.4C51.4 63.6 46.6 55.6 46.4 44.6C48 41.8 54 40.2 60 38.6Z'
    return (
      k.day() +
      `<path d="${burst}" fill="${P.goldL}"/>` + k.shade(burst, k.rad(P.gold, 0.5, 0.5, 0.5, 0.9, 0.2), P.goldD, 0.4) +
      k.draw([{ d: cape, fill: P.red, inner: k.sh(cape, 0, 0, 1, 0, 0, 0.85, P.wine, 0.45) + hair(46, 46, 42, 70, 38, 90, 0.8, P.wine) + hair(60, 48, 60, 72, 60, 92, 0.8, P.wine) + hair(74, 46, 78, 70, 82, 90, 0.8, P.wine) + `<path d="M40 44H50V96H40Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.25, 0)}"/>` }], 0.8) +
      k.cast([emblem], 2.2, 2.2) +
      k.draw([
        { d: emblem, fill: P.gold, inner: k.sh(emblem, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) },
        { d: inner, fill: P.night, inner: k.sh(inner, 0, 0, 1, 1, 0, 0.6, '#0E1533', 0.4) },
      ], 0.8) +
      k.draw([{ d: starPath(60, 53, 9, 3.8, 5), fill: P.red, inner: k.sh(starPath(60, 53, 9, 3.8, 5), 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) }], 0.55) +
      [[52, 44.6], [60, 42.4], [68, 44.6]].map(([x, y]) => `<path d="${starPath(x, y, 1.9, 0.8, 5)}" fill="${P.goldL}"/>`).join('') +
      `<path d="M46 42C48 39.6 53 38 58 37.4" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".8"/>` +
      sparkle(30, 40, 2.2) + sparkle(90, 44, 2) +
      k.defs()
    )
  },

  // ── Especialista (de cada juego) ───────────────────────────────────

  // La primera victoria en este juego: la galera y el bastón en el escenario, y las rosas del público.
  'Debut soñado': (u) => {
    const k = kit(u)
    const curtain = (flip: boolean) => {
      const d = 'M0 0H43C37 30 37 62 31 104H0Z'
      return `<g${flip ? ' transform="translate(120 0) scale(-1 1)"' : ''}>` + k.draw([{ d, fill: P.red, inner: k.sh(d, 0, 0, 1, 0, 0, 0.8, P.wine, 0.45) + hair(28, 6, 27, 50, 24, 102, 0.9, P.wine) + hair(36, 8, 34, 52, 29, 102, 0.9, P.wine) + hair(32, 8, 30.6, 52, 26.4, 102, 0.6, P.goldL, 0.5) }], 0.6) + `</g>`
    }
    const valance = 'M0 0H120V20Q112 26 104 20Q96 26 88 20Q80 26 72 20Q64 26 56 20Q48 26 40 20Q32 26 24 20Q16 26 8 20Q4 24 0 21Z'
    const floor = 'M10 82H110V112H10Z'
    const crown = 'M-9 0V-17C-9 -19.4 9 -19.4 9 -17V0Z'
    const brim = 'M-14 0C-14 -2.6 14 -2.6 14 0C14 2.4 -14 2.4 -14 0Z'
    const rose = (x: number, y: number, r: number) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0H9" stroke="${P.greenD}" stroke-width=".8"/><path d="M3 0C4 -1.6 6 -1.6 6 0C6 1.6 4 1.6 3 0Z" fill="${P.green}"/><circle cx="0" cy="0" r="2.1" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><path d="M-1 -.4Q0 -1.2 1 -.2" fill="none" stroke="${P.wine}" stroke-width=".4"/></g>`
    return (
      `<rect width="120" height="130" fill="${P.night}"/>` +
      k.shade('M46 0H74L100 88H20Z', k.lin(P.goldL, 0, 0, 0, 1, 0.5, 0.08), P.goldL, 0.45) +
      k.draw([{ d: floor, fill: P.brown, inner: k.sh(floor, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M10 88H110M10 95H110" stroke="${P.brownD}" stroke-width=".5"/>` }], 0.5) +
      k.shade(ellipse(60, 84, 26, 4.6), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.5) +
      k.floor(61, 84.4, 16, 2.2, P.night) +
      `<path d="M72 84L84 46" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/><path d="M72 84L84 46" stroke="${P.night}" stroke-width="1.6" stroke-linecap="round"/><path d="M84 46L85.2 42.4" stroke="${P.ink}" stroke-width="3.4" stroke-linecap="round"/><path d="M84 46L85.2 42.4" stroke="${P.gold}" stroke-width="2" stroke-linecap="round"/>` +
      `<g transform="translate(57 81) rotate(-6) scale(1.3)">` +
      k.draw([
        { d: crown, fill: P.night, inner: k.sh(crown, 0, 0, 1, 0, 0, 0.8, '#0E1533', 0.4) + `<path d="M-9 -6H9V-3H-9Z" fill="${P.red}"/><path d="M-6.4 -16V-7" stroke="${P.sky2}" stroke-width=".7" opacity=".7"/>` },
        { d: brim, fill: P.night, inner: `<path d="M-12 -.6C-6 -1.8 6 -1.8 12 -.6" fill="none" stroke="${P.sky2}" stroke-width=".4"/>` },
      ], 0.6) +
      `</g>` +
      rose(40, 88, -20) + rose(78, 90, 160) +
      hair(46, 58, 41, 54, 38, 50, 0.6, P.goldL) + hair(76, 58, 80, 54, 82, 50, 0.6, P.goldL) +
      curtain(false) + curtain(true) +
      k.draw([{ d: valance, fill: P.red, inner: k.sh(valance, 0, 0, 0, 1, 0, 0.8, P.wine, 0.4) }], 0.6) +
      `<path d="M0 18.6Q4 22.4 8 18.6Q16 25.4 24 18.6Q32 25.4 40 18.6Q48 25.4 56 18.6Q64 25.4 72 18.6Q80 25.4 88 18.6Q96 25.4 104 18.6Q112 25.4 120 18.6" fill="none" stroke="${P.gold}" stroke-width="1.2"/>` +
      sparkle(60, 34, 2.4, P.goldL) +
      k.defs()
    )
  },

  // Cinco ganadas: ya no leés el reglamento (tiene telarañas).
  'Le agarraste la mano': (u) => {
    const k = kit(u)
    const top = 'M28 64L66 51L93 66L55 80Z'
    const sideL = 'M28 64L55 80V87L28 71Z'
    const sideR = 'M55 80L93 66V73L55 87Z'
    const web =
      [0, 1, 2, 3, 4].map((i) => {
        const a = ((200 + i * 26) * Math.PI) / 180
        return `<path d="M66 51L${f(66 + Math.cos(a) * -20)} ${f(51 + Math.sin(a) * -20)}" stroke="${P.ink}" stroke-width=".35" opacity=".8"/>`
      }).join('') +
      [6, 11, 16].map((r) => `<path d="M${f(66 - Math.cos((200 * Math.PI) / 180) * r)} ${f(51 - Math.sin((200 * Math.PI) / 180) * r)}A${r} ${r} 0 0 1 ${f(66 - Math.cos((304 * Math.PI) / 180) * r)} ${f(51 - Math.sin((304 * Math.PI) / 180) * r)}" fill="none" stroke="${P.ink}" stroke-width=".35" opacity=".8"/>`).join('')
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(61, 84, 30, 3) +
      k.draw([
        { d: sideL, fill: P.white, inner: Array.from({ length: 4 }, (_, i) => `<path d="M28 ${66 + i * 1.4}L55 ${82 + i * 1.4}" stroke="${P.sky2}" stroke-width=".4"/>`).join('') + k.sh(sideL, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) },
        { d: sideR, fill: P.white, inner: Array.from({ length: 4 }, (_, i) => `<path d="M55 ${82 + i * 1.4}L93 ${68 + i * 1.4}" stroke="${P.sky2}" stroke-width=".4"/>`).join('') + k.sh(sideR, 0, 0, 1, 0, 0.3, 0.8, P.blue, 0.35) },
        { d: top, fill: P.night, inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, '#0E1533', 0.4) + `<path d="M33 64L66 53L88 66L55 77Z" fill="none" stroke="${P.gold}" stroke-width=".6"/>` },
      ], 0.75) +
      `<text x="0" y="0" ${GEORGIA} font-style="italic" font-size="6.4" fill="${P.goldL}" text-anchor="middle" transform="matrix(.9 -.32 .9 .48 60 67)">Reglamento</text>` +
      web +
      `<path d="M74 17V42" stroke="${P.ink}" stroke-width=".35"/><ellipse cx="74" cy="44" rx="1.6" ry="2" fill="${P.ink}"/><circle cx="74" cy="41.6" r="1" fill="${P.ink}"/>` +
      `<path d="M72.4 43L70.6 41.6M72.4 44.4L70.4 44.6M72.6 45.6L70.8 47.4M75.6 43L77.4 41.6M75.6 44.4L77.6 44.6M75.4 45.6L77.2 47.4" stroke="${P.ink}" stroke-width=".4" stroke-linecap="round"/>` +
      [[40, 56, 0.6], [46, 52, 0.4], [84, 58, 0.5], [88, 54, 0.4], [36, 60, 0.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.blue}" opacity=".7"/>`).join('') +
      k.defs()
    )
  },

  // Quince ganadas: te consultan las dudas de reglas. La lupa sobre el artículo del reglamento.
  'Especialista': (u) => {
    const k = kit(u)
    const lens = ellipse(54, 56, 16, 16)
    const bubble = 'M72 38C72 32.6 77 30 82.6 30C88.2 30 92 33 92 38C92 43 88 46 82.6 46C81 46 79.4 45.6 78.2 45L73.6 47.6L74.8 43.2C73 42 72 40 72 38Z'
    const book = 'M30 86L54 78L76 86L52 94Z'
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(54, 92, 24, 2.4) +
      k.draw([{ d: book, fill: P.white, inner: Array.from({ length: 5 }, (_, i) => `<path d="M${36 + i * 3.2} ${84.6 - i * 1.06}L${57 + i * 3.2} ${91.6 - i * 1.06}" stroke="${P.sky2}" stroke-width=".5"/>`).join('') + `<path d="M54 78V94" stroke="${P.mid}" stroke-width=".6"/>` + k.sh(book, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) }], 0.6) +
      `<path d="M65.4 67.4L84 90" stroke="${P.ink}" stroke-width="6.4" stroke-linecap="round"/><path d="M65.4 67.4L84 90" stroke="${P.brown}" stroke-width="4.4" stroke-linecap="round"/><path d="M66.4 67.2L83 87.6" stroke="${P.goldL}" stroke-width=".8" stroke-linecap="round" opacity=".6"/>` +
      `<path d="M64.6 66.4L68.6 71.2" stroke="${P.ink}" stroke-width="6.8"/><path d="M64.6 66.4L68.6 71.2" stroke="${P.gold}" stroke-width="5"/>` +
      `<path d="${lens}" fill="${P.white}"/>` +
      k.clip(lens, Array.from({ length: 7 }, (_, i) => `<path d="M38 ${f(46 + i * 4.4)}H${i % 3 === 2 ? 60 : 70}" stroke="${P.sky2}" stroke-width="1.6" stroke-linecap="round"/>`).join('') + `<text x="54" y="62.4" font-family="Georgia, serif" font-weight="700" font-size="14" fill="${P.ink}" text-anchor="middle">§</text>` + `<path d="${lens}" fill="${k.lin(P.sky, 0, 0, 1, 1, 0.1, 0.45)}"/>`) +
      `<path d="M44 50C46 46 50 44 54 44" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>` +
      `<path d="${lens}" fill="none" stroke="${P.ink}" stroke-width="5"/><path d="${lens}" fill="none" stroke="${P.gold}" stroke-width="3.2"/><path d="${lens}" fill="none" stroke="${P.goldD}" stroke-width=".6" transform="translate(.5 .6)"/>` +
      k.draw([{ d: bubble, fill: P.white, inner: k.sh(bubble, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) }], 0.5) +
      `<text x="82.4" y="41.6" font-family="Georgia, serif" font-weight="700" font-size="11" fill="${P.ink}" text-anchor="middle">?</text>` +
      k.defs()
    )
  },

  // Treinta victorias: podés dar clases en la UBA.
  'Doctorado': (u) => {
    const k = kit(u)
    const books = [
      { d: 'M33 80H87V91H33Z', c: P.wine, p: 'M80 81H86V90H80Z' },
      { d: 'M37 70H83V80H37Z', c: P.night, p: 'M77 71H82V79H77Z' },
      { d: 'M35 61H79V70H35Z', c: P.red, p: 'M73 62H78V69H73Z' },
    ]
    const board = 'M60 37L85 45.6L60 54L35 45.6Z'
    const capBody = 'M46 48.6V55.6C46 59.6 74 59.6 74 55.6V48.6Z'
    const scroll = roundRect(-16, -3.6, 16, 3.6, 3.6)
    return (
      k.day() +
      k.sun(60, 58, 18, 44, 28, false) +
      k.floor(60, 92, 30, 2.4) +
      books.map((b) => k.draw([{ d: b.d, fill: b.c, line: 0.35, inner: k.sh(b.d, 0, 0, 0, 1, 0, 0.7, '#000', 0.3) + `<path d="${b.p}" fill="${P.paper}"/>` }], 0.6)).join('') +
      `<path d="M38 80.6V90.4M41 80.6V90.4M42 70.6V79.4M45 70.6V79.4M40 61.6V69.4M43 61.6V69.4" stroke="${P.gold}" stroke-width=".6"/>` +
      k.draw([
        { d: capBody, fill: P.night, inner: k.sh(capBody, 0, 0, 1, 0, 0, 0.6, '#0E1533', 0.4) },
        { d: board, fill: P.night, inner: k.sh(board, 0, 0, 1, 1, 0, 0.6, '#0E1533', 0.4) + `<path d="M40 45.6L60 39L80 45.6" fill="none" stroke="${P.sky2}" stroke-width=".5" opacity=".7"/>` },
      ], 0.75) +
      `<circle cx="60" cy="45.6" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M60 45.6L82.6 47.6V59" fill="none" stroke="${P.ink}" stroke-width="1.4"/><path d="M60 45.6L82.6 47.6V59" fill="none" stroke="${P.gold}" stroke-width=".6"/>` +
      `<path d="M81 59H84.2L85 65H80.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M81 61V65M82.6 61V65M84 61V65" stroke="${P.goldD}" stroke-width=".35"/>` +
      `<g transform="translate(46 90) rotate(-14)">` +
      k.draw([{ d: scroll, fill: P.white, inner: k.sh(scroll, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) }], 0.6) +
      `<path d="M-12.4 -3.6V3.6M12.4 -3.6V3.6" stroke="${P.sky2}" stroke-width=".6"/>` +
      `<path d="M-1.6 -3.8V3.8M1.6 -3.8V3.8" stroke="${P.red}" stroke-width="1.4"/><path d="M0 3.4L-3 9M0 3.4L3 9" stroke="${P.red}" stroke-width="1.2" stroke-linecap="round"/>` +
      `<circle cx="0" cy="3.6" r="2.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      `</g>` +
      k.defs()
    )
  },

  // Sesenta ganadas: te hacen una estatua en la plaza. El brazo de mármol con la copa (y la paloma).
  'Leyenda viviente': (u) => {
    const k = kit(u)
    const cornice = 'M40 70H80V74.6H40Z'
    const shaft = 'M44 74.6H76V96H44Z'
    const base = 'M38 96H82V101H38Z'
    const stone = (d: string) => ({ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) })
    const plaque = 'M50.6 80.6H69.4V89.6H50.6Z'
    const arm = 'M54.6 66C55 59 55.4 53 55.2 50H64.8C64.6 53 65 59 65.4 66Z'
    const fist = 'M52.6 51.6C51.4 46 52.4 41.6 56 40.4H64C67.6 41.6 68.6 46 67.4 51.6Z'
    const cup = 'M50.6 22H69.4V27C69.4 33.6 65.4 37.6 60 37.6C54.6 37.6 50.6 33.6 50.6 27Z'
    const stem = 'M58 37.4H62V41H58Z'
    const pigeon = 'M-5 0C-5 -3 -2 -4.6 1.6 -4.2C2.4 -6.6 5.4 -7 6.4 -4.6L8.4 -4L6.6 -3.2C6.6 0 4.6 2.6 1 2.8C-1 3 -3 2.6 -5 0L-9 -1L-5 -2Z'
    const marble = (d: string, line = 0) => ({ d, fill: P.sky1, line, inner: k.sh(d, 0, 0, 1, 0, 0, 0.85, P.mid, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` })
    return (
      k.day() +
      k.sun(60, 46, 16, 42, 28, false) +
      k.floor(60, 101.4, 28, 2.4) +
      k.draw([stone(base), stone(shaft), stone(cornice)], 0.7) +
      `<path d="M48 74.6V96M72 74.6V96" stroke="${P.sky2}" stroke-width=".6"/>` +
      k.draw([{ d: plaque, fill: P.gold, inner: k.sh(plaque, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.4) +
      `<text x="60" y="86.6" font-family="Georgia, serif" font-style="italic" font-size="4.6" fill="${P.ink}" text-anchor="middle">Leyenda</text>` +
      `<g transform="translate(0 4.6)">` +
      k.draw([marble(arm), marble(stem), marble(cup, 0.35), marble(fist, 0.35)], 0.7) +
      `<path d="M55.4 44.6H64.6M55.2 47.8H64.8M57.6 40.6V44.6M60.6 40.4V44.6M63.4 40.6V44.6" stroke="${P.mid}" stroke-width=".45"/>` +
      `<path d="M50.6 24.6C46 24.6 45.6 31 51 31.4M69.4 24.6C74 24.6 74.4 31 69 31.4" fill="none" stroke="${P.ink}" stroke-width="2.2"/><path d="M50.6 24.6C46 24.6 45.6 31 51 31.4M69.4 24.6C74 24.6 74.4 31 69 31.4" fill="none" stroke="${P.sky1}" stroke-width="1"/>` +
      `<path d="M53 26V33M57 28V35" stroke="#fff" stroke-width=".7" opacity=".7"/>` +
      `<g transform="translate(64.4 21.4)">` + k.draw([{ d: pigeon, fill: P.sky2, inner: k.sh(pigeon, 0, 0, 1, 1, 0, 0.8, P.mid, 0.4) + `<path d="M1.6 -4C2.4 -2.6 4 -2.2 5.6 -2.6" fill="none" stroke="${P.green}" stroke-width=".8"/>` }], 0.45) + `<circle cx="4.4" cy="-5" r=".5" fill="${P.ink}"/><path d="M0 2.8V4.6M2 2.6V4.6" stroke="${P.red}" stroke-width=".5"/></g>` +
      `</g>` +
      sparkle(86, 34, 2) + sparkle(34, 40, 1.6) +
      k.defs()
    )
  },
}
