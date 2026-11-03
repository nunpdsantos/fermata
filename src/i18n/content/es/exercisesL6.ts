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
      'Construye el acorde napolitano (bII) en C menor. Selecciona las 3 notas.',
    hint: 'El acorde napolitano es una tríada mayor construida sobre el 2.º grado rebajado. En C menor, bII = Db mayor = Db, F, Ab (clases de altura 1, 5, 8).',
  },
  l6u18m1e2: {
    prompt: '¿Cuál es la función armónica del acorde napolitano (bII)?',
    choices: [
      "Una predominante cromática que prepara la dominante en lugar de ii o iv",
      "Una dominante cromática que sustituye V y resuelve directamente a la tónica",
      "Una tónica cromática que prepara la dominante en lugar de ii o iv",
      "Una dominante cromática que prepara ii o iv en lugar de V",
    ],
    hint: 'El napolitano funciona como acorde predominante, dirigiéndose típicamente hacia V (frecuentemente a través de un 6/4 cadencial). Intensifica la aproximación a la dominante con su fundamental cromática.',
  },
  l6u18m1e3: {
    prompt: '¿Cuál es la nota del bajo habitual del acorde napolitano en C menor?',
    choices: [
      'F',
      'Db',
      'Ab',
      'C',
    ],
    hint: 'El napolitano se encuentra casi siempre en primera inversión (bII6), colocando el 4.º grado en el bajo. Esto proporciona una conducción de voces más suave hacia V.',
  },

  // ---- l6u18m2: Sexta Italiana / Francesa ----

  l6u18m2e1: {
    prompt: '¿Cuántos semitonos abarca el intervalo de sexta aumentada?',
    choices: [
      "10 semitonos",
      "9 semitonos",
      "8 semitonos",
      "11 semitonos",
    ],
    hint: 'Una sexta aumentada es medio tono mayor que una sexta mayor (9 semitonos). Abarca 10 semitonos y es enarmónicamente del mismo tamaño que una séptima menor, pero las dos notas resuelven divergentemente hacia una octava.',
  },
  l6u18m2e2: {
    prompt: '¿Qué distingue la sexta italiana (It+6) de la sexta francesa (Fr+6)?',
    choices: [
      'La francesa añade una cuarta aumentada sobre el bajo; la italiana tiene solo tres notas',
      "La italiana añade una cuarta aumentada sobre el bajo; la francesa tiene solo tres notas",
      'La francesa añade una quinta justa sobre el bajo; la italiana tiene solo tres notas',
      'La italiana añade una quinta justa sobre el bajo; la francesa tiene solo tres notas',
    ],
    hint: 'La It+6 es la más sencilla: b6, 1, #4 (tres notas). La Fr+6 añade el 2.º grado (b6, 1, 2, #4), creando un subconjunto característico de tonos enteros con una cuarta aumentada sobre el bajo.',
    nudge: 'Escribe las dos sobre el mismo bajo, b6: enumera los grados de cada acorde y cuéntalos. Después busca la nota que tiene la francesa y no la italiana, y mídela respecto al bajo.',
  },
  l6u18m2e3: {
    prompt: '¿Cuál es la función armónica de los acordes de sexta aumentada?',
    choices: [
      'Predominante: prepara la armonía de dominante en una progresión cadencial',
      'Dominante: prepara la llegada a la tónica en una progresión cadencial',
      'Tónica: proporciona el punto de reposo estable al final de una frase',
      'Mediante: proporciona la armonía de iii o VI en la progresión tonal',
    ],
    hint: 'Todos los acordes de sexta aumentada funcionan como predominantes cromáticos. El intervalo de sexta aumentada (b6 y #4) resuelve divergentemente por un semitono en ambas voces hacia la nota de la dominante, creando una aproximación intensamente direccionada hacia V.',
  },

  // ---- l6u18m3: Sexta Alemana ----

  l6u18m3e1: {
    prompt: '¿A qué acorde común equivale enarmónicamente el acorde de sexta alemana (Gr+6)?',
    choices: [
      'Séptima de dominante',
      'Séptima disminuida',
      'Séptima semidisminuida',
      'Séptima mayor',
    ],
    hint: 'La Gr+6 tiene las mismas clases de altura que un acorde de séptima de dominante. Por ejemplo, en C menor la Gr+6 (Ab, C, Eb, F#) suena idéntica a Ab7 (Ab, C, Eb, Gb). La escritura diferente refleja destinos de conducción de voces diferentes.',
  },
  l6u18m3e2: {
    prompt: '¿Cómo se escribe el acorde de sexta alemana en una tonalidad menor (p. ej., C menor)?',
    choices: [
      "Ab, C, Eb, F# — b6, 1, b3, #4",
      'Ab, C, D, F# — b6, 1, 2, #4',
      'Ab, C, E, F# — b6, 1, 3, #4',
      'A, C, Eb, F# — 6, 1, b3, #4',
    ],
    hint: 'En C menor, la Gr+6 contiene b6 (Ab), 1 (C), b3 (Eb) y #4 (F#). El intervalo crucial de sexta aumentada está entre Ab y F#, que resuelve divergentemente hacia G–G (octava sobre la dominante).',
  },
  l6u18m3e3: {
    prompt: '¿Cuál es la resolución estándar de la sexta alemana que evita quintas paralelas?',
    choices: [
      "Gr+6 → I6/4 → V",
      "Gr+6 → V → I6/4",
      'Gr+6 → IV6/4 → V',
      'Gr+6 → I6/4 → IV',
    ],
    hint: 'Como todos los acordes de sexta aumentada, la Gr+6 resuelve hacia V. El b6 (normalmente en el bajo) y el #4 (en una voz superior) se abren por semitono hasta la octava en la dominante. Un 6/4 cadencial interviene frecuentemente para evitar quintas paralelas.',
  },

  // ---- l6u18m4: Modulación Enarmónica Gr+6 <-> V7 ----

  l6u18m4e1: {
    prompt: '¿Cuál es el principio fundamental detrás de la modulación enarmónica usando Gr+6 y V7?',
    choices: [
      'Las mismas alturas sonoras; nueva función armónica y resolución',
      'Las mismas alturas sonoras; se mantienen la función y la resolución originales',
      'Las mismas alturas sonoras; basta una armadura nueva sin reinterpretación armónica',
      'Las mismas alturas sonoras; se requiere una alteración de semitono antes de la reinterpretación',
    ],
    hint: 'Dado que Gr+6 y V7 son enarmónicamente idénticos, una única sonoridad puede pivotar entre dos tonalidades distantes. La reescritura cambia qué voz conduce hacia dónde, redirigiendo la trayectoria armónica.',
  },
  l6u18m4e2: {
    prompt: '¿Cuántos semitonos separan las tonalidades enlazadas por modulación enarmónica directa Gr+6/V7?',
    choices: [
      '1',
      '2',
      '7',
      '6',
    ],
    hint: 'Los acordes pivote diatónicos funcionan mejor entre tonalidades cercanas. Reinterpretar la Gr+6 de la tonalidad como V7 (o viceversa) mueve la tónica un semitono — de C a Db hay cinco pasos en el círculo de quintas, una tonalidad distante alcanzada a través de un solo acorde. Es una técnica emblemática de los compositores del periodo romántico.',
    nudge: 'Reescribe la Gr+6 de C mayor (Ab, C, Eb, F#) con Gb en lugar de F#: ¿de qué tonalidad pasa a ser el V7? Después mide la separación entre esa tónica y C, como intervalo y en el círculo de quintas.',
  },
  l6u18m4e3: {
    prompt: 'Si una Gr+6 en C menor (Ab, C, Eb, F#) se reinterpreta como V7, ¿qué tonalidad toniciza ahora?',
    choices: [
      'Db mayor/menor — reescrita como Ab, C, Eb, Gb = Ab7 = V7/Db',
      "G mayor/menor — reescrita como Ab, C, Eb, Gb = Ab7 = V7/G",
      "F mayor/menor — reescrita como Ab, C, Eb, Gb = Ab7 = V7/F",
      "Eb mayor/menor — reescrita como Ab, C, Eb, Gb = Ab7 = V7/Eb",
    ],
    hint: 'Reescribir F# como Gb transforma el acorde en Ab, C, Eb, Gb = Ab séptima de dominante. Ab7 es V7 de Db, por tanto la música puede pivotar suavemente de C menor a Db mayor — un desplazamiento de un semitono, enlazando territorio tonal muy distante.',
  },

  // =========================================================================
  // Unidad 19: Técnicas Cromáticas Avanzadas
  // =========================================================================

  // ---- l6u19m1: Modulación Enarmónica vía dim7 ----

  l6u19m1e1: {
    prompt:
      'Construye un acorde de séptima disminuida sobre C. Selecciona las 4 notas.',
    hint: 'Un acorde de séptima disminuida apila tres terceras menores: C (0), Eb (3), Gb (6), Bbb (9). Estas cuatro clases de altura dividen la octava en partes iguales. Bbb es enarmónicamente A.',
  },
  l6u19m1e2: {
    prompt: '¿Qué espaciado cíclico en semitonos explica la simetría de un acorde de séptima disminuida?',
    choices: [
      '3 + 3 + 3 + 3',
      '2 + 4 + 2 + 4',
      '1 + 5 + 1 + 5',
      '3 + 3 + 4 + 2',
    ],
    hint: 'El acorde dim7 está construido enteramente con terceras menores (3 semitonos cada una). Como 3 × 4 = 12, las cuatro notas dividen la octava uniformemente. Esto significa que cada inversión del acorde suena idéntica en su estructura interválica.',
  },
  l6u19m1e3: {
    prompt: '¿Cuántas tónicas diferentes puede tener como destino un único acorde de séptima disminuida al funcionar como acorde de sensible (vii°7)?',
    choices: [
      "Cuatro tónicas",
      "Dos tónicas",
      "Doce tónicas",
      "Una tónica",
    ],
    hint: 'Debido a su simetría, cada nota del acorde dim7 puede reescribirse como sensible que resuelve ascendentemente por un semitono hacia una tónica diferente. C–Eb–Gb–Bbb puede ser vii°7 de Db, E, G o Bb.',
  },

  // ---- l6u19m2: Séptima Disminuida con Nota Común ----

  l6u19m2e1: {
    prompt: '¿Qué sonoridad de cuatro notas puede adornar F mayor como séptima disminuida con nota común, manteniendo F?',
    choices: [
      'F–G#–B–D',
      'F–A–C–E',
      'F–A–C–Eb',
      'F–Ab–C–Eb',
    ],
    hint: 'La séptima disminuida con nota común mantiene una nota (la nota común) del acorde que adorna. Las otras tres voces se mueven por grado conjunto, creando un adorno por bordaduras cromáticas.',
  },
  l6u19m2e2: {
    prompt: 'En un CTo7 que adorna un acorde de C mayor, ¿cuál es típicamente la nota común?',
    choices: [
      "C",
      "E",
      "G",
      'E y G',
    ],
    hint: 'La forma más habitual mantiene la fundamental del acorde objetivo. Para un CTo7 que adorna C mayor, C se mantiene mientras las otras voces (D#, F#, A) se mueven por grado conjunto de vuelta a las notas del acorde de C mayor.',
  },
  l6u19m2e3: {
    prompt: '¿Cuál es la función principal de un acorde de séptima disminuida con nota común?',
    choices: [
      'Adorno de un acorde',
      'Tonicización de un acorde',
      'Sustitución de la dominante',
      'Modulación a otra tonalidad',
    ],
    hint: 'A diferencia del vii°7 (que tiene función dominante), el CTo7 es puramente ornamental. Adorna un acorde a través de movimiento por bordaduras cromáticas, añadiendo color sin cambiar la dirección armónica.',
  },

  // ---- l6u19m3: Mediantes Cromáticas ----

  l6u19m3e1: {
    prompt: '¿Qué par ejemplifica una relación de mediante cromática?',
    choices: [
      'C mayor → E mayor',
      'C mayor → G mayor',
      'C mayor → F mayor',
      'C mayor → A menor',
    ],
    hint: 'Las mediantes diatónicas (I-iii, I-vi) comparten dos notas comunes. Mediantes cromáticas como C mayor a E mayor o Ab mayor tienen fundamentales a una 3.ª de distancia y la misma cualidad (ambos mayores o ambos menores), con una nota común. Las mediantes doblemente cromáticas, como C mayor a Eb menor, no comparten ninguna.',
  },
  l6u19m3e2: {
    prompt: '¿Cuántos tipos de relaciones de tercera cromática existen entre tríadas mayores?',
    choices: [
      "Cuatro tipos",
      "Dos tipos",
      "Seis tipos",
      "Tres tipos",
    ],
    hint: 'A partir de cualquier tríada mayor, puedes moverte hacia otra tríada mayor a una 3.ª mayor o menor por encima o por debajo: C a E, C a Eb, C a A, C a Ab. Cada una produce un color diferente, y las cuatro son mediantes cromáticas.',
  },
  l6u19m3e3: {
    prompt: 'En el paso de C mayor a E mayor, ¿qué conducción suave mantiene la nota común E?',
    choices: [
      'C→B, E→E, G→G#',
      'C→C#, E→E, G→G#',
      'C→B, E→E, G→G',
      'C→C#, E→E, G→G',
    ],
    hint: 'Las mediantes cromáticas comparten frecuentemente una nota común mientras las otras voces se desplazan por un semitono. En algunos casos (mediantes doblemente cromáticas como C mayor a Ab menor, Ab-Cb-Eb) no hay notas comunes, y todas las voces se desplazan un semitono: C a Cb, E a Eb, G a Ab.',
  },

  // ---- l6u19m4: Técnicas Tardorrománticas ----

  l6u19m4e1: {
    prompt: '¿Qué caracteriza la «armonía no funcional» en la música tardorromántica?',
    choices: [
      'Las conexiones entre acordes se forman principalmente mediante alturas compartidas y movimiento suave de cada parte',
      'Las conexiones entre acordes se forman principalmente moviendo todas las voces por el mismo tritono',
      'Las conexiones entre acordes se forman principalmente eliminando notas comunes entre acordes sucesivos',
      'Las conexiones entre acordes se forman principalmente alternando dos acordes fijos durante toda la pieza',
    ],
    hint: 'En la armonía no funcional, las progresiones de acordes se impulsan por la conducción suave de voces, notas comunes o efecto colorístico en vez del ciclo funcional tradicional T–PD–D–T. Wagner, Liszt y el Chopin tardío fueron pioneros de esta aproximación.',
  },
  l6u19m4e2: {
    prompt: '¿Qué es el planing cromático (armonía paralela)?',
    choices: [
      'Todas las partes se mueven por un intervalo idéntico, conservando los intervalos del acorde',
      'Todas las partes se mueven a notas de la tonalidad, ajustando los intervalos del acorde',
      'Todas las partes salvo el bajo quedan fijas mientras el bajo cambia',
      'Todas las partes se mueven a las notas disponibles más cercanas del acorde',
    ],
    hint: 'El planing mueve una estructura entera de acorde (p. ej., una tríada mayor o acorde de séptima de dominante) hacia arriba o hacia abajo cromáticamente o por tonos enteros, manteniendo la misma disposición. Debussy usó esta técnica extensamente.',
  },
  l6u19m4e3: {
    prompt: '¿A qué se refiere la «disolución de la tonalidad» en la música del final del siglo XIX?',
    choices: [
      'La pérdida de una tonalidad de referencia segura por el cromatismo generalizado y la modulación remota',
      'La pérdida de un compás regular por el cambio constante de indicaciones de compás',
      'La pérdida de armonía de acordes a favor de una única melodía al unísono',
      'La pérdida de repetición temática a favor de material continuamente nuevo',
    ],
    hint: 'Compositores como Wagner (Tristán e Isolda) usaron cromatismo continuo, resoluciones rotas y ambigüedad enarmónica tan extensamente que la sensación de una tonalidad «hogar» se volvió elusiva — abriendo camino a la atonalidad en el siglo XX.',
  },

  // =========================================================================
  // Unidad 20: Contrapunto y Escritura a Partes
  // =========================================================================

  // ---- l6u20m1: Contrapunto de Especies 1–3 ----

  l6u20m1e1: {
    prompt: '¿Cuál es el conjunto completo de intervalos consonantes permitidos sobre el cantus firmus inferior en la primera especie?',
    choices: [
      'Unísonos, 3.as, 5.as justas, 6.as y octavas',
      'Unísonos, 3.as, 4.as, 5.as justas, 6.as y octavas',
      'Unísonos, 5.as justas y octavas',
      'Unísonos, 2.as, 4.as, 6.as y octavas',
    ],
    hint: 'La primera especie permite solo consonancias: consonancias perfectas (1J, 5J, 8J) y consonancias imperfectas (terceras y sextas). Las disonancias (segundas, cuartas, séptimas, tritonos) están prohibidas en la primera especie.',
  },
  l6u20m1e2: {
    prompt: 'En el contrapunto de segunda especie (dos notas contra una), ¿cómo se tratan las disonancias?',
    choices: [
      "Las disonancias pueden aparecer solo en tiempos débiles como notas de paso abordadas y abandonadas por grado conjunto",
      "Las disonancias pueden aparecer solo en tiempos fuertes como notas de paso abordadas y abandonadas por grado conjunto",
      "Las disonancias pueden aparecer solo en tiempos débiles como notas de paso abordadas y abandonadas por salto",
      "Las disonancias pueden aparecer solo en tiempos fuertes como notas de paso abordadas y abandonadas por salto",
    ],
    hint: 'La segunda especie introduce la nota de paso: una disonancia en un tiempo débil que rellena el espacio entre dos consonancias por movimiento por grado conjunto. Los tiempos fuertes deben seguir siendo consonantes.',
  },
  l6u20m1e3: {
    prompt: '¿Qué relación rítmica define el contrapunto de tercera especie?',
    choices: [
      "Cuatro notas en el contrapunto contra cada nota del cantus firmus",
      "Tres notas en el contrapunto contra cada nota del cantus firmus",
      "Dos notas en el contrapunto contra cada nota del cantus firmus",
      "Una nota en el contrapunto contra cada nota del cantus firmus",
    ],
    hint: 'La tercera especie coloca cuatro negras contra cada redonda del cantus firmus. Esto introduce bordaduras y notas de paso dobles (dos notas de paso seguidas, que avanzan por grado conjunto en una sola dirección para llenar una cuarta) además de las notas de paso de la segunda especie.',
  },

  // ---- l6u20m2: Contrapunto de Especies 4–5 ----

  l6u20m2e1: {
    prompt: '¿Cuál de estas opciones describe una suspensión de cuarta especie?',
    choices: [
      "La preparación en tiempo débil se prolonga en la disonancia del tiempo fuerte, resolviendo por grado conjunto de la nota superior a la inferior",
      "La preparación en tiempo fuerte se prolonga en la disonancia del tiempo débil, resolviendo por grado conjunto de la nota superior a la inferior",
      "La preparación en tiempo débil se prolonga en la disonancia del tiempo fuerte, resolviendo por grado conjunto de la nota inferior a la superior",
      "La preparación en tiempo fuerte se prolonga en la disonancia del tiempo débil, resolviendo por grado conjunto de la nota inferior a la superior",
    ],
    hint: 'La cuarta especie introduce la suspensión: una consonancia en un tiempo débil se liga al tiempo fuerte siguiente donde se convierte en disonancia, y después resuelve descendentemente por grado conjunto. Esto crea la textura sincopada característica.',
  },
  l6u20m2e2: {
    prompt: '¿Qué define el contrapunto de quinta especie (contrapunto florido)?',
    choices: [
      'Una mezcla de las especies anteriores, con valores de nota variados y sus reglas de disonancia',
      'Una mezcla de las especies anteriores, con valores de nota variados pero sin sus reglas de disonancia',
      'Una mezcla de las especies anteriores, con un valor de nota fijo y sus reglas de disonancia',
      'Una mezcla de las especies anteriores, con un valor de nota fijo pero sin sus reglas de disonancia',
    ],
    hint: 'La quinta especie (florida) combina técnicas de las cuatro especies anteriores en una línea melódica fluida. Usa redondas, blancas, negras, suspensiones y notas de paso de forma musicalmente satisfactoria.',
  },
  l6u20m2e3: {
    prompt: '¿Cuáles son las tres fases de una suspensión correctamente ejecutada?',
    choices: [
      "Preparación (consonancia), suspensión (disonancia en tiempo fuerte), resolución (grado conjunto descendente)",
      "Preparación (disonancia), suspensión (consonancia en tiempo fuerte), resolución (grado conjunto descendente)",
      "Preparación (consonancia), suspensión (disonancia en tiempo fuerte), resolución (grado conjunto ascendente)",
      "Preparación (disonancia), suspensión (consonancia en tiempo fuerte), resolución (grado conjunto ascendente)",
    ],
    hint: 'Una suspensión requiere: (1) Preparación — la nota se introduce como consonancia; (2) Suspensión — la nota se mantiene (ligada) en un tiempo fuerte donde se vuelve disonante; (3) Resolución — la nota resuelve descendentemente por grado conjunto hacia una consonancia.',
  },

  // ---- l6u20m3: Contrapunto a Tres Partes / Invertible ----

  l6u20m3e1: {
    prompt: '¿Qué significa «contrapunto invertible a la octava»?',
    choices: [
      'La línea superior puede pasar a ser inferior manteniendo contrapunto válido',
      'La línea superior puede pasar a ser inferior solo abandonando el contrapunto válido',
      'La línea superior sigue siendo superior mientras ambas invierten el orden de las notas',
      'La línea superior sigue siendo superior mientras ambas transponen una octava',
    ],
    hint: 'En el contrapunto invertible a la octava, la voz A encima de la voz B suena correcta, Y la voz B encima de la voz A también suena correcta. Cuando las voces se intercambian, los intervalos se invierten: terceras se convierten en sextas, quintas se convierten en cuartas, etc.',
  },
  l6u20m3e2: {
    prompt: '¿Qué es el contrapunto triple?',
    choices: [
      'Tres líneas independientes pueden permutar libremente las posiciones aguda, media y grave manteniendo contrapunto válido',
      'Tres líneas independientes pueden permutar posiciones solo quedando el bajo original en la posición más grave',
      'Tres líneas independientes pueden permutar posiciones por rotación cíclica pero fallan en los demás órdenes',
      'Tres líneas independientes pueden permutar posiciones solo quedando la melodía original en la posición más aguda',
    ],
    hint: 'Contrapunto triple significa que tres voces (A, B, C) pueden reorganizarse en cualquier orden — ABC, ACB, BAC, BCA, CAB, CBA — y las seis permutaciones producen contrapunto correcto. Bach dominó esta técnica.',
  },
  l6u20m3e3: {
    prompt: '¿Por qué deben evitarse o tratarse con cuidado las quintas perfectas en el contrapunto invertible a la octava?',
    choices: [
      'La inversión da una 4.ª, tratada como disonancia sobre el bajo',
      'La inversión da un tritono, tratado como disonancia sobre el bajo',
      'La inversión da una 2.ª, tratada como disonancia sobre el bajo',
      'La inversión da una 7.ª, tratada como disonancia sobre el bajo',
    ],
    hint: 'Cuando las voces se invierten a la octava, una 5.ª justa se convierte en una 4.ª justa. En el contrapunto a dos voces, las cuartas por encima del bajo son disonantes. Por tanto, cualquier 5.ª justa en el original se convierte en un problema cuando las voces intercambian posición.',
  },

  // ---- l6u20m4: Escritura a Partes Avanzada ----

  l6u20m4e1: {
    prompt: '¿Cuáles son las cuatro voces de la escritura coral, de la más aguda a la más grave?',
    choices: [
      "Soprano, Contralto, Tenor, Bajo",
      "Soprano, Tenor, Contralto, Bajo",
      "Bajo, Tenor, Contralto, Soprano",
      "Contralto, Soprano, Bajo, Tenor",
    ],
    hint: 'SATB significa Soprano (más aguda), Contralto, Tenor y Bajo (más grave). Soprano y Contralto comparten la pauta de clave de sol; Tenor y Bajo comparten la pauta de clave de fa en la notación coral estándar.',
  },
  l6u20m4e2: {
    prompt: '¿Qué exige al intérprete la realización de un bajo cifrado?',
    choices: [
      "Completar las armonías sobre la parte más grave escrita, siguiendo las cifras indicadas",
      'Tocar la línea de bajo sola, leyendo los números como duraciones de acordes',
      'Duplicar la línea de bajo en tres voces superiores',
      'Transponer cada nota del bajo por el intervalo que indica el número',
    ],
    hint: 'El bajo cifrado era la taquigrafía barroca para la armonía. El intérprete lee la nota del bajo escrita y las cifras (números) debajo de ella, y después rellena las voces superiores para crear acordes completos siguiendo reglas de conducción de voces.',
  },
  l6u20m4e3: {
    prompt: 'Al leer una partitura de instrumento transpositor (p. ej., clarinete en Bb), ¿qué debes hacer para encontrar la altura real?',
    choices: [
      'Aplicar a la altura escrita la transposición sonora del instrumento',
      'Aplicar a la altura escrita una transposición nula',
      'Aplicar a la altura escrita la transposición sonora del instrumento al revés',
      'Aplicar a la altura escrita una transposición de octava ascendente',
    ],
    hint: 'Un clarinete en Bb suena una segunda mayor por debajo de lo escrito. Cuando la parte indica C, el instrumento suena Bb. La lectura de partitura exige conocer la transposición de cada instrumento para oír las alturas reales (de concierto).',
  },
};

export default overlay;
