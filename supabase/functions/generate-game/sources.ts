// El servidor arma el pedido con el esquema y el ejemplo del repo (src/lib/games/schema.ts y catalog/catan.ts).
// Versión publicada: resumida para la función; el modo copiar y pegar usa el archivo completo.
export const SCHEMA = `Tipos (TypeScript) de una ficha GameDef:

type PlayMode = 'counter' | 'rounds' | 'turns' | 'result' | 'coop'
type SidesKind = 'individual' | 'teams' | 'either' | 'coop'
type Category = 'deporte' | 'mesa' | 'cartas' | 'fiesta' | 'clasico' | 'dados' | 'video' | 'cooperativo'
type OptionValue = number | boolean | string
interface GameOption { id: string; label: string; type: 'number' | 'boolean' | 'select'; default: OptionValue; choices?: { value: OptionValue; label: string }[]; min?: number; max?: number; help?: string }
// Evento registrable. count: se suma. holder: lo tiene uno solo y pasa de mano (camino más largo).
// points: en counter suma al marcador; en turns al tanteo público; en rounds a la mano (puede ser negativo).
// askPoints: el valor se elige al registrarlo. hidden: oculto hasta el final. replaces: al sumar uno resta uno de otro evento.
// global: no es de ningún lado (empate). winsGame: hacerlo gana la partida en el acto.
interface EventDef { id: string; name: string; emoji: string; type: 'count' | 'holder'; points?: number; askPoints?: boolean; hidden?: boolean; replaces?: string; global?: boolean; winsGame?: boolean; help?: string }
// Dato que se pregunta al final para cada lado.
interface StatDef { id: string; label: string; type: 'number' | 'choice'; choices?: string[]; help?: string }
type Metric =
  | { type: 'wins' } | { type: 'played' } | { type: 'bestStreak' } | { type: 'shutoutWins' } | { type: 'scoreMax' } | { type: 'marginMax' } | { type: 'coopWins' }
  | { type: 'eventTotal'; event: string } | { type: 'eventMax'; event: string } | { type: 'playsWithEvent'; event: string } | { type: 'winsWithEvent'; event: string }
  | { type: 'statTotal'; stat: string } | { type: 'statMax'; stat: string } | { type: 'winsWithChoice'; stat: string; value: string } | { type: 'winsAsRole'; role: string }
type Glyph = 'crown' | 'trophy' | 'star' | 'flame' | 'dice' | 'cards' | 'heart' | 'shield' | 'coin' | 'meeple' | 'bolt' | 'skull' | 'rocket' | 'brain' | 'eye' | 'clover' | 'gem' | 'sword' | 'house' | 'road'
interface AwardLevel { at: number; name: string; description: string; glyph?: Glyph; color?: string }
// unit: "{n} caminos"; unitOne para n = 1.
interface AwardDef { id: string; name: string; measures: string; metric: Metric; unit: string; unitOne?: string; levels: AwardLevel[] }
// knockout y league: partidas de 2 lados. tables: mesas rotativas de 3 a 6. series: partida acumulada.
type CupFormat = 'knockout' | 'league' | 'tables' | 'series'
// scorer de rounds: sum (número directo + eventos), skullKing (apuesta y bazas), bidTricks (con bidHit, bidPerTrick, bidMiss).
interface Scoring { target?: number; targetOption?: string; lowWins?: boolean; eliminateAt?: number; eliminateOption?: string; rounds?: number; roundsOption?: string; roundLabels?: string[]; scorer?: 'sum' | 'skullKing' | 'bidTricks'; bidHit?: number; bidPerTrick?: number; bidMiss?: number; allowDraw?: boolean; quick?: number[]; quickLabel?: string; finalScores?: boolean; maxScore?: number; pointsName?: string }
interface GameDef {
  id: string; name: string; emoji: string; color: string; category: Category; tagline: string
  players: { min: number; max: number }; sides: SidesKind; teamSize?: number; mode: PlayMode
  weight: 1 | 2 | 3 // peso para los puntos de gloria: 1 liviano, 2 medio, 3 pesado
  scoring: Scoring; options: GameOption[]; events: EventDef[]; stats: StatDef[]
  roles?: string[] // roles secretos (Impostor / Tripulante)
  awards: AwardDef[]; formats: CupFormat[]; rules: string[]; rulesUrl?: string; source?: 'ai'
}`

export const EXAMPLE = `{
  "id": "catan", "name": "Catán", "emoji": "🐑", "color": "#E8590C", "category": "mesa",
  "tagline": "¿Alguien tiene madera? Te cambio dos ovejas.",
  "players": { "min": 3, "max": 6 }, "sides": "individual", "mode": "turns", "weight": 3,
  "scoring": { "target": 10, "targetOption": "target", "finalScores": true, "pointsName": "puntos de victoria" },
  "options": [{ "id": "target", "label": "Puntos para ganar", "type": "number", "default": 10, "min": 5, "max": 20 }],
  "events": [
    { "id": "settlement", "name": "Poblado", "emoji": "🏠", "type": "count", "points": 1 },
    { "id": "city", "name": "Ciudad", "emoji": "🏰", "type": "count", "points": 2, "replaces": "settlement" },
    { "id": "longestRoad", "name": "Camino más largo", "emoji": "🛣️", "type": "holder", "points": 2 },
    { "id": "knight", "name": "Caballero jugado", "emoji": "🛡️", "type": "count", "hidden": true }
  ],
  "stats": [{ "id": "favResource", "label": "Recurso estrella", "type": "choice", "choices": ["Madera", "Ladrillo", "Oveja", "Trigo", "Piedra"] }],
  "awards": [
    { "id": "longestRoad", "name": "Ruta 40", "measures": "Partidas ganadas con el camino más largo",
      "metric": { "type": "winsWithEvent", "event": "longestRoad" }, "unit": "{n} victorias por la ruta",
      "levels": [
        { "at": 1, "name": "Camino de tierra", "description": "Ganaste con el camino más largo. Todavía hay pozos, pero llega.", "glyph": "road", "color": "#C08552" },
        { "at": 3, "name": "Ruta 40", "description": "De La Quiaca a Cabo Vírgenes sin soltar el volante.", "glyph": "road", "color": "#74C0FC" },
        { "at": 7, "name": "Panamericana", "description": "Siete victorias con la ruta más larga. Ya cobrás peaje.", "glyph": "coin", "color": "#FFD43B" }
      ] },
    { "id": "wheat", "name": "Rey del heno", "measures": "Partidas ganadas con el trigo como recurso estrella",
      "metric": { "type": "winsWithChoice", "stat": "favResource", "value": "Trigo" }, "unit": "{n} victorias a puro trigo",
      "levels": [
        { "at": 1, "name": "Fardito", "description": "Primera victoria a base de trigo. Olor a campo.", "glyph": "house", "color": "#FAB005" },
        { "at": 3, "name": "Rey del heno", "description": "Tres victorias con trigo. Tu silo no da más.", "glyph": "crown", "color": "#FCC419" },
        { "at": 7, "name": "Granero del mundo", "description": "Siete victorias trigueras: exportás a medio planeta.", "glyph": "gem", "color": "#82C91E" }
      ] }
  ],
  "formats": ["tables", "series"],
  "rules": ["Cada turno se tiran dos dados y todos cobran recursos.", "Poblado 1 punto, ciudad 2; camino más largo y ejército más grande valen 2.", "Gana el primero que llega a 10 puntos de victoria."],
  "source": "ai"
}`
