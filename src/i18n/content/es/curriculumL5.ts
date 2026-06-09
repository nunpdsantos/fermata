import type { CurriculumLevelOverlay } from '../types';

const curriculumL5: CurriculumLevelOverlay = {
  // ─── Unidades ─────────────────────────────────────────────────────────────
  units: {
    u15: {
      title: 'Dominantes Secundarias y Tonicización',
      description:
        'Dominantes aplicadas, acordes de sensible secundaria, tonicización y cadenas de dominantes',
    },
    u16: {
      title: 'Modulación y Mezcla Modal',
      description:
        'Modulación por acorde pivote, tonalidades cercanas, otros tipos de modulación y mezcla modal',
    },
    u17: {
      title: 'Forma, Textura y Conducción de Voces',
      description:
        'Formas musicales, tipos de textura y conducción de voces por notas guía',
    },
  },

  // ─── Módulos ──────────────────────────────────────────────────────────────
  modules: {
    // ── U15 M1: Dominantes Secundarias V/V ────────────────────────────────
    l5u15m1: {
      title: 'Dominantes Secundarias: V/V y V7/V',
      subtitle: 'La dominante de la dominante — tu primer acorde aplicado',
      objectives: [
        'Comprender qué significa «V de algo» (tonicizar temporalmente un acorde diatónico)',
        'Construir y resolver V/V y V7/V en tonalidades mayores',
        'Identificar la nota cromática (4.º grado elevado) que crea la sensible de V',
      ],
      concepts: [
        {
          title: 'La Idea Central: V de V',
          explanation:
            'Cualquier acorde diatónico (excepto el disminuido) puede ser tratado temporalmente como «tónica» y recibir su propia dominante. V/V significa «la dominante de la dominante». En Do mayor, V = Sol mayor. La dominante de Sol es Re mayor. Re mayor contiene Fa# — una nota cromática que funciona como sensible de Sol. Esta es la forma más sencilla de cromatismo: tomar prestada una nota ajena a la tonalidad para reforzar el movimiento hacia un acorde diatónico.',
          tryThisLabel: 'Escucha Re mayor — el V/V en Do mayor',
        },
        {
          title: 'V7/V — Añadir la Séptima',
          explanation:
            'La versión con séptima, V7/V, es aún más frecuente que la tríada. V7/V en Do mayor = D7 (Re–Fa#–La–Do). El trítono Fa#–Do resuelve hacia fuera, a Sol–Si. La séptima aporta la fuerza de atracción que hace tan eficaces a las dominantes secundarias. En D7 resolviendo a Sol: Fa# asciende a Sol (resolución de la sensible), Do desciende a Si (la séptima resuelve por grado descendente). Son las mismas reglas de conducción de voces de V7 a I, aplicadas a V como objetivo temporal.',
          tryThisLabel: 'Escucha D7 — el V7/V en Do mayor',
        },
        {
          title: 'Resolución y Conducción de Voces',
          explanation:
            'Las dominantes secundarias siguen las mismas reglas de resolución que V7 a I. La «sensible» cromática resuelve medio tono arriba hacia la fundamental del objetivo. La séptima (si está presente) resuelve por grado descendente. En D7 resolviendo a Sol: Fa# sube a Sol, Do baja a Si. El trítono Fa#–Do resuelve hacia fuera, a Sol–Si. Las notas cromáticas casi siempre resuelven en la dirección en que fueron alteradas — los sostenidos suben, los bemoles bajan.',
          tryThisLabel: 'Escucha el objetivo Sol tras D7',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "D major chord" — este es V/V en Do mayor. El Fa# es la única nota cromática. Funciona como sensible de Sol.',
        },
        {
          instruction:
            'Escribe "D7" y después "G major chord" — escucha cómo D7 crea una fuerte atracción hacia Sol. El trítono Fa#–Do dentro de D7 resuelve hacia fuera, a Sol–Si.',
        },
        {
          instruction:
            'Compara "D major chord" (tríada V/V) con "D7" (V7/V). La versión con séptima tiene más tensión por el trítono. Ambos apuntan a Sol, pero D7 exige resolución con más urgencia.',
        },
      ],
    },

    // ── U15 M2: Dominantes Secundarias de ii, iii, IV, vi ─────────────────
    l5u15m2: {
      title: 'Dominantes Secundarias de ii, iii, IV, vi',
      subtitle: 'Dominantes aplicadas para cada objetivo diatónico',
      objectives: [
        'Construir y resolver V/ii, V/iii, V/IV y V/vi en tonalidades mayores',
        'Identificar la nota cromática en cada dominante secundaria',
        'Reconocer que V/IV usa las mismas notas que I (el contexto determina la función)',
      ],
      concepts: [
        {
          title: 'Dominantes Secundarias para Cada Objetivo',
          explanation:
            'Cada acorde diatónico (excepto viio) tiene su propia dominante secundaria. V/ii = A(7) apuntando a Dm, con Do# cromático. V/iii = B(7) apuntando a Em, con Re# y Fa# cromáticos. V/IV = C(7) apuntando a Fa — mismas notas que I, distinguido solo por el contexto. V/vi = E(7) apuntando a Am, con Sol# cromático. La versión con séptima (V7/X) es más habitual porque el trítono que contiene crea una atracción más fuerte hacia el objetivo.',
          tryThisLabel: 'Escucha A7 — el V7/ii en Do mayor',
        },
        {
          title: 'El Caso Especial: V/IV',
          explanation:
            'V/IV en Do mayor es Do–Mi–Sol — notas idénticas a la tríada de la tónica. La distinción es puramente contextual: si Do mayor va seguido de Fa mayor, funciona como V/IV en lugar de I. Añadir la séptima aclara la función: V7/IV = C7 (Do–Mi–Sol–Sib). El Sib es cromático en Do mayor y forma un trítono con Mi que tira hacia Fa. Por ello, V7/IV es mucho más frecuente que la tríada — la séptima elimina la ambigüedad.',
          tryThisLabel: 'Escucha C7 — el V7/IV en Do mayor (observa el Sib)',
        },
        {
          title: 'Notas Cromáticas y Sus Objetivos',
          explanation:
            'Cada dominante secundaria introduce notas cromáticas específicas. V7/ii trae Do# (sensible de Re). V7/iii trae Re# (sensible de Mi). V7/IV trae Sib (séptima por encima de Do, que tira hacia La en Fa mayor). V7/vi trae Sol# (sensible de La). Estas notas cromáticas resuelven siempre en la dirección en que fueron alteradas: los sostenidos suben, los bemoles bajan. Aprender a oír estas inflexiones cromáticas es la clave para identificar las dominantes secundarias.',
          tryThisLabel: 'Escucha E7 — el V7/vi en Do mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "A7" — este es V7/ii en Do mayor. El Do# funciona como sensible de Re. Ahora escribe "Dm" para escuchar la resolución.',
        },
        {
          instruction:
            'Escribe "E7" — este es V7/vi en Do mayor. El Sol# tira hacia La. Compara con "Em" (iii diatónico) — E7 tiene mucha más tensión por el Sol# cromático.',
        },
        {
          instruction:
            'Escribe "C7" — este es V7/IV en Do mayor. El Sib es la pista de que no está funcionando como acorde de tónica. Ahora escribe "F major chord" para escuchar la resolución.',
        },
      ],
    },

    // ── U15 M3: Acordes de Sensible Secundaria ───────────────────────────
    l5u15m3: {
      title: 'Acordes de Sensible Secundaria',
      subtitle: 'Construir y resolver acordes viio/X',
      objectives: [
        'Construir viio/X y viio7/X para cada acorde diatónico objetivo',
        'Comprender la elección entre acordes de sensible secundaria semidisminuidos y totalmente disminuidos',
        'Resolver correctamente los acordes de sensible secundaria',
      ],
      concepts: [
        {
          title: '¿Qué Son los Acordes de Sensible Secundaria?',
          explanation:
            'Igual que V puede «aplicarse» a cualquier acorde diatónico, lo mismo ocurre con viio. Se construye una tríada disminuida (o acorde de séptima) sobre la nota un semitono por debajo de la fundamental del objetivo. viio/V en Do mayor = Fa#dim (Fa#–La–Do), apuntando a Sol. viio/ii = Do#dim (Do#–Mi–Sol), apuntando a Dm. El acorde de sensible es un sustituto de la dominante — comparte el mismo trítono que el V7 correspondiente, pero carece de la fundamental.',
          tryThisLabel: 'Escucha Fa#dim — viio/V en Do mayor',
        },
        {
          title: 'Totalmente Disminuido vs. Semidisminuido',
          explanation:
            'viio7/X (totalmente disminuido) es el más intenso de los dos, y la elección entre ellos depende del acorde que se toniciza y no del modo de la tonalidad de partida: los objetivos menores reciben el viio7/X totalmente disminuido, mientras que los objetivos mayores pueden abordarse tanto con viio7/X como con el más suave viiø7/X — los acordes secundarios totalmente disminuidos también son habituales en tonalidades mayores. Todos los intervalos del viio7 son terceras menores, lo que hace al acorde simétrico — cualquier nota puede funcionar como fundamental. Esa simetría permite la reinterpretación enarmónica, lo que se vuelve importante para las modulaciones a tonalidades lejanas en el Nivel 6.',
          tryThisLabel: 'Escucha Bdim7 — un acorde de séptima totalmente disminuida',
        },
        {
          title: 'Resolución y Comparación con V/X',
          explanation:
            'La fundamental del acorde de sensible secundaria resuelve un semitono arriba hacia la fundamental del objetivo, igual que la sensible diatónica resuelve hacia la tónica. Todas las demás voces resuelven por grado o por nota común, siguiendo los patrones estándar de resolución de acordes disminuidos. Al comparar V7/X con viio7/X apuntando al mismo acorde, se revela un trítono compartido pero un movimiento diferente en el bajo: V7/X mueve el bajo una quinta descendente (fuerte), mientras que viio7/X mueve el bajo un semitono ascendente (suave y cromático). La elección depende del contexto — V/X es más enfático, viio/X es más sutil.',
          tryThisLabel: 'Escucha Do#dim — viio/ii en Do mayor, apuntando a Dm',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "F#dim" y después "G major chord" — el Fa# tira un semitono arriba hacia Sol. Compara con "D7" resolviendo a "G" — ambos apuntan a Sol pero con diferente movimiento en el bajo.',
        },
        {
          instruction:
            'Escribe "G#dim7" — este es viio7/vi en Do mayor. El Sol# es la sensible de La. Ahora escribe "Am" para escuchar la resolución.',
        },
        {
          instruction:
            'Compara "E7" (V7/vi) con "G#dim7" (viio7/vi) — ambos apuntan a Am, pero el acorde disminuido tiene un enfoque más suave y cromático.',
        },
      ],
    },

    // ── U15 M4: Tonicización vs. Modulación ────────────────────────────
    l5u15m4: {
      title: 'Tonicización vs. Modulación',
      subtitle: 'Distinguir una tonicización breve de un cambio permanente de tonalidad',
      objectives: [
        'Distinguir la tonicización de la modulación (cambio breve vs. permanente de tonalidad)',
        'Reconocer la tonicización como una dominante secundaria que resuelve en su objetivo',
        'Identificar la tonicización prolongada (ii/V a V7/V a V)',
      ],
      concepts: [
        {
          title: 'Tonicización vs. Modulación',
          explanation:
            'La tonicización es un énfasis breve y momentáneo sobre un acorde no tónica. Uno o dos acordes «apuntan» al objetivo y después la música regresa a la tonalidad original. Sin cambio de armadura de clave, sin cadencia en la nueva tonalidad. La modulación es un cambio efectivo de tonalidad que persiste — confirmado por una cadencia en la nueva tonalidad. La regla práctica: si hay una cadencia en la nueva tonalidad, es modulación. Si es solo V/X resolviendo a X, es tonicización.',
          tryThisLabel: 'Observa Do mayor — la tonalidad de origen a la que regresar',
        },
        {
          title: 'Tonicización Breve vs. Prolongada',
          explanation:
            'Un único V7/X resolviendo a X es una tonicización breve. Pero varios acordes pueden funcionar en la «tonalidad temporal». ii/V a V7/V a V crea un mini ii–V–I en la tonalidad de V. La tonalidad temporal tiene su propia predominante y dominante, pero la música regresa a la tónica original. La tonicización prolongada difumina la frontera con la modulación — la distinción depende de si la música cadencia y permanece en la nueva tonalidad.',
          tryThisLabel: 'Observa Sol mayor — objetivo habitual de tonicización desde Do',
        },
        {
          title: 'Analizar Tonicizaciones en Música Real',
          explanation:
            'Al analizar un pasaje con dominantes secundarias, se marca la región tonicizada entre corchetes y se indica tanto la función local como la función en la tonalidad de origen. En Do mayor, el pasaje C–D7–G–C se analiza como I–[V7/V–V]–I, donde los corchetes muestran la zona tonicizada. La cadencia V7–I al final confirma Do como la verdadera tónica. Si el pasaje hubiera continuado en Sol con una cadencia (D7–G como V7–I en Sol), el análisis pasaría a ser modulación. La prueba de la cadencia es la línea divisoria fiable entre tonicización y modulación en el análisis real.',
          tryThisLabel: 'D7 toniciza Sol pero no modula a Sol',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" y piensa: si escuchas D7 seguido de G7 seguido de C, el D7 toniciza brevemente Sol, pero la música regresa a Do. Eso es tonicización, no modulación.',
        },
        {
          instruction:
            'Piensa en una tonicización prolongada: Am7 (ii/V) para D7 (V7/V) para G (V). Tres acordes funcionan en la tonalidad de Sol, pero la música regresa a Do. Sigue siendo tonicización porque no hay cadencia en Sol.',
        },
        {
          instruction:
            'Ahora imagina: D7 a G, después Am a D7 a G con una CAP en Sol mayor. La cadencia en Sol confirma que es una modulación, no una tonicización. La cadencia es la línea divisoria.',
        },
      ],
    },

    // ── U15 M5: Cadenas de Dominantes ─────────────────────────────────────
    l5u15m5: {
      title: 'Cadenas de Dominantes y Tonicización Secuencial',
      subtitle: 'Cadenas de dominantes aplicadas descendentes por quintas',
      objectives: [
        'Construir cadenas de dominantes secundarias (cada dominante resuelve en la siguiente)',
        'Comprender la tonicización secuencial como un patrón de quintas descendentes con dominantes aplicadas',
        'Trazar cadenas de dominantes en el Círculo de Quintas',
      ],
      concepts: [
        {
          title: 'Cadenas de Dominantes Secundarias',
          explanation:
            'Una cadena de dominantes en la que cada una resuelve en la siguiente: V7/vi a V7/ii a V7/V a V7 a I. Cada acorde es la dominante del siguiente, creando un intenso impulso cromático descendente por quintas. En Do mayor: E7 apunta a Am, A7 apunta a Dm, D7 apunta a G, G7 apunta a C. La cadena sigue el Círculo de Quintas en sentido antihorario. Esta técnica genera un poderoso movimiento hacia adelante a través de tensión cromática acumulada.',
          tryThisLabel: 'Observa el Círculo de Quintas que siguen las cadenas',
        },
        {
          title: 'Tonicización Secuencial',
          explanation:
            'Una secuencia armónica en la que cada paso toniciza el siguiente acorde diatónico. Quintas descendentes con dominantes secundarias: V7/IV a IV, V7/iii a iii, V7/ii a ii, V7 a I. Cada par es un V–I en miniatura en una tonalidad temporal. El patrón secuencial crea un ritmo armónico predecible mientras las notas cromáticas aportan color. Esta técnica es habitual en secuencias barrocas y turnarounds de jazz.',
          tryThisLabel: 'Observa Do mayor — traza los objetivos diatónicos a lo largo de la secuencia',
        },
        {
          title: 'Cadenas de Dominantes en la Práctica',
          explanation:
            'La cadena más habitual en el jazz y la música popular es la progresión «cuenta atrás»: III7–VI7–II7–V7–I (en Do: E7–A7–D7–G7–C). Cada acorde de séptima de dominante resuelve una quinta descendente hacia el siguiente. Esta es la columna vertebral de los puentes de rhythm changes, turnarounds de jazz e innumerables progresiones pop. La cadena funciona porque cada resolución es un V7–I satisfactorio, y el movimiento global conduce de forma implacable hacia la tónica.',
          tryThisLabel: 'Escucha G7 — la dominante final antes de la tónica en cualquier cadena',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre el Círculo de Quintas y traza una cadena de dominantes: E7 apunta a Am, A7 apunta a Dm, D7 apunta a G, G7 apunta a C. Cada paso es una quinta — la cadena sigue el círculo en sentido antihorario.',
        },
        {
          instruction:
            'Escribe "D7", después "G7", después "Cmaj7" — esta es una cadena de dominantes. D7 toniciza Sol, G7 toniciza Do. La resolución final a Cmaj7 confirma Do como la verdadera tónica.',
        },
        {
          instruction:
            'Piensa en la cadena completa: E7 a A7 a D7 a G7 a C. Cinco acordes, cuatro resoluciones de dominante, cada una descendente por quinta. Cada nota cromática resuelve en el acorde objetivo siguiente.',
        },
      ],
    },

    // ── U16 M1: Modulación por Acorde Pivote ──────────────────────────────
    l5u16m1: {
      title: 'Modulación por Acorde Pivote',
      subtitle: 'Encontrar acordes compartidos entre tonalidades para modular con suavidad',
      objectives: [
        'Comprender el concepto de acorde pivote (un acorde con función válida en ambas tonalidades)',
        'Encontrar acordes pivote entre dos tonalidades cercanas cualesquiera',
        'Analizar el proceso modulatorio: establecer la tonalidad 1, pivote, confirmar la tonalidad 2',
      ],
      concepts: [
        {
          title: 'El Acorde Pivote',
          explanation:
            'Un acorde pivote tiene un análisis válido en cifrado romano tanto en la tonalidad antigua como en la nueva. Es la «bisagra» — el oyente lo reinterpreta. En una modulación de Do mayor a Sol mayor, el acorde Am es vi en Do y ii en Sol. Si la música pivota a través de Am, el oído pasa de escuchar vi en Do a escuchar ii en Sol. El acorde pivote es el último acorde que tiene sentido en la tonalidad antigua Y el primero que tiene sentido en la nueva.',
          tryThisLabel: 'Observa Sol mayor — objetivo habitual de modulación desde Do',
        },
        {
          title: 'El Proceso Modulatorio',
          explanation:
            'Cinco pasos: (1) Establecer la tonalidad 1 con una progresión clara. (2) Acercarse a un acorde que existe en ambas tonalidades. (3) El acorde pivote — reinterpretado por ambas tonalidades. (4) Seguir el pivote con función de dominante en la nueva tonalidad (V o V7). (5) Cadenciar en la tonalidad 2 para confirmar la modulación. El acorde pivote hace suave el cambio de tonalidad porque el oyente no advierte el cambio hasta que aparece la nueva dominante.',
          tryThisLabel: 'Observa Do mayor — encuentra acordes compartidos con Sol mayor',
        },
        {
          title: 'Notación Analítica para Acordes Pivote',
          explanation:
            'En el acorde pivote se escribe cifrado romano para ambas tonalidades. C: I – IV – vi / ii – V7 – I :G. La barra marca el pivote — Am es vi en Do y ii en Sol. Todo lo que precede a la barra se analiza en Do, todo lo que sigue en Sol. Esta notación hace explícita la doble función y muestra exactamente dónde se produce el cambio de tonalidad.',
          tryThisLabel: 'Observa las tonalidades vecinas — cada par comparte muchos acordes pivote',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" y después "key of G" — haz una lista de todos los acordes que aparecen en ambas tonalidades. Esas son tus opciones de acorde pivote (Am, C, Em, G aparecen en ambas).',
        },
        {
          instruction:
            'Piensa en una modulación de Do a Sol: toca C, Am (pivote — vi en Do, ii en Sol), D7 (V7 en Sol), G (nueva tónica). El acorde pivote es donde el oído cambia.',
        },
        {
          instruction:
            'Abre el Círculo de Quintas — elige cualquier tonalidad e identifica sus vecinas inmediatas. Esas vecinas comparten más acordes, lo que facilita la modulación por acorde pivote entre tonalidades adyacentes.',
        },
      ],
    },

    // ── U16 M2: Modulación a Tonalidades Cercanas ─────────────────────────
    l5u16m2: {
      title: 'Modulación a Tonalidades Cercanas',
      subtitle: 'Modulaciones prácticas a V, IV, vi y relativa mayor/menor',
      objectives: [
        'Identificar tonalidades cercanas (difieren en 0 o 1 alteración)',
        'Realizar modulaciones por acorde pivote a la dominante (V), subdominante (IV) y relativa menor (vi)',
        'Reconocer los objetivos de modulación más habituales en tonalidades mayores y menores',
      ],
      concepts: [
        {
          title: 'Tonalidades Cercanas',
          explanation:
            'Las tonalidades cercanas comparten la mayoría de sus notas, difiriendo en cero o una alteración. Para Do mayor, las tonalidades cercanas son: Sol mayor (dominante, un sostenido), Fa mayor (subdominante, un bemol), La menor (relativa menor), Re menor (ii convertido en tónica) y Mi menor (iii convertido en tónica). Estas son las modulaciones más fáciles porque muchos acordes son compartidos entre las tonalidades. El Círculo de Quintas las muestra: cualquier tonalidad y sus vecinas inmediatas son tonalidades cercanas.',
          tryThisLabel: 'Observa las tonalidades cercanas como vecinas en el círculo',
        },
        {
          title: 'Modulación a la Dominante (I a V)',
          explanation:
            'La modulación más natural y habitual en tonalidades mayores. De Do mayor a Sol mayor, los acordes compartidos incluyen Am (vi/ii), C (I/IV), Em (iii/vi), G (V/I). La modulación se hace evidente cuando aparece Fa# — pertenece a Sol mayor pero no a Do mayor. Un camino típico: C – Am – D7 – G. El Am sirve como pivote (vi en Do, ii en Sol), D7 es V7 en Sol y G cadencia la nueva tonalidad.',
          tryThisLabel: 'Observa Sol mayor — la tonalidad de la dominante de Do',
        },
        {
          title: 'Modulación a IV y vi',
          explanation:
            'Modulación a la subdominante (IV): de Do mayor a Fa mayor, la aparición de Sib señala la nueva tonalidad. Acordes compartidos incluyen F (IV/I), Am (vi/iii), Dm (ii/vi), C (I/V). Modulación a la relativa menor (vi): de Do mayor a La menor, la aparición de Sol# (sensible en La menor) confirma el cambio. En tonalidades menores, la modulación más habitual es a la relativa mayor (III) — de La menor a Do mayor.',
          tryThisLabel: 'Observa Fa mayor — la tonalidad de la subdominante de Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" y "key of F" — identifica los acordes compartidos. Fa mayor (IV en Do, I en Fa), Dm (ii en Do, vi en Fa), Am (vi en Do, iii en Fa) son todos posibles acordes pivote para modular a IV.',
        },
        {
          instruction:
            'Abre el Círculo de Quintas y elige Do mayor. Cuenta las tonalidades cercanas: Sol (una en el sentido horario), Fa (una en el sentido antihorario), Am (relativa menor), Dm (ii), Em (iii). Cinco tonalidades cercanas en total.',
        },
        {
          instruction:
            'Piensa en una modulación de Do a Am: C – F – Dm (pivote: ii en Do, iv en Am) – E7 (V7 en Am) – Am. El E7 con su Sol# confirma que hemos abandonado Do mayor.',
        },
      ],
    },

    // ── U16 M3: Modulación Directa, por Nota Común y Cromática ───────────
    l5u16m3: {
      title: 'Modulación Directa, por Nota Común y Cromática',
      subtitle: 'Modulación sin acordes pivote diatónicos',
      objectives: [
        'Realizar una modulación directa (de frase)',
        'Comprender la modulación por nota común',
        'Reconocer la modulación cromática (pivote cromático)',
      ],
      concepts: [
        {
          title: 'Modulación Directa (de Frase)',
          explanation:
            'Sin acorde pivote en absoluto. Una frase termina en la tonalidad 1 y la frase siguiente comienza en la tonalidad 2. El cambio de tonalidad ocurre entre frases, a menudo con un silencio o una pausa. Esta es la modulación del «camionero» habitual en la música pop — el último estribillo sube medio tono o un tono para ganar energía. Es el tipo de modulación más abrupto, que apuesta por la sorpresa en lugar de la lógica armónica.',
          tryThisLabel: 'Escucha Reb mayor — medio tono por encima de Do',
        },
        {
          title: 'Modulación por Nota Común y Modulación Cromática',
          explanation:
            'En la modulación por nota común, una nota se mantiene o se repite mientras la armonía cambia hacia una nueva tonalidad. La nota sostenida enlaza las dos regiones tonales como un hilo. Un Sol mantenido enlaza Do mayor con Mib mayor (Sol es la 5.ª de Do y la 3.ª de Mib). En la modulación cromática, un acorde se altera cromáticamente para señalar el cambio — el acorde alterado no tiene función diatónica en la tonalidad original. Ambas son más dramáticas que la modulación por acorde pivote.',
          tryThisLabel: 'Escucha Mib mayor — comparte Sol con Do mayor',
        },
        {
          title: 'Modulación Secuencial y Enarmónica',
          explanation:
            'Una secuencia armónica transporta la música a una nueva tonalidad. La lógica interna del patrón se superpone a la necesidad de un pivote. Una secuencia de quintas descendentes puede desplazar gradualmente el centro tonal sin que ningún acorde individual funcione como pivote. El oyente sigue el patrón en lugar de la tonalidad. La modulación enarmónica (usar el mismo sonido escrito de forma diferente para pivotar entre tonalidades lejanas) se introduce aquí y se trata en detalle en el Nivel 6.',
          tryThisLabel: 'Observa cómo las secuencias siguen el Círculo de Quintas',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C major scale" y después "Db major scale" — imagina una canción que termina una frase en Do y comienza la siguiente en Reb. Eso es una modulación directa — medio tono arriba, sin pivote necesario.',
        },
        {
          instruction:
            'Compara "key of C" y "key of Eb" — Sol es el 5.º grado en Do y el 3.er grado en Mib. Un Sol mantenido podría enlazar estas dos tonalidades lejanas mediante modulación por nota común.',
        },
        {
          instruction:
            'Abre el Círculo de Quintas y traza: una secuencia que pasa por C, F, Bb, Eb modula gradualmente de Do mayor a Mib mayor. El patrón se superpone a la necesidad de un pivote formal.',
        },
      ],
    },

    // ── U16 M4: Mezcla Modal — Acordes Prestados ─────────────────────────
    l5u16m4: {
      title: 'Mezcla Modal — Acordes Prestados',
      subtitle: 'Tomar prestados acordes del modo menor paralelo para obtener color expresivo',
      objectives: [
        'Tomar prestados acordes del modo menor paralelo en un contexto de tonalidad mayor',
        'Identificar los acordes prestados más habituales: bVI, bIII, bVII, iv, iio',
        'Comprender cómo los grados rebajados crean conducción cromática de voces',
      ],
      concepts: [
        {
          title: '¿Qué Es la Mezcla Modal?',
          explanation:
            'La mezcla modal significa tomar prestados acordes de la tonalidad paralela. En Do mayor, la tonalidad paralela es Do menor. El préstamo trae acordes de la familia de Do menor a un contexto de Do mayor. El resultado: oscuridad inesperada, nostalgia o profundidad emocional que la armonía puramente mayor no puede alcanzar. Los acordes prestados más habituales son iv (Fm), bVI (Lab), bVII (Sib), bIII (Mib) e iio (Ddim). Cada uno aporta un color distinto.',
          tryThisLabel: 'Escucha Lab — el acorde bVI prestado en Do mayor',
        },
        {
          title: 'Los Acordes Prestados Más Habituales',
          explanation:
            'iv (Fa menor en Do) sustituye a IV con una subdominante oscura. bVI (Lab mayor en Do) es dramático y cinematográfico — el acorde de Hollywood. bVII (Sib mayor en Do) crea una cadencia rock o sensación modal. bIII (Mib mayor en Do) suena sorprendentemente brillante a pesar de contener un bemol. Estos acordes comparten grados rebajados (b3, b6, b7) del modo menor paralelo. La conducción cromática de voces entre acordes diatónicos y prestados es parte de lo que hace tan eficaz a la mezcla modal.',
          tryThisLabel: 'Escucha Fm — el acorde iv prestado en Do mayor',
        },
        {
          title: 'Conducción de Voces con Acordes Prestados',
          explanation:
            'Las notas cromáticas de los acordes prestados siguen sus tendencias naturales: las notas rebajadas (b3, b6, b7) resuelven descendentemente. Cuando iv (Fm) pasa a I (C), el Lab de Fm desciende a Sol en Do mayor — conducción cromática suave. Cuando bVI (Lab) pasa a V (G), el Lab desciende a Sol por semitono. Estas conexiones cromáticas son parte de lo que hace la mezcla modal tan expresiva. El color proviene no solo del acorde, sino del movimiento de entrada y salida del mismo.',
          tryThisLabel: 'Escucha Sib — el acorde bVII prestado en Do mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "Ab major chord" en el contexto de Do mayor — Lab contiene Lab, Do, Mib. El Lab y el Mib están prestados de Do menor. Este es bVI, el acorde prestado más cinematográfico.',
        },
        {
          instruction:
            'Compara "F major chord" (IV diatónico) con "Fm" (iv prestado). La única diferencia es una nota: La pasa a Lab. Esa única alteración cromática transforma el carácter emocional.',
        },
        {
          instruction:
            'Escribe "Bb major chord" — este es bVII en Do mayor, prestado de Do menor. Aparece por todas partes en el rock y el pop. Ahora escribe "C major chord" para escuchar la resolución bVII a I.',
        },
      ],
    },

    // ── U16 M5: Tercera de Picardía y Mezcla Modal en el Modo Menor ─────
    l5u16m5: {
      title: 'Tercera de Picardía y Mezcla Modal en el Modo Menor',
      subtitle: 'Tomar prestado del modo mayor paralelo en un contexto de tonalidad menor',
      objectives: [
        'Comprender la tercera de Picardía (I mayor al final de una pieza en tonalidad menor)',
        'Identificar la mezcla modal en tonalidades menores (préstamo del modo mayor paralelo)',
        'Reconocer el efecto expresivo de acordes mayores en un contexto menor',
      ],
      concepts: [
        {
          title: 'La Tercera de Picardía',
          explanation:
            'La tercera de Picardía es la mezcla modal en dirección opuesta: tomar prestado del modo mayor paralelo hacia una tonalidad menor. Una pieza en tonalidad menor termina su cadencia final con una tónica mayor (I en lugar de i). En Do menor, el acorde final se convierte en Do mayor — la tercera elevada (Mi natural en vez de Mib) crea un brillo inesperado, un rayo de luz al final. Habitual en la música barroca y renacentista, donde las piezas en tonalidad menor casi siempre terminaban con tercera de Picardía.',
          tryThisLabel: 'Escucha Do mayor — la tercera de Picardía en un contexto de Do menor',
        },
        {
          title: 'Mezcla Modal en Tonalidades Menores',
          explanation:
            'Tomar prestado del modo mayor paralelo hacia el menor es menos habitual pero eficaz. Usar IV (mayor) en lugar de iv (menor), o usar I (mayor) en lugar de i (menor) en cadencias internas. En Do menor: Fa mayor (IV prestado de Do mayor) sustituye al Fm esperado. La nota elevada (La natural en vez de Lab) aporta brillo sin abandonar la tonalidad menor. Esta técnica crea momentos de calidez dentro de un paisaje armónico predominantemente oscuro.',
          tryThisLabel: 'Escucha Fa mayor — IV prestado para Do menor',
        },
        {
          title: 'El Alcance Expresivo de la Mezcla Modal',
          explanation:
            'La mezcla modal en ambas direcciones otorga a los compositores una paleta expresiva enorme. Las tonalidades mayores pueden oscurecerse tomando prestado del menor (bVI, iv, bVII). Las tonalidades menores pueden iluminarse tomando prestado del mayor (tercera de Picardía, IV mayor). La capacidad de moverse libremente entre versiones mayores y menores de acordes construidos sobre las mismas fundamentales es una de las características definitorias de la armonía del periodo Romántico. Difumina por completo la frontera entre mayor y menor.',
          tryThisLabel: 'Observa Do menor — la tonalidad paralela que presta y recibe',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C minor scale" para establecer el contexto menor. Ahora escribe "C major chord" — la tercera elevada (Mi natural en vez de Mib) es la tercera de Picardía. Un final brillante para una tonalidad oscura.',
        },
        {
          instruction:
            'Compara "Fm" (iv diatónico en Do menor) con "F major chord" (IV prestado de Do mayor). El La natural en vez de Lab aporta una calidez sorprendente al contexto de tonalidad menor.',
        },
        {
          instruction:
            'Piensa en un final de tonalidad menor con tercera de Picardía: Dm7b5 (iiø7 en Do menor), G7 (V7), después Do mayor (I de Picardía en vez de Cm). El final mayor transforma por completo el carácter emocional de la cadencia.',
        },
      ],
    },

    // ── U17 M1: Forma Binaria y Ternaria ──────────────────────────────────
    l5u17m1: {
      title: 'Forma Binaria y Ternaria',
      subtitle: 'Estructuras musicales en dos y tres partes',
      objectives: [
        'Analizar la forma binaria (simple, con retorno, equilibrada)',
        'Analizar la forma ternaria (ABA, compuesta)',
        'Distinguir formas seccionales de formas continuas',
      ],
      concepts: [
        {
          title: 'Forma Binaria',
          explanation:
            'La forma binaria tiene dos secciones, cada una generalmente repetida. Binaria simple (AB): la primera sección se aleja de la tónica (modula o termina en V), la segunda regresa. Binaria con retorno (ABA\'): el material de A reaparece al final de la sección B, proporcionando cierre. Es extremadamente habitual y es la base de la forma sonata. Binaria equilibrada: ambas secciones terminan con el mismo material, aunque comiencen de forma diferente. La mayoría de las danzas barrocas usan forma binaria.',
          tryThisLabel: 'Observa Sol mayor — tonalidad habitual de la segunda sección en forma binaria',
        },
        {
          title: 'Forma Ternaria',
          explanation:
            'La forma ternaria (ABA) tiene tres secciones: exposición, contraste, retorno. Cada sección es autosuficiente con sus propias cadencias. La sección B proporciona contraste — tonalidad diferente, carácter diferente, material temático diferente. La ternaria compuesta encaja formas dentro de formas — el Minueto y Trío es una ternaria compuesta donde cada parte es a su vez binaria. El regreso de A tras el material contrastante B crea una de las estructuras más satisfactorias de la música.',
          tryThisLabel: 'Observa Do mayor — la «tonalidad de casa» a la que regresan las secciones A',
        },
        {
          title: 'Seccional vs. Continua',
          explanation:
            'Una forma seccional tiene fronteras claras: cada sección termina con una cadencia fuerte en su propia tonalidad y podría existir por sí sola. Una forma continua fluye entre secciones sin cadencias internas fuertes — la música avanza atravesando las fronteras de sección. El mismo esquema de letras (AB, ABA) puede ser seccional o continuo. La forma seccional se asemeja a habitaciones separadas; la continua se asemeja a un espacio fluido dividido por cortinas.',
          tryThisLabel: 'Observa Fa mayor — región tonal contrastante habitual en la forma',
        },
      ],
      tasks: [
        {
          instruction:
            'Piensa en una pieza musical que conozcas bien. ¿Puedes identificar las secciones? Etiquétalas con letras: A para la primera idea, B para el material contrastante, A\' si la primera idea regresa con alteraciones.',
        },
        {
          instruction:
            'Abre "key of C" y después "key of G" — en la forma binaria, la primera sección frecuentemente modula de Do a Sol (tónica a dominante). La segunda sección regresa a Do. Este plan tonal crea la estructura en dos partes.',
        },
        {
          instruction:
            'Considera la forma ternaria: sección A en Do mayor, sección B modula a Sol mayor como contraste, después A regresa en Do mayor. El esquema tonal refuerza la estructura en tres partes.',
        },
      ],
    },

    // ── U17 M2: Formas de Canción e Introducción a las Grandes Formas ────
    l5u17m2: {
      title: 'Formas de Canción e Introducción a las Grandes Formas',
      subtitle: 'Estrofa-estribillo, AABA, forma sonata, rondó y tema con variaciones',
      objectives: [
        'Reconocer formas de canción (estrofa-estribillo, AABA, estrófica)',
        'Comprender la forma sonata (exposición, desarrollo, recapitulación)',
        'Conocer la forma rondó y la estructura de tema con variaciones',
      ],
      concepts: [
        {
          title: 'Formas de Canción',
          explanation:
            'La forma estrófica usa la misma música para cada estrofa — sencilla y repetitiva (himnos, música folk). Estrofa-estribillo alterna estrofas cambiantes con un estribillo fijo — la forma pop más habitual. AABA (forma de 32 compases) tiene cuatro secciones de ocho compases: A (tema), A (repetición), B (puente/contraste), A (retorno) — estándar en los standards de jazz. La composición continua no tiene secciones repetidas, usada para canciones narrativas donde la música sigue al texto.',
          tryThisLabel: 'Observa Do mayor — tonalidad típica para el análisis de forma de canción',
        },
        {
          title: 'Forma Sonata',
          explanation:
            'La joya de la corona de la forma clásica. Tres grandes secciones: (1) Exposición — dos grupos temáticos en tonalidades contrastantes (primer tema en la tónica, segundo en la dominante o relativa mayor), generalmente repetida. (2) Desarrollo — los temas se fragmentan, recombinan y modulan por muchas tonalidades. La sección armónicamente más aventurera. (3) Recapitulación — la exposición regresa, pero ahora ambos temas están en la tónica. El conflicto tonal queda resuelto. Introducción lenta y coda opcionales.',
          tryThisLabel: 'Observa Do mayor — tonalidad típica del primer tema',
        },
        {
          title: 'Rondó y Tema con Variaciones',
          explanation:
            'En la forma rondó, un tema principal (A) alterna con episodios contrastantes. Rondó en cinco partes: A–B–A–C–A. Rondó en siete partes: A–B–A–C–A–B–A. El A recurrente proporciona familiaridad; los episodios proporcionan variedad. Habitual en finales clásicos. Tema con variaciones presenta un tema y después lo repite con cambios: variación melódica, armónica, rítmica, modal (intercambio mayor/menor) o de carácter. La chacona y la passacaglia mantienen la línea de bajo constante mientras las voces superiores varían.',
          tryThisLabel: 'Observa Do menor — variación modal de Do mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Considera la forma estrofa-estribillo: la estrofa cambia la letra cada vez (A, A\', A\'\') mientras el estribillo se mantiene igual (B). ¿Cómo se compara con la forma AABA donde A se repite antes del puente?',
        },
        {
          instruction:
            'Práctica de forma sonata: abre "key of C" (tónica) y "key of G" (dominante). En la exposición, el tema 1 está en Do, el tema 2 en Sol. En la recapitulación, ambos temas regresan en Do.',
        },
        {
          instruction:
            'Escribe "C major scale" y después "C minor scale" — cambiar de mayor a menor es una de las técnicas de variación más habituales (variación modal). Misma tónica, carácter completamente diferente.',
        },
      ],
    },

    // ── U17 M3: Textura ──────────────────────────────────────────────────
    l5u17m3: {
      title: 'Textura',
      subtitle: 'Monofónica, homofónica, polifónica y otros tipos de textura',
      objectives: [
        'Identificar los cinco tipos de textura de oído',
        'Comprender cómo la elección de textura afecta al carácter musical',
        'Reconocer cambios de textura dentro de una pieza',
      ],
      concepts: [
        {
          title: 'Monofonía y Homofonía',
          explanation:
            'La monofonía es una única línea melódica sin acompañamiento — todos interpretan la misma melodía, posiblemente en octavas. El canto gregoriano y las melodías de solista sin acompañamiento son monofónicos. Pura, enfocada, expuesta. La homofonía es una melodía con acompañamiento de acordes — la melodía domina mientras las demás voces la apoyan. Esta es la textura más habitual en la música occidental: canciones pop, himnos, escritura para piano clásico, melodía orquestal con acompañamiento.',
          tryThisLabel: 'Toca una única línea melódica — textura monofónica',
        },
        {
          title: 'Polifonía y Contrapunto',
          explanation:
            'La polifonía significa dos o más melodías independientes sonando simultáneamente, cada una con su propio interés rítmico y melódico. Las fugas, invenciones y motetes renacentistas son polifónicos. La homorritmia es una textura específica en la que todas las voces se mueven al mismo ritmo pero con alturas diferentes — escritura al estilo coral. La heterofonía se produce cuando varios intérpretes tocan la misma melodía simultáneamente con variaciones individuales, habitual en tradiciones folclóricas.',
          tryThisLabel: 'Observa Do mayor — tonalidad de referencia para ejemplos de contrapunto',
        },
        {
          title: 'Cambios de Textura Dentro de Una Pieza',
          explanation:
            'La mayoría de las piezas emplea múltiples texturas. Un movimiento sinfónico puede comenzar con un tema monofónico, desarrollarlo homofónicamente con acompañamiento orquestal, construir hasta un clímax polifónico y regresar a la homofonía. Los cambios de textura son una herramienta primordial para crear contraste y estructura. Un cambio de homofonía a polifonía aumenta la complejidad y la intensidad; un cambio de vuelta proporciona alivio y claridad.',
          tryThisLabel: 'Toca una línea melódica — imagina añadir acompañamiento',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca una escala en el piano — eso es textura monofónica. Ahora toca un acorde bajo una nota melódica — eso es textura homofónica. La distinción es si el acompañamiento tiene interés melódico independiente.',
        },
        {
          instruction:
            'Piensa en cinco canciones que conozcas. Clasifica cada una por su textura principal: monofónica (solo sin acompañamiento), homofónica (melodía + acordes) o polifónica (múltiples melodías independientes).',
        },
        {
          instruction:
            'Considera un himno: todas las voces se mueven al mismo ritmo con alturas diferentes. Eso es homorritmia, un tipo específico de homofonía. Compara con una fuga donde cada voz entra por separado con la misma melodía.',
        },
      ],
    },

    // ── U17 M4: Líneas de Notas Guía ──────────────────────────────────────
    l5u17m4: {
      title: 'Líneas de Notas Guía',
      subtitle: 'Trazar 3.as y 7.as a lo largo de progresiones',
      objectives: [
        'Definir las notas guía como las 3.as y 7.as de los acordes',
        'Trazar líneas de notas guía a lo largo de progresiones',
        'Usar la conducción de voces por notas guía como herramienta de composición',
      ],
      concepts: [
        {
          title: '¿Qué Son las Notas Guía?',
          explanation:
            'La 3.ª y la 7.ª de cada acorde son las notas que definen su cualidad. La fundamental indica el nombre del acorde; la 3.ª indica si es mayor o menor; la 7.ª indica el tipo de acorde (7.ª mayor, 7.ª de dominante, 7.ª menor). Juntas, la 3.ª y la 7.ª SON la identidad del acorde. Un bajista cubriendo la fundamental más un pianista tocando solo la 3.ª y la 7.ª proporciona el marco armónico completo. Todo lo demás es color.',
          tryThisLabel: 'Observa Dm7 — la 3.ª es Fa, la 7.ª es Do',
        },
        {
          title: 'Trazar Líneas de Notas Guía a Través de ii–V–I',
          explanation:
            'Cuando se trazan las 3.as y 7.as a lo largo de una progresión ii–V–I en Do mayor, forman líneas de conducción de voces suaves. Dm7: 3.ª = Fa, 7.ª = Do. G7: 3.ª = Si, 7.ª = Fa. Cmaj7: 3.ª = Mi, 7.ª = Si. La 7.ª de cada acorde se convierte en la 3.ª del siguiente (Do se mantiene como nota común o se mueve a Si; Fa desciende a Mi). Para improvisadores, apuntar a las notas guía garantiza acertar en las notas esenciales del acorde. Para arreglistas, las líneas de notas guía son el esqueleto de las partes de voces internas.',
          tryThisLabel: 'Observa G7 — la 3.ª es Si, la 7.ª es Fa',
        },
        {
          title: 'Notas Guía como Herramienta de Composición e Improvisación',
          explanation:
            'La conducción de voces por notas guía es el enfoque Berklee para la escritura suave de voces internas. Para componer un arreglo, se parte de las notas del bajo (fundamentales o inversiones) y las notas guía (3.as y 7.as), y después se rellenan con notas de color (5.as, extensiones, alteraciones) alrededor de ese esqueleto. Para la improvisación, tocar solo las notas guía de una progresión de acordes delinea la armonía con máxima eficiencia — un bajista cubriendo fundamentales más un pianista tocando 3.as y 7.as proporciona el marco armónico completo. La consciencia de las notas guía transforma elecciones de notas aleatorias en líneas direccionadas y armónicamente conectadas.',
          tryThisLabel: 'Observa Cmaj7 — la 3.ª es Mi, la 7.ª es Si',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "Dm7" y encuentra la 3.ª (Fa) y la 7.ª (Do). Ahora escribe "G7" — la 3.ª es Si y la 7.ª es Fa. Observa: la 7.ª de Dm7 (Do) descendió a Si (3.ª de G7), y la 3.ª de Dm7 (Fa) se mantuvo como 7.ª de G7.',
        },
        {
          instruction:
            'Escribe "G7" y después "Cmaj7" — traza las notas guía: la 3.ª de G7 (Si) se convierte en la 7.ª de Cmaj7 (Si, nota común). La 7.ª de G7 (Fa) desciende a la 3.ª de Cmaj7 (Mi). Cada conexión es por grado o estática.',
        },
        {
          instruction:
            'Toca el ii–V–I completo: "Dm7", "G7", "Cmaj7". Las líneas de notas guía son Fa–Fa–Mi (descenso por grado) y Do–Si–Si (descenso por grado y después mantenimiento). Esta es la conducción de voces más suave de la música tonal.',
        },
      ],
    },
  },
};

export default curriculumL5;
