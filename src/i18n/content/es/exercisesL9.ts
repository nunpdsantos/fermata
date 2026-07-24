import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish translations for Level 9 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidad 30: Entrenamiento de Altura e Intervalos
  // =========================================================================

  // ---- l9u30m1: Correspondencia de Altura/Dirección ----

  l9u30m1e1: {
    prompt:
      'Identifica esta altura mostrada en el pentagrama.',
    hint: 'El Do central (C4) es el punto de referencia central en el piano, situado en la línea adicional por debajo del pentagrama en clave de sol.',
  },
  l9u30m1e2: {
    prompt:
      'Escucha esta altura e identifícala. Está una 5.ª justa por encima del Do central.',
    hint: 'G4 está una 5.ª justa por encima de C4 — 7 semitonos arriba. Se sitúa en la segunda línea del pentagrama en clave de sol.',
  },
  l9u30m1e3: {
    prompt:
      'Cuando una segunda altura suena más aguda que la primera, ¿cuál es la dirección del movimiento de altura?',
    choices: [
      'Ascendente',
      'Descendente',
      'Oblicuo',
      'Estático',
    ],
    hint: 'Ascendente significa moverse hacia arriba en altura. Descendente significa moverse hacia abajo.',
  },
  l9u30m1e4: {
    prompt: '¿Qué significa «registro» en música?',
    choices: [
      'La posición relativa de agudo o grave dentro de un rango de alturas',
      'El nivel de volumen de una interpretación',
      'La velocidad a la que se tocan las notas',
      'El número de instrumentos que suenan simultáneamente',
    ],
    hint: 'El registro describe una porción del espectro de alturas: registro grave, registro medio o registro agudo.',
  },

  // ---- l9u30m2: Reconocimiento Mayor vs Menor ----

  l9u30m2e1: {
    prompt:
      'Construye una tríada de C mayor. Escucha su cualidad brillante y estable a medida que seleccionas las notas.',
    hint: 'C mayor = C, E, G. La 3.ª mayor (4 semitonos desde la fundamental) le confiere un carácter brillante.',
  },
  l9u30m2e2: {
    prompt:
      'Construye una tríada de C menor. Escucha cómo la 3.ª descendida cambia la atmósfera respecto al mayor.',
    hint: 'C menor = C, Eb, G. La 3.ª menor (3 semitonos desde la fundamental) le confiere una cualidad más sombría y melancólica.',
  },
  l9u30m2e3: {
    prompt:
      '¿Cuál es la diferencia estructural entre una tríada mayor y una tríada menor?',
    choices: [
      'La tercera desciende un semitono en el menor',
      'La quinta desciende un semitono en el menor',
      'La fundamental sube un semitono en el menor',
      'Las tríadas menores tienen cuatro notas en vez de tres',
    ],
    hint: 'Tríada mayor: fundamental + 3.ª mayor (4 semitonos) + 5.ª justa. Tríada menor: fundamental + 3.ª menor (3 semitonos) + 5.ª justa. Solo cambia la 3.ª.',
  },

  // ---- l9u30m3: Reconocimiento de Intervalos P1-P5 ----

  l9u30m3e1: {
    prompt:
      'Escucha este intervalo ascendente desde C. Es el intervalo más pequeño de la música occidental. Identifícalo.',
    hint: '1 semitono = 2.ª menor (semitono). C a Db. Piensa en el tema de Tiburón.',
  },
  l9u30m3e2: {
    prompt:
      'Escucha este intervalo ascendente desde C. Abarca un tono. Identifícalo.',
    hint: '2 semitonos = 2.ª mayor (tono). C a D.',
  },
  l9u30m3e3: {
    prompt:
      'Escucha este intervalo ascendente desde C. Tiene una cualidad sombría y melancólica. Identifícalo.',
    hint: '3 semitonos = 3.ª menor. C a Eb. Este intervalo define la base de una tríada menor.',
  },
  l9u30m3e4: {
    prompt:
      'Escucha este intervalo ascendente desde C. Suena fuerte y abierto. Identifícalo.',
    hint: '7 semitonos = 5.ª justa. C a G. El intervalo más consonante después de la octava y el unísono.',
  },

  // ---- l9u30m4: Reconocimiento de Intervalos 6.ª m-P8 ----

  l9u30m4e1: {
    prompt:
      'Escucha este intervalo ascendente desde C. Tiene una cualidad agridulce y anhelante. Identifícalo.',
    hint: '8 semitonos = 6.ª menor. C a Ab. Tiene una cualidad punzante, algo tensa.',
  },
  l9u30m4e2: {
    prompt:
      'Escucha este intervalo ascendente desde C. Tiene una cualidad cálida y romántica. Identifícalo.',
    hint: '9 semitonos = 6.ª mayor. C a A. Un intervalo cálido y consonante.',
  },
  l9u30m4e3: {
    prompt:
      'Escucha este intervalo ascendente desde C. Crea una fuerte tensión que pide resolución. Identifícalo.',
    hint: '10 semitonos = 7.ª menor. C a Bb. Tiene una tensión dominante y de blues.',
  },
  l9u30m4e4: {
    prompt:
      'Escucha este intervalo ascendente desde C. Las dos notas suenan como la misma altura en registros diferentes. Identifícalo.',
    hint: '12 semitonos = octava justa. C4 a C5. Las dos alturas comparten el mismo nombre de nota.',
  },

  // ---- l9u30m5: Intervalos Armónicos ----

  l9u30m5e1: {
    prompt:
      'Estas dos notas suenan simultáneamente desde D. El intervalo es abierto y estable. Identifícalo.',
    hint: '5 semitonos = 4.ª justa. D a G. Cuando suenan simultáneamente, tienen una cualidad abierta y hueca.',
  },
  l9u30m5e2: {
    prompt:
      'Estas dos notas suenan simultáneamente desde E. El intervalo es brillante y dulce. Identifícalo.',
    hint: '4 semitonos = 3.ª mayor. E a G#. La 3.ª mayor produce un sonido armónico cálido y consonante.',
  },
  l9u30m5e3: {
    prompt:
      '¿Cuál es la diferencia entre un intervalo armónico y un intervalo melódico?',
    choices: [
      'Los intervalos armónicos suenan simultáneamente; los melódicos suenan en secuencia',
      'Los intervalos armónicos son consonantes; los melódicos son disonantes',
      'Los intervalos armónicos usan sostenidos; los melódicos usan bemoles',
      'Los intervalos armónicos abarcan más de una octava; los melódicos no',
    ],
    hint: 'Armónico = ambas notas al mismo tiempo. Melódico = una nota después de la otra. Las mismas dos notas pueden formar cualquiera de los dos tipos.',
  },

  // =========================================================================
  // Unidad 31: Escalas, Acordes y Dictado
  // =========================================================================

  // ---- l9u31m1: Reconocimiento de Escalas Mayor/Menor ----

  l9u31m1e1: {
    prompt:
      'Construye la escala de C mayor. Escucha el carácter brillante y resuelto de cada paso.',
    hint: 'C mayor: C, D, E, F, G, A, B. Todas teclas blancas. Patrón: T-T-S-T-T-T-S.',
  },
  l9u31m1e2: {
    prompt:
      'Construye la escala de A menor natural. Compara su atmósfera más sombría con la escala mayor.',
    hint: 'A menor natural: A, B, C, D, E, F, G. Todas teclas blancas. Patrón: T-S-T-T-S-T-T.',
  },
  l9u31m1e3: {
    prompt:
      '¿Cuál describe mejor el carácter general de una escala mayor?',
    choices: [
      'Brillante, alegre y resuelto',
      'Sombrío, triste y tenso',
      'Misterioso y ambiguo',
      'Disonante e inestable',
    ],
    hint: 'Las escalas mayores se perciben como brillantes y estables. La 3.ª mayor y la 7.ª mayor contribuyen a este carácter positivo.',
  },

  // ---- l9u31m2: Reconocimiento de Modos ----

  l9u31m2e1: {
    prompt:
      'Construye la escala de D dórico. Es como el menor natural pero con el 6.º grado elevado.',
    hint: 'D dórico: D, E, F, G, A, B, C. Todas teclas blancas comenzando en D. El B natural (6.º elevado) es la nota característica.',
  },
  l9u31m2e2: {
    prompt:
      'Construye la escala de F lidio. Es como el mayor pero con el 4.º grado elevado.',
    hint: 'F lidio: F, G, A, B, C, D, E. Todas teclas blancas comenzando en F. El B natural (4.º elevado) es la nota característica.',
  },
  l9u31m2e3: {
    prompt:
      '¿Cuál es la nota característica que distingue el dórico del menor natural?',
    choices: [
      'Un 6.º grado elevado',
      'Un 2.º grado descendido',
      'Un 7.º grado elevado',
      'Un 5.º grado descendido',
    ],
    hint: 'El dórico difiere del menor natural en una nota: el 6.º grado está elevado un semitono. En D dórico, es B natural en vez de Bb.',
  },

  // ---- l9u31m3: Pentatónica/Blues/Simétrica ----

  l9u31m3e1: {
    prompt:
      'Construye la escala pentatónica de C mayor. Elimina los semitonos de la escala mayor.',
    hint: 'C pentatónica mayor: C, D, E, G, A. Cinco notas — la escala mayor sin el 4.º y el 7.º grados.',
  },
  l9u31m3e2: {
    prompt:
      'Construye la escala de C blues. Añade la «blue note» a la pentatónica menor.',
    hint: 'C blues: C, Eb, F, Gb, G, Bb. Seis notas — la pentatónica menor más la 5.ª bemolizada (Gb), que es la blue note.',
  },
  l9u31m3e3: {
    prompt: '¿Qué es la «blue note» en una escala de blues?',
    choices: [
      'La nota cromática entre el 4.º y el 5.º grados (5.ª bemolizada / 4.ª sostenida)',
      'La 3.ª menor de cualquier acorde',
      'Cualquier nota tocada con vibrato',
      'La sensible de la tonalidad',
    ],
    hint: 'La blue note es la b5 (o #4) añadida a la pentatónica menor. En C blues, es Gb/F#, entre F y G.',
  },

  // ---- l9u31m4: Reconocimiento de Cualidad de Tríadas ----

  l9u31m4e1: {
    prompt:
      'Construye una tríada de E disminuido. Tiene una cualidad tensa e inestable.',
    hint: 'E disminuido = E, G, Bb. Dos 3.as menores apiladas: E a G (3 semitonos) y G a Bb (3 semitonos). El tritono entre fundamental y 5.ª crea tensión.',
  },
  l9u31m4e2: {
    prompt:
      'Construye una tríada de C aumentado. Tiene una cualidad etérea y sin resolución.',
    hint: 'C aumentado = C, E, G#. Dos 3.as mayores apiladas: C a E (4 semitonos) y E a G# (4 semitonos). Estructura simétrica.',
  },
  l9u31m4e3: {
    prompt: '¿Qué intervalos componen una tríada disminuida?',
    choices: [
      'Fundamental, 3.ª menor y 5.ª disminuida (tritono)',
      'Fundamental, 3.ª mayor y 5.ª justa',
      'Fundamental, 3.ª menor y 5.ª justa',
      'Fundamental, 3.ª mayor y 5.ª aumentada',
    ],
    hint: 'Disminuida = 3.ª menor (3 semitonos) + 5.ª disminuida (6 semitonos). Dos 3.as menores apiladas producen el tritono entre fundamental y 5.ª.',
  },
  l9u31m4e4: {
    prompt: '¿Cómo describirías el sonido de una tríada aumentada?',
    choices: [
      'Tensa y sin resolución, con una cualidad etérea y flotante',
      'Brillante y estable como un acorde mayor',
      'Sombría y pesada como un acorde menor',
      'Hueca y medieval como un power chord',
    ],
    hint: 'Las tríadas aumentadas dividen la octava en tres partes iguales (3.ª M + 3.ª M). Esta simetría crea una sensación ambigua y suspendida.',
  },

  // ---- l9u31m5: Cualidad de Acordes de Séptima ----

  l9u31m5e1: {
    prompt:
      'Construye un acorde Cmaj7. Tiene una cualidad exuberante y sofisticada.',
    hint: 'Cmaj7 = C, E, G, B. Una tríada de C mayor más la 7.ª mayor (B, 11 semitonos desde la fundamental). Común en el jazz y la bossa nova.',
  },
  l9u31m5e2: {
    prompt:
      'Construye un acorde Dm7. Tiene una cualidad suave y relajada.',
    hint: 'Dm7 = D, F, A, C. Una tríada de D menor más la 7.ª menor (C, 10 semitonos desde la fundamental).',
  },
  l9u31m5e3: {
    prompt:
      '¿Qué confiere a un acorde de 7.ª dominante su sensación característica de tensión y deseo de resolver?',
    choices: [
      'El tritono formado entre la 3.ª mayor y la 7.ª menor',
      'La 5.ª justa entre fundamental y 5.ª',
      'La 3.ª mayor entre fundamental y 3.ª',
      'La duplicación a la octava de la fundamental',
    ],
    hint: 'En G7 (G-B-D-F), B y F forman un tritono (6 semitonos). Esta disonancia crea la atracción hacia la resolución a C mayor.',
  },
  l9u31m5e4: {
    prompt:
      '¿En qué contexto musical se encuentra con mayor frecuencia el acorde de séptima semidisminuido?',
    choices: [
      'Como acorde ii en tonalidades menores (p. ej. Bm7b5 en A menor)',
      'Como acorde I en tonalidades mayores',
      'Como acorde V en tonalidades mayores',
      'Como acorde IV en progresiones de blues',
    ],
    hint: 'El acorde de séptima semidisminuido (m7b5) aparece naturalmente en el 2.º grado de la menor armónica. Funciona como acorde predominante conduciendo al V en progresiones ii-V-i menores.',
  },

  // =========================================================================
  // Unidad 32: Dictado, Lectura a Primera Vista, Contextual
  // =========================================================================

  // ---- l9u32m1: Dictado Melódico Diatónico ----

  l9u32m1e1: {
    prompt:
      'Escucha esta nota en un contexto de C mayor e identifícala. Es el 3.er grado de la escala.',
    hint: 'E4 es el 3.er grado de C mayor. Se sitúa en la primera línea del pentagrama en clave de sol.',
  },
  l9u32m1e2: {
    prompt:
      'Escucha esta nota en un contexto de C mayor e identifícala. Es el 6.º grado de la escala.',
    hint: 'A4 es el 6.º grado de C mayor. Se sitúa en el segundo espacio del pentagrama en clave de sol.',
  },
  l9u32m1e3: {
    prompt: '¿Qué significa «melodía diatónica»?',
    choices: [
      'Una melodía que utiliza solo las notas de la tonalidad o escala predominante',
      'Una melodía que utiliza sostenidos y bemoles ajenos a la tonalidad',
      'Una melodía tocada en una sola cuerda de la guitarra',
      'Una melodía que se mueve exclusivamente por grados conjuntos',
    ],
    hint: 'Diatónico significa «perteneciente a la tonalidad». Una melodía diatónica en C mayor utiliza solo C, D, E, F, G, A y B — sin alteraciones.',
  },
  l9u32m1e4: {
    prompt:
      '¿Qué estrategia es más eficaz para oír grados individuales de la escala en una melodía?',
    choices: [
      'Relacionar cada nota con la tónica cantando la escala hasta ese grado',
      'Memorizar la frecuencia en hercios de cada nota',
      'Contar el número de líneas adicionales en el pentagrama',
      'Tocar la melodía al revés para verificar la respuesta',
    ],
    hint: 'Oír grados de la escala implica percibir cada nota en relación con la tónica. Cantar desde «do» hasta la nota objetivo es un método fiable.',
  },

  // ---- l9u32m2: Dictado Melódico Cromático ----

  l9u32m2e1: {
    prompt:
      'Escucha este semitono cromático ascendente desde E. Identifica el intervalo.',
    hint: '1 semitono ascendente desde E = E a F. Un semitono cromático en contexto melódico funciona a menudo como nota de paso.',
  },
  l9u32m2e2: {
    prompt:
      'Escucha este intervalo altamente disonante ascendente desde F. Divide la octava exactamente por la mitad. Identifícalo.',
    hint: '6 semitonos = tritono (4.ª aumentada / 5.ª disminuida). F a B. Es el intervalo más disonante y divide la octava simétricamente.',
  },
  l9u32m2e3: {
    prompt: '¿Qué es una nota cromática de paso?',
    choices: [
      'Una nota ajena a la tonalidad que rellena un tono entre dos notas diatónicas',
      'Cualquier nota tocada con acento',
      'La primera nota de una escala cromática',
      'Una nota sostenida más allá de la barra de compás',
    ],
    hint: 'Una nota cromática de paso es una nota no diatónica que enlaza dos notas diatónicas separadas por un tono, dividiendo ese tono en dos semitonos.',
  },

  // ---- l9u32m3: Dictado Armónico ----

  l9u32m3e1: {
    prompt:
      'Una frase termina con V moviéndose a I, ambos en posición fundamental, con la melodía llegando a la tónica. ¿Qué tipo de cadencia es esta?',
    choices: [
      'Cadencia auténtica perfecta (CAP)',
      'Semicadencia',
      'Cadencia plagal',
      'Cadencia rota',
    ],
    hint: 'Una cadencia auténtica perfecta (CAP) requiere V a I en posición fundamental con la tónica en el soprano. Proporciona la sensación más fuerte de conclusión.',
  },
  l9u32m3e2: {
    prompt:
      'Una frase musical se detiene en el acorde de V sin resolver. ¿Qué tipo de cadencia es esta?',
    choices: [
      'Semicadencia',
      'Cadencia auténtica perfecta',
      'Cadencia plagal',
      'Cadencia rota',
    ],
    hint: 'Una semicadencia termina en V, creando una sensación de suspensión o incompletitud — como una coma en lugar de un punto final.',
  },
  l9u32m3e3: {
    prompt:
      'Esperas que V resuelva a I, pero en su lugar se mueve a vi. ¿Qué tipo de cadencia produce esta sorpresa?',
    choices: [
      'Cadencia rota',
      'Semicadencia',
      'Cadencia auténtica perfecta',
      'Cadencia plagal',
    ],
    hint: 'Una cadencia rota sustituye vi por el I esperado tras V. El oído espera resolución pero recibe un desvío sorpresa.',
  },

  // ---- l9u32m4: Lectura a Primera Vista ----

  l9u32m4e1: {
    prompt:
      'En el solfeo movible, ¿qué sílaba se asigna siempre a la tónica de la tonalidad actual?',
    choices: ['Do', 'La', 'Sol', 'Re'],
    hint: 'En el solfeo movible, «Do» representa siempre la tónica independientemente de la tonalidad. En C mayor, Do = C. En G mayor, Do = G.',
  },
  l9u32m4e2: {
    prompt:
      'En la tonalidad de C mayor, ¿qué nota corresponde a la sílaba de solfeo «Mi»?',
    choices: ['E', 'D', 'F', 'G'],
    hint: 'Do-Re-Mi-Fa-Sol-La-Si se corresponde con los 7 grados de la escala. En C mayor: C(Do), D(Re), E(Mi), F(Fa), G(Sol), A(La), B(Si).',
  },
  l9u32m4e3: {
    prompt:
      '¿Cuál es el paso de preparación más importante antes de leer a primera vista una melodía?',
    choices: [
      'Establecer la tónica cantando la escala o arpegio de la tonalidad',
      'Memorizar la melodía entera antes de comenzar',
      'Leer la letra primero',
      'Contar el número total de notas',
    ],
    hint: 'Establecer el centro tonal (tónica) en el oído es esencial. Cantar una escala o arpegio de tónica rápidos ancla la percepción de altura antes de leer la melodía.',
  },

  // ---- l9u32m5: Audición Contextual ----

  l9u32m5e1: {
    prompt:
      'Escuchas una línea vocal única sin acompañamiento ni armonía. ¿Qué textura musical es esta?',
    choices: [
      'Monofónica',
      'Homofónica',
      'Polifónica',
      'Heterofónica',
    ],
    hint: 'La textura monofónica consiste en una única línea melódica sin acompañamiento ni armonía. Una voz, una línea.',
  },
  l9u32m5e2: {
    prompt:
      'Una canción alterna entre una sección recurrente y secciones contrastantes (A-B-A-B). ¿Qué forma es esta?',
    choices: [
      'Forma estrofa-estribillo',
      'Forma durchkomponiert (through-composed)',
      'Forma rondó',
      'Forma sonata',
    ],
    hint: 'La forma estrofa-estribillo alterna estrofas (letras distintas, misma melodía) con un estribillo recurrente. Es la estructura más habitual en la música popular.',
  },
  l9u32m5e3: {
    prompt:
      '¿Qué característica musical es más útil para identificar el periodo estilístico histórico de una pieza?',
    choices: [
      'La combinación de instrumentación, lenguaje armónico y estructura formal',
      'La indicación de tempo por sí sola',
      'La armadura de clave por sí sola',
      'El número de compases de la pieza',
    ],
    hint: 'Los periodos estilísticos se identifican por una combinación de factores: instrumentación (clave vs. piano), vocabulario armónico (triádico vs. cromático) y convenciones formales (binaria vs. forma sonata).',
  },
};

export default overlay;
