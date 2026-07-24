import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish translations for Level 1 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidad 1: Notación y Altura
  // =========================================================================

  // ---- l1u1m1: Pentagrama y Claves ----

  l1u1m1e1: {
    prompt:
      'Identifica esta nota en la clave de sol: se encuentra en la línea adicional por debajo del pentagrama.',
    hint: 'El C central se sitúa en una línea adicional justo por debajo del pentagrama de clave de sol.',
  },
  l1u1m1e2: {
    prompt:
      'Identifica esta nota: se encuentra en la primera línea del pentagrama de clave de sol.',
    hint: 'Las líneas de la clave de sol, de abajo a arriba, son E-G-B-D-F. La primera línea es E4.',
  },
  l1u1m1e3: {
    prompt:
      'Identifica esta nota: se encuentra en la segunda línea del pentagrama de clave de sol.',
    hint: 'La clave de sol se enrolla alrededor de la segunda línea, marcándola como G. Por eso también se llama clave de G.',
  },
  l1u1m1e4: {
    prompt:
      '¿Cuál es la clave que utiliza la segunda línea del pentagrama como punto de referencia para la nota G?',
    choices: [
      'Clave de sol',
      'Clave de fa',
      'Clave de do (alto)',
      'Clave de do (tenor)',
    ],
    hint: 'La clave de sol también se llama clave de G porque se enrolla alrededor de la segunda línea, definiéndola como G.',
  },

  // ---- l1u1m2: Líneas Adicionales ----

  l1u1m2e1: {
    prompt:
      'Identifica esta nota por debajo del pentagrama de clave de sol: se encuentra en el espacio justo por debajo del C central.',
    hint: 'A3 se sitúa dos líneas adicionales por debajo del pentagrama de clave de sol. Descendiendo desde el C central: B3 está en el espacio por debajo de la línea adicional, A3 está en la siguiente línea adicional.',
  },
  l1u1m2e2: {
    prompt:
      'Identifica esta nota por encima del pentagrama de clave de sol: se encuentra dos líneas adicionales por encima de la línea superior.',
    hint: 'C6 se sitúa en la segunda línea adicional por encima del pentagrama de clave de sol. Cuenta desde la línea superior (F5): G5, A5, B5, C6.',
  },
  l1u1m2e3: {
    prompt: '¿Cuál es la función de las líneas adicionales?',
    choices: [
      'Prolongar el pentagrama para notas por encima o por debajo de sus cinco líneas',
      'Indicar el tempo de una pieza',
      'Separar los compases entre sí',
      'Mostrar dónde se producen los silencios',
    ],
    hint: 'El pentagrama tiene solo cinco líneas. Las notas que sobrepasan esas líneas necesitan pequeñas líneas adicionales para indicar su posición.',
  },
  l1u1m2e_ear1: {
    prompt: 'Escucha esta nota e identifícala.',
    hint: 'Este es el C central — la nota más central del teclado del piano.',
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
    hint: 'Esta es la nota de referencia estándar para la afinación, a 440 Hz.',
  },

  // ---- l1u1m3: Semitonos y Tonos ----

  l1u1m3e1: {
    prompt: '¿Cuál es el intervalo de C a C#?',
    hint: 'De C a C# es la menor distancia posible en la música occidental: un semitono, equivalente a 1 semitono.',
  },
  l1u1m3e2: {
    prompt: '¿Cuál es el intervalo de C a D?',
    hint: 'De C a D es un tono: dos semitonos, equivalente a 2 semitonos. Hay una tecla (C#/Db) entre ellos.',
  },
  l1u1m3e3: {
    prompt:
      '¿Cuál es el intervalo de E a F? Este es un par especial de notas naturales.',
    hint: 'De E a F es un semitono natural: no hay tecla negra entre ellas en el piano. Es solo 1 semitono.',
  },

  // ---- l1u1m4: Escala Cromática ----

  l1u1m4e1: {
    prompt: 'Identifica esta nota: la tecla negra entre F y G.',
    hint: 'La tecla negra entre F y G puede llamarse F# (F sostenido) o Gb (G bemol). Ambos nombres se refieren a la misma altura.',
  },
  l1u1m4e2: {
    prompt: 'Identifica esta nota: la tecla negra entre A y B.',
    hint: 'La tecla negra entre A y B puede llamarse Bb (B bemol) o A# (A sostenido). En tonalidades con bemoles, esta nota se llama Bb.',
  },
  l1u1m4e3: {
    prompt:
      '¿Cuántas alturas distintas tiene la escala cromática antes de repetirse?',
    choices: ['12', '7', '8', '10'],
    hint: 'La escala cromática incluye todas las notas: 7 teclas blancas + 5 teclas negras = 12 alturas distintas por octava.',
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
  },
  l1u2m1e2: {
    prompt: '¿Cuántos tiempos vale una blanca en compás 4/4?',
    choices: ['2 tiempos', '4 tiempos', '1 tiempo', '3 tiempos'],
    hint: 'Una blanca tiene la mitad de la duración de una redonda. Una redonda = dos blancas = 4 tiempos / 2 = 2 tiempos cada una.',
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
      '4 tiempos de negra por compás',
      '4 tiempos de blanca por compás',
      '4 tiempos de corchea por compás',
      '4 compases por línea',
    ],
    hint: 'El número superior (4) indica los tiempos por compás. El número inferior (4) indica que la negra vale un tiempo.',
  },
  l1u2m2e2: {
    prompt: '¿Qué indica la indicación de compás 3/4?',
    choices: [
      '3 tiempos de negra por compás',
      '3 tiempos de blanca por compás',
      '4 tiempos agrupados en tres',
      '3 compases de 4 tiempos',
    ],
    hint: '3/4 significa tres tiempos de negra por compás. Esto crea la sensación de vals: UN-dos-tres.',
  },
  l1u2m2e3: {
    prompt:
      '¿Cuál de las siguientes opciones describe mejor el «compás simple»?',
    choices: [
      'Cada tiempo se divide naturalmente en dos partes iguales',
      'Cada tiempo se divide naturalmente en tres partes iguales',
      'La música no tiene indicación de compás',
      'El tempo es lento y regular',
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
      '1 bemol (Bb)',
    ],
    hint: 'G mayor necesita F# para mantener el patrón T-T-S-T-T-T-S. Ese único sostenido es su armadura de clave.',
  },
  l1u3m2e2: {
    prompt: '¿Cuál es la tonalidad con la armadura de clave de un bemol (Bb)?',
    choices: ['F mayor', 'Bb mayor', 'C mayor', 'G mayor'],
    hint: 'F mayor necesita Bb para mantener el patrón de la escala mayor. La cuarta nota (B) debe descenderse a Bb.',
  },
  l1u3m2e3: {
    prompt: '¿Cuál es la armadura de clave de D mayor?',
    choices: [
      '2 sostenidos (F# y C#)',
      '1 sostenido (F#)',
      '3 sostenidos (F#, C#, G#)',
      '2 bemoles (Bb, Eb)',
    ],
    hint: 'D mayor añade C# al F# de G mayor. Los sostenidos se acumulan en orden: F#, C#, G#, D#, A#, E#, B#.',
  },

  // ---- l1u3m3: Intervalos ----

  l1u3m3e1: {
    prompt:
      'Identifica el intervalo: C a G (ascendente). Cuenta los nombres de las notas.',
    hint: 'C-D-E-F-G = 5 nombres de notas = una 5.ª. De C a G son 7 semitonos, lo que corresponde a una 5.ª justa.',
  },
  l1u3m3e2: {
    prompt:
      'Identifica el intervalo: C a F (ascendente). Cuenta los nombres de las notas.',
    hint: 'C-D-E-F = 4 nombres de notas = una 4.ª. De C a F son 5 semitonos, lo que corresponde a una 4.ª justa.',
  },
  l1u3m3e3: {
    prompt:
      'Identifica el intervalo: C a E (ascendente). Cuenta los nombres de las notas.',
    hint: 'C-D-E = 3 nombres de notas = una 3.ª. De C a E son 4 semitonos, lo que corresponde a una 3.ª mayor.',
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
    prompt: '¿Qué intervalos componen una tríada mayor?',
    choices: [
      'Fundamental, 3.ª mayor (4 semitonos), 5.ª justa (7 semitonos)',
      'Fundamental, 3.ª menor (3 semitonos), 5.ª justa (7 semitonos)',
      'Fundamental, 3.ª mayor (4 semitonos), 5.ª menor (6 semitonos)',
      'Fundamental, 4.ª justa (5 semitonos), 5.ª justa (7 semitonos)',
    ],
    hint: 'Una tríada mayor apila una 3.ª mayor (4 semitonos desde la fundamental) y después una 3.ª menor encima (3 más), resultando en fundamental + 3.ªM + 5.ªJ.',
  },
};

export default overlay;
