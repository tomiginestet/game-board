/**
 * Anotador del truco con fósforos: cada cuadradito son 5 tantos (cuatro lados y la diagonal).
 * Con 30 tantos se separan las malas de las buenas.
 */
export function Tally({ value, target }: { value: number; target: number }) {
  const groups = Math.ceil(target / 5)
  const half = target >= 20 ? groups / 2 : 0
  const S = 22
  const gap = 8
  const width = groups * (S + gap) + (half ? 10 : 0)
  // Orden en que se apoyan los fósforos: arriba, derecha, abajo, izquierda y la diagonal.
  const sticks = (x: number, n: number) => {
    const lines = [
      [x, 0, x + S, 0],
      [x + S, 0, x + S, S],
      [x + S, S, x, S],
      [x, S, x, 0],
      [x, 0, x + S, S],
    ].slice(0, n)
    return lines.map(([x1, y1, x2, y2], i) => (
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E9C46A" strokeWidth={3} strokeLinecap="round" />
        <circle cx={x2} cy={y2} r={2.6} fill="#E03131" />
      </g>
    ))
  }
  return (
    <svg className="tally" viewBox={`-4 -4 ${width + 4} ${S + 8}`} width="100%" style={{ maxWidth: width * 1.4 }} aria-label={`${value} de ${target}`}>
      {Array.from({ length: groups }, (_, g) => {
        const x = g * (S + gap) + (half && g >= half ? 10 : 0)
        const n = Math.max(0, Math.min(5, value - g * 5))
        return (
          <g key={g}>
            <rect x={x} y={0} width={S} height={S} rx={3} fill="none" stroke="rgba(255,255,255,.32)" strokeDasharray="2 3" />
            {sticks(x, n)}
          </g>
        )
      })}
      {half ? <line x1={half * (S + gap) + 1} y1={-4} x2={half * (S + gap) + 1} y2={S + 4} stroke="rgba(255,255,255,.35)" strokeWidth={1.5} /> : null}
    </svg>
  )
}
