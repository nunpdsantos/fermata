import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish translations for Level 6 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidad 18: Acordes Cromáticos
  // =========================================================================

  // ---- l6u18m1: Acorde Napolitano bII ----

  l6u18m1e1: {
    prompt:
      'Construye el acorde napolitano (bII) en C menor. Es una tríada de Db mayor: selecciona Db, F y Ab.',
    hint: 'El acorde napolitano es una tríada mayor construida sobre el 2.º grado rebajado. En C menor, bII = Db mayor = Db, F, Ab (clases de altura 1, 5, 8).',
  },
  l6u18m1e2: {
    prompt: '¿Cuál es la función armónica del acorde napolitano (bII)?',
    choices: [
      'Predominante — sustituye a ii o iv y se dirige hacia V',
      'Dominante — resuelve directamente a la tónica',
      'Tónica — funciona como sustituto de I',
      'Acorde de paso — no tiene función estructural',
    ],
    hint: 'El napolitano funciona como acorde predominante, dirigiéndose típicamente hacia V (frecuentemente a través de un 6/4 cadencial). Intensifica la aproximación a la dominante con su fundamental cromática.',
  },
  l6u18m1e3: {
    prompt: '¿En qué inversión se encuentra más típicamente el acorde napolitano?',
    choices: [
      'Primera inversión (bII6) con la 3.ª en el bajo',
      'Posición fundamental con el 2.º grado rebajado en el bajo',
      'Segunda inversión (bII6/4) con la 5.ª en el bajo',
      'Aparece igualmente en todas las inversiones',
    ],
    hint: 'El napolitano se encuentra casi siempre en primera inversión (bII6), colocando el 4.º grado en el bajo. Esto proporciona una conducción de voces más suave hacia V.',
  },

  // ---- l6u18m2: Sexta Italiana / Francesa ----

  l6u18m2e1: {
    prompt: '¿Cuántos semitonos abarca el intervalo de sexta aumentada?',
    choices: [
      '10 semitonos — enarmónicamente equivalente a una séptima menor',
      '9 semitonos — lo mismo que una sexta mayor',
      '8 semitonos — lo mismo que una sexta menor',
      '11 semitonos — lo mismo que una séptima mayor',
    ],
    hint: 'Una sexta aumentada es medio tono mayor que una sexta mayor (9 semitonos). Abarca 10 semitonos y es enarmónicamente del mismo tamaño que una séptima menor, pero las dos notas resuelven divergentemente hacia una octava.',
  },
  l6u18m2e2: {
    prompt: '¿Qué distingue la sexta italiana (It+6) de la sexta francesa (Fr+6)?',
    choices: [
      'La francesa añade una cuarta aumentada sobre el bajo; la italiana tiene solo tres notas',
      'La italiana tiene cuatro notas; la francesa tiene solo tres',
      'La francesa resuelve hacia la tónica; la italiana resuelve hacia la dominante',
      'Son el mismo acorde con nombres diferentes basados en la época de uso',
    ],
    hint: 'La It+6 es la más sencilla: b6, 1, #4 (tres notas). La Fr+6 añade el 2.º grado (b6, 1, 2, #4), creando un subconjunto característico de tonos enteros con una cuarta aumentada sobre el bajo.',
  },
  l6u18m2e3: {
    prompt: '¿Cuál es la función armónica de los acordes de sexta aumentada?',
    choices: [
      'Predominante — intensifican el movimiento hacia la dominante',
      'Dominante — resuelven directamente a la tónica',
      'Prolongación de la tónica — decoran la armonía de tónica',
      'Función de mediante — sustituyen a iii o VI',
    ],
    hint: 'Todos los acordes de sexta aumentada funcionan como predominantes cromáticos. El intervalo de sexta aumentada (b6 y #4) resuelve divergentemente por medio tono en ambas voces hacia la nota de la dominante, creando una aproximación intensamente direccionada hacia V.',
  },

  // ---- l6u18m3: Sexta Alemana ----

  l6u18m3e1: {
    prompt: 'El acorde de sexta alemana (Gr+6) es enarmónicamente equivalente a qué acorde común?',
    choices: [
      'Un acorde de séptima de dominante (V7) — mismas alturas, escritura y resolución diferentes',
      'Un acorde de séptima disminuida — misma estructura interválica',
      'Un acorde de séptima semidisminuida — mismo sonido, contexto diferente',
      'Un acorde de séptima mayor — idéntico en posición cerrada',
    ],
    hint: 'La Gr+6 tiene las mismas clases de altura que un acorde de séptima de dominante. Por ejemplo, en C menor la Gr+6 (Ab, C, Eb, F#) suena idéntica a Ab7 (Ab, C, Eb, Gb). La escritura diferente refleja destinos de conducción de voces diferentes.',
  },
  l6u18m3e2: {
    prompt: '¿Cómo se cifra el acorde de sexta alemana en una tonalidad menor (p. ej., C menor)?',
    choices: [
      'Ab, C, Eb, F# — b6, 1, b3, #4',
      'Ab, C, E, F# — b6, 1, 3, #4',
      'Ab, Cb, Eb, F# — b6, b1, b3, #4',
      'Ab, C, Eb, Gb — b6, 1, b3, b5',
    ],
    hint: 'En C menor, la Gr+6 contiene b6 (Ab), 1 (C), b3 (Eb) y #4 (F#). El intervalo crucial de sexta aumentada está entre Ab y F#, que resuelve divergentemente hacia G–G (octava sobre la dominante).',
  },
  l6u18m3e3: {
    prompt: 'El acorde de sexta alemana resuelve típicamente hacia qué acorde?',
    choices: [
      'La dominante (V) o 6/4 cadencial, con b6 y #4 resolviendo divergentemente hacia el 5.º grado',
      'La tónica (I) directamente en posición fundamental',
      'La subdominante (IV) como parte de una cadencia plagal',
      'La supertónica (ii) para iniciar una cadena predominante',
    ],
    hint: 'Como todos los acordes de sexta aumentada, la Gr+6 resuelve hacia V. Las voces extremas (b6 y #4) convergen en la nota de la dominante por medio tono. Un 6/4 cadencial interviene frecuentemente para evitar quintas paralelas.',
  },

  // ---- l6u18m4: Modulación Enarmónica Gr+6 <-> V7 ----

  l6u18m4e1: {
    prompt: '¿Cuál es el principio fundamental detrás de la modulación enarmónica usando Gr+6 y V7?',
    choices: [
      'Un acorde que funciona como Gr+6 en una tonalidad puede reescribirse como V7 en una tonalidad distante, o viceversa',
      'Cualquier acorde de séptima de dominante puede sustituir a cualquier acorde de sexta aumentada en cualquier tonalidad',
      'La modulación requiere conducción cromática de voces en las cuatro voces simultáneamente',
      'Los dos acordes comparten la misma resolución independientemente de su escritura',
    ],
    hint: 'Dado que Gr+6 y V7 son enarmónicamente idénticos, una única sonoridad puede pivotar entre dos tonalidades distantes. La reescritura cambia qué voz conduce hacia dónde, redirigiendo la trayectoria armónica.',
  },
  l6u18m4e2: {
    prompt: 'La modulación enarmónica vía Gr+6/V7 permite modulación directa a tonalidades a qué distancia?',
    choices: [
      'Tonalidades distantes — por ejemplo, tónicas a medio tono de distancia (C a Db), cinco pasos en el círculo de quintas, mucho más allá del alcance de pivote diatónico',
      'Solo tonalidades cercanas con una diferencia de una alteración',
      'Solo entre tonalidades paralelas mayor y menor',
      'Solo entre tonalidades relativas mayor y menor',
    ],
    hint: 'Los acordes pivote diatónicos enlazan solo tonalidades cercanas. Reinterpretar la Gr+6 de la tonalidad como V7 (o viceversa) mueve la tónica medio tono — de C a Db hay cinco pasos en el círculo de quintas, una tonalidad distante alcanzada a través de un solo acorde. Es una técnica emblemática de los compositores del periodo romántico.',
  },
  l6u18m4e3: {
    prompt: 'Si una Gr+6 en C menor (Ab, C, Eb, F#) se reinterpreta como V7, ¿qué tonalidad toniciza ahora?',
    choices: [
      'Db mayor/menor — reescrita como Ab, C, Eb, Gb = Ab7 = V7/Db',
      'G mayor — porque F# resuelve ascendiendo hacia G',
      'F mayor — el acorde se convierte en V7/F',
      'Eb mayor — porque Eb es la nota del medio',
    ],
    hint: 'Reescribir F# como Gb transforma el acorde en Ab, C, Eb, Gb = Ab séptima de dominante. Ab7 es V7 de Db, por tanto la música puede pivotar suavemente de C menor a Db mayor — un desplazamiento de medio tono, enlazando territorio tonal muy distante.',
  },

  // =========================================================================
  // Unidad 19: Técnicas Cromáticas Avanzadas
  // =========================================================================

  // ---- l6u19m1: Modulación Enarmónica vía dim7 ----

  l6u19m1e1: {
    prompt:
      'Construye un acorde de séptima disminuida sobre C. Selecciona 4 notas: C, Eb, Gb y Bbb (enarmónico de A).',
    hint: 'Un acorde de séptima disminuida apila tres terceras menores: C (0), Eb (3), Gb (6), Bbb (9). Estas cuatro clases de altura dividen la octava en partes iguales. Bbb es enarmónicamente A.',
  },
  l6u19m1e2: {
    prompt: '¿Por qué el acorde de séptima disminuida es simétrico?',
    choices: [
      'Divide la octava de 12 semitonos en cuatro terceras menores iguales (0, 3, 6, 9)',
      'Contiene solo notas naturales sin sostenidos ni bemoles',
      'Sus inversiones producen contenido interválico diferente cada vez',
      'Tiene el mismo número de intervalos mayores y menores',
    ],
    hint: 'El acorde dim7 está construido enteramente con terceras menores (3 semitonos cada una). Como 3 × 4 = 12, las cuatro notas dividen la octava uniformemente. Esto significa que cada inversión del acorde suena idéntica en su estructura interválica.',
  },
  l6u19m1e3: {
    prompt: '¿Hacia cuántas tonalidades diferentes puede resolver un único acorde de séptima disminuida como acorde de sensible (viiº7)?',
    choices: [
      'Cuatro tonalidades — cualquiera de sus cuatro notas puede tratarse como sensible',
      'Dos tonalidades — una mayor y una menor',
      'Doce tonalidades — una para cada semitono',
      'Una tonalidad — determinada por su fundamental',
    ],
    hint: 'Debido a su simetría, cada nota del acorde dim7 puede reescribirse como sensible que resuelve ascendentemente por medio tono hacia una tónica diferente. C–Eb–Gb–Bbb puede ser viiº7 de Db, E, G o Bb.',
  },

  // ---- l6u19m2: Séptima Disminuida con Nota Común ----

  l6u19m2e1: {
    prompt: '¿Qué define un acorde de séptima disminuida con nota común (CTo7)?',
    choices: [
      'Un acorde de séptima disminuida que comparte una nota con el acorde que embellece',
      'Un acorde de séptima disminuida que resuelve hacia la dominante',
      'Cualquier acorde de séptima disminuida usado en una tonalidad menor',
      'Un acorde de séptima disminuida que comparte todas las notas con el acorde siguiente',
    ],
    hint: 'La séptima disminuida con nota común mantiene una nota (la nota común) del acorde que decora. Las otras tres voces se mueven por grado conjunto, creando un embellecimiento cromático por notas vecinas.',
  },
  l6u19m2e2: {
    prompt: 'En un CTo7 que embellece un acorde de C mayor, ¿cuál es típicamente la nota común?',
    choices: [
      'La fundamental del acorde embellecido (C)',
      'La 3.ª del acorde embellecido (E)',
      'La 5.ª del acorde embellecido (G)',
      'La 7.ª del acorde embellecido (B)',
    ],
    hint: 'La forma más habitual mantiene la fundamental del acorde objetivo. Para un CTo7 que embellece C mayor, C se mantiene mientras las otras voces (D#, F#, A) se mueven por grado conjunto de vuelta a las notas del acorde de C mayor.',
  },
  l6u19m2e3: {
    prompt: '¿Cuál es la función principal de un acorde de séptima disminuida con nota común?',
    choices: [
      'Embellecimiento — prolonga o decora un acorde en vez de impulsar la progresión armónica',
      'Predominante — prepara la dominante como los acordes de sexta aumentada',
      'Dominante — resuelve hacia la tónica con movimiento de sensible',
      'Modulatoria — inicia siempre un cambio de tonalidad',
    ],
    hint: 'A diferencia del viiº7 (que tiene función dominante), el CTo7 es puramente decorativo. Embellece un acorde a través de movimiento cromático por notas vecinas, añadiendo color sin cambiar la dirección armónica.',
  },

  // ---- l6u19m3: Mediantes Cromáticas ----

  l6u19m3e1: {
    prompt: '¿Qué define una relación de mediante cromática entre dos acordes?',
    choices: [
      'Dos acordes cuyas fundamentales distan una 3.ª con una alteración cromática que cambia la cualidad esperada',
      'Dos acordes cuyas fundamentales distan una 2.ª enlazados por notas de paso cromáticas',
      'Cualquier progresión de acordes que usa conducción cromática de voces',
      'Dos acordes que comparten las tres notas pero en inversiones diferentes',
    ],
    hint: 'Las mediantes diatónicas (I–iii, I–vi) comparten dos notas comunes. Las mediantes cromáticas (p. ej., C mayor a E mayor, o C mayor a Ab mayor) tienen fundamentales a una 3.ª de distancia pero con cualidad alterada, compartiendo solo una o cero notas comunes.',
  },
  l6u19m3e2: {
    prompt: '¿Cuántos tipos de relaciones de tercera cromática existen entre tríadas mayores?',
    choices: [
      'Cuatro — 3.ª mayor/menor ascendente y 3.ª mayor/menor descendente (p. ej., C–E, C–Ab, C–Eb, C–A)',
      'Dos — una ascendente y una descendente',
      'Seis — una para cada clase de intervalo',
      'Tres — relaciones de tercera mayor, menor y disminuida',
    ],
    hint: 'A partir de cualquier tríada mayor, puedes moverte hacia otra tríada mayor a una 3.ª mayor o menor por encima o por debajo: C a E, C a Eb, C a A, C a Ab. Cada una produce un color diferente, y las cuatro son mediantes cromáticas.',
  },
  l6u19m3e3: {
    prompt: '¿Cuál es la característica de conducción de voces de las progresiones por mediante cromática?',
    choices: [
      'Una o cero notas comunes con movimiento cromático (medio tono) en las voces que se mueven',
      'Todas las voces se mueven por grado conjunto en la misma dirección',
      'Dos notas comunes con una voz moviéndose por tono',
      'Movimiento de la fundamental por quinta con notas del acorde alteradas',
    ],
    hint: 'Las mediantes cromáticas comparten frecuentemente una nota común mientras las otras voces se desplazan por medio tono. En algunos casos (mediantes doblemente cromáticas como C mayor a Ab menor, Ab-Cb-Eb) no hay notas comunes, y todas las voces se desplazan medio tono: C a Cb, E a Eb, G a Ab.',
  },

  // ---- l6u19m4: Técnicas Tardorrománticas ----

  l6u19m4e1: {
    prompt: '¿Qué caracteriza la «armonía no funcional» en la música tardorromántica?',
    choices: [
      'Los acordes se enlazan por conducción de voces o color en vez de por la función tónica-dominante',
      'La música evita completamente el uso de tríadas o acordes de séptima',
      'Todos los acordes son disminuidos o aumentados sin tríadas mayores ni menores',
      'La armonía usa solo dos acordes a lo largo de una pieza entera',
    ],
    hint: 'En la armonía no funcional, las progresiones de acordes se impulsan por la conducción suave de voces, notas comunes compartidas o efecto colorístico en vez del ciclo funcional tradicional T–PD–D–T. Wagner, Liszt y el Chopin tardío fueron pioneros de esta aproximación.',
  },
  l6u19m4e2: {
    prompt: '¿Qué es el planing cromático (armonía paralela)?',
    choices: [
      'Mover una forma fija de acorde en movimiento paralelo por medios tonos o tonos',
      'Alternar entre dos acordes repetidamente',
      'Resolver cada acorde cromáticamente hacia el siguiente por medio tono en el bajo',
      'Tocar las doce alturas cromáticas simultáneamente',
    ],
    hint: 'El planing mueve una estructura entera de acorde (p. ej., una tríada mayor o acorde de séptima de dominante) hacia arriba o hacia abajo cromáticamente o por tonos enteros, manteniendo la misma disposición. Debussy usó esta técnica extensamente.',
  },
  l6u19m4e3: {
    prompt: '¿A qué se refiere la «disolución de la tonalidad» en la música del final del siglo XIX?',
    choices: [
      'El debilitamiento de un centro tonal claro a través de cromatismo generalizado y modulaciones remotas',
      'El uso deliberado de solo una tonalidad a lo largo de una composición entera',
      'La eliminación del ritmo y el metro de la estructura musical',
      'La sustitución de toda la armonía por melodías al unísono',
    ],
    hint: 'Compositores como Wagner (Tristán e Isolda) usaron cromatismo continuo, resoluciones deceptivas y ambigüedad enarmónica tan extensamente que la sensación de una tonalidad «hogar» se volvió elusiva — abriendo camino a la atonalidad en el siglo XX.',
  },

  // =========================================================================
  // Unidad 20: Contrapunto y Escritura a Partes
  // =========================================================================

  // ---- l6u20m1: Contrapunto de Especies 1–3 ----

  l6u20m1e1: {
    prompt: 'En el contrapunto de primera especie (nota contra nota), ¿qué intervalos se consideran consonantes por encima del cantus firmus?',
    choices: [
      'Unísonos, terceras, quintas, sextas y octavas',
      'Solo consonancias perfectas: unísonos, quintas y octavas',
      'Todos los intervalos excepto el tritono',
      'Segundas, cuartas y séptimas además de terceras y sextas',
    ],
    hint: 'La primera especie permite solo consonancias: consonancias perfectas (P1, P5, P8) y consonancias imperfectas (terceras y sextas). Las disonancias (segundas, cuartas, séptimas, tritonos) están prohibidas en la primera especie.',
  },
  l6u20m1e2: {
    prompt: 'En el contrapunto de segunda especie (dos notas contra una), ¿cómo se tratan las disonancias?',
    choices: [
      'Las disonancias pueden aparecer solo en tiempos débiles como notas de paso abordadas y abandonadas por grado conjunto',
      'Las disonancias están completamente prohibidas como en la primera especie',
      'Las disonancias pueden aparecer en cualquier tiempo siempre que resuelvan por grado conjunto',
      'Las disonancias se permiten libremente en tiempos fuertes y débiles',
    ],
    hint: 'La segunda especie introduce la nota de paso: una disonancia en un tiempo débil que rellena el espacio entre dos consonancias por movimiento por grado conjunto. Los tiempos fuertes deben seguir siendo consonantes.',
  },
  l6u20m1e3: {
    prompt: '¿Qué relación rítmica define el contrapunto de tercera especie?',
    choices: [
      'Cuatro notas en el contrapunto contra cada nota del cantus firmus',
      'Tres notas contra cada nota del cantus firmus',
      'Dos notas contra cada nota del cantus firmus',
      'Ritmo libre sin proporción fija',
    ],
    hint: 'La tercera especie coloca cuatro negras contra cada redonda del cantus firmus. Esto introduce bordaduras y notas de paso dobles (dos notas de paso seguidas, que avanzan por grado conjunto en una sola dirección para llenar una cuarta) además de las notas de paso de la segunda especie.',
  },

  // ---- l6u20m2: Contrapunto de Especies 4–5 ----

  l6u20m2e1: {
    prompt: 'El contrapunto de cuarta especie se define principalmente por qué recurso rítmico?',
    choices: [
      'Síncopa a través de suspensiones — notas ligadas crean disonancia en tiempos fuertes',
      'Ritmos con puntillo alternando entre notas largas y cortas',
      'Figuras de tresillo contra metro binario',
      'Valores de notas libremente mezclados sin patrón específico',
    ],
    hint: 'La cuarta especie introduce la suspensión: una consonancia en un tiempo débil se liga al tiempo fuerte siguiente donde se convierte en disonancia, y después resuelve descendentemente por grado conjunto. Esto crea la textura sincopada característica.',
  },
  l6u20m2e2: {
    prompt: '¿Qué define el contrapunto de quinta especie (contrapunto florido)?',
    choices: [
      'Una combinación libre de todas las especies anteriores — valores de notas mezclados, notas de paso y suspensiones',
      'Cinco notas contra cada nota del cantus firmus',
      'Contrapunto escrito para cinco voces simultáneamente',
      'Imitación estricta al intervalo de quinta a lo largo de toda la pieza',
    ],
    hint: 'La quinta especie (florida) combina técnicas de las cuatro especies anteriores en una línea melódica fluida. Usa redondas, blancas, negras, suspensiones y notas de paso de forma musicalmente satisfactoria.',
  },
  l6u20m2e3: {
    prompt: '¿Cuáles son las tres fases de una suspensión correctamente ejecutada?',
    choices: [
      'Preparación (consonancia), suspensión (disonancia en tiempo fuerte), resolución (grado conjunto descendente)',
      'Ataque (disonancia), sostenimiento (nota mantenida), liberación (salto)',
      'Aproximación por salto, mantenimiento, resolución por salto',
      'Consonancia, consonancia, disonancia',
    ],
    hint: 'Una suspensión requiere: (1) Preparación — la nota se introduce como consonancia; (2) Suspensión — la nota se mantiene (ligada) en un tiempo fuerte donde se vuelve disonante; (3) Resolución — la nota resuelve descendentemente por grado conjunto hacia una consonancia.',
  },

  // ---- l6u20m3: Contrapunto a Tres Partes / Invertible ----

  l6u20m3e1: {
    prompt: '¿Qué significa «contrapunto invertible a la octava»?',
    choices: [
      'Dos voces pueden intercambiar posición (la superior se convierte en inferior) y seguir produciendo contrapunto correcto',
      'La melodía se toca al revés (retrógrado) a la octava',
      'Ambas voces se transponen una octava arriba simultáneamente',
      'Los intervalos entre voces se invierten (terceras se convierten en sextas) pero las voces permanecen en su sitio',
    ],
    hint: 'En el contrapunto invertible a la octava, la voz A encima de la voz B suena correcta, Y la voz B encima de la voz A también suena correcta. Cuando las voces se intercambian, los intervalos se invierten: terceras se convierten en sextas, quintas se convierten en cuartas, etc.',
  },
  l6u20m3e2: {
    prompt: '¿Qué es el contrapunto triple?',
    choices: [
      'Tres voces escritas de modo que cualquiera de las seis ordenaciones verticales posibles produzca contrapunto válido',
      'Contrapunto en metro ternario (3/4 o 3/8)',
      'Tres repeticiones del mismo contrapunto en niveles de altura diferentes',
      'Una fuga con exactamente tres sujetos',
    ],
    hint: 'Contrapunto triple significa que tres voces (A, B, C) pueden reorganizarse en cualquier orden — ABC, ACB, BAC, BCA, CAB, CBA — y las seis permutaciones producen contrapunto correcto. Bach dominó esta técnica.',
  },
  l6u20m3e3: {
    prompt: '¿Por qué deben evitarse o tratarse con cuidado las quintas perfectas en el contrapunto invertible a la octava?',
    choices: [
      'Una quinta se invierte en una cuarta, que se trata como disonancia por encima del bajo en el contrapunto estricto',
      'Las quintas perfectas están siempre prohibidas en todos los tipos de contrapunto',
      'Una quinta se invierte en un tritono, creando un intervalo inutilizable',
      'Las quintas perfectas no pueden invertirse en absoluto',
    ],
    hint: 'Cuando las voces se invierten a la octava, una P5 se convierte en una P4. En el contrapunto a dos voces, las cuartas por encima del bajo son disonantes. Por tanto, cualquier P5 en el original se convierte en un problema cuando las voces intercambian posición.',
  },

  // ---- l6u20m4: Escritura a Partes Avanzada ----

  l6u20m4e1: {
    prompt: '¿Cuáles son las cuatro voces en la escritura a partes SATB (estilo coral), de la más aguda a la más grave?',
    choices: [
      'Soprano, Contralto, Tenor, Bajo',
      'Soprano, Contralto, Agudo, Bajo',
      'Soprano, Barítono, Tenor, Bajo',
      'Soprano, Contralto, Tenor, Barítono',
    ],
    hint: 'SATB significa Soprano (más aguda), Contralto, Tenor y Bajo (más grave). Soprano y Contralto comparten la pauta de clave de sol; Tenor y Bajo comparten la pauta de clave de fa en la notación coral estándar.',
  },
  l6u20m4e2: {
    prompt: '¿Qué requiere la realización de bajo cifrado que un intérprete haga?',
    choices: [
      'Leer una línea de bajo con números e improvisar las voces superiores para formar los acordes indicados',
      'Tocar solo las notas del bajo exactamente como están escritas sin añadidos',
      'Transponer la línea de bajo para que corresponda con los números cifrados',
      'Duplicar cada nota del bajo a la octava en ambas manos',
    ],
    hint: 'El bajo cifrado era la taquigrafía barroca para la armonía. El intérprete lee la nota del bajo escrita y las cifras (números) debajo de ella, y después rellena las voces superiores para crear acordes completos siguiendo reglas de conducción de voces.',
  },
  l6u20m4e3: {
    prompt: 'Al leer una partitura de instrumento transpositor (p. ej., clarinete en Bb), ¿qué debes hacer para encontrar la altura real?',
    choices: [
      'Transponer la altura escrita por el intervalo de transposición del instrumento para encontrar la altura de concierto',
      'Tocar la altura escrita exactamente como está notada — los instrumentos transpositores suenan como están escritos',
      'Mover cada nota una octava por encima de la altura escrita',
      'Leer la parte en otra clave para encontrar la altura correcta',
    ],
    hint: 'Un clarinete en Bb suena una segunda mayor por debajo de lo escrito. Cuando la parte indica C, el instrumento suena Bb. La lectura de partitura exige conocer la transposición de cada instrumento para oír las alturas reales (de concierto).',
  },
};

export default overlay;
