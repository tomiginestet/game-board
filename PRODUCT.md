# Product
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Grupos de amigos, familia o compañeros de trabajo que se juntan a jugar (cartas, juegos de mesa, de fiesta, ping pong, videojuegos). Anotan las partidas **en la juntada, con el teléfono en la mano**: a veces con poca luz, con ruido, pasando el teléfono de mano en mano y con la atención puesta en el juego, no en la app. Una persona del grupo suele ser la que anota; el resto mira el ranking y las medallas.

## Product Purpose
Llevar el historial de juegos de un club: partidas, torneos, rankings y medallas de cualquier juego. El éxito es que anotar una partida sea más rápido que discutir quién ganó la última vez, y que el club vuelva a la app para ver "quién manda en cada juego".

## Positioning
Un solo lugar para todos los juegos del club, cada uno anotado a su manera (truco con fósforos, Catán por turnos, generala por categorías, ping pong punto a punto), con gloria, cinturones y medallas ilustradas con humor rioplatense.

## Operating Context
- PWA móvil, uso principal en teléfono; también funciona en escritorio.
- Funciona sin conexión: todo se guarda en el dispositivo y, si hay cuenta y club, se sincroniza.
- Se puede usar sin cuenta (solo en ese dispositivo) o con cuenta (Google o link por mail) para estar en varios clubes.
- Comparte base de datos con Ping Pong Club.

## Capabilities and Constraints
- Catálogo de 45 juegos de fábrica + juegos agregados por el club (a mano o con IA).
- Torneos: eliminación, liga, mesas rotativas, partida acumulada.
- Rankings: gloria, victorias, Elo, todoterreno, cinturones; ranking del club y global.

### Glosario (un concepto, una palabra)
| Usar | No usar |
|---|---|
| club | grupo |
| partida (cualquier juego) / partido (ping pong) | match, juego (para una partida) |
| juego (el título) | ficha (en botones) |
| catálogo | biblioteca |
| medallas | premios (salvo el premio/castigo de un torneo) |
| victorias | ganadas |
| jugadores | participantes, inscriptos (salvo en torneos) |
| integrantes (del club) | miembros |
| mano a mano | duelo, dupla |
| mail | email, correo |
| Elo | ELO |
| Ver todo | Ver todos, Ver más |

## Brand Commitments
- Nombre: **Game Board**. Logo de cuatro cuadraditos (naranja, azul, verde, violeta; dorado marca al ganador) con animaciones propias por pantalla.
- Tagline: "Partidas, torneos y quién manda en cada juego."
- **Voz**: español rioplatense con voseo siempre (creá, elegí, tocá). La app habla en *nosotros* ("Te avisamos"); nunca en primera persona singular.
- **Lo funcional, claro; lo de sabor, con gracia.** Botones, errores, confirmaciones y estados: verbo + objeto, sin chistes, sin jerga técnica (nada de servidor, JSON, API, sincronizar). Estanterías, estados vacíos, medallas, torneos y celebraciones: humor local ("Para la previa", "El último lava los platos", "Barrilete cósmico").
- Errores: qué pasó y cómo seguir. Nunca códigos ni texto en inglés.
- Confirmaciones: deshacer antes que preguntar cuando se puede recuperar; si hay que preguntar, el botón lleva el verbo ("Salir del club"), nunca "Aceptar".
- Emoji: los que elige la gente (club, jugador) y los de textos con humor se quedan; la interfaz usa íconos Phosphor.

## Evidence on Hand
- Ilustraciones de medallas y carátulas generadas en `src/lib/art/`.
- No hay testimonios, métricas de uso ni casos de clientes: no inventarlos.

## Product Principles
1. Anotar primero: la acción de registrar una partida está siempre a un toque.
2. Lo del club antes que el catálogo: el club, sus partidas y su ranking son el contenido principal.
3. Personalidad en los momentos, claridad en las tareas.
4. Funciona en la juntada: sin conexión, con una mano, con poca luz.
5. Nunca perder datos sin que se pueda deshacer.

## Accessibility & Inclusion
- WCAG 2.2 AA: contraste de texto ≥ 4.5:1, componentes ≥ 3:1, objetivos táctiles de 44 px (24 px mínimo absoluto), foco visible, estado nunca solo por color.
- Respetar `prefers-reduced-motion` con alternativas intencionales (fundidos cortos), no apagando todo el feedback.
- Lenguaje neutro cuando sea posible en roles por defecto ("Admin principal" antes que "Dueño").
