// Código QR como un solo dibujo SVG (un cuadrado de 1×1 por módulo), para la tarjeta del club.

import qrcode from 'qrcode-generator'

/** Lado en módulos (sin margen) y el path de los módulos oscuros. */
export function qrPath(text: string): { size: number; d: string } {
  const q = qrcode(0, 'M')
  q.addData(text)
  q.make()
  const size = q.getModuleCount()
  let d = ''
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (q.isDark(y, x)) d += `M${x} ${y}h1v1h-1z`
  return { size, d }
}
