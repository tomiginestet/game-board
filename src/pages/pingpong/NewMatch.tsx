import { DiceFiveIcon, PingPongIcon, ShuffleIcon, UserIcon, UsersIcon } from '@phosphor-icons/react'
import { useId, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ConfigEditor } from '../../components/ConfigEditor'
import { ChoiceGroup, PlayerPicker } from '../../components/PlayerPicker'
import { DEFAULT_CONFIG } from '../../lib/pingpong/scoring'
import { actions, useData } from '../../lib/store'
import type { Id, MatchConfig, Side } from '../../lib/pingpong/types'
import { mayCreateNow } from '../../lib/access'

const LAST_CONFIG_KEY = 'ping-pong-last-config'

function loadLastConfig(): MatchConfig {
  try {
    const raw = localStorage.getItem(LAST_CONFIG_KEY)
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {
    // ignorar
  }
  return DEFAULT_CONFIG
}

function coinFlip(): Side {
  return Math.random() < 0.5 ? 'a' : 'b'
}

export function NewMatch() {
  const data = useData()
  const navigate = useNavigate()
  const id = useId()
  const [params] = useSearchParams()
  const players = [...data.players].sort((a, b) => a.name.localeCompare(b.name))
  const [selected, setSelected] = useState<Id[]>(() => [params.get('a'), params.get('b')].filter((x): x is Id => !!x && data.players.some((p) => p.id === x)))
  const [config, setConfig] = useState<MatchConfig>(loadLastConfig)
  const [server, setServer] = useState<Side | 'random'>('random')
  const [doubles, setDoubles] = useState(false)
  const needed = doubles ? 4 : 2

  const toggle = (id: Id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= needed ? [...s.slice(1), id] : [...s, id]))

  const ready = selected.length === needed
  const teamA = doubles ? selected.slice(0, 2) : selected.slice(0, 1)
  const teamB = doubles ? selected.slice(2, 4) : selected.slice(1, 2)
  const nameOf = (ids: Id[]) => ids.map((id) => data.players.find((p) => p.id === id)?.name ?? '?').join(' & ')
  const badge = (id: Id) => {
    const i = selected.indexOf(id)
    if (i < 0) return undefined
    if (!doubles) return i === 0 ? 'Izquierda' : 'Derecha'
    return i < 2 ? 'Equipo 1' : 'Equipo 2'
  }

  const start = () => {
    if (!ready) return
    try {
      localStorage.setItem(LAST_CONFIG_KEY, JSON.stringify(config))
    } catch {
      // ignorar
    }
    const first: Side = server === 'random' ? coinFlip() : server
    if (!mayCreateNow()) return
    const m = actions.createMatch(teamA, teamB, config, first)
    navigate(`/partido/${m.id}`)
  }

  return (
    <div className="page">
      <h1>Partido rápido</h1>

      <ChoiceGroup
        className="segmented"
        label="Modalidad"
        value={doubles}
        onChange={(d) => {
          setDoubles(d)
          setSelected((s) => s.slice(0, d ? 4 : 2))
        }}
        options={[
          {
            value: false,
            content: (
              <>
                <UserIcon /> Individual
              </>
            ),
          },
          {
            value: true,
            content: (
              <>
                <UsersIcon /> Dobles
              </>
            ),
          },
        ]}
      />

      <section>
        <h2>{doubles ? '¿Quiénes juegan? (los 2 primeros son un equipo)' : '¿Quiénes juegan?'}</h2>
        <PlayerPicker players={players} selected={selected} onToggle={toggle} badge={badge} />
        {doubles && selected.length === 4 && (
          <div className="teams-preview">
            <span>
              <b>{nameOf(teamA)}</b> vs <b>{nameOf(teamB)}</b>
            </span>
            <button
              className="link-btn"
              onClick={() => {
                const s = [...selected].sort(() => Math.random() - 0.5)
                setSelected(s)
              }}
            >
              <ShuffleIcon className="inline-icon" /> Equipos al azar
            </button>
          </div>
        )}
      </section>

      {ready && (
        <section className="card">
          <h2 id={`${id}-server`}>¿Quién saca primero?</h2>
          <ChoiceGroup
            className="chips"
            itemClassName="chip"
            labelledBy={`${id}-server`}
            value={server}
            onChange={setServer}
            options={[
              {
                value: 'random',
                content: (
                  <>
                    <DiceFiveIcon className="inline-icon" /> Al azar
                  </>
                ),
              },
              { value: 'a', content: nameOf(teamA) },
              { value: 'b', content: nameOf(teamB) },
            ]}
          />
        </section>
      )}

      <section className="card">
        <h2>Reglas</h2>
        <ConfigEditor value={config} onChange={setConfig} />
      </section>

      <div className="sticky-actions">
        <button className="btn primary big block" disabled={!ready} onClick={start}>
          {ready ? (
            <>
              <PingPongIcon /> {nameOf(teamA)} vs {nameOf(teamB)}
            </>
          ) : (
            `Elegí ${needed} jugadores`
          )}
        </button>
      </div>
    </div>
  )
}
