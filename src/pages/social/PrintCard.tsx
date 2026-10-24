import { ArrowLeftIcon, CrownIcon, IdentificationCardIcon, MedalIcon, PencilSimpleLineIcon, PrinterIcon, SparkleIcon, TrophyIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Medal } from '../../components/Medal'
import { Logo } from '../../components/Logo'
import { findGame } from '../../lib/games'
import { MEMBERSHIP_FAMILY } from '../../lib/medals'
import { qrPath } from '../../lib/qr'
import { clubShareLink, useActiveGroup } from '../../lib/social'
import './print.css'
import { skin } from '../../skins'
import { say } from '../../skins/say'

/** Ancho de diseño de la tarjeta en pantalla; al imprimir se escala a 148 mm (A5). */
const BASE_W = 355

/** Medallas de muestra del dorso: la primera de cada juego del lugar y, para completar, generales. */
const FALLBACK_MEDALS = ['Primera ficha', 'Ya no sos turista', 'Debut soñado', 'Le agarraste la mano', 'D10S']

function sampleMedals(gameIds: string[]): string[] {
  const own = gameIds
    // El ping pong tiene sus medallas aparte (las del Ping Pong Club): la primera es Primera sangre.
    .map((id) => (id === 'pingpong' ? 'Primera sangre' : findGame({ games: [] }, id)?.awards?.[0]?.levels?.[0]?.name))
    .filter((n): n is string => !!n)
  return [...new Set([...own, ...FALLBACK_MEDALS])].slice(0, 5)
}

/** El link sin el protocolo, para leerlo en el papel. */
const shown = (link: string) => link.replace(/^https?:\/\//, '')

/**
 * Tarjeta del club para imprimir (A5, frente y dorso): adelante la medalla Carnet nuevo con el QR del club;
 * atrás, qué se hace en la app. Se imprime o se guarda como PDF desde el navegador.
 */
export function PrintCard() {
  const group = useActiveGroup()
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const fit = () => setZoom(Math.min(1.4, (window.innerWidth - 32) / BASE_W))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const link = group ? clubShareLink(group) : ''
  const qr = useMemo(() => (link ? qrPath(link) : null), [link])
  const medals = useMemo(() => sampleMedals(group?.venue?.games ?? []), [group?.venue?.games])

  if (!group || !qr) {
    return (
      <div className="page">
        <h1>Tarjeta del club</h1>
        <div className="empty">Elegí un club para armar su tarjeta.</div>
        <Link to="/grupos" className="btn primary">
          Ver mis clubes
        </Link>
      </div>
    )
  }

  return (
    <div className="print-root" style={{ '--print-zoom': zoom } as CSSProperties}>
      <div className="print-toolbar">
        <Link to="/" className="btn">
          <ArrowLeftIcon /> Volver
        </Link>
        <button className="btn primary" onClick={() => window.print()}>
          <PrinterIcon /> Imprimir o guardar PDF
        </button>
      </div>
      <p className="print-hint muted small">A5 (148 × 210 mm), frente y dorso. Al guardar el PDF, activá los gráficos de fondo y márgenes en “ninguno”.</p>

      <div className="print-pages">
        {/* Frente */}
        <section className="print-sheet front" aria-label="Frente de la tarjeta">
          <div className="ps-rays" aria-hidden />
          <span className="ps-kicker">
            <SparkleIcon weight="fill" aria-hidden /> ¡Medalla nueva! · {group.name}
          </span>
          <div className="ps-hero">
            <Medal family={MEMBERSHIP_FAMILY} level={0} size={104} />
          </div>
          <h1 className="ps-title">Carnet nuevo</h1>
          <p className="ps-desc">Foto carnet, número de socio y a jugar.</p>
          <div className="ps-ladder">
            <span className="ps-ladder-title">Cuanto más venís, más sube</span>
            <div className="ps-ladder-row">
              {MEMBERSHIP_FAMILY.levels.slice(1).map((l, i) => (
                <span key={l.name} className="ps-step">
                  <Medal family={MEMBERSHIP_FAMILY} level={i + 1} size={46} />
                  {['1 mes', '6 meses', '1 año', '3 años'][i]}
                </span>
              ))}
            </div>
          </div>
          <div className="ps-qr-row">
            <svg className="ps-qr" viewBox={`-3 -3 ${qr.size + 6} ${qr.size + 6}`} role="img" aria-label={`Código QR: ${link}`}>
              <rect x="-3" y="-3" width={qr.size + 6} height={qr.size + 6} fill="#fff" />
              <path d={qr.d} fill="#0d1117" shapeRendering="crispEdges" />
            </svg>
            <span className="ps-qr-text">
              <b>Escaneá y llevátela.</b>
              <span>Sumate al club de {group.name}.</span>
            </span>
          </div>
          <footer className="ps-foot">
            <span className="ps-brand">
              <Logo size={18} /> {skin.name}
            </span>
            <span>{shown(link)}</span>
          </footer>
        </section>

        {/* Dorso */}
        <section className="print-sheet back" aria-label="Dorso de la tarjeta">
          <span className="ps-brand">
            <Logo size={18} /> {skin.name}
          </span>
          <h2 className="ps-tag">
            {say('Partidas, torneos y')}
            <br />
            <em>quién manda</em> {say('en cada juego.')}
          </h2>
          <ul className="ps-feats">
            <li>
              <span className="ps-ico"><PencilSimpleLineIcon weight="duotone" /></span>
              <span><b>{say('Anotá cada partida')}</b><span>{say('Desde el teléfono, en la mesa.')}</span></span>
            </li>
            <li>
              <span className="ps-ico"><CrownIcon weight="duotone" /></span>
              <span><b>Mirá quién manda</b><span>{say('El ranking de cada juego del club.')}</span></span>
            </li>
            <li>
              <span className="ps-ico"><TrophyIcon weight="duotone" /></span>
              <span><b>Jugá los torneos</b><span>La llave, armada en la app.</span></span>
            </li>
            <li>
              <span className="ps-ico"><MedalIcon weight="duotone" /></span>
              <span><b>Ganá medallas</b><span>{say('Cada juego tiene las suyas.')}</span></span>
              <span className="ps-medals">
                {medals.map((name, i) => (
                  // Cada una en un metal distinto (bronce, plata, oro…), para que se vea la escala de niveles.
                  <Medal key={name} family={{ levels: Array.from({ length: i + 1 }, () => ({ at: 0, name, description: '' })) }} level={i} size={36} />
                ))}
              </span>
            </li>
            <li>
              <span className="ps-ico"><IdentificationCardIcon weight="duotone" /></span>
              <span><b>Tu carnet de socio</b><span>Tu número y tu antigüedad.</span></span>
            </li>
          </ul>
          <p className="ps-free">
            <b>Gratis.</b> Entrás con Google o con tu mail.
          </p>
        </section>
      </div>
    </div>
  )
}
