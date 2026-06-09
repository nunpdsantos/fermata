import type { CurriculumLevelOverlay } from '../types';

const curriculumL9: CurriculumLevelOverlay = {
  // ─── Unidades ─────────────────────────────────────────────────────────────
  units: {
    u30: {
      title: 'Entrenamiento de Altura e Intervalos',
      description:
        'Correspondencia de alturas, dirección melódica, reconocimiento mayor/menor e identificación completa de intervalos de oído',
    },
    u31: {
      title: 'Competencias de Escalas, Acordes y Dictado',
      description:
        'Reconocimiento de escalas y modos, identificación de cualidades de tríadas y acordes de séptima de oído',
    },
    u32: {
      title: 'Dictado, Lectura a Primera Vista y Escucha Contextual',
      description:
        'Dictado melódico y armónico, solfeo móvil para lectura a primera vista y escucha crítica de textura, forma y estilo',
    },
  },

  // ─── Módulos ──────────────────────────────────────────────────────────────
  modules: {
    // ── U30 M1: Pitch Matching and Direction ──────────────────────────────
    l9u30m1: {
      title: 'Correspondencia de Altura y Dirección',
      subtitle:
        'Hacer corresponder alturas de oído, identificar dirección melódica y percibir diferencias de registro',
      objectives: [
        'Hacer corresponder alturas cantando o identificando notas en el piano',
        'Reconocer movimiento melódico ascendente frente a descendente en diferentes registros',
        'Distinguir registro agudo de registro grave y percibir la colocación relativa de registro',
      ],
      concepts: [
        {
          title: 'Correspondencia de Altura',
          explanation:
            'La competencia auditiva más fundamental es escuchar una nota y reproducirla — cantando o encontrándola en un instrumento. Se comienza con notas aisladas en el registro medio (cerca del Do central) y después se expande hacia fuera. Practica tocando una nota en el piano e intentando encontrarla de nuevo con los ojos cerrados. Esto construye la conexión interna oído-mano que sustenta todo el entrenamiento auditivo posterior. El objetivo no es el oído absoluto (que es en gran parte innato), sino un oído relativo fiable — escuchar una nota en relación con una referencia.',
          tryThisLabel: 'Toca la escala de C mayor como referencia de altura',
        },
        {
          title: 'Dirección del Movimiento',
          explanation:
            '¿Puedes decir si una melodía sube, baja o se mantiene? Esto es más intuitivo de lo que parece, pero hacer que el juicio sea consciente y preciso es el objetivo. Toca dos notas en secuencia e identifica la dirección. Movimiento ascendente va hacia una altura más aguda; descendente va hacia una más grave. Comienza con saltos amplios (una octava de distancia) y estrecha progresivamente hasta poder detectar movimiento de un único semitono. Esto entrena la percepción de contorno que necesitarás para el dictado melódico más adelante.',
          tryThisLabel: 'Escucha movimiento por grados ascendentes',
        },
        {
          title: 'Percepción de Registro',
          explanation:
            'Agudo frente a grave es siempre relativo: el «agudo» de un clarinete bajo es el «grave» de una flauta. Percepción de registro significa identificar si una nota se sitúa en la zona superior, media o inferior de la extensión del instrumento. En el piano, la octava más grave tiene una cualidad profunda y retumbante; las octavas medias suenan claras y equilibradas; la octava más aguda es brillante y fina. Practica tocando notas a lo largo de toda la extensión e identificando en qué región de octava se encuentran sin mirar. Esta escucha espacial es esencial para comprender voicings orquestales y arreglos.',
          tryThisLabel:
            'Toca La mayor — después pruébala en otra octava',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C major scale" y tócala en el piano. Intenta cantar cada nota a medida que la oyes — haz corresponder tu voz con la altura. Comienza en un registro cómodo',
        },
        {
          instruction:
            'Toca notas individuales en el piano con los ojos cerrados — ¿puedes decir si la segunda nota es más aguda o más grave que la primera? Comienza con saltos amplios y después estrecha hasta teclas adyacentes',
        },
        {
          instruction:
            'Toca una nota en el registro grave y después la misma nota dos octavas más arriba. Escucha cómo la cualidad cambia pero la identidad de la nota permanece. Esto es percepción de registro',
        },
      ],
    },

    // ── U30 M2: Major vs Minor Recognition ──────────────────────────────
    l9u30m2: {
      title: 'Reconocimiento Mayor frente a Menor',
      subtitle:
        'Distinguir tonalidad mayor y menor de oído — acordes, escalas y color general',
      objectives: [
        'Distinguir tríadas mayores de menores de oído — brillante/abierto frente a sombrío/melancólico',
        'Reconocer tonalidad mayor frente a menor en escalas y melodías cortas',
        'Desarrollar reconocimiento instintivo inmediato antes de la explicación teórica',
      ],
      concepts: [
        {
          title: 'Acordes Mayores frente a Menores',
          explanation:
            'El reconocimiento de cualidad más básico en el entrenamiento auditivo. Los acordes mayores suenan brillantes, abiertos y resueltos. Los acordes menores suenan sombríos, melancólicos e introspectivos. La explicación teórica — la diferencia está en el tercer grado, elevado o descendido un semitono — es secundaria en esta fase. Practica tocando acordes mayores y menores lado a lado a partir de la misma fundamental hasta que la distinción se vuelva instantánea y automática. Esto es un sentimiento visceral primero, comprensión intelectual después.',
          tryThisLabel: 'Escucha mayor — después prueba "C minor chord"',
        },
        {
          title: 'Tonalidad Mayor frente a Menor',
          explanation:
            'Más allá de acordes individuales, tonalidades y melodías enteras tienen carácter mayor o menor. Una melodía en C mayor suena brillante y asentada; el mismo contorno en C menor suena más sombrío e introspectivo. Escucha el color emocional general en lugar de analizar notas individuales. Toca la escala de C mayor seguida de la escala de C menor natural — el cambio de atmósfera es inconfundible. Este reconocimiento de tonalidad es la base para todo el entrenamiento auditivo de cualidad posterior.',
          tryThisLabel:
            'Escucha la tonalidad menor — compara con la escala de C mayor',
        },
        {
          title: 'Entrenar el Juicio Instantáneo',
          explanation:
            'El objetivo del reconocimiento mayor/menor no es análisis, sino reflejo. Debes oír la cualidad antes de que tu mente consciente la nombre. Esto requiere repetición: toca acordes mayores y menores aleatorios a partir de diferentes fundamentales e identifica la cualidad lo más rápido posible. La velocidad importa porque la música real no hace pausa para que analices. Prueba fundamentales menos familiares — Ab, Db, F# — donde tu familiaridad con el instrumento no puede ayudarte. Cuando puedas identificar mayor frente a menor en menos de un segundo a partir de cualquier fundamental, la competencia está interiorizada.',
          tryThisLabel:
            'Prueba mayor a partir de una fundamental menos familiar — ¿sigue sonando brillante?',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "C major chord" y después "C minor chord" uno tras otro. ¿Cuál suena brillante? ¿Cuál suena sombrío? Repite hasta que la distinción sea instantánea',
        },
        {
          instruction:
            'Toca "G major chord" y después "Gm" — mismo ejercicio, fundamental diferente. La diferencia de cualidad debe transferirse independientemente de la nota inicial',
        },
        {
          instruction:
            'Toca "C major scale" y después "C natural minor scale". Escucha el cambio de color general. ¿Puedes sentir el cambio de atmósfera antes de que la escala esté a la mitad?',
        },
      ],
    },

    // ── U30 M3: Interval Recognition P1-P5 ──────────────────────────────
    l9u30m3: {
      title: 'Reconocimiento de Intervalos: P1-P5',
      subtitle:
        'Identificar intervalos perfectos y pequeños de oído usando asociaciones con canciones y reconocimiento directo',
      objectives: [
        'Identificar unísono, 2.a menor, 2.a mayor, 3.a menor, 3.a mayor, 4.a justa, tritono y 5.a justa de oído',
        'Usar asociaciones con canciones como auxiliares mnemónicos para cada intervalo',
        'Reconocer estos intervalos tanto ascendentes como descendentes',
      ],
      concepts: [
        {
          title: 'Asociaciones con Canciones: Intervalos Pequeños',
          explanation:
            'Una técnica mnemónica comprobada: asociar cada intervalo con el comienzo de una melodía familiar. 2.a menor ascendente = tema de Tiburón. 2.a mayor = Cumpleaños Feliz. 3.a menor = Greensleeves. 3.a mayor = When the Saints (oh-when). 4.a justa = Marcha Nupcial. Tritono = The Simpsons (The-Simp). 5.a justa = Brilla Brilla Estrellita. Estas son ruedas de entrenamiento — el objetivo es interiorizar el sonido de cada intervalo directamente y después abandonar la muleta. Comienza solo con intervalos ascendentes y después añade descendentes cuando los ascendentes estén sólidos.',
          tryThisLabel:
            'Toca C mayor — escucha cada intervalo a partir de la fundamental',
        },
        {
          title: 'Consonancia Perfecta frente a Imperfecta',
          explanation:
            'Los intervalos de este módulo se dividen en dos familias. Las consonancias perfectas (P1, P4, P5) suenan «abiertas» y «huecas» — como una campana o una cuerda al aire. Tienen una cualidad austera y despojada. Las consonancias imperfectas (3.a m, 3.a M) suenan «cálidas» y «fundidas» — las notas se combinan suavemente pero con más color. Las segundas (2.a m, 2.a M) son disonancias — suenan «ásperas» o «crujientes» cuando se tocan simultáneamente. El tritono es el intervalo más disonante de todos — tenso, inestable y exigiendo resolución. Aprender a categorizar por consonancia/disonancia es más rápido que memorizar cada intervalo individualmente.',
          tryThisLabel:
            'Escucha la 3.a mayor (C a E) y la 5.a justa (C a G)',
        },
        {
          title: 'Ascendente frente a Descendente',
          explanation:
            'Cada intervalo tiene un carácter diferente ascendente frente a descendente. La 2.a menor ascendente suena tensa y reptante. La 2.a menor descendente suena suspirante y resolutiva. La 4.a justa ascendente suena como una fanfarria. La 4.a justa descendente suena asentada y cadencial. Es necesario entrenar ambas direcciones independientemente — saber identificar una 5.a justa ascendente no significa automáticamente que puedas identificarla descendente. Usa también asociaciones con canciones descendentes: 2.a M descendente = Mary Had a Little Lamb (primeras dos notas), 3.a m descendente = Hey Jude (hey-Jude). Construye el conjunto descendente como una competencia separada.',
          tryThisLabel: 'Escucha el tritono dentro de C7 (E a Bb)',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C major chord" — el intervalo de C a E es una 3.a mayor, y de C a G es una 5.a justa. Canta los dos intervalos por separado. Memoriza cada sonido',
        },
        {
          instruction:
            'Toca pares de notas en el piano a partir de C: C-Db (2.a m), C-D (2.a M), C-Eb (3.a m), C-E (3.a M), C-F (4.a J), C-Gb (tritono), C-G (5.a J). Nombra cada uno antes de verificar',
        },
        {
          instruction:
            'Escribe "C7" — encuentra el tritono (E a Bb). Es el intervalo más inestable. Contrástalo con la 5.a justa (C a G) en "C major chord". Estable frente a tenso — escucha la diferencia',
        },
      ],
    },

    // ── U30 M4: Interval Recognition m6-P8 ──────────────────────────────
    l9u30m4: {
      title: 'Reconocimiento de Intervalos: 6.a m-P8',
      subtitle:
        'Identificar intervalos amplios de oído — sextas, séptimas y la octava',
      objectives: [
        'Identificar 6.a menor, 6.a mayor, 7.a menor, 7.a mayor y octava justa de oído',
        'Usar asociaciones con canciones para intervalos amplios, ascendentes y descendentes',
        'Combinar con el conocimiento de intervalos pequeños para reconocimiento completo de intervalos simples',
      ],
      concepts: [
        {
          title: 'Asociaciones con Canciones: Intervalos Amplios',
          explanation:
            'Continuando el enfoque mnemónico para la mitad superior de la octava. 6.a menor = The Entertainer. 6.a mayor = My Bonnie (my-bon). 7.a menor = Somewhere (West Side Story). 7.a mayor = Take On Me (take-on). Octava = Somewhere Over the Rainbow. Los intervalos amplios son más difíciles de identificar porque parecen «grandes saltos» y las diferencias de tamaño entre ellos son proporcionalmente menores. Las sextas y séptimas son particularmente difíciles — son inversiones de terceras y segundas, por lo que su carácter está relacionado pero es más amplio. Practica contrastando pares: 6.a m frente a 6.a M, 7.a m frente a 7.a M.',
          tryThisLabel: 'Escucha el intervalo de 7.a mayor (C a B)',
        },
        {
          title: 'Intervalos Amplios Descendentes',
          explanation:
            'Los intervalos descendentes suenan diferentes de los ascendentes aunque la distancia sea igual. Una 5.a justa descendente (G descendiendo a C) suena como resolución o aterrizaje. Una 6.a mayor descendente suena cálida y nostálgica. Las séptimas descendentes suenan dramáticas y amplias. Practica intervalos descendentes por separado — muchos estudiantes que dominan intervalos ascendentes se debaten con los descendentes. Usa asociaciones con canciones descendentes: 5.a J descendente = Flintstones (Flint-stones), 3.a m descendente = Hey Jude (hey-Jude). Construye el conjunto descendente como competencia propia.',
          tryThisLabel:
            'Toca C mayor descendente — escucha los intervalos al revés',
        },
        {
          title: 'Relaciones de Inversión de Intervalos',
          explanation:
            'Los intervalos amplios son inversiones de intervalos pequeños: una 6.a mayor es una 3.a menor invertida, una 7.a menor es una 2.a mayor invertida, una 7.a mayor es una 2.a menor invertida. Esto significa que su «sabor» está relacionado — una 3.a menor y una 6.a mayor comparten calidez, una 2.a mayor y una 7.a menor comparten una cualidad bluesy. Si oyes un intervalo amplio y no puedes identificarlo directamente, intenta invertirlo mentalmente: ¿suena como una 3.a menor invertida? Entonces es una 6.a mayor. Esta técnica de referencia cruzada acelera el aprendizaje de intervalos amplios.',
          tryThisLabel:
            'Escucha la 7.a menor (C a Bb) — inversión de una 2.a mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "Cmaj7" — el intervalo exterior de C a B es una 7.a mayor. Ahora toca C a Bb (7.a menor). La diferencia es un semitono, pero el carácter cambia de tensión brillante a atracción bluesy',
        },
        {
          instruction:
            'Toca C a Ab (6.a m) y después C a A (6.a M) en el piano. La 6.a menor suena más sombría y punzante. La 6.a mayor suena más cálida y abierta. Repite a partir de diferentes fundamentales hasta poder distinguirlas con fiabilidad',
        },
        {
          instruction:
            'Toca C hasta el C agudo (octava). La octava suena como «la misma nota, altura diferente». Ahora contrasta con C a B (7.a M) — casi una octava, pero con tensión. Esa cualidad de casi-llegar es la firma de la 7.a mayor',
        },
      ],
    },

    // ── U30 M5: Harmonic Intervals and Compounds ────────────────────────
    l9u30m5: {
      title: 'Intervalos Armónicos y Compuestos',
      subtitle:
        'Reconocimiento de intervalos simultáneos e intervalos compuestos más allá de la octava',
      objectives: [
        'Escuchar intervalos cuando ambas notas suenan simultáneamente (intervalos armónicos)',
        'Distinguir intervalos armónicos consonantes de disonantes por la cualidad sonora',
        'Reconocer intervalos compuestos (9.as, 10.as, 11.as) como versiones más amplias de intervalos simples',
      ],
      concepts: [
        {
          title: 'Intervalos Armónicos',
          explanation:
            'Escuchar intervalos cuando ambas notas suenan simultáneamente es más difícil que los intervalos melódicos (secuenciales) porque los sonidos se funden. Las consonancias perfectas (5.a J, 8.a J) suenan «abiertas» y «huecas». Las consonancias imperfectas (3.as, 6.as) suenan «cálidas» y «fundidas». Las disonancias (2.as, 7.as, tritono) suenan «ásperas» o «tensas». Aprende primero los intervalos melódicos y después transita a los armónicos. La distinción de cualidad — consonante frente a disonante — es tu pista principal cuando las notas suenan simultáneamente.',
          tryThisLabel: 'Escucha B contra C — un intervalo de 7.a mayor',
        },
        {
          title: 'Intervalos Compuestos',
          explanation:
            'Tras dominar los intervalos simples (dentro de una octava), se expande a intervalos compuestos que sobrepasan la octava. Una 9.a = octava + 2.a. Una 10.a = octava + 3.a. Una 11.a = octava + 4.a. Una 13.a = octava + 6.a. Los intervalos compuestos suenan como sus equivalentes simples pero «más amplios» y más espaciosos. Las reglas de cualidad se transfieren: una 9.a mayor tiene la misma cualidad que una 2.a mayor. Se oyen constantemente en acordes de jazz extendidos — la 9.a en un Cmaj9 es la nota D una octava por encima de la fundamental.',
          tryThisLabel: 'Escucha el tritono dentro de C7 (E a Bb)',
        },
        {
          title: 'Ejercicios de Velocidad y Fluidez',
          explanation:
            'El reconocimiento de intervalos solo es útil si es rápido. En la música real, las notas pasan deprisa — no hay tiempo para deliberar. El objetivo es pasar de «analizar, después nombrar» a «oír y saber instantáneamente». Practica con ejercicios cronometrados: toca dos notas aleatorias e identifica el intervalo en tres segundos. Registra la precisión a lo largo de las sesiones. Comienza con un conjunto restringido (solo intervalos perfectos, o solo consonancias) y amplía cuando la precisión supere el 80 por ciento. Mezclar presentaciones melódicas, armónicas, ascendentes y descendentes en el mismo ejercicio construye reconocimiento robusto e independiente del contexto.',
          tryThisLabel:
            'Escucha tres intervalos a la vez — 5.a J, 3.a M y 3.a m',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca dos notas simultáneamente en el piano: C y E (3.a M), C y G (5.a J), C y B (7.a M). Escucha cómo se funden de forma diferente. Las consonancias se mezclan; las disonancias crean batimientos y aspereza',
        },
        {
          instruction:
            'Escribe "Cmaj7" y escucha todos los intervalos armónicos dentro de él: C-E (3.a M), C-G (5.a J), C-B (7.a M), E-G (3.a m), E-B (5.a J), G-B (3.a M). Un único acorde contiene muchos intervalos simultáneos',
        },
        {
          instruction:
            'Toca C3 y D4 en el piano (una 9.a). Compara con C4 y D4 (una 2.a). La 9.a suena como una versión más amplia y espaciosa de la 2.a. Este es el principio de los intervalos compuestos en acción',
        },
      ],
    },

    // ── U31 M1: Scale Recognition Major/Minor ───────────────────────────
    l9u31m1: {
      title: 'Reconocimiento de Escalas: Formas Mayores y Menores',
      subtitle:
        'Distinguir mayor, menor natural, menor armónica y menor melódica de oído',
      objectives: [
        'Distinguir mayor de menor natural por el color general y la atmósfera',
        'Identificar menor armónica por la 2.a aumentada exótica entre los grados 6 y 7',
        'Identificar menor melódica por el 6.o y 7.o grados elevados ascendentes, creando una cualidad suave y jazzística',
      ],
      concepts: [
        {
          title: 'Formas Mayores frente a Menores',
          explanation:
            'Construyendo sobre el reconocimiento básico mayor/menor: ahora se identifican formas menores específicas. La menor natural suena sombría y folclórica — sin atracción fuerte al final porque el 7.o grado está un tono por debajo de la tónica (subtónica, no sensible). La menor armónica eleva el 7.o grado, creando una sensible y una 2.a aumentada exótica entre los grados 6 y 7 — un sonido inconfundible. La menor melódica eleva tanto el 6.o como el 7.o grados ascendentes, suavizando la 2.a aumentada — suena jazzística y sofisticada. Practica tocando las tres a partir de la misma fundamental (p. ej., A) y aislando las diferencias.',
          tryThisLabel:
            'Escucha el 7.o grado elevado exótico en la menor armónica',
        },
        {
          title: 'Método de Entrenamiento: Aislamiento',
          explanation:
            'La clave para el reconocimiento de escalas es aislar lo que cambia entre escalas similares. Toca A mayor y después A menor natural — tres notas cambian (C#/C, F#/F, G#/G). Ahora toca A menor natural y después A menor armónica — solo una nota cambia (G a G#). Finalmente, A menor armónica a A menor melódica ascendente — de nuevo una nota (F a F#). Al estrechar el enfoque a los grados específicos que difieren, se entrena más rápido que intentando escuchar la escala entera como una unidad.',
          tryThisLabel: 'Escucha menor melódica — suave y jazzística',
        },
        {
          title: 'Anclaje al Centro Tonal',
          explanation:
            'El reconocimiento de escalas se vuelve más difícil cuando la fundamental cambia. Es posible identificar A menor natural con facilidad pero debatirse con Eb menor natural porque la tonalidad desconocida distrae. La solución: anclar siempre la tónica primero. Toca la nota fundamental, establécela como «casa» y después escucha la escala. Una vez anclado el centro tonal, los intervalos relativos entre grados son los mismos en cualquier tonalidad. Practica el reconocimiento de escalas en las doce fundamentales — la cualidad debe ser identificable independientemente de la nota inicial.',
          tryThisLabel:
            'Escucha menor natural a partir de una fundamental menos familiar',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "A natural minor scale", después "A harmonic minor scale", después "A melodic minor scale" seguidas. Escucha qué cambia entre cada una — el 7.o elevado, después el 6.o elevado',
        },
        {
          instruction:
            'Toca "C major scale" y después "C natural minor scale". Tres grados cambian. ¿Puedes oír los tres cambios, o el cambio de color general domina tu percepción?',
        },
        {
          instruction:
            'Toca "E harmonic minor scale" — escucha la 2.a aumentada entre el 6.o y el 7.o grados (C a D#). Ese salto exótico es la huella dactilar de la menor armónica',
        },
      ],
    },

    // ── U31 M2: Scale Recognition Modes ─────────────────────────────────
    l9u31m2: {
      title: 'Reconocimiento de Escalas: Modos',
      subtitle:
        'Identificar los siete modos eclesiásticos por sus notas características',
      objectives: [
        'Identificar cada uno de los siete modos eclesiásticos por su color característico',
        'Distinguir modos similares al mayor (Jónico, Lidio, Mixolidio) de modos similares al menor (Dórico, Frigio, Eólico, Locrio)',
        'Escuchar la nota característica única que diferencia cada modo del mayor o menor natural',
      ],
      concepts: [
        {
          title: 'Carácter Modal',
          explanation:
            'Cada modo tiene un color característico definido por una o dos notas que difieren del mayor o menor natural. El Dórico es menor con 6.o elevado — cálido y jazzístico. El Frigio tiene 2.a bemolizada — sombrío y con sonoridad española. El Lidio tiene 4.a sostenida — soñador y flotante. El Mixolidio tiene 7.a bemolizada — bluesy y rock. El Locrio tiene 2.a y 5.a bemolizadas — inestable y rara vez usado como tónica. Concéntrate en estas «notas características» al identificar modos de oído.',
          tryThisLabel:
            'Escucha Dórico — menor pero más cálido (6.o elevado)',
        },
        {
          title: 'Método de Entrenamiento: Similar al Mayor frente a Similar al Menor',
          explanation:
            'Comienza separando modos en dos grupos. Modos similares al mayor tienen 3.a mayor: Jónico (mayor puro), Lidio (#4 — soñador), Mixolidio (b7 — bluesy). Modos similares al menor tienen 3.a menor: Eólico (menor puro), Dórico (6.a natural — cálido), Frigio (b2 — sombrío), Locrio (b2 y b5 — inestable). Primero identifica el grupo, después afina hasta el modo específico. Esta primera pasada binaria reduce las opciones a la mitad inmediatamente y es mucho más fiable que adivinar entre siete opciones.',
          tryThisLabel:
            'Escucha Lidio — el #4 soñador eleva el sonido',
        },
        {
          title: 'Anclas Auditivas de Nota Característica',
          explanation:
            'Para cada modo, entrena el oído en la una o dos notas que lo hacen único. Dórico: toca menor natural y después eleva la 6.a — escucha la calidez entrar. Frigio: toca menor natural y después desciende la 2.a — escucha oscurecerse dramáticamente. Lidio: toca mayor y después eleva la 4.a — escucha flotar. Mixolidio: toca mayor y después desciende la 7.a — escucha relajarse hacia blues. Cada nota característica crea un cambio emocional específico. Memoriza ese cambio y podrás identificar cualquier modo al encontrar su momento característico.',
          tryThisLabel:
            'Escucha Frigio — la 2.a bemolizada oscurece todo',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "C phrygian" y después "C dorian" — Frigio es sombrío y español (2.a bemolizada). Dórico es más cálido (6.a natural). Ambos son modos menores pero la diferencia de carácter es dramática',
        },
        {
          instruction:
            'Toca "C lydian" y después "C major scale" (Jónico). La única diferencia es F frente a F#. El Lidio flota; el Jónico se asienta. Una nota cambia la atmósfera entera',
        },
        {
          instruction:
            'Toca "C mixolydian" y después "C major scale". El Mixolidio tiene Bb en lugar de B — suena bluesy y menos conclusivo. Este es el sonido dominante en el rock y el blues',
        },
      ],
    },

    // ── U31 M3: Scale Recognition Pentatonic/Blues/Symmetric ────────────
    l9u31m3: {
      title: 'Reconocimiento de Escalas: Pentatónica, Blues, Simétrica',
      subtitle:
        'Reconocer escalas especiales de oído — pentatónica, blues, tonos enteros y disminuida',
      objectives: [
        'Identificar escalas pentatónicas mayor y menor por su carácter abierto y con huecos',
        'Reconocer la escala de blues por su blue note añadida (5.a bemolizada)',
        'Identificar escalas de tonos enteros y disminuidas por su cualidad simétrica y sin dirección',
      ],
      concepts: [
        {
          title: 'Escalas Pentatónicas',
          explanation:
            'La pentatónica mayor suena abierta y folclórica — cinco notas, sin semitonos, sin tensión. Es el sonido de canciones alrededor de la hoguera y melodías celtas. La pentatónica menor suena bluesy y cruda — la columna vertebral del rock y la guitarra blues. Ambas escalas pentatónicas son instantáneamente reconocibles porque carecen de las tensiones de semitono de las escalas diatónicas. Los huecos en la escala (4.o y 7.o grados ausentes en la pentatónica mayor, por ejemplo) crean una cualidad abierta distintiva que ninguna escala de siete notas tiene.',
          tryThisLabel:
            'Escucha la pentatónica — abierta, folclórica, sin tensión',
        },
        {
          title: 'La Escala de Blues',
          explanation:
            'La escala de blues añade la 5.a bemolizada («blue note») a la pentatónica menor, creando aspereza y expresividad. Esa única nota añadida transforma una pentatónica limpia en algo con alma y fluidez. La blue note se sitúa entre la 4.a justa y la 5.a justa — una intrusión cromática que crea tensión máxima con ambas vecinas. La escala de blues es la columna vertebral del blues, el rock y la improvisación jazz, y su sonido es instantáneamente identificable tras exposición incluso breve.',
          tryThisLabel: 'Escucha la escala de blues — áspera y expresiva',
        },
        {
          title: 'Escalas Simétricas',
          explanation:
            'Las escalas de tonos enteros y disminuidas están construidas a partir de patrones interválicos repetitivos, dándoles una cualidad sin dirección única. La escala de tonos enteros usa únicamente tonos — ningún semitono — produciendo una cualidad soñadora, flotante y no resuelta asociada al impresionismo y bandas sonoras de cine. La escala disminuida (semitono-tono) alterna semitonos y tonos, creando un sonido tenso y simétrico, un elemento esencial del jazz y del film noir. Ambas escalas carecen de una atracción tonal clara porque su simetría significa que ninguna nota se siente más como «casa» que cualquier otra.',
          tryThisLabel:
            'Escucha tonos enteros — soñadora y sin dirección',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "C pentatonic scale" y después "C blues scale" — la escala de blues añade una nota (Gb, la blue note). ¿Puedes oír la aspereza y tensión añadidas?',
        },
        {
          instruction:
            'Toca "C whole tone scale" — repara en que cada paso tiene el mismo tamaño. No hay atracción hacia ninguna nota particular. La escala flota sin dirección',
        },
        {
          instruction:
            'Compara "C minor pentatonic" con "C natural minor scale". La pentatónica elimina dos notas (la 2.a y la 6.a), creando huecos. Esos huecos le dan a la pentatónica su sonido abierto característico',
        },
      ],
    },

    // ── U31 M4: Triad Quality Recognition ───────────────────────────────
    l9u31m4: {
      title: 'Reconocimiento de Cualidad de Tríadas',
      subtitle:
        'Identificar tríadas mayores, menores, disminuidas y aumentadas de oído',
      objectives: [
        'Identificar tríadas mayores, menores, disminuidas y aumentadas de oído',
        'Comprender la distinción de estabilidad: 5.a justa (estable) frente a 5.a alterada (inestable)',
        'Reconocer inversiones de tríadas por el carácter de la nota del bajo',
      ],
      concepts: [
        {
          title: 'Cualidades de Tríadas de Oído',
          explanation:
            'Mayor suena brillante y asentado — el acorde predeterminado, estable. Menor suena sombrío pero apoyado — misma estabilidad, color diferente. Disminuido suena tenso, pequeño y ansioso — quiere moverse hacia algún lugar. Aumentado suena extraño, suspendido y sin dirección — sin resolución clara. La distinción clave: mayor y menor tienen ambos una 5.a justa (estabilidad). Disminuido y aumentado tienen 5.as alteradas (inestabilidad). Practica tocando las cuatro cualidades a partir de la misma fundamental y cerrando los ojos antes de cada una.',
          tryThisLabel: 'Escucha disminuido — tenso, pequeño, ansioso',
        },
        {
          title: 'Tríadas Estables frente a Inestables',
          explanation:
            'La 5.a justa es el intervalo que proporciona estabilidad a un acorde. Las tríadas mayores (3.a mayor + 5.a justa) y las tríadas menores (3.a menor + 5.a justa) la contienen — por eso suenan apoyadas incluso con colores diferentes. Las tríadas disminuidas sustituyen la 5.a justa por una 5.a disminuida (un semitono más pequeña), creando una cualidad comprimida y ansiosa. Las tríadas aumentadas la sustituyen por una 5.a aumentada (un semitono más amplia), creando una cualidad expandida y no resuelta. Escuchar estable frente a inestable es el primer filtro — después se afina hasta la cualidad específica.',
          tryThisLabel:
            'Escucha aumentado — extraño, expandido, no resuelto',
        },
        {
          title: 'Reconocer Inversiones',
          explanation:
            'Cuando una tríada está invertida, la nota del bajo cambia el peso y la estabilidad percibidos. La posición fundamental suena apoyada y definitiva — la fundamental ancla todo. La primera inversión suena más ligera y más melódica — la 3.a en el bajo crea una sensación menos estable pero fluida. La segunda inversión suena inestable — la 4.a sobre el bajo crea tensión que históricamente requiere resolución. Practica escuchando el mismo acorde en todas las posiciones y observando cómo el carácter cambia mientras la cualidad (mayor/menor) permanece igual.',
          tryThisLabel:
            'Escucha posición fundamental — apoyada y definitiva',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca las cuatro cualidades de tríada a partir de C: "C major chord", "Cm", "Cdim", "Caug". Cierra los ojos y toca de nuevo — ¿puedes identificar cada una solo por el sonido?',
        },
        {
          instruction:
            'Compara "C major chord" con "Cm". La única diferencia es una nota — E frente a Eb. Ese único semitono cambia de brillante a sombrío. Entrena esta distinción en varias fundamentales',
        },
        {
          instruction:
            'Toca "Cdim" y después "Caug" — ambos tienen 5.as alteradas y suenan inestables, pero de maneras diferentes. Disminuido contrae hacia dentro (pequeño, ansioso). Aumentado expande hacia fuera (extraño, flotante)',
        },
      ],
    },

    // ── U31 M5: Seventh Chord Quality Recognition ───────────────────────
    l9u31m5: {
      title: 'Reconocimiento de Cualidad de Acordes de Séptima',
      subtitle:
        'Identificar todas las cualidades de acordes de séptima de oído — del cálido mayor con 7.a al tenso disminuido con 7.a',
      objectives: [
        'Identificar acordes de 7.a mayor, 7.a dominante, 7.a menor, semidisminuido y disminuido de oído',
        'Escuchar el acorde menor-mayor con 7.a como una cualidad distinta e inquietante',
        'Distinguir cualidades de acordes de séptima por su carácter emocional y nivel de tensión',
      ],
      concepts: [
        {
          title: 'Cualidades de Acordes de Séptima de Oído',
          explanation:
            'Seis cualidades distintas de acordes de séptima, cada una con un carácter emocional único. 7.a mayor (Cmaj7): cálido, exuberante, balada de jazz. 7.a dominante (C7): tenso, bluesy, exige resolución. 7.a menor (Cm7): suave, blando, relajado. Semidisminuido (Cm7b5): sombrío, anhelante, film noir. Disminuido (Cdim7): máximamente tenso, cada nota quiere moverse. Menor-mayor con 7.a (CmMaj7): misterioso, inquietante — el choque entre tríada menor y 7.a mayor. Practica tocando los seis a partir de la misma fundamental en secuencia.',
          tryThisLabel: 'Escucha 7.a mayor — cálido y exuberante',
        },
        {
          title: 'La Distinción 7.a Dominante frente a 7.a Mayor',
          explanation:
            'La distinción de acordes de séptima más importante. 7.a mayor (Cmaj7) y 7.a dominante (C7) comparten una tríada mayor pero difieren en una nota: B (7.a mayor) frente a Bb (7.a menor). Esa diferencia de un semitono transforma el acorde de reposo cálido a tensión bluesy. La 7.a dominante exige resolución — atrae hacia un acorde una 5.a por debajo (C7 quiere ir a F). La 7.a mayor se queda contenta donde está. Esta distinción es la puerta de entrada a escuchar armonía funcional, porque la 7.a dominante es el motor del movimiento armónico.',
          tryThisLabel:
            'Escucha 7.a dominante — tensa, bluesy, necesita moverse',
        },
        {
          title: 'El Lado Sombrío: Semidisminuido y Disminuido',
          explanation:
            'Semidisminuido (Cm7b5) y disminuido (Cdim7) son las cualidades de acordes de séptima más sombrías. El semidisminuido combina una tríada disminuida con una 7.a menor — suena anhelante, inestable y cinematográfico. El disminuido apila 3.as menores simétricamente — es máximamente tenso, con cada nota equidistante y cada nota queriendo resolver. La distinción: el semidisminuido tiene un intervalo «normal» (la 7.a menor desde la fundamental) que le da un toque de calidez. El disminuido está uniformemente comprimido y tenso a lo largo de toda la estructura. En jazz, el semidisminuido es el acorde ii en tonalidades menores; el disminuido es un acorde de paso o sustituto del dominante.',
          tryThisLabel:
            'Escucha semidisminuido — sombrío y anhelante',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca estos acordes de séptima en secuencia: "Cmaj7", "C7", "Cm7", "Cm7b5", "Cdim7". Cada uno tiene una firma emocional distinta. Describe lo que sientes en cada uno',
        },
        {
          instruction:
            'Compara "Cmaj7" (cálido, resuelto) con "C7" (tenso, necesita moverse). La única diferencia es una nota — B frente a Bb. Ese único semitono cambia el carácter entero',
        },
        {
          instruction:
            'Toca "Cm7" y después "Cm7b5". La 7.a menor es suave y blanda. El semidisminuido es más sombrío y anhelante — la 5.a descendida añade inestabilidad. Esta distinción importa en el jazz y en la conducción de voces clásica',
        },
      ],
    },

    // ── U32 M1: Melodic Dictation Diatonic ──────────────────────────────
    l9u32m1: {
      title: 'Dictado Melódico: Diatónico',
      subtitle:
        'Transcribir melodías diatónicas cortas de oído — movimiento por grados y triádico',
      objectives: [
        'Transcribir melodías diatónicas cortas de oído usando un proceso sistemático',
        'Aplicar la estrategia «marco primero»: identificar tonalidad, compás y cadencia antes de escribir notas',
        'Manejar movimiento por grados y saltos triádicos (contornos de acorde como C-E-G) en tonalidades mayores',
      ],
      concepts: [
        {
          title: 'El Proceso de Dictado',
          explanation:
            'El dictado melódico sigue un proceso sistemático — apresurarse a escribir notas inmediatamente es el error más común. Primera escucha: capta la forma general, la tonalidad y el compás. Identifica la tónica encontrando la nota que suena como «casa» — normalmente la nota final. Segunda escucha: concéntrate en las primeras notas y las últimas. Tercera escucha: rellena el centro, construyendo frase a frase. Comienza siempre por el ritmo y el contorno (la forma de sube-y-baja) y después afina hacia alturas exactas. Verifica tu trabajo: ¿la transcripción tiene sentido musical?',
          tryThisLabel:
            'Toca una escala de referencia para anclar la tonalidad',
        },
        {
          title: 'Estrategia del Marco Primero',
          explanation:
            'Antes de escribir una sola nota, establece el marco que restringe tus opciones. Identifica la tonalidad escuchando la tónica — la nota de reposo y resolución. Marca el pulso para encontrar el compás (¿está en 2, 3 o 4?). Escucha la cadencia al final — ¿resuelve conclusivamente (cadencia auténtica) o te deja en suspenso (semicadencia)? Después rellena notas, comenzando por el ritmo y la dirección general. El marco elimina respuestas erróneas antes de que empieces, haciendo el trabajo de detalle mucho más fácil.',
          tryThisLabel:
            'Escucha el acorde de tónica — tu punto de anclaje',
        },
        {
          title: 'Contorno Antes de la Altura',
          explanation:
            'Contorno es la forma de una melodía — su patrón de subidas y bajadas — sin especificar intervalos exactos. Antes de intentar nombrar alturas específicas, dibuja el contorno: ¿la melodía sube, baja, hace arco o se mantiene? Una melodía en arco (sube y después baja) es la forma más común. Una melodía que desciende a lo largo de toda su duración es menos común y suena como si se estuviera asentando. El contorno es el esqueleto del dictado. Si tu contorno está equivocado, tus alturas estarán equivocadas por más cuidadosamente que escuches. Acierta siempre la forma primero y después rellena las notas exactas.',
          tryThisLabel:
            'Toca G mayor — el contorno ascendente más simple',
        },
      ],
      tasks: [
        {
          instruction:
            'Pide a un amigo que toque 4-5 notas aleatorias de la escala de C mayor en el piano. Intenta cantarlas de vuelta y después encuéntralas en el teclado. Comienza solo con movimiento por grados',
        },
        {
          instruction:
            'Escucha una melodía corta e identifica primero solo el contorno — ¿sube, baja, se mantiene o hace arco? El contorno es el esqueleto del dictado y debe venir siempre antes de las alturas exactas',
        },
        {
          instruction:
            'Practica identificar la última nota de una melodía — ¿es la tónica? Si es así, la melodía termina con resolución. Si no, suena inacabada. Esta única observación establece la tonalidad',
        },
      ],
    },

    // ── U32 M2: Melodic Dictation Chromatic ─────────────────────────────
    l9u32m2: {
      title: 'Dictado Melódico: Cromático',
      subtitle:
        'Transcribir melodías con notas cromáticas de paso, notas vecinas y dominantes secundarias',
      objectives: [
        'Reconocer notas cromáticas de paso y notas vecinas dentro de melodías diatónicas',
        'Escuchar el efecto de dominantes secundarias en líneas melódicas — sensibles prestadas',
        'Progresar en niveles de dificultad desde ornamentación cromática hasta dictado a dos voces',
      ],
      concepts: [
        {
          title: 'Ornamentación Cromática',
          explanation:
            'Las notas cromáticas de paso y notas vecinas son notas fuera de la tonalidad que enlazan o decoran notas diatónicas. Una nota cromática de paso rellena el intervalo entre dos notas diatónicas a un tono de distancia — por ejemplo, C a C# a D en C mayor. Una nota cromática vecina sale de la tonalidad y regresa inmediatamente — D a D# a D. Estas notas crean color y tensión sin cambiar la tonalidad. El reto del entrenamiento auditivo es distinguir ornamentaciones cromáticas (desviaciones temporales) de modulaciones reales (cambios permanentes de tonalidad). Si la nota resuelve por grado de vuelta a la tonalidad, probablemente sea ornamentación.',
          tryThisLabel:
            'Toca el marco diatónico — después imagina relleno cromático',
        },
        {
          title: 'Dominantes Secundarias en Melodías',
          explanation:
            'Cuando una melodía introduce brevemente una nota fuera de la tonalidad que funciona como sensible de un acorde diatónico, se está oyendo la influencia de una dominante secundaria. En C mayor, un F# puede aparecer como sensible de G (la dominante) — atrae fuertemente hacia G de la misma forma que B atrae hacia C. En el dictado, estas sensibles prestadas son identificables porque resuelven por semitono ascendente a una nota diatónica. Escuchar F# resolver a G en una melodía en C mayor es una pista de dominante secundaria: V/V (quinto del quinto). Esta es la puente entre dictado diatónico y cromático.',
          tryThisLabel:
            'Escucha G7 — la sensible B atrae hacia C',
        },
        {
          title: 'Progresión de Dificultad',
          explanation:
            'El dictado cromático escala en niveles claros. Nivel 1: notas cromáticas de paso entre notas diatónicas (C-C#-D). Nivel 2: notas cromáticas vecinas (D-D#-D). Nivel 3: sensibles secundarias resolviendo por semitono ascendente (F#-G en C mayor). Nivel 4: secuencias cromáticas donde un patrón diatónico se transpone cromáticamente. Nivel 5: dictado a dos voces con elementos cromáticos en ambas. No saltes nunca de nivel — cada uno construye sobre el anterior. En cada etapa, mantén al menos un 80 por ciento de precisión antes de avanzar.',
          tryThisLabel:
            'Escucha menor — el dictado se vuelve más difícil con 6.o y 7.o grados variables',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca la escala de C mayor lentamente, después inserta una nota cromática de paso entre D y E (toca D-D#-E). Ahora prueba C-C#-D. Escucha cómo la nota cromática crea color momentáneo sin perturbar la tonalidad',
        },
        {
          instruction:
            'En un contexto de C mayor, toca la secuencia E-F#-G. El F# es una sensible secundaria de G. Suena como una tonicización temporal — G se convierte brevemente en el centro de gravedad antes de que C se reafirme',
        },
        {
          instruction:
            'Escucha cualquier melodía con atención plena y marca los momentos en que una nota suena «fuera» de la tonalidad. ¿Resuelve por grado? Si es así, probablemente sea ornamentación cromática. Si no, considera si la tonalidad ha cambiado',
        },
      ],
    },

    // ── U32 M3: Harmonic Dictation ──────────────────────────────────────
    l9u32m3: {
      title: 'Dictado Armónico: Cadencias y Progresiones',
      subtitle:
        'Identificar cadencias, transcribir progresiones y dictado de línea de bajo',
      objectives: [
        'Identificar tipos de cadencia (auténtica, plagal, semicadencia, deceptiva) de oído',
        'Transcribir progresiones diatónicas de cuatro acordes usando numeración romana',
        'Realizar dictado de línea de bajo como puerta de entrada a la transcripción armónica completa',
      ],
      concepts: [
        {
          title: 'Escuchar la Línea de Bajo',
          explanation:
            'La línea de bajo es la puerta de entrada al dictado armónico. La nota del bajo define el acorde más que cualquier otra voz — indica la fundamental (o la inversión). Practica escuchando progresiones de acordes y cantando solo las notas del bajo. Si puedes seguir el bajo con precisión, estás la mayor parte del camino hacia identificar la armonía. Los acordes en posición fundamental tienen la relación bajo-acorde más clara. Las inversiones requieren que oigas la nota del bajo como no fundamental y después infierras el acorde real sobre ella.',
          tryThisLabel:
            'Escucha la nota del bajo — ancla el acorde',
        },
        {
          title: 'Reconocimiento de Cadencias',
          explanation:
            'Las cadencias son la puntuación de la música — aprende a escucharlas antes de abordar progresiones completas. La cadencia auténtica (V-I) suena final y conclusiva — un punto final. La cadencia plagal (IV-I) suena más suave y cálida — como «Amén». La semicadencia (terminando en V) suena incompleta — un signo de interrogación. La cadencia deceptiva (V-vi) sorprende: esperas resolución a I pero aterrizas en vi. Identificar la cadencia al final de una frase te da dos acordes inmediatamente y ancla la tonalidad.',
          tryThisLabel: 'Escucha V (G) — ¿atrae hacia C (I)?',
        },
        {
          title: 'Proceso de Dictado de Progresiones',
          explanation:
            'El dictado armónico completo sigue un proceso sistemático. Paso 1: escucha la tonalidad — identifica el acorde de tónica y la cadencia. Paso 2: sigue la línea de bajo — las notas del bajo delinean el movimiento armónico. Paso 3: identifica la cualidad del acorde en cada cambio de nota del bajo — ¿es mayor, menor o disminuido? Paso 4: asigna numeración romana según el grado de la escala de cada nota del bajo. Paso 5: verifica la coherencia — ¿el ritmo armónico (tasa de cambio de acorde) tiene sentido? Comienza con cadencias de dos acordes y avanza hacia progresiones de cuatro acordes.',
          tryThisLabel:
            'Ve los acordes diatónicos disponibles en C mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Escucha música que conozcas bien e intenta identificar las cadencias. ¿Cada frase termina con un fuerte V-I (auténtica)? ¿Un suave IV-I (plagal)? ¿O una semicadencia no resuelta terminando en V?',
        },
        {
          instruction:
            'Practica dictado de línea de bajo por separado del análisis armónico completo — canta o tararea la nota más grave que oyes en cada acorde de una progresión. El bajo es siempre tu punto de partida',
        },
        {
          instruction:
            'Comienza con cadencias de dos acordes: toca pares aleatorios de V-I y IV-I en diferentes tonalidades en el piano. ¿Puedes decir qué tipo de cadencia es antes de verificar? Después añade cadencias deceptivas (V-vi)',
        },
      ],
    },

    // ── U32 M4: Sight Singing Fundamentals ──────────────────────────────
    l9u32m4: {
      title: 'Fundamentos de Lectura a Primera Vista',
      subtitle:
        'Solfeo móvil para lectura a primera vista en tonalidades mayores y menores',
      objectives: [
        'Usar solfeo móvil (do-re-mi-fa-sol-la-si) para lectura a primera vista en tonalidades mayores',
        'Aplicar sílabas de solfeo cromático para tonalidades menores: me, le, te para grados descendidos',
        'Seguir un proceso sistemático de lectura a primera vista: tonalidad, extensión, patrones, después cantar',
      ],
      concepts: [
        {
          title: 'Solfeo Móvil',
          explanation:
            'En el solfeo móvil, «do» representa siempre la tónica de la tonalidad actual — independientemente de qué nota sea. C mayor: do=C. G mayor: do=G. Bb mayor: do=Bb. Esto asigna sílabas a función, no a altura absoluta. «Sol» suena siempre como dominante, «ti» suena siempre como la sensible atrayendo hacia «do». Este es el enfoque Kodály/Berklee, y sus defensores argumentan que entrena la escucha funcional de forma más directa — aprendes a escuchar relaciones, no solo nombres de notas. El solfeo fijo (donde do es siempre C), el estándar en los conservatorios de muchos países incluyendo Francia e Italia, construye en cambio la asociación de altura absoluta — ambos sistemas son ampliamente usados.',
          tryThisLabel: 'Canta: do-re-mi-fa-sol-la-ti-do',
        },
        {
          title: 'Solfeo Cromático para Tonalidades Menores',
          explanation:
            'Las tonalidades menores requieren sílabas modificadas para los grados descendidos. En el menor basado en do: 3.a b = «me», 6.a b = «le», 7.a b = «te». Menor natural se convierte en: do-re-me-fa-sol-le-te-do. Menor armónica eleva el 7.o de vuelta a «ti»: do-re-me-fa-sol-le-ti-do. Menor melódica ascendente eleva ambos: do-re-me-fa-sol-la-ti-do. Para alteraciones cromáticas: sostenidos ascendentes usan -i (di, ri, fi, si, li); bemoles descendentes usan vocales modificadas (ra, me, se, le, te). Estas sílabas hacen explícitos los grados alterados al cantar.',
          tryThisLabel:
            'Canta: do-re-me-fa-sol-le-te-do (menor basado en la, un sistema alternativo común en la práctica Kodály: la-ti-do-re-mi-fa-sol)',
        },
        {
          title: 'Proceso de Lectura a Primera Vista',
          explanation:
            'Antes de cantar una sola nota, sigue una lista de verificación. (1) Identifica la armadura de clave y la indicación de compás. (2) Busca las notas más aguda y más grave para conocer los requisitos de extensión vocal. (3) Busca patrones — escalas, arpegios, motivos repetidos, secuencias. (4) Establece un tempo suficientemente lento para mantener la precisión (la velocidad se desarrolla naturalmente con la práctica). (5) Canta manteniendo un pulso regular por encima de todo. Una nota equivocada a un tempo regular es mejor que una nota correcta con ritmo roto. El pulso es el esqueleto; las alturas son la carne.',
          tryThisLabel:
            'Lee a primera vista G mayor: do comienza en G',
        },
      ],
      tasks: [
        {
          instruction:
            'Canta la escala mayor usando sílabas de solfeo: do-re-mi-fa-sol-la-ti-do. Comienza en cualquier altura cómoda. Después desciende: do-ti-la-sol-fa-mi-re-do. Mantén un pulso regular a lo largo',
        },
        {
          instruction:
            'Ahora canta menor natural usando solfeo basado en do: do-re-me-fa-sol-le-te-do. Repara en las tres sílabas descendidas — «me», «le» y «te» — estos son los tres grados que difieren del mayor',
        },
        {
          instruction:
            'Practica patrones de arpegio simples: do-mi-sol (arpegio mayor), do-me-sol (arpegio menor), sol-ti-re (arpegio dominante). Canta estos en al menos tres tonalidades diferentes para interiorizar la función, no la altura absoluta',
        },
      ],
    },

    // ── U32 M5: Contextual Listening ────────────────────────────────────
    l9u32m5: {
      title: 'Escucha Contextual',
      subtitle:
        'Identificar textura, forma, instrumentos y periodos estilísticos de oído',
      objectives: [
        'Identificar textura musical: monofónica, homofónica, polifónica y homorrítmica',
        'Reconocer estructuras formales de oído: binaria, ternaria, rondó y estrofa-estribillo',
        'Atribuir música a periodos estilísticos históricos por rasgos sonoros característicos',
      ],
      concepts: [
        {
          title: 'Identificación de Textura',
          explanation:
            'La textura musical describe cuántas voces están presentes y cómo se relacionan entre sí. La monofonía es una línea única sin acompañamiento — limpia y expuesta, como una melodía de flauta a solo. La homofonía es una melodía con armonía de soporte por debajo — la textura más común en la música occidental (piensa en un cantante con acordes de guitarra). La polifonía tiene múltiples melodías independientes sonando simultáneamente — densa y compleja, como una fuga de Bach. La homorritmia es un caso especial donde todas las voces se mueven en el mismo ritmo, como un coral. Aprender a escuchar textura es aprender a escuchar cómo la música está organizada verticalmente.',
          tryThisLabel:
            'Un acorde es textura homofónica en miniatura',
        },
        {
          title: 'Forma de Oído',
          explanation:
            'Escuchar forma significa seguir repetición y contraste a lo largo del tiempo. Cuando el material regresa, etiquétalo «A». Cuando aparece material nuevo, etiquétalo «B». Forma binaria es AB (dos secciones contrastantes). Ternaria es ABA (ida y vuelta). Rondó alterna un tema recurrente con episodios contrastantes: ABACA. Estrofa-estribillo es el equivalente pop de secciones alternadas. Escucha los límites seccionales — cadencias, pausas, cambios de tonalidad y cambios de textura o dinámica señalan divisiones formales. La competencia es la capacidad de atención: hay que mantener la primera sección en la memoria para reconocer su regreso.',
          tryThisLabel:
            'Explora G mayor — la mayoría de las formas comienza y termina en la tonalidad de casa',
        },
        {
          title: 'Reconocimiento de Periodo Estilístico',
          explanation:
            'Cada era histórica tiene sonidos característicos que se pueden aprender a identificar. Barroco (1600-1750): motor rítmico continuo, bajo continuo, melodías ornamentales, dinámicas en terrazas (cambios súbitos forte/piano). Clásico (1750-1820): frases equilibradas de 4 y 8 compases, patrones de bajo Alberti, cadencias claras, simplicidad elegante. Romántico (1820-1900): orquestas expandidas, armonía cromática, melodías largas y amplias, extensión dinámica extrema. Siglo XX (1900-2000): disonancia como recurso primario, timbres nuevos, complejidad rítmica, experimentación formal. Cada periodo construye sobre y reacciona contra el anterior.',
          tryThisLabel:
            'Menor armónica — un clásico del Barroco y del Clásico',
        },
      ],
      tasks: [
        {
          instruction:
            'Escucha una pieza musical e identifica la textura. ¿Hay una melodía única sin acompañamiento (monofonía), una melodía con acordes (homofonía), o múltiples melodías entrecruzadas (polifonía)?',
        },
        {
          instruction:
            'Elige una canción que conozcas bien y mapea su forma. Etiqueta las secciones A, B, C. ¿Es estrofa-estribillo (AB alternado)? ¿ABA (ida y vuelta)? ¿Sin repetición a gran escala (durchkomponiert)?',
        },
        {
          instruction:
            'Escucha música orquestal e identifica primero las familias de instrumentos: cuerdas frente a metales frente a maderas frente a percusión. Después afina hacia instrumentos específicos dentro de cada familia — violín frente a violonchelo, trompeta frente a trombón, flauta frente a clarinete',
        },
      ],
    },
  },
};

export default curriculumL9;
