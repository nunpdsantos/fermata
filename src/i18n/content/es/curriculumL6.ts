import type { CurriculumLevelOverlay } from '../types';

const curriculumL6: CurriculumLevelOverlay = {
  // ─── Unidades ─────────────────────────────────────────────────────────────
  units: {
    u18: {
      title: 'Acordes Cromáticos',
      description:
        'Acorde napolitano, acordes de sexta aumentada y modulación enarmónica mediante la sexta alemana',
    },
    u19: {
      title: 'Técnicas Cromáticas Avanzadas',
      description:
        'Modulación por la séptima disminuida, embellecimiento por nota común, mediantes cromáticas y disolución tardorromántica',
    },
    u20: {
      title: 'Contrapunto y Escritura a Partes',
      description:
        'Contrapunto de especies completo, contrapunto invertible, armonización SATB y lectura de partitura',
    },
  },

  // ─── Módulos ──────────────────────────────────────────────────────────────
  modules: {
    // ── U18 M1: The Neapolitan Chord (bII) ────────────────────────────────
    l6u18m1: {
      title: 'El Acorde Napolitano (bII)',
      subtitle: 'Un dramático predominante cromático construido sobre el segundo grado rebajado',
      objectives: [
        'Construir el acorde napolitano (tríada mayor sobre el 2.º grado rebajado) y usar bII6 como predominante cromático',
        'Aplicar la conducción de voces correcta, donde el b2 resuelve descendentemente y el bajo se mueve de 4 a 5',
        'Reconocer el efecto emocional sombrío y majestuoso del napolitano y su color frigio',
      ],
      concepts: [
        {
          title: '¿Qué Es el Napolitano?',
          explanation:
            'El napolitano es una tríada mayor construida sobre el segundo grado rebajado. En Do mayor o Do menor, ese acorde es Reb mayor (Reb-Fa-Lab). Bautizado con el nombre de la escuela napolitana de ópera, funciona como una sustitución cromática dramática del predominante típico (ii o IV). Se utiliza casi siempre en primera inversión (bII6), colocando el 4.º grado en el bajo para una conexión suave con la dominante.',
          tryThisLabel: 'Toca Reb mayor — el napolitano en Do menor',
        },
        {
          title: '¿Por Qué la Primera Inversión (bII6)?',
          explanation:
            'En primera inversión, la nota del bajo es el 4.º grado (Fa en Do menor), que se enlaza suavemente con la dominante mediante el movimiento del bajo 4 -> 5 — el mismo movimiento de IV -> V. El drama cromático reside en las voces superiores, donde el 2.º grado rebajado (Reb) resuelve descendentemente hacia la sensible o la tónica. El napolitano en posición fundamental es más raro, pero aparece en la música romántica para un efecto más enfático y sorprendente.',
          tryThisLabel: 'Escucha Reb/Fa — napolitano en primera inversión',
        },
        {
          title: 'Conducción de Voces y Efecto Emocional',
          explanation:
            'El 2.º grado rebajado es una nota de tendencia fuerte que debe resolver descendentemente — hacia la sensible al moverse a V, o directamente hacia la tónica. Nunca se duplica. El b6 (quinta del bII) también resuelve descendentemente hacia el 5.º grado. El napolitano suena sombrío, majestuoso y solemne, importando un color de modo frigio a la armonía. Es un sonido característico de Beethoven, Schubert y de bandas sonoras modernas.',
          tryThisLabel: 'Observa Do menor — el contexto natural del napolitano',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "Db major chord" para escuchar el acorde napolitano de Do menor. Observa cómo Reb-Fa-Lab suena sombrío y dramático en comparación con un acorde de Rem o Fa en este contexto',
        },
        {
          instruction:
            'Escribe "Db/F" para escuchar el napolitano en primera inversión. La nota del bajo Fa se enlaza suavemente con Sol (dominante). Esta es la disposición estándar bII6 usada en la música clásica',
        },
        {
          instruction:
            'Piensa en el napolitano en otras tonalidades menores: en La menor, bII es Sib mayor. En Mi menor, bII es Fa mayor. En Re menor, bII es Mib mayor. En cada caso, es una tríada mayor medio tono por encima de la tónica',
        },
      ],
    },

    // ── U18 M2: Italian and French Augmented Sixth Chords ─────────────────
    l6u18m2: {
      title: 'Sexta Italiana y Sexta Francesa',
      subtitle: 'El intervalo de sexta aumentada y sus dos variedades nacionales más simples',
      objectives: [
        'Comprender el intervalo de sexta aumentada (b6 a #4) y su resolución divergente hacia una octava sobre el 5.º grado',
        'Construir la sexta italiana (It+6): b6, 1, #4 y resolverla a V',
        'Construir la sexta francesa (Fr+6): b6, 1, 2, #4 y reconocer su color de tonos enteros',
      ],
      concepts: [
        {
          title: 'El Intervalo de Sexta Aumentada',
          explanation:
            'Todos los acordes de sexta aumentada contienen un intervalo de sexta aumentada entre el 6.º grado rebajado en el bajo y el 4.º grado elevado en una voz superior. En Do: Lab (b6) hasta Fa# (#4). Este intervalo resuelve divergentemente por movimiento contrario — Lab desciende a Sol, Fa# asciende a Sol — produciendo una octava sobre el 5.º grado, la fundamental de la dominante. Esta resolución divergente es el gesto definitorio de toda la familia de sextas aumentadas.',
          tryThisLabel: 'Observa Do mayor — el contexto para sextas aumentadas',
        },
        {
          title: 'La Sexta Italiana (It+6)',
          explanation:
            'La sexta italiana tiene tres notas: b6, 1, #4. En Do: Lab-Do-Fa#. Es el acorde de sexta aumentada más simple — solo el intervalo de sexta aumentada más el 1.er grado para completar la sonoridad. Resuelve directamente a V con la fundamental duplicada. Al contener solo tres notas, es el miembro más ligero y transparente de la familia.',
          tryThisLabel: 'Escucha Lab — la nota del bajo de las sextas aumentadas en Do',
        },
        {
          title: 'La Sexta Francesa (Fr+6)',
          explanation:
            'La sexta francesa tiene cuatro notas: b6, 1, 2, #4. En Do: Lab-Do-Re-Fa#. Añade el 2.º grado a la sexta italiana. El resultado contiene dos tritonos (Lab-Re y Do-Fa#), confiriéndole una cualidad característica de tonos enteros — las cuatro notas pertenecen a la misma colección de tonos enteros. Este color exótico y suspendido convierte a la sexta francesa en favorita de los compositores que buscan la máxima tensión predominante.',
          tryThisLabel: 'Escucha Sol mayor — el acorde V al que estas sextas resuelven en Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Cifra la sexta italiana en Do: Lab-Do-Fa#. Ahora cífrala en Sol: Mib-Sol-Do#. El patrón es siempre b6, 1, #4 de la tonalidad objetivo. Practica la construcción de la It+6 en Re, La y Mib',
        },
        {
          instruction:
            'Cifra la sexta francesa en Do: Lab-Do-Re-Fa#. Observa los dos tritonos: Lab hasta Re y Do hasta Fa#. Las cuatro notas pertenecen a la escala de tonos enteros sobre Do. Cifra la Fr+6 en Sol y en Re',
        },
        {
          instruction:
            'Escribe "Ab major chord" y escucha. Ahora imagina añadir Fa# en una voz superior. El intervalo Lab hasta Fa# es la sexta aumentada que define toda esta familia de acordes',
        },
      ],
    },

    // ── U18 M3: German Augmented Sixth and Its Dual Identity ──────────────
    l6u18m3: {
      title: 'Sexta Alemana y Su Doble Identidad',
      subtitle: 'El acorde Gr+6 y su equivalencia enarmónica con el acorde de séptima de dominante',
      objectives: [
        'Construir la sexta alemana (Gr+6): b6, 1, b3, #4 y reconocer su sonoridad rica y plena',
        'Reconocer que la Gr+6 es enarmónicamente idéntica a un acorde de séptima de dominante',
        'Resolver la Gr+6 a través de un 6/4 cadencial para evitar quintas paralelas',
      ],
      concepts: [
        {
          title: 'La Sexta Alemana (Gr+6)',
          explanation:
            'La sexta alemana tiene cuatro notas: b6, 1, b3, #4. En Do: Lab-Do-Mib-Fa#. Añade el 3.er grado rebajado (del modo menor) a la sexta italiana. A diferencia del color de tonos enteros de la sexta francesa, la sexta alemana suena rica y plena — una sonoridad completa de cuatro notas con una cualidad menor en las tres notas inferiores.',
          tryThisLabel: 'Escucha Lab7 — el gemelo enarmónico de la Gr+6 en Do',
        },
        {
          title: 'Equivalencia Enarmónica: Gr+6 = V7',
          explanation:
            'Reescribamos la sexta alemana en Do: Lab-Do-Mib-Fa# se convierte en Lab-Do-Mib-Solb cuando Fa# se reescribe como Solb. Lab-Do-Mib-Solb es Lab séptima de dominante (Lab7). El mismo sonido cumple dos funciones completamente diferentes — Gr+6 resolviendo a V en Do, o V7 resolviendo a I en Reb. Esta doble identidad es el fundamento de la modulación enarmónica entre tonalidades distantes.',
          tryThisLabel: 'Escucha Reb mayor — hacia donde Lab7 resuelve como V7',
        },
        {
          title: 'El Problema de las Quintas Paralelas',
          explanation:
            'Cuando la Gr+6 resuelve directamente a V, el movimiento de las voces b3 -> 2 (Mib -> Re en Do) y b6 -> 5 (Lab -> Sol) crea quintas paralelas — prohibidas en la escritura rigurosa a partes. La solución estándar es insertar un acorde de 6/4 cadencial: Gr+6 -> I6/4 -> V. El acorde 6/4 rompe el movimiento paralelo. Las sextas italiana y francesa no tienen este problema porque carecen del b3.',
          tryThisLabel: 'Escucha Do/Sol — el 6/4 cadencial que rompe las paralelas',
        },
      ],
      tasks: [
        {
          instruction:
            'Cifra la sexta alemana en Do: Lab-Do-Mib-Fa#. Ahora reescribe Fa# como Solb: Lab-Do-Mib-Solb = Lab7. Mismo sonido, función completamente diferente. Esta equivalencia enarmónica se explota en la modulación enarmónica',
        },
        {
          instruction:
            'Cifra la sexta alemana en Re: Sib-Re-Fa-Sol#. Reescribe Sol# como Lab: Sib-Re-Fa-Lab = Sib7 = V7 de Mib. Cifra la Gr+6 en La y encuentra su gemelo de séptima de dominante',
        },
        {
          instruction:
            'Escribe "Ab7" para escuchar el acorde. Este es simultáneamente V7 de Reb y Gr+6 en Do. La resolución que elijas determina la tonalidad que el oyente percibe',
        },
      ],
    },

    // ── U18 M4: Enharmonic Modulation: Gr+6 <-> V7 ───────────────────────
    l6u18m4: {
      title: 'Modulación Enarmónica: Gr+6 <-> V7',
      subtitle: 'Pivotar entre tonalidades distantes reinterpretando la sexta alemana como una séptima de dominante',
      objectives: [
        'Modular entre tonalidades distantes usando la equivalencia enarmónica Gr+6/V7',
        'Mapear las relaciones de tonalidades accesibles a través de este pivote (tonalidades a medio tono de distancia)',
        'Aplicar la técnica en ambas direcciones: Gr+6 -> V7 y V7 -> Gr+6',
      ],
      concepts: [
        {
          title: 'El Pivote Gr+6/V7 en Acción',
          explanation:
            'Para modular de Do a Reb usando esta técnica: establece Do como tonalidad, aborda el acorde Lab-Do-Mib-Fa# como Gr+6 en Do, y después resuélvelo como Lab7 (V7 de Reb) hacia Reb mayor. El oído del oyente acepta ambas interpretaciones porque el acorde es acústicamente idéntico. La resolución determina la tonalidad percibida. Un solo acorde pivota entre tonalidades que distan medio tono — una de las relaciones más distantes en el círculo de quintas.',
          tryThisLabel: 'Observa cómo Do y Reb están distantes en el círculo',
        },
        {
          title: 'Funciona en Ambas Direcciones',
          explanation:
            'El pivote funciona a la inversa también. Para modular de Reb a Do: establece Reb, aborda Lab7 como V7 de Reb, y después resuélvelo como Gr+6 en Do tratándolo como Lab-Do-Mib-Fa# resolviendo a Sol (V de Do). El mismo acorde que te lleva de Do a Reb puede también traerte de vuelta. Cualquier par de tonalidades a medio tono de distancia es accesible a través de esta técnica.',
          tryThisLabel: 'Escucha Sol mayor — V de Do, la llegada tras resolver la Gr+6',
        },
        {
          title: 'Mapear Todos los Pivotes Gr+6/V7 Posibles',
          explanation:
            'Puesto que cualquier acorde de séptima de dominante puede reinterpretarse como sexta alemana, cada tonalidad tiene acceso a un objetivo de modulación medio tono por encima o por debajo. Desde Do, la Gr+6 alcanza Reb. Desde Re, la Gr+6 alcanza Mib. Desde Fa#, la Gr+6 alcanza Sol. La técnica abre caminos modulatorios directos entre tonalidades que de otro modo requerirían muchos pasos intermedios por el círculo de quintas.',
          tryThisLabel: 'Escucha Reb mayor — la tonalidad distante de llegada desde Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Cifra la sexta alemana en Re: Sib-Re-Fa-Sol#. Reescribe Sol# como Lab: Sib-Re-Fa-Lab = Sib7 = V7 de Mib. Puedes pivotar de Re mayor a Mib mayor a través de un solo acorde',
        },
        {
          instruction:
            'Planifica una modulación de La mayor a Sib mayor usando Gr+6/V7. Primero: ¿cuál es la Gr+6 en La? (Fa-La-Do-Re#.) Reescribe Re# como Mib: Fa-La-Do-Mib = Fa7 = V7 de Sib. Resuelve a Sib',
        },
        {
          instruction:
            'Escribe "Db major chord" y escucha la tonalidad de llegada. Una sola reinterpretación enarmónica nos trasladó de Do a Reb — seis posiciones alrededor del círculo de quintas en un solo paso',
        },
      ],
    },

    // ── U19 M1: Enharmonic Modulation: Diminished Seventh ─────────────────
    l6u19m1: {
      title: 'Modulación Enarmónica: Séptima Disminuida',
      subtitle: 'La flexibilidad enarmónica cuádruple del acorde de séptima disminuida',
      objectives: [
        'Comprender que un acorde de séptima disminuida divide la octava en cuatro terceras menores iguales',
        'Reinterpretar cualquier nota de un acorde dim7 como sensible para resolver en cuatro tonalidades diferentes',
        'Aplicar la modulación enarmónica por dim7 para alcanzar tonalidades a una tercera menor, un tritono o una sexta mayor de distancia',
      ],
      concepts: [
        {
          title: 'La Simetría de la Séptima Disminuida',
          explanation:
            'Un acorde de séptima disminuida divide la octava en cuatro terceras menores iguales. Si-Re-Fa-Lab: cada par adyacente dista una tercera menor. Debido a esta simetría perfecta, el acorde suena igual independientemente de qué nota se considere la fundamental. Existen solo tres acordes de séptima disminuida distintos en el sistema de doce notas — cada acorde dim7 es una reescritura enarmónica de uno de estos tres.',
          tryThisLabel: 'Escucha Sidim7 — cuatro terceras menores iguales',
        },
        {
          title: 'Cuatro Resoluciones Posibles',
          explanation:
            'Como cualquiera de las cuatro notas puede servir de sensible, un solo acorde de séptima disminuida puede funcionar como viio7 en cuatro tonalidades diferentes. Si-Re-Fa-Lab resuelve a Do menor (Si es sensible). Reescrito como Re-Fa-Lab-Dob: resuelve a Mib menor (Re es sensible). Reescrito como Fa-Lab-Dob-Mibb: resuelve a Solb menor. Reescrito como Sol#-Si-Re-Fa (Sol# como sensible): resuelve a La menor. Las cuatro tonalidades objetivo — Do, Mib, Solb, La — distan una tercera menor entre sí.',
          tryThisLabel: 'Observa Do menor — una de las cuatro resoluciones posibles',
        },
        {
          title: 'Aplicar la Modulación Enarmónica por Dim7',
          explanation:
            'Para modular de Do menor a La menor vía dim7: usa viio7 de Do menor (Si-Re-Fa-Lab), después reescribe Lab como Sol# para obtener viio7 de La menor (Sol#-Si-Re-Fa), y resuelve a La menor. El acorde no cambia sonoramente — solo la grafía y la resolución cambian. Esta técnica alcanza tonalidades a una tercera menor, un tritono o una sexta mayor de distancia en un solo paso, convirtiéndola en el pivote enarmónico más versátil de la música tonal.',
          tryThisLabel: 'Observa La menor — una tonalidad objetivo distante desde Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "Bdim7" — este acorde puede resolver a Do menor, Mib menor, Solb menor o La menor. Las cuatro resoluciones son igualmente válidas. La grafía enarmónica determina la tonalidad de destino',
        },
        {
          instruction:
            'Localiza las cuatro resoluciones de Sidim7 en el círculo de quintas: Do, Mib, Solb, La. Distan una tercera menor entre sí — dividiendo la octava en cuatro partes iguales, tal como el propio acorde',
        },
        {
          instruction:
            'Parte de Fa#dim7 (Fa#-La-Do-Mib). Encuentra las cuatro tonalidades objetivo: Sol menor (Fa# como sensible), Sib menor (La como sensible), Reb menor (Do como sensible), Mi menor (Mib reescrito como Re# como sensible)',
        },
      ],
    },

    // ── U19 M2: Common-Tone Diminished Seventh ────────────────────────────
    l6u19m2: {
      title: 'Séptima Disminuida con Nota Común',
      subtitle: 'El acorde CTo7 como embellecimiento cromático que comparte una nota con el acorde objetivo',
      objectives: [
        'Construir un acorde CTo7 que comparte la fundamental del acorde objetivo',
        'Resolver el CTo7 correctamente manteniendo la nota común y moviendo las otras tres voces por semitono',
        'Distinguir el CTo7 de un viio7 funcional — el CTo7 embellece en lugar de modular',
      ],
      concepts: [
        {
          title: '¿Qué Es el CTo7?',
          explanation:
            'Un acorde de séptima disminuida con nota común comparte una nota (la nota común) con el acorde que embellece. La nota común es generalmente la fundamental del acorde objetivo. Las otras tres notas del acorde dim7 resuelven cada una por semitono hacia las restantes notas del acorde. A diferencia de un viio7 funcional, el CTo7 no cambia la tonalidad — crea una aproximación cromática dramática a un acorde que el oyente ya espera.',
          tryThisLabel: 'Escucha Do mayor — el acorde objetivo que un CTo7 embellece',
        },
        {
          title: 'Construir el CTo7',
          explanation:
            'Para construir el CTo7 de Do mayor: mantén Do como nota común, y después completa un acorde de séptima disminuida que incluya Do. Una opción: Do-Re#-Fa#-La (= Do con Re#dim7 rodeándolo). Re# resuelve ascendiendo a Mi, Fa# resuelve ascendiendo a Sol, La resuelve descendiendo a Sol (o asciende a la octava). Las tres voces en movimiento se desplazan cada una por semitono hacia el acorde objetivo mientras Do se mantiene firme. El resultado es una aproximación cromática centelleante.',
          tryThisLabel: 'Toca Do mayor — escucha el objetivo de la resolución',
        },
        {
          title: 'El CTo7 en Contexto Musical',
          explanation:
            'El CTo7 es habitual en la música romántica y en bandas sonoras. Embellece frecuentemente la tónica (CTo7 -> I) o la dominante (CTo7 -> V). Como no cambia la tonalidad, funciona más como un acorde vecino cromático que como una verdadera modulación. La notación CTo7 lo distingue de un análisis viio7, que implicaría una tonicización. El CTo7 es puro color y embellecimiento.',
          tryThisLabel: 'Escucha Sol mayor — el CTo7 también puede embellecer V',
        },
      ],
      tasks: [
        {
          instruction:
            'Construye el CTo7 de Do mayor: mantén Do, añade un acorde dim7 que contenga Do. Un resultado: Do-Re#-Fa#-La. Verifica que Re#, Fa# y La resuelven cada uno por semitono hacia notas del acorde de Do mayor (Mi, Sol y Sol o Do)',
        },
        {
          instruction:
            'Construye el CTo7 de Sol mayor: mantén Sol, añade un acorde dim7 que contenga Sol. Resultado: Sol-La#-Do#-Mi. La# resuelve a Si, Do# resuelve a Re, Mi se mantiene o resuelve a Re. El objetivo es Sol-Si-Re',
        },
        {
          instruction:
            'Escribe "C major chord" y escucha el objetivo de la resolución. Ahora imagina el acorde CTo7 (Do-Re#-Fa#-La) aproximándose — tres voces se desplazan por semitono mientras Do se sostiene. Esto es puro embellecimiento cromático, no modulación',
        },
      ],
    },

    // ── U19 M3: Chromatic Mediants and Altered Dominants ──────────────────
    l6u19m3: {
      title: 'Mediantes Cromáticas y Dominantes Alteradas',
      subtitle: 'Acordes cromáticos por relación de tercera, dominantes alteradas y la progresión omnibus',
      objectives: [
        'Identificar relaciones de mediante cromática (fundamentales a una tercera de distancia con al menos una alteración cromática)',
        'Construir dominantes alteradas (V+, V7b5, V7#5) y comprender su resolución intensificada hacia I',
        'Reconocer la progresión omnibus como un patrón cromático de intercambio de voces a través de sonoridades de dominante',
      ],
      concepts: [
        {
          title: 'Mediantes Cromáticas',
          explanation:
            'Una mediante cromática es un acorde cuya fundamental dista una tercera mayor o menor del acorde actual, con al menos una alteración cromática entre ellos. Desde Do mayor, Lab mayor y Mi mayor son mediantes cromáticas — cada una comparte una nota común con Do, pero altera cromáticamente las restantes. Mediantes doblemente cromáticas no comparten ninguna nota común. Estos cambios dramáticos son un sello distintivo de las bandas sonoras y de la música tardorromántica.',
          tryThisLabel: 'Escucha Lab mayor — mediante cromática de Do',
        },
        {
          title: 'Dominantes Alteradas',
          explanation:
            'Las dominantes alteradas añaden tensión cromática al acorde de dominante. V+ (dominante aumentada) eleva la quinta, que resuelve ascendentemente hacia la 3.ª de I. V7b5 rebaja la quinta, habitual en el jazz. V7#5 combina la quinta aumentada con una séptima. Dominantes doblemente aplicadas (V/V/V) extienden la cadena un nivel más: en Do, La7 -> Re7 -> Sol7 -> Do crea un impulso en cascada a través de resoluciones de dominante secuenciales.',
          tryThisLabel: 'Escucha Mi mayor — otra mediante cromática de Do',
        },
        {
          title: 'La Progresión Omnibus',
          explanation:
            'El omnibus es un patrón cromático de intercambio de voces donde una voz asciende cromáticamente mientras otra desciende, con las restantes voces sostenidas. Esto crea un paisaje armónico lentamente evolutivo, moviéndose a través de sonoridades de séptima de dominante y de sexta aumentada. Habitual en la música del siglo XIX, produce una sensación de errancia armónica sin dirección funcional clara.',
          tryThisLabel: 'Escucha Do7#5 — una sonoridad de dominante alterada',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "Ab major chord", después "C major chord", después "E major chord" — escucha cómo cada mediante cromática comparte una nota con Do mayor pero altera cromáticamente las otras dos. El efecto es vívido y dramático',
        },
        {
          instruction:
            'Piensa en la cadena V/V/V en Do: La7 resuelve a Re7, Re7 resuelve a Sol7, Sol7 resuelve a Do. Cada eslabón es una resolución dominante-tónica creando un impulso en cascada',
        },
        {
          instruction:
            'Escribe "C7#5" para escuchar una dominante alterada. La quinta elevada crea tensión cromática adicional que intensifica la resolución hacia la tónica. Compara con un Do7 simple',
        },
      ],
    },

    // ── U19 M4: Late Romantic Harmonic Techniques ─────────────────────────
    l6u19m4: {
      title: 'Técnicas Armónicas Tardorrománticas',
      subtitle: 'Armonía no funcional, planing cromático y la disolución de la tonalidad',
      objectives: [
        'Reconocer la división igual de la octava (patrones de tonos enteros, disminuidos, aumentados) como fuentes de ambigüedad tonal',
        'Identificar sucesiones de acordes no funcionales y planing cromático como alternativas a la armonía funcional',
        'Comprender la tonalidad ampliada como el estiramiento y eventual disolución de los centros tonales',
      ],
      concepts: [
        {
          title: 'División Igual de la Octava',
          explanation:
            'Patrones simétricos que dividen los 12 semitonos igualmente crean ambigüedad tonal porque ninguna nota se siente como «casa». La división por 2 produce la escala de tonos enteros (6 notas, solo 2 transposiciones posibles). La división por 3 produce el acorde de séptima disminuida (4 notas). La división por 4 produce la tríada aumentada (3 notas). Estas estructuras fueron exploradas por Debussy, Ravel, Liszt y Wagner para difuminar o disolver centros tonales.',
          tryThisLabel: 'Escucha la escala de tonos enteros — división por 2',
        },
        {
          title: 'Sucesiones de Acordes No Funcionales',
          explanation:
            'En la música tardorromántica, las progresiones de acordes abandonan cada vez más la lógica funcional (T-PD-D-T). En su lugar, los acordes se enlazan por proximidad de conducción de voces (cada voz se mueve mínimamente), persistencia de nota común (una altura se sostiene a lo largo de los cambios de acorde) o lógica de pura sonoridad (acordes elegidos por el color, no por la función). Esto marca el inicio de la disolución de la tonalidad y el camino hacia la atonalidad.',
          tryThisLabel: 'Escucha la escala disminuida — división simétrica por 3',
        },
        {
          title: 'Planing Cromático y Tonalidad Ampliada',
          explanation:
            'El planing mueve una forma de acorde en movimiento paralelo por tono o semitono, ignorando las restricciones de tonalidad. El planing cromático (todo por semitonos) produce un baño de puro color sin dirección funcional. El planing diatónico ajusta la cualidad de los intervalos para permanecer en la tonalidad. La tonalidad ampliada extiende los límites tonales: modulaciones remotas se vuelven frecuentes, la saturación cromática dificulta la identificación de la tonalidad y las cadencias tradicionales se evitan. Este es el crepúsculo de la tonalidad de la práctica común.',
          tryThisLabel: 'Explora el mundo de los tonos enteros — la paleta de Debussy',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "whole tone scale" — cada intervalo adyacente es un tono. Sin semitonos, sin sensibles, sin atracción de dominante. Esto es pura ambigüedad tonal, el fundamento del lenguaje armónico de Debussy',
        },
        {
          instruction:
            'Escribe "C diminished scale" — este patrón alternado tono-semitono crea una escala simétrica de ocho notas que contiene cuatro tritonos y cuatro terceras menores, dividiendo la octava en partes iguales',
        },
        {
          instruction:
            'Imagina mover una tríada de Do mayor ascendiendo por semitono repetidamente: Do-Reb-Re-Mib... Cada acorde es una transposición paralela. Ninguna voz conduce funcionalmente — cada nota se desplaza en la misma cantidad. Esto es planing cromático en su forma más pura',
        },
      ],
    },

    // ── U20 M1: Species Counterpoint: First through Third Species ─────────
    l6u20m1: {
      title: 'Contrapunto de Especies: Primera a Tercera Especie',
      subtitle: 'Cantus firmus, nota contra nota, 2:1 y 4:1',
      objectives: [
        'Escribir un cantus firmus siguiendo reglas establecidas (8-12 notas, mayoritariamente por grado conjunto, un solo clímax)',
        'Dominar la primera especie (1:1) con consonancias y la segunda especie (2:1) con tratamiento de disonancia en tiempo débil',
        'Dominar la tercera especie (4:1) con notas de paso, bordaduras, cambiata y bordaduras dobles',
      ],
      concepts: [
        {
          title: 'Cantus Firmus y Primera Especie (1:1)',
          explanation:
            'El cantus firmus (CF) es una melodía simple de 8 a 12 redondas, que comienza y termina en la tónica, mayoritariamente por grado conjunto con un punto culminante. La primera especie coloca una nota contra cada nota del CF usando solo consonancias — comienza con P1, P5 o P8, termina con P1 o P8 abordada por grado conjunto, favorece consonancias imperfectas (terceras y sextas) y prohíbe intervalos perfectos paralelos. Sin cruce de voces, sin más de tres terceras o sextas consecutivas.',
          tryThisLabel: 'Observa las notas disponibles para un CF en Do mayor',
        },
        {
          title: 'Segunda Especie (2:1)',
          explanation:
            'Dos notas contra cada nota del CF. Los tiempos fuertes deben ser consonantes con el CF. Los tiempos débiles pueden ser disonantes si se abordan y abandonan por grado conjunto (nota de paso) o si se alejan y regresan por grado conjunto (bordadura). Sin unísonos en tiempos fuertes, excepto al inicio y al final. La segunda especie introduce el principio fundamental del tratamiento de la disonancia: la disonancia solo se permite cuando está controlada por movimiento por grado conjunto.',
          tryThisLabel: 'Observa Sol mayor — otra tonalidad habitual para CF',
        },
        {
          title: 'Tercera Especie (4:1)',
          explanation:
            'Cuatro notas contra cada nota del CF. La primera nota de cada grupo debe ser consonante; las tres restantes pueden ser disonantes como notas de paso, bordaduras o la figura de cambiata (grado conjunto hacia disonancia, salto de tercera, grado conjunto de vuelta). Bordaduras dobles (bordadura superior e inferior en secuencia) también están permitidas. La tercera especie produce el contrapunto más melódicamente activo y ornamentado antes de que la síncopa entre en la cuarta especie.',
          tryThisLabel: 'Observa Re mayor — experimenta trazar un cantus firmus',
        },
      ],
      tasks: [
        {
          instruction:
            'Reglas para un cantus firmus: comienza y termina en la tónica, mayoritariamente por grado conjunto, un clímax abordado y abandonado por grado conjunto, sin notas repetidas, ámbito dentro de una octava. Intenta componer mentalmente uno en Do mayor usando solo Do-Re-Mi-Fa-Sol-La-Si-Do',
        },
        {
          instruction:
            'En la primera especie, comienza con un unísono perfecto, quinta u octava. Usa sobre todo consonancias imperfectas (terceras y sextas). Prohíbe quintas y octavas perfectas paralelas. Termina con un unísono u octava abordada por grado conjunto',
        },
        {
          instruction:
            'En la tercera especie, la cambiata es una figura ornamental específica: consonancia, grado conjunto hacia disonancia, salto de tercera en la misma dirección, después grado conjunto de vuelta. Permite que una nota disonante sea abandonada por salto — la única excepción a la regla de que la disonancia debe resolver por grado conjunto',
        },
      ],
    },

    // ── U20 M2: Species Counterpoint: Fourth and Fifth Species ────────────
    l6u20m2: {
      title: 'Contrapunto de Especies: Cuarta y Quinta Especie',
      subtitle: 'Contrapunto sincopado, suspensiones y contrapunto florido',
      objectives: [
        'Dominar la cuarta especie (sincopada): notas ligadas creando suspensiones que resuelven descendentemente por grado conjunto',
        'Identificar suspensiones disonantes estándar (7-6, 4-3, 9-8, 2-3) y encadenarlas en secuencias',
        'Dominar la quinta especie (florida): combinando todas las especies anteriores libremente en una sola línea',
      ],
      concepts: [
        {
          title: 'Cuarta Especie: Síncopa y Suspensiones',
          explanation:
            'La cuarta especie introduce la síncopa — notas ligadas desde un tiempo débil a través de la barra de compás hasta el tiempo fuerte siguiente. Cuando la nota ligada es disonante contra el CF en el tiempo fuerte, crea una suspensión. La suspensión tiene tres fases: preparación (consonancia en el tiempo débil), disonancia (la nota ligada en el tiempo fuerte) y resolución (grado conjunto descendente hacia consonancia). Suspensiones disonantes estándar son 7-6, 4-3 y 9-8 por encima del CF, y 2-3 cuando el contrapunto está por debajo.',
          tryThisLabel: 'Observa Do mayor — traza patrones de suspensión',
        },
        {
          title: 'Cadenas de Suspensiones',
          explanation:
            'Las suspensiones pueden encadenarse: cada resolución se convierte en la preparación de la suspensión siguiente. Una cadena de suspensiones 7-6 o 4-3 crea una línea descendente por grado conjunto de disonancias ligadas, produciendo una de las texturas más expresivas de la música tonal. Las cadenas de suspensiones son un sello distintivo de la música barroca y renacentista y siguen siendo fundamentales en toda la escritura a partes.',
          tryThisLabel: 'Observa Sol mayor — imagina una cadena de suspensiones 7-6',
        },
        {
          title: 'Quinta Especie: Contrapunto Florido',
          explanation:
            'La quinta especie combina libremente todas las especies anteriores: redondas, blancas, negras y síncopa coexisten en una sola línea. Todas las reglas de las especies anteriores se aplican a sus respectivos valores de notas. El contrapunto florido es lo más cerca que los ejercicios de especies llegan de la composición musical real, demostrando cómo reglas estrictas producen resultados genuinamente musicales y formando el puente del contrapunto académico a la composición libre.',
          tryThisLabel: 'Observa Re mayor — el lienzo para contrapunto florido',
        },
      ],
      tasks: [
        {
          instruction:
            'Suspensiones de la cuarta especie: 7-6 y 4-3 son las suspensiones disonantes estándar. La disonancia ocurre en el tiempo fuerte (la nota ligada) y resuelve por grado conjunto descendente en el tiempo débil. Este patrón es el origen de todo el uso de suspensiones en la música tonal',
        },
        {
          instruction:
            'Una cadena de suspensiones 7-6: el 6 (resolución consonante) se liga inmediatamente para convertirse en el 7 (suspensión disonante) contra la siguiente nota del CF. Cada resolución alimenta la suspensión siguiente, creando tensión melódica y armónica continua',
        },
        {
          instruction:
            'La quinta especie combina todo: un compás puede comenzar con una suspensión ligada (4.ª especie), resolver en negras (3.ª especie) y asentarse en una blanca (2.ª especie). El arte está en equilibrar variedad con una forma melódica coherente',
        },
      ],
    },

    // ── U20 M3: Three-Part Counterpoint and Invertible Counterpoint ───────
    l6u20m3: {
      title: 'Contrapunto a Tres Partes y Contrapunto Invertible',
      subtitle: 'Contrapunto a múltiples voces y técnicas invertibles a la octava, décima y duodécima',
      objectives: [
        'Extender el contrapunto de especies a tres y cuatro voces con intervalos válidos contra todas las partes existentes',
        'Comprender el contrapunto invertible a la octava, décima y duodécima y las restricciones de intervalos que cada uno impone',
        'Aplicar técnicas de contrapunto triple donde tres melodías funcionan en cualquiera de las seis disposiciones verticales',
      ],
      concepts: [
        {
          title: 'Añadir Voces: Escritura a Tres y Cuatro Partes',
          explanation:
            'Cuando una tercera voz entra, debe formar intervalos válidos con ambas voces existentes simultáneamente, multiplicando las restricciones. La escritura a tres partes produce tríadas completas, añadiendo riqueza armónica. La escritura a cuatro partes restringe aún más el movimiento pero abre la textura completa SATB. Cada voz adicional aumenta exponencialmente el número de pares de intervalos que deben verificarse en cuanto a quintas y octavas paralelas.',
          tryThisLabel: 'Escucha una tríada de tres notas — la sonoridad a 3 voces más simple',
        },
        {
          title: 'Contrapunto Invertible a la Octava',
          explanation:
            'Contrapunto invertible a la octava significa que dos melodías funcionan correctamente con cualquiera de las voces por encima. Cuando se invierten, las terceras se convierten en sextas (aceptable), pero las quintas se convierten en cuartas (disonantes por encima del bajo en el estilo de la práctica común). Por lo tanto, el contrapunto invertible a la octava evita quintas. La inversión a la décima transforma terceras en octavas y sextas en quintas. La inversión a la duodécima transforma quintas en octavas — J.S. Bach la utilizó extensamente en sus fugas.',
          tryThisLabel: 'Escucha Do/Mi — invertir el bajo cambia la textura',
        },
        {
          title: 'Contrapunto Triple',
          explanation:
            'El contrapunto triple exige tres melodías que funcionen en las seis permutaciones verticales (ABC, ACB, BAC, BCA, CAB, CBA) — extraordinariamente exigente de escribir. Las seis disposiciones deben producir contrapunto válido con tratamiento correcto de consonancias. Este es el punto culminante del arte contrapuntístico, demostrado más completamente en las fugas de Bach y en El Arte de la Fuga.',
          tryThisLabel: 'Escucha Sol mayor — otra sonoridad a tres voces para invertir',
        },
      ],
      tasks: [
        {
          instruction:
            'En la escritura a tres partes, verifica cada par de voces en cuanto a quintas y octavas paralelas. Con las voces A, B y C, debes verificar A-B, A-C y B-C — tres pares en lugar de uno',
        },
        {
          instruction:
            'Para contrapunto invertible a la octava: los intervalos se transforman así — unísono se convierte en octava, segunda se convierte en séptima, tercera se convierte en sexta, cuarta se convierte en quinta, quinta se convierte en cuarta. Como las cuartas son disonantes por encima del bajo, las quintas deben evitarse en el original',
        },
        {
          instruction:
            'El contrapunto triple tiene seis permutaciones. Si la melodía A está por encima de B y B por encima de C en el original, las otras cinco ordenaciones también deben producir contrapunto válido. Bach lograba esto rutinariamente en sus fugas',
        },
      ],
    },

    // ── U20 M4: Advanced Part Writing and Score Reading ───────────────────
    l6u20m4: {
      title: 'Escritura a Partes Avanzada y Lectura de Partitura',
      subtitle: 'Armonización SATB, realización de bajo cifrado y lectura de partitura orquestal',
      objectives: [
        'Armonizar melodías de soprano y bajo en textura a cuatro partes SATB siguiendo reglas de conducción de voces',
        'Realizar bajo cifrado completando las voces superiores a partir de las cifras y alteraciones del bajo',
        'Leer partituras orquestales completas transponiendo instrumentos a altura de concierto y reduciendo al contenido armónico',
      ],
      concepts: [
        {
          title: 'Armonización de Soprano',
          explanation:
            'Dada una melodía de soprano, la tarea consiste en elegir acordes y completar contralto, tenor y bajo. El proceso: determinar la tonalidad y localizar puntos de cadencia, elegir una línea de bajo y progresión de acordes que soporte funcionalmente la melodía, completar las voces interiores siguiendo reglas de conducción de voces, y después verificar errores (quintas/octavas paralelas, violaciones de espaciado, errores de duplicación, cruce de voces).',
          tryThisLabel: 'Observa los acordes diatónicos de Do mayor — la paleta de armonización',
        },
        {
          title: 'Realización de Bajo Cifrado',
          explanation:
            'La notación de bajo cifrado proporciona una línea de bajo con números que indican los intervalos por encima de cada nota. Sin cifras significa posición fundamental (5/3), 6 significa primera inversión, 6/4 significa segunda inversión, 7 significa acorde de séptima en posición fundamental. Las alteraciones modifican intervalos específicos. Realizar bajo cifrado — completar las tres voces superiores en tiempo real — era la competencia cotidiana de todo teclista barroco.',
          tryThisLabel: 'Observa Sol mayor — practica mentalmente el bajo cifrado',
        },
        {
          title: 'Lectura de Partitura Orquestal',
          explanation:
            'Una partitura orquestal completa organiza los instrumentos de arriba abajo: maderas, metales, percusión, cuerdas. Los instrumentos transpositores (clarinete en Sib, trompa en Fa) están escritos a una altura diferente de la que suenan. Leer una partitura exige transponer mentalmente estas partes a la altura de concierto, leer claves de Do (clave de contralto para la viola, clave de tenor para el violonchelo) y reducir múltiples voces a su contenido armónico esencial.',
          tryThisLabel: 'Observa Sib mayor — la tonalidad en la que un clarinete en Sib lee',
        },
      ],
      tasks: [
        {
          instruction:
            'Para armonizar una melodía de soprano: primero identifica puntos de cadencia (determinan los objetivos armónicos), después trabaja hacia atrás desde cada cadencia para completar la progresión de acordes. Las voces interiores siguen el camino más corto entre notas del acorde',
        },
        {
          instruction:
            'Abreviaturas de bajo cifrado: sin cifras = posición fundamental (5/3), 6 = primera inversión, 6/4 = segunda inversión, 7 = séptima en posición fundamental, 6/5 = séptima en primera inversión, 4/3 = séptima en segunda inversión, 4/2 = séptima en tercera inversión',
        },
        {
          instruction:
            'Instrumentos transpositores: un clarinete en Sib suena un tono por debajo de lo que está escrito (lee Do, el público oye Sib). Una trompa en Fa suena una quinta perfecta por debajo de lo que está escrito. Los lectores de partitura deben transponer mentalmente para oír las alturas reales',
        },
      ],
    },
  },
};

export default curriculumL6;
