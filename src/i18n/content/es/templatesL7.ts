import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 7 exercise templates
// 16 modules, ~85 generated exercises
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
        'Construye un acorde de {root} {quality}. Selecciona todas las notas necesarias para este acorde con extensiones.',
      hintTemplate:
        'Las extensiones de jazz apilan terceras por encima de la séptima: novena = segunda una octava arriba, undécima = cuarta arriba, decimotercera = sexta arriba. Construye a partir de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Descifra este cifrado jazz.',
      hintTemplate:
        'Cifrado jazz: triángulo/maj7 = séptima mayor, - o m = menor, 7 = dominante, ° = disminuido, ø = semidisminuido, + = aumentado, sus = suspendido.',
      choiceSets: [
        [
          'C13 implica un acorde de séptima dominante con novena, undécima (generalmente omitida) y decimotercera añadidas',
          'C13 tiene solo fundamental y decimotercera',
          'C13 es un acorde de séptima mayor',
          'C13 implica un acorde menor',
        ],
        [
          'Cmin7(b5) es lo mismo que Cø (Do semidisminuido)',
          'Cmin7(b5) es un acorde totalmente disminuido',
          'Cmin7(b5) es un acorde de séptima menor',
          'La b5 lo convierte en un acorde aumentado',
        ],
        [
          'C7(#9) es un acorde dominante con novena aumentada, frecuentemente llamado el "acorde de Hendrix"',
          'C7(#9) es un acorde de séptima mayor',
          'La #9 significa que la novena se eleva por encima de una novena mayor',
          'C7(#9) no tiene séptima',
        ],
      ],
    },
  ],

  // ---- l7u21m2: Voicings de Shell ----
  l7u21m2: [
    {
      // multiple_choice — el EN es una pregunta de opción múltiple, no un chord_build
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
        'En una ii-V-I, la tercera de un acorde se convierte en la séptima del siguiente y viceversa. Esta eficiencia en la conducción de voces se denomina líneas de notas guía.',
      choiceSets: [
        [
          'Las notas guía (terceras y séptimas) se enlazan suavemente por grado conjunto entre acordes en una ii-V-I',
          'Los voicings de shell requieren grandes saltos entre acordes',
          'Las notas guía son la fundamental y la quinta',
          'La conducción de voces no importa en el jazz',
        ],
        [
          'La tercera del ii se convierte en la séptima del V, y la séptima del ii se convierte en la tercera del V',
          'Todas las notas se mantienen iguales entre ii y V',
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
        'Analiza la progresión ii-V-I en este contexto.',
      hintTemplate:
        'ii-V-I en mayor: m7 → dom7 → maj7. En menor: m7b5 → dom7(b9) → m(maj7). Esta es la columna vertebral de la armonía jazz.',
      choiceSets: [
        [
          'En tonalidades menores, el acorde ii es semidisminuido (m7b5)',
          'En tonalidades menores, el acorde ii es un m7',
          'Las tonalidades menores no usan ii-V-I',
          'El ii en menor es un maj7',
        ],
        [
          'La ii-V-I puede usarse para tonicizar cualquier acorde, creando centros tonales transitorios',
          'La ii-V-I solo funciona en la tonalidad principal',
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
        'Construye la sustitución tritonal para el acorde dominante 7 sobre {root}. Sustitúyelo por un dom7 a un tritono de distancia.',
      hintTemplate:
        'La sustitución tritonal sustituye un dom7 por otro dom7 cuya fundamental está a un tritono (6 semitonos) de distancia. Ambos comparten las mismas notas guía (la tercera y la séptima se intercambian).',
    },
    {
      // multiple_choice
      promptTemplate:
        'Explica por qué funciona la sustitución tritonal.',
      hintTemplate:
        'Dos dom7 a un tritono de distancia comparten el mismo intervalo de tritono (la tercera y la séptima se intercambian). Esto crea movimiento cromático del bajo: bII7 → I en lugar de V7 → I.',
      choiceSets: [
        [
          'La tercera y la séptima del V7 original se convierten en la séptima y la tercera de la sustitución tritonal',
          'Las sustituciones tritonales comparten la misma fundamental',
          'Los dos acordes no comparten notas comunes',
          'Las sustituciones tritonales solo funcionan en tonalidades menores',
        ],
        [
          'La sustitución tritonal crea una línea cromática de bajo: bII → I (resolución por semitono)',
          'El bajo se mueve por un tono',
          'El bajo salta siempre una quinta',
          'El movimiento del bajo es el mismo que V-I',
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
          'El blues básico de 12 compases usa I7, IV7 y V7 como acordes primarios',
          'El blues de 12 compases usa solo acordes de séptima mayor',
          'El blues de 12 compases tiene 16 compases',
          'La forma de blues usa solo el acorde I',
        ],
        [
          'El jazz blues añade frecuentemente una ii-V en el compás 4 (apuntando a IV7) y en los compases 9-10 (apuntando a I)',
          'El jazz blues elimina todos los acordes dominantes',
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
          'La sección A de los rhythm changes se construye sobre turnarounds I-vi-ii-V en Sib mayor',
          'Los rhythm changes usan la forma de blues de 12 compases',
          'La sección A está en Do mayor',
          'Los rhythm changes no tienen tonalidad estándar',
        ],
        [
          'El puente de los rhythm changes usa un ciclo de acordes de séptima dominante descendiendo por quintas',
          'El puente se mantiene en un solo acorde',
          'El puente usa acordes m7',
          'El puente es idéntico a la sección A',
        ],
        [
          'La forma de los rhythm changes es AABA, con un total de 32 compases',
          'Los rhythm changes tienen 12 compases',
          'Los rhythm changes tienen forma ABAB',
          'Los rhythm changes no tienen forma fija',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 22: Armonía Modal y Pop
  // =========================================================================

  // ---- l7u22m1: Escalas Modales y Características ----
  l7u22m1: [
    {
      // scale_build — 'el modo X de {root}': {scaleType} renderiza nombres
      // masculinos (dórico, lidio...) que no concuerdan con 'la escala'
      promptTemplate:
        'Construye el modo {scaleType} de {root}.',
      hintTemplate:
        'Los modos: jónico (mayor), dórico (b3, b7), frigio (b2, b3, b6, b7), lidio (#4), mixolidio (b7), eólico (menor natural), locrio (b2, b3, b5, b6, b7).',
    },
  ],

  // ---- l7u22m2: Armonía Modal y Vamps ----
  l7u22m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica el acorde o vamp característico que establece este modo.',
      hintTemplate:
        'Cada modo tiene una nota característica que lo distingue. Dórico: sexta natural. Frigio: b2. Lidio: #4. Mixolidio: b7. Los vamps modales enfatizan estas notas.',
      choiceSets: [
        [
          'El dórico se distingue del menor natural por su sexta elevada (natural)',
          'El dórico tiene una séptima elevada',
          'El dórico tiene una cuarta descendida',
          'El dórico es idéntico al menor natural',
        ],
        [
          'El lidio se distingue del mayor por su cuarta elevada (#4)',
          'El lidio tiene una séptima descendida',
          'El lidio tiene una tercera descendida',
          'El lidio es idéntico al mayor',
        ],
        [
          'Un vamp en Re dórico (Dm7 - G7) enfatiza la sexta natural (Si natural sobre Re)',
          'Re dórico usa Sib',
          'Los vamps en Re dórico usan solo un acorde',
          'Los vamps dóricos evitan el 6.º grado',
        ],
        [
          'El frigio se caracteriza por el intervalo de b2, dándole un sabor español/flamenco',
          'El frigio suena idéntico al mayor',
          'El frigio tiene una cuarta elevada',
          'El frigio es el modo más brillante',
        ],
      ],
    },
  ],

  // ---- l7u22m3: Intercambio Modal en el Pop ----
  l7u22m3: [
    {
      // chord_build
      promptTemplate:
        'Construye una tríada {quality} sobre {root} — un acorde que la música pop toma prestado de un modo paralelo.',
      hintTemplate:
        'La música pop toma prestados frecuentemente acordes de modos paralelos: bVII del mixolidio, bIII del dórico/menor, iv del eólico. Construye una tríada {quality} sobre {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica la mezcla modal usada en esta progresión pop.',
      hintTemplate:
        'Mezcla modal común en el pop: I - bVII - IV (bVII mixolidio), I - bVI - bVII (bVI y bVII eólicos), I - iv (iv eólico).',
      choiceSets: [
        [
          'El acorde bVII en una tonalidad mayor se toma prestado del modo mixolidio',
          'bVII proviene del modo lidio',
          'bVII es un acorde diatónico en mayor',
          'bVII se toma prestado del locrio',
        ],
        [
          'El acorde iv en una tonalidad mayor se toma prestado del paralelo menor (eólico)',
          'iv es diatónico en tonalidades mayores',
          'iv se toma prestado del lidio',
          'iv no existe como acorde prestado',
        ],
      ],
    },
  ],

  // ---- l7u22m4: Progresiones Pop (Números de Nashville) ----
  l7u22m4: [
    {
      // multiple_choice
      promptTemplate:
        'Analiza esta progresión pop común.',
      hintTemplate:
        'Sistema de números de Nashville usa grados de la escala: 1=I, 4=IV, 5=V, 6m=vi. Comunes: 1-5-6m-4, 1-4-5-1, 6m-4-1-5.',
      choiceSets: [
        [
          'I-V-vi-IV es la progresión pop más común, usada en cientos de canciones',
          'I-V-vi-IV es exclusiva de la música clásica',
          'Esta progresión se usa raramente en el pop',
          'I-V-vi-IV suena siempre igual en todas las tonalidades',
        ],
        [
          'vi-IV-I-V es la rotación "sensible" de la misma progresión I-V-vi-IV',
          'vi-IV-I-V es una progresión completamente diferente',
          'vi-IV-I-V no funciona como progresión pop',
          'Empezar en el vi la convierte en una progresión en tonalidad menor',
        ],
        [
          'El sistema de números de Nashville representa acordes por número de grado de la escala para transposición fácil',
          'Los números de Nashville representan alturas específicas',
          'Los números de Nashville son solo para música country',
          'Los números de Nashville sustituyen la notación tradicional por completo',
        ],
      ],
    },
  ],

  // ---- l7u22m5: Planing y Armonía Cuartal ----
  l7u22m5: [
    {
      // multiple_choice
      promptTemplate:
        'Describe esta técnica armónica usada en contextos modernos y de jazz.',
      hintTemplate:
        'Planing: mover una forma de acorde en paralelo (diatónico o cromático). Armonía cuartal: acordes construidos de cuartas apiladas en lugar de terceras, comunes en el jazz y la música modal.',
      choiceSets: [
        [
          'La armonía cuartal apila cuartas justas en lugar de terceras, creando un sonido abierto y ambiguo',
          'La armonía cuartal usa solo terceras mayores',
          'La armonía cuartal es lo mismo que la armonía triádica tradicional',
          'Los acordes cuartales son siempre disonantes',
        ],
        [
          'El planing (paralelismo) mueve un voicing hacia arriba o hacia abajo manteniendo los mismos intervalos',
          'El planing usa siempre movimiento contrario',
          'El planing está prohibido en todos los estilos musicales',
          'El planing altera la cualidad del acorde en cada paso',
        ],
        [
          'El planing diatónico mantiene todas las notas dentro de la tonalidad; el planing cromático mantiene los intervalos exactos',
          'El planing diatónico y cromático son idénticos',
          'El planing cromático se mantiene dentro de una tonalidad',
          'El planing diatónico usa las 12 notas cromáticas',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 23: Taxonomía de Escalas y Acordes
  // =========================================================================

  // ---- l7u23m1: Escalas Pentatónicas y Blues ----
  l7u23m1: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala de {root} {scaleType}.',
      hintTemplate:
        'Pentatónica mayor: 1-2-3-5-6 (5 notas). Pentatónica menor: 1-b3-4-5-b7 (5 notas). Blues: 1-b3-4-b5-5-b7 (6 notas). Construye a partir de {root}.',
    },
  ],

  // ---- l7u23m2: Escalas Simétricas ----
  l7u23m2: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala de {root} {scaleType}.',
      hintTemplate:
        'Tonos enteros: todos los tonos (6 notas). Cromática: todos los semitonos (12 notas). Son escalas simétricas — suenan igual a partir de cualquier nota inicial dentro de la escala.',
    },
  ],

  // ---- l7u23m3: Escalas Bebop y Jazz ----
  l7u23m3: [
    {
      // scale_build — 'el modo X de {root}': {scaleType} renderiza nombres
      // masculinos (dórico, mixolidio) que no concuerdan con 'la escala'
      promptTemplate:
        'Construye el modo {scaleType} de {root}.',
      hintTemplate:
        'Dórico: 1-2-b3-4-5-6-b7 (7 notas). Mixolidio: 1-2-3-4-5-6-b7 (7 notas). Estos modos son la base de muchas improvisaciones jazz.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Qué escala funciona mejor sobre este tipo de acorde?',
      hintTemplate:
        'm7 → dórico. dom7 → mixolidio. maj7 → jónico o lidio. m7b5 → locrio. dim7 → disminuida (TsT). dom alt → escala alterada.',
      choiceSets: [
        [
          'El dórico es la elección de escala primaria para acordes m7 en el jazz',
          'El jónico es la elección estándar para acordes m7',
          'El locrio se usa sobre acordes m7',
          'El lidio es la elección estándar para acordes m7',
        ],
        [
          'El mixolidio es la elección de escala primaria para acordes de séptima dominante',
          'El dórico se usa sobre acordes de séptima dominante',
          'El eólico es la elección estándar para acordes de séptima dominante',
          'El frigio es la elección estándar para acordes de séptima dominante',
        ],
      ],
    },
  ],

  // ---- l7u23m4: Teoría Acorde-Escala ----
  l7u23m4: [
    {
      // multiple_choice
      promptTemplate:
        'Empareja el tipo de acorde con su escala primaria en la teoría acorde-escala.',
      hintTemplate:
        'Teoría acorde-escala: cada acorde tiene una escala madre. Las notas a evitar son semitonos por encima de las notas del acorde. La escala colorea el acorde con tensiones disponibles.',
      choiceSets: [
        [
          'El lidio se prefiere frecuentemente al jónico para acordes maj7 porque no tiene notas a evitar',
          'El jónico no tiene notas a evitar sobre maj7',
          'El locrio se prefiere para acordes maj7',
          'Las notas a evitar son irrelevantes en la teoría acorde-escala',
        ],
        [
          'Una "nota a evitar" es un grado de la escala que choca (está a un semitono por encima) con una nota del acorde',
          'Una nota a evitar es cualquier nota que no está en el acorde',
          'Las notas a evitar crean consonancia',
          'No existen notas a evitar en ninguna escala',
        ],
        [
          'El locrio es la escala primaria para acordes semidisminuidos (m7b5)',
          'El dórico se usa para acordes semidisminuidos',
          'El mixolidio se usa para acordes semidisminuidos',
          'Los acordes semidisminuidos no tienen escala asociada',
        ],
      ],
    },
  ],

  // ---- l7u23m5: Escalas Exóticas y No Occidentales ----
  l7u23m5: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica esta escala o su contexto cultural.',
      hintTemplate:
        'La menor armónica tiene un sonido "exótico" debido a la segunda aumentada. El frigio dominante (5.º modo de la menor armónica) se usa en el flamenco y la música de Oriente Medio.',
      choiceSets: [
        [
          'La escala frigio dominante (1-b2-3-4-5-b6-b7) es el 5.º modo de la menor armónica',
          'El frigio dominante es igual al frigio normal',
          'El frigio dominante tiene una tercera menor',
          'El frigio dominante es una escala de tonos enteros',
        ],
        [
          'La escala húngara menor tiene dos segundas aumentadas, creando su distintivo sonido dramático',
          'La húngara menor es idéntica al menor natural',
          'La húngara menor no tiene intervalos aumentados',
          'La húngara menor es igual a la menor melódica',
        ],
        [
          'La escala japonesa Hirajoshi es una escala de 5 notas con una cualidad menor distintiva',
          'La Hirajoshi es una escala de 7 notas',
          'La Hirajoshi es idéntica a la escala mayor occidental',
          'La Hirajoshi usa cuartos de tono',
        ],
      ],
    },
  ],
};

export default overlay;
