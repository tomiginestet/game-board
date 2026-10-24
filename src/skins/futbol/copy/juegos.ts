// Modalidades y catálogo: la ficha, el listado, el carrusel, el buscador rápido y el armado de una modalidad.

export const juegos: Record<string, string> = {
  // Sueltas, para los plurales (`plural(n, say('partida'), say('partidas'))`).
  partida: 'partido',
  partidas: 'partidos',
  '1 juego': '1 modalidad',
  '{n} juegos': '{n} modalidades',

  // Ficha de la modalidad.
  'Juego no encontrado.': 'No encontramos esa modalidad.',
  Juegos: 'Modalidades',
  Catálogo: 'Modalidades',
  '¿Borrar {juego} del catálogo?': '¿Borrar {juego} de las modalidades?',
  'Borrar juego': 'Borrar modalidad',
  'Editar juego': 'Editar modalidad',
  'Para borrarlo, primero borrá sus partidas y torneos.': 'Para borrarla, primero borrá sus partidos y torneos.',
  'Este juego lo pueden cambiar quien lo agregó o un admin del club.': 'Esta modalidad la pueden cambiar quien la agregó o un admin del club.',

  // Listado y carrusel.
  'Más jugados': 'Más jugadas',
  'Todos los juegos': 'Todas las modalidades',
  'Buscar juego…': 'Buscar modalidad…',
  'Buscar juego': 'Buscar modalidad',
  'Agregalo a la biblioteca': 'Agregala como modalidad',
  'Todavía no jugaron ni agregaron juegos.': 'Todavía no jugaron ni agregaron modalidades.',
  'No hay juegos en esta categoría.': 'No hay modalidades en esta categoría.',
  'Agregá uno': 'Agregá una',
  'Juegos para jugar hoy. Usá las flechas para pasar.': 'Modalidades para jugar hoy. Usá las flechas para pasar.',
  'Juego anterior': 'Modalidad anterior',
  'Juego siguiente': 'Modalidad siguiente',

  // Anotar: elegir qué se juega.
  '¿Qué juegan?': '¿Qué se juega hoy?',
  'Ej.: truco, catán, generala': 'Ej.: fútbol 5, futsal, fútbol 7',
  'No hay juegos con ese nombre': 'No hay modalidades con ese nombre',
  'No está en el catálogo': 'No está entre las modalidades',
  'Agregalo y queda listo para anotar, con ranking y medallas.': 'Agregala y queda lista para anotar, con tabla y medallas.',
  'Hechos por el club': 'Hechas por el club',
  'jugado {cuando}': 'jugada {cuando}',

  // Agregar una modalidad.
  '¿Te sirve así el juego?': '¿Te sirve así la modalidad?',
  'Agregar al catálogo': 'Agregar a las modalidades',
  'Agregar un juego': 'Agregar una modalidad',
  'La app arma los detalles del juego: cómo se anota, qué eventos registrar, modos de torneo y medallas propias.':
    'La app arma los detalles de la modalidad: cómo se anota, qué eventos registrar, modos de torneo y medallas propias.',
  'Nombre del juego': 'Nombre de la modalidad',
  'Ej.: Carrera de mente, Bang!, Escoba…': 'Ej.: Fútbol 7, Fútbol tenis, Penales…',
  'Ej.: a 5000 puntos, en parejas': 'Ej.: dos tiempos de 20, sin offside',
  'Ej.: Se reparten 3 cartas a cada uno…': 'Ej.: Laterales con el pie, el arquero no sale del área…',
  'Pegá el reglamento o un resumen: con reglas, el juego sale mucho mejor.': 'Pegá el reglamento o un resumen: con reglas, la modalidad sale mucho mejor.',
  'Cómo armar el juego': 'Cómo armar la modalidad',
  'Armá el juego con un formulario. Si no te querés complicar, alcanza con el nombre, la cantidad de jugadores y “Resultado final”: el juego ya tiene ranking, torneos y medallas genéricas.':
    'Armá la modalidad con un formulario. Si no te querés complicar, alcanza con el nombre, la cantidad de jugadores y “Resultado final”: la modalidad ya tiene tabla, torneos y medallas genéricas.',
  'Ej.: ¡Listo! Acá tenés el juego…': 'Ej.: ¡Listo! Acá tenés la modalidad…',
  'Ver el juego': 'Ver la modalidad',
  'La arma Claude por vos. Hay un cupo mensual para toda la app y cada juego usa muy poco.':
    'La arma Claude por vos. Hay un cupo mensual para toda la app y cada modalidad usa muy poco.',
  'Pensando el juego…': 'Pensando la modalidad…',
  'Armar el juego': 'Armar la modalidad',

  // Editor de la modalidad.
  'Partidas ganadas': 'Partidos ganados',
  'Partidas jugadas': 'Partidos jugados',
  'Mayor puntaje en una partida': 'Más goles en un partido',
  'Ganadas sin que el rival sume': 'Ganados con el arco en cero',
  'Ganadas en cooperativo': 'Ganados en cooperativo',
  'Máximo de un evento en una partida': 'Máximo de un evento en un partido',
  'Partidas en las que hizo un evento': 'Partidos en los que hizo un evento',
  'Ganadas haciendo un evento': 'Ganados haciendo un evento',
  'Ganadas con un valor de un dato': 'Ganados con un valor de un dato',
  'Ganadas con un rol': 'Ganados con un rol',
  'Guardar juego': 'Guardar modalidad',
  'Todos los datos del juego, como texto': 'Todos los datos de la modalidad, como texto',
  'Ej.: Escoba de 15': 'Ej.: Fútbol 7',
  'Emoji del juego': 'Emoji de la modalidad',
  'Color del juego': 'Color de la modalidad',
  'Peso de una partida (para la gloria)': 'Peso de un partido (para la gloria)',
  'Cosas que pasan en la partida y alimentan las medallas: “canasta limpia”, “camino más largo”.':
    'Cosas que pasan en el partido y alimentan las medallas: “gol olímpico”, “caño”.',
  'Aunque no agregues ninguna, el juego ya tiene las medallas genéricas (Especialista, Racha).':
    'Aunque no agregues ninguna, la modalidad ya tiene las medallas genéricas (Especialista, Racha).',
}
