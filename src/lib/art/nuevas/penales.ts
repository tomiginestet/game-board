// Tanda de penales: once metros y toda la presión del mundo, en clave heroica. Los objetos: la pelota en el punto
// del penal, el botín, el guante del arquero que se tira para el otro lado, el arco con la red y la cuchara de la
// Panenka. A las personas reales (Montiel, el Loco Abreu) no se las dibuja: aparecen por la jugada y sus fechas.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { ball, banner, BOOT, boot, CUFF, GRASS_D, glove, goalFrame, grass, label, net, PALM, stars, THUMB } from './_futbol-piezas'

/** Hielo. */
const ICE = '#DCEBF7', ICE_D = '#8FB2D8'

/** Punto del penal, blanco de cal, en (x,y). */
const spot = (k: Kit, x: number, y: number, r = 4) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.34)}" fill="${P.white}" stroke="${GRASS_D}" stroke-width=".5"/>` + k.floor(x, y, r * 0.8, r * 0.25, GRASS_D)

/** Cuchara de acero acostada: el cuenco centrado en (0,0) mirando arriba, el mango hacia la izquierda. */
const BOWL = 'M-13 -1C-13 -6 -6.6 -9 0 -9C7.6 -9 14 -6 14 -1C14 4 7.6 7 0 7C-6.6 7 -13 4 -13 -1Z'
const HANDLE = 'M-12 -2.6C-20 -4 -30 -6 -40 -6.4C-43 -6.6 -44.4 -4.4 -44 -2.4C-43.6 -.4 -41.6 .6 -39 .4C-30 0 -20 .4 -12 1.4Z'
function spoon(k: Kit, o: { fill?: string; dark?: string; light?: string; engrave?: boolean } = {}) {
  const fill = o.fill ?? P.sky1, dark = o.dark ?? P.blue, light = o.light ?? '#fff'
  const cup = 'M-10.6 -2C-10 -5.6 -5 -7.6 0 -7.6C6 -7.6 11.4 -5.6 11.8 -2C11 1.4 6 3 0 3C-5 3 -10 1.4 -10.6 -2Z'
  return (
    k.draw([
      { d: HANDLE, fill, inner: k.sh(HANDLE, 0, 0, 0, 1, 0, 0.9, dark, 0.5) + hair(-40, -4.6, -26, -4, -14, -1.6, 0.7, light, 0.9) + (o.engrave ? `<path d="M-38 -3.6C-36 -5.4 -33 -5.4 -32.6 -3C-32.4 -1.4 -34.4 -1 -35 -2.4M-28 -2.8C-26 -4.4 -23.4 -4.2 -23.2 -2.2" fill="none" stroke="${dark}" stroke-width=".45"/>` + `<path d="${starPath(-41, -3, 1.6, 0.7, 5)}" fill="${P.goldL}"/>` : '') },
      { d: BOWL, fill, inner: `<path d="${cup}" fill="${dark}" opacity=".45"/>` + k.sh(BOWL, 0, 0, 1, 1, 0, 0.8, dark, 0.45) + hair(-9, -4, -4, -7, 4, -7.4, 0.7, light, 0.9) + (o.engrave ? `<path d="M-12 1.6C-6 5.4 6 5.4 13 1.6" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".8 .6"/>` : '') },
    ], 0.7)
  )
}

export const PENALES_ART: Record<string, (u: number) => string> = {
  // ── Pateador ──────────────────────────────────────────────────────

  // Tres tandas: el botín plantado al lado de la pelota en el punto del penal. Ni te tiembla la pierna.
  'Pie firme': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 52, 15, 44, 32, false) +
      grass(k, 74) +
      `<path d="M14 76H106" stroke="${P.white}" stroke-width="1" opacity=".7"/>` +
      spot(k, 74, 87, 5) +
      k.floor(46, 87.4, 16, 2, GRASS_D) +
      `<g transform="translate(47 85) scale(.8)">` + k.cast([BOOT], 1.6, 1.4, GRASS_D) + boot(k, { stripe: P.white }) + `</g>` +
      ball(k, 75, 77, 10, { a: 0.5, b: -0.4 }) +
      label(60, 34, 5.2, 'once metros', P.ink) +
      sparkle(86, 50, 2) + sparkle(30, 46, 1.6) +
      k.defs()
    )
  },

  // Diez tandas: sangre fría. La pelota en un cubito de hielo, de noche, con escarcha.
  'Sangre fría': (u) => {
    const k = kit(u)
    const front = roundRect(40, 46, 76, 82, 4)
    const top = 'M44 46L52 38H84C86 38 87 39.4 86 41L80 46Z'
    const side = 'M76 50L84 42C86 40.6 87 41.6 87 43.6V74C87 75.6 86.4 76.6 85 77.6L76 82Z'
    const flake = (x: number, y: number, r: number) =>
      `<g transform="translate(${x} ${y})" stroke="${P.sky1}" stroke-width=".6" stroke-linecap="round">` +
      [0, 60, 120].map((a) => `<path d="M0 ${-r}V${r}M-${f(r * 0.35)} ${f(-r * 0.75)}L0 ${f(-r * 0.45)}L${f(r * 0.35)} ${f(-r * 0.75)}M-${f(r * 0.35)} ${f(r * 0.75)}L0 ${f(r * 0.45)}L${f(r * 0.35)} ${f(r * 0.75)}" transform="rotate(${a})"/>`).join('') + `</g>`
    return (
      k.night() +
      stars([[30, 34], [90, 30], [44, 24], [78, 26], [94, 60]]) +
      k.shade(ellipse(60, 62, 28, 28), k.rad(P.sky, 0.5, 0.5, 0.5, 0.6, 0), P.sky, 0.35) +
      k.floor(62, 88, 24, 2.6, '#0F1736') +
      `<path d="M38 86C40 84 44 85 46 86C50 84 56 85 60 86" fill="none" stroke="${ICE}" stroke-width=".8" opacity=".6"/>` +
      ball(k, 58, 64, 13, { a: 0.4, b: 0.3, shade: ICE_D }) +
      k.draw([
        { d: side, fill: ICE, inner: `<path d="${side}" fill="${ICE_D}" opacity=".55"/>` },
        { d: top, fill: ICE, inner: `<path d="${top}" fill="#fff" opacity=".5"/>` },
      ], 0.6) +
      `<path d="${front}" fill="${ICE}" opacity=".42"/>` +
      k.shade(front, k.lin(ICE_D, 0, 0, 1, 1, 0, 0.7), ICE_D, 0.25) +
      `<path d="${front}" fill="none" stroke="${P.ink}" stroke-width="1.4"/><path d="${front}" fill="none" stroke="#fff" stroke-width=".6" opacity=".8" transform="translate(.8 .8) scale(.98)" transform-origin="58 64"/>` +
      `<path d="M44 52C44 49 46 48.6 48 48.6M43.4 58V54" stroke="#fff" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".9"/>` +
      `<path d="M70 80L73 72L71 68M66 48L64 54" stroke="#fff" stroke-width=".5" fill="none" opacity=".8"/>` +
      `<path d="M41 82L41.6 86.4L42.6 82M52 82L52.4 85L53.2 82M66 82L66.6 87L67.4 82" fill="${ICE}" stroke="${P.ink}" stroke-width=".4"/>` +
      flake(30, 60, 3.4) + flake(92, 72, 2.6) + flake(36, 40, 2.2) + flake(84, 32, 2.8) +
      k.defs()
    )
  },

  // Treinta tandas: Lusail, el último penal. La pelota infla la red del rincón y el guante se fue para el otro lado.
  'Montiel en Lusail': (u) => {
    const k = kit(u)
    const C = [76, 70]
    const bend = (x: number, y: number): [number, number] => {
      const dx = x - C[0], dy = y - C[1], d = Math.hypot(dx, dy) || 1
      if (d > 16) return [x, y]
      const push = Math.pow((16 - d) / 16, 1.4) * 5
      return [x + (dx / d) * push, y + (dy / d) * push]
    }
    return (
      k.day() +
      k.sun(60, 52, 16, 48) +
      k.shade(ellipse(60, 54, 28, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(46, 101, 28, 94, 24, 68, 8) + laurel(74, 101, 92, 94, 96, 68, 8, true) +
      grass(k, 80) +
      `<path d="M31.6 43.6H88.4V80H31.6Z" fill="${P.sky1}" opacity=".55"/>` +
      net(k, 'M31.6 43.6H88.4V80H31.6Z', 31.6, 43.6, 88.4, 80, 4, bend) +
      goalFrame(k, 28, 92, 40, 81) +
      `<g transform="translate(45 59) rotate(-72) scale(.64)">` + k.cast([PALM, CUFF, THUMB], 2, 2) + glove(k) + `</g>` +
      hair(52, 46, 54, 52, 52, 58, 0.7, P.mid) + hair(56, 48, 58, 54, 56.4, 60, 0.6, P.mid) +
      ball(k, C[0], C[1], 8.4, { a: 0.3, b: 0.7 }) +
      [[46, 30, 3], [60, 25, 3.6], [74, 30, 3]].map(([x, y, r]) => `<path d="${starPath(x, y, r, r * 0.42, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="${starPath(x - 0.3, y - 0.3, r * 0.45, r * 0.2, 5)}" fill="${P.goldL}"/>`).join('') +
      banner(k, 60, 89, 34, P.white, P.sky, '18 · XII · 22', P.ink, 4.4) +
      sparkle(86, 32, 2.2, '#fff') + sparkle(34, 34, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Picadita ─────────────────────────────────────────────────────

  // La primera Panenka: la cuchara levanta la pelota despacito. Si la errabas, te mudabas.
  'Cuchara': (u) => {
    const k = kit(u)
    const arc = 'M66 72Q66 36 84 44'
    return (
      k.day() +
      k.stage(60, 58, 33) +
      k.floor(56, 90, 22, 2.4, P.mid) +
      `<g transform="translate(70 80) rotate(-14) scale(.92)">` + k.cast([HANDLE, BOWL], 1.8, 1.8) + spoon(k) + `</g>` +
      `<path d="${arc}" fill="none" stroke="${P.ink}" stroke-width="1" stroke-dasharray="1.6 1.6" stroke-linecap="round"/>` +
      ball(k, 62, 62, 11, { a: 0.6, b: -0.2 }) +
      hair(50, 72, 49, 68, 51, 64, 0.6, P.mid) + hair(74, 70, 75.6, 66, 74.4, 62, 0.6, P.mid) +
      label(46, 38, 5, '¡picala!', P.ink, -6) +
      sparkle(86, 40, 2) + sparkle(30, 66, 1.6) +
      k.defs()
    )
  },

  // Cinco picaditas, como el Loco en Sudáfrica: el arquero ya está en el piso y la pelota cae despacito al medio.
  'Abreu en Sudáfrica': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 50, 15, 46) +
      grass(k, 80) +
      `<path d="M31.6 39.6H88.4V80H31.6Z" fill="${P.sky1}" opacity=".55"/>` +
      net(k, 'M31.6 39.6H88.4V80H31.6Z', 31.6, 39.6, 88.4, 80, 4.4) +
      goalFrame(k, 28, 92, 36, 81) +
      k.floor(78, 80.4, 12, 1.6, GRASS_D) +
      `<g transform="translate(78 74) rotate(84) scale(.66)">` + k.cast([PALM, CUFF, THUMB], 2, 2) + glove(k) + `</g>` +
      hair(66, 70, 64, 74, 66, 78, 0.6, P.mid) + hair(62, 72, 60.6, 75, 62, 78, 0.5, P.mid) +
      `<path d="M44 90Q44 46 56 54" fill="none" stroke="${P.ink}" stroke-width="1" stroke-dasharray="1.6 1.6" stroke-linecap="round"/>` +
      ball(k, 58, 58, 9, { a: 0.5, b: 0.2 }) +
      hair(52, 46, 50, 44, 47, 44, 0.5, P.mid) + hair(64, 46, 66, 44, 69, 44, 0.5, P.mid) +
      label(60, 31, 5.4, '¡Loco!', P.ink) +
      k.defs()
    )
  },

  // Quince Panenkas: "el cuchara". La cuchara de acero grabada, parada como un trofeo con la pelota en el cuenco.
  'Nervios de acero': (u) => {
    const k = kit(u)
    return (
      k.night() +
      stars([[30, 36], [90, 34], [42, 24], [78, 24], [94, 60], [26, 60]]) +
      k.shade(ellipse(60, 56, 30, 30), k.rad(P.gold, 0.5, 0.5, 0.5, 0.65, 0), P.gold, 0.35) +
      laurel(46, 101, 28, 96, 24, 70, 7) + laurel(74, 101, 92, 96, 96, 70, 7, true) +
      k.floor(60, 92, 16, 2, '#0F1736') +
      `<g transform="translate(60 54) rotate(-90)">` + k.cast([HANDLE, BOWL], -1.8, 1.8, '#0F1736') + spoon(k, { fill: P.sky1, dark: P.blue, engrave: true }) + `</g>` +
      ball(k, 60, 36, 8.6, { a: 0.3, b: 0.6 }) +
      banner(k, 60, 80, 38, P.gold, P.goldD, '“el cuchara”', P.ink, 4.4) +
      sparkle(42, 34, 2.4, P.goldL) + sparkle(80, 42, 2, P.goldL) + sparkle(76, 64, 1.4, P.goldL) +
      k.defs()
    )
  },
}
