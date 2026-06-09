import type { CurriculumLevelOverlay } from '../types';

const curriculumL3: CurriculumLevelOverlay = {
  // ─── Unidades ─────────────────────────────────────────────────────────────
  units: {
    u9: {
      title: 'Acordes de Séptima y Armonía Diatónica',
      description:
        'Las cinco cualidades de acordes de séptima, inversiones, acordes de séptima diatónicos en mayor y menor, y la séptima de dominante como motor armónico',
    },
    u10: {
      title: 'Conducción de Voces y Escritura a Cuatro Partes',
      description:
        'Disposición SATB, reglas de espaciado, quintas y octavas paralelas prohibidas, enlace de acordes con movimiento suave de voces, y el papel de las inversiones',
    },
    u11: {
      title: 'Cadencias, Frases y Ornamentación',
      description:
        'Los seis tipos de cadencia, estructura de frase y período, ritmo armónico, notas extrañas al acorde y transposición a cualquier tonalidad',
    },
  },

  // ─── Módulos ──────────────────────────────────────────────────────────────
  modules: {
    // ── U9 M1: Seventh Chords — Five Qualities ─────────────────────────────
    l3u9m1: {
      title: 'Acordes de Séptima: Las Cinco Cualidades',
      subtitle:
        'Construye e identifica los cinco tipos estándar de acordes de séptima y escucha sus caracteres distintos',
      objectives: [
        'Construir e identificar las cinco cualidades estándar de acordes de séptima por su estructura y por su sonido',
        'Comprender los acordes de séptima como tríadas con una séptima añadida por encima de la fundamental',
        'Escuchar el carácter distinto de cada cualidad — del cálido al desesperadamente tenso',
      ],
      concepts: [
        {
          title: '¿Qué Es un Acorde de Séptima?',
          explanation:
            'Un acorde de séptima añade una cuarta nota — una séptima por encima de la fundamental — a una tríada. Cuatro notas en lugar de tres. Esta nota extra introduce un color más rico y una tensión armónica mayor de la que cualquier tríada puede producir. Los acordes de séptima son la columna vertebral armónica del jazz, del pop y de la música clásica del Romanticismo, y comprenderlos abre una dimensión completamente nueva del vocabulario de acordes.',
          tryThisLabel: 'Escucha Cmaj7 — cálido, exuberante, jazzy',
        },
        {
          title: 'Las Cinco Cualidades Estándar',
          explanation:
            'Séptima mayor (Cmaj7): 3.ªM+3.ªm+3.ªM — cálido y exuberante. Séptima de dominante (C7): 3.ªM+3.ªm+3.ªm — tenso y exigiendo resolución. Séptima menor (Cm7): 3.ªm+3.ªM+3.ªm — suave y aterciopelado. Semidisminuido (Cm7b5): 3.ªm+3.ªm+3.ªM — sombrío y anhelante. Totalmente disminuido (Cdim7): 3.ªm+3.ªm+3.ªm — extremadamente tenso, con estructura simétrica en la que cada nota dista una 3.ª menor de la siguiente. Una sexta cualidad, la séptima menor-mayor (CmMaj7: 3.ªm+3.ªM+3.ªM), combina una tríada menor con una séptima mayor — rara pero inquietantemente perturbadora, utilizada en el cine y en el jazz.',
          tryThisLabel: 'Escucha C7 — la séptima de dominante exige resolución',
        },
        {
          title: 'Comparar los Colores de los Acordes de Séptima',
          explanation:
            'La diferencia entre Cmaj7 y C7 es un solo semitono: Si natural frente a Sib. Esa única nota transforma una sonoridad exuberante y estable en un acorde rebosante de tensión. Del mismo modo, Cm7 y Cm7b5 difieren solo en la quinta (Sol frente a Solb), pero la cualidad semidisminuida es mucho más sombría e inquieta. Entrenar el oído para estas distinciones sutiles es el cimiento de la escucha armónica avanzada.',
          tryThisLabel: 'Escucha Cm7 — suave y aterciopelado',
        },
      ],
      tasks: [
        {
          instruction:
            "Construye los cinco acordes de séptima sobre Do en secuencia: 'Cmaj7', 'C7', 'Cm7', 'Cm7b5', 'Cdim7'. Escucha atentamente cómo cada cualidad altera el carácter emocional del acorde",
        },
        {
          instruction:
            "Compara 'Cmaj7' y 'C7' uno junto al otro — la única diferencia es Si frente a Sib. Escucha cómo un semitono transforma calidez en tensión",
        },
        {
          instruction:
            "Toca 'Cdim7' — las cuatro notas están exactamente a 3 semitonos de distancia entre sí. Esta simetría significa que solo existen tres acordes de séptima disminuida distintos en toda la escala cromática. ¿Puedes descubrir cuáles son?",
        },
      ],
    },

    // ── U9 M2: Seventh Chord Inversions ─────────────────────────────────────
    l3u9m2: {
      title: 'Inversiones de Acordes de Séptima',
      subtitle:
        'Cuatro posiciones para cada acorde de séptima — del estado fundamental a la tercera inversión',
      objectives: [
        'Identificar y construir las cuatro inversiones de cualquier acorde de séptima',
        'Usar las cifras de bajo cifrado (7, 6/5, 4/3, 4/2) para nombrar las inversiones',
        'Escuchar cómo cada inversión altera la nota del bajo y el peso del acorde',
      ],
      concepts: [
        {
          title: 'Cuatro Posiciones',
          explanation:
            'Como un acorde de séptima tiene cuatro notas, tiene cuatro notas posibles en el bajo y, por tanto, cuatro inversiones. El estado fundamental (bajo cifrado: 7) coloca la fundamental en el bajo — la disposición más estable y más común. La primera inversión (6/5) coloca la tercera en el bajo, creando una sonoridad más ligera. La segunda inversión (4/3) coloca la quinta en el bajo. La tercera inversión (4/2 o simplemente 2) coloca la séptima en el bajo — la posición más inestable, que exige con fuerza la resolución descendente de la nota del bajo.',
          tryThisLabel: 'Escucha Cmaj7 en estado fundamental — fundamental en el bajo',
        },
        {
          title: 'Bajo Cifrado para Acordes de Séptima',
          explanation:
            'Las cifras de bajo cifrado describen los intervalos por encima de la nota del bajo. Estado fundamental 7: intervalos de 7.ª, 5.ª y 3.ª sobre el bajo. Primera inversión 6/5: intervalos de 6.ª, 5.ª y 3.ª sobre el bajo. Segunda inversión 4/3: intervalos de 6.ª, 4.ª y 3.ª sobre el bajo. Tercera inversión 4/2: intervalos de 6.ª, 4.ª y 2.ª sobre el bajo. Estas cifras abreviadas indican al intérprete tanto el acorde como su disposición de inmediato.',
          tryThisLabel: 'Escucha Cmaj7 en primera inversión (6/5) — Mi en el bajo',
        },
        {
          title: 'Tercera Inversión y Resolución del Bajo',
          explanation:
            'La tercera inversión (4/2) es la posición más inestable del acorde de séptima porque la séptima del acorde está en el bajo. La séptima es una disonancia que debe resolver por grado descendente. En la práctica, un V4/2 resuelve a I6 — el bajo desciende un semitono (Fa a Mi en Do mayor) mientras el resto del acorde resuelve normalmente. Este bajo con resolución descendente confiere a la tercera inversión su urgencia e impulso característicos.',
          tryThisLabel:
            'Escucha Cmaj7 en tercera inversión (4/2) — la séptima en el bajo',
        },
      ],
      tasks: [
        {
          instruction:
            "Toca 'Cmaj7' en estado fundamental, después 'Cmaj7/E' (primera inversión), 'Cmaj7/G' (segunda inversión) y 'Cmaj7/B' (tercera inversión). Las mismas cuatro notas — escucha cómo la nota del bajo altera por completo el carácter del acorde",
        },
        {
          instruction:
            "Compara 'G7' (estado fundamental, V7 en Do) con 'G7/F' (tercera inversión, V4/2). En la tercera inversión, la séptima (Fa) está en el bajo y exige resolver descendiendo a Mi — haciendo que V4/2 resuelva naturalmente a I6",
        },
        {
          instruction:
            "Construye 'Dm7/C' — Dm7 en tercera inversión. La séptima del acorde (Do) está en el bajo. En la tonalidad de Do mayor, este es el ii4/2, frecuentemente usado antes de V6/5 en un descenso suave del bajo: Do-Si (ii4/2 a V6/5)",
        },
      ],
    },

    // ── U9 M3: Diatonic Seventh Chords in Major ────────────────────────────
    l3u9m3: {
      title: 'Acordes de Séptima Diatónicos en Mayor',
      subtitle:
        'Acordes de séptima en cada grado de la escala mayor y la séptima de dominante como motor armónico',
      objectives: [
        'Construir acordes de séptima en cada grado de la escala mayor e identificar cada cualidad',
        'Comprender la séptima de dominante (V7) y su trítono como motor de la resolución tonal',
        'Reconocer la progresión ii-V-I como el movimiento de acordes más común en la música occidental',
      ],
      concepts: [
        {
          title: 'Acordes de Séptima Diatónicos en Mayor',
          explanation:
            'Apila una séptima en cada grado de la escala mayor usando solo notas de esa tonalidad. El patrón de cualidades es siempre el mismo: Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7. En Do mayor: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5. La séptima de dominante (V7) es el único acorde de séptima con cualidad de dominante que aparece de forma natural, y el semidisminuido viiø7 funciona como sustituto de la dominante.',
          tryThisLabel: 'Observa todos los acordes diatónicos en Do mayor',
        },
        {
          title: 'La Séptima de Dominante y Su Trítono',
          explanation:
            'El V7 es el acorde de séptima estructuralmente más importante en la música tonal. En Do mayor, G7 contiene las notas Sol-Si-Re-Fa. El trítono entre Si y Fa es la fuente de su tensión: Si (la sensible) tira hacia arriba, hacia Do, mientras Fa (la séptima del acorde) tira hacia abajo, hacia Mi. Esta doble resolución — hacia fuera, en movimiento contrario — es el motor fundamental que impulsa la armonía tonal hacia la tónica.',
          tryThisLabel:
            'Escucha el trítono dentro de G7 — Si y Fa exigen resolución',
        },
        {
          title: 'La Progresión ii-V-I',
          explanation:
            'La progresión de acordes más común en la música occidental encadena el ii7 predominante con el V7 dominante y el Imaj7 tónica. En Do mayor: Dm7-G7-Cmaj7. Cada acorde comparte notas comunes con el siguiente, produciendo una conducción de voces suave. El ii7 establece tensión subdominante, el V7 la intensifica con el trítono, y el Imaj7 resuelve todo. Este esqueleto de tres acordes sostiene todo, desde corales de Bach hasta estándares de jazz.',
          tryThisLabel: 'Escucha Dm7 — el sonido del ii7 en Do mayor',
        },
      ],
      tasks: [
        {
          instruction:
            "Abre 'key of C' e identifica la cualidad del acorde de séptima en cada grado: I es séptima mayor, ii es séptima menor, V es séptima de dominante. Verifica que el patrón completo corresponde a Imaj7-ii7-iii7-IVmaj7-V7-vi7-viiø7",
        },
        {
          instruction:
            "Toca 'G7' y después 'Cmaj7' — escucha cómo la séptima de dominante resuelve a la tónica. El trítono Si-Fa se abre hacia Do-Mi. Esta es la resolución V-I que define la armonía occidental",
        },
        {
          instruction:
            "Toca 'Dm7' y después 'G7' — la progresión ii-V es el movimiento de dos acordes más común en toda la música occidental. Combina función predominante (ii) con función dominante (V) para crear el máximo impulso hacia la tónica",
        },
      ],
    },

    // ── U9 M4: Diatonic Seventh Chords in Minor ────────────────────────────
    l3u9m4: {
      title: 'Acordes de Séptima Diatónicos en Menor',
      subtitle:
        'El panorama de acordes de séptima de la menor armónica — del inquietante i(mΔ7) al explosivo viio7',
      objectives: [
        'Construir acordes de séptima en cada grado de la escala menor armónica',
        'Identificar las cualidades distintas creadas por el séptimo grado elevado',
        'Comprender el papel de V7, viio7 y iiø7 como acordes de función dominante en menor',
      ],
      concepts: [
        {
          title: 'La Menor Armónica Lo Cambia Todo',
          explanation:
            'La escala menor armónica eleva el séptimo grado, creando cualidades de acordes de séptima dramáticamente diferentes en comparación con el modo mayor. En el 1.er grado, la tríada menor gana una séptima mayor, produciendo el raro acorde menor con séptima mayor: i(mΔ7). En el 3.er grado, el séptimo grado elevado transforma la tríada mayor en una tríada aumentada con séptima mayor: III+maj7. Estas cualidades exóticas confieren a las tonalidades menores su tensión y oscuridad características.',
          tryThisLabel:
            'Observa La menor armónica — la escala fuente de los acordes de séptima en menor',
        },
        {
          title: 'El Patrón Completo de Acordes de Séptima Diatónicos en Menor',
          explanation:
            'En La menor armónica, los acordes de séptima en cada grado son: i(mΔ7) en La (La-Do-Mi-Sol#), iiø7 en Si (Si-Re-Fa-La), III+maj7 en Do (Do-Mi-Sol#-Si), iv7 en Re (Re-Fa-La-Do), V7 en Mi (Mi-Sol#-Si-Re), VImaj7 en Fa (Fa-La-Do-Mi), viio7 en Sol# (Sol#-Si-Re-Fa). Los acordes críticos son V7 (función dominante, igual que en mayor), viio7 (totalmente disminuido, dominante intensificada) y iiø7 (la sonoridad predominante característica en menor).',
          tryThisLabel: 'Escucha Bm7b5 — el acorde iiø7 en La menor',
        },
        {
          title: 'La Progresión iiø7-V7-i en Menor',
          explanation:
            'La contrapartida en menor del ii-V-I mayor: iiø7-V7-i. En La menor: Bm7b5-E7-Am. El iiø7 semidisminuido tiene una cualidad más sombría e inquieta que el ii7 de séptima menor de las tonalidades mayores. Combinado con V7 (que contiene la sensible elevada Sol#), esta progresión se impulsa hacia la tónica menor con una intensidad que la versión en mayor no puede igualar. El viio7 puede sustituir al V7, añadiendo aún más tensión.',
          tryThisLabel:
            'Escucha E7 — el V7 en La menor con la sensible elevada Sol#',
        },
      ],
      tasks: [
        {
          instruction:
            "Abre 'A harmonic minor scale' y construye un acorde de séptima en cada grado. Compara el patrón con La mayor — observa cómo el Sol# elevado altera la cualidad de los acordes en los grados i, III, V y vii",
        },
        {
          instruction:
            "Toca 'Bm7b5' y después 'E7' y después 'Am' — esta es la progresión iiø7-V7-i en La menor. La cualidad semidisminuida del iiø7 confiere a esta progresión un carácter más sombrío y urgente que el ii-V-I en mayor",
        },
        {
          instruction:
            "Toca 'G#dim7' — el viio7 en La menor armónica. Al igual que Cdim7, es totalmente disminuido con intervalos de 3.ª menor entre todas las notas. Funciona como una dominante intensificada que puede sustituir al V7 en tonalidades menores",
        },
      ],
    },

    // ── U10 M1: Voice Leading — SATB Basics ────────────────────────────────
    l3u10m1: {
      title: 'Conducción de Voces — Nociones Básicas de SATB',
      subtitle: 'Disposición SATB, tesituras, reglas de espaciado y convenciones de duplicación',
      objectives: [
        'Comprender la disposición SATB con tesituras, espaciados y duplicaciones correctos',
        'Aplicar reglas de duplicación según la posición y función del acorde',
        'Reconocer errores de cruzamiento y solapamiento de voces',
      ],
      concepts: [
        {
          title: 'SATB — Las Cuatro Voces',
          explanation:
            'La armonía tradicional distribuye las notas entre cuatro voces con tesituras definidas: Soprano (Do4-Sol5), Contralto (Fa3-Do5), Tenor (Do3-Sol4), Bajo (Mi2-Do4). La soprano lleva la melodía y el bajo define el cimiento armónico. Las voces superiores adyacentes deben mantenerse a menos de una octava entre sí, aunque el intervalo entre tenor y bajo puede exceder una octava. Las voces nunca deben cruzarse — la soprano queda por encima del contralto, el contralto por encima del tenor.',
          tryThisLabel: 'Observa las notas de Do mayor — imagina distribuirlas entre cuatro voces',
        },
        {
          title: 'Reglas de Duplicación y Espaciado',
          explanation:
            'Cuando cuatro voces tocan una tríada de tres notas, una nota debe duplicarse. En estado fundamental, duplica la fundamental — es la elección más fuerte y estable. En primera inversión, duplica la nota de la soprano para mayor flexibilidad. Nunca dupliques la sensible: esta tiene una resolución obligatoria hacia la tónica, y duplicarla crea octavas paralelas inevitables. En tríadas disminuidas, duplica la tercera (la nota más estable en un acorde inestable).',
          tryThisLabel: 'Observa Bdim — en SATB, duplica la tercera (Re), nunca la fundamental',
        },
        {
          title: 'Solapamiento de Voces',
          explanation:
            'El solapamiento de voces es un error más sutil que el cruzamiento: se produce cuando una voz sobrepasa la posición donde la voz adyacente estaba en el tiempo anterior. Por ejemplo, si el contralto estaba en Re4 en el tiempo 1, la soprano no puede descender por debajo de Re4 en el tiempo 2, aunque el contralto también haya descendido. El solapamiento oscurece la identidad de las voces del mismo modo que el cruzamiento, haciendo las líneas más difíciles de seguir como melodías independientes.',
          tryThisLabel: 'Observa Fa mayor — practica imaginar disposiciones SATB en papel',
        },
      ],
      tasks: [
        {
          instruction:
            'En papel, escribe una tríada de Do mayor en SATB: Bajo Do2, Tenor Sol3, Contralto Mi4, Soprano Do5. Verifica todas las reglas de espaciado: intervalo soprano-contralto (6.ª menor — inferior a una octava), contralto-tenor (6.ª mayor — inferior a una octava), tenor-bajo (12.ª justa — entre tenor y bajo puede exceder la octava). Todo válido.',
        },
        {
          instruction:
            'Explica por qué duplicar la sensible (Si en Do mayor) está prohibido: ambas notas Si deben resolver hacia Do, produciendo octavas paralelas — uno de los errores más graves de conducción de voces',
        },
        {
          instruction:
            'Escribe una tríada de Fa mayor en SATB con duplicación correcta: duplica la fundamental Fa. Después escribe una tríada de viio (Bdim) — aquí duplica la tercera (Re), no la fundamental, porque Si es la sensible y la fundamental de un acorde disminuido es inestable',
        },
      ],
    },

    // ── U10 M2: Forbidden Parallels and Voice Motion ────────────────────────
    l3u10m2: {
      title: 'Quintas y Octavas Paralelas Prohibidas y Movimiento de Voces',
      subtitle:
        'Los cuatro tipos de movimiento y las reglas de quintas/octavas paralelas que gobiernan la escritura a partes',
      objectives: [
        'Identificar los cuatro tipos de movimiento de voces: contrario, oblicuo, directo, paralelo',
        'Reconocer y evitar quintas y octavas paralelas prohibidas',
        'Comprender quintas y octavas directas (ocultas) y cuándo son aceptables',
      ],
      concepts: [
        {
          title: 'Cuatro Tipos de Movimiento de Voces',
          explanation:
            'Entre dos voces cualesquiera que se mueven de un acorde al siguiente: el movimiento contrario (direcciones opuestas) produce la mayor independencia y es siempre la elección más segura. El movimiento oblicuo (una se mantiene, la otra se mueve) es suave y discreto. El movimiento directo (misma dirección, intervalos diferentes) es aceptable pero requiere vigilancia. El movimiento paralelo (misma dirección, mismo intervalo) es el más restringido — ciertos intervalos paralelos están prohibidos porque destruyen la independencia de las voces.',
          tryThisLabel: 'Observa Do mayor — el acorde de partida para ejercicios de movimiento de voces',
        },
        {
          title: 'Quintas y Octavas Paralelas',
          explanation:
            'Las quintas paralelas se producen cuando dos voces a una quinta justa de distancia se mueven ambas por el mismo intervalo hacia otra quinta justa. Las octavas paralelas son lo mismo a la octava. Ambas están prohibidas en la armonía de práctica común porque las voces se funden acústicamente — dejan de sonar como líneas melódicas independientes y colapsan en una única línea reforzada. Las terceras y sextas paralelas, en cambio, se fomentan porque las consonancias imperfectas mantienen la independencia de las voces.',
          tryThisLabel: 'Observa Sol mayor — practica moverse de Do a Sol y verifica si hay paralelas',
        },
        {
          title: 'Quintas y Octavas Directas (Ocultas)',
          explanation:
            'Las quintas y octavas directas se producen cuando dos voces se mueven en dirección semejante (misma dirección pero intervalos diferentes) hacia una quinta justa u octava. Son menos graves que las paralelas pero igualmente restringidas, especialmente entre las voces extremas (soprano y bajo). La excepción estándar: las quintas u octavas directas son aceptables si la soprano se mueve por grado conjunto, porque el movimiento por grado de la soprano enmascara el efecto. En las voces interiores, los intervalos directos se toleran generalmente.',
          tryThisLabel: 'Observa Fa mayor — imagina la soprano y el bajo moviéndose hacia una quinta',
        },
      ],
      tasks: [
        {
          instruction:
            'Dados dos acordes, Do mayor (Do-Mi-Sol) moviéndose a Fa mayor (Fa-La-Do), identifica el tipo de movimiento entre cada par de voces. Si el bajo desciende de Do a Fa mientras la soprano sube de Sol a La, eso es movimiento contrario — el tipo más fuerte y deseable',
        },
        {
          instruction:
            'Identifica las quintas paralelas en esta progresión: soprano Sol-La, bajo Do-Re. En el primer acorde, el intervalo es una quinta justa (Do a Sol). En el segundo acorde, el intervalo sigue siendo una quinta justa (Re a La). Ambas voces subieron por grado — quintas paralelas. Prohibido.',
        },
        {
          instruction:
            'Escribe Do mayor a Sol mayor en SATB donde el bajo sube de Do a Sol (una quinta) y la soprano desciende de Mi a Re (un grado). Clasifica el tipo de movimiento de cada par de voces. Verifica que no existan quintas ni octavas paralelas',
        },
      ],
    },

    // ── U10 M3: Root Position Part Writing ──────────────────────────────────
    l3u10m3: {
      title: 'Escritura a Partes en Estado Fundamental',
      subtitle:
        'Enlazar tríadas en estado fundamental con conducción de voces suave según el tipo de movimiento de la fundamental',
      objectives: [
        'Enlazar tríadas en estado fundamental siguiendo las reglas de conducción de voces',
        'Aplicar estrategias diferentes según las fundamentales se muevan por quinta, tercera o segunda',
        'Escribir voces interiores suaves manteniendo la duplicación correcta y evitando paralelas',
      ],
      concepts: [
        {
          title: 'El Objetivo de la Escritura a Partes',
          explanation:
            'La escritura a partes produce cuatro líneas melódicas independientes que, en conjunto, crean armonía correcta. Cada voz debe ser individualmente cantable. El bajo define el acorde. La soprano conduce la melodía. Contralto y tenor rellenan la armonía. El desafío es mover las cuatro voces suavemente de acorde en acorde, obedeciendo simultáneamente las reglas de espaciado, duplicación y movimiento de voces.',
          tryThisLabel: 'Observa Do mayor — el acorde que vas a disponer a cuatro partes',
        },
        {
          title: 'Movimiento de la Fundamental por Quinta — Mantén la Nota Común',
          explanation:
            'Cuando las fundamentales de los acordes distan una quinta (I-V, I-IV, ii-V), existe una nota común entre los dos acordes. Mantén esa nota común en la misma voz y mueve las otras dos voces superiores hacia las notas del acorde más cercanas. Este es el movimiento de fundamental más común en la música tonal y produce consistentemente la conducción de voces más suave y económica.',
          tryThisLabel: 'Observa Sol mayor — I a V comparten la nota común Sol',
        },
        {
          title: 'Movimiento de la Fundamental por Tercera y por Segunda',
          explanation:
            'Fundamentales a una tercera de distancia (I-vi, I-iii, IV-ii) comparten dos notas comunes — mantén ambas en las mismas voces y mueve solo la voz restante. Fundamentales a una segunda de distancia (IV-V, V-vi, I-ii) no comparten ninguna nota común — las tres voces superiores deben moverse. Para movimiento del bajo por grado, mueve todas las voces superiores en movimiento contrario al bajo para prevenir las quintas y octavas paralelas que fácilmente surgen.',
          tryThisLabel: 'Observa La menor — I a vi comparten dos notas comunes (Do y Mi)',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe I-V-I en Do mayor en SATB en papel. Entre I y V, la nota común es Sol — mantenla en la misma voz. Entre V e I, mantén Sol de nuevo. Mueve las voces restantes hacia las notas del acorde más cercanas',
        },
        {
          instruction:
            'Escribe IV-V en Do mayor. Las fundamentales Fa y Sol están a una segunda de distancia — cero notas comunes. Mueve todas las voces superiores en movimiento contrario al bajo (el bajo sube de Fa a Sol, las voces superiores descienden). Verifica cada par de voces en busca de quintas y octavas paralelas',
        },
        {
          instruction:
            'Escribe I-vi en Do mayor. Las fundamentales Do y La están a una tercera de distancia — dos notas comunes (Do y Mi). Mantén ambas en las mismas voces y mueve solo la voz restante de Sol a La. Esto produce la conducción de voces más suave posible con movimiento mínimo',
        },
      ],
    },

    // ── U10 M4: Triads in Inversion ─────────────────────────────────────────
    l3u10m4: {
      title: 'Tríadas en Inversión',
      subtitle:
        'Cuándo y por qué usar tríadas invertidas — incluida la restringida segunda inversión',
      objectives: [
        'Comprender cuándo y por qué usar tríadas en primera inversión (6/3) para líneas de bajo más suaves',
        'Conocer los cuatro usos sancionados de tríadas en segunda inversión (6/4)',
        'Aplicar reglas de duplicación adecuadas para tríadas invertidas',
      ],
      concepts: [
        {
          title: 'Primera Inversión — Versátil y Suave',
          explanation:
            'La primera inversión coloca la tercera en el bajo, creando una versión más ligera y menos enfática del acorde. Su propósito principal es crear una línea de bajo suave, por grado — la razón más común por la que los compositores invierten tríadas. Cualquier tríada en estado fundamental puede colocarse en primera inversión para aportar variedad. Duplica la nota de la soprano; evita duplicar el bajo si es la sensible o una nota con tendencia de resolución.',
          tryThisLabel: 'Escucha Do mayor en primera inversión — Mi en el bajo',
        },
        {
          title: 'Segunda Inversión — Uso Restringido',
          explanation:
            'La segunda inversión coloca la quinta en el bajo, creando un intervalo de cuarta justa por encima del bajo — históricamente tratada como disonancia. En la armonía de práctica común, las tríadas en segunda inversión no se usan libremente. Existen cuatro patrones sancionados: el 6/4 cadencial (I6/4 decorando el V en una cadencia), el 6/4 de paso (bajo por grado entre inversiones), el 6/4 de pedal (voces superiores se mueven sobre un bajo sostenido), y el 6/4 arpegiado en figuras de acompañamiento.',
          tryThisLabel: 'Escucha Do mayor en segunda inversión — Sol en el bajo',
        },
        {
          title: 'El 6/4 Cadencial',
          explanation:
            'El patrón más importante de segunda inversión: I6/4 resolviendo a V en una cadencia. La 6.ª y la 4.ª por encima del bajo funcionan como dobles apoyaturas que resuelven por grado descendente hacia la 5.ª y la 3.ª del V. Muchos teóricos analizan este acorde no como un acorde de tónica sino como una dominante decorada — V con retardos. Esta distinción importa: el 6/4 cadencial funciona como dominante, no como tónica, a pesar de su escritura.',
          tryThisLabel:
            'Escucha Fa en primera inversión — bloque de construcción de líneas de bajo suaves',
        },
      ],
      tasks: [
        {
          instruction:
            "Toca 'C/E' y después 'C/G' — las mismas tres notas, nota de bajo diferente. La primera inversión suena más ligera y suave; la segunda inversión suena inestable y quiere resolver hacia abajo",
        },
        {
          instruction:
            "Toca 'C/G' y después 'G7' — esto demuestra el patrón del 6/4 cadencial. El C/G funciona como una decoración de la dominante, no como un verdadero acorde de tónica. Escucha cómo fluye naturalmente hacia G7",
        },
        {
          instruction:
            "Toca 'F/A' — Fa mayor en primera inversión. La nota de bajo La crea un enlace suave por grado desde Sol (un acorde dominante) pasando por La hasta Sib, posibilitando una línea de bajo por grado que acordes en estado fundamental no pueden lograr",
        },
      ],
    },

    // ── U11 M1: Cadences ────────────────────────────────────────────────────
    l3u11m1: {
      title: 'Cadencias: El Conjunto Completo',
      subtitle:
        'Los seis tipos de cadencia estándar — la puntuación armónica que da forma a las frases musicales',
      objectives: [
        'Identificar y escuchar los seis tipos de cadencia estándar',
        'Comprender las cadencias como puntuación armónica que define los límites de las frases',
        'Distinguir cadencias fuertes (perfecta) de débiles (semicadencia, imperfecta) y resoluciones interrumpidas',
      ],
      concepts: [
        {
          title: 'Cadencias Auténticas — Perfecta e Imperfecta',
          explanation:
            'La cadencia auténtica perfecta (CAP) es V(7) a I, ambos en estado fundamental, con la soprano terminando en el 1.er grado de la escala. Es la llegada armónica más fuerte — un punto final. La cadencia auténtica imperfecta (CAI) también hace V a I pero debilita el cierre: uno de los acordes puede estar invertido, o la soprano termina en la 3.ª o 5.ª del I en lugar de la fundamental. Una CAI funciona como una coma en vez de un punto final.',
          tryThisLabel:
            'Escucha V7 en Do mayor — el punto de partida de las cadencias auténticas',
        },
        {
          title: 'Semicadencia, Cadencia Plagal e Interrumpida',
          explanation:
            'La semicadencia termina en V — cualquier acorde que se mueve hacia la dominante. Suena como una pregunta sin respuesta, creando suspense en los límites de las frases. La cadencia plagal (IV a I) es la suave cadencia del «Amén», más ligera que la auténtica. La cadencia interrumpida (V a vi) subvierte la resolución esperada: vi comparte dos notas con I (en Do mayor, La menor comparte Do y Mi con el acorde de Do), produciendo un casi-acierto que sorprende al oyente y prolonga la frase.',
          tryThisLabel:
            'Escucha la tónica — el destino de las cadencias auténticas y plagales',
        },
        {
          title: 'La Semicadencia Frigia',
          explanation:
            'Exclusiva de las tonalidades menores: iv6 resolviendo a V, con el bajo descendiendo por semitono del b6.º grado al 5.º. Este descenso de semitono en el bajo da a la cadencia su nombre — se asemeja al semitono descendente característico del modo frigio. Común en la música barroca, la semicadencia frigia tiene una cualidad sombría y arcaica que ninguna otra cadencia replica.',
          tryThisLabel:
            'Escucha vi — el objetivo de resolución sorpresa de una cadencia interrumpida',
        },
      ],
      tasks: [
        {
          instruction:
            "Toca 'G7' y después 'C major chord' — esta es una cadencia perfecta (V7-I) en Do mayor. La conclusión armónica más fuerte posible. Escucha la sensación completa de resolución",
        },
        {
          instruction:
            "Toca 'G7' y después 'Am' — esta es una cadencia interrumpida (V7-vi). Esperabas Do mayor pero obtuviste La menor. Observa cómo prolonga la frase en vez de concluirla",
        },
        {
          instruction:
            "Toca 'F major chord' y después 'C major chord' — esta es una cadencia plagal (IV-I). Más suave y devocional que la cadencia auténtica. Frecuentemente escuchada como un «Amén» final después de la verdadera cadencia",
        },
      ],
    },

    // ── U11 M2: Phrases and Periods ─────────────────────────────────────────
    l3u11m2: {
      title: 'Frases y Períodos',
      subtitle:
        'Frases musicales, pares antecedente-consecuente y la estructura de frase (Satz)',
      objectives: [
        'Escuchar una frase como una unidad musical con inicio, desarrollo y cadencia',
        'Comprender el período como antecedente (pregunta) emparejado con consecuente (respuesta)',
        'Distinguir períodos paralelos, períodos contrastantes y la estructura de frase (Satz)',
      ],
      concepts: [
        {
          title: 'La Frase Musical',
          explanation:
            'La frase es la unidad fundamental de la forma musical — típicamente de 4 u 8 compases. Tiene un inicio que establece la tonalidad, un desarrollo que genera movimiento armónico y un final marcado por una cadencia. Cada cadencia señala un límite de frase. Piensa en una frase como un pensamiento musical completo, comparable a una oración en el lenguaje hablado — hace una afirmación autocontenida.',
          tryThisLabel: 'Observa la tonalidad de Do — la mayoría de las frases comienza y termina en una misma tonalidad',
        },
        {
          title: 'Períodos: Antecedente y Consecuente',
          explanation:
            'Un período empareja dos frases en una estructura de pregunta-y-respuesta. El antecedente (primera frase) termina con una cadencia débil — normalmente semicadencia o imperfecta — planteando una pregunta musical. El consecuente (segunda frase) termina con una cadencia fuerte — normalmente perfecta — proporcionando la respuesta. En un período paralelo, ambas frases comparten material de apertura similar. En un período contrastante, las aperturas difieren. Un período doble agrupa cuatro frases en dos pares antecedente-consecuente mayores.',
          tryThisLabel: 'Escucha V — el acorde que termina una frase antecedente (semicadencia)',
        },
        {
          title: 'La Frase (Satz)',
          explanation:
            'Una estructura alternativa de 8 compases común en la música clásica: una idea básica de 2 compases se presenta, después se repite (frecuentemente variada) en los compases 3-4, seguida de una continuación de 2 compases que fragmenta la idea y gana impulso, concluyendo con un gesto cadencial de 2 compases. La frase crea impulso hacia adelante mediante repetición, fragmentación y aceleración rítmica — una arquitectura fundamentalmente diferente del período equilibrado.',
          tryThisLabel: 'Escucha I — la tónica que ancla tanto la frase como el período',
        },
      ],
      tasks: [
        {
          instruction:
            'Escucha cualquier melodía conocida e identifica dónde termina cada frase — cada punto de reposo o momento de llegada marca una cadencia y un límite de frase. Cuenta los compases entre cadencias',
        },
        {
          instruction:
            'Piensa en un período paralelo como una pregunta y respuesta que comienzan de la misma forma pero terminan de manera diferente. El antecedente pregunta (terminando con semicadencia) y el consecuente responde (terminando con una CAP)',
        },
        {
          instruction:
            'Identifica la estructura de frase en una melodía clásica: encuentra la idea básica de 2 compases, su repetición, la fragmentación que sigue y la cadencia final. Mozart y Beethoven emplean esta forma constantemente',
        },
      ],
    },

    // ── U11 M3: Harmonic Rhythm ─────────────────────────────────────────────
    l3u11m3: {
      title: 'Ritmo Armónico',
      subtitle:
        'Cómo la velocidad de cambio de acordes moldea el impulso musical y la estructura de frase',
      objectives: [
        'Definir ritmo armónico como la velocidad de cambio de acordes, independiente del ritmo melódico',
        'Escuchar cómo el ritmo armónico interactúa con el metro — tiempos fuertes frente a tiempos débiles',
        'Reconocer el patrón universal de aceleración del ritmo armónico hacia las cadencias',
      ],
      concepts: [
        {
          title: '¿Qué Es el Ritmo Armónico?',
          explanation:
            'El ritmo armónico es el patrón de cambios de acordes a lo largo del tiempo. Un acorde por compás es ritmo armónico lento. Un acorde por tiempo es moderado. Dos acordes por tiempo es rápido. Crucialmente, el ritmo armónico es independiente del ritmo melódico — la melodía puede correr sobre cambios lentos de acordes o sostener notas largas sobre una armonía en rápida mutación. Es una de las herramientas primarias que los compositores usan para controlar tensión y ritmo.',
          tryThisLabel: 'Escucha Do mayor — imagina mantener este acorde durante cuatro compases enteros',
        },
        {
          title: 'Ritmo Armónico, Metro y Aceleración Cadencial',
          explanation:
            'Los cambios de acorde son más fuertes en los tiempos fuertes. En 4/4, cambiar de acorde en los tiempos 1 y 3 suena estable y natural; cambiar en los tiempos 2 y 4 crea un ritmo armónico sincopado que suena inestable. Un patrón universal en todos los estilos: el ritmo armónico se acelera hacia las cadencias. Una frase puede mantener un acorde durante dos compases, después cambiar cada compás, después cada tiempo en la cadencia — construyendo impulso en el momento de llegada.',
          tryThisLabel: 'Escucha V7 — la aceleración cadencial culmina frecuentemente en la dominante',
        },
        {
          title: 'El Ritmo Armónico como Herramienta Expresiva',
          explanation:
            'Diferentes ritmos armónicos crean caracteres fundamentalmente distintos. Un himno con un acorde por tiempo suena medido y solemne. Un estándar de jazz con dos o más acordes por compás suena armónicamente denso y cinético. Una banda sonora que mantiene un solo acorde durante ocho compases crea un espacio vasto y abierto. Los compositores eligen el ritmo armónico tan deliberadamente como eligen los acordes — este moldea la experiencia del oyente al nivel estructural más profundo.',
          tryThisLabel: 'Escucha Dm7 — en un ritmo armónico rápido, este podría durar solo un tiempo',
        },
      ],
      tasks: [
        {
          instruction:
            'Escucha cualquier pieza y marca cada vez que el acorde cambia. ¿El ritmo armónico es lento (un acorde por compás), moderado (dos por compás) o rápido (cada tiempo)? La mayoría de las frases se aceleran hacia las cadencias',
        },
        {
          instruction:
            'Compara un himno (ritmo armónico lento — un acorde por tiempo o por compás) con un estándar de jazz bebop (ritmo armónico rápido — dos o más acordes por compás). La velocidad del cambio armónico moldea directamente el carácter y la energía de la música',
        },
        {
          instruction:
            'Elige una canción que conozcas y traza el ritmo armónico a lo largo del verso y del estribillo. ¿El estribillo cambia de acorde más rápido o más lento que el verso? ¿Cómo afecta eso al impacto emocional?',
        },
      ],
    },

    // ── U11 M4: Non-Chord Tones Part 1 ──────────────────────────────────────
    l3u11m4: {
      title: 'Notas Extrañas al Acorde (Parte 1)',
      subtitle:
        'Notas de paso, bordaduras y anticipaciones — el condimento de la melodía',
      objectives: [
        'Identificar notas de paso, bordaduras y anticipaciones en una línea melódica',
        'Distinguir notas extrañas acentuadas de no acentuadas',
        'Comprender las notas extrañas como ornamentos por grado que animan notas del acorde estáticas',
      ],
      concepts: [
        {
          title: '¿Qué Son las Notas Extrañas al Acorde?',
          explanation:
            'Las notas extrañas al acorde son notas de la melodía que no pertenecen al acorde subyacente. Crean interés melódico, tensión y movimiento por grado entre notas del acorde. Sin ellas, las melodías consistirían solo en notas del acorde arpegiadas — mecánicas y sin vida. Las notas extrañas se clasifican por la forma en que se abordan y resuelven: por grado, por salto o por nota común. Son el condimento melódico que da vida a la armonía.',
          tryThisLabel: 'Observa Do mayor — Re, Fa, La y Si son notas extrañas contra este acorde',
        },
        {
          title: 'Notas de Paso y Bordaduras',
          explanation:
            'Una nota de paso rellena el hueco entre dos notas del acorde diferentes, abordada y resuelta por grado en la misma dirección (Do-Re-Mi sobre un acorde de Do, donde Re es una nota de paso entre Do y Mi). Una bordadura decora una sola nota del acorde — se aleja por grado y regresa a la nota de partida (Do-Re-Do, donde Re es una bordadura superior). Ambos tipos existen en versiones acentuadas (en el tiempo fuerte, más dramáticas) y no acentuadas (en el tiempo débil, más comunes).',
          tryThisLabel: 'Observa la escala de Do mayor — los grados entre notas del acorde son notas de paso',
        },
        {
          title: 'Anticipaciones y Bordaduras Incompletas',
          explanation:
            'Una anticipación llega antes de tiempo — una nota perteneciente al acorde siguiente suena al final del acorde actual, manteniéndose después mientras la armonía la alcanza. Crea impulso hacia adelante al adelantarse al cambio armónico. Una bordadura incompleta se aborda por grado pero se resuelve por salto (o viceversa), teniendo solo una conexión por grado. Las bordaduras incompletas son más dramáticas y angulares que sus contrapartidas completas y simétricas.',
          tryThisLabel: 'Observa Sol mayor — anticipar una nota del acorde siguiente crea impulso',
        },
      ],
      tasks: [
        {
          instruction:
            'Canta o toca Do-Re-Mi sobre un acorde de Do mayor. Re no pertenece a Do-Mi-Sol — es una nota de paso que enlaza la fundamental con la tercera por grado en una dirección',
        },
        {
          instruction:
            'Canta o toca Mi-Fa-Mi sobre un acorde de Do mayor. Fa es una bordadura superior — se aleja de Mi por grado y regresa a Mi, decorando la nota del acorde sin cambiar la armonía',
        },
        {
          instruction:
            'Identifica notas extrañas en una melodía sencilla que conozcas: toca cada nota contra el acorde subyacente y pregúntate si pertenece. Las notas que no pertenecen son notas extrañas al acorde. Clasifica cada una como nota de paso, bordadura o anticipación según su abordaje y resolución',
        },
      ],
    },

    // ── U11 M5: Transposition ───────────────────────────────────────────────
    l3u11m5: {
      title: 'Transposición',
      subtitle:
        'Mover música a cualquier tonalidad preservando todas las relaciones interválicas',
      objectives: [
        'Transponer una melodía o pasaje a una tonalidad diferente usando los métodos de intervalo o de armadura de clave',
        'Comprender la altura de concierto frente a la altura escrita para instrumentos transpositores',
        'Usar la aplicación para verificar transposiciones comparando escalas en tonalidades diferentes',
      ],
      concepts: [
        {
          title: '¿Qué Es la Transposición?',
          explanation:
            'La transposición mueve un pasaje entero a una tonalidad diferente preservando todas las relaciones interválicas. Cada nota se desplaza por el mismo intervalo. La melodía suena idéntica — solo más aguda o más grave. La transposición sirve para propósitos prácticos (adaptar a la extensión vocal de un cantante, adecuar a las tonalidades de los instrumentos) y teóricos (comprender que la misma lógica armónica opera en todas las tonalidades).',
          tryThisLabel: 'Observa Do mayor — tu tonalidad de partida para la transposición',
        },
        {
          title: 'Dos Métodos de Transposición',
          explanation:
            'El método del intervalo: determina el intervalo entre la tonalidad original y la tonalidad de destino, después desplaza cada nota por ese mismo intervalo. De Do mayor a Mib mayor es una 3.ª menor ascendente, por lo tanto cada nota sube una 3.ª menor. El método de la armadura de clave: cambia la armadura de clave a la tonalidad de destino y ajusta cualquier alteración. Ambos producen el mismo resultado; el método del intervalo es más fiable para pasajes cortos.',
          tryThisLabel: 'Observa Mib mayor — Do mayor transpuesto una 3.ª menor arriba',
        },
        {
          title: 'Instrumentos Transpositores y Altura de Concierto',
          explanation:
            'Algunos instrumentos suenan a una altura diferente de la que leen. Instrumentos en Sib (trompeta, clarinete, saxofón tenor) suenan una 2.ª mayor por debajo de lo escrito — para sonar Do de concierto, leen Re. Instrumentos en Mib (saxofón alto) suenan una 6.ª mayor por debajo. Instrumentos en Fa (trompa) suenan una 5.ª justa por debajo. La altura de concierto es la altura real que suena; todos los instrumentos se alinean con ella cuando la orquesta afina con el La 440.',
          tryThisLabel:
            'Observa Sib mayor — lo que una trompeta en Sib suena cuando lee Do mayor',
        },
      ],
      tasks: [
        {
          instruction:
            "Compara 'C major scale' y 'G major scale' — cada nota subió una quinta justa. El patrón de intervalos T-T-S-T-T-T-S se preserva exactamente; solo los nombres de las notas cambian",
        },
        {
          instruction:
            "Abre 'C major scale' y después 'Eb major scale' — has transpuesto una tercera menor arriba. Verifica: Do se convierte en Mib, Re se convierte en Fa, Mi se convierte en Sol, y así sucesivamente. Todos los intervalos se mantienen",
        },
        {
          instruction:
            "Una trompeta en Sib lee 'C major scale' pero produce el sonido de 'Bb major scale'. Abre ambas y verifica: cada nota que suena es una 2.ª mayor por debajo de la nota escrita. Por eso las partes de trompeta se escriben un tono por encima de la altura de concierto",
        },
      ],
    },
  },
};

export default curriculumL3;
