import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 2 exercise templates
// 12 modules, ~65 generated exercises
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 4: Todas las Tonalidades Mayores y Grados de la Escala
  // =========================================================================

  // ---- l2u4m1: Todas las Tonalidades Mayores / Círculo de Quintas ----
  l2u4m1: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala de {root} mayor. Selecciona las 7 notas usando los sostenidos o bemoles correctos.',
      hintTemplate:
        'Aplica el patrón T-T-S-T-T-T-S a partir de {root}. Consulta el círculo de quintas para la armadura de clave.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Qué tonalidad mayor tiene esta armadura de clave?',
      hintTemplate:
        'Cuenta los sostenidos o bemoles. Sostenidos: G(1), D(2), A(3), E(4), B(5), F#(6). Bemoles: F(1), Bb(2), Eb(3), Ab(4), Db(5), Gb(6). El último sostenido está un semitono por debajo de la tónica; con dos o más bemoles, el penúltimo bemol da nombre a la tonalidad.',
      choiceSets: [
        [
          'A mayor',
          'D mayor',
          'E mayor',
          'Eb mayor',
        ],
        [
          'E mayor',
          'A mayor',
          'B mayor',
          'Ab mayor',
        ],
        [
          'B mayor',
          'E mayor',
          'F# mayor',
          'Db mayor',
        ],
        [
          'F# mayor',
          'B mayor',
          'C# mayor',
          'Gb mayor',
        ],
        [
          'Bb mayor',
          'F mayor',
          'Eb mayor',
          'D mayor',
        ],
        [
          'Eb mayor',
          'Bb mayor',
          'Ab mayor',
          'A mayor',
        ],
        [
          'Ab mayor',
          'Eb mayor',
          'Db mayor',
          'E mayor',
        ],
        [
          'Db mayor',
          'Ab mayor',
          'Gb mayor',
          'B mayor',
        ],
      ],
    },
  ],

  // ---- l2u4m2: Nombres de los Grados de la Escala ----
  l2u4m2: [
    {
      // scale_degree_id
      promptTemplate:
        'En la escala de {root} {scaleType}, ¿cuál es el número del grado de la nota {note}?',
      hintTemplate:
        'Cuenta a partir de {root} como grado 1 a lo largo de la escala {scaleType}. Los nombres de los grados son: tónica, supertónica, mediante, subdominante, dominante, submediante, sensible.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Asocia el número del grado de la escala con su nombre tradicional.',
      hintTemplate:
        '1=tónica, 2=supertónica, 3=mediante, 4=subdominante, 5=dominante, 6=submediante, 7=sensible.',
      choiceSets: [
        [
          'La mediante es el grado 3',
          'La mediante es el grado 4',
          'La mediante es el grado 5',
          'La mediante es el grado 2',
        ],
        [
          'La submediante es el grado 6',
          'La submediante es el grado 4',
          'La submediante es el grado 5',
          'La submediante es el grado 3',
        ],
        [
          'La supertónica es el grado 2',
          'La supertónica es el grado 3',
          'La supertónica es el grado 7',
          'La supertónica es el grado 1',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 5: Escalas Menores y Relaciones entre Tonalidades
  // =========================================================================

  // ---- l2u5m1: Menor Natural ----
  l2u5m1: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala de {root} menor natural. Selecciona las 7 notas siguiendo el patrón T-S-T-T-S-T-T.',
      hintTemplate:
        'La escala de {root} menor natural sigue el patrón T-S-T-T-S-T-T. Con respecto a la mayor, los grados 3, 6 y 7 son descendidos un semitono.',
    },
  ],

  // ---- l2u5m2: Menor Armónica/Melódica ----
  l2u5m2: [
    {
      // scale_build (harmonic)
      promptTemplate:
        'Construye la escala de {root} menor armónica. El 7.º grado se eleva con respecto a la menor natural.',
      hintTemplate:
        'Menor armónica = menor natural con el 7.º grado elevado. Esto crea una sensible a un semitono por debajo de la tónica {root}.',
    },
    {
      // scale_build (melodic)
      promptTemplate:
        'Construye la escala de {root} menor melódica (forma ascendente). Tanto el 6.º como el 7.º grado se elevan.',
      hintTemplate:
        'Menor melódica ascendente = menor natural con el 6.º y 7.º grados elevados. Esto elimina la 2.ª aumentada presente en la menor armónica.',
    },
  ],

  // ---- l2u5m3: Tonalidades Relativas/Paralelas ----
  l2u5m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre tonalidades relativas y paralelas es verdadera?',
      hintTemplate:
        'Las tonalidades relativas comparten la misma armadura de clave (ej: C mayor / A menor). Las tonalidades paralelas comparten la misma tónica (ej: C mayor / C menor).',
      choiceSets: [
        [
          'La relativa menor de G mayor es E menor',
          'La relativa menor de G mayor es G menor',
          'La relativa menor de G mayor es D menor',
          'La relativa menor de G mayor es B menor',
        ],
        [
          'La relativa menor de D mayor es B menor',
          'La relativa menor de D mayor es D menor',
          'La relativa menor de D mayor es A menor',
          'La relativa menor de D mayor es F# menor',
        ],
        [
          'La relativa mayor de F# menor es A mayor',
          'La relativa mayor de F# menor es F# mayor',
          'La relativa mayor de F# menor es D mayor',
          'La relativa mayor de F# menor es E mayor',
        ],
        [
          'La relativa menor de Eb mayor es C menor',
          'La relativa menor de Eb mayor es Eb menor',
          'La relativa menor de Eb mayor es Bb menor',
          'La relativa menor de Eb mayor es Ab menor',
        ],
        [
          'Las tonalidades paralelas comparten la misma tónica pero difieren en la cualidad',
          'Las tonalidades paralelas comparten la misma armadura de clave',
          'Las tónicas de las tonalidades paralelas están siempre a una 5.ª justa la una de la otra',
          'Las tonalidades paralelas usan las mismas notas',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 6: Compás Compuesto y Síncopa
  // =========================================================================

  // ---- l2u6m1: Compás Compuesto ----
  l2u6m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el compás simple y el compuesto es verdadera?',
      hintTemplate:
        'En el compás compuesto el número de arriba es 6, 9 o 12 y el tiempo se divide en 3. En el compás simple el tiempo se divide en 2.',
      choiceSets: [
        [
          '12/8 es compuesto cuaternario: 4 tiempos de 3',
          '12/8 es simple: doce tiempos de corchea, cada uno dividido en dos',
          '12/8 es compuesto ternario: 3 tiempos, cada uno dividido en 4',
          '12/8 es simple cuaternario: 4 tiempos de 3 corcheas',
        ],
        [
          '6/8 es compuesto binario: 2 tiempos de 3',
          '6/8 es simple ternario: 3 tiempos, cada uno dividido en 2',
          '6/8 es compuesto ternario: 3 tiempos, cada uno dividido en 3',
          '6/8 es simple: seis tiempos de negra por compás',
        ],
        [
          '9/8 es compuesto ternario: 3 tiempos principales, cada uno dividido en 3',
          '9/8 es simple: 9 tiempos de corchea por compás',
          '9/8 es compuesto cuaternario: 4 tiempos principales, cada uno dividido en 3',
          '9/8 es igual que 3/4',
        ],
      ],
    },
  ],

  // ---- l2u6m2: Síncopa ----
  l2u6m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la síncopa y los tresillos es verdadera?',
      hintTemplate:
        'La síncopa coloca énfasis en tiempos o subdivisiones normalmente débiles. Crea sorpresa rítmica e impulso hacia adelante.',
      choiceSets: [
        [
          'La síncopa crea interés rítmico al acentuar contratiempos',
          'La síncopa significa tocar todas las notas justo en los tiempos fuertes',
          'La síncopa elimina todos los acentos de la música',
          'La síncopa involucra siempre tresillos',
        ],
        [
          'Una ligadura desde un tiempo débil sobre la barra de compás crea síncopa al prolongar el sonido a través del tiempo fuerte',
          'Una ligadura sobre la barra de compás no tiene efecto rítmico',
          'Una ligadura sobre la barra de compás siempre duplica el tempo de todo el compás que viene a continuación',
          'Las ligaduras solo pueden ocurrir dentro de un mismo compás',
        ],
        [
          'Tres corcheas de tresillo ocupan el tiempo de dos',
          'Tres corcheas de tresillo ocupan el tiempo de cuatro corcheas normales',
          'Un tresillo hace que cada una de sus tres notas dure un tiempo entero',
          'Un tresillo añade una tercera nota encima de un acorde de dos notas',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 7: Intervalos, Tríadas y Armonía Diatónica
  // =========================================================================

  // ---- l2u7m1: Cualidad del Intervalo ----
  l2u7m1: [
    {
      // interval_id
      promptTemplate:
        'Identifica el intervalo a partir de {root} en sentido {direction}. Determina tanto el número como la cualidad.',
      hintTemplate:
        'Cuenta los nombres de las notas a partir de {root} para el número del intervalo, después cuenta los semitonos para la cualidad (mayor, menor, justo, aumentado, disminuido).',
    },
  ],

  // ---- l2u7m2: Intervalos Aumentados/Disminuidos/Compuestos ----
  l2u7m2: [
    {
      // interval_id
      promptTemplate:
        'Identifica este intervalo a partir de {root}. Puede ser aumentado, disminuido o compuesto.',
      hintTemplate:
        'Los intervalos aumentados son un semitono mayores que justos/mayores. Los disminuidos son un semitono menores que justos/menores. Los intervalos compuestos exceden la octava.',
    },
  ],

  // ---- l2u7m3: Los Cuatro Tipos de Tríadas ----
  l2u7m3: [
    {
      // chord_build
      promptTemplate:
        'Construye una tríada de {root} {quality}. Selecciona las 3 notas que forman este acorde.',
      hintTemplate:
        'Mayor = fundamental + 3M(4) + 5J(7). Menor = fundamental + 3m(3) + 5J(7). Disminuida = fundamental + 3m(3) + 5.ª disminuida (6). Aumentada = fundamental + 3M(4) + 5.ª aumentada (8). Comienza en {root}.',
    },
  ],

  // ---- l2u7m4: Inversiones/Bajo Cifrado ----
  l2u7m4: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las inversiones y el bajo cifrado es verdadera?',
      hintTemplate:
        'Estado fundamental = 5/3. 1.ª inversión = 6/3 (6). 2.ª inversión = 6/4. La nota del bajo determina la inversión.',
      choiceSets: [
        [
          'En la 2.ª inversión, la 5.ª del acorde está en el bajo',
          'En la 2.ª inversión, la 3.ª del acorde está en el bajo',
          'En la 2.ª inversión, la fundamental está en el bajo',
          'En la 2.ª inversión, la 7.ª está en el bajo',
        ],
        [
          'Un acorde C/E es C mayor en 1.ª inversión',
          'Un acorde C/E es E mayor en estado fundamental',
          'Un acorde C/E es C mayor en 2.ª inversión',
          'Un acorde C/E es un acorde de E menor',
        ],
        [
          'Bajo cifrado 6/4 indica 2.ª inversión',
          'Bajo cifrado 6/4 indica un acorde en estado fundamental',
          'Bajo cifrado 6/4 indica 1.ª inversión',
          'Bajo cifrado 6/4 indica un acorde de séptima',
        ],
        [
          'En la 1.ª inversión, la 3.ª del acorde está en el bajo',
          'En la 1.ª inversión, la 5.ª del acorde está en el bajo',
          'En la 1.ª inversión, la fundamental sigue en el bajo',
          'En la 1.ª inversión, la 7.ª del acorde está en el bajo',
        ],
      ],
    },
  ],

  // ---- l2u7m5: Tríadas Diatónicas/Números Romanos ----
  l2u7m5: [
    {
      // chord_build
      promptTemplate:
        'Construye la tríada diatónica sobre {root} tal como aparece en C mayor.',
      hintTemplate:
        'Usa solo las notas de C mayor (sin sostenidos ni bemoles). La cualidad depende de qué grado de la escala ocupa {root}: I, IV, V son mayores; ii, iii, vi son menores; vii es disminuida.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las tríadas diatónicas de una tonalidad mayor es verdadera?',
      hintTemplate:
        'En las tonalidades mayores: I(M) ii(m) iii(m) IV(M) V(M) vi(m) vii°(dim). Mayúscula = mayor, minúscula = menor, ° = disminuida.',
      choiceSets: [
        [
          'El acorde ii en una tonalidad mayor es menor',
          'El acorde ii en una tonalidad mayor es mayor',
          'El acorde ii en una tonalidad mayor es disminuido',
          'El acorde ii en una tonalidad mayor es aumentado',
        ],
        [
          'El acorde vi en una tonalidad mayor es menor',
          'El acorde vi en una tonalidad mayor es mayor',
          'El acorde vi en una tonalidad mayor es disminuido',
          'El acorde vi en una tonalidad mayor es aumentado',
        ],
        [
          'El acorde IV en una tonalidad mayor es mayor',
          'El acorde IV en una tonalidad mayor es menor',
          'El acorde IV en una tonalidad mayor es aumentado',
          'El acorde IV en una tonalidad mayor es disminuido',
        ],
      ],
    },
  ],
};

export default overlay;
