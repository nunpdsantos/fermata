import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish translations for Level 1 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {

  l1u33m1e1: {
    prompt: 'Una parte de guitarra tiene clave de sol con un pequeño 8 debajo. ¿Cómo suena el E4 escrito?',
    choices: [
      'Como E5',
      'Como E3',
      'Como E4',
      'Como B3'
    ],
    hint: 'El pequeño 8 debajo de la clave significa una octava más baja: el E4 escrito suena como E3.'
  },
  l1u33m1e2: {
    prompt: '¿Qué indica ③ junto a una nota de guitarra?',
    choices: [
      'Dedo 3',
      'Traste 3',
      'Cuerda 3',
      'Posición III'
    ],
    hint: 'Un número en círculo indica la cuerda. Los números de los dedos de la mano izquierda no llevan círculo.'
  },
  l1u33m1e3: {
    prompt: 'En la afinación estándar de la guitarra, ¿qué cuerda al aire suena E2?',
    choices: [
      '⑥',
      '①',
      '④',
      '②'
    ],
    hint: 'La cuerda 6 es la más gruesa y grave: su altura al aire es E2 en la afinación estándar.'
  },
  l1u33m2e1: {
    prompt: '¿Qué dedo de la mano izquierda indica el número 4?',
    choices: [
      'Índice',
      'Anular',
      'Medio',
      'Meñique'
    ],
    hint: 'Los dedos de la mano izquierda son 1 índice, 2 medio, 3 anular y 4 meñique.'
  },
  l1u33m2e2: {
    prompt: '¿Qué significa 0 en una digitación de guitarra?',
    choices: [
      'Tocar la cuerda sin ningún dedo de la mano izquierda pisándola en ningún traste',
      'Tocar la cuerda con un dedo de la mano izquierda pisándola en el traste 1',
      'Tocar la cuerda con una cejilla de la mano izquierda pisándola en el traste 1',
      'Tocar la cuerda con un dedo de la mano izquierda pisándola en el traste 3'
    ],
    hint: 'Cero significa que ningún dedo de la mano izquierda pisa la cuerda.'
  },
  l1u33m2e3: {
    prompt: '¿Qué orden de dedos indica p-i-m-a?',
    choices: [
      'Meñique, índice, medio, anular',
      'Pulgar, índice, medio, anular',
      'Pulgar, índice, medio, meñique',
      'Anular, índice, medio, pulgar'
    ],
    hint: 'Las letras de la mano derecha son p pulgar, i índice, m medio y a anular.'
  },
  l1u33m2e4: {
    prompt: '¿Qué letras significan pulgar, anular, medio, índice?',
    choices: [
      'a-p-m-i',
      'p-i-m-a',
      'p-a-m-i',
      'a-m-p-i'
    ],
    hint: 'Lee las letras en orden: p es pulgar, a es anular, m es medio e i es índice.'
  },
  l1u33m3e1: {
    prompt: 'En la posición V, ¿qué traste sirve normalmente de base al índice?',
    choices: [
      'Traste 4',
      'Traste 5',
      'Traste 6',
      'Traste 7'
    ],
    hint: 'V significa quinta posición: el índice tiene como base el traste 5.'
  },
  l1u33m3e2: {
    prompt: '¿Qué instrucción da CV en la notación de guitarra?',
    choices: [
      'Cejilla parcial en el traste 5',
      'Cejilla completa en el traste 4',
      'Cejilla parcial en el traste 4',
      'Cejilla completa en el traste 5'
    ],
    hint: 'C indica una cejilla completa y V la sitúa en el traste 5. V solo indica la posición sin exigir una cejilla.'
  },
  l1u33m3e3: {
    prompt: '¿Qué indicación pide una cejilla parcial en el traste 5?',
    choices: [
      '½CV',
      'CV',
      'V',
      '⑤'
    ],
    hint: '½C pide una cejilla parcial; V indica el traste. La partitura o la digitación dice qué cuerdas debes abarcar.'
  }
,
  // =========================================================================
  // Unidad 1: Notación y Altura
  // =========================================================================

  // ---- l1u1m1: Pentagrama y Claves ----

  l1u1m1e1: {
    prompt:
      'Identifica esta nota en la clave de sol: se encuentra en una pequeña línea extra (una línea adicional) justo por debajo del pentagrama.',
    hint: 'El C central se sitúa en una línea adicional justo por debajo del pentagrama de clave de sol.',
    nudge: 'La clave de sol se enrolla alrededor de la segunda línea y la marca como G. Cuenta hacia abajo desde ahí, una letra por cada línea o espacio, hasta llegar a la línea adicional por debajo del pentagrama.',
  },
  l1u1m1e2: {
    prompt:
      'Identifica esta nota: se encuentra en la primera línea del pentagrama de clave de sol.',
    hint: 'Las líneas de la clave de sol, de abajo a arriba, son E-G-B-D-F. La primera línea es E4.',
    nudge: 'La clave de sol se enrolla alrededor de la segunda línea y la marca como G. Baja desde ahí, una letra por cada espacio o línea, hasta llegar a la primera línea.',
  },
  l1u1m1e3: {
    prompt:
      'Identifica esta nota: se encuentra en la segunda línea del pentagrama de clave de sol.',
    hint: 'La clave de sol se enrolla alrededor de la segunda línea, marcándola como G. Por eso también se llama clave de G.',
    nudge: 'Cuenta hacia arriba desde el C central (la línea adicional justo por debajo del pentagrama), una letra por cada línea o espacio, hasta llegar a esta línea.',
  },
  l1u1m1e4: {
    prompt:
      '¿Cuál es la clave que utiliza la segunda línea del pentagrama como punto de referencia para la nota G?',
    choices: [
      'Clave de sol',
      'Clave de fa',
      'Clave de do (alto)',
      'Clave de percusión',
    ],
    hint: 'La clave de sol también se llama clave de G porque se enrolla alrededor de la segunda línea, definiéndola como G.',
    nudge: 'Cada clave de altura definida nació de una letra estilizada y fija una nota en una línea del pentagrama. ¿Cuál tiene la espiral enrollada alrededor de la segunda línea contando desde abajo?',
  },

  // ---- l1u1m2: Líneas Adicionales ----

  l1u1m2e1: {
    prompt:
      'Identifica esta nota por debajo del pentagrama de clave de sol: se encuentra en la segunda línea adicional inferior.',
    hint: 'Por debajo del pentagrama de clave de sol: B3 está en el espacio por debajo de la primera línea adicional (C4), y A3 está en la segunda línea adicional.',
    nudge: 'Empieza en el C central, en la primera línea adicional por debajo del pentagrama de clave de sol, y cuenta hacia abajo una letra por cada línea o espacio.',
  },
  l1u1m2e2: {
    prompt:
      'Identifica esta nota por encima del pentagrama de clave de sol: se encuentra dos líneas adicionales por encima de la línea superior.',
    hint: 'C6 se sitúa en la segunda línea adicional por encima del pentagrama de clave de sol. Cuenta desde la línea superior (F5): G5, A5, B5, C6.',
    nudge: 'Empieza en la línea superior del pentagrama de clave de sol (F5) y cuenta hacia arriba una letra por cada línea o espacio: el espacio de encima, la primera línea adicional, el espacio siguiente y, por último, la segunda línea adicional.',
  },
  l1u1m2e3: {
    prompt: '¿Cuál es la función de las líneas adicionales?',
    choices: [
      'Escribir alturas fuera del pentagrama',
      'Separar los compases en el pentagrama',
      'Subir todas las alturas una octava',
      'Unir dos pentagramas en un sistema',
    ],
    hint: 'El pentagrama tiene solo cinco líneas. Las notas que sobrepasan esas líneas necesitan pequeñas líneas adicionales para indicar su posición.',
  },
  l1u1m2e_ear1: {
    prompt: 'Escucha esta nota e identifícala.',
    hint: 'Compárala con la referencia que oíste primero: ¿es más aguda, más grave o exactamente la misma nota?',
  },
  l1u1m2e_ear2: {
    prompt: 'Escucha esta nota e identifícala.',
    hint: 'Esta nota natural se sitúa en la primera línea del pentagrama de clave de sol.',
  },
  l1u1m2e_ear3: {
    prompt: 'Escucha esta nota e identifícala.',
    hint: 'Esta nota se sitúa en la segunda línea del pentagrama de clave de sol — la línea alrededor de la cual se enrolla la clave de sol.',
  },
  l1u1m2e_ear4: {
    prompt: 'Escucha esta nota e identifícala.',
    hint: 'Es más aguda que el C de referencia: canta subiendo por las teclas blancas desde C, un grado cada vez, hasta llegar a ella.',
  },

  // ---- l1u1m3: Semitonos y Tonos ----

  l1u1m3e1: {
    prompt: '¿Cuál es el intervalo de Db, descendiendo, hasta C?',
    hint: 'De Db descendiendo hasta C es la menor distancia posible en la música occidental: un semitono (medio tono), de la tecla negra a la tecla blanca justo por debajo. Dos letras distintas (D, C) lo convierten en una 2.ª — una 2.ª menor.',
    nudge: 'Busca Db y C en el teclado y fíjate en lo que hay entre ellas: ¿son teclas vecinas o hay otra tecla, blanca o negra, en medio?',
  },
  l1u1m3e2: {
    prompt: '¿Cuál es el intervalo de C a D?',
    hint: 'De C a D es un tono: dos semitonos, equivalente a 2 semitonos. Hay una tecla (C#/Db) entre ellos.',
    nudge: 'Busca C y D en el teclado y cuenta las teclas de una a otra, incluidas las negras: ¿el D es la tecla inmediatamente siguiente o hay una tecla en medio?',
  },
  l1u1m3e3: {
    prompt:
      '¿Cuál es el intervalo de E a F? Este es un par especial de notas naturales.',
    hint: 'De E a F es un semitono natural: no hay tecla negra entre ellas en el piano. Es solo 1 semitono.',
    nudge: 'Mira E y F en el teclado: ¿hay una tecla negra entre ellas, como la hay entre la mayoría de las teclas blancas vecinas?',
  },

  // ---- l1u1m4: Escala Cromática ----

  l1u1m4e1: {
    prompt: 'Identifica esta nota: la tecla negra entre F y G.',
    hint: 'La tecla negra entre F y G puede llamarse F# (F sostenido) o Gb (G bemol). Ambos nombres se refieren a la misma altura.',
    nudge: 'Un sostenido sube una nota natural un semitono, y todas las opciones aquí son sostenidos. ¿Un semitono por encima de qué tecla blanca está esta tecla negra? Nómbrala a partir de esa tecla.',
  },
  l1u1m4e2: {
    prompt: 'Identifica esta nota: la tecla negra entre A y B.',
    hint: 'La tecla negra entre A y B puede llamarse Bb (B bemol) o A# (A sostenido). En tonalidades con bemoles, esta nota se llama Bb.',
    nudge: 'Un bemol baja una nota natural un semitono, y todas las opciones aquí son bemoles. ¿Un semitono por debajo de qué tecla blanca está esta tecla negra? Nómbrala a partir de esa tecla.',
  },
  l1u1m4e3: {
    prompt:
      '¿Cuántas alturas distintas tiene la escala cromática antes de repetirse?',
    choices: ['12', '7', '8', '10'],
    hint: 'La escala cromática incluye todas las notas: 7 teclas blancas + 5 teclas negras = 12 alturas distintas por octava.',
    nudge: 'Cuenta todas las teclas, blancas y negras, desde un C hasta el C siguiente, pero sin contar el C de arriba: ahí es donde el patrón vuelve a empezar.',
  },

  // =========================================================================
  // Unidad 2: Ritmo y Compás
  // =========================================================================

  // ---- l1u2m1: Valores de las Notas ----

  l1u2m1e1: {
    prompt:
      'En compás 4/4, ¿cuántos tiempos dura una redonda?',
    choices: ['4 tiempos', '2 tiempos', '1 tiempo', '8 tiempos'],
    hint: 'Una redonda ocupa un compás entero de 4/4. Dura 4 tiempos de negra.',
    nudge: 'Una redonda ocupa por sí sola un compás entero de 4/4. Mira la indicación de compás: ¿qué cuenta el número de arriba?',
  },
  l1u2m1e2: {
    prompt: '¿Cuántos tiempos vale una blanca en compás 4/4?',
    choices: ['2 tiempos', '4 tiempos', '1 tiempo', '3 tiempos'],
    hint: 'Una blanca tiene la mitad de la duración de una redonda. Una redonda = dos blancas = 4 tiempos / 2 = 2 tiempos cada una.',
    nudge: 'Una blanca dura la mitad que una redonda, y la redonda ocupa un compás entero de 4/4.',
  },
  l1u2m1e3: {
    prompt: '¿Cuántos tiempos vale una negra en compás 4/4?',
    choices: ['1 tiempo', '2 tiempos', '1/2 tiempo', '4 tiempos'],
    hint: 'En compás 4/4, el número inferior (4) indica que la negra vale un tiempo. Cuatro negras ocupan un compás.',
  },

  // ---- l1u2m2: Compás e Indicaciones de Compás ----

  l1u2m2e1: {
    prompt: '¿Qué significa la indicación de compás 4/4?',
    choices: [
      '4 tiempos medidos en negras por compás',
      '4 tiempos medidos en blancas por compás',
      '4 tiempos medidos en redondas por compás',
      '4 tiempos medidos en corcheas por compás',
    ],
    hint: 'El número superior (4) indica los tiempos por compás. El número inferior (4) indica que la negra vale un tiempo.',
  },
  l1u2m2e2: {
    prompt: '¿Qué te dice la indicación de compás 3/4?',
    choices: [
      '3 tiempos medidos en negras por compás',
      '3 tiempos medidos en blancas por compás',
      '3 tiempos medidos en redondas por compás',
      '3 tiempos medidos en corcheas por compás',
    ],
    hint: '3/4 significa tres tiempos de negra por compás. Esto crea la sensación de vals: UN-dos-tres.',
  },
  l1u2m2e3: {
    prompt:
      '¿Cuál de las siguientes opciones describe mejor el «compás simple»?',
    choices: [
      'El tiempo se divide en 2 notas iguales',
      'El tiempo se divide en 3 notas iguales',
      'El compás contiene 2 tiempos',
      'El compás contiene 3 tiempos',
    ],
    hint: 'En el compás simple, los tiempos se subdividen en dos. En el compás compuesto, se subdividen en tres. 4/4 y 3/4 son compases simples.',
  },

  // =========================================================================
  // Unidad 3: Escalas, Intervalos y Primeros Acordes
  // =========================================================================

  // ---- l1u3m1: Escala Mayor ----

  l1u3m1e1: {
    prompt:
      'Construye la escala de C mayor. Selecciona las 7 notas en el instrumento.',
    hint: 'C mayor usa solo las teclas blancas: C, D, E, F, G, A, B. El patrón es T-T-S-T-T-T-S.',
  },
  l1u3m1e2: {
    prompt:
      'Construye la escala de G mayor. Selecciona las 7 notas. Recuerda: una nota necesita un sostenido.',
    hint: 'G mayor: G, A, B, C, D, E, F#. El F debe elevarse a F# para mantener el patrón T-T-S-T-T-T-S.',
  },
  l1u3m1e_deg1: {
    prompt: 'En la escala de C mayor, ¿cuál es el grado de la nota E?',
    hint: 'Cuenta desde la fundamental: C=1, D=2, E=3.',
  },
  l1u3m1e_deg2: {
    prompt: 'En la escala de C mayor, ¿cuál es el grado de la nota G?',
    hint: 'G es la 5.ª nota de C mayor — la dominante.',
  },
  l1u3m1e_deg3: {
    prompt: 'En la escala de C mayor, ¿cuál es el grado de la nota F?',
    hint: 'F es la 4.ª nota de C mayor — la subdominante.',
  },
  l1u3m1e_deg4: {
    prompt: 'En la escala de G mayor, ¿cuál es el grado de la nota B?',
    hint: 'Cuenta desde G: G=1, A=2, B=3.',
  },

  // ---- l1u3m2: Armaduras de Clave ----

  l1u3m2e1: {
    prompt: '¿Cuántos sostenidos tiene la tonalidad de G mayor?',
    choices: [
      '1 sostenido (F#)',
      '0 sostenidos o bemoles',
      '2 sostenidos (F#, C#)',
      '2 bemoles (Bb, Eb)',
    ],
    hint: 'G mayor necesita F# para mantener el patrón T-T-S-T-T-T-S. Ese único sostenido es su armadura de clave.',
  },
  l1u3m2e2: {
    prompt: '¿Qué nota se bemoliza en la armadura de clave de F mayor?',
    choices: ['B lleva bemol; A, E y F quedan naturales', 'E lleva bemol; A, B y F quedan naturales', 'A lleva bemol; B, E y F quedan naturales', 'F lleva bemol; A, B y E quedan naturales'],
    hint: 'F mayor necesita Bb para mantener el patrón de la escala mayor. La cuarta nota (B) debe bajarse a Bb.',
  },
  l1u3m2e3: {
    prompt: '¿Cuál es la armadura de clave de D mayor?',
    choices: [
      'Armadura de clave: F#, C#',
      'Armadura de clave: F#',
      'Armadura de clave: F#, C#, G#',
      'Armadura de clave: Bb, Eb',
    ],
    hint: 'D mayor añade C# al F# de G mayor. Los sostenidos se acumulan en orden: F#, C#, G#, D#, A#, E#, B#.',
  },

  // ---- l1u3m3: Intervalos ----

  l1u3m3e1: {
    prompt:
      'Identifica el intervalo: C a G (ascendente). Cuenta los nombres de las notas.',
    hint: 'C-D-E-F-G = 5 nombres de notas = una 5.ª. De C a G son 7 semitonos, lo que corresponde a una 5.ª justa.',
    nudge: 'Di los nombres de las notas en orden, de C hasta G, y cuéntalos, incluidos el C y el G: ese total es el número del intervalo. Cuenta las notas mismas, no los pasos entre ellas.',
  },
  l1u3m3e2: {
    prompt:
      'Identifica el intervalo: C a F (ascendente). Cuenta los nombres de las notas.',
    hint: 'C-D-E-F = 4 nombres de notas = una 4.ª. De C a F son 5 semitonos, lo que corresponde a una 4.ª justa.',
    nudge: 'Di los nombres de las notas en orden, de C hasta F, y cuéntalos, incluidos el C y el F: ese total es el número del intervalo. Cuenta las notas mismas, no los pasos entre ellas.',
  },
  l1u3m3e3: {
    prompt:
      'Identifica el intervalo: C a E (ascendente). Cuenta los nombres de las notas.',
    hint: 'C-D-E = 3 nombres de notas = una 3.ª. De C a E son 4 semitonos, lo que corresponde a una 3.ª mayor.',
    nudge: 'Di los nombres de las notas en orden, de C hasta E, y cuéntalos, incluidos el C y el E: ese total es el número del intervalo. Cuenta las notas mismas, no los pasos entre ellas.',
  },

  // ---- l1u3m4: Tríadas Mayores ----

  l1u3m4e1: {
    prompt:
      'Construye una tríada de C mayor. Selecciona las 3 notas: fundamental, 3.ª mayor y 5.ª justa.',
    hint: 'C mayor = C, E, G. Fundamental (C) + 3.ª mayor (E, 4 semitonos por encima) + 5.ª justa (G, 7 semitonos por encima).',
  },
  l1u3m4e2: {
    prompt:
      'Construye una tríada de G mayor. Selecciona las 3 notas que forman este acorde.',
    hint: 'G mayor = G, B, D. Fundamental (G) + 3.ª mayor (B, 4 semitonos por encima) + 5.ª justa (D, 7 semitonos por encima).',
  },
  l1u3m4e3: {
    prompt: 'Construye una tríada de B mayor. Selecciona las tres notas.',
    hint: 'Una tríada mayor apila una 3.ª mayor (4 semitonos desde la fundamental) y después una 3.ª menor encima (3 más), resultando en fundamental + 3M + 5J.',
  },

  // ── Track "Start with sound" (wave 2) ──
  l1u34m1e1: {
    prompt: 'Escucha dos notas, una después de otra. ¿Cuál es más aguda?',
    choices: ['La primera nota', 'La segunda nota', 'Ninguna: son la misma nota'],
    hint: 'La segunda nota era más aguda: el sonido subió.',
    nudge: 'Escúchalo otra vez y tararéalo. ¿Tu voz tiene que subir o bajar para seguir el cambio?',
  },
  l1u34m1e2: {
    prompt: 'Escucha otras dos notas, una después de otra. ¿Cuál es más aguda?',
    choices: ['La primera nota', 'La segunda nota', 'Ninguna: son la misma nota'],
    hint: 'La primera nota era más aguda: el sonido bajó.',
    nudge: 'Escúchalo otra vez y tararéalo. ¿Tu voz tiene que subir o bajar para seguir el cambio?',
  },
  l1u34m1e3: {
    prompt: 'Escucha dos notas. ¿Cómo es la segunda comparada con la primera?',
    choices: ['La misma nota otra vez, más aguda', 'La misma nota otra vez, más grave', 'Una nota distinta, más aguda', 'Una nota distinta, más grave'],
    hint: 'Era una octava: la misma nota otra vez, más aguda, así que conserva su nombre.',
    nudge: 'Primero decide si el sonido subió o bajó. Luego tararea las dos: ¿se parecen o son muy distintas?',
  },
  l1u34m1e4: {
    prompt: 'En el piano, ¿dónde están las notas más agudas?',
    choices: ['En el lado derecho', 'En el lado izquierdo', 'En las teclas del centro', 'En las teclas blancas'],
    hint: 'En el piano las notas se vuelven más agudas de izquierda a derecha: cada tecla es un poco más aguda que la que tiene a su izquierda.',
    nudge: 'Imagina la tecla más grave del piano. ¿Hacia qué lado avanzas para subir desde ella?',
  },
  l1u34m1e5: {
    prompt: 'En la guitarra, ¿qué cuerda suena más aguda cuando la tocas al aire?',
    choices: ['La cuerda más fina', 'La cuerda más gruesa', 'La cuerda del medio', 'La cuerda más cercana a ti'],
    hint: 'Tocada al aire, cada cuerda más fina suena más aguda que la de al lado, así que la más fina es la más aguda.',
    nudge: 'Recuerda la lección sobre la guitarra: ¿cómo cambian las cuerdas de la más grave a la siguiente?',
  },
  l1u34m2e1: {
    prompt: 'En los nombres de las notas, ¿qué letra viene justo después de G?',
    choices: ['A', 'F', 'B', 'E'],
    hint: 'Solo hay siete letras, de A a G. Después de G los nombres vuelven a empezar en A, una octava más arriba.',
    nudge: 'Solo hay siete letras. ¿Qué pasa con los nombres después de la última?',
  },
  l1u34m2e2: {
    prompt: 'En el piano, ¿qué tecla blanca queda justo a la izquierda de un grupo de dos teclas negras?',
    choices: ['C', 'D', 'F', 'E'],
    hint: 'C es la tecla blanca justo a la izquierda de cada grupo de dos teclas negras. Justo a la izquierda de cada grupo de tres está F.',
    nudge: 'Las teclas negras van en grupos de dos y de tres. Imagina un grupo de dos y la tecla blanca a su izquierda: ¿qué letra le dio la lección?',
  },
  l1u34m2e3: {
    prompt: 'En una guitarra con la afinación habitual, ¿cómo se llaman las cuerdas al aire, de la más gruesa a la más fina?',
    choices: ['E, A, D, G, B, E', 'E, B, G, D, A, E', 'E, F, G, A, B, C', 'E, A, D, G, C, F'],
    hint: 'Desde la más gruesa: E, A, D, G, B y otra vez E, dos octavas por encima de la primera.',
    nudge: 'La cuerda más gruesa y la más fina comparten letra, y el orden empieza por la más gruesa. ¿Qué lista cumple las dos cosas?',
  },
  l1u34m2e4: {
    prompt: 'Empezando en C, selecciona siete notas, una por cada letra. En el piano, usa solo teclas blancas.',
    hint: 'C, D, E, F, G, A y B: una nota por cada letra, todas teclas blancas en el piano.',
    nudge: 'Empieza en C, la tecla blanca justo a la izquierda de un grupo de dos teclas negras, y toma cada vez la tecla blanca siguiente hasta tener siete.',
  },
  l1u34m2e5: {
    prompt: 'Dos notas están a una octava de distancia. ¿Cómo se llaman?',
    choices: ['Con la misma letra', 'Con la letra siguiente', 'Con la letra anterior', 'Con la letra de al lado'],
    hint: 'Las notas a una octava de distancia suenan tan parecidas que comparten letra: las siete letras vuelven a empezar después de G.',
    nudge: 'Cuenta las siete letras desde cualquier nota. ¿Dónde llegas cuando los nombres vuelven a empezar?',
  },
  l1u34m3e1: {
    prompt: 'Escucha dos notas. ¿A qué distancia están?',
    choices: ['Un semitono', 'Un tono', 'Dos tonos'],
    hint: 'Un semitono: las dos notas eran vecinas, sin ninguna nota entre ellas.',
    nudge: 'Escúchalo otra vez y canta las dos notas. ¿Cabría otra nota entre ellas, o no?',
  },
  l1u34m3e2: {
    prompt: 'Escucha otras dos notas. ¿A qué distancia están?',
    choices: ['Un semitono', 'Un tono', 'Dos tonos'],
    hint: 'Un tono: dos semitonos, con una nota saltada en medio.',
    nudge: 'Escúchalo otra vez y canta las dos notas. ¿Cabría otra nota entre ellas, o no?',
  },
  l1u34m3e3: {
    prompt: '¿Qué es C sostenido (C♯)?',
    choices: ['La nota un semitono por encima de C', 'La nota un semitono por debajo de C', 'La nota un tono por encima de C', 'La nota un tono por debajo de C'],
    hint: 'Sostenido significa un semitono más agudo: C♯ es la tecla negra justo a la derecha de C, también llamada D♭.',
    nudge: 'El sostenido y el bemol mueven una nota la menor distancia que existe. ¿Cuál de los dos sube?',
  },
  l1u34m3e4: {
    prompt: '¿Qué dos teclas blancas vecinas están a solo un semitono?',
    choices: ['B y C', 'C y D', 'F y G', 'G y A'],
    hint: 'No hay tecla negra entre B y C (ni entre E y F), así que están a solo un semitono.',
    nudge: 'Busca dos teclas blancas sin tecla negra entre ellas.',
  },
  l1u34m3e5: {
    prompt: 'Selecciona las doce notas distintas desde C hasta B, blancas y negras, cada una a un semitono de la siguiente.',
    hint: 'De C a B hay doce notas, cada una a un semitono de la siguiente: siete teclas blancas y cinco negras.',
    nudge: 'Empieza en C y toma todas las teclas por orden, negras y blancas, hasta que la siguiente vuelva a ser C.',
  },
  l1u34m4e1: {
    prompt: 'Construye la escala mayor que empieza en C: selecciona sus siete notas.',
    hint: 'C, D, E, F, G, A y B: todas las teclas blancas, porque los dos semitonos caen de E a F y de B a C.',
    nudge: 'Empieza en C y sube: tono, tono, semitono, tono, tono, tono, semitono.',
  },
  l1u34m4e2: {
    prompt: 'Construye la escala mayor que empieza en G. Usa los mismos pasos que desde C.',
    hint: 'G, A, B, C, D, E y F♯: el F sube para que el último paso, hasta G, sea un semitono.',
    nudge: 'Sube desde G: tono, tono, semitono, tono, tono, tono, semitono. Revisa con cuidado los dos últimos pasos.',
  },
  l1u34m4e3: {
    prompt: 'Escucha esta escala. ¿Cuál es?',
    choices: ['Mayor', 'Cromática', 'Tonos enteros'],
    hint: 'Mayor: tonos y semitonos mezclados, subiendo de vuelta a casa arriba.',
    nudge: 'Escúchala otra vez. ¿Eran todos los pasos del mismo tamaño, y cuántas notas oíste?',
  },
  l1u34m4e4: {
    prompt: 'Escucha esta subida. ¿Cuál es?',
    choices: ['Mayor', 'Cromática', 'Tonos enteros'],
    hint: 'Cromática: todas las notas, cada una a un semitono de la anterior, trece notas de C a C.',
    nudge: 'Escúchala otra vez. ¿Eran todos los pasos del mismo tamaño, y cuántas notas oíste?',
  },
  l1u34m4e5: {
    prompt: 'Numera las notas de una escala mayor del 1 al 8 desde abajo. ¿Dónde están sus dos semitonos?',
    choices: ['Del 3 al 4 y del 7 al 8', 'Del 1 al 2 y del 5 al 6', 'Del 2 al 3 y del 6 al 7', 'Del 4 al 5 y del 7 al 8'],
    hint: 'Tono, tono, semitono, tono, tono, tono, semitono: el tercer paso (del 3 al 4) y el séptimo (del 7 al 8) son los semitonos.',
    nudge: 'Di los pasos en orden y cuéntalos con los dedos: ¿cuáles son los dos pequeños?',
  },
  l1u34m5e1: {
    prompt: 'Construye el acorde de C mayor: la 1.ª, la 3.ª y la 5.ª notas de la escala de C mayor.',
    hint: 'C, E y G: la 1.ª, la 3.ª y la 5.ª notas de la escala de C mayor.',
    nudge: 'Empieza en C y luego toma una nota sí y otra no de la escala de C mayor hasta tener tres.',
  },
  l1u34m5e2: {
    prompt: 'Construye C menor: parte de C mayor y baja un semitono su nota central.',
    hint: 'C, E♭ y G: el E de C mayor baja un semitono, a E♭.',
    nudge: 'Construye primero C mayor y luego mueve solo la nota central una tecla hacia abajo.',
  },
  l1u34m5e3: {
    prompt: 'Construye G mayor: la 1.ª, la 3.ª y la 5.ª notas de la escala de G mayor.',
    hint: 'G, B y D: la 1.ª, la 3.ª y la 5.ª notas de la escala de G mayor.',
    nudge: 'Sube la escala de G mayor desde G y quédate con una nota sí y otra no: la 1.ª, la 3.ª y la 5.ª.',
  },
  l1u34m5e4: {
    prompt: 'Escucha este acorde. ¿Es mayor o menor?',
    choices: ['Mayor', 'Menor'],
    hint: 'Mayor: suena luminoso y estable.',
    nudge: 'Escúchalo otra vez y fíjate en su color: ¿luminoso y estable, o más oscuro?',
  },
  l1u34m5e5: {
    prompt: 'Escucha un acorde más. ¿Es mayor o menor?',
    choices: ['Mayor', 'Menor'],
    hint: 'Menor: suena más oscuro, porque su nota central está un semitono por debajo de la de un acorde mayor.',
    nudge: 'Escúchalo otra vez y fíjate en su color: ¿luminoso y estable, o más oscuro?',
  },
  // ── Track "From the chords you know" (wave 2) ──
  l1u35m1e1: {
    prompt: 'Junta las notas de G, C, D y Em y deja fuera las repetidas. ¿Cuántas notas distintas hay?',
    choices: ['Siete notas', 'Tres notas', 'Cuatro notas', 'Doce notas'],
    hint: 'Siete: G, A, B, C, D, E y F♯, las notas de la escala de G mayor.',
    nudge: 'Escribe las tres notas de cada acorde y después tacha cada nota que ya hayas escrito.',
  },
  l1u35m1e2: {
    prompt: '¿Qué nota pertenece a la tonalidad de G?',
    choices: ['F♯', 'F', 'C♯', 'B♭'],
    hint: 'F♯: está en el acorde de D, D, F♯ y A, y la tonalidad de G tiene F♯ en lugar de F.',
    nudge: 'Piensa en las notas del acorde de D: ¿cuál de ellas es una tecla negra en el piano?',
  },
  l1u35m1e3: {
    prompt: '¿Qué es una tonalidad?',
    choices: [
      'Una familia de siete notas y los acordes construidos con ellas',
      'El acorde que suena como la casa, tocado al principio de una canción',
      'Las tres notas distintas que forman cada acorde de una canción',
      'Siete notas cualesquiera, tocadas en orden desde la más grave',
    ],
    hint: 'Una tonalidad es una familia de siete notas y los acordes construidos con ellas, con el nombre de la nota que suena como la casa.',
    nudge: 'Piensa en G, C, D y Em: ¿qué comparten los cuatro, y de dónde salieron sus acordes?',
  },
  l1u35m1e4: {
    prompt: 'Construye la escala de G mayor: selecciona sus siete notas, las notas de G, C, D y Em juntas.',
    hint: 'G, A, B, C, D, E y F♯: todas las notas de los cuatro acordes, cada una una vez.',
    nudge: 'Toma las tres notas de cada uno de los cuatro acordes, una cada vez, y selecciona cada nota nueva hasta tener siete.',
  },
  l1u35m1e5: {
    prompt: 'Escucha este acorde de la tonalidad de G. ¿Es mayor o menor?',
    choices: ['Mayor', 'Menor'],
    hint: 'Menor: era Em, E, G y B, el más oscuro de los acordes que tocaste.',
    nudge: 'Vuelve a escucharlo y fíjate en su color: ¿brillante y abierto, o más oscuro?',
  },
  l1u35m2e1: {
    prompt: 'En la tonalidad de G, ¿qué nota es el número 5?',
    choices: ['D', 'C', 'E', 'B'],
    hint: 'D: G es 1, A es 2, B es 3, C es 4 y D es 5.',
    nudge: 'Sube por la escala de G mayor desde G, que es el 1, una nota cada vez.',
  },
  l1u35m2e2: {
    prompt: 'En la tonalidad de C, ¿qué acordes son el I, el IV y el V?',
    choices: ['C, F y G', 'C, E y G', 'C, D y G', 'C, F y E'],
    hint: 'C, F y G: los acordes sobre las notas 1, 4 y 5 de C mayor, los tres mayores.',
    nudge: 'Sube por la escala de C hasta las notas 4 y 5 y construye un acorde mayor sobre cada una.',
  },
  l1u35m2e3: {
    prompt: 'G, C y D en la tonalidad de G son el I, el IV y el V. ¿Qué acordes hacen el mismo movimiento en la tonalidad de D?',
    choices: ['D, G y A', 'D, E y A', 'D, A y B', 'D, G y B'],
    hint: 'D, G y A: las notas 1, 4 y 5 de D mayor. Los números se quedan; solo cambian los nombres.',
    nudge: 'Sube por la escala de D mayor desde D hasta las notas 4 y 5.',
  },
  l1u35m2e4: {
    prompt: 'Primero oyes el acorde de casa de la tonalidad. Después cuatro acordes: ¿qué números son?',
    choices: ['I - IV - V - I', 'I - V - IV - I', 'I - IV - I - V'],
    hint: 'I – IV – V – I: casa, el acorde sobre el 4, el acorde sobre el 5 y otra vez casa.',
    nudge: 'Tararea la nota más grave de cada acorde. ¿Qué acorde suena más lejos de casa, y dónde termina el último?',
  },
  l1u35m2e5: {
    prompt: 'Otra vez el acorde de casa y después cuatro acordes en otra tonalidad. ¿Qué números son?',
    choices: ['I - IV - V - I', 'I - V - IV - I', 'I - IV - I - V'],
    hint: 'I – V – IV – I: casa, el acorde sobre el 5, el acorde sobre el 4 y otra vez casa.',
    nudge: 'Tararea la nota más grave de cada acorde. ¿El segundo acorde sube más que el tercero, o no tanto?',
  },
  l1u35m2e6: {
    prompt: 'Construye el acorde IV de la tonalidad de D.',
    hint: 'G mayor, G, B y D: la nota 4 de D mayor es G, y el IV es un acorde mayor.',
    nudge: 'Sube por la escala de esta tonalidad hasta la nota 4 y construye un acorde mayor sobre esa nota.',
  },
  l1u35m3e1: {
    prompt: 'En la tonalidad de G, ¿qué acorde es el vi?',
    choices: ['Em', 'C', 'Am', 'Bm'],
    hint: 'Em: la nota 6 de G mayor es E, y el acorde sobre el 6 es menor.',
    nudge: 'Sube por la escala de G hasta la nota 6 y recuerda que un número romano en minúscula indica un acorde menor.',
  },
  l1u35m3e2: {
    prompt: '¿Qué acordes de una tonalidad mayor son menores?',
    choices: ['Los acordes sobre el 2, el 3 y el 6', 'Los acordes sobre el 1, el 4 y el 5', 'Los acordes sobre el 4, el 5 y el 6', 'Los acordes sobre el 2, el 5 y el 7'],
    hint: 'Los acordes sobre el 2, el 3 y el 6: ii, iii y vi, escritos en minúscula.',
    nudge: 'Tres de los siete acordes son mayores y uno es disminuido. ¿Cuáles son los tres que quedan?',
  },
  l1u35m3e3: {
    prompt: '¿Qué tipo de acorde está sobre la nota 7 de una tonalidad mayor?',
    choices: ['Un acorde disminuido', 'Un acorde mayor', 'Un acorde menor', 'Un acorde de séptima'],
    hint: 'Un acorde disminuido, escrito vii°: en G es F♯, A y C.',
    nudge: 'Los acordes sobre el 1 al 6 son mayores o menores. El que queda es el diferente: ¿qué tipo le dio la lección?',
  },
  l1u35m3e4: {
    prompt: '¿Cuál es la relativa menor de C mayor?',
    choices: ['A menor', 'C menor', 'E menor', 'D menor'],
    hint: 'La tonalidad de A menor: empieza en la nota 6 de C mayor y usa las mismas siete notas, todas las teclas blancas.',
    nudge: 'La relativa menor comparte las siete notas y empieza en el vi de la tonalidad mayor. Sube por la escala de C hasta la nota 6.',
  },
  l1u35m3e5: {
    prompt: 'Primero el acorde de casa, después cuatro acordes. ¿Qué números son?',
    choices: ['I - vi - IV - V', 'I - IV - vi - V', 'I - V - vi - IV'],
    hint: 'I – vi – IV – V: casa, después el vi, más oscuro, después el IV y el V.',
    nudge: 'Busca el único acorde menor, el más oscuro. ¿Es el segundo acorde, el tercero o el cuarto?',
  },
  l1u35m3e6: {
    prompt: 'Construye el ii de la tonalidad de C: el acorde sobre la nota 2, con las notas de la propia tonalidad.',
    hint: 'Dm, D, F y A: una nota sí y otra no de C mayor desde D.',
    nudge: 'Empieza en la nota 2 de la escala de C y toma una nota sí y otra no de la misma escala hasta tener tres.',
  },
  l1u35m4e1: {
    prompt: 'En la tonalidad de D, ¿qué acorde tira con más fuerza de vuelta a D?',
    choices: ['A', 'G', 'Bm', 'Em'],
    hint: 'A, el V de D: tiene C♯, la 7.ª nota de la tonalidad, un semitono por debajo de D.',
    nudge: 'El tirón más fuerte hacia casa viene del acorde sobre la nota 5. Sube por la escala de D mayor hasta él.',
  },
  l1u35m4e2: {
    prompt: 'En el acorde V, ¿qué nota se inclina con más fuerza hacia casa?',
    choices: [
      'La 7.ª nota de la tonalidad, un semitono por debajo de la casa',
      'La 5.ª nota de la tonalidad, un tono por encima de la 4.ª',
      'La 2.ª nota de la tonalidad, un tono por encima de la casa',
      'La 4.ª nota de la tonalidad, un semitono por encima de la 3.ª',
    ],
    hint: 'La 7.ª nota de la tonalidad: está un semitono por debajo de la casa, tan cerca que el oído quiere que suba.',
    nudge: '¿Qué nota del acorde V es la que está más cerca de la nota de casa?',
  },
  l1u35m4e3: {
    prompt: 'En la tonalidad de A, el acorde V es E. ¿Cuál de sus notas está un semitono por debajo de la casa?',
    choices: ['G♯', 'F♯', 'B', 'E'],
    hint: 'G♯: la 7.ª nota de A mayor, en el acorde de E, E, G♯ y B.',
    nudge: 'La nota que tira es la 7.ª de la tonalidad. ¿Qué nota del acorde de E está así de cerca, por debajo de la nota de casa?',
  },
  l1u35m4e4: {
    prompt: 'Primero oyes el acorde de casa. Después cuatro acordes: ¿la secuencia termina lejos, en el V, o vuelve a casa, al I?',
    choices: ['I - IV - I - V', 'I - IV - V - I'],
    hint: 'I - IV - I - V: termina lejos, en el V, que se inclina de vuelta hacia casa y deja la secuencia sin terminar.',
    nudge: 'Vuelve a escucharlo y espera después del último acorde. ¿Suena terminado, o como si debiera venir un acorde más?',
  },
  l1u35m4e5: {
    prompt: 'El acorde de casa y después tres acordes que se van y vuelven. ¿La vuelta a casa fue desde el IV, el camino más suave, o desde el V, el tirón más fuerte?',
    choices: ['I - IV - I', 'I - V - I'],
    hint: 'I - IV - I: casa desde el IV, de C a G, sin ninguna nota un semitono por debajo de la casa, así que la vuelta es tranquila.',
    nudge: 'Escucha el acorde del medio: ¿se inclina con urgencia hacia casa, o vuelve a asentarse con suavidad?',
  },
  l1u35m5e1: {
    prompt: '¿Qué cambia entre D mayor y D menor?',
    choices: ['Solo la nota del medio, un semitono abajo', 'La nota de arriba, un semitono abajo', 'La nota más grave, un semitono arriba', 'La nota del medio, un semitono arriba'],
    hint: 'Solo cambia la nota del medio, y baja un semitono: D, F♯ y A pasan a ser D, F y A.',
    nudge: 'D mayor es D, F♯ y A. ¿Cuál de las tres es distinta en D menor, y hacia dónde va?',
  },
  l1u35m5e2: {
    prompt: 'Construye A menor: parte de A mayor y baja un semitono su nota del medio.',
    hint: 'A, C y E: el C♯ de A mayor baja un semitono, a C.',
    nudge: 'Construye primero A mayor y después mueve solo la nota del medio una tecla hacia abajo.',
  },
  l1u35m5e3: {
    prompt: 'Construye D menor: D mayor con la nota del medio un semitono más baja.',
    hint: 'D, F y A: el F♯ de D mayor baja un semitono, a F.',
    nudge: 'Construye primero D mayor y después mueve solo la nota del medio una tecla hacia abajo.',
  },
  l1u35m5e4: {
    prompt: 'En la guitarra, ¿cómo conviertes la forma abierta de A en Am?',
    choices: ['Pasas la nota de la cuerda B un traste más abajo', 'Pasas la nota de la cuerda B un traste más arriba', 'Pasas la nota de la cuerda G un traste más abajo', 'Pasas la nota de la cuerda D un traste más abajo'],
    hint: 'La cuerda B toca la nota del medio, C♯, en el traste 2; un traste más abajo, en el traste 1, es C, y el acorde es Am.',
    nudge: 'Averigua qué cuerda toca la nota del medio de A mayor y después decide hacia dónde queda un semitono más abajo.',
  },
  l1u35m5e5: {
    prompt: 'Escucha este acorde. ¿Es mayor o menor?',
    choices: ['Mayor', 'Menor'],
    hint: 'Mayor: suena brillante y abierto.',
    nudge: 'Vuelve a escucharlo y fíjate en la nota del medio: ¿brillante y abierta, o más oscura?',
  },
  l1u35m5e6: {
    prompt: 'Escucha un acorde más. ¿Es mayor o menor?',
    choices: ['Mayor', 'Menor'],
    hint: 'Menor: suena más oscuro, porque su nota del medio está un semitono por debajo de la del acorde mayor.',
    nudge: 'Vuelve a escucharlo y fíjate en la nota del medio: ¿brillante y abierta, o más oscura?',
  },
  l1u35m6e1: {
    prompt: 'Construye C mayor: la 1.ª, la 3.ª y la 5.ª notas de la escala de C mayor.',
    hint: 'C, E y G: C, salta D, E, salta F, G.',
    nudge: 'Empieza en C y toma una nota sí y otra no de su escala mayor hasta tener tres.',
  },
  l1u35m6e2: {
    prompt: 'Construye D mayor: su fundamental, su 3.ª y su 5.ª.',
    hint: 'D, F♯ y A: una nota sí y otra no de la escala de D mayor desde D.',
    nudge: 'Empieza en D y toma una nota sí y otra no de la escala de D mayor hasta tener tres.',
  },
  l1u35m6e3: {
    prompt: 'Construye Em, el acorde vi de G: una nota sí y otra no de la tonalidad de G, desde E.',
    hint: 'E, G y B: E, salta F♯, G, salta A, B.',
    nudge: 'Empieza en E y toma una nota sí y otra no de la escala de esta tonalidad hasta tener tres.',
  },
  l1u35m6e4: {
    prompt: 'Un acorde de G abierto suena en seis cuerdas. ¿Cuántas notas distintas toca?',
    choices: ['Tres notas distintas', 'Seis notas distintas', 'Cuatro notas distintas', 'Cinco notas distintas'],
    hint: 'Tres: desde la cuerda más gruesa, G, B, D, G, B y G. Las notas se repiten en otras octavas.',
    nudge: 'Nombra la nota de cada cuerda, empezando por la más gruesa, y cuenta cuántos nombres has usado.',
  },
  l1u35m6e5: {
    prompt: '¿Qué nota es la 3.ª del acorde de D mayor?',
    choices: ['F♯', 'A', 'E', 'C♯'],
    hint: 'F♯: en la escala de D mayor, D es 1, E es 2 y F♯ es 3.',
    nudge: 'Sube por la escala de D mayor desde D, que es el 1, hasta su tercera nota.',
  },
  l1u35m6e6: {
    prompt: '¿Qué nota de un acorde lo hace mayor o menor?',
    choices: ['La 3.ª', 'La fundamental', 'La 5.ª'],
    hint: 'La 3.ª, la nota del medio: un semitono más baja en el acorde menor.',
    nudge: 'Piensa en la lección anterior: ¿cuál de las tres notas cambió cuando un acorde mayor pasó a menor?',
  },
  l1u35m7e1: {
    prompt: 'Construye G7: G mayor con una cuarta nota, un tono por debajo del G de arriba.',
    hint: 'G, B, D y F: G mayor con F, la séptima letra desde G, encima.',
    nudge: 'Construye primero G mayor y después añade la nota que está dos teclas por debajo del siguiente G, más agudo.',
  },
  l1u35m7e2: {
    prompt: '¿Qué nota añade G7 al acorde de G mayor?',
    choices: ['F', 'F♯', 'E', 'A'],
    hint: 'F: un tono por debajo del G de arriba, la séptima letra contando G como la primera.',
    nudge: 'Cuenta siete letras desde G, con G como la primera, y comprueba que está un tono por debajo del siguiente G.',
  },
  l1u35m7e3: {
    prompt: '¿De qué tonalidad es G7 el V7?',
    choices: ['C mayor', 'G mayor', 'D mayor', 'F mayor'],
    hint: 'C mayor: G es la nota 5 de C, y G, B, D y F son todas notas de C.',
    nudge: 'Busca la tonalidad mayor cuya nota 5 es la fundamental de G7 y que tiene sus cuatro notas.',
  },
  l1u35m7e4: {
    prompt: '¿Qué tres acordes forman el blues de doce compases en G?',
    choices: ['G7, C7 y D7', 'G7, C7 y E7', 'G7, D7 y E7', 'G7, B7 y C7'],
    hint: 'G7, C7 y D7: I7, IV7 y V7 en G.',
    nudge: 'El blues usa el I, el IV y el V. Sube por la escala de G mayor hasta las notas 4 y 5.',
  },
  l1u35m7e5: {
    prompt: 'Escucha este acorde. ¿Es un simple acorde mayor, o un acorde de séptima de dominante, con una séptima encima?',
    choices: ['Séptima de dominante', 'Mayor'],
    hint: 'Séptima de dominante: D7, con C encima de D, F♯ y A, que lo hace inclinarse hacia delante.',
    nudge: 'Escucha la parte de arriba del acorde: ¿hay una cuarta nota que lo hace sonar inquieto?',
  },
  l1u35m8e1: {
    prompt: '¿Qué acordes son I–V–vi–IV en la tonalidad de D?',
    choices: ['D, A, Bm y G', 'D, G, Bm y A', 'D, A, Em y G', 'D, E, Bm y G'],
    hint: 'D, A, Bm y G: las notas 1, 5, 6 y 4 de D mayor, con un acorde menor sobre el 6.',
    nudge: 'Numera las notas de D mayor del 1 al 7 y después lee los acordes en el orden de los números.',
  },
  l1u35m8e2: {
    prompt: 'Una canción en G usa G, C y D. La pasas a la tonalidad de A. ¿Qué acordes tocas?',
    choices: ['A, D y E', 'A, C y D', 'A, D y F♯', 'A, C y E'],
    hint: 'A, D y E: cada acorde sube un tono, como G sube a A.',
    nudge: 'De G a A hay un tono. Sube cada uno de los otros acordes la misma distancia.',
  },
  l1u35m8e3: {
    prompt: 'Tocas formas de G con un capo en el traste 2. ¿En qué tonalidad suena?',
    choices: ['En la tonalidad de A', 'En la tonalidad de G', 'En la tonalidad de B', 'En la tonalidad de E'],
    hint: 'En la tonalidad de A: dos trastes son dos semitonos, un tono por encima de G.',
    nudge: 'Cada traste es un semitono más agudo. Cuenta dos semitonos hacia arriba desde G.',
  },
  l1u35m8e4: {
    prompt: 'Tocas formas de C con el capo en el traste 4. ¿En qué tonalidad suena?',
    choices: ['En la tonalidad de E', 'En la tonalidad de D', 'En la tonalidad de F', 'En la tonalidad de C'],
    hint: 'En la tonalidad de E: cuatro semitonos por encima de C, C♯, D, D♯ y E.',
    nudge: 'Cuenta cuatro semitonos hacia arriba desde C, un traste por cada uno.',
  },
  l1u35m8e5: {
    prompt: 'Primero el acorde de casa, después una secuencia de cuatro acordes en una tonalidad nueva. ¿Qué números son?',
    choices: ['I - V - vi - IV', 'I - vi - IV - V', 'I - IV - V - I'],
    hint: 'I – V – vi – IV, en A: A, E, F♯m y D.',
    nudge: 'Busca el único acorde menor y dónde aparece, y después el acorde que cierra la secuencia.',
  },
  l1u35m9e1: {
    prompt: 'Construye la pentatónica mayor de G: las notas de G mayor sin las notas 4 y 7.',
    hint: 'G, A, B, D y E: G mayor sin el C, su 4.ª nota, y sin el F♯, su 7.ª.',
    nudge: 'Parte de la escala de G mayor y deja fuera su 4.ª y su 7.ª notas.',
  },
  l1u35m9e2: {
    prompt: 'Construye la pentatónica menor de A: las cinco notas de la pentatónica mayor de C, desde A.',
    hint: 'A, C, D, E y G: la pentatónica mayor de C, tocada desde A.',
    nudge: 'Construye la pentatónica mayor de la tonalidad relativa mayor y después empiézala en A.',
  },
  l1u35m9e3: {
    prompt: '¿Qué dos notas de una tonalidad mayor deja fuera la pentatónica mayor?',
    choices: ['Las notas 4 y 7', 'Las notas 2 y 6', 'Las notas 3 y 5', 'Las notas 1 y 5'],
    hint: 'Las notas 4 y 7: cada una está a un semitono de una nota del acorde I.',
    nudge: '¿Qué dos notas de la tonalidad están a un semitono de una nota del acorde de casa?',
  },
  l1u35m9e4: {
    prompt: '¿Con qué pentatónica mayor comparte sus cinco notas la pentatónica menor de E?',
    choices: ['La pentatónica de G mayor', 'La pentatónica de E mayor', 'La pentatónica de C mayor', 'La pentatónica de D mayor'],
    hint: 'La pentatónica de G mayor: E menor es la relativa menor de G, y las dos pentatónicas son E, G, A, B y D.',
    nudge: '¿Qué tonalidad mayor tiene E menor como relativa menor?',
  },
  l1u35m9e5: {
    prompt: 'Escucha esta escala. ¿Cuál es?',
    choices: ['Pentatónica mayor', 'Mayor', 'Pentatónica menor'],
    hint: 'Pentatónica mayor: cinco notas, ningún semitono y una 3.ª brillante sobre la primera nota.',
    nudge: 'Vuelve a escucharla y cuenta las notas antes de la de arriba. Después escucha la tercera nota: ¿brillante u oscura?',
  },
  l1u35m10e1: {
    prompt: '¿Qué acorde no es uno de los acordes de la tonalidad de G?',
    choices: ['F', 'C', 'Em', 'D'],
    hint: 'F: su F no está en G mayor, que tiene F♯.',
    nudge: 'Escribe las tres notas de cada acorde y busca una nota que la tonalidad de G no tenga.',
  },
  l1u35m10e2: {
    prompt: 'En la tonalidad de G, F mayor se escribe ♭VII. ¿Por qué?',
    choices: [
      'Está sobre la nota 7 de la tonalidad, bajada un semitono',
      'Está sobre la nota 7 de la tonalidad, subida un semitono',
      'Está sobre la nota 6 de la tonalidad, bajada un semitono',
      'Está sobre la nota 4 de la tonalidad, bajada un semitono',
    ],
    hint: 'La nota 7 de G mayor es F♯; bajada un semitono es F, y el acorde sobre ella es mayor, así que ♭VII.',
    nudge: '¿Qué nota de G mayor está a un semitono de F, y en qué dirección?',
  },
  l1u35m10e3: {
    prompt: 'En la tonalidad de G, ¿qué acorde es el ii?',
    choices: ['A menor', 'A mayor', 'C mayor', 'C menor'],
    hint: 'El acorde de A menor: A, C y E, todas en G mayor. El acorde de A mayor, con C♯, sería el II, de fuera de la tonalidad.',
    nudge: 'Construye un acorde sobre la nota 2 solo con las notas de G mayor y comprueba su nota del medio.',
  },
  l1u35m10e4: {
    prompt: 'Una canción hace G, F, C y G y siempre vuelve a reposar en G. ¿En qué tonalidad está?',
    choices: ['En G, con un acorde de fuera', 'En F, con un acorde de fuera', 'En C, con un acorde de fuera', 'En D, con un acorde de fuera'],
    hint: 'En G: es el acorde en el que la canción vuelve a reposar, y C también pertenece a G; F es prestado.',
    nudge: '¿Qué acorde suena como la casa? Después comprueba cuáles de los otros pertenecen a esa tonalidad.',
  },
  l1u35m10e5: {
    prompt: 'Construye el ♭VII de la tonalidad de G: un acorde mayor sobre la nota 7 de G mayor, bajada un semitono.',
    hint: 'F, A y C: F mayor, sobre F, un semitono por debajo de F♯.',
    nudge: 'Encuentra la nota 7 de G mayor, bájala una tecla y construye un acorde mayor sobre ella.',
  },
};

export default overlay;
