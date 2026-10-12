import { useEffect, useRef, useState } from 'react'
import { LOGO_STATIC, logoAnimation, type LogoKind } from '../lib/logo'

const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Logo de Game Board. Sin `kind` son los cuatro cuadraditos quietos; con `kind`, la animación de ese momento. */
export function Logo({ kind, size = 32, className, label }: { kind?: LogoKind; size?: number; className?: string; label?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const anim = kind ? logoAnimation(kind) : undefined

  // Con "reducir movimiento" se muestra un cuadro fijo de la animación.
  useEffect(() => {
    const svg = ref.current
    if (!svg || !anim || !reducedMotion()) return
    svg.pauseAnimations()
    svg.setCurrentTime(anim.dur * anim.still)
  }, [anim])

  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: anim ? anim.inner : LOGO_STATIC }}
    />
  )
}

/**
 * Pantalla de espera con el logo animado. Aparece con un pequeño retraso
 * para no parpadear cuando la carga es instantánea.
 */
export function Loader({ kind = 'secuencia', text, delay = 200, size = 96 }: { kind?: LogoKind; text?: string; delay?: number; size?: number }) {
  const [shown, setShown] = useState(delay <= 0)
  useEffect(() => {
    if (delay <= 0) return
    const t = setTimeout(() => setShown(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  if (!shown) return null
  return (
    <div className="brand-loader" role="status" aria-live="polite">
      <Logo kind={kind} size={size} />
      {text && <p className="muted">{text}</p>}
    </div>
  )
}
