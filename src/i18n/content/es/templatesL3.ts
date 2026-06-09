import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 3 exercise templates
// 13 modules, ~70 generated exercises
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 9: Acordes de Séptima y Armonía Diatónica
  // =========================================================================

  // ---- l3u9m1: Acordes de Séptima — Cinco Cualidades ----
  l3u9m1: [
    {
      // chord_build
      promptTemplate:
        'Construye un acorde de {root} {quality}. Selecciona las 4 notas.',
      hintTemplate:
        'Construcción de acordes de séptima a partir de {root}: maj7 = 3.ªM+5.ªJ+7.ªM, min7 = 3.ªm+5.ªJ+7.ªm, dom7 = 3.ªM+5.ªJ+7.ªm, semidism7 = 3.ªm+5.ªdim+7.ªm, dim7 = 3.ªm+5.ªdim+7.ªddim.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica la cualidad de este acorde de séptima según su estructura interválica.',
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
          'Tríada mayor + 7.ª menor = acorde de séptima disminuida',
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
        'Identifica la inversión y el bajo cifrado de este acorde de séptima.',
      hintTemplate:
        'Inversiones de acordes de séptima: estado fundamental = 7, 1.ª inv = 6/5, 2.ª inv = 4/3, 3.ª inv = 4/2 (o 2).',
      choiceSets: [
        [
          'La tercera inversión de un acorde de séptima tiene la 7.ª en el bajo (bajo cifrado: 4/2)',
          'La tercera inversión tiene la 5.ª en el bajo',
          'La tercera inversión tiene la 3.ª en el bajo',
          'La tercera inversión tiene la fundamental en el bajo',
        ],
        [
          'La primera inversión de un acorde de séptima usa el bajo cifrado 6/5',
          'La primera inversión usa el bajo cifrado 4/3',
          'La primera inversión usa el bajo cifrado 4/2',
          'La primera inversión usa el bajo cifrado 7',
        ],
        [
          'La segunda inversión de un acorde de séptima usa el bajo cifrado 4/3',
          'La segunda inversión usa el bajo cifrado 6/5',
          'La segunda inversión usa el bajo cifrado 4/2',
          'La segunda inversión usa el bajo cifrado 6/4',
        ],
        [
          'En la segunda inversión, la 5.ª del acorde de séptima está en el bajo',
          'En la segunda inversión, la 3.ª está en el bajo',
          'En la segunda inversión, la 7.ª está en el bajo',
          'En la segunda inversión, la fundamental está en el bajo',
        ],
      ],
    },
  ],

  // ---- l3u9m3: Acordes de Séptima Diatónicos en Mayor ----
  l3u9m3: [
    {
      // chord_build
      promptTemplate:
        'Construye el acorde de séptima diatónico sobre {root} en Do mayor. Usa solo teclas blancas.',
      hintTemplate:
        'Acordes de 7.ª diatónicos en Do mayor: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5. Construye sobre {root} usando solo notas de la escala de Do mayor.',
    },
  ],

  // ---- l3u9m4: Acordes de Séptima Diatónicos en Menor ----
  l3u9m4: [
    {
      // chord_build
      promptTemplate:
        'Construye el acorde de séptima diatónico sobre {root} en La menor (menor armónica).',
      hintTemplate:
        'En la menor armónica, el 7.º grado elevado crea cualidades de acordes diferentes de la menor natural. El V se convierte en séptima de dominante y el vii en séptima disminuida.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica la cualidad de este acorde de séptima diatónico en menor.',
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
          'En la menor armónica, viiº7 es un acorde de séptima totalmente disminuida',
          'En la menor armónica, viiº7 es un acorde de séptima semidisminuida',
          'En la menor armónica, viiº7 es un acorde de séptima menor',
          'En la menor armónica, viiº7 es un acorde de séptima de dominante',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 10: Conducción de Voces y Cadencias
  // =========================================================================

  // ---- l3u10m1: Fundamentos de SATB ----
  l3u10m1: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta pregunta sobre los fundamentos de conducción de voces SATB.',
      hintTemplate:
        'Tesituras SATB: Soprano C4-G5, Contralto F3-C5, Tenor C3-G4, Bajo E2-C4. Las voces superiores adyacentes deben mantenerse a menos de una octava entre sí (excepto bajo-tenor).',
      choiceSets: [
        [
          'Las voces superiores adyacentes (S-C, C-T) deben mantenerse generalmente a menos de una octava entre sí',
          'Las cuatro voces deben estar siempre dentro de una octava en total',
          'No hay restricciones de espaciado entre voces',
          'Soprano y contralto deben estar siempre a una 3.ª de distancia',
        ],
        [
          'El cruce de voces ocurre cuando una voz más grave sobrepasa a la voz más aguda adyacente',
          'El cruce de voces se produce cuando dos voces cantan la misma nota',
          'El cruce de voces siempre se fomenta para crear interés melódico',
          'El cruce de voces solo se aplica a soprano y bajo',
        ],
        [
          'Doblar la fundamental del acorde es generalmente la opción más segura en estado fundamental',
          'Doblar la 3.ª siempre es preferible',
          'Doblar la 7.ª crea el mejor sonido',
          'Todas las notas del acorde deben aparecer exactamente una vez',
        ],
      ],
    },
  ],

  // ---- l3u10m2: Reglas de Escritura a Partes ----
  l3u10m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica el error o regla de conducción de voces ilustrado aquí.',
      hintTemplate:
        'Evita 5.as y 8.as paralelas, resuelve la sensible hacia arriba, resuelve la 7.ª del acorde hacia abajo, y mantén notas comunes cuando sea posible.',
      choiceSets: [
        [
          'Las quintas paralelas ocurren cuando dos voces pasan de una 5.ªJ a otra 5.ªJ en la misma dirección',
          'Las quintas paralelas son siempre aceptables en la escritura SATB',
          'Las quintas paralelas solo ocurren entre soprano y bajo',
          'Las quintas paralelas significan que dos voces están siempre a una 5.ª de distancia',
        ],
        [
          'La sensible debe resolver por grado ascendente hacia la tónica',
          'La sensible debe resolver hacia abajo, hacia la dominante',
          'La sensible puede moverse libremente en cualquier dirección',
          'La sensible debe saltar siempre a la mediante',
        ],
        [
          'La 7.ª del acorde debe resolver por grado descendente',
          'La 7.ª del acorde debe resolver por grado ascendente',
          'La 7.ª del acorde no necesita resolver',
          'La 7.ª del acorde debe saltar una 5.ª hacia abajo',
        ],
        [
          'El movimiento contrario entre las voces extremas es generalmente preferible',
          'El movimiento paralelo entre todas las voces es ideal',
          'El bajo debe moverse siempre en la misma dirección que el soprano',
          'El movimiento oblicuo nunca se usa en la escritura SATB',
        ],
      ],
    },
  ],

  // ---- l3u10m3: Cadencias — CAP, CAI, SC ----
  l3u10m3: [
    {
      // multiple_choice
      promptTemplate:
        'Clasifica este tipo de cadencia según los acordes y la conducción de voces descritos.',
      hintTemplate:
        'CAP: V-I con soprano en la tónica. CAI: V-I con soprano NO en la tónica, o acordes invertidos. SC: termina en V. Plagal: IV-I. Rota: V-vi.',
      choiceSets: [
        [
          'V a I con el soprano terminando en la tónica es una Cadencia Auténtica Perfecta (CAP)',
          'Es una Cadencia Auténtica Imperfecta (CAI)',
          'Es una Semicadencia (SC)',
          'Es una Cadencia Rota',
        ],
        [
          'Una frase que termina en el acorde V es una Semicadencia',
          'Una frase que termina en el acorde V es una Cadencia Auténtica Perfecta',
          'Una frase que termina en el acorde V es una Cadencia Plagal',
          'Una frase que termina en el acorde V es una Cadencia Rota',
        ],
        [
          'V resolviendo a vi en lugar de I es una Cadencia Rota',
          'V resolviendo a vi es una Cadencia Auténtica Perfecta',
          'V resolviendo a vi es una Semicadencia',
          'V resolviendo a vi es una Cadencia Plagal',
        ],
        [
          'IV a I es una Cadencia Plagal (cadencia del Amén)',
          'IV a I es una Cadencia Auténtica Perfecta',
          'IV a I es una Semicadencia',
          'IV a I es una Cadencia Rota',
        ],
        [
          'V a I con el soprano en la 3.ª es una Cadencia Auténtica Imperfecta (CAI)',
          'V a I con el soprano en la 3.ª es una CAP',
          'V a I con el soprano en la 3.ª es una Semicadencia',
          'V a I con el soprano en la 3.ª es una Cadencia Rota',
        ],
      ],
    },
  ],

  // ---- l3u10m4: Estructura de Frase ----
  l3u10m4: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta pregunta sobre la estructura de frase musical.',
      hintTemplate:
        'Un período tiene dos frases: antecedente (termina con SC o CAI) y consecuente (termina con CAP). Una frase (Satz) tiene presentación (idea básica + repetición) y continuación.',
      choiceSets: [
        [
          'Un período paralelo tiene frases antecedente y consecuente que comienzan con material similar',
          'Un período paralelo tiene dos frases sin relación',
          'Un período paralelo debe tener exactamente 8 compases',
          'Un período paralelo termina siempre con semicadencia',
        ],
        [
          'La frase antecedente termina típicamente con una cadencia débil (SC o CAI)',
          'La frase antecedente termina siempre con una CAP',
          'La frase antecedente no tiene cadencia',
          'El antecedente es siempre la segunda frase',
        ],
        [
          'Una estructura de frase (Satz) consiste en una fase de presentación seguida de una fase de continuación',
          'Una frase (Satz) es lo mismo que un período',
          'Una frase (Satz) tiene siempre 3 frases',
          'Una frase (Satz) debe tener 16 compases',
        ],
        [
          'Un período contrastante tiene antecedente y consecuente que comienzan con material diferente',
          'Un período contrastante tiene frases idénticas',
          'Un período contrastante modula siempre',
          'Un período contrastante tiene tres frases',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 11: Notas Extrañas al Acorde
  // =========================================================================

  // ---- l3u11m1: Notas de Paso ----
  l3u11m1: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica esta nota extraña al acorde según su aproximación y resolución.',
      hintTemplate:
        'Una nota de paso se mueve por grado entre dos notas del acorde en la misma dirección. Rellena el hueco entre una 3.ª.',
      choiceSets: [
        [
          'Una nota abordada por grado y resuelta por grado en la misma dirección es una nota de paso',
          'Es una bordadura',
          'Es un retardo',
          'Es una apoyatura',
        ],
        [
          'Las notas de paso pueden ser acentuadas (en el tiempo) o no acentuadas (fuera del tiempo)',
          'Las notas de paso están siempre en el tiempo',
          'Las notas de paso están siempre fuera del tiempo',
          'Las notas de paso son siempre cromáticas',
        ],
        [
          'Una nota de paso cromática usa una altura ajena a la tonalidad actual',
          'Una nota de paso cromática es siempre diatónica',
          'Una nota de paso cromática debe saltar',
          'Las notas de paso cromáticas están prohibidas en la armonía clásica',
        ],
      ],
    },
  ],

  // ---- l3u11m2: Bordaduras ----
  l3u11m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica este tipo de nota extraña al acorde y sus características.',
      hintTemplate:
        'Una bordadura se aleja por grado de una nota del acorde y regresa a la misma nota. Las bordaduras superiores suben y bajan; las bordaduras inferiores bajan y suben.',
      choiceSets: [
        [
          'Una nota que se aleja por grado de una nota del acorde y regresa a ella es una bordadura',
          'Es una nota de paso',
          'Es un retardo',
          'Es una escapatoria',
        ],
        [
          'Una bordadura doble (nota cambiata) decora una nota yendo tanto por encima como por debajo de ella',
          'Una bordadura doble usa dos notas de paso consecutivas',
          'Una bordadura doble significa que dos voces tienen bordaduras simultáneamente',
          'Una bordadura doble es lo mismo que un trino',
        ],
        [
          'Una bordadura incompleta se aborda o se resuelve por salto en lugar de por grado',
          'Una bordadura incompleta nunca resuelve',
          'Una bordadura incompleta usa solo un tono entero',
          'Una bordadura incompleta es lo mismo que un retardo',
        ],
      ],
    },
  ],

  // ---- l3u11m3: Retardos ----
  l3u11m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta pregunta sobre retardos en la conducción de voces.',
      hintTemplate:
        'Un retardo tiene 3 partes: preparación (consonancia), retardo (mantenida en disonancia), resolución (grado descendente hacia consonancia). Se nombran por los intervalos: 4-3, 7-6, 9-8, 2-3.',
      choiceSets: [
        [
          'Un retardo 4-3 mantiene la 4.ª por encima del bajo y resuelve bajando a una 3.ª',
          'Un retardo 4-3 mantiene la 3.ª y sube a la 4.ª',
          'Un retardo 4-3 es una resolución ascendente',
          'Un retardo 4-3 no requiere preparación',
        ],
        [
          'Un retardo debe prepararse como consonancia en un tiempo débil antes de mantenerse en el tiempo fuerte',
          'Un retardo puede aparecer sin preparación',
          'Un retardo resuelve siempre hacia arriba',
          'Un retardo es lo mismo que una apoyatura',
        ],
        [
          'Un retardo 7-6 mantiene la 7.ª por encima del bajo y resuelve bajando a una 6.ª',
          'Un retardo 7-6 resuelve hacia arriba, hasta una octava',
          'Un retardo 7-6 es un retardo del bajo',
          'Un retardo 7-6 no resuelve',
        ],
        [
          'Un retardo 9-8 mantiene la 9.ª por encima del bajo y resuelve bajando a una octava',
          'Un retardo 9-8 resuelve por grado ascendente',
          'Un retardo 9-8 es en realidad un retardo 2-1',
          'Un retardo 9-8 ocurre solo en la voz del bajo',
        ],
      ],
    },
  ],

  // ---- l3u11m4: Anticipaciones y Pedales ----
  l3u11m4: [
    {
      // multiple_choice
      promptTemplate:
        'Clasifica esta nota extraña al acorde según su comportamiento.',
      hintTemplate:
        'Una anticipación llega antes (antes de que el acorde cambie). Un pedal es una nota sostenida o repetida (generalmente tónica o dominante) que se mantiene mientras las armonías cambian por encima.',
      choiceSets: [
        [
          'Una anticipación hace sonar una nota del acorde antes de que el acorde llegue realmente',
          'Una anticipación es lo mismo que un retardo',
          'Una anticipación requiere preparación en un tiempo fuerte',
          'Una anticipación resuelve siempre hacia abajo',
        ],
        [
          'Un pedal de tónica sostiene la nota tónica mientras las armonías cambian por encima',
          'Un pedal de tónica solo ocurre en el soprano',
          'Un pedal de tónica debe resolver después de un compás',
          'Un pedal de tónica es lo mismo que un ostinato',
        ],
        [
          'Un pedal de dominante crea tensión al mantener el 5.º grado de la escala a través de armonías no dominantes',
          'Un pedal de dominante solo aparece al inicio de una pieza',
          'Un pedal de dominante usa siempre la sensible',
          'Un pedal de dominante está siempre en la voz del soprano',
        ],
      ],
    },
  ],

  // ---- l3u11m5: Revisión de Notas Extrañas al Acorde ----
  l3u11m5: [
    {
      // multiple_choice
      promptTemplate:
        'Clasifica la nota extraña al acorde descrita: abordada y resuelta de esta forma.',
      hintTemplate:
        'Nota de paso: grado-grado misma dirección. Bordadura: grado-grado regresando. Retardo: mantenida-grado descendente. Apoyatura: salto-grado. Escapatoria: grado-salto. Anticipación: llega antes.',
      choiceSets: [
        [
          'Abordada por salto, resuelta por grado en la dirección opuesta = apoyatura',
          'Esto describe una nota de paso',
          'Esto describe un retardo',
          'Esto describe una anticipación',
        ],
        [
          'Abordada por grado, resuelta por salto en la dirección opuesta = escapatoria',
          'Esto describe una nota de paso',
          'Esto describe una bordadura',
          'Esto describe una anticipación',
        ],
        [
          'Una suspensión ascendente es como un retardo pero resuelve hacia arriba',
          'Una suspensión ascendente resuelve por salto descendente',
          'Una suspensión ascendente no tiene preparación',
          'Una suspensión ascendente es lo mismo que una anticipación',
        ],
        [
          'Todas las notas extrañas al acorde crean disonancia que resuelve hacia consonancia',
          'Las notas extrañas al acorde son siempre consonantes',
          'Las notas extrañas al acorde nunca resuelven',
          'Las notas extrañas al acorde solo ocurren en la voz del bajo',
        ],
      ],
    },
    {
      // interval_id
      promptTemplate:
        'Identifica el intervalo creado entre la nota extraña al acorde y el bajo, a partir de {root}.',
      hintTemplate:
        'Cuenta los semitonos a partir de {root} para determinar el intervalo. Las notas extrañas crean frecuentemente 2.as, 7.as o intervalos aumentados/disminuidos contra el bajo.',
    },
  ],
};

export default overlay;
