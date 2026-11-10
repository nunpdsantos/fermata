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
};

export default overlay;
