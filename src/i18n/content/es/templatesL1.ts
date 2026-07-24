import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 1 exercise templates
// 10 modules, 16 templates total
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 1: Notación y Altura
  // =========================================================================

  // ---- l1u1m1: Pentagrama y Claves ----
  l1u1m1: [
    {
      // note_id
      promptTemplate:
        'Identifica la nota mostrada en el pentagrama en clave de sol o justo alrededor de él.',
      hintTemplate:
        'Usa las posiciones en la clave de sol: líneas Mi-Sol-Si-Re-Fa, espacios Fa-La-Do-Mi.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Qué nota se encuentra en la línea o espacio indicado del pentagrama?',
      hintTemplate:
        'Recuerda las líneas de la clave de sol (Mi-Sol-Si-Re-Fa) y los espacios (Fa-La-Do-Mi).',
      choiceSets: [
        [
          'La clave de sol también se conoce como clave de G',
          'La clave de sol también se conoce como clave de F',
          'La clave de sol también se conoce como clave de C',
          'La clave de sol también se conoce como clave de D',
        ],
        [
          'La clave de fa marca la cuarta línea como F',
          'La clave de fa marca la segunda línea como G',
          'La clave de fa marca la tercera línea como C',
          'La clave de fa marca la primera línea como E',
        ],
      ],
    },
  ],

  // ---- l1u1m2: Líneas Adicionales ----
  l1u1m2: [
    {
      // note_id
      promptTemplate:
        'Identifica esta nota que necesita líneas adicionales.',
      hintTemplate:
        'Las notas por encima o por debajo del pentagrama utilizan líneas adicionales. Cuenta paso a paso desde la línea del pentagrama más cercana.',
    },
    {
      // note_id
      promptTemplate:
        'Identifica esta nota en una línea adicional por debajo del pentagrama en clave de sol.',
      hintTemplate:
        'Por debajo del pentagrama en clave de sol: el Do central se sitúa en una línea adicional. Cuenta hacia abajo desde ahí para notas más graves.',
    },
  ],

  // ---- l1u1m3: Semitonos y Tonos ----
  l1u1m3: [
    {
      // interval_id
      promptTemplate:
        '¿Cuál es el intervalo a partir de {root} en sentido {direction}? ¿Es un semitono o un tono?',
      hintTemplate:
        'Un semitono es 1 semitono (teclas adyacentes en el piano). Un tono es 2 semitonos (una tecla entre ellas). A partir de {root}, cuenta con cuidado.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Qué par de notas naturales forma un semitono?',
      hintTemplate:
        'En el piano, la mayoría de las notas naturales tiene una tecla negra entre ellas (tono). Solo dos pares son directamente adyacentes, sin tecla negra entre ellos.',
      choiceSets: [
        ['Mi y Fa', 'Do y Re', 'Sol y La', 'Re y Mi'],
        ['Si y Do', 'La y Si', 'Fa y Sol', 'Sol y La'],
      ],
    },
  ],

  // ---- l1u1m4: Escala Cromática ----
  l1u1m4: [
    {
      // note_id
      promptTemplate:
        'Identifica esta nota de tecla negra. Usa su nombre con sostenido.',
      hintTemplate:
        'Las teclas negras tienen dos nombres (equivalentes enarmónicos). Usa aquí la grafía con sostenido.',
    },
    {
      // note_id
      promptTemplate:
        'Identifica esta nota de tecla negra. Usa su nombre con bemol.',
      hintTemplate:
        'Esta tecla negra se sitúa entre dos teclas blancas. Usa aquí la grafía con bemol.',
    },
  ],

  // =========================================================================
  // Unidad 2: Ritmo y Compás
  // =========================================================================

  // ---- l1u2m1: Valores de las Notas ----
  l1u2m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cómo se relacionan estos valores de notas entre sí?',
      hintTemplate:
        'Cada valor de nota tiene exactamente la mitad de la duración del valor inmediatamente superior. Redonda = 4 tiempos, blanca = 2, negra = 1, corchea = 0,5 en compás 4/4.',
      choiceSets: [
        [
          'Dos blancas equivalen a una redonda',
          'Dos blancas equivalen a una negra',
          'Cuatro blancas equivalen a una redonda',
          'Una blanca equivale a cuatro negras',
        ],
        [
          'Dos corcheas equivalen a una negra',
          'Dos corcheas equivalen a una blanca',
          'Cuatro corcheas equivalen a una negra',
          'Una corchea equivale a una negra',
        ],
        [
          'Una blanca con puntillo dura 3 tiempos en compás 4/4',
          'Una blanca con puntillo dura 4 tiempos en compás 4/4',
          'Una blanca con puntillo dura 2 tiempos en compás 4/4',
          'Una blanca con puntillo dura 1,5 tiempos en compás 4/4',
        ],
        [
          'Una semicorchea vale la mitad de un tiempo en compás 4/4',
          'Una semicorchea vale un cuarto de tiempo en compás 4/4',
          'Una semicorchea vale un tiempo en compás 4/4',
          'Una semicorchea vale un octavo de tiempo en compás 4/4',
        ],
      ],
    },
  ],

  // ---- l1u2m2: Compás e Indicaciones de Compás ----
  l1u2m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Qué indica esta indicación de compás sobre la música?',
      hintTemplate:
        'El número superior indica los tiempos por compás. El número inferior indica qué figura recibe un tiempo (4 = negra, 8 = corchea, 2 = blanca).',
      choiceSets: [
        [
          '2/4 significa 2 tiempos de negra por compás',
          '2/4 significa 4 tiempos de blanca por compás',
          '2/4 significa 2 tiempos de blanca por compás',
          '2/4 significa 4 tiempos de negra por compás',
        ],
        [
          '6/8 es un compás compuesto con 2 tiempos principales',
          '6/8 es un compás simple con 6 tiempos',
          '6/8 es lo mismo que 3/4',
          '6/8 tiene 8 tiempos por compás',
        ],
        [
          'Tiempo común (C) equivale a 4/4',
          'Tiempo común (C) equivale a 2/2',
          'Tiempo común (C) significa que la pieza está en Do mayor',
          'Tiempo común (C) equivale a 3/4',
        ],
        [
          'Tiempo cortado (alla breve) equivale a 2/2',
          'Tiempo cortado equivale a 4/4',
          'Tiempo cortado significa tocar a la mitad del tempo',
          'Tiempo cortado equivale a 6/8',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 3: Escalas, Intervalos y Primeros Acordes
  // =========================================================================

  // ---- l1u3m1: Escala Mayor ----
  l1u3m1: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala de {root} mayor. Selecciona las 7 notas siguiendo el patrón T-T-S-T-T-T-S.',
      hintTemplate:
        'La escala de {root} mayor sigue Tono-Tono-Semitono-Tono-Tono-Tono-Semitono a partir de {root}. Cuenta los semitonos: T=2, S=1.',
    },
    {
      // scale_degree_id
      promptTemplate:
        'En la escala de {root} {scaleType}, ¿qué grado es la nota {note}?',
      hintTemplate:
        'Cuenta a partir de {root} (grado 1) a lo largo de la escala {scaleType} hasta llegar a la nota {note}.',
    },
  ],

  // ---- l1u3m2: Armaduras de Clave ----
  l1u3m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál es la armadura de clave para esta tonalidad mayor?',
      hintTemplate:
        'Las tonalidades con sostenidos siguen el ciclo de quintas: Sol(1#), Re(2#), La(3#), Mi(4#). Con bemoles: Fa(1b), Sib(2b), Mib(3b), Lab(4b).',
      choiceSets: [
        [
          'Mi mayor tiene 4 sostenidos: F#, C#, G#, D#',
          'Mi mayor tiene 3 sostenidos: F#, C#, G#',
          'Mi mayor tiene 5 sostenidos',
          'Mi mayor tiene 2 sostenidos',
        ],
        [
          'Sib mayor tiene 2 bemoles: Bb, Eb',
          'Sib mayor tiene 1 bemol: Bb',
          'Sib mayor tiene 3 bemoles',
          'Sib mayor no tiene bemoles',
        ],
        [
          'Lab mayor tiene 4 bemoles: Bb, Eb, Ab, Db',
          'Lab mayor tiene 3 bemoles',
          'Lab mayor tiene 5 bemoles',
          'Lab mayor tiene 2 bemoles',
        ],
        [
          'Do mayor no tiene sostenidos ni bemoles',
          'Do mayor tiene 1 sostenido',
          'Do mayor tiene 1 bemol',
          'Do mayor tiene 7 sostenidos',
        ],
      ],
    },
  ],

  // ---- l1u3m3: Intervalos ----
  l1u3m3: [
    {
      // interval_id
      promptTemplate:
        'Identifica el intervalo a partir de {root} en sentido {direction}. Cuenta los nombres de las notas y los semitonos.',
      hintTemplate:
        'A partir de {root}, cuenta los nombres de las notas para el número del intervalo y los semitonos para la cualidad. {semitones} semitonos {direction}.',
    },
  ],

  // ---- l1u3m4: Tríadas Mayores ----
  l1u3m4: [
    {
      // chord_build
      promptTemplate:
        'Construye la tríada de {root} mayor. Selecciona la fundamental, la 3.ª mayor (4 semitonos) y la 5.ª justa (7 semitonos).',
      hintTemplate:
        'Una tríada mayor = fundamental + 3.ª mayor (4 semitonos por encima) + 5.ª justa (7 semitonos por encima). Comienza en {root} y cuenta.',
    },
    {
      // chord_build
      promptTemplate:
        'Construye la tríada de {root} mayor utilizando las notas de la armadura de clave.',
      hintTemplate:
        'Tríada de {root} mayor: fundamental ({root}), 3.ª mayor, 5.ª justa. Recuerda la armadura de clave para encontrar las notas correctas.',
    },
  ],
};

export default overlay;
