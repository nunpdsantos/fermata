import type { CurriculumLevelOverlay } from '../types';

const curriculumL1: CurriculumLevelOverlay = {
  // ─── Unidades ─────────────────────────────────────────────────────────────
  units: {
    u33: {
      title: 'Notación de Guitarra — Opcional',
      description: 'Clave, cuerdas, dedos, posiciones y cejillas. Estas tres lecciones no cuentan para completar niveles ni para desbloquearlos.'
    },
    u1: {
      title: 'Notación y Altura',
      description:
        'El pentagrama, claves, semitonos, tonos, alteraciones y la escala cromática',
      milestone: {
        skillsSummary: [
          'Leer la clave de sol y la clave de fa y localizar el C central en el sistema de pentagramas',
          'Definir semitonos y tonos y encontrarlos en el piano',
          'Identificar sostenidos, bemoles y equivalentes enarmónicos',
          'Conocer las 12 alturas cromáticas y verlas en el teclado',
        ],
        bridgeText:
          'Ya conoces las 12 alturas y cómo funciona la distancia en el teclado. A continuación aprenderás cómo se organiza el tiempo en la música — figuras rítmicas, silencios y compás.',
        tryThisLabel: 'Toca las 12 notas en orden',
        tryThisPrompt: '¿Puedes nombrar cada nota antes de oírla?',
      },
    },
    u2: {
      title: 'Ritmo y Compás',
      description:
        'Figuras rítmicas, silencios, puntillos, ligaduras y compases simples',
      milestone: {
        skillsSummary: [
          'Conocer la jerarquía de las figuras rítmicas, de la redonda a la semicorchea',
          'Comprender los puntillos y las ligaduras como modificadores de duración',
          'Leer indicaciones de compás simples: 2/4, 3/4, 4/4',
          'Sentir el metro binario, ternario y cuaternario',
        ],
        bridgeText:
          'Ya comprendes la altura y el ritmo — las dos dimensiones de la notación musical. Ahora vas a combinarlos en escalas, intervalos y tus primeros acordes.',
        tryThisLabel: 'Toca G mayor a un tempo regular',
        tryThisPrompt: 'Prueba a marcar negras mientras suena la escala.',
      },
    },
    u3: {
      title: 'Escalas, Intervalos y Primeros Acordes',
      description:
        'La escala mayor, armaduras de clave, números de intervalos y tríadas mayores',
      milestone: {
        skillsSummary: [
          'Construir escalas mayores en C, G, D y F usando el patrón T-T-S-T-T-T-S',
          'Leer las armaduras de clave de las primeras cuatro tonalidades mayores',
          'Nombrar intervalos del unísono a la octava contando los nombres de las notas',
          'Construir tríadas mayores a partir de cualquier fundamental',
        ],
        bridgeText: '',
        tryThisLabel: 'Construye una tríada de D mayor',
        tryThisPrompt: 'Nombra las tres notas antes de tocar.',
      },
    },
  },

  // ─── Módulos ──────────────────────────────────────────────────────────────
  modules: {
    l1u33m1: {
      title: 'Notación de Guitarra: Clave y Cuerdas',
      subtitle: 'Lee la altura sonora y los números de cuerda en círculo',
      objectives: [
        'Explicar por qué la guitarra se escribe una octava por encima de su sonido',
        'Distinguir un número de cuerda de un número de dedo'
      ],
      concepts: [
        {
          title: 'El Pequeño 8 Debajo de la Clave',
          explanation: 'La música para guitarra usa la clave de sol con un pequeño 8 debajo: las notas suenan una octava por debajo de lo escrito. Un E4 escrito suena como E3. El pequeño 8 cambia el registro, no los nombres de las notas. En Explorar, selecciona Guitarra para ver esta clave; el Piano usa la clave de sol simple.',
          tryThisLabel: 'Abre en Explorar, selecciona Guitarra y compara la clave con la del Piano'
        },
        {
          title: 'Los Números en Círculo Indican Cuerdas',
          explanation: 'Los símbolos ① ② ③ ④ ⑤ ⑥ indican las cuerdas, desde la más fina y aguda hasta la más gruesa y grave. En la afinación estándar, las cuerdas al aire suenan E4, B3, G3, D3, A2, E2. Un ③ en círculo significa tocar en la cuerda 3, no con el dedo 3. Estos nombres de altura describen el sonido, antes de la transposición de octava en la escritura.',
          tryThisLabel: 'Muestra en la Guitarra y encuentra las dos cuerdas E al aire'
        }
      ],
      tasks: [
        {
          instruction: 'Selecciona Guitarra en Explorar. Encuentra el pequeño 8 debajo de la clave de sol y explica la diferencia entre el E4 escrito y el E3 que suena.'
        },
        {
          instruction: 'En tu guitarra, señala ① y ⑥. Di sus alturas sonoras en la afinación estándar y después encuentra ③.'
        }
      ]
    },
    l1u33m2: {
      title: 'Notación de Guitarra: Las Dos Manos',
      subtitle: 'Mano izquierda 0–4 y mano derecha p-i-m-a',
      objectives: [
        'Leer los números de los dedos de la mano izquierda y el signo de cuerda al aire',
        'Descifrar p-i-m-a y distinguir un arpegio de un tremolo'
      ],
      concepts: [
        {
          title: 'Números de la Mano Izquierda',
          explanation: 'Los números de la mano izquierda indican los dedos que pisan las cuerdas: 1 = índice, 2 = medio, 3 = anular, 4 = meñique. El número 0 significa cuerda al aire: ningún dedo de la mano izquierda la pisa. Estos números no son los números de cuerda en círculo. En el mástil de la aplicación, elige Dedos para ver sugerencias de digitación de la mano izquierda.',
          tryThisLabel: 'Muestra en la Guitarra y compara Dedos con Notas'
        },
        {
          title: 'Letras de la Mano Derecha',
          explanation: 'Las letras p-i-m-a indican los dedos que pulsan: p = pulgar, i = índice, m = medio, a = anular. En un arpegio, las notas del acorde suenan una tras otra. Lee p-i-m-a como pulgar, índice, medio, anular. El patrón de tremolo p-a-m-i es pulgar, anular, medio, índice: el orden de las letras importa. La aplicación toca alturas; practica los movimientos de las manos en tu guitarra.',
          tryThisLabel: 'Escucha el acorde y después pulsa sus notas por separado en tu guitarra'
        }
      ],
      tasks: [
        {
          instruction: 'En tu guitarra, toca una cuerda al aire y después písala con los dedos 1, 2, 3 y 4, uno cada vez. Di los números mientras tocas.'
        },
        {
          instruction: 'Imita lentamente p-i-m-a y después p-a-m-i. Nombra cada dedo que pulsa; no confundas una letra de la mano derecha con un número de la mano izquierda.'
        }
      ]
    },
    l1u33m3: {
      title: 'Notación de Guitarra: Posiciones y Cejillas',
      subtitle: 'Números romanos, C y ½C en el mástil',
      objectives: [
        'Leer posiciones en números romanos, como V',
        'Distinguir una indicación de posición de una cejilla completa o parcial'
      ],
      concepts: [
        {
          title: 'Posiciones en Números Romanos',
          explanation: 'Un número romano indica la posición de la mano izquierda: I = 1.ª, II = 2.ª, V = 5.ª, VII = 7.ª. En la posición V, el índice tiene como base el traste 5; los demás dedos cubren normalmente los trastes 6, 7 y 8. Una posición es un lugar de la mano, no un número de cuerda ni un acorde. Una indicación de posición, por sí sola, no exige una cejilla.',
          tryThisLabel: 'Muestra en la Guitarra y elige la posición V'
        },
        {
          title: 'El Signo de Cejilla',
          explanation: 'Una cejilla usa un dedo, normalmente el índice, para pisar varias cuerdas en el mismo traste. C indica una cejilla completa; ½C indica una cejilla parcial. CV significa cejilla completa en el traste 5, mientras que ½CV significa cejilla parcial en ese traste. La partitura o la digitación indica qué cuerdas abarca la cejilla parcial; no deduzcas un número fijo de cuerdas solo a partir de ½.',
          tryThisLabel: 'Muestra en la Guitarra; en tu guitarra, localiza el traste 5 para CV'
        }
      ],
      tasks: [
        {
          instruction: 'Elige la posición V en el mástil de la aplicación. Localiza el traste 5 y compara el número de posición con los números de los dedos en los puntos.'
        },
        {
          instruction: 'Lee V, CV y ½CV en voz alta. Explica qué indicación solo sitúa la mano, cuál pide una cejilla completa y cuál pide una cejilla parcial.'
        }
      ]
    },

    // ── U1 M1: El Pentagrama y las Claves ─────────────────────────────────
    l1u1m1: {
      title: 'El Pentagrama y las Claves',
      subtitle: 'La cuadrícula de cinco líneas que representa la altura en el papel',
      objectives: [
        'Identificar el pentagrama de cinco líneas como la base de la notación occidental',
        'Leer la clave de sol y la clave de fa y saber en qué alturas se centran',
        'Comprender cómo la posición en el pentagrama corresponde a la altura — más arriba = sonido más agudo',
      ],
      concepts: [
        {
          title: 'El Pentagrama de Cinco Líneas',
          explanation:
            'Toda la música escrita vive en un pentagrama — cinco líneas horizontales y cuatro espacios. Las notas colocadas más arriba en el pentagrama suenan más agudas; las notas colocadas más abajo suenan más graves. Cada línea y cada espacio representa una altura específica. El pentagrama es el mapa; las notas son los puntos de referencia.',
          tryThisLabel: 'Observa las notas organizadas por altura',
        },
        {
          title: 'Clave de Sol y Clave de Fa',
          explanation:
            'Una clave aparece al comienzo de un pentagrama e indica qué alturas representan las líneas y los espacios. La clave de sol (𝄞) se centra en el G por encima del C central — se usa para instrumentos más agudos y la mano derecha en el piano. La clave de fa (𝄢) se centra en el F por debajo del C central — se usa para instrumentos más graves y la mano izquierda en el piano. Sin una clave, el pentagrama es solo líneas — la clave les da significado. La guitarra usa la clave de sol con un pequeño 8 debajo: suena una octava por debajo de lo escrito. La unidad opcional Notación de Guitarra explica esta convención.',
          tryThisLabel: 'Explora la tonalidad de C',
        },
      ],
      tasks: [
        {
          instruction:
            'Observa el teclado del piano — las notas van del grave (izquierda) al agudo (derecha), igual que el pentagrama va del grave (abajo) al agudo (arriba)',
        },
        {
          instruction:
            'Escribe "C major scale" y observa cómo cada nota ocupa una posición más alta a medida que la altura sube',
        },
      ],
    },

    // ── U1 M2: Líneas Adicionales y el Sistema de Pentagramas ─────────────
    l1u1m2: {
      title: 'Líneas Adicionales y el Sistema de Pentagramas',
      subtitle: 'Ampliar el pentagrama y conectar la clave de sol con la clave de fa',
      objectives: [
        'Comprender las líneas adicionales como extensiones por encima o por debajo del pentagrama',
        'Saber que el sistema de pentagramas combina las claves de sol y de fa unidas por una llave',
        'Localizar el C central como la línea adicional entre los dos pentagramas',
      ],
      concepts: [
        {
          title: 'Líneas Adicionales',
          explanation:
            'Cuando las notas sobrepasan el pentagrama de cinco líneas, se añaden pequeñas líneas horizontales llamadas líneas adicionales. El C central, por ejemplo, está en una línea adicional por debajo del pentagrama de clave de sol o en una línea adicional por encima del pentagrama de clave de fa. Las líneas adicionales extienden el pentagrama temporalmente — aparecen solo donde son necesarias.',
          tryThisLabel: 'Observa el C central en el piano',
        },
        {
          title: 'El Sistema de Pentagramas',
          explanation:
            'La música para piano usa el sistema de pentagramas — un pentagrama de clave de sol arriba y un pentagrama de clave de fa abajo, unidos por una llave y conectados por una línea adicional compartida del C central. La mano derecha lee típicamente la clave de sol; la izquierda lee la clave de fa. Juntos, cubren la mayor parte de la extensión del piano. Por eso los pianistas aprenden ambas claves desde el principio.',
          tryThisLabel: 'Explora el C en todo el teclado',
        },
      ],
      tasks: [
        {
          instruction:
            'Encuentra el C central en el piano — está entre las dos mitades del sistema de pentagramas',
        },
        {
          instruction:
            'Toca notas por debajo y por encima del C central para escuchar cómo el sistema de pentagramas abarca ambos registros',
        },
      ],
    },

    // ── U1 M3: Semitonos, Tonos y Alteraciones ───────────────────────────
    l1u1m3: {
      title: 'Semitonos, Tonos y Alteraciones',
      subtitle:
        'Las distancias más pequeñas en la música y los símbolos que modifican la altura',
      objectives: [
        'Definir semitonos y tonos como los bloques de construcción de todas las escalas',
        'Comprender sostenidos, bemoles y becuadros como modificadores de altura',
        'Reconocer equivalentes enarmónicos — el mismo sonido, diferente nombre',
      ],
      concepts: [
        {
          title: 'Semitonos y Tonos',
          explanation:
            'Un semitono es la menor distancia entre dos notas — como C a C# o E a F. En el piano, es la tecla inmediatamente siguiente (blanca o negra). Un tono equivale a dos semitonos — como C a D. Estas dos distancias son los átomos a partir de los cuales se construyen todas las escalas, acordes y melodías.',
          tryThisLabel: 'Observa todos los semitonos en orden',
        },
        {
          title: 'Sostenidos, Bemoles y Becuadros',
          explanation:
            'Un sostenido (#) sube una nota un semitono. Un bemol (b) baja una nota un semitono. Un becuadro (♮) anula un sostenido o bemol anterior. Estos símbolos se llaman alteraciones. Entre la mayoría de las notas naturales hay una nota intermedia — C# está entre C y D. Pero E–F y B–C ya distan un semitono, por lo que no hay tecla entre ellas.',
          tryThisLabel: 'Observa F# — el sostenido en G mayor',
        },
        {
          title: 'Equivalentes Enarmónicos',
          explanation:
            'C# y Db son la misma tecla en el piano — la misma altura, diferente nombre. Se llaman equivalentes enarmónicos. El nombre que se usa depende del contexto: en la tonalidad de D mayor, la nota se llama C# (porque es un C elevado); en la tonalidad de Ab mayor, la misma altura se llama Db (porque es un D descendido).',
          tryThisLabel: 'Observa las 12 notas',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca notas adyacentes en la escala cromática — cada paso es un semitono. Escribe "C chromatic scale" para verlas todas',
        },
        {
          instruction:
            'Encuentra E y F en el piano — observa que no hay tecla negra entre ellas. Este par es un semitono natural',
        },
        {
          instruction:
            'Escribe "key of G" — ¿qué nota necesita sostenido? El F se convierte en F# para mantener el patrón de la escala mayor',
        },
      ],
    },

    // ── U1 M4: La Escala Cromática ────────────────────────────────────────
    l1u1m4: {
      title: 'La Escala Cromática',
      subtitle:
        'Las 12 notas en orden — el vocabulario completo de alturas',
      objectives: [
        'Conocer la escala cromática como las 12 notas ascendentes por semitonos',
        'Comprender que la escala cromática contiene todas las notas posibles en la música occidental',
        'Ver cómo las 7 notas naturales y las 5 alteraciones forman el conjunto completo',
      ],
      concepts: [
        {
          title: 'Las 12 Notas',
          explanation:
            'La música occidental usa 12 alturas distintas, que se repiten en octavas más agudas y más graves. La escala cromática toca las 12 en orden, cada una a un semitono de la siguiente: C, C#, D, D#, E, F, F#, G, G#, A, A#, B — y después vuelve a C una octava más arriba. Estas 12 notas son el vocabulario completo de alturas. Todas las escalas, acordes y melodías provienen de este conjunto.',
          tryThisLabel: 'Escucha las 12 notas',
        },
        {
          title: 'El Teclado del Piano',
          explanation:
            'El piano hace visibles las 12 notas: 7 teclas blancas (las naturales C–B) y 5 teclas negras (los sostenidos/bemoles). El patrón de 2 teclas negras seguido de 3 teclas negras se repite a lo largo del teclado. Esta disposición no es arbitraria — refleja los semitonos naturales entre E–F y B–C. Cuando reconozcas este patrón, podrás encontrar cualquier nota instantáneamente.',
          tryThisLabel: 'Observa las notas naturales en el teclado',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C chromatic scale" y cuenta las 12 notas antes de que el patrón se repita',
        },
        {
          instruction:
            'En el piano, encuentra el grupo de 2 teclas negras — la tecla blanca justo por debajo del grupo es siempre C',
        },
      ],
    },

    // ── U2 M1: Figuras Rítmicas y Silencios ──────────────────────────────
    l1u2m1: {
      title: 'Figuras Rítmicas y Silencios',
      subtitle:
        'Cuánto duran las notas — de la redonda a la semicorchea',
      objectives: [
        'Conocer las figuras rítmicas estándar: redonda, blanca, negra, corchea y semicorchea',
        'Comprender la relación 2:1 — cada figura tiene la mitad de la duración de la anterior',
        'Reconocer los silencios como silencio medido con la misma jerarquía de duración',
      ],
      concepts: [
        {
          title: 'La Jerarquía de Duraciones',
          explanation:
            'La música organiza el tiempo mediante una jerarquía de figuras rítmicas. La redonda es la más larga. La blanca dura la mitad. La negra es la mitad de eso — y así sucesivamente hasta las corcheas y semicorcheas. Cada nivel divide por dos: 1 redonda = 2 blancas = 4 negras = 8 corcheas = 16 semicorcheas. Este sistema permite a los músicos escribir cualquier ritmo con precisión.',
          tryThisLabel: 'Escucha un compás de cada: redondas, blancas, negras y corcheas',
        },
        {
          title: 'Silencios',
          explanation:
            'Cada figura rítmica tiene un silencio correspondiente — un símbolo para silencio medido. Un silencio de negra dura tanto como una negra. Un silencio de blanca dura tanto como una blanca. Los silencios no son «nada» — son silencios activos que moldean las frases tanto como las propias notas. Los grandes músicos prestan tanta atención a lo que no tocan como a lo que tocan.',
          tryThisLabel: 'Escucha notas y silencios repartirse los tiempos: negra, silencio de negra; blanca, silencio de blanca',
        },
        {
          title: 'Puntillos y Ligaduras',
          explanation:
            'Un puntillo después de una nota aumenta su duración en la mitad — una blanca con puntillo dura tres tiempos en lugar de dos (cuando la negra es la unidad de tiempo). Una ligadura de prolongación une dos notas de la misma altura en un sonido continuo — una blanca ligada a una negra dura tres tiempos en total. Los puntillos y las ligaduras permiten crear duraciones que no encajan en la jerarquía básica.',
          tryThisLabel: 'Escucha una blanca con puntillo y después una blanca ligada a una negra: las dos duran tres tiempos',
        },
      ],
      tasks: [
        {
          instruction:
            'Golpea un pulso regular en la mesa. Cada golpe es una negra. Ahora golpea solo cada dos golpes — esas son blancas',
        },
        {
          instruction:
            'Aplaude el ritmo: negra, negra, blanca. La blanca dura tanto como las dos negras juntas',
        },
      ],
    },

    // ── U2 M2: Compás e Indicación de Compás ──────────────────────────────
    l1u2m2: {
      title: 'Compás e Indicación de Compás',
      subtitle: 'Cómo los tiempos se agrupan en compases — 2/4, 3/4 y 4/4',
      objectives: [
        'Comprender el metro como el patrón recurrente de tiempos fuertes y débiles',
        'Leer indicaciones de compás simples: 2/4, 3/4, 4/4',
        'Sentir la diferencia entre metro binario (2), ternario (3) y cuaternario (4)',
      ],
      concepts: [
        {
          title: 'Pulso, Metro y Compases',
          explanation:
            'La música tiene un pulso regular — el tiempo al que marcas con el pie. El metro organiza esos tiempos en grupos recurrentes de 2, 3 o 4, con el primer tiempo de cada grupo sintiéndose más fuerte. Un compás es un grupo completo, separado por barras de compás. La indicación de compás al comienzo indica el agrupamiento: 4/4 significa cuatro tiempos de negra por compás. 3/4 significa tres. 2/4 significa dos.',
          tryThisLabel: 'Escucha 4/4: cuatro tiempos por compás, el primero acentuado',
        },
        {
          title: 'Compases Simples',
          explanation:
            'En el metro simple, cada tiempo se divide naturalmente en dos partes iguales. 4/4 es la indicación de compás más común — cuatro tiempos de negra por compás, con el tiempo 1 más fuerte y el tiempo 3 con un acento secundario. 3/4 da a la música un carácter de vals — UN-dos-tres, UN-dos-tres. 2/4 crea un carácter de marcha — UN-dos, UN-dos. El número de arriba indica los tiempos por compás; el número de abajo indica qué figura vale un tiempo.',
          tryThisLabel: 'Escucha 3/4: UN-dos-tres, UN-dos-tres',
        },
      ],
      tasks: [
        {
          instruction:
            'Marca un pulso regular y acentúa cada 4.º tiempo — estás sintiendo el compás 4/4. Ahora prueba acentuar cada 3.er tiempo — eso es 3/4',
        },
        {
          instruction:
            'Escucha una canción que conozcas y cuenta los tiempos hasta que el patrón se repita. La mayoría de las canciones pop están en 4/4. Los valses están en 3/4',
        },
      ],
    },

    // ── U3 M1: La Escala Mayor ────────────────────────────────────────────
    l1u3m1: {
      title: 'La Escala Mayor',
      subtitle:
        'El patrón T-T-S-T-T-T-S que define la tonalidad mayor',
      objectives: [
        'Construir una escala mayor a partir de cualquier nota usando el patrón T-T-S-T-T-T-S',
        'Comprender que C mayor usa solo teclas blancas porque el patrón cae naturalmente',
        'Ver que el mismo patrón en otra tonalidad requiere sostenidos o bemoles',
      ],
      concepts: [
        {
          title: 'El Patrón de la Escala Mayor',
          explanation:
            'La escala mayor sigue una secuencia específica de tonos y semitonos: T-T-S-T-T-T-S. Comenzando en C, se obtienen solo teclas blancas — por eso C mayor no tiene sostenidos ni bemoles. Cada nota de la escala tiene un número llamado grado de la escala, del 1 (la fundamental) al 7.',
          tryThisLabel: 'Observa la escala de C mayor',
        },
        {
          title: 'El Patrón Funciona en Cualquier Nota',
          explanation:
            'El patrón T-T-S funciona a partir de cualquier nota inicial. Comienza en G y sigue el patrón — necesitarás F# en lugar de F para mantener los intervalos correctos. Comienza en F y necesitarás Bb. El patrón te dice exactamente qué notas necesitan sostenidos o bemoles — no los eliges tú.',
          tryThisLabel: 'Construye G mayor — un sostenido',
        },
        {
          title: 'Mismo Patrón, Mismo Sonido',
          explanation:
            'Como todas las escalas mayores usan exactamente el mismo patrón de intervalos, comparten la misma cualidad brillante y resuelta — solo en alturas diferentes. Por eso los músicos tocan en tonalidades diferentes: para adaptarse a la extensión vocal de un cantante, al registro de un instrumento, o para cambiar el color de una pieza.',
          tryThisLabel: 'Construye D mayor — dos sostenidos',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C major scale" y traza el patrón T-T-S-T-T-T-S en el piano',
        },
        {
          instruction:
            'Escribe "G major scale" — ¿qué nota necesita sostenido para mantener el patrón?',
        },
        {
          instruction:
            'Escribe "F major scale" — esta necesita un bemol. ¿Qué nota?',
        },
      ],
    },

    // ── U3 M2: Armaduras de Clave — Primeras Cuatro Tonalidades ──────────
    l1u3m2: {
      title: 'Armaduras de Clave — Primeras Cuatro Tonalidades',
      subtitle: 'C, G, D y F — las tonalidades que más vas a usar',
      objectives: [
        'Comprender qué es una armadura de clave y por qué existe',
        'Conocer las armaduras de clave de C mayor (0), G mayor (1#), D mayor (2#) y F mayor (1b)',
        'Distinguir entre una escala (un patrón) y una tonalidad (un contexto musical)',
      ],
      concepts: [
        {
          title: '¿Qué Es una Armadura de Clave?',
          explanation:
            'Una armadura de clave es una abreviatura — en lugar de escribir un sostenido o bemol junto a cada nota afectada, se listan una vez al comienzo. La armadura de clave de G mayor tiene un sostenido (F#), lo que significa que todos los F en la pieza se tocan como F#. Esto ahorra espacio e indica la tonalidad de un vistazo.',
          tryThisLabel: 'Observa la armadura de G — un sostenido',
        },
        {
          title: 'Tus Primeras Cuatro Tonalidades',
          explanation:
            'Comienza por las tonalidades más comunes: C mayor no tiene sostenidos ni bemoles. G mayor tiene un sostenido (F#). D mayor tiene dos sostenidos (F#, C#). F mayor tiene un bemol (Bb). Los sostenidos aparecen siempre en orden: F-C-G-D-A-E-B. Los bemoles aparecen en orden inverso: B-E-A-D-G-C-F. Cada nueva tonalidad añade la siguiente alteración en la secuencia.',
          tryThisLabel: 'Observa la armadura de D — dos sostenidos',
        },
        {
          title: 'Escala vs. Tonalidad',
          explanation:
            'Una escala es un patrón de notas en orden. Una tonalidad es el contexto musical que usa esas notas, con una nota como «casa». Cuando estás «en la tonalidad de G mayor», la escala de G mayor proporciona tus notas, G es la casa, y la armadura de clave indica que F es siempre sostenido.',
          tryThisLabel: 'Observa la armadura de F — un bemol',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "key of G" — ¿cuántos sostenidos tiene la armadura de clave?',
        },
        {
          instruction:
            'Escribe "key of D" — ¿qué nuevo sostenido se añadió además del F# de G mayor?',
        },
        {
          instruction:
            'Escribe "key of F" — esta es la primera tonalidad con bemol. ¿Qué nota lleva bemol?',
        },
      ],
    },

    // ── U3 M3: Intervalos por Número ──────────────────────────────────────
    l1u3m3: {
      title: 'Intervalos por Número',
      subtitle:
        'Medir la distancia entre notas — del unísono a la octava',
      objectives: [
        'Nombrar intervalos del unísono a la octava contando los nombres de las notas',
        'Distinguir intervalos melódicos (notas en secuencia) de intervalos armónicos (notas simultáneas)',
        'Escuchar cómo intervalos mayores crean saltos más amplios en la melodía',
      ],
      concepts: [
        {
          title: '¿Qué Es un Intervalo?',
          explanation:
            'Un intervalo mide la distancia entre dos notas. Para nombrarlo, cuenta los nombres de las notas de la nota inferior a la superior, inclusive. C a E: C-D-E = 3 letras, por lo tanto es una 3.ª. C a G: C-D-E-F-G = 5 letras, por lo tanto es una 5.ª. De la misma nota a la misma nota es un unísono (1.ª). Una octava (8.ª) va de una nota hasta la siguiente aparición del mismo nombre.',
          tryThisLabel: 'Observa C-E-G — una 3.ª y una 5.ª',
        },
        {
          title: 'Intervalos Melódicos y Armónicos',
          explanation:
            'Cuando dos notas suenan una tras otra, el intervalo es melódico — oyes un salto o paso en una melodía. Cuando dos notas suenan al mismo tiempo, el intervalo es armónico — oyes una combinación o choque. El tamaño es el mismo en ambos casos; solo la presentación difiere.',
          tryThisLabel: 'Escucha 2.as melódicas — paso a paso',
        },
        {
          title: 'Intervalos en la Escala Mayor',
          explanation:
            'Cada nota de la escala mayor forma un intervalo específico con la fundamental. A partir de C: C-D es una 2.ª, C-E es una 3.ª, C-F es una 4.ª, C-G es una 5.ª, C-A es una 6.ª, C-B es una 7.ª, C-C es una octava. Estos son los números básicos de los intervalos. Más adelante aprenderás que cada número tiene también una cualidad (mayor, menor, justo) — por ahora, el número es suficiente.',
          tryThisLabel: 'Observa el Círculo de Quintas — construido sobre intervalos de 5.ª',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C major chord" — el intervalo de C a E es una 3.ª, y de C a G es una 5.ª. Cuenta las letras para confirmar',
        },
        {
          instruction:
            'Escribe "C major scale" — cada par adyacente es una 2.ª (un paso). Toca notas no adyacentes para escuchar intervalos mayores',
        },
        {
          instruction:
            'Abre el Círculo de Quintas — cada paso alrededor del círculo es un intervalo de 5.ª. Cuenta las letras para confirmar',
        },
      ],
    },

    // ── U3 M4: Tus Primeros Acordes — Tríadas Mayores ────────────────────
    l1u3m4: {
      title: 'Tus Primeros Acordes — Tríadas Mayores',
      subtitle:
        'Tres notas que suenan completas — fundamental, 3.ª mayor, 5.ª justa',
      objectives: [
        'Construir una tríada mayor a partir de cualquier fundamental: fundamental + 3.ª mayor + 5.ª justa',
        'Leer cifrados básicos: C, G, D, F (letra sola = tríada mayor)',
        'Escuchar el carácter brillante y estable que define las tríadas mayores',
      ],
      concepts: [
        {
          title: '¿Qué Es un Acorde?',
          explanation:
            'Un acorde son tres o más notas sonando simultáneamente. El acorde más sencillo es la tríada — tres notas apiladas en intervalos de 3.ª. Una tríada mayor combina una fundamental, la nota una 3.ª mayor por encima de ella (4 semitonos) y la nota una 5.ª justa por encima de la fundamental (7 semitonos). C mayor = C-E-G. El cifrado es solo la letra de la fundamental: C significa C mayor.',
          tryThisLabel: 'Escucha C mayor — fundamental, tercera, quinta',
        },
        {
          title: 'Construir Tríadas a Partir de Cualquier Fundamental',
          explanation:
            'La fórmula funciona a partir de cualquier nota inicial. G mayor = G-B-D. D mayor = D-F#-A. F mayor = F-A-C. Cuenta 4 semitonos por encima de la fundamental para la 3.ª, después 3 semitonos más para la 5.ª (o 7 en total de la fundamental a la 5.ª). El carácter brillante y estable de una tríada mayor proviene de esta combinación específica de intervalos.',
          tryThisLabel: 'Construye G mayor',
        },
        {
          title: 'El Sonido de la Tríada Mayor',
          explanation:
            'Toca varias tríadas mayores — C, G, D, F. Todas comparten la misma cualidad brillante, abierta y resuelta, a pesar de comenzar en notas diferentes. Esto ocurre porque todas usan la misma estructura interválica: 3.ª mayor + 3.ª menor (fundamental a 3.ª = 4 semitonos, 3.ª a 5.ª = 3 semitonos). Esa estructura consistente es lo que las hace sonar a todas «mayores».',
          tryThisLabel: 'Construye F mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C major chord" y cuenta los semitonos: C a E = 4 (3.ª mayor), E a G = 3 (3.ª menor), C a G = 7 (5.ª justa)',
        },
        {
          instruction:
            'Escribe "G major chord" — identifica la fundamental, la 3.ª y la 5.ª. Mismo patrón interválico, nota inicial diferente',
        },
        {
          instruction:
            'Toca "C major chord", "G major chord", "D major chord", "F major chord" — escucha la misma cualidad brillante en todas las tonalidades',
        },
      ],
    },
  },
};

export default curriculumL1;
