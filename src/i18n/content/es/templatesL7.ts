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
        'Cifrado jazz: triángulo/maj7 = séptima mayor, - o m = menor, 7 = dominante, ° = disminuido, ø = semidisminuido, + = aumentado, sus = suspendido.',
      choiceSets: [
        [
          'C13 implica un acorde de séptima dominante con novena, undécima (normalmente omitida) y decimotercera',
          'C13 tiene solo fundamental y decimotercera',
          'C13 es una tríada de C mayor con solo la decimotercera (A) añadida encima, sin ninguna séptima en todo el acorde',
          'C13 implica un acorde menor con séptima, porque la decimotercera baja un semitono la tercera del acorde',
        ],
        [
          'Cmin7(b5) es lo mismo que Cø (C semidisminuido)',
          'Cmin7(b5) es un acorde de séptima disminuida completo, exactamente el mismo acorde que Cdim7 (C°7)',
          'Cmin7(b5) es un acorde de séptima menor',
          'La b5 lo convierte en un acorde aumentado',
        ],
        [
          'C7(#9) siempre es un acorde dominante con novena aumentada, frecuentemente llamado el "acorde de Hendrix"',
          'C7(#9) es un acorde de séptima mayor',
          'En C7(#9) la novena aumentada (D#) sustituye a la tercera mayor, así que el acorde no tiene ningún E',
          'C7(#9) no tiene séptima',
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
          'Cmaj7 completo: C, E, G, B',
          'Cmaj7 sin la tercera: C, G, B',
          'Cmaj7 sin la séptima: C, E, G',
        ],
        [
          'Shell de Dm7: D, F, C',
          'Dm7 completo: D, F, A, C',
          'Dm7 sin la tercera: D, A, C',
          'Dm7 sin la séptima: D, F, A',
        ],
        [
          'Shell de G7: G, B, F',
          'G7 completo: G, B, D, F',
          'G7 sin la tercera: G, D, F',
          'G7 sin la séptima: G, B, D',
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
          'E7 completo: E, G#, B, D',
          'E7 sin la tercera: E, B, D',
          'E7 sin la séptima: E, G#, B',
        ],
        [
          'Shell de Bbmaj7: Bb, D, A',
          'Bbmaj7 completo: Bb, D, F, A',
          'Bbmaj7 sin la tercera: Bb, F, A',
          'Bbmaj7 sin la séptima: Bb, D, F',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cómo se enlazan los voicings de shell en un contexto jazz?',
      hintTemplate:
        'En una ii-V-I, la tercera del ii se mantiene como séptima del V, mientras la séptima del ii baja un semitono a la tercera del V (y lo mismo vuelve a ocurrir del V al I). Esta eficiencia en la conducción de voces se denomina líneas de notas guía.',
      choiceSets: [
        [
          'Las notas guía (terceras y séptimas) siempre se mueven por grado conjunto o se mantienen entre acordes en una ii-V-I',
          'Los voicings de shell requieren grandes saltos entre acordes',
          'Los voicings de shell mueven todas las voces por grandes saltos, porque las notas guía (tercera y séptima) nunca se mantienen de acorde en acorde',
          'La conducción de voces no importa en el jazz',
        ],
        [
          'La tercera del ii se mantiene como séptima del V, y la séptima del ii baja un semitono a la tercera del V',
          'Todas las notas del ii siguen iguales en el V, así que el voicing de shell nunca se mueve',
          'La fundamental del ii se convierte en la fundamental del V',
          'No existe enlace en la conducción de voces entre ii y V',
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
        'Un ii7 es un acorde de séptima menor sobre {root}: fundamental + 3.ª menor + 5.ª justa + 7.ª menor. En el jazz, la ii-V-I es la progresión más fundamental.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la progresión ii-V-I es verdadera?',
      hintTemplate:
        'ii-V-I en mayor: m7 → dom7 → maj7. En menor: m7b5 → dom7(b9) → m(maj7). Esta es la columna vertebral de la armonía jazz.',
      choiceSets: [
        [
          'En tonalidades menores, el acorde ii es semidisminuido (m7b5)',
          'En tonalidades menores, el acorde ii es un acorde de séptima de dominante',
          'Las tonalidades menores no usan ii-V-I',
          'En tonalidades menores, el acorde ii es un acorde de séptima mayor (maj7), construido sobre el 2.º grado elevado',
        ],
        [
          'La ii-V-I puede usarse para tonicizar cualquier acorde, creando centros tonales transitorios',
          'La ii-V-I solo funciona en la tonalidad principal, nunca en otra tonalidad',
          'La ii-V-I no puede crear tonicización',
          'Solo V-I crea tonicización en el jazz',
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
          'La tercera y la séptima del V7 original siempre se convierten en la séptima y la tercera de la sustitución tritonal',
          'Las sustituciones tritonales comparten la misma fundamental',
          'Los dos acordes dominantes no comparten ninguna nota, así que las notas guía originales desaparecen',
          'Las sustituciones tritonales solo funcionan en tonalidades menores',
        ],
        [
          'La sustitución tritonal crea una línea de bajo cromática que baja un semitono de bII a I',
          'El bajo se mueve por un tono entero, lo que suaviza la llegada a la tónica',
          'El bajo del sustituto sigue bajando una 5.ª justa hasta la tónica, exactamente igual que en V7-I',
          'El movimiento del bajo es el mismo que V-I, porque el sustituto mantiene la fundamental original en el bajo',
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
          'El blues básico de 12 compases usa solo I7, IV7 y V7',
          'El blues básico de 12 compases usa solo acordes de séptima mayor: Imaj7, IVmaj7 y Vmaj7 de principio a fin',
          'El blues de 12 compases tiene 16 compases',
          'La forma de blues se queda en el acorde I durante los 12 compases y nunca pasa a IV o V',
        ],
        [
          'El jazz blues añade frecuentemente una ii-V en el compás 4 que lleva a IV7, y otra en los compases 9-10 que lleva a I',
          'El jazz blues elimina de los 12 compases todos los acordes de séptima de dominante (I7, IV7 y V7) y toca solo un vamp menor',
          'El jazz blues nunca modifica la forma básica',
          'El jazz blues usa los mismos acordes del blues básico',
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
        'Rhythm changes (de Gershwin): forma AABA, 32 compases. Secciones A: turnarounds I-vi-ii-V. Puente: III7-VI7-II7-V7 (ciclo de dominantes).',
      choiceSets: [
        [
          'La sección A de los rhythm changes se construye sobre turnarounds I-vi-ii-V en Bb mayor',
          'Los rhythm changes siguen la forma de blues de 12 compases, con el turnaround escuchado solo en el último compás',
          'La sección A está en C mayor, y el puente pasa siempre a la tonalidad de su relativa menor',
          'Los rhythm changes no tienen tonalidad estándar, así que cada sección A pasa a una nueva tonalidad elegida por el solista',
        ],
        [
          'El puente de los rhythm changes usa un ciclo de acordes de séptima dominante descendiendo por quintas',
          'El puente se mantiene en un solo acorde',
          'El puente de los rhythm changes se queda en un único acorde de séptima menor durante sus ocho compases',
          'El puente es idéntico a la sección A: repite los mismos turnarounds I-vi-ii-V, nota por nota, en la misma tonalidad',
        ],
        [
          'La forma de los rhythm changes es AABA, con un total de 32 compases',
          'Los rhythm changes tienen 12 compases',
          'Los rhythm changes son una forma de 12 compases que alterna dos coros de blues (ABAB)',
          'Los rhythm changes no tienen forma fija: cada banda decide la duración y el orden de las secciones',
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
          'El mixolidio es la elección de escala primaria para acordes de séptima dominante',
          'El dórico se usa sobre acordes de séptima dominante',
          'El eólico es la elección estándar sobre un acorde de séptima dominante, porque su b3 encaja con la tercera del acorde',
          'El frigio es la elección estándar para acordes de séptima dominante',
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
          'El locrio o el locrio con 2.ª natural, modo 6 de la menor melódica, sirve para acordes semidisminuidos m7b5',
          'El dórico es la escala de los acordes semidisminuidos (m7b5), porque su sexta natural coincide con la b5 del acorde, nota a nota',
          'El mixolidio se usa para los acordes semidisminuidos, ya que su b7 coincide con la séptima menor de esos acordes',
          'Los acordes semidisminuidos no tienen ninguna escala asociada, así que los improvisadores solo pueden usar las notas del acorde',
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
        'Una tríada de estructura superior va sobre el shell de la dominante (fundamental, tercera, b7); nombra sus notas por su intervalo sobre el bajo. La rearmonización cambia acordes por otros que siguen sosteniendo la melodía, a menudo dentro de la misma función.',
      choiceSets: [
        [
          'Una tríada de D mayor sobre C7 aporta la novena, la #11 y la decimotercera (el sonido de C13#11)',
          'Una tríada de D mayor sobre C7 aporta la b9, la #9 y la b13',
          'Una tríada de D mayor sobre C7 solo dobla la fundamental, la tercera y la quinta del acorde, así que no añade ningún color',
          'Una tríada de D mayor sobre C7 lo convierte en un acorde menor',
        ],
        [
          'En C mayor, Em7 puede sustituir a Cmaj7: comparten E, G y B y ambos tienen función de tónica',
          'En C mayor, G7 puede sustituir a Cmaj7 porque ambos acordes tienen función de tónica y comparten todas sus notas',
          'Em7 y Cmaj7 no comparten ninguna nota, así que cambiar un acorde por el otro cambiaría siempre la función de la armonía',
          'Solo el V7 puede sustituir a un acorde de tónica',
        ],
        [
          'La rearmonización sustituye los acordes bajo una melodía por otros que siguen sosteniendo sus notas',
          'La rearmonización reescribe las notas de la melodía para que encajen en los acordes que el tema ya tenía, dejando la armonía intacta',
          'La rearmonización significa transportar un tema a otra tonalidad, lo que mantiene todas las funciones de los acordes',
          'La rearmonización elimina todos los acordes, dejando la melodía para cantarla o tocarla sin ningún acompañamiento',
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
          'Tres centros tonales a una 3.ª mayor de distancia dividen la octava en tres partes iguales',
          'Tres centros tonales a una 3.ª mayor de distancia dividen la octava en cuatro partes iguales, como un acorde de séptima disminuida',
          'Forman una escala mayor',
          'Nunca regresan a la primera tonalidad y pasan a un nuevo centro tonal cada vez que el tema se repite',
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
          'El dórico se distingue del menor natural por su sexta elevada',
          'El dórico tiene una séptima elevada',
          'El dórico se distingue del menor natural por un 7.º grado elevado, que le da una sensible',
          'El dórico es idéntico al menor natural sobre la misma tónica, así que los dos nombres describen exactamente las mismas siete notas',
        ],
        [
          'El lidio se distingue del mayor por su cuarta elevada (#4)',
          'El lidio se distingue del mayor por su 7.º grado descendido (b7), la nota que añade el mixolidio',
          'El lidio tiene una tercera descendida',
          'El lidio es idéntico al mayor: construidas sobre la misma tónica, las dos escalas contienen exactamente las mismas notas',
        ],
        [
          'Un vamp en D dórico (Dm7 - G7) enfatiza la sexta natural (B natural sobre D)',
          'Un vamp en D dórico (Dm7 - Gm7) enfatiza el Bb, la sexta descendida que da su color al D dórico',
          'Los vamps en D dórico usan solo un acorde',
          'Los vamps dóricos evitan el 6.º grado, porque esa nota convertiría el D dórico en D mayor',
        ],
        [
          'El frigio se caracteriza por el intervalo de b2, dándole un sabor español/flamenco',
          'El frigio suena idéntico al mayor, ya que ambos modos suenan brillantes y resuelven de la misma manera',
          'El frigio se caracteriza por su cuarta elevada, que lo convierte en el más brillante de todos los modos',
          'El frigio no tiene b2',
        ],
      ],
    },
  ],

  // ---- l7u22m5: Planing y Armonía Cuartal ----
  l7u22m5: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la armonía cuartal y el planing es verdadera?',
      hintTemplate:
        'Planing: mover una forma de acorde en paralelo (diatónico o cromático). Armonía cuartal: acordes construidos de cuartas apiladas en lugar de terceras, comunes en el jazz y la música modal.',
      choiceSets: [
        [
          'La armonía cuartal apila cuartas justas en lugar de terceras, creando un sonido abierto y ambiguo',
          'La armonía cuartal apila solo terceras mayores, lo que la hace sonar exactamente como las tríadas tradicionales',
          'La armonía cuartal es lo mismo que la armonía triádica tradicional',
          'Los acordes cuartales son siempre disonantes',
        ],
        [
          'El planing mueve una forma de acorde entera hacia arriba o hacia abajo con todas las voces en paralelo',
          'El planing mueve las voces en movimiento contrario: la voz aguda sube mientras la grave baja',
          'El planing está prohibido en todos los estilos musicales',
          'El planing altera siempre la cualidad del acorde en cada paso',
        ],
        [
          'El planing diatónico mantiene todas las notas dentro de la tonalidad; el planing cromático mantiene los intervalos exactos',
          'El planing diatónico y el cromático son la misma técnica, ya que ambos mantienen siempre todas las notas dentro de la tonalidad',
          'El planing cromático se mantiene dentro de una tonalidad',
          'El planing diatónico usa las 12 notas cromáticas',
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
          'I-V-vi-IV es una de las progresiones pop más comunes y se usa en cientos de canciones de éxito',
          'I-V-vi-IV pertenece a la escritura de corales clásicos y casi nunca se oye en canciones pop',
          'Esta progresión se usa raramente en el pop',
          'I-V-vi-IV suena siempre igual en todas las tonalidades',
        ],
        [
          'vi-IV-I-V es la rotación "sensible" de la misma progresión I-V-vi-IV',
          'vi-IV-I-V no comparte acordes con I-V-vi-IV',
          'vi-IV-I-V no funciona como progresión pop',
          'Empezar en el vi cambia la cualidad de los cuatro acordes',
        ],
        [
          'El sistema de números de Nashville representa acordes por número de grado de la escala para transposición fácil',
          'Los números de Nashville designan alturas fijas, así que una partitura escrita como 1-4-5 solo puede tocarse en C mayor',
          'Los números de Nashville son solo para música country',
          'Los números de Nashville sustituyen la notación tradicional por completo, así que los músicos de sesión nunca vuelven a leer un pentagrama ni un cifrado',
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
        'En {key} mayor, construye el acorde ♭VII tomado prestado del menor paralelo.',
      hintTemplate:
        'El menor paralelo ({key} menor) presta su ♭VII a {key} mayor: la tríada mayor sobre {root}.',
    },
    {
      // chord_build
      promptTemplate:
        'En {key} mayor, construye el acorde ♭VI tomado prestado del menor paralelo.',
      hintTemplate:
        'El menor paralelo ({key} menor) presta su ♭VI a {key} mayor: la tríada mayor sobre {root}.',
    },
    {
      // chord_build
      promptTemplate:
        'En {key} mayor, construye el acorde iv tomado prestado del menor paralelo.',
      hintTemplate:
        'El menor paralelo ({key} menor) presta su iv a {key} mayor: la tríada menor sobre {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre acordes prestados y mediantes cromáticas en el pop es verdadera?',
      hintTemplate:
        'Préstamos comunes en el pop: iv, bVI y bVII del menor paralelo (bVII es también el acorde mixolidio). Mediantes cromáticas: fundamentales a una 3.ª de distancia, con notas fuera de la tonalidad.',
      choiceSets: [
        [
          'El acorde bVII en una tonalidad mayor se toma prestado del menor paralelo (o del mixolidio)',
          'El acorde bVII se toma prestado del lidio, que es el único modo con el 7.º grado descendido un semitono',
          'bVII es un acorde diatónico en mayor',
          'bVII se toma prestado del locrio',
        ],
        [
          'El acorde iv en una tonalidad mayor se toma prestado del paralelo menor (eólico)',
          'El acorde iv es diatónico en una tonalidad mayor, porque el 4.º grado de una escala mayor tiene una tríada menor',
          'iv se toma prestado del lidio',
          'iv no existe como acorde prestado',
        ],
        [
          'La "cadencia Mario" bVI-bVII-I usa dos acordes tomados prestados del menor paralelo',
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
        'Numera los modos de C menor melódica (C D Eb F G A B) desde cada nota: el modo 4 empieza en F (lidio dominante), el modo 6 en A (locrio con 2.ª natural), el modo 7 en B (alterada).',
      choiceSets: [
        [
          'La escala alterada es el modo 7 de la menor melódica: G alterada tiene las notas de Ab menor melódica',
          'La escala alterada es el modo 7 de la menor armónica: G alterada tiene exactamente las notas de C menor armónica',
          'La escala alterada no tiene notas alteradas',
          'G alterada es G mayor',
        ],
        [
          'El lidio dominante es el modo 4 de la menor melódica y sirve para un acorde de séptima de dominante con #11',
          'El lidio dominante es el modo 4 de la escala mayor, así que sirve para un acorde maj7 con la cuarta natural (sin #11)',
          'El lidio dominante tiene una séptima mayor',
          'El lidio dominante sirve para acordes menores',
        ],
        [
          'La escala menor melódica del jazz eleva la 6.ª y la 7.ª de la menor natural, tanto al subir como al bajar',
          'La escala menor melódica del jazz desciende tanto el 6.º como el 7.º grado, lo que la convierte simplemente en la escala menor natural',
          'Tiene la tercera y la séptima descendidas',
          'Es una escala pentatónica',
        ],
        [
          'El locrio con 2.ª natural es el modo 6 de la menor melódica y sirve para el acorde semidisminuido (m7b5)',
          'El locrio con 2.ª natural es el modo 2 de la menor melódica y sirve para el acorde de 7.ª disminuida completo (dim7)',
          'El locrio con 2.ª natural tiene una quinta justa',
          'Sirve para un acorde maj7',
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
        'La escala menor armónica tiene un sonido "exótico" debido a la segunda aumentada. El frigio dominante (5.º modo de la menor armónica) se usa en el flamenco y la música de Oriente Medio. Las escalas simétricas repiten un solo patrón interválico.',
      choiceSets: [
        [
          'La escala frigio dominante (1-b2-3-4-5-b6-b7) es el 5.º modo de la menor armónica',
          'La escala frigio dominante es simplemente el modo frigio normal, con la misma tercera menor',
          'El frigio dominante tiene una tercera menor',
          'El frigio dominante es una escala de tonos enteros',
        ],
        [
          'La escala húngara menor tiene dos segundas aumentadas, creando su distintivo sonido dramático',
          'La escala húngara menor no tiene ninguna segunda aumentada: es solo la escala menor natural con otro nombre',
          'La húngara menor no tiene intervalos aumentados',
          'La húngara menor es igual a la menor melódica',
        ],
        [
          'Existen solo dos escalas de tonos enteros diferentes: en C y en Db',
          'Existen doce escalas de tonos enteros diferentes, una empezando en cada nota cromática',
          'La escala de tonos enteros tiene 7 notas',
          'Contiene una quinta justa',
        ],
        [
          'La escala disminuida alterna semitonos y tonos, lo que da 8 notas en una octava',
          'La escala disminuida alterna tonos y terceras menores, lo que le da 7 notas, como la escala mayor',
          'Es una escala pentatónica',
          'No tiene semitonos',
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
        'Menor con 7.ª M = tríada menor + 7.ª mayor. Aumentado con 7.ª M = tríada aumentada (5.ª elevada) + 7.ª mayor. Construye desde {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las familias de acordes es verdadera?',
      hintTemplate:
        'Las extensiones (9, 11, 13) implican la séptima; las notas añadidas (add9, 6) no. Los acordes sus sustituyen a la tercera. Un power chord tiene solo fundamental y quinta.',
      choiceSets: [
        [
          'Una extensión implica la séptima: C9 contiene Bb, mientras que Cadd9 no tiene ninguna séptima',
          'Cadd9 y C9 son el mismo acorde, porque una novena añadida siempre trae consigo la séptima de dominante',
          'C9 no tiene tercera',
          'Cadd9 contiene B',
        ],
        [
          'Un acorde sus4 sustituye la tercera por la cuarta, así que Csus4 es C-F-G',
          'Un acorde sus4 mantiene la tercera y añade la cuarta encima, así que Csus4 se escribe C-E-F-G',
          'Csus4 es C-Eb-G',
          'Csus4 es un acorde menor',
        ],
        [
          'Un power chord (C5) tiene solo fundamental y quinta, así que no es ni mayor ni menor',
          'Un power chord (C5) es una tríada de C mayor con la fundamental doblada, así que siempre suena mayor',
          'C5 contiene solo el 5.º grado',
          'C5 es una tríada de C menor',
        ],
        [
          'El acorde menor con 7.ª mayor es una tríada menor con séptima mayor: C-Eb-G-B',
          'El acorde menor con 7.ª mayor es una tríada mayor con séptima menor, o sea, la séptima de dominante C-E-G-Bb',
          'El acorde menor con 7.ª mayor tiene una séptima menor, así que es el mismo acorde que Cm7',
          'El acorde menor con 7.ª mayor es C-E-G#-B, una tríada aumentada con séptima mayor',
        ],
      ],
    },
  ],

};

export default overlay;
