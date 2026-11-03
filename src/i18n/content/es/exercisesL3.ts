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
    nudge: 'Construye un acorde de séptima sobre cada grado de C mayor, solo con teclas blancas, y busca el que tiene una tríada mayor con una 7.ª menor. El tipo de acorde lleva el nombre de ese grado.',
  },
  l3u9m1e4: {
    prompt: '¿Cuál es la diferencia entre un acorde de séptima semidisminuido y uno totalmente disminuido?',
    choices: [
      'El semidisminuido tiene 7.ª menor; el totalmente disminuido tiene 7.ª disminuida',
      "El semidisminuido tiene 7.ª menor; el totalmente disminuido tiene 7.ª menor",
      "El semidisminuido tiene 7.ª disminuida; el totalmente disminuido tiene 7.ª menor",
      "El semidisminuido tiene 7.ª disminuida; el totalmente disminuido tiene 7.ª disminuida",
    ],
    hint: 'Ambos comparten una tríada disminuida (fundamental, 3m, 5.ª disminuida). El semidisminuido añade una 7.ª menor (10 semitonos), mientras que el totalmente disminuido añade una 7.ª disminuida (9 semitonos).',
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
    nudge: 'Escucha en dos pasos. Primero, ¿la tríada de base es brillante (mayor), suave (menor) o tensa y hueca (disminuida)? Después, ¿la 7.ª de arriba está pegada a la fundamental una octava más arriba, rozándola, o un tono por debajo de ella?',
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
    nudge: 'Escucha en dos pasos. Primero, ¿la tríada de base es brillante (mayor), suave (menor) o tensa y hueca (disminuida)? Después, ¿la 7.ª de arriba está pegada a la fundamental una octava más arriba, rozándola, o un tono por debajo de ella?',
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
    nudge: 'Escucha en dos pasos. Primero, ¿la tríada de base es brillante (mayor), suave (menor) o tensa y hueca (disminuida)? Después, ¿la 7.ª de arriba está pegada a la fundamental una octava más arriba, rozándola, o un tono por debajo de ella?',
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
    nudge: 'Escucha en dos pasos. Primero, ¿la tríada de base es brillante (mayor), suave (menor) o tensa y hueca (disminuida)? Después, ¿la 7.ª de arriba está pegada a la fundamental una octava más arriba, rozándola, o un tono por debajo de ella?',
  },

  // ---- l3u9m2: Inversiones de Acordes de Séptima ----

  l3u9m2e1: {
    prompt: '¿Qué símbolo de bajo cifrado representa un acorde de séptima en estado fundamental?',
    choices: [
      '7 (abreviatura de 7/5/3)',
      '6/5 (abreviatura de 6/5/3)',
      '4/3 (abreviatura de 6/4/3)',
      '4/2 (abreviatura de 6/4/2)',
    ],
    hint: 'En estado fundamental, los intervalos por encima del bajo son 3.ª, 5.ª y 7.ª. El cifrado completo 7/5/3 se abrevia simplemente a 7.',
  },
  l3u9m2e2: {
    prompt: '¿Qué símbolo de bajo cifrado representa un acorde de séptima en primera inversión?',
    choices: [
      '6/5 (abreviatura de 6/5/3)',
      '7 (abreviatura de 7/5/3)',
      '4/3 (abreviatura de 6/4/3)',
      '4/2 (abreviatura de 6/4/2)',
    ],
    hint: 'La primera inversión coloca la 3.ª del acorde en el bajo. Los intervalos característicos por encima del bajo son una 6.ª y una 5.ª, resultando en el símbolo 6/5.',
  },
  l3u9m2e3: {
    prompt: '¿Qué símbolo de bajo cifrado representa un acorde de séptima en tercera inversión?',
    choices: [
      '4/2 (abreviatura de 6/4/2)',
      '6/5 (abreviatura de 6/5/3)',
      '4/3 (abreviatura de 6/4/3)',
      '7 (abreviatura de 7/5/3)',
    ],
    hint: 'La tercera inversión coloca la 7.ª del acorde en el bajo. Los intervalos por encima del bajo son una 2.ª y una 4.ª, resultando en el símbolo 4/2 (o 2).',
  },

  // ---- l3u9m3: Acordes de Séptima Diatónicos en Mayor ----

  l3u9m3e1: {
    prompt:
      'Construye un acorde de G7 (séptima de dominante). Este es el V7 en C mayor. Selecciona las 4 notas.',
    hint: 'G7 = G, B, D, F. Una tríada mayor (G-B-D) más una 7.ª menor (F, 10 semitonos por encima de G). El tritono B-F impulsa la resolución hacia C.',
  },
  l3u9m3e2: {
    prompt:
      'Construye un acorde de Am7. Este es el vi7 en C mayor. Selecciona las 4 notas.',
    hint: 'Am7 = A, C, E, G. Una tríada menor (A-C-E) más una 7.ª menor (G, 10 semitonos por encima de A).',
  },
  l3u9m3e3: {
    prompt: 'El acorde V7 contiene un tritono. ¿Qué dos notas lo forman en la tonalidad de C mayor?',
    choices: [
      'B y F — la sensible y el 4.º grado de la escala',
      "G y D — la fundamental del acorde y el 2.º grado de la escala",
      "G y B — la fundamental del acorde y la sensible",
      "D y F — el 2.º grado de la escala y el 4.º grado de la escala",
    ],
    hint: 'En G7 (G-B-D-F), el tritono está entre B (la 3.ª) y F (la 7.ª), abarcando 6 semitonos. B resuelve hacia arriba a C, mientras que F resuelve hacia abajo a E, generando la resolución V7-I.',
  },

  // ---- l3u9m4: Acordes de Séptima Diatónicos en Menor ----

  l3u9m4e1: {
    prompt:
      'Construye un acorde de E7 (V7 en A menor, usando la menor armónica). Selecciona las 4 notas.',
    hint: 'E7 = E, G#, B, D. El G# procede del 7.º grado elevado de A menor armónica. Este acorde de séptima de dominante proporciona la sensible (G#) que resuelve a A.',
  },
  l3u9m4e2: {
    prompt:
      'En A menor armónica, ¿qué tríada se construye sobre el séptimo grado elevado, G#?',
    choices: [
      'Disminuida',
      'Aumentada',
      'Mayor',
      'Menor',
    ],
    hint: 'En A menor natural, VII es G-B-D (mayor). Elevar G a G# en la menor armónica da G#-B-D, que es una tríada disminuida (fundamental a 3.ª = 3m, fundamental a 5.ª = 5.ª disminuida).',
  },
  l3u9m4e3: {
    prompt:
      '¿Cuál es la cualidad del acorde de séptima construido sobre el 2.º grado de la menor armónica (ii en A menor = B)?',
    choices: [
      'Séptima semidisminuida (m7b5)',
      "Séptima menor (m7)",
      "Séptima disminuida (dim7)",
      "Séptima de dominante (7)",
    ],
    hint: 'En A menor armónica, el ii7 es B-D-F-A: una tríada disminuida (B-D-F) más una 7.ª menor (A). Esta combinación se llama semidisminuida, escrita Bm7b5 o B\u00f8.',
  },

  // =========================================================================
  // Unidad 10: Conducción de Voces y Escritura a Partes
  // =========================================================================

  // ---- l3u10m1: Fundamentos de SATB ----

  l3u10m1e1: {
    prompt: '¿Cuál es la tesitura estándar para la voz de soprano en la escritura SATB?',
    choices: [
      'C4 a G5',
      'C3 a G4',
      'F3 a C5',
      'E2 a C4',
    ],
    hint: 'El soprano es la voz más aguda en SATB. Su tesitura práctica abarca aproximadamente de C4 (C central) a G5. Sobrepasar esta tesitura hace que la parte sea difícil de cantar.',
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
    nudge: 'La regla protege la independencia de cada voz. ¿Qué movimiento hace que dos voces se fundan en una sola, al moverse juntas manteniendo la misma consonancia de sonido abierto y hueco?',
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
      'Suelen convertir la quinta consonante entre dos voces en una disonancia armónica',
      'Suelen colocar ambas voces fuera de la tesitura que los cantantes pueden producir',
      'Cambian las duraciones escritas cuando dos voces se mueven en la misma dirección',
    ],
    hint: 'Los intervalos justos (unísonos, 5.as, 8.as) tienen una fuerte fusión acústica. Cuando dos voces se mueven en 5.as paralelas, pierden su identidad individual, reduciendo el número de líneas independientes percibidas.',
  },
  l3u10m2e2: {
    prompt: "¿Qué definiciones describen correctamente los cuatro tipos de movimiento entre dos voces?",
    choices: [
      'Contrario: direcciones opuestas; paralelo: misma dirección e intervalo; directo: misma dirección, intervalos diferentes; oblicuo: una voz permanece',
      'Contrario: direcciones opuestas; paralelo: misma dirección, intervalos diferentes; directo: misma dirección e intervalo; oblicuo: una voz permanece',
      'Contrario: direcciones opuestas; paralelo: misma dirección e intervalo; directo: una voz permanece; oblicuo: misma dirección, intervalos diferentes',
      'Contrario: direcciones opuestas; paralelo: una voz permanece; directo: misma dirección, intervalos diferentes; oblicuo: misma dirección e intervalo',
    ],
    hint: 'Paralelo = misma dirección, mismo intervalo. Directo = misma dirección, intervalo diferente. Oblicuo = una voz se mueve, la otra se mantiene. Contrario = direcciones opuestas.',
    nudge: 'Clasifica según cómo se mueven dos voces una respecto a la otra: en la misma dirección o en direcciones opuestas, manteniendo el mismo intervalo o cambiándolo, o con una voz quieta.',
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
    nudge: 'Independencia significa que cada voz mantiene su propio contorno. ¿Qué movimiento hace que las dos líneas se parezcan menos, de modo que ninguna parezca seguir a la otra?',
  },

  // ---- l3u10m3: Escritura a Partes en Estado Fundamental ----

  l3u10m3e1: {
    prompt:
      'Cuando dos acordes en estado fundamental tienen fundamentales a una 5.ª de distancia (ej.: I a V), ¿qué técnica de conducción de voces es más importante?',
    choices: [
      'Mantener la nota común en la misma voz y mover las otras por grado conjunto',
      "Transferir la nota común a otra voz y mover las otras por grado conjunto",
      "Mantener la nota común en la misma voz y mover las otras en paralelo con el bajo",
      "Transferir la nota común a otra voz y mover las otras en paralelo con el bajo",
    ],
    hint: 'Cuando las fundamentales se mueven por 5.ª (o 4.ª), los dos acordes comparten una nota común. Mantenerla en la misma voz garantiza una conducción de voces suave mientras las demás voces se mueven por grado conjunto.',
    nudge: 'Escribe I y V en C mayor y encuentra la nota que comparten. ¿Cómo puede esa nota ayudar a que cada voz se mueva lo menos posible?',
  },
  l3u10m3e2: {
    prompt:
      'Cuando dos acordes en estado fundamental tienen fundamentales a una 2.ª de distancia (ej.: IV a V), ¿cuál es la mejor estrategia de conducción de voces?',
    choices: [
      'Mover las tres voces superiores en movimiento contrario al bajo',
      'Mover las voces superiores en movimiento paralelo con el bajo',
      'Mantener una nota común mientras el bajo se mueve por grado',
      'Mover soprano y bajo en octavas paralelas',
    ],
    hint: 'Cuando las fundamentales se mueven por grado, no hay notas comunes. Mover las voces superiores en contrario al bajo previene quintas y octavas paralelas, manteniendo un movimiento de voces suave.',
  },
  l3u10m3e3: {
    prompt: '¿Qué es la «ley del camino más corto» en la conducción de voces?',
    choices: [
      'Cada voz superior se mueve a la nota más cercana del acorde siguiente',
      'Cada voz superior mantiene la misma nota en todos los cambios de acorde',
      'Cada voz superior sigue al bajo en la misma dirección',
      'Cada voz superior se mueve por salto mientras el bajo se mueve por grado',
    ],
    hint: 'Una conducción de voces suave minimiza la distancia que recorre cada voz. El movimiento por grado (o el mantenimiento de la nota común) se prefiere frente a los saltos, produciendo líneas más cantables y ligadas.',
  },

  // ---- l3u10m4: Tríadas en Inversión ----

  l3u10m4e1: {
    prompt: '¿Cuál es el símbolo de bajo cifrado para una tríada en primera inversión?',
    choices: [
      '6 (abreviatura de 6/3)',
      '5/3 (a menudo se omite)',
      '6/4 (siempre se escribe completo)',
      '7 (abreviatura de 7/5/3)',
    ],
    hint: 'La primera inversión coloca la 3.ª del acorde en el bajo. Los intervalos por encima del bajo son una 3.ª y una 6.ª. El 6/3 completo se abrevia simplemente a 6.',
  },
  l3u10m4e2: {
    prompt: '¿En qué parte de la cadencia aparece el 6/4 cadencial?',
    choices: [
      'En un tiempo fuerte, preparando V en la cadencia',
      'En un tiempo débil, preparando V en la cadencia',
      'En un tiempo fuerte, siguiendo a V en la cadencia',
      'En un tiempo débil, siguiendo a V en la cadencia',
    ],
    hint: 'El 6/4 cadencial (I6/4) funciona como ornamentación de la dominante. Aparece en un tiempo fuerte con el bajo en el 5.º grado, y la 6.ª y la 4.ª sobre el bajo descienden por grado conjunto a la 5.ª y la 3.ª para formar V.',
  },
  l3u10m4e3: {
    prompt: '¿Por qué la segunda inversión (6/4) se usa con más precaución que la primera inversión?',
    choices: [
      'La 4.ª por encima del bajo es una disonancia que requiere resolución específica',
      'La 6.ª sobre el bajo es una disonancia que suele resolver en una octava',
      'La 5.ª en el bajo es una nota inestable que debe resolver bajando por grado',
      'La inversión convierte una tríada mayor consonante en una tríada disminuida disonante',
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
      'V a I, ambos en estado fundamental, con la tónica en la soprano',
      'V a I, ambos en 1.ª inversión, con la tónica en la soprano',
      'V a I, ambos en estado fundamental, con la 3.ª de I en la soprano',
      'V a I, ambos en estado fundamental, con la 5.ª de I en la soprano',
    ],
    hint: 'Una CAP tiene tres requisitos: (1) V va a I, (2) ambos acordes están en estado fundamental, y (3) la soprano termina en la nota tónica (1.er grado). Es el tipo de cadencia más fuerte.',
  },
  l3u11m1e2: {
    prompt: '¿En qué acorde termina una semicadencia?',
    choices: [
      'V',
      'IV',
      'vi',
      'I',
    ],
    hint: 'Una semicadencia termina en V, creando una sensación abierta y no resuelta — como una coma en una frase. El acorde que precede a V puede ser, por ejemplo, I, ii, IV o vi. Exige continuación.',
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
      'IV a I',
      'V a I',
      'V a vi',
      'ii a V',
    ],
    hint: 'La cadencia plagal se mueve de IV a I. Se la llama con frecuencia la cadencia del «Amén» porque tradicionalmente se usa al final de los himnos. Tiene una cualidad más suave y con menos impulso que V-I.',
  },

  // ---- l3u11m2: Frases y Períodos ----

  l3u11m2e1: {
    prompt: '¿Qué es un período antecedente-consecuente?',
    choices: [
      'Dos frases: la primera termina con una cadencia más débil, la segunda con una más fuerte',
      'Dos frases: la primera termina con una cadencia más fuerte, la segunda con una más débil',
      'Dos frases: ambas comparten una idea básica y terminan con la misma cadencia débil',
      'Dos frases: la primera es una continuación, la segunda repite la idea básica',
    ],
    hint: 'El antecedente termina con una cadencia más débil, generalmente una semicadencia o una cadencia auténtica imperfecta (CAI). El consecuente responde con una cadencia más fuerte, generalmente una cadencia auténtica perfecta (CAP). El aumento de la fuerza cadencial es lo que une las dos frases.',
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
    prompt: 'En la estructura clásica de «frase» (Satz), ¿qué ocurre tras la presentación (la idea básica y su repetición)?',
    choices: [
      'Una continuación que fragmenta y acelera hacia una cadencia',
      'Una continuación que presenta la idea básica por tercera vez sin cambios antes de la cadencia',
      "Una continuación que abandona la cadencia y reinicia la idea básica",
      'Una continuación que responde a la presentación con una frase contrastante, como en un período',
    ],
    hint: 'La frase clásica tiene dos partes: una presentación (idea básica + repetición) y una continuación (fragmentación + aceleración hacia una cadencia). La continuación impulsa la frase hasta su conclusión.',
  },

  // ---- l3u11m3: Ritmo Armónico ----

  l3u11m3e1: {
    prompt: '¿De qué elemento musical mide el ritmo armónico la frecuencia de cambio?',
    choices: [
      'Los acordes',
      'La melodía',
      'El tempo',
      'La figuración del acompañamiento',
    ],
    hint: 'El ritmo armónico se refiere a la frecuencia con que la armonía subyacente cambia, independientemente de la actividad rítmica de superficie. Un pasaje puede tener ritmo melódico rápido pero ritmo armónico lento (un acorde por compás).',
  },
  l3u11m3e2: {
    prompt: '¿Cómo se comporta típicamente el ritmo armónico a medida que se acerca una cadencia?',
    choices: [
      'Acelera — los acordes cambian más a menudo cerca de la cadencia',
      'Se frena — los acordes cambian menos a menudo a medida que se acerca la cadencia',
      'Se mantiene igual — los acordes cambian al mismo ritmo cerca de la cadencia',
      'Se ralentiza — un solo acorde suele prolongarse a través de la cadencia final',
    ],
    hint: 'La aceleración cadencial es una técnica habitual: los cambios de acorde se aceleran cerca de las cadencias, creando una sensación de impulso y llegada. Por ejemplo, los acordes pueden cambiar cada compás, luego cada dos tiempos, luego cada tiempo en la cadencia.',
  },
  l3u11m3e3: {
    prompt: '¿En qué se diferencia el efecto del ritmo armónico lento del rápido?',
    choices: [
      'Lento crea estabilidad y reposo; rápido crea tensión e impulso',
      'Lento crea impulso y tensión; rápido crea espacio abierto',
      'Lento fija notas melódicas más largas; rápido fija notas melódicas más cortas',
      'Lento fija una nota melódica por compás; rápido fija una por tiempo',
    ],
    hint: 'Ritmo armónico lento (un acorde durante varios compases) da una sensación de calma o estasis. Ritmo armónico rápido (varios cambios de acorde por compás) crea urgencia, complejidad e impulso hacia adelante.',
  },

  // ---- l3u11m4: Notas Extrañas al Acorde Parte 1 ----

  l3u11m4e1: {
    prompt: '¿Qué es una nota de paso?',
    choices: [
      'Una nota extraña que va por grado entre dos notas del acorde en la misma dirección',
      'Una nota extraña abordada por grado que vuelve por grado a la nota inicial del acorde',
      'Una nota extraña que hace sonar antes una nota perteneciente al acorde siguiente',
      'Una nota extraña abordada por grado y dejada por salto entre notas del acorde',
    ],
    hint: 'Una nota de paso rellena el hueco entre dos notas del acorde a una 3.ª de distancia. Se aborda por grado y se resuelve por grado en la misma dirección. Ejemplo: en un acorde de C, D pasa entre C y E.',
  },
  l3u11m4e2: {
    prompt: '¿Qué patrón tiene una bordadura en la nota central sobre un acorde de C mayor mantenido?',
    choices: [
      'E4–F4–E4',
      'E4–D4–C4',
      'G4–E4–G4',
      'E4–G4–C5',
    ],
    hint: 'Una bordadura (o nota auxiliar) se aleja de una nota del acorde por grado (hacia arriba o hacia abajo) y regresa a la misma nota. Decora una sola altura: nota del acorde → grado hacia fuera → grado de vuelta.',
    nudge: 'Sobre un acorde de C mayor, compara C–D–C con C–D–E: uno de ellos es una nota de paso. ¿Qué hace el D en el otro?',
  },
  l3u11m4e3: {
    prompt: '¿Qué es una anticipación?',
    choices: [
      'Una nota extraña que hace sonar antes una nota del acorde siguiente',
      'Una nota extraña que llena el espacio entre dos notas del acorde por grado',
      'Una nota extraña que se aleja por grado y vuelve a la nota inicial',
      'Una nota extraña que se aborda por grado y se deja por salto',
    ],
    hint: 'Una anticipación «anticipa» el acorde siguiente haciendo sonar una de sus notas antes de tiempo, antes de que la armonía cambie. Es típicamente una nota breve y no acentuada que resuelve manteniéndose en la misma altura.',
  },

  // ---- l3u11m5: Transposición ----

  l3u11m5e1: {
    prompt: 'Una melodía que empieza en C4 se transporta para que empiece en la segunda nota mostrada. ¿Por qué intervalo se transportó?',
    hint: 'Una 2.ª mayor son 2 semitonos. C más 2 semitonos = D. Transponer una 2.ª mayor hacia arriba mueve cada nota un tono arriba.',
    nudge: 'El intervalo de transposición es el intervalo de C hasta la nueva nota inicial. Cuenta los nombres de las notas de C hasta la segunda nota del pentagrama para obtener el número y después cuenta los semitonos entre ellas para la cualidad.',
  },
  l3u11m5e2: {
    prompt: 'C4 se transporta hasta la segunda nota mostrada. Indica el intervalo de esta transposición.',
    hint: 'Una 5.ª justa son 7 semitonos. C más 7 semitonos = G. Transponer una 5.ª justa hacia arriba es una de las transposiciones más comunes, pasando de C mayor a G mayor.',
    nudge: 'Todas las notas se mueven el mismo intervalo, así que mídelo solo en la primera nota: cuenta los nombres de las notas de C hasta la segunda nota mostrada, incluidas ambas, y comprueba si esa nota pertenece a C mayor para decidir la cualidad.',
  },
  l3u11m5e3: {
    prompt: 'Una melodía en C mayor se transporta una 3.ª menor hacia arriba. ¿Cuál es la nueva armadura de clave?',
    choices: [
      'Armadura de clave de Eb mayor: 3 bemoles',
      'Armadura de clave de D mayor: 2 sostenidos',
      'Armadura de clave de E mayor: 4 sostenidos',
      'Armadura de clave de Ab mayor: 4 bemoles',
    ],
    hint: 'La transposición desplaza todo a una nueva tonalidad. Subir una 3.ª menor (3 semitonos) desde C mayor llega a Eb mayor. La nueva armadura de clave (3 bemoles) preserva todas las relaciones interválicas.',
  },
};

export default overlay;
