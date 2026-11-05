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
      "El acorde que hace que la dominante suene brevemente como una tónica local",
      "El acorde que hace que la subdominante suene brevemente como una tónica local",
      "El acorde que hace que la supertónica suene brevemente como una tónica local",
      "El acorde que hace que la submediante suene brevemente como una tónica local",
    ],
    hint: 'V/V significa «la dominante de la dominante». En C mayor, V es G. La dominante de G es D mayor. Por tanto, V/V en C = D mayor, un acorde cromático que toniciza temporalmente G.',
  },

  // ---- l5u15m2: Dominantes Secundarias de ii, iii, IV, vi ----

  l5u15m2e1: {
    prompt: "Construye V/ii en C mayor. Selecciona las 3 notas.",

    hint: 'En C mayor, ii es D menor. La dominante de D menor es A mayor (A, C#, E). El C# es la nota cromática que crea la sensible de D.',
  },
  l5u15m2e2: {
    prompt: "Construye V/IV en C mayor. Selecciona las 3 notas.",

    hint: 'V/IV significa la dominante de IV. En C mayor, IV es F. La dominante de F es C mayor. Esto es inusual porque C mayor ya es la tónica — el contexto determina si funciona como I o V/IV.',
  },
  l5u15m2e3: {
    prompt: '¿Qué define una dominante aplicada (secundaria)?',
    choices: [
      'Una tríada mayor o acorde de séptima de dominante que resuelve hacia un acorde diatónico distinto de I, funcionando siempre como V de ese acorde',
      'Una tríada mayor o acorde de séptima de dominante que resuelve hacia I, funcionando siempre como V de la tónica original',
      'Una tríada mayor o séptima de dominante que establece una nueva tonalidad de modo permanente, confirmada por una cadencia',
      'Una tríada menor o acorde de séptima menor que resuelve hacia I, funcionando siempre como V de la tónica original',
    ],
    hint: 'Una dominante aplicada funciona temporalmente como V (o V7) de un acorde diatónico. Introduce notas cromáticas para crear una resolución de sensible hacia su objetivo, sin establecer una nueva tonalidad.',
  },

  // ---- l5u15m3: Acordes de Sensible Secundaria ----

  l5u15m3e1: {
    prompt:
      '¿Cuál es la función de un acorde de sensible secundaria (p. ej., vii°/V)?',
    choices: [
      'Su fundamental sube un semitono a la fundamental del acorde tonicizado',
      'Su fundamental baja un semitono a la fundamental del acorde tonicizado',
      'Su fundamental baja una quinta justa a la fundamental del acorde tonicizado',
      'Su fundamental sube una quinta justa a la fundamental del acorde tonicizado',
    ],
    hint: 'vii°/V funciona del mismo modo que vii° en una tonalidad: la fundamental está un semitono por debajo del acorde objetivo, y la cualidad disminuida crea un fuerte impulso de resolución ascendente hacia el objetivo.',
    nudge: 'Piensa en lo que hace el vii° en una tonalidad: su fundamental es la sensible. En el vii°/V, ¿de qué acorde es sensible esa fundamental, y hacia dónde tiende a ir una sensible?',
  },
  l5u15m3e2: {
    prompt:
      '¿Cuál es la diferencia entre un acorde de séptima semidisminuida y uno de séptima totalmente disminuida en el contexto de acordes de sensible secundaria?',
    choices: [
      "El semidisminuido tiene una 7.ª menor sobre la fundamental; el totalmente disminuido, una 7.ª disminuida (un semitono más baja)",
      'El semidisminuido tiene una 7.ª disminuida sobre la fundamental; el totalmente disminuido, una 7.ª menor (un semitono más alta)',
      'El semidisminuido tiene una 7.ª menor sobre la fundamental; el totalmente disminuido, una 7.ª menor (el mismo intervalo)',
      'El semidisminuido tiene una 7.ª disminuida sobre la fundamental; el totalmente disminuido, una 7.ª disminuida (el mismo intervalo)',
    ],
    hint: 'Ambos tienen una tríada disminuida (fundamental, 3.ª menor, 5.ª disminuida). La séptima difiere: semidisminuido tiene séptima menor (10 semitonos), totalmente disminuido tiene séptima disminuida (9 semitonos). El totalmente disminuido es más habitual como acorde de sensible secundaria.',
  },
  l5u15m3e3: {
    prompt:
      'En C mayor, ¿cuál es el acorde objetivo hacia el que resuelve vii°/V?',
    choices: [
      'G mayor',
      'C mayor',
      'F mayor',
      'D menor',
    ],
    hint: 'El «/V» indica el objetivo: V. En C mayor, V es G. vii°/V es F# disminuido (F#, A, C), y el F# resuelve un semitono arriba hacia G, la fundamental del acorde objetivo.',
  },

  // ---- l5u15m4: Tonicización vs. Modulación ----

  l5u15m4e1: {
    prompt: '¿Qué es la tonicización?',
    choices: [
      "Hacer que otro acorde suene brevemente como punto de reposo, manteniendo el pasaje en la tonalidad original",
      "Un cambio permanente de la tonalidad original a una nueva tónica, preparado por su propia dominante y confirmado por una cadencia",
      "Tocar el acorde de tónica una y otra vez, en todas las voces y registros, hasta que la tonalidad principal quede bien establecida",
      "Transponer una melodía y su acompañamiento a una nueva tonalidad para oír el pasaje en otro nivel de altura",
    ],
    hint: 'La tonicización es fugaz: una dominante secundaria o acorde de sensible trata brevemente un acorde diatónico como tónica local, pero la tonalidad original mantiene el control. Piensa en ello como un desvío momentáneo.',
  },
  l5u15m4e2: {
    prompt: '¿Cómo se distingue la modulación de la tonicización?',
    choices: [
      "La modulación establece una nueva tonalidad; la tonicización destaca brevemente un acorde",
      "La tonicización establece una nueva tonalidad; la modulación destaca brevemente un acorde",
      "La modulación y la tonicización establecen ambas una nueva tonalidad",
      "La modulación y la tonicización destacan ambas brevemente un acorde",
    ],
    hint: 'La prueba clave: ¿el nuevo centro tonal se mantiene con sus propias cadencias y pasajes estables? Si es así, es modulación. Si la tonalidad original se reafirma rápidamente, es solo tonicización.',
  },
  l5u15m4e3: {
    prompt:
      'Cuando un acorde distinto de la tónica se destaca como tónica local durante varios compases pero ninguna cadencia confirma una nueva tonalidad, ¿cómo se llama?',
    choices: [
      "Una tonicización prolongada",
      "Una modulación por acorde pivote",
      "Una cadencia rota",
      "Una secuencia cromática",
    ],
    hint: 'Las tonicizaciones prolongadas ocupan una zona gris: duran más que un rápido V/x – x, pero la nueva tonalidad nunca se confirma con una cadencia fuerte. La frontera entre tonicización prolongada y modulación es subjetiva.',
  },

  // ---- l5u15m5: Cadenas de Dominantes ----

  l5u15m5e1: {
    prompt: '¿Qué es una cadena de dominantes secundarias?',
    choices: [
      'En una cadena de V7, cada objetivo está una cuarta justa por encima de su dominante',
      'En una cadena de V7, cada objetivo vuelve a ser la tónica inicial',
      'En una cadena de V7, cada objetivo está un tono por encima de su dominante',
      'En una cadena de V7, cada objetivo está una tercera menor por encima de su dominante',
    ],
    hint: 'Una cadena de dominantes crea tensión en cascada: p. ej., V7/vi – V7/ii – V7/V – V7 – I. Cada acorde de séptima de dominante resuelve hacia el eslabón siguiente, arrastrando la armonía de vuelta a la tónica a través de un ciclo.',
  },
  l5u15m5e2: {
    prompt:
      'En una cadena de dominantes secundarias (p. ej., V7/vi – V7/ii – V7/V – V – I en C mayor), ¿qué movimiento de fundamentales enlaza cada acorde?',
    choices: [
      'Cada fundamental baja una quinta justa (o sube una cuarta justa) hasta la siguiente',
      'Cada fundamental baja una cuarta justa (o sube una quinta justa) hasta la siguiente',
      'Cada fundamental baja una segunda mayor (o sube una séptima menor) hasta la siguiente',
      'Cada fundamental baja una tercera menor (o sube una sexta mayor) hasta la siguiente',
    ],
    hint: 'Las cadenas de dominantes explotan el movimiento de fundamentales más fuerte de la música tonal: quinta descendente. Cada V7 resuelve una quinta por debajo hacia su objetivo, y ese objetivo se reinterpreta como el siguiente V7.',
  },
  l5u15m5e3: {
    prompt: '¿Qué es la tonicización secuencial?',
    choices: [
      'Un patrón en el que el mismo gesto de tonicización (p. ej., V7 – objetivo) se repite en diferentes niveles de altura',
      "Un patrón en el que el mismo gesto de tonicización (p. ej., V7 - objetivo) se invierte en orden en cada nuevo nivel de altura",
      "Un patrón en el que el mismo gesto de tonicización (p. ej., V7 - objetivo) se repite en un único nivel de altura sin cambios",
      "Un patrón en el que el mismo gesto de tonicización (p. ej., V7 - objetivo) se sustituye por acordes sin relación en cada nivel de altura",
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
      "Una armonía que pertenece a ambas tonalidades",
      "Una armonía que pertenece a la nueva tonalidad pero no a la antigua",
      "Una armonía que pertenece a la tonalidad antigua pero no a la nueva",
      "Una armonía que no pertenece a ninguna tonalidad y no tiene función compartida",
    ],
    hint: 'Un acorde pivote es diatónico en ambas tonalidades. Por ejemplo, al modular de C mayor a G mayor, el acorde E menor es tanto iii en C como vi en G, creando un puente armónico suave entre las dos tonalidades.',
  },
  l5u16m1e2: {
    prompt:
      '¿Qué acorde puede ser un pivote diatónico entre C mayor y G mayor?',
    choices: [
      'Acorde de E menor',
      'Acorde de F mayor',
      'Acorde de Bb mayor',
      'Acorde de F# disminuido',
    ],
    hint: 'Busca acordes comunes a ambas tonalidades. C mayor: C Dm Em F G Am Bdim. G mayor: G Am Bm C D Em F#dim. Los acordes compartidos incluyen C, Em, Am, G. E menor como iii/vi es una elección fuerte de pivote.',
  },
  l5u16m1e3: {
    prompt: '¿Cuál es el proceso típico de una modulación por acorde pivote?',
    choices: [
      'Orden: establecer la tonalidad antigua, introducir el acorde pivote y confirmar la nueva tonalidad con una cadencia',
      'Orden: establecer la nueva tonalidad, introducir el acorde pivote y confirmar la tonalidad antigua con una cadencia',
      'Orden: introducir el acorde pivote, establecer la tonalidad antigua y confirmar la nueva tonalidad con una cadencia',
      'Orden: establecer la tonalidad antigua, confirmar la nueva tonalidad con una cadencia e introducir el acorde pivote',
    ],
    hint: 'La modulación por acorde pivote se desarrolla en tres fases: (1) la tonalidad antigua se establece claramente, (2) un acorde diatónico se reinterpreta como perteneciente a la nueva tonalidad, (3) la nueva tonalidad se confirma con una cadencia (típicamente V–I).',
  },

  // ---- l5u16m2: Modulación a Tonalidades Cercanas ----

  l5u16m2e1: {
    prompt: '¿Cuántas tonalidades cercanas tiene una tonalidad mayor?',
    choices: [
      "5 tonalidades cercanas",
      "2 tonalidades cercanas",
      "12 tonalidades cercanas",
      "3 tonalidades cercanas",
    ],
    hint: 'Las tonalidades cercanas difieren en como máximo una alteración en sus armaduras de clave. Para C mayor: G mayor (+1#), F mayor (+1b), A menor (relativa), E menor (rel. de G), D menor (rel. de F). Eso da 5 tonalidades cercanas.',
  },
  l5u16m2e2: {
    prompt:
      '¿Por qué modular a la tonalidad de la dominante (V) se considera una de las modulaciones más suaves?',
    choices: [
      'Seis notas se mantienen, dejando varias armonías compartidas para enlazar las dos tonalidades',
      "Dos notas se mantienen, dejando una sola armonía compartida para enlazar las dos tonalidades",
      'Las notas se mantienen porque la tonalidad de la dominante tiene la misma armadura',
      'Las notas se mantienen porque la tonalidad de la dominante es la relativa menor de la tonalidad original',
    ],
    hint: 'C mayor y G mayor comparten 6 de 7 notas (solo F vs F#). Esta superposición significa que muchos acordes son comunes a ambas tonalidades, proporcionando abundantes opciones de acorde pivote y una transición fluida.',
  },
  l5u16m2e3: {
    prompt: '¿Cuáles de las siguientes son tonalidades cercanas de C mayor?',
    choices: [
      "G mayor, F mayor, A menor, E menor, D menor",
      'D mayor, G mayor, B menor, E menor, F# menor',
      'F mayor, Bb mayor, D menor, G menor, C menor',
      'Eb mayor, Ab mayor, C menor, F menor, Bb menor',
    ],
    hint: 'Las tonalidades cercanas tienen armaduras de clave que difieren de la de C mayor (sin sostenidos ni bemoles) en, como máximo, una alteración. G mayor tiene 1#, F mayor tiene 1b, y sus relativas menores (E menor, D menor) más la relativa menor de C (A menor) completan el conjunto.',
  },

  // ---- l5u16m3: Modulación Directa / Por Nota Común / Cromática ----

  l5u16m3e1: {
    prompt: '¿Qué es una modulación directa (o de frase)?',
    choices: [
      "Un cambio brusco de centro tonal entre frases, sin una armonía compartida que las conecte",
      'Un cambio gradual de centro tonal mediante una armonía común que conecta dos frases',
      'Un breve énfasis en un acorde dentro de una frase, manteniendo el centro tonal original',
      'Un cambio gradual de centro tonal dentro de una frase mediante una secuencia cromática de enlace',
    ],
    hint: 'La modulación directa es el tipo más abrupto: una frase termina en la tonalidad antigua y la frase siguiente simplemente comienza en la nueva. Ningún acorde pivote ni preparación cromática tiende el puente. Es habitual en el pop y en los himnos.',
  },
  l5u16m3e2: {
    prompt: '¿Qué es una modulación por nota común?',
    choices: [
      "Una altura sigue sonando mientras la armonía que la rodea le da un nuevo significado tonal",
      'Una altura cambia de sonido mientras la armonía que la rodea le da un nuevo significado tonal',
      'Una altura sigue sonando mientras la armonía que la rodea permanece en la misma tonalidad',
      'Una altura cambia de sonido mientras la armonía que la rodea permanece en la misma tonalidad',
    ],
    hint: 'En la modulación por nota común, una nota se mantiene (o se repite) mientras la armonía cambia a su alrededor. Esa nota adquiere una nueva función en la nueva tonalidad. Esta técnica funciona bien para modular a tonalidades distantes.',
  },
  l5u16m3e3: {
    prompt: '¿Qué es una modulación cromática?',
    choices: [
      'Una modulación conseguida mediante la alteración cromática de una o más notas de un acorde para pivotar hacia la nueva tonalidad',
      'Una modulación conseguida al pasar a una tonalidad con más sostenidos o bemoles',
      'Una modulación lograda alterando cromáticamente la melodía mientras la armonía sigue en la tonalidad anterior',
      'Una modulación conseguida al empezar una nueva frase directamente en otra tonalidad',
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
      '¿Qué es la mezcla modal (también llamada intercambio modal)?',
    choices: [
      "Usar armonías del modo opuesto sobre la misma tónica",
      'Usar armonías de la tonalidad relativa (misma armadura, tónica diferente)',
      'Usar armonías del modo opuesto sobre una tónica diferente',
      'Usar armonías de una tonalidad cercana una 5.ª por encima',
    ],
    hint: 'La mezcla modal toma prestados acordes de la tonalidad homónima (misma tónica, modo opuesto). En C mayor, se toma prestado de C menor: bIII (Eb), iv (Fm), bVI (Ab), bVII (Bb). Añaden oscuridad y riqueza cromática.',
  },

  // ---- l5u16m5: Tercera de Picardía ----

  l5u16m5e1: {
    prompt: '¿Qué es una tercera de Picardía (tierce de Picardie)?',
    choices: [
      "Terminar una pieza en tonalidad menor con un acorde de tónica mayor, elevando solo la tercera del acorde final",
      "Terminar una pieza en tonalidad mayor con un acorde de tónica menor, bajando solo la tercera del acorde final",
      "Terminar una pieza en tonalidad menor con un acorde de dominante mayor en lugar del acorde de tónica final",
      "Terminar una pieza en tonalidad mayor con un acorde de subdominante menor en lugar del acorde de tónica final",
    ],
    hint: 'La tercera de Picardía es una técnica secular: una pieza en tonalidad menor termina con un acorde I mayor (p. ej., pieza en C menor que termina en C mayor). La tercera elevada crea un final brillante y resuelto tras la oscuridad del modo menor.',
  },
  l5u16m5e2: {
    prompt:
      'En la mezcla modal, ¿qué significa tomar prestado de la tonalidad mayor homónima en una tonalidad menor?',
    choices: [
      'Usar acordes de la tonalidad mayor con la misma tónica en un contexto de tonalidad menor',
      'Usar acordes de la relativa mayor (misma armadura) en un contexto de tonalidad menor',
      "Usar acordes de una tonalidad mayor con una tónica diferente en un contexto de tonalidad menor",
      'Usar acordes de la tonalidad mayor una 5.ª por encima en un contexto de tonalidad menor',
    ],
    hint: 'La mezcla modal funciona en ambas direcciones. Una tonalidad menor puede tomar prestado de su tonalidad mayor homónima: p. ej., en A menor, puedes tomar prestado IV de A mayor (D mayor en vez de D menor) para iluminar temporalmente la armonía.',
  },
  l5u16m5e3: {
    prompt:
      '¿Cuál de los siguientes es un ejemplo de mezcla modal en una tonalidad menor?',
    choices: [
      'Usar un acorde IV mayor en una tonalidad menor, prestado de la tonalidad mayor homónima',
      'Usar un acorde III mayor en una tonalidad menor, compartido con la relativa mayor',
      'Usar un acorde V mayor en una tonalidad menor, construido con el 7.º grado elevado de la menor armónica',
      'Usar un acorde iv menor en una tonalidad menor, construido con su escala menor natural',
    ],
    hint: 'El acorde V en el modo menor proviene de la menor armónica — pertenece a la propia tonalidad menor, no a la mezcla modal. La mezcla modal toma prestados acordes de la tonalidad homónima. Un IV mayor en el modo menor (p. ej., D mayor en A menor en vez de D menor) es un ejemplo habitual; el Nivel 4 relacionó el mismo acorde con la menor melódica ascendente, y ambas lecturas son habituales.',
  },

  // =========================================================================
  // Unidad 17: Forma, Textura, Conducción de Voces
  // =========================================================================

  // ---- l5u17m1: Forma Binaria y Ternaria ----

  l5u17m1e1: {
    prompt: '¿Qué es la forma binaria?',
    choices: [
      'Una estructura con una sección inicial seguida de una segunda sección contrastante',
      'Una estructura con tres secciones: A, B y regreso a A',
      'Una estructura con dos líneas simultáneas: melodía y acompañamiento',
      'Una estructura con pares de frases repetidos: pregunta y respuesta',
    ],
    hint: 'La forma binaria (AB) divide una pieza en dos secciones complementarias. La sección A típicamente termina lejos de la tónica (frecuentemente en V), y la sección B regresa a la tónica. Ambas secciones se repiten generalmente (||: A :||: B :||).',
  },
  l5u17m1e2: {
    prompt:
      '¿Qué distingue la forma binaria con retorno de la forma binaria simple?',
    choices: [
      'Parte del tema inicial vuelve dentro de la segunda sección, en vez de formar una tercera sección separada',
      "Parte del tema inicial vuelve como tercera sección separada después de terminar la segunda",
      "Parte del tema contrastante vuelve dentro de la primera sección antes de empezar la segunda",
      "Parte del tema inicial desaparece de la segunda sección en vez de regresar dentro de ella",
    ],
    hint: "La binaria con retorno (||: A :||: B A' :||) trae de vuelta el material inicial de A al final de la sección B. La binaria simple no regresa a A. Muchos minuetos y scherzos clásicos usan forma binaria con retorno.",
  },
  l5u17m1e3: {
    prompt: '¿Qué es la forma ternaria?',
    choices: [
      "Una estructura en tres partes en la que la primera sección regresa tras una sección central contrastante",
      'Una estructura en tres partes en la que aparecen tres secciones contrastantes sin retorno',
      'Una estructura en tres partes en la que un tema recibe dos variaciones sucesivas',
      'Una estructura en tres partes en la que la misma música se repite con tres letras diferentes',
    ],
    hint: 'La forma ternaria tiene tres secciones distintas: A (exposición), B (contraste), A (retorno). A diferencia de la binaria con retorno, cada sección en la forma ternaria es armónicamente autosuficiente, terminando generalmente con una cadencia en su propia tonalidad.',
  },

  // ---- l5u17m2: Formas de Canción ----

  l5u17m2e1: {
    prompt: '¿Qué es la forma estrofa-estribillo?',
    choices: [
      'Una forma en la que estrofas con letras nuevas alternan con un estribillo recurrente',
      "Una forma en la que las estrofas conservan la letra mientras cada estribillo presenta letra nueva",
      "Una forma en la que una estrofa recurrente alterna con episodios instrumentales contrastantes en vez de estribillo",
      "Una forma en la que las estrofas conducen a un puente y regresan sin un estribillo recurrente",
    ],
    hint: 'Estrofa-estribillo es la forma pop/rock más habitual. Las estrofas avanzan la historia con letras cambiantes sobre la misma música. El estribillo proporciona el clímax emocional con un gancho consistente y memorable.',
  },
  l5u17m2e2: {
    prompt: '¿Qué es la forma AABA (también llamada forma de canción de 32 compases)?',
    choices: [
      'Una canción AABA en la que B es un puente contrastante antes del regreso de A',
      'Una canción AABA en la que B repite la música de A con otra letra',
      'Una canción AABA en la que B es la estrofa y cada A es su estribillo repetido',
      'Una canción AABA en la que B es una repetición instrumental de A con la misma melodía y armonía',
    ],
    hint: 'AABA es la forma clásica del Tin Pan Alley / Gran Cancionero Americano. Cada sección tiene típicamente 8 compases. La sección B (puente o «middle eight») proporciona contraste antes del retorno final de A. Muchos estándares de jazz usan esta forma.',
  },
  l5u17m2e3: {
    prompt: '¿Cuál es el orden habitual de las tres secciones principales de la forma sonata?',
    choices: [
      'Exposición → desarrollo → reexposición',
      'Desarrollo → reexposición → exposición',
      'Reexposición → desarrollo → exposición',
      'Reexposición → exposición → desarrollo',
    ],
    hint: 'Forma sonata: la exposición presenta dos temas contrastantes en tonalidades diferentes, el desarrollo los fragmenta y transforma por varias tonalidades, y la reexposición presenta de nuevo ambos temas en la tonalidad de origen.',
  },

  // ---- l5u17m3: Textura ----

  l5u17m3e1: {
    prompt: '¿Qué es la textura monofónica?',
    choices: [
      'Una única línea melódica sin acompañamiento ni armonía — una voz, una altura cada vez',
      'Una melodía con acompañamiento de acordes — las demás voces apoyan la línea melódica principal',
      'Dos melodías independientes sonando simultáneamente — cada una con su propio interés rítmico',
      'Una melodía tocada simultáneamente con variaciones individuales — los intérpretes difieren en sus líneas melódicas',
    ],
    hint: 'La monofonía es la textura más simple: una única melodía sin acompañamiento. Aunque muchas personas canten o toquen la misma melodía (al unísono o en octavas), sigue siendo monofónico porque hay solo una línea musical.',
  },
  l5u17m3e2: {
    prompt: '¿Qué es la textura polifónica?',
    choices: [
      'Dos o más líneas melódicas independientes sonando simultáneamente con sus propios ritmos y contornos',
      'Una única línea melódica sin acompañamiento, interpretada al unísono o en octavas por varias voces',
      'Una melodía con acompañamiento de acordes, con las demás voces apoyando su interés rítmico y melódico',
      'Una melodía interpretada simultáneamente con variaciones individuales, cada intérprete ornamentando la misma línea',
    ],
    hint: 'La polifonía presenta múltiples voces independientes, cada una con interés melódico. Una fuga de Bach es el ejemplo clásico: cada voz entra con el mismo tema pero después se mueve independientemente, tejiendo una red contrapuntística compleja.',
  },
  l5u17m3e3: {
    prompt: '¿Qué es la textura homofónica?',
    choices: [
      'Una melodía principal acompañada por acordes o soporte armónico, en la que todas las partes se mueven al mismo ritmo o apoyan la melodía',
      'Una única línea melódica interpretada por todas las voces al unísono o en octavas, sin acompañamiento de acordes',
      'Dos líneas melódicas independientes sonando simultáneamente, cada una con su propio interés rítmico y melódico',
      'Una melodía tocada simultáneamente con variaciones individuales, sin acompañamiento de acordes por debajo',
    ],
    hint: 'La homofonía tiene una melodía dominante con acompañamiento armónico. La mayoría del pop, rock y música clásica del periodo Clásico en adelante es homofónica. Un cantante con acordes de guitarra es un ejemplo claro.',
  },

  // ---- l5u17m4: Líneas de Notas Guía ----

  l5u17m4e1: {
    prompt: '¿Qué son las notas guía?',
    choices: [
      'Terceras y séptimas de los acordes',
      'Fundamentales y quintas de los acordes',
      'Novenas y oncenas de los acordes',
      'Notas de la melodía en tiempos fuertes',
    ],
    hint: 'Las notas guía (3.as y 7.as) son las notas armónicamente más definitorias de un acorde. La fundamental y la 5.ª son estructuralmente importantes pero genéricas; la 3.ª determina mayor/menor y la 7.ª determina el tipo de acorde.',
  },
  l5u17m4e2: {
    prompt:
      'En ii7-V7-I en C mayor (Dm7-G7-Cmaj7), ¿qué notas son las notas guía de cada acorde?',
    choices: [
      "F-C en Dm7, F-B en G7, E-B en Cmaj7",
      'D-A en Dm7, G-D en G7, C-G en Cmaj7',
      'F-A en Dm7, B-D en G7, E-G en Cmaj7',
      'A-C en Dm7, D-F en G7, G-B en Cmaj7',
    ],
    hint: 'Notas guía de Dm7: F (3.ª), C (7.ª). Hacia G7: F se mantiene como nota común y se convierte en la 7.ª, mientras C baja un semitono a B, la 3.ª. Hacia Cmaj7: B se mantiene y se convierte en la 7.ª, mientras F baja un semitono a E, la 3.ª. Movimiento mínimo = conducción de voces suave.',
    nudge: 'Las notas guía son la 3.ª y la 7.ª de cada acorde. Escríbelas para Dm7, G7 y Cmaj7 y compara: ¿qué notas se quedan quietas de un acorde al siguiente y cuánto se mueven las demás?',
  },
  l5u17m4e3: {
    prompt:
      '¿Cuál es el principio fundamental de conducción de voces que las notas guía ilustran?',
    choices: [
      "Mover cada voz a la nota del acorde más cercana",
      "Mover cada voz a la fundamental del acorde siguiente",
      "Mover cada voz a la quinta del acorde siguiente",
      "Mover cada voz por el mismo intervalo",
    ],
    hint: 'Una buena conducción de voces minimiza el movimiento: mantener notas comunes, mover las otras voces por grado. Esto crea progresiones armónicas suaves y conectadas. Las líneas de notas guía demuestran este principio con solo las dos notas más esenciales por acorde.',
  },
};

export default overlay;
