import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish translations for Level 3 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidad 9: Acordes de Séptima y Armonía Diatónica
  // =========================================================================

  // ---- l3u9m1: Acordes de Séptima — Cinco Cualidades ----

  l3u9m1e1: {
    prompt:
      'Construye un acorde de Cmaj7. Selecciona las 4 notas: fundamental, 3.ª mayor, 5.ª justa y 7.ª mayor.',
    hint: 'Cmaj7 = C, E, G, B. Una tríada mayor (C-E-G) más una 7.ª mayor (B, 11 semitonos por encima de la fundamental).',
  },
  l3u9m1e2: {
    prompt:
      'Construye un acorde de Dm7. Selecciona las 4 notas: fundamental, 3.ª menor, 5.ª justa y 7.ª menor.',
    hint: 'Dm7 = D, F, A, C. Una tríada menor (D-F-A) más una 7.ª menor (C, 10 semitonos por encima de la fundamental).',
  },
  l3u9m1e3: {
    prompt: '¿Qué cualidad de acorde de séptima tiene una tríada mayor con una 7.ª menor?',
    choices: [
      'Séptima de dominante',
      'Séptima mayor',
      'Séptima menor',
      'Séptima semidisminuida',
    ],
    hint: 'La séptima de dominante (ej.: G7) combina una tríada mayor con una 7.ª menor. Es el único tipo de acorde de séptima con esta combinación, generando una fuerte tensión que resuelve hacia la tónica.',
  },
  l3u9m1e4: {
    prompt: '¿Cuál es la diferencia entre un acorde de séptima semidisminuido y uno totalmente disminuido?',
    choices: [
      'El semidisminuido tiene 7.ª menor; el totalmente disminuido tiene 7.ª disminuida (doble bemol)',
      'El semidisminuido tiene 7.ª mayor; el totalmente disminuido tiene 7.ª menor',
      'Usan tríadas diferentes: el semidisminuido es menor, el totalmente disminuido es disminuido',
      'No hay diferencia; son el mismo acorde',
    ],
    hint: 'Ambos comparten una tríada disminuida (fundamental, 3.ªm, 5.ªdim). El semidisminuido añade una 7.ª menor (10 semitonos), mientras que el totalmente disminuido añade una 7.ª disminuida (9 semitonos).',
  },
  l3u9m1e_ear1: {
    prompt: 'Escucha este acorde de séptima e identifica su cualidad.',
    choices: [
      'Séptima mayor',
      'Séptima de dominante',
      'Séptima menor',
      'Séptima semidisminuida',
    ],
    hint: 'Un acorde de séptima mayor: una tríada mayor más una 7.ª mayor (C-E-G-B). Cálido y exuberante — la 7.ª queda solo un semitono por debajo de la octava.',
  },
  l3u9m1e_ear2: {
    prompt: 'Escucha este acorde de séptima e identifica su cualidad.',
    choices: [
      'Séptima mayor',
      'Séptima de dominante',
      'Séptima menor',
      'Séptima semidisminuida',
    ],
    hint: 'Un acorde de séptima menor: una tríada menor más una 7.ª menor (A-C-E-G). Suave y aterciopelado, sin la atracción inquieta de la séptima de dominante.',
  },
  l3u9m1e_ear3: {
    prompt: 'Escucha este acorde de séptima e identifica su cualidad.',
    choices: [
      'Séptima mayor',
      'Séptima de dominante',
      'Séptima menor',
      'Séptima semidisminuida',
    ],
    hint: 'Un acorde de séptima de dominante: una tríada mayor más una 7.ª menor (D-F#-A-C). El trítono F#-C que contiene lo vuelve inquieto — quiere resolver.',
  },
  l3u9m1e_ear4: {
    prompt: 'Escucha este acorde de séptima e identifica su cualidad.',
    choices: [
      'Séptima mayor',
      'Séptima de dominante',
      'Séptima menor',
      'Séptima semidisminuida',
    ],
    hint: 'Un acorde de séptima semidisminuida: una tríada disminuida más una 7.ª menor (E-G-Bb-D). Sombrío e inestable — como un acorde de séptima menor con la 5.ª rebajada.',
  },

  // ---- l3u9m2: Inversiones de Acordes de Séptima ----

  l3u9m2e1: {
    prompt: '¿Qué símbolo de bajo cifrado representa un acorde de séptima en estado fundamental?',
    choices: [
      '7 (abreviatura de 7/5/3)',
      '6/5',
      '4/3',
      '4/2',
    ],
    hint: 'En estado fundamental, los intervalos por encima del bajo son 3.ª, 5.ª y 7.ª. El cifrado completo 7/5/3 se abrevia simplemente a 7.',
  },
  l3u9m2e2: {
    prompt: '¿Qué símbolo de bajo cifrado representa un acorde de séptima en primera inversión?',
    choices: [
      '6/5 (abreviatura de 6/5/3)',
      '7',
      '4/3',
      '4/2',
    ],
    hint: 'La primera inversión coloca la 3.ª del acorde en el bajo. Los intervalos característicos por encima del bajo son una 6.ª y una 5.ª, resultando en el símbolo 6/5.',
  },
  l3u9m2e3: {
    prompt: '¿Qué símbolo de bajo cifrado representa un acorde de séptima en tercera inversión?',
    choices: [
      '4/2 (abreviatura de 6/4/2)',
      '6/5',
      '4/3',
      '7',
    ],
    hint: 'La tercera inversión coloca la 7.ª del acorde en el bajo. Los intervalos por encima del bajo son una 2.ª y una 4.ª, resultando en el símbolo 4/2 (o 2).',
  },

  // ---- l3u9m3: Acordes de Séptima Diatónicos en Mayor ----

  l3u9m3e1: {
    prompt:
      'Construye un acorde de G7 (séptima de dominante). Este es el V7 en Do mayor. Selecciona las 4 notas.',
    hint: 'G7 = G, B, D, F. Una tríada mayor (G-B-D) más una 7.ª menor (F, 10 semitonos por encima de G). El tritono B-F impulsa la resolución hacia C.',
  },
  l3u9m3e2: {
    prompt:
      'Construye un acorde de Am7. Este es el vi7 en Do mayor. Selecciona las 4 notas.',
    hint: 'Am7 = A, C, E, G. Una tríada menor (A-C-E) más una 7.ª menor (G, 10 semitonos por encima de A).',
  },
  l3u9m3e3: {
    prompt: 'El acorde V7 contiene un tritono. ¿Qué dos notas lo forman en la tonalidad de Do mayor?',
    choices: [
      'B y F — la sensible y el 4.º grado de la escala',
      'G y D — la fundamental y la 5.ª del acorde V',
      'C y F# — la tónica y una nota cromática',
      'E y Bb — la 3.ª y un bemol prestado',
    ],
    hint: 'En G7 (G-B-D-F), el tritono está entre B (la 3.ª) y F (la 7.ª), abarcando 6 semitonos. B resuelve hacia arriba a C, mientras que F resuelve hacia abajo a E, generando la resolución V7-I.',
  },

  // ---- l3u9m4: Acordes de Séptima Diatónicos en Menor ----

  l3u9m4e1: {
    prompt:
      'Construye un acorde de E7 (V7 en La menor, usando la menor armónica). Selecciona las 4 notas.',
    hint: 'E7 = E, G#, B, D. El G# procede del 7.º grado elevado de La menor armónica. Este acorde de séptima de dominante proporciona la sensible (G#) que resuelve a A.',
  },
  l3u9m4e2: {
    prompt:
      'En La menor natural, el acorde construido sobre el 7.º grado (G) es una tríada mayor. ¿Por qué cambia esto en la menor armónica?',
    choices: [
      'Elevar el 7.º grado (G a G#) transforma VII en viiº, una tríada disminuida',
      'El acorde del 7.º grado es siempre disminuido independientemente de la forma de la escala menor',
      'La menor armónica desciende el 7.º grado, creando un acorde disminuido',
      'La cualidad del acorde no cambia entre menor natural y menor armónica',
    ],
    hint: 'En La menor natural, VII es G-B-D (mayor). Elevar G a G# en la menor armónica da G#-B-D, que es disminuido (fundamental a 3.ª = 3.ªm, fundamental a 5.ª = 5.ªdim).',
  },
  l3u9m4e3: {
    prompt:
      '¿Cuál es la cualidad del acorde de séptima construido sobre el 2.º grado de la menor armónica (ii en La menor = B)?',
    choices: [
      'Séptima semidisminuida (m7b5)',
      'Séptima menor',
      'Séptima totalmente disminuida',
      'Séptima de dominante',
    ],
    hint: 'En La menor armónica, el ii7 es B-D-F-A: una tríada disminuida (B-D-F) más una 7.ª menor (A). Esta combinación se llama semidisminuida, escrita Bm7b5 o B\u00f8.',
  },

  // =========================================================================
  // Unidad 10: Conducción de Voces y Escritura a Partes
  // =========================================================================

  // ---- l3u10m1: Fundamentos de SATB ----

  l3u10m1e1: {
    prompt: '¿Cuál es la tesitura estándar para la voz de soprano en la escritura SATB?',
    choices: [
      'C4 a G5 (Do central hasta el Sol una octava y una quinta por encima)',
      'C3 a G4',
      'G3 a D5',
      'C5 a C7',
    ],
    hint: 'El soprano es la voz más aguda en SATB. Su tesitura práctica abarca aproximadamente de C4 (Do central) a G5. Sobrepasar esta tesitura hace que la parte sea difícil de cantar.',
  },
  l3u10m1e2: {
    prompt: 'En la escritura SATB, ¿qué tipo de movimiento entre dos voces está generalmente prohibido?',
    choices: [
      'Movimiento paralelo en 5.as u 8.as justas',
      'Movimiento contrario en cualquier intervalo',
      'Movimiento oblicuo en el que una voz se mantiene en la misma nota',
      'Movimiento directo en 3.as',
    ],
    hint: 'Las 5.as y 8.as justas paralelas se evitan porque comprometen la independencia de las voces. Cada voz debe sonar como su propia línea melódica, y las paralelas justas hacen que las voces se fusionen.',
  },
  l3u10m1e3: {
    prompt: 'En tríadas en estado fundamental, ¿qué nota del acorde debe doblarse típicamente?',
    choices: [
      'La fundamental del acorde',
      'La 3.ª del acorde',
      'La 5.ª del acorde',
      'Cualquier nota del acorde por igual',
    ],
    hint: 'Doblar la fundamental refuerza la identidad del acorde y es la opción más segura. Evita doblar la sensible (7.º grado) u otras notas con tendencia de resolución, ya que genera problemas en la resolución.',
  },

  // ---- l3u10m2: Quintas y Octavas Paralelas Prohibidas ----

  l3u10m2e1: {
    prompt: '¿Por qué las quintas justas paralelas se consideran problemáticas en la conducción de voces?',
    choices: [
      'Destruyen la independencia de las voces al hacer que dos voces suenen como una sola',
      'Crean disonancia que el oído no puede resolver',
      'Son físicamente imposibles de cantar',
      'Violan las reglas del ritmo',
    ],
    hint: 'Los intervalos justos (unísonos, 5.as, 8.as) tienen una fuerte fusión acústica. Cuando dos voces se mueven en 5.as paralelas, pierden su identidad individual, reduciendo el número de líneas independientes percibidas.',
  },
  l3u10m2e2: {
    prompt: '¿Cuáles son los cuatro tipos de movimiento entre dos voces?',
    choices: [
      'Paralelo, directo, oblicuo y contrario',
      'Ascendente, descendente, estático y mixto',
      'Conjunto, disjunto, cromático y diatónico',
      'Consonante, disonante, resuelto y suspendido',
    ],
    hint: 'Paralelo = misma dirección, mismo intervalo. Directo = misma dirección, intervalo diferente. Oblicuo = una voz se mueve, la otra se mantiene. Contrario = direcciones opuestas.',
  },
  l3u10m2e3: {
    prompt: '¿Qué tipo de movimiento de voces es más eficaz para crear líneas vocales independientes?',
    choices: [
      'Movimiento contrario — las voces se mueven en direcciones opuestas',
      'Movimiento paralelo — las voces se mueven en la misma dirección por el mismo intervalo',
      'Movimiento directo — las voces se mueven en la misma dirección por intervalos diferentes',
      'Todos los tipos son igualmente eficaces',
    ],
    hint: 'El movimiento contrario maximiza la independencia de las voces porque estas viajan en direcciones opuestas. Es el tipo de movimiento más valorado en el contrapunto y la escritura a partes.',
  },

  // ---- l3u10m3: Escritura a Partes en Estado Fundamental ----

  l3u10m3e1: {
    prompt:
      'Cuando dos acordes en estado fundamental tienen fundamentales a una 5.ª de distancia (ej.: I a V), ¿qué técnica de conducción de voces es más importante?',
    choices: [
      'Mantener la nota común en la misma voz y mover las demás por grado',
      'Mover las cuatro voces en la misma dirección',
      'Mantener todas las voces lo más juntas posible independientemente de notas comunes',
      'Doblar la 3.ª del segundo acorde',
    ],
    hint: 'Cuando las fundamentales se mueven por 5.ª (o 4.ª), los dos acordes comparten una nota común. Mantenerla en la misma voz garantiza una conducción de voces suave mientras las demás voces se mueven por grado.',
  },
  l3u10m3e2: {
    prompt:
      'Cuando dos acordes en estado fundamental tienen fundamentales a una 2.ª de distancia (ej.: IV a V), ¿cuál es la mejor estrategia de conducción de voces?',
    choices: [
      'Mover las tres voces superiores en movimiento contrario al bajo',
      'Mover todas las voces en movimiento paralelo con el bajo',
      'Mantener una voz como nota común',
      'Saltar todas las voces a la nota del acorde más cercana',
    ],
    hint: 'Cuando las fundamentales se mueven por grado, no hay notas comunes. Mover las voces superiores en contrario al bajo previene quintas y octavas paralelas, manteniendo un movimiento de voces suave.',
  },
  l3u10m3e3: {
    prompt: '¿Qué es la «ley del camino más corto» en la conducción de voces?',
    choices: [
      'Cada voz debe moverse hacia la nota del acorde más cercana, prefiriendo el movimiento por grado',
      'El bajo debe moverse siempre la menor distancia',
      'Los acordes deben espaciarse lo más cerca posible',
      'La pieza debe usar el menor número posible de acordes',
    ],
    hint: 'Una conducción de voces suave minimiza la distancia que recorre cada voz. El movimiento por grado (o el mantenimiento de la nota común) se prefiere frente a los saltos, produciendo líneas más cantables y ligadas.',
  },

  // ---- l3u10m4: Tríadas en Inversión ----

  l3u10m4e1: {
    prompt: '¿Cuál es el símbolo de bajo cifrado para una tríada en primera inversión?',
    choices: [
      '6 (abreviatura de 6/3)',
      '5/3',
      '6/4',
      '7',
    ],
    hint: 'La primera inversión coloca la 3.ª del acorde en el bajo. Los intervalos por encima del bajo son una 3.ª y una 6.ª. El 6/3 completo se abrevia simplemente a 6.',
  },
  l3u10m4e2: {
    prompt: '¿El acorde cadencial 6/4 aparece en qué parte de la cadencia?',
    choices: [
      'En un tiempo fuerte, inmediatamente antes del acorde de dominante (V)',
      'En un tiempo débil, después del acorde de tónica',
      'Justo al inicio de una frase',
      'Solo al final de una pieza, en el acorde final',
    ],
    hint: 'El 6/4 cadencial (I6/4) funciona como ornamentación de la dominante. Aparece en un tiempo fuerte con el bajo en el 5.º grado, y las voces superiores resuelven por grado descendente para formar V.',
  },
  l3u10m4e3: {
    prompt: '¿Por qué la segunda inversión (6/4) se usa con más precaución que la primera inversión?',
    choices: [
      'La 4.ª por encima del bajo es una disonancia que requiere resolución específica',
      'Los acordes en segunda inversión suenan peor que en primera inversión',
      'La 5.ª en el bajo hace que el acorde sea imposible de identificar',
      'La segunda inversión está prohibida en toda la música clásica',
    ],
    hint: 'La 4.ª justa por encima del bajo (en posición 6/4) era tratada como disonancia en la armonía de práctica común. Aparece típicamente en cuatro contextos específicos: 6/4 cadencial, de paso, de pedal y arpegiado.',
  },

  // =========================================================================
  // Unidad 11: Cadencias, Frases, Ornamentación
  // =========================================================================

  // ---- l3u11m1: Cadencias ----

  l3u11m1e1: {
    prompt: '¿Qué define una Cadencia Auténtica Perfecta (CAP)?',
    choices: [
      'V a I con ambos acordes en estado fundamental y la tónica en el soprano sobre el acorde I',
      'Cualquier progresión que termine en el acorde I',
      'IV a I en estado fundamental',
      'V a I con la 3.ª de I en el soprano',
    ],
    hint: 'Una CAP tiene tres requisitos: (1) V va a I, (2) ambos acordes están en estado fundamental, y (3) el soprano termina en la nota tónica (1.er grado). Es el tipo de cadencia más fuerte.',
  },
  l3u11m1e2: {
    prompt: '¿Qué es una semicadencia?',
    choices: [
      'Cualquier cadencia que termine en el acorde de dominante (V)',
      'Una cadencia que termina en el acorde de tónica (I)',
      'Una cadencia que usa solo blancas',
      'Una cadencia que modula a una nueva tonalidad',
    ],
    hint: 'Una semicadencia termina en V, creando una sensación abierta y no resuelta — como una coma en una frase. El acorde que precede a V puede ser I, ii, IV o vi. Exige continuación.',
  },
  l3u11m1e3: {
    prompt: 'En una cadencia rota, ¿qué sucede?',
    choices: [
      'V resuelve a vi en lugar del esperado I',
      'I resuelve a V en lugar del esperado IV',
      'IV resuelve a ii en lugar de V',
      'La cadencia se toca más piano de lo esperado',
    ],
    hint: 'La cadencia rota (V a vi) crea la expectativa de resolución a I pero «engaña» al oyente yendo a vi. El acorde vi comparte dos notas con I, lo que la convierte en una sustitución suave pero sorprendente.',
  },
  l3u11m1e4: {
    prompt: '¿Qué es una cadencia plagal?',
    choices: [
      'IV a I — la cadencia del «Amén»',
      'V a I — la cadencia más fuerte',
      'V a vi — la cadencia rota',
      'ii a V — una progresión predominante común',
    ],
    hint: 'La cadencia plagal se mueve de IV a I. Se la llama con frecuencia la cadencia del «Amén» porque tradicionalmente se usa al final de los himnos. Tiene una cualidad más suave y menos impulsiva que V-I.',
  },

  // ---- l3u11m2: Frases y Períodos ----

  l3u11m2e1: {
    prompt: '¿Qué es un período antecedente-consecuente?',
    choices: [
      'Dos frases en las que la primera termina con semicadencia y la segunda con cadencia auténtica',
      'Una sola frase repetida exactamente dos veces',
      'Dos frases completamente sin relación',
      'Una frase que modula a la dominante y regresa',
    ],
    hint: 'Un período es un par de frases: el antecedente (pregunta) termina de forma inconclusiva con una semicadencia, y el consecuente (respuesta) termina de forma conclusiva con una CAP. Juntos forman una afirmación musical completa, como una pregunta y su respuesta.',
  },
  l3u11m2e2: {
    prompt: '¿Qué hace diferente a un período paralelo de un período contrastante?',
    choices: [
      'Un período paralelo comienza ambas frases con material melódico similar',
      'Un período paralelo tiene dos frases con la misma duración',
      'Un período paralelo usa la misma cadencia al final de ambas frases',
      'Un período paralelo tiene voces moviéndose en movimiento paralelo',
    ],
    hint: 'En un período paralelo, la frase consecuente comienza como el antecedente pero diverge para alcanzar una cadencia más fuerte. En un período contrastante, las dos frases comienzan con ideas melódicas diferentes.',
  },
  l3u11m2e3: {
    prompt: 'En la estructura clásica de «frase» (Satz), ¿qué ocurre tras la idea inicial (presentación)?',
    choices: [
      'Una continuación que fragmenta y acelera hacia una cadencia',
      'Una repetición exacta de la presentación',
      'Una sección contrastante en una nueva tonalidad',
      'Un silencio seguido de un nuevo tema',
    ],
    hint: 'La frase clásica tiene dos partes: una presentación (idea básica + repetición) y una continuación (fragmentación + aceleración hacia una cadencia). La continuación impulsa la frase hasta su conclusión.',
  },

  // ---- l3u11m3: Ritmo Armónico ----

  l3u11m3e1: {
    prompt: '¿Qué es el ritmo armónico?',
    choices: [
      'La velocidad a la que los acordes cambian en un pasaje',
      'El ritmo tocado por los instrumentos armónicos',
      'La velocidad de la melodía',
      'La indicación de compás de la pieza',
    ],
    hint: 'El ritmo armónico se refiere a la frecuencia con que la armonía subyacente cambia, independientemente de la actividad rítmica de superficie. Un pasaje puede tener ritmo melódico rápido pero ritmo armónico lento (un acorde por compás).',
  },
  l3u11m3e2: {
    prompt: '¿Qué sucede típicamente con el ritmo armónico en los puntos cadenciales?',
    choices: [
      'Acelera — los acordes cambian más frecuentemente al aproximarse la cadencia',
      'Desacelera — los acordes cambian menos frecuentemente en las cadencias',
      'Se mantiene igual a lo largo de la frase',
      'Se detiene por completo antes del acorde cadencial',
    ],
    hint: 'La aceleración cadencial es una técnica habitual: los cambios de acorde se aceleran cerca de las cadencias, creando una sensación de impulso y llegada. Por ejemplo, los acordes pueden cambiar cada compás, luego cada dos tiempos, luego cada tiempo en la cadencia.',
  },
  l3u11m3e3: {
    prompt: '¿En qué se diferencia el efecto del ritmo armónico lento del rápido?',
    choices: [
      'Lento crea estabilidad y reposo; rápido crea tensión e impulso',
      'Lento se usa siempre en tonalidades menores; rápido en tonalidades mayores',
      'Lento significa menos notas por compás; rápido significa más notas por compás',
      'No hay diferencia perceptible para el oyente',
    ],
    hint: 'Ritmo armónico lento (un acorde durante varios compases) da una sensación de calma o estasis. Ritmo armónico rápido (varios cambios de acorde por compás) crea urgencia, complejidad e impulso hacia adelante.',
  },

  // ---- l3u11m4: Notas Extrañas al Acorde Parte 1 ----

  l3u11m4e1: {
    prompt: '¿Qué es una nota de paso?',
    choices: [
      'Una nota extraña que se mueve por grado entre dos notas del acorde en la misma dirección',
      'Una nota que se mantiene del acorde anterior',
      'Una nota extraña abordada por salto y resuelta por grado',
      'Un trino ornamental sobre una nota del acorde',
    ],
    hint: 'Una nota de paso rellena el hueco entre dos notas del acorde a una 3.ª de distancia. Se aborda por grado y se resuelve por grado en la misma dirección. Ejemplo: en un acorde de C, D pasa entre C y E.',
  },
  l3u11m4e2: {
    prompt: '¿Qué es una bordadura?',
    choices: [
      'Una nota extraña que se aleja por grado de una nota del acorde y regresa a ella',
      'Una nota extraña que se mueve por grado entre dos notas del acorde diferentes',
      'Una nota del acorde que se repite en el siguiente tiempo',
      'Una nota prestada de una tonalidad vecina',
    ],
    hint: 'Una bordadura (o nota auxiliar) se aleja de una nota del acorde por grado (hacia arriba o hacia abajo) y regresa a la misma nota. Decora una sola altura: nota del acorde → grado hacia fuera → grado de vuelta.',
  },
  l3u11m4e3: {
    prompt: '¿Qué es una anticipación?',
    choices: [
      'Una nota extraña que llega antes — hace sonar una nota del acorde siguiente antes de que el acorde cambie',
      'Una nota del acorde que se retrasa hasta después del tiempo',
      'Una nota que se mantiene del acorde anterior',
      'Una pausa que sustituye a una nota esperada',
    ],
    hint: 'Una anticipación «anticipa» el acorde siguiente haciendo sonar una de sus notas antes de tiempo, antes de que la armonía cambie. Es típicamente una nota breve y no acentuada que resuelve manteniéndose en la misma altura.',
  },

  // ---- l3u11m5: Transposición ----

  l3u11m5e1: {
    prompt: 'Transpón C4 una 2.ª mayor hacia arriba. Identifica el intervalo de 2 semitonos ascendente a partir de C.',
    hint: 'Una 2.ª mayor son 2 semitonos. C más 2 semitonos = D. Transponer una 2.ª mayor hacia arriba mueve cada nota un tono arriba.',
  },
  l3u11m5e2: {
    prompt: 'Transpón C4 una 5.ª justa hacia arriba. Identifica el intervalo de 7 semitonos ascendente a partir de C.',
    hint: 'Una 5.ª justa son 7 semitonos. C más 7 semitonos = G. Transponer una 5.ªJ hacia arriba es una de las transposiciones más comunes, pasando de Do mayor a Sol mayor.',
  },
  l3u11m5e3: {
    prompt: 'Al transponer una melodía una 3.ª menor hacia arriba, ¿qué ocurre con la armadura de clave?',
    choices: [
      'Cambia para reflejar la nueva tonalidad (ej.: Do mayor se convierte en Mib mayor, ganando 3 bemoles)',
      'Se mantiene igual; solo las notas se mueven',
      'Los sostenidos y bemoles se eliminan',
      'Cada nota recibe una alteración accidental',
    ],
    hint: 'La transposición desplaza todo a una nueva tonalidad. Subir una 3.ª menor (3 semitonos) desde Do mayor llega a Mib mayor. La nueva armadura de clave (3 bemoles) preserva todas las relaciones interválicas.',
  },
};

export default overlay;
