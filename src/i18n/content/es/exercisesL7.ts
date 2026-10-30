import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish translations for Level 7 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidad 21: Armonía Jazz
  // =========================================================================

  // ---- l7u21m1: Cifrado Jazz y Extensiones ----

  l7u21m1e1: {
    prompt:
      'Construye un acorde Cmaj9. Selecciona las 5 notas: fundamental, tercera mayor, quinta justa, séptima mayor y novena mayor.',
    hint: 'Cmaj9 = C, E, G, B, D. Apilamiento: fundamental (C), tercera mayor (E), quinta justa (G), séptima mayor (B), novena mayor (D). Clases de altura: 0, 4, 7, 11, 2.',
  },
  l7u21m1e2: {
    prompt:
      'Construye un acorde Dm9. Selecciona las 5 notas: fundamental, tercera menor, quinta justa, séptima menor y novena mayor.',
    hint: 'Dm9 = D, F, A, C, E. Apilamiento: fundamental (D), tercera menor (F), quinta justa (A), séptima menor (C), novena mayor (E). Clases de altura: 2, 5, 9, 0, 4.',
  },
  l7u21m1e3: {
    prompt:
      'En el cifrado jazz, ¿qué indica "alt" (como en G7alt)?',
    choices: [
      'Un acorde dominante con quintas y novenas alteradas (b5/#5, b9/#9)',
      'Un voicing alternativo de un acorde dominante estándar',
      'Un acorde que alterna entre cualidad mayor y menor',
      'Un acorde que puede sustituirse por cualquier otro',
    ],
    hint: 'El sufijo "alt" significa que el acorde tiene extensiones alteradas: b9, #9, b5 (o #11) y #5 (o b13). Se empareja con la escala alterada (superlocria).',
  },

  // ---- l7u21m2: Voicings de Shell ----

  l7u21m2e1: {
    prompt: 'Un voicing de shell contiene típicamente qué notas del acorde?',
    choices: [
      'Solo fundamental, tercera y séptima — omitiendo la quinta y las extensiones',
      'Fundamental, quinta y octava — omitiendo la tercera y la séptima',
      'Todas las siete notas de la escala madre',
      'Solo fundamental y quinta — un voicing de power chord',
    ],
    hint: 'Los voicings de shell reducen el acorde a lo esencial: la fundamental define el bajo, la tercera determina la cualidad mayor/menor y la séptima determina el tipo de acorde (maj7, dom7, m7). En esos acordes la quinta justa es redundante; en los acordes m7b5 y dim7 es la quinta disminuida la que define el acorde, así que se queda.',
  },
  l7u21m2e2: {
    prompt:
      '¿Cuál es la característica definitoria de un acorde dominante alterado?',
    choices: [
      'Tiene una séptima dominante con una o más quintas o novenas cromáticamente alteradas',
      'Sustituye la tercera por una cuarta suspendida',
      'Usa solo notas de la escala de tonos enteros',
      'Omite la fundamental por completo',
    ],
    hint: 'Un acorde dominante alterado mantiene la fundamental, tercera y b7, pero altera cromáticamente la quinta (b5 o #5) y la novena (b9 o #9), creando tensión máxima antes de la resolución.',
  },
  l7u21m2e3: {
    prompt:
      'En la armonía jazz, ¿cuál es la función típica de un acorde sus4 (p. ej., G7sus4)?',
    choices: [
      'Retrasa la resolución sustituyendo la tercera por una cuarta, creando anticipación antes del V7',
      'Funciona siempre como acorde de tónica',
      'Actúa como sustituto del acorde ii',
      'Se usa exclusivamente en el jazz modal',
    ],
    hint: 'Un acorde sus4 sustituye la tercera por una cuarta, eliminando la cualidad mayor/menor. En el jazz, G7sus4 precede frecuentemente a G7 en una resolución V7sus4 → V7 → I, retrasando la sensible.',
  },

  // ---- l7u21m3: Progresión ii-V-I ----

  l7u21m3e1: {
    prompt:
      'Construye el acorde ii7 en C mayor (Dm7). Selecciona las 4 notas: D, F, A, C.',
    hint: 'Dm7 = D, F, A, C. Fundamental (D), tercera menor (F), quinta justa (A), séptima menor (C). Clases de altura: 2, 5, 9, 0.',
  },
  l7u21m3e2: {
    prompt:
      'Construye el acorde V7 en C mayor (G7). Selecciona las 4 notas: G, B, D, F.',
    hint: 'G7 = G, B, D, F. Fundamental (G), tercera mayor (B), quinta justa (D), séptima menor (F). Clases de altura: 7, 11, 2, 5.',
  },
  l7u21m3e3: {
    prompt: '¿Por qué la ii-V-I es la progresión más importante del jazz?',
    choices: [
      'Combina las funciones de subdominante, dominante y tónica en el movimiento cadencial más fuerte posible',
      'Fue inventada por Duke Ellington y se convirtió en un estándar del jazz',
      'Usa solo tres notas en total entre los tres acordes',
      'Evita cualquier disonancia, facilitando la improvisación',
    ],
    hint: 'La ii-V-I encapsula el movimiento armónico completo: preparación (ii), tensión (V), resolución (I). Casi todos los estándares de jazz contienen múltiples progresiones ii-V-I en varias tonalidades.',
  },

  // ---- l7u21m4: Sustitución Tritonal ----

  l7u21m4e1: {
    prompt:
      'Construye la sustitución tritonal de G7: Db7. Selecciona las 4 notas: Db, F, Ab, Cb.',
    hint: 'Db7 = Db, F, Ab, Cb. La sustitución tritonal comparte el mismo intervalo de tritono (F-Cb enarmónico de F-B) del acorde G7 original. Clases de altura: 1, 5, 8, 11.',
  },
  l7u21m4e2: {
    prompt: '¿Cuál es el principio detrás de la sustitución tritonal?',
    choices: [
      'Dos acordes de séptima dominante a un tritono de distancia comparten la misma tercera y séptima (enarmónicamente), por lo que uno puede sustituir al otro',
      'Cualquier acorde puede sustituirse por el acorde a un tritono de distancia independientemente de la cualidad',
      'La sustitución tritonal mueve siempre la fundamental un tono arriba',
      'Sustituye el acorde V por el acorde IV',
    ],
    hint: 'G7 tiene B y F como tercera y séptima. Db7 tiene F y Cb (=B) como tercera y séptima. Las notas guía son idénticas (enarmónicamente), por lo que Db7 puede resolver a C igual que G7.',
  },
  l7u21m4e3: {
    prompt: 'En la progresión Dm7 - Db7 - Cmaj7, ¿qué es el acorde Db7?',
    choices: [
      'Una sustitución tritonal de G7, creando una línea cromática de bajo (D - Db - C)',
      'Un acorde prestado de Db mayor',
      'El acorde napolitano en primera inversión',
      'Un acorde disminuido de paso reescrito enarmónicamente',
    ],
    hint: 'Db7 sustituye a G7 (el V7). El bajo desciende cromáticamente: D (ii) - Db (sustitución tritonal del V) - C (I). Esta conducción de voces suave es una de las principales ventajas de las sustituciones tritonales.',
  },

  // ---- l7u21m5: Formas de Blues ----

  l7u21m5e1: {
    prompt:
      '¿Cuál es la progresión estándar de un blues básico de 12 compases en la tonalidad de C?',
    choices: [
      'I7-I7-I7-I7 | IV7-IV7-I7-I7 | V7-IV7-I7-V7 (forma C7-F7-G7)',
      'I-IV-V-I | I-IV-V-I | I-IV-V-I (tres acordes simples repetidos)',
      'ii-V-I-vi | ii-V-I-vi | ii-V-I-vi (turnaround jazz repetido)',
      'I-V-vi-IV | I-V-vi-IV | I-V-vi-IV (bucle pop repetido)',
    ],
    hint: 'El blues de 12 compases sigue un patrón específico a lo largo de 12 compases: 4 compases de I7, 2 de IV7, 2 de I7, después V7-IV7-I7-V7 (turnaround). Todos los acordes son de séptima dominante.',
  },
  l7u21m5e2: {
    prompt:
      '¿Por qué el acorde I en el blues usa cualidad de séptima dominante (p. ej., C7) en lugar de séptima mayor?',
    choices: [
      'La tonalidad blues usa la b7 como blue note; la séptima dominante en todos los acordes es una característica definitoria del estilo',
      'Porque los músicos de blues no conocían los acordes de séptima mayor',
      'La séptima dominante es más fácil de tocar en la guitarra',
      'Es una convención notacional que no afecta al sonido',
    ],
    hint: 'En el blues, la b7 forma parte de la escala blues y del sonido general del blues. Todos los acordes — I, IV y V — usan cualidad de séptima dominante. Esto desafía la teoría clásica, donde I7 implicaría un dominante secundario.',
  },
  l7u21m5e3: {
    prompt:
      '¿Qué se añade normalmente al blues básico de 12 compases para crear un "jazz blues"?',
    choices: [
      'Turnarounds ii-V, sustituciones tritonales y acordes disminuidos de paso',
      'Solo acordes de séptima mayor sustituyen a todas las séptimas dominantes',
      'Un cambio de tonalidad cada 4 compases',
      'Exclusivamente acordes menores a lo largo de toda la forma',
    ],
    hint: 'El jazz blues enriquece la forma básica insertando progresiones ii-V (p. ej., los compases 9-10 pasan a ser ii-V en lugar de solo V-IV), añadiendo sustituciones tritonales y usando turnarounds rápidos ii-V para crear movimiento armónico.',
  },

  // ---- l7u21m6: Rhythm Changes ----

  l7u21m6e1: {
    prompt: '¿Cuál es la forma de los "rhythm changes" en el jazz?',
    choices: [
      'AABA — 32 compases con un puente de 8 compases',
      'ABAB — secciones alternadas de 8 compases',
      'Blues de 12 compases repetido con variaciones',
      'Forma continua sin secciones repetidas',
    ],
    hint: 'Los rhythm changes siguen una forma AABA de 32 compases: las secciones A usan progresiones basadas en I-vi-ii-V, y la sección B (puente) usa típicamente un ciclo de dominantes. Basado en los cambios armónicos de una famosa pieza de Gershwin.',
  },
  l7u21m6e2: {
    prompt:
      '¿Cuál es una progresión típica de turnaround al final de una sección A en los rhythm changes?',
    choices: [
      'I - vi - ii - V (o I - VI7 - ii - V7)',
      'IV - V - I - I',
      'I - IV - I - V',
      'vi - IV - I - V',
    ],
    hint: 'El turnaround (I-vi-ii-V) recicla hacia el inicio de la forma. En el jazz, el vi se sustituye frecuentemente por VI7 (un dominante secundario), y se enriquece aún más con sustituciones tritonales y acordes de paso.',
  },
  l7u21m6e3: {
    prompt:
      '¿Qué recurso armónico se emplea comúnmente en el puente de los rhythm changes?',
    choices: [
      'Un ciclo de acordes de séptima dominante que se mueve por el ciclo de quintas (cada uno resuelve una quinta abajo hacia el siguiente)',
      'Una nota pedal sostenida sin cambios de acordes',
      'Una repetición exacta de la sección A en otra tonalidad',
      'Una serie dodecafónica',
    ],
    hint: 'El puente presenta típicamente una cadena de séptimas dominantes: III7-VI7-II7-V7 (en Bb: D7-G7-C7-F7). Cada dominante resuelve una quinta abajo hacia el siguiente, creando un fuerte impulso hacia adelante.',
  },

  // =========================================================================
  // Unidad 22: Jazz Avanzado, Modal, Pop
  // =========================================================================

  // ---- l7u22m1: Teoría Acorde-Escala ----

  l7u22m1e1: {
    prompt:
      'Construye D dórico — la escala de acorde para Dm7 en una ii-V-I en C. Selecciona las 7 notas.',
    hint: 'D dórico: D, E, F, G, A, B, C. Es el 2.º modo de C mayor. La sexta natural (B) lo distingue del menor natural (que tiene Bb). Clases de altura: 2, 4, 5, 7, 9, 11, 0.',
  },
  l7u22m1e2: {
    prompt:
      'Construye G mixolidio — la escala de acorde para G7 en una ii-V-I en C. Selecciona las 7 notas.',
    hint: 'G mixolidio: G, A, B, C, D, E, F. Es el 5.º modo de C mayor. La b7 (F en lugar de F#) define el sonido dominante. Clases de altura: 7, 9, 11, 0, 2, 4, 5.',
  },
  l7u22m1e3: {
    prompt: '¿Cuál es el principio fundamental de la teoría acorde-escala?',
    choices: [
      'Cada acorde en una progresión tiene una escala correspondiente cuyas notas están todas disponibles para melodía e improvisación',
      'Cada acorde solo puede usar notas de una escala fija a lo largo de toda la pieza',
      'Las escalas se construyen apilando acordes unos sobre otros',
      'La teoría acorde-escala se aplica solo a tonalidades mayores',
    ],
    hint: 'La teoría acorde-escala empareja cada acorde con una escala madre. Sobre Dm7, toca D dórico; sobre G7, toca G mixolidio; sobre Cmaj7, toca C jónico. La escala cambia con cada acorde.',
  },

  // ---- l7u22m2: Estructuras Superiores ----

  l7u22m2e1: {
    prompt: '¿Qué es una tríada de estructura superior en los voicings de jazz?',
    choices: [
      'Una tríada tocada en el registro agudo sobre una fundamental y séptima diferentes en el bajo, produciendo extensiones y alteraciones',
      'Las tres notas superiores de cualquier acorde de séptima',
      'Una tríada tocada una octava por encima de lo escrito',
      'Una técnica de análisis estructural para identificar formas',
    ],
    hint: 'Las estructuras superiores superponen una tríada simple (p. ej., D mayor) sobre una nota de bajo y séptima (p. ej., C y Bb), creando extensiones complejas. D/C7 resulta en C7 con novena, #11 y decimotercera.',
  },
  l7u22m2e2: {
    prompt: '¿Qué es la rearmonización en el jazz?',
    choices: [
      'Sustituir los acordes originales de una melodía por acordes diferentes que continúan soportando las notas melódicas',
      'Tocar los mismos acordes pero en otra tonalidad',
      'Añadir voces armónicas a una melodía a solo',
      'Eliminar todos los acordes y tocar la melodía sin acompañamiento',
    ],
    hint: 'La rearmonización altera el contexto armónico bajo una melodía. Las técnicas incluyen sustitución tritonal, cambios de cualidad de acordes, aproximaciones cromáticas y movimiento de estructura constante.',
  },
  l7u22m2e3: {
    prompt: '¿Qué es una línea cromática de bajo en la armonía jazz?',
    choices: [
      'Una línea de bajo que se mueve por semitonos, frecuentemente lograda mediante inversiones, acordes de paso y sustituciones tritonales',
      'Una línea de bajo que usa solo la escala cromática de 12 notas sin repetición',
      'Una línea de bajo que toca solo las notas cromáticas (teclas negras)',
      'Una línea de bajo que se mueve en movimiento contrario a la melodía',
    ],
    hint: 'El movimiento cromático del bajo crea conducción de voces suave: p. ej., C - B - Bb - A (Cmaj7 - B7 o G/B - Bb7 o C7/Bb - Am7). Cada acorde se elige para sostener un descenso del bajo por semitono.',
  },

  // ---- l7u22m3: Cambios de Coltrane ----

  l7u22m3e1: {
    prompt:
      '¿Qué movimiento de centros tonales define los "cambios de Coltrane" (como en Giant Steps)?',
    choices: [
      'Centros tonales moviéndose por terceras mayores, dividiendo la octava en tres partes iguales',
      'Centros tonales moviéndose por segundas menores cromáticamente',
      'Centros tonales moviéndose por quintas justas a lo largo del ciclo',
      'Centros tonales alternando entre dos tonalidades a un tritono de distancia',
    ],
    hint: 'Los cambios de Coltrane recorren tres centros tonales a una tercera mayor de distancia (p. ej., B, G, Eb). Estas tres tonalidades dividen la octava simétricamente en tres segmentos iguales de 4 semitonos cada uno.',
  },
  l7u22m3e2: {
    prompt:
      'En los cambios de Coltrane, ¿cómo se abordan típicamente los centros tonales?',
    choices: [
      'Cada centro tonal es precedido por su propio acorde V7, creando movimiento rápido ii-V o V-I',
      'Los centros tonales se enlazan solo mediante acordes disminuidos de paso',
      'Modulación directa sin ninguna preparación',
      'Cada tonalidad se aborda mediante una cadencia interrumpida desde la tonalidad anterior',
    ],
    hint: 'Coltrane prepara cada tónica con su dominante: p. ej., Bmaj7 - D7 - Gmaj7 - Bb7 - Ebmaj7. El D7 es el V7 de G, Bb7 es el V7 de Eb. Esto crea movimiento constante dominante-tónica.',
  },
  l7u22m3e3: {
    prompt: '¿Qué es la "estructura constante" en la armonía jazz?',
    choices: [
      'Mover la misma cualidad de acorde en paralelo a través de un patrón de fundamentales no diatónico, manteniendo la forma del voicing',
      'Usar el mismo acorde durante toda una pieza',
      'Un método de análisis estructural para identificar motivos melódicos',
      'Construir todos los acordes a partir de las mismas cuatro notas',
    ],
    hint: 'La estructura constante mueve un tipo de acorde fijo (p. ej., maj7) a través de una secuencia de fundamentales (p. ej., Cmaj7 - Ebmaj7 - Gbmaj7 - Amaj7). La forma del voicing se mantiene idéntica mientras el patrón de fundamentales crea interés armónico.',
  },

  // ---- l7u22m4: Armonía Modal ----

  l7u22m4e1: {
    prompt:
      'Construye el modo D dórico. Este modo crea un sonido menor con una sexta natural característica.',
    hint: 'D dórico: D, E, F, G, A, B, C. Comparado con D menor natural, el 6.º grado está elevado (B natural en lugar de Bb). Clases de altura: 2, 4, 5, 7, 9, 11, 0.',
  },
  l7u22m4e2: {
    prompt:
      'Construye el modo E frigio. Este modo tiene un semitono distintivo desde la fundamental hasta el 2.º grado.',
    hint: 'E frigio: E, F, G, A, B, C, D. La b2 (F natural, un semitono por encima de E) le da al frigio su carácter oscuro y con sabor español. Clases de altura: 4, 5, 7, 9, 11, 0, 2.',
  },
  l7u22m4e3: {
    prompt:
      '¿Cómo difiere la armonía modal de la armonía tonal (funcional)?',
    choices: [
      'La armonía modal enfatiza un centro tonal estático y evita la resolución dominante-tónica, dejando que el color del modo defina el sonido',
      'La armonía modal usa más acordes que la armonía tonal',
      'La armonía modal usa siempre escalas menores exclusivamente',
      'No hay diferencia funcional; son términos intercambiables',
    ],
    hint: 'En la armonía tonal, los acordes tienen funciones (tónica, dominante, subdominante) que impulsan la resolución. En la armonía modal, un modo colorea un vamp o pedal estático, y las progresiones evitan cadencias V-I que establecerían una tonalidad.',
  },

  // ---- l7u22m5: Voicings Cuartales/Quintales ----

  l7u22m5e1: {
    prompt: '¿Qué define un voicing cuartal?',
    choices: [
      'Notas apiladas en intervalos de cuartas justas en lugar de terceras',
      'Un voicing que usa cuatro notas de un acorde de séptima',
      'Un acorde tocado en cuatro octavas simultáneamente',
      'Una técnica de voicing exclusiva de cuartetos de cuerda',
    ],
    hint: 'La armonía cuartal apila cuartas (p. ej., C-F-Bb-Eb). Esto crea un sonido ambiguo y abierto que evita una cualidad mayor/menor clara. McCoy Tyner popularizó los voicings cuartales en el jazz modal.',
  },
  l7u22m5e2: {
    prompt: '¿Cómo difiere la armonía quintal de la armonía cuartal?',
    choices: [
      'La armonía quintal apila quintas justas en lugar de cuartas, produciendo un sonido igualmente abierto pero ligeramente diferente',
      'Quintal usa cinco notas mientras que cuartal usa cuatro',
      'Quintal se usa en el pop mientras que cuartal se usa en el jazz',
      'Son idénticas ya que una cuarta invertida es una quinta',
    ],
    hint: 'Aunque una cuarta invertida es una quinta, el sonido del voicing difiere según el registro y el espaciamiento. Los voicings quintales (p. ej., C-G-D-A) crean sonoridades amplias y brillantes. Ambos evitan la armonía tradicional tercial (basada en terceras).',
  },
  l7u22m5e3: {
    prompt:
      '¿Qué papel desempeñan los pedales en la armonía modal y cuartal?',
    choices: [
      'Anclan el centro tonal, permitiendo que los colores modales se desarrollen sin progresiones de acordes funcionales',
      'Proporcionan subdivisión rítmica para el ensemble',
      'Se usan solo en la música clásica india, no en el jazz',
      'Crean función dominante al sostener la quinta de la tonalidad',
    ],
    hint: 'Un pedal (nota de bajo sostenida o quinta abierta) establece un centro modal. Sobre un pedal de D, puedes explorar libremente D dórico, D mixolidio u otros modos sin que la armonía empuje hacia la resolución.',
  },

  // =========================================================================
  // Unidad 23: Armonía Pop y Taxonomía
  // =========================================================================

  // ---- l7u23m1: Progresiones Pop ----

  l7u23m1e1: {
    prompt:
      '¿Qué progresión se denomina frecuentemente el "bucle pop de cuatro acordes"?',
    choices: [
      'I - V - vi - IV',
      'I - IV - V - I',
      'ii - V - I - vi',
      'I - bVII - IV - I',
    ],
    hint: 'I-V-vi-IV (en C: C-G-Am-F) es una de las progresiones pop más comunes. Se repite indefinidamente y soporta tanto melodías edificantes como melancólicas dependiendo de qué acorde enfatice la melodía.',
  },
  l7u23m1e2: {
    prompt: '¿Qué es el sistema de números de Nashville?',
    choices: [
      'Una notación abreviada que usa números arábigos (1-7) para grados de la escala, permitiendo transposición instantánea a cualquier tonalidad',
      'Un método de contar compases en grabaciones de música country',
      'Un sistema de afinación desarrollado en estudios de grabación de Nashville',
      'Un sistema de notación rítmica para bateristas de sesión',
    ],
    hint: 'El sistema de números de Nashville escribe acordes como números de grados de la escala (1=I, 4=IV, 5=V). Una cifra que lee "1-5-6m-4" puede tocarse en cualquier tonalidad instantáneamente. Se usa extensivamente en sesiones de estudio de Nashville.',
  },
  l7u23m1e3: {
    prompt: '¿Qué es un "bucle pop" y por qué es eficaz?',
    choices: [
      'Una progresión corta de acordes que se repite (normalmente 4 compases) proporcionando continuidad armónica mientras la melodía y la letra evolucionan',
      'Un bucle de audio digital muestreado de un éxito existente',
      'Una técnica de producción específica que repite la melodía del estribillo',
      'Un riff de bajo que recorre las 12 notas',
    ],
    hint: 'Los bucles pop (como I-V-vi-IV o vi-IV-I-V) repiten un pequeño patrón armónico a lo largo de la canción. La armonía estática permite que la melodía, el ritmo y la producción lleven el interés musical, lo que se adapta a las formas estrofa/estribillo.',
  },

  // ---- l7u23m2: Mezcla Modal en el Pop ----

  l7u23m2e1: {
    prompt:
      'Cuando una canción pop en una tonalidad mayor usa un acorde bVII (p. ej., Bb mayor en la tonalidad de C), ¿qué técnica se emplea?',
    choices: [
      'Mezcla modal (préstamo del paralelo menor/modo mixolidio)',
      'Una modulación a la tonalidad de Bb mayor',
      'Un dominante secundario apuntando al acorde IV',
      'Una reescritura enarmónica del acorde vii disminuido',
    ],
    hint: 'bVII se toma prestado del mixolidio de C o del C menor natural. En C mayor, Bb no es diatónico, pero tomarlo prestado crea un sonido rock/pop. Esto es mezcla modal (también llamada acordes prestados).',
  },
  l7u23m2e2: {
    prompt:
      '¿Qué efecto emocional crea típicamente una relación de mediante cromática (p. ej., C mayor a Ab mayor) en la música pop?',
    choices: [
      'Un cambio dramático y cinematográfico de color — inesperado pero suave debido a notas compartidas o estrechamente relacionadas',
      'Una sensación de regreso a casa, a la tónica',
      'Ningún efecto notable ya que los acordes están estrechamente relacionados',
      'Un choque disonante que suena como un error',
    ],
    hint: 'C mayor (C, E, G) y Ab mayor (Ab, C, Eb) comparten una nota común (C). El E y el Eb están a un semitono de distancia, creando el cambio de color suave característico de las mediantes cromáticas.',
  },
  l7u23m2e3: {
    prompt:
      '¿Qué es una modulación directa (o abrupta) en la composición pop?',
    choices: [
      'Cambiar de tonalidad sin acorde pivote ni preparación — la nueva tonalidad simplemente comienza',
      'Un cambio gradual de tonalidad que tarda varios compases en completarse',
      'Una modulación que sube siempre un semitono',
      'Usar una ii-V-I para hacer la transición suave entre tonalidades',
    ],
    hint: 'La modulación directa (también llamada abrupta o de frase) simplemente comienza una nueva sección en la nueva tonalidad sin preparación armónica. Común en el pop: el último estribillo salta un semitono o un tono para más energía.',
  },

  // ---- l7u23m3: Modos de la Menor Melódica ----

  l7u23m3e1: {
    prompt:
      'Construye la escala de C menor melódica (forma ascendente). Selecciona las 7 notas.',
    hint: 'C menor melódica: C, D, Eb, F, G, A, B. Es como C mayor con una b3. La sexta natural (A) y la séptima natural (B) la distinguen de la menor natural y de la menor armónica. Clases de altura: 0, 2, 3, 5, 7, 9, 11.',
  },
  l7u23m3e2: {
    prompt:
      'Construye la escala alterada de G (7.º modo de Ab menor melódica). Selecciona las 7 notas.',
    hint: 'G alterada (superlocria): G, Ab, Bb, Cb, Db, Eb, F. Todas las notas no esenciales están alteradas: b9, #9 (=b3), b5 (#11), b13 (#5). Clases de altura: 7, 8, 10, 11, 1, 3, 5.',
  },
  l7u23m3e3: {
    prompt:
      'La escala lidia dominante (4.º modo de la menor melódica) se usa comúnmente sobre qué tipo de acorde?',
    choices: [
      'Acordes de séptima dominante con #11, especialmente sustituciones tritonales y dominantes no resolutivos',
      'Acordes m7 en una ii-V-I',
      'Acordes maj7 con función de tónica',
      'Acordes disminuidos de paso',
    ],
    hint: 'La lidia dominante (p. ej., C D E F# G A Bb) combina una #4 (lidia) con una b7 (dominante). Encaja en acordes dominantes 7(#11) y es la escala de referencia para acordes de sustitución tritonal.',
  },

  // ---- l7u23m4: Menor Armónica/Simétricas/Mundo ----

  l7u23m4e1: {
    prompt:
      'Construye la escala de C tonos enteros. Esta escala simétrica de 6 notas tiene intervalos de tono iguales a lo largo de toda la escala.',
    hint: 'C tonos enteros: C, D, E, F#, G#, A#. Cada intervalo es un tono (2 semitonos). Existen solo dos escalas de tonos enteros únicas (la otra empieza en Db). Clases de altura: 0, 2, 4, 6, 8, 10.',
  },
  l7u23m4e2: {
    prompt:
      'Construye la escala disminuida semitono-tono de C. Esta escala simétrica de 8 notas alterna semitonos y tonos.',
    hint: 'C disminuida semitono-tono: C, Db, Eb, E, F#, G, A, Bb. Alterna semitono, tono a lo largo de toda la escala. Existen solo tres escalas disminuidas distintas. Clases de altura: 0, 1, 3, 4, 6, 7, 9, 10.',
  },
  l7u23m4e3: {
    prompt: '¿Cuál es la propiedad definitoria de una escala simétrica?',
    choices: [
      'Divide la octava en segmentos iguales usando un patrón de intervalos repetitivo, produciendo transposiciones limitadas',
      'Tiene la misma forma ascendente y descendente',
      'Contiene exactamente 7 notas como las escalas diatónicas',
      'Suena igual tocada de adelante hacia atrás o de atrás hacia adelante',
    ],
    hint: 'Las escalas simétricas repiten un patrón fijo de intervalos (p. ej., tonos enteros = T-T-T-T-T-T; disminuida = sT-T-sT-T-sT-T-sT-T). Esta simetría significa que tienen menos transposiciones únicas que las escalas asimétricas.',
  },

  // ---- l7u23m5: Taxonomía Completa de Acordes ----

  l7u23m5e1: {
    prompt:
      '¿Cuántos tipos básicos de tríada existen en la teoría musical occidental?',
    choices: [
      '4 — mayor, menor, disminuida y aumentada',
      '2 — solo mayor y menor',
      '3 — mayor, menor y disminuida',
      '7 — una para cada grado de la escala',
    ],
    hint: 'Existen exactamente 4 tipos de tríada, definidos por la tercera y la quinta: mayor (3.ªM+5.ªJ), menor (3.ªm+5.ªJ), disminuida (3.ªm+5.ªdism) y aumentada (3.ªM+5.ªaum). Todas las demás designaciones triádicas son variantes de estas cuatro.',
  },
  l7u23m5e2: {
    prompt: '¿Qué hace de un acorde un acorde "con extensiones"?',
    choices: [
      'Incluye notas más allá de la séptima — la novena, undécima o decimotercera — construidas continuando el apilamiento de terceras',
      'Usa más de 4 notas de cualquier fuente',
      'Abarca más de una octava en el instrumento',
      'Añade notas cromáticas no encontradas en la escala madre',
    ],
    hint: 'Los acordes con extensiones continúan el principio tercial (apilamiento de terceras) más allá de la séptima: novena = octava + segunda, undécima = octava + cuarta, decimotercera = octava + sexta. Un acorde de decimotercera contiene teóricamente los 7 grados de la escala.',
  },
  l7u23m5e3: {
    prompt:
      '¿Qué agrupación organiza correctamente las principales familias de cualidad de acordes?',
    choices: [
      'Familia mayor (maj, maj7, maj9), familia menor (m, m7, m9), familia dominante (7, 9, 13), familia disminuida (dim, dim7), familia aumentada (aug, aug7)',
      'Acordes consonantes (mayor, menor) y acordes disonantes (todos los acordes de séptima y más allá)',
      'Familia diatónica (I, ii, iii, IV, V, vi) y familia cromática (todo lo demás)',
      'Acordes simples (tríadas) y acordes complejos (todo con más de 3 notas)',
    ],
    hint: 'Las familias de cualidad de acorde agrupan acordes por su sonido esencial: la familia mayor tiene tercera mayor y séptima mayor; la familia dominante tiene tercera mayor y séptima menor; la familia menor tiene tercera menor. Las extensiones expanden cada familia.',
  },
};

export default overlay;
