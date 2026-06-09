import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 5 exercise templates
// 14 modules, 14 template groups
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 15: Dominantes Secundarias y Tonicización
  // =========================================================================

  // ---- l5u15m1: Dominantes Secundarias V/V ----
  l5u15m1: [
    {
      // chord_build — {root} es la fundamental del acorde, no la tonalidad:
      // la respuesta evaluada es una tríada mayor SOBRE {root}. Refleja el EN.
      promptTemplate:
        'Construye una tríada mayor de {root}.',
      hintTemplate:
        'Una tríada mayor: fundamental + 3.ª mayor + 5.ª justa. Esta cualidad de acorde se usa para dominantes secundarias como V/V.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica la función y resolución de V/V.',
      hintTemplate:
        'V/V toniciza el acorde dominante. Contiene una alteración cromática (4.º grado elevado) y resuelve hacia V.',
      choiceSets: [
        [
          'V/V contiene el 4.º grado elevado y resuelve hacia V',
          'V/V contiene el 7.º grado rebajado y resuelve hacia IV',
          'V/V es lo mismo que el acorde IV',
          'V/V resuelve hacia I',
        ],
        [
          'En Do mayor, V/V es Re mayor (D–F#–A) que resuelve hacia Sol mayor',
          'En Do mayor, V/V es Fa mayor que resuelve hacia Sol',
          'En Do mayor, V/V es La mayor que resuelve hacia Re',
          'En Do mayor, V/V es Si mayor que resuelve hacia Do',
        ],
      ],
    },
  ],

  // ---- l5u15m2: Dominantes Secundarias de ii, iii, IV, vi ----
  l5u15m2: [
    {
      // chord_build
      promptTemplate:
        'Construye un acorde de séptima de dominante en {root} (la cualidad de acorde usada en todas las dominantes secundarias).',
      hintTemplate:
        'Una dominante secundaria es una séptima de dominante construida una 5.ªJ por encima del acorde que toniciza. Aquí solo construye {root}7: fundamental + 3.ª mayor + 5.ªJ + 7.ª menor. Por ejemplo, A7 (A-C#-E-G) es V7/ii en Do mayor, tonicizando Re menor.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica qué acorde está siendo tonicizado por esta dominante secundaria.',
      hintTemplate:
        'Cada dominante secundaria apunta a un acorde diatónico específico. V7/ii resuelve hacia ii, V7/IV resuelve hacia IV, V7/vi resuelve hacia vi, etc.',
      choiceSets: [
        [
          'V7/vi en Do mayor es E7 (E–G#–B–D), que resuelve hacia La menor',
          'V7/vi en Do mayor resuelve hacia Fa mayor',
          'V7/vi en Do mayor es D7',
          'V7/vi resuelve hacia la dominante',
        ],
        [
          'V7/IV en Do mayor es C7 (C–E–G–Bb), que resuelve hacia Fa mayor',
          'V7/IV en Do mayor es F7',
          'V7/IV resuelve hacia Sol mayor',
          'V7/IV no contiene alteraciones cromáticas',
        ],
        [
          'V7/ii en Do mayor es A7 (A–C#–E–G), que resuelve hacia Re menor',
          'V7/ii resuelve hacia Do mayor',
          'V7/ii en Do mayor es B7',
          'V7/ii es lo mismo que V/V',
        ],
      ],
    },
  ],

  // ---- l5u15m3: Acordes de Sensible Secundaria ----
  l5u15m3: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica el acorde de sensible secundaria y su resolución.',
      hintTemplate:
        'Los acordes de sensible secundaria (viiº/x) funcionan como dominantes secundarias pero son disminuidos. Resuelven medio tono arriba hacia el acorde objetivo.',
      choiceSets: [
        [
          'viiº7/V en Do mayor es F#dim7, que resuelve hacia Sol',
          'viiº7/V en Do mayor es Bdim7',
          'viiº7/V resuelve descendiendo hacia Fa',
          'viiº7/V es lo mismo que V/V',
        ],
        [
          'Los acordes de sensible secundaria tienen la fundamental medio tono por debajo del acorde objetivo',
          'Tienen la fundamental una 5.ª por encima del objetivo',
          'Tienen la fundamental una 4.ª por debajo del objetivo',
          'La posición de la fundamental es aleatoria',
        ],
        [
          'viiº/x puede ser tanto una tríada disminuida como un acorde de séptima totalmente disminuida',
          'viiº/x es siempre un acorde mayor',
          'viiº/x es siempre un acorde de séptima menor',
          'viiº/x tiene que ser un acorde semidisminuido',
        ],
      ],
    },
  ],

  // ---- l5u15m4: Tonicización vs. Modulación ----
  l5u15m4: [
    {
      // multiple_choice
      promptTemplate:
        'Distingue entre tonicización y modulación.',
      hintTemplate:
        'La tonicización es un énfasis breve y momentáneo en un acorde no tónica (de 1 a 2 acordes de duración). La modulación es un cambio más permanente hacia una nueva tonalidad (confirmada por una cadencia en la nueva tonalidad).',
      choiceSets: [
        [
          'La tonicización enfatiza temporalmente un acorde; la modulación establece una nueva tonalidad con una cadencia',
          'Tonicización y modulación significan lo mismo',
          'La tonicización requiere una cadencia en la nueva tonalidad',
          'La modulación nunca usa acordes cromáticos',
        ],
        [
          'Una única dominante secundaria seguida de su objetivo es tonicización, no modulación',
          'Una dominante secundaria crea siempre una modulación',
          'La tonicización requiere al menos 8 compases en la nueva tonalidad',
          'No hay diferencia práctica entre ambas',
        ],
        [
          'La modulación se confirma cuando la música cadencia en la nueva tonalidad',
          'La modulación requiere cambiar la indicación de compás',
          'La modulación solo ocurre al final de una pieza',
          'La modulación nunca involucra notas cromáticas',
        ],
      ],
    },
  ],

  // ---- l5u15m5: Cadenas de Dominantes ----
  l5u15m5: [
    {
      // multiple_choice
      promptTemplate:
        'Analiza esta cadena de dominantes secundarias.',
      hintTemplate:
        'Una cadena de dominantes enlaza dominantes secundarias: p. ej., V7/vi → V7/ii → V7/V → V7 → I. Cada dominante resuelve hacia la siguiente, creando movimiento cromático en dirección a la tónica.',
      choiceSets: [
        [
          'En una cadena de dominantes, cada acorde funciona como V7 del acorde siguiente',
          'Una cadena de dominantes usa solo acordes diatónicos',
          'Una cadena de dominantes se mueve siempre por quintas ascendentes',
          'Las cadenas de dominantes están limitadas a 2 acordes',
        ],
        [
          'La cadena V7/vi → V7/ii → V7/V → V → I se mueve por quintas descendentes',
          'Esta cadena se mueve por terceras ascendentes',
          'Esta cadena no tiene patrón',
          'Esta cadena se mueve por quintas ascendentes',
        ],
        [
          'La tonicización prolongada mediante cadenas de dominantes crea movimiento cromático en el bajo',
          'Las cadenas de dominantes nunca producen movimiento cromático',
          'El bajo se mantiene siempre diatónico en las cadenas de dominantes',
          'Las cadenas de dominantes usan solo acordes en posición fundamental',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 16: Modulación
  // =========================================================================

  // ---- l5u16m1: Modulación por Acorde Pivote ----
  l5u16m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analiza esta modulación por acorde pivote.',
      hintTemplate:
        'Un acorde pivote pertenece tanto a la tonalidad antigua como a la nueva. Reinterpreta un acorde diatónico: p. ej., IV en Do = I en Fa. El pivote es la bisagra entre dos regiones tonales.',
      choiceSets: [
        [
          'Un acorde pivote funciona diatónicamente tanto en la tonalidad antigua como en la nueva',
          'Un acorde pivote tiene que ser cromático',
          'Un acorde pivote solo existe en tonalidades menores',
          'Un acorde pivote es siempre V7',
        ],
        [
          'Al modular de Do a Sol, el acorde de Do mayor puede pivotar como IV en Sol',
          'Do mayor no puede funcionar como acorde pivote',
          'Los pivotes solo funcionan entre tonalidades relativas',
          'El pivote tiene que ser un acorde disminuido',
        ],
        [
          'Las tonalidades cercanas (que difieren en 1 sostenido/bemol) comparten más acordes pivote',
          'Las tonalidades distantes tienen más acordes pivote',
          'Todas las tonalidades comparten el mismo número de acordes pivote',
          'Los acordes pivote solo funcionan entre tonalidades paralelas',
        ],
      ],
    },
  ],

  // ---- l5u16m2: Modulación a Tonalidades Cercanas ----
  // (re-asignada desde l5u16m4 para corresponder al tema del currículo)
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
        'Identifica las tonalidades cercanas para esta tónica.',
      hintTemplate:
        'Cada tonalidad mayor tiene 5 tonalidades cercanas: la dominante, la subdominante y las relativas menores de las tres (tónica, dominante, subdominante).',
      choiceSets: [
        [
          'Do mayor tiene tonalidades cercanas: Sol mayor, Fa mayor, La menor, Mi menor, Re menor',
          'Do mayor es cercano a Reb mayor y Si mayor',
          'Do mayor no tiene tonalidades cercanas',
          'Do mayor es cercano a Lab mayor y Mib mayor',
        ],
        [
          'Sol mayor tiene tonalidades cercanas: Re mayor, Do mayor, Mi menor, Si menor, La menor',
          'Sol mayor es cercano a Solb mayor',
          'Sol mayor solo está relacionado con Do mayor',
          'Sol mayor es cercano a Fa mayor',
        ],
      ],
    },
  ],

  // ---- l5u16m3: Modulación Directa, por Nota Común y Cromática ----
  // (fusionados los bloques Directa/De Frase, Nota Común y Cromática — el currículo
  //  agrupa los tres en este módulo; antes divididos en m2/m3/m5)
  l5u16m3: [
    {
      // multiple_choice — modulación directa / de frase
      promptTemplate:
        'Identifica las características de esta técnica de modulación.',
      hintTemplate:
        'La modulación directa (de frase) cambia de tonalidad abruptamente en un límite de frase sin acorde pivote. Es habitual en la música pop y en los himnos.',
      choiceSets: [
        [
          'Una modulación directa cambia a una nueva tonalidad en un límite de frase sin acorde pivote',
          'Una modulación directa usa siempre un acorde pivote',
          'Una modulación directa es lo mismo que la tonicización',
          'Una modulación directa solo sube medio tono',
        ],
        [
          'La modulación «del camionero» sube medio tono o un tono para efecto dramático',
          'La modulación del camionero va siempre a la dominante',
          'Esta técnica es exclusiva de la música clásica',
          'Esta modulación es siempre descendente',
        ],
      ],
    },
    {
      // multiple_choice — modulación por nota común
      promptTemplate:
        '¿Cómo funciona la modulación por nota común?',
      hintTemplate:
        'La modulación por nota común sostiene una única nota que se reinterpreta en la nueva tonalidad. Se usa frecuentemente para modulaciones distantes donde existen pocos acordes pivote.',
      choiceSets: [
        [
          'La modulación por nota común sostiene una nota que se convierte en un grado de la escala diferente en la nueva tonalidad',
          'La modulación por nota común requiere que todas las notas sean comunes',
          'La modulación por nota común nunca involucra notas sostenidas',
          'La modulación por nota común es lo mismo que la modulación por acorde pivote',
        ],
        [
          'La modulación por nota común es especialmente útil para tonalidades distantes que comparten pocos acordes',
          'La modulación por nota común solo funciona para tonalidades cercanas',
          'Esta técnica requiere secuencias cromáticas',
          'Esta técnica se limita a la relativa mayor/menor',
        ],
      ],
    },
    {
      // multiple_choice — modulación cromática
      promptTemplate:
        'Analiza esta técnica de modulación cromática.',
      hintTemplate:
        'La modulación cromática usa una alteración cromática para conducir suavemente hacia la nueva tonalidad. Una voz se mueve por medio tono de una nota diatónica a una nota cromática en la nueva tonalidad.',
      choiceSets: [
        [
          'La modulación cromática presenta una voz moviéndose por medio tono de una nota diatónica a una cromática',
          'La modulación cromática evita todos los medios tonos',
          'La modulación cromática requiere un acorde pivote',
          'La modulación cromática se mueve siempre entre tonalidades paralelas',
        ],
        [
          'La alteración cromática típicamente introduce la sensible o una nota del acorde de la nueva tonalidad',
          'La nota cromática es siempre la tónica de la nueva tonalidad',
          'La modulación cromática nunca involucra sensibles',
          'La alteración tiene que estar en la voz del bajo',
        ],
      ],
    },
  ],

  // ---- l5u16m4: Mezcla Modal — Acordes Prestados ----
  // (re-asignada desde l5u17m1 para corresponder al tema del currículo)
  l5u16m4: [
    {
      // chord_build
      promptTemplate:
        'Construye el acorde prestado {root} (un acorde de mezcla modal en Do mayor).',
      hintTemplate:
        'La mezcla modal toma prestados acordes del modo menor paralelo. En Do mayor estos acordes prestados son bVI (Lab mayor), bIII (Mib mayor), bVII (Sib mayor) y iv (Fa menor). Construye {root} tal como está escrito: las fundamentales rebajadas forman tríadas mayores, el acorde iv es Fa menor.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica este acorde prestado del modo menor paralelo.',
      hintTemplate:
        'Acordes prestados habituales en el modo mayor: iv (subdominante menor), bVI (sexto grado bemol mayor), bVII (séptimo grado bemol mayor), bIII. Añaden un color más oscuro a una tonalidad mayor.',
      choiceSets: [
        [
          'El acorde bVI en Do mayor es Lab mayor (prestado de Do menor)',
          'El acorde bVI en Do mayor es Fa# mayor',
          'El acorde bVI en Do mayor es La mayor',
          'bVI no existe en la mezcla modal',
        ],
        [
          'El acorde iv en Do mayor es Fa menor (prestado de Do menor)',
          'El acorde iv en Do mayor es Fa mayor sin alterar',
          'El acorde iv en Do mayor es La menor',
          'La mezcla modal no puede alterar la subdominante',
        ],
      ],
    },
  ],

  // ---- l5u16m5: Tercera de Picardía y Mezcla Modal en Menor ----
  // Sin plantilla generada (laguna de cobertura reconocida en la auditoría WS5).

  // =========================================================================
  // Unidad 17: Forma, Textura y Conducción de Voces
  // =========================================================================

  // ---- l5u17m1: Formas Binaria y Ternaria ----
  // (re-asignada desde l5u17m2 para corresponder al tema del currículo)
  l5u17m1: [
    {
      // multiple_choice
      promptTemplate:
        'Clasifica esta forma musical según su estructura.',
      hintTemplate:
        "Binaria: dos secciones (AB). Ternaria: tres secciones (ABA). Binaria con retorno: A modula, B desarrolla, A regresa (||:A:||:BA':||).",
      choiceSets: [
        [
          'Una pieza con dos secciones contrastantes (AB) ambas repetidas es forma binaria simple',
          'La forma AB es ternaria',
          'La forma AB es composición continua',
          'La forma AB es rondó',
        ],
        [
          'La forma ABA en la que la primera sección regresa es forma ternaria',
          'La forma ABA es binaria',
          'La forma ABA es estrófica',
          'La forma ABA es composición continua',
        ],
        [
          'La binaria con retorno presenta el regreso del material de A al final de la sección B',
          'La binaria con retorno tiene tres secciones completamente independientes',
          'La binaria con retorno nunca modula',
          'La binaria con retorno es lo mismo que la binaria simple',
        ],
      ],
    },
  ],

  // ---- l5u17m2: Formas Canción y Grandes Formas ----
  // (fusionados los bloques Rondó/Variaciones y Sonata — el currículo agrupa rondó,
  //  tema con variaciones y sonata en este módulo; antes divididos en m3/m4)
  l5u17m2: [
    {
      // multiple_choice — rondó y variaciones
      promptTemplate:
        'Identifica las características de esta forma musical.',
      hintTemplate:
        'Rondó: estribillo recurrente alternando con episodios (ABACA o ABACABA). Tema con variaciones: un tema seguido de repeticiones variadas.',
      choiceSets: [
        [
          'ABACABA es una forma rondó en siete partes',
          'ABACABA es forma ternaria',
          'ABACABA es forma binaria',
          'ABACABA es forma sonata',
        ],
        [
          'En el tema con variaciones, cada variación preserva la estructura armónica mientras altera otros elementos',
          'Las variaciones deben mantener la melodía exacta',
          'Las variaciones cambian siempre de tonalidad',
          'Las variaciones nunca alteran el ritmo',
        ],
        [
          'El estribillo del rondó (A) permanece típicamente en la tonalidad de la tónica',
          'El estribillo modula a una nueva tonalidad cada vez',
          'Los episodios deben permanecer en la tonalidad de la tónica',
          'El estribillo es siempre diferente cada vez',
        ],
      ],
    },
    {
      // multiple_choice — forma sonata
      promptTemplate:
        'Responde a esta pregunta sobre la estructura de la forma sonata.',
      hintTemplate:
        'Forma sonata: Exposición (tema 1 en la tónica, tema 2 en la dominante), Desarrollo (fragmentación, modulación), Recapitulación (ambos temas en la tónica).',
      choiceSets: [
        [
          'La exposición presenta dos grupos temáticos: el primero en la tónica, el segundo en una tonalidad contrastante',
          'La exposición tiene solo un tema',
          'Ambos temas están en la tonalidad de la tónica',
          'La exposición es la sección del medio',
        ],
        [
          'La sección de desarrollo fragmenta y desarrolla los temas a través de modulación y secuencia',
          'El desarrollo simplemente repite la exposición',
          'El desarrollo introduce temas completamente nuevos',
          'El desarrollo permanece en la tonalidad de la tónica',
        ],
        [
          'En la recapitulación, el segundo tema regresa en la tonalidad de la tónica en vez de la dominante',
          'La recapitulación repite la exposición exactamente',
          'La recapitulación está en la tonalidad de la dominante',
          'El segundo tema se omite en la recapitulación',
        ],
        [
          'En una sonata en tonalidad mayor, el segundo tema está típicamente en la dominante (V)',
          'El segundo tema está siempre en la subdominante (IV)',
          'El segundo tema está siempre en la relativa menor',
          'El segundo tema permanece en la tónica',
        ],
      ],
    },
  ],

  // ---- l5u17m3: Textura ----
  // Sin plantilla generada (laguna de cobertura reconocida en la auditoría WS5).

  // ---- l5u17m4: Líneas de Notas Guía ----
  // Sin plantilla generada (laguna de cobertura reconocida en la auditoría WS5).
};

export default overlay;
