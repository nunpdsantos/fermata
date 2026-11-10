import type { CurriculumLevelOverlay } from '../types';

const curriculumL1: CurriculumLevelOverlay = {
  // ─── Unidades ─────────────────────────────────────────────────────────────
  units: {
    // Track "Start with sound" (wave 2)
    u34: {
      title: 'Empieza por el sonido',
      description: 'Cinco lecciones cortas, de oído y en tu instrumento: agudo y grave, los nombres de las notas, semitonos y tonos, la escala mayor y tus primeros acordes. No hace falta leer música.',
    },
    // Track "From the chords you know" (wave 2)
    u35: {
      title: 'Desde los acordes que conoces',
      description: 'Diez lecciones cortas que parten de los acordes que ya tocas: tonalidades, los números de un cifrado de acordes, por qué los acordes tiran hacia casa, las séptimas, el capo y las notas para un solo. No hace falta leer música.',
    },
    u33: {
      title: 'Notación de guitarra — opcional',
      description: 'Clave, cuerdas, dedos, posiciones y cejillas. Estas tres lecciones no cuentan para completar niveles ni para desbloquearlos.'
    },
    u1: {
      title: 'Notación y altura',
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
      title: 'Ritmo y compás',
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
      title: 'Escalas, intervalos y primeros acordes',
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
      title: 'Notación de guitarra: clave y cuerdas',
      subtitle: 'Lee la altura sonora y los números de cuerda en círculo',
      objectives: [
        'Explicar por qué la guitarra se escribe una octava por encima de su sonido',
        'Distinguir un número de cuerda de un número de dedo'
      ],
      concepts: [
        {
          title: 'El pequeño 8 debajo de la clave',
          explanation: 'La música para guitarra usa la clave de sol con un pequeño 8 debajo: las notas suenan una octava por debajo de lo escrito. Un E4 escrito suena como E3. El pequeño 8 cambia el registro, no los nombres de las notas. En Explorar, selecciona Guitarra para ver esta clave; el Piano usa la clave de sol simple.',
          tryThisLabel: 'Abre en Explorar, selecciona Guitarra y compara la clave con la del Piano'
        },
        {
          title: 'Los números en círculo indican cuerdas',
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
      title: 'Notación de guitarra: las dos manos',
      subtitle: 'Mano izquierda 0–4 y mano derecha p-i-m-a',
      objectives: [
        'Leer los números de los dedos de la mano izquierda y el signo de cuerda al aire',
        'Descifrar p-i-m-a y distinguir un arpegio de un tremolo'
      ],
      concepts: [
        {
          title: 'Números de la mano izquierda',
          explanation: 'Los números de la mano izquierda indican los dedos que pisan las cuerdas: 1 = índice, 2 = medio, 3 = anular, 4 = meñique. El número 0 significa cuerda al aire: ningún dedo de la mano izquierda la pisa. Estos números no son los números de cuerda en círculo. En el mástil de la aplicación, elige Dedos para ver sugerencias de digitación de la mano izquierda.',
          tryThisLabel: 'Muestra en la Guitarra y compara Dedos con Notas'
        },
        {
          title: 'Letras de la mano derecha',
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
      title: 'Notación de guitarra: posiciones y cejillas',
      subtitle: 'Números romanos, C y ½C en el mástil',
      objectives: [
        'Leer posiciones en números romanos, como V',
        'Distinguir una indicación de posición de una cejilla completa o parcial'
      ],
      concepts: [
        {
          title: 'Posiciones en números romanos',
          explanation: 'Un número romano indica la posición de la mano izquierda: I = 1.ª, II = 2.ª, V = 5.ª, VII = 7.ª. En la posición V, el índice tiene como base el traste 5; los demás dedos cubren normalmente los trastes 6, 7 y 8. Una posición es un lugar de la mano, no un número de cuerda ni un acorde. Una indicación de posición, por sí sola, no exige una cejilla.',
          tryThisLabel: 'Muestra en la Guitarra y elige la posición V'
        },
        {
          title: 'El signo de cejilla',
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
      title: 'El pentagrama y las claves',
      subtitle: 'La cuadrícula de cinco líneas que representa la altura en el papel',
      objectives: [
        'Identificar el pentagrama de cinco líneas como la base de la notación occidental',
        'Leer la clave de sol y la clave de fa y saber en qué alturas se centran',
        'Comprender cómo la posición en el pentagrama corresponde a la altura — más arriba = sonido más agudo',
      ],
      concepts: [
        {
          title: 'El pentagrama de cinco líneas',
          explanation:
            'Toda la música escrita vive en un pentagrama — cinco líneas horizontales y cuatro espacios. Las notas colocadas más arriba en el pentagrama suenan más agudas; las notas colocadas más abajo suenan más graves. Cada línea y cada espacio representa una altura específica. El pentagrama es el mapa; las notas son los puntos de referencia.',
          tryThisLabel: 'Observa las notas organizadas por altura',
        },
        {
          title: 'Clave de Sol y clave de Fa',
          explanation:
            'Una clave aparece al comienzo de un pentagrama e indica qué alturas representan las líneas y los espacios. La clave de sol (𝄞) se centra en el G por encima del C central — se usa para instrumentos más agudos y la mano derecha en el piano. La clave de fa (𝄢) se centra en el F por debajo del C central — se usa para instrumentos más graves y la mano izquierda en el piano. Sin una clave, el pentagrama es solo líneas — la clave les da significado. La guitarra usa la clave de sol con un pequeño 8 debajo: suena una octava por debajo de lo escrito. La unidad opcional Notación de Guitarra explica esta convención.',
          tryThisLabel: 'De C a C en clave de sol y en clave de fa',
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
      title: 'Líneas adicionales y el sistema de pentagramas',
      subtitle: 'Ampliar el pentagrama y conectar la clave de sol con la clave de fa',
      objectives: [
        'Comprender las líneas adicionales como extensiones por encima o por debajo del pentagrama',
        'Saber que el sistema de pentagramas combina las claves de sol y de fa unidas por una llave',
        'Localizar el C central como la línea adicional entre los dos pentagramas',
      ],
      concepts: [
        {
          title: 'Líneas adicionales',
          explanation:
            'Cuando las notas sobrepasan el pentagrama de cinco líneas, se añaden pequeñas líneas horizontales llamadas líneas adicionales. El C central, por ejemplo, está en una línea adicional por debajo del pentagrama de clave de sol o en una línea adicional por encima del pentagrama de clave de fa. Las líneas adicionales extienden el pentagrama temporalmente — aparecen solo donde son necesarias.',
          tryThisLabel: 'Observa el C central en el piano',
        },
        {
          title: 'El sistema de pentagramas',
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
      title: 'Semitonos, tonos y alteraciones',
      subtitle:
        'Las distancias más pequeñas en la música y los símbolos que modifican la altura',
      objectives: [
        'Definir semitonos y tonos como los bloques de construcción de todas las escalas',
        'Comprender sostenidos, bemoles y becuadros como modificadores de altura',
        'Reconocer equivalentes enarmónicos — el mismo sonido, diferente nombre',
      ],
      concepts: [
        {
          title: 'Semitonos y tonos',
          explanation:
            'Un semitono es la menor distancia entre dos notas — como C a C# o E a F. En el piano, es la tecla inmediatamente siguiente (blanca o negra). Un tono equivale a dos semitonos — como C a D. Estas dos distancias son los átomos a partir de los cuales se construyen todas las escalas, acordes y melodías.',
          tryThisLabel: 'Observa todos los semitonos en orden',
        },
        {
          title: 'Sostenidos, bemoles y becuadros',
          explanation:
            'Un sostenido (#) sube una nota un semitono. Un bemol (b) baja una nota un semitono. Un becuadro (♮) anula un sostenido o bemol anterior. Estos símbolos se llaman alteraciones. Entre la mayoría de las notas naturales hay una nota intermedia — C# está entre C y D. Pero E–F y B–C ya distan un semitono, por lo que no hay tecla entre ellas.',
          tryThisLabel: 'Observa F# — el sostenido en G mayor',
        },
        {
          title: 'Equivalentes enarmónicos',
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
      title: 'La escala cromática',
      subtitle:
        'Las 12 notas en orden — el vocabulario completo de alturas',
      objectives: [
        'Conocer la escala cromática como las 12 notas ascendentes por semitonos',
        'Comprender que la escala cromática contiene todas las notas posibles en la música occidental',
        'Ver cómo las 7 notas naturales y las 5 alteraciones forman el conjunto completo',
      ],
      concepts: [
        {
          title: 'Las 12 notas',
          explanation:
            'La música occidental usa 12 alturas distintas, que se repiten en octavas más agudas y más graves. La escala cromática toca las 12 en orden, cada una a un semitono de la siguiente: C, C#, D, D#, E, F, F#, G, G#, A, A#, B — y después vuelve a C una octava más arriba. Estas 12 notas son el vocabulario completo de alturas. Todas las escalas, acordes y melodías provienen de este conjunto.',
          tryThisLabel: 'Escucha las 12 notas',
        },
        {
          title: 'El teclado del piano',
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
      title: 'Figuras rítmicas y silencios',
      subtitle:
        'Cuánto duran las notas — de la redonda a la semicorchea',
      objectives: [
        'Conocer las figuras rítmicas estándar: redonda, blanca, negra, corchea y semicorchea',
        'Comprender la relación 2:1 — cada figura tiene la mitad de la duración de la anterior',
        'Reconocer los silencios como silencio medido con la misma jerarquía de duración',
      ],
      concepts: [
        {
          title: 'La jerarquía de duraciones',
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
          title: 'Puntillos y ligaduras',
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
      title: 'Compás e indicación de compás',
      subtitle: 'Cómo los tiempos se agrupan en compases — 2/4, 3/4 y 4/4',
      objectives: [
        'Comprender el metro como el patrón recurrente de tiempos fuertes y débiles',
        'Leer indicaciones de compás simples: 2/4, 3/4, 4/4',
        'Sentir la diferencia entre metro binario (2), ternario (3) y cuaternario (4)',
      ],
      concepts: [
        {
          title: 'Pulso, metro y compases',
          explanation:
            'La música tiene un pulso regular — el tiempo al que marcas con el pie. El metro organiza esos tiempos en grupos recurrentes de 2, 3 o 4, con el primer tiempo de cada grupo sintiéndose más fuerte. Un compás es un grupo completo, separado por barras de compás. La indicación de compás al comienzo indica el agrupamiento: 4/4 significa cuatro tiempos de negra por compás. 3/4 significa tres. 2/4 significa dos.',
          tryThisLabel: 'Escucha 4/4: cuatro tiempos por compás, el primero acentuado',
        },
        {
          title: 'Compases simples',
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
      title: 'La escala mayor',
      subtitle:
        'El patrón T-T-S-T-T-T-S que define la tonalidad mayor',
      objectives: [
        'Construir una escala mayor a partir de cualquier nota usando el patrón T-T-S-T-T-T-S',
        'Comprender que C mayor usa solo teclas blancas porque el patrón cae naturalmente',
        'Ver que el mismo patrón en otra tonalidad requiere sostenidos o bemoles',
      ],
      concepts: [
        {
          title: 'El patrón de la escala mayor',
          explanation:
            'La escala mayor sigue una secuencia específica de tonos y semitonos: T-T-S-T-T-T-S. Comenzando en C, se obtienen solo teclas blancas — por eso C mayor no tiene sostenidos ni bemoles. Cada nota de la escala tiene un número llamado grado de la escala, del 1 (la fundamental) al 7.',
          tryThisLabel: 'Observa la escala de C mayor',
        },
        {
          title: 'El patrón funciona en cualquier nota',
          explanation:
            'El patrón T-T-S funciona a partir de cualquier nota inicial. Comienza en G y sigue el patrón — necesitarás F# en lugar de F para mantener los intervalos correctos. Comienza en F y necesitarás Bb. El patrón te dice exactamente qué notas necesitan sostenidos o bemoles — no los eliges tú.',
          tryThisLabel: 'Construye G mayor — un sostenido',
        },
        {
          title: 'Mismo patrón, mismo sonido',
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
      title: 'Armaduras de clave — primeras cuatro tonalidades',
      subtitle: 'C, G, D y F — las tonalidades que más vas a usar',
      objectives: [
        'Comprender qué es una armadura de clave y por qué existe',
        'Conocer las armaduras de clave de C mayor (0), G mayor (1#), D mayor (2#) y F mayor (1b)',
        'Distinguir entre una escala (un patrón) y una tonalidad (un contexto musical)',
      ],
      concepts: [
        {
          title: '¿Qué es una armadura de clave?',
          explanation:
            'Una armadura de clave es una abreviatura — en lugar de escribir un sostenido o bemol junto a cada nota afectada, se listan una vez al comienzo. La armadura de clave de G mayor tiene un sostenido (F#), lo que significa que todos los F en la pieza se tocan como F#. Esto ahorra espacio e indica la tonalidad de un vistazo.',
          tryThisLabel: 'Observa la armadura de G — un sostenido',
        },
        {
          title: 'Tus primeras cuatro tonalidades',
          explanation:
            'Comienza por las tonalidades más comunes: C mayor no tiene sostenidos ni bemoles. G mayor tiene un sostenido (F#). D mayor tiene dos sostenidos (F#, C#). F mayor tiene un bemol (Bb). Los sostenidos aparecen siempre en orden: F-C-G-D-A-E-B. Los bemoles aparecen en orden inverso: B-E-A-D-G-C-F. Cada nueva tonalidad añade la siguiente alteración en la secuencia.',
          tryThisLabel: 'Observa la armadura de D — dos sostenidos',
        },
        {
          title: 'Escala vs. tonalidad',
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
      title: 'Intervalos por número',
      subtitle:
        'Medir la distancia entre notas — del unísono a la octava',
      objectives: [
        'Nombrar intervalos del unísono a la octava contando los nombres de las notas',
        'Distinguir intervalos melódicos (notas en secuencia) de intervalos armónicos (notas simultáneas)',
        'Escuchar cómo intervalos mayores crean saltos más amplios en la melodía',
      ],
      concepts: [
        {
          title: '¿Qué es un intervalo?',
          explanation:
            'Un intervalo mide la distancia entre dos notas. Para nombrarlo, cuenta los nombres de las notas de la nota inferior a la superior, inclusive. C a E: C-D-E = 3 letras, por lo tanto es una 3.ª. C a G: C-D-E-F-G = 5 letras, por lo tanto es una 5.ª. De la misma nota a la misma nota es un unísono (1.ª). Una octava (8.ª) va de una nota hasta la siguiente aparición del mismo nombre.',
          tryThisLabel: 'Observa C-E-G — una 3.ª y una 5.ª',
        },
        {
          title: 'Intervalos melódicos y armónicos',
          explanation:
            'Cuando dos notas suenan una tras otra, el intervalo es melódico — oyes un salto o paso en una melodía. Cuando dos notas suenan al mismo tiempo, el intervalo es armónico — oyes una combinación o choque. El tamaño es el mismo en ambos casos; solo la presentación difiere.',
          tryThisLabel: 'Escucha 2.as melódicas — paso a paso',
        },
        {
          title: 'Intervalos en la escala mayor',
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
      title: 'Tus primeros acordes — tríadas mayores',
      subtitle:
        'Tres notas que suenan completas — fundamental, 3.ª mayor, 5.ª justa',
      objectives: [
        'Construir una tríada mayor a partir de cualquier fundamental: fundamental + 3.ª mayor + 5.ª justa',
        'Leer cifrados básicos: C, G, D, F (letra sola = tríada mayor)',
        'Escuchar el carácter brillante y estable que define las tríadas mayores',
      ],
      concepts: [
        {
          title: '¿Qué es un acorde?',
          explanation:
            'Un acorde son tres o más notas sonando simultáneamente. El acorde más sencillo es la tríada — tres notas apiladas en intervalos de 3.ª. Una tríada mayor combina una fundamental, la nota una 3.ª mayor por encima de ella (4 semitonos) y la nota una 5.ª justa por encima de la fundamental (7 semitonos). C mayor = C-E-G. El cifrado es solo la letra de la fundamental: C significa C mayor.',
          tryThisLabel: 'Escucha C mayor — fundamental, tercera, quinta',
        },
        {
          title: 'Construir tríadas a partir de cualquier fundamental',
          explanation:
            'La fórmula funciona a partir de cualquier nota inicial. G mayor = G-B-D. D mayor = D-F#-A. F mayor = F-A-C. Cuenta 4 semitonos por encima de la fundamental para la 3.ª, después 3 semitonos más para la 5.ª (o 7 en total de la fundamental a la 5.ª). El carácter brillante y estable de una tríada mayor proviene de esta combinación específica de intervalos.',
          tryThisLabel: 'Construye G mayor',
        },
        {
          title: 'El sonido de la tríada mayor',
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

    // ── Track "Start with sound" (wave 2) ─────────────────────────────────
    l1u34m1: {
      title: 'Agudo y grave',
      subtitle: 'Cada nota es más aguda o más grave que otra',
      objectives: [
        'Oír si una nota es más aguda o más grave que la anterior',
        'Encontrar las notas más agudas en el piano y en la guitarra',
        'Oír la misma nota volver más aguda: la octava',
      ],
      concepts: [
        {
          title: 'Más agudo y más grave',
          explanation: 'Cada nota musical tiene una altura: lo aguda (alta) o grave (baja) que suena. Cuando se tocan dos notas, una después de otra, la segunda es más aguda, más grave o igual. No necesitas nombres para oírlo. Escucha y pregúntate si el sonido subió o bajó.',
          tryThisLabel: 'Escucha ocho notas, cada una más aguda que la anterior',
        },
        {
          title: 'Más agudo en el piano',
          explanation: 'En el piano, las notas se vuelven más agudas de izquierda a derecha. La tecla del extremo izquierdo es la nota más grave y la del extremo derecho, la más aguda. Cada tecla, blanca o negra, es una nota distinta, un poco más aguda que la tecla que tiene justo a su izquierda.',
          tryThisLabel: 'Escucha todas las teclas, blancas y negras, desde C hasta el C siguiente',
        },
        {
          title: 'Más agudo en la guitarra',
          explanation: 'En la guitarra, una nota se vuelve más aguda a medida que el dedo avanza por una cuerda hacia el cuerpo de la guitarra, traste a traste. Las cuerdas también van de grave a agudo: tocadas al aire, sin ningún dedo, la cuerda más gruesa es la que suena más grave y cada cuerda más fina suena más aguda que la de al lado.',
          tryThisLabel: 'Escucha notas que suben de grave a agudo y luego muéstralas en tu instrumento',
        },
        {
          title: 'La misma nota, más aguda',
          explanation: 'Sigue subiendo desde cualquier nota y llegarás a una nota que suena como la primera, pero más aguda. Las dos se parecen tanto que comparten nombre. Esa distancia se llama octava. En el piano son doce teclas más a la derecha, contando blancas y negras; en una cuerda de la guitarra son doce trastes más adelante.',
          tryThisLabel: 'Escucha C subir hasta el C siguiente: el mismo nombre, un sonido más agudo',
        },
      ],
      tasks: [
        { instruction: 'Toca una nota cualquiera y luego una nota a su derecha en el piano, o un traste más cerca del cuerpo en la guitarra. Escucha: la segunda nota es más aguda.' },
        { instruction: 'Toca una nota y la misma nota una octava más arriba: en el piano, doce teclas a la derecha; en la guitarra, una cuerda al aire y luego la misma cuerda en el traste 12. Escucha lo parecidas que suenan.' },
      ],
    },
    l1u34m2: {
      title: 'Las siete letras',
      subtitle: 'Las notas se llaman de A a G y luego los nombres vuelven a empezar',
      objectives: [
        'Nombrar las notas con las siete letras, de A a G',
        'Encontrar el C en el piano',
        'Nombrar las seis cuerdas al aire de la guitarra',
      ],
      concepts: [
        {
          title: 'Siete letras, una y otra vez',
          explanation: 'Las notas se nombran con siete letras: A, B, C, D, E, F y G. Después de G los nombres vuelven a empezar en A, una octava más arriba. Así, las mismas siete letras vuelven una y otra vez, cada vez más agudas. En español también se usan los nombres del solfeo: C = Do, D = Re, E = Mi, F = Fa, G = Sol, A = La, B = Si. Esta aplicación escribe las letras; en Ajustes puedes mostrar también Do, Re, Mi junto a ellas.',
          tryThisLabel: 'Escucha A, B, C, D, E, F y G, y luego otra vez A, una octava más arriba',
        },
        {
          title: 'Encontrar el C en el piano',
          explanation: 'Las teclas negras del piano van en grupos de dos y en grupos de tres. La tecla blanca justo a la izquierda de cada grupo de dos teclas negras es C. Desde C, las teclas blancas hacia la derecha son D, E, F, G, A y B, y luego otra vez C.',
          tryThisLabel: 'Escucha C, D, E, F, G, A y B, y luego otra vez C',
        },
        {
          title: 'Las cuerdas al aire de la guitarra',
          explanation: 'En una guitarra con la afinación habitual, las seis cuerdas tocadas al aire se llaman, de la más gruesa a la más fina: E, A, D, G, B y E. La más gruesa y la más fina son las dos E, a dos octavas de distancia.',
          tryThisLabel: 'Escucha las siete letras desde E: E, F, G, A, B, C, D y otra vez E',
        },
        {
          title: 'La letra siguiente',
          explanation: 'Para pasar de una letra a la siguiente, toca en el piano la tecla blanca siguiente, a la derecha: de C a D, de D a E, y así sucesivamente. En una cuerda de la guitarra, la letra siguiente está dos trastes más adelante, salvo de E a F y de B a C, que están a un solo traste.',
          tryThisLabel: 'Escucha las letras subir desde F: F, G, A, B, C, D, E y otra vez F',
        },
      ],
      tasks: [
        { instruction: 'Piano: encuentra todos los C, la tecla blanca justo a la izquierda de cada grupo de dos teclas negras, y tócalos de izquierda a derecha. Guitarra: toca las cuerdas al aire de la más gruesa a la más fina y di sus nombres.' },
        { instruction: 'Toca C, D, E, F, G, A, B y otra vez C, diciendo cada nombre mientras tocas. En el piano son las teclas blancas desde cualquier C; en la guitarra, C está en el traste 3 de la cuerda A, la segunda más gruesa.' },
      ],
    },
    l1u34m3: {
      title: 'Semitonos y tonos',
      subtitle: 'Las distancias más pequeñas entre notas y las notas que quedan en medio',
      objectives: [
        'Oír y encontrar un semitono: la nota más cercana',
        'Formar un tono con dos semitonos',
        'Nombrar las notas intermedias con sostenidos y bemoles',
      ],
      concepts: [
        {
          title: 'La nota más cercana: un semitono',
          explanation: 'La nota más cercana, por encima o por debajo de cualquier nota, está a un semitono. En el piano es la tecla inmediatamente siguiente, negra o blanca, sin nada en medio. En la guitarra es el traste siguiente en la misma cuerda. Las notas tocadas en orden, una tras otra, forman una escala: doce semitonos seguidos, todas las teclas de un C al siguiente, forman la escala cromática.',
          tryThisLabel: 'Escucha doce semitonos seguidos, desde C hasta el C siguiente',
        },
        {
          title: 'Dos semitonos: un tono',
          explanation: 'Dos semitonos forman un tono. En el piano, un tono salta una tecla: de C a D pasa por encima de la tecla negra que hay entre las dos. En la guitarra son dos trastes en la misma cuerda. Una escala hecha solo de tonos se llama escala de tonos enteros.',
          tryThisLabel: 'Escucha solo tonos, desde C hasta el C siguiente',
        },
        {
          title: 'Las notas intermedias',
          explanation: 'Entre C y D hay una nota más: la tecla negra. Tiene dos nombres. Es C sostenido (C♯), un semitono por encima de C, y D bemol (D♭), un semitono por debajo de D. Sostenido significa un semitono más agudo; bemol, un semitono más grave. Cada tecla negra tiene un nombre con sostenido y otro con bemol.',
          tryThisLabel: 'Escucha una subida desde G con una tecla negra: F♯, que también es G♭',
        },
        {
          title: 'Donde no hay tecla negra',
          explanation: 'Dos veces en cada octava, dos teclas blancas están una al lado de la otra sin tecla negra entre ellas: E y F, y B y C. Cada una de esas parejas está a solo un semitono. Todas las demás parejas de teclas blancas vecinas están a un tono, con una tecla negra en medio.',
          tryThisLabel: 'Escucha las teclas blancas desde C, con semitonos de E a F y de B a C',
        },
      ],
      tasks: [
        { instruction: 'Toca una nota cualquiera y luego la nota un semitono más aguda: la tecla siguiente en el piano o el traste siguiente en la guitarra. Después toca un tono: dos teclas más allá, o dos trastes.' },
        { instruction: 'Encuentra C sostenido: en el piano, la tecla negra justo a la derecha de C; en la guitarra, el traste 4 de la cuerda A. Di sus dos nombres: C sostenido y D bemol.' },
      ],
    },
    l1u34m4: {
      title: 'Una escala es una escalera',
      subtitle: 'La escala mayor: tono, tono, semitono, tono, tono, tono, semitono',
      objectives: [
        'Oír una escala mayor subir desde su primera nota hasta la misma nota una octava más arriba',
        'Construir una escala mayor desde cualquier nota con tonos y semitonos',
        'Oír la primera nota de la escala como la casa',
      ],
      concepts: [
        {
          title: 'Notas en orden: una escala',
          explanation: 'Una escala es un conjunto de notas tocadas en orden, como los peldaños de una escalera, desde una nota de partida hasta la misma nota una octava más arriba. Una de ellas es la escala mayor. Tiene siete notas distintas y luego la primera nota vuelve arriba.',
          tryThisLabel: 'Escucha la escala de C mayor: siete notas y luego otra vez C, arriba',
        },
        {
          title: 'Tono, tono, semitono, tono, tono, tono, semitono',
          explanation: 'La escala mayor sube en este orden de pasos: tono, tono, semitono, tono, tono, tono, semitono. Numera sus notas del 1 al 8 desde abajo: los dos semitonos van del 3 al 4 y del 7 al 8. Desde C, los pasos dan C, D, E, F, G, A, B y C: solo teclas blancas, porque los semitonos caen de E a F y de B a C.',
          tryThisLabel: 'Escucha los pasos desde C: tono, tono, semitono, tono, tono, tono, semitono',
        },
        {
          title: 'Desde cualquier nota',
          explanation: 'Empieza en cualquier nota, da los mismos pasos y obtendrás la escala mayor de esa nota. Desde G: G, A, B, C, D, E, F♯ y G. El F sube a F♯ para que el último paso, hasta G, sea un semitono y el anterior un tono. En una sola cuerda de la guitarra, los mismos pasos son 2, 2, 1, 2, 2, 2 y 1 trastes.',
          tryThisLabel: 'Escucha la escala mayor desde G, con F♯',
        },
        {
          title: 'La casa',
          explanation: 'La primera nota de la escala es su casa; los músicos la llaman tónica. A medida que la escala sube, los últimos pasos llevan el oído de vuelta a ella y, cuando llega la nota de arriba, la escala suena terminada. Si te paras una nota antes, en la séptima, suena como si aún faltara algo.',
          tryThisLabel: 'Escucha la escala mayor desde D volver a casa, hasta D',
        },
      ],
      tasks: [
        { instruction: 'Toca la escala de C mayor, desde C hasta el C siguiente, diciendo tono o semitono en cada paso mientras tocas.' },
        { instruction: 'Elige cualquier nota de partida y sube tono, tono, semitono, tono, tono, tono, semitono. En la guitarra puedes hacerlo en una sola cuerda: 2, 2, 1, 2, 2, 2 y 1 trastes. ¿Suena la nota de arriba como la casa?' },
      ],
    },
    l1u34m5: {
      title: 'Tres notas forman un acorde',
      subtitle: 'Una nota sí y otra no de la escala, tocadas a la vez',
      objectives: [
        'Construir un acorde con una nota sí y otra no de una escala',
        'Oír la diferencia entre un acorde mayor y uno menor',
        'Convertir un acorde mayor en uno menor moviendo una nota',
      ],
      concepts: [
        {
          title: 'Una nota sí y otra no',
          explanation: 'Un acorde son varias notas tocadas a la vez. El acorde más sencillo toma tres notas de una escala, saltándose una cada vez: la 1.ª, la 3.ª y la 5.ª. Desde la escala de C mayor, eso da C, E y G, el acorde de C mayor.',
          tryThisLabel: 'Escucha C, E y G juntas: el acorde de C mayor',
        },
        {
          title: 'El mayor suena luminoso',
          explanation: 'Construido así sobre la primera nota de una escala mayor, el acorde es un acorde mayor y suena luminoso y estable. G mayor es G, B y D; F mayor es F, A y C.',
          tryThisLabel: 'Escucha G mayor: G, B y D',
        },
        {
          title: 'El menor suena más oscuro',
          explanation: 'Baja un semitono la nota central de un acorde mayor y obtendrás un acorde menor. C mayor es C, E y G; C menor es C, E♭ y G. Solo cambia esa nota, y el acorde suena más oscuro.',
          tryThisLabel: 'Escucha C menor: C, E♭ y G',
        },
        {
          title: 'Hacia dónde seguir',
          explanation: 'Ya sabes oír agudo y grave, nombrar las notas, encontrar semitonos y tonos, construir una escala mayor y formar con ella acordes mayores y menores. En Explorar puedes elegir cualquier tonalidad y ver su escala y sus acordes en tu instrumento. Para leer estas notas escritas, el Nivel 1 empieza por el pentagrama, las cinco líneas en las que se escribe la música.',
          tryThisLabel: 'Escucha A menor: A, C y E',
        },
      ],
      tasks: [
        { instruction: 'Toca C, E y G a la vez; en el piano son tres teclas blancas, saltándote una tecla blanca entre cada una. Luego baja el E un semitono, a E bemol, y escucha cómo el acorde se vuelve más oscuro.' },
        { instruction: 'Construye tú un acorde desde G: la 1.ª, la 3.ª y la 5.ª notas de la escala de G mayor, G, B y D. Tócalas a la vez, o una después de otra, y luego baja el B un semitono para oír G menor.' },
      ],
    },
    // ── Track "From the chords you know" (wave 2) ─────────────────────────
    l1u35m1: {
      title: 'Tus acordes viven en una tonalidad',
      subtitle: 'G, C, D y Em comparten siete notas: las notas de G mayor',
      objectives: [
        'Encontrar las tres notas que hay dentro de acordes que ya tocas',
        'Ver que G, C, D y Em usan solo las siete notas de G mayor',
        'Decir qué es una tonalidad: una familia de siete notas y los acordes construidos con ellas',
      ],
      concepts: [
        {
          title: 'Cuatro acordes que van juntos',
          explanation: 'Toca G, C, D y Em uno detrás de otro, como cambias de acorde en una canción. Suenan como si encajaran, y hay una razón. Da igual cuántas cuerdas rasguees: cada uno de estos acordes está hecho de tres notas distintas: G es G, B y D; C es C, E y G; D es D, F♯ y A; Em es E, G y B.',
          tryThisLabel: 'Escucha G, C, D y Em, uno detrás de otro',
        },
        {
          title: 'Siete notas entre todos',
          explanation: 'Junta las notas de los cuatro acordes y deja fuera las repetidas: G, A, B, C, D, E y F♯. Son siete notas, y son exactamente las notas de la escala de G mayor: las notas de una tonalidad, tocadas en orden desde G hasta el G siguiente, son su escala. Fíjate en el F♯, que viene del acorde de D: la tonalidad de G tiene F♯ donde la tonalidad de C tiene F.',
          tryThisLabel: 'Escucha las siete notas de G mayor, de G a G',
        },
        {
          title: 'Qué es una tonalidad',
          explanation: 'Una tonalidad es una familia de siete notas y los acordes construidos con ellas. Decir que una canción está en la tonalidad de G significa que G suena como la casa y que las notas de G mayor son aquellas con las que está hecha. La tonalidad lleva el nombre de su nota de casa: la tonalidad de G, o G mayor. Los músicos llaman tónica a la nota de casa.',
          tryThisLabel: 'Mira la tonalidad de G: sus siete notas en tu instrumento',
        },
        {
          title: 'Cada tonalidad tiene su familia',
          explanation: 'Cada tonalidad mayor tiene sus propias siete notas. La tonalidad de C tiene C, D, E, F, G, A y B, sin sostenidos ni bemoles, y entre sus acordes están C, F, G y Am. La tonalidad de D tiene dos sostenidos, F♯ y C♯, y entre sus acordes están D, G, A y Bm.',
          tryThisLabel: 'Escucha acordes de la tonalidad de C: C, F, G y Am',
        },
      ],
      tasks: [
        { instruction: 'Toca G, C, D y Em, uno cada vez, y di en voz alta las tres notas de cada uno: G B D, C E G, D F♯ A, E G B.' },
        { instruction: 'Toca la escala de G mayor, de G a G, y después toca G, C y D. En la guitarra, busca el F♯ de tu acorde de D: traste 2 de la cuerda más fina.' },
      ],
    },
    l1u35m2: {
      title: 'Uno, cuatro, cinco',
      subtitle: 'Los tres acordes mayores de una tonalidad: I, IV y V',
      objectives: [
        'Numerar las notas de una tonalidad del 1 al 7',
        'Encontrar los tres acordes mayores de una tonalidad mayor: I, IV y V',
        'Oír G–C–D en G, C–F–G en C y D–G–A en D como el mismo movimiento',
      ],
      concepts: [
        {
          title: 'Numera las notas',
          explanation: 'Numera las siete notas de una tonalidad desde su nota de casa. En G, el G es 1, el A es 2, el B es 3, el C es 4, el D es 5, el E es 6 y el F♯ es 7. El número dice dónde está la nota dentro de su tonalidad, se llame como se llame.',
          tryThisLabel: 'Escucha las notas de G del 1 al 7, y otra vez el 1 arriba',
        },
        {
          title: 'Un acorde sobre cada nota',
          explanation: 'Una tonalidad tiene un acorde sobre cada una de sus siete notas, construido con las notas de la propia tonalidad. Los acordes se nombran por su número, en números romanos: I, II, III, IV, V, VI, VII. En una tonalidad mayor, los acordes sobre el 1, el 4 y el 5 son sus tres acordes mayores, escritos en mayúsculas: I, IV y V. En G son G, C y D.',
          tryThisLabel: 'Escucha I, IV, V y I en G: G, C, D y G',
        },
        {
          title: 'El mismo movimiento en todas las tonalidades',
          explanation: 'Como los números pertenecen a la tonalidad, I–IV–V–I es el mismo movimiento en cualquier tonalidad; solo cambian los nombres. En C es C, F, G y C; en D, D, G, A y D; en A, A, D, E y A; en E, E, A, B y E.',
          tryThisLabel: 'Escucha I, IV, V y I en C: C, F, G y C',
        },
        {
          title: 'Un cifrado en números',
          explanation: 'Un cifrado de acordes escrito en números sirve en todas las tonalidades. I–IV–I–V significa casa, el acorde sobre el 4, otra vez casa, el acorde sobre el 5. Elige una tonalidad, encuentra sus notas 1, 4 y 5, y ya sabes qué acordes tocar.',
          tryThisLabel: 'Escucha I, IV, I y V en D: D, G, D y A',
        },
      ],
      tasks: [
        { instruction: 'Toca I, IV, V y I en G (G, C, D, G) y después en C (C, F, G, C). ¿El movimiento se siente igual en las dos tonalidades?' },
        { instruction: 'Elige la tonalidad de una canción que toques. Sube por su escala desde el 1 hasta las notas 4 y 5 y toca sus acordes I, IV y V.' },
      ],
    },
    l1u35m3: {
      title: 'Los acordes menores de la tonalidad',
      subtitle: 'ii, iii y vi, un acorde disminuido y la relativa menor',
      objectives: [
        'Encontrar los tres acordes menores de una tonalidad mayor: ii, iii y vi',
        'Conocer el acorde disminuido sobre el 7',
        'Oír el acorde vi como la casa de la tonalidad relativa menor',
      ],
      concepts: [
        {
          title: 'Tres acordes menores',
          explanation: 'En una tonalidad mayor, los acordes sobre el 2, el 3 y el 6 son menores. Se escriben en números romanos en minúscula: ii, iii y vi. En G son Am, Bm y Em; en C, Dm, Em y Am; en D, Em, F♯m y Bm.',
          tryThisLabel: 'Escucha I, ii, iii y vi en G: G, Am, Bm y Em',
        },
        {
          title: 'El acorde sobre el 7',
          explanation: 'El acorde sobre el 7, construido con las notas de la tonalidad, es disminuido: como un acorde menor con la nota de arriba un semitono más baja, y suena tenso. Un semitono es la nota más cercana: un traste en la guitarra, la tecla inmediatamente siguiente en el piano; dos semitonos forman un tono. Se escribe vii°. En G es F♯ disminuido, F♯, A y C; en C es B disminuido, B, D y F.',
          tryThisLabel: 'Escucha el vii° de G: F♯, A y C',
        },
        {
          title: 'La familia entera',
          explanation: 'Todas las tonalidades mayores tienen el mismo patrón de siete acordes: I, ii, iii, IV, V, vi y vii°. Mayores sobre el 1, el 4 y el 5; menores sobre el 2, el 3 y el 6; disminuido sobre el 7. En G: G, Am, Bm, C, D, Em y F♯dim. En C: C, Dm, Em, F, G, Am y Bdim.',
          tryThisLabel: 'Escucha seis acordes de G: G, Am, Bm, C, D y Em',
        },
        {
          title: 'La relativa menor',
          explanation: 'El acorde Em, el vi de G, es la casa de una tonalidad propia: E menor. La tonalidad de E menor usa las mismas siete notas que G mayor, empezando en E: E, F♯, G, A, B, C y D. Dos tonalidades que comparten las siete notas son relativas: E menor es la relativa menor de G mayor. La relativa menor de C es A menor, y la de D, B menor. Cuál de las dos es la tonalidad depende del acorde que suena como la casa.',
          tryThisLabel: 'Escucha las mismas notas con Em como casa: Em, C, D y Em',
        },
      ],
      tasks: [
        { instruction: 'Toca los acordes de G en orden, G, Am, Bm, C, D y Em, y escucha cuáles son los tres que suenan más oscuros.' },
        { instruction: 'Toca Em, C, D y Em unas cuantas veces y después G, C, D y G. Las notas son las mismas: ¿qué acorde suena como la casa en cada caso?' },
      ],
    },
    l1u35m4: {
      title: 'En casa y lejos de casa',
      subtitle: 'Por qué el V lleva de vuelta al I, y el camino más suave a casa',
      objectives: [
        'Oír el I como la casa y el V como un acorde que quiere volver a él',
        'Encontrar la nota que tira: la 7.ª nota de la tonalidad, un semitono por debajo de la casa',
        'Oír el paso del IV al I como un camino más suave a casa',
      ],
      concepts: [
        {
          title: 'Casa',
          explanation: 'El I es la casa. Cuando una secuencia de acordes vuelve al I, suena asentada, como una escala suena terminada en su nota de arriba. Si paras la secuencia en el V, el acorde sobre el 5, suena como si aún faltara algo.',
          tryThisLabel: 'Escucha G, C, D y de vuelta a casa, a G',
        },
        {
          title: 'El V tira hacia el I',
          explanation: 'El V es el que tira con más fuerza hacia casa. En G, el acorde V, D, tiene F♯: la 7.ª nota de la tonalidad, un semitono por debajo de G. Una nota tan cerca de casa se inclina hacia ella, y el oído quiere que el F♯ suba a G y que el acorde de D pase a G. Toca D y para: suena sin terminar.',
          tryThisLabel: 'Escucha G, después D inclinándose hacia casa, después G',
        },
        {
          title: 'La misma atracción en todas las tonalidades',
          explanation: 'En todas las tonalidades mayores, el V tiene la 7.ª nota de la tonalidad, un semitono por debajo de la casa. En C, el acorde de G tiene B, por debajo de C; en D, el acorde de A tiene C♯, por debajo de D; en A, el acorde de E tiene G♯, por debajo de A; en E, el acorde de B tiene D♯, por debajo de E.',
          tryThisLabel: 'Escucha el acorde de G, con B un semitono por debajo de C, entre dos acordes de C: C, G y C',
        },
        {
          title: 'Del IV al I: el camino más suave',
          explanation: 'El IV también lleva a casa, con más suavidad. En G, C va a G: el acorde de C no tiene ninguna nota un semitono por debajo de G, así que nada se inclina hacia la casa, y el movimiento suena tranquilo en lugar de urgente. Desde el V, volver a casa suena como una llegada; desde el IV, como asentarse.',
          tryThisLabel: 'Escucha G, C y G: del IV al I',
        },
      ],
      tasks: [
        { instruction: 'Toca G, C, D y para en el D. Espera y después toca G. Luego toca G, D, C, para en el C y después toca G. ¿Cuál de las paradas sonó más sin terminar?' },
        { instruction: 'Toca D y después F♯ y G, una nota tras otra: en la guitarra, trastes 2 y 3 de la cuerda más fina. Escucha cómo el F♯ se inclina hacia G.' },
      ],
    },
    l1u35m5: {
      title: 'Mayor y menor: una nota',
      subtitle: 'La nota del medio, un semitono más baja',
      objectives: [
        'Encontrar la única nota que cambia entre un acorde mayor y el acorde menor sobre la misma nota',
        'Moverla en la guitarra, un traste más abajo, o en el piano, una tecla más abajo',
        'Distinguir de oído un acorde mayor de uno menor',
      ],
      concepts: [
        {
          title: 'Una nota de diferencia',
          explanation: 'G mayor es G, B y D; G menor es G, B♭ y D. Solo cambia la nota del medio, y baja un semitono. Lo mismo pasa con todos los acordes mayores y el acorde menor sobre la misma nota: C y Cm, D y Dm, E y Em, A y Am.',
          tryThisLabel: 'Escucha G y después Gm',
        },
        {
          title: 'Un traste más abajo',
          explanation: 'En la guitarra, un semitono es un traste, así que la cuerda que toca la nota del medio baja un traste. De E a Em: la cuerda G pasa del traste 1 a tocarse al aire. De A a Am: la cuerda B pasa del traste 2 al traste 1. De D a Dm: la cuerda más fina pasa del traste 2 al traste 1. En las formas abiertas de G y de C, la nota del medio está también en una cuerda al aire, que no puede bajar, así que Gm y Cm necesitan otras formas. En el piano, la nota del medio pasa a la tecla inmediatamente inferior.',
          tryThisLabel: 'Escucha E y después Em: una nota baja un semitono',
        },
        {
          title: 'Brillante y oscuro',
          explanation: 'Los acordes mayores suenan más brillantes y los menores más oscuros, y esa única nota es toda la diferencia. También por eso una tonalidad tiene los dos tipos: en G, el acorde sobre el 1 recibe B como nota del medio y es G mayor, mientras que el acorde sobre el 2 recibe C, y no C♯, y es A menor.',
          tryThisLabel: 'Escucha C♯ convertirse en C: A y después Am',
        },
      ],
      tasks: [
        { instruction: 'Toca E y después Em, y fíjate en qué dedo se mueve. Haz lo mismo con A y Am, y con D y Dm.' },
        { instruction: 'Toca G y después G menor. En la guitarra, prueba Gm con una cejilla en el traste 3; en el piano, baja el B de G mayor una tecla, a B♭.' },
      ],
    },
    l1u35m6: {
      title: 'Qué hay dentro de un acorde',
      subtitle: '1, 3 y 5: una nota sí y otra no, desde la nota del acorde',
      objectives: [
        'Construir un acorde con una nota sí y otra no de una escala: 1, 3 y 5',
        'Nombrar la fundamental, la 3.ª y la 5.ª de un acorde que tocas',
        'Entender por qué seis cuerdas dan solo tres notas distintas',
      ],
      concepts: [
        {
          title: 'Una nota sí y otra no',
          explanation: 'Para un acorde mayor, empieza en su nota y toma una nota sí y otra no de su escala mayor: la 1.ª, la 3.ª y la 5.ª. Desde G: G, salta A, B, salta C, D. Así, G mayor es G, B y D. Desde C da C, E y G; desde D, D, F♯ y A. Un acorde menor ocupa los mismos tres lugares, con su 3.ª un semitono más baja.',
          tryThisLabel: 'Escucha G, B y D juntas: G mayor',
        },
        {
          title: 'Fundamental, tercera y quinta',
          explanation: 'Las tres notas tienen nombre. La fundamental, 1, es la nota del propio acorde y le da su nombre. La tercera, 3, lo hace mayor o menor: es la nota del medio que moviste en la lección anterior. La quinta, 5, es la más aguda de las tres cuando se apilan desde la fundamental.',
          tryThisLabel: 'Escucha D mayor: D, F♯ y A',
        },
        {
          title: 'Seis cuerdas, tres notas',
          explanation: 'Un acorde de G abierto suena en seis cuerdas, pero tiene solo tres notas distintas. Desde la cuerda más gruesa: G, B, D, G, B y G. El Em abierto es E, B, E, G, B y E. Las notas se repiten en otras octavas, lo que hace que el acorde suene más lleno; siguen siendo las mismas tres notas.',
          tryThisLabel: 'Escucha Em: E, G y B, las toquen pocas cuerdas o muchas',
        },
        {
          title: 'La misma receta para todos los acordes de la tonalidad',
          explanation: 'Una nota sí y otra no sirve para todos los acordes de una tonalidad, con las notas de la propia tonalidad. En G, desde el 2 da A, C y E, el acorde de A menor; desde el 7 da F♯, A y C, el acorde de F♯ disminuido. Son las notas de la tonalidad las que deciden el tipo de cada acorde.',
          tryThisLabel: 'Escucha Am: A, C y E',
        },
      ],
      tasks: [
        { instruction: 'Toca un acorde de G abierto cuerda a cuerda, desde la más gruesa, y nombra cada nota: G, B, D, G, B, G.' },
        { instruction: 'Elige un acorde mayor que conozcas y di su fundamental. Cuenta una nota sí y otra no de la escala mayor de esa fundamental para encontrar su 3.ª y su 5.ª, y toca las tres notas una tras otra.' },
      ],
    },
    l1u35m7: {
      title: 'La séptima',
      subtitle: 'Una cuarta nota encima: G7 es G, B, D y F',
      objectives: [
        'Construir un acorde de séptima: 1, 3, 5 y una séptima',
        'Entender por qué G7 tira hacia C',
        'Tocar los tres acordes de un blues de doce compases: I7, IV7 y V7',
      ],
      concepts: [
        {
          title: 'Una cuarta nota',
          explanation: 'Un acorde de séptima añade una cuarta nota a las tres: una séptima por encima de la fundamental, la séptima letra contando la fundamental como la primera. G7 es G, B, D y F. El F está un tono por debajo del G de arriba, y esa es la séptima que indica un simple 7 en el nombre de un acorde.',
          tryThisLabel: 'Escucha G7: G, B, D y F',
        },
        {
          title: 'G7 tira hacia C',
          explanation: 'El F no es una de las notas de G mayor, pero sí de C mayor: G, B, D y F pertenecen todas a C. En C, G es el acorde V, así que G7 es el V de C con una séptima, y tira hacia C con más fuerza aún que G: su B quiere subir a C y su F bajar a E.',
          tryThisLabel: 'Escucha G7 y después C',
        },
        {
          title: 'El V7 en cada tonalidad',
          explanation: 'Cada tonalidad tiene su V7: el acorde sobre el 5 con esta séptima. El acorde sobre el 5 se llama dominante, así que un acorde como G7 o D7 se llama acorde de séptima de dominante. D7, con D, F♯, A y C, tira hacia G. E7, con E, G♯, B y D, tira hacia A. B7, con B, D♯, F♯ y A, tira hacia E.',
          tryThisLabel: 'Escucha D7 y después G',
        },
        {
          title: 'El blues de doce compases',
          explanation: 'El blues de doce compases es un patrón de doce compases sobre tres acordes, I, IV y V. En un blues, los tres pueden tocarse como acordes de séptima: I7, IV7 y V7. Aquí las séptimas no llevan a otra tonalidad; forman parte del sonido. Una de sus formas, en G: G7 durante cuatro compases, C7 durante dos, G7 durante dos, y después D7, C7, G7 y D7, un compás cada uno.',
          tryThisLabel: 'Escucha los doce compases en G, un acorde por compás',
        },
      ],
      tasks: [
        { instruction: 'Toca G7 y después C, y luego G y después C. ¿Cuál de los dos se inclina más hacia C?' },
        { instruction: 'Toca el blues de doce compases en G, cuatro rasgueos por compás: G7 durante cuatro compases, C7 durante dos, G7 durante dos, y después D7, C7, G7 y D7.' },
      ],
    },
    l1u35m8: {
      title: 'Transportar una canción: otras tonalidades y el capo',
      subtitle: 'Los números se quedan, los nombres cambian',
      objectives: [
        'Pasar una progresión de acordes a otra tonalidad por sus números',
        'Averiguar en qué tonalidad suenan tus formas con un capo',
        'Tocar la misma secuencia en dos tonalidades',
      ],
      concepts: [
        {
          title: 'Los números se quedan',
          explanation: 'Escribe los acordes de una canción en números y podrás tocarla en cualquier tonalidad. I–V–vi–IV es G, D, Em y C en G. En A es A, E, F♯m y D; en C, C, G, Am y F; en D, D, A, Bm y G.',
          tryThisLabel: 'Escucha I, V, vi y IV en G: G, D, Em y C',
        },
        {
          title: 'Los nombres cambian',
          explanation: 'Para pasar una canción de G a A, sube todos los acordes la misma distancia. De G a A hay un tono, así que D pasa a E, Em pasa a F♯m y C pasa a D. Cuéntalo en números o en trastes: el resultado es el mismo.',
          tryThisLabel: 'Escucha la misma secuencia en A: A, E, F♯m y D',
        },
        {
          title: 'Qué hace un capo',
          explanation: 'Un capo pisa las seis cuerdas en un traste, así que cada forma que tocas suena más aguda, un semitono por cada traste hasta el capo. Con el capo en el traste 2, la forma de G suena A, la de C suena D, la de D suena E y la de Em suena F♯m. Las formas de G con el capo en el traste 2 suenan en la tonalidad de A.',
          tryThisLabel: 'Escucha las formas de G, C, D y G con el capo en el traste 2: A, D, E y A',
        },
        {
          title: 'Forma y sonido',
          explanation: 'Con un capo, cada acorde tiene dos nombres: la forma que haces con los dedos y el acorde que suena. La tonalidad es la que suena. Las formas de C con el capo en el traste 4 están en la tonalidad de E; las formas de D con el capo en el traste 5 están en la tonalidad de G. Un cifrado puede estar escrito de cualquiera de las dos maneras, así que comprueba cuál usa.',
          tryThisLabel: 'Mira la tonalidad de E: dónde suenan las formas de C con el capo en el traste 4',
        },
      ],
      tasks: [
        { instruction: 'Toca G, D, Em y C y después la misma secuencia en A: A, E, F♯m y D. En la guitarra, F♯m puede ser una cejilla en el traste 2.' },
        { instruction: 'Pon un capo en el traste 2 y toca tus formas de G, D, Em y C. Suenan A, E, F♯m y D: compáralas con la secuencia en A que tocaste sin capo.' },
      ],
    },
    l1u35m9: {
      title: 'Notas para una melodía o un solo',
      subtitle: 'Las siete notas de la tonalidad, y cinco notas seguras',
      objectives: [
        'Saber qué notas van con los acordes de una tonalidad',
        'Tocar la pentatónica mayor: cinco notas de la tonalidad',
        'Encontrar la pentatónica menor desde la nota de casa de la relativa menor',
      ],
      concepts: [
        {
          title: 'Las notas de la tonalidad',
          explanation: 'Todos los acordes de una tonalidad están hechos con sus siete notas, así que una melodía o un solo hecho con las mismas notas va con ellos. En G son G, A, B, C, D, E y F♯. Mantenidas sobre algunos acordes, unas pocas pueden chocar, pero ninguna está fuera de la tonalidad.',
          tryThisLabel: 'Escucha las siete notas de G',
        },
        {
          title: 'Cinco notas seguras',
          explanation: 'Deja fuera las notas 4 y 7 y quedan cinco: 1, 2, 3, 5 y 6. Es la escala pentatónica mayor; en G, G, A, B, D y E. Las notas 4 y 7 están cada una a un semitono de una nota del acorde I, el C por encima del B y el F♯ por debajo del G, y el semitono es la distancia a la que dos notas chocan más. Ninguna de las cinco está a un semitono de otra, ni de una nota del acorde I, así que son una primera opción segura sobre el acorde de casa. Sobre los demás acordes, alguna aún puede chocar con una nota del acorde, así que escucha.',
          tryThisLabel: 'Escucha la pentatónica mayor de G: G, A, B, D y E',
        },
        {
          title: 'Las mismas cinco desde la relativa menor',
          explanation: 'Toca las mismas cinco notas desde E, la nota de casa de la relativa menor de G, y quedan E, G, A, B y D: la pentatónica menor de E. Es el mismo conjunto de notas que la pentatónica mayor de G, así que, sobre los acordes de G mayor o de E menor, los dos nombres dan las mismas cinco notas.',
          tryThisLabel: 'Escucha la pentatónica menor de E: E, G, A, B y D',
        },
        {
          title: 'En otras tonalidades',
          explanation: 'En C, la pentatónica mayor es C, D, E, G y A, y la pentatónica menor de su relativa, A menor, es A, C, D, E y G. En D es D, E, F♯, A y B, y la pentatónica menor de B es B, D, E, F♯ y A.',
          tryThisLabel: 'Escucha la pentatónica menor de A: A, C, D, E y G',
        },
      ],
      tasks: [
        { instruction: 'Toca la pentatónica mayor de G subiendo y bajando: G, A, B, D, E y G. Después toca G, C o D y responde a cada acorde con una de las cinco notas, escuchando si alguna choca.' },
        { instruction: 'Toca la pentatónica menor de E: E, G, A, B, D y E. En la guitarra está en las cuerdas al aire y en los trastes 2 y 3: cuerda más gruesa 0 y 3, después 0 y 2 en las tres cuerdas siguientes, después 0 y 3 en las dos últimas.' },
      ],
    },
    l1u35m10: {
      title: 'Un acorde de fuera',
      subtitle: 'Acordes de fuera de la tonalidad, y cómo saber la tonalidad de todos modos',
      objectives: [
        'Reconocer un acorde que no es uno de los siete de la tonalidad',
        'Llamar ♭VII al F en la tonalidad de G, y II, no ii, a A mayor',
        'Saber la tonalidad de una canción por su acorde de casa',
      ],
      concepts: [
        {
          title: 'No todos los acordes están en la tonalidad',
          explanation: 'Las canciones no siempre se quedan en los siete acordes de su tonalidad. Un acorde con una nota que la tonalidad no tiene viene de fuera. Puedes reconocerlo por sus notas: si una de ellas no está en la tonalidad, el acorde no es uno de los siete de la tonalidad.',
          tryThisLabel: 'Escucha una secuencia con un acorde de fuera de la tonalidad: G, F, C y G',
        },
        {
          title: 'F en la tonalidad de G: ♭VII',
          explanation: 'F mayor es F, A y C. La tonalidad de G tiene F♯, no F, así que F no es uno de sus acordes. Está sobre la 7.ª nota de la tonalidad bajada un semitono, F en lugar de F♯, y es mayor, así que se escribe ♭VII. F mayor es uno de los acordes de G menor, la tonalidad menor con la misma nota de casa, así que F se llama un acorde prestado: prestado de G menor.',
          tryThisLabel: 'Escucha F: F, A y C, con F en lugar de F♯',
        },
        {
          title: 'El acorde de A mayor en G: II, no ii',
          explanation: 'El ii de G es A menor: A, C y E. El acorde de A mayor tiene C♯ en lugar de C, una nota que G mayor no tiene, así que no es el ii de la tonalidad: se escribe II, en mayúsculas, por ser un acorde mayor. Su C♯ está un semitono por debajo de D, así que A mayor se inclina hacia D, el V, como el V se inclina hacia el I.',
          tryThisLabel: 'Escucha A mayor inclinarse hacia D: G, A, D y G',
        },
        {
          title: 'Saber la tonalidad de todos modos',
          explanation: 'Un acorde de fuera no cambia la tonalidad. Busca el acorde al que la canción vuelve una y otra vez y en el que reposa, y después comprueba que los demás acordes pertenecen a esa tonalidad. G, F, C y G sigue en G: G es la casa, y C también pertenece a G. G, F y C también son todos acordes de C mayor, así que aquí decide el oído: la secuencia reposa en G, no en C. Desde aquí, Explorar muestra cualquier tonalidad con sus acordes, y el Nivel 2 va más allá en las tonalidades y en cómo funcionan juntos los acordes.',
          tryThisLabel: 'Mira la tonalidad de G y sus notas en tu instrumento',
        },
      ],
      tasks: [
        { instruction: 'Toca G, F, C y G y después G, C, D y G. ¿Qué secuencia tiene un acorde de fuera de la tonalidad de G, y qué nota lo delata?' },
        { instruction: 'Toma una canción que toques. Encuentra su acorde de casa, compara cada acorde con los acordes de esa tonalidad y marca cualquier acorde de fuera con la nota que no está en la tonalidad.' },
      ],
    },
  },
};

export default curriculumL1;
