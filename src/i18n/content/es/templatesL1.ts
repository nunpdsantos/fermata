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
        'Usa las posiciones en la clave de sol: líneas E-G-B-D-F, espacios F-A-C-E.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las claves es verdadera?',
      hintTemplate:
        'Recuerda las líneas de la clave de sol (E-G-B-D-F) y los espacios (F-A-C-E).',
      choiceSets: [
        [
          'La clave de sol también se conoce como clave de G',
          'La clave de sol también se conoce como clave de F',
          'La clave de sol también se conoce como clave de C',
          'La clave de sol también se conoce como clave de D',
        ],
        [
          'La clave de fa marca la cuarta línea (contando desde abajo) como F',
          'La clave de fa marca la segunda línea desde abajo como G',
          'La clave de fa marca la tercera línea como C',
          'La clave de fa marca la primera línea como E',
        ],
      ],
    },
  ],

  // ---- l1u1m2: Líneas Adicionales ----
  l1u1m2: [
    {
      promptTemplate:
        'Identifica esta nota por debajo del pentagrama en clave de sol. Cuenta línea a línea hacia abajo desde la parte inferior del pentagrama.',
      hintTemplate:
        'Por debajo del pentagrama en clave de sol, el C central se sitúa en la primera línea adicional. Cuenta hacia abajo grado a grado desde ahí: líneas y espacios se alternan, así que la siguiente línea adicional tiene el A y la siguiente el F.',
    },
    {
      promptTemplate:
        'Identifica esta nota por encima del pentagrama en clave de sol. Cuenta línea a línea hacia arriba desde la parte superior del pentagrama.',
      hintTemplate:
        'La línea superior del pentagrama en clave de sol es el F. Cuenta hacia arriba grado a grado: el G queda justo encima del pentagrama, el A en la primera línea adicional, el C en la segunda y el E en la tercera.',
    },
    {
      promptTemplate:
        'Identifica esta nota por encima del pentagrama en clave de fa. Cuenta línea a línea hacia arriba desde la parte superior del pentagrama.',
      hintTemplate:
        'La línea superior del pentagrama en clave de fa es el A. El C central se sitúa en la primera línea adicional por encima — el mismo C central que está en la primera línea adicional por debajo del pentagrama en clave de sol. El E está en la segunda línea adicional.',
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
        ['E y F', 'C y D', 'G y A', 'D y E'],
        ['B y C', 'A y B', 'F y G', 'G y A'],
      ],
    },
  ],

  // ---- l1u1m4: Escala Cromática ----
  l1u1m4: [
    {
      // note_id
      promptTemplate:
        'Identifica esta nota de tecla negra, escrita aquí con sostenido.',
      hintTemplate:
        'Cada tecla negra tiene dos nombres (equivalentes enarmónicos): uno escrito con sostenido y otro con bemol. Lee la alteración en el pentagrama: esta está escrita con sostenido.',
    },
    {
      // note_id
      promptTemplate:
        'Identifica esta nota de tecla negra, escrita aquí con bemol.',
      hintTemplate:
        'Cada tecla negra tiene dos nombres (equivalentes enarmónicos): uno escrito con sostenido y otro con bemol. Lee la alteración en el pentagrama: esta está escrita con bemol.',
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
        '¿Cuál de estas afirmaciones sobre los valores de las notas es verdadera?',
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
          'Una semicorchea vale medio tiempo en compás 4/4',
          'Una semicorchea vale un cuarto de tiempo en compás 4/4',
          'Una semicorchea vale un tiempo en compás 4/4',
          'Una semicorchea vale tres cuartos de tiempo en compás 4/4',
        ],
      ],
    },
  ],

  // ---- l1u2m2: Compás e Indicaciones de Compás ----
  l1u2m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las indicaciones de compás es verdadera?',
      hintTemplate:
        'El número de arriba cuenta los tiempos de cada compás: 2 = binario, 3 = ternario, 4 = cuaternario. El 4 de abajo indica que cada tiempo es una negra.',
      choiceSets: [
        [
          '2/4 significa 2 tiempos de negra en cada compás',
          '2/4 significa 4 tiempos de blanca por compás',
          '2/4 significa 2 tiempos de blanca por compás',
          '2/4 significa 4 tiempos de negra por compás',
        ],
        [
          '3/4 agrupa los tiempos de tres en tres: fuerte-débil-débil',
          '3/4 agrupa los tiempos de dos en dos: fuerte-débil, fuerte-débil',
          '3/4 agrupa los tiempos de cuatro en cuatro: fuerte-débil-semifuerte-débil',
          '3/4 no tiene ningún tiempo fuerte',
        ],
        [
          '4/4 es cuaternario: cuatro tiempos por compás',
          '4/4 es ternario: tres tiempos por compás',
          '4/4 es binario: dos tiempos por compás',
          '4/4 significa cuatro compases en cada línea de música',
        ],
        [
          'En 2/4, 3/4 y 4/4, el 4 de abajo indica que la negra vale un tiempo',
          'En 2/4, 3/4 y 4/4, el 4 de abajo indica que la redonda vale un tiempo',
          'En 2/4, 3/4 y 4/4, el 4 de abajo indica que cada compás vale cuatro tiempos',
          'En 2/4, 3/4 y 4/4, el 4 de abajo fija el tempo en cuatro tiempos por segundo',
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
      promptTemplate:
        '¿Qué tonalidad mayor tiene esta armadura de clave?',
      hintTemplate:
        'Sin sostenidos ni bemoles = C mayor. Un sostenido (F#) = G mayor. Dos sostenidos (F#, C#) = D mayor. Un bemol (Bb) = F mayor.',
      choiceSets: [
        [
          'C mayor',
          'G mayor',
          'D mayor',
          'F mayor',
        ],
        [
          'G mayor',
          'D mayor',
          'F mayor',
          'C mayor',
        ],
        [
          'D mayor',
          'G mayor',
          'C mayor',
          'F mayor',
        ],
        [
          'F mayor',
          'C mayor',
          'G mayor',
          'D mayor',
        ],
      ],
    },
  ],

  // ---- l1u3m3: Intervalos ----
  l1u3m3: [
    {
      // interval_id
      promptTemplate:
        'Identifica el intervalo a partir de {root} en sentido {direction} por su número: cuenta los nombres de las notas, incluidas las dos notas.',
      hintTemplate:
        'Cuenta los nombres de las notas desde {root} hasta la segunda nota, contando ambas: dos letras forman una 2.ª, tres una 3.ª, cuatro una 4.ª, cinco una 5.ª.',
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
