import type { CurriculumLevelOverlay } from '../types';

const curriculumL8: CurriculumLevelOverlay = {
  // ─── Unidades ─────────────────────────────────────────────────────────────
  units: {
    u25: {
      title: 'Fuga y Formas Imitativas',
      description:
        'Análisis de fugas, tipos de canon y técnicas de composición imitativa',
    },
    u26: {
      title: 'Gran Forma y Orquestación',
      description:
        'Análisis formal avanzado, familias orquestales e instrumentación',
    },
    u27: {
      title: 'Postonal y Contemporáneo',
      description:
        'Teoría de conjuntos, técnica dodecafónica y métodos composicionales del siglo XX',
    },
  },

  // ─── Módulos ──────────────────────────────────────────────────────────────
  modules: {
    // ── U25 M1: Exposición de la Fuga ────────────────────────────────────────
    l8u25m1: {
      title: 'Fuga: Exposición y Sujeto/Respuesta',
      subtitle:
        'Estructura de la exposición de la fuga, sujeto vs. respuesta y el contrasujeto',
      objectives: [
        'Analizar la exposición de la fuga: entradas de las voces, sujeto, respuesta, contrasujeto',
        'Distinguir respuesta real de respuesta tonal',
        'Identificar el contrasujeto y su papel en el contrapunto invertible',
        'Comprender la fuga doble y la fuga triple a nivel conceptual',
      ],
      concepts: [
        {
          title: 'Exposición de la Fuga: Entrada Voz a Voz',
          explanation:
            'Una fuga es una composición contrapuntística construida a partir de una única idea melódica (el sujeto). La exposición introduce cada voz por turno: la primera voz presenta el sujeto sola en la tónica, la segunda voz entra con la respuesta en la dominante mientras la primera continúa con un contrasujeto, y las voces siguientes siguen el mismo patrón alterno — sujeto en la tónica, respuesta en la dominante. La exposición queda completa cuando todas las voces han entrado. El número de voces (típicamente de 2 a 5) define la densidad textural de la fuga y determina cuántas entradas contiene la exposición.',
          tryThisLabel: 'Observa la tonalidad de la tónica que habitaría un sujeto de fuga',
        },
        {
          title: 'Sujeto, Respuesta y Contrasujeto',
          explanation:
            'El sujeto es el tema principal de la fuga, presentado primero en la tónica. Una respuesta real transpone el sujeto exactamente a la dominante. Una respuesta tonal modifica el intervalo inicial para preservar la coherencia tonal — típicamente convirtiendo un salto inicial de tónica a dominante en una respuesta de dominante a tónica (una 5.ª se convierte en una 4.ª). Las respuestas tonales se usan cuando el sujeto presenta de forma prominente los grados 1 y 5. El contrasujeto es una línea melódica secundaria escrita en contrapunto invertible, de modo que funcione correctamente ya sea colocada por encima o por debajo del sujeto. Un contrasujeto bien elaborado complementa al sujeto en ritmo, contorno y contenido interválico.',
          tryThisLabel: 'Observa la tonalidad de la dominante donde entra la respuesta',
        },
        {
          title: 'Fuga Doble y Fuga Triple',
          explanation:
            'Una fuga doble combina dos sujetos, ya sea presentándolos juntos desde el inicio o introduciendo cada uno en su propia exposición antes de combinarlos en una sección culminante. Una fuga triple usa tres sujetos — El Arte de la Fuga de Bach y su fuga final inacabada son los ejemplos supremos. En el tipo de presentación combinada, ambos sujetos aparecen simultáneamente en la exposición inicial; en el tipo de exposiciones separadas, el segundo sujeto recibe su propia exposición completa antes de que los dos se entrelacen contrapuntísticamente. La dificultad aumenta exponencialmente con cada sujeto adicional.',
          tryThisLabel: 'Observa Do mayor — la tonalidad de la primera fuga del CBT de Bach',
        },
      ],
      tasks: [
        {
          instruction:
            'Escucha una fuga de Bach (p. ej., CBT Libro I, Do menor). Traza la exposición: identifica la entrada de cada voz y si la respuesta es real o tonal. ¿Cuántas voces tiene la fuga?',
        },
        {
          instruction:
            'En la misma fuga, identifica el contrasujeto. ¿Aparece consistentemente en cada entrada del sujeto? ¿Es rítmicamente complementario al sujeto (rellenando donde el sujeto tiene notas largas)?',
        },
        {
          instruction:
            'Compara el sujeto y la respuesta nota a nota. ¿Dónde difieren? Si la respuesta es tonal, identifica el intervalo específico que fue ajustado y explica por qué (el inicio del sujeto enfatizaba los grados 1 y 5).',
        },
      ],
    },

    // ── U25 M2: Episodios y Stretto de la Fuga ──────────────────────────────
    l8u25m2: {
      title: 'Fuga: Episodios, Stretto y Procedimientos',
      subtitle:
        'Episodios de transición, técnica de stretto y transformaciones del sujeto',
      objectives: [
        'Identificar episodios y su material motívico (fragmentos del sujeto, secuencias)',
        'Reconocer pasajes de stretto y evaluar la proximidad de las entradas superpuestas',
        'Comprender aumentación, disminución, inversión y retrogradación del sujeto',
        'Trazar el recorrido tonal de las entradas intermedias por tonalidades vecinas',
      ],
      concepts: [
        {
          title: 'Episodios y Entradas Intermedias',
          explanation:
            'Tras la exposición, los episodios — pasajes de transición construidos a partir de fragmentos motívicos del sujeto o del contrasujeto, frecuentemente dispuestos en secuencia — modulan a nuevas tonalidades para las entradas intermedias. Cada episodio típicamente toma un motivo corto (algunas notas de la cabeza o de la cola del sujeto) y lo secuencia a través de una cadena de tonalidades, creando impulso hacia adelante. Las entradas intermedias reintroducen el sujeto en tonalidades vecinas: el relativo mayor o menor, la subdominante o áreas tonales más remotas. La alternancia de episodios y entradas confiere a la fuga su sensación característica de partida y regreso.',
          tryThisLabel: 'Observa La menor — una tonalidad habitual para entradas intermedias desde Do mayor',
        },
        {
          title: 'Stretto: Entradas Superpuestas del Sujeto',
          explanation:
            'El stretto ocurre cuando una nueva entrada del sujeto comienza antes de que la anterior haya terminado, creando presentaciones superpuestas que generan densidad contrapuntística e intensidad climática. Cuanto más estrecho el intervalo de stretto (más corto el espacio entre entradas), más técnicamente impresionante y dramáticamente poderoso es el pasaje. El stretto se reserva frecuentemente para la sección final de la fuga, intensificando el regreso a la tónica. No todos los sujetos de fuga se prestan al stretto — la posibilidad de superposición depende de las propiedades interválicas y rítmicas del sujeto.',
          tryThisLabel: 'Escucha el acorde disminuido — la tensión hacia la que las fugas construyen',
        },
        {
          title: 'Procedimientos Composicionales: Aumentación, Disminución, Inversión, Retrogradación',
          explanation:
            'La aumentación presenta el sujeto en valores de nota más largos, reduciendo efectivamente el tempo del tema a la mitad y confiriéndole gravedad y peso. La disminución usa valores más cortos, duplicando la velocidad y creando urgencia. La inversión melódica invierte todos los intervalos — el movimiento ascendente se vuelve descendente — transformando el contorno del sujeto pero preservando su perfil rítmico. La retrogradación presenta el sujeto de atrás hacia adelante, aunque esto es infrecuente en fugas (más común en la música serial). Estos procedimientos pueden combinarse: aumentación invertida, disminución retrógrada. El Arte de la Fuga de Bach demuestra virtualmente todas las combinaciones.',
          tryThisLabel: 'Toca la escala ascendente — después imagínala invertida, descendente',
        },
      ],
      tasks: [
        {
          instruction:
            'En una fuga de Bach que hayas estudiado, localiza el primer episodio tras la exposición. ¿Qué material motívico utiliza — fragmentos del sujeto, del contrasujeto, o ambos? ¿Modula? Si es así, ¿a qué tonalidad?',
        },
        {
          instruction:
            'Encuentra pasajes de stretto cerca del final de la fuga. ¿Con qué proximidad se superponen las entradas (cuántos tiempos de diferencia)? ¿El sujeto se superpone a sí mismo, a la respuesta, o a ambos?',
        },
        {
          instruction:
            'La fuga ¿utiliza aumentación, disminución o inversión del sujeto? Si es así, identifica el pasaje específico. Si no, escribe las primeras 4-5 notas del sujeto en inversión — invierte la dirección de cada intervalo.',
        },
      ],
    },

    // ── U25 M3: Canon ────────────────────────────────────────────────────────
    l8u25m3: {
      title: 'Canon y Otras Formas Imitativas',
      subtitle: 'Cánones a varios intervalos y tipos especiales',
      objectives: [
        'Comprender el canon a varios intervalos (unísono, octava, 5.ª, 4.ª, etc.)',
        'Reconocer tipos especiales de canon (inversión, retrogradación, aumentación/disminución)',
        'Distinguir entre canon estricto e imitación libre',
      ],
      concepts: [
        {
          title: 'Canon Estricto e Intervalos Canónicos',
          explanation:
            'En un canon estricto, una voz líder (dux) presenta una melodía y una voz seguidora (comes) la replica exactamente tras un retardo temporal fijo, transpuesta por algún intervalo. El canon al unísono repite en la misma altura; el canon a la octava desplaza una octava; el canon a la quinta transpone una quinta justa por encima. El desafío composicional es profundo: el líder debe generar una melodía que produzca contrapunto válido contra una copia de sí misma con retardo temporal. Cuanto más distante el intervalo canónico del unísono, más restringidas se vuelven las posibilidades melódicas.',
          tryThisLabel: 'Observa la escala — la materia prima melódica de un canon',
        },
        {
          title: 'Tipos Especiales de Canon y la Ronda',
          explanation:
            'El canon espejo (canon por inversión) invierte todos los intervalos en el seguidor — el movimiento ascendente en el dux se vuelve descendente en el comes. El canon cangrejo (retrógrado) reproduce la melodía del seguidor de atrás hacia adelante. El canon por aumentación duplica los valores de las notas en el seguidor; el canon por disminución los reduce a la mitad. Estos pueden combinarse — retrogradación invertida, por ejemplo. La ronda es el canon más simple: un canon perpetuo al unísono donde las voces entran a intervalos regulares y la melodía se repite indefinidamente. El ricercar, predecesor de la fuga, utiliza contrapunto imitativo de forma más libre, sin la estructura formal de exposición-episodio de la fuga.',
          tryThisLabel: 'Observa Do mayor — la tonalidad más sencilla para escritura canónica',
        },
        {
          title: 'Imitación Libre vs. Canon Estricto',
          explanation:
            'El canon estricto mantiene replicación interválica exacta a lo largo de toda la pieza; la imitación libre utiliza el sujeto como punto de partida pero permite desviaciones cuando la imitación estricta produciría contrapunto deficiente o disonancia. La mayoría de la polifonía renacentista y barroca utiliza imitación libre — los pasajes comienzan con entradas canónicas (llamadas «puntos de imitación») pero rápidamente divergen hacia contrapunto independiente. Comprender el espectro del canon estricto a la imitación libre ilumina virtualmente toda la música polifónica de Josquin a Bach.',
          tryThisLabel: 'Escucha el modo menor — habitual en la escritura imitativa renacentista',
        },
      ],
      tasks: [
        {
          instruction:
            'Toma una melodía sencilla de 4 compases que conozcas. Cántala o tócala, después imagínala entrando de nuevo un compás después en la misma altura. ¿Dónde surgirían disonancias? Esto revela por qué la escritura canónica es tan restrictiva.',
        },
        {
          instruction:
            'Escucha el canon de las Variaciones Goldberg de Bach (una de cada tres variaciones es un canon). Compara el Canon al Unísono (Var. 3), el Canon a la 2.ª (Var. 6) y el Canon a la 3.ª (Var. 9). ¿Cómo afecta el intervalo canónico al carácter?',
        },
        {
          instruction:
            'Escribe las primeras 4 notas de una melodía, después escríbelas en retrogradación (de atrás hacia adelante) y en inversión (invierte la dirección de cada intervalo). ¿Alguna de ellas podría servir de canon contra la original?',
        },
      ],
    },

    // ── U26 M1: Forma Sonata ─────────────────────────────────────────────────
    l8u26m1: {
      title: 'La Forma Sonata en Detalle',
      subtitle:
        'Exposición, desarrollo y reexposición con detalle seccional completo',
      objectives: [
        'Analizar la exposición en forma sonata: GTP, TR, cesura medial, GTS, CT',
        'Identificar técnicas de desarrollo: fragmentación, secuencia, falsa reexposición, retransición',
        'Comprender la resolución tonal de la reexposición y la coda expandida de Beethoven',
        'Reconocer la forma de concierto como una adaptación de la forma sonata con doble exposición',
      ],
      concepts: [
        {
          title: 'Forma Sonata: La Exposición',
          explanation:
            'La exposición contiene un grupo temático principal (GTP) en la tónica que establece carácter y tonalidad, una transición modulante (TR) que acumula energía y desplaza el centro tonal, una cesura medial (CM) — la pausa dramática que marca la llegada a la nueva tonalidad —, un grupo temático secundario (GTS) en la tonalidad secundaria (típicamente V en mayor, III en menor) con carácter contrastante, y material de cierre (CT) que reafirma la nueva tonalidad con potencialmente varias ideas conclusivas. El signo de repetición al final de la exposición es estructuralmente significativo: asegura que el oyente interiorice la polaridad tonal entre tónica y dominante antes de que el desarrollo la desmantle.',
          tryThisLabel: 'Observa la tonalidad de la tónica — la base de la forma sonata',
        },
        {
          title: 'Desarrollo y Reexposición',
          explanation:
            'El desarrollo fragmenta los temas en motivos, los dispone en secuencias por tonalidades remotas, puede escenificar una falsa reexposición (un regreso engañoso del GTP en la tonalidad equivocada) y construye una retransición sobre la dominante para preparar el regreso. La reexposición reintroduce todo el material en la tónica — crucialmente, el GTS aparece ahora en la tónica, resolviendo la tensión tonal de la exposición. La TR se modifica para evitar modular. Las codas de Beethoven funcionan frecuentemente como segundos desarrollos, extendiendo sustancialmente la forma con nuevo trabajo temático y clímax dramáticos.',
          tryThisLabel: 'Escucha el acorde de séptima de dominante — el acorde que impulsa la reexposición',
        },
        {
          title: 'Forma de Concierto: Doble Exposición',
          explanation:
            'La forma de concierto adapta los principios de la sonata con una doble exposición: la exposición orquestal presenta ambos temas en la tónica, después la exposición del solista reintroduce el primer tema en la tónica y el segundo en la dominante, siguiendo la lógica tonal estándar de la sonata. El desarrollo presenta diálogo solista-orquesta. La reexposición resuelve ambos temas en la tónica. La cadencia — el pasaje virtuosístico no acompañado del solista — precede típicamente la coda final, originalmente improvisada pero cada vez más escrita a partir de Beethoven.',
          tryThisLabel: 'Observa las relaciones de tonalidad que recorren las formas sonata',
        },
      ],
      tasks: [
        {
          instruction:
            'Elige un movimiento de sonata del periodo clásico (p. ej., Mozart K.545, primer movimiento). Crea una línea temporal formal: identifica el GTP, TR, cesura medial, GTS, CT, desarrollo y reexposición. ¿En qué compás aparece el GTS en la tónica durante la reexposición?',
        },
        {
          instruction:
            'En la sección de desarrollo, identifica al menos dos técnicas de desarrollo: fragmentación, secuencia, pedal o falsa reexposición. ¿Por qué tonalidades pasa el desarrollo antes de la retransición?',
        },
        {
          instruction:
            'Compara la transición (TR) en la exposición con la de la reexposición. ¿Cómo se modifica la TR de la reexposición para mantener el GTS en la tónica? ¿El compositor simplemente suprime la modulación o recompone el pasaje?',
        },
      ],
    },

    // ── U26 M2: Variaciones, Rondó y Ritornello ─────────────────────────────
    l8u26m2: {
      title: 'Variaciones, Rondó y Ritornello',
      subtitle:
        'Tema y variaciones, chacona, passacaglia, rondó y ritornello',
      objectives: [
        'Distinguir tema y variaciones seccionales de formas de variación continua',
        'Analizar la chacona (patrón armónico repetido) y la passacaglia (bajo ostinato)',
        'Identificar formas de rondó (5 partes, 7 partes) e híbridos sonata-rondó',
        'Comprender la forma de ritornello barroca y su relación con el rondó',
      ],
      concepts: [
        {
          title: 'Tema y Variaciones, Chacona y Passacaglia',
          explanation:
            'Las formas de variación incluyen el tema y variaciones seccional (cada variación es autónoma, separada por cadencias claras), la chacona (variaciones continuas sobre un patrón armónico repetido, típicamente de 4 u 8 compases) y la passacaglia (variaciones continuas sobre una línea de bajo repetida — el bajo ostinato). La distinción entre chacona y passacaglia es históricamente ambigua, pero el bajo ostinato es la característica definitoria de la passacaglia. En todas las formas de variación, el arte composicional reside en transformar melodía, ritmo, textura y registro manteniendo una conexión audible con el tema o patrón.',
          tryThisLabel: 'Escucha La menor — tonalidad habitual para chaconas y passacaglias',
        },
        {
          title: 'Formas de Rondó: Cinco Partes, Siete Partes y Sonata-Rondó',
          explanation:
            'La forma de rondó presenta un estribillo recurrente (A) alternando con episodios contrastantes: rondó de cinco partes (A-B-A-C-A), de siete partes (A-B-A-C-A-B-A o A-B-A-C-A-D-A). El estribillo regresa típicamente en la tónica cada vez, proporcionando estabilidad estructural. El sonata-rondó hibrida ambas formas — A-B-A-desarrollo-A-B-A — combinando la claridad estructural del rondó con la ambición desarrollística de la sonata. La sección B regresa en la tónica durante la segunda mitad, reflejando la resolución tonal de la forma sonata. Este híbrido domina los finales del periodo clásico.',
          tryThisLabel: 'Observa Do mayor — la tónica que cada estribillo de rondó reafirma',
        },
        {
          title: 'Forma de Ritornello',
          explanation:
            'La forma de ritornello barroca alterna un pasaje orquestal recurrente (el ritornello) con episodios solistas. El ritornello completo aparece en la tónica al inicio y al final; fragmentos de él reaparecen en tonalidades diferentes entre los episodios solistas, creando un recorrido tonal. Conceptualmente similar al rondó pero más fluida — el ritornello rara vez se reexpone completo en el medio, y los episodios solistas son más improvisatorios. Los conciertos de Vivaldi epitomizan la forma: ritornello de apertura enérgico, pasajes solistas virtuosísticos, fragmentos del ritornello en tonalidades vecinas, regreso completo del ritornello al final.',
          tryThisLabel: 'Observa las relaciones de tonalidad que recorre el ritornello',
        },
      ],
      tasks: [
        {
          instruction:
            'Compara una chacona (p. ej., Chacona en Re menor de Bach para violín solo) con un tema y variaciones (p. ej., Variaciones «Diabelli» de Beethoven). ¿Cómo cambia la experiencia de escucha la estructura continua frente a la seccional?',
        },
        {
          instruction:
            'Escucha un finale en sonata-rondó (p. ej., Sonata «Patética» de Beethoven, tercer movimiento). Identifica cada regreso del estribillo (A) y etiqueta los episodios. ¿Dónde ocurre la sección de «desarrollo» dentro de la estructura del rondó?',
        },
        {
          instruction:
            'Escucha un primer movimiento de concierto de Vivaldi (p. ej., «La Primavera» de Las Cuatro Estaciones). Traza los regresos del ritornello: ¿en qué tonalidad está cada fragmento? ¿Cuánto del ritornello original se reexpone cada vez?',
        },
      ],
    },

    // ── U26 M3: Orquestación ─────────────────────────────────────────────────
    l8u26m3: {
      title: 'Orquestación y Conciencia de Instrumentación',
      subtitle:
        'Familias orquestales, extensiones, timbres y transposición',
      objectives: [
        'Conocer las cuatro familias orquestales y sus características',
        'Identificar extensiones y timbres de los instrumentos',
        'Comprender los instrumentos transpositores en contexto orquestal',
      ],
      concepts: [
        {
          title: 'Las Cuatro Familias Orquestales',
          explanation:
            'Las cuerdas (violín, viola, violonchelo, contrabajo) forman la columna vertebral de la orquesta — sostienen, articulan y abarcan el rango dinámico más amplio a través de técnicas como pizzicato, trémolo, armónicos y col legno. Las maderas (flauta, oboe, clarinete, fagot y sus auxiliares) aportan colores tímbricos distintos y destacan en la escritura melódica. Los metales (trompa, trompeta, trombón, tuba) confieren potencia y brillo, dominando los clímax. La percusión se divide en afinada (timbales, xilófono, glockenspiel, vibráfono, marimba, celesta) y no afinada (caja, bombo, platillos, triángulo), proporcionando definición rítmica, color y puntuación estructural.',
          tryThisLabel: 'Observa la extensión — las cuerdas abarcan casi todo este teclado',
        },
        {
          title: 'Instrumentos Transpositores y Lectura de Partitura',
          explanation:
            'Un instrumento transpositor suena una altura diferente del Do escrito. El clarinete en Sib suena una segunda mayor por debajo de lo escrito; la trompa en Fa suena una quinta justa por debajo; la trompeta en Sib suena una segunda mayor por debajo. Para leer una partitura transpositora a la altura real (de concierto), se invierte la transposición: para un clarinete en Sib, se transpone la parte escrita una segunda mayor hacia abajo (o se lee una segunda abajo). Orden estándar de la partitura orquestal de arriba abajo: flautas, oboes, clarinetes, fagotes, trompas, trompetas, trombones, tuba, timbales, percusión, arpa, violines I y II, violas, violonchelos, contrabajos.',
          tryThisLabel: 'Observa Sib — la altura de concierto cuando un clarinete en Sib lee Do',
        },
        {
          title: 'Textura Orquestal y Doblajes',
          explanation:
            'La orquestación es el arte de distribuir ideas musicales por el conjunto para lograr el máximo efecto. El doblaje a la octava (p. ej., flauta y violín a una octava de distancia) engrosa una melodía sin alterar su carácter. El doblaje al unísono (p. ej., oboe y violín en la misma altura) fusiona timbres para crear un color compuesto indisponible en cualquier instrumento aislado. La escritura por coros asigna un acorde completo a una familia (un coral de metales o un coro de maderas). La elección de qué instrumento conduce la melodía, cuál aporta relleno armónico y cuál proporciona energía rítmica define el carácter de cada pasaje orquestal.',
          tryThisLabel: 'Observa Fa mayor — la tonalidad de concierto de una trompa leyendo en Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Examina una página de partitura orquestal (p. ej., Sinfonía n.º 5 de Beethoven, primera página). Identifica el orden de la partitura — ¿qué instrumentos están arriba, cuáles abajo? ¿Cuáles son transpositores?',
        },
        {
          instruction:
            'Un clarinete en Sib toca un Re escrito. ¿Qué altura suena a altura de concierto? (Respuesta: Do — una 2.ª mayor por debajo.) Ahora: una trompa en Fa toca un Sol escrito. ¿Qué altura de concierto suena? (Respuesta: Do — una 5.ª justa por debajo.)',
        },
        {
          instruction:
            'Escucha el inicio del «Bolero» de Ravel. Cada repetición del tema usa un instrumento o combinación diferente. Enumera los cambios tímbricos a lo largo de las primeras cinco presentaciones. ¿Cómo usa Ravel los doblajes para construir intensidad?',
        },
      ],
    },

    // ── U27 M1: Conjuntos de Clases de Altura ───────────────────────────────
    l8u27m1: {
      title: 'Conjuntos de Clases de Altura y Teoría de Conjuntos',
      subtitle:
        'Clase de altura, clase de intervalo, forma normal, forma prima, VIC y números de Forte',
      objectives: [
        'Comprender la clase de altura y el sistema de notación por enteros (0-11)',
        'Calcular la clase de intervalo (CI) y el vector interválico (VIC)',
        'Encontrar la forma normal y la forma prima de conjuntos de clases de altura',
        'Identificar conjuntos por los números del catálogo de Forte',
      ],
      concepts: [
        {
          title: 'Clase de Altura, Notación por Enteros y Clase de Intervalo',
          explanation:
            'La teoría postonal colapsa todas las alturas equivalentes por octava en 12 clases de altura numeradas de 0 a 11 (C=0, C#/Db=1, D=2, ... B=11). Las grafías enarmónicas se vuelven irrelevantes — F# y Gb son ambos la clase de altura 6. La clase de intervalo (CI) mide la menor distancia entre dos clases de altura en el reloj módulo 12: el intervalo entre CA 0 y CA 4 es CI 4 (no 8, porque tomamos el complemento menor). Los valores de CI van de 1 a 6, ya que cualquier intervalo mayor que 6 semitonos tiene un complemento menor. Esta eliminación de octava, grafía y distinciones direccionales revela el esqueleto interválico abstracto de cualquier sonoridad.',
          tryThisLabel: 'Observa las 12 clases de altura dispuestas cromáticamente',
        },
        {
          title: 'Conjuntos de Clases de Altura: Forma Normal y Forma Prima',
          explanation:
            'Un conjunto de clases de altura es una colección no ordenada de clases de altura distintas — el equivalente postonal de un acorde. La forma normal es la disposición ascendente más compacta: se rota el conjunto hasta que la extensión del primer al último elemento sea la menor (usando compactación a la izquierda para desempatar). La forma prima transpone la forma normal para comenzar en 0, después compara con la inversión para seleccionar la más compactada a la izquierda. La forma prima es la etiqueta canónica: {C, E, G} y {D, F, A} ambos se reducen a la forma prima [0, 3, 7]. El catálogo de Allen Forte asigna a cada forma prima un número — 3-11 para [0, 3, 7] — creando un sistema universal de clasificación para sonoridades postonales. Existen dos convenciones de compactación — la de Forte, «compactado a la izquierda» (usada aquí), y la de Rahn, «compactado desde la derecha» — y discrepan en un puñado de clases de conjuntos (ninguna usada en este nivel).',
          tryThisLabel: 'Observa Do menor — conjunto de Forte 3-11, forma prima [0,3,7]',
        },
        {
          title: 'Vector Interválico y Relaciones-Z',
          explanation:
            'El vector interválico (VIC) es una huella de seis dígitos que cuenta cada CI presente en un conjunto. Para [0, 4, 7] (tríada mayor), el VIC es <0,0,1,1,1,0>: un CI3, un CI4, un CI5. Dos conjuntos con VIC idénticos pero formas primas diferentes son Z-relacionados — estructuralmente distintos, pero compartiendo exactamente el mismo contenido interválico. Los pares Z-relacionados son relativamente infrecuentes en el catálogo y constituyen una curiosidad central de la teoría de conjuntos. El VIC proporciona una forma eficiente de comparar el carácter sonoro de los conjuntos: conjuntos con VIC similares comparten «color» armónico aun cuando su contenido de clases de altura difiera por completo.',
          tryThisLabel: 'Observa la tríada mayor — VIC <0,0,1,1,1,0>',
        },
      ],
      tasks: [
        {
          instruction:
            'Convierte las siguientes notas en enteros de clase de altura: E, Bb, F#, C. (Respuestas: 4, 10, 6, 0.) Ahora encuentra la clase de intervalo entre cada par adyacente. ¿Cuál es la CI entre 4 y 10? (Respuesta: 6 — el tritono.)',
        },
        {
          instruction:
            'Toma el conjunto {C, Db, E} = {0, 1, 4}. Encuentra la forma normal probando todas las rotaciones: [0,1,4] (extensión 4), [1,4,0]=[1,4,12] (extensión 11), [4,0,1]=[4,12,13] (extensión 9). La forma normal es [0,1,4]. ¿Es también la forma prima? Compara con la inversión: [0,11,8] normalizado a [0,3,4] — ¿cuál está más compactado a la izquierda?',
        },
        {
          instruction:
            'Calcula el vector interválico para el conjunto [0, 1, 4]: pares (0,1)=CI1, (0,4)=CI4, (1,4)=CI3. VIC = <1,0,1,1,0,0>. Ahora haz lo mismo para [0, 3, 4] y verifica que obtienes el VIC idéntico. Esto es esperable — [0,3,4] es la inversión de [0,1,4], por lo que pertenecen a la misma clase de conjuntos (3-3). La relación-Z se da cuando dos conjuntos comparten un vector interválico sin estar relacionados por transposición o inversión; el par Z verdadero más pequeño es 4-Z15 [0,1,4,6] y 4-Z29 [0,1,3,7].',
        },
      ],
    },

    // ── U27 M2: Técnica Dodecafónica ─────────────────────────────────────────
    l8u27m2: {
      title: 'Técnica Dodecafónica',
      subtitle:
        'Series, formas P/R/I/RI, la matriz dodecafónica y combinatorialidad',
      objectives: [
        'Construir una serie dodecafónica usando las 12 clases de altura exactamente una vez',
        'Derivar las cuatro formas de la serie: Original (P), Retrógrada (R), Inversión (I), Retrógrada-Inversión (RI)',
        'Construir y leer una matriz 12×12 dodecafónica',
        'Comprender la combinatorialidad y la complementación hexacordal del agregado',
      ],
      concepts: [
        {
          title: 'La Serie y Sus Cuatro Formas',
          explanation:
            'En la composición dodecafónica (serial), las 12 clases de altura se ordenan en una secuencia específica — la serie. Esta serie es la materia prima de toda la composición: melodía, armonía y contrapunto derivan de ella. La serie se manipula mediante cuatro transformaciones: Original (P) — la serie original; Retrógrada (R) — la serie tocada de atrás hacia adelante; Inversión (I) — cada intervalo invertido, lo ascendente se vuelve descendente; Retrógrada-Inversión (RI) — la inversión tocada de atrás hacia adelante. Estas cuatro operaciones preservan el ADN interválico de la serie mientras generan formas melódicas máximamente diversas.',
          tryThisLabel: 'Observa las 12 clases de altura — la materia prima de una serie',
        },
        {
          title: 'La Matriz Dodecafónica',
          explanation:
            'Cada una de las cuatro formas de la serie puede transponerse para comenzar en cualquiera de las 12 clases de altura, produciendo 48 formas en total (P0-P11, R0-R11, I0-I11, RI0-RI11). Estas se organizan en una matriz 12×12: las formas P se leen de izquierda a derecha, las formas R de derecha a izquierda, las formas I de arriba abajo y las formas RI de abajo arriba. La matriz es el conjunto de herramientas completo del compositor — cada derivación serial posible de la serie está visible de un vistazo. Webern favorecía series con alta simetría interna, donde algunas formas son idénticas a otras, reduciendo efectivamente las 48 a menos series distintas.',
          tryThisLabel: 'Observa 7 de las 12 clases de altura — una serie usa las 12',
        },
        {
          title: 'Combinatorialidad y Complementación Hexacordal',
          explanation:
            'La combinatorialidad es una propiedad de la serie en la que el primer hexacordo (primeras 6 notas) de una forma y el primer hexacordo de otra forma específica juntos producen las 12 clases de altura — un agregado. Esto asegura completitud armónica cuando dos formas suenan simultáneamente, evitando duplicación de clases de altura. Las series totalmente combinatoriales (como las de Babbitt) alcanzan complementación de agregado bajo relaciones P, I, R y RI. Las obras tardías de Schoenberg exploran la combinatorialidad para controlar la dimensión vertical (armónica) de la música serial, no solo la horizontal (melódica).',
          tryThisLabel: 'Escucha un acorde simétrico — las series privilegian la simetría',
        },
      ],
      tasks: [
        {
          instruction:
            'Crea tu propia serie dodecafónica ordenando todos los enteros de 0 a 11 sin repetición. Escribe tu P0. Ahora deriva R0 (invierte el orden), I0 (resta cada elemento a 12, módulo 12) y RI0 (invierte la inversión).',
        },
        {
          instruction:
            'Usando tu P0, construye las dos primeras filas de una matriz dodecafónica. La fila 1 es el propio P0. La fila 2 comienza en la segunda clase de altura de I0: transpone P para comenzar en esa clase de altura (suma una constante módulo 12 a cada elemento de P0). Verifica que la columna 1 se lee como la forma I0 de arriba abajo.',
        },
        {
          instruction:
            'Verifica si tu serie posee combinatorialidad: enumera las primeras 6 clases de altura de P0. Ahora enumera las primeras 6 clases de altura de I5 (u otra inversión). ¿Los dos hexacordos juntos contienen las 12 clases de altura sin duplicaciones? Si no, prueba una transposición diferente de I.',
        },
      ],
    },

    // ── U27 M3: Técnicas del Siglo XX ────────────────────────────────────────
    l8u27m3: {
      title: 'Técnicas del Siglo XX: Planing, Politonalidad, Pandiatonicismo',
      subtitle:
        'Armonía cuartal, movimiento paralelo, bitonalidad y diatonicismo libre',
      objectives: [
        'Identificar la armonía cuartal/quintal como un lenguaje armónico completo',
        'Distinguir planing cromático de planing diatónico',
        'Reconocer politonalidad, polimodalidad y pandiatonicismo en contexto',
      ],
      concepts: [
        {
          title: 'Armonía Cuartal/Quintal y Planing',
          explanation:
            'La armonía cuartal construye acordes a partir de cuartas justas apiladas en lugar de terceras, produciendo sonoridades que no son mayores ni menores — abiertas, ambiguas y características de Hindemith, Bartók y Copland. La armonía quintal usa quintas apiladas (inversamente equivalentes a cuartas). El planing mueve una estructura de acorde entera en paralelo: el planing cromático transpone cada nota por el mismo número de semitonos (preservando la cualidad exacta del acorde), mientras el planing diatónico se mueve dentro de una escala (alterando la cualidad para ajustarse a la tonalidad). Los acordes de novena paralelos de Debussy y las tríadas paralelas de Ravel ejemplifican el planing como técnica armónica estructural, no meramente un recurso colorístico.',
          tryThisLabel: 'Escucha la escala de tonos enteros — territorio simétrico puro para planing',
        },
        {
          title: 'Politonalidad, Polimodalidad y Pandiatonicismo',
          explanation:
            'La politonalidad superpone dos o más tonalidades simultáneamente — la bitonalidad de Milhaud puede colocar Do mayor en la mano derecha contra Fa# mayor en la izquierda, creando una sonoridad densa y centelleante que no es tonal ni atonal. La polimodalidad superpone modos diferentes sobre la misma tónica: Do Lidio en la melodía con Do Mixolidio en el acompañamiento produce las siete alturas diatónicas pero con inflexiones modales conflictivas entre las voces. El pandiatonicismo usa todas las notas de una escala diatónica libremente, descartando las reglas de armonía funcional — cualquier combinación es válida, produciendo música que suena tonal pero resiste la resolución. Las obras neoclásicas de Stravinsky epitomizan esta técnica.',
          tryThisLabel: 'Escucha Do aumentado — la tríada de tonos enteros, sin centro tonal',
        },
        {
          title: 'Microtonalidad y Conciencia Espectral',
          explanation:
            'La microtonalidad extiende el continuo de alturas más allá de las 12 divisiones iguales: los cuartos de tono dividen cada semitono a la mitad (24 notas por octava), la afinación justa afina los intervalos según razones de frecuencia puras, y la afinación espectral deriva intervalos de la serie de armónicos. Temperamentos iguales alternativos — 19-TET, 31-TET, 53-TET — ofrecen distintos compromisos entre consonancia y flexibilidad. Aunque el motor de esta aplicación opera en 12-TET estándar, la conciencia de los sistemas microtonales revela que la escala cromática de 12 notas es una convención histórica, no una inevitabilidad acústica.',
          tryThisLabel: 'Escucha la escala cromática 12-TET — una de muchas divisiones posibles',
        },
      ],
      tasks: [
        {
          instruction:
            'Construye un acorde cuartal sobre C: apila cuartas (C-F-Bb-Eb). Compara su sonido con una tríada de C mayor. El acorde cuartal no tiene cualidad mayor ni menor clara — describe su carácter con tus propias palabras.',
        },
        {
          instruction:
            'Toca una escala de tonos enteros desde C, después una escala disminuida (octatónica) desde C. Ambas son simétricas — la escala de tonos enteros divide la octava en 6 pasos iguales, la octatónica alterna tonos y semitonos. Ninguna tiene dominante ni sensible. ¿Cómo afecta esto a la sensación de gravedad tonal?',
        },
        {
          instruction:
            'Imagina tocar una tríada de C mayor en la mano derecha y una tríada de F# mayor en la izquierda simultáneamente. Enumera las seis clases de altura que sonarían. ¿Hay alguna superposición? ¿Cuál es el número total de clases de altura distintas? (Este es el famoso acorde bitonal de Petrushka.)',
        },
      ],
    },

    // ── U27 M4: Minimalismo y Aleatoriedad ───────────────────────────────────
    l8u27m4: {
      title: 'Minimalismo, Aleatoriedad y Técnicas Expandidas',
      subtitle:
        'Desfase, proceso aditivo, música aleatoria y nuevos recursos sonoros',
      objectives: [
        'Comprender procesos composicionales minimalistas: desfase, proceso aditivo, evolución basada en pulso',
        'Distinguir las operaciones aleatorias de Cage de la aleatoriedad controlada de Lutosławski',
        'Reconocer técnicas expandidas: piano preparado, multifónicos, sprechstimme',
        'Tener conciencia de forma móvil y notación indeterminada',
      ],
      concepts: [
        {
          title: 'Minimalismo: Desfase y Proceso Aditivo',
          explanation:
            'El minimalismo emplea estructuras repetitivas que evolucionan gradualmente. El desfase (phase shifting) de Steve Reich comienza con dos patrones idénticos en sincronía perfecta, después empuja uno ligeramente hacia adelante — los patrones de interferencia resultantes crean relaciones rítmicas y melódicas en constante cambio hasta que las dos partes eventualmente se realinean. El proceso aditivo de Philip Glass expande patrones añadiendo notas incrementalmente: una célula de 4 notas se convierte en 5, después 6, después 8, construyendo complejidad a partir del material inicial más simple posible. El minimalismo basado en pulso (La Monte Young, Terry Riley) sostiene un pulso rítmico constante mientras la armonía evoluciona lentamente a lo largo de grandes periodos de tiempo, transformando la percepción del tiempo por parte del oyente.',
          tryThisLabel: 'Toca un patrón repetitivo con estas notas — la materia prima del minimalismo',
        },
        {
          title: 'Aleatoriedad y Música de Azar',
          explanation:
            'La aleatoriedad (música de azar) introduce indeterminación en la composición o en la interpretación. John Cage usó operaciones del I Ching, lanzamientos de monedas y mapas estelares para determinar alturas, duraciones y dinámicas — eliminando por completo las decisiones subjetivas del compositor. Witold Lutosławski desarrolló la aleatoriedad controlada: los intérpretes eligen libremente dentro de límites definidos (contenido de alturas fijo, ritmo libre), creando pasajes de caos controlado. La forma móvil (Klavierstück XI de Stockhausen, Tercera Sonata para Piano de Boulez) permite a los intérpretes tocar secciones en cualquier orden, de modo que cada interpretación crea una trayectoria formal única. Estos enfoques cuestionaron la propia definición de «obra» musical.',
          tryThisLabel: 'Observa las 12 clases de altura — la aleatoriedad recurre al espectro completo',
        },
        {
          title: 'Técnicas Expandidas',
          explanation:
            'Las técnicas expandidas transforman los instrumentos más allá de su paleta sonora convencional. El piano preparado (John Cage) coloca tornillos, tuercas, gomas y fieltros entre las cuerdas, convirtiendo el piano en un conjunto de percusión para un solo intérprete con timbres imprevisibles. Los multifónicos extraen varias alturas simultáneas de un único instrumento de viento mediante digitaciones y embocaduras especializadas. El sul ponticello (arco cerca del puente) y el col legno (golpear con la madera del arco) alteran radicalmente el timbre de las cuerdas. El sprechstimme (emisión vocal medio cantada, medio hablada, desarrollada por Schoenberg) habita el territorio entre el habla y el canto. Estas técnicas redefinieron lo que constituye material musical en sí.',
          tryThisLabel: 'Escucha la escala octatónica — recurso de Bartók y Stravinsky',
        },
      ],
      tasks: [
        {
          instruction:
            'Da palmas con un patrón rítmico sencillo de 4 notas en ciclo continuo. Ahora imagina a una segunda persona dando palmas con el mismo patrón, pero acelerando gradualmente una cantidad ínfima. ¿Qué ocurre con el ritmo compuesto a lo largo de 30 segundos? Esto es el desfase.',
        },
        {
          instruction:
            'Diseña una célula melódica de 3 notas (p. ej., C-E-G). Ahora aplica el proceso aditivo: toca C-E (2 notas), después C-E-G (3 notas), después C-E-G-E (4 notas), después C-E-G-E-C (5 notas). ¿Cómo cambia el carácter del patrón a medida que crece?',
        },
        {
          instruction:
            'Escribe 4 fragmentos musicales cortos (2-4 notas cada uno) en tarjetas separadas. Baraja las tarjetas y tócalos en el orden en que aparezcan. Repite con otra baraja. ¿Cómo cambia la forma? Esta es una forma móvil simplificada.',
        },
      ],
    },

    // ── U27 M5: Ritmo Avanzado ───────────────────────────────────────────────
    l8u27m5: {
      title: 'Ritmo Avanzado: Polirritmia, Hemiola, Modulación Métrica',
      subtitle:
        'Grupos de valoración especial complejos, ritmos cruzados, polirritmia y modulación métrica',
      objectives: [
        'Ejecutar y escuchar grupos de valoración especial complejos y ritmos cruzados',
        'Comprender polirritmia vs. polimetría',
        'Reconocer hemiola y modulación métrica',
      ],
      concepts: [
        {
          title: 'Grupos de Valoración Especial Complejos y Ritmos Cruzados',
          explanation:
            'Más allá de los tresillos simples, los grupos de valoración especial complejos subdividen los tiempos en quintillos (5 en el espacio de 4), septillos (7:4 o 7:6) y grupos anidados (tresillos dentro de tresillos, produciendo 9 subdivisiones). Los ritmos cruzados superponen agrupaciones diferentes simultáneamente: 3 contra 2 (tres notas iguales en una voz contra dos en otra), 4 contra 3, o 5 contra 4. La percepción clave es que los ritmos cruzados crean disonancia rítmica análoga a la disonancia armónica — los pulsos en conflicto generan tensión que se resuelve cuando se realinean en un tiempo fuerte compartido. Este principio subyace en gran parte del rubato de Chopin, la complejidad rítmica de Brahms y virtualmente toda la percusión del África subsahariana.',
          tryThisLabel: 'Toca la escala — prueba a agrupar las notas de 3 en 3 y después de 2 en 2',
        },
        {
          title: 'Polirritmia vs. Polimetría y Hemiola',
          explanation:
            'Polirritmia y polimetría se confunden con frecuencia pero son estructuralmente distintas. La polirritmia superpone diferentes agrupaciones rítmicas dentro de un metro compartido — los tiempos fuertes siguen alineándose (3 contra 2 dentro de un compás de 6/8). La polimetría superpone metros diferentes simultáneamente — una voz en 3/4 contra otra en 4/4 — de modo que los tiempos fuertes divergen y solo se realinean en el mínimo común múltiplo (cada 12 tiempos). La hemiola es un ritmo cruzado específico e históricamente ubicuo: dos compases de metro ternario (3+3) reinterpretados como tres grupos binarios (2+2+2), o viceversa en tiempo compuesto. La hemiola impregna a Händel, Brahms y la música latinoamericana, creando una ambigüedad métrica momentánea que energiza pasajes cadenciales y de transición.',
          tryThisLabel: 'Toca en grupos de 2, después de 3 — siente el ritmo cruzado',
        },
        {
          title: 'Modulación Métrica y Ritmo Aditivo',
          explanation:
            'La modulación métrica (técnica emblema de Elliott Carter) usa un valor rítmico compartido como pivote entre tempos con precisión matemática. Si las corcheas de tresillo en el tempo antiguo se convierten en corcheas regulares en el nuevo tempo, el nuevo tempo es exactamente 3/2 del antiguo. Modulaciones basadas en quintillos producen razones 5:4; la técnica se encadena para recorrer múltiples tempos. Los ritmos aditivos construyen patrones a partir de agrupaciones desiguales — 2+2+3, 3+2+2+3 — produciendo metros asimétricos centrales en la música balcánica (aksak), en Bartók, Stravinsky y el rock progresivo. Los compases irracionales (p. ej., 4/3, 5/6) extienden esta lógica aún más, especificando relaciones de tempo en lugar de divisiones tradicionales de pulso.',
          tryThisLabel: 'Toca el modo Dórico — prueba a acentuar cada 5.ª nota',
        },
      ],
      tasks: [
        {
          instruction:
            'Da palmas con un pulso constante de 4 tiempos. Ahora intenta encajar 3 palmas uniformemente espaciadas en el mismo intervalo con la otra mano. ¿Dónde coinciden las manos? (Solo en el tiempo 1.) Este es el ritmo cruzado fundamental de 3 contra 2 — la base de toda la complejidad polirrítmica.',
        },
        {
          instruction:
            'Toma un pasaje en compás 3/4 y cuenta 6 tiempos a lo largo de dos compases (1-2-3-1-2-3). Ahora reagrupa esos mismos 6 tiempos como 2+2+2. La melodía que estaba en metro ternario ahora se percibe en binario — has creado una hemiola. ¿Dónde aparece esto en la música que conoces?',
        },
        {
          instruction:
            'Calcula una modulación métrica: si el tempo actual es negra = 120 BPM y las corcheas de tresillo se convierten en la nueva corchea, ¿cuál es el nuevo tempo? (La corchea de tresillo = 1/3 de una negra = 360 por minuto. Como nueva corchea, dos de ellas = una nueva negra, por tanto la nueva negra = 180 BPM. Razón: 3:2.)',
        },
      ],
    },
  },
};

export default curriculumL8;
