import { ArrowsClockwiseIcon, CheckIcon, TrophyIcon } from '@phosphor-icons/react'
import { SwordsIcon } from '../../components/icons/custom'
import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfigEditor } from '../../components/ConfigEditor'
import { ChoiceGroup, PlayerPicker } from '../../components/PlayerPicker'
import { plural } from '../../lib/hooks'
import { DEFAULT_CONFIG } from '../../lib/pingpong/scoring'
import { actions, useData } from '../../lib/store'
import { roundRobin } from '../../lib/pingpong/tournament'
import type { Id, MatchConfig, TournamentFormat } from '../../lib/pingpong/types'

const NAMES = ['Copa de la Oficina', 'Torneo del Asado', 'Gran Slam Casero', 'Copa Pelotita', 'Masters del Living', 'Liga de los Viernes']

export function NewTournament() {
  const data = useData()
  const navigate = useNavigate()
  const id = useId()
  const players = [...data.players].sort((a, b) => a.name.localeCompare(b.name))
  const [name, setName] = useState(() => NAMES[Math.floor(Math.random() * NAMES.length)])
  const [format, setFormat] = useState<TournamentFormat>('league')
  const [doubleRound, setDoubleRound] = useState(false)
  const [selected, setSelected] = useState<Id[]>([])
  const [config, setConfig] = useState<MatchConfig>({ ...DEFAULT_CONFIG, bestOf: 1 })

  const toggle = (id: Id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const effectiveConfig = format === 'knockout' && config.bestOf % 2 === 0 ? { ...config, bestOf: config.bestOf + 1 } : config
  const matchCount = format === 'league' ? roundRobin(selected, doubleRound).flat().length : Math.max(0, selected.length - 1)
  const valid = name.trim() && selected.length >= 2

  return (
    <div className="page">
      <h1>Nuevo torneo</h1>

      <section className="card">
        <label className="field">
          <span className="field-label">Nombre</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
        </label>

        <div className="field">
          <span id={`${id}-format`} className="field-label">
            Formato
          </span>
          <ChoiceGroup
            className="format-options"
            itemClassName="format-opt"
            labelledBy={`${id}-format`}
            value={format}
            onChange={setFormat}
            options={[
              {
                value: 'league',
                content: (
                  <>
                    <ArrowsClockwiseIcon className="big-icon" weight="duotone" />
                    <b>Liga</b>
                    <span className="muted small">Todos contra todos. Gana quien más puntos sume.</span>
                  </>
                ),
              },
              {
                value: 'knockout',
                content: (
                  <>
                    <SwordsIcon className="big-icon" weight="duotone" />
                    <b>Eliminación</b>
                    <span className="muted small">Cuadro de llaves. El que pierde, afuera.</span>
                  </>
                ),
              },
            ]}
          />
        </div>

        {format === 'league' && (
          <div className="field row-between">
            <label htmlFor="double">Ida y vuelta</label>
            <input id="double" type="checkbox" className="switch" checked={doubleRound} onChange={(e) => setDoubleRound(e.target.checked)} />
          </div>
        )}
      </section>

      <section>
        <div className="section-head">
          <h2>
            Jugadores <span className="muted small">({selected.length})</span>
          </h2>
          {players.length > 2 &&
            (selected.length === players.length ? (
              <button className="link-btn" onClick={() => setSelected([])}>
                Sacar a todos
              </button>
            ) : (
              <button className="link-btn" onClick={() => setSelected(players.map((p) => p.id))}>
                Elegir todos
              </button>
            ))}
        </div>
        <PlayerPicker players={players} selected={selected} onToggle={toggle} label="Jugadores del torneo" badge={(id) => (selected.includes(id) ? <CheckIcon size={12} /> : undefined)} />
      </section>

      <section className="card">
        <h2>Reglas de cada partido</h2>
        <ConfigEditor value={effectiveConfig} onChange={setConfig} oddBestOfOnly={format === 'knockout'} />
      </section>

      <div className="sticky-actions">
        <button
          className="btn primary big block"
          disabled={!valid}
          onClick={() => {
            const t = actions.createTournament(name, format, selected, effectiveConfig, doubleRound)
            navigate(`/ping-pong/torneos/${t.id}`)
          }}
        >
          {valid ? (
            <>
              <TrophyIcon /> Crear torneo · {plural(matchCount, 'partido', 'partidos')}
            </>
          ) : !name.trim() ? (
            'Ponele un nombre al torneo'
          ) : (
            'Elegí al menos 2 jugadores'
          )}
        </button>
      </div>
    </div>
  )
}
