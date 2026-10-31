import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 6 exercise templates
// 12 modules — mirrors templatesL6.ts entry by entry (W4a re-keying, 2026-10-31)
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 18: Acordes Cromáticos
  // =========================================================================

  // ---- l6u18m1: Acorde Napolitano bII ----
  l6u18m1: [
    {
      // chord_build — {key} es la tonalidad menor, {root} el propio napolitano (bII).
      promptTemplate:
        'Construye el acorde napolitano (bII) de {key} menor.',
      hintTemplate:
        'El napolitano es la tríada mayor sobre el 2.º grado rebajado: en {key} menor es {root} mayor (fundamental, 3.ª mayor, 5.ª justa).',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la función del acorde napolitano es verdadera?',
      hintTemplate:
        'El napolitano (bII o N6) es un acorde predominante que resuelve hacia V (frecuentemente vía 6/4 cadencial). Está casi siempre en primera inversión.',
      choiceSets: [
        [
          'Es predominante y va hacia V',
          'Es dominante: resuelve directamente hacia la tónica I',
          'Es un sustituto de la tónica que cierra frases en lugar del acorde de tónica',
          'Es un acorde de paso sin función armónica propia',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Qué opción da el acorde napolitano (bII) correcto de la tonalidad menor que nombra?',
      hintTemplate:
        'El napolitano es la tríada mayor sobre el 2.º grado rebajado de la tonalidad menor: medio tono por encima de la tónica, escrito en la letra siguiente.',
      choiceSets: [
        [
          'En C menor: Db mayor (Db-F-Ab)',
          'En C menor: D mayor (D-F#-A)',
          'En C menor: Eb mayor (Eb-G-Bb)',
          'En C menor: B mayor (B-D#-F#)',
        ],
        [
          'En A menor: Bb mayor (Bb-D-F)',
          'En A menor: B mayor (B-D#-F#)',
          'En A menor: Bb menor (Bb-Db-F)',
          'En A menor: C mayor (C-E-G)',
        ],
        [
          'En E menor: F mayor (F-A-C)',
          'En E menor: F# mayor (F#-A#-C#)',
          'En E menor: D mayor (D-F#-A)',
          'En E menor: F menor (F-Ab-C)',
        ],
      ],
    },
  ],

  // ---- l6u18m2: Sexta Italiana / Francesa ----
  l6u18m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las sextas aumentadas italiana y francesa es verdadera?',
      hintTemplate:
        'Sexta italiana: b6, 1, #4 (3 notas). Sexta francesa: b6, 1, 2, #4 (4 notas, incluye el 2.º grado). Ambas resuelven hacia V con las voces extremas expandiéndose hacia una octava.',
      choiceSets: [
        [
          'La sexta italiana tiene tres notas: b6, 1 y #4',
          'La sexta italiana tiene cuatro notas: b6, 1, 2 y #4',
          'La sexta italiana tiene tres notas: 6, 1 y #4',
          'La sexta italiana tiene tres notas: b6, 1 y 5',
        ],
        [
          'La sexta francesa añade el grado 2 a la italiana',
          'La sexta francesa añade el grado b3 a la sexta italiana',
          'La sexta francesa añade el grado 5 a la sexta italiana',
          'La sexta francesa quita el #4 de la sexta italiana',
        ],
        [
          'Se expanden hacia una octava sobre la dominante',
          'Resuelven convergentemente hacia un unísono sobre la tónica',
          'Resuelven divergentemente hacia una octava sobre la tónica',
          'Resuelven convergentemente hacia una tercera sobre la subdominante',
        ],
        [
          'De b6 a #4 hay una 6.ª aumentada (10 semitonos) que se expande hacia una octava',
          'De b6 a #4 hay una 6.ª menor (8 semitonos) que se contrae hasta formar una 5.ª justa',
          'De b6 a #4 hay una 6.ª mayor (9 semitonos) que se expande hacia una octava',
          'De b6 a #4 hay un tritono (6 semitonos) que se contrae hacia una 3.ª mayor',
        ],
      ],
    },
  ],

  // ---- l6u18m3: Sexta Alemana ----
  l6u18m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el acorde de sexta aumentada alemana es verdadera?',
      hintTemplate:
        'Sexta alemana: b6, 1, b3, #4 (4 notas, incluye la 3.ª menor). Resuelve hacia un 6/4 cadencial para evitar quintas paralelas, y después hacia V.',
      choiceSets: [
        [
          'La sexta alemana contiene b6, 1, b3 y #4',
          'La sexta alemana contiene b6, 1, 2 y #4',
          'La sexta alemana contiene b6, b2, b3 y #4',
          'La sexta alemana contiene 6, 1, b3 y #4',
        ],
        [
          'Suele pasar primero por un 6/4 cadencial, evitando quintas paralelas con V',
          'Suele ir directamente a V en posición fundamental, y así evita las quintas paralelas',
          'Suele pasar primero por un 6/4 cadencial, evitando octavas paralelas con I',
          'Suele resolver directamente hacia la tónica I, saltándose la dominante',
        ],
        [
          'Es enarmónicamente equivalente a una séptima de dominante',
          'Es enarmónicamente equivalente a un acorde de séptima menor',
          'Es enarmónicamente equivalente a un acorde de séptima disminuida',
          'Es enarmónicamente equivalente a un acorde de séptima mayor',
        ],
      ],
    },
    {
      // chord_build — {key} es la tonalidad menor; {root} es b6, la fundamental
      // de la séptima de dominante enarmónica (se evalúa por clase de altura).
      promptTemplate:
        'Construye el acorde de sexta aumentada alemana de {key} menor.',
      hintTemplate:
        'En {key} menor, la sexta alemana es b6–1–b3–#4, construida sobre {root} (en C menor: Ab–C–Eb–F#). Suena exactamente como {root}7, pero su nota superior se escribe como 6.ª aumentada sobre {root}, no como 7.ª menor.',
    },
  ],

  // ---- l6u18m4: Modulación Enarmónica Gr+6 <-> V7 ----
  l6u18m4: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre modular a través del pivote sexta alemana / V7 es verdadera?',
      hintTemplate:
        'La sexta alemana es enarmónicamente idéntica a un acorde de séptima de dominante. Reescribirla permite una modulación súbita a una tonalidad remota: Gr+6 en una tonalidad = V7 en otra.',
      choiceSets: [
        [
          'La sexta alemana de C menor (Ab-C-Eb-F#), reescrita como Ab7 (Ab-C-Eb-Gb), lleva a Db',
          'La sexta alemana de C menor (Ab-C-Eb-F#), reescrita como Ab7 (Ab-C-Eb-Gb), lleva a Eb',
          'La sexta alemana de C menor (Ab-C-Eb-F#) nunca puede reescribirse como séptima de dominante',
          'Solo la sexta italiana de C menor (Ab-C-F#) puede reescribirse como séptima de dominante',
        ],
        [
          'El pivote alcanza tonalidades medio tono por encima o por debajo de la tónica',
          'El pivote alcanza solo tonalidades una 5.ª justa por encima o por debajo de la tónica',
          'El pivote alcanza solo el modo mayor o menor paralelo de la tónica',
          'El pivote alcanza solo tonalidades un tono por encima o por debajo de la tónica',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la historia de la modulación enarmónica con la sexta alemana es verdadera?',
      hintTemplate:
        'Desde Mozart y Schubert, los compositores usaron la doble identidad de la sexta alemana (y de la séptima de dominante) para saltar a tonalidades remotas; se convirtió en un sello de la armonía romántica.',
      choiceSets: [
        [
          'Los románticos la explotaron ampliamente',
          'Solo los compositores barrocos usaron la doble identidad de la sexta alemana',
          'La inventaron los compositores de música atonal del siglo XX',
          'Los compositores clásicos y románticos evitaron por completo cualquier modulación enarmónica',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 19: Técnicas Cromáticas Avanzadas
  // =========================================================================

  // ---- l6u19m1: Modulación Enarmónica vía dim7 ----
  l6u19m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la modulación enarmónica con el acorde de séptima disminuida es verdadera?',
      hintTemplate:
        'Un acorde dim7 divide la octava en terceras menores iguales. Cualquiera de sus 4 notas puede reescribirse como fundamental, haciéndolo resolver hacia 4 tonalidades diferentes.',
      choiceSets: [
        [
          'Cualquier nota de un dim7 puede ser la sensible',
          'Solo la fundamental escrita de un acorde dim7 puede actuar como sensible',
          'Un acorde dim7 solo lleva a una tonalidad: medio tono por encima de su fundamental',
          'Un acorde dim7 no puede reescribirse sin cambiar cómo suena',
        ],
        [
          'Solo hay 3 acordes dim7 distintos; juntos cubren las 12 tonalidades',
          'Hay 12 acordes dim7 distintos, uno construido sobre cada una de las 12 notas',
          'Hay 6 acordes dim7 distintos, uno sobre cada nota de una escala de tonos enteros',
          'Hay 4 acordes dim7 distintos, uno por cada 3.ª menor de la octava',
        ],
        [
          'B°7 (B-D-F-Ab) puede resolver hacia C, Eb, Gb o A, según su escritura',
          'B°7 (B-D-F-Ab) puede resolver hacia C, D, E o F, según su escritura',
          'B°7 (B-D-F-Ab) solo puede resolver hacia C, porque B es su fundamental escrita',
          'B°7 (B-D-F-Ab) solo puede resolver hacia las notas que ya contiene',
        ],
      ],
    },
  ],

  // ---- l6u19m2: Séptima Disminuida con Nota Común ----
  l6u19m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el acorde de séptima disminuida con nota común es verdadera?',
      hintTemplate:
        'Un CT°7 comparte una nota común con el acorde que embellece. Decora (en vez de dirigirse armónicamente hacia) un acorde mayor o de séptima de dominante.',
      choiceSets: [
        [
          'El CT°7 comparte una nota, normalmente la fundamental, con el acorde que embellece',
          'El CT°7 no comparte ninguna nota con el acorde que embellece',
          'El CT°7 comparte siempre dos notas, la 3.ª y la 5.ª, con el acorde que él embellece',
          'El CT°7 es un acorde de dominante que resuelve hacia su propia tónica',
        ],
        [
          'Embellece un acorde: una voz se mantiene mientras tres voces se mueven por grado conjunto',
          'Embellece un acorde: las cuatro voces se mueven por grado conjunto y ninguna de ellas se mantiene',
          'Modula: las cuatro voces saltan a un acorde de una nueva tonalidad',
          'Sustituye a la dominante: su fundamental resuelve medio tono arriba hacia la tónica',
        ],
      ],
    },
  ],

  // ---- l6u19m3: Mediantes Cromáticas y Dominantes Alteradas (incluido el omnibus) ----
  l6u19m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la progresión omnibus es verdadera?',
      hintTemplate:
        'El omnibus es un patrón cromático de intercambio de voces donde dos voces se mueven en movimiento contrario cromático mientras otras voces sostienen notas comunes.',
      choiceSets: [
        [
          'Dos voces se mueven cromáticamente por movimiento contrario mientras las otras se mantienen',
          'Todas las voces se mueven por movimiento cromático paralelo, sin ninguna nota común entre los acordes',
          'Dos voces se mueven por quintas paralelas mientras las otras saltan',
          'Una voz se mueve cromáticamente mientras todas las demás saltan',
        ],
        [
          'Puede prolongar una armonía de dominante mediante intercambio cromático de voces',
          'Siempre modula a una tonalidad muy lejana mediante intercambio cromático de voces',
          'Solo puede prolongar la armonía de tónica, nunca la armonía de dominante',
          'Sustituye la cadencia final de una frase por una cadencia plagal',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las mediantes cromáticas es verdadera?',
      hintTemplate:
        'Las mediantes cromáticas son acordes relacionados por una 3.ª mayor o menor con fundamentales que difieren cromáticamente (p. ej., C mayor a E mayor o Ab mayor). Comparten una nota común.',
      choiceSets: [
        [
          'C mayor → E mayor es mediante cromática: fundamentales a una 3.ª mayor, una nota común (E)',
          'C mayor → G mayor es mediante cromática: fundamentales a una 5.ª, una nota común (G)',
          'C mayor → F mayor es mediante cromática: fundamentales a una 4.ª, una nota común (C)',
          'C mayor → A menor es mediante cromática: fundamentales a una 3.ª menor, dos notas comunes (C, E)',
        ],
        [
          'Las mediantes cromáticas se mueven por 3.ª y alteran cromáticamente al menos una nota',
          'Las mediantes cromáticas se mueven por 3.ª y mantienen todas las notas dentro de la tonalidad',
          'Las mediantes cromáticas se mueven por 5.ª y no alteran ninguna nota de la tonalidad',
          'Las mediantes cromáticas se mueven por grado conjunto y comparten sus tres notas',
        ],
        [
          'Ab mayor es mediante cromática de C mayor: fundamentales a una 3.ª mayor, una nota común (C)',
          'Ab mayor es mediante cromática de C mayor: fundamentales a una 3.ª menor, dos notas comunes (C, Eb)',
          'Ab mayor es la dominante de C mayor: fundamentales a una 5.ª, dos notas comunes (C, G)',
          'Ab mayor es la subdominante de C mayor: fundamentales a una 4.ª, una nota común (C)',
        ],
      ],
    },
    {
      // chord_build
      promptTemplate:
        'Construye V+, la dominante alterada de {key} mayor (V con la 5.ª aumentada).',
      hintTemplate:
        'El V+ es la tríada de dominante con la 5.ª elevada medio tono: sobre {root} es fundamental, 3.ª mayor, 5.ª aumentada. La 5.ª elevada sube hacia la 3.ª de {key}.',
    },
  ],

  // ---- l6u19m4: Técnicas Armónicas del Romanticismo Tardío ----
  l6u19m4: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala {scaleType} de {root}, que divide la octava en seis tonos iguales.',
      hintTemplate:
        'La escala de tonos enteros divide la octava en 6 tonos iguales: desde {root}, suma 2 semitonos cinco veces. Sin semitonos no hay sensible, así que ninguna nota suena como reposo.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las divisiones iguales de la octava es verdadera?',
      hintTemplate:
        'Divisiones iguales: tritono (2 partes iguales, pasos de 6 semitonos), tríada aumentada (3 partes iguales, pasos de 4), séptima disminuida (4 partes iguales, pasos de 3), escala de tonos enteros (6 partes iguales, pasos de 2).',
      choiceSets: [
        [
          'Una tríada aumentada divide la octava en 3 terceras mayores iguales',
          'Una tríada aumentada divide la octava en 4 terceras menores iguales',
          'Un acorde de séptima disminuida divide la octava en 3 terceras mayores iguales',
          'Una tríada aumentada divide la octava en 2 tritonos iguales',
        ],
        [
          'Solo hay 2 escalas de tonos enteros, cada una con 6 de las 12 notas',
          'Hay 12 escalas de tonos enteros, una que empieza en cada una de las 12 notas',
          'Solo hay 1 escala de tonos enteros, y contiene las 12 notas',
          'Hay 6 escalas de tonos enteros, una por cada una de sus 6 notas',
        ],
        [
          'Un acorde de séptima disminuida divide la octava en 4 terceras menores iguales',
          'Un acorde de séptima disminuida divide la octava en 6 tonos iguales',
          'Un acorde de séptima disminuida divide la octava en 2 quintas justas exactamente iguales',
          'Un acorde de séptima disminuida no divide la octava en partes iguales',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la armonía no funcional del Romanticismo tardío es verdadera?',
      hintTemplate:
        'En el Romanticismo tardío, los acordes se enlazan a menudo por cercanía en la conducción de voces, notas comunes o color, en lugar de por la función tónica–dominante; el planing mueve la forma de un acorde en paralelo.',
      choiceSets: [
        [
          'Los acordes pueden enlazarse por conducción de voces por semitono en lugar de por función',
          'Los acordes solo pueden enlazarse por movimiento de fundamental de 5.ª, como en la armonía funcional',
          'Los acordes se enlazan con grandes saltos en todas las voces para evitar notas comunes',
          'Toda sucesión no funcional debe terminar en una cadencia V–I',
        ],
        [
          'El planing cromático mueve la forma de un acorde en paralelo, manteniendo su cualidad exacta',
          'El planing cromático mueve la forma de un acorde en paralelo, ajustándola en cada paso a la tonalidad',
          'El planing cromático mueve todas las voces por movimiento contrario hacia la tónica',
          'El planing cromático mantiene un acorde y solo cambia la nota del bajo',
        ],
        [
          'La tonalidad ampliada debilita el centro tonal con tonalidades remotas y cromatismo',
          'La tonalidad ampliada refuerza el centro tonal repitiendo cadencias V–I',
          'La tonalidad ampliada usa solo las siete notas de una tonalidad de principio a fin',
          'La tonalidad ampliada es otro nombre para las reglas estrictas del contrapunto de especies',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 20: Contrapunto y Escritura a Partes
  // =========================================================================

  // ---- l6u20m1: Contrapunto de Especies — Primera a Tercera Especie ----
  l6u20m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el cantus firmus y la primera especie (1:1) es verdadera?',
      hintTemplate:
        'Cantus firmus: 8–12 redondas, de tónica a tónica, sobre todo por grado conjunto, un solo punto culminante. Primera especie: solo consonancias (P1, 3.as, P5, 6.as, P8); empieza en P1, P5 o P8; termina en P1 o P8 alcanzado por grado conjunto.',
      choiceSets: [
        [
          'Un cantus firmus empieza y termina en la tónica y se mueve sobre todo por grado conjunto',
          'Un cantus firmus empieza en la dominante y se mueve sobre todo por salto',
          'Un cantus firmus mezcla libremente redondas, blancas y negras',
          'Un cantus firmus repite notas muy a menudo y tiene varios puntos culminantes diferentes entre sí',
        ],
        [
          'La primera especie usa solo consonancias: unísonos, 3.as, 5.as, 6.as y octavas',
          'La primera especie usa solo consonancias perfectas: unísonos, 4.as, 5.as y octavas',
          'La primera especie permite una disonancia de paso en cada segunda nota',
          'La primera especie usa solo 3.as y 6.as, nunca un unísono, una 5.ª ni una octava',
        ],
        [
          'Empieza en un unísono, 5.ª u octava y termina en un unísono u octava',
          'Empieza en una 3.ª o 6.ª y termina en una 5.ª alcanzada por salto',
          'Empieza y termina en una 3.ª, la más dulce de las consonancias',
          'Puede terminar en cualquier consonancia, alcanzada por grado conjunto o por salto',
        ],
      ],
    },
    {
      // multiple_choice — Fux: solo notas de paso en la segunda especie (decisión D-14)
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el contrapunto de segunda especie (2:1) es verdadera?',
      hintTemplate:
        'Segunda especie: dos notas contra cada nota del cantus. El tiempo fuerte es consonante; el tiempo débil puede ser consonante o una nota de paso disonante, alcanzada y abandonada por grado conjunto en la misma dirección.',
      choiceSets: [
        [
          'Una disonancia en tiempo débil debe ser nota de paso, entrando y saliendo por grado conjunto',
          'Una disonancia en tiempo débil puede ser nota de paso o bordadura',
          'Una disonancia en tiempo fuerte se permite siempre que después resuelva bajando por grado conjunto',
          'Una disonancia en tiempo débil puede alcanzarse o abandonarse por salto de 3.ª',
        ],
        [
          'Cada tiempo fuerte debe ser consonante con el cantus firmus',
          'Cada tiempo débil debe ser disonante con el cantus firmus',
          'Los tiempos fuertes pueden ser disonantes si el tiempo débil siguiente es consonante',
          'Cada tiempo fuerte debe formar un unísono con el cantus firmus',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el contrapunto de tercera especie (4:1) es verdadera?',
      hintTemplate:
        'Tercera especie: cuatro notas contra cada nota del cantus. La primera es consonante; las demás pueden ser notas de paso, bordaduras, una cambiata (grado conjunto a la disonancia, salto de 3.ª, grado conjunto de vuelta) o una bordadura doble.',
      choiceSets: [
        [
          'La primera de cada cuatro notas es consonante; las demás pueden ser notas de paso o bordaduras',
          'Las cuatro notas contra cada nota del cantus deben ser todas consonantes con ella',
          'La primera de cada cuatro notas puede ser disonante siempre que las otras tres sean todas consonantes',
          'Solo la última de cada cuatro notas tiene que ser consonante con la nota del cantus',
        ],
        [
          'La cambiata va por grado conjunto a una disonancia, salta una 3.ª y vuelve por grado conjunto',
          'La cambiata salta a una disonancia y después la resuelve bajando por grado conjunto',
          'La cambiata liga una disonancia por encima de la barra de compás hasta el tiempo fuerte del compás siguiente',
          'La cambiata va por grado conjunto a una disonancia y sigue en la misma dirección',
        ],
        [
          'Una bordadura doble adorna una nota con la bordadura superior y la inferior, una tras otra',
          'Una bordadura doble son dos notas de paso que se mueven en la misma dirección',
          'Una bordadura doble hace sonar dos disonancias a la vez, en dos voces diferentes de la textura',
          'Una bordadura doble repite la misma nota dos veces en los tiempos fuertes',
        ],
      ],
    },
  ],

  // ---- l6u20m2: Contrapunto de Especies — Cuarta y Quinta Especie ----
  l6u20m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el contrapunto de cuarta especie (sincopado) es verdadera?',
      hintTemplate:
        'La cuarta especie liga una nota de un tiempo débil por encima de la barra de compás. Si la nota ligada es disonante en el tiempo fuerte, es una suspensión: preparada como consonancia, resuelta bajando por grado conjunto. Por encima del cantus: 7-6, 4-3, 9-8; por debajo: 2-3.',
      choiceSets: [
        [
          'Una nota se liga desde un tiempo débil, a través de la barra, hasta el siguiente tiempo fuerte',
          'Una nota se liga desde un tiempo fuerte hasta el tiempo débil del mismo compás',
          'Cada nota se ataca en el tiempo fuerte y se deja en el tiempo débil',
          'No se usa ninguna ligadura; la línea se sincopa con silencios colocados en cada tiempo fuerte del compás',
        ],
        [
          'Una suspensión se prepara como consonancia y resuelve bajando por grado conjunto',
          'Una suspensión se prepara como disonancia y resuelve subiendo por grado conjunto',
          'Una suspensión se prepara como consonancia y resuelve subiendo por grado conjunto',
          'Una suspensión no necesita preparación y resuelve bajando por salto',
        ],
        [
          'Por encima del cantus, las suspensiones disonantes son 7-6, 4-3 y 9-8; por debajo, 2-3',
          'Por encima del cantus, las suspensiones disonantes son 6-5, 3-2 y 8-7; por debajo, 4-5',
          'Por encima del cantus, la única suspensión disonante es 2-3; por debajo, 7-6 y 4-3',
          'Por encima o por debajo del cantus, la única suspensión disonante permitida es 4-3',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las cadenas de suspensiones y la quinta especie (florida) es verdadera?',
      hintTemplate:
        'En una cadena, cada resolución queda ligada y se convierte en la suspensión siguiente. La quinta especie (contrapunto florido) mezcla en una sola línea los valores de las cuatro primeras especies, cada uno con sus reglas.',
      choiceSets: [
        [
          'En una cadena, cada resolución queda ligada para preparar la suspensión siguiente',
          'En una cadena, cada suspensión resuelve subiendo por grado conjunto para preparar la siguiente',
          'En una cadena, cada suspensión va seguida de un salto consonante de 5.ª',
          'En una cadena, las suspensiones tienen que alternar entre las dos voces',
        ],
        [
          'La quinta especie combina libremente los valores de las cuatro primeras especies',
          'La quinta especie usa cinco notas contra cada nota del cantus firmus',
          'La quinta especie es contrapunto escrito para cinco voces independientes',
          'La quinta especie abandona todas las reglas de disonancia de las especies anteriores',
        ],
        [
          'El contrapunto florido mantiene las reglas de cada especie anterior para sus valores',
          'El contrapunto florido ignora las reglas de disonancia para que la línea se mueva libremente',
          'El contrapunto florido solo permite redondas contra el cantus firmus',
          'El contrapunto florido prohíbe las ligaduras, así que las suspensiones desaparecen',
        ],
      ],
    },
  ],

  // ---- l6u20m3: Contrapunto a Tres Partes y Contrapunto Invertible ----
  l6u20m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el contrapunto invertible (doble) es verdadera?',
      hintTemplate:
        'El contrapunto invertible permite que dos voces intercambien su lugar. A la octava, un intervalo n se convierte en 9 − n (3.ª → 6.ª, 5.ª → 4.ª); a la décima, 11 − n (3.ª → octava, 6.ª → 5.ª); a la duodécima, 13 − n (5.ª → octava).',
      choiceSets: [
        [
          'A la octava, una 3.ª se convierte en 6.ª cuando las voces se intercambian',
          'A la octava, una 3.ª sigue siendo 3.ª cuando las voces se intercambian',
          'A la octava, una 3.ª se convierte en 5.ª cuando las voces se intercambian',
          'A la octava, una 3.ª se convierte en 7.ª cuando las voces se intercambian',
        ],
        [
          'A la octava, se evitan las 5.as porque se convierten en 4.as disonantes',
          'A la octava, se evitan las 3.as porque se convierten en 6.as disonantes',
          'A la octava, se prefieren las 5.as porque siguen siendo 5.as justas',
          'A la octava, se evitan las 6.as porque se convierten en 2.as disonantes',
        ],
        [
          'A la décima, una 3.ª se convierte en octava y una 6.ª se convierte en 5.ª',
          'A la décima, una 3.ª se convierte en 6.ª y una 6.ª se convierte en 3.ª',
          'A la décima, una 3.ª se convierte en 5.ª y una 6.ª se convierte en octava',
          'A la décima, todos los intervalos mantienen exactamente el mismo tamaño',
        ],
        [
          'A la duodécima, una 5.ª se convierte en octava cuando las voces se intercambian',
          'A la duodécima, una 5.ª se convierte en 4.ª cuando las voces se intercambian',
          'A la duodécima, una 5.ª se convierte en 6.ª cuando las voces se intercambian',
          'A la duodécima, una 3.ª se convierte en 6.ª siempre que las dos voces se intercambian',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el contrapunto triple es verdadera?',
      hintTemplate:
        'Contrapunto triple: tres voces que funcionan en las seis disposiciones verticales (ABC, ACB, BAC, BCA, CAB, CBA), así que cada par de voces debe ser invertible.',
      choiceSets: [
        [
          'Sus tres voces funcionan en las 6 disposiciones verticales posibles',
          'Sus tres voces funcionan en solo 3 disposiciones verticales posibles',
          'Sus tres voces funcionan en las 9 disposiciones verticales posibles',
          'Sus tres voces funcionan en las 12 disposiciones verticales posibles',
        ],
        [
          'Cada par de sus voces debe funcionar como contrapunto invertible',
          'Solo sus dos voces extremas tienen que funcionar como contrapunto invertible',
          'Sus voces pueden moverse por 5.as paralelas, ya que se van a reordenar',
          'Solo su voz superior puede moverse; las dos voces inferiores quedan fijas',
        ],
      ],
    },
  ],

  // ---- l6u20m4: Escritura a Partes Avanzada y Lectura de Partitura ----
  l6u20m4: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre armonizar una melodía de soprano a cuatro voces (SATB) es verdadera?',
      hintTemplate:
        'Para armonizar un soprano: encuentra la tonalidad y los puntos de cadencia, elige una línea de bajo y acordes que lleven a ellos, completa contralto y tenor por el camino más corto y revisa paralelas, espaciado y duplicaciones.',
      choiceSets: [
        [
          'Primero encuentra los puntos de cadencia y después elige un bajo y acordes que lleven a ellos',
          'Primero escribe el contralto y el tenor y después encaja el bajo y el soprano alrededor de ellos',
          'Primero elige un acorde cualquiera para cada nota y corrige las cadencias al final',
          'Armoniza desde la primera nota en adelante e ignora dónde caen las cadencias',
        ],
        [
          'Al final, revisa quintas y octavas paralelas, espaciado y errores de duplicación',
          'Al final, añade quintas y octavas paralelas entre las voces extremas para dar fuerza',
          'Al final, duplica la sensible en todos los acordes de dominante para un sonido más lleno',
          'Al final, cruza el contralto y el tenor para que cada voz interior tenga más espacio',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la realización del bajo cifrado es verdadera?',
      hintTemplate:
        'Bajo cifrado: sin cifra = posición fundamental (5/3), 6 = primera inversión, 6/4 = segunda inversión, 7 = séptima en posición fundamental, 6/5 = primera inversión, 4/3 = segunda inversión, 4/2 = tercera inversión (7.ª en el bajo).',
      choiceSets: [
        [
          'Una nota del bajo sin cifra se realiza como acorde en posición fundamental (5/3)',
          'Una nota del bajo sin cifra se realiza siempre como un acorde en primera inversión (6/3)',
          'Una nota del bajo sin cifra se toca sola, sin ningún acorde encima',
          'Una nota del bajo sin cifra se realiza como acorde de séptima (7)',
        ],
        [
          'Un 6 bajo una nota del bajo indica una tríada en primera inversión',
          'Un 6 bajo una nota del bajo indica una tríada en segunda inversión',
          'Un 6 bajo una nota del bajo indica una tríada en posición fundamental',
          'Un 6 bajo una nota del bajo indica un acorde de séptima en tercera inversión',
        ],
        [
          '6/4 bajo una nota del bajo indica una tríada en segunda inversión',
          '6/4 bajo una nota del bajo indica una tríada en primera inversión',
          '6/4 bajo una nota del bajo indica un acorde de séptima en posición fundamental',
          '6/4 bajo una nota del bajo indica una tríada en posición fundamental',
        ],
        [
          '4/2 bajo una nota del bajo indica un acorde de séptima con la 7.ª en el bajo',
          '4/2 bajo una nota del bajo indica un acorde de séptima con la fundamental en el bajo',
          '4/2 bajo una nota del bajo indica un acorde de séptima con la 3.ª en el bajo',
          '4/2 bajo una nota del bajo indica un acorde de séptima con la 5.ª en el bajo',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los instrumentos transpositores en una partitura orquestal es verdadera?',
      hintTemplate:
        'Un instrumento transpositor hace sonar la nota de su nombre cuando lee C: el clarinete en Bb suena una 2.ª mayor por debajo de lo escrito, la trompa en F una 5.ª justa por debajo. Transporta cada parte a la altura de concierto para oír la armonía real.',
      choiceSets: [
        [
          'El clarinete en Bb suena una 2.ª mayor por debajo de lo escrito: el C escrito suena Bb',
          'El clarinete en Bb suena una 2.ª mayor por encima de lo que está escrito: el C escrito suena D',
          'El clarinete en Bb suena una 3.ª menor por debajo de lo escrito: el C escrito suena A',
          'El clarinete en Bb suena exactamente como está escrito: el C escrito suena C',
        ],
        [
          'La trompa en F suena una 5.ª justa por debajo de lo escrito: el C escrito suena F',
          'La trompa en F suena una 5.ª justa por encima de lo escrito: el C escrito suena G',
          'La trompa en F suena una 2.ª mayor por debajo de lo escrito: el C escrito suena Bb',
          'La trompa en F suena exactamente como está escrita: el C escrito suena C',
        ],
        [
          'Para oír la armonía real, transporta cada parte según el intervalo de su instrumento',
          'Las partes transpositoras ya suenan como están escritas, así que no hace falta transportar',
          'Para oír la armonía real, sube cada parte una octava por encima de lo escrito',
          'Para oír la armonía real, lee solo las partes de cuerda e ignora los vientos',
        ],
      ],
    },
  ],
};

export default overlay;
