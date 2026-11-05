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
      "El sujeto empieza; la respuesta sigue en la tonalidad una quinta por encima",
      'La respuesta empieza; el sujeto sigue en la tonalidad una quinta por encima',
      'El sujeto empieza; la respuesta sigue en la tonalidad una quinta por debajo',
      'La respuesta empieza; el sujeto sigue en la tonalidad una quinta por debajo',
    ],
    hint: 'El sujeto entra primero en la tonalidad de la tónica. La respuesta sigue en la dominante, imitando al sujeto una quinta por encima (o cuarta por debajo).',
  },
  l8u25m1e2: {
    prompt:
      '¿Qué distingue una "respuesta real" de una "respuesta tonal" en una fuga?',
    choices: [
      "Una respuesta real conserva intervalos exactos; una respuesta tonal los ajusta para no debilitar la tonalidad de la tónica",
      "Una respuesta tonal conserva intervalos exactos; una respuesta real los ajusta para no debilitar la tonalidad de la tónica",
      "Una respuesta real conserva ritmos exactos; una respuesta tonal los ajusta para no debilitar la tonalidad de la tónica",
      "Una respuesta tonal conserva ritmos exactos; una respuesta real los ajusta para no debilitar la tonalidad de la tónica",
    ],
    hint: 'Una respuesta real es una transposición exacta a la dominante. Una respuesta tonal ajusta el inicio del sujeto para que el grado 5 se responda con el 1 (y el 1 con el 5), manteniendo la relación tónica–dominante.',
  },
  l8u25m1e3: {
    prompt: '¿Qué ocurre durante la exposición de una fuga?',
    choices: [
      'Voces sucesivas presentan el sujeto y la respuesta hasta que han entrado todas las voces',
      'Voces simultáneas presentan el sujeto y la respuesta en una única entrada coral',
      'Voces sucesivas desarrollan fragmentos del sujeto antes de cualquier presentación completa',
      'Voces sucesivas presentan la respuesta antes de la primera presentación del sujeto',
    ],
    hint: 'La exposición es la sección de apertura donde las voces entran una por una, alternando entre sujeto (tónica) y respuesta (dominante).',
  },

  // ---- l8u25m2: Episodios y Stretto ----

  l8u25m2e1: {
    prompt: '¿Cuál es la función principal de un episodio en una fuga?',
    choices: [
      "Conectar entradas del sujeto mediante secuencias y modulación",
      "Sustituir entradas del sujeto por temas sin relación, usando secuencias y modulación",
      "Repetir las entradas completas del sujeto de la exposición en su secuencia tonal original",
      "Presentar entradas del sujeto juntas en unísono, sin secuencias de enlace ni modulación",
    ],
    hint: 'Los episodios son pasajes entre entradas del sujeto que típicamente usan secuencias construidas a partir de fragmentos del sujeto. Sirven como puentes modulantes.',
  },
  l8u25m2e2: {
    prompt: '¿Qué es el "stretto" en una fuga?',
    choices: [
      'Entradas superpuestas del sujeto',
      'Entradas no superpuestas del sujeto',
      'Entradas del sujeto con valores de nota duplicados',
      'Entradas del sujeto con el orden de las notas invertido',
    ],
    hint: 'El stretto comprime las entradas del sujeto para que se solapen, creando contrapunto intensificado. Aparece frecuentemente cerca del clímax de la fuga.',
  },
  l8u25m2e3: {
    prompt: 'En la técnica de fuga, ¿qué significa "aumentación"?',
    choices: [
      'Multiplicar por 2 la duración de cada nota',
      'Dividir por 2 la duración de cada nota',
      'Invertir la secuencia de duraciones de las notas',
      'Mantener la duración de cada nota y subir todas las alturas',
    ],
    hint: 'La aumentación alarga el sujeto multiplicando sus duraciones (típicamente por dos). La disminución hace lo opuesto, reduciendo los valores a la mitad.',
  },

  // ---- l8u25m3: Canon ----

  l8u25m3e1: {
    prompt: '¿Qué es un canon?',
    choices: [
      'Imitación exacta con entrada tras un intervalo de tiempo',
      'Duplicación exacta con entrada al mismo tiempo',
      'Un ostinato bajo una melodía sin relación',
      'Frases alternas sin imitación melódica',
    ],
    hint: 'Un canon es imitación estricta: una voz (la propuesta, la que empieza) es seguida a un intervalo temporal fijo por una o más voces (la respuesta, la que imita) que la copian exactamente.',
  },
  l8u25m3e2: {
    prompt:
      'Un canon empieza en C4; la voz siguiente entra después en G4 e imita la misma melodía transpuesta. ¿Cuál es el intervalo de entrada?',
    choices: [
      'Una quinta justa',
      'Una cuarta justa',
      'Una tercera mayor',
      'Un tono',
    ],
    hint: 'El nombre del intervalo se refiere a la transposición de altura, no al retraso temporal. Un canon a la quinta transpone la melodía una 5.ª justa.',
  },
  l8u25m3e3: {
    prompt:
      '¿Cuál es la diferencia entre imitación estricta e imitación libre?',
    choices: [
      "La imitación estricta conserva los intervalos originales; la imitación libre puede adaptarlos",
      "La imitación estricta puede adaptar los intervalos originales; la imitación libre los conserva sin cambios",
      "La imitación estricta conserva el ritmo original; la imitación libre lo invierte",
      "La imitación estricta invierte el ritmo original; la imitación libre lo conserva sin cambios",
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
      "Primer tema: tónica; segundo tema: tonalidad contrastante",
      "Primer tema: tonalidad contrastante; segundo tema: tónica",
      "Primer tema: tónica; segundo tema: tónica",
      "Primer tema: dominante; segundo tema: dominante",
    ],
    hint: 'La exposición establece el conflicto tonal: el grupo temático principal está en la tónica, el grupo temático secundario se mueve a la dominante (o la relativa mayor en las tonalidades menores).',
  },
  l8u26m1e2: {
    prompt:
      '¿Cuál es el propósito principal de la sección de desarrollo en la forma sonata?',
    choices: [
      'Fragmentar y desarrollar los temas',
      "Introducir y contrastar los temas",
      "Reexponer ambos temas en la tónica",
      "Concluir ambos temas con una coda",
    ],
    hint: 'El desarrollo toma ideas de la exposición y las trabaja a través de varias tonalidades, secuencias y técnicas contrapuntísticas, construyendo tensión hacia la reexposición.',
  },
  l8u26m1e3: {
    prompt:
      'En la reexposición de una sonata en C mayor, ¿en qué tonalidad se presenta normalmente el segundo tema?',
    choices: [
      'C mayor',
      'G mayor',
      'C menor',
      'G menor',
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
      'La textura y el registro del tema, mientras la melodía y el ritmo se transforman',
    ],
    hint: 'Las variaciones típicamente preservan la estructura armónica y fraseológica del tema mientras alteran melodía, ritmo, textura o modo.',
  },
  l8u26m2e2: {
    prompt: '¿Qué patrón describe mejor la forma de rondó?',
    choices: [
      "ABACA (o ABACABA): el tema principal va reapareciendo",
      'ABAB (o ABABAB): A alterna con el mismo episodio y termina en B',
      "ABCD (o ABCDEF): cada sección introduce otro tema",
      "AABB (o AABBCC): cada sección se repite antes de la siguiente",
    ],
    hint: 'La forma de rondó presenta un tema principal (A) que regresa entre secciones contrastantes. Los patrones en cinco partes incluyen ABACA y ABABA.',
  },
  l8u26m2e3: {
    prompt: '¿Qué es una chacona (o passacaglia)?',
    choices: [
      "Variaciones continuas sobre un bajo o patrón armónico recurrente",
      "Episodios contrastantes entre retornos de un estribillo",
      "Entradas imitativas de un sujeto en voces sucesivas",
      "Temas contrastantes en una exposición, desarrollo y reexposición",
    ],
    hint: 'Una chacona/passacaglia es una forma de variación construida sobre un patrón de bajo repetido (bajo ostinato). Las voces superiores cambian mientras el bajo se repite continuamente.',
  },

  // ---- l8u26m3: Orquestación ----

  l8u26m3e1: {
    prompt:
      '¿Cuáles son las cuatro familias estándar de la orquesta moderna?',
    choices: [
      'Cuerda, madera, metal, percusión',
      'Cuerda, teclados, madera, voces',
      'Cuerda, metal, voces, teclados',
      'Cuerda, voces, percusión, metal',
    ],
    hint: 'Las secciones orquestales estándar son: Cuerda (violín, viola, violonchelo, contrabajo), Madera (flauta, oboe, clarinete, fagot), Metal (trompa, trompeta, trombón, tuba) y Percusión.',
    nudge: 'Las familias de la orquesta agrupan los instrumentos según cómo producen el sonido (con arco o pulsando, soplando, haciendo vibrar los labios, golpeando o agitando), no por registro, por función ni por instrumentos sueltos.',
  },
  l8u26m3e2: {
    prompt:
      '¿Qué significa que un instrumento sea un "instrumento transpositor"?',
    choices: [
      'La nota que oyes difiere de la nota escrita',
      'La nota que oyes coincide con la altura escrita, pero la música usa una clave poco habitual',
      'La nota que oyes cambia cuando tocas más fuerte',
      'La nota que oyes se elige libremente, independientemente de la altura escrita',
    ],
    hint: 'Un instrumento transpositor produce una altura diferente de la que está escrita. Esto simplifica las digitaciones entre familias de instrumentos de tamaños diferentes.',
  },
  l8u26m3e3: {
    prompt:
      'Cuando un clarinete en Bb toca un D escrito, ¿qué sonido real se oye?',
    choices: [
      'C',
      'E',
      'D',
      'F',
    ],
    hint: 'Un clarinete en Bb suena una 2.ª mayor por debajo de lo escrito. Cuando el intérprete lee C, el oyente escucha Bb. Para obtener C como sonido real, el intérprete debe leer D.',
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
    nudge: 'Cada clase de altura se numera por su distancia en semitonos por encima de C, en módulo 12 (así que el 12 da la vuelta). Aplica esa regla al propio C.',
  },
  l8u27m1e2: {
    prompt:
      '¿Cuál es el orden normal del conjunto de clases de altura {1, 6, 9}?',
    choices: [
      '[6, 9, 1]',
      '[1, 6, 9]',
      '[9, 1, 6]',
      '[1, 9, 6]',
    ],
    hint: 'El orden normal es la disposición ascendente más compacta de un conjunto de clases de altura. Rotas por todas las ordenaciones y eliges la que tiene el menor intervalo exterior.',
  },
  l8u27m1e3: {
    prompt:
      '¿Qué conjunto de clases de altura tiene la misma forma prima que {0, 4, 7}, admitiendo transposición e inversión?',
    choices: [
      '{0, 3, 7}',
      '{0, 1, 6}',
      '{0, 2, 8}',
      '{0, 4, 11}',
    ],
    hint: 'La forma prima es la versión más reducida de un conjunto, comenzando en 0 y compactada lo más posible a la izquierda. Permite comparar conjuntos independientemente de la transposición o inversión.',
  },

  // ---- l8u27m2: Técnica de los Doce Tonos ----

  l8u27m2e1: {
    prompt: '¿Qué es una serie dodecafónica?',
    choices: [
      'Doce clases de altura en un orden fijo, cada una presentada una vez',
      'Doce clases de altura en un orden libre, cada una presentada una vez',
      'Doce clases de altura en un orden fijo, con repeticiones permitidas',
      'Doce clases de altura en un orden libre, con repeticiones permitidas',
    ],
    hint: 'Una serie (o serie dodecafónica) es una ordenación fija de las 12 clases de altura cromáticas. Ninguna clase de altura se repite hasta que las 12 han sonado.',
  },
  l8u27m2e2: {
    prompt:
      '¿Qué par define correctamente las formas R e I de una serie?',
    choices: [
      'R invierte el orden de las notas; I invierte la dirección de los intervalos',
      'R invierte la dirección de los intervalos; I invierte el orden de las notas',
      'R duplica los valores de las notas; I reduce los valores de las notas a la mitad',
      'R reduce los valores de las notas a la mitad; I duplica los valores de las notas',
    ],
    hint: 'P es la serie original. R la lee de atrás hacia delante (retrógrado). I invierte la dirección de todos los intervalos. RI aplica retrogradación e inversión. Cada una puede también transponerse a cualquiera de los 12 niveles.',
  },
  l8u27m2e3: {
    prompt: '¿Cuál es la función de una matriz dodecafónica?',
    choices: [
      'Obtener versiones transportadas, invertidas y retrógradas de una serie de alturas',
      'Obtener versiones armonizadas, invertidas y retrógradas de una serie de alturas',
      'Obtener versiones transportadas, armonizadas y rítmicamente aumentadas de una serie de alturas',
      'Obtener versiones rítmicamente aumentadas, armonizadas y retrógradas de una serie de alturas',
    ],
    hint: 'La matriz (o cuadrado mágico) es una cuadrícula 12×12. Las filas de izquierda a derecha dan las formas P, de derecha a izquierda las R, las columnas de arriba abajo las I y de abajo arriba las RI.',
  },

  // ---- l8u27m3: Técnicas del Siglo XX ----

  l8u27m3e1: {
    prompt:
      '¿Qué es el paralelismo en la música de principios del siglo XX?',
    choices: [
      'Mover acordes en paralelo: el paralelismo estricto (cromático) mantiene los intervalos exactos, el diatónico los ajusta a la escala',
      "Mover acordes en paralelo: el paralelismo estricto (cromático) los ajusta a la escala, el diatónico mantiene los intervalos exactos",
      "Mover acordes en paralelo: el paralelismo estricto (cromático) mantiene los intervalos exactos, el diatónico mantiene los intervalos exactos",
      "Mover acordes en paralelo: el paralelismo estricto (cromático) los ajusta a la escala, el diatónico los ajusta a la escala",
    ],
    hint: 'El paralelismo mueve una forma de acorde o intervalo fija hacia arriba o abajo en paralelo. Debussy usó famosamente tríadas y acordes de novena paralelos, abandonando las reglas tradicionales de conducción de voces.',
  },
  l8u27m3e2: {
    prompt: '¿Qué es la politonalidad?',
    choices: [
      "Varios centros tonales oídos a la vez",
      "Varios centros tonales oídos sucesivamente",
      "Varios compases oídos a la vez",
      "Varios compases oídos sucesivamente",
    ],
    hint: 'La politonalidad superpone diferentes centros tonales al mismo tiempo. La bitonalidad (dos tonalidades) es el tipo más común. Milhaud y Stravinski la usaron extensivamente.',
  },
  l8u27m3e3: {
    prompt: '¿Qué es el pandiatonicismo?',
    choices: [
      "Usar una escala diatónica libremente, sin la atracción habitual de un acorde hacia otro",
      "Usar las doce notas cromáticas libremente, sin la atracción habitual de un acorde hacia otro",
      "Usar una escala diatónica en progresiones funcionales, con cada dominante resolviendo en la tónica",
      "Usar las doce notas cromáticas en progresiones funcionales, con cada dominante resolviendo en la tónica",
    ],
    hint: 'El pandiatonicismo usa material diatónico (p. ej., todas las teclas blancas) pero sin jerarquía tonal ni progresiones funcionales. Stravinski y Copland lo emplearon libremente.',
  },

  // ---- l8u27m4: Minimalismo y Aleatoriedad ----

  l8u27m4e1: {
    prompt:
      '¿Cuál de las siguientes opciones describe mejor el minimalismo musical?',
    choices: [
      'Música basada en la repetición extensa de patrones breves, con cambios graduales a lo largo del tiempo',
      'Música definida por usar el menor número posible de intérpretes',
      'Música definida por una duración total inferior a un minuto',
      'Música basada en una sucesión continua de temas nuevos, sin repetición',
    ],
    hint: 'El minimalismo (Riley, Reich, Glass, Adams) presenta patrones repetitivos, pulsación constante, armonía consonante y procesos lentos de transformación gradual.',
  },
  l8u27m4e2: {
    prompt: '¿Qué es la música aleatoria?',
    choices: [
      'Música cuya forma o detalles dependen del azar o de decisiones del intérprete',
      'Música cuya forma y detalles quedan totalmente fijados de antemano',
      'Música cuyas alturas proceden del espectro armónico',
      'Música cuyos patrones repetidos se expanden por adiciones rítmicas graduales',
    ],
    hint: 'Aleatorio viene del latín "alea" (dado). Cage, Lutosławski y otros incorporaron aleatoriedad o indeterminación del intérprete en sus composiciones.',
  },
  l8u27m4e3: {
    prompt:
      '¿Cuál de las siguientes es un ejemplo de una "técnica expandida"?',
    choices: [
      'Apagar las cuerdas del piano apoyando los dedos sobre ellas',
      "Hacer sonar las cuerdas del piano pulsando las teclas",
      "Apagar las cuerdas del piano soltando las teclas sin pedal",
      "Sostener las cuerdas del piano manteniendo el pedal pulsado",
    ],
    hint: 'Las técnicas expandidas producen sonidos no estándar: piano preparado, col legno, multifónicos, frullato, arco detrás del puente, y muchas más.',
  },

  // ---- l8u27m5: Ritmo Avanzado ----

  l8u27m5e1: {
    prompt: '¿Qué es una polirritmia?',
    choices: [
      'Patrones rítmicos en conflicto ejecutados simultáneamente',
      'Patrones rítmicos en conflicto ejecutados consecutivamente',
      'Patrones rítmicos idénticos ejecutados simultáneamente',
      'Patrones rítmicos idénticos ejecutados consecutivamente',
    ],
    hint: 'La polirritmia superpone diferentes agrupaciones rítmicas al mismo tiempo (p. ej., tresillos contra dosillos, o 4 contra 3). Cada capa mantiene su propia división del pulso.',
  },
  l8u27m5e2: {
    prompt: '¿Qué es una hemiola?',
    choices: [
      'Un recurso que crea el efecto de 3 pulsos contra 2 (o 2 contra 3) en el mismo lapso de tiempo',
      "Un recurso que hace sonar simultáneamente 3 y 4 pulsos iguales en el mismo lapso de tiempo",
      "Un recurso que desplaza un acento de un pulso fuerte sin crear una agrupación de 3 contra 2",
      "Un recurso que acelera gradualmente el pulso manteniendo sin cambios el número de pulsos de cada grupo",
    ],
    hint: 'La hemiola reagrupa los tiempos de modo que lo que se sentía en tres se siente temporalmente en dos, o viceversa. Común en la música barroca y en los ritmos latinoamericanos.',
  },
  l8u27m5e3: {
    prompt: '¿Qué es la modulación métrica?',
    choices: [
      'Un cambio de tempo hecho al tratar un valor de nota del compás antiguo como unidad de pulso del nuevo',
      "Una reagrupación de dos grupos ternarios en tres grupos binarios, manteniendo el tempo y la duración de las notas",
      'Un cambio de acentos en el compás antiguo, manteniendo el tempo, la unidad de pulso y los valores de las notas',
      "Un cambio gradual de tempo sin un valor de nota compartido que enlace el pulso antiguo con el nuevo",
    ],
    hint: 'La modulación métrica usa un valor rítmico compartido como pivote entre dos tempos. Por ejemplo, una negra de tresillo en el tempo antiguo se convierte en el nuevo pulso de negra: negra = 120 pasa a negra = 180.',
  },
};

export default overlay;
