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
        'Construcción de acordes de séptima a partir de {root}: maj7 = 3.ªM+5.ªJ+7.ªM, min7 = 3.ªm+5.ªJ+7.ªm, dom7 = 3.ªM+5.ªJ+7.ªm, semidism7 = 3.ªm+5.ªdim+7.ªm, dim7 = 3.ªm+5.ªdim+7.ªdim.',
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
        'Inversiones de acordes de séptima: estado fundamental = 7, 1.ª inv = 6/5, 2.ª inv = 4/3, 3.ª inv = 4/2 (o 2).',
      choiceSets: [
        [
          'La 3.ª inversión pone la 7.ª en el bajo (cifrado 4/2)',
          'La 3.ª inversión pone la 5.ª en el bajo (cifrado 4/3)',
          'La 3.ª inversión pone la 3.ª en el bajo (cifrado 6/5)',
          'La 3.ª inversión mantiene la fundamental en el bajo (cifrado 7)',
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
          'En la 2.ª inversión, la fundamental sigue en el bajo',
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
          'En la menor armónica, vii°7 es un acorde de séptima totalmente disminuida',
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
        'Tesituras SATB: Soprano C4-G5, Contralto F3-C5, Tenor C3-G4, Bajo E2-C4. Las voces superiores adyacentes deben mantenerse a menos de una octava entre sí (excepto bajo-tenor).',
      choiceSets: [
        [
          'Soprano–contralto y contralto–tenor quedan a menos de una octava; tenor–bajo puede separarse más',
          'Las cuatro voces deben caber en una sola octava, desde el bajo hasta el soprano',
          'Cualquier separación es válida, siempre que cada voz quede en su tesitura',
          'Tenor–bajo deben quedar a menos de una octava, mientras que las voces superiores pueden separarse más',
        ],
        [
          'Cruce de voces: una voz más grave pasa por encima de la voz vecina',
          'Cruce de voces: dos voces cantan la misma nota al mismo tiempo',
          'Cruce de voces: el soprano y el bajo se mueven en movimiento contrario',
          'Cruce de voces: un hábito recomendado en los corales para dar más interés melódico',
        ],
        [
          'En estado fundamental, doblar la fundamental suele ser la opción más segura',
          'En estado fundamental, la sensible es la mejor nota para doblar',
          'En estado fundamental, doblar la 3.ª es siempre preferible',
          'En estado fundamental, no debe doblarse ninguna nota',
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
        'Evita 5.as y 8.as paralelas, resuelve la sensible hacia arriba, resuelve la 7.ª del acorde hacia abajo, y mantén notas comunes cuando sea posible.',
      choiceSets: [
        [
          'Quintas paralelas: dos voces a una 5.ª J se mueven en la misma dirección hacia otra 5.ª J',
          'Quintas paralelas: dos voces cualesquiera que estén a una 5.ª en cualquier acorde',
          'Quintas paralelas: un error solo cuando aparecen entre el soprano y el bajo',
          'Quintas paralelas: aceptables en SATB siempre que las dos voces se muevan por grado y no por salto',
        ],
        [
          'La sensible resuelve por grado ascendente a la tónica',
          'La sensible resuelve por grado descendente a la submediante',
          'La sensible puede moverse libremente en cualquier dirección',
          'La sensible salta hacia arriba hasta la mediante',
        ],
        [
          'La 7.ª del acorde resuelve por grado descendente',
          'La 7.ª del acorde resuelve por grado ascendente',
          'La 7.ª del acorde no necesita resolver',
          'La 7.ª del acorde salta una 5.ª hacia abajo',
        ],
        [
          'El movimiento contrario entre las voces extremas suele preferirse',
          'El movimiento paralelo entre las cuatro voces suele preferirse',
          'El bajo debe moverse en general en la misma dirección que el soprano',
          'El movimiento oblicuo nunca se usa en la escritura a cuatro voces',
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
      choiceSets: [
        [
          'Fundamentales a una 5.ª comparten una nota común: mantenla en la misma voz',
          'Fundamentales a una 5.ª no comparten notas: mueve todas las voces superiores',
          'Fundamentales a una 5.ª comparten dos notas comunes: mueve solo una voz',
          'Fundamentales a una 5.ª comparten una nota común, que debe pasar a otra voz',
        ],
        [
          'Fundamentales a una 3.ª comparten dos notas comunes: mantén ambas y mueve una voz',
          'Fundamentales a una 3.ª comparten una nota común: mantenla y mueve dos voces',
          'Fundamentales a una 3.ª no comparten notas: mueve las tres voces superiores',
          'Fundamentales a una 3.ª comparten las tres notas, así que las voces superiores nunca se mueven',
        ],
        [
          'Fundamentales a una 2.ª no comparten notas: mueve las voces superiores en contra del bajo',
          'Fundamentales a una 2.ª comparten dos notas comunes: mantén ambas y mueve una voz',
          'Fundamentales a una 2.ª: mueve las cuatro voces en la misma dirección que el bajo',
          'Fundamentales a una 2.ª comparten una nota común, que se mantiene en el soprano mientras las demás se mueven',
        ],
        [
          'Cada voz superior se mueve a la nota del acorde disponible más cercana',
          'Cada voz superior salta a una nueva nota del acorde para dar interés melódico',
          'El bajo siempre debe ir a la nota del acorde más cercana, por grado si es posible',
          'Las cuatro voces deben moverse juntas en la misma dirección',
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
        '1.ª inversión (6/3): 3.ª en el bajo, usada para líneas de bajo suaves. 2.ª inversión (6/4): 5.ª en el bajo, usada solo como 6/4 cadencial, de paso, de pedal o arpegiado.',
      choiceSets: [
        [
          'La 1.ª inversión (6/3) pone la 3.ª en el bajo y suaviza la línea del bajo',
          'La 1.ª inversión (6/3) pone la 5.ª en el bajo y se reserva para las cadencias',
          'La 1.ª inversión (6/3) mantiene la fundamental en el bajo, pero sube la 3.ª una octava',
          'La 1.ª inversión (6/3) solo se usa al final de una pieza',
        ],
        [
          'Los cuatro 6/4 habituales: cadencial, de paso, de pedal y arpegiado',
          'Los cuatro 6/4 habituales: fundamental, 1.ª, 2.ª y 3.ª inversión',
          'Un acorde 6/4 puede usarse libremente en cualquier punto de la frase, igual que una tríada en 1.ª inversión',
          'El único 6/4 aceptable es el que termina una pieza en la tónica',
        ],
        [
          'El 6/4 cadencial decora el V: su 6.ª y su 4.ª bajan por grado a la 5.ª y la 3.ª',
          'El 6/4 cadencial es un acorde de tónica que termina la frase en lugar del I',
          'El 6/4 cadencial resuelve su 6.ª y su 4.ª por grado ascendente al acorde de tónica siguiente',
          'El 6/4 cadencial cae en un tiempo débil, después del acorde de dominante',
        ],
        [
          'La 2.ª inversión (6/4) pone la 5.ª en el bajo, con la fundamental una 4.ª por encima',
          'La 2.ª inversión (6/4) pone la 3.ª en el bajo, con la fundamental una 6.ª por encima',
          'La 2.ª inversión (6/4) pone la fundamental en el bajo, con la 5.ª una 4.ª justa por encima',
          'La 2.ª inversión (6/4) pone la 7.ª en el bajo',
        ],
        [
          'En una tríada en 1.ª inversión, evita doblar el bajo cuando es la sensible',
          'En una tríada en 1.ª inversión, dobla siempre la nota del bajo, sea cual sea',
          'En una tríada en 1.ª inversión, dobla la sensible en el bajo',
          'En una tríada en 1.ª inversión, no puede doblarse ninguna nota',
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
        'Un período tiene dos frases: antecedente (termina con SC o CAI) y consecuente (termina con CAP). Una frase (Satz) tiene presentación (idea básica + repetición) y continuación.',
      choiceSets: [
        [
          'Período paralelo: las dos frases empiezan con material similar',
          'Período paralelo: dos frases con material sin relación y la misma cadencia',
          'Período paralelo: siempre dura exactamente ocho compases',
          'Período paralelo: las dos frases terminan con semicadencia',
        ],
        [
          'El antecedente suele terminar con una cadencia débil (SC o CAI)',
          'El antecedente suele terminar con una CAP',
          'El antecedente no tiene ninguna cadencia',
          'El antecedente es siempre la segunda frase del período',
        ],
        [
          'Frase (Satz): una presentación (idea + repetición), luego una continuación',
          'Frase (Satz): otro nombre para un período de dos frases',
          'Frase (Satz): siempre tres frases, cada una con su cadencia',
          'Frase (Satz): primero una continuación, luego la idea básica y su repetición',
        ],
        [
          'Período contrastante: las dos frases empiezan con material diferente',
          'Período contrastante: las dos frases son idénticas de principio a fin',
          'Período contrastante: siempre modula',
          'Período contrastante: tiene tres frases',
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
        'El ritmo armónico es la velocidad a la que los acordes cambian. Puede acelerarse cerca de las cadencias, creando una sensación de movimiento hacia adelante y de llegada.',
      choiceSets: [
        [
          'El ritmo armónico suele acelerarse a medida que se acerca una cadencia',
          'El ritmo armónico se mantiene constante de principio a fin de una pieza',
          'El ritmo armónico suele frenarse en las cadencias',
          'El ritmo armónico solo cambia entre secciones',
        ],
        [
          'Un ritmo armónico más rápido crea una mayor sensación de impulso',
          'Un ritmo armónico más rápido crea un ambiente más tranquilo y estático',
          'El ritmo armónico no influye en la energía de un pasaje',
          'Un ritmo armónico más lento es la forma habitual de construir un clímax',
        ],
        [
          'En la práctica común, los acordes suelen cambiar en los tiempos fuertes',
          'Los acordes solo pueden cambiar en el 1.er tiempo del compás',
          'Los acordes nunca pueden cambiar a mitad de compás',
          'Cambiar de acorde en los tiempos 2 y 4 es la opción más estable y normal en 4/4',
        ],
        [
          'El ritmo armónico es independiente del ritmo de la melodía',
          'El ritmo armónico es simplemente el ritmo que toca la melodía',
          'El ritmo armónico es la velocidad de la línea del bajo',
          'El ritmo armónico es el número de tiempos de cada compás',
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
          'Las notas de paso caen siempre en el tiempo, nunca entre tiempos',
          'Las notas de paso caen siempre entre tiempos y nunca pueden ser acentuadas',
          'Las notas de paso deben ser siempre notas ajenas a la tonalidad',
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
          'Una bordadura incompleta se aborda o se abandona por salto en lugar de por grado',
          'Una bordadura incompleta nunca llega a resolver',
          'Una bordadura incompleta se mueve solo por tono',
          'Una bordadura incompleta se aborda y se abandona por grado, como una bordadura completa',
        ],
        [
          'Una anticipación hace sonar una nota del acorde siguiente antes de que llegue ese acorde',
          'Una anticipación prolonga una nota del acorde anterior',
          'Una anticipación resuelve siempre por grado descendente',
          'Una anticipación es una nota que no pertenece a ninguno de los dos acordes',
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
