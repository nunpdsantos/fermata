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
      'Normalmente, una predominante que prepara V',
      'Normalmente, una dominante que resuelve en I',
      'Normalmente, un sustituto de la tónica que cierra una frase',
      'Normalmente, una armonía de paso que conecta inversiones de I',
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
          "La sexta italiana tiene tres notas: 6, 1 y #4",
          "La sexta italiana tiene tres notas: b3, 1 y #4",
          "La sexta italiana tiene tres notas: b7, 1 y #4",
        ],
        [
          'La sexta francesa añade el grado 2 a la italiana',
          "La sexta francesa añade el grado b3 a la italiana",
          "La sexta francesa añade el grado 5 a la italiana",
          "La sexta francesa añade el grado b7 a la italiana",
        ],
        [
      'En D menor, Bb3–G#4 resuelve normalmente en A3–A4',
      'En D menor, Bb3–G#4 resuelve normalmente en D3–D4',
      'En D menor, Bb3–G#4 resuelve normalmente en A3–A3',
      'En D menor, Bb3–G#4 resuelve normalmente en D3–D3',
    ],
        [
          'En C menor, Ab3–F#4 resuelve normalmente en G3–G4',
          'En C menor, Ab3–F#4 resuelve normalmente en A3–E4',
          'En C menor, Ab3–F#4 resuelve normalmente en F3–A4',
          'En C menor, Ab3–F#4 resuelve normalmente en G3–F#4',
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
          "La sexta alemana contiene b6, 1, 3 y #4",
          "La sexta alemana contiene b6, 1, b3 y 4",
          "La sexta alemana contiene b6, 1, 3 y 4",
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
        'En {key} menor, la sexta alemana es b6–1–b3–#4, construida sobre {root}: {spelling}. Suena exactamente como {root}7, pero su nota superior se escribe como 6.ª aumentada sobre {root}, no como 7.ª menor.',
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
      'La sexta alemana en E menor (C–E–G–A#), reescrita como C7 (C–E–G–Bb), resuelve en F',
      'La sexta alemana en E menor (C–E–G–A#), reescrita como C7 (C–E–G–Bb), resuelve en G',
      'La sexta alemana en E menor (C–E–G–A#), reescrita como C7 (C–E–G–Bb), resuelve en Bb',
      'La sexta alemana en E menor (C–E–G–A#), reescrita como C7 (C–E–G–Bb), resuelve en D',
    ],
        [
      "Alcanza tonalidades un semitono por encima o por debajo de la tónica",
      "Alcanza tonalidades un tono por encima o por debajo de la tónica",
      "Alcanza tonalidades una quinta justa por encima o por debajo de la tónica",
      "Alcanza tonalidades una tercera mayor por encima o por debajo de la tónica",
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
      'Los compositores románticos la usaron mucho',
      'Los compositores renacentistas la usaron mucho',
      'Los compositores medievales la usaron mucho',
      'Los compositores del serialismo estricto del siglo XX la usaron mucho',
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
      'La reescritura enarmónica conserva el sonido; cualquiera de las cuatro notas puede ser la nueva sensible',
      'La reescritura enarmónica conserva el sonido; la fundamental original debe ser la nueva sensible',
      'La reescritura enarmónica conserva el sonido; las dos notas más graves son las candidatas a nueva sensible',
      'La reescritura enarmónica conserva el sonido; una nota escrita con sostenido debe ser la nueva sensible',
    ],
        [
      "Solo hay 3 acordes dim7 distintos; juntos cubren las 12 tonalidades",
      'Solo hay 4 acordes dim7 distintos; juntos cubren las 12 tonalidades',
      'Solo hay 6 acordes dim7 distintos; juntos cubren las 12 tonalidades',
      'Solo hay 12 acordes dim7 distintos; juntos cubren las 12 tonalidades',
    ],
        [
      "B°7 puede reescribirse con sensibles B→C, D→Eb, F→Gb y G#→A",
      "B°7 puede reescribirse con sensibles B→Eb, D→C, F→Gb y G#→A",
      "B°7 puede reescribirse con sensibles B→C, D→Eb, F→A y G#→Gb",
      "B°7 puede reescribirse con sensibles B→Eb, D→C, F→A y G#→Gb",
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
        'Un CT°7 comparte una nota común con el acorde que adorna. Adorna (en vez de dirigirse armónicamente hacia) un acorde mayor o de séptima de dominante.',
      choiceSets: [
        [
      'La fundamental del acorde adornado es normalmente una nota común; el dim7 lo adorna en vez de tonicizarlo',
      'La fundamental del acorde adornado es normalmente una nota común; el dim7 lo toniciza en vez de adornarlo',
      'La fundamental del acorde adornado es normalmente su sensible; el dim7 lo adorna en vez de tonicizarlo',
      'La fundamental del acorde adornado es normalmente su sensible; el dim7 lo toniciza en vez de adornarlo',
    ],
        [
      "Una voz queda en la misma nota y las otras tres se mueven por grado conjunto para adornar el acorde",
      "Tres voces quedan en las mismas notas y la otra se mueve por grado conjunto para adornar el acorde",
      "Una voz queda en la misma nota y las otras tres saltan una quinta para adornar el acorde",
      "Tres voces quedan en las mismas notas y la otra salta una quinta para adornar el acorde",
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
          "Dos voces se mueven cromáticamente por movimiento paralelo mientras las otras se mantienen",
          "Dos voces se mueven diatónicamente por movimiento contrario mientras las otras se mantienen",
          "Dos voces se mueven diatónicamente por movimiento paralelo mientras las otras se mantienen",
        ],
        [
      'Un intercambio en el omnibus puede usar C–C#–D–Eb–E contra E–Eb–D–C#–C, con las otras voces mantenidas',
      'Un intercambio en el omnibus puede usar C–C#–D–Eb–E contra D–Db–C–B–Bb, con las otras voces mantenidas',
      'Un intercambio en el omnibus puede usar C–D–E contra E–D–C, con las otras voces mantenidas',
      'Un intercambio en el omnibus puede usar C–C#–D–Eb–E contra E–F–F#–G–G#, con las otras voces mantenidas',
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las mediantes cromáticas es verdadera?',
      hintTemplate:
        'Mediantes cromáticas como C mayor a E mayor o Ab mayor tienen fundamentales a una 3.ª mayor o menor de distancia y la misma cualidad; una nota del acorde queda fuera de la tonalidad, aunque ambas fundamentales sean diatónicas. Estos pares comparten una nota común. Las mediantes doblemente cromáticas, como C mayor a Eb menor, no comparten ninguna.',
      choiceSets: [
        [
          'C mayor → E mayor es mediante cromática: fundamentales a una 3.ª mayor, una nota común (E)',
          'C mayor → G mayor es mediante cromática: fundamentales a una 5.ª, una nota común (G)',
          'C mayor → F mayor es mediante cromática: fundamentales a una 4.ª, una nota común (C)',
          'C mayor → A menor es mediante cromática: fundamentales a una 3.ª menor, dos notas comunes (C, E)',
        ],
        [
      "Las mediantes cromáticas enlazan fundamentales a distancia de tercera, con alguna nota ajena a la escala",
      'Las mediantes cromáticas enlazan fundamentales a distancia de tercera usando solo notas de la escala',
      'Las mediantes cromáticas alteran una nota del acorde manteniendo la misma fundamental',
      'Las mediantes cromáticas enlazan fundamentales a distancia de quinta, con alguna nota ajena a la escala',
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
      "Solo hay 2 escalas de tonos enteros, cada una con 6 de las 12 notas",
      'Solo hay 6 escalas de tonos enteros, cada una con 2 de las 12 notas',
      'Solo hay 3 escalas de tonos enteros, cada una con 4 de las 12 notas',
      'Solo hay 4 escalas de tonos enteros, cada una con 3 de las 12 notas',
    ],
        [
      'Un acorde de séptima disminuida divide la octava en 4 partes iguales de 3 semitonos',
      'Un acorde de séptima disminuida divide la octava en 3 partes iguales de 4 semitonos',
      'Un acorde de séptima disminuida divide la octava en 6 partes iguales de 2 semitonos',
      'Un acorde de séptima disminuida divide la octava en 2 partes iguales de 6 semitonos',
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la armonía no funcional del Romanticismo tardío es verdadera?',
      hintTemplate:
        'En el Romanticismo tardío, los acordes se enlazan a menudo por cercanía en la conducción de voces, notas comunes o color, en lugar de por la función tónica–dominante; el paralelismo mueve la forma de un acorde en paralelo.',
      choiceSets: [
        [
          'Las conexiones no funcionales entre acordes favorecen principalmente la fluidez lineal y alturas compartidas',
          'Las conexiones no funcionales entre acordes favorecen principalmente el movimiento paralelo de tritono en todas las voces',
          'Las conexiones no funcionales entre acordes favorecen principalmente saltos melódicos amplios y cambios bruscos de registro',
          'Las conexiones no funcionales entre acordes favorecen principalmente la eliminación de alturas comunes entre acordes sucesivos',
        ],
        [
          'El paralelismo estricto (cromático) mueve la forma de un acorde en paralelo, manteniendo su cualidad exacta',
          'El paralelismo estricto (cromático) mueve la forma de un acorde en paralelo, ajustándola en cada paso a la tonalidad',
          'El paralelismo estricto (cromático) mueve todas las voces por movimiento contrario hacia la tónica',
          'El paralelismo estricto (cromático) mantiene un acorde y solo cambia la nota del bajo',
        ],
        [
      'Los cambios cromáticos frecuentes y los destinos tonales lejanos suelen debilitar la sensación de una tonalidad estable',
      'Los cambios cromáticos frecuentes y los destinos tonales lejanos suelen exigir un tempo más rápido',
      'Los cambios cromáticos frecuentes y los destinos tonales lejanos suelen aclarar la tonalidad estable',
      'Los cambios cromáticos frecuentes y los destinos tonales lejanos suelen eliminar la organización rítmica',
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
        'Cantus firmus: 8–12 redondas, de tónica a tónica, sobre todo por grado conjunto, un solo punto culminante. Primera especie: solo consonancias (1J, 3.as, 5J, 6.as, 8J); empieza en 1J u 8J, o en 5J solo cuando el contrapunto está por encima del cantus; termina en 1J o 8J alcanzado por grado conjunto.',
      choiceSets: [
        [
          'Un cantus firmus empieza y termina en la tónica y se mueve sobre todo por grado conjunto',
          'Un cantus firmus empieza en la dominante y se mueve sobre todo por salto',
          'Un cantus firmus mezcla libremente redondas, blancas y negras',
          'Un cantus firmus repite notas muy a menudo y tiene varios puntos culminantes diferentes entre sí',
        ],
        [
          'La primera especie permite solo estos intervalos sobre el bajo: unísonos, 3.as, 5.as justas, 6.as y octavas',
          'La primera especie permite solo estos intervalos sobre el bajo: unísonos, 3.as, 4.as, 5.as justas, 6.as y octavas',
          'La primera especie permite solo estos intervalos sobre el bajo: unísonos, 5.as justas y octavas',
          'La primera especie permite solo estos intervalos sobre el bajo: unísonos, 2.as, 4.as, 6.as y octavas',
        ],
        [
          "Comienza con una consonancia perfecta y termina en un unísono u octava",
          "Comienza con una consonancia imperfecta y termina en un unísono u octava",
          "Comienza con una consonancia perfecta y termina en una consonancia imperfecta",
          "Comienza con una consonancia imperfecta y termina en una consonancia imperfecta",
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
          "Cada tiempo fuerte debe ser disonante con el cantus firmus",
          "Cada tiempo débil debe ser consonante con el cantus firmus",
          "Cada tiempo débil debe ser disonante con el cantus firmus",
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el contrapunto de tercera especie (4:1) es verdadera?',
      hintTemplate:
        'Tercera especie: cuatro notas contra cada nota del cantus. La primera es consonante; las demás pueden ser notas de paso, bordaduras, una cambiata (grado conjunto a la disonancia, salto de 3.ª, grado conjunto de vuelta) o una bordadura doble.',
      nudgeTemplate: 'La tercera especie pone cuatro notas contra cada nota del cantus. Pregúntate cuál de las cuatro cae en el tiempo y, por tanto, debe ser consonante; en cada figura disonante, sigue el recorrido nota a nota: ¿por grado conjunto o por salto, y vuelve al punto de partida?',
      choiceSets: [
        [
      'La primera nota de cada grupo de cuatro es consonante; las demás pueden ser notas de paso o bordaduras disonantes',
      'La primera nota de cada grupo de cuatro es disonante; las demás pueden ser notas de paso o bordaduras disonantes',
      'La primera nota de cada grupo de cuatro es consonante; las demás pueden ser disonancias alcanzadas y dejadas por salto',
      'La primera nota de cada grupo de cuatro es disonante; las demás pueden ser disonancias alcanzadas y dejadas por salto',
    ],
        [
          'La cambiata va por grado conjunto a una disonancia, salta una 3.ª y vuelve por grado conjunto',
          'La cambiata salta a una disonancia y después la resuelve bajando por grado conjunto',
          'La cambiata liga una disonancia por encima de la barra de compás hasta el tiempo fuerte del compás siguiente',
          'La cambiata va por grado conjunto a una disonancia y sigue en la misma dirección',
        ],
        [
          "Una bordadura doble es una bordadura superior y una inferior en secuencia alrededor de una nota",
          "Una bordadura doble es un grado conjunto a la disonancia, un salto de tercera en la misma dirección y un grado conjunto de vuelta",
          "Una bordadura doble es una nota de paso en tiempo débil abordada y abandonada por grado conjunto en la misma dirección",
          "Una bordadura doble son dos notas de paso consecutivas abordadas y abandonadas por grado conjunto en la misma dirección",
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
        'La cuarta especie liga una nota de un tiempo débil por encima de la barra de compás. Si la nota ligada es disonante en el tiempo fuerte, es un retardo: preparado como consonancia, resuelto bajando por grado conjunto. Por encima del cantus: 7-6, 4-3, 9-8; por debajo: 2-3.',
      choiceSets: [
        [
      "En un retardo, la preparación en tiempo débil queda ligada a la disonancia en tiempo fuerte y resuelve por grado conjunto de la nota superior a la inferior",
      "En un retardo, la preparación en tiempo fuerte queda ligada a la disonancia en tiempo débil y resuelve por grado conjunto de la nota superior a la inferior",
      "En un retardo, la preparación en tiempo débil queda ligada a la disonancia en tiempo fuerte y resuelve por grado conjunto de la nota inferior a la superior",
      "En un retardo, la preparación en tiempo fuerte queda ligada a la disonancia en tiempo débil y resuelve por grado conjunto de la nota inferior a la superior",
    ],
        [
      "Un retardo se prepara como consonancia y resuelve bajando por grado conjunto",
      "Un retardo se prepara como disonancia y resuelve subiendo por grado conjunto",
      "Un retardo se prepara como consonancia y resuelve subiendo por grado conjunto",
      "Un retardo se prepara como disonancia y resuelve bajando por grado conjunto",
    ],
        [
      'Por encima del cantus, los principales retardos disonantes son 7-6, 4-3 y 9-8; por debajo, 2-3',
      'Por encima del cantus, los principales retardos disonantes son 2-3, 4-3 y 9-8; por debajo, 7-6',
      'Por encima del cantus, los principales retardos disonantes son 7-6, 2-3 y 9-8; por debajo, 4-3',
      'Por encima del cantus, los principales retardos disonantes son 7-6, 4-3 y 2-3; por debajo, 9-8',
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las cadenas de retardos y la quinta especie (florida) es verdadera?',
      hintTemplate:
        'En una cadena, cada resolución queda ligada y se convierte en el retardo siguiente. La quinta especie (contrapunto florido) mezcla en una sola línea los valores de las cuatro primeras especies, cada uno con sus reglas.',
      nudgeTemplate: 'En una cadena, sigue cada nota que acaba de resolver: ¿qué le ocurre en la siguiente barra de compás? En la quinta especie (contrapunto florido), pregúntate si desecha lo que enseñaron las cuatro especies anteriores o si se apoya en ello.',
      choiceSets: [
        [
      "En una cadena de retardos, cada resolución queda ligada al siguiente acorde para preparar otro retardo",
      'En una cadena de retardos, cada retardo resuelve subiendo por grado para convertirse en la siguiente preparación',
      "En una cadena de retardos, cada resolución salta al siguiente acorde para preparar otro retardo",
      'En una cadena de retardos, cada resolución se sustituye por un silencio antes de la siguiente preparación',
    ],
        [
          "La quinta especie combina libremente los valores anteriores manteniendo sus reglas de disonancia",
          "La quinta especie combina libremente los valores anteriores abandonando sus reglas de disonancia",
          "La quinta especie fija los valores anteriores en cinco notas por nota del cantus manteniendo sus reglas de disonancia",
          "La quinta especie fija los valores anteriores en cinco notas por nota del cantus abandonando sus reglas de disonancia",
        ],
        [
          'El contrapunto florido mantiene las reglas de cada especie anterior para sus valores',
          "El contrapunto florido aplica reglas de retardos a notas de paso y reglas de paso a retardos",
          "El contrapunto florido abandona reglas anteriores cuando redondas y síncopa coexisten en la misma línea",
          "El contrapunto florido exige que cada valor de nota use una regla nueva sin relación con especies anteriores",
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
          'Intercambiar C4–E4 a la octava da E4–C5',
          'Intercambiar C4–E4 a la octava da E4–B4',
          'Intercambiar C4–E4 a la octava da E4–A4',
          'Intercambiar C4–E4 a la octava da E4–D5',
        ],
        [
          'A la octava, se evitan las 5.as porque se convierten en 4.as disonantes',
          'A la octava, se evitan las 3.as porque se convierten en 6.as disonantes',
          'A la octava, se prefieren las 5.as porque siguen siendo 5.as justas',
          'A la octava, se evitan las 6.as porque se convierten en 2.as disonantes',
        ],
        [
      "A la décima, una 3.ª se convierte en octava y una 6.ª se convierte en 5.ª",
      "A la décima, una 3.ª se convierte en 5.ª y una 6.ª se convierte en octava",
      "A la décima, una octava se convierte en 6.ª y una 5.ª se convierte en 3.ª",
      "A la décima, una 3.ª sigue siendo una 3.ª y una 6.ª sigue siendo una 6.ª",
    ],
        [
      "Al invertir a la duodécima, la quinta se transforma en octava",
      "Al invertir a la duodécima, la quinta se transforma en tercera",
      "Al invertir a la duodécima, la quinta se transforma en décima",
      "Al invertir a la duodécima, la quinta se transforma en duodécima",
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el contrapunto triple es verdadera?',
      hintTemplate:
        'Contrapunto triple: tres voces que funcionan en las seis disposiciones verticales (ABC, ACB, BAC, BCA, CAB, CBA), así que cada par de voces debe ser invertible.',
      nudgeTemplate: 'Cuenta de cuántas maneras se pueden apilar tres voces, de arriba abajo, y pregúntate qué pares de voces acaban intercambiando su lugar a lo largo de esas disposiciones.',
      choiceSets: [
        [
      'Una prueba completa verifica la validez contrapuntística de las seis permutaciones',
      'Una prueba completa verifica la validez contrapuntística de las tres rotaciones cíclicas',
      'Una prueba completa verifica la validez contrapuntística de los dos órdenes que conservan el bajo original',
      'Una prueba completa verifica la validez contrapuntística del orden original y su inverso',
    ],
        [
      'Cada uno de los tres pares debe mantener contrapunto válido tras intercambiar las voces',
      'Cada uno de los tres pares debe mantener los mismos intervalos tras intercambiar las voces',
      'Cada uno de los tres pares debe contener consonancias perfectas tras intercambiar las voces',
      'Cada uno de los tres pares debe moverse en sentido contrario tras intercambiar las voces',
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
      nudgeTemplate: 'Planifica como un compositor: decide hacia dónde van las frases antes de rellenar los detalles, y reserva el último paso para revisar el resultado según las reglas de la escritura a cuatro voces.',
      choiceSets: [
        [
          "Localiza los puntos de cadencia de la melodía y después elige un bajo y acordes que los apoyen",
          'Armoniza desde la primera nota y deja que los acordes decidan dónde termina cada frase',
          'Escribe primero las voces interiores y después ajusta el bajo a esas voces',
          'Elige un acorde nuevo para cada nota de la melodía y después marca los finales de frase',
        ],
        [
          'Por último, comprueba el espaciado, la duplicación y las quintas u octavas paralelas',
          'Por último, añade quintas paralelas entre las voces extremas',
          'Por último, duplica la sensible en la cadencia final',
          'Por último, cruza contralto y tenor en las voces interiores',
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
          'En la trompa en F, el C5 escrito suena como F4',
          'En la trompa en F, el C5 escrito suena como G5',
          'En la trompa en F, el C5 escrito suena como Bb4',
          'En la trompa en F, el C5 escrito suena como C5',
        ],
        [
          "Para oír la armonía real, convierte la altura escrita en altura de concierto usando el intervalo del instrumento",
          "Para oír la armonía real, convierte la altura de concierto en altura escrita usando el intervalo del instrumento",
          "Para oír la armonía real, convierte la altura escrita en altura de concierto usando los intervalos del bajo cifrado",
          "Para oír la armonía real, convierte la altura de concierto en altura escrita usando los intervalos del bajo cifrado",
        ],
      ],
    },
  ],
};

export default overlay;
