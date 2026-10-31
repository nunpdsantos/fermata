import type { CurriculumLevelOverlay } from '../types';

const curriculumL2: CurriculumLevelOverlay = {
  // ─── Unidades ─────────────────────────────────────────────────────────────
  units: {
    u4: {
      title: 'Todas las Tonalidades Mayores y Grados de la Escala',
      description:
        'Las 15 armaduras de clave mayores, el Círculo de Quintas y los nombres y funciones de los grados de la escala',
    },
    u5: {
      title: 'Escalas Menores y Relaciones entre Tonalidades',
      description:
        'Escalas menor natural, armónica y melódica, además de las relaciones entre tonalidades relativas y paralelas',
    },
    u6: {
      title: 'Compás Compuesto y Síncopa',
      description:
        'Indicaciones de compás compuesto, síncopa, tresillos y conceptos rítmicos avanzados',
    },
    u7: {
      title: 'Intervalos, Tríadas y Armonía Diatónica',
      description:
        'El sistema completo de cualidad de intervalos, los cuatro tipos de tríadas, inversiones con bajo cifrado y tríadas diatónicas con números romanos',
    },
  },

  // ─── Módulos ──────────────────────────────────────────────────────────────
  modules: {
    // ── U4 M1: Todas las Tonalidades Mayores y el Círculo de Quintas ─────
    l2u4m1: {
      title: 'Todas las Tonalidades Mayores y el Círculo de Quintas',
      subtitle: 'El conjunto completo de 15 armaduras de clave mayores y cómo se conectan entre sí',
      objectives: [
        'Identificar las 15 armaduras de clave mayores, incluidos los pares enarmónicos',
        'Aplicar el orden de los sostenidos (F-C-G-D-A-E-B) y de los bemoles (B-E-A-D-G-C-F)',
        'Determinar la tonalidad a partir de la armadura de clave y viceversa',
        'Usar el Círculo de Quintas como mapa de todas las tonalidades',
      ],
      concepts: [
        {
          title: 'El Conjunto Completo de Tonalidades Mayores',
          explanation:
            'Existen 15 armaduras de clave mayores, pero solo 12 tonalidades distintas. Tres pares son enarmónicos — suenan de forma idéntica pero se escriben de manera diferente: B/Cb, F#/Gb y C#/Db. Las tonalidades con sostenidos van de C (0 sostenidos) hasta C# (7 sostenidos). Las tonalidades con bemoles van de C hasta Cb (7 bemoles).',
          tryThisLabel: 'Observa B mayor — 5 sostenidos',
        },
        {
          title: 'Orden de los Sostenidos y Bemoles',
          explanation:
            'Los sostenidos aparecen siempre en el mismo orden: F-C-G-D-A-E-B. Cada nueva tonalidad con sostenidos añade el siguiente de la secuencia. G mayor tiene F#. D mayor tiene F# y C#. Los bemoles siguen el orden inverso: B-E-A-D-G-C-F. F mayor tiene Bb. Bb mayor tiene Bb y Eb. Este orden nunca cambia.',
          tryThisLabel: 'Observa A mayor — 3 sostenidos',
        },
        {
          title: 'Trucos de Identificación Rápida',
          explanation:
            'Para tonalidades con sostenidos: el último sostenido es siempre el 7.º grado de la escala — sube un semitono y encontrarás el nombre de la tonalidad. Si el último sostenido es F#, la tonalidad es G. Para tonalidades con bemoles: el penúltimo bemol ES la tonalidad. Si tienes Bb y Eb, la tonalidad es Bb. La excepción: un único bemol significa siempre F mayor.',
          tryThisLabel: 'Observa Db mayor — 5 bemoles',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre el Círculo de Quintas y nombra todas las tonalidades con sostenidos en el sentido de las agujas del reloj a partir de C',
        },
        {
          instruction:
            'Escribe "Ab major scale" — ¿cuántos bemoles necesita? ¿Puedes nombrarlos en orden?',
        },
        {
          instruction:
            'Escribe "E major scale" — el último sostenido es D#. Sube un semitono: E. ¡El truco funciona!',
        },
      ],
    },

    // ── U4 M2: Nombres y Funciones de los Grados de la Escala ────────────
    l2u4m2: {
      title: 'Nombres y Funciones de los Grados de la Escala',
      subtitle: 'Los siete nombres funcionales que todo músico debe conocer',
      objectives: [
        'Nombrar los siete grados de la escala: tónica, supertónica, mediante, subdominante, dominante, submediante, sensible',
        'Comprender el significado funcional de cada nombre de grado',
        'Distinguir la sensible de la subtónica',
      ],
      concepts: [
        {
          title: 'Los Siete Nombres de los Grados de la Escala',
          explanation:
            'Cada grado de la escala tiene un nombre funcional: 1=Tónica (reposo), 2=Supertónica (por encima de la tónica), 3=Mediante (punto medio entre tónica y dominante), 4=Subdominante (la «dominante inferior» — una 5.ª por debajo de la tónica, igual que la dominante está una 5.ª por encima), 5=Dominante (crea tensión hacia la tónica), 6=Submediante (la «mediante inferior» — a medio camino entre la tónica y la subdominante que está por debajo), 7=Sensible (un semitono por debajo de la tónica, la atracción más fuerte hacia casa).',
          tryThisLabel: 'Observa los siete grados de C mayor',
        },
        {
          title: 'Sensible vs. Subtónica',
          explanation:
            'Cuando el 7.º grado está a un semitono por debajo de la tónica (como en la escala mayor y menor armónica), se llama sensible — atrae fuertemente hacia arriba, hacia la resolución. Cuando el 7.º grado está a un tono por debajo de la tónica (como en la menor natural), se llama subtónica — la atracción es más débil. Esta distinción explica por qué existe la menor armónica: los compositores elevaron el 7.º grado para crear una sensible.',
          tryThisLabel: 'Escucha la subtónica en la menor natural',
        },
        {
          title: 'Por Qué Importan Estos Nombres',
          explanation:
            'Los nombres no son etiquetas arbitrarias — describen función armónica. La dominante (5) y la sensible (7) crean tensión. La tónica (1) proporciona resolución. La subdominante (4) y la supertónica (2) crean movimiento hacia la dominante. Comprender la función es la clave para comprender la armonía. El sistema de colores de esta app codifica estas funciones: azul=tónica, ámbar=dominante, rojo=sensible.',
          tryThisLabel: 'Observa los colores de los grados en G mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" y nombra cada grado de la escala por su nombre funcional, de la tónica a la sensible',
        },
        {
          instruction:
            'Observa los colores de los grados — ¿cuál es azul (tónica)? ¿Cuál es ámbar (dominante)? ¿Cuál es rojo (sensible)?',
        },
        {
          instruction:
            'Escribe "A natural minor scale" y después "A harmonic minor scale" — ¿cuál de ellas eleva el 7.º grado para crear una sensible?',
        },
      ],
    },

    // ── U5 M1: Escala Menor Natural ──────────────────────────────────────
    l2u5m1: {
      title: 'Escala Menor Natural',
      subtitle: 'El patrón T-S-T-T-S-T-T y el lado más sombrío de la tonalidad',
      objectives: [
        'Construir la escala menor natural a partir de cualquier nota usando T-S-T-T-S-T-T',
        'Escuchar el carácter contrastante de las escalas mayor y menor',
        'Comprender que cada tonalidad menor comparte la armadura de clave con una relativa mayor',
      ],
      concepts: [
        {
          title: 'El Patrón de la Menor Natural',
          explanation:
            'La escala menor natural sigue T-S-T-T-S-T-T — compara con el patrón de la mayor: T-T-S-T-T-T-S. Los semitonos caen en posiciones diferentes, y eso lo cambia todo. La escala de A menor natural es la más fácil de ver: usa solo teclas blancas, de A a G y de vuelta a A.',
          tryThisLabel: 'Escucha A menor natural — solo teclas blancas',
        },
        {
          title: 'Carácter Mayor vs. Menor',
          explanation:
            'Toca la escala de C mayor y después la escala de C menor. La escala menor suena más sombría, más emocional — oyes la diferencia instantáneamente. La diferencia proviene de tres grados descendidos: el 3.º, 6.º y 7.º están cada uno un semitono más bajo que en la escala mayor. Estas tres alteraciones transforman brillante y resuelto en sombrío e introspectivo.',
          tryThisLabel: 'Compara C menor con C mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "A natural minor scale" y después "C major scale" — usan las mismas notas pero comienzan en notas diferentes. Escucha cómo el carácter cambia completamente',
        },
        {
          instruction:
            'Escribe "D minor scale" — ¿qué nota necesita un bemol para mantener el patrón T-S-T-T-S-T-T?',
        },
        {
          instruction:
            'Escribe "E minor scale" — ¿cuántos sostenidos necesita? Compara con G mayor (su relativa mayor)',
        },
      ],
    },

    // ── U5 M2: Menor Armónica y Melódica ─────────────────────────────────
    l2u5m2: {
      title: 'Menor Armónica y Melódica',
      subtitle: 'Por qué existen tres formas de menor — y qué resuelve cada una',
      objectives: [
        'Construir la menor armónica elevando el 7.º grado de la menor natural',
        'Construir la menor melódica elevando el 6.º y 7.º grados en la forma ascendente',
        'Comprender por qué existen tres formas: natural para pureza, armónica para cadencias, melódica para melodía fluida',
      ],
      concepts: [
        {
          title: 'Menor Armónica',
          explanation:
            'La escala menor armónica eleva el 7.º grado un semitono, creando una sensible. La escala de A menor armónica: A-B-C-D-E-F-G#. Ahora el acorde V es mayor, dando a la tonalidad una fuerte atracción dominante-tónica. La contrapartida: surge una 2.ª aumentada (3 semitonos) entre el 6.º y 7.º grados, dando a la menor armónica su sonido exótico distintivo.',
          tryThisLabel: 'Escucha el 7.º grado elevado',
        },
        {
          title: 'Menor Melódica',
          explanation:
            'La escala menor melódica corrige la 2.ª aumentada elevando también el 6.º grado — pero tradicionalmente solo en la forma ascendente. Ascendente: T-S-T-T-T-T-S. Descendente: menor natural. La forma melódica ascendente de A: A-B-C-D-E-F#-G#. En el jazz, la forma ascendente se usa en ambas direcciones y se llama escala «menor jazz».',
          tryThisLabel: 'Escucha la menor melódica',
        },
        {
          title: 'Tres Formas, Tres Propósitos',
          explanation:
            'La escala menor natural es pura y folclórica, pero su acorde v menor carece de poder de resolución. La escala menor armónica da un acorde V mayor con sensible — esencial para cadencias fuertes. La escala menor melódica suaviza la 2.ª aumentada incómoda para melodías vocales e instrumentales. Los compositores eligen entre las formas según lo que la música necesita en cada momento.',
          tryThisLabel: 'Construye E menor natural',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "A natural minor", "A harmonic minor" y "A melodic minor" en secuencia — escucha cómo cada forma suena diferente',
        },
        {
          instruction:
            'Escribe "D harmonic minor scale" — ¿qué nota se eleva con respecto a D menor natural?',
        },
        {
          instruction:
            'Escribe "E melodic minor scale" — identifica las dos notas elevadas con respecto a la menor natural',
        },
      ],
    },

    // ── U5 M3: Tonalidades Relativas y Paralelas ─────────────────────────
    l2u5m3: {
      title: 'Tonalidades Relativas y Paralelas',
      subtitle: 'Dos formas de conectar mayor y menor',
      objectives: [
        'Encontrar pares de relativa mayor/menor usando la regla del 6.º grado / 3.er grado',
        'Comprender tonalidades paralelas como misma fundamental, cualidad diferente',
        'Ver cómo estas relaciones aparecen en el Círculo de Quintas',
      ],
      concepts: [
        {
          title: 'Tonalidades Relativas',
          explanation:
            'Las tonalidades relativas comparten la misma armadura de clave pero tienen tónicas diferentes. Para encontrar la relativa menor de una tonalidad mayor, ve al 6.º grado. C mayor → A menor. G mayor → E menor. Para encontrar la relativa mayor, ve al 3.er grado de la escala menor. Así, A menor → C mayor. El Círculo de Quintas muestra ambas: tonalidades mayores en el anillo exterior, sus relativas menores en el anillo interior.',
          tryThisLabel: 'Observa las tonalidades relativas en el Círculo',
        },
        {
          title: 'Tonalidades Paralelas',
          explanation:
            'Las tonalidades paralelas comparten la misma fundamental pero tienen cualidades diferentes. C mayor y C menor son paralelas. Comparten la nota tónica pero difieren en el 3.er, 6.º y 7.º grados. La relación paralela se vuelve crítica más adelante en la mezcla modal — tomar prestados acordes de la tonalidad paralela para añadir color.',
          tryThisLabel: 'Compara C menor con C mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "Eb major scale" — ¿cuál es el 6.º grado? Esa es la relativa menor. Verifica con el Círculo de Quintas',
        },
        {
          instruction:
            'Escribe "C major scale" y después "C minor scale" — ¿qué tres notas cambian? (3.ª, 6.ª, 7.ª). Estas son tonalidades paralelas',
        },
        {
          instruction:
            'En el Círculo de Quintas, encuentra D mayor en el anillo exterior. ¿Qué tonalidad menor está en el interior? Verifica con "B minor scale"',
        },
      ],
    },

    // ── U6 M1: Compás Compuesto: 6/8, 9/8, 12/8 ─────────────────────────
    l2u6m1: {
      title: 'Compás Compuesto: 6/8, 9/8, 12/8',
      subtitle: 'Cuando los tiempos se dividen en tres — la cadencia ondulante del compás compuesto',
      objectives: [
        'Distinguir compás simple (tiempos se dividen en 2) de compás compuesto (tiempos se dividen en 3)',
        'Leer indicaciones de compás compuesto: 6/8, 9/8, 12/8',
        'Sentir la diferencia entre 3/4 (tres tiempos binarios) y 6/8 (dos tiempos ternarios)',
      ],
      concepts: [
        {
          title: 'Simple vs. Compuesto',
          explanation:
            'En el compás simple, cada tiempo se divide naturalmente en dos partes iguales (una negra se divide en dos corcheas). En el compás compuesto, cada tiempo se divide en tres (una negra con puntillo se divide en tres corcheas). El número de arriba en las indicaciones compuestas es 6, 9 o 12 — divide entre 3 para encontrar el número de tiempos: 6/8 tiene 2 tiempos, 9/8 tiene 3, 12/8 tiene 4.',
          tryThisLabel: 'Siente un pulso ondulante — UN-y-a DOS-y-a',
        },
        {
          title: '3/4 vs. 6/8',
          explanation:
            '3/4 tiene tres tiempos, cada uno dividido en dos: UN-y DOS-y TRES-y. 6/8 tiene dos tiempos, cada uno dividido en tres: UN-y-a DOS-y-a. El mismo número total de corcheas por compás (seis), pero agrupamiento diferente. 3/4 suena como un vals; 6/8 suena como una jiga. La distinción se basa en la sensación, no en las matemáticas.',
          tryThisLabel: 'Prueba contar en grupos de 3 vs. grupos de 2',
        },
      ],
      tasks: [
        {
          instruction:
            'Marca un pulso regular y agrupa corcheas de tres en tres: UN-y-a DOS-y-a. Esta es la sensación de 6/8 — dos tiempos grandes, cada uno con tres subdivisiones',
        },
        {
          instruction:
            'Ahora marca en 3/4: UN-y DOS-y TRES-y. El mismo número de corcheas, pero el patrón de acentuación es completamente diferente. Siente la distinción entre vals y jiga',
        },
      ],
    },

    // ── U6 M2: Síncopa y Tresillos ───────────────────────────────────────
    l2u6m2: {
      title: 'Síncopa y Tresillos',
      subtitle: 'Ritmos que empujan contra el tiempo — acentos en tiempos débiles y divisiones prestadas',
      objectives: [
        'Definir síncopa como la acentuación de tiempos o partes de tiempos normalmente débiles',
        'Comprender tresillos como agrupamientos prestados de tres en un contexto binario',
        'Escuchar cómo la síncopa crea energía e impulso hacia adelante',
      ],
      concepts: [
        {
          title: 'Síncopa',
          explanation:
            'La síncopa coloca acentos donde el oído no los espera — en tiempos débiles o entre tiempos. En lugar de UN-dos-TRES-cuatro, un ritmo sincopado puede acentuar el «y» del tiempo 2: un-dos-Y-tres-cuatro. Este desplazamiento crea tensión rítmica y energía. La síncopa es la fuerza motriz del jazz, funk, música latina y prácticamente toda la música popular. Sin ella, el ritmo es predecible; con ella, el ritmo cobra vida.',
          tryThisLabel: 'Toca un acorde — ahora imagina tocarlo en el «y» del 2',
        },
        {
          title: 'Tresillos y Dosillos',
          explanation:
            'Un tresillo divide un tiempo que normalmente tiene dos subdivisiones en tres partes iguales. En 4/4, un tresillo de corcheas encaja tres notas en el espacio de dos — crea una breve sensación compuesta dentro del compás simple. Lo inverso también existe: un dosillo divide un tiempo compuesto en dos en lugar de tres. Estas divisiones prestadas añaden variedad rítmica y efectos de ritmo cruzado.',
          tryThisLabel: 'Escucha un acorde — imagina tres pulsaciones en un solo tiempo',
        },
      ],
      tasks: [
        {
          instruction:
            'Aplaude en negras regulares, después desplaza la palmada al «y» entre tiempos. Ese énfasis en el contratiempo es síncopa',
        },
        {
          instruction:
            'Marca dos tiempos iguales, después intenta marcar tres uniformemente en el mismo intervalo. Esa sensación de 3 contra 2 es la esencia de un tresillo',
        },
      ],
    },

    // ── U7 M1: Cualidad del Intervalo: Justo, Mayor, Menor ──────────────
    l2u7m1: {
      title: 'Cualidad del Intervalo: Justo, Mayor, Menor',
      subtitle: 'Clasificar intervalos por el número y la cualidad',
      objectives: [
        'Comprender que los intervalos tienen un número (distancia) y una cualidad (carácter)',
        'Clasificar intervalos justos: unísono, 4.ª, 5.ª, octava',
        'Clasificar intervalos mayores y menores: 2.ª, 3.ª, 6.ª, 7.ª',
      ],
      concepts: [
        {
          title: 'El Sistema de Cualidades',
          explanation:
            'En el Nivel 1, mediste intervalos por número: una 3.ª, una 5.ª. Ahora añade la cualidad — que refina el número con un carácter preciso. Los intervalos justos (unísono, 4.ª, 5.ª, octava) ocurren naturalmente entre la tónica y los grados 1, 4, 5 y 8 de la escala. Los intervalos mayores (2.ª, 3.ª, 6.ª, 7.ª) ocurren entre la tónica y los grados superiores en una escala mayor. Los intervalos menores son un semitono más pequeños que los mayores.',
          tryThisLabel: 'Observa todos los intervalos de la escala mayor desde C',
        },
        {
          title: 'Cómo Determinar la Cualidad',
          explanation:
            'Método: (1) Cuenta los nombres de las notas para obtener el número del intervalo. (2) Cuenta los semitonos. (3) Compara con la escala mayor: si la nota superior pertenece a la escala mayor de la nota inferior, es mayor (para 2, 3, 6, 7) o justo (para 1, 4, 5, 8). (4) Un semitono más pequeño que mayor = menor.',
          tryThisLabel: 'Escucha una 3.ª menor en C menor',
        },
        {
          title: 'Escuchar la Diferencia',
          explanation:
            'Los intervalos justos suenan «abiertos» y «huecos» — estables y fuertes. Los intervalos mayores suenan brillantes y amplios. Los intervalos menores son un semitono más estrechos y suenan más sombríos, más emocionales. Toca C a E (3.ª mayor) y después C a Eb (3.ª menor) — la diferencia de un semitono crea un carácter completamente diferente.',
          tryThisLabel: 'Escucha la 3.ª mayor en un acorde',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C major chord" y después "Cm" — la única diferencia es E vs. Eb. 3.ª mayor (4 semitonos) vs. 3.ª menor (3 semitonos). Un semitono lo cambia todo',
        },
        {
          instruction:
            'Escribe "C major scale" — cada intervalo de C a cada nota superior es justo (4.ª, 5.ª, octava) o mayor (2.ª, 3.ª, 6.ª, 7.ª). Este es el conjunto de referencia',
        },
        {
          instruction:
            '¿Cuál es la cualidad del intervalo de C a F? Cuenta: C-D-E-F = 4.ª. F pertenece a la escala de C mayor, por lo tanto es una 4.ª justa',
        },
      ],
    },

    // ── U7 M2: Intervalos Aumentados, Disminuidos y Compuestos ───────────
    l2u7m2: {
      title: 'Intervalos Aumentados, Disminuidos y Compuestos',
      subtitle: 'Los extremos de la cualidad de intervalos e intervalos más allá de la octava',
      objectives: [
        'Comprender aumentado como un semitono mayor que justo o mayor',
        'Comprender disminuido como un semitono menor que justo o menor',
        'Identificar intervalos compuestos (9.ª, 10.ª, 11.ª, 13.ª) y el tritono',
      ],
      concepts: [
        {
          title: 'Aumentado y Disminuido',
          explanation:
            'Aumentado significa un semitono mayor que justo o mayor. Disminuido significa un semitono menor que justo o menor. Una 5.ª justa (7 semitonos) se convierte en aumentada con 8 semitonos o disminuida con 6. El intervalo de 6 semitonos — el tritono — tiene dos nombres: 4.ª aumentada o 5.ª disminuida. El mismo sonido, diferente escritura.',
          tryThisLabel: 'Escucha el tritono dentro de C7',
        },
        {
          title: 'El Tritono',
          explanation:
            'El tritono divide la octava exactamente por la mitad y es el intervalo más inestable en la música tonal. Desempeña un papel crítico en los acordes de séptima de dominante, donde crea la tensión que impulsa la resolución. Dentro de C7, el tritono se sitúa entre E y Bb — ambas notas exigen resolución.',
          tryThisLabel: 'Escucha la 5.ª disminuida en Cdim',
        },
        {
          title: 'Intervalos Compuestos',
          explanation:
            'Los intervalos mayores que una octava son intervalos compuestos. Una 9.ª = octava + 2.ª. Una 10.ª = octava + 3.ª. Una 11.ª = octava + 4.ª. Una 13.ª = octava + 6.ª. Las reglas de cualidad se mantienen: una 9.ª mayor tiene la misma cualidad que una 2.ª mayor. Estos intervalos se vuelven importantes en los acordes con extensiones.',
          tryThisLabel: 'La 9.ª es una 2.ª compuesta',
        },
      ],
      tasks: [
        {
          instruction:
            '¿Cuál es el intervalo de C a F#? Cuenta las letras (C-D-E-F = 4.ª). F pertenece a C mayor pero F# está un semitono por encima, por lo tanto es una 4.ª aumentada — un tritono',
        },
        {
          instruction:
            'Escribe "C7" y escucha — el tritono entre E y Bb es lo que da al acorde de séptima de dominante su tensión y necesidad de resolver',
        },
        {
          instruction:
            'Escribe "Cmaj9" — la 9.ª (D) es el 2.º grado una octava más arriba. ¿Cuál es la cualidad de C a D? 2.ª mayor, por lo tanto 9.ª mayor',
        },
      ],
    },

    // ── U7 M3: Los Cuatro Tipos de Tríadas ──────────────────────────────
    l2u7m3: {
      title: 'Los Cuatro Tipos de Tríadas',
      subtitle: 'Mayor, menor, disminuida, aumentada — construir e identificar las cuatro',
      objectives: [
        'Construir los cuatro tipos de tríadas a partir de cualquier fundamental usando terceras apiladas',
        'Comprender la distinción de estabilidad: 5.ª justa vs. 5.ª alterada',
        'Escuchar el sonido característico de cada cualidad',
      ],
      concepts: [
        {
          title: 'Cuatro Cualidades de Tríadas',
          explanation:
            'Toda tríada apila dos terceras. Mayor = 3.ª mayor + 3.ª menor (3.ªM+3.ªm), de la fundamental a la 5.ª es una 5.ª justa. Menor = 3.ª menor + 3.ª mayor (3.ªm+3.ªM), de la fundamental a la 5.ª sigue siendo una 5.ª justa. Disminuida = 3.ª menor + 3.ª menor (3.ªm+3.ªm), de la fundamental a la 5.ª es una 5.ª disminuida. Aumentada = 3.ª mayor + 3.ª mayor (3.ªM+3.ªM), de la fundamental a la 5.ª es una 5.ª aumentada.',
          tryThisLabel: 'Escucha la tríada mayor estable',
        },
        {
          title: 'Estable vs. Inestable',
          explanation:
            'Mayor y menor son estables — ambas tienen una 5.ª justa, que proporciona una base sólida. Disminuida suena tensa y comprimida — su 5.ª disminuida comprime el acorde. Aumentada suena extraña y sin resolución — su 5.ª aumentada expande el acorde. Estabilidad vs. inestabilidad está determinada por si la 5.ª es justa o alterada.',
          tryThisLabel: 'Escucha disminuida — tensa y comprimida',
        },
        {
          title: 'Leer Cifrados de Acordes',
          explanation:
            'Letra sola = mayor (C). Letra con «m» = menor (Cm). «dim» u «o» = disminuida (Cdim). «aug» o «+» = aumentada (Caug). Estos cifrados indican la fundamental y la cualidad de un vistazo.',
          tryThisLabel: 'Escucha aumentada — flotante y sin resolución',
        },
      ],
      tasks: [
        {
          instruction:
            'Construye las cuatro tríadas de C: "C major chord", "Cm", "Cdim", "Caug" — ¿cuáles dos suenan estables? ¿Cuáles dos suenan inestables?',
        },
        {
          instruction:
            'Escribe "Fdim" y cuenta: de la fundamental a la 3.ª son 3 semitonos (3.ªm), de la 3.ª a la 5.ª son 3 semitonos (3.ªm). Ambas terceras son menores — eso es lo que la hace disminuida',
        },
        {
          instruction:
            'Escribe "Caug" y cuenta: de la fundamental a la 3.ª son 4 semitonos (3.ªM), de la 3.ª a la 5.ª son 4 semitonos (3.ªM). Ambas terceras son mayores — aumentada',
        },
      ],
    },

    // ── U7 M4: Inversiones de Tríadas y Bajo Cifrado ─────────────────────
    l2u7m4: {
      title: 'Inversiones de Tríadas y Bajo Cifrado',
      subtitle: 'Las mismas notas, bajo diferente — estado fundamental, 1.ª inversión, 2.ª inversión',
      objectives: [
        'Comprender estado fundamental, 1.ª inversión y 2.ª inversión de tríadas',
        'Leer cifras de bajo cifrado: 5/3, 6/3 (o simplemente 6) y 6/4',
        'Usar notación de barra para inversiones: C/E = 1.ª inversión, C/G = 2.ª inversión',
      ],
      concepts: [
        {
          title: 'Tres Posiciones',
          explanation:
            'Una tríada tiene tres notas, por lo tanto tiene tres notas de bajo posibles. El estado fundamental coloca la fundamental en el bajo — la disposición más sólida. La 1.ª inversión coloca la 3.ª en el bajo — más ligera y melódica. La 2.ª inversión coloca la 5.ª en el bajo — inestable, con la 4.ª por encima del bajo históricamente tratada como disonancia que requiere resolución.',
          tryThisLabel: 'Escucha estado fundamental — C en el bajo',
        },
        {
          title: 'Bajo Cifrado',
          explanation:
            'Los números del bajo cifrado describen intervalos por encima de la nota del bajo. Estado fundamental = 5/3 (una 5.ª y una 3.ª por encima del bajo). 1.ª inversión = 6/3 (abreviado a simplemente 6). 2.ª inversión = 6/4. Esta era la notación estándar en la era barroca y sigue siendo central en el análisis de teoría musical.',
          tryThisLabel: '1.ª inversión = posición 6',
        },
        {
          title: 'Por Qué Importan las Inversiones',
          explanation:
            'Las inversiones permiten que los acordes se enlacen suavemente. En lugar de saltar entre acordes en estado fundamental, las inversiones crean líneas de bajo por grado conjunto — el ingrediente más importante de una conducción de voces elegante. Una línea de bajo que se mueve por grado conjunto suena más pulida que una que salta constantemente.',
          tryThisLabel: '2.ª inversión = posición 6/4',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C major chord", "C/E" y "C/G" en secuencia — las mismas tres notas, pero escucha cómo el carácter cambia con cada nota en el bajo',
        },
        {
          instruction:
            'Escribe "C/E" — E está en el bajo. Los intervalos por encima son una 3.ª (E a G) y una 6.ª (E a C). Por eso se llama posición 6',
        },
        {
          instruction:
            'Escribe "Am/C" — el acorde de A menor con C en el bajo. C es la 3.ª de Am, por lo tanto es 1.ª inversión. Escucha cómo suena más ligero que Am en estado fundamental',
        },
      ],
    },

    // ── U7 M5: Tríadas Diatónicas y Números Romanos ─────────────────────
    l2u7m5: {
      title: 'Tríadas Diatónicas y Números Romanos',
      subtitle: 'Los siete acordes que pertenecen a cada tonalidad mayor — y cómo nombrarlos',
      objectives: [
        'Construir una tríada en cada grado de la escala mayor usando solo notas de esa escala',
        'Conocer el patrón de cualidades: I-ii-iii-IV-V-vi-vii°',
        'Leer números romanos: mayúscula = mayor, minúscula = menor, º = disminuida',
      ],
      concepts: [
        {
          title: 'Construir Tríadas Diatónicas',
          explanation:
            'Construye una tríada en cada grado de la escala mayor usando solo notas de esa escala. En C mayor: C-E-G (mayor), D-F-A (menor), E-G-B (menor), F-A-C (mayor), G-B-D (mayor), A-C-E (menor), B-D-F (disminuida). El patrón de cualidades es siempre I-ii-iii-IV-V-vi-vii° — en todas las tonalidades mayores. Solo los nombres de las notas cambian.',
          tryThisLabel: 'Observa todas las tríadas diatónicas en C',
        },
        {
          title: 'Convenciones de Números Romanos',
          explanation:
            'Los números romanos en mayúscula indican tríadas mayores (I, IV, V). En minúscula indican tríadas menores (ii, iii, vi). El símbolo de grado (º) indica disminuida (vii°). Esta notación es universal — funciona en cualquier tonalidad. Cuando ves I-IV-V, conoces las funciones de los acordes independientemente de las notas específicas usadas.',
          tryThisLabel: 'Observa el mismo patrón en G mayor',
        },
        {
          title: 'Por Qué el Patrón Es Fijo',
          explanation:
            'El patrón de intervalos T-T-S-T-T-T-S de la escala mayor fuerza combinaciones específicas de intervalos en cada grado. Los semitonos entre los grados 3-4 y 7-1 crean la tríada disminuida en el vii° y determinan qué tríadas son mayores o menores. Cambia la escala y cambiarás el patrón — que es exactamente lo que ocurre en las tonalidades menores.',
          tryThisLabel: 'Verifica el patrón en D mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" — toca cada acorde diatónico. Antes de tocar, predice si sonará mayor o menor basándote en el número romano',
        },
        {
          instruction:
            'Abre "key of G" — verifica el mismo patrón I-ii-iii-IV-V-vi-vii° con nombres de notas diferentes',
        },
        {
          instruction:
            'Abre "key of Eb" — nombra las siete tríadas diatónicas. ¿Qué notas componen el acorde ii?',
        },
      ],
    },
  },
};

export default curriculumL2;
