import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Spanish (ES) overlay for Level 3 exercise templates
// 13 modules. Mirrors templatesL3.ts entry by entry (module + template index,
// choice set + choice index) — see the W4-01 note there.
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 9: Acordes de Séptima y Armonía Diatónica
  // =========================================================================

  // ---- l3u9m1: Acordes de Séptima — Cinco Calidades ----
  l3u9m1: [
    {
      // chord_build
      promptTemplate:
        'Construye un acorde de {root} {quality}. Selecciona las 4 notas.',
      hintTemplate:
        'Construcción de acordes de séptima a partir de {root}: maj7 = 3M + 5J + 7M, min7 = 3m + 5J + 7m, dom7 = 3M + 5J + 7m, semidism7 = 3m + 5.ª disminuida + 7m, dim7 = 3m + 5.ª disminuida + 7.ª disminuida.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Qué definición de acorde de séptima es correcta?',
      hintTemplate:
        'Escucha la cualidad de la tríada (mayor/menor/dim) y la cualidad de la 7.ª (mayor/menor/disminuida) apilada encima.',
      choiceSets: [
        [
          'Tríada mayor + 7.ª mayor = acorde de séptima mayor',
          'Tríada mayor + 7.ª mayor = acorde de séptima de dominante',
          'Tríada mayor + 7.ª mayor = acorde de séptima menor',
          'Tríada mayor + 7.ª mayor = acorde de séptima semidisminuida',
        ],
        [
          'Tríada mayor + 7.ª menor = acorde de séptima de dominante',
          'Tríada mayor + 7.ª menor = acorde de séptima mayor',
          'Tríada mayor + 7.ª menor = acorde de séptima menor',
          'Tríada mayor + 7.ª menor = acorde de séptima totalmente disminuida',
        ],
        [
          'Tríada disminuida + 7.ª menor = acorde de séptima semidisminuida',
          'Tríada disminuida + 7.ª menor = acorde de séptima disminuida',
          'Tríada disminuida + 7.ª menor = acorde de séptima menor',
          'Tríada disminuida + 7.ª menor = acorde de séptima de dominante',
        ],
      ],
    },
  ],

  // ---- l3u9m2: Inversiones de Acordes de Séptima ----
  l3u9m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las inversiones de los acordes de séptima y su cifrado es verdadera?',
      hintTemplate:
        'Inversiones de acordes de séptima: estado fundamental = 7 (fundamental en el bajo), 1.ª inversión = 6/5 (3.ª en el bajo), 2.ª inversión = 4/3 (5.ª en el bajo), 3.ª inversión = 4/2 o 2 (7.ª en el bajo).',
      choiceSets: [
        [
          'La 3.ª inversión tiene la 7.ª en el bajo (4/2)',
          'La 3.ª inversión tiene la 5.ª en el bajo (4/3)',
          'La 3.ª inversión tiene la 3.ª en el bajo (6/5)',
          'La 3.ª inversión tiene la fundamental en el bajo (7)',
        ],
        [
          'La 1.ª inversión se cifra 6/5',
          'La 1.ª inversión se cifra 4/3',
          'La 1.ª inversión se cifra 4/2',
          'La 1.ª inversión se cifra 7/5/3',
        ],
        [
          'La 2.ª inversión se cifra 4/3',
          'La 2.ª inversión se cifra 6/5',
          'La 2.ª inversión se cifra 4/2',
          'La 2.ª inversión se cifra 6/4',
        ],
        [
          'En la 2.ª inversión, la 5.ª está en el bajo',
          'En la 2.ª inversión, la 3.ª está en el bajo',
          'En la 2.ª inversión, la 7.ª está en el bajo',
          'En la 2.ª inversión, la fundamental está en el bajo',
        ],
      ],
    },
  ],

  // ---- l3u9m3: Acordes de Séptima Diatónicos en Mayor ----
  l3u9m3: [
    {
      // chord_build
      promptTemplate:
        'Construye el acorde de séptima diatónico sobre {root} en C mayor. Usa solo teclas blancas.',
      hintTemplate:
        'Acordes de 7.ª diatónicos en C mayor: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5. Construye sobre {root} usando solo notas de la escala de C mayor.',
    },
  ],

  // ---- l3u9m4: Acordes de Séptima Diatónicos en Menor ----
  l3u9m4: [
    {
      // chord_build
      promptTemplate:
        'Construye el acorde de séptima diatónico sobre {root} en A menor (menor armónica).',
      hintTemplate:
        'En la menor armónica, el 7.º grado elevado crea cualidades de acordes diferentes de la menor natural. El V se convierte en séptima de dominante y el vii en séptima disminuida. El 7.º grado elevado crea cualidades de acorde inusuales — no te sorprendan las sonoridades poco familiares.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los acordes de séptima de la menor armónica es verdadera?',
      hintTemplate:
        'En la menor armónica, el 7.º grado elevado altera la cualidad de los acordes construidos sobre los grados III, V y VII.',
      choiceSets: [
        [
          'En la menor armónica, V7 es un acorde de séptima de dominante',
          'En la menor armónica, V7 es un acorde de séptima menor',
          'En la menor armónica, V7 es un acorde de séptima mayor',
          'En la menor armónica, V7 es un acorde de séptima semidisminuida',
        ],
        [
          'En la menor armónica, vii°7 es totalmente disminuido',
          'En la menor armónica, vii°7 es un acorde de séptima semidisminuida (m7b5)',
          'En la menor armónica, vii°7 es un acorde de séptima menor',
          'En la menor armónica, vii°7 es un acorde de séptima de dominante',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 10: Conducción de Voces
  // =========================================================================

  // ---- l3u10m1: Fundamentos de SATB ----
  l3u10m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la disposición de las voces SATB es verdadera?',
      hintTemplate:
        'Tesituras SATB: Soprano C4-G5, Contralto F3-C5, Tenor C3-G4, Bajo E2-C4. Las voces adyacentes deben mantenerse a una distancia de como máximo una octava entre sí (excepto bajo-tenor). El cruce coloca una voz normalmente más grave por encima de su vecina; en tríadas en estado fundamental, duplicar la fundamental es el punto de partida habitual.',
      choiceSets: [
        [
          'Voces superiores adyacentes: como máximo una octava; tenor–bajo: puede superar una octava',
          'Voces superiores adyacentes: pueden superar una octava; tenor–bajo: como máximo una octava',
          'Voces superiores adyacentes: como máximo una octava; tenor–bajo: como máximo una octava',
          'Voces superiores adyacentes: pueden superar una octava; tenor–bajo: puede superar una octava',
        ],
        [
          'Cruce de voces: la contralto canta B4 mientras la soprano canta G4',
          'Cruce de voces: la contralto canta G4 mientras la soprano canta G4',
          'Cruce de voces: la contralto canta G4 mientras la soprano canta B4',
          'Cruce de voces: la contralto canta C4 mientras la soprano canta E4',
        ],
        [
          'En estado fundamental, duplicar la fundamental suele ser la opción más segura',
          'En estado fundamental, duplicar la sensible suele ser la opción más segura',
          'En estado fundamental, duplicar la 3.ª suele ser más seguro que duplicar la fundamental',
          'En estado fundamental, una tríada suele llenar cuatro voces sin duplicar una nota del acorde',
        ],
      ],
    },
  ],

  // ---- l3u10m2: Reglas de Escritura a Partes ----
  l3u10m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la conducción de voces es verdadera?',
      hintTemplate:
        'Evita 5.as y 8.as paralelas, resuelve la sensible hacia arriba, cuidado con las 5.as y 8.as directas entre las voces extremas, y mantén notas comunes cuando sea posible.',
      choiceSets: [
        [
          'Quintas paralelas: D4–A4 → E4–B4',
          'Quintas paralelas: D4–A4 → D4–B4',
          'Quintas paralelas: D4–A4 → E4–A4',
          'Quintas paralelas: D4–A4 → D4–A4',
        ],
        [
          'La sensible resuelve por grado ascendente a la tónica',
          'La sensible resuelve por grado descendente a la submediante',
          'La sensible puede moverse libremente en cualquier dirección',
          'La sensible salta hacia arriba hasta la mediante',
        ],
        [
          'Una quinta directa en las voces extremas es aceptable con la soprano por grado conjunto y el bajo por salto',
          'Una quinta directa en las voces extremas es aceptable con la soprano por salto y el bajo por grado conjunto',
          'Una quinta directa en las voces extremas es aceptable con la soprano por salto y el bajo por salto',
          'Una quinta directa en las voces extremas es aceptable siempre que el bajo se mueve por grado conjunto',
        ],
        [
          'El movimiento contrario entre las voces extremas suele preferirse',
          'El movimiento paralelo entre las cuatro voces suele preferirse',
          'El movimiento directo entre las voces extremas suele ser obligatorio',
          'El movimiento oblicuo entre las voces extremas suele estar prohibido',
        ],
      ],
    },
  ],

  // ---- l3u10m3: Escritura a Partes en Estado Fundamental ----
  l3u10m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la escritura a partes con tríadas en estado fundamental es verdadera?',
      hintTemplate:
        'Fundamentales a una 5.ª comparten una nota común, a una 3.ª comparten dos, a una 2.ª ninguna. Mantén las notas comunes en la misma voz; si no hay ninguna, mueve las voces superiores en contra del bajo.',
      nudgeTemplate: 'Prueba cada afirmación con acordes reales en C mayor — I–V (fundamentales a una 5.ª), I–vi (a una 3.ª), IV–V (a una 2.ª): escribe los dos acordes, cuenta las notas que comparten y mira cuánto tiene que moverse cada voz superior. Para saber qué nota doblar, pregúntate cuál es el miembro más estable del acorde.',
      choiceSets: [
        [
          'Fundamentales a una 5.ª comparten una nota común: mantenla en la misma voz',
          "Fundamentales a una 5.ª comparten dos notas comunes: mantenlas en las mismas voces",
          'Fundamentales a una 5.ª comparten dos notas comunes: muévelas a otras voces',
          'Fundamentales a una 5.ª comparten una nota común: muévela a otra voz',
        ],
        [
          'Fundamentales a una 3.ª comparten dos notas comunes: mantén ambas y mueve una voz',
          'Fundamentales a una 3.ª comparten una nota común: mantén esa nota en la misma voz',
          'Fundamentales a una 3.ª no comparten ninguna nota común: mueve las tres voces superiores',
          'Fundamentales a una 3.ª comparten tres notas comunes: mantén las tres en las mismas voces',
        ],
        [
          'Fundamentales a una 2.ª no comparten notas: mueve las voces superiores en contra del bajo',
          'Fundamentales a una 2.ª comparten dos notas comunes: mantén ambas y mueve una voz',
          'Fundamentales a una 2.ª: mueve las cuatro voces en la misma dirección que el bajo',
          'Fundamentales a una 2.ª comparten una nota común, que se mantiene en el soprano mientras las demás se mueven',
        ],
        [
          "Cada voz superior se mueve a la nota del acorde disponible más cercana",
          'Cada voz superior salta a una nueva nota del acorde para añadir interés melódico',
          'Cada voz superior se mueve a la nota del acorde una octava arriba',
          'Cada voz superior se mueve a la misma nota del acorde que el bajo',
        ],
        [
          'En las tríadas en estado fundamental, dobla la fundamental por norma',
          'En las tríadas en estado fundamental, dobla la sensible',
          'En las tríadas en estado fundamental, dobla la 3.ª por norma',
          'En las tríadas en estado fundamental, nunca dobles ninguna nota',
        ],
      ],
    },
  ],

  // ---- l3u10m4: Tríadas Invertidas ----
  l3u10m4: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las tríadas invertidas es verdadera?',
      hintTemplate:
        '1.ª inversión (6/3): 3.ª en el bajo, usada para líneas de bajo suaves. 2.ª inversión (6/4): 5.ª en el bajo, usada solo como 6/4 cadencial, de paso, de pedal o arpegiado. Cuando la sensible está en el bajo (p. ej. V6), no la dupliques.',
      nudgeTemplate: 'Lee los números como intervalos por encima del bajo: superpón una 6.ª y una 3.ª (6/3) o una 6.ª y una 4.ª (6/4) sobre una nota del bajo y mira qué miembro del acorde queda en el bajo. Después piensa en cómo se comporta cada acorde: ¿qué notas tienen una atracción fuerte, y en qué pocos patrones fijos aparece un 6/4?',
      choiceSets: [
        [
          'La 1.ª inversión pone la 3.ª en el bajo y puede aparecer fuera de las cadencias',
          'La 1.ª inversión pone la 5.ª en el bajo y puede aparecer fuera de las cadencias',
          'La 1.ª inversión pone la 3.ª en el bajo y aparece solo en las cadencias',
          'La 1.ª inversión pone la 5.ª en el bajo y aparece solo en las cadencias',
        ],
        [
          'Tipos comunes de 6/4: cadencial, de paso, de pedal, arpegiado',
          'Tipos comunes de 6/4: tónica, predominante, dominante, sustituto de tónica',
          'Tipos comunes de 6/4: auténtico, plagal, semicadencial, roto',
          'Tipos comunes de 6/4: cadencial, secuencial, modulante, tonicizante',
        ],
        [
          'El 6/4 cadencial decora el V: su 6.ª y su 4.ª bajan por grado a la 5.ª y la 3.ª',
          'El 6/4 cadencial funciona como tónica: el bajo es la fundamental del acorde de tónica',
          'El 6/4 cadencial decora el V: la 6.ª baja a la 3.ª y la 4.ª sube a la 5.ª',
          'El 6/4 cadencial funciona como tónica: la 6.ª y la 4.ª son notas del acorde usadas libremente',
        ],
        [
          'La 2.ª inversión pone la 5.ª en el bajo y la fundamental una 4.ª por encima',
          'La 2.ª inversión pone la 3.ª en el bajo y la fundamental una 4.ª por encima',
          'La 2.ª inversión pone la 5.ª en el bajo y la fundamental una 6.ª por encima',
          'La 2.ª inversión pone la 3.ª en el bajo y la fundamental una 6.ª por encima',
        ],
        [
          'Cuando la sensible está en el bajo de una tríada en 1.ª inversión, haz sonar la sensible en una sola voz',
          'Cuando la sensible está en el bajo de una tríada en 1.ª inversión, haz sonar la sensible en dos voces',
          'Cuando la sensible está en el bajo de una tríada en 1.ª inversión, haz sonar la sensible en tres voces',
          'Cuando la sensible está en el bajo de una tríada en 1.ª inversión, haz sonar la sensible en cualquier número de voces',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 11: Cadencias, Frases y Ornamentación
  // =========================================================================

  // ---- l3u11m1: Cadencias — El Conjunto Completo ----
  l3u11m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Qué nombre de cadencia es correcto?',
      hintTemplate:
        'CAP: V-I con soprano en la tónica. CAI: V-I con soprano NO en la tónica, o acordes invertidos. SC: termina en V. Plagal: IV-I. Rota: V-vi.',
      choiceSets: [
        [
          'V–I, ambos en estado fundamental, soprano en la tónica: cadencia auténtica perfecta (CAP)',
          'V–I, ambos en estado fundamental, soprano en la tónica: cadencia auténtica imperfecta (CAI)',
          'V–I, ambos en estado fundamental, soprano en la tónica: semicadencia',
          'V–I, ambos en estado fundamental, soprano en la tónica: cadencia rota',
        ],
        [
          'Una frase que termina en V: semicadencia',
          'Una frase que termina en V: cadencia auténtica perfecta',
          'Una frase que termina en V: cadencia plagal',
          'Una frase que termina en V: cadencia rota',
        ],
        [
          'V que resuelve a vi: cadencia rota',
          'V que resuelve a vi: cadencia auténtica perfecta (CAP)',
          'V que resuelve a vi: semicadencia',
          'V que resuelve a vi: cadencia plagal',
        ],
        [
          'IV a I: cadencia plagal',
          'IV a I: cadencia auténtica perfecta (CAP)',
          'IV a I: semicadencia',
          'IV a I: cadencia rota',
        ],
        [
          'V–I con el soprano en la 3.ª: cadencia auténtica imperfecta',
          'V–I con el soprano en la 3.ª: cadencia auténtica perfecta (CAP)',
          'V–I con el soprano en la 3.ª: semicadencia',
          'V–I con el soprano en la 3.ª: cadencia rota',
        ],
      ],
    },
  ],

  // ---- l3u11m2: Frases y Períodos ----
  l3u11m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre frases y períodos es verdadera?',
      hintTemplate:
        'Un período tiene dos frases: antecedente (termina con SC o CAI) y consecuente (termina con CAP). Una frase (Satz) tiene presentación (idea básica + repetición) y continuación. En un período paralelo, ambas frases comienzan de forma similar; en un período contrastante, comienzan con material diferente.',
      choiceSets: [
        [
          "Un período paralelo: ambas frases empiezan con material similar, y el consecuente tiene una cadencia más fuerte que el antecedente",
          "Un período paralelo: ambas frases empiezan con material contrastante, y el consecuente tiene una cadencia más fuerte que el antecedente",
          "Un período paralelo: ambas frases empiezan con material similar, y el consecuente tiene una cadencia más débil que el antecedente",
          "Un período paralelo: ambas frases empiezan con material contrastante, y el consecuente tiene una cadencia más débil que el antecedente",
        ],
        [
          'El antecedente suele terminar con una cadencia débil (SC o CAI)',
          "El antecedente suele terminar con la cadencia más fuerte del período (CAP)",
          'El antecedente suele terminar con una cadencia rota (V–vi)',
          'El antecedente suele terminar con una cadencia plagal (IV–I)',
        ],
        [
          'Frase (Satz): una presentación (idea + repetición), seguida de una continuación',
          'Frase (Satz): un período (antecedente + consecuente), seguido de otro período',
          'Frase (Satz): tres presentaciones (idea + repetición), sin continuación',
          'Frase (Satz): una continuación, seguida de una presentación (idea + repetición)',
        ],
        [
          'Período contrastante: las dos frases empiezan con material diferente',
          'Período contrastante: las dos frases comparten material inicial similar',
          'Período contrastante: el consecuente termina con cadencia más débil que el antecedente',
          'Período contrastante: cuatro frases forman dos pares antecedente-consecuente',
        ],
      ],
    },
  ],

  // ---- l3u11m3: Ritmo Armónico ----
  l3u11m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el ritmo armónico es verdadera?',
      hintTemplate:
        'El ritmo armónico es la velocidad a la que los acordes cambian. Puede acelerarse cerca de las cadencias, creando una sensación de movimiento hacia adelante y de llegada. En la música de práctica común, los acordes suelen cambiar en los tiempos fuertes.',
      choiceSets: [
        [
          'El ritmo armónico suele acelerarse a medida que se acerca una cadencia',
          'El ritmo armónico suele crear impulso al mantener un acorde durante la cadencia',
          'El ritmo armónico suele pasar de un acorde por tiempo a uno por compás al acercarse la cadencia',
          'El ritmo armónico suele seguir el número de notas de la melodía, independientemente de cuándo cambian los acordes',
        ],
        [
          'Un ritmo armónico más rápido suele volver la música más impetuosa',
          'Un ritmo armónico más rápido suele dar al pasaje un carácter más tranquilo y estático',
          'Un ritmo armónico más rápido suele hacer que la melodía adopte figuras más cortas',
          'Un ritmo armónico más rápido suele dejar inalterada la energía del pasaje',
        ],
        [
          'En la práctica común, los acordes suelen cambiar en los tiempos fuertes',
          'En la práctica común, los acordes suelen cambiar en los tiempos débiles en vez de los fuertes',
          'En la práctica común, los acordes suelen cambiar cuando la melodía pasa a otra nota',
          'En la práctica común, los acordes suelen cambiar cuando el bajo repite la misma nota',
        ],
        [
          'El ritmo armónico es la frecuencia de los cambios de acordes',
          'El ritmo armónico es la frecuencia de los cambios de notas de la melodía',
          'El ritmo armónico es la frecuencia de los cambios de tempo',
          'El ritmo armónico es la frecuencia de los cambios de compás',
        ],
      ],
    },
  ],

  // ---- l3u11m4: Notas Extrañas al Acorde (Parte 1) ----
  l3u11m4: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre notas de paso, bordaduras y anticipaciones es verdadera?',
      hintTemplate:
        'Nota de paso: grado–grado en la misma dirección entre dos notas del acorde. Bordadura: se aleja por grado y vuelve a la misma nota del acorde (incompleta: uno de los lados por salto). Anticipación: una nota del acorde siguiente que suena antes.',
      choiceSets: [
        [
          'Abordada y abandonada por grado en la misma dirección: una nota de paso',
          'Abordada y abandonada por grado en la misma dirección: una bordadura',
          'Abordada y abandonada por grado en la misma dirección: una anticipación',
          'Abordada y abandonada por grado en la misma dirección: una bordadura incompleta',
        ],
        [
          'Las notas de paso pueden ser acentuadas (en el tiempo) o no acentuadas',
          'Las notas de paso pueden volver por grado conjunto a la nota inicial del acorde (como bordaduras completas)',
          'Las notas de paso pueden anunciar pronto el siguiente acorde (sin enlace por grado conjunto)',
          'Las notas de paso pueden alcanzarse por grado conjunto y dejarse por salto (como bordaduras incompletas)',
        ],
        [
          'C–D–E sobre un acorde de C mayor: D es una nota de paso',
          'C–D–E sobre un acorde de C mayor: D es una nota del acorde',
          'C–D–E sobre un acorde de C mayor: D es una anticipación',
          'C–D–E sobre un acorde de C mayor: E es la nota de paso',
        ],
        [
          'Una nota que se aleja por grado de una nota del acorde y vuelve a ella: una bordadura',
          'Una nota que se aleja por grado de una nota del acorde y vuelve a ella: una nota de paso',
          'Una nota que se aleja por grado de una nota del acorde y vuelve a ella: una anticipación',
          'Una nota que se aleja por grado de una nota del acorde y vuelve a ella: una bordadura incompleta',
        ],
        [
          'Una bordadura incompleta es la nota central de G4–D4–E4 sobre un acorde de C mayor mantenido',
          'Una bordadura incompleta es la nota central de E4–D4–C4 sobre un acorde de C mayor mantenido',
          'Una bordadura incompleta es la nota central de E4–D4–E4 sobre un acorde de C mayor mantenido',
          'Una bordadura incompleta es la nota central de E4–G4–C5 sobre un acorde de C mayor mantenido',
        ],
        [
          'Una anticipación hace sonar una nota del acorde siguiente antes de que llegue ese acorde',
          'Una anticipación llena el espacio entre dos notas del acorde por grado en la misma dirección',
          'Una anticipación se aleja por grado de una nota del acorde y vuelve a la nota inicial',
          'Una anticipación se aborda por grado y se deja por salto, con una conexión por grado',
        ],
      ],
    },
  ],

  // ---- l3u11m5: Transposición ----
  l3u11m5: [
    {
      // scale_build
      promptTemplate:
        'Transporta la escala de C mayor para que empiece en {root}. Selecciona las 7 notas.',
      hintTemplate:
        'Cada nota se desplaza el mismo intervalo que va de C a {root}, así que el patrón T-T-S-T-T-T-S se mantiene: el resultado es la escala de {root} mayor.',
    },
    {
      // interval_id
      promptTemplate:
        'Una melodía que empieza en {root} se transporta para que empiece en la segunda nota mostrada. ¿Por qué intervalo se transportó?',
      hintTemplate:
        'Cuenta los nombres de nota de {root} a la nueva nota inicial para el número del intervalo, y los semitonos ({semitones}) para su calidad.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la transposición es verdadera?',
      hintTemplate:
        'Transportar desplaza todas las notas el mismo intervalo. Instrumentos transpositores: los instrumentos en Bb suenan una 2.ª mayor por debajo de lo escrito, la trompa en F una 5.ª justa por debajo.',
      choiceSets: [
        [
          'Transportar desplaza todas las notas el mismo intervalo',
          'Transportar desplaza solo la melodía, nunca los acordes que la acompañan',
          'Transportar cambia los intervalos entre las notas',
          'Transportar mantiene los nombres de las notas pero cambia la armadura de clave',
        ],
        [
          'Una trompeta en Bb suena una 2.ª mayor por debajo de lo escrito',
          'Una trompeta en Bb suena exactamente la altura escrita',
          'Una trompeta en Bb suena una 2.ª mayor por encima de lo escrito',
          'Una trompeta en Bb suena una 5.ª justa por debajo de lo escrito',
        ],
        [
          'C mayor transportado una 5.ª justa arriba pasa a G mayor, con un sostenido',
          'C mayor transportado una 5.ª justa arriba pasa a F mayor, con un bemol',
          'C mayor transportado una 5.ª justa arriba conserva la armadura sin sostenidos ni bemoles',
          'C mayor transportado una 5.ª justa arriba pasa a D mayor, con dos sostenidos',
        ],
        [
          'Una trompa en F suena una 5.ª justa por debajo de lo escrito',
          'Una trompa en F suena una 5.ª justa por encima de lo escrito',
          'Una trompa en F suena una 2.ª mayor por debajo de lo escrito',
          'Una trompa en F suena exactamente la altura escrita',
        ],
      ],
    },
  ],
};

export default overlay;
