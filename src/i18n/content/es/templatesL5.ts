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
        '¿Cuál de estas afirmaciones sobre V/V (la dominante de la dominante) es verdadera?',
      hintTemplate:
        'V/V toniciza el acorde dominante. Contiene una alteración cromática (4.º grado elevado) y resuelve hacia V.',
      choiceSets: [
        [
          'V/V contiene el 4.º grado elevado y resuelve hacia V',
          'V/V contiene el 7.º grado rebajado y resuelve hacia IV',
          'V/V contiene el 4.º grado elevado y resuelve hacia I',
          'V/V solo contiene notas diatónicas, así que es el mismo acorde que ii',
        ],
        [
          'En C mayor, V/V es D mayor (D-F#-A), que resuelve hacia G mayor',
          'En C mayor, V/V es F mayor (F-A-C), que resuelve hacia G mayor',
          'En C mayor, V/V es A mayor (A-C#-E), que resuelve hacia D menor',
          'En C mayor, V/V es B mayor (B-D#-F#), que resuelve hacia C mayor',
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
        'Una dominante secundaria es una tríada mayor o una séptima de dominante construida una 5.ªJ por encima del acorde que toniciza. Aquí solo construye {root}7: fundamental + 3.ª mayor + 5.ªJ + 7.ª menor. Por ejemplo, A7 (A-C#-E-G) es V7/ii en C mayor, tonicizando D menor.',
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
          'V7/IV en C mayor es C7 (C-E-G-Bb), que resuelve hacia F mayor',
          'V7/IV en C mayor es F7 (F-A-C-Eb), que resuelve hacia Bb mayor',
          'V7/IV en C mayor es C7 (C-E-G-Bb), que resuelve hacia G mayor',
          'V7/IV en C mayor es G7 (G-B-D-F), que resuelve hacia C mayor',
        ],
        [
          'V7/ii en C mayor es A7 (A-C#-E-G), que resuelve hacia D menor',
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
        'Los acordes de sensible secundaria (vii°/x) funcionan como dominantes secundarias pero son disminuidos. Resuelven medio tono arriba hacia el acorde objetivo.',
      choiceSets: [
        [
          'vii°7/V en C mayor es F#dim7, que resuelve subiendo hacia G',
          'vii°7/V en C mayor es Bdim7, que resuelve subiendo hacia C',
          'vii°7/V en C mayor es F#dim7, que resuelve bajando hacia F',
          'vii°7/V en C mayor es C#dim7, que resuelve subiendo hacia D',
        ],
        [
          'Su fundamental está medio tono por debajo del acorde al que resuelven',
          'Su fundamental está una 5.ª justa por encima del acorde al que resuelven',
          'Su fundamental está un tono por debajo del acorde al que resuelven',
          'Su fundamental está una 3.ª mayor por debajo del acorde al que resuelven',
        ],
        [
          'Puede ser una tríada disminuida, una 7.ª semidisminuida o una 7.ª disminuida',
          'Es siempre una tríada mayor, igual que la dominante secundaria a la que sustituye',
          'Es siempre un acorde de 7.ª menor construido sobre la fundamental del objetivo',
          'Puede ser una tríada menor o una 7.ª menor, pero nunca un acorde disminuido',
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
        'La tonicización es un énfasis breve y momentáneo en un acorde no tónica (de 1 a 2 acordes de duración). La modulación es un cambio más permanente hacia una nueva tonalidad (confirmada por una cadencia en la nueva tonalidad).',
      choiceSets: [
        [
          'La tonicización realza brevemente un acorde; la modulación confirma una nueva tonalidad con una cadencia',
          'La tonicización confirma una nueva tonalidad con una cadencia; la modulación solo realza brevemente un acorde',
          'Tonicización y modulación son dos nombres para exactamente el mismo proceso',
          'La modulación nunca usa acordes cromáticos; la tonicización siempre los usa',
        ],
        [
          'Una sola dominante secundaria y su objetivo son una tonicización',
          'Una sola dominante secundaria y su objetivo son siempre una modulación',
          'Una tonicización debe durar al menos ocho compases en la nueva tonalidad',
          'Una tonicización necesita una cadencia auténtica perfecta en la nueva tonalidad',
        ],
        [
          'Una modulación se confirma cuando la música hace una cadencia en la nueva tonalidad',
          'Una modulación se confirma en cuanto cambia el compás',
          'Una modulación se confirma con cualquier nota cromática aislada en la melodía',
          'Una modulación solo puede confirmarse justo al final de una pieza, y en ningún otro lugar',
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
          'En una cadena de dominantes, todos los acordes se quedan diatónicos en la tonalidad principal',
          'En una cadena de dominantes, cada acorde actúa como V7 del acorde que vino antes',
        ],
        [
          'La cadena V7/vi -> V7/ii -> V7/V -> V -> I se mueve por 5.as descendentes',
          'La cadena V7/vi -> V7/ii -> V7/V -> V -> I se mueve por 5.as ascendentes',
          'La cadena V7/vi -> V7/ii -> V7/V -> V -> I se mueve por 3.as ascendentes',
          'La cadena V7/vi -> V7/ii -> V7/V -> V -> I se mueve por grados conjuntos descendentes',
        ],
        [
          'Cada dominante aplicada suele añadir una nota cromática: la sensible de su objetivo',
          'Cada dominante aplicada se queda diatónica, así que la cadena no añade ninguna nota cromática',
          'Cada dominante aplicada mantiene el bajo en la misma nota durante toda la cadena',
          'Cada dominante aplicada debe tocarse en segunda inversión',
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
        '¿Cuál de estas afirmaciones sobre la modulación por acorde pivote es verdadera?',
      hintTemplate:
        'Un acorde pivote pertenece tanto a la tonalidad antigua como a la nueva. Reinterpreta un acorde diatónico: p. ej., IV en C = I en F. El pivote es la bisagra entre dos regiones tonales.',
      choiceSets: [
        [
          'Un acorde pivote es diatónico tanto en la tonalidad antigua como en la nueva',
          'Un acorde pivote es diatónico en la tonalidad antigua pero cromático en la nueva',
          'Un acorde pivote tiene que ser siempre el V7 de la nueva tonalidad',
          'Un acorde pivote solo puede enlazar dos tonalidades menores',
        ],
        [
          'De C a G, el acorde de C mayor puede servir de pivote como IV de G',
          'De C a G, el acorde de C mayor puede servir de pivote como V de G',
          'De C a G, el acorde de C mayor puede servir de pivote como vii° de G',
          'De C a G, el acorde de C mayor no puede servir de pivote en absoluto',
        ],
        [
          'Las tonalidades cercanas (a una alteración de distancia) comparten más acordes pivote',
          'Las tonalidades lejanas, a muchas alteraciones de distancia, son las que comparten más acordes pivote',
          'Todos los pares de tonalidades comparten exactamente el mismo número de acordes pivote',
          'Las tonalidades paralelas (misma tónica) comparten siempre más acordes pivote',
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
          'Las tonalidades cercanas de C mayor: G mayor, F mayor, A menor, E menor, D menor',
          'Las tonalidades cercanas de C mayor: D mayor, Bb mayor, B menor, G menor, F# menor',
          'Las tonalidades cercanas de C mayor: Db mayor, B mayor, C menor, Bb menor, Eb menor',
          'Las tonalidades cercanas de C mayor: G mayor, D mayor, A mayor, E mayor, B mayor',
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
      choiceSets: [
        [
          'Una modulación directa pasa a una nueva tonalidad en un límite de frase, sin pivote',
          'Una modulación directa pasa a una nueva tonalidad a mitad de frase mediante un acorde pivote común',
          'Una modulación directa es solo otro nombre para una tonicización breve',
          'Una modulación directa solo puede subir medio tono',
        ],
        [
          'La modulación "truck driver" sube medio tono o un tono para dar un impulso',
          'La modulación "truck driver" baja siempre a la tonalidad de la dominante',
          'La modulación "truck driver" solo se encuentra en la música barroca y clásica',
          'La modulación "truck driver" siempre baja la tonalidad un semitono',
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
          'Una nota mantenida se vuelve a oír como un grado distinto en la nueva tonalidad',
          'Una nota mantenida conserva exactamente el mismo grado en la nueva tonalidad',
          'Todas las notas del acorde deben ser comunes a las dos tonalidades',
          'No se mantiene ninguna nota: la música se detiene y vuelve a empezar en la nueva tonalidad',
        ],
        [
          'Es especialmente útil entre tonalidades lejanas que comparten pocos acordes',
          'Solo funciona entre tonalidades cercanas que comparten muchos acordes',
          'Exige una secuencia cromática por todas las tonalidades que quedan entre las dos',
          'Solo funciona entre una tonalidad y su relativa mayor o menor',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la modulación cromática es verdadera?',
      hintTemplate:
        'La modulación cromática usa una alteración cromática para conducir suavemente hacia la nueva tonalidad. Una voz se mueve por medio tono de una nota diatónica a una nota cromática en la nueva tonalidad.',
      choiceSets: [
        [
          'Una voz se mueve por medio tono de una nota diatónica a una cromática',
          'Una voz salta un tritono de una nota diatónica a una cromática',
          'Todas las voces se mueven por tono, así que no aparece ningún semitono',
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
        'Binaria: dos secciones (AB). Ternaria: tres secciones (ABA). Binaria con retorno: A modula, B desarrolla, A regresa (||:A:||:BA\':||).',
      choiceSets: [
        [
          'Dos secciones contrastantes, cada una repetida (||:A:||:B:||), es la forma binaria simple',
          'Dos secciones contrastantes, cada una repetida (||:A:||:B:||), es la forma ternaria',
          'Dos secciones contrastantes, cada una repetida (||:A:||:B:||), es la forma rondó',
          'Dos secciones contrastantes, cada una repetida (||:A:||:B:||), es una forma de composición continua',
        ],
        [
          'ABA, en la que la primera sección vuelve tras un contraste, es la forma ternaria',
          'ABA, en la que la primera sección vuelve tras un contraste, es la forma rondó',
          'ABA, en la que la primera sección vuelve tras un contraste, es la forma estrófica',
          'ABA, en la que la primera sección vuelve tras un contraste, es una forma de composición continua',
        ],
        [
          'La binaria con retorno trae de vuelta material de A al final de la sección B',
          'La binaria con retorno tiene tres secciones independientes que nunca vuelven',
          'La binaria con retorno nunca modula fuera de la tonalidad principal en ningún momento',
          'La binaria con retorno es solo otro nombre para la binaria simple',
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
          'ABACABA es un rondó en siete partes',
          'ABACABA es una forma ternaria en tres partes',
          'ABACABA es una forma binaria en dos partes',
          'ABACABA es una forma sonata en tres partes',
        ],
        [
          'Cada variación mantiene el tema reconocible mientras cambia otros elementos',
          'Cada variación debe mantener la melodía y el ritmo exactamente iguales',
          'Cada variación debe pasar a una nueva tonalidad y nunca mantener la original',
          'Cada variación sustituye el tema por material completamente nuevo y sin relación',
        ],
        [
          'El estribillo del rondó (A) vuelve normalmente en la tonalidad principal',
          'El estribillo del rondó (A) cambia a una nueva tonalidad cada vez que vuelve',
          'Los episodios del rondó deben quedarse todos en la tonalidad principal',
          'El estribillo del rondó se reescribe por completo cada vez',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la forma sonata es verdadera?',
      hintTemplate:
        'Forma sonata: Exposición (tema 1 en la tónica, tema 2 en la dominante), Desarrollo (fragmentación, modulación), Recapitulación (ambos temas en la tónica).',
      choiceSets: [
        [
          'La exposición tiene dos grupos temáticos: el primero en la tónica, el segundo en una tonalidad contrastante',
          'La exposición tiene dos grupos temáticos, y ambos se quedan en la tonalidad de la tónica de principio a fin',
          'La exposición tiene un solo tema, que después se varía en la tonalidad de la tónica',
          'La exposición es la sección central, entre el desarrollo y la recapitulación',
        ],
        [
          'El desarrollo fragmenta los temas y pasa por varias tonalidades',
          'El desarrollo repite la exposición exactamente, nota por nota, en la tónica',
          'El desarrollo solo presenta temas nuevos, nunca los anteriores',
          'El desarrollo se queda en la tónica de principio a fin',
        ],
        [
          'En la recapitulación, el segundo tema vuelve en la tónica, no en la dominante',
          'En la recapitulación, el segundo tema vuelve en la dominante, no en la tónica',
          'En la recapitulación, el segundo tema se omite por completo',
          'La recapitulación repite la exposición exactamente, tonalidades incluidas',
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
