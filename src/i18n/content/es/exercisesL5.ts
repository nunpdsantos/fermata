import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish translations for Level 5 hand-authored exercises
// Note names (C, D, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidad 15: Dominantes Secundarias y Tonicización
  // =========================================================================

  // ---- l5u15m1: Dominantes Secundarias V/V ----

  l5u15m1e1: {
    prompt:
      'Construye V/V en C mayor. La dominante secundaria de V es una tríada de D mayor. Selecciona las 3 notas: D, F#, A.',
    hint: 'V/V en C significa «el acorde V de G mayor». La dominante de G es D mayor: D (2), F# (6), A (9). El F# es cromático — no pertenece a C mayor.',
  },
  l5u15m1e2: {
    prompt:
      'Construye V7/V en C mayor. Es un acorde de D dominante con séptima: D, F#, A, C. Selecciona las 4 notas.',
    hint: 'V7/V en C = D7: D (2), F# (6), A (9), C (0). La séptima menor añadida (C) refuerza la atracción hacia G. El F# es la alteración cromática.',
  },
  l5u15m1e3: {
    prompt: '¿Qué es V/V?',
    choices: [
      'Una dominante secundaria que toniciza el acorde dominante de la tonalidad',
      'El quinto acorde tocado dos veces seguidas',
      'Un acorde disminuido construido sobre el segundo grado de la escala',
      'El acorde dominante en segunda inversión',
    ],
    hint: 'V/V significa «la dominante de la dominante». En C mayor, V es G. La dominante de G es D mayor. Por tanto, V/V en C = D mayor, un acorde cromático que toniciza temporalmente G.',
  },

  // ---- l5u15m2: Dominantes Secundarias de ii, iii, IV, vi ----

  l5u15m2e1: {
    prompt: 'En C mayor, ¿qué acorde funciona como V/ii?',
    choices: [
      'A mayor (A, C#, E) — la dominante de D menor',
      'G mayor (G, B, D) — la dominante de C',
      'E mayor (E, G#, B) — la dominante de A menor',
      'F mayor (F, A, C) — la subdominante',
    ],
    hint: 'En C mayor, ii es D menor. La dominante de D menor es A mayor (A, C#, E). El C# es la nota cromática que crea la sensible de D.',
  },
  l5u15m2e2: {
    prompt: 'En C mayor, ¿qué acorde funciona como V/IV?',
    choices: [
      'C mayor (C, E, G) — la dominante de F',
      'G mayor (G, B, D) — la dominante de C',
      'Bb mayor (Bb, D, F) — prestado de C menor',
      'D mayor (D, F#, A) — la dominante de G',
    ],
    hint: 'V/IV significa la dominante de IV. En C mayor, IV es F. La dominante de F es C mayor. Esto es inusual porque C mayor ya es la tónica — el contexto determina si funciona como I o V/IV.',
  },
  l5u15m2e3: {
    prompt: '¿Qué define una dominante aplicada (secundaria)?',
    choices: [
      'Una tríada mayor o acorde de séptima dominante que resuelve hacia un acorde diatónico distinto de I, funcionando como V de ese acorde',
      'Cualquier acorde de séptima dominante usado en una progresión',
      'Un acorde que modula permanentemente a una nueva tonalidad',
      'El acorde V que resuelve hacia vi en una cadencia rota',
    ],
    hint: 'Una dominante aplicada funciona temporalmente como V (o V7) de un acorde diatónico. Introduce notas cromáticas para crear una resolución de sensible hacia su objetivo, sin establecer una nueva tonalidad.',
  },

  // ---- l5u15m3: Acordes de Sensible Secundaria ----

  l5u15m3e1: {
    prompt:
      '¿Cuál es la función de un acorde de sensible secundaria (p. ej., vii°/V)?',
    choices: [
      'Funciona como un acorde disminuido que resuelve medio tono arriba hacia el acorde tonicizado, tal como vii° resuelve hacia I',
      'Sustituye completamente al acorde dominante en las cadencias',
      'Funciona como un acorde de paso sin atracción armónica',
      'Es la sensible de la tonalidad tocada como nota aislada',
    ],
    hint: 'vii°/V funciona del mismo modo que vii° en una tonalidad: la fundamental está medio tono por debajo del acorde objetivo, y la cualidad disminuida crea un fuerte impulso de resolución ascendente hacia el objetivo.',
  },
  l5u15m3e2: {
    prompt:
      '¿Cuál es la diferencia entre un acorde de séptima semidisminuida y uno de séptima totalmente disminuida en el contexto de acordes de sensible secundaria?',
    choices: [
      'El semidisminuido tiene una séptima menor sobre la fundamental; el totalmente disminuido tiene una séptima disminuida (un semitono más baja)',
      'El semidisminuido resuelve hacia arriba; el totalmente disminuido resuelve hacia abajo',
      'El semidisminuido solo se usa en tonalidades mayores; el totalmente disminuido solo en menores',
      'No hay diferencia; son el mismo acorde',
    ],
    hint: 'Ambos tienen una tríada disminuida (fundamental, 3.ª menor, 5.ª disminuida). La séptima difiere: semidisminuido tiene séptima menor (10 semitonos), totalmente disminuido tiene séptima disminuida (9 semitonos). El totalmente disminuido es más habitual como acorde de sensible secundaria.',
  },
  l5u15m3e3: {
    prompt:
      'En C mayor, ¿cuál es el acorde objetivo hacia el que resuelve vii°/V?',
    choices: [
      'G mayor (V) — vii°/V resuelve medio tono arriba hacia la dominante',
      'C mayor (I) — resuelve hacia la tónica',
      'F mayor (IV) — resuelve hacia la subdominante',
      'D menor (ii) — resuelve hacia la supertónica',
    ],
    hint: 'El «/V» indica el objetivo: V. En C mayor, V es G. vii°/V es F# disminuido (F#, A, C), y el F# resuelve medio tono arriba hacia G, la fundamental del acorde objetivo.',
  },

  // ---- l5u15m4: Tonicización vs. Modulación ----

  l5u15m4e1: {
    prompt: '¿Qué es la tonicización?',
    choices: [
      'Un énfasis breve y temporal en un acorde no tónica utilizando su propia dominante, sin abandonar la tonalidad original',
      'Un cambio permanente de centro tonal hacia una nueva tónica',
      'Tocar el acorde de tónica repetidamente para establecer la tonalidad',
      'Transponer una melodía a una nueva tonalidad',
    ],
    hint: 'La tonicización es fugaz: una dominante secundaria o acorde de sensible trata brevemente un acorde diatónico como tónica local, pero la tonalidad original mantiene el control. Piensa en ello como un desvío momentáneo.',
  },
  l5u15m4e2: {
    prompt: '¿Cómo se distingue la modulación de la tonicización?',
    choices: [
      'La modulación establece una nueva tonalidad mediante cadencias y pasajes extensos; la tonicización es breve y regresa a la tonalidad original',
      'La modulación usa sostenidos; la tonicización usa bemoles',
      'La modulación solo ocurre al final de una pieza; la tonicización ocurre en el medio',
      'No hay diferencia real; los términos son intercambiables',
    ],
    hint: 'La prueba clave: ¿el nuevo centro tonal se mantiene con sus propias cadencias y pasajes estables? Si es así, es modulación. Si la tonalidad original se reafirma rápidamente, es solo tonicización.',
  },
  l5u15m4e3: {
    prompt:
      'Cuando una tonicización se prolonga durante varios compases pero no establece completamente la nueva tonalidad, ¿cómo se denomina?',
    choices: [
      'Una tonicización prolongada — más larga que un solo acorde pero sin confirmación cadencial completa en la nueva tonalidad',
      'Una modulación por acorde pivote',
      'Una cadencia rota',
      'Una secuencia cromática',
    ],
    hint: 'Las tonicizaciones prolongadas ocupan una zona gris: duran más que un rápido V/x – x, pero la nueva tonalidad nunca se confirma con una cadencia fuerte. La frontera entre tonicización prolongada y modulación es subjetiva.',
  },

  // ---- l5u15m5: Cadenas de Dominantes ----

  l5u15m5e1: {
    prompt: '¿Qué es una cadena de dominantes secundarias?',
    choices: [
      'Una secuencia en la que cada acorde funciona como V7 del siguiente, pasando por múltiples tonicizaciones antes de resolver hacia la tónica',
      'Tocar el acorde V de cada tonalidad mayor en sucesión',
      'Una serie de acordes disminuidos descendiendo cromáticamente',
      'Alternar entre I y V repetidamente',
    ],
    hint: 'Una cadena de dominantes crea tensión en cascada: p. ej., V7/vi – V7/ii – V7/V – V7 – I. Cada acorde de séptima dominante resuelve hacia el eslabón siguiente, arrastrando la armonía de vuelta a la tónica a través de un ciclo.',
  },
  l5u15m5e2: {
    prompt:
      'En una cadena de dominantes secundarias descendente por quintas (p. ej., V7/vi – V7/ii – V7/V – V – I en C mayor), ¿qué movimiento de fundamentales enlaza cada acorde?',
    choices: [
      'Cada fundamental desciende una quinta justa (o asciende una cuarta justa) hacia la siguiente',
      'Cada fundamental asciende un semitono cromáticamente',
      'Cada fundamental desciende un tono',
      'Las fundamentales alternan entre terceras ascendentes y descendentes',
    ],
    hint: 'Las cadenas de dominantes explotan el movimiento de fundamentales más fuerte de la música tonal: quinta descendente. Cada V7 resuelve una quinta por debajo hacia su objetivo, y ese objetivo se reinterpreta como el siguiente V7.',
  },
  l5u15m5e3: {
    prompt: '¿Qué es la tonicización secuencial?',
    choices: [
      'Un patrón armónico en el que el mismo gesto de tonicización (p. ej., V7 – objetivo) se repite en diferentes niveles de altura en secuencia',
      'Una modulación que pasa por todas las tonalidades en el círculo de quintas',
      'Tocar escalas en secuencia ascendente cromáticamente',
      'Una serie de cadencias rotas en diferentes tonalidades',
    ],
    hint: 'La tonicización secuencial aplica el mismo patrón armónico (frecuentemente V7 – acorde) a grados de la escala sucesivos, creando un movimiento cromático previsible pero colorido. Es habitual en la música barroca y en el jazz.',
  },

  // =========================================================================
  // Unidad 16: Modulación y Mezcla Modal
  // =========================================================================

  // ---- l5u16m1: Modulación por Acorde Pivote ----

  l5u16m1e1: {
    prompt: '¿Qué es un acorde pivote en la modulación?',
    choices: [
      'Un acorde que pertenece tanto a la tonalidad antigua como a la nueva, sirviendo de bisagra entre ellas',
      'El primer acorde de la nueva tonalidad que contiene una nota cromática',
      'Un acorde disminuido que resuelve la modulación',
      'El acorde dominante de la tonalidad original',
    ],
    hint: 'Un acorde pivote es diatónico en ambas tonalidades. Por ejemplo, al modular de C mayor a G mayor, el acorde E menor es tanto iii en C como vi en G, creando un puente armónico suave entre las dos tonalidades.',
  },
  l5u16m1e2: {
    prompt:
      'Al modular de C mayor a G mayor, ¿qué acorde podría servir como pivote?',
    choices: [
      'E menor — es iii en C mayor y vi en G mayor',
      'F mayor — es IV en C mayor y no es diatónico en G mayor',
      'Bb mayor — es prestado de C menor',
      'F# disminuido — señala la nueva tonalidad',
    ],
    hint: 'Busca acordes comunes a ambas tonalidades. C mayor: C Dm Em F G Am Bdim. G mayor: G Am Bm C D Em F#dim. Los acordes compartidos incluyen C, Em, Am, G. E menor como iii/vi es una elección fuerte de pivote.',
  },
  l5u16m1e3: {
    prompt: '¿Cuál es el proceso típico de una modulación por acorde pivote?',
    choices: [
      'Establecer la tonalidad antigua, introducir el acorde pivote y después confirmar la nueva tonalidad con una cadencia',
      'Tocar una escala cromática entre las dos tonalidades',
      'Parar de tocar, cambiar la armadura de clave y reanudar',
      'Repetir la tónica de la nueva tonalidad hasta que el oyente se ajuste',
    ],
    hint: 'La modulación por acorde pivote se desarrolla en tres fases: (1) la tonalidad antigua se establece claramente, (2) un acorde diatónico se reinterpreta como perteneciente a la nueva tonalidad, (3) la nueva tonalidad se confirma con una cadencia (típicamente V–I).',
  },

  // ---- l5u16m2: Modulación a Tonalidades Cercanas ----

  l5u16m2e1: {
    prompt: '¿Cuántas tonalidades cercanas tiene una tonalidad mayor?',
    choices: [
      '5 — las tonalidades cuyas armaduras difieren en como máximo un sostenido o bemol',
      '2 — solo la dominante y la subdominante',
      '12 — todas las tonalidades son cercanas',
      '3 — la relativa menor, la dominante y la subdominante',
    ],
    hint: 'Las tonalidades cercanas difieren en como máximo una alteración en sus armaduras de clave. Para C mayor: G mayor (+1#), F mayor (+1b), A menor (relativa), E menor (rel. de G), D menor (rel. de F). Eso da 5 tonalidades cercanas.',
  },
  l5u16m2e2: {
    prompt:
      '¿Por qué modular a la tonalidad de la dominante (V) se considera una de las modulaciones más suaves?',
    choices: [
      'La tonalidad de la dominante difiere en solo una alteración, y las dos tonalidades comparten la mayoría de sus acordes diatónicos',
      'La tonalidad de la dominante tiene la misma nota tónica',
      'La tonalidad de la dominante no usa sostenidos ni bemoles',
      'La dominante es siempre la tonalidad con sonido más brillante',
    ],
    hint: 'C mayor y G mayor comparten 6 de 7 notas (solo F vs F#). Esta superposición significa que muchos acordes son comunes a ambas tonalidades, proporcionando abundantes opciones de acorde pivote y una transición fluida.',
  },
  l5u16m2e3: {
    prompt: '¿Cuáles de las siguientes son tonalidades cercanas de C mayor?',
    choices: [
      'G mayor, F mayor, A menor, E menor, D menor',
      'Db mayor, Ab mayor, Eb mayor, Bb mayor, F menor',
      'G mayor, D mayor, A mayor, E mayor, B mayor',
      'C menor, Eb mayor, Ab mayor, Bb mayor, F menor',
    ],
    hint: 'Las tonalidades cercanas comparten todas las alteraciones menos una con C mayor (0 sostenidos/bemoles). G mayor tiene 1#, F mayor tiene 1b, y sus relativas menores (E menor, D menor) más la relativa menor de C (A menor) completan el conjunto.',
  },

  // ---- l5u16m3: Modulación Directa / Por Nota Común / Cromática ----

  l5u16m3e1: {
    prompt: '¿Qué es una modulación directa (o de frase)?',
    choices: [
      'Una modulación que cambia a la nueva tonalidad abruptamente en un límite de frase, sin acorde pivote',
      'Una modulación que usa un acorde pivote compartido entre las dos tonalidades',
      'Una modulación que se mueve por semitono mediante conducción cromática de voces',
      'Una modulación que ocurre gradualmente a lo largo de muchos compases',
    ],
    hint: 'La modulación directa es el tipo más abrupto: una frase termina en la tonalidad antigua y la frase siguiente simplemente comienza en la nueva. Ningún acorde pivote ni preparación cromática tiende el puente. Es habitual en el pop y en los himnos.',
  },
  l5u16m3e2: {
    prompt: '¿Qué es una modulación por nota común?',
    choices: [
      'Una modulación en la que una única nota sostenida sirve de puente entre dos tonalidades, reinterpretada en el contexto de la nueva tonalidad',
      'Una modulación en la que la nota del bajo se mantiene en la tónica durante todo el pasaje',
      'Una modulación que usa solo notas comunes a ambas escalas',
      'Una modulación que resuelve hacia el acorde común de dos tonalidades',
    ],
    hint: 'En la modulación por nota común, una nota se mantiene (o se repite) mientras la armonía cambia a su alrededor. Esa nota adquiere una nueva función en la nueva tonalidad. Esta técnica funciona bien para modular a tonalidades distantes.',
  },
  l5u16m3e3: {
    prompt: '¿Qué es una modulación cromática?',
    choices: [
      'Una modulación lograda mediante la alteración cromática de una o más notas de un acorde para pivotar hacia la nueva tonalidad',
      'Una modulación que usa solo escalas cromáticas',
      'Una modulación a una tonalidad con más sostenidos o bemoles',
      'Una modulación que evita todos los acordes diatónicos',
    ],
    hint: 'La modulación cromática usa conducción de voces por semitono para transformar un acorde de la tonalidad antigua en un acorde que pertenece a la nueva. Una o más notas se mueven por semitono, redirigiendo suavemente la armonía.',
  },

  // ---- l5u16m4: Mezcla Modal — Acordes Prestados ----

  l5u16m4e1: {
    prompt:
      'Construye bVI en C mayor. Este acorde está prestado de C menor: Ab mayor (Ab, C, Eb). Selecciona las 3 notas.',
    hint: 'bVI en C mayor = Ab mayor: Ab (8), C (0), Eb (3). Este acorde está prestado de C menor natural, donde VI es Ab mayor. El Ab y el Eb son notas cromáticas en C mayor.',
  },
  l5u16m4e2: {
    prompt:
      'Construye iv en C mayor. Este acorde está prestado de C menor: F menor (F, Ab, C). Selecciona las 3 notas.',
    hint: 'iv en C mayor = F menor: F (5), Ab (8), C (0). En C mayor, IV es F mayor (F, A, C). Prestar de C menor rebaja el A a Ab, creando la subdominante menor más oscura.',
  },
  l5u16m4e3: {
    prompt:
      '¿Qué es la mezcla modal?',
    choices: [
      'Tomar prestados acordes de la tonalidad menor (o mayor) paralela para añadir color cromático sin abandonar la tonalidad de origen',
      'Mezclar dos modos diferentes como dórico y mixolidio en el mismo pasaje',
      'Tocar un acorde mayor y uno menor al mismo tiempo',
      'Alternar entre relativa mayor y relativa menor',
    ],
    hint: 'La mezcla modal toma prestados acordes de la tonalidad paralela (misma tónica, modo opuesto). En C mayor, se toma prestado de C menor: bIII (Eb), iv (Fm), bVI (Ab), bVII (Bb). Añaden oscuridad y riqueza cromática.',
  },

  // ---- l5u16m5: Tercera de Picardía ----

  l5u16m5e1: {
    prompt: '¿Qué es una tercera de Picardía (tierce de Picardie)?',
    choices: [
      'Terminar una pieza en tonalidad menor con un acorde de tónica mayor, elevando la tercera del acorde final',
      'Una progresión de acordes que usa solo terceras',
      'Un intervalo de tercera menor usado en una tonalidad mayor',
      'Un ornamento francés en trino sobre el tercer grado',
    ],
    hint: 'La tercera de Picardía es una técnica secular: una pieza en tonalidad menor termina con un acorde I mayor (p. ej., pieza en C menor que termina en C mayor). La tercera elevada crea un final brillante y resuelto tras la oscuridad del modo menor.',
  },
  l5u16m5e2: {
    prompt:
      'En la mezcla modal, ¿qué significa tomar prestado del mayor paralelo en una tonalidad menor?',
    choices: [
      'Usar acordes de la tonalidad mayor con la misma tónica, como un IV mayor o un I mayor, en un contexto de tonalidad menor',
      'Modular permanentemente a la tonalidad mayor',
      'Tocar la escala mayor sobre acordes menores',
      'Usar los acordes de la relativa mayor',
    ],
    hint: 'La mezcla modal funciona en ambas direcciones. Una tonalidad menor puede tomar prestado de su mayor paralelo: p. ej., en A menor, puedes tomar prestado IV de A mayor (D mayor en vez de D menor) para iluminar temporalmente la armonía.',
  },
  l5u16m5e3: {
    prompt:
      '¿Cuál de los siguientes es un ejemplo de mezcla modal en una tonalidad menor?',
    choices: [
      'Usar un acorde IV mayor en una tonalidad menor, prestado del mayor paralelo',
      'Usar el acorde V en una tonalidad menor (que requiere el 7.º grado elevado de la menor armónica)',
      'Modular a la relativa mayor',
      'Usar una dominante secundaria para tonicizar la dominante',
    ],
    hint: 'El acorde V en el modo menor proviene de la menor armónica — pertenece a la propia tonalidad menor, no a la mezcla modal. La mezcla modal toma prestados acordes de la tonalidad paralela. Un IV mayor en el modo menor (p. ej., D mayor en A menor en vez de D menor) es un ejemplo habitual; el Nivel 4 relacionó el mismo acorde con la menor melódica ascendente, y ambas lecturas son habituales.',
  },

  // =========================================================================
  // Unidad 17: Forma, Textura, Conducción de Voces
  // =========================================================================

  // ---- l5u17m1: Forma Binaria y Ternaria ----

  l5u17m1e1: {
    prompt: '¿Qué es la forma binaria?',
    choices: [
      'Una estructura en dos partes (A–B) en la que cada sección se repite generalmente, y B frecuentemente modula o contrasta con A',
      'Una pieza con solo dos acordes',
      'Una composición para dos instrumentos',
      'Una forma con dos secciones idénticas tocadas dos veces',
    ],
    hint: 'La forma binaria (AB) divide una pieza en dos secciones complementarias. La sección A típicamente termina lejos de la tónica (frecuentemente en V), y la sección B regresa a la tónica. Ambas secciones se repiten generalmente (||: A :||: B :||).',
  },
  l5u17m1e2: {
    prompt:
      '¿Qué distingue la forma binaria con retorno de la forma binaria simple?',
    choices: [
      'En la binaria con retorno, el material de A regresa al final de la sección B, creando una estructura semejante a ABA dentro del marco binario',
      'La binaria con retorno tiene finales de frase curvos en vez de cadencias rectas',
      'La binaria con retorno repite cada sección tres veces en vez de dos',
      'La binaria con retorno está siempre en una tonalidad menor',
    ],
    hint: "La binaria con retorno (||: A :||: B A' :||) trae de vuelta el material inicial de A al final de la sección B. La binaria simple no regresa a A. Muchos minuetos y scherzos clásicos usan forma binaria con retorno.",
  },
  l5u17m1e3: {
    prompt: '¿Qué es la forma ternaria (ABA)?',
    choices: [
      'Una estructura en tres partes en la que la primera sección regresa tras una sección central contrastante, siendo cada sección autosuficiente',
      'Una pieza con tres melodías diferentes que nunca se repiten',
      'Una forma en la que el tempo cambia tres veces',
      'Una pieza escrita en compás 3/4',
    ],
    hint: 'La forma ternaria tiene tres secciones distintas: A (exposición), B (contraste), A (retorno). A diferencia de la binaria con retorno, cada sección en la forma ternaria es armónicamente autosuficiente, terminando generalmente con una cadencia en su propia tonalidad.',
  },

  // ---- l5u17m2: Formas de Canción ----

  l5u17m2e1: {
    prompt: '¿Qué es la forma estrofa-estribillo?',
    choices: [
      'Una forma en la que las estrofas tienen la misma música pero letras diferentes, alternando con un estribillo recurrente con letra y melodía fijas',
      'Una forma en la que la estrofa y el estribillo son idénticos',
      'Una forma con solo una sección de estrofa y sin estribillo',
      'Una forma clásica usada exclusivamente en la ópera',
    ],
    hint: 'Estrofa-estribillo es la forma pop/rock más habitual. Las estrofas avanzan la historia con letras cambiantes sobre la misma música. El estribillo proporciona el clímax emocional con un gancho consistente y memorable.',
  },
  l5u17m2e2: {
    prompt: '¿Qué es la forma AABA (también llamada forma de canción de 32 compases)?',
    choices: [
      'Una forma con una sección A repetida, una sección B contrastante (puente), y un retorno final de A, típicamente 32 compases en total',
      'Una forma con cuatro secciones idénticas de 8 compases',
      'Una forma con dos estrofas y dos estribillos',
      'Una estructura de improvisación jazz sin secciones fijas',
    ],
    hint: 'AABA es la forma clásica del Tin Pan Alley / Gran Cancionero Americano. Cada sección tiene típicamente 8 compases. La sección B (puente o «middle eight») proporciona contraste antes del retorno final de A. Muchos estándares de jazz usan esta forma.',
  },
  l5u17m2e3: {
    prompt: '¿Cuáles son las tres secciones principales de la forma sonata?',
    choices: [
      'Exposición, desarrollo y recapitulación',
      'Estrofa, estribillo y puente',
      'Introducción, tema y coda',
      'Preludio, fuga y postludio',
    ],
    hint: 'Forma sonata: la exposición presenta dos temas contrastantes en tonalidades diferentes, el desarrollo los fragmenta y transforma por tonalidades distantes, y la recapitulación reexpone ambos temas en la tonalidad de origen.',
  },

  // ---- l5u17m3: Textura ----

  l5u17m3e1: {
    prompt: '¿Qué es la textura monofónica?',
    choices: [
      'Una única línea melódica sin acompañamiento ni armonía — una voz, una altura cada vez',
      'Una melodía con acompañamiento de acordes por debajo',
      'Múltiples melodías independientes sonando simultáneamente',
      'Un instrumento solo tocando acordes',
    ],
    hint: 'La monofonía es la textura más simple: una única melodía sin acompañamiento. Aunque muchas personas canten o toquen la misma melodía (al unísono o en octavas), sigue siendo monofónico porque hay solo una línea musical.',
  },
  l5u17m3e2: {
    prompt: '¿Qué es la textura polifónica?',
    choices: [
      'Dos o más líneas melódicas independientes sonando simultáneamente, cada una con su propio ritmo y contorno',
      'Una única melodía tocada por muchos instrumentos al unísono',
      'Una melodía apoyada por bloques de acordes',
      'Música sin melodía discernible',
    ],
    hint: 'La polifonía presenta múltiples voces independientes, cada una con interés melódico. Una fuga de Bach es el ejemplo clásico: cada voz entra con el mismo tema pero después se mueve independientemente, tejiendo una red contrapuntística compleja.',
  },
  l5u17m3e3: {
    prompt: '¿Qué es la textura homofónica?',
    choices: [
      'Una melodía principal acompañada por acordes o soporte armónico, en la que todas las partes se mueven al mismo ritmo o apoyan la melodía',
      'Todas las voces cantando la misma melodía a la misma altura',
      'Dos melodías igualmente importantes entrelazadas',
      'Música sin ninguna melodía, consistente solo en patrones rítmicos',
    ],
    hint: 'La homofonía tiene una melodía dominante con acompañamiento armónico. La mayoría del pop, rock y música clásica del periodo Clásico en adelante es homofónica. Un cantante con acordes de guitarra es un ejemplo claro.',
  },

  // ---- l5u17m4: Líneas de Notas Guía ----

  l5u17m4e1: {
    prompt: '¿Qué son las notas guía?',
    choices: [
      'La 3.ª y la 7.ª de cada acorde, que definen su cualidad y crean conducción de voces suave entre acordes',
      'La fundamental y la 5.ª de cada acorde',
      'Las notas de la melodía que caen en los tiempos fuertes',
      'Notas cromáticas de paso entre notas del acorde',
    ],
    hint: 'Las notas guía (3.as y 7.as) son las notas armónicamente más definitorias de un acorde. La fundamental y la 5.ª son estructuralmente importantes pero genéricas; la 3.ª determina mayor/menor y la 7.ª determina el tipo de acorde.',
  },
  l5u17m4e2: {
    prompt:
      'En una progresión ii7–V7–I en C mayor (Dm7–G7–Cmaj7), ¿cómo se mueven las notas guía?',
    choices: [
      'Las notas guía se mueven por grado o se mantienen como notas comunes: F–C en Dm7, F–B en G7, E–B en Cmaj7',
      'Las notas guía saltan por intervalos amplios entre cada acorde',
      'Las notas guía se mantienen en las mismas notas a lo largo de los tres acordes',
      'Las notas guía siguen exactamente la línea del bajo',
    ],
    hint: 'Notas guía de Dm7: F (3.ª), C (7.ª). Hacia G7: F se mantiene como nota común y se convierte en la 7.ª, mientras C baja un semitono a B, la 3.ª. Hacia Cmaj7: B se mantiene y se convierte en la 7.ª, mientras F baja un semitono a E, la 3.ª. Movimiento mínimo = conducción de voces suave.',
  },
  l5u17m4e3: {
    prompt:
      '¿Cuál es el principio fundamental de conducción de voces que las notas guía ilustran?',
    choices: [
      'Mover cada voz a la nota del acorde más cercana disponible, prefiriendo movimiento por grado y notas comunes a saltos',
      'Todas las voces deben moverse en movimiento paralelo en todo momento',
      'Cada voz debe saltar a la nota del acorde más distante para crear variedad',
      'La voz superior debe siempre subir mientras la inferior desciende',
    ],
    hint: 'Una buena conducción de voces minimiza el movimiento: mantener notas comunes, mover las otras voces por grado. Esto crea progresiones armónicas suaves y conectadas. Las líneas de notas guía demuestran este principio con solo las dos notas más esenciales por acorde.',
  },
};

export default overlay;
