import type { CurriculumLevelOverlay } from '../types';

const curriculumL4: CurriculumLevelOverlay = {
  // ─── Unidades ─────────────────────────────────────────────────────────────
  units: {
    u12: {
      title: 'Notas Extrañas al Acorde y Séptima de Dominante',
      description:
        'Retardos, apoyaturas, pedal, reglas de resolución de la séptima de dominante e inversiones de V7',
    },
    u13: {
      title: 'Acordes de Séptima Diatónicos, Función y Secuencias',
      description:
        'Séptimas predominantes, mediante y sensible, teoría de la función armónica y secuencias armónicas',
    },
    u14: {
      title: 'Contrapunto, Compás, Análisis y Armonía Menor',
      description:
        'Contrapunto a dos voces, compases asimétricos, ornamentación cromática, análisis con números romanos y sistema de acordes en modo menor',
    },
  },

  // ─── Módulos ──────────────────────────────────────────────────────────────
  modules: {
    // ── U12 M1: Suspensions ──────────────────────────────────────────────────
    l4u12m1: {
      title: 'Retardos',
      subtitle: 'Los tipos de retardo 4-3, 7-6, 9-8 y 2-3',
      objectives: [
        'Comprender el patrón de retardo en tres fases: preparación, disonancia, resolución',
        'Identificar los cuatro tipos de retardo por sus intervalos sobre el bajo',
        'Reconocer el retardo de bajo 2-3 como el único retardo que resuelve hacia arriba',
      ],
      concepts: [
        {
          title: 'El Mecanismo del Retardo',
          explanation:
            'Un retardo es una nota retenida (ligada) del acorde anterior al nuevo acorde, creando una disonancia que resuelve por grado conjunto descendente. Tiene tres fases: preparación (nota consonante en el acorde anterior), retardo (la misma nota mantenida sobre el nuevo acorde, ahora disonante, en un tiempo fuerte) y resolución (la nota retenida desciende por grado conjunto hasta una nota consonante del acorde). La disonancia en el tiempo fuerte es lo que confiere a los retardos su poder expresivo — el oyente espera consonancia y recibe tensión.',
          tryThisLabel: 'Escucha la nota consonante de resolución',
        },
        {
          title: 'Tipos de Retardo: 4-3, 7-6, 9-8',
          explanation:
            'Los retardos se nombran según los intervalos que forman sobre el bajo en el momento de la disonancia y la resolución. El retardo 4-3 es el más frecuente: una 4.ª sobre el bajo resuelve a una 3.ª. El retardo 7-6 retiene una 7.ª que resuelve a una 6.ª — habitual en secuencias y cadenas de retardos. El retardo 9-8 retiene una 9.ª (o 2.ª una octava más arriba) que resuelve a una octava. Los tres resuelven por grado conjunto descendente.',
          tryThisLabel: 'Imagina mantener C sobre este acorde (ret. 4-3)',
        },
        {
          title: 'El Retardo de Bajo 2-3',
          explanation:
            'El retardo 2-3 es único: se produce en la voz del bajo en lugar de en una voz superior, y resuelve hacia arriba. La nota del bajo es retenida del acorde anterior, formando una 2.ª contra una voz superior, y luego resuelve por grado conjunto ascendente a una 3.ª. Es el único retardo estándar que resuelve hacia arriba. Algunos teóricos lo describen como un «retardo de bajo» para distinguirlo de los tipos en voces superiores.',
          tryThisLabel: 'El C en el bajo puede suspenderse hacia un acorde de D',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C major chord" e imagina mantener la nota F mientras el acorde suena — el F es una 4.ª disonante sobre el bajo que quiere resolver por grado conjunto descendente a E (un patrón de retardo 4-3)',
        },
        {
          instruction:
            'En un retardo 7-6, una 7.ª sobre el bajo resuelve a una 6.ª. Imagina la nota B retenida sobre un bajo C: B es una 7.ª y resuelve descendiendo a A (una 6.ª sobre C). Esto crea una disonancia más suave que la 4-3',
        },
        {
          instruction:
            'Compara los tres tipos de retardo en voces superiores: 4-3 (el más común, disonancia fuerte), 7-6 (moderada, frecuentemente encadenada en secuencias), 9-8 (espaciado amplio, resolución en octava). Todos comparten el mismo mecanismo de preparación-disonancia-resolución',
        },
      ],
    },

    // ── U12 M2: Appoggiatura, Escape Tone, Retardation ─────────────────────
    l4u12m2: {
      title: 'Apoyatura, Escapatoria y Anticipación Ascendente',
      subtitle:
        'Notas extrañas acentuadas y no acentuadas, abordadas por salto o resueltas hacia arriba',
      objectives: [
        'Identificar la apoyatura por su aproximación por salto y resolución por grado conjunto en un tiempo fuerte',
        'Reconocer la escapatoria como la imagen inversa: aproximación por grado conjunto, salida por salto',
        'Comprender la anticipación ascendente como un retardo que resuelve hacia arriba en vez de hacia abajo',
      ],
      concepts: [
        {
          title: 'La Apoyatura',
          explanation:
            'La apoyatura se aborda por salto y se resuelve por grado conjunto en la dirección opuesta, cayendo en un tiempo fuerte. La palabra significa «nota de apoyo» — se apoya con fuerza en su resolución, creando una disonancia acentuada y dramática, más llamativa que una nota de paso porque el salto la hace inesperada. El salto crea sorpresa y la resolución por grado conjunto proporciona el alivio esperado. Las apoyaturas son un sello de la melodía expresiva de la era Romántica.',
          tryThisLabel: 'Escucha el movimiento por grado conjunto que las apoyaturas adornan',
        },
        {
          title: 'La Escapatoria',
          explanation:
            'La escapatoria (échappée) es la imagen inversa de la apoyatura: se aborda por grado conjunto y se abandona por salto en la dirección opuesta. Se aleja por grado conjunto de una nota del acorde y luego salta de vuelta a una nota del acorde diferente, creando un breve gesto decorativo en un tiempo débil. Al caer en un tiempo débil y partir por salto, es menos dramática que la apoyatura — un ornamento fugaz más que un acento expresivo.',
          tryThisLabel: 'El movimiento por grado conjunto es donde las escapatorias comienzan',
        },
        {
          title: 'La Anticipación Ascendente (Retardation)',
          explanation:
            'Una anticipación ascendente usa el mismo mecanismo de nota retenida que un retardo, pero resuelve por grado conjunto ascendente en vez de descendente. La más típica es 7-8: la sensible es retenida del acorde de dominante y resuelve hacia arriba hasta la tónica. Suena como un retardo que va en la dirección «equivocada». Son menos frecuentes que los retardos porque la resolución ascendente es menos natural en la conducción de voces tonal, pero la anticipación ascendente 7-8 es idiomática en puntos cadenciales.',
          tryThisLabel: 'El B en Sol mayor puede ascender hasta C',
        },
      ],
      tasks: [
        {
          instruction:
            'Clasifica estas notas extrañas por la aproximación y la salida: apoyatura (salto a tiempo fuerte, resolución por grado conjunto en dirección opuesta), escapatoria (aproximación por grado conjunto, salida por salto en dirección opuesta), anticipación ascendente (nota retenida, grado conjunto ascendente). La apoyatura y la escapatoria son imágenes especulares',
        },
        {
          instruction:
            'Escribe "G major chord" — imagina la nota B retenida mientras el acorde cambia a Do mayor. B resuelve hacia arriba hasta C: esto es una anticipación ascendente 7-8, el tipo más frecuente',
        },
        {
          instruction:
            'Compara: un retardo resuelve hacia ABAJO por grado conjunto (4-3: F desciende a E), mientras que una anticipación ascendente resuelve hacia ARRIBA por grado conjunto (7-8: B asciende a C). Mismo mecanismo, dirección opuesta. Los retardos son mucho más comunes porque la resolución descendente suena más natural',
        },
      ],
    },

    // ── U12 M3: Pedal Point and Changing Tones ──────────────────────────────
    l4u12m3: {
      title: 'Nota Pedal y Notas Cambiadas',
      subtitle: 'Notas sostenidas en el bajo y ornamentos de doble bordadura',
      objectives: [
        'Comprender la nota pedal como una nota sostenida sobre armonías cambiantes',
        'Identificar los tipos de pedal: de bajo, invertido, interno y pedal doble',
        'Reconocer las notas cambiadas (doble bordadura) como una figura ornamental emparejada',
      ],
      concepts: [
        {
          title: 'La Nota Pedal',
          explanation:
            'Una nota pedal es una nota sostenida o repetida (generalmente en el bajo) sobre armonías cambiantes, creando disonancias y consonancias alternas a medida que los acordes se mueven sobre ella. Los pedales de tónica anclan comienzos y finales de piezas, proporcionando estabilidad de base. Los pedales de dominante crean tensión antes de un regreso a la tónica, generando una sensación de anticipación mientras las armonías cambian sobre la nota dominante sostenida.',
          tryThisLabel: 'C es la nota pedal de tónica más común',
        },
        {
          title: 'Tipos de Pedal',
          explanation:
            'El pedal de bajo es el tipo más frecuente, con la nota sostenida en la voz más grave. Un pedal invertido sostiene una nota en la voz del soprano mientras las armonías se mueven debajo. Un pedal interno mantiene una nota en una voz interior (contralto o tenor), creando un efecto más sutil. Un pedal doble sostiene dos notas simultáneamente, generalmente tónica y dominante (como C y G mantenidos juntos), creando un poderoso efecto de anclaje.',
          tryThisLabel: 'G es la nota pedal de dominante en Do mayor',
        },
        {
          title: 'Notas Cambiadas (Doble Bordadura)',
          explanation:
            'Las notas cambiadas son un par de bordaduras en secuencia: nota del acorde, bordadura superior, bordadura inferior, regreso a la nota original del acorde (o en el orden inverso). También llamadas «grupo de bordaduras» o «doble bordadura». Crean una órbita decorativa en torno a una única altura, ornamentándola desde ambos lados antes de regresar. La figura ocurre típicamente en una posición de tiempo débil y añade interés melódico sin perturbar la armonía subyacente.',
          tryThisLabel: 'Imagina orbitar alrededor de E con F y luego D',
        },
      ],
      tasks: [
        {
          instruction:
            'Imagina una nota de bajo C sostenida mientras los acordes cambian arriba: Do mayor, Fa mayor, G7, Do mayor. Los acordes de Fa y G7 crean disonancia contra el bajo C — esto es un pedal de tónica en acción',
        },
        {
          instruction:
            'Ahora imagina un pedal de dominante: el bajo mantiene G mientras los acordes cambian arriba (Sol, Do/Sol, Re/Sol, Sol). El G sostenido crea tensión creciente que se resuelve cuando la armonía finalmente se alinea con el bajo',
        },
        {
          instruction:
            'Una figura de notas cambiadas en torno a E en Do mayor: E-F-D-E. El F es la bordadura superior, el D es la bordadura inferior, y la figura regresa a E. Este ornamento de doble bordadura decora una única nota del acorde desde ambos lados',
        },
      ],
    },

    // ── U12 M4: The Dominant Seventh — Resolution Rules ─────────────────────
    l4u12m4: {
      title: 'La Séptima de Dominante — Reglas de Resolución',
      subtitle:
        'Notas de tendencia del V7, conducción de voces y la resolución del trítono',
      objectives: [
        'Dominar las tendencias de resolución del V7: la 7.ª resuelve hacia abajo, la sensible resuelve hacia arriba',
        'Conducir acordes de V7 completos e incompletos correctamente',
        'Comprender la contracción del trítono que impulsa la resolución V7-I',
      ],
      concepts: [
        {
          title: 'Notas de Tendencia del V7',
          explanation:
            'El acorde de séptima de dominante contiene dos notas de tendencia que crean su poderosa atracción gravitacional hacia la tónica. La sensible (la 3.ª de V7) resuelve por semitono ascendente hacia la tónica. La 7.ª del acorde resuelve por grado conjunto descendente hacia la 3.ª de I. Juntas, estas dos voces forman un trítono que contrae hacia una consonancia imperfecta (una 3.ª o 6.ª), generando el impulso armónico más fuerte en la música tonal.',
          tryThisLabel: 'Escucha la tensión sin resolver de G7',
        },
        {
          title: 'V7 Completo vs. Incompleto',
          explanation:
            'Un V7 completo tiene los cuatro sonidos: fundamental, 3.ª, 5.ª y 7.ª. Un V7 incompleto omite la 5.ª y dobla la fundamental, usado cuando la conducción de voces con la forma completa resultaría torpe. Cuando un V7 completo resuelve a I, el acorde de tónica resultante es frecuentemente incompleto (fundamental triplicada, sin 5.ª) porque ambas notas de tendencia deben resolver correctamente. Este compromiso entre completitud del acorde y suavidad de la conducción de voces es una preocupación central en la escritura a cuatro voces.',
          tryThisLabel: 'Escucha el objetivo de resolución de G7',
        },
        {
          title: 'La Resolución del Trítono',
          explanation:
            'El trítono entre la sensible y la 7.ª del acorde es lo que hace al V7 singularmente poderoso. En G7, el trítono es B-F. Cuando G7 resuelve a Do, B sube a C y F baja a E — el trítono contrae hacia la 3.ª consonante C-E. Esta contracción de la disonancia máxima a la consonancia es el motor de la resolución tonal. Cada movimiento V7-I en cualquier tonalidad sigue este mismo patrón de trítono-a-consonancia.',
          tryThisLabel: 'B y F forman el trítono dentro de G7',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "G7" — identifica las dos notas de tendencia: B (sensible, resuelve hacia arriba hasta C) y F (7.ª del acorde, resuelve hacia abajo hasta E). Juntas forman el trítono que impulsa la resolución V7-I',
        },
        {
          instruction:
            'Ahora escribe "C major chord" — es hacia aquí donde G7 resuelve. B fue a C, F fue a E. El trítono contrajo hacia el intervalo consonante C-E',
        },
        {
          instruction:
            'Toca "G7" y después "C major chord" en secuencia — escucha el ciclo tensión-resolución. La séptima de dominante es el movimiento de acorde a acorde más fuerte en la música tonal',
        },
      ],
    },

    // ── U12 M5: V7 Inversions and Their Resolutions ─────────────────────────
    l4u12m5: {
      title: 'Inversiones de V7 y Sus Resoluciones',
      subtitle: 'Cómo V6/5, V4/3 y V4/2 resuelven a posiciones de tónica',
      objectives: [
        'Resolver las cuatro inversiones de V7 hacia sus objetivos de tónica correctos',
        'Comprender por qué V4/2 resuelve casi siempre a I6 (tónica en primera inversión)',
        'Reconocer cómo la inversión determina el movimiento del bajo y la resolución',
      ],
      concepts: [
        {
          title: 'V7 en Estado Fundamental y Primera Inversión (V6/5)',
          explanation:
            'El V7 en estado fundamental resuelve a I con el efecto más enfático — el bajo desciende una 5.ª (o asciende una 4.ª) hasta la fundamental de la tónica. La primera inversión V6/5 coloca la sensible en el bajo, que debe subir por semitono hasta la tónica. Esto crea el movimiento de bajo más suave posible hacia el acorde de tónica y es especialmente útil cuando se desea una línea de bajo por grado conjunto.',
          tryThisLabel: 'V7 en estado fundamental en Do mayor',
        },
        {
          title: 'Segunda Inversión (V4/3)',
          explanation:
            'V4/3 coloca la 5.ª del acorde de dominante en el bajo. Puede resolver tanto a I (tónica en estado fundamental) como a I6 (tónica en primera inversión), dando al compositor flexibilidad en la conducción de la línea de bajo. La nota del bajo (la 5.ª de V) típicamente desciende por grado conjunto hasta la fundamental de la tónica o se mueve hacia la 3.ª de I. V4/3 aparece frecuentemente en el centro de frases como una dominante de paso entre posiciones de tónica.',
          tryThisLabel: 'V4/3 tiene D (la 5.ª) en el bajo',
        },
        {
          title: 'Tercera Inversión (V4/2)',
          explanation:
            'V4/2 coloca la 7.ª del acorde en el bajo. Como la 7.ª es una nota de tendencia que debe resolver por grado conjunto descendente, V4/2 resuelve casi siempre a I6 (tónica en primera inversión). En G7, la 7.ª es F; F debe descender por grado conjunto a E, dando C/E (I6) como resolución. Esta restricción es absoluta en la conducción de voces rigurosa — V4/2 a I en estado fundamental dejaría la 7.ª del bajo sin resolver.',
          tryThisLabel: 'Toca G/B para escuchar el movimiento del bajo de V6/5',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "G7" — estado fundamental, bajo es G. El bajo desciende una 5.ª hasta C al resolver a I. Este es el movimiento de bajo V7-I más fuerte y enfático',
        },
        {
          instruction:
            'Escribe "G/B" — esto es V6/5 con la sensible B en el bajo. B debe subir por grado conjunto hasta C, dando un movimiento de bajo suave por grado conjunto hacia la tónica. Compara el efecto con G7 en estado fundamental',
        },
        {
          instruction:
            'V4/2 coloca F (la 7.ª) en el bajo. F debe resolver descendiendo a E, por lo tanto V4/2 resuelve a C/E (I6). Esto no es una elección — la nota de tendencia en el bajo fija la resolución en la tónica en primera inversión',
        },
      ],
    },

    // ── U13 M1: Pre-Dominant Seventh Chords ─────────────────────────────────
    l4u13m1: {
      title: 'Acordes de Séptima Predominantes: ii7 y IV7',
      subtitle:
        'Las sonoridades predominantes más fuertes y la progresión ii7-V7-I',
      objectives: [
        'Construir e identificar ii7 (séptima menor en mayor) y iiø7 (semidisminuido en menor)',
        'Comprender la progresión ii7-V7-I como la secuencia funcional más fuerte en la armonía tonal',
        'Reconocer IV7/IVmaj7 como una séptima subdominante con calidez añadida',
      ],
      concepts: [
        {
          title: 'El Acorde ii7',
          explanation:
            'El ii7 es el acorde predominante más importante. En tonalidades mayores es un acorde de séptima menor; en tonalidades menores se convierte en un acorde de séptima semidisminuido (iiø7). La progresión ii7-V7-I es la secuencia funcional más fuerte en la armonía tonal porque la 7.ª de ii7 es una nota común con la fundamental de V, creando un enlace suave en la conducción de voces. El bajo se mueve por 5.ª descendente (o 4.ª ascendente) en cada paso, reforzando la atracción gravitacional hacia la tónica.',
          tryThisLabel: 'Escucha ii7 en la tonalidad de Do',
        },
        {
          title: 'El Acorde IV7 / IVmaj7',
          explanation:
            'IVmaj7 desempeña una función subdominante (predominante) con calidez y color añadidos. El intervalo de 7.ª mayor le confiere una cualidad rica, distinta de la tríada IV más sencilla. La séptima intensifica la atracción hacia la dominante al añadir una voz más que quiere resolver. Aunque menos frecuente que ii7 en la práctica clásica, IVmaj7 aparece a menudo en la armonía jazz y pop como una sonoridad predominante alternativa.',
          tryThisLabel: 'Escucha IVmaj7 en la tonalidad de Do',
        },
        {
          title: 'La Progresión ii7-V7-I',
          explanation:
            'Esta secuencia de tres acordes es la progresión armónica más fundamental en el jazz y una de las más fuertes en toda la música tonal. Cada acorde fluye al siguiente por 5.ª descendente: D(m7) a G(7) a C. La conducción de voces es excepcionalmente suave: la 7.ª de cada acorde resuelve por grado conjunto al acorde siguiente, y notas comunes enlazan armonías adyacentes. En el jazz, esta progresión se extiende frecuentemente: iii7-vi7-ii7-V7-Imaj7, un descenso completo por el ciclo de quintas.',
          tryThisLabel: 'Comienza el ii7-V7-I en Do mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "Dm7" después "G7" después "Cmaj7" — esta es la progresión ii7-V7-Imaj7, la secuencia de acordes más fundamental en el jazz y la progresión funcional más fuerte en la armonía tonal',
        },
        {
          instruction:
            'Compara "Dm7" con "Fmaj7" — ambos tienen función predominante en Do mayor. Dm7 (ii7) tiene una cualidad más oscura y propulsiva; Fmaj7 (IVmaj7) es más cálido y expansivo. Ambos conducen naturalmente a G7 (V7)',
        },
        {
          instruction:
            'Escribe "Dm7" y observa la nota común con G7: la nota D. La 7.ª de Dm7 (C) resuelve por grado conjunto a B (la 3.ª de G7). Este enlace suave en la conducción de voces es la razón por la que ii7-V7 es tan fuerte',
        },
      ],
    },

    // ── U13 M2: Mediant, Submediant, and Tonic Sevenths ────────────────────
    l4u13m2: {
      title: 'Séptimas de Mediante, Submediante y Tónica',
      subtitle:
        'iii7, vi7, Imaj7 — séptimas de función tónica y la tónica jazz',
      objectives: [
        'Comprender iii7 como sustituto de tónica y eslabón en el ciclo de quintas',
        'Reconocer vi7 como el principal sustituto de función tónica y objetivo de la resolución de engaño',
        'Distinguir Imaj7 (tónica jazz) de I7 (tónica blues)',
      ],
      concepts: [
        {
          title: 'Los Acordes iii7 y vi7',
          explanation:
            'El iii7 funciona como sustituto de tónica (compartiendo dos notas con I) o como eslabón en el movimiento por ciclo de quintas: iii7-vi7-ii7-V7-I. Raramente aparece aislado, pero es esencial en secuencias prolongadas. El vi7 es el principal sustituto de función tónica; vi7-ii7-V7-I es extremadamente común tanto en la armonía clásica como en el jazz. La resolución de engaño V7-vi7 es más suave que V7-vi porque el acorde de séptima comparte más notas con V7, atenuando la sorpresa.',
          tryThisLabel: 'Escucha iii7 en la tonalidad de Do',
        },
        {
          title: 'La Séptima de Tónica: Imaj7',
          explanation:
            'En la armonía clásica, la 7.ª sobre un acorde de tónica se trata típicamente como nota de paso o retardo que resuelve. En el jazz y el pop, Imaj7 es la disposición de tónica estándar — cálida, rica y sofisticada. El intervalo de 7.ª mayor (B en Cmaj7) añade color sin crear tensión de cualidad dominante. Imaj7 es el punto de reposo de la progresión ii7-V7-Imaj7, la cadencia jazz más característica.',
          tryThisLabel: 'Escucha la tónica jazz: Cmaj7',
        },
        {
          title: 'La Tónica Blues: I7',
          explanation:
            'En el blues, el acorde I es una séptima de dominante (I7), confiriendo a cada acorde la tensión característica que define el estilo. C7 como acorde de tónica es «incorrecto» según los estándares clásicos (las séptimas de dominante deben resolver, no reposar), pero exactamente correcto en el blues. En un blues de 12 compases, los tres acordes principales (I7, IV7, V7) son todos séptimas de dominante. Esto transforma la séptima de dominante de un acorde de tensión en el bloque sonoro básico de construcción.',
          tryThisLabel: 'Escucha vi7 en la tonalidad de Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "Cmaj7" — observa el intervalo de 7.ª mayor (B a C). Ahora escribe "C7" — la 7.ª menor (Bb) le da un carácter completamente diferente. Cmaj7 es función tónica; C7 es cualidad dominante (o tónica blues)',
        },
        {
          instruction:
            'Toca el ciclo ampliado: "Em7" (iii7) \u2192 "Am7" (vi7) \u2192 "Dm7" (ii7) \u2192 "G7" (V7) \u2192 "Cmaj7" (Imaj7). Cada fundamental desciende una 5.ª. Este es el fragmento completo de quintas descendentes de iii a I',
        },
        {
          instruction:
            'Compara "Am7" con "Am" — la séptima (G) añade suavidad a vi7 y hace la resolución de engaño V7-vi7 más fluida que V7-vi. La nota añadida crea una nota común con V7',
        },
      ],
    },

    // ── U13 M3: Leading-Tone Sevenths ───────────────────────────────────────
    l4u13m3: {
      title: 'Séptimas de Sensible: viiø7 y viio7',
      subtitle:
        'Acordes de séptima semidisminuido y disminuido como sustitutos de la dominante',
      objectives: [
        'Construir y resolver viiø7 (semidisminuido, en mayor) y viio7 (disminuido, en menor)',
        'Comprender las séptimas de sensible como dominantes de 9.ª sin fundamental',
        'Reconocer la flexibilidad enarmónica del acorde de séptima disminuida',
      ],
      concepts: [
        {
          title: 'El viiø7 Semidisminuido',
          explanation:
            'El viiø7 en tonalidades mayores funciona como un V7 sin fundamental — sus notas son la 3.ª, 5.ª, 7.ª y 9.ª de V. En Do mayor, Bø7 contiene B-D-F-A, que son las cuatro notas superiores de G9 (G-B-D-F-A con la fundamental G eliminada). Resuelve a I con la misma lógica de notas de tendencia: B sube a C, F baja a E. La cualidad semidisminuida es menos tensa que la totalmente disminuida, confiriéndole una atracción dominante más suave.',
          tryThisLabel: 'Escucha viiø7 en la tonalidad de Do',
        },
        {
          title: 'El viio7 Totalmente Disminuido',
          explanation:
            'El viio7 en tonalidades menores se construye a partir del 7.º grado elevado de la escala menor armónica. Las cuatro notas son todas notas de tendencia que tiran hacia la resolución, convirtiéndolo en el más tenso de todos los acordes de séptima diatónicos. En La menor, G#dim7 contiene G#-B-D-F — cada nota quiere moverse por grado conjunto. El acorde de séptima disminuida divide la octava en 3.as menores iguales, confiriéndole una cualidad simétrica e inquieta.',
          tryThisLabel: 'Escucha el viio7 totalmente disminuido',
        },
        {
          title: 'Flexibilidad Enarmónica',
          explanation:
            'Como el acorde de séptima disminuida divide la octava en cuatro 3.as menores iguales, cualquiera de sus cuatro notas puede ser renombrada como fundamental. G#dim7, Bdim7, Ddim7 y Fdim7 contienen todos las mismas alturas (enarmónicamente). Esto convierte al acorde de séptima disminuida en un poderoso acorde pivote para la modulación — un solo acorde puede resolver a cuatro tonalidades diferentes. Esta flexibilidad enarmónica se vuelve central en la modulación cromática del Nivel 5.',
          tryThisLabel: 'Mismas alturas que G#dim7, Ddim7, Fdim7',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "Bm7b5" (B séptima semidisminuido) — esto es viiø7 en Do mayor. Sus notas B-D-F-A son las mismas que G9 sin la fundamental G. Resuelve a Do mayor con B subiendo a C y F bajando a E',
        },
        {
          instruction:
            'Escribe "Bdim7" (B séptima disminuido) — esto es viio7 en Do menor. Compara el sonido con "Bm7b5": la versión totalmente disminuida es más tensa porque cada nota es una nota de tendencia',
        },
        {
          instruction:
            'Abre "key of C" e identifica los siete acordes de séptima diatónicos: Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7. La séptima de sensible (viiø7) es el único acorde de cualidad disminuida en tonalidades mayores',
        },
      ],
    },

    // ── U13 M4: Harmonic Function: T → PD → D → T ──────────────────────────
    l4u13m4: {
      title: 'Función Armónica: T \u2192 PD \u2192 D \u2192 T',
      subtitle:
        'Tónica, Predominante y Dominante — los tres pilares de la armonía tonal',
      objectives: [
        'Clasificar cada acorde diatónico por función: Tónica (T), Predominante (PD), Dominante (D)',
        'Comprender la progresión estándar T \u2192 PD \u2192 D \u2192 T como la frase armónica fundamental',
        'Reconocer retrogresiones y sustitución de acordes dentro de grupos funcionales',
      ],
      concepts: [
        {
          title: 'Las Tres Funciones Armónicas',
          explanation:
            'Cada acorde diatónico desempeña una de tres funciones. Acordes de Tónica (T) — I, vi y a veces iii — proporcionan estabilidad y la sensación de reposo. Acordes Predominantes (PD) — ii y IV — crean partida y movimiento, señalando que la armonía se dirige a algún lugar. Acordes de Dominante (D) — V y vii° — generan tensión y urgencia que exige resolución de vuelta a la tónica. Los colores de los grados en esta aplicación codifican estas funciones: azul para estabilidad tónica, ámbar para tensión dominante.',
          tryThisLabel: 'Observa los colores de función en la barra de grados',
        },
        {
          title: 'La Progresión Funcional Estándar',
          explanation:
            'T \u2192 PD \u2192 D \u2192 T es la frase armónica fundamental, reflejando la estructura narrativa: establecer el reposo, partir, crear tensión, resolver. Prácticamente toda la música tonal sigue este patrón a algún nivel estructural. El orden importa: PD \u2192 D incrementa la tensión, D \u2192 T la libera. Invertir el flujo (retrogresión) suena inusual porque libera la tensión prematuramente — D \u2192 PD o PD \u2192 T sin pasar por D crea desvío, evasión de la resolución o un regreso suave.',
          tryThisLabel: 'Traza I-IV-V-I como T-PD-D-T',
        },
        {
          title: 'Sustitución de Acordes Dentro de Funciones',
          explanation:
            'Acordes dentro del mismo grupo funcional pueden sustituirse mutuamente porque comparten grados de la escala. El vi puede sustituir a I (por eso la cadencia de engaño V-vi funciona — vi es función tónica). El ii puede sustituir a IV (ambos son predominantes). El vii° puede sustituir a V (ambos son función dominante). La sustitución explica por qué tantas progresiones diferentes funcionan: siguen el mismo patrón funcional T-PD-D-T con acordes específicos diferentes ocupando cada papel.',
          tryThisLabel: 'Observa qué acordes comparten función',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" y clasifica cada acorde diatónico: I(T), ii(PD), iii(T), IV(PD), V(D), vi(T), vii°(D). Observa cómo los colores de la barra de grados corresponden a estas funciones',
        },
        {
          instruction:
            'Traza la progresión I-vi-ii-V-I a través de las etiquetas de función: T-T-PD-D-T. Incluso con una sustitución (vi en lugar de I), el flujo funcional T \u2192 PD \u2192 D \u2192 T se mantiene',
        },
        {
          instruction:
            'Considera I-V-IV-I (T-D-PD-T). Esto es una retrogresión — D se mueve a PD en vez de resolver a T. Suena inusual en la música clásica, pero es habitual en el rock. ¿Puedes percibir la diferencia en la dirección armónica?',
        },
      ],
    },

    // ── U13 M5: Harmonic Sequences ──────────────────────────────────────────
    l4u13m5: {
      title: 'Secuencias Armónicas',
      subtitle:
        'Patrones armónicos repetitivos que crean movimiento direccional dentro de una tonalidad',
      objectives: [
        'Reconocer patrones de secuencia de quintas descendentes, segundas ascendentes y terceras descendentes',
        'Comprender cómo las secuencias crean impulso armónico direccional que se sobrepone a la lógica funcional normal',
        'Escuchar secuencias en contexto en los estilos Barroco, Clásico y pop',
      ],
      concepts: [
        {
          title: '¿Qué Es una Secuencia Armónica?',
          explanation:
            'Una secuencia armónica es un patrón de acordes que se repite a intervalos regulares, transponiéndose hacia arriba o hacia abajo en cada repetición. Las secuencias crean un fuerte impulso direccional — el oyente percibe el patrón y anticipa su continuación. Se sobreponen temporalmente a las progresiones funcionales normales porque el patrón repetitivo en sí mismo proporciona la lógica armónica. Cualquier desviación del patrón establecido es inmediatamente perceptible, lo que hace que las secuencias sean simultáneamente predecibles y cautivadoras.',
          tryThisLabel: 'Observa todos los acordes diatónicos para construir secuencias',
        },
        {
          title: 'La Secuencia de Quintas Descendentes',
          explanation:
            'La secuencia armónica más frecuente. Las fundamentales descienden por quintas: I-IV-vii°-iii-vi-ii-V-I. Cada acorde resuelve al siguiente como si fuera un movimiento V-I local. El ciclo completo regresa a la tonalidad inicial. Cualquier subconjunto funciona como progresión utilizable: vi-ii-V-I es un fragmento de quintas descendentes usado constantemente en la música tonal. Añadir acordes de séptima hace la conducción de voces aún más suave porque la 7.ª de cada acorde resuelve por grado conjunto al acorde siguiente.',
          tryThisLabel: 'vi7 inicia un descenso de quintas habitual',
        },
        {
          title: 'Segundas Ascendentes y Terceras Descendentes',
          explanation:
            'En una secuencia de segundas ascendentes, las fundamentales suben por grado conjunto: I-ii-iii-IV-V, creando una sensación de escalada. Las primeras inversiones se emplean frecuentemente para mantener la línea de bajo suave (la técnica 5-6). En una secuencia de terceras descendentes, las fundamentales bajan por terceras: I-vi-IV-ii, produciendo un movimiento descendente suave común en la música Romántica. Cada par en una secuencia de terceras comparte una nota común, haciendo la conducción de voces excepcionalmente suave.',
          tryThisLabel: 'ii7 se sitúa en el centro de muchas secuencias',
        },
      ],
      tasks: [
        {
          instruction:
            'Traza las quintas descendentes en Do mayor: C-F-Bdim-Em-Am-Dm-G-C (I-IV-vii°-iii-vi-ii-V-I). Abre "key of C" y toca cada acorde — escucha cómo cada fundamental desciende una 5.ª hasta la siguiente',
        },
        {
          instruction:
            'Toca "Am7" después "Dm7" después "G7" después "Cmaj7" — este es un fragmento de quintas descendentes (vi7-ii7-V7-Imaj7), la progresión de acordes más habitual en el jazz',
        },
        {
          instruction:
            'Identifica el tipo de secuencia en I-vi-IV-ii: cada fundamental desciende una 3.ª (C-A-F-D). Esta es una secuencia de terceras descendentes. Observa cómo cada par adyacente comparte una nota común, manteniendo la conducción de voces suave',
        },
      ],
    },

    // ── U14 M1: First and Second Species Counterpoint ───────────────────────
    l4u14m1: {
      title: 'Contrapunto de Primera y Segunda Especie',
      subtitle:
        'Combinar melodías independientes con reglas de consonancia y disonancia',
      objectives: [
        'Comprender el contrapunto como el arte de combinar líneas melódicas independientes',
        'Aplicar la clasificación de consonancia y disonancia a texturas a dos voces',
        'Escribir contrapunto de primera especie (1:1) y segunda especie (2:1) siguiendo reglas de conducción de voces',
      ],
      concepts: [
        {
          title: '¿Qué Es el Contrapunto?',
          explanation:
            'El contrapunto es el arte de combinar dos o más líneas melódicas independientes que están armónicamente relacionadas pero melódicamente independientes. Mientras que la armonía es una perspectiva vertical (acordes apilados en un instante del tiempo), el contrapunto es horizontal (melodías que se desarrollan en el tiempo y se entrelazan). Las dos perspectivas se complementan — una buena armonía generalmente implica buen contrapunto, y viceversa. El contrapunto fue la técnica composicional dominante del Renacimiento al Barroco.',
          tryThisLabel: 'Una escala es la línea melódica más sencilla',
        },
        {
          title: 'Consonancia y Disonancia en el Contrapunto',
          explanation:
            'En el contrapunto a dos partes, cada intervalo vertical entre las voces se clasifica. Consonancias perfectas (P1, P5, P8) son las más estables, pero suenan huecas si se usan en exceso. Consonancias imperfectas (m3, M3, m6, M6) son estables y cálidas — forman la columna vertebral del buen contrapunto, proporcionando el mejor equilibrio entre armonía e independencia. Disonancias (m2, M2, P4, trítono, m7, M7) son inestables y deben resolver por grado conjunto hacia una consonancia.',
          tryThisLabel: 'C-E es una consonancia imperfecta (M3)',
        },
        {
          title: 'Primera y Segunda Especie',
          explanation:
            'La primera especie (1:1) coloca una nota del contrapunto contra cada nota del cantus firmus (melodía dada). Cada intervalo debe ser consonante. Comienza y termina en P1, P5 o P8, usa mayoritariamente consonancias imperfectas y nunca se aproxima a consonancias perfectas en movimiento paralelo. La segunda especie (2:1) añade dos notas contra cada nota del cantus firmus. Los tiempos fuertes deben ser consonantes; en la especie estricta, la única disonancia permitida en un tiempo débil es la nota de paso, abordada y abandonada por grado conjunto (las bordaduras disonantes llegan más tarde, en la tercera especie — aunque algunos textos modernos las admiten antes). Es aquí donde las notas extrañas al acorde entran por primera vez en el contrapunto.',
          tryThisLabel: 'Imagina una segunda voz contra esta línea',
        },
      ],
      tasks: [
        {
          instruction:
            'Clasifica estos intervalos para contrapunto: C-E (consonancia imperfecta, M3), C-G (consonancia perfecta, P5), C-F (disonancia, P4 en textura a dos voces), C-B (disonancia, M7)',
        },
        {
          instruction:
            'Toca "C major scale" ascendente e imagina una segunda voz una 3.ª por encima (E-F-G-A-B-C-D-E). Este movimiento en terceras paralelas es consonancia imperfecta a lo largo de toda la línea — estable y cálido, la textura de contrapunto ideal',
        },
        {
          instruction:
            '¿Por qué están prohibidas las quintas perfectas paralelas? Porque dos voces en P5 paralelas pierden su independencia melódica — comienzan a sonar como una sola voz doblada, no dos líneas individuales. Las consonancias imperfectas mantienen mejor la independencia',
        },
      ],
    },

    // ── U14 M2: Asymmetric and Mixed Meters ─────────────────────────────────
    l4u14m2: {
      title: 'Compases Asimétricos y Mixtos',
      subtitle:
        'Contar en 5, 7 y más — compases aditivos y mixtos',
      objectives: [
        'Contar y sentir compases asimétricos: 5/4, 5/8, 7/4, 7/8',
        'Comprender agrupaciones de compás aditivo (2+3, 3+2, 2+2+3) como los bloques de construcción del ritmo irregular',
        'Reconocer compases mixtos donde la indicación de compás cambia de compás a compás',
      ],
      concepts: [
        {
          title: 'Compases Asimétricos',
          explanation:
            'Los compases asimétricos tienen conteos de tiempos que no se dividen igualmente en grupos iguales. 5/4 o 5/8 se agrupa como 2+3 o 3+2 — la agrupación determina enteramente el carácter rítmico. 7/4 o 7/8 se agrupa como 2+2+3, 2+3+2 o 3+2+2. La agrupación desigual crea un groove asimétrico que es característico de la música folclórica balcánica, el rock progresivo y mucha música de concierto del siglo XX.',
          tryThisLabel: 'Cuenta 7 notas de la escala en grupos de 2+2+3',
        },
        {
          title: 'Compases Aditivos',
          explanation:
            'Los compases aditivos se construyen combinando grupos de 2 y 3 tiempos. 5 = 2+3 o 3+2. 7 = 2+2+3 o 2+3+2 o 3+2+2. 8 = 3+3+2, habitual en la música balcánica y algo de rock. 11 = 2+2+3+2+2, empleado por Dave Brubeck y otros. El patrón de agrupación interno es lo que da a cada compás su carácter distintivo — el mismo número total de tiempos con agrupaciones diferentes crea caracteres rítmicos enteramente distintos.',
          tryThisLabel: 'Cuenta 5 notas en grupos de 3+2',
        },
        {
          title: 'Compases Mixtos y Tiempo Cortado',
          explanation:
            'El compás mixto cambia la indicación de compás de un compás a otro: un compás de 4/4, el siguiente de 3/4, luego 5/4. Esto crea una superficie rítmica impredecible y cambiante, habitual en bandas sonoras de cine y rock progresivo. El tiempo cortado (alla breve, 2/2) usa dos tiempos de blanca por compás — un compás de 2/2 tiene la misma duración total que un compás de 4/4, pero la unidad de tiempo es la blanca en lugar de la negra, por lo que la música se cuenta en 2 y gana una sensación más amplia y de movimiento más rápido, con mayor impulso métrico. El tiempo cortado es estándar en marchas y movimientos rápidos del periodo Clásico.',
          tryThisLabel: 'Sigue en tiempo cortado: 2 tiempos por compás',
        },
      ],
      tasks: [
        {
          instruction:
            'Marca un patrón de 7/8 agrupado como 2+2+3: cuenta "1-2, 1-2, 1-2-3" con énfasis en el primer tiempo de cada grupo. Luego reagrupa como 3+2+2: "1-2-3, 1-2, 1-2". El carácter cambia completamente aunque el total de tiempos sea el mismo',
        },
        {
          instruction:
            'Palmea un patrón de 5/4: prueba 2+3 ("1-2, 1-2-3") y luego 3+2 ("1-2-3, 1-2"). El primero se siente como una marcha con un tropiezo extra; el segundo se siente como un vals con impulso adicional',
        },
        {
          instruction:
            'Alterna un compás de 4/4 con uno de 3/4 y repite el ciclo varias veces — este es el compás mixto más sencillo. Observa cómo la duración variable del compás crea un carácter rítmico impredecible y asimétrico incluso a partir de dos compases simétricos',
        },
      ],
    },

    // ── U14 M3: Chromatic Embellishment ──────────────────────────────────────
    l4u14m3: {
      title: 'Ornamentación Cromática',
      subtitle:
        'Añadir color cromático a la armonía diatónica sin cambiar de tonalidad',
      objectives: [
        'Reconocer notas de paso cromáticas y bordaduras cromáticas',
        'Distinguir ornamentación cromática (decorativa) de cromatismo estructural (dominantes secundarias, modulación)',
        'Escuchar cómo el movimiento cromático añade suavidad y color a la conducción de voces',
      ],
      concepts: [
        {
          title: 'Notas de Paso y Bordaduras Cromáticas',
          explanation:
            'Una nota de paso cromática rellena un tono con una nota no diatónica: C-C#-D usa el C# cromático para enlazar dos tonos diatónicos suavemente. Una bordadura cromática orbita una nota del acorde usando un semitono cromático: E-Eb-E crea una órbita más estrecha que una bordadura diatónica. Ambas añaden suavidad y color a líneas diatónicas que de otro modo serían sencillas. Son especialmente habituales en líneas de bajo y voces interiores, donde el cromatismo añadido enriquece la textura sin perturbar la melodía.',
          tryThisLabel: 'Escucha todos los 12 pasos cromáticos',
        },
        {
          title: 'Ornamentación vs. Cromatismo Estructural',
          explanation:
            'En este nivel, el cromatismo es decorativo — añade color a la armonía diatónica sin cambiar de tonalidad. Una nota de paso cromática entre los grados 4 y 5 es decoración. Un acorde V/V (dominante secundaria) es cromatismo estructural que apunta brevemente a un nuevo centro tonal. La distinción es importante: la ornamentación decora la superficie mientras que la estructura altera la dirección armónica. El cromatismo estructural, incluyendo dominantes secundarias y modulación, se aborda en el Nivel 5.',
          tryThisLabel: 'El marco diatónico que el cromatismo decora',
        },
        {
          title: 'Intercambio de Voces Cromático',
          explanation:
            'Un intercambio de voces cromático es una técnica especial en la que una voz se mueve cromáticamente hacia arriba mientras otra se mueve cromáticamente hacia abajo, involucrando frecuentemente un intervalo de sexta aumentada que se expande a una octava. Por ejemplo, el bajo puede subir C-C# mientras una voz superior baja E-Eb, ambas convergiendo en D. Esto crea un efecto llamativo de movimiento cruzado que añade intensidad y sofisticación a la conducción de voces sin abandonar la tonalidad.',
          tryThisLabel: 'Los pasos cromáticos son la materia prima',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "chromatic scale" y tócala — cada nota está a un semitono de distancia. Ahora toca "C major scale" — observa los tonos (C-D, D-E, F-G, G-A, A-B) que el cromatismo podría rellenar',
        },
        {
          instruction:
            'Imagina la línea de bajo C-C#-D bajo un cambio de acorde de I a ii en Do mayor. El C# es una nota de paso cromática — no cambia de tonalidad, simplemente suaviza el movimiento de un tono de C a D',
        },
        {
          instruction:
            'Compara "C major scale" (7 notas por octava) con "chromatic scale" (12 notas por octava). Las 5 notas cromáticas adicionales son la materia prima para ornamentación cromática dentro de una tonalidad diatónica',
        },
      ],
    },

    // ── U14 M4: Roman Numeral Analysis Practice ─────────────────────────────
    l4u14m4: {
      title: 'Práctica de Análisis con Números Romanos',
      subtitle:
        'Analizar progresiones armónicas reales con notación completa de números romanos',
      objectives: [
        'Analizar progresiones de acordes con notación completa de números romanos incluyendo cualidad e inversión',
        'Identificar cadencias, notas extrañas al acorde e inversiones en contexto',
        'Desarrollar fluidez en la lectura de texturas de coral y etiquetado de función armónica',
      ],
      concepts: [
        {
          title: 'El Método de Análisis',
          explanation:
            'El análisis con números romanos sigue un proceso sistemático: (1) determinar la tonalidad a partir de la armadura de clave y los patrones cadenciales, (2) en cada punto de ritmo armónico, identificar el acorde — qué notas están sonando, (3) determinar la fundamental y la cualidad, (4) etiquetar con número romano, símbolo de cualidad y cifra de inversión, (5) identificar notas extrañas al acorde como notas que no pertenecen al acorde, (6) marcar cadencias en los finales de frase. Este método transforma la escucha intuitiva en comprensión estructurada.',
          tryThisLabel: 'Observa todos los acordes disponibles para análisis en Do',
        },
        {
          title: 'Lectura de Texturas de Coral',
          explanation:
            'La textura de coral a cuatro voces coloca soprano y contralto en el pentagrama de clave de sol (plicas hacia arriba y hacia abajo respectivamente), tenor y bajo en el pentagrama de clave de fa. Comienza el análisis identificando la nota del bajo — ella determina la inversión. Luego identifica las demás notas del acorde arriba. Rodea cualquier nota que no encaje en el acorde — son notas extrañas. Los retardos y notas de paso pueden hacer que los acordes parezcan erróneos en la superficie; analiza siempre la armonía subyacente en el punto de resolución.',
          tryThisLabel: 'Un acorde sencillo para practicar la identificación',
        },
        {
          title: 'Errores Comunes en el Análisis',
          explanation:
            'El error más frecuente es identificar incorrectamente acordes en inversión mirando solo la nota del bajo. Un acorde con E en el bajo, G arriba y C arriba no es Mi menor — es Do mayor en primera inversión (I6). Otra trampa: los retardos hacen que el acorde parezca «incorrecto» en el momento de la disonancia. Analiza siempre hasta la resolución para determinar la armonía real. El contexto determina la mejor lectura cuando una nota puede servir tanto como nota del acorde como nota extraña.',
          tryThisLabel: 'C/E es I6, no un acorde de E',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "C/E" — esto es Do mayor en primera inversión (I6 en Do mayor). La nota del bajo es E, pero el acorde sigue siendo Do mayor. Practica la identificación de la fundamental, no solo de la nota más grave',
        },
        {
          instruction:
            'Analiza esta progresión en Do mayor: C-Dm-G-C. En números romanos: I-ii-V-I. Etiquetas de función: T-PD-D-T. Esta es la frase armónica fundamental en su forma más sencilla',
        },
        {
          instruction:
            'Añade una inversión: C-Dm/F-G7-C se convierte en I-ii6-V7-I. El acorde ii en primera inversión coloca F en el bajo, creando una línea de bajo suave por grado conjunto: C-F-G-C. Las inversiones son una herramienta para controlar la conducción de la voz del bajo',
        },
      ],
    },

    // ── U14 M5: Minor Key Harmony in Detail ─────────────────────────────────
    l4u14m5: {
      title: 'Armonía en Modo Menor en Detalle',
      subtitle:
        'Cómo las tres formas de la escala menor crean un vocabulario de acordes fluido y ampliado',
      objectives: [
        'Comprender cómo las tres formas de la escala menor producen diferentes cualidades de acordes diatónicos',
        'Conocer el vocabulario práctico de acordes en tonalidades menores extraído de las tres formas',
        'Reconocer el acorde subtónico VII en la menor natural y el problema del III+ aumentado en la menor armónica',
      ],
      concepts: [
        {
          title: 'La Paleta de Acordes en Modo Menor',
          explanation:
            'En la práctica, las tonalidades menores extraen acordes de las tres formas de la escala menor: V y vii° de la menor armónica (porque la sensible es necesaria para cadencias fuertes), i, iv, VI y III de la menor natural (usando el 6.º y 7.º grados inalterados), y II y IV de la menor melódica ascendente (que eleva el 6.º grado). Esto da a las tonalidades menores más opciones de acordes que a las mayores, no menos. El compositor elige qué forma usar en función de las necesidades de conducción de voces y el color armónico deseado.',
          tryThisLabel: 'Observa la base de la menor natural',
        },
        {
          title: 'El Subtónico VII y el III+ Aumentado',
          explanation:
            'En la menor natural, el 7.º grado está a un tono por debajo de la tónica, produciendo una tríada mayor VII en vez del vii° disminuido de la menor armónica. El VII frecuentemente se mueve a III o crea una cadencia con sabor Mixolidio habitual en el rock y pop. Construir una tríada sobre el 3.er grado de la menor armónica produce una tríada aumentada (III+) porque el 7.º grado elevado se convierte en la 5.ª de esa tríada. El III+ es áspero y rara vez se usa; los compositores emplean casi siempre el III de la menor natural (una tríada mayor sencilla).',
          tryThisLabel: 'Observa el 7.º grado elevado que crea V y vii°',
        },
        {
          title: 'El Sistema Menor Fluido',
          explanation:
            'A diferencia del modo mayor (una escala, un conjunto fijo de acordes diatónicos), el menor es fluido — el 6.º y 7.º grados son variables. Esta variabilidad es una característica, no un defecto. Un pasaje en modo menor puede usar una cadencia III-VII de la menor natural en una frase y una cadencia V-i de la menor armónica en la siguiente, extrayendo libremente de toda la paleta. Comprender esta fluidez es esencial para analizar música real, donde la armonía en modo menor rara vez se mantiene dentro de una única forma de escala a lo largo de toda la pieza.',
          tryThisLabel: 'Compara con la menor natural arriba',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe "A natural minor scale" después "A harmonic minor scale" — la única diferencia es G vs. G#. Esa única nota elevada transforma el acorde v en V y el acorde VII en vii°, alterando las posibilidades armónicas',
        },
        {
          instruction:
            'Toca "Am" después "E major chord" (V-i con la sensible G# de la menor armónica). Ahora toca "Am" después "Em" (v-i con el G natural de la menor natural). Escucha cómo el V mayor crea una resolución mucho más fuerte hacia la tónica',
        },
        {
          instruction:
            'En La menor, el acorde subtónico VII es Sol mayor (G-B-D). Toca "G major chord" después "C major chord" (VII-III en La menor). Esta progresión de la menor natural se escucha constantemente en el rock y pop como bVII-bIII',
        },
      ],
    },
  },
};

export default curriculumL4;
