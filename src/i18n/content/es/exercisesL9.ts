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
      'Escucha esta altura e identifícala.',
    hint: 'El C central (C4) es el punto de referencia central en el piano — áncoralo en tu oído.',
    nudge: 'Compárala con la altura de referencia que oíste primero: ¿es más aguda, más grave o exactamente la misma nota? Canta la referencia y después la nota, y escucha si hay algún paso entre ellas.',
  },
  l9u30m1e2: {
    prompt:
      'Escucha esta altura e identifícala.',
    hint: 'G4 está una 5.ª justa por encima del C central — 7 semitonos arriba. Compárala con C4 en tu oído.',
    nudge: 'Compárala con el C de referencia que oíste primero: canta la escala mayor subiendo desde C, una nota cada vez, hasta llegar a ella, y cuenta cuántos grados has subido.',
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
    nudge: 'Piensa en la altura como una subida o una bajada: si la segunda nota es más aguda, ¿la melodía fue hacia arriba o hacia abajo? Elige la palabra que nombra esa dirección.',
  },
  l9u30m1e4: {
    prompt: '¿Qué significa «registro» en música?',
    choices: [
      'La región aguda o grave en que suenan las alturas',
      'La extensión entre los extremos de una melodía',
      'El movimiento ascendente o descendente de una melodía',
      'El número de notas que suenan en un acorde',
    ],
    hint: 'El registro describe una porción del espectro de alturas: registro grave, registro medio o registro agudo.',
  },

  // ---- l9u30m2: Reconocimiento Mayor vs Menor ----

  l9u30m2e1: {
    prompt:
      'Escucha este acorde. ¿Es mayor o menor?',
    choices: ['Mayor', 'Menor'],
    hint: 'La 3.ª mayor (4 semitonos desde la fundamental) confiere a los acordes mayores un carácter brillante y estable.',
    nudge: 'Escucha la 3.ª sobre la fundamental: ¿está a 4 semitonos (sonido más brillante y abierto) o a 3 semitonos (sonido más oscuro)?',
  },
  l9u30m2e2: {
    prompt:
      'Escucha este acorde. ¿Es mayor o menor?',
    choices: ['Mayor', 'Menor'],
    hint: 'La 3.ª menor (3 semitonos desde la fundamental) confiere a los acordes menores una cualidad más sombría y melancólica.',
    nudge: 'Canta la fundamental y después la 3.ª del acorde: ¿están a 4 semitonos de distancia (más brillante) o a 3 (más oscuro)?',
  },
  l9u30m2e3: {
    prompt:
      '¿Qué tríada es la forma menor de C–E–G?',
    choices: [
      'C–Eb–G',
      'C–E#–G',
      'C#–E–G',
      'C–E–Gb',
    ],
    hint: 'Tríada mayor: fundamental + 3.ª mayor (4 semitonos) + 5.ª justa. Tríada menor: fundamental + 3.ª menor (3 semitonos) + 5.ª justa. Solo cambia la 3.ª.',
  },

  // ---- l9u30m3: Reconocimiento de Intervalos P1-P5 ----

  l9u30m3e1: {
    prompt:
      'Escucha este intervalo ascendente e identifícalo.',
    hint: '1 semitono = 2.ª menor (semitono) — el intervalo más pequeño de la música occidental. Piensa en el tema de Tiburón.',
    nudge: 'Evalúa primero el tamaño: ¿las dos notas están tan cerca como pueden estarlo dos notas distintas, o cabe otra nota entre ellas?',
  },
  l9u30m3e2: {
    prompt:
      'Escucha este intervalo ascendente e identifícalo.',
    hint: '2 semitonos = 2.ª mayor (tono). El paso melódico cotidiano.',
    nudge: '¿Es un paso o un salto? Si es un paso, decide si las notas son teclas vecinas (apretado y tenso) o si tienen una tecla entre ellas (un paso sencillo, cotidiano).',
  },
  l9u30m3e3: {
    prompt:
      'Escucha este intervalo ascendente e identifícalo.',
    hint: '3 semitonos = 3.ª menor — sombría y melancólica. Este intervalo define la base de una tríada menor.',
    nudge: 'Es un salto pequeño, mayor que un paso. Escucha su color: ¿brillante y abierto, o más oscuro y melancólico? Después canta por semitonos desde la nota grave para confirmar el tamaño.',
  },
  l9u30m3e4: {
    prompt:
      'Escucha este intervalo ascendente e identifícalo.',
    hint: '7 semitonos = 5.ª justa — fuerte y abierta. El intervalo más consonante después de la octava y el unísono.',
    nudge: 'Escucha el carácter del salto: ¿tenso e inestable, cálido y dulce, o desnudo, abierto y fuerte? Después cuenta los semitonos desde la nota grave para confirmarlo.',
  },

  // ---- l9u30m4: Reconocimiento de Intervalos 6.ª m-P8 ----

  l9u30m4e1: {
    prompt:
      'Escucha este intervalo ascendente e identifícalo.',
    hint: '8 semitonos = 6.ª menor — agridulce y anhelante, con una cualidad punzante y algo tensa.',
    nudge: 'Un salto amplio con un color agridulce y anhelante. Para comprobarlo, canta la nota grave una octava más arriba, identifica el pequeño intervalo que forma con la otra nota e inviértelo: los números suman 9, y la cualidad pasa a la opuesta.',
  },
  l9u30m4e2: {
    prompt:
      'Escucha este intervalo ascendente e identifícalo.',
    hint: '9 semitonos = 6.ª mayor — cálida, romántica y consonante.',
    nudge: 'Un salto amplio que sigue sonando cálido y dulce. Para comprobarlo, canta la nota grave una octava más arriba, identifica el pequeño intervalo que forma con la otra nota e inviértelo: los números suman 9, y la cualidad pasa a la opuesta.',
  },
  l9u30m4e3: {
    prompt:
      'Escucha este intervalo ascendente e identifícalo.',
    hint: '10 semitonos = 7.ª menor — una tensión dominante y de blues que pide resolución.',
    nudge: 'Un salto muy amplio con un tirón de blues que pide resolución. Canta la nota grave una octava más arriba y compara: ¿el salto se queda un semitono por debajo de esa octava o un tono por debajo?',
  },
  l9u30m4e4: {
    prompt:
      'Escucha este intervalo ascendente e identifícalo.',
    hint: '12 semitonos = octava justa — las dos notas suenan como la misma altura en registros diferentes.',
    nudge: 'Escucha si las dos notas se funden tan por completo que suenan como una sola nota a dos alturas, o si queda entre ellas algún roce o tensión.',
  },

  // ---- l9u30m5: Intervalos Armónicos ----

  l9u30m5e1: {
    prompt:
      'Escucha estas dos notas tocadas simultáneamente e identifica el intervalo armónico.',
    hint: '5 semitonos = 4.ª justa. En simultáneo tiene una cualidad abierta y hueca.',
    nudge: 'Clasifícalo primero por su sonido: ¿abierto y hueco, cálido y fundido, o áspero y tenso? Después canta las dos notas una tras otra y cuenta los semitonos entre ellas para precisar el tamaño.',
  },
  l9u30m5e2: {
    prompt:
      'Escucha estas dos notas tocadas simultáneamente e identifica el intervalo armónico.',
    hint: '4 semitonos = 3.ª mayor — un sonido armónico cálido y consonante.',
    nudge: 'Clasifícalo primero por su sonido: ¿abierto y hueco, cálido y fundido, o áspero y tenso? Si es cálido, decide si es del tipo más brillante o más oscuro: canta las dos notas una tras otra y cuenta los semitonos.',
  },
  l9u30m5e3: {
    prompt:
      '¿Cuál es la diferencia entre un intervalo armónico y un intervalo melódico?',
    choices: [
      'Los intervalos armónicos hacen sonar las dos notas a la vez; los melódicos las tocan una tras otra',
      "Los intervalos armónicos hacen sonar las dos notas una tras otra; los melódicos las tocan a la vez",
      'Los intervalos armónicos hacen sonar las dos notas en la misma octava; los melódicos las tocan en octavas distintas',
      'Los intervalos armónicos hacen sonar las dos notas en un instrumento; los melódicos las tocan en dos instrumentos',
    ],
    hint: 'Armónico = ambas notas al mismo tiempo. Melódico = una nota después de la otra. Las mismas dos notas pueden formar cualquiera de los dos tipos.',
  },

  // =========================================================================
  // Unidad 31: Escalas, Acordes y Dictado
  // =========================================================================

  // ---- l9u31m1: Reconocimiento de Escalas Mayor/Menor ----

  l9u31m1e1: {
    prompt:
      'Escucha esta escala e identifica su tipo.',
    choices: ['Mayor', 'Menor natural', 'Menor armónica'],
    hint: 'La escala mayor (T-T-S-T-T-T-S) tiene un carácter brillante y resuelto en cada paso.',
    nudge: 'Comprueba primero la 3.ª sobre la tónica: ¿4 semitonos o 3? Si son 3, escucha la parte alta de la escala: ¿hay un salto de tono y medio entre el 6.º y el 7.º grados?',
  },
  l9u31m1e2: {
    prompt:
      'Escucha esta escala e identifica su tipo.',
    choices: ['Mayor', 'Menor natural', 'Menor armónica'],
    hint: 'La escala menor natural (T-S-T-T-S-T-T) tiene una atmósfera más sombría que la mayor — la 3.ª, 6.ª y 7.ª descendidas moldean su color.',
    nudge: 'Canta desde la tónica: ¿la 3.ª está a 4 o a 3 semitonos de ella? Después escucha el 7.º grado: ¿queda a un tono de la tónica superior, o a un semitono, con un salto de tono y medio por debajo?',
  },
  l9u31m1e3: {
    prompt:
      '¿Cuál describe mejor el carácter general de una escala mayor?',
    choices: [
      'Brillante, alegre y resuelto',
      'Sombrío, triste y tenso',
      'Misterioso, ambiguo e inquieto',
      'Disonante, áspero e inestable',
    ],
    hint: 'Las escalas mayores se perciben como brillantes y estables. La 3.ª mayor y la 7.ª mayor contribuyen a este carácter positivo.',
  },

  // ---- l9u31m2: Reconocimiento de Modos ----

  l9u31m2e1: {
    prompt:
      'Escucha esta escala e identifica el modo.',
    choices: ['Dórico', 'Frigio', 'Lidio', 'Mixolidio'],
    hint: 'El dórico es como el menor natural con el 6.º grado elevado — ese 6 natural en contexto menor es la nota característica.',
    nudge: 'Primero la 3.ª: ¿está a 4 o a 3 semitonos de la tónica? Después compárala con la escala mayor (si son 4) o con la menor natural (si son 3) y busca el único grado que cambia: ¿un 2.º descendido, un 4.º elevado, un 6.º elevado o un 7.º descendido?',
  },
  l9u31m2e2: {
    prompt:
      'Escucha esta escala e identifica el modo.',
    choices: ['Dórico', 'Frigio', 'Lidio', 'Mixolidio'],
    hint: 'El lidio es como el mayor con el 4.º grado elevado — escucha el #4 brillante tirando hacia arriba.',
    nudge: '¿La 3.ª está a 4 o a 3 semitonos de la tónica? Compara la escala con la mayor (si son 4) o con la menor natural (si son 3) y busca el único grado diferente: ¿el 2.º, el 4.º, el 6.º o el 7.º?',
  },
  l9u31m2e3: {
    prompt:
      '¿Cuál es la nota característica que distingue el dórico del menor natural?',
    choices: [
      "El 6.º grado elevado un semitono",
      "El 7.º grado elevado un semitono",
      "El 3.º grado elevado un semitono",
      'El 2.º grado rebajado un semitono',
    ],
    hint: 'El dórico difiere del menor natural en una nota: el 6.º grado está elevado un semitono. En D dórico, es B natural en vez de Bb.',
  },
  l9u31m2e4: {
    prompt:
      'Escucha esta escala e identifica el modo.',
    choices: ['Jónico', 'Lidio', 'Mixolidio', 'Dórico'],
    hint: 'El jónico es la propia escala mayor: el 1.er modo, sin ningún grado alterado. El lidio elevaría el 4.º grado (#4); el mixolidio bajaría el 7.º (b7).',
    nudge: 'Compara cada grado con la escala mayor que conoces: ¿el 4.º está elevado, el 7.º descendido, la 3.ª descendida, o coinciden todos los grados?',
  },
  l9u31m2e5: {
    prompt:
      'Escucha esta escala e identifica el modo.',
    choices: ['Eólico', 'Dórico', 'Frigio', 'Locrio'],
    hint: 'El eólico es la escala menor natural: el 6.º modo de la escala mayor. El dórico elevaría el 6.º grado (6 natural); el frigio bajaría el 2.º (b2); el locrio baja el 2.º y el 5.º.',
    nudge: 'Compara cada grado con la escala menor natural: ¿el 6.º está elevado, el 2.º descendido, el 2.º y el 5.º ambos descendidos, o coinciden todos los grados?',
  },

  // ---- l9u31m3: Pentatónica/Blues/Simétrica ----

  l9u31m3e1: {
    prompt:
      'Escucha esta escala e identifica su tipo.',
    choices: ['Pentatónica mayor', 'Pentatónica menor', 'Blues', 'Tonos enteros'],
    hint: 'La pentatónica mayor tiene cinco notas y ningún semitono — la escala mayor sin el 4.º y el 7.º grados.',
    nudge: 'Cuenta las notas y busca semitonos. Si hay cinco notas y ningún semitono, comprueba la 3.ª: ¿está a 4 o a 3 semitonos de la tónica?',
  },
  l9u31m3e2: {
    prompt:
      'Escucha esta escala e identifica su tipo.',
    choices: ['Pentatónica mayor', 'Pentatónica menor', 'Blues', 'Tonos enteros'],
    hint: 'La escala de blues es la pentatónica menor más la «blue note» (b5) — escucha ese mordisco cromático extra.',
    nudge: 'Cuenta las notas y busca semitonos: ¿cinco notas sin ninguno, seis notas todas a un tono de distancia, o seis notas con una nota cromática extra entre el 4.º y el 5.º grados?',
  },
  l9u31m3e3: {
    prompt: '¿Qué es la «blue note» en una escala de blues?',
    choices: [
      'La 5.ª bemolizada (o 4.ª sostenida), entre los grados 4.º y 5.º',
      "La 2.ª bemolizada (o tónica sostenida), entre los grados 1.º y 2.º",
      "La 6.ª bemolizada (o 5.ª sostenida), entre los grados 5.º y 6.º",
      "La 7.ª natural (o octava bemolizada), entre la 7.ª bemolizada y la tónica",
    ],
    hint: 'La blue note es la b5 (o #4) que la escala de blues de seis notas añade a la pentatónica menor. En el blues en C, es Gb/F#, entre F y G.',
  },

  // ---- l9u31m4: Reconocimiento de Cualidad de Tríadas ----

  l9u31m4e1: {
    prompt:
      'Escucha esta tríada e identifica su cualidad.',
    choices: ['Mayor', 'Menor', 'Disminuida', 'Aumentada'],
    hint: 'Disminuida = dos 3.as menores apiladas. El tritono entre fundamental y 5.ª crea su cualidad tensa e inestable.',
    nudge: 'Escucha el intervalo exterior, de la fundamental a la 5.ª: ¿es una 5.ª justa, o un semitono más estrecha o más amplia? Después comprueba las dos 3.as apiladas: ¿4 o 3 semitonos cada una?',
  },
  l9u31m4e2: {
    prompt:
      'Escucha esta tríada e identifica su cualidad.',
    choices: ['Mayor', 'Menor', 'Disminuida', 'Aumentada'],
    hint: 'Aumentada = dos 3.as mayores apiladas. La estructura simétrica le da una cualidad etérea y sin resolución.',
    nudge: 'Apila las dos 3.as que oyes, de abajo arriba: ¿miden 4 + 3, 3 + 4, 3 + 3 o 4 + 4 semitonos? La 5.ª exterior también ayuda: ¿es justa, o un semitono más estrecha o más amplia?',
  },
  l9u31m4e3: {
    prompt: '¿Qué intervalos componen una tríada disminuida?',
    choices: [
      'Fundamental + 3.ª menor + 5.ª disminuida',
      'Fundamental + 3.ª mayor + 5.ª disminuida',
      'Fundamental + 3.ª menor + 5.ª justa',
      'Fundamental + 3.ª mayor + 5.ª justa',
    ],
    hint: 'Disminuida = 3.ª menor (3 semitonos) + 5.ª disminuida (6 semitonos). Dos 3.as menores apiladas producen el tritono entre fundamental y 5.ª.',
  },
  l9u31m4e4: {
    prompt: '¿Cómo describirías el sonido de una tríada aumentada?',
    choices: [
      'Tensa y sin resolución, con una cualidad etérea, flotante y ambigua',
      'Brillante, asentado y estable, igual que un simple acorde mayor',
      'Sombría y pesada como un acorde menor',
      'Hueca y medieval como un power chord',
    ],
    hint: 'Las tríadas aumentadas dividen la octava en tres partes iguales (3M + 3M). Esta simetría crea una sensación ambigua y suspendida.',
  },

  // ---- l9u31m5: Cualidad de Acordes de Séptima ----

  l9u31m5e1: {
    prompt:
      'Escucha este acorde de séptima e identifica su cualidad.',
    choices: ['Mayor con 7.ª mayor', 'Menor con 7.ª', 'Séptima de dominante', 'Semidisminuido'],
    hint: 'El acorde mayor con 7.ª superpone una 7.ª mayor a una tríada mayor — exuberante y etéreo, común en el jazz y la bossa nova.',
    nudge: 'Primero la tríada: ¿la 3.ª está a 4 o a 3 semitonos de la fundamental, y la 5.ª es justa o un semitono más baja? Después la 7.ª: ¿queda a un semitono o a un tono por debajo de la octava?',
  },
  l9u31m5e2: {
    prompt:
      'Escucha este acorde de séptima e identifica su cualidad.',
    choices: ['Mayor con 7.ª mayor', 'Menor con 7.ª', 'Séptima de dominante', 'Semidisminuido'],
    hint: 'El acorde menor con 7.ª superpone una 7.ª menor a una tríada menor — suave, cálido y relajado.',
    nudge: 'Escucha el acorde en dos capas. La tríada: ¿la 3.ª está a 4 o a 3 semitonos de la fundamental, y la 5.ª es justa o descendida? La 7.ª: ¿queda a un semitono o a un tono por debajo de la octava?',
  },
  l9u31m5e3: {
    prompt:
      '¿Qué confiere a un acorde de 7.ª de dominante su sensación característica de tensión y deseo de resolver?',
    choices: [
      'El tritono entre la 3.ª y la 7.ª',
      'El tritono entre la fundamental y la 5.ª',
      'La 5.ª justa entre la fundamental y la 5.ª',
      'La 3.ª mayor entre la fundamental y la 3.ª',
    ],
    hint: 'En G7 (G-B-D-F), B y F forman un tritono (6 semitonos). Esta disonancia crea la atracción hacia la resolución a C mayor.',
  },
  l9u31m5e4: {
    prompt:
      '¿En qué contexto musical se encuentra con mayor frecuencia el acorde de séptima semidisminuido?',
    choices: [
      'Como acorde ii en tonalidades menores (p. ej. Bm7b5 en A menor)',
      "Como acorde i en tonalidades menores (p. ej. Am7b5 en A menor)",
      "Como acorde V en tonalidades menores (p. ej. Em7b5 en A menor)",
      "Como acorde iv en tonalidades menores (p. ej. Dm7b5 en A menor)",
    ],
    hint: 'El acorde de séptima semidisminuido (m7b5) aparece diatónicamente sobre ii en la menor natural o armónica y sobre vii en mayor. En las progresiones ii-V-i en tonalidades menores, es la predominante habitual que conduce a V.',
  },

  // =========================================================================
  // Unidad 32: Dictado, Lectura a Primera Vista, Contextual
  // =========================================================================

  // ---- l9u32m1: Dictado Melódico Diatónico ----

  l9u32m1e1: {
    prompt:
      'Escucha esta nota e identifícala.',
    hint: 'Esta altura es el 3.er grado de C mayor. Canta desde C para localizarla.',
  },
  l9u32m1e2: {
    prompt:
      'Escucha esta nota e identifícala.',
    hint: 'Esta altura es el 6.º grado de C mayor. Canta desde C para localizarla.',
  },
  l9u32m1e3: {
    prompt: '¿Qué significa «melodía diatónica»?',
    choices: [
      'Una melodía solo con notas de la tonalidad',
      'Una melodía con notas de fuera de la tonalidad',
      'Una melodía que sube y después baja',
      'Una melodía que solo se mueve por grados conjuntos',
    ],
    hint: 'Diatónico significa «perteneciente a la tonalidad». Una melodía diatónica en C mayor utiliza solo C, D, E, F, G, A y B — sin alteraciones.',
  },
  l9u32m1e4: {
    prompt:
      '¿Qué estrategia es más eficaz para identificar grados individuales de la escala en una melodía?',
    choices: [
      'Relacionar cada nota con la tónica cantando la escala hasta ese grado',
      "Relacionar cada nota con la dominante llamando primer grado a la dominante",
      "Relacionar cada nota con la tónica contando cada semitono como un nuevo grado de la escala",
      "Relacionar cada nota con la primera nota de la melodía llamando tónica a esa nota",
    ],
    hint: 'Oír grados de la escala implica percibir cada nota en relación con la tónica. Cantar la escala desde la tónica hasta la nota objetivo es un método fiable.',
  },
  l9u32m1e5: {
    prompt: 'Escucha la melodía y elige la que has oído.',
    hint: 'Sigue primero el contorno: ¿la línea vuelve al punto de partida o sigue subiendo?',
  },
  l9u32m1e6: {
    prompt: 'Escucha la melodía y elige la que has oído.',
    hint: 'Sube por grado conjunto y después baja a saltos por las notas del acorde de tónica hasta acabar en la tónica.',
  },
  l9u32m1e7: {
    prompt: 'Escucha la melodía y elige la que has oído.',
    hint: '¿Grados conjuntos o saltos? Una melodía que dibuja el acorde de tónica se mueve por terceras y acaba donde empezó.',
  },
  l9u32m1e8: {
    prompt: 'Escucha la melodía y elige la que has oído.',
    hint: 'Escucha el final: la última nota es la tónica, a la que se llega desde la nota un semitono por debajo.',
  },
  l9u32m1e9: {
    prompt: 'Escucha la melodía y elige la que has oído.',
    hint: 'Baja de la 5.ª a la tónica, pero no escala abajo de seguido: escucha los saltos.',
  },

  // ---- l9u32m2: Dictado Melódico Cromático ----

  l9u32m2e1: {
    prompt:
      'Escucha este intervalo ascendente e identifícalo.',
    hint: 'E a F es un semitono (1 semitono) entre dos letras distintas — un semitono diatónico, que ya está dentro de C mayor. Un semitono cromático mantiene la letra (F a F#). En una melodía, cualquiera de los dos funciona a menudo como nota de paso o bordadura.',
  },
  l9u32m2e2: {
    prompt:
      'Escucha este intervalo ascendente e identifícalo.',
    hint: 'El tritono (6 semitonos, 4.ª aumentada / 5.ª disminuida) es una de las disonancias más ásperas (con la 2.ª menor y la 7.ª mayor) y divide la octava exactamente por la mitad.',
    nudge: '¿El salto suena estable y abierto, o inquieto y sin resolver, como si tuviera que seguir adelante? Cuenta los semitonos desde la nota grave y compara el total con los 12 de la octava.',
  },
  l9u32m2e3: {
    prompt: '¿Qué es una nota de paso cromática?',
    choices: [
      'Una nota que une, por semitonos, dos notas de la escala separadas por un tono',
      'Una nota un semitono por encima de una nota de la escala, que vuelve a ella',
      'Una nota un semitono por debajo de una nota de la escala, que vuelve a ella',
      "Una nota sostenida bajo otras notas de la escala en movimiento",
    ],
    hint: 'Una nota de paso cromática es una nota no diatónica que enlaza dos notas diatónicas separadas por un tono, dividiendo ese tono en dos semitonos.',
  },
  l9u32m2e4: {
    prompt: 'Escucha la melodía y elige la que has oído.',
    hint: 'Una nota cromática de paso rellena un tono: escucha la nota encajada entre las dos primeras notas de la escala.',
  },
  l9u32m2e5: {
    prompt: 'Escucha la melodía y elige la que has oído.',
    hint: 'Una nota sale justo fuera de la tonalidad y vuelve enseguida: una bordadura cromática.',
  },
  l9u32m2e6: {
    prompt: 'Escucha la melodía y elige la que has oído.',
    hint: 'Escucha la nota que atrae hacia G por semitono ascendente: una sensible secundaria (V/V).',
  },
  l9u32m2e7: {
    prompt: 'Escucha la melodía y elige la que has oído.',
    hint: 'Un sostenido conduce por semitono ascendente a la nota siguiente. ¿Hacia dónde va la línea después?',
  },

  // ---- l9u32m3: Dictado Armónico ----

  l9u32m3e1: {
    prompt:
      'Una frase termina con V moviéndose a I, ambos en posición fundamental, con la melodía llegando a la tónica. ¿Qué tipo de cadencia es esta?',
    choices: [
      'Cadencia auténtica perfecta (CAP)',
      'Semicadencia',
      'Cadencia auténtica imperfecta (CAI)',
      'Cadencia rota',
    ],
    hint: 'Una cadencia auténtica perfecta (CAP) requiere V a I en posición fundamental con la tónica en el soprano. Proporciona la sensación más fuerte de conclusión.',
    nudge: 'Hazte tres preguntas: ¿V va a I, están los dos acordes en posición fundamental y llega la melodía a la tónica? Cuando se cumplen las tres, es la cadencia auténtica más fuerte y conclusiva; si falla alguna, es su versión más débil.',
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
    nudge: 'Fíjate en el último acorde: una cadencia que termina en la tónica suena cerrada; una que se detiene en la dominante suena abierta, como una coma. ¿Qué nombre describe un final abierto, sin concluir?',
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
    nudge: 'La dominante hace esperar la tónica, pero en su lugar llega otro acorde. ¿Qué cadencia debe su nombre a una llegada que se rompe, y no a una llegada o a una pausa?',
  },

  // ---- l9u32m4: Lectura a Primera Vista ----

  l9u32m4e1: {
    prompt:
      'En el solfeo movible, ¿qué sílaba se asigna siempre a la tónica de la tonalidad actual?',
    choices: ['Do', 'La', 'Sol', 'Re'],
    hint: 'En el solfeo movible, «Do» representa siempre la tónica independientemente de la tonalidad. En C mayor, Do = C. En G mayor, Do = G.',
    nudge: 'En el solfeo movible, las sílabas siguen los grados de la escala y no alturas fijas, y la tónica recibe siempre la primera sílaba de la serie. ¿Qué sílaba la abre?',
  },
  l9u32m4e2: {
    prompt:
      'En la tonalidad de C mayor, ¿qué nota corresponde a la sílaba de solfeo «Mi»?',
    choices: ['E', 'D', 'F', 'G'],
    hint: 'Do-Re-Mi-Fa-Sol-La-Si se corresponde con los 7 grados de la escala. En C mayor: C(Do), D(Re), E(Mi), F(Fa), G(Sol), A(La), B(Si).',
    nudge: 'En el solfeo movible, las sílabas siguen los grados de la escala: en C mayor, Do = C. Sube por la escala sílaba a sílaba hasta llegar a Mi.',
  },
  l9u32m4e3: {
    prompt:
      '¿Qué preparación establece una referencia tonal antes de cantar una melodía a primera vista?',
    choices: [
      'Encontrar la tónica cantando la escala o el arpegio de la tonalidad',
      'Encontrar la tónica eligiendo la nota más aguda de la melodía',
      'Encontrar la tónica eligiendo la primera nota de la melodía',
      'Encontrar la tónica usando la nota indicada por la clave',
    ],
    hint: 'Establecer el centro tonal (tónica) en el oído es esencial. Cantar rápidamente la escala o el arpegio de la tónica ancla la percepción de altura antes de leer la melodía.',
    nudge: 'Antes de leer ninguna nota, tu oído necesita un punto de referencia: la altura con la que se comparan todas las demás. ¿Qué opción le da al oído ese punto de partida?',
  },

  // ---- l9u32m5: Audición Contextual ----

  l9u32m5e1: {
    prompt:
      'Una línea vocal única sin acompañamiento ni armonía es ejemplo de ¿qué textura musical?',
    choices: [
      'Monofónica',
      'Homofónica',
      'Polifónica',
      'Heterofónica',
    ],
    hint: 'La textura monofónica consiste en una única línea melódica sin acompañamiento ni armonía. Una voz, una línea.',
    nudge: 'Los nombres de las texturas vienen de prefijos griegos. Cuenta cuántas líneas independientes suenan y cómo se relacionan, y después relaciónalo con el prefijo.',
  },
  l9u32m5e2: {
    prompt:
      'Una canción pop alterna estrofas (letra nueva cada vez, misma música) con un estribillo que vuelve siempre con la misma letra y la misma música. ¿Qué forma es esta?',
    choices: [
      'Forma estrofa-estribillo',
      'Forma durchkomponiert (through-composed)',
      'Forma rondó (ABACA)',
      'Forma sonata',
    ],
    hint: 'La forma estrofa-estribillo alterna estrofas (letras distintas, misma melodía) con un estribillo recurrente. Es la estructura más habitual en la música popular.',
    nudge: 'Fíjate en cómo está construida la canción: dos tipos de sección que se alternan, uno de los cuales vuelve sin cambios. ¿Qué forma lleva el nombre exactamente de esas secciones?',
  },
  l9u32m5e3: {
    prompt:
      '¿Qué característica musical es más útil para identificar el periodo estilístico histórico de una pieza?',
    choices: [
      'La combinación de instrumentación, lenguaje armónico y estructura formal',
      'La combinación de armadura, indicación de compás e indicación de tempo',
      'La combinación de extensión melódica, dinámica y duración de la pieza',
      'La combinación de la primera nota, la última nota y la nota más aguda',
    ],
    hint: 'Los periodos estilísticos se identifican por una combinación de factores: instrumentación (clavecín vs. piano), vocabulario armónico (sobre todo diatónico vs. muy cromático) y convenciones formales (binaria vs. forma sonata).',
  },
};

export default overlay;
