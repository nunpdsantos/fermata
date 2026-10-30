import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish translations for Level 8 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidad 25: Fuga y Formas Imitativas
  // =========================================================================

  // ---- l8u25m1: Exposición de la Fuga ----

  l8u25m1e1: {
    prompt:
      'En una exposición de fuga, ¿cuál es la diferencia entre el sujeto y la respuesta?',
    choices: [
      'El sujeto es el tema principal presentado primero; la respuesta es su imitación en la tonalidad de la dominante',
      'El sujeto lo tocan las cuerdas; la respuesta la tocan los vientos',
      'El sujeto está en mayor; la respuesta está en menor',
      'El sujeto es rápido; la respuesta es lenta',
    ],
    hint: 'El sujeto entra primero en la tonalidad de la tónica. La respuesta sigue en la dominante, imitando al sujeto una quinta por encima (o cuarta por debajo).',
  },
  l8u25m1e2: {
    prompt:
      '¿Qué distingue una "respuesta real" de una "respuesta tonal" en una fuga?',
    choices: [
      'Una respuesta real transpone el sujeto exactamente; una respuesta tonal ajusta intervalos (normalmente responde al 5 con el 1) para que la respuesta no debilite la tonalidad de la tónica',
      'Una respuesta real es más fuerte; una respuesta tonal es más suave',
      'Una respuesta real usa el mismo ritmo; una respuesta tonal altera el ritmo',
      'Una respuesta real está en la misma octava; una respuesta tonal está una octava arriba',
    ],
    hint: 'Una respuesta real es una transposición exacta a la dominante. Una respuesta tonal modifica ciertos intervalos (típicamente los grados 1 y 5) para mantener la coherencia tonal.',
  },
  l8u25m1e3: {
    prompt: '¿Qué ocurre durante la exposición de una fuga?',
    choices: [
      'Cada voz entra sucesivamente con el sujeto o la respuesta hasta que todas las voces han presentado el tema',
      'Todas las voces tocan el sujeto simultáneamente al unísono',
      'El sujeto se desarrolla mediante fragmentación y secuencia',
      'El sujeto se presenta en aumentación y disminución',
    ],
    hint: 'La exposición es la sección de apertura donde las voces entran una por una, alternando entre sujeto (tónica) y respuesta (dominante).',
  },

  // ---- l8u25m2: Episodios y Stretto ----

  l8u25m2e1: {
    prompt: '¿Cuál es la función principal de un episodio en una fuga?',
    choices: [
      'Modular entre tonalidades y proporcionar contraste usando fragmentos del sujeto',
      'Introducir un tema completamente nuevo sin relación con el sujeto',
      'Reexponer el sujeto en todas las voces simultáneamente',
      'Concluir la fuga con una cadencia final',
    ],
    hint: 'Los episodios son pasajes entre entradas del sujeto que típicamente usan secuencias construidas a partir de fragmentos del sujeto. Sirven como puentes modulantes.',
  },
  l8u25m2e2: {
    prompt: '¿Qué es el "stretto" en una fuga?',
    choices: [
      'Entradas solapadas del sujeto donde una nueva voz comienza antes de que la anterior termine',
      'Un aumento gradual del tempo hacia el final de la fuga',
      'La cadencia final donde todas las voces resuelven juntas',
      'Una sección donde el sujeto se toca de atrás hacia adelante',
    ],
    hint: 'El stretto comprime las entradas del sujeto para que se solapen, creando contrapunto intensificado. Aparece frecuentemente cerca del clímax de la fuga.',
  },
  l8u25m2e3: {
    prompt: 'En la técnica de fuga, ¿qué significa "aumentación"?',
    choices: [
      'El sujeto se presenta con valores de nota duplicados (proporcionalmente más largos)',
      'El sujeto se presenta con notas cromáticas adicionales',
      'El sujeto lo tocan más instrumentos que originalmente',
      'El sujeto se transpone a una octava más aguda',
    ],
    hint: 'La aumentación alarga el sujeto multiplicando sus duraciones (típicamente por dos). La disminución hace lo opuesto, reduciendo los valores a la mitad.',
  },

  // ---- l8u25m3: Canon ----

  l8u25m3e1: {
    prompt: '¿Qué es un canon?',
    choices: [
      'Una composición donde una voz es imitada exactamente por otra voz que entra tras un retraso',
      'Una composición donde todas las voces tocan melodías diferentes simultáneamente',
      'Una composición con una línea de bajo repetida',
      'Una composición que modula por las doce tonalidades',
    ],
    hint: 'Un canon es imitación estricta: una voz (el líder o dux) es seguida a un intervalo temporal fijo por una o más voces (el seguidor o comes) que la copian exactamente.',
  },
  l8u25m3e2: {
    prompt:
      'En un "canon a la quinta", ¿cómo se relaciona el seguidor con el líder?',
    choices: [
      'El seguidor imita al líder transpuesto una quinta justa por encima (o por debajo)',
      'El seguidor entra cinco tiempos después del líder',
      'El seguidor toca solo la quinta nota de cada frase',
      'El seguidor toca la melodía del líder cinco veces',
    ],
    hint: 'El nombre del intervalo se refiere a la transposición de altura, no al retraso temporal. Un canon a la quinta transpone la melodía una 5.ª justa.',
  },
  l8u25m3e3: {
    prompt:
      '¿Cuál es la diferencia entre imitación estricta e imitación libre?',
    choices: [
      'La imitación estricta copia los intervalos exactamente; la imitación libre permite modificaciones por razones armónicas o melódicas',
      'La imitación estricta es más rápida; la imitación libre es más lenta',
      'La imitación estricta usa solo consonancias; la imitación libre usa solo disonancias',
      'La imitación estricta es para música vocal; la imitación libre es para música instrumental',
    ],
    hint: 'La imitación estricta preserva cada intervalo con precisión. La imitación libre permite alteraciones a los intervalos manteniendo la forma general y el ritmo del modelo.',
  },

  // =========================================================================
  // Unidad 26: Gran Forma y Orquestación
  // =========================================================================

  // ---- l8u26m1: Forma Sonata ----

  l8u26m1e1: {
    prompt:
      '¿Cuáles son las dos áreas temáticas principales presentadas en una exposición en forma sonata?',
    choices: [
      'Un primer tema en la tónica y un segundo tema en una tonalidad contrastante (generalmente la dominante)',
      'Un tema rápido y un tema lento ambos en la tónica',
      'Un tema para cuerdas y un tema para vientos en la misma tonalidad',
      'Un tema mayor y su variante en modo menor',
    ],
    hint: 'La exposición establece el conflicto tonal: el grupo temático principal está en la tónica, el grupo temático secundario se mueve a la dominante (o relativo mayor en tonalidades menores).',
  },
  l8u26m1e2: {
    prompt:
      '¿Cuál es el propósito principal de la sección de desarrollo en la forma sonata?',
    choices: [
      'Explorar, fragmentar y transformar material temático a través de modulación y desarrollo motívico',
      'Introducir temas enteramente nuevos no escuchados en la exposición',
      'Repetir la exposición exactamente en una tonalidad diferente',
      'Proporcionar un contraste lento y lírico a la exposición',
    ],
    hint: 'El desarrollo toma ideas de la exposición y las trabaja a través de varias tonalidades, secuencias y técnicas contrapuntísticas, construyendo tensión hacia la reexposición.',
  },
  l8u26m1e3: {
    prompt:
      'En la reexposición de una forma sonata, ¿en qué tonalidad se presenta el segundo tema?',
    choices: [
      'En la tonalidad de la tónica, resolviendo el conflicto tonal de la exposición',
      'En la tonalidad de la dominante, exactamente como en la exposición',
      'En la tonalidad de la subdominante como compromiso',
      'En una tonalidad remota elegida libremente por el compositor',
    ],
    hint: 'La reexposición resuelve la tensión armónica trayendo ambos grupos temáticos a la tónica. El segundo tema, originalmente en la dominante, regresa ahora en la tonalidad principal.',
  },

  // ---- l8u26m2: Variación, Rondó y Ritornello ----

  l8u26m2e1: {
    prompt:
      'En una forma de tema y variaciones, ¿qué se mantiene constante a lo largo de las variaciones?',
    choices: [
      'La estructura armónica subyacente y/o el contorno melódico del tema',
      'La melodía y el ritmo exactos sin ninguna alteración',
      'Solo el tempo y la dinámica',
      'Nada; cada variación es completamente independiente',
    ],
    hint: 'Las variaciones típicamente preservan la estructura armónica y fraseológica del tema mientras alteran melodía, ritmo, textura o modo.',
  },
  l8u26m2e2: {
    prompt: '¿Qué patrón describe mejor la forma de rondó?',
    choices: [
      'ABACA (o ABACABA) — un estribillo recurrente alterna con episodios contrastantes',
      'AABB — dos secciones cada una repetida',
      'ABA — una estructura ternaria con un medio contrastante',
      'ABCD — cuatro secciones diferentes tocadas una vez cada una',
    ],
    hint: 'La forma de rondó presenta un tema principal (A) que regresa continuamente entre diferentes secciones contrastantes (B, C, etc.). El patrón mínimo es ABACA.',
  },
  l8u26m2e3: {
    prompt: '¿Qué es una chacona (o passacaglia)?',
    choices: [
      'Un conjunto de variaciones continuas sobre una línea de bajo repetida o progresión armónica',
      'Una danza rápida en metro ternario sin repeticiones',
      'Una forma vocal con estrofas y estribillos alternados',
      'Una fuga con un sujeto cromático',
    ],
    hint: 'Una chacona/passacaglia es una forma de variación construida sobre un patrón de bajo repetido (bajo ostinato). Las voces superiores cambian mientras el bajo cicla continuamente.',
  },

  // ---- l8u26m3: Orquestación ----

  l8u26m3e1: {
    prompt:
      '¿Cuáles son las cuatro familias estándar de la orquesta moderna?',
    choices: [
      'Cuerdas, Maderas, Metales, Percusión',
      'Cuerdas, Vientos, Teclados, Voces',
      'Instrumentos agudos, Instrumentos graves, Ritmo, Melodía',
      'Violines, Violonchelos, Trompetas, Tambores',
    ],
    hint: 'Las secciones orquestales estándar son: Cuerdas (violín, viola, violonchelo, contrabajo), Maderas (flauta, oboe, clarinete, fagot), Metales (trompa, trompeta, trombón, tuba) y Percusión.',
  },
  l8u26m3e2: {
    prompt:
      '¿Qué significa que un instrumento sea un "instrumento transpositor"?',
    choices: [
      'Su altura escrita difiere de la altura que realmente suena (altura de concierto)',
      'Puede tocar en cualquier tonalidad sin dificultad',
      'Puede cambiar su afinación durante una interpretación',
      'Transpone la música automáticamente para el intérprete',
    ],
    hint: 'Un instrumento transpositor produce una altura diferente de la que está escrita. Esto simplifica las digitaciones entre familias de instrumentos de tamaños diferentes.',
  },
  l8u26m3e3: {
    prompt:
      'Cuando un clarinete en Bb toca un C escrito, ¿qué altura de concierto suena?',
    choices: [
      'Bb (una 2.ª mayor por debajo de lo escrito)',
      'D (una 2.ª mayor por encima de lo escrito)',
      'C (igual a lo escrito)',
      'Eb (una 3.ª menor por encima de lo escrito)',
    ],
    hint: 'Un instrumento en Bb suena una 2.ª mayor por debajo de lo escrito. Cuando el intérprete lee C, el oyente escucha Bb. Para sonar un C de concierto, el intérprete debe leer D.',
  },

  // =========================================================================
  // Unidad 27: Postonal y Contemporáneo
  // =========================================================================

  // ---- l8u27m1: Conjuntos de Clases de Altura ----

  l8u27m1e1: {
    prompt:
      'En la notación por enteros de clases de altura, ¿qué número representa la nota C?',
    choices: ['0', '1', '12', '7'],
    hint: 'La notación por enteros de clases de altura asigna C = 0, C#/Db = 1, D = 2, y así sucesivamente hasta B = 11. El sistema es módulo 12.',
  },
  l8u27m1e2: {
    prompt:
      '¿Qué es la "forma normal" de un conjunto de clases de altura?',
    choices: [
      'La disposición de las clases de altura en orden ascendente dentro de la menor extensión intervalar posible',
      'El orden en que las notas aparecen en la partitura',
      'La disposición por frecuencia de la más grave a la más aguda',
      'Una disposición alfabética de los nombres de las notas',
    ],
    hint: 'La forma normal es la disposición ascendente más compacta de un conjunto de clases de altura. Se rota por todas las ordenaciones y se elige la que tiene el menor intervalo exterior.',
  },
  l8u27m1e3: {
    prompt:
      '¿Cuál es el propósito de reducir un conjunto de clases de altura a su "forma primaria"?',
    choices: [
      'Crear una etiqueta estándar para que conjuntos relacionados por transposición e inversión compartan la misma identidad',
      'Determinar en qué tonalidad está la música',
      'Encontrar la fundamental de un acorde',
      'Convertir el conjunto en notación musical estándar',
    ],
    hint: 'La forma primaria es la versión más reducida de un conjunto, comenzando en 0 y compactada lo más posible a la izquierda. Permite comparar conjuntos independientemente de la transposición o inversión.',
  },

  // ---- l8u27m2: Técnica de los Doce Tonos ----

  l8u27m2e1: {
    prompt: '¿Qué es una serie dodecafónica?',
    choices: [
      'Una ordenación de las 12 clases de altura, cada una apareciendo exactamente una vez, usada como base de una composición',
      'Una escala cromática tocada de grave a agudo',
      'Una serie de 12 acordes usados como progresión armónica',
      'Doce compases de música que se repiten a lo largo de la pieza',
    ],
    hint: 'Una serie (o serie dodecafónica) es una ordenación fija de las 12 clases de altura cromáticas. Ninguna clase de altura se repite hasta que las 12 han sonado.',
  },
  l8u27m2e2: {
    prompt:
      '¿Cuáles son las cuatro formas básicas de una serie dodecafónica?',
    choices: [
      'Original (P), Retrógrada (R), Inversión (I), Retrógrada-Inversión (RI)',
      'Mayor, Menor, Aumentada, Disminuida',
      'Tónica, Dominante, Subdominante, Sensible',
      'Original, Transpuesta, Modulada, Desarrollada',
    ],
    hint: 'P es la serie original. R la invierte. I invierte todos los intervalos. RI aplica retrogradación e inversión. Cada una puede también transponerse a cualquiera de los 12 niveles.',
  },
  l8u27m2e3: {
    prompt: '¿Cuál es la función de una matriz de los doce tonos?',
    choices: [
      'Presentar las 48 formas de la serie (12 transposiciones de P, R, I, RI) en una sola cuadrícula 12×12',
      'Mostrar qué instrumentos tocan cada nota de la serie',
      'Convertir números de clases de altura en notación estándar',
      'Calcular el ritmo armónico de una composición serial',
    ],
    hint: 'La matriz (o cuadrado mágico) es una cuadrícula 12×12. Las filas de izquierda a derecha dan las formas P, de derecha a izquierda las R, las columnas de arriba abajo las I y de abajo arriba las RI.',
  },

  // ---- l8u27m3: Técnicas del Siglo XX ----

  l8u27m3e1: {
    prompt:
      '¿Qué es el "planing" (también llamado paralelismo) en la música de principios del siglo XX?',
    choices: [
      'Mover acordes o intervalos en movimiento paralelo, manteniendo exactamente la estructura interválica (planing cromático) o ajustándola a la escala (planing diatónico)',
      'Aumentar gradualmente el tempo a lo largo de un pasaje',
      'Alternar entre dos tonalidades diferentes en cada compás',
      'Escribir solo en movimiento por grado conjunto (movimiento conjunto)',
    ],
    hint: 'El planing mueve una forma de acorde o intervalo fija hacia arriba o abajo en paralelo. Debussy usó famosamente tríadas y acordes de novena paralelos, abandonando las reglas tradicionales de conducción de voces.',
  },
  l8u27m3e2: {
    prompt: '¿Qué es la politonalidad?',
    choices: [
      'El uso simultáneo de dos o más tonalidades diferentes',
      'Música que cambia frecuentemente de tonalidad en una sola línea melódica',
      'El uso de los doce tonos por igual sin centro tonal',
      'Una textura con múltiples patrones rítmicos independientes',
    ],
    hint: 'La politonalidad superpone diferentes centros tonales al mismo tiempo. La bitonalidad (dos tonalidades) es el tipo más común. Milhaud y Stravinski la usaron extensivamente.',
  },
  l8u27m3e3: {
    prompt: '¿Qué es el pandiatonicismo?',
    choices: [
      'El uso libre de todas las notas de una escala diatónica sin armonía funcional tradicional ni reglas de conducción de voces',
      'Música que usa solo escalas pentatónicas',
      'El uso de los doce tonos cromáticos simultáneamente',
      'Una melodía diatónica armonizada exclusivamente con tríadas',
    ],
    hint: 'El pandiatonicismo usa material diatónico (p. ej., todas las teclas blancas) pero sin jerarquía tonal ni progresiones funcionales. Stravinski y Copland lo emplearon libremente.',
  },

  // ---- l8u27m4: Minimalismo y Aleatoriedad ----

  l8u27m4e1: {
    prompt:
      '¿Cuál de las siguientes opciones describe mejor el minimalismo musical?',
    choices: [
      'Música construida sobre repetición extensiva de patrones cortos con cambios graduales y sutiles a lo largo del tiempo',
      'Música que utiliza el menor número posible de instrumentos',
      'Música que dura menos de un minuto',
      'Música que evita toda repetición en favor de variación constante',
    ],
    hint: 'El minimalismo (Riley, Reich, Glass, Adams) presenta patrones repetitivos, pulsación constante, armonía consonante y procesos lentos de transformación gradual.',
  },
  l8u27m4e2: {
    prompt: '¿Qué es la música aleatoria?',
    choices: [
      'Música en la que algún elemento de la composición o interpretación se deja al azar o a la elección del intérprete',
      'Música compuesta enteramente por un algoritmo de computadora',
      'Música que se interpreta siempre a un tempo muy rápido',
      'Música que usa solo instrumentos electrónicos',
    ],
    hint: 'Aleatorio viene del latín "alea" (dado). Cage, Lutosławski y otros incorporaron aleatoriedad o indeterminación del intérprete en sus composiciones.',
  },
  l8u27m4e3: {
    prompt:
      '¿Cuál de las siguientes es un ejemplo de una "técnica extendida"?',
    choices: [
      'Tocar dentro del piano pulsando o amortiguando las cuerdas directamente',
      'Tocar una escala estándar a un tempo muy rápido',
      'Usar un metrónomo durante la interpretación',
      'Leer a primera vista una pieza nueva',
    ],
    hint: 'Las técnicas extendidas producen sonidos no estándar: piano preparado, col legno, multifónicos, frullato, arco detrás del puente, y muchas más.',
  },

  // ---- l8u27m5: Ritmo Avanzado ----

  l8u27m5e1: {
    prompt: '¿Qué es una polirritmia?',
    choices: [
      'Dos o más patrones rítmicos conflictivos ejecutados simultáneamente',
      'Un único ritmo tocado por múltiples instrumentos al unísono',
      'Un ritmo que acelera gradualmente',
      'Un ritmo escrito en un compás compuesto',
    ],
    hint: 'La polirritmia superpone diferentes agrupaciones rítmicas al mismo tiempo (p. ej., tresillos contra pares, o 4 contra 3). Cada capa mantiene su propia división del pulso.',
  },
  l8u27m5e2: {
    prompt: '¿Qué es una hemiola?',
    choices: [
      'Un recurso rítmico que crea el efecto de 3 tiempos contra 2 (o 2 contra 3) dentro del mismo período de tiempo',
      'Un silencio que dura exactamente la mitad de un tiempo',
      'Una técnica en la que el tempo se duplica súbitamente',
      'Un ritmo sincopado usado solo en el jazz',
    ],
    hint: 'La hemiola reagrupa los tiempos de modo que lo que se sentía en tres se siente temporalmente en dos, o viceversa. Común en la música barroca y en los ritmos latinoamericanos.',
  },
  l8u27m5e3: {
    prompt: '¿Qué es la modulación métrica?',
    choices: [
      'Un cambio de tempo logrado reinterpretando un valor de nota del metro antiguo como la unidad de tiempo del nuevo metro',
      'Cambiar de una tonalidad mayor a una menor',
      'Tocar el mismo ritmo en una octava diferente',
      'Desacelerar gradualmente al final de una pieza',
    ],
    hint: 'La modulación métrica (término asociado a Elliott Carter) usa un valor rítmico común como pivote entre dos tempos. Por ejemplo, una corchea de tresillo en el tempo antiguo se convierte en la nueva corchea.',
  },
};

export default overlay;
