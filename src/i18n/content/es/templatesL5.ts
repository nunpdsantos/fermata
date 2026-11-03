import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 5 exercise templates
// Mirrors templatesL5.ts entry by entry (W4a, 2026-10-31)
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {

  // ---- l5u15m1: Secondary Dominants V/V ----
  l5u15m1: [
    {
      // chord_build
      promptTemplate:
        'Construye una tríada mayor de {root}.',
      hintTemplate:
        'Una tríada mayor: fundamental + 3.ª mayor + 5.ª justa. Esta cualidad de acorde se usa para dominantes secundarias como V/V.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre V/V es verdadera?',
      hintTemplate:
        'V/V toniciza el acorde dominante. Contiene una alteración cromática (4.º grado elevado) y resuelve hacia V.',
      choiceSets: [
        [
      'En F mayor, V/V contiene B, que resuelve en C',
      'En F mayor, V/V contiene B, que resuelve en D',
      'En F mayor, V/V contiene B, que resuelve en A',
      'En F mayor, V/V contiene B, que resuelve en F',
    ],
        [
          'En F mayor, V/V es G mayor (G–B–D) y resuelve en C mayor',
          'En F mayor, V/V es G menor (G–Bb–D) y resuelve en C mayor',
          'En F mayor, V/V es C mayor (C–E–G) y resuelve en F mayor',
          'En F mayor, V/V es C menor (C–Eb–G) y resuelve en C mayor',
        ],
      ],
    },
  ],

  // ---- l5u15m2: Secondary Dominants of ii, iii, IV, vi ----
  l5u15m2: [
    {
      // chord_build
      promptTemplate:
        'Construye un acorde de séptima de dominante en {root} (una forma muy común de dominante secundaria).',
      hintTemplate:
        'Una dominante secundaria es una tríada mayor o una séptima de dominante construida una 5.ª justa por encima del acorde que toniciza. Aquí solo construye {root}7: fundamental + 3.ª mayor + 5.ª justa + 7.ª menor. Por ejemplo, A7 (A-C#-E-G) es V7/ii en C mayor, tonicizando D menor.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las dominantes secundarias de ii, iii, IV y vi es verdadera?',
      hintTemplate:
        'Cada dominante secundaria apunta a un acorde diatónico específico. V7/ii resuelve hacia ii, V7/IV resuelve hacia IV, V7/vi resuelve hacia vi, etc.',
      choiceSets: [
        [
          'V7/vi en C mayor es E7 (E-G#-B-D), que resuelve hacia A menor',
          'V7/vi en C mayor es D7 (D-F#-A-C), que resuelve hacia G mayor',
          'V7/vi en C mayor es E7 (E-G#-B-D), que resuelve hacia F mayor',
          'V7/vi en C mayor es A7 (A-C#-E-G), que resuelve hacia D menor',
        ],
        [
          'V7/IV en E mayor es E7 (E–G#–B–D) y resuelve en A mayor',
          'V7/IV en E mayor es B7 (B–D#–F#–A) y resuelve en E mayor',
          'V7/IV en E mayor es E7 (E–G#–B–D) y resuelve en B mayor',
          'V7/IV en E mayor es F#7 (F#–A#–C#–E) y resuelve en B mayor',
        ],
        [
          'V7/ii en C mayor es A7 (A-C#-E-G), que lleva a D menor',
          'V7/ii en C mayor es B7 (B-D#-F#-A), que resuelve hacia E menor',
          'V7/ii en C mayor es A7 (A-C#-E-G), que resuelve hacia C mayor',
          'V7/ii en C mayor es D7 (D-F#-A-C), que resuelve hacia G mayor',
        ],
      ],
    },
  ],

  // ---- l5u15m3: Secondary Leading-Tone Chords ----
  l5u15m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los acordes de sensible secundaria es verdadera?',
      hintTemplate:
        'Los acordes de sensible secundaria (vii°/x) funcionan como dominantes secundarias pero son disminuidos. Resuelven un semitono arriba hacia el acorde objetivo.',
      choiceSets: [
        [
      'En G mayor, vii°7/V es C#–E–G–Bb y resuelve en D',
      'En G mayor, vii°7/V es F#–A–C–Eb y resuelve en G',
      'En G mayor, vii°7/V es C#–E–G–Bb y resuelve en C',
      'En G mayor, vii°7/V es D#–F#–A–C y resuelve en E',
    ],
        [
      "La fundamental está un semitono por debajo de la tónica a la que apunta",
      "La fundamental está un semitono por encima de la tónica a la que apunta",
      "La fundamental está un tono por debajo de la tónica a la que apunta",
      "La fundamental está un tono por encima de la tónica a la que apunta",
    ],
        [
      'Los tipos posibles son una tríada disminuida, una séptima semidisminuida o una séptima disminuida',
      'Los tipos posibles son una tríada mayor, una séptima de dominante o una séptima mayor',
      'Los tipos posibles son una tríada menor, una séptima menor o una séptima semidisminuida',
      'Los tipos posibles son una tríada mayor, una séptima semidisminuida o una séptima disminuida',
    ],
      ],
    },
  ],

  // ---- l5u15m4: Tonicization vs Modulation ----
  l5u15m4: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la tonicización y la modulación es verdadera?',
      hintTemplate:
        'La tonicización es un énfasis generalmente breve en un acorde distinto de la tónica, a menudo solo una dominante secundaria y su acorde de resolución. La modulación es un cambio más duradero hacia una nueva tonalidad, confirmado por una cadencia en esa tonalidad.',
      choiceSets: [
        [
      'La tonicización destaca brevemente un acorde; la modulación confirma una nueva tonalidad con una cadencia',
      "La tonicización confirma una nueva tonalidad con una cadencia; la modulación destaca brevemente un acorde",
      "La tonicización y la modulación confirman ambas una nueva tonalidad con una cadencia",
      "La tonicización y la modulación destacan ambas brevemente un acorde sin confirmar una nueva tonalidad",
    ],
        [
      "Una sola dominante secundaria y su objetivo son una tonicización",
      'Una sola dominante secundaria y su objetivo son una modulación',
      'Una sola dominante secundaria y su objetivo son una cadencia rota',
      'Una sola dominante secundaria y su objetivo son una cadencia plagal',
    ],
        [
      "Una modulación se confirma cuando la música hace una cadencia en la nueva tonalidad",
      "Una modulación se confirma cuando la música hace una cadencia en la tonalidad original",
      'Una modulación se confirma cuando la música regresa a la tónica original sin cadencia en la nueva tonalidad',
      'Una modulación se confirma cuando la música enfatiza brevemente un acorde sin cadencia en la nueva tonalidad',
    ],
      ],
    },
  ],

  // ---- l5u15m5: Dominant Chains ----
  l5u15m5: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las cadenas de dominantes secundarias es verdadera?',
      hintTemplate:
        'Una cadena de dominantes enlaza dominantes secundarias: p. ej., V7/vi → V7/ii → V7/V → V7 → I. Cada dominante resuelve hacia la siguiente, creando movimiento cromático en dirección a la tónica.',
      choiceSets: [
        [
          'En una cadena de dominantes, cada acorde actúa como V7 del acorde siguiente',
          'En una cadena de dominantes, cada acorde actúa como IV del acorde siguiente',
          'En una cadena de dominantes, cada acorde actúa como ii7 del acorde siguiente',
          'En una cadena de dominantes, cada acorde actúa como vi7 del acorde siguiente',
        ],
        [
      'La cadena V7/vi → V7/ii → V7/V → V → I se mueve por 5.as descendentes',
      'La cadena V7/vi → V7/ii → V7/V → V → I se mueve por 3.as descendentes',
      'La cadena V7/vi → V7/ii → V7/V → V → I se mueve por 2.as descendentes',
      'La cadena V7/vi → V7/ii → V7/V → V → I se mueve por 4.as descendentes',
    ],
        [
          'Cada dominante aplicada suele añadir una nota cromática: la sensible de su objetivo',
          "Cada dominante aplicada normalmente añade una nota cromática: la subtónica de su objetivo",
          "Cada dominante aplicada suele elevar la 5.ª para crear la sensible de su objetivo",
          "Cada dominante aplicada típicamente rebaja la 3.ª para crear la sensible de su objetivo",
        ],
      ],
    },
  ],

  // =========================================================================
  // Unit 16: Modulation
  // =========================================================================

  // ---- l5u16m1: Pivot Chord Modulation ----
  l5u16m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la modulación por acorde pivote diatónico es verdadera?',
      hintTemplate:
        'Un acorde pivote pertenece tanto a la tonalidad antigua como a la nueva. Reinterpreta un acorde diatónico: p. ej., IV en C = I en F. El pivote es la bisagra entre dos regiones tonales.',
      choiceSets: [
        [
      'De C mayor a G mayor, A menor puede servir como pivote diatónico',
      'De C mayor a G mayor, F mayor puede servir como pivote diatónico',
      'De C mayor a G mayor, Bb mayor puede servir como pivote diatónico',
      'De C mayor a G mayor, D mayor puede servir como pivote diatónico',
    ],
        [
      "De C a G, el acorde de C mayor puede servir de pivote como IV de G",
      "De C a G, el acorde de C mayor puede servir de pivote como V de G",
      "De C a G, el acorde de C mayor puede servir de pivote como ii de G",
      "De C a G, el acorde de C mayor puede servir de pivote como vi de G",
    ],
        [
          'Las tonalidades cercanas (como máximo a una alteración de distancia) comparten más acordes pivote',
          'Las tonalidades lejanas (a muchas alteraciones de distancia) comparten más acordes pivote que las cercanas',
          'Las tonalidades paralelas (la misma tónica en modos diferentes) comparten más acordes pivote que las cercanas',
          'Las tonalidades cercanas (como máximo a una alteración de distancia) no comparten acordes pivote en ninguna tonalidad',
        ],
      ],
    },
  ],

  // ---- l5u16m2: Modulation to Closely Related Keys ----
  l5u16m2: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala menor natural de {root} (la relativa menor, una tonalidad cercana).',
      hintTemplate:
        'Una tonalidad y su relativa menor comparten la misma armadura (0 alteraciones de diferencia), por lo que la relativa menor es una de las tonalidades cercanas. Construye {root} menor natural: la escala menor natural que comienza en {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las tonalidades cercanas es verdadera?',
      hintTemplate:
        'Cada tonalidad mayor tiene 5 tonalidades cercanas: la dominante, la subdominante y las relativas menores de las tres (tónica, dominante, subdominante).',
      choiceSets: [
        [
      "Las tonalidades cercanas de C mayor: G mayor, F mayor, A menor, E menor, D menor",
      'Las tonalidades cercanas de C mayor: D mayor, G mayor, B menor, E menor, F# menor',
      'Las tonalidades cercanas de C mayor: F mayor, Bb mayor, D menor, G menor, C menor',
      'Las tonalidades cercanas de C mayor: Eb mayor, Ab mayor, C menor, F menor, Bb menor',
    ],
        [
          'Las tonalidades cercanas de G mayor: D mayor, C mayor, E menor, B menor, A menor',
          'Las tonalidades cercanas de G mayor: Gb mayor, Ab mayor, G menor, Eb menor, F menor',
          'Las tonalidades cercanas de G mayor: F mayor, Bb mayor, D menor, G menor, C menor',
          'Las tonalidades cercanas de G mayor: D mayor, A mayor, E mayor, B mayor, F# mayor',
        ],
      ],
    },
  ],

  // ---- l5u16m3: Direct, Common-Tone, and Chromatic Modulation ----
  l5u16m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la modulación directa (de frase) es verdadera?',
      hintTemplate:
        'La modulación directa (de frase) cambia de tonalidad abruptamente en un límite de frase sin acorde pivote. Es habitual en la música pop y en los himnos.',
      nudgeTemplate: 'Pregúntate dónde llega la nueva tonalidad (en mitad de una frase o al empezar una frase nueva) y si algún acorde la prepara. En una modulación "truck driver", pregúntate en qué sentido se mueve la tonalidad y qué efecto tiene.',
      choiceSets: [
        [
      'Al comienzo de una nueva frase, el centro tonal cambia sin un acorde común que conecte las tonalidades',
      'Al comienzo de una nueva frase, el centro tonal cambia mediante un acorde común que conecta las tonalidades',
      'Al comienzo de una nueva frase, el centro tonal cambia gradualmente mediante una dominante preparada de la nueva tonalidad',
      'Al comienzo de una nueva frase, se toniciza brevemente un acorde mientras se mantiene la tonalidad original',
    ],
        [
          'La modulación "truck driver" sube medio tono o un tono para dar un impulso',
          'La modulación "truck driver" pasa a una nueva tonalidad mediante un acorde pivote común',
          'La modulación "truck driver" repite la frase en la misma tonalidad para dar un impulso',
          'La modulación "truck driver" baja la tonalidad medio tono o un tono para relajar la tensión',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la modulación por nota común es verdadera?',
      hintTemplate:
        'La modulación por nota común sostiene una única nota que se reinterpreta en la nueva tonalidad. Se usa frecuentemente para modulaciones distantes donde existen pocos acordes pivote.',
      choiceSets: [
        [
      'Una altura sostenida cambia de papel cuando la armonía establece una tónica diferente',
      'Una altura sostenida conserva su grado de la escala cuando la armonía establece una tónica diferente',
      'Una altura sostenida se convierte en tónica siempre que la armonía establece una tonalidad diferente',
      'Una altura sostenida se convierte en dominante siempre que la armonía establece una tonalidad diferente',
    ],
        [
          'La altura de enlace se mantiene; las tonalidades no necesitan compartir un acorde',
          'La altura de enlace cambia un semitono; las tonalidades no necesitan compartir un acorde',
          'La altura de enlace se mantiene; las tonalidades necesitan compartir un acorde',
          'La altura de enlace cambia un semitono; las tonalidades necesitan compartir un acorde',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la modulación cromática es verdadera?',
      hintTemplate:
        'La modulación cromática usa una alteración cromática para conducir suavemente hacia la nueva tonalidad. Una voz se mueve por medio tono de una nota diatónica a una nota cromática en la nueva tonalidad.',
      nudgeTemplate: 'La modulación cromática altera una nota de un acorde para conducir hacia la nueva tonalidad. Sigue la voz que lleva la alteración: ¿cuánto se desplaza y qué papel asume la nota alterada en la nueva tonalidad?',
      choiceSets: [
        [
          'Una voz se mueve por medio tono de una nota diatónica a una cromática',
          'Una voz salta un tritono de una nota diatónica a una cromática',
          'El acorde alterado mantiene la misma función en las dos tonalidades, así que nada se reinterpreta',
          'Necesita un acorde pivote diatónico en las dos tonalidades',
        ],
        [
          'La nota alterada se convierte a menudo en la sensible o en una nota del acorde de la nueva tonalidad',
          'La nota alterada es siempre la tónica de la nueva tonalidad, nunca su sensible',
          'La nota alterada debe estar siempre en el bajo, nunca en una voz superior',
          'La modulación cromática nunca implica la sensible de la nueva tonalidad en ninguna de las voces',
        ],
      ],
    },
  ],

  // ---- l5u16m4: Mode Mixture — Borrowed Chords ----
  l5u16m4: [
    {
      // chord_build
      promptTemplate:
        'Construye el acorde prestado {root} (un acorde de mezcla modal en C mayor).',
      hintTemplate:
        'La mezcla modal toma prestados acordes del modo menor paralelo. En C mayor estos acordes prestados son bVI (Ab mayor), bIII (Eb mayor), bVII (Bb mayor) y iv (F menor). Construye {root} tal como está escrito: las fundamentales rebajadas forman tríadas mayores, el acorde iv es F menor.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los acordes prestados del modo menor paralelo es verdadera?',
      hintTemplate:
        'Acordes prestados habituales en el modo mayor: iv (subdominante menor), bVI (sexto grado bemol mayor), bVII (séptimo grado bemol mayor), bIII. Añaden un color más oscuro a una tonalidad mayor.',
      choiceSets: [
        [
          'En C mayor, bVI es Ab mayor (Ab-C-Eb), prestado de C menor',
          'En C mayor, bVI es A mayor (A-C#-E), prestado de A menor',
          'En C mayor, bVI es F# mayor (F#-A#-C#), prestado de C menor',
          'En C mayor, bVI es Ab menor (Ab-Cb-Eb), prestado de Ab menor',
        ],
        [
          'En C mayor, iv es F menor (F-Ab-C), prestado de C menor',
          'En C mayor, iv es F mayor (F-A-C), igual que en la tonalidad mayor',
          'En C mayor, iv es A menor (A-C-E), prestado de A menor',
          'En C mayor, iv es D menor (D-F-A), prestado de C menor',
        ],
      ],
    },
  ],

  // ---- l5u16m5: Picardy Third and Mode Mixture in Minor ----
  // No generated template: the template set has no item that teaches the Picardy
  // third / mixture-in-minor concept. (The mode-mixture chord_build belongs to the
  // major-key borrowing module l5u16m4.) Rather than attach an off-topic generated
  // exercise, this module relies on its hand-authored exercises only. Coverage gap
  // acknowledged in the WS5 audit (L5 E1).

  // =========================================================================
  // Unit 17: Form, Texture, and Voice Leading
  // =========================================================================

  // ---- l5u17m1: Binary and Ternary Forms ----
  l5u17m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las formas binaria y ternaria es verdadera?',
      hintTemplate:
        'Binaria: dos secciones (AB). Ternaria: tres secciones (ABA). Binaria con retorno: A termina a menudo en V o en otra tonalidad; tras material contrastante, el material de A regresa dentro de la segunda sección (||:A:||:B A\':||).',
      choiceSets: [
        [
          'Dos secciones contrastantes, cada una repetida (||:A:||:B:||), es la forma binaria simple',
          'Dos secciones contrastantes, cada una repetida (||:A:||:B:||), es la forma ternaria',
          'Dos secciones contrastantes, cada una repetida (||:A:||:B:||), es la forma rondó',
          'Dos secciones contrastantes, cada una repetida (||:A:||:B:||), es la forma binaria con retorno',
        ],
        [
      "ABA, en la que la primera sección vuelve tras un contraste, es la forma ternaria",
      'ABA, en la que la primera sección vuelve tras un contraste, es la forma rondó',
      'ABA, en la que la primera sección vuelve tras un contraste, es la forma estrófica',
      'ABA, en la que la primera sección vuelve tras un contraste, es la composición continua',
    ],
        [
          'La binaria con retorno siempre trae de vuelta material de A al final de la sección B',
          'La binaria con retorno siempre trae de vuelta material de B al final de la sección A',
          'La binaria con retorno siempre deja el material de A fuera de la sección B',
          'La binaria con retorno siempre trae de vuelta A como una sección separada después de la sección B',
        ],
      ],
    },
  ],

  // ---- l5u17m2: Song Forms and Large Forms Introduction ----
  l5u17m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las formas rondó y tema con variaciones es verdadera?',
      hintTemplate:
        'Rondó: estribillo recurrente alternando con episodios (ABACA o ABACABA). Tema con variaciones: un tema seguido de repeticiones variadas.',
      choiceSets: [
        [
      'ABACABA es una forma de siete partes: rondó',
      'ABACABA es una forma de siete partes: tema con variaciones',
      'ABACABA es una forma de siete partes: forma estrófica',
      'ABACABA es una forma de siete partes: composición continua',
    ],
        [
          'Cada variación mantiene el tema reconocible mientras cambia otros elementos',
          'Cada variación mantiene el tema reconocible repitiendo todos los elementos musicales sin cambios',
          'Cada variación sustituye el tema por material sin relación mientras cambia otros elementos',
          'Cada variación sustituye el tema por material sin relación mientras mantiene los otros elementos sin cambios',
        ],
        [
      "Cuando A regresa en un rondó, normalmente lleva la música de vuelta a la tonalidad principal",
      "Cuando A regresa en un rondó, normalmente mantiene la música alejada de la tonalidad principal",
      "Cuando A regresa en un rondó, normalmente hace sonar la tonalidad principal como dominante del episodio anterior",
      "Cuando A regresa en un rondó, normalmente confirma el episodio anterior como nueva tonalidad principal",
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la forma sonata es verdadera?',
      hintTemplate:
        'Forma sonata: la exposición contrasta un tema en la tónica con una segunda tonalidad (normalmente la dominante en modo mayor y la relativa mayor en modo menor); el desarrollo fragmenta y modula; la recapitulación devuelve el segundo tema a la tónica.',
      choiceSets: [
        [
      "La exposición tiene dos grupos temáticos: el primero en la tónica, el segundo en una tonalidad contrastante",
      "La exposición tiene dos grupos temáticos: el primero en una tonalidad contrastante, el segundo en la tónica",
      "La exposición tiene dos grupos temáticos: el primero y el segundo en la tónica, sin tonalidad contrastante",
      "La exposición tiene dos grupos temáticos: el primero y el segundo en una tonalidad contrastante, sin la tónica",
    ],
        [
          'El desarrollo fragmenta los temas y pasa por varias tonalidades',
          'El desarrollo repite la exposición exactamente, nota por nota, en la tónica',
          'El desarrollo solo presenta temas nuevos, nunca los anteriores',
          'El desarrollo se queda en la tónica de principio a fin',
        ],
        [
      "En la recapitulación, el segundo tema vuelve en la tónica, no en la dominante",
      "En la recapitulación, el segundo tema vuelve en la dominante, no en la tónica",
      "En la recapitulación, el segundo tema vuelve en la subdominante, no en la tónica",
      "En la recapitulación, el segundo tema vuelve en la supertónica, no en la tónica",
    ],
        [
          'En una sonata en modo mayor, el segundo tema está normalmente en la dominante (V)',
          'En una sonata en modo mayor, el segundo tema está normalmente en la subdominante (IV)',
          'En una sonata en modo mayor, el segundo tema está normalmente en la relativa menor (vi)',
          'En una sonata en modo mayor, el segundo tema se queda en la tónica (I)',
        ],
      ],
    },
  ],

  // ---- l5u17m3: Texture ----
  // No generated template: the template set has no item teaching texture types
  // (monophony, homophony, polyphony, etc.). This module relies on its
  // hand-authored exercises only. Coverage gap acknowledged in the WS5 audit (L5 E1).

  // ---- l5u17m4: Guide Tone Lines ----
  // No generated template: the template set has no item teaching guide-tone lines
  // (3rds and 7ths through progressions). This module relies on its hand-authored
  // exercises only. Coverage gap acknowledged in the WS5 audit (L5 E1).
};

export default overlay;
