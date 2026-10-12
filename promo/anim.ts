// Herramientas de animación: todo es una función pura del tiempo (en segundos),
// así cada cuadro se puede dibujar suelto y el video sale siempre igual.
import type { CSSProperties } from 'react'

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k
/** Avance de 0 a 1 entre `a` y `b`. */
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a))

export const ease = {
  out: (x: number) => 1 - Math.pow(1 - x, 3),
  in: (x: number) => x * x * x,
  inOut: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  back: (x: number) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2),
  /** Rebote amortiguado que termina en 1. */
  spring: (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.cos(x * Math.PI * 3.5) * Math.exp(-x * 5.5)),
}

/** Aparece creciendo con un rebotito. */
export function pop(t: number, at: number, dur = 0.45, from = 0.4): CSSProperties {
  const k = prog(t, at, at + dur)
  return { opacity: clamp(k * 4), transform: `scale(${lerp(from, 1, ease.back(k))})` }
}

/** Aparece subiendo. */
export function rise(t: number, at: number, dur = 0.5, dy = 40): CSSProperties {
  const k = ease.out(prog(t, at, at + dur))
  return { opacity: k, transform: `translateY(${(1 - k) * dy}px)` }
}

/** Entra deslizándose desde un costado. */
export function slide(t: number, at: number, dur = 0.5, dx = 120): CSSProperties {
  const k = ease.out(prog(t, at, at + dur))
  return { opacity: clamp(k * 2), transform: `translateX(${(1 - k) * dx}px)` }
}

/** Opacidad de salida (1 → 0) entre `a` y `b`. */
export const fadeOut = (t: number, a: number, b: number) => 1 - ease.in(prog(t, a, b))

/** Texto que se va escribiendo, letra por letra. */
export function typed(t: number, text: string, at: number, cps = 14): string {
  const n = Math.floor(clamp((t - at) * cps, 0, text.length))
  return text.slice(0, n)
}

/** Números pseudoaleatorios repetibles. */
export function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
