import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 7 exercise templates
// 16 modules — index-aligned with templatesL7.ts (W4-01 re-keying, 2026-10-31)
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 21: Armonía Jazz
  // =========================================================================

  // ---- l7u21m1: Cifrado Jazz y Extensiones ----
  l7u21m1: [
    {
      // chord_build
      promptTemplate:
        'Construye el acorde {quality} sobre {root}. Selecciona todas las notas, incluida la novena por encima de la séptima.',
      hintTemplate:
        'Las extensiones de jazz apilan terceras por encima de la séptima: novena = segunda una octava arriba, undécima = cuarta arriba, decimotercera = sexta arriba. Construye a partir de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el cifrado jazz es verdadera?',
      hintTemplate:
        'Cifrado jazz: triángulo/maj7 = séptima mayor, - o m = menor, 7 = dominante, ° = disminuido, ø = semidisminuido, + = aumentado, sus = suspendido. Las extensiones se miden desde la fundamental: en C13, A es la 13.ª y F suele omitirse; en C7(#9), D# es la 9.ª aumentada, junto con E y Bb.',
      choiceSets: [
        [
          "C13 mantiene una base de séptima de dominante y se extiende hasta A; el F suele quedar fuera",
          "C13 suele tener una base de séptima mayor y se extiende hasta A; su séptima es B",
          "C13 mantiene una base de séptima de dominante y se extiende hasta Ab; su decimotercera está rebajada",
          "C13 normalmente tiene una base de séptima menor con Eb como tercera; el A se convierte en su decimotercera",
        ],
        [
          'Cmin7(b5) es lo mismo que Cø (C semidisminuido)',
          'Cmin7(b5) es un acorde de séptima disminuida completo, exactamente el mismo acorde que Cdim7 (C°7)',
          'Cmin7(b5) es un acorde de séptima menor',
          'La b5 lo convierte en un acorde aumentado',
        ],
        [
          'C7(#9) indica E, Bb, D#',
          'C7(#9) indica E, B, D#',
          'C7(#9) indica Eb, Bb, D',
          'C7(#9) indica Eb, B, D',
        ],
      ],
    },
  ],

  // ---- l7u21m2: Voicings de Shell ----
  l7u21m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Qué conjunto de tres notas es el voicing de shell correcto?',
      hintTemplate:
        'Un voicing de shell usa solo fundamental, tercera y séptima — la quinta se omite. La tercera define la cualidad del acorde (mayor/menor); la séptima define el tipo de acorde de séptima (maj7 / m7 / dom7).',
      choiceSets: [
        [
          'Shell de Cmaj7: C, E, B',
          'Shell de Cmaj7: C, G, B',
          'Shell de Cmaj7: C, E, G',
          'Shell de Cmaj7: C, G, Bb',
        ],
        [
          'Shell de Dm7: D, F, C',
          'Dm7 completo: D, F, A, C',
          'Dm7 sin la tercera: D, A, C',
          'Dm7 sin la séptima: D, F, A',
        ],
        [
          'Shell de G7: G, B, F',
          'Shell de G7: G, D, F',
          'Shell de G7: G, B, D',
          'Shell de G7: G, D, F#',
        ],
        [
          'Shell de Fmaj7: F, A, E',
          'Fmaj7 completo: F, A, C, E',
          'Fmaj7 sin la tercera: F, C, E',
          'Fmaj7 sin la séptima: F, A, C',
        ],
        [
          'Shell de Am7: A, C, G',
          'Am7 completo: A, C, E, G',
          'Am7 sin la tercera: A, E, G',
          'Am7 sin la séptima: A, C, E',
        ],
        [
          'Shell de E7: E, G#, D',
          'Shell de E7: E, B, D',
          'Shell de E7: E, G#, B',
          'Shell de E7: E, B, D#',
        ],
        [
          'Shell de Bbmaj7: Bb, D, A',
          'Shell de Bbmaj7: Bb, Eb, G',
          'Shell de Bbmaj7: Bb, F, C',
          'Shell de Bbmaj7: Bb, C, Eb',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cómo se enlazan los voicings de shell en un contexto jazz?',
      hintTemplate:
        'En una ii-V-I, la tercera del ii se mantiene como séptima del V, mientras la séptima del ii baja un semitono a la tercera del V (y lo mismo vuelve a ocurrir del V al I). Esta eficiencia en la conducción de voces se denomina líneas de notas guía.',
      nudgeTemplate: 'Identifica la 3.ª y la 7.ª de cada acorde de un ii-V-I (en C: Dm7, G7, Cmaj7) y sigue cada una de esas notas hasta el acorde siguiente: ¿cuáles se quedan donde están y cuánto se desplazan las demás?',
      choiceSets: [
        [
          'En Dm7–G7, F se mantiene en F; C pasa a B',
          'En Dm7–G7, F pasa a E; C pasa a B',
          'En Dm7–G7, F se mantiene en F; C pasa a D',
          'En Dm7–G7, F pasa a E; C pasa a D',
        ],
        [
          'En Bb7–Ebmaj7, D→D y Ab→G',
          'En Bb7–Ebmaj7, D→Eb y Ab→G',
          'En Bb7–Ebmaj7, D→D y Ab→F',
          'En Bb7–Ebmaj7, D→Eb y Ab→F',
        ],
      ],
    },
  ],

  // ---- l7u21m3: Progresión ii-V-I ----
  l7u21m3: [
    {
      // chord_build
      promptTemplate:
        'Construye un acorde de séptima menor sobre {root} — el sonido ii7 de una progresión ii-V-I.',
      hintTemplate:
        'Un ii7 es un acorde de séptima menor sobre {root}: fundamental + 3.ª menor + 5.ª justa + 7.ª menor. En el jazz, el ii-V-I es la progresión más fundamental.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la progresión ii-V-I es verdadera?',
      hintTemplate:
        'ii-V-I en mayor: m7 → dom7 → maj7. En menor: m7b5 → dom7(b9) → m(maj7). Esta es la columna vertebral de la armonía jazz. Un ii-V-I también puede establecer una tónica temporal en otro grado de la tonalidad.',
      choiceSets: [
        [
          'En tonalidades menores, el acorde ii es semidisminuido (m7b5)',
          "En tonalidades menores, el acorde ii es de séptima de dominante (7)",
          "En tonalidades menores, el acorde ii es de séptima mayor (maj7)",
          "En tonalidades menores, el acorde ii es de séptima disminuida (dim7)",
        ],
        [
          'Cuando un ii-V-I apunta a un acorde distinto de I, ese acorde funciona como tónica de la tonalidad temporal',
          'Cuando un ii-V-I apunta a un acorde distinto de I, ese acorde funciona como supertónica de la tonalidad temporal',
          'Cuando un ii-V-I apunta a un acorde distinto de I, ese acorde funciona como subdominante de la tonalidad temporal',
          'Cuando un ii-V-I apunta a un acorde distinto de I, ese acorde funciona como dominante de la tonalidad temporal',
        ],
      ],
    },
  ],

  // ---- l7u21m4: Sustitución Tritonal ----
  l7u21m4: [
    {
      // chord_build
      promptTemplate:
        'Construye el sustituto tritonal del V7 de {key} mayor.',
      hintTemplate:
        'El V7 de {key} se construye una 5.ª justa por encima de {key}. Su sustituto tritonal es el acorde de séptima de dominante a un tritono (6 semitonos) de ese V7: {root}7, que baja un semitono a {key}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Sustitución tritonal: ¿por qué funciona y qué cambia?',
      hintTemplate:
        'Dos dom7 a un tritono de distancia comparten el mismo intervalo de tritono (la tercera y la séptima se intercambian). Esto crea movimiento cromático del bajo: bII7 → I en lugar de V7 → I.',
      choiceSets: [
        [
          'G7 y Db7 comparten las alturas sonoras F y B',
          'G7 y Db7 comparten las alturas sonoras G y D',
          'G7 y Db7 comparten las alturas sonoras B y E',
          'G7 y Db7 comparten las alturas sonoras C y F',
        ],
        [
          'El bajo del sustituto baja un semitono a la tónica',
          'El bajo del sustituto baja un tono a la tónica',
          'El bajo del sustituto sube un semitono a la tónica',
          'El bajo del sustituto sube un tono a la tónica',
        ],
      ],
    },
  ],

  // ---- l7u21m5: Formas de Blues ----
  l7u21m5: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala de {root} {scaleType} usada en la improvisación blues.',
      hintTemplate:
        'La escala blues: fundamental, b3, 4, b5, 5, b7 (6 notas). La pentatónica menor: fundamental, b3, 4, 5, b7 (5 notas). Construye a partir de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Analiza la estructura de una forma de blues.',
      hintTemplate:
        'El blues de 12 compases: I7 (4 compases), IV7 (2 compases), I7 (2 compases), V7 (1), IV7 (1), I7 (2). El jazz blues añade movimiento ii-V y sustituciones tritonales.',
      choiceSets: [
        [
          'Los tres acordes básicos de un blues de 12 compases en F son F7, Bb7, C7',
          'Los tres acordes básicos de un blues de 12 compases en F son Fmaj7, Bb7, C7',
          'Los tres acordes básicos de un blues de 12 compases en F son F7, Bbmaj7, C7',
          'Los tres acordes básicos de un blues de 12 compases en F son Fmaj7, Bbmaj7, C7',
        ],
        [
          'En el blues de jazz en C, Gm7–C7 en el compás 4 es un ii–V que conduce a F7',
          'En el blues de jazz en C, Dm7–G7 en el compás 4 es un ii–V que conduce a F7',
          'En el blues de jazz en C, Gm7–C7 en los compases 9–10 es un ii–V que conduce a C7',
          'En el blues de jazz en C, Am7–D7 en los compases 9–10 es un ii–V que conduce a C7',
        ],
      ],
    },
  ],

  // ---- l7u21m6: Rhythm Changes ----
  l7u21m6: [
    {
      // multiple_choice
      promptTemplate:
        'Analiza la forma de los rhythm changes.',
      hintTemplate:
        'Rhythm changes (de "I Got Rhythm", de Gershwin): forma AABA, 32 compases. Secciones A: turnarounds I-vi-ii-V. Puente: III7-VI7-II7-V7 (ciclo de dominantes).',
      choiceSets: [
        [
          'La sección A de los rhythm changes se construye sobre turnarounds I-vi-ii-V en Bb mayor',
          "La sección A de los rhythm changes se construye sobre turnarounds I-IV-vi-V en Bb mayor",
          "La sección A de los rhythm changes se construye sobre turnarounds I-V-vi-IV en Bb mayor",
          "La sección A de los rhythm changes se construye sobre turnarounds I-bVII-IV-I en Bb mayor",
        ],
        [
          "El puente enlaza acordes dominantes cuyas fundamentales bajan una quinta cada vez",
          "El puente enlaza acordes dominantes cuyas fundamentales suben una quinta cada vez",
          "El puente enlaza acordes dominantes cuyas fundamentales bajan una tercera mayor cada vez",
          "El puente enlaza acordes dominantes cuyas fundamentales suben un semitono cada vez",
        ],
        [
          'La forma de los rhythm changes es AABA, con un total de 32 compases',
          "La forma de los rhythm changes es ABAB, con un total de 32 compases",
          "La forma de los rhythm changes es ABBA, con un total de 32 compases",
          "La forma de los rhythm changes es ABAC, con un total de 32 compases",
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 22: Armonía Modal y Pop
  // =========================================================================

  // ---- l7u22m1: Teoría Acorde-Escala ----
  l7u22m1: [
    {
      // scale_build
      promptTemplate:
        'Construye el modo {scaleType} de {root}.',
      hintTemplate:
        'Los modos: jónico (mayor), dórico (b3, b7), frigio (b2, b3, b6, b7), lidio (#4), mixolidio (b7), eólico (menor natural), locrio (b2, b3, b5, b6, b7).',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la teoría acorde-escala es verdadera?',
      hintTemplate:
        'm7 → dórico. dom7 → mixolidio. maj7 → jónico o lidio. m7b5 → locrio (o locrio con 2.ª natural). Una nota a evitar es una nota de la escala un semitono por encima de una nota del acorde.',
      choiceSets: [
        [
          'El dórico es la elección de escala primaria para acordes m7 en el jazz',
          'El jónico es la elección estándar para acordes m7',
          'El locrio es la elección estándar sobre un acorde m7, porque su b5 coincide con la quinta del acorde',
          'El lidio es la elección estándar para acordes m7',
        ],
        [
          'El mixolidio es la elección de escala primaria para acordes de séptima de dominante',
          'El dórico se usa sobre acordes de séptima de dominante',
          'El eólico es la elección estándar sobre un acorde de séptima de dominante, porque su b3 encaja con la tercera del acorde',
          'El frigio es la elección estándar para acordes de séptima de dominante',
        ],
        [
          'El lidio se prefiere frecuentemente al jónico para acordes maj7 porque no tiene notas a evitar',
          'El jónico no tiene notas a evitar sobre maj7, porque su cuarta queda un tono por encima de la tercera del acorde',
          'El locrio se prefiere para acordes maj7',
          'Las notas a evitar son irrelevantes en la teoría acorde-escala',
        ],
        [
          'Una "nota a evitar" es una nota de la escala un semitono por encima de una nota del acorde, así que choca con ella',
          'Una "nota a evitar" es cualquier nota de la escala que no está en el acorde, así que toda novena, undécima y decimotercera lo es',
          'Las notas a evitar crean consonancia',
          'No existen notas a evitar en ninguna escala',
        ],
        [
          "El locrio y el locrio con 2.ª natural proporcionan las notas de un acorde semidisminuido m7b5",
          "El dórico y el eólico proporcionan las notas de un acorde semidisminuido m7b5",
          "El jónico y el lidio proporcionan las notas de un acorde semidisminuido m7b5",
          "El mixolidio y el lidio dominante proporcionan las notas de un acorde semidisminuido m7b5",
        ],
      ],
    },
  ],

  // ---- l7u22m2: Estructuras Superiores y Rearmonización ----
  l7u22m2: [
    {
      // chord_build
      promptTemplate:
        'Construye la tríada de estructura superior que va sobre {key}7 y le da la novena, la undécima aumentada y la decimotercera.',
      hintTemplate:
        'La novena de {key}7 está un tono por encima de {key}. La tríada mayor sobre esa nota, {root}, contiene la novena (su fundamental), la undécima aumentada (su tercera) y la decimotercera (su quinta).',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las estructuras superiores y la rearmonización es verdadera?',
      hintTemplate:
        'Una tríada de estructura superior va sobre el shell de la dominante (fundamental, tercera, b7); nombra sus notas por su intervalo sobre el bajo. La rearmonización cambia acordes por otros que siguen sosteniendo la melodía, a menudo dentro de la misma función. Los acordes disminuidos de paso pueden conectar acordes a distancia de un grado mediante movimiento cromático del bajo.',
      choiceSets: [
        [
          'Una tríada de D mayor sobre C7 aporta la novena, la #11 y la decimotercera (el sonido de C13#11)',
          'Una tríada de D mayor sobre C7 aporta la b9, la #9 y la b13',
          'Una tríada de D mayor sobre C7 solo dobla la fundamental, la tercera y la quinta del acorde, así que no añade ningún color',
          'Una tríada de D mayor sobre C7 lo convierte en un acorde menor',
        ],
        [
          'En C mayor, Em7 puede sustituir a Cmaj7: comparten E, G y B y ambos tienen función de tónica',
          "En C mayor, Em7 puede sustituir a Cmaj7: comparten E, G y B y ambos tienen función dominante",
          "En C mayor, Em7 puede sustituir a Cmaj7: comparten C, E y G y ambos tienen función de tónica",
          "En C mayor, Em7 puede sustituir a Cmaj7: comparten C, E y G y ambos tienen función dominante",
        ],
        [
          "La rearmonización da a una melodía conocida un acompañamiento nuevo, eligiendo otros acordes de apoyo",
          "La rearmonización da a los acordes originales una melodía diferente, sustituyendo las notas melódicas sobre ellos",
          "La rearmonización mueve la melodía y los acordes originales a otra tonalidad, conservando sus funciones armónicas",
          "La rearmonización cambia la inversión de los acordes originales, conservando la melodía y la identidad de los acordes",
        ],
        [
          'C#dim7 entre Cmaj7 y Dm7 es un acorde de paso: el bajo sube cromáticamente C-C#-D',
          'C#dim7 entre Cmaj7 y Dm7 es la nueva tónica, así que el tema ha modulado definitivamente a C# menor',
          'Un acorde de paso debe durar una sección entera',
          'Los acordes de paso no pueden ser disminuidos',
        ],
      ],
    },
  ],

  // ---- l7u22m3: Cambios de Coltrane ----
  l7u22m3: [
    {
      // chord_build
      promptTemplate:
        'En los cambios de Coltrane cada centro tonal se prepara con su propio V7. Construye el V7 que conduce a {key} mayor.',
      hintTemplate:
        'Un acorde de séptima de dominante resuelve una 5.ª justa por debajo: el V7 de {key} se construye una 5.ª por encima de {key}, sobre {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los cambios de Coltrane es verdadera?',
      hintTemplate:
        'Giant Steps: tres centros tonales a una 3.ª mayor de distancia (B, G, Eb), cada uno alcanzado por su propio V7. La estructura constante mueve una misma cualidad de acorde en paralelo, sea cual sea la tonalidad.',
      choiceSets: [
        [
          'Giant Steps recorre tres centros tonales a una 3.ª mayor de distancia: B, G y Eb',
          'Giant Steps recorre centros tonales a una 5.ª justa de distancia, un paso cada vez por el círculo de quintas',
          'Sus centros tonales están a un semitono de distancia',
          'Se queda en una sola tonalidad de principio a fin',
        ],
        [
          "La octava se reparte por igual entre tres puntos de reposo tonal separados por cuatro semitonos",
          'La octava se reparte por igual entre cuatro puntos de reposo tonal separados por tres semitonos',
          'La octava se reparte por igual entre dos puntos de reposo tonal separados por seis semitonos',
          'La octava se reparte por igual entre seis puntos de reposo tonal separados por dos semitonos',
        ],
        [
          'La estructura constante mueve una misma cualidad de acorde en paralelo, sea cual sea la tonalidad (Cmaj7-Dbmaj7-Dmaj7)',
          'La estructura constante significa mantener un único acorde durante todo el tema, cambiando solo la melodía que va por encima',
          'La estructura constante usa solo acordes diatónicos',
          'La estructura constante prohíbe el movimiento paralelo',
        ],
      ],
    },
  ],

  // ---- l7u22m4: Fundamentos de la Armonía Modal ----
  l7u22m4: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la nota característica de un modo es verdadera?',
      hintTemplate:
        'Cada modo tiene una nota característica que lo distingue. Dórico: sexta natural. Frigio: b2. Lidio: #4. Mixolidio: b7. Los vamps modales enfatizan estas notas.',
      choiceSets: [
        [
          "Parte de la menor natural y sube la sexta nota un semitono para obtener el dórico",
          "Parte de la menor natural y sube la séptima nota un semitono para obtener el dórico",
          "Parte de la menor natural y sube la tercera nota un semitono para obtener el dórico",
          "Parte de la menor natural y baja la segunda nota un semitono para obtener el dórico",
        ],
        [
          "Eleva solo la cuarta nota de una escala mayor para obtener el lidio",
          "Eleva solo la quinta nota de una escala mayor para obtener el lidio",
          "Baja solo la séptima nota de una escala mayor para obtener el lidio",
          "Baja solo la tercera nota de una escala mayor para obtener el lidio",
        ],
        [
          'Un vamp en D dórico (Dm7 - G7) enfatiza la sexta natural (B natural sobre D)',
          "Un vamp en D dórico (Dm7 - Gm7) enfatiza la sexta rebajada (Bb sobre D)",
          "Un vamp en D dórico (Dm7 - A7) enfatiza la séptima elevada (C# sobre D)",
          "Un vamp en D dórico (Dmaj7 - Gmaj7) enfatiza la tercera mayor (F# sobre D)",
        ],
        [
          'El frigio se caracteriza por el intervalo de b2, dándole un sabor español/flamenco',
          "El frigio se caracteriza por el intervalo de #4, dándole un sabor español/flamenco",
          'El frigio se caracteriza por el intervalo de séptima mayor, dándole un sabor español/flamenco',
          "El frigio se caracteriza por el intervalo de sexta natural, dándole un sabor español/flamenco",
        ],
      ],
    },
  ],

  // ---- l7u22m5: Planing y Armonía Cuartal ----
  l7u22m5: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la armonía cuartal y el paralelismo es verdadera?',
      hintTemplate:
        'Paralelismo: mover una forma de acorde en paralelo (diatónico o cromático). Armonía cuartal: acordes construidos de cuartas apiladas en lugar de terceras, comunes en el jazz y la música modal.',
      choiceSets: [
        [
          'La superposición cuartal D–G–C–F tiene tres cuartas justas entre notas adyacentes',
          'La superposición cuartal D–G–C–F tiene tres cuartas aumentadas entre notas adyacentes',
          'La superposición cuartal D–G–C–F tiene cuartas justas alternadas con quintas justas',
          'La superposición cuartal D–G–C–F tiene dos cuartas justas entre sus tres notas',
        ],
        [
          "El paralelismo desplaza todas las notas de un acorde en la misma dirección a la vez",
          "El paralelismo suele enviar la nota superior del acorde hacia arriba mientras la inferior baja",
          "El paralelismo mantiene todas las notas superiores mientras el bajo recorre la escala",
          "El paralelismo transforma un acorde en melodía haciendo sonar las notas una tras otra",
        ],
        [
          'El paralelismo diatónico mantiene todas las notas dentro de la tonalidad; el paralelismo estricto (cromático) mantiene los intervalos exactos',
          "El paralelismo diatónico mantiene los intervalos exactos; el paralelismo estricto (cromático) mantiene todas las notas en la tonalidad",
          "El paralelismo diatónico mantiene todas las voces inmóviles; el paralelismo estricto (cromático) cambia solo el bajo",
          "El paralelismo diatónico mueve todas las notas en movimiento contrario; el paralelismo estricto (cromático) mantiene los intervalos exactos",
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 23: Taxonomía de Escalas y Acordes
  // =========================================================================

  // ---- l7u23m1: Progresiones Pop y Números de Nashville ----
  l7u23m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre progresiones pop y números de Nashville es verdadera?',
      hintTemplate:
        'El sistema de números de Nashville usa grados de la escala: 1=I, 4=IV, 5=V, 6m=vi. Comunes: 1-5-6m-4, 1-4-5-1, 6m-4-1-5.',
      choiceSets: [
        [
          "I-V-vi-IV es común en el pop, y sus números romanos conservan las relaciones entre acordes en distintas tonalidades",
          "I-V-vi-IV es común en el pop, y sus números romanos mantienen las mismas alturas absolutas en distintas tonalidades",
          "I-V-vi-IV es común en el pop, y vi representa un acorde mayor sobre el sexto grado de la escala",
          'I-V-vi-IV es común en el pop, y IV representa un acorde menor sobre el cuarto grado de la escala',
        ],
        [
          "vi-IV-I-V rota I-V-vi-IV para que los mismos cuatro acordes empiecen en vi",
          "vi-IV-I-V rota I-IV-vi-V para que los mismos cuatro acordes empiecen en vi",
          "vi-IV-I-V rota I-vi-IV-V para que los mismos cuatro acordes empiecen en vi",
          "vi-IV-I-V rota I-V-IV-vi para que los mismos cuatro acordes empiecen en vi",
        ],
        [
          'Los cifrados de Nashville numeran las fundamentales por grado de la escala desde la tónica, haciendo de 4 el acorde sobre el cuarto grado',
          'Los cifrados de Nashville suelen numerar las fundamentales por semitonos sobre la tónica, haciendo de 4 una tercera mayor',
          'Los cifrados de Nashville numeran las fundamentales como alturas fijas, haciendo de 1 la nota C en cualquier tonalidad',
          'Los cifrados de Nashville numeran las duraciones de acordes en pulsos, haciendo de 4 un acorde de cuatro pulsos',
        ],
      ],
    },
    {
      // chord_build
      promptTemplate:
        'En {key} mayor, construye el acorde escrito 6m en números de Nashville.',
      hintTemplate:
        '6m es el acorde menor sobre el 6.º grado de la escala (vi): en {key} mayor es {root} menor.',
    },
  ],

  // ---- l7u23m2: Mezcla Modal y Mediantes Cromáticas en el Pop ----
  l7u23m2: [
    {
      // chord_build
      promptTemplate:
        'En {key} mayor, construye el acorde ♭VII tomado prestado del menor homónimo.',
      hintTemplate:
        'El menor homónimo ({key} menor) presta su ♭VII a {key} mayor: la tríada mayor sobre {root}.',
    },
    {
      // chord_build
      promptTemplate:
        'En {key} mayor, construye el acorde ♭VI tomado prestado del menor homónimo.',
      hintTemplate:
        'El menor homónimo ({key} menor) presta su ♭VI a {key} mayor: la tríada mayor sobre {root}.',
    },
    {
      // chord_build
      promptTemplate:
        'En {key} mayor, construye el acorde iv tomado prestado del menor homónimo.',
      hintTemplate:
        'El menor homónimo ({key} menor) presta su iv a {key} mayor: la tríada menor sobre {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre acordes prestados y mediantes cromáticas en el pop es verdadera?',
      hintTemplate:
        'Préstamos comunes en el pop: iv, bVI y bVII del menor homónimo (bVII es también el acorde mixolidio). Mediantes cromáticas: fundamentales a una 3.ª de distancia, con notas fuera de la tonalidad.',
      choiceSets: [
        [
          'El acorde bVII en una tonalidad mayor se toma prestado del menor homónimo (o del mixolidio)',
          'El acorde bVII se toma prestado del lidio, que es el único modo con el 7.º grado descendido un semitono',
          'bVII es un acorde diatónico en mayor',
          'bVII se toma prestado del locrio',
        ],
        [
          'El acorde iv en una tonalidad mayor se toma prestado del homónimo menor (eólico)',
          'El acorde iv es diatónico en una tonalidad mayor, porque el 4.º grado de una escala mayor tiene una tríada menor',
          'iv se toma prestado del lidio',
          'iv no existe como acorde prestado',
        ],
        [
          'La "cadencia Mario" bVI-bVII-I usa dos acordes tomados prestados del menor homónimo',
          'La "cadencia Mario" bVI-bVII-I usa solo acordes diatónicos de la tonalidad mayor, sin nada prestado',
          'Termina en el acorde vi',
          'Es solo una cadencia de tonalidad menor',
        ],
        [
          'C mayor a E mayor es una mediante cromática: fundamentales a una 3.ª mayor, una nota común (E)',
          'C mayor a E mayor es un movimiento diatónico simple: ambos acordes pertenecen a C mayor y comparten dos notas',
          'C a E mayor es una relación de dominante',
          'C mayor y E mayor no comparten notas',
        ],
      ],
    },
  ],

  // ---- l7u23m3: Escalas: Modos de la Menor Melódica ----
  l7u23m3: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala {scaleType} de {root}.',
      hintTemplate:
        'Menor melódica (menor jazz): 1-2-b3-4-5-6-7. Alterada (modo 7 de la menor melódica): 1-b2-#2-3-#4-#5-b7 — la menor melódica un semitono por encima de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los modos de la menor melódica es verdadera?',
      hintTemplate:
        'Numera los modos de C menor melódica (C D Eb F G A B) desde cada nota: el modo 4 empieza en F (lidio dominante), el modo 6 en A (locrio con 2.ª natural), el modo 7 en B (escala alterada).',
      choiceSets: [
        [
          'La escala alterada es el modo 7 de la menor melódica: G alterada tiene las notas de Ab menor melódica',
          'La escala alterada es el modo 7 de la menor armónica: G alterada tiene exactamente las notas de C menor armónica',
          'La escala alterada no tiene notas alteradas',
          'G alterada es G mayor',
        ],
        [
          'El lidio dominante es el modo 4 de la menor melódica y sirve para un acorde de séptima de dominante con #11',
          "El lidio dominante es el modo 2 de la menor melódica y sirve para un acorde de séptima de dominante con #11",
          "El lidio dominante es el modo 6 de la menor melódica y sirve para un acorde de séptima de dominante con #11",
          "El lidio dominante es el modo 7 de la menor melódica y sirve para un acorde de séptima de dominante con #11",
        ],
        [
          'La escala menor melódica del jazz eleva la 6.ª y la 7.ª de la menor natural, tanto al subir como al bajar',
          'La escala menor melódica del jazz desciende tanto el 6.º como el 7.º grado, lo que la convierte simplemente en la escala menor natural',
          'La escala menor melódica del jazz tiene la tercera y la séptima descendidas',
          'La escala menor melódica del jazz eleva solo la 7.ª de la menor natural, como la menor armónica',
        ],
        [
          'El locrio con 2.ª natural es el modo 6 de la menor melódica y sirve para el acorde semidisminuido (m7b5)',
          "El locrio con 2.ª natural es el modo 2 de la menor melódica y sirve para el acorde semidisminuido (m7b5)",
          "El locrio con 2.ª natural es el modo 4 de la menor melódica y sirve para el acorde semidisminuido (m7b5)",
          "El locrio con 2.ª natural es el modo 7 de la menor melódica y sirve para el acorde semidisminuido (m7b5)",
        ],
      ],
    },
  ],

  // ---- l7u23m4: Modos de la Menor Armónica, Escalas Simétricas y del Mundo ----
  l7u23m4: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala de {root} {scaleType}.',
      hintTemplate:
        'Tonos enteros: solo tonos (6 notas). Frigio dominante: modo 5 de la menor armónica, 1-b2-3-4-5-b6-b7 (7). Menor armónica: menor natural con la 7.ª elevada (7). Disminuida semitono/tono: semitonos y tonos alternados (8).',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los modos de la menor armónica, las escalas simétricas y las del mundo es verdadera?',
      hintTemplate:
        'La escala menor armónica tiene un sonido "exótico" debido a la segunda aumentada. El frigio dominante (5.º modo de la menor armónica) se usa en el flamenco y la música de Oriente Medio. Las escalas simétricas repiten un solo patrón interválico. La escala menor húngara eleva el grado 4 de la menor armónica, creando dos segundas aumentadas. Las escalas de tonos enteros usan tonos enteros (dos colecciones distintas); las disminuidas alternan semitonos y tonos (ocho notas).',
      choiceSets: [
        [
          'La escala frigio dominante (1-b2-3-4-5-b6-b7) es el 5.º modo de la menor armónica',
          'La escala frigio dominante es simplemente el modo frigio normal, con la misma tercera menor',
          'El frigio dominante tiene una tercera menor',
          'El frigio dominante es una escala de tonos enteros',
        ],
        [
          'La escala menor húngara tiene dos segundas aumentadas, creando su distintivo sonido dramático',
          'La escala menor húngara es el modo 5 de la menor armónica, el frigio dominante, con una 3.ª mayor',
          'La escala menor húngara no tiene intervalos aumentados',
          'La escala menor húngara es igual a la menor melódica (6.ª y 7.ª elevadas)',
        ],
        [
          'Existen solo dos escalas de tonos enteros diferentes: en C y en Db',
          'Existen doce escalas de tonos enteros diferentes, una empezando en cada nota cromática',
          'La escala de tonos enteros tiene 7 notas',
          'Contiene una quinta justa',
        ],
        [
          'La escala disminuida alterna semitonos y tonos, lo que da 8 notas en una octava',
          'La escala disminuida alterna semitonos y tonos, lo que da 6 notas en una octava',
          'La escala disminuida alterna semitonos y tonos, lo que da 7 notas en una octava',
          'La escala disminuida alterna semitonos y tonos, lo que da 12 notas en una octava',
        ],
      ],
    },
  ],

  // ---- l7u23m5: Taxonomía Completa de Acordes ----
  l7u23m5: [
    {
      // chord_build
      promptTemplate:
        'Familias de acordes: construye un acorde de {root} {quality}, apilando terceras hasta la novena.',
      hintTemplate:
        'Apila terceras desde {root}: fundamental, tercera, quinta, séptima, novena — la tercera y la séptima definen la familia (mayor, menor o dominante).',
    },
    {
      // chord_build
      promptTemplate:
        'Familias de acordes: construye un acorde de {root} {quality}.',
      hintTemplate:
        'Menor con 7.ª mayor = tríada menor + 7.ª mayor. Aumentado con 7.ª mayor = tríada aumentada (5.ª elevada) + 7.ª mayor. Construye desde {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las familias de acordes es verdadera?',
      hintTemplate:
        'Las extensiones (9, 11, 13) implican la séptima; las notas añadidas (add9, 6) no. Los acordes sus sustituyen a la tercera. Un power chord tiene solo fundamental y quinta. Un acorde menor con séptima mayor combina una tríada menor con una séptima mayor: C-Eb-G-B.',
      choiceSets: [
        [
          'En C9, incluye la séptima Bb; en Cadd9, omite la séptima',
          'En C9, omite la séptima; en Cadd9, incluye la séptima Bb',
          'En C9, incluye la séptima B; en Cadd9, omite la séptima',
          'En C9, omite la séptima; en Cadd9, incluye la séptima B',
        ],
        [
          'Un acorde sus4 sustituye la tercera por la cuarta, por eso Csus4 es C-F-G',
          'Un acorde sus4 mantiene la tercera y añade la cuarta, por eso Csus4 es C-E-F-G',
          'Un acorde sus4 sustituye la tercera por la cuarta aumentada, por eso Csus4 es C-F#-G',
          "Un acorde sus4 sustituye la quinta por la cuarta, por eso Csus4 es C-E-F",
        ],
        [
          'Un power chord (C5) tiene solo fundamental y quinta, así que no es ni mayor ni menor',
          'Un power chord (C5) es una tríada de C mayor con la fundamental doblada, así que siempre suena mayor',
          'C5 contiene solo el 5.º grado',
          'C5 es una tríada de C menor',
        ],
        [
          'El acorde menor con 7.ª mayor sobre C contiene C-Eb-G-B',
          'El acorde menor con 7.ª mayor sobre C contiene C-E-G-Bb',
          'El acorde menor con 7.ª mayor sobre C contiene C-Eb-G-Bb',
          'El acorde menor con 7.ª mayor sobre C contiene C-E-G-B',
        ],
      ],
    },
  ],

};

export default overlay;
