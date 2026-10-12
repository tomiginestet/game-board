// Medallas de la generala, redibujadas (ver el kit en ../kit.ts).
import { f } from '../helpers'
import { die, hair, kit, P, roundRect, sparkle } from '../kit'

export const GENERALA_NUEVAS_ART: Record<string, (u: number) => string> = {
  // Siete generalas servidas: la mano de Dios, cerrada, le pega al dado.
  'Mano de Dios': (u) => {
    const k = kit(u)
    const finger = (x: number, w: number, top: number) => roundRect(f(x - w / 2), top, f(x + w / 2), 1.6, w / 2)
    const F: [number, number, number][] = [[-9.1, 6.2, -12.8], [-3, 6.2, -14.4], [3.1, 6.1, -13.6], [8.9, 5.6, -11.6]]
    const cuff = 'M-12.4 19H12L13 42H-13.4Z'
    const wrist = 'M-9.4 10H9.2L8.8 21H-9Z'
    const palm = 'M-12.6 -3C-13.2 3 -12.8 9 -10.6 14H10.6C12.8 9 13.2 3 12.4 -3Z'
    const thumb = 'M-10.6 14C-14.6 11.6 -15.6 7.6 -14 3.6C-13.2 1.4 -11.4 0 -9.2 0H.8C3.2 0 4.8 1.4 4.8 3.2C4.8 5 3.2 6.4 1 6.4H-6C-6.6 9 -6 11.6 -4.4 14Z'
    const fist = k.draw(
      [
        { d: cuff, fill: P.sky, line: 0.35, inner: `<path d="M-3.8 17H3.6L4 44H-4.4Z" fill="${P.white}"/>` + k.sh('M3 17H15V44H3Z', 0, 0, 1, 0, 0, 0.9) + k.sh('M-15 17H15V25H-15Z', 0, 0, 0, 1, 0.8, 0) + hair(-8, 26, -7, 32, -8.6, 40, 0.5) },
        { d: wrist, fill: P.skin, inner: k.sh('M2 8H11V22H2Z', 0, 0, 1, 0, 0, 0.9) + k.sh('M-11 15H11V22H-11Z', 0, 0, 0, 1, 0, 0.6) },
        { d: palm, fill: P.skin, inner: k.sh('M3 -4C8 2 10 8 9 15H14V-4Z', 0, 0, 1, 0, 0, 0.9) + k.sh('M-8 5H11V14H-8Z', 0, 0, 0, 1, 0.75, 0.1) },
        ...F.map(([x, w, top]) => ({
          d: finger(x, w, top), fill: P.skin, line: 0.38,
          inner:
            k.sh(`M${f(x)} ${top - 1}H${f(x + w)}V3H${f(x)}Z`, 0, 0, 1, 0, 0, 0.75) + k.sh(`M${f(x - w)} -3H${f(x + w)}V3H${f(x - w)}Z`, 0, 0, 0, 1, 0, 0.6) +
            `<ellipse cx="${f(x - w * 0.16)}" cy="${f(top + 2.2)}" rx="${f(w * 0.17)}" ry=".9" fill="#fff" opacity=".9"/>`,
        })),
        {
          d: thumb, fill: P.skin, line: 0.38,
          inner: k.sh(thumb, 0, 0, 0, 1, 0, 0.7) + `<path d="M.6 1.4H2.4C3.7 1.4 4.3 2.4 4.3 3.2C4.3 4 3.7 5 2.4 5H.6C1.2 4 1.2 2.4 .6 1.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` + hair(-7.6, 1.2, -7, 3.2, -7.6, 5.4, 0.4),
        },
      ],
      0.62,
    )
    return (
      k.day() +
      k.sun(59, 52, 16, 43) +
      `<g transform="translate(61.4 64) scale(1.22)">${k.cast([cuff, wrist, palm, ...F.map(([x, w, top]) => finger(x, w, top)), thumb], 2, 1.8)}</g>` +
      `<g transform="translate(59 62) scale(1.22)">${fist}</g>` +
      hair(48.6, 44, 47.2, 40, 49.2, 35.6, 0.6) + hair(71, 44, 72.4, 40, 70.4, 35.6, 0.6) + hair(53.6, 41.6, 53, 39.6, 54, 37.6, 0.45) + hair(66, 41.6, 66.6, 39.6, 65.6, 37.6, 0.45) +
      die(k, 60, 32.6, 7.2, 12) +
      sparkle(86, 40, 2.2) + sparkle(34, 50, 1.6) +
      k.defs()
    )
  },
}
