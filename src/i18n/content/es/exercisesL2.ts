import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish translations for Level 2 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidad 4: Todas las Tonalidades Mayores y Grados de la Escala
  // =========================================================================

  // ---- l2u4m1: Todas las Tonalidades Mayores / Círculo de Quintas ----

  l2u4m1e1: {
    prompt: '¿Cuál es el orden de los sostenidos tal como aparecen en las armaduras de clave?',
    choices: [
      'F C G D A E B',
      'B E A D G C F',
      'C G D A E B F',
      'F B E A D G C',
    ],
    hint: 'Recuerda: los sostenidos se acumulan en este orden fijo: F-C-G-D-A-E-B.',
    nudge: 'Cada nuevo sostenido está una 5.ª justa por encima del anterior. Empieza por el único sostenido de la armadura de clave de G mayor y sigue subiendo por 5.as.',
  },
  l2u4m1e2: {
    prompt: '¿Cuál es el orden de los bemoles tal como aparecen en las armaduras de clave?',
    choices: [
      'B E A D G C F',
      'F C G D A E B',
      'C F B E A D G',
      'E B A D G C F',
    ],
    hint: 'El orden de los bemoles es el inverso de los sostenidos: B-E-A-D-G-C-F.',
    nudge: 'Cada nuevo bemol está una 4.ª justa por encima (una 5.ª por debajo) del anterior. Empieza por el único bemol de la armadura de clave de F mayor y sigue.',
  },
  l2u4m1e3: {
    prompt: 'Construye la escala de D mayor. Selecciona las 7 notas en el instrumento. Recuerda: D mayor tiene 2 sostenidos.',
    hint: 'D mayor: D, E, F#, G, A, B, C#. Los dos sostenidos son F# y C#, siguiendo el orden de los sostenidos.',
  },
  l2u4m1e4: {
    prompt: '¿Cuántos sostenidos tiene la tonalidad de A mayor?',
    choices: [
      '3 sostenidos (F#, C#, G#)',
      '2 sostenidos (F#, C#)',
      '4 sostenidos (F#, C#, G#, D#)',
      '1 sostenido (F#)',
    ],
    hint: 'La tonalidad de A mayor está tres pasos en el sentido de las agujas del reloj en el círculo de quintas desde C: G (1#), D (2#), A (3#). Los sostenidos son F#, C#, G#.',
  },

  // ---- l2u4m2: Nombres de los Grados de la Escala ----

  l2u4m2e1: {
    prompt: '¿Cuál es el nombre del 5.º grado de cualquier escala mayor?',
    choices: [
      'Dominante',
      'Subdominante',
      'Mediante',
      'Supertónica',
    ],
    hint: 'El 5.º grado se llama dominante porque es la segunda nota más importante después de la tónica, dominando la tonalidad.',
    nudge: 'Piensa en su función: después de la tónica, es el grado más fuerte de la tonalidad, y su acorde es el que con más firmeza devuelve la música a casa.',
  },
  l2u4m2e2: {
    prompt: '¿Cómo se llama el 7.º grado de la escala mayor?',
    choices: [
      'Sensible',
      'Subtónica',
      'Dominante',
      'Supertónica',
    ],
    hint: 'En la escala mayor, el 7.º grado está a un semitono por debajo de la tónica. «Conduce» fuertemente hacia arriba, hacia la tónica, de ahí que se llame sensible.',
    nudge: 'En la escala mayor, el 7.º grado está solo un semitono por debajo de la tónica (no un tono), así que tira con fuerza hacia arriba, hacia ella.',
  },
  l2u4m2e3: {
    prompt: '¿Qué grado de la escala se llama subdominante?',
    choices: [
      '4.º grado',
      '5.º grado',
      '2.º grado',
      '6.º grado',
    ],
    hint: 'La subdominante es el 4.º grado. Se sitúa una 5.ª por debajo de la tónica (sub = debajo), igual que la dominante se sitúa una 5.ª por encima.',
    nudge: '«Sub» significa debajo: la subdominante está una 5.ª por debajo de la tónica, igual que la dominante está una 5.ª por encima. En C mayor, baja una 5.ª desde C y mira a qué grado llegas.',
  },

  // =========================================================================
  // Unidad 5: Escalas Menores y Relaciones entre Tonalidades
  // =========================================================================

  // ---- l2u5m1: Menor Natural ----

  l2u5m1e1: {
    prompt: 'Construye la escala de A menor natural. Selecciona las 7 notas. Esta escala usa solo teclas blancas.',
    hint: 'La escala de A menor natural: A, B, C, D, E, F, G. El patrón de intervalos es T-S-T-T-S-T-T. Sin sostenidos ni bemoles.',
  },
  l2u5m1e2: {
    prompt: 'Construye la escala de E menor natural. Selecciona las 7 notas. Una nota necesita sostenido.',
    hint: 'E menor natural: E, F#, G, A, B, C, D. El F# es necesario para mantener el patrón T-S-T-T-S-T-T.',
  },
  l2u5m1e3: {
    prompt: '¿Cuál es el patrón de intervalos de la escala menor natural?',
    choices: [
      'T-S-T-T-S-T-T',
      'T-T-S-T-T-T-S',
      'T-S-T-T-T-S-T',
      'S-T-T-S-T-T-T',
    ],
    hint: 'La escala menor natural tiene semitonos entre los grados 2-3 y 5-6. Compara con la mayor (T-T-S-T-T-T-S): el 3.er, 6.º y 7.º grados son descendidos.',
  },
  l2u5m1e4: {
    prompt: '¿Qué grados de la escala menor natural son descendidos con respecto a la escala mayor?',
    choices: [
      '3.º, 6.º y 7.º',
      '2.º, 3.º y 6.º',
      '3.º y 7.º solamente',
      '2.º, 5.º y 7.º',
    ],
    hint: 'Compara C mayor (C D E F G A B) con C menor natural (C D Eb F G Ab Bb). El 3.er, 6.º y 7.º grados son cada uno descendidos un semitono.',
    nudge: 'Compara C mayor con C menor natural, cuya armadura de clave tiene tres bemoles. Descubre en qué grados de la escala caen esos tres bemoles.',
  },

  // ---- l2u5m2: Menor Armónica/Melódica ----

  l2u5m2e1: {
    prompt: 'Construye la escala de A menor armónica. Selecciona las 7 notas. Con respecto a la menor natural, una nota se eleva.',
    hint: 'La escala de A menor armónica: A, B, C, D, E, F, G#. El 7.º grado (G) se eleva a G# para crear una sensible que conduce a A.',
  },
  l2u5m2e2: {
    prompt: 'Construye la escala de A menor melódica (forma ascendente). Dos notas se elevan con respecto a la menor natural.',
    hint: 'La escala de A menor melódica ascendente: A, B, C, D, E, F#, G#. Tanto el 6.º (F a F#) como el 7.º (G a G#) se elevan para suavizar la 2.ª aumentada.',
  },
  l2u5m2e3: {
    prompt: '¿Qué distingue la menor armónica de la escala menor natural?',
    choices: [
      'El 7.º grado se eleva un semitono',
      'El 6.º grado se eleva un semitono',
      'El 3.er grado se eleva un semitono',
      'El 2.º grado se desciende un semitono',
    ],
    hint: 'La escala menor armónica eleva el 7.º grado para crear una sensible (un semitono por debajo de la tónica). Esto es esencial para formar el acorde de dominante (V) en tonalidades menores.',
  },
  l2u5m2e4: {
    prompt: '¿Por qué la escala menor melódica eleva tanto el 6.º como el 7.º grado en la forma ascendente?',
    choices: [
      'Para eliminar la 2.ª aumentada entre el 6.º y el 7.º grado elevado de la menor armónica',
      'Para eliminar el semitono entre el 7.º grado elevado y la tónica',
      'Para convertir la escala en su paralela mayor al elevar los grados 6.º y 7.º',
      'Para sustituir la sensible por una nota un tono por debajo de la tónica',
    ],
    hint: 'El 7.º grado se eleva para crear una sensible un semitono por debajo de la tónica. La escala menor armónica tiene una 2.ª aumentada (3 semitonos) entre el 6.º y el 7.º grado elevado; elevar también el 6.º reduce esta distancia a un tono.',
    nudge: 'Toca la escala menor armónica en sentido ascendente y escucha el salto del 6.º al 7.º grado elevado. ¿Qué le pasa a ese salto cuando elevas también el 6.º?',
  },

  // ---- l2u5m3: Tonalidades Relativas/Paralelas ----

  l2u5m3e1: {
    prompt: '¿Cuál es la relativa menor de C mayor?',
    choices: [
      'A menor',
      'C menor',
      'E menor',
      'D menor',
    ],
    hint: 'La relativa menor comienza en el 6.º grado de la escala mayor. En C mayor, el 6.º grado es A. Tanto C mayor como A menor comparten la misma armadura de clave (sin sostenidos ni bemoles).',
    nudge: 'La relativa menor usa la misma armadura de clave y comienza en el 6.º grado de la escala mayor. Sube por la escala de C mayor para encontrarla.',
  },
  l2u5m3e2: {
    prompt: '¿Cuál es la relativa mayor de D menor?',
    choices: [
      'F mayor',
      'D mayor',
      'Bb mayor',
      'G mayor',
    ],
    hint: 'La relativa mayor comienza una 3.ª menor (3 semitonos) por encima de la tonalidad menor. D más 3 semitonos = F. Tanto D menor como F mayor comparten un bemol (Bb).',
    nudge: 'La relativa mayor comparte la armadura de clave y comienza una 3.ª menor (3 semitonos) por encima de la tónica de la tonalidad menor. Cuenta 3 semitonos hacia arriba desde D.',
  },
  l2u5m3e3: {
    prompt: '¿Cuál es la paralela menor de G mayor?',
    choices: [
      'G menor',
      'E menor',
      'A menor',
      'C menor',
    ],
    hint: 'Las tonalidades paralelas comparten la misma tónica pero difieren en el modo. La paralela menor de G mayor es G menor. Tienen armaduras de clave diferentes.',
    nudge: 'Las tonalidades paralelas mantienen la misma tónica y cambian solo la cualidad (y, con ella, la armadura de clave). No las confundas con las relativas, que comparten la armadura de clave.',
  },
  l2u5m3e4: {
    prompt: '¿Cuál es la diferencia entre tonalidades relativas y tonalidades paralelas?',
    choices: [
      'Las relativas comparten la misma armadura de clave; las paralelas comparten la misma tónica',
      'Las relativas comparten la misma tónica; las paralelas comparten la misma armadura de clave',
      'Las relativas comparten la misma tónica y armadura de clave; las paralelas no comparten ninguna',
      'Las relativas no comparten tónica ni armadura de clave; las paralelas comparten ambas',
    ],
    hint: 'C mayor y A menor son relativas (misma armadura de clave: sin sostenidos/bemoles). C mayor y C menor son paralelas (misma tónica: C).',
  },

  // =========================================================================
  // Unidad 6: Compás Compuesto y Síncopa
  // =========================================================================

  // ---- l2u6m1: Compás Compuesto ----

  l2u6m1e1: {
    prompt: 'En el compás 6/8, ¿cómo se organizan los tiempos?',
    choices: [
      '2 tiempos principales, agrupados en 3 + 3 corcheas',
      '6 tiempos principales, uno por cada corchea',
      '3 tiempos principales, agrupados en 2 + 2 + 2 corcheas',
      '2 tiempos principales, agrupados en 4 + 2 corcheas',
    ],
    hint: '6/8 es compás compuesto binario: 6 corcheas se agrupan en 2 grupos de 3. Cada grupo de 3 forma un tiempo principal, dando la sensación UN-dos-tres DOS-dos-tres.',
  },
  l2u6m1e2: {
    prompt: '¿Qué define el compás compuesto?',
    choices: [
      'Cada tiempo se divide en 3 partes iguales',
      'Cada tiempo se divide en 2 partes iguales',
      'Cada compás tiene exactamente 3 tiempos principales',
      'Cada indicación de compás tiene 8 como número inferior',
    ],
    hint: 'En el compás compuesto, la unidad de tiempo es una nota con puntillo que se subdivide en tres. En el compás simple, los tiempos se subdividen en dos.',
  },
  l2u6m1e3: {
    prompt: '¿Cuántos tiempos principales tiene el compás 9/8?',
    choices: [
      '3 tiempos principales',
      '9 tiempos principales',
      '4 tiempos principales',
      '2 tiempos principales',
    ],
    hint: '9/8 es compás compuesto ternario: 9 corcheas forman 3 grupos de 3. Cada grupo de 3 es un tiempo principal (una negra con puntillo).',
    nudge: '9/8 es un compás compuesto: las corcheas se agrupan de tres en tres, y cada grupo es un tiempo principal. ¿Cuántos grupos caben en nueve corcheas?',
  },

  // ---- l2u6m2: Síncopa ----

  l2u6m2e1: {
    prompt: '¿Qué es la síncopa?',
    choices: [
      'Colocar acentos en tiempos normalmente débiles o contratiempos',
      "Colocar acentos en tiempos normalmente fuertes o primeros tiempos",
      'Dividir tiempos en tresillos sin desplazar sus acentos',
      'Dividir tiempos en pares iguales sin desplazar sus acentos',
    ],
    hint: 'La síncopa perturba el patrón rítmico esperado al acentuar tiempos o partes de tiempos normalmente no acentuados, creando tensión rítmica y energía.',
  },
  l2u6m2e2: {
    prompt: '¿Qué son los tresillos?',
    choices: [
      '3 notas iguales en el tiempo que normalmente ocupan 2 del mismo valor',
      '3 notas iguales en el tiempo que normalmente ocupan 4 del mismo valor',
      '3 notas iguales en el tiempo que normalmente ocupan 6 del mismo valor',
      '3 notas iguales en el tiempo que normalmente ocupa 1 del mismo valor',
    ],
    hint: 'Los tresillos encajan 3 notas iguales en el tiempo que normalmente ocupan 2 del mismo valor. Un tresillo de corcheas encaja 3 corcheas en el espacio de una negra.',
  },

  // =========================================================================
  // Unidad 7: Intervalos, Tríadas y Armonía Diatónica
  // =========================================================================

  // ---- l2u7m1: Cualidad del Intervalo ----

  l2u7m1e1: {
    prompt: 'Identifica el intervalo de C ascendente hasta G. Este es uno de los intervalos más consonantes de la música.',
    hint: 'De C a G son 7 semitonos. Es una 5.ª justa — el intervalo que se encuentra en los power chords y la base del círculo de quintas.',
    nudge: 'Primero cuenta los nombres de las notas de C a G, incluidas ambas, para obtener el número. Después cuenta los semitonos de C a G y compáralos con los tamaños que puede tener ese número.',
  },
  l2u7m1e2: {
    prompt: 'Identifica el intervalo de C ascendente hasta Eb. Este intervalo da a los acordes menores su sonido característico.',
    hint: 'De C a Eb son 3 semitonos. Es una 3.ª menor — el intervalo que distingue los acordes menores de los mayores.',
    nudge: 'Cuenta los nombres de las notas de C a Eb para obtener el número. Después compara el Eb con la nota de la misma letra en la escala de C mayor: ¿es la misma nota o está un semitono más abajo, y qué efecto tiene eso en la cualidad?',
  },
  l2u7m1e3: {
    prompt: 'Identifica el intervalo de D ascendente hasta B. Cuenta tanto los nombres de las notas como los semitonos.',
    hint: 'De D a B abarca 6 nombres de notas (D-E-F-G-A-B) = una 6.ª. D a B son 9 semitonos, lo que la convierte en una 6.ª mayor.',
    nudge: 'Cuenta los nombres de las notas de D a B, incluidas ambas, para obtener el número. Después cuenta los semitonos de D a B y compáralos con los tamaños que puede tener ese número.',
  },
  l2u7m1e4: {
    prompt: '¿Qué hace que un intervalo sea «justo»?',
    choices: [
      'No tiene formas mayor/menor: solo justo, aumentado o disminuido',
      "No tiene formas aumentado/disminuido: solo justo, mayor o menor",
      'Aparece de la tónica a los grados 2, 3, 6 y 7 de una escala mayor',
      'Tiene formas mayores y menores, como las terceras y sextas',
    ],
    hint: 'Los unísonos, 4.as, 5.as y octavas son intervalos «justos». A diferencia de las 2.as, 3.as, 6.as y 7.as que tienen pares mayor/menor, los intervalos justos tienen solo una forma básica.',
  },
  l2u7m1e_ear1: {
    prompt: 'Escucha este intervalo e identifícalo.',
    hint: 'Este es uno de los intervalos más consonantes. Abarca 7 semitonos y es la base del círculo de quintas.',
  },
  l2u7m1e_ear2: {
    prompt: 'Escucha este intervalo e identifícalo.',
    hint: 'Este intervalo brillante y cálido abarca 4 semitonos y define el carácter de los acordes mayores.',
  },
  l2u7m1e_ear3: {
    prompt: 'Escucha este intervalo e identifícalo.',
    hint: 'Este intervalo abarca 5 semitonos. Es la inversión de la 5.ª justa.',
  },
  l2u7m1e_ear4: {
    prompt: 'Escucha este intervalo e identifícalo.',
    hint: 'Este intervalo más sombrío abarca 3 semitonos y da a los acordes menores su sonido característico.',
  },

  // ---- l2u7m2: Aumentados/Disminuidos/Compuestos ----

  l2u7m2e1: {
    prompt: 'Identifica el intervalo de C ascendente hasta F#. Este intervalo divide la octava exactamente por la mitad.',
    hint: 'De C a F# (o Gb) son 6 semitonos — exactamente la mitad de 12. Es el tritono, también llamado 4.ª aumentada o 5.ª disminuida.',
    nudge: 'Cuenta los semitonos de C a F#, tecla a tecla, y compara el total con los 12 semitonos de la octava. ¿Qué opción nombra el intervalo de exactamente ese tamaño?',
  },
  l2u7m2e2: {
    prompt: 'Identifica el intervalo de C ascendente hasta Db. Este es el menor intervalo con nombre propio.',
    hint: 'De C a Db es 1 semitono. Es una 2.ª menor — el menor intervalo en la música occidental estándar, creando tensión máxima.',
    nudge: 'Cuenta los nombres de las notas de C a Db para obtener el número. Después compara el Db con la nota de la misma letra en la escala de C mayor: ¿es la misma nota o está un semitono más abajo, y qué efecto tiene eso en la cualidad?',
  },
  l2u7m2e3: {
    prompt: 'Identifica el intervalo de C ascendente hasta B. Este intervalo amplio está a solo un semitono de una octava.',
    hint: 'De C a B son 11 semitonos. Es una 7.ª mayor — un intervalo amplio y disonante frecuentemente usado en acordes de jazz.',
    nudge: 'Cuenta los nombres de las notas de C a B, incluidas ambas, para obtener el número. Después cuenta los semitonos de C a B y compáralos con los tamaños que puede tener ese número.',
  },
  l2u7m2e4: {
    prompt: '¿Qué es un tritono?',
    choices: [
      'Un intervalo de 6 semitonos que divide la octava por la mitad',
      'Un intervalo de 4 semitonos que divide la octava en tres',
      'Un intervalo de 3 semitonos que divide la octava en cuatro',
      'Un intervalo de 2 semitonos que divide la octava en seis',
    ],
    hint: 'El tritono abarca 3 tonos (6 semitonos). Puede llamarse 4.ª aumentada o 5.ª disminuida.',
  },

  // ---- l2u7m3: Los Cuatro Tipos de Tríadas ----

  l2u7m3e1: {
    prompt: 'Construye una tríada de D menor. Selecciona las 3 notas: fundamental, 3.ª menor y 5.ª justa.',
    hint: 'D menor = D, F, A. Fundamental (D) + 3.ª menor (F, 3 semitonos por encima) + 5.ª justa (A, 7 semitonos por encima de la fundamental).',
  },
  l2u7m3e2: {
    prompt: 'Construye una tríada de B disminuida. Selecciona las 3 notas: fundamental, 3.ª menor y 5.ª disminuida.',
    hint: 'B disminuida = B, D, F. Fundamental (B) + 3.ª menor (D, 3 semitonos por encima) + 5.ª disminuida (F, 6 semitonos por encima de la fundamental). Ambos intervalos son 3.as menores apiladas.',
  },
  l2u7m3e3: {
    prompt: '¿Qué notas componen una tríada aumentada construida sobre C?',
    choices: [
      'C, E, G# — fundamental, 3.ª mayor, 5.ª aumentada',
      'C, Eb, G — fundamental, 3.ª menor, 5.ª justa',
      'C, E, G — fundamental, 3.ª mayor, 5.ª justa',
      'C, Eb, Gb — fundamental, 3.ª menor, 5.ª disminuida',
    ],
    hint: 'Una tríada aumentada apila dos 3.as mayores: C a E (4 semitonos) y E a G# (4 semitonos). La 5.ª es elevada (aumentada) con respecto a la tríada mayor.',
  },
  l2u7m3e4: {
    prompt: '¿Qué tipo de tríada tiene un tritono entre la fundamental y la 5.ª?',
    choices: [
      'Disminuida — dos 3.as menores superpuestas',
      'Menor — una 3.ª menor bajo una 3.ª mayor',
      'Mayor — una 3.ª mayor bajo una 3.ª menor',
      'Aumentada — dos 3.as mayores superpuestas',
    ],
    hint: 'Un tritono tiene 6 semitonos. Dos 3.as menores (3 + 3) suman exactamente 6, así que solo la tríada disminuida tiene un tritono de la fundamental a la 5.ª. Las tríadas mayor y menor suman 7 (una 5.ª justa); la aumentada suma 8 (una 5.ª aumentada).',
    nudge: 'Un tritono tiene 6 semitonos. Para cada tipo de tríada, suma los semitonos de sus dos 3.as (3.ª mayor = 4, 3.ª menor = 3) y busca la combinación que da 6.',
  },

  // ---- l2u7m4: Inversiones/Bajo Cifrado ----

  l2u7m4e1: {
    prompt: '¿Qué números de bajo cifrado representan una tríada en estado fundamental?',
    choices: [
      '5/3 (normalmente no se escribe)',
      '6/3 (normalmente abreviado a 6)',
      '6/4 (siempre escrito completo)',
      '7/5/3 (un acorde de séptima)',
    ],
    hint: 'En el estado fundamental, los intervalos por encima del bajo son una 3.ª y una 5.ª. El bajo cifrado los escribe como 5/3. Como el estado fundamental es la posición por defecto, los números generalmente se omiten.',
  },
  l2u7m4e2: {
    prompt: '¿Qué números de bajo cifrado representan una tríada en 1.ª inversión?',
    choices: [
      '6/3 (normalmente abreviado a 6)',
      '5/3 (normalmente no se escribe)',
      '6/4 (siempre escrito completo)',
      '4/2 (cifrado de acorde de séptima)',
    ],
    hint: 'En la 1.ª inversión, la 3.ª del acorde está en el bajo. Los intervalos por encima del bajo son una 3.ª y una 6.ª. El bajo cifrado abrevia 6/3 a simplemente 6.',
  },
  l2u7m4e3: {
    prompt: '¿Qué es una inversión de tríada?',
    choices: [
      'Reorganizar el acorde para que una nota diferente de la fundamental sea la nota más grave',
      'Reorganizar el acorde para que una nota diferente de la fundamental sea la nota más aguda',
      'Reorganizar el acorde para que una nota diferente de la fundamental sea duplicada',
      'Reorganizar el acorde para que sus notas abarquen más de una octava',
    ],
    hint: 'Las inversiones cambian qué nota del acorde está en el bajo. El estado fundamental tiene la fundamental en el bajo, la 1.ª inversión tiene la 3.ª, la 2.ª inversión tiene la 5.ª. La identidad del acorde se mantiene.',
  },

  // ---- l2u7m5: Tríadas Diatónicas/Números Romanos ----

  l2u7m5e1: {
    prompt: 'En una tonalidad mayor, ¿cuál es la cualidad del acorde iii (construido sobre el 3.er grado)?',
    choices: [
      'Menor',
      'Mayor',
      'Disminuida',
      'Aumentada',
    ],
    hint: 'Las tríadas diatónicas en la escala mayor son: I(M) ii(m) iii(m) IV(M) V(M) vi(m) vii°(dim). Los números romanos en minúscula indican cualidad menor. El acorde iii es menor.',
    nudge: 'Constrúyelo en C mayor: superpón 3.as sobre E usando solo teclas blancas y cuenta los semitonos desde la fundamental hasta la 3.ª y hasta la 5.ª. El número romano en minúscula también es una pista.',
  },
  l2u7m5e2: {
    prompt: 'En una tonalidad mayor, ¿cuál es la cualidad del acorde vii° (construido sobre el 7.º grado)?',
    choices: [
      'Disminuida',
      'Menor',
      'Mayor',
      'Aumentada',
    ],
    hint: 'El acorde construido sobre el 7.º grado de la escala mayor (ej: B-D-F en C mayor) contiene un tritono entre la fundamental y la 5.ª, haciéndolo disminuido. Se nota vii°.',
    nudge: 'Constrúyelo en C mayor sobre B, usando solo teclas blancas, y cuenta los semitonos desde la fundamental hasta la 5.ª. ¿Es una 5.ª justa (7 semitonos) o algo más pequeño?',
  },
  l2u7m5e3: {
    prompt: 'Construye una tríada de F mayor. Este es el acorde IV en la tonalidad de C mayor.',
    hint: 'F mayor = F, A, C. Fundamental (F) + 3.ª mayor (A, 4 semitonos por encima) + 5.ª justa (C, 7 semitonos por encima de la fundamental).',
  },
  l2u7m5e4: {
    prompt: 'Construye una tríada de A menor. Este es el acorde vi en la tonalidad de C mayor.',
    hint: 'La tríada de A menor = A, C, E. Fundamental (A) + 3.ª menor (C, 3 semitonos por encima) + 5.ª justa (E, 7 semitonos por encima de la fundamental).',
  },
};

export default overlay;
