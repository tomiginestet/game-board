# Medallas: el lenguaje

Cada medalla es un hexágono de metal (el marco, en `src/lib/medalArt.ts`) con una estampa adentro (la
ilustración, en `src/lib/art/nuevas/`). El marco pone el valor: el metal sube con el nivel (bronce, plata, oro,
platino, oro rosa y tornasolado), con la plaqueta del número romano, la piedra engarzada de diamante para arriba
y la corona de laureles de leyenda. La ilustración pone el chiste.

Las ilustraciones siguen la gramática de una estampa impresa (la referencia fue "La bandera del sur", de
Pilardibujito), simplificada: un solo símbolo por medalla y nada de ornamento barroco.

**Paleta fija.** Tinta azul, papel crema, celestes y un solo acento dorado (`P` en `src/lib/art/kit.ts`). Un color
propio sólo cuando el tema lo pide: el marrón de la calabaza, el verde de la yerba, el rojo de una rosa.

**Línea con peso.** El contorno de tinta va sólo por fuera de cada figura y es más grueso del lado de la sombra
(abajo a la derecha). Adentro, líneas más finas. Los pliegues, el vapor y los nudillos son trazos que se afinan
en las puntas (`hair`), como hechos a mano.

**Volumen impreso.** Una sola luz, arriba a la izquierda. Las sombras son un velo suave del tono con el mismo
degradé hecho grano encima (`shade`). Nada de brillos de plástico ni de 3D.

**Un fondo que enmarca.** El sol de Mayo o una gloria de rayos (`sun`), un escenario celeste (`stage`) o la noche
(`night`). Algunas medallas suman un texto en cursiva, como los rótulos de las estampillas ("¡fiu!").

**Pocos elementos, mucho detalle.** Un protagonista y como mucho uno o dos acompañantes. Cada elemento puede tener
ornamento, textura y varias capas de sombra, pero la medalla no se llena de cosas. Las medallas de los niveles
altos llevan más trabajo de grabado (volutas, texturas, remates, brillos), no más objetos.

**Nada de meeple.** El muñequito de juego parece un hombre de jengibre: no se usa. Los jugadores se representan
con objetos (una ficha, un sombrero, un anillo, una pieza de ajedrez, una mano).

**Humor en el objeto.** El chiste está en lo que se elige dibujar (la camiseta colgada con aureola, el puño que le
pega al dado, el rey del tablero con los rivales tirados), no en caras de historieta. A las personas reales no se
las dibuja: aparecen por sus símbolos.

**Oficio.** Cada medalla se revisa grande y a 44 px. Antes de agregar algo, se pule lo que ya está.
