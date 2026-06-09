import type { CurriculumLevelOverlay } from '../types';

const curriculumL7: CurriculumLevelOverlay = {
  // ─── Unidades ─────────────────────────────────────────────────────────────
  units: {
    u21: {
      title: 'Armonía Jazz',
      description:
        'Cifrado jazz, extensiones, voicings de shell, progresiones ii-V-I, sustitución tritonal, formas de blues, rhythm changes y turnarounds',
    },
    u22: {
      title: 'Jazz Avanzado, Modal y Pop',
      description:
        'Teoría acorde-escala, estructuras superiores, rearmonización, cambios de Coltrane, progresiones modales, voicings cuartales y pedales',
    },
    u23: {
      title: 'Armonía Pop y Taxonomía Completa',
      description:
        'Progresiones pop, números de Nashville, mezcla modal, mediantes cromáticas, las 46 escalas (modos de menor melódica, modos de menor armónica, simétricas, del mundo) y los 42 tipos de acordes',
    },
  },

  // ─── Módulos ──────────────────────────────────────────────────────────────
  modules: {
    // ══════════════════════════════════════════════════════════════════════════
    // Unidad 21: Armonía Jazz
    // ══════════════════════════════════════════════════════════════════════════

    // ── U21 M1: Jazz Chord Symbols and Extensions ─────────────────────────
    l7u21m1: {
      title: 'Cifrado Jazz y Extensiones',
      subtitle:
        'El lenguaje de acordes basado en letras del jazz — cualidades, extensiones y alteraciones',
      objectives: [
        'Leer y escribir cifrado jazz con fluidez, incluyendo indicadores de cualidad (maj7, m7, 7, ø7, o7)',
        'Construir acordes con extensiones (novena, oncena, trecena) y comprender el principio de apilamiento',
        'Distinguir entre extensiones (implican la séptima) y notas añadidas (sin séptima)',
        'Comprender cómo las alteraciones (b9, #9, #11, b13) modifican cromáticamente las extensiones',
      ],
      concepts: [
        {
          title: 'El Sistema de Cifrado Jazz',
          explanation:
            'El jazz utiliza un sistema basado en letras en lugar de números romanos. Una letra de fundamental (C, D, E...) va seguida de un indicador de cualidad: maj7 (o triángulo) para brillante y estable, m7 (o guion) para cálido y oscuro, 7 para tensión dominante, ø7 para semidisminuido inestable, y o7 para simetría disminuida. Este sistema es universal en lead sheets y fake books de jazz. Todo músico de jazz debe leer cifrado a primera vista — el cifrado ES el acorde.',
          tryThisLabel: 'Construye Cmaj7 — el acorde de séptima mayor brillante y estable',
        },
        {
          title: 'Extensiones: Novena, Oncena, Trecena',
          explanation:
            'Las extensiones son notas del acorde más allá de la séptima, construidas continuando el apilamiento de terceras por encima de la octava. La novena es una octava más una segunda, la oncena es una octava más una cuarta, y la trecena es una octava más una sexta. Un cifrado con 13 implica que la séptima, la novena y la trecena están presentes — la oncena generalmente se omite en acordes mayores y dominantes porque la oncena natural choca con la tercera mayor. Extensiones vs. notas añadidas: Cmaj9 implica séptima; Cadd9 no. Cada extensión añade riqueza armónica y especificidad al voicing.',
          tryThisLabel: 'Escucha G13 — extensiones apiladas hasta la trecena',
        },
        {
          title: 'Alteraciones: b9, #9, #11, b13',
          explanation:
            'Las alteraciones modifican cromáticamente las extensiones en acordes dominantes. La b9 oscurece el sonido, común en V7 que resuelve a menor. La #9 es el «acorde de Hendrix» con su timbre blues — en realidad una tercera menor sobre la fundamental, notada como novena aumentada. La #11 sustituye la oncena natural por un color lidio, evitando el choque tercera/oncena. La b13 crea un sonido dominante alterado y tenso, enarmónico con #5. Estas alteraciones dan a los músicos de jazz un control preciso sobre color y tensión en cualquier acorde dominante.',
          tryThisLabel: 'Construye C7b9 — dominante oscurecida que resuelve a menor',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe «Cmaj9», «Dm11» y «G13» uno tras otro. Para cada acorde, identifica la fundamental, la cualidad y qué extensiones están presentes. Observa cómo maj9 implica maj7, m11 implica m7+9+11 y 13 implica 7+9+13.',
        },
        {
          instruction:
            'Compara «Cmaj9» con «Cadd9». El primero implica séptima (C-E-G-B-D); el segundo no (C-E-G-D). Esta distinción — extensión vs. nota añadida — es fundamental para leer cifrado jazz correctamente.',
        },
        {
          instruction:
            'Construye una escalera de alteraciones dominantes: escribe «C7», luego «C7b9», luego «C7#9», luego «C7#11». Cada alteración modifica cromáticamente una extensión manteniendo el shell dominante (C-E-Bb) intacto.',
        },
      ],
    },

    // ── U21 M2: Shell Voicings and Altered Chords ─────────────────────────
    l7u21m2: {
      title: 'Voicings de Shell y Acordes Alterados',
      subtitle:
        'Shells de fundamental-tercera-séptima, el acorde alt y dominantes suspendidas',
      objectives: [
        'Construir voicings de shell (fundamental, tercera, séptima) para cada cualidad de acorde',
        'Comprender por qué el shell define el acorde — las extensiones son color, el shell es identidad',
        'Construir el acorde «alt» (7alt) y comprender su papel de tensión máxima',
        'Usar acordes sus4 y 7sus4 como voicings dominantes previos a la resolución',
      ],
      concepts: [
        {
          title: 'Voicings de Shell: Fundamental, Tercera, Séptima',
          explanation:
            'Los voicings de shell reducen el acorde a lo esencial: fundamental, tercera y séptima. Estas tres notas definen la cualidad — tercera mayor + séptima mayor = maj7, tercera menor + séptima menor = m7, tercera mayor + séptima menor = dominante 7. La quinta se omite porque no aporta información de cualidad (es justa en todos los tipos estándar). Las extensiones se superponen al shell. Los voicings de shell son el punto de partida para el acompañamiento de piano jazz y el chord-melody en guitarra: aprende los shells, luego vístelos con extensiones.',
          tryThisLabel: 'Construye Dm7 — escucha el shell menor (D, F, C)',
        },
        {
          title: 'El Acorde Alt: Tensión Cromática Máxima',
          explanation:
            'C7alt es un acorde de séptima dominante con todas las extensiones alteradas: b9, #9, #11 (enarmónico de b5) y b13 (enarmónico de #5). Concentra la tensión cromática máxima posible antes de la resolución — cada nota fuera del shell está cromáticamente desplazada. El acorde alt se empareja exclusivamente con la escala alterada (superlocria), que es el modo 7 de la menor melódica un semitono por encima de la fundamental (C alterada = Db menor melódica). Este es el sonido dominante de referencia para resolver a acordes menores en el jazz.',
          tryThisLabel: 'Construye C7alt — todas las extensiones alteradas',
        },
        {
          title: 'Dominantes Suspendidas: 7sus4',
          explanation:
            'El acorde 7sus4 sustituye la tercera por una cuarta en un acorde de séptima dominante, creando un sonido abierto y no resuelto. C7sus4 contiene C-F-G-Bb — sin Mi, por lo tanto sin identidad mayor/menor. En el jazz, el 7sus4 funciona como voicing previo a la resolución: la cuarta suspendida resuelve a la tercera, y luego el acorde entero resuelve al I. El 7sus4 también sirve como sonoridad modal de tendencia dórica: un acorde 9sus construido una quinta justa por encima de la fundamental de un acorde menor (la posición V-de-ii, por ejemplo G9sus sobre Dm o en su lugar) sustituye al acorde ii — Dm11/G es una grafía común del mismo sonido. El sus2 funciona de forma similar, sustituyendo la tercera por una segunda para una cualidad brillante y abierta.',
          tryThisLabel: 'Escucha G7sus4 — dominante suspendida, sin tercera',
        },
      ],
      tasks: [
        {
          instruction:
            'Construye shells en varias cualidades: escribe «Cmaj7», «Cm7», «C7», «Cm7b5». En cada uno, identifica la fundamental, tercera y séptima. La tercera y la séptima cambian — eso es lo que hace distinta cada cualidad.',
        },
        {
          instruction:
            'Escribe «C7alt» — es un acorde de séptima dominante con todas las extensiones alteradas (b9, #9, #11/b5, b13/#5). Cuenta las notas cromáticas en comparación con un C7 simple. Este acorde es tensión máxima antes de la resolución.',
        },
        {
          instruction:
            'Compara «G7» con «G7sus4» — el sus4 sustituye el B (tercera mayor) por C (cuarta justa). La función dominante se mantiene (la b7 sigue tirando hacia abajo), pero el sonido es abierto y no resuelto.',
        },
      ],
    },

    // ── U21 M3: The ii-V-I Progression ────────────────────────────────────
    l7u21m3: {
      title: 'La Progresión ii-V-I',
      subtitle:
        'La unidad fundamental de la armonía jazz — en tonalidades mayores y menores',
      objectives: [
        'Dominar la progresión ii-V-I en tonalidades mayores (Dm7-G7-Cmaj7)',
        'Dominar la progresión ii-V-i en tonalidades menores (Dm7b5-G7b9-Cm7)',
        'Comprender pares ii-V relacionados — todo V7 puede estar precedido por su ii',
        'Analizar estándares de jazz como cadenas de unidades ii-V-I, algunas completas, otras parciales',
      ],
      concepts: [
        {
          title: 'ii-V-I Mayor',
          explanation:
            'La ii-V-I es la unidad fundamental de la armonía jazz. En Do mayor: Dm7-G7-Cmaj7. El ii (Dm7) funciona como predominante, preparando el V7 (G7) cuyo trítono (B-F) crea tensión máxima, resolviendo a Cmaj7. La conducción de voces es notablemente suave: la tercera del ii (F) se convierte en la séptima del V, la séptima del ii (C) desciende a la tercera del V (B), y el trítono del V resuelve hacia dentro, hacia la fundamental y la tercera del I. Esta unidad de tres acordes impulsa virtualmente todos los estándares de jazz.',
          tryThisLabel: 'Inicia la ii-V-I: toca Dm7 (ii en Do)',
        },
        {
          title: 'ii-V-i Menor',
          explanation:
            'La ii-V-i menor utiliza el ii semidisminuido y un V dominante alterado. En Do menor: Dm7b5-G7b9-Cm7. El Dm7b5 (semidisminuido) tiene un color predominante más oscuro que el m7 del modo mayor. El G7b9 añade la b9 (Lab) — la alteración oscura y tensa que tira hacia una resolución menor. La b9 es la b6 de la tonalidad menor de destino, razón por la cual suena «correcta» al resolver a menor. Muchos músicos de jazz utilizan G7alt en lugar de G7b9 para una tensión cromática aún mayor.',
          tryThisLabel: 'Construye Dm7b5 — el ii semidisminuido para menor',
        },
        {
          title: 'Pares ii-V Relacionados',
          explanation:
            'Todo acorde de séptima dominante puede estar precedido por su ii relacionado — el m7 construido una cuarta justa por debajo de la fundamental del dominante (o una quinta por encima). Esto «prepara» el dominante y crea una conducción de voces más suave. Si una pieza tiene E7 que resuelve a algún lugar, puedes insertar Bm7 antes: Bm7-E7 es un par ii-V. Los músicos de jazz encadenan estos pares en centros tonales diferentes: Bm7-E7-Am7-D7-Gmaj7 es una cadena de pares ii-V en cascada por el ciclo de quintas, donde cada par apunta a la tonalidad siguiente.',
          tryThisLabel: 'Escucha G7 — el V de la ii-V-I en Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Construye una ii-V-I mayor en Do: escribe «Dm7», luego «G7», luego «Cmaj7». Escucha la tensión acumularse del ii al V y resolver en el I. El trítono en G7 (B y F) resuelve hacia dentro, hacia C y E.',
        },
        {
          instruction:
            'Ahora construye una ii-V-i menor en Do menor: escribe «Dm7b5», luego «G7b9», luego «Cm7». Compara la atmósfera — el ii semidisminuido y la alteración b9 oscurecen todo en comparación con la versión mayor.',
        },
        {
          instruction:
            'Encadena pares ii-V: escribe «Em7», «A7», «Dm7», «G7», «Cmaj7». Esta es una ii-V-I en cascada donde cada par apunta al siguiente — Em7-A7 apunta a Dm7, luego Dm7-G7 apunta a Cmaj7. El ciclo de quintas en acción.',
        },
      ],
    },

    // ── U21 M4: Tritone Substitution ──────────────────────────────────────
    l7u21m4: {
      title: 'Sustitución Tritonal',
      subtitle:
        'Sustituir dominantes a un trítono de distancia para movimiento cromático del bajo',
      objectives: [
        'Aplicar sustitución tritonal a cualquier acorde de séptima dominante',
        'Comprender por qué las sustituciones tritonales funcionan — trítono compartido entre los dos dominantes',
        'Añadir el ii relacionado del dominante sustituto para una línea cromática aún más rica',
        'Reconocer el dominante de la «puerta de atrás» (bVII7-I) como una técnica de rearmonización relacionada',
      ],
      concepts: [
        {
          title: 'La Sustitución Tritonal',
          explanation:
            'Se sustituye cualquier acorde de séptima dominante por el acorde de séptima dominante a un trítono de distancia. G7 que resuelve a C se convierte en Db7 que resuelve a C. Funciona porque G7 y Db7 comparten el mismo intervalo de trítono (B-F enarmónico de Cb-F) — el par de notas que impulsa la resolución. La fundamental y la quinta cambian, pero el motor del trítono permanece intacto. El movimiento cromático del bajo resultante (Db descendiendo a C) es más suave que el movimiento por ciclo de quintas (G a C), creando un descenso sofisticado por semitono.',
          tryThisLabel: 'Escucha Db7 — la sustitución tritonal de G7',
        },
        {
          title: 'Sustitución Tritonal con ii Relacionado',
          explanation:
            'Añadir el ii relacionado del dominante sustituto crea una línea cromática aún más rica. El ii de Db7 es Abm7, por lo que la ii-V-I completa con sustitución tritonal es: Abm7-Db7-Cmaj7. La línea del bajo desciende cromáticamente: Lab-Reb-Do. Compara con la original: Dm7-G7-Cmaj7 (bajo: Re-Sol-Do). Ambas llegan a Do, pero el camino de la sustitución tritonal es enteramente cromático. Los arreglistas de jazz mezclan frecuentemente ambos enfoques en la misma pieza.',
          tryThisLabel: 'Construye Abm7 — el ii relacionado de la sustitución tritonal',
        },
        {
          title: 'El Dominante de la Puerta de Atrás',
          explanation:
            'El dominante de la puerta de atrás (bVII7-I) aborda la tónica desde un tono por debajo en lugar de una quinta por encima. En Do: Bb7-Cmaj7. La tercera de Bb7 (Re) resuelve hacia arriba a la tercera de Cmaj7 (Mi), y la séptima de Bb7 (Lab) resuelve hacia abajo a la quinta de Cmaj7 (Sol). Esto crea una resolución sorprendente y cálida que evita la cadencia V7-I esperada. Habitual en estándares de jazz y bossa nova, el dominante de la puerta de atrás se entiende mejor como un préstamo del menor paralelo — es el dominante de bIII (Mib) que llega, en cambio, al I. Sus notas guía (Re y Lab) también existen en el dominante alterado de la tonalidad (G7b9), y por eso Bb7 tira tan convincentemente hacia Do: Re sube a Mi y Lab baja a Sol, ambas sensibles superiores hacia Cmaj7.',
          tryThisLabel: 'Escucha Bb7 — el dominante de la puerta de atrás en Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Aplica sustitución tritonal: toca «Dm7», luego «Db7», luego «Cmaj7». El Db7 sustituye a G7 — mismo trítono (F y B/Cb), pero con descenso cromático del bajo (D-Db-C) en lugar del ciclo de quintas (D-G-C).',
        },
        {
          instruction:
            'Construye la ii-V completa con sustitución tritonal: toca «Abm7», luego «Db7», luego «Cmaj7». La línea del bajo desciende Lab-Reb-Do — movimiento puramente cromático. Compara con la original Dm7-G7-Cmaj7.',
        },
        {
          instruction:
            'Prueba el dominante de la puerta de atrás: toca «Bb7» y luego «Cmaj7». El Bb7 resuelve HACIA ARRIBA un tono hasta Do en lugar de HACIA ABAJO una quinta. Suena cálido e inesperado — un final sorpresa favorito en baladas de jazz.',
        },
      ],
    },

    // ── U21 M5: Blues Forms ────────────────────────────────────────────────
    l7u21m5: {
      title: 'Formas de Blues',
      subtitle: 'El blues de 12 compases, jazz blues y blues menor',
      objectives: [
        'Tocar la forma básica del blues de 12 compases usando acordes de séptima dominante',
        'Comprender el enriquecimiento del jazz blues: inserciones ii-V, sustituciones tritonales, acordes disminuidos de paso',
        'Construir una forma de blues menor con acordes m7 y bVI7',
        'Reconocer por qué todos los acordes en el blues son dominantes — la tensión omnipresente ES el sonido del blues',
      ],
      concepts: [
        {
          title: 'El Blues de 12 Compases',
          explanation:
            'El blues de 12 compases es la forma más tocada en el jazz y la música popular. Se construye sobre tres acordes de séptima dominante: I7 durante cuatro compases, IV7 durante dos, I7 durante dos, luego V7-IV7-I7-V7 en los últimos cuatro. En Do: C7-C7-C7-C7 / F7-F7-C7-C7 / G7-F7-C7-G7. En la teoría clásica, solo el V debería ser dominante, pero en el blues TODOS los acordes son dominantes. Esa tensión dominante omnipresente — trítonos por todas partes, nada totalmente resuelto — ES el sonido del blues. Todo músico de jazz debe dominar esta forma en las 12 tonalidades.',
          tryThisLabel: 'Escucha C7 — el acorde de tónica del blues en Do',
        },
        {
          title: 'Jazz Blues',
          explanation:
            'El jazz blues enriquece la forma básica de 12 compases con inserciones ii-V, sustituciones tritonales y acordes disminuidos de paso. Un jazz blues habitual en Do: C7 / F7 / C7 / C7 / F7 / F#dim7 / C7 / Am7 / Dm7 / G7 / C7-Am7 / Dm7-G7. El #IVdim7 (F#dim7) funciona como acorde de paso cromático entre IV7 e I7. Los últimos cuatro compases se convierten en un turnaround con un ii-V (Dm7-G7) que recicla al inicio. El bird blues (Charlie Parker) añade aún más sustituciones y cadenas ii-V.',
          tryThisLabel: 'Construye F7 — el IV7 del blues en Do',
        },
        {
          title: 'Blues Menor',
          explanation:
            'El blues menor sustituye los acordes dominantes del I y IV por acordes m7, creando una atmósfera más oscura y melancólica. Un blues menor estándar en Do: Cm7-Cm7-Cm7-Cm7 / Fm7-Fm7-Cm7-Cm7 / Ab7-G7-Cm7-G7. El bVI7 (Ab7) sustituye al V7 en el compás 9, creando un acercamiento cromático al V7 (G7) en el compás 10. El blues menor es la base del hard bop y del soul jazz. La atmósfera general es más pesada e introspectiva que la del blues mayor.',
          tryThisLabel: 'Escucha Cm7 — la tónica del blues menor en Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Construye los cambios básicos del blues: toca «C7», «F7», «G7». Todos son acordes de séptima dominante — en la teoría clásica solo el V debería ser dominante, pero en el blues todos lo son. Esa tensión omnipresente ES el sonido del blues.',
        },
        {
          instruction:
            'Añade el acorde de paso del jazz blues: toca «F7», luego «F#dim7», luego «C7». El acorde disminuido enlaza el IV7 con el I7 mediante una subida cromática del bajo (F-F#-G, donde Sol es la quinta de Do). Este es el movimiento emblemático del jazz blues.',
        },
        {
          instruction:
            'Construye la cadencia del blues menor: toca «Ab7», luego «G7», luego «Cm7». El bVI7 (Ab7) desciende cromáticamente al V7 (G7), que resuelve a la tónica menor (Cm7). Esta cadencia bVI7-V7-i define el sonido del blues menor.',
        },
      ],
    },

    // ── U21 M6: Rhythm Changes and Turnarounds ───────────────────────────
    l7u21m6: {
      title: 'Rhythm Changes y Turnarounds',
      subtitle:
        'La forma AABA, patrones de turnaround y el ciclo de dominantes',
      objectives: [
        'Comprender los rhythm changes como una forma AABA de 32 compases',
        'Construir patrones de turnaround: I-vi-ii-V, cromático, acercamiento disminuido',
        'Analizar el puente de los rhythm changes como un ciclo de dominantes (III7-VI7-II7-V7)',
        'Aplicar turnarounds al final de cualquier sección para crear ciclos armónicos suaves',
      ],
      concepts: [
        {
          title: 'Rhythm Changes',
          explanation:
            'Los rhythm changes, derivados de Gershwin, son una de las dos formas más habituales en el jazz (la otra es el blues). Se trata de una estructura AABA de 32 compases. Las secciones A usan una progresión basada en turnaround: I-vi-ii-V en Sib mayor se convierte en Bbmaj7-Gm7-Cm7-F7. El puente (sección B) recorre dominantes en ciclo de cuartas: D7-G7-C7-F7 (III7-VI7-II7-V7). Este puente es uno de los grandes retos de la improvisación — cuatro centros tonales diferentes en ocho compases. Cientos de composiciones de jazz usan rhythm changes como base armónica.',
          tryThisLabel: 'Construye Bbmaj7 — la tónica de los rhythm changes',
        },
        {
          title: 'Patrones de Turnaround',
          explanation:
            'Un turnaround es una progresión corta (generalmente dos compases) al final de una sección que recicla al inicio. El turnaround básico es I-vi-ii-V: en Do, Cmaj7-Am7-Dm7-G7. Las variantes incluyen el turnaround cromático (I-bIII7-bVI7-bII7: Cmaj7-Eb7-Ab7-Db7) donde cada acorde es una sustitución tritonal, y el acercamiento disminuido (I-#Io7-ii-V: Cmaj7-C#dim7-Dm7-G7) donde el acorde disminuido proporciona un enlace cromático en el bajo. Cada turnaround crea una sensación satisfactoria de circularidad armónica.',
          tryThisLabel: 'Escucha Am7 — el vi en un turnaround en Do',
        },
        {
          title: 'El Ciclo de Dominantes',
          explanation:
            'El puente de los rhythm changes usa un ciclo de acordes de séptima dominante que se mueven en cuartas: D7-G7-C7-F7 en Sib. Cada dominante resuelve al siguiente como si fuera un V-I, pero el «I» es a su vez un acorde dominante, por lo que la resolución se aplaza perpetuamente. Esto crea impulso hacia adelante sin aterrizar nunca en una tónica estable. El ciclo de dominantes aparece por todo el jazz — en puentes, introducciones y pasajes de transición. Cada acorde dominante sugiere brevemente su propio centro tonal, convirtiéndolo en un terreno rico para la improvisación.',
          tryThisLabel: 'Construye D7 — el primer dominante en el ciclo del puente',
        },
      ],
      tasks: [
        {
          instruction:
            'Construye un turnaround en Do: toca «Cmaj7», «Am7», «Dm7», «G7». Este bucle I-vi-ii-V es la sección A de los rhythm changes (transpuesta de Sib). Observa cómo el G7 al final te arrastra de vuelta a Cmaj7.',
        },
        {
          instruction:
            'Construye el ciclo del puente de los rhythm changes: toca «D7», «G7», «C7», «F7». Cada dominante resuelve al siguiente por una cuarta — movimiento perpetuo. Prueba emparejar cada acorde con su escala mixolidia para ideas de improvisación.',
        },
        {
          instruction:
            'Aplica el turnaround cromático: toca «Cmaj7», «Eb7», «Ab7», «Db7». Cada acorde tras el I es una sustitución tritonal — Eb7 sustituye a A7, Ab7 sustituye a D7, Db7 sustituye a G7. Las fundamentales C-Eb-Ab-Db suben una tercera menor y luego dos cuartas justas — y el Db7 final resuelve medio tono abajo hacia Do, la recompensa cromática de las sustituciones.',
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // Unidad 22: Jazz Avanzado, Modal y Pop
    // ══════════════════════════════════════════════════════════════════════════

    // ── U22 M1: Chord-Scale Theory ────────────────────────────────────────
    l7u22m1: {
      title: 'Teoría Acorde-Escala',
      subtitle:
        'Emparejar escalas con cifrado — el núcleo de la improvisación jazz',
      objectives: [
        'Asignar a cada cualidad estándar de acorde sus escalas primarias y alternativas',
        'Comprender por qué ciertas escalas «funcionan» sobre ciertos acordes — notas comunes del acorde como base',
        'Aplicar la teoría acorde-escala para analizar e improvisar sobre progresiones ii-V-I',
        'Usar la escala alterada para acordes 7alt y la lidia dominante para acordes 7#11',
      ],
      concepts: [
        {
          title: 'El Mapa Acorde-Escala',
          explanation:
            'Cada acorde implica una o más escalas compatibles que proporcionan la paleta de notas para melodía e improvisación. Maj7 se empareja con jónico o lidio, m7 con dórico (más habitual), eólico o frigio. Dominante 7 se empareja con mixolidio, lidia dominante, alterada, tonos enteros o disminuida semitono/tono según el contexto armónico. Semidisminuido (m7b5) con locrio o locrio natural 2. Disminuido completo usa la escala disminuida tono/semitono. El m(maj7) con menor melódica o menor armónica. Este sistema es el núcleo de la pedagogía de improvisación jazz.',
          tryThisLabel: 'Observa la escala alterada — la escala para C7alt',
        },
        {
          title: 'Opciones Acorde-Escala para Dominantes',
          explanation:
            'El acorde de séptima dominante tiene el conjunto más rico de opciones de escala, determinado por el contexto armónico. Dominante no alterado (que resuelve normalmente) usa mixolidio. Dominante con #11 usa lidia dominante (modo 4 de la menor melódica). Dominante que resuelve a menor usa alterada o frigio dominante. Dominante con b9 en contexto disminuido usa disminuida semitono/tono. Dominante con sonoridad de tonos enteros usa la escala de tonos enteros. La elección no es arbitraria — depende de hacia dónde resuelve el acorde y qué extensiones especifica el cifrado.',
          tryThisLabel: 'Escucha lidia dominante — el sonido dominante con #11',
        },
        {
          title: 'Alineación Acorde-Escala en ii-V-I',
          explanation:
            'En una ii-V-I mayor en Do, la alineación acorde-escala es: Dm7 = Re dórico, G7 = Sol mixolidio, Cmaj7 = Do jónico (o Do lidio). Las tres escalas comparten las mismas notas — son modos de Do mayor. Esto significa que el improvisador puede pensar en una sola tonalidad a lo largo de toda la progresión. En modo menor, la alineación cambia: Dm7b5 = Re locrio nat.2, G7alt = Sol alterada (Lab menor melódica), Cm(maj7) = Do menor melódica. Ahora tres conjuntos de notas diferentes están en juego, exigiendo un pensamiento más rápido.',
          tryThisLabel: 'Observa Re dórico — la escala de acorde para Dm7 en Do mayor',
        },
      ],
      tasks: [
        {
          instruction:
            'Empareja acorde con escala: escribe «Dm7» (dórico), luego «D dorian» para ver la escala. Ahora prueba «G7» (mixolidio) y «G mixolydian». Las notas del acorde están dentro de la escala — esto es la alineación acorde-escala.',
        },
        {
          instruction:
            'Explora la dominante alterada: escribe «C altered scale», luego «C7alt». Cada nota del acorde está contenida en la escala. Para encontrar rápidamente cualquier escala alterada: toca menor melódica un semitono por encima de la fundamental (C alterada = Db menor melódica).',
        },
        {
          instruction:
            'Compara dos escalas dominantes: escribe «G mixolydian» (dominante no alterada) y luego «G altered scale» (alteración máxima). Mixolidio es brillante y estable; alterada es oscura y cromática. El contexto determina cuál usar.',
        },
      ],
    },

    // ── U22 M2: Upper Structures and Reharmonization ──────────────────────
    l7u22m2: {
      title: 'Estructuras Superiores y Rearmonización',
      subtitle:
        'Voicings de acordes complejos con tríadas simples, y enriquecimiento de progresiones',
      objectives: [
        'Construir tríadas de estructura superior sobre notas de bajo dominantes para voicings de extensiones',
        'Comprender cómo la tríada superior crea extensiones específicas sin deletrear cada nota',
        'Aplicar rearmonización básica: sustituir acordes dentro de la misma función',
        'Usar sustituciones tritonales, dominantes secundarios y acordes de paso para enriquecer progresiones simples',
      ],
      concepts: [
        {
          title: 'Tríadas de Estructura Superior',
          explanation:
            'El voicing de estructura superior coloca una tríada simple en el registro agudo sobre una nota de bajo y guide tones en el registro grave. La tríada crea extensiones específicas sin deletrear cada nota individualmente. Una tríada de Re mayor sobre un bajo de C7 resulta en C13#11 — las notas Re, Fa# y La se convierten en la novena, la #11 y la trecena. Una tríada de Mib mayor sobre C7 produce C7#9b13. Una tríada de Lab mayor sobre C7 crea C7b9b13. La tríada superior se elige por las extensiones que genera, no por su propia identidad. Esta técnica permite a pianistas y arreglistas de jazz voicings complejos con formas simples.',
          tryThisLabel: 'Construye C13 — escucha las extensiones que crea una estructura superior',
        },
        {
          title: 'Principios de Rearmonización',
          explanation:
            'La rearmonización sustituye los acordes originales de una melodía por acordes diferentes que continúan soportando las notas melódicas. Las notas de la melodía se convierten en extensiones diferentes de los nuevos acordes. Técnicas básicas: sustituir acordes dentro de la misma función (iii por I, vi por IV), añadir dominantes secundarios antes de acordes objetivo, insertar sustituciones tritonales, usar acordes disminuidos de paso entre acordes diatónicos y aplicar movimiento cromático en el bajo. Toda rearmonización debe preservar la melodía — la nota melódica debe ser una nota del acorde o una extensión aceptable del nuevo acorde.',
          tryThisLabel: 'Construye Em7 — un iii que puede sustituir a Cmaj7',
        },
        {
          title: 'Líneas Cromáticas de Bajo y Acordes de Paso',
          explanation:
            'Una de las herramientas de rearmonización más poderosas es crear una línea cromática de bajo insertando acordes de paso. Entre Do y Rem, se inserta C#dim7 — el bajo camina Do-Do#-Re. Entre Fa y Mim, se inserta F#dim7 (o Fmaj7-F#dim7-Em7). Los acordes de séptima disminuida son los acordes de paso más versátiles porque cada acorde disminuido es enarmónicamente equivalente a otros tres (debido a la construcción simétrica), enlazándose con múltiples destinos. Combinado con sustituciones tritonales y dominantes secundarios, el movimiento cromático del bajo transforma progresiones diatónicas simples en armonía jazz rica.',
          tryThisLabel: 'Escucha C#dim7 — un acorde de paso cromático',
        },
      ],
      tasks: [
        {
          instruction:
            'Explora estructuras superiores: escribe «C13» — este es el sonido de una tríada de Re mayor (D-F#-A = 9-#11-13) sobre un shell de C7 (C-E-Bb). El cifrado complejo se realiza con una tríada simple por encima.',
        },
        {
          instruction:
            'Prueba una sustitución de función: toca «Cmaj7» y luego «Em7». Ambos son acordes con función de tónica en Do mayor — Em7 comparte tres notas con Cmaj7 (E-G-B) pero aporta un color diferente. Esta es la rearmonización más sencilla.',
        },
        {
          instruction:
            'Construye una línea de acordes de paso cromática: toca «Cmaj7», luego «C#dim7», luego «Dm7». El acorde disminuido crea una subida cromática del bajo (C-C#-D) y cada voz se mueve por semitono o se mantiene igual.',
        },
      ],
    },

    // ── U22 M3: Coltrane Changes and Advanced Jazz Harmony ────────────────
    l7u22m3: {
      title: 'Cambios de Coltrane y Armonía Jazz Avanzada',
      subtitle:
        'La matriz de Giant Steps, estructura constante y arquitectura de tres centros tonales',
      objectives: [
        'Analizar la matriz de Coltrane (Giant Steps) — tres centros tonales mayores a una tercera mayor de distancia',
        'Comprender por qué cada centro tonal es abordado por su acorde dominante V7',
        'Reconocer la estructura constante como técnica relacionada — movimiento paralelo de acordes independientemente de la tonalidad',
        'Apreciar el reto improvisatorio de navegar tres centros tonales a tempo rápido',
      ],
      concepts: [
        {
          title: 'La Matriz de Giant Steps',
          explanation:
            'John Coltrane concibió progresiones que recorren tres centros tonales mayores separados por terceras mayores, dividiendo la octava en tres partes iguales. La progresión de Giant Steps: Bmaj7-D7-Gmaj7-Bb7-Ebmaj7-F#7-Bmaj7, tocando en las tonalidades de Si, Sol y Mib. Cada centro tonal es abordado por su acorde V7. El resultado es un ritmo armónico extremadamente rápido que exige pensar en tres tonalidades simultáneamente — uno de los grandes retos de la improvisación jazz y la cima del dominio acorde-escala.',
          tryThisLabel: 'Empieza en Bmaj7 — el primer centro tonal',
        },
        {
          title: 'Estructura Constante',
          explanation:
            'La estructura constante mueve la misma cualidad de acorde cromáticamente o mediante algún patrón de intervalos independientemente de la tonalidad. Cmaj7-Dbmaj7-Dmaj7-Ebmaj7 (séptimas mayores ascendentes) crea conducción de voces paralela (planing) con un color jazz moderno. Esta técnica abandona la armonía funcional por completo — no hay tonalidad, solo movimiento. Wayne Shorter y Herbie Hancock usaron estructura constante de manera extensiva. Está relacionada con los cambios de Coltrane en el sentido de que ambas tratan el movimiento de acordes como patrones geométricos en lugar de progresiones funcionales.',
          tryThisLabel: 'Escucha Dbmaj7 — estructura constante en movimiento',
        },
        {
          title: 'Improvisación en Tres Centros Tonales',
          explanation:
            'Improvisar sobre cambios de Coltrane requiere pensar en tres tonalidades simultáneamente a tempo rápido. El enfoque estándar: tocar la escala mayor (o pentatónica) de cada centro tonal durante la duración de ese acorde, cambiando instantáneamente cuando la armonía se mueve. Enfoques más avanzados utilizan envolvimientos, patrones digitales (1235, 1357) y pentatónicas superpuestas. La dificultad reside en la velocidad del ritmo armónico — cada centro tonal puede durar solo dos tiempos. Este es el Everest de la improvisación jazz, que exige dominio total de las 12 tonalidades.',
          tryThisLabel: 'Escucha Gmaj7 — el segundo centro tonal',
        },
      ],
      tasks: [
        {
          instruction:
            'Sigue el ciclo de Coltrane: toca «Bmaj7», «D7», «Gmaj7», «Bb7», «Ebmaj7», «F#7». Los tres centros tonales (Si, Sol, Mib) distan una tercera mayor — dividen la octava en tres partes iguales.',
        },
        {
          instruction:
            'Verifica la geometría de los tres centros: toca «B major chord», «G major chord», «Eb major chord». Estas tres fundamentales (Si, Sol, Mib) forman una tríada aumentada — la división más simétrica de la octava en tres partes.',
        },
        {
          instruction:
            'Explora estructura constante: toca «Cmaj7», «Dbmaj7», «Dmaj7», «Ebmaj7». La misma cualidad de acorde se mueve cromáticamente — movimiento paralelo que abandona la armonía funcional por completo. Escucha el cambio de color a medida que la fundamental sube.',
        },
      ],
    },

    // ── U22 M4: Modal Harmony Fundamentals ────────────────────────────────
    l7u22m4: {
      title: 'Fundamentos de Armonía Modal',
      subtitle:
        'Componer fuera de la gravedad tonal — modos como sistemas armónicos',
      objectives: [
        'Distinguir armonía modal de armonía tonal y comprender por qué se evita el V-I',
        'Identificar la nota característica de cada modo y usarla para seleccionar acordes',
        'Construir progresiones de acordes modales que preserven el color modal',
        'Usar pedales, notas tenidas y patrones de ostinato para anclar la tónica modal',
      ],
      concepts: [
        {
          title: 'Pensamiento Modal vs. Tonal',
          explanation:
            'En la música tonal, la relación V-I define la tonalidad y crea la atracción gravitacional que organiza toda la armonía. En la música modal, el V-I se evita deliberadamente porque colapsa el color modal de vuelta a la tonalidad mayor o menor. La armonía modal establece la tónica mediante repetición, pedales, notas tenidas y relaciones de acordes no dominantes. Miles Davis, McCoy Tyner y Herbie Hancock construyeron composiciones enteras sobre este principio — «So What» usa solo dos acordes sobre un pedal dórico. El modo en sí ES la armonía.',
          tryThisLabel: 'Observa Re dórico — el pilar modal del jazz',
        },
        {
          title: 'Notas Características',
          explanation:
            'Cada modo tiene una nota que lo distingue del mayor simple o del menor natural — la nota característica. El dórico tiene una sexta elevada en comparación con el menor natural (la nota que lo hace más brillante). El frigio tiene una segunda rebajada (oscuro, sabor español). El lidio tiene una cuarta elevada (brillante, flotante, onírico). El mixolidio tiene una séptima rebajada (blues, rock). En la teoría tonal estas son «notas a evitar», pero en la escritura modal son las notas esenciales que deben enfatizarse tanto en la melodía como en las elecciones de acordes para establecer el modo.',
          tryThisLabel: 'Escucha Fa lidio — la cuarta elevada lo define',
        },
        {
          title: 'Progresiones de Acordes Modales',
          explanation:
            'Cada modo soporta movimientos de acordes específicos que refuerzan su color. El acorde de color característico del dórico es el IV mayor sobre la tónica i — la sexta elevada vive en él (Dm-G-Dm); ii y bVII funcionan como colores secundarios. El frigio se centra en i y bII — el bII está un semitono por encima de la tónica, la firma sonora del frigio (Em-F-Em). El acorde de color característico del lidio es el II mayor sobre la tónica I — la cuarta elevada vive en él (C-D-C); vii comparte esa cuarta elevada como color secundario. El mixolidio se apoya en I y bVII — la séptima rebajada está en el acorde bVII (G-F-Dm-G). Evita cualquier acorde que implique resolución dominante-tónica.',
          tryThisLabel: 'Observa Sol mixolidio — bVII es el acorde clave',
        },
      ],
      tasks: [
        {
          instruction:
            'Escribe «D dorian» e identifica la nota característica (Si natural — la sexta elevada). Ahora escribe «D natural minor scale» y compara — solo una nota difiere. Esa única nota define el sonido dórico.',
        },
        {
          instruction:
            'Escribe «E phrygian» — la nota característica es Fa (la segunda rebajada). Construye un vamp frigio: toca «Em» y luego «F major chord» y vuelve a «Em». El movimiento de la fundamental por semitono es la firma del frigio.',
        },
        {
          instruction:
            'Compara «F lydian» con «F major scale» — la única diferencia es la cuarta elevada (Si natural en lugar de Sib). Esa única nota transforma todo el carácter armónico de mayor estable a lidio flotante.',
        },
      ],
    },

    // ── U22 M5: Quartal/Quintal Voicings and Drones ──────────────────────
    l7u22m5: {
      title: 'Voicings Cuartales/Quintales y Pedales',
      subtitle:
        'Apilar cuartas y quintas para sonidos modales ambiguos y abiertos',
      objectives: [
        'Construir voicings cuartales (cuartas justas apiladas) y comprender su ambigüedad armónica',
        'Comprender voicings quintales como cuartas invertidas — quintas justas apiladas para un sonido abierto y espacioso',
        'Usar pedales y notas tenidas para anclar composiciones modales sin función dominante',
        'Reconocer los voicings cuartales como la técnica de firma de McCoy Tyner en el jazz modal',
      ],
      concepts: [
        {
          title: 'Voicings Cuartales',
          explanation:
            'Los acordes cuartales se construyen apilando cuartas justas en lugar de terceras. Un voicing cuartal sobre Re: Re-Sol-Do-Fa. Puede implicar Dm7, Dm11 o simplemente una sonoridad cuartal flotante sin identidad mayor/menor clara. La ambigüedad es intencional y perfecta para la música modal — los voicings cuartales no tiran hacia la resolución como las tríadas. McCoy Tyner construyó toda su sonoridad de firma sobre apilamientos cuartales, moviéndolos frecuentemente en paralelo sobre un pedal de bajo. En la mano derecha: cuartas. En la mano izquierda: la tónica modal como pedal.',
          tryThisLabel: 'Escucha Dm11 — un apilamiento cuartal en forma de acorde',
        },
        {
          title: 'Voicings Quintales y Espaciado Abierto',
          explanation:
            'Los voicings quintales apilan quintas justas: Re-La-Mi-Si. Esta es la inversión de un voicing cuartal (Re-Sol-Do-Fa invertido en quintas abiertas). El sonido es espacioso, abierto y orquestal. Los voicings quintales aparecen en la música clásica del siglo XX (Bartók, Hindemith) y en el jazz modal. Los intervalos amplios crean transparencia — cada nota tiene espacio para resonar. Combinados con un pedal de bajo, los voicings quintales sugieren modalidad sin comprometerse con ninguna cualidad de acorde específica.',
          tryThisLabel: 'Escucha un power chord de Re — el apilamiento de quintas más simple',
        },
        {
          title: 'Pedales y Notas Tenidas',
          explanation:
            'Un pedal es una nota de bajo sostenida o repetida sobre la cual las armonías superiores cambian libremente. Una nota tenida (drone) es un sonido continuo que ancla el centro tonal. En la música modal, pedales y drones sustituyen la función dominante — la tónica se establece por pura persistencia en lugar de gravedad armónica. La música clásica india está enteramente construida sobre un drone (la tanpura). Miles Davis usó pedales en el jazz modal para liberar la armonía de cambios de acordes funcionales, permitiendo al solista explorar el modo libremente.',
          tryThisLabel: 'Observa Re menor natural — una escala sobre un pedal de Re',
        },
      ],
      tasks: [
        {
          instruction:
            'Construye un sonido cuartal: escribe «Dm11» — contiene las notas Re-Sol-Do-Fa cuando se voicea en cuartas. Compara con «Dm7» — la extensión de oncena añade el apilamiento cuartal que crea la cualidad abierta y ambigua.',
        },
        {
          instruction:
            'Explora el power chord como apilamiento mínimo de quintas: escribe «C5», luego «D5», luego «E5». Los power chords no son mayores ni menores — quintas puras sin tercera. Este es el pensamiento quintal en su forma más básica.',
        },
        {
          instruction:
            'Compara «D dorian» con «D natural minor scale». Sobre un pedal en Re, la sexta elevada del dórico (Si natural) crea un color modal más brillante. El pedal ancla Re como tónica mientras la escala define el modo.',
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // Unidad 23: Armonía Pop y Taxonomía Completa
    // ══════════════════════════════════════════════════════════════════════════

    // ── U23 M1: Pop Progressions and Nashville Numbers ────────────────────
    l7u23m1: {
      title: 'Progresiones Pop y Números de Nashville',
      subtitle:
        'Bucles de acordes pop, el sistema de números de Nashville y armonía basada en bucles',
      objectives: [
        'Analizar las progresiones pop más habituales y sus firmas emocionales',
        'Comprender el sistema de números de Nashville y usarlo para transposición instantánea',
        'Reconocer la armonía basada en bucles como enfoque distinto — el bucle ES la armonía',
        'Identificar el Axis (I-V-vi-IV), Sensitive (vi-IV-I-V) y otros bucles pop estándar',
      ],
      concepts: [
        {
          title: 'Progresiones Pop Habituales',
          explanation:
            'La música pop se apoya en un pequeño conjunto de bucles de acordes con firmas emocionales distintas. La progresión I-V-vi-IV «Axis» suena edificante y himnica. Su rotación vi-IV-I-V («Sensitive») suena emocional y moderna. I-bVII-IV produce una sensación mixolidia, blues rock. La cadencia «Andaluza» i-bVII-bVI-V — un bajo descendente por grados conjuntos desde la tónica hasta la dominante, directamente del flamenco — suena oscura y cinematográfica. I-vi-IV-V es la progresión clásica de los años 50, nostálgica y cálida. Estos bucles se repiten a lo largo de secciones enteras — la variación armónica proviene de la melodía, la producción y el arreglo en lugar de cambios de acordes.',
          tryThisLabel: 'Empieza con el acorde I de una progresión pop en Do',
        },
        {
          title: 'Números de Nashville y Armonía de Bucle',
          explanation:
            'El sistema de números de Nashville simplifica los números romanos para músicos de sesión: números simples para acordes mayores (1, 4, 5), un guion para menor (2-, 6-), 7 en superíndice para acordes de séptima. La tonalidad se indica una vez en la parte superior del cifrado y todo lo demás es relativo — «1 5 6- 4» en la tonalidad de Sol significa Sol-Re-Mim-Do. Esto permite transposición instantánea: cambia la declaración de tonalidad y toca los mismos números. El pop moderno se basa en bucles de 2-4 acordes que se repiten a lo largo de una sección entera. El bucle proporciona estabilidad armónica; toda la variación ocurre en las capas superiores.',
          tryThisLabel: 'Lam es el vi en Do — el centro emocional del pop',
        },
        {
          title: 'Rotaciones de Bucle y Cambios Emocionales',
          explanation:
            'Los mismos cuatro acordes producen efectos emocionales diferentes según cuál acorde inicia el bucle. I-V-vi-IV empezando en el I suena triunfante y resuelto. vi-IV-I-V empezando en el vi suena vulnerable y anhelante. IV-V-vi-IV (empezando en el IV) crea una sensación de aspiración. El acorde inicial define dónde se sitúa el «hogar» emocional dentro del bucle. En la producción pop, el acorde inicial se alinea frecuentemente con el gancho de la melodía vocal, reforzando la forma emocional de la letra.',
          tryThisLabel: 'Construye Fa — el acorde IV que impulsa la resolución pop',
        },
      ],
      tasks: [
        {
          instruction:
            'Construye la progresión Axis en Do: toca «C major chord», «G major chord», «Am», «F major chord». Este bucle de cuatro acordes sustenta cientos de éxitos pop — la estructura I-V-vi-IV.',
        },
        {
          instruction:
            'Ahora rota a la versión Sensitive: toca «Am», «F major chord», «C major chord», «G major chord». Los mismos cuatro acordes (vi-IV-I-V), pero empezar en el acorde menor crea un paisaje emocional completamente diferente.',
        },
        {
          instruction:
            'Prueba el bucle rock mixolidio: toca «C major chord», «Bb major chord», «F major chord». Este patrón I-bVII-IV usa un bVII prestado del paralelo menor, dándole una sensación blues de rock clásico.',
        },
      ],
    },

    // ── U23 M2: Modal Mixture and Chromatic Mediants in Pop ───────────────
    l7u23m2: {
      title: 'Mezcla Modal y Mediantes Cromáticas en el Pop',
      subtitle:
        'Acordes prestados en el pop y rock, mediantes cromáticas en bandas sonoras',
      objectives: [
        'Aplicar mezcla modal (acordes prestados del paralelo menor) en contextos pop y rock',
        'Reconocer el iv menor, bVI y bVII como los acordes prestados más habituales en el pop',
        'Comprender mediantes cromáticas (acordes relacionados por tercera mayor) y sus cambios dramáticos de color',
        'Identificar la «cadencia Mario» (bVI-bVII-I) y modulaciones directas en la composición contemporánea',
      ],
      concepts: [
        {
          title: 'Mezcla Modal en el Pop',
          explanation:
            'Los acordes prestados del paralelo menor aparecen constantemente en el pop y el rock. El iv menor sustituyendo al IV mayor crea el sonido de «corazón roto» — Fam en una canción en Do mayor cambia instantáneamente la atmósfera a agridulce. La b6 de la escala (Lab en Do) hace el trabajo emocional, tirando del sonido mayor brillante hacia la oscuridad menor sin comprometerse del todo. bVI y bVII son pilares del rock y del cine: la progresión bVI-bVII-I (Lab-Sib-Do en Do) es la «cadencia Mario», una marca del rock de los años 80 con su bajo ascendente triunfante.',
          tryThisLabel: 'Escucha Fam — iv prestado en Do mayor',
        },
        {
          title: 'Mediantes Cromáticas en el Cine y en el Pop',
          explanation:
            'Las mediantes cromáticas son acordes cuyas fundamentales distan una tercera mayor o menor y que comparten cero o una nota en común. Do mayor a Lab mayor (descenso de tercera mayor) crea un oscurecimiento súbito — usado en bandas sonoras para misterio o presentimiento. Do mayor a Mi mayor (ascenso de tercera mayor) ilumina dramáticamente — el sonido de «maravilla» en bandas sonoras de fantasía. Estos cambios funcionan porque el oído espera relaciones diatónicas; la mediante cromática es suficientemente cercana para estar relacionada pero suficientemente lejana para sorprender. El pop las usa como cambios de acorde sorpresa entre secciones.',
          tryThisLabel: 'Escucha Lab mayor — la mediante cromática bVI en Do',
        },
        {
          title: 'Modulación Directa y Cambios de Tonalidad Abruptos',
          explanation:
            'La modulación directa cambia la tonalidad abruptamente — sin acorde pivote, sin preparación. La forma más habitual es la «modulación del camionero»: el último estribillo salta un semitono (o un tono) para un impulso de energía. Funciona por la pura novedad — el brillo repentino de una tonalidad más aguda se registra como escalada emocional. Modulaciones directas más sofisticadas usan mediantes cromáticas: un verso en Do mayor que salta al puente en Lab mayor crea un cambio dramático de atmósfera sin ningún acorde de transición.',
          tryThisLabel: 'Escucha Reb — un destino de cambio de tonalidad por semitono por encima de Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Aplica mezcla modal: sustituye Fa mayor (IV) por «Fm» (iv, prestado de Do menor). Escucha cómo la atmósfera cambia de brillante a agridulce — el Lab en Fm es la b6 prestada haciendo el trabajo emocional.',
        },
        {
          instruction:
            'Construye la cadencia Mario en Do: toca «Ab major chord» (bVI), «Bb major chord» (bVII), «C major chord» (I). Tanto Lab como Sib son prestados de Do menor. El bajo ascendente (Lab-Sib-Do) crea una llegada triunfante.',
        },
        {
          instruction:
            'Prueba un cambio de mediante cromática: toca «C major chord» y luego «E major chord». La fundamental sube una tercera mayor, compartiendo solo una nota en común (Mi). Este es el cambio de «maravilla» — usado en bandas sonoras para momentos mágicos o inspiradores.',
        },
      ],
    },

    // ── U23 M3: Scales: Melodic Minor Modes ──────────────────────────────
    l7u23m3: {
      title: 'Escalas: Modos de la Menor Melódica',
      subtitle:
        'Siete modos de la menor melódica y sus aplicaciones en el jazz',
      objectives: [
        'Recorrer los siete modos de la escala menor melódica ascendente',
        'Emparejar cada modo con su aplicación primaria acorde-escala en el jazz',
        'Usar la lidia dominante (modo 4) para acordes dominantes 7#11',
        'Usar la escala alterada (modo 7) para acordes 7alt — el sonido dominante más cromático',
      ],
      concepts: [
        {
          title: 'La Escala Madre Menor Melódica',
          explanation:
            'La escala menor melódica ascendente eleva tanto la sexta como la séptima del menor natural, creando una escala con tercera menor pero sexta y séptima mayores. Su patrón de intervalos (T-S-T-T-T-T-S) genera siete modos, cada uno con un carácter distinto y aplicación en el jazz. El modo 1 (la propia menor jazz) se empareja con acordes menor-mayor 7 — el sonido m(maj7). A diferencia de los modos diatónicos que comparten todos las mismas notas, los modos de la menor melódica poseen cada uno un sabor cromático único que los hace esenciales para navegar la armonía jazz alterada.',
          tryThisLabel: 'Observa Do menor melódica — la escala madre de 7 modos',
        },
        {
          title: 'Lidia Dominante y Mixolidio b6',
          explanation:
            'El modo 4 de la menor melódica es la lidia dominante (#4 y b7) — la escala de referencia para acordes dominantes 7#11. Combina la cuarta elevada del lidio con la séptima rebajada del mixolidio, creando un sonido dominante brillante sin choque tercera/oncena. El modo 5 es el mixolidio b6 (también llamado hindú o eólico dominante) — funciona sobre dominantes que resuelven a menor, proporcionando una b6 que anticipa la tonalidad menor de destino. Ambos modos están en el corazón de la improvisación jazz sobre dominantes con extensiones específicas.',
          tryThisLabel: 'Escucha lidia dominante — modo 4 de la menor melódica',
        },
        {
          title: 'La Escala Alterada (Superlocria)',
          explanation:
            'El modo 7 de la menor melódica es la escala alterada, también llamada superlocria. Su fórmula desde la fundamental: S-T-S-T-T-T-T. Contiene todas las alteraciones posibles de un acorde dominante: b9, #9, b5 (#11) y #5 (b13). La escala alterada se empareja exclusivamente con acordes 7alt y ES el sonido esencial para dominantes que resuelven a menor con tensión máxima. El atajo: la escala alterada en cualquier fundamental equivale a la escala menor melódica comenzando un semitono más arriba (Do alterada = Reb menor melódica). El locrio natural 2 (modo 6) es la escala estándar para acordes semidisminuidos.',
          tryThisLabel: 'Observa la escala alterada — modo 7 de la menor melódica',
        },
      ],
      tasks: [
        {
          instruction:
            'Explora la familia de la menor melódica: escribe «C melodic minor», luego «C lydian dominant», luego «C altered scale». Son los modos 1, 4 y 7 de la misma escala madre (en fundamentales diferentes). Cada uno tiene un carácter completamente distinto.',
        },
        {
          instruction:
            'Verifica el atajo de la escala alterada: escribe «C altered scale», luego «Db melodic minor». Contienen las mismas notas — la escala alterada en cualquier fundamental es la menor melódica un semitono más arriba. Esta es la forma más rápida de encontrar cualquier escala alterada.',
        },
        {
          instruction:
            'Empareja modo con acorde: escribe «C lydian dominant» junto a «C7#11». Todas las notas del acorde están dentro de la escala. Ahora prueba «C altered scale» junto a «C7alt». La escala contiene todas las extensiones alteradas — alineación perfecta.',
        },
      ],
    },

    // ── U23 M4: Scales: Harmonic Minor Modes, Symmetric, and World ───────
    l7u23m4: {
      title: 'Escalas: Modos de la Menor Armónica, Simétricas y del Mundo',
      subtitle:
        'Modos de la menor armónica, tonos enteros, disminuida y escalas del mundo',
      objectives: [
        'Recorrer los siete modos de la menor armónica y reconocer la firma de la segunda aumentada',
        'Comprender escalas simétricas (tonos enteros, disminuida) y sus transposiciones limitadas',
        'Explorar escalas del mundo y étnicas: doble armónica mayor, húngara menor, persa y más',
        'Usar el frigio dominante (modo 5 de la menor armónica) para sonidos de flamenco, klezmer y Oriente Medio',
      ],
      concepts: [
        {
          title: 'Modos de la Menor Armónica',
          explanation:
            'La menor armónica genera siete modos, cada uno marcado por un intervalo distintivo de segunda aumentada que les da un color exótico. El 5.o modo, frigio dominante, se usa ampliamente en el flamenco, klezmer y música de Oriente Medio — tiene una tercera mayor sobre una base frigia, creando un sonido simultáneamente brillante y oscuro. El 4.o modo, dórico #4 (dórico ucraniano), aparece en las tradiciones folclóricas de Europa del Este. El 6.o modo, lidio #2, comienza con una segunda aumentada que suena inmediatamente distintiva. Cada modo tiene un emparejamiento acorde-escala definido y un contexto cultural característico.',
          tryThisLabel: 'Escucha frigio dominante — flamenco y klezmer',
        },
        {
          title: 'Escalas Simétricas: Tonos Enteros y Disminuida',
          explanation:
            'Las escalas simétricas tienen patrones de intervalos repetitivos que limitan sus transposiciones. La escala de tonos enteros (T-T-T-T-T-T) tiene solo 2 formas únicas y produce un sonido onírico, no resuelto, tipo Debussy — 6 notas, sin semitonos, sin atracción fuerte en ninguna dirección. La escala disminuida viene en dos variedades: semitono/tono (S-T-S-T-S-T-S-T) y tono/semitono (T-S-T-S-T-S-T-S), con solo 3 formas únicas cada una. La versión semitono/tono se empareja con acordes dominantes b9; la versión tono/semitono con acordes de séptima disminuida. Ambas tienen 8 notas y dividen la octava en cuatro partes iguales.',
          tryThisLabel: 'Escucha la escala de tonos enteros — 6 notas, 2 formas únicas',
        },
        {
          title: 'Escalas del Mundo y Étnicas',
          explanation:
            'Más allá de las escalas funcionales occidentales, el motor incluye escalas de diversas tradiciones musicales. La doble armónica mayor (1-b2-3-4-5-b6-7) se usa en la música de Oriente Medio, romaní e india — dos segundas aumentadas crean un sabor intensamente exótico. La húngara menor (1-2-b3-#4-5-b6-7) presenta la cuarta elevada combinada con cualidad menor. La persa (1-b2-3-4-b5-b6-7) tiene un color oscuro distintivo. Las napolitana menor y mayor proporcionan la segunda rebajada de la armonía napolitana. Cada escala transporta su origen cultural en sus intervalos.',
          tryThisLabel: 'Escucha húngara menor — cuarta elevada en una escala menor',
        },
      ],
      tasks: [
        {
          instruction:
            'Explora el frigio dominante: escribe «C phrygian dominant». Tiene una b2 (Reb) y una tercera mayor (Mi) — la segunda aumentada entre ellas es el intervalo firma. Este es el sonido de flamenco/klezmer. Compara con «C phrygian» para escuchar la diferencia que hace la tercera mayor.',
        },
        {
          instruction:
            'Escribe «C whole tone scale» — observa que tiene solo 6 notas y ningún semitono. Ahora escribe «Db whole tone scale». Estas son las únicas dos escalas de tonos enteros únicas; cualquier otra fundamental duplica una de ellas. Simetría total significa ambigüedad total.',
        },
        {
          instruction:
            'Compara escalas del mundo: escribe «C double harmonic major», luego «C hungarian minor». Ambas presentan segundas aumentadas pero en posiciones diferentes, creando caracteres melódicos muy distintos. El motor tiene 46 escalas — explora libremente.',
        },
      ],
    },

    // ── U23 M5: Complete Chord Taxonomy ───────────────────────────────────
    l7u23m5: {
      title: 'Taxonomía Completa de Acordes',
      subtitle:
        'Los 42 tipos de acordes — extensiones, suspensiones, notas añadidas y estructuras especiales',
      objectives: [
        'Construir cualquier acorde con extensiones (novena, oncena, trecena) en cualquier cualidad a partir de una fundamental',
        'Comprender acordes suspendidos y de nota añadida y cómo difieren de las extensiones',
        'Explorar estructuras especiales: acordes cuartales, power chords y poliacordes',
        'Usar el motor de acordes para identificar y construir cualquier acorde a partir de su cifrado',
      ],
      concepts: [
        {
          title: 'Acordes con Extensiones: Novenas hasta Trecenas',
          explanation:
            'Los acordes con extensiones continúan el proceso de apilamiento de terceras más allá de la séptima. Las cualidades mayor, menor y dominante producen familias de extensiones distintas. Cmaj9 añade una novena mayor a Cmaj7. Cm11 añade una oncena justa a Cm9. G13 añade una trecena mayor a G9 (con la oncena generalmente omitida en acordes dominantes para evitar el choque tercera/oncena). Las extensiones alteradas (b9, #9, #11, b13) crean la tensión cromática esencial para la conducción de voces jazz. El motor soporta todas las extensiones estándar en todas las cualidades.',
          tryThisLabel: 'Construye Cmaj13 — el apilamiento completo de extensiones mayores',
        },
        {
          title: 'Acordes Suspendidos y de Nota Añadida',
          explanation:
            'Los acordes suspendidos sustituyen la tercera por una segunda (sus2) o cuarta (sus4), eliminando la identidad mayor/menor y creando un sonido abierto y no resuelto. El 7sus4 es un acorde de séptima dominante con cuarta suspendida — habitual en el jazz como voicing previo a la resolución. Los acordes de nota añadida mantienen la tercera y añaden una nota sin implicar séptima: Cadd9 tiene fundamental, tercera, quinta y novena pero sin séptima. El acorde 6/9 (C6/9) añade tanto la sexta como la novena a una tríada — un voicing jazz rico y estable que funciona como alternativa de tónica al maj7.',
          tryThisLabel: 'Escucha C7sus4 — la dominante suspendida',
        },
        {
          title: 'Estructuras Especiales: Cuartales, Power Chords y Más',
          explanation:
            'No todos los acordes se construyen a partir de terceras apiladas. Los acordes cuartales apilan cuartas justas (Re-Sol-Do-Fa), produciendo una cualidad ambigua y abierta central al jazz modal — McCoy Tyner construyó su sonoridad de firma sobre estos voicings. Los power chords (solo fundamental y quinta, sin tercera) son la columna vertebral de la guitarra rock, ni mayores ni menores. Los poliacordes apilan dos tríadas independientes para crear sonoridades complejas usadas en la escritura orquestal y jazz. El motor cubre 42 tipos de acordes abarcando tríadas, séptimas, extensiones, alteraciones, suspensiones, notas añadidas y power chords.',
          tryThisLabel: 'Escucha C6/9 — un voicing jazz clásico sin séptima',
        },
      ],
      tasks: [
        {
          instruction:
            'Construye la escalera de extensiones en Do: escribe «Cmaj7», «Cmaj9», «Cmaj13» en secuencia. Escucha cómo cada extensión añade riqueza mientras el shell (C, E, B) se mantiene igual.',
        },
        {
          instruction:
            'Compara acordes suspendidos y de nota añadida: escribe «Csus4», luego «Cadd9», luego «C6/9». Observa que sus4 no tiene tercera, add9 no tiene séptima, y 6/9 no tiene ni séptima ni la tensión de resolución de un acorde suspendido.',
        },
        {
          instruction:
            'Explora variaciones dominantes: escribe «C7», «C9», «C7sus4», «C7b9», «C7#9», «C13». Todos son acordes de la familia dominante, pero cada uno tiene un color distinto — de cálido (C9) a oscuro (C7b9) a áspero (C7#9) a amplio (C13).',
        },
      ],
    },
  },
};

export default curriculumL7;
