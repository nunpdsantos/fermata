import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish translations for Level 4 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidad 12: Notas Extrañas al Acorde y Séptima de Dominante
  // =========================================================================

  // ---- l4u12m1: Retardos ----

  l4u12m1e1: {
    prompt: '¿Qué es un retardo 4-3?',
    choices: [
      'La 4.ª por encima del bajo se mantiene del acorde anterior y resuelve bajando a la 3.ª',
      'La 3.ª se eleva a la 4.ª y permanece ahí',
      'Un acorde que alterna entre el 4.º y el 3.er grado',
      'El bajo se mueve del 4.º grado al 3.er grado de la escala',
    ],
    hint: 'En un retardo 4-3, la 4.ª por encima del bajo es una disonancia transportada (suspendida) del acorde anterior. Después resuelve por grado conjunto descendente hacia la 3.ª consonante.',
  },
  l4u12m1e2: {
    prompt: '¿Cuáles son las tres fases de un retardo?',
    choices: [
      'Preparación, retardo, resolución',
      'Tensión, clímax, liberación',
      'Aproximación, llegada, partida',
      'Anticipación, suspensión, demora',
    ],
    hint: 'Un retardo tiene tres etapas: preparación (la nota es consonante en el acorde anterior), retardo (la nota se mantiene mientras la armonía cambia, creando disonancia) y resolución (se mueve por grado conjunto hacia una consonancia).',
  },
  l4u12m1e3: {
    prompt:
      'En la tonalidad de Do mayor, suena un acorde V y la nota F se mantiene del acorde IV anterior antes de resolver a E. ¿Qué tipo de nota extraña al acorde es el F?',
    choices: [
      'Retardo (4-3 sobre el acorde V)',
      'Nota de paso',
      'Apoyatura',
      'Escapatoria',
    ],
    hint: 'El F era consonante en el acorde IV (F-A-C), luego se mantuvo sobre el acorde V (G-B-D) donde es disonante (una 4.ª por encima del bajo G), y resuelve bajando por grado conjunto a E (la 3.ª). Este es un retardo 4-3 ejemplar.',
  },

  // ---- l4u12m2: Apoyatura / Escapatoria ----

  l4u12m2e1: {
    prompt: '¿Cómo aborda una apoyatura su nota disonante?',
    choices: [
      'Por salto — llega a la disonancia sin preparación por grado conjunto',
      'Por grado conjunto descendente únicamente',
      'Manteniéndose del acorde anterior',
      'Por semitono cromático',
    ],
    hint: 'Una apoyatura es una nota extraña acentuada abordada por salto y resuelta por grado conjunto en la dirección opuesta. A diferencia de un retardo, no tiene preparación — salta directamente a la disonancia.',
  },
  l4u12m2e2: {
    prompt: '¿En qué se diferencia una escapatoria de una nota de paso?',
    choices: [
      'Una escapatoria se aborda por grado conjunto pero parte por salto en la dirección opuesta',
      'Una escapatoria se aborda por salto y parte por grado conjunto',
      'Una escapatoria se produce en un tiempo fuerte mientras que una nota de paso se produce en un tiempo débil',
      'No hay diferencia; son lo mismo',
    ],
    hint: 'Una escapatoria (échappée) se mueve por grado conjunto desde una nota del acorde, luego salta en la dirección opuesta hacia la nota del acorde siguiente. Una nota de paso se mueve por grado conjunto en la misma dirección a lo largo de todo el recorrido.',
  },
  l4u12m2e3: {
    prompt: '¿En qué dirección resuelve una suspensión ascendente?',
    choices: [
      'Hacia arriba por grado conjunto — es un retardo que resuelve hacia arriba en lugar de hacia abajo',
      'Hacia abajo por grado conjunto, como un retardo estándar',
      'Hacia abajo por salto',
      'No resuelve; permanece disonante',
    ],
    hint: 'Una suspensión ascendente es esencialmente un retardo que resuelve por grado conjunto ascendente en lugar de descendente. El ejemplo más común es 7-8, donde la 7.ª por encima del bajo resuelve hacia arriba hasta la octava.',
  },

  // ---- l4u12m3: Pedal ----

  l4u12m3e1: {
    prompt: '¿Qué es un pedal?',
    choices: [
      'Una nota sostenida o repetida que se mantiene a través de armonías cambiantes por encima de ella',
      'Una nota extraña al acorde que se mueve por grado conjunto entre dos notas del acorde',
      'Un acorde mantenido durante una frase entera',
      'La nota más grave de cualquier disposición de acorde',
    ],
    hint: 'Un pedal (o nota pedal) es una nota única — generalmente la tónica o la dominante — sostenida en una voz mientras las demás voces se mueven por armonías que pueden ser disonantes contra ella. El nombre proviene del pedal del órgano que mantiene notas en el bajo.',
  },
  l4u12m3e2: {
    prompt:
      '¿Qué es una «nota cambiata» (también llamada grupo de bordaduras o doble bordadura)?',
    choices: [
      'Dos notas extrañas al acorde que se aproximan a una nota del acorde tanto por encima como por debajo en sucesión',
      'Una nota del acorde que cambia a una nota del acorde diferente',
      'Una modulación de una tonalidad a otra',
      'Una alteración accidental que cambia la cualidad de un acorde',
    ],
    hint: 'Una nota cambiata (grupo de bordaduras) decora una nota del acorde moviéndose a la bordadura superior, luego a la bordadura inferior (o viceversa) antes de regresar. Por ejemplo: C-D-B-C ornamenta la nota C.',
  },
  l4u12m3e3: {
    prompt: '¿Dónde se encuentra un pedal con mayor frecuencia?',
    choices: [
      'En la voz del bajo, generalmente en la tónica o la dominante',
      'Exclusivamente en la voz del soprano',
      'Solo entre las dos voces interiores',
      'Alternando entre la voz más aguda y la más grave',
    ],
    hint: 'Aunque los pedales pueden aparecer en cualquier voz (un «pedal invertido» está en el soprano, un «pedal interno» está en una voz intermedia), la ubicación más común es en el bajo en los grados 1 (pedal de tónica) o 5 (pedal de dominante).',
  },

  // ---- l4u12m4: Reglas de Resolución del V7 ----

  l4u12m4e1: {
    prompt:
      'Construye un acorde V7 en la tonalidad de Do mayor. Es G séptima de dominante: G-B-D-F. Selecciona las 4 notas.',
    hint: 'G7 = G, B, D, F. Fundamental (G) + 3.ª mayor (B) + 5.ª justa (D) + 7.ª menor (F). El tritono entre B y F impulsa la resolución hacia Do mayor.',
  },
  l4u12m4e2: {
    prompt:
      'Construye un acorde V7 en la tonalidad de Sol mayor. Es D séptima de dominante: D-F#-A-C. Selecciona las 4 notas.',
    hint: 'D7 = D, F#, A, C. Fundamental (D) + 3.ª mayor (F#) + 5.ª justa (A) + 7.ª menor (C). El tritono entre F# y C resuelve hacia Sol mayor.',
  },
  l4u12m4e3: {
    prompt: '¿Cómo resuelve el tritono dentro de V7 al moverse hacia I?',
    choices: [
      'La sensible (3.ª de V7) resuelve por semitono ascendente hacia la tónica; la 7.ª de V7 resuelve por semitono descendente',
      'Ambas notas del tritono resuelven por grado conjunto ascendente',
      'El tritono se expande hasta una octava',
      'Ambas notas del tritono descienden por tono',
    ],
    hint: 'En G7 resolviendo a Do: B (sensible, 3.ª de V7) resuelve hacia arriba a C; F (7.ª de V7) resuelve hacia abajo a E. El tritono B-F se contrae hacia dentro a C-E. Este movimiento contrario es el motor de la resolución tonal.',
  },

  // ---- l4u12m5: Inversiones de V7 ----

  l4u12m5e1: {
    prompt: '¿Qué símbolo de bajo cifrado representa V6/5 (V7 en primera inversión)?',
    choices: [
      '6/5 — la 3.ª del acorde está en el bajo',
      '4/3 — la 5.ª del acorde está en el bajo',
      '4/2 — la 7.ª del acorde está en el bajo',
      '7 — la fundamental está en el bajo',
    ],
    hint: 'V6/5 significa que la 3.ª de V7 es la nota del bajo. En Do mayor, eso significa que B es la nota más grave de G7. Los números 6 y 5 describen los intervalos por encima del bajo (B a G = 6.ª, B a F = 5.ª).',
  },
  l4u12m5e2: {
    prompt: 'V4/3 (V7 en segunda inversión) resuelve típicamente a qué acorde?',
    choices: [
      'I (o I6) — el bajo (5.ª de V7) desciende por grado conjunto hasta la fundamental o 3.ª de I',
      'IV — el bajo salta a la subdominante',
      'vi — el bajo se mueve a la submediante',
      'No resuelve; es un acorde estable',
    ],
    hint: 'V4/3 tiene la 5.ª de V7 en el bajo (D en G7/D en Do mayor). El D resuelve típicamente por grado conjunto — desciende a C (fundamental de I) o asciende a E (dando I6). El tritono B-F sigue resolviendo como de costumbre.',
  },
  l4u12m5e3: {
    prompt: 'En V4/2 (V7 en tercera inversión), ¿qué nota del acorde está en el bajo?',
    choices: [
      'La 7.ª del acorde',
      'La fundamental del acorde',
      'La 3.ª del acorde',
      'La 5.ª del acorde',
    ],
    hint: 'V4/2 (también escrito V2) coloca la 7.ª de V7 en el bajo. En Do mayor, eso significa que F es la nota del bajo de G7. El F resuelve por grado conjunto descendente a E, produciendo I6 (Do mayor en primera inversión).',
  },

  // =========================================================================
  // Unidad 13: Acordes de Séptima Diatónicos, Función, Secuencias
  // =========================================================================

  // ---- l4u13m1: Séptimas Predominantes ----

  l4u13m1e1: {
    prompt:
      'Construye un acorde ii7 en Do mayor. Es D séptima menor: D-F-A-C. Selecciona las 4 notas.',
    hint: 'Dm7 = D, F, A, C. Fundamental (D) + 3.ª menor (F) + 5.ª justa (A) + 7.ª menor (C). Este es el acorde de séptima predominante más habitual en tonalidades mayores.',
  },
  l4u13m1e2: {
    prompt:
      'Construye un acorde iiø7 en Do menor. Es D séptima semidisminuida: D-F-Ab-C. Selecciona las 4 notas.',
    hint: 'Dø7 = D, F, Ab, C. Fundamental (D) + 3.ª menor (F) + 5.ª disminuida (Ab) + 7.ª menor (C). En tonalidades menores, el acorde ii es semidisminuido porque la 5.ª (Ab) es descendida.',
  },
  l4u13m1e3: {
    prompt: '¿Por qué se considera que el acorde ii7 es un predominante?',
    choices: [
      'Progresa con mayor frecuencia hacia V o V7, preparando la armonía dominante',
      'Resuelve directamente al acorde I de tónica',
      'Sustituye la función dominante por completo',
      'Aparece solo antes del acorde IV',
    ],
    hint: 'En el modelo funcional estándar T-PD-D-T, ii (y ii7) desempeña una función predominante. Crea impulso armónico hacia V, que luego resuelve a I. La progresión ii-V-I es fundamental tanto en el clásico como en el jazz.',
  },

  // ---- l4u13m2: Séptimas de la Mediante / Submediante ----

  l4u13m2e1: {
    prompt: 'En una tonalidad mayor, ¿cuál es la cualidad del acorde iii7?',
    choices: [
      'Séptima menor — construido sobre la mediante con una tríada menor y 7.ª menor',
      'Séptima mayor — construido con una tríada mayor y 7.ª mayor',
      'Séptima de dominante — una tríada mayor con 7.ª menor',
      'Séptima semidisminuida — una tríada disminuida con 7.ª menor',
    ],
    hint: 'En Do mayor, iii7 = E-G-B-D. La tríada E-G-B es menor, y E a D es una 7.ª menor (10 semitonos). Por tanto, iii7 es un acorde de séptima menor, al igual que ii7 y vi7.',
  },
  l4u13m2e2: {
    prompt: 'En una tonalidad mayor, ¿cuál es la cualidad del acorde vi7?',
    choices: [
      'Séptima menor — una tríada menor más una 7.ª menor por encima de la fundamental',
      'Séptima mayor — una tríada mayor más una 7.ª mayor por encima de la fundamental',
      'Séptima de dominante — una tríada mayor más una 7.ª menor por encima de la fundamental',
      'Séptima disminuida — una tríada disminuida más una 7.ª disminuida',
    ],
    hint: 'En Do mayor, vi7 = A-C-E-G. La tríada A-C-E es menor, y A a G es una 7.ª menor (10 semitonos). Al igual que ii7 y iii7, vi7 es un acorde de séptima menor.',
  },
  l4u13m2e3: {
    prompt:
      '¿Cuál es la cualidad del acorde Imaj7 en una tonalidad mayor, y dónde se usa comúnmente?',
    choices: [
      'Séptima mayor — utilizado frecuentemente como acorde de tónica con color en el jazz y el pop',
      'Séptima de dominante — resuelve siempre a IV',
      'Séptima menor — usado solo en tonalidades menores',
      'Séptima semidisminuida — crea fuerte disonancia en reposo',
    ],
    hint: 'En Do mayor, Imaj7 = C-E-G-B. La 7.ª mayor (B) añade calidez y color a la tríada de tónica sin comprometer su estabilidad. Es una sonoridad básica en el jazz, la bossa nova y muchos estilos pop.',
  },

  // ---- l4u13m3: Séptimas de la Sensible ----

  l4u13m3e1: {
    prompt:
      'Construye un acorde de séptima disminuida sobre B (viiº7 en Do menor): B-D-F-Ab. Selecciona las 4 notas.',
    hint: 'Bº7 = B, D, F, Ab. Fundamental (B) + 3.ª menor (D) + 5.ª disminuida (F) + 7.ª disminuida (Ab). Los tres intervalos superiores son 3.as menores apiladas (3+3+3 semitonos).',
  },
  l4u13m3e2: {
    prompt:
      'Construye un acorde de séptima semidisminuida sobre B (viiø7 en Do mayor): B-D-F-A. Selecciona las 4 notas.',
    hint: 'Bø7 = B, D, F, A. Fundamental (B) + 3.ª menor (D) + 5.ª disminuida (F) + 7.ª menor (A). A diferencia del séptima disminuida, el intervalo superior es una 3.ª mayor (F a A), haciendo que la 7.ª sea menor en lugar de disminuida.',
  },
  l4u13m3e3: {
    prompt:
      '¿Cuál es la diferencia fundamental entre un acorde de séptima disminuida y uno semidisminuido?',
    choices: [
      'El disminuido tiene una 7.ª disminuida (9 semitonos); el semidisminuido tiene una 7.ª menor (10 semitonos)',
      'El disminuido usa una tríada menor; el semidisminuido usa una tríada mayor',
      'El disminuido tiene una 5.ª justa; el semidisminuido tiene una 5.ª disminuida',
      'Son el mismo acorde con nombres diferentes',
    ],
    hint: 'Ambos acordes comparten una tríada disminuida (3.ª menor + 5.ª disminuida). La diferencia está en la 7.ª: totalmente disminuido = 7.ª disminuida (enarmónicamente 6.ª mayor, 9 semitonos); semidisminuido = 7.ª menor (10 semitonos).',
  },

  // ---- l4u13m4: Función Armónica T-PD-D-T ----

  l4u13m4e1: {
    prompt:
      'En el modelo funcional T-PD-D-T, ¿qué función armónica desempeña el acorde ii?',
    choices: [
      'Predominante (PD) — prepara la dominante',
      'Tónica (T) — sustituye a I',
      'Dominante (D) — resuelve a I',
      'No tiene función estándar',
    ],
    hint: 'El acorde ii (junto con IV) es la armonía predominante principal. En el ciclo funcional T-PD-D-T, los predominantes hacen de puente entre la estabilidad de la tónica y la tensión dominante: I → ii → V → I.',
  },
  l4u13m4e2: {
    prompt: '¿Cuál es el orden estándar de las funciones armónicas en una frase tonal?',
    choices: [
      'Tónica → Predominante → Dominante → Tónica',
      'Dominante → Tónica → Predominante → Dominante',
      'Predominante → Dominante → Tónica → Predominante',
      'Tónica → Dominante → Predominante → Tónica',
    ],
    hint: 'La progresión funcional normativa es T-PD-D-T. La música comienza en reposo (tónica), acumula tensión a través de predominante y dominante, y luego regresa al reposo. Saltar etapas es posible (T-D-T), pero invertir el orden (D antes de PD) es raro en la práctica común.',
  },
  l4u13m4e3: {
    prompt:
      '¿Qué acorde puede sustituir a IV como predominante en una tonalidad mayor?',
    choices: [
      'ii — ambos comparten dos notas comunes y desempeñan la misma función predominante',
      'V — porque está próximo a IV en el ciclo de quintas',
      'iii — porque es adyacente a IV por grado conjunto',
      'viiº — porque contiene la sensible',
    ],
    hint: 'En Do mayor, IV = F-A-C y ii = D-F-A. Comparten F y A (dos notas comunes) y ambos crean impulso predominante hacia V. El acorde ii se prefiere con frecuencia en la escritura a cuatro voces porque ii-V presenta un movimiento de bajo suave por 5.ª.',
  },

  // ---- l4u13m5: Secuencias Armónicas ----

  l4u13m5e1: {
    prompt: '¿Cuál es la secuencia armónica diatónica más común?',
    choices: [
      'Quintas descendentes — cada fundamental desciende una 5.ª (o asciende una 4.ª): ej. I-IV-viiº-iii-vi-ii-V-I',
      'Quintas ascendentes — cada fundamental asciende una 5.ª',
      'Terceras descendentes — cada fundamental desciende una 3.ª',
      'Descenso cromático — cada fundamental desciende un semitono',
    ],
    hint: 'La secuencia de quintas descendentes (o ciclo de quintas) mueve cada fundamental una 5.ª abajo diatónicamente. En Do mayor: C-F-B-E-A-D-G-C (I-IV-viiº-iii-vi-ii-V-I). Esta es la columna vertebral de innumerables progresiones en la música occidental.',
  },
  l4u13m5e2: {
    prompt:
      'En una secuencia basada en segundas ascendentes, ¿cuál es el patrón de movimiento de las fundamentales?',
    choices: [
      'Cada fundamental asciende una 2.ª diatónica: ej. I-ii-iii-IV',
      'Cada fundamental desciende una 2.ª: ej. I-viiº-vi-V',
      'Las fundamentales alternan entre 2.as ascendentes y descendentes',
      'Las fundamentales se mueven por 3.as pero suenan como 2.as',
    ],
    hint: 'Una secuencia de segundas ascendentes mueve cada fundamental por grado conjunto ascendente a lo largo de la escala. Aunque menos común que las quintas descendentes, crea un fuerte sentido de movimiento hacia adelante. Se combina frecuentemente con inversiones alternadas para suavizar la conducción de voces.',
  },
  l4u13m5e3: {
    prompt: '¿Qué define una secuencia armónica?',
    choices: [
      'Un patrón de progresiones de acordes repetido en niveles de altura sucesivos dentro de la tonalidad',
      'Un único acorde repetido varias veces',
      'Una melodía tocada en octavas diferentes',
      'Una serie de modulaciones a tonalidades lejanas',
    ],
    hint: 'Una secuencia armónica toma un patrón corto de acordes (el modelo) y lo repite en diferentes niveles de altura diatónicos. Los intervalos entre fundamentales se mantienen consistentes, aunque su cualidad exacta puede cambiar para permanecer dentro de la tonalidad.',
  },

  // =========================================================================
  // Unidad 14: Contrapunto, Compás, Análisis, Armonía Menor
  // =========================================================================

  // ---- l4u14m1: Contrapunto de Primera / Segunda Especie ----

  l4u14m1e1: {
    prompt:
      'En el contrapunto de primera especie, ¿cuál es la regla fundamental?',
    choices: [
      'Nota contra nota — cada nota en el contrapunto se alinea con una nota en el cantus firmus, usando solo consonancias',
      'Dos notas contra una — el contrapunto se mueve al doble de velocidad del cantus firmus',
      'Ritmo libre — cualquier ritmo puede usarse contra el cantus firmus',
      'Solo unísonos y octavas están permitidos entre las voces',
    ],
    hint: 'La primera especie (1:1) es el contrapunto más simple: una nota en la voz añadida por cada nota del cantus firmus. Cada intervalo vertical debe ser consonante (3.as, 5.as, 6.as, octavas, unísonos). No se permite ninguna disonancia.',
  },
  l4u14m1e2: {
    prompt:
      '¿Qué intervalos se consideran consonantes en el contrapunto de especies?',
    choices: [
      'Unísonos, 3.as, 5.as, 6.as y octavas',
      'Solo intervalos justos: unísonos, 4.as, 5.as, octavas',
      'Todos los intervalos excepto el tritono',
      '2.as, 4.as, 7.as y tritonos',
    ],
    hint: 'En el contrapunto a dos voces, las consonancias son: consonancias perfectas (unísono, P5, P8) y consonancias imperfectas (m3, M3, m6, M6). La 4.ª justa se trata como disonancia en el contrapunto a dos voces. Segundas, 7.as y tritonos son disonantes.',
  },
  l4u14m1e3: {
    prompt:
      'En el contrapunto de segunda especie, ¿cómo se tratan las disonancias (como notas de paso)?',
    choices: [
      'Las disonancias pueden aparecer solo en tiempos débiles, abordadas y abandonadas por grado conjunto en la misma dirección',
      'Las disonancias pueden aparecer en cualquier tiempo siempre que resuelvan',
      'No se permite ninguna disonancia en la segunda especie',
      'Las disonancias deben aparecer en tiempos fuertes y resolver en tiempos débiles',
    ],
    hint: 'La segunda especie (2:1) tiene dos notas contra cada nota del cantus firmus. Los tiempos fuertes deben ser consonantes. Los tiempos débiles pueden incluir notas de paso — disonancias por grado conjunto que conectan dos consonancias. Esto introduce disonancia controlada.',
  },

  // ---- l4u14m2: Compases Asimétricos ----

  l4u14m2e1: {
    prompt: '¿Cómo se agrupa típicamente el compás 5/4?',
    choices: [
      'Como 3+2 o 2+3 — un agrupamiento asimétrico de tiempos de negra',
      'Como 5 tiempos iguales sin agrupamiento interno',
      'Como 4+1, tratándolo como 4/4 con un tiempo extra',
      'Como 2,5+2,5, dividiendo igualmente por la mitad',
    ],
    hint: '5/4 es un compás asimétrico (o irregular). No puede dividirse en grupos iguales, así que se divide como 3+2 o 2+3. La elección del agrupamiento afecta el patrón de acentos y el carácter rítmico.',
  },
  l4u14m2e2: {
    prompt: '¿Cómo funciona el compás 7/8 como compás aditivo?',
    choices: [
      'Combina grupos desiguales de corcheas (ej. 2+2+3, 3+2+2 o 2+3+2)',
      'Tiene 7 tiempos iguales como un compás simple estándar',
      'Es un compás compuesto con tiempos de negra con puntillo',
      'Alterna entre 3/8 y 4/8 en cada compás',
    ],
    hint: '7/8 es un compás aditivo: 7 corcheas se agrupan en subtiempos desiguales. Agrupamientos comunes son 2+2+3 (corto-corto-largo), 3+2+2 (largo-corto-corto) o 2+3+2. El grupo largo suena como un tiempo ligeramente estirado.',
  },
  l4u14m2e3: {
    prompt:
      '¿Qué significa la indicación de compás «tiempo cortado» (alla breve, C con una línea vertical)?',
    choices: [
      '2/2 — dos tiempos de blanca por compás, sentido en dos en lugar de cuatro',
      '4/4 tocado al doble de velocidad',
      '2/4 con el tempo cortado a la mitad',
      'Cualquier indicación de compás donde los valores de las notas se reducen a la mitad',
    ],
    hint: 'El tiempo cortado (alla breve) es 2/2: dos tiempos de blanca por compás. Un compás de 2/2 tiene la misma duración total que uno de 4/4, pero se cuenta en 2 (tiempo de blanca) en lugar de 4 (tiempo de negra) — las mismas notas sentidas en dos tiempos, dando un pulso más amplio y fluido.',
  },

  // ---- l4u14m3: Ornamentación Cromática ----

  l4u14m3e1: {
    prompt: '¿Qué es una nota de paso cromática?',
    choices: [
      'Una nota extraña al acorde que rellena un tono con un semitono cromático, moviéndose por semitono entre dos notas del acorde',
      'Cualquier alteración accidental que aparece en la melodía',
      'Una nota que salta cromáticamente de una nota del acorde a otra',
      'Una nota de paso que cambia la tonalidad del pasaje',
    ],
    hint: 'Una nota de paso cromática rellena el intervalo entre dos notas del acorde que están a un tono de distancia. Por ejemplo, entre C y D, un C# como nota de paso cromática crea movimiento suave por semitono: C-C#-D.',
  },
  l4u14m3e2: {
    prompt: '¿Qué es una bordadura cromática?',
    choices: [
      'Una nota extraña al acorde a medio tono por encima o por debajo de una nota del acorde, regresando a la misma nota del acorde',
      'Una bordadura que modula a una nueva tonalidad',
      'Un sonido prestado de la tonalidad paralela',
      'Cualquier bordadura en un pasaje de escala cromática',
    ],
    hint: 'Una bordadura cromática es un ornamento que se mueve por semitono desde una nota del acorde y regresa: ej. E-Eb-E o G-G#-G. Añade color sin alterar la dirección armónica, funcionando como decoración de superficie.',
  },
  l4u14m3e3: {
    prompt:
      '¿Cómo se distingue una ornamentación cromática de una nota cromática estructural (como una sensible secundaria)?',
    choices: [
      'Las ornamentaciones son notas extrañas al acorde que decoran; las notas cromáticas estructurales alteran la armonía o tonicizan un nuevo acorde',
      'No hay diferencia; todas las notas cromáticas son ornamentaciones',
      'Las ornamentaciones duran más que las notas estructurales',
      'Las notas estructurales están siempre en el bajo mientras que las ornamentaciones están en las voces superiores',
    ],
    hint: 'Las ornamentaciones cromáticas (notas de paso, bordaduras) son decoraciones de superficie que no afectan la armonía subyacente. Las notas cromáticas estructurales (como sensibles aplicadas o acordes prestados) alteran efectivamente el acorde o tonicizan brevemente una tonalidad diferente.',
  },

  // ---- l4u14m4: Análisis con Números Romanos ----

  l4u14m4e1: {
    prompt:
      'En la tonalidad de Do mayor, un acorde contiene las notas F, A y C. ¿Cuál es su análisis con números romanos?',
    choices: [
      'IV — tríada de Fa mayor construida sobre el 4.º grado de la escala',
      'ii — tríada de Re menor en primera inversión',
      'vi — tríada de La menor en primera inversión',
      'I6/4 — Do mayor en segunda inversión',
    ],
    hint: 'F-A-C en estado fundamental es una tríada de Fa mayor. En Do mayor, Fa es el 4.º grado de la escala. Una tríada mayor en el 4.º grado se nota con número romano mayúsculo: IV.',
  },
  l4u14m4e2: {
    prompt:
      'En el análisis con números romanos, ¿qué indican los números mayúsculos y minúsculos?',
    choices: [
      'Mayúscula = tríada mayor; minúscula = tríada menor',
      'Mayúscula = estado fundamental; minúscula = invertido',
      'Mayúscula = acorde diatónico; minúscula = acorde cromático',
      'Mayúscula = función fuerte; minúscula = función débil',
    ],
    hint: 'El análisis con números romanos codifica tanto el grado de la escala como la cualidad del acorde. Mayúscula (I, IV, V) = tríadas mayores. Minúscula (ii, iii, vi) = tríadas menores. Un º en superíndice marca disminuido (viiº), y + marca aumentado.',
  },
  l4u14m4e3: {
    prompt:
      '¿Qué indican los números tras un número romano (bajo cifrado)?',
    choices: [
      'Los intervalos por encima de la nota del bajo, revelando la inversión del acorde',
      'Los grados de la escala de las notas del acorde',
      'El número de voces que tocan el acorde',
      'La duración del acorde en tiempos',
    ],
    hint: 'Los números del bajo cifrado muestran intervalos por encima de la nota más grave que suena. Sin números (o 5/3) = estado fundamental. 6 (o 6/3) = primera inversión. 6/4 = segunda inversión. Para acordes de séptima: 7, 6/5, 4/3, 4/2 indican del estado fundamental a la tercera inversión.',
  },

  // ---- l4u14m5: Armonía en Modo Menor ----

  l4u14m5e1: {
    prompt:
      'Construye el acorde III en La menor (menor natural). Es Do mayor: C-E-G. Selecciona las 3 notas.',
    hint: 'En La menor natural (A-B-C-D-E-F-G), la tríada sobre el 3.er grado es C-E-G, una tríada mayor. Este es III — la relativa mayor. Es uno de los acordes característicos de la armonía en modo menor.',
  },
  l4u14m5e2: {
    prompt:
      'Construye el acorde VII en La menor (menor natural). Es Sol mayor: G-B-D. Selecciona las 3 notas.',
    hint: 'En La menor natural, la tríada sobre el 7.º grado es G-B-D, una tríada mayor. VII (acorde subtónico) está a un tono por debajo de la tónica, a diferencia de viiº (acorde de la sensible) de la menor armónica.',
  },
  l4u14m5e3: {
    prompt:
      '¿Qué es el acorde subtónico VII en la menor natural, y cómo difiere de viiº en la menor armónica?',
    choices: [
      'VII es una tríada mayor a un tono por debajo de la tónica; viiº es una tríada disminuida a medio tono por debajo — solo viiº tiene función dominante',
      'VII y viiº son el mismo acorde con nombres diferentes',
      'VII es disminuido y viiº es mayor',
      'Ambos tienen función dominante pero VII es más fuerte',
    ],
    hint: 'En La menor natural, VII = Sol mayor (G-B-D), a un tono por debajo de A. En La menor armónica, viiº = G#-B-D (disminuido), a medio tono por debajo de A. El 7.º grado elevado (G#) crea la sensible que confiere a viiº su fuerte atracción hacia la tónica.',
  },
};

export default overlay;
