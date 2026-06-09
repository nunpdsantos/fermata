import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 6 exercise templates
// 12 modules, ~12 templates total
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 18: Acordes Cromáticos
  // =========================================================================

  // ---- l6u18m1: Acorde Napolitano bII ----
  l6u18m1: [
    {
      // chord_build — {root} es la fundamental del acorde (el propio bII), no la
      // tonalidad: la respuesta evaluada es una tríada mayor SOBRE {root}. Refleja el EN.
      promptTemplate:
        'Construye una tríada mayor de {root}{accidental} (acorde napolitano).',
      hintTemplate:
        'El acorde napolitano es una tríada mayor construida sobre el 2.º grado rebajado. Construye una tríada mayor sobre {root}{accidental}.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cómo funciona y resuelve el acorde napolitano?',
      hintTemplate:
        'El napolitano (bII o N6) es un acorde predominante que resuelve hacia V (frecuentemente vía 6/4 cadencial). Está casi siempre en primera inversión.',
      choiceSets: [
        [
          'El napolitano es un acorde predominante que resuelve típicamente hacia V o hacia un 6/4 cadencial',
          'El napolitano resuelve directamente hacia I',
          'El napolitano funciona como acorde de dominante',
          'El napolitano está siempre en posición fundamental',
        ],
        [
          'El acorde napolitano en Do menor es Reb mayor (Reb–Fa–Lab)',
          'El napolitano en Do menor es Re mayor',
          'El napolitano en Do menor es Mib mayor',
          'El napolitano en Do menor es Si mayor',
        ],
      ],
    },
  ],

  // ---- l6u18m2: Sexta Italiana / Francesa ----
  l6u18m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica el tipo y la estructura de este acorde de sexta aumentada.',
      hintTemplate:
        'Sexta italiana: b6, 1, #4 (3 notas). Sexta francesa: b6, 1, 2, #4 (4 notas, incluye el 2.º grado). Ambas resuelven hacia V con las voces extremas expandiéndose hacia una octava.',
      choiceSets: [
        [
          'La sexta italiana tiene 3 notas: b6, 1 y #4',
          'La sexta italiana tiene 4 notas',
          'La sexta italiana contiene el 2.º grado',
          'La sexta italiana contiene el 3.er grado',
        ],
        [
          'La sexta francesa añade el 2.º grado a la sexta italiana',
          'La sexta francesa añade el 3.er grado',
          'La sexta francesa tiene solo 2 notas',
          'La francesa es idéntica a la italiana',
        ],
        [
          'Los acordes de sexta aumentada resuelven divergentemente hacia una octava sobre la dominante',
          'Los acordes de sexta aumentada resuelven convergentemente hacia un unísono',
          'Los acordes de sexta aumentada resuelven hacia la tónica',
          'Los acordes de sexta aumentada no resuelven',
        ],
        [
          'El intervalo entre b6 y #4 es una sexta aumentada (10 semitonos), que resuelve hacia P8',
          'El intervalo de sexta aumentada es de 8 semitonos',
          'La sexta aumentada resuelve hacia P5',
          'El intervalo de sexta aumentada es de 6 semitonos',
        ],
      ],
    },
  ],

  // ---- l6u18m3: Sexta Alemana ----
  l6u18m3: [
    {
      // multiple_choice
      promptTemplate:
        'Analiza el acorde de sexta alemana y su resolución.',
      hintTemplate:
        'Sexta alemana: b6, 1, b3, #4 (4 notas, incluye la 3.ª menor). Resuelve hacia un 6/4 cadencial para evitar quintas paralelas, y después hacia V.',
      choiceSets: [
        [
          'La sexta alemana contiene b6, 1, b3 y #4',
          'La sexta alemana contiene b6, 1, 2 y #4',
          'La sexta alemana tiene solo 3 notas',
          'La sexta alemana contiene el 5.º grado',
        ],
        [
          'La sexta alemana resuelve hacia un 6/4 cadencial para evitar quintas paralelas con V',
          'La sexta alemana resuelve directamente hacia V en posición fundamental',
          'La sexta alemana resuelve hacia I',
          'Las quintas paralelas son aceptables con la sexta alemana',
        ],
        [
          'La sexta alemana es enarmónicamente equivalente a un acorde de séptima de dominante',
          'La sexta alemana es enarmónicamente equivalente a una séptima menor',
          'La sexta alemana no tiene equivalente enarmónico',
          'La sexta alemana es equivalente a una séptima mayor',
        ],
      ],
    },
    {
      // chord_build — {root} es la fundamental del dom7 enarmónico, no la
      // tonalidad: la respuesta evaluada es una séptima de dominante SOBRE {root}. Refleja el EN.
      promptTemplate:
        'Construye un acorde de séptima de dominante de {root}{accidental} (sexta alemana enarmónica).',
      hintTemplate:
        'La sexta alemana es enarmónicamente equivalente a un acorde de séptima de dominante. Construye una séptima de dominante sobre {root}{accidental}: fundamental + 3.ª mayor + 5.ª justa + 7.ª menor.',
    },
  ],

  // ---- l6u18m4: Modulación Enarmónica Gr+6 <-> V7 ----
  l6u18m4: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cómo permite la reinterpretación enarmónica de la sexta alemana la modulación?',
      hintTemplate:
        'La sexta alemana es enarmónicamente idéntica a un acorde de séptima de dominante. Reescribirla permite una modulación súbita a una tonalidad remota: Gr+6 en una tonalidad = V7 en otra.',
      choiceSets: [
        [
          'La sexta alemana en Do menor (Lab–Do–Mib–Fa#) puede reescribirse como Lab7 (Lab–Do–Mib–Solb), resolviendo hacia Reb',
          'La sexta alemana no puede reinterpretarse como séptima de dominante',
          'La reinterpretación enarmónica solo funciona con la sexta italiana',
          'El acorde reescrito resuelve hacia la misma tonalidad',
        ],
        [
          'Este pivote enarmónico permite modulación hacia tonalidades a medio tono de distancia de la dominante',
          'Esta técnica solo modula entre tonalidades paralelas',
          'Esta técnica se limita a tonalidades cercanas',
          'Este tipo de modulación nunca se usó históricamente',
        ],
        [
          'La ambigüedad enarmónica de la sexta alemana fue ampliamente explotada por los compositores románticos',
          'Esta técnica se usó solo en la era barroca',
          'Los compositores clásicos nunca usaron modulación enarmónica',
          'Esta técnica fue inventada en el siglo XX',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 19: Técnicas Cromáticas Avanzadas
  // =========================================================================

  // ---- l6u19m1: Modulación Enarmónica vía dim7 ----
  l6u19m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cómo permite el acorde de séptima disminuida la modulación enarmónica?',
      hintTemplate:
        'Un acorde dim7 divide la octava en terceras menores iguales. Cualquiera de sus 4 notas puede reescribirse como fundamental, haciéndolo resolver hacia 4 tonalidades diferentes.',
      choiceSets: [
        [
          'Cualquier nota de un acorde dim7 puede funcionar como sensible para una tonalidad diferente',
          'Un acorde dim7 solo puede resolver hacia una tonalidad',
          'Los acordes dim7 no pueden reescribirse',
          'Solo la fundamental de un dim7 puede funcionar como sensible',
        ],
        [
          'Existen solo 3 acordes de séptima disminuida distintos (enarmónicamente), cubriendo las 12 tonalidades',
          'Existen 12 acordes de séptima disminuida distintos',
          'Existen 6 acordes de séptima disminuida distintos',
          'Cada tonalidad tiene su séptima disminuida única',
        ],
        [
          'Siº7 (Si–Re–Fa–Lab) puede resolver hacia Do, Mib, Solb o La dependiendo de la escritura enarmónica',
          'Siº7 solo puede resolver hacia Do',
          'Siº7 tiene 2 resoluciones posibles',
          'Siº7 resuelve solo hacia Si mayor',
        ],
      ],
    },
  ],

  // ---- l6u19m2: Séptima Disminuida con Nota Común ----
  l6u19m2: [
    {
      // multiple_choice
      promptTemplate:
        'Explica la función de un acorde de séptima disminuida con nota común.',
      hintTemplate:
        'Un CTo7 comparte una nota común con el acorde que embellece. Decora (en vez de dirigirse armónicamente hacia) un acorde mayor o de séptima de dominante.',
      choiceSets: [
        [
          'El CTo7 comparte una nota común (generalmente la fundamental) con el acorde que embellece',
          'El CTo7 no tiene notas en común con el acorde siguiente',
          'El CTo7 funciona como acorde de dominante',
          'El CTo7 es lo mismo que un acorde disminuido secundario',
        ],
        [
          'El CTo7 embellece un acorde a través de movimiento de notas vecinas en tres voces',
          'El CTo7 crea una modulación',
          'El CTo7 es siempre un acorde de paso',
          'El CTo7 sustituye la función dominante',
        ],
      ],
    },
  ],

  // ---- l6u19m3: Mediantes Cromáticas / Progresión Omnibus ----
  l6u19m3: [
    {
      // multiple_choice
      promptTemplate:
        'Describe la progresión omnibus y sus características de conducción de voces.',
      hintTemplate:
        'El omnibus es un patrón cromático de intercambio de voces donde dos voces se mueven en movimiento contrario cromático mientras otras voces sostienen notas comunes.',
      choiceSets: [
        [
          'El omnibus presenta movimiento cromático contrario en las voces extremas con notas comunes en las voces interiores',
          'El omnibus usa solo movimiento paralelo',
          'El omnibus no tiene movimiento cromático',
          'El omnibus es una simple progresión I–IV–V–I',
        ],
        [
          'El omnibus puede prolongar una armonía de dominante a través de intercambio cromático de voces',
          'El omnibus crea siempre una modulación',
          'El omnibus solo prolonga la armonía de tónica',
          'El omnibus nunca fue usado por ningún compositor importante',
        ],
      ],
    },
  ],

  // ---- l6u19m4: Mediantes Cromáticas / Técnicas Tardorrománticas ----
  l6u19m4: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica la relación de mediante cromática descrita.',
      hintTemplate:
        'Las mediantes cromáticas son acordes relacionados por una 3.ª mayor o menor con fundamentales que difieren cromáticamente (p. ej., Do mayor a Mi mayor o Lab mayor). Comparten una nota común.',
      choiceSets: [
        [
          'Do mayor a Mi mayor es una mediante cromática: fundamentales a una 3.ªM de distancia, compartiendo una nota común (Mi)',
          'Do mayor a Sol mayor es una mediante cromática',
          'Do mayor a Fa mayor es una mediante cromática',
          'Las mediantes cromáticas no comparten notas comunes',
        ],
        [
          'Las mediantes cromáticas producen un cambio de color impactante porque alteran el modo al moverse por 3.ª',
          'Las mediantes cromáticas suenan siempre sutiles y suaves',
          'Las mediantes cromáticas son lo mismo que las mediantes diatónicas',
          'Las mediantes cromáticas se limitan a piezas en modo mayor',
        ],
        [
          'Do mayor a Lab mayor es una mediante cromática: fundamentales a una 3.ªM de distancia, compartiendo una nota común (Do/Mib)',
          'Do a Lab es una relación de dominante',
          'Esta relación no tiene notas comunes',
          'Do a Lab es una relación de subdominante',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 20: Contrapunto y Escritura a Partes
  // =========================================================================

  // ---- l6u20m1: Conducción Cromática de Voces ----
  l6u20m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analiza esta técnica de conducción cromática de voces.',
      hintTemplate:
        'La conducción cromática de voces enlaza acordes a través de movimiento por medio tono. Crea conexiones suaves entre armonías de otro modo distantes.',
      choiceSets: [
        [
          'La conducción cromática de voces usa enlaces por medio tono para crear movimiento suave entre acordes distantes',
          'La conducción cromática de voces usa siempre tonos enteros',
          'La conducción cromática de voces es lo mismo que la conducción diatónica',
          'La conducción cromática de voces ignora la cualidad de los acordes',
        ],
        [
          'La conducción parsimoniosa de voces mueve el mínimo de voces por los menores intervalos',
          'La conducción parsimoniosa requiere que todas las voces se muevan',
          'Parsimonioso significa moverse por saltos grandes',
          'Este concepto nunca fue estudiado teóricamente',
        ],
      ],
    },
  ],

  // ---- l6u20m2: División Igual de la Octava ----
  l6u20m2: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala {scaleType} de {root}, que divide la octava en intervalos iguales.',
      hintTemplate:
        'La escala de tonos enteros divide la octava en 6 tonos iguales. La escala cromática la divide en 12 medios tonos iguales. Estas divisiones simétricas crean tonalidad ambigua.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica la división simétrica de la octava descrita.',
      hintTemplate:
        'Divisiones iguales: tritono (2 notas, div. por 6), tríada aumentada (3 notas, div. por 4), dim7 (4 notas, div. por 3), tonos enteros (6 notas, div. por 2).',
      choiceSets: [
        [
          'Una tríada aumentada divide la octava en 3 terceras mayores iguales',
          'Una tríada aumentada divide la octava en 4 partes iguales',
          'Una tríada aumentada divide la octava en 2 partes iguales',
          'Una tríada aumentada no divide la octava igualmente',
        ],
        [
          'Existen solo 2 escalas de tonos enteros, cada una conteniendo 6 de las 12 alturas cromáticas',
          'Existen 12 escalas de tonos enteros',
          'Existe solo 1 escala de tonos enteros',
          'Existen 6 escalas de tonos enteros',
        ],
      ],
    },
  ],

  // ---- l6u20m3: Contrapunto Invertible Avanzado ----
  l6u20m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta pregunta sobre contrapunto invertible (doble).',
      hintTemplate:
        'El contrapunto invertible permite que dos voces intercambien posición (la superior se convierte en inferior y viceversa). A la octava: terceras se convierten en sextas, quintas se convierten en cuartas, etc.',
      choiceSets: [
        [
          'En el contrapunto invertible a la octava, una tercera se convierte en una sexta cuando las voces se intercambian',
          'Una tercera sigue siendo tercera cuando las voces se intercambian',
          'Una tercera se convierte en una quinta cuando las voces se intercambian',
          'Los intervalos no cambian cuando las voces se intercambian',
        ],
        [
          'Las quintas perfectas deben evitarse en el contrapunto invertible a la octava porque se convierten en cuartas',
          'Las quintas perfectas son los mejores intervalos para el contrapunto invertible',
          'Las quintas siguen siendo quintas cuando se invierten a la octava',
          'No hay restricciones de intervalos en el contrapunto invertible',
        ],
        [
          'Contrapunto invertible a la décima: una tercera se convierte en octava, una sexta se convierte en quinta',
          'A la décima, todos los intervalos permanecen inalterados',
          'El contrapunto invertible solo funciona a la octava',
          'A la décima, una tercera se convierte en quinta',
        ],
      ],
    },
  ],

  // ---- l6u20m4: Contrapunto Triple y Cuádruple ----
  l6u20m4: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta pregunta sobre contrapunto triple y cuádruple.',
      hintTemplate:
        'Contrapunto triple: 3 voces que pueden aparecer en cualquier permutación (6 disposiciones). Cuádruple: 4 voces, 24 disposiciones posibles. Bach fue el maestro supremo.',
      choiceSets: [
        [
          'El contrapunto triple permite que 3 voces se reorganicen en cualquiera de las 6 permutaciones',
          'El contrapunto triple tiene solo 3 disposiciones posibles',
          'El contrapunto triple significa 3 fugas separadas',
          'El contrapunto triple tiene 12 permutaciones',
        ],
        [
          'El contrapunto cuádruple con 4 voces produce 24 disposiciones posibles',
          'El contrapunto cuádruple tiene 4 disposiciones',
          'El contrapunto cuádruple tiene 12 disposiciones',
          'El contrapunto cuádruple es imposible de escribir',
        ],
        [
          'Escribir contrapunto triple/cuádruple requiere que cada par de voces funcione en contrapunto invertible',
          'Solo las voces extremas necesitan ser invertibles',
          'No se aplican restricciones especiales de conducción de voces',
          'Las quintas paralelas son aceptables en el contrapunto triple',
        ],
      ],
    },
  ],
};

export default overlay;
