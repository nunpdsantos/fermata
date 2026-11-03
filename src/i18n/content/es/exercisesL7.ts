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
      "Una dominante con la quinta o la novena elevada o rebajada",
      "Una dominante con la tercera sustituida por la cuarta",
      "Una dominante con la séptima elevada a séptima mayor",
      "Una dominante con la fundamental eliminada del voicing",
    ],
    hint: 'El sufijo "alt" significa que el acorde tiene extensiones alteradas: b9, #9, b5 (o #11) y #5 (o b13). Se empareja con la escala alterada (superlocria).',
  },

  // ---- l7u21m2: Voicings de Shell ----

  l7u21m2e1: {
    prompt: '¿Qué notas del acorde contiene típicamente un voicing de shell?',
    choices: [
      'Solo fundamental, tercera y séptima — omitiendo la quinta y las extensiones',
      "Solo fundamental, tercera y quinta — omitiendo la séptima y las extensiones",
      "Solo fundamental, quinta y séptima — omitiendo la tercera y las extensiones",
      "Solo fundamental, quinta y novena — omitiendo la tercera y la séptima",
    ],
    hint: 'Los voicings de shell reducen el acorde a lo esencial: la fundamental define el bajo, la tercera determina la cualidad mayor/menor y la séptima determina el tipo de acorde (maj7, dom7, m7). En esos acordes la quinta justa es redundante; en los acordes m7b5 y dim7 es la quinta disminuida la que define el acorde, así que se queda.',
  },
  l7u21m2e2: {
    prompt:
      '¿Cuál es la característica definitoria de un acorde dominante alterado?',
    choices: [
      'Siempre tiene una séptima de dominante con una o más quintas o novenas cromáticamente alteradas',
      'Suele sustituir la tercera mayor por una cuarta suspendida',
      'Eleva la séptima menor a séptima mayor',
      'Se define por omitir la fundamental en la disposición del acorde',
    ],
    hint: 'Un acorde dominante alterado mantiene la fundamental, tercera y b7, pero altera cromáticamente la quinta (b5 o #5) y/o la novena (b9 o #9), creando tensión máxima antes de la resolución.',
  },
  l7u21m2e3: {
    prompt:
      '¿Cómo retrasa G7sus4 la resolución cuando conduce a G7?',
    choices: [
      'Sustituyendo la tercera por una cuarta',
      'Añadiendo una cuarta junto a la tercera',
      'Sustituyendo la quinta por una cuarta',
      'Manteniendo la cuarta hasta que sube a la quinta',
    ],
    hint: 'Un acorde sus4 sustituye la tercera por una cuarta, eliminando la cualidad mayor/menor. En el jazz, G7sus4 precede frecuentemente a G7 en una resolución V7sus4 → V7 → I, retrasando la sensible.',
  },

  // ---- l7u21m3: Progresión ii-V-I ----

  l7u21m3e1: {
    prompt:
      'Construye el acorde ii7 en C mayor. Selecciona las 4 notas.',
    hint: 'Dm7 = D, F, A, C. Fundamental (D), tercera menor (F), quinta justa (A), séptima menor (C). Clases de altura: 2, 5, 9, 0.',
  },
  l7u21m3e2: {
    prompt:
      'Construye el acorde V7 en C mayor. Selecciona las 4 notas.',
    hint: 'G7 = G, B, D, F. Fundamental (G), tercera mayor (B), quinta justa (D), séptima menor (F). Clases de altura: 7, 11, 2, 5.',
  },
  l7u21m3e3: {
    prompt: '¿Por qué la ii-V-I es la progresión más importante del jazz?',
    choices: [
      'Preparación → tensión → reposo',
      'Tensión → reposo → preparación',
      'Reposo → tensión → preparación',
      'Reposo → preparación → tensión',
    ],
    hint: 'La ii-V-I encapsula el movimiento armónico completo: preparación (ii), tensión (V), resolución (I). Casi todos los estándares de jazz contienen múltiples progresiones ii-V-I en varias tonalidades.',
  },

  // ---- l7u21m4: Sustitución Tritonal ----

  l7u21m4e1: {
    prompt:
      'Construye la sustitución tritonal de G7. Selecciona las 4 notas.',
    hint: 'Db7 = Db, F, Ab, Cb. La sustitución tritonal comparte el mismo intervalo de tritono (F-Cb enarmónico de F-B) del acorde G7 original. Clases de altura: 1, 5, 8, 11.',
  },
  l7u21m4e2: {
    prompt: '¿Cuál es el principio de sustituir un acorde de séptima dominante por otro acorde de séptima dominante a un trítono de distancia?',
    choices: [
      "Sus terceras y séptimas son las mismas dos clases de altura, con los papeles intercambiados",
      "Sus fundamentales y quintas suelen ser las mismas dos clases de altura, con los papeles intercambiados",
      "Sus terceras y séptimas suben un tono, manteniendo los mismos papeles en el nuevo acorde",
      'Sus fundamentales están a un trítono de distancia, y sus quintas mantienen la misma clase de altura',
    ],
    hint: 'G7 tiene B y F como tercera y séptima. Db7 tiene F y Cb (=B) como tercera y séptima. Las notas guía son idénticas (enarmónicamente), por lo que Db7 puede resolver a C igual que G7.',
  },
  l7u21m4e3: {
    prompt: 'En la progresión Dm7 - Db7 - Cmaj7, ¿qué es el acorde Db7?',
    choices: [
      'Una sustitución tritonal de G7, con el bajo descendiendo solo por semitonos, de D a Db y de ahí a C',
      'Una sustitución por la dominante back-door, con el bajo descendiendo solo por semitonos, de D a Db y de ahí a C',
      "Una sustitución tritonal de D7, con el bajo descendiendo solo por semitonos, de D a Db y de ahí a C",
      "Una sustitución tritonal de F7, con el bajo descendiendo solo por semitonos, de D a Db y de ahí a C",
    ],
    hint: 'Db7 sustituye a G7 (el V7). El bajo desciende cromáticamente: D (ii) - Db (sustitución tritonal del V) - C (I). Esta conducción de voces suave es una de las principales ventajas de las sustituciones tritonales.',
  },

  // ---- l7u21m5: Formas de Blues ----

  l7u21m5e1: {
    prompt:
      '¿Cuál es la progresión estándar de un blues básico de 12 compases en la tonalidad de C?',
    choices: [
      'I7-I7-I7-I7 | IV7-IV7-I7-I7 | V7-IV7-I7-V7 (forma C7-F7-G7)',
      "V7-V7-V7-V7 | IV7-IV7-V7-V7 | I7-IV7-V7-I7 (forma C7-F7-G7)",
      "IV7-IV7-IV7-IV7 | I7-I7-IV7-IV7 | V7-I7-IV7-V7 (forma C7-F7-G7)",
      "I7-I7-I7-I7 | V7-V7-I7-I7 | IV7-V7-I7-IV7 (forma C7-F7-G7)",
    ],
    hint: 'El blues de 12 compases sigue un patrón específico a lo largo de 12 compases: 4 compases de I7, 2 de IV7, 2 de I7, después V7-IV7-I7-V7, cuyos dos últimos compases (I7-V7) forman el turnaround. Todos los acordes son de séptima de dominante.',
  },
  l7u21m5e2: {
    prompt:
      '¿Por qué el acorde I en el blues usa cualidad de séptima de dominante (p. ej., C7) en lugar de séptima mayor?',
    choices: [
      'La séptima rebajada pertenece al sonido del blues incluso en reposo, por eso C7 mantiene Bb sobre su tercera mayor',
      'La séptima rebajada obliga a I7 a resolver en IV, por eso C7 nunca puede terminar un blues',
      "La séptima rebajada transforma la tónica del blues en una tríada menor al cambiar E por Eb",
      "La séptima rebajada elimina la tercera de la tónica del blues, por eso C7 consiste en C, G y Bb",
    ],
    hint: 'En el blues, la b7 forma parte de la escala blues y del sonido general del blues. Todos los acordes — I, IV y V — usan cualidad de séptima de dominante. Esto desafía la teoría clásica, donde I7 implicaría una dominante secundaria.',
  },
  l7u21m5e3: {
    prompt:
      '¿Qué se añade normalmente al blues básico de 12 compases para crear un "jazz blues"?',
    choices: [
      'Turnarounds ii-V, sustituciones tritonales y acordes disminuidos de paso',
      'Sustituciones del blues menor: acordes de séptima menor en I y IV, con bVI7 (Ab7) en lugar de V7',
      'Un cambio de tonalidad cada 4 compases, medio tono más arriba cada vez (C, Db, D…)',
      'Exclusivamente acordes menores a lo largo de toda la forma',
    ],
    hint: 'El jazz blues enriquece la forma básica insertando progresiones ii-V (p. ej., los compases 9-10 pasan a ser ii-V en lugar de solo V-IV), añadiendo sustituciones tritonales y usando turnarounds rápidos ii-V para crear movimiento armónico.',
  },

  // ---- l7u21m6: Rhythm Changes ----

  l7u21m6e1: {
    prompt: '¿Cuál es la forma de los "rhythm changes" en el jazz?',
    choices: [
      "AABA — 32 compases en cuatro secciones de 8 compases",
      "ABAB — 32 compases en cuatro secciones de 8 compases",
      "ABBA — 32 compases en cuatro secciones de 8 compases",
      "ABAC — 32 compases en cuatro secciones de 8 compases",
    ],
    hint: 'Los rhythm changes siguen una forma AABA de 32 compases: las secciones A usan progresiones basadas en I-vi-ii-V, y la sección B (puente) usa típicamente un ciclo de dominantes. Basados en los cambios armónicos de una famosa pieza de Gershwin.',
  },
  l7u21m6e2: {
    prompt:
      '¿Cuál es una progresión típica de turnaround al final de una sección A en los rhythm changes?',
    choices: [
      'I–vi–ii–V',
      'ii–V–I–V',
      'IV–I–V–I',
      'I–V–vi–IV',
    ],
    hint: 'El turnaround (I-vi-ii-V) vuelve hacia el inicio de la forma. En el jazz, el vi se sustituye frecuentemente por VI7 (una dominante secundaria), y se enriquece aún más con sustituciones tritonales y acordes de paso.',
  },
  l7u21m6e3: {
    prompt:
      '¿Qué cadena de séptimas de dominante es típica en el puente de los rhythm changes en Bb mayor?',
    choices: [
      'D7–G7–C7–F7',
      'D7–C7–F7–G7',
      'D7–F7–C7–G7',
      'D7–F7–G7–C7',
    ],
    hint: 'El puente presenta típicamente una cadena de séptimas de dominante: III7-VI7-II7-V7 (en Bb: D7-G7-C7-F7). Cada dominante resuelve una quinta abajo hacia el siguiente, creando un fuerte impulso hacia adelante.',
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
      'Ajustar la escala de la melodía al acorde que está sonando',
      'Fijar la escala de la melodía según la armadura inicial',
      'Construir la escala de la melodía con las tres fundamentales siguientes',
      'Usar la escala mayor sobre cada fundamental, incluidos los acordes menores',
    ],
    hint: 'La teoría acorde-escala empareja cada acorde con una escala (a menudo un modo). Sobre Dm7, toca D dórico; sobre G7, toca G mixolidio; sobre Cmaj7, toca C jónico. La escala cambia con cada acorde.',
  },

  // ---- l7u22m2: Estructuras Superiores ----

  l7u22m2e1: {
    prompt: '¿Qué disposición ejemplifica una tríada de estructura superior sobre C7?',
    choices: [
      'D–F#–A sobre C–E–Bb',
      'C–E–G sobre C–E–Bb',
      'E–G–Bb sobre C–E–Bb',
      'E–G–B sobre C–E–Bb',
    ],
    hint: 'Las estructuras superiores superponen una tríada simple (p. ej., D mayor) sobre el shell de la dominante (fundamental, 3.ª y b7; p. ej., C, E y Bb), creando extensiones complejas. D/C7 resulta en C7 con novena, #11 y decimotercera.',
  },
  l7u22m2e2: {
    prompt: '¿Qué es la rearmonización en el jazz?',
    choices: [
      "Dar a la misma melodía otro conjunto de acordes de acompañamiento",
      "Dar a los mismos acordes otra melodía por encima",
      "Mover la melodía y todos sus acordes a otra tonalidad",
      "Mover cada acorde a otra inversión bajo la melodía",
    ],
    hint: 'La rearmonización altera el contexto armónico bajo una melodía. Las técnicas incluyen sustitución tritonal, cambios de cualidad de acordes, aproximaciones cromáticas y movimiento de estructura constante.',
  },
  l7u22m2e3: {
    prompt: '¿Qué es una línea cromática de bajo en la armonía jazz?',
    choices: [
      'Una línea de bajo que se mueve por semitonos, a menudo con inversiones, acordes de paso y sustituciones tritonales',
      "Una línea de bajo que se mueve por tonos enteros, a menudo con inversiones, acordes de paso y sustituciones tritonales",
      "Una línea de bajo que se mueve por terceras menores, a menudo con inversiones, acordes de paso y sustituciones tritonales",
      "Una línea de bajo que se mueve por quintas justas, a menudo con inversiones, acordes de paso y sustituciones tritonales",
    ],
    hint: 'El movimiento cromático del bajo crea conducción de voces suave: p. ej., C - B - Bb - A (Cmaj7 - B7 o G/B - Bb7 o C7/Bb - Am7). Cada acorde se elige para sostener un descenso del bajo por semitono.',
  },

  // ---- l7u22m3: Cambios de Coltrane ----

  l7u22m3e1: {
    prompt:
      '¿Qué movimiento de centros tonales define los "cambios de Coltrane" (como en Giant Steps)?',
    choices: [
      "Tres puntos de reposo tonal equidistantes, separados por una tercera mayor",
      "Cuatro puntos de reposo tonal equidistantes, separados por una tercera menor",
      "Dos puntos de reposo tonal equidistantes, separados por un tritono",
      "Seis puntos de reposo tonal equidistantes, separados por un tono",
    ],
    hint: 'Los cambios de Coltrane recorren tres centros tonales a una tercera mayor de distancia (p. ej., B, G, Eb). Estas tres tonalidades dividen la octava simétricamente en tres segmentos iguales de 4 semitonos cada uno.',
  },
  l7u22m3e2: {
    prompt:
      'En los cambios de Coltrane, ¿cómo se abordan típicamente los centros tonales?',
    choices: [
      'Por un acorde de 7.ª de dominante una quinta justa por encima de la tónica',
      'Por un acorde de 7.ª de dominante una tercera mayor por encima de la tónica',
      'Por un acorde de 7.ª mayor una quinta justa por encima de la tónica',
      'Por un acorde de 7.ª mayor una tercera mayor por encima de la tónica',
    ],
    hint: 'Coltrane prepara cada tónica con su dominante: p. ej., Bmaj7 - D7 - Gmaj7 - Bb7 - Ebmaj7. El D7 es el V7 de G, Bb7 es el V7 de Eb. Esto crea movimiento constante dominante-tónica.',
  },
  l7u22m3e3: {
    prompt: '¿Qué es la "estructura constante" en la armonía jazz?',
    choices: [
      "Mantener la misma forma de acorde al desplazarla fuera de la tonalidad",
      "Mantener la misma nota en el bajo al cambiar los acordes por encima",
      "Mantener la misma tonalidad al cambiar las cualidades de los acordes dentro de ella",
      "Mantener la misma melodía al sustituir sus acordes de acompañamiento",
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
      'La armonía modal mantiene un centro estático y evita la resolución V-I, dejando que el color del modo defina el sonido',
      'La armonía modal usa más acordes que la armonía tonal — los siete, uno para el modo de cada grado',
      'La armonía modal usa siempre escalas menores exclusivamente',
      'La armonía modal se apoya en una fuerte resolución V-I, como la tonal, pero usa el color del propio modo',
    ],
    hint: 'En la armonía tonal, los acordes tienen funciones (tónica, dominante, subdominante) que impulsan la resolución. En la armonía modal, un modo colorea un vamp o pedal estático, y las progresiones evitan cadencias V-I que establecerían una tonalidad.',
  },

  // ---- l7u22m5: Voicings Cuartales/Quintales ----

  l7u22m5e1: {
    prompt: '¿Qué define un voicing cuartal?',
    choices: [
      'Cuartas justas apiladas en lugar de terceras',
      "Quintas justas apiladas en lugar de terceras",
      "Terceras mayores apiladas en lugar de cuartas",
      "Segundas menores apiladas en lugar de terceras",
    ],
    hint: 'La armonía cuartal apila cuartas (p. ej., C-F-Bb-Eb). Esto crea un sonido ambiguo y abierto que evita una cualidad mayor/menor clara. McCoy Tyner popularizó los voicings cuartales en el jazz modal.',
  },
  l7u22m5e2: {
    prompt: '¿Cómo difiere la armonía quintal de la armonía cuartal?',
    choices: [
      'La armonía quintal apila quintas justas en lugar de cuartas, con un sonido igual de abierto',
      "La armonía quintal apila cuartas justas en lugar de quintas, con un sonido igual de abierto",
      "La armonía quintal apila terceras mayores en lugar de terceras menores, con un sonido igual de abierto",
      "La armonía quintal apila terceras menores en lugar de cuartas justas, con un sonido igual de abierto",
    ],
    hint: 'Aunque una cuarta invertida es una quinta, el sonido del voicing difiere según el registro y el espaciamiento. Los voicings quintales (p. ej., C-G-D-A) crean sonoridades amplias y brillantes. Ambos evitan la armonía tradicional tercial (basada en terceras).',
  },
  l7u22m5e3: {
    prompt:
      '¿Qué papel desempeñan los bordones en la armonía modal y cuartal?',
    choices: [
      "Mantienen una altura en el oído mientras los colores por encima pueden cambiar",
      "Suelen marcar subdivisiones del pulso sin sostener un centro de altura estable",
      "Desplazan el centro tonal un semitono arriba cada vez que cambia el acorde superior",
      "Elevan la sensible al sostener la tónica, convirtiendo el modo en mayor",
    ],
    hint: 'Un bordón (nota de bajo sostenida o quinta abierta) establece un centro modal. Sobre un bordón en D, puedes explorar libremente D dórico, D mixolidio u otros modos sin que la armonía empuje hacia la resolución.',
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
    nudge: 'Toca cada opción en C y escucha. El bucle usa cuatro acordes distintos, todos de la tonalidad, y empieza en la tónica: ¿qué patrón has oído en innumerables canciones pop?',
  },
  l7u23m1e2: {
    prompt: '¿Qué es el sistema de números de Nashville?',
    choices: [
      'Los números indican a la banda el lugar de cada acorde en la tonalidad, por eso 4 significa el acorde construido sobre el cuarto grado',
      "Los números dicen a la banda cuántos pulsos dura cada acorde, por eso 4 significa cuatro pulsos",
      "Los números suelen indicar al guitarrista el traste que debe tocar, por eso 1 significa el primer traste en cualquier tonalidad",
      "Los números miden semitonos sobre la tónica, por eso 4 significa el acorde con fundamental una tercera mayor arriba",
    ],
    hint: 'El sistema de números de Nashville escribe acordes como números de grados de la escala (1=I, 4=IV, 5=V). Una cifra que lee "1-5-6m-4" puede tocarse en cualquier tonalidad instantáneamente. Se usa extensivamente en sesiones de estudio de Nashville.',
  },
  l7u23m1e3: {
    prompt: '¿Qué es un "bucle pop" y por qué es eficaz?',
    choices: [
      'Una progresión corta que se repite y mantiene la armonía estable mientras la melodía y la letra cambian',
      "Una melodía corta que se repite y mantiene la línea melódica estable mientras cambia la progresión de acordes",
      "Una progresión corta de acordes que cambia su secuencia en cada regreso para seguir los cambios de la letra",
      "Un patrón corto de bajo que se repite bajo progresiones de acordes que cambian en vez de repetirse",
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
      'Una reescritura enarmónica del acorde vii° de C mayor, B disminuido, escrito como Bb',
    ],
    hint: 'bVII se toma prestado del mixolidio de C o del C menor natural. En C mayor, Bb no es diatónico, pero tomarlo prestado crea un sonido rock/pop. Esto es mezcla modal (también llamada acordes prestados).',
  },
  l7u23m2e2: {
    prompt:
      '¿Qué efecto emocional crea típicamente una relación de mediante cromática (p. ej., C mayor a Ab mayor) en la música pop?',
    choices: [
      'Un cambio de color dramático y cinematográfico — inesperado, pero suave gracias a una nota común',
      'Una sensación de regreso a casa, a la tónica',
      'Ningún efecto perceptible, porque los dos acordes pertenecen a la misma tonalidad y suenan parecidos',
      'Un choque disonante que suena como un error',
    ],
    hint: 'C mayor (C, E, G) y Ab mayor (Ab, C, Eb) comparten una nota común (C). El E y el Eb están a un semitono de distancia, creando el cambio de color suave característico de las mediantes cromáticas.',
  },
  l7u23m2e3: {
    prompt:
      '¿Qué es una modulación directa (o abrupta) en la composición pop?',
    choices: [
      "Cambiar a otra tonalidad sin un acorde de enlace",
      "Cambiar a otra tonalidad mediante un acorde pivote común a ambas",
      'Cambiar a otra tonalidad gradualmente, mediante una secuencia que pasa por varias tonalidades',
      'Cambiar a otra tonalidad sin acorde pivote, pero siempre exactamente un semitono más arriba',
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
      '¿Sobre qué tipo de acorde se usa comúnmente la escala lidia dominante (4.º modo de la menor melódica)?',
    choices: [
      'Acordes de séptima de dominante con #11, como sustituciones tritonales y dominantes que no resuelven',
      'Acordes m7 en una ii-V-I, porque la escala lidio dominante contiene una tercera menor (b3) sobre la fundamental',
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
      "Un patrón repetido de distancias reparte la octava en partes iguales",
      "Un patrón repetido de distancias produce doce transposiciones distintas",
      "Un patrón repetido de distancias exige siete notas por octava",
      "Un patrón repetido de distancias necesita dos octavas para repetirse",
    ],
    hint: 'Las escalas simétricas repiten un patrón fijo de intervalos (T = tono; sT = semitono; p. ej., tonos enteros = T-T-T-T-T-T; disminuida = sT-T-sT-T-sT-T-sT-T). Esta simetría significa que tienen menos transposiciones únicas que las escalas asimétricas.',
  },

  // ---- l7u23m5: Taxonomía Completa de Acordes ----

  l7u23m5e1: {
    prompt:
      '¿Cuántos tipos básicos de tríada existen en la teoría musical occidental?',
    choices: [
      '4 — mayor, menor, disminuida y aumentada',
      '2 — solo mayor y menor',
      '3 — mayor, menor y disminuida',
      '7 — un tipo de tríada para cada grado de la escala',
    ],
    hint: 'Existen exactamente 4 tipos de tríada, definidos por la tercera y la quinta: mayor (3M + 5J), menor (3m + 5J), disminuida (3m + 5.ª disminuida) y aumentada (3M + 5.ª aumentada). Todas las demás designaciones triádicas son variantes de estas cuatro.',
  },
  l7u23m5e2: {
    prompt: '¿Qué hace de un acorde un acorde "con extensiones"?',
    choices: [
      'Tiene notas más allá de la séptima (novena, undécima o decimotercera), apilando más terceras',
      "Tiene notas añadidas sobre una tríada (sexta, novena o ambas), sin incluir una séptima",
      "Tiene sustituciones de la tercera (segunda o cuarta), formando una suspensión dentro del acorde",
      "Tiene duplicaciones de notas del acorde a la octava (fundamental, tercera, quinta o séptima), sin añadir clases de altura",
    ],
    hint: 'Los acordes con extensiones continúan el principio tercial (apilamiento de terceras) más allá de la séptima: novena = octava + segunda, undécima = octava + cuarta, decimotercera = octava + sexta. Un acorde de decimotercera contiene teóricamente los 7 grados de la escala.',
  },
  l7u23m5e3: {
    prompt:
      '¿Qué agrupación organiza correctamente las principales familias de cualidad de acordes?',
    choices: [
      'Mayor, menor, dominante, disminuida y aumentada, cada una con sus formas de séptima y con extensiones',
      'Tríadas, séptimas, novenas, undécimas y decimoterceras, cada una con sus distintas cualidades',
      'Tónica, predominante, dominante, sustituto de tónica y sustituto de dominante, cada uno con sus disposiciones',
      'Acordes diatónicos, prestados, secundarios, de mediante cromática y enarmónicos, cada uno con sus orígenes',
    ],
    hint: 'Las familias de acordes se distinguen por sus intervalos esenciales: mayor tiene 3.ª mayor y 5.ª justa (7.ª mayor en maj7); séptima de dominante tiene 3.ª mayor y 7.ª menor; menor tiene 3.ª menor y 5.ª justa; disminuida tiene 3.ª menor y 5.ª disminuida; aumentada tiene 3.ª mayor y 5.ª aumentada. Los acordes de séptima y las extensiones amplían estas familias.',
  },
};

export default overlay;
