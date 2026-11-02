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
      'Construye V/V en C mayor. Selecciona las 3 notas.',
    hint: 'V/V en C significa «el acorde V de G mayor». La dominante de G es D mayor: D (2), F# (6), A (9). El F# es cromático — no pertenece a C mayor.',
  },
  l5u15m1e2: {
    prompt:
      'Construye V7/V en C mayor. Selecciona las 4 notas.',
    hint: 'V7/V en C = D7: D (2), F# (6), A (9), C (0). La séptima menor añadida (C) refuerza la atracción hacia G. El F# es la alteración cromática.',
  },
  l5u15m1e3: {
    prompt: '¿Qué es V/V?',
    choices: [
      'Una dominante secundaria que toniciza el acorde dominante de la tonalidad',
      'El quinto acorde de la tonalidad tocado dos veces seguidas, para dar más peso a la dominante',
      'Un acorde disminuido construido sobre el segundo grado de la escala mayor de la tonalidad',
      'El acorde dominante de la tonalidad en segunda inversión',
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
      'Una tríada mayor o acorde de séptima dominante que resuelve hacia un acorde diatónico distinto de I, funcionando siempre como V de ese acorde',
      'El V7 diatónico de la tonalidad principal, un acorde de séptima dominante que resuelve hacia I, funcionando como V de la tónica',
      'Un acorde que modula permanentemente a una nueva tonalidad',
      'El acorde V de la tonalidad principal que resuelve hacia vi en lugar de hacia I, como ocurre en una cadencia rota',
    ],
    hint: 'Una dominante aplicada funciona temporalmente como V (o V7) de un acorde diatónico. Introduce notas cromáticas para crear una resolución de sensible hacia su objetivo, sin establecer una nueva tonalidad.',
  },

  // ---- l5u15m3: Acordes de Sensible Secundaria ----

  l5u15m3e1: {
    prompt:
      '¿Cuál es la función de un acorde de sensible secundaria (p. ej., vii°/V)?',
    choices: [
      'Funciona como un acorde disminuido que resuelve medio tono arriba hacia el acorde tonicizado',
      'Funciona como un acorde disminuido cuya fundamental resuelve una 5.ª hacia abajo, como el V7, hacia el acorde tonicizado',
      'Funciona como un único acorde de paso decorativo entre otros dos acordes, sin atracción armónica propia',
      'Es la sensible de la tonalidad principal, tocada sola como una única nota de la melodía por encima del bajo',
    ],
    hint: 'vii°/V funciona del mismo modo que vii° en una tonalidad: la fundamental está medio tono por debajo del acorde objetivo, y la cualidad disminuida crea un fuerte impulso de resolución ascendente hacia el objetivo.',
  },
  l5u15m3e2: {
    prompt:
      '¿Cuál es la diferencia entre un acorde de séptima semidisminuida y uno de séptima totalmente disminuida en el contexto de acordes de sensible secundaria?',
    choices: [
      'El semidisminuido tiene una 7.ª menor sobre la fundamental; el totalmente disminuido, una 7.ª disminuida (un semitono más baja)',
      'El semidisminuido resuelve hacia arriba; el totalmente disminuido resuelve hacia abajo',
      'El semidisminuido se usa solo en tonalidades mayores y el totalmente disminuido solo en tonalidades menores, nunca al revés en ningún caso',
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
      'F mayor (IV) — vii°/V sigue hacia la subdominante, el acorde habitual antes de V',
      'D menor (ii) — vii°/V resuelve medio tono abajo hacia la supertónica',
    ],
    hint: 'El «/V» indica el objetivo: V. En C mayor, V es G. vii°/V es F# disminuido (F#, A, C), y el F# resuelve medio tono arriba hacia G, la fundamental del acorde objetivo.',
  },

  // ---- l5u15m4: Tonicización vs. Modulación ----

  l5u15m4e1: {
    prompt: '¿Qué es la tonicización?',
    choices: [
      'Un énfasis breve y temporal en un acorde no tónica utilizando su propia dominante, sin abandonar la tonalidad original',
      'Un cambio permanente de la tonalidad original a una nueva tónica, preparado por su propia dominante y confirmado por una cadencia',
      'Tocar el acorde de tónica una y otra vez, en todas las voces y registros, hasta que la tonalidad principal quede bien establecida',
      'Transponer una melodía y su acompañamiento a una nueva tonalidad para oír el pasaje en otro nivel de altura',
    ],
    hint: 'La tonicización es fugaz: una dominante secundaria o acorde de sensible trata brevemente un acorde diatónico como tónica local, pero la tonalidad original mantiene el control. Piensa en ello como un desvío momentáneo.',
  },
  l5u15m4e2: {
    prompt: '¿Cómo se distingue la modulación de la tonicización?',
    choices: [
      'La modulación establece una nueva tonalidad con cadencias y pasajes largos; la tonicización es breve y regresa',
      'La tonicización establece la nueva tonalidad con cadencias y pasajes largos; la modulación es la breve, que regresa',
      'La modulación ocurre al final de una pieza y la tonicización en medio, antes de la cadencia final',
      'No hay diferencia real; los términos son intercambiables',
    ],
    hint: 'La prueba clave: ¿el nuevo centro tonal se mantiene con sus propias cadencias y pasajes estables? Si es así, es modulación. Si la tonalidad original se reafirma rápidamente, es solo tonicización.',
  },
  l5u15m4e3: {
    prompt:
      'Cuando una tonicización se prolonga durante varios compases pero no establece completamente la nueva tonalidad, ¿cómo se denomina?',
    choices: [
      'Una tonicización prolongada — más larga que un solo acorde pero sin confirmación cadencial completa en la nueva tonalidad',
      'Una modulación por acorde pivote — cambio de tonalidad a través de un acorde común a la tonalidad antigua y a la nueva',
      'Una cadencia rota',
      'Una secuencia cromática',
    ],
    hint: 'Las tonicizaciones prolongadas ocupan una zona gris: duran más que un rápido V/x – x, pero la nueva tonalidad nunca se confirma con una cadencia fuerte. La frontera entre tonicización prolongada y modulación es subjetiva.',
  },

  // ---- l5u15m5: Cadenas de Dominantes ----

  l5u15m5e1: {
    prompt: '¿Qué es una cadena de dominantes secundarias?',
    choices: [
      'Una secuencia en la que cada acorde funciona como V7 del siguiente, pasando por múltiples tonicizaciones antes de resolver en la tónica',
      'Tocar el acorde V de cada tonalidad mayor en sucesión',
      'Una secuencia de tonicizaciones en la que cada acorde de 7.ª funciona como IV del siguiente, pasando por varias tonalidades mayores en sucesión antes de resolver en la tónica',
      'Alternar entre I y V repetidamente',
    ],
    hint: 'Una cadena de dominantes crea tensión en cascada: p. ej., V7/vi – V7/ii – V7/V – V7 – I. Cada acorde de séptima dominante resuelve hacia el eslabón siguiente, arrastrando la armonía de vuelta a la tónica a través de un ciclo.',
  },
  l5u15m5e2: {
    prompt:
      'En una cadena de dominantes secundarias descendente por quintas (p. ej., V7/vi – V7/ii – V7/V – V – I en C mayor), ¿qué movimiento de fundamentales enlaza cada acorde?',
    choices: [
      'Cada fundamental desciende una quinta justa (o asciende una cuarta justa) hacia la siguiente',
      'Cada fundamental asciende un semitono cromáticamente, porque cada dominante queda un semitono por encima de su objetivo',
      'Cada fundamental desciende un tono, de modo que la cadena desciende por las notas de la escala mayor',
      'Las fundamentales alternan entre terceras ascendentes y terceras descendentes, sin moverse nunca por quinta',
    ],
    hint: 'Las cadenas de dominantes explotan el movimiento de fundamentales más fuerte de la música tonal: quinta descendente. Cada V7 resuelve una quinta por debajo hacia su objetivo, y ese objetivo se reinterpreta como el siguiente V7.',
  },
  l5u15m5e3: {
    prompt: '¿Qué es la tonicización secuencial?',
    choices: [
      'Un patrón en el que el mismo gesto de tonicización (p. ej., V7 – objetivo) se repite en diferentes niveles de altura',
      'Una modulación que pasa por todas las doce tonalidades del círculo de quintas, una tras otra y sin detenerse nunca en ninguna',
      'Practicar escalas una tras otra en muchas tonalidades, para que todas resulten familiares al intérprete',
      'Una serie de cadencias rotas en diferentes tonalidades, que caen en el acorde vi de una nueva tonalidad en lugar de en su tónica',
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
      'Un acorde común a ambas tonalidades',
      'El primer acorde que se oye en la nueva tonalidad y que contiene una nota cromática ajena a la tonalidad antigua',
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
      'Bb mayor — es prestado de C menor y no es diatónico en G mayor',
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
      'Establecer la nueva tonalidad, introducir el acorde pivote entre las dos tonalidades y después confirmar la tonalidad antigua con una cadencia',
    ],
    hint: 'La modulación por acorde pivote se desarrolla en tres fases: (1) la tonalidad antigua se establece claramente, (2) un acorde diatónico se reinterpreta como perteneciente a la nueva tonalidad, (3) la nueva tonalidad se confirma con una cadencia (típicamente V–I).',
  },

  // ---- l5u16m2: Modulación a Tonalidades Cercanas ----

  l5u16m2e1: {
    prompt: '¿Cuántas tonalidades cercanas tiene una tonalidad mayor?',
    choices: [
      '5 — las otras tonalidades que difieren de la principal en como máximo un sostenido o bemol',
      '2 — solo la dominante y la subdominante',
      '12 — todas las tonalidades son cercanas',
      '3 — la relativa menor, la dominante y la subdominante, y ninguna otra tonalidad más',
    ],
    hint: 'Las tonalidades cercanas difieren en como máximo una alteración en sus armaduras de clave. Para C mayor: G mayor (+1#), F mayor (+1b), A menor (relativa), E menor (rel. de G), D menor (rel. de F). Eso da 5 tonalidades cercanas.',
  },
  l5u16m2e2: {
    prompt:
      '¿Por qué modular a la tonalidad de la dominante (V) se considera una de las modulaciones más suaves?',
    choices: [
      'La tonalidad de la dominante difiere en solo una alteración, y las dos tonalidades comparten la mayoría de sus acordes diatónicos',
      'Las dos tonalidades comparten solo un acorde, el V de la tonalidad principal, que pasa a ser la nueva tónica',
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
      'Una modulación que cambia a la nueva tonalidad abruptamente en un límite de frase, sin ningún acorde pivote',
      'Una modulación que usa un acorde pivote compartido entre las dos tonalidades',
      'Una modulación que se desliza gradualmente medio tono arriba o abajo usando conducción cromática de voces',
      'Una modulación que ocurre gradualmente a lo largo de muchos compases',
    ],
    hint: 'La modulación directa es el tipo más abrupto: una frase termina en la tonalidad antigua y la frase siguiente simplemente comienza en la nueva. Ningún acorde pivote ni preparación cromática tiende el puente. Es habitual en el pop y en los himnos.',
  },
  l5u16m3e2: {
    prompt: '¿Qué es una modulación por nota común?',
    choices: [
      'Una modulación en la que una nota sostenida enlaza dos tonalidades y se vuelve a oír en la nueva',
      'Una modulación en la que un acorde se reescribe enarmónicamente para que el mismo sonido pertenezca a dos tonalidades lejanas',
      'Una modulación que usa solo notas comunes a ambas escalas',
      'Una modulación que resuelve hacia un acorde común a las dos tonalidades y después se queda en él como nueva tónica',
    ],
    hint: 'En la modulación por nota común, una nota se mantiene (o se repite) mientras la armonía cambia a su alrededor. Esa nota adquiere una nueva función en la nueva tonalidad. Esta técnica funciona bien para modular a tonalidades distantes.',
  },
  l5u16m3e3: {
    prompt: '¿Qué es una modulación cromática?',
    choices: [
      'Una modulación lograda mediante la alteración cromática de una o más notas de un acorde para pivotar hacia la nueva tonalidad',
      'Una modulación hacia la nueva tonalidad a través de un acorde pivote diatónico común a ambas, sin alteración cromática de sus notas',
      'Una modulación a una tonalidad con más sostenidos o bemoles',
      'Una modulación que evita todos los acordes diatónicos',
    ],
    hint: 'La modulación cromática usa conducción de voces por semitono para transformar un acorde de la tonalidad antigua en un acorde que pertenece a la nueva. Una o más notas se mueven por semitono, redirigiendo suavemente la armonía.',
  },

  // ---- l5u16m4: Mezcla Modal — Acordes Prestados ----

  l5u16m4e1: {
    prompt:
      'Construye bVI en C mayor, un acorde prestado de C menor. Selecciona las 3 notas.',
    hint: 'bVI en C mayor = Ab mayor: Ab (8), C (0), Eb (3). Este acorde está prestado de C menor natural, donde VI es Ab mayor. El Ab y el Eb son notas cromáticas en C mayor.',
  },
  l5u16m4e2: {
    prompt:
      'Construye iv en C mayor, un acorde prestado de C menor. Selecciona las 3 notas.',
    hint: 'iv en C mayor = F menor: F (5), Ab (8), C (0). En C mayor, IV es F mayor (F, A, C). Prestar de C menor rebaja el A a Ab, creando la subdominante menor más oscura.',
  },
  l5u16m4e3: {
    prompt:
      '¿Qué es la mezcla modal?',
    choices: [
      'Tomar acordes de la tonalidad paralela',
      'Mezclar libremente las escalas de dos tonalidades sin relación, como C mayor y F# mayor, en un mismo pasaje musical',
      'Tocar un acorde mayor y uno menor al mismo tiempo',
      'Tomar acordes de la tonalidad relativa mayor o menor',
    ],
    hint: 'La mezcla modal toma prestados acordes de la tonalidad paralela (misma tónica, modo opuesto). En C mayor, se toma prestado de C menor: bIII (Eb), iv (Fm), bVI (Ab), bVII (Bb). Añaden oscuridad y riqueza cromática.',
  },

  // ---- l5u16m5: Tercera de Picardía ----

  l5u16m5e1: {
    prompt: '¿Qué es una tercera de Picardía (tierce de Picardie)?',
    choices: [
      'Terminar una pieza en tonalidad menor con un acorde de tónica mayor, elevando solo la tercera del acorde final',
      'Una progresión de acordes que usa solo terceras',
      'Un intervalo de tercera menor usado en una tonalidad mayor',
      'Terminar una pieza en tonalidad mayor con un acorde de tónica menor, bajando la tercera del acorde final',
    ],
    hint: 'La tercera de Picardía es una técnica secular: una pieza en tonalidad menor termina con un acorde I mayor (p. ej., pieza en C menor que termina en C mayor). La tercera elevada crea un final brillante y resuelto tras la oscuridad del modo menor.',
  },
  l5u16m5e2: {
    prompt:
      'En la mezcla modal, ¿qué significa tomar prestado del mayor paralelo en una tonalidad menor?',
    choices: [
      'Usar acordes de la tonalidad mayor con la misma tónica en un contexto de tonalidad menor',
      'Modular permanentemente a la relativa mayor, la tonalidad mayor que tiene la misma armadura de clave',
      'Tocar la escala mayor sobre acordes menores',
      'Usar acordes de la relativa mayor en un contexto de tonalidad menor',
    ],
    hint: 'La mezcla modal funciona en ambas direcciones. Una tonalidad menor puede tomar prestado de su mayor paralelo: p. ej., en A menor, puedes tomar prestado IV de A mayor (D mayor en vez de D menor) para iluminar temporalmente la armonía.',
  },
  l5u16m5e3: {
    prompt:
      '¿Cuál de los siguientes es un ejemplo de mezcla modal en una tonalidad menor?',
    choices: [
      'Usar un acorde IV mayor en una tonalidad menor, prestado del mayor paralelo',
      'Usar el acorde V en una tonalidad menor (que requiere el 7.º grado elevado de la menor armónica)',
      'Modular a la relativa mayor y confirmarla con una cadencia en esa tonalidad',
      'Usar una dominante secundaria para tonicizar la dominante, como cuando V/V pasa a V en la tonalidad menor',
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
      'Una estructura en tres partes (A–B–A) en la que la primera sección regresa después de B',
    ],
    hint: 'La forma binaria (AB) divide una pieza en dos secciones complementarias. La sección A típicamente termina lejos de la tónica (frecuentemente en V), y la sección B regresa a la tónica. Ambas secciones se repiten generalmente (||: A :||: B :||).',
  },
  l5u17m1e2: {
    prompt:
      '¿Qué distingue la forma binaria con retorno de la forma binaria simple?',
    choices: [
      'En la binaria con retorno, el material de A vuelve al final de B, dando una forma tipo ABA dentro de la binaria',
      'En la binaria con retorno, la sección A vuelve completa como una tercera sección separada, así que la forma es en realidad ternaria',
      'La binaria con retorno repite cada sección tres veces en vez de dos',
      'La binaria con retorno está siempre en una tonalidad menor',
    ],
    hint: "La binaria con retorno (||: A :||: B A' :||) trae de vuelta el material inicial de A al final de la sección B. La binaria simple no regresa a A. Muchos minuetos y scherzos clásicos usan forma binaria con retorno.",
  },
  l5u17m1e3: {
    prompt: '¿Qué es la forma ternaria (ABA)?',
    choices: [
      'Una estructura en tres partes en la que la primera sección regresa tras una sección central contrastante',
      'Una pieza con tres melodías diferentes que nunca se repiten',
      'Una estructura en dos partes en la que la primera sección se repite y después una sección contrastante termina la pieza',
      'Una pieza escrita en compás 3/4',
    ],
    hint: 'La forma ternaria tiene tres secciones distintas: A (exposición), B (contraste), A (retorno). A diferencia de la binaria con retorno, cada sección en la forma ternaria es armónicamente autosuficiente, terminando generalmente con una cadencia en su propia tonalidad.',
  },

  // ---- l5u17m2: Formas de Canción ----

  l5u17m2e1: {
    prompt: '¿Qué es la forma estrofa-estribillo?',
    choices: [
      'Una forma en la que estrofas con letras nuevas alternan con un estribillo recurrente',
      'Una forma en la que la estrofa y el estribillo usan música, letra y melodía idénticas de principio a fin',
      'Una forma con solo una sección de estrofa y sin estribillo',
      'Una forma clásica usada exclusivamente en la ópera, en la que los actos se cantan de seguido sin repeticiones',
    ],
    hint: 'Estrofa-estribillo es la forma pop/rock más habitual. Las estrofas avanzan la historia con letras cambiantes sobre la misma música. El estribillo proporciona el clímax emocional con un gancho consistente y memorable.',
  },
  l5u17m2e2: {
    prompt: '¿Qué es la forma AABA (también llamada forma de canción de 32 compases)?',
    choices: [
      'Una forma con una sección A repetida y un puente contrastante antes de que A regrese, generalmente en 32 compases',
      'Una forma con cuatro secciones idénticas de 8 compases, que copian la primera: 32 compases seguidos de la misma música',
      'Una forma con dos estrofas y dos estribillos que se alternan, más un breve interludio instrumental que repite la melodía del estribillo',
      'Una estructura de improvisación jazz sin secciones fijas',
    ],
    hint: 'AABA es la forma clásica del Tin Pan Alley / Gran Cancionero Americano. Cada sección tiene típicamente 8 compases. La sección B (puente o «middle eight») proporciona contraste antes del retorno final de A. Muchos estándares de jazz usan esta forma.',
  },
  l5u17m2e3: {
    prompt: '¿Cuáles son las tres secciones principales de la forma sonata?',
    choices: [
      'Exposición, desarrollo y recapitulación',
      'Estrofa, estribillo y puente',
      'Introducción, desarrollo y recapitulación',
      'Preludio, fuga y postludio',
    ],
    hint: 'Forma sonata: la exposición presenta dos temas contrastantes en tonalidades diferentes, el desarrollo los fragmenta y transforma por tonalidades distantes, y la recapitulación reexpone ambos temas en la tonalidad de origen.',
  },

  // ---- l5u17m3: Textura ----

  l5u17m3e1: {
    prompt: '¿Qué es la textura monofónica?',
    choices: [
      'Una única línea melódica sin acompañamiento ni armonía — una voz, una altura cada vez',
      'Una melodía con acompañamiento de acordes por debajo, tocados por un pianista o un guitarrista en bloque',
      'Varias melodías independientes que suenan a la vez, cada una con su propio ritmo y contorno',
      'Un instrumento solo tocando una sucesión de acordes, sin ninguna melodía por encima',
    ],
    hint: 'La monofonía es la textura más simple: una única melodía sin acompañamiento. Aunque muchas personas canten o toquen la misma melodía (al unísono o en octavas), sigue siendo monofónico porque hay solo una línea musical.',
  },
  l5u17m3e2: {
    prompt: '¿Qué es la textura polifónica?',
    choices: [
      'Dos o más líneas melódicas independientes sonando simultáneamente con sus propios ritmos y contornos',
      'Una única melodía tocada por muchos instrumentos al unísono, con las partes compartiendo el mismo ritmo y el mismo contorno',
      'Una melodía principal apoyada por bloques de acordes que se mueven al mismo ritmo que la línea situada por encima',
      'Música sin melodía discernible, en la que solo el ritmo y la armonía sostienen el interés musical',
    ],
    hint: 'La polifonía presenta múltiples voces independientes, cada una con interés melódico. Una fuga de Bach es el ejemplo clásico: cada voz entra con el mismo tema pero después se mueve independientemente, tejiendo una red contrapuntística compleja.',
  },
  l5u17m3e3: {
    prompt: '¿Qué es la textura homofónica?',
    choices: [
      'Una melodía principal acompañada por acordes o soporte armónico, en la que todas las partes se mueven al mismo ritmo o apoyan la melodía',
      'Todas las voces cantando la misma melodía a la misma altura y al mismo ritmo',
      'Dos o más melodías independientes e igualmente importantes, cada una con su propio ritmo',
      'Música sin ninguna melodía, consistente solo en patrones rítmicos tocados con instrumentos de percusión sin altura definida',
    ],
    hint: 'La homofonía tiene una melodía dominante con acompañamiento armónico. La mayoría del pop, rock y música clásica del periodo Clásico en adelante es homofónica. Un cantante con acordes de guitarra es un ejemplo claro.',
  },

  // ---- l5u17m4: Líneas de Notas Guía ----

  l5u17m4e1: {
    prompt: '¿Qué son las notas guía?',
    choices: [
      'La 3.ª y la 7.ª que definen la cualidad de cada acorde y enlazan los acordes con suavidad',
      'La fundamental y la 5.ª, porque la fundamental da nombre al acorde y la 5.ª decide si es mayor o menor',
      'Las notas de la melodía que caen en los tiempos fuertes de cada compás, por ser las notas que más se oyen en la pieza',
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
      'Las notas guía se mantienen siempre en las mismas dos notas a lo largo de los tres acordes: F–C en Dm7, G7 y Cmaj7',
      'Las notas guía siguen exactamente la línea del bajo',
    ],
    hint: 'Notas guía de Dm7: F (3.ª), C (7.ª). Hacia G7: F se mantiene como nota común y se convierte en la 7.ª, mientras C baja un semitono a B, la 3.ª. Hacia Cmaj7: B se mantiene y se convierte en la 7.ª, mientras F baja un semitono a E, la 3.ª. Movimiento mínimo = conducción de voces suave.',
  },
  l5u17m4e3: {
    prompt:
      '¿Cuál es el principio fundamental de conducción de voces que las notas guía ilustran?',
    choices: [
      'Mover cada voz a la nota del acorde más cercana',
      'Todas las voces deben moverse en movimiento paralelo en todo momento',
      'Cada voz debe moverse a la fundamental del acorde siguiente',
      'La voz superior debe siempre subir mientras la inferior desciende',
    ],
    hint: 'Una buena conducción de voces minimiza el movimiento: mantener notas comunes, mover las otras voces por grado. Esto crea progresiones armónicas suaves y conectadas. Las líneas de notas guía demuestran este principio con solo las dos notas más esenciales por acorde.',
  },
};

export default overlay;
