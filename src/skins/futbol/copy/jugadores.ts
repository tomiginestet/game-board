// jugadores.

export const jugadores: Record<string, string> = {
  // Sueltas, para los contadores con plural ("3 partidos", "juega 2 modalidades").
  partida: 'partido',
  partidas: 'partidos',
  juego: 'modalidad',
  juegos: 'modalidades',

  // Tabla.
  Ranking: 'Tabla',
  'Puntos por cada partida: más por ganar, por mesas grandes y por juegos largos.': 'Puntos por cada partido: más por ganar, por partidos con mucha gente y por partidos largos.',
  'Partidas ganadas sumando todos los juegos.': 'Partidos ganados sumando todas las modalidades.',
  'Elo por juego': 'Elo por modalidad',
  'El nivel de cada uno en un juego: sube más si le ganás a alguien mejor.': 'El nivel de cada uno en una modalidad: sube más si le ganás a alguien mejor.',
  'En cuántos juegos distintos ganaste alguna vez.': 'En cuántas modalidades distintas ganaste alguna vez.',
  'Quién tiene el cinturón de cada juego: se lo saca el que le gana.': 'Quién tiene el cinturón de cada modalidad: se lo saca el que le gana.',
  Juego: 'Modalidad',
  'Todos los juegos': 'Todas las modalidades',
  'Suma las partidas de todos los clubes y mano a mano. Sólo cuentan los jugadores que tienen cuenta (“este jugador soy yo”).':
    'Suma los partidos de todos los clubes y mano a mano. Sólo cuentan los jugadores que tienen cuenta (“este jugador soy yo”).',
  'Todavía no hay partidas de jugadores con cuenta en este período.': 'Todavía no hay partidos de jugadores con cuenta en este período.',
  'Todavía no hay partidas anotadas. Cuando terminen la primera, acá se arma la tabla.':
    'Todavía no hay partidos anotados. Cuando terminen el primero, acá se arma la tabla.',
  'Anotar una partida': 'Anotar un partido',
  'No hubo partidas en este período. Probá con uno más largo.': 'No hubo partidos en este período. Probá con uno más largo.',

  // Perfil del jugador.
  'No se puede borrar a {nombre}: tiene partidas o torneos.': 'No se puede borrar a {nombre}: tiene partidos o torneos.',
  '{n}% ganadas': '{n}% ganados',
  'Juego fuerte': 'Su fuerte',
  'Todavía no jugaste ninguna partida en este club.': 'Todavía no jugaste ningún partido en este club.',
  'Todavía no jugó ninguna partida.': 'Todavía no jugó ningún partido.',
  'Tus juegos': 'Tus modalidades',
  'Sus juegos': 'Sus modalidades',
  'Últimas partidas': 'Últimos partidos',
  'Últimas {n} partidas, de la más vieja a la más nueva: {forma}': 'Últimos {n} partidos, del más viejo al más nuevo: {forma}',

  // Plantel, resumen y carnet.
  Juegos: 'Modalidades',
  'ganaron la partida': 'ganaron el partido',
  'ganó la partida': 'ganó el partido',
  'Todavía sin partidas': 'Todavía sin partidos',
}
