import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 9 exercise templates
// 15 modules, ~80 generated exercises
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 30: Entrenamiento de Altura e Intervalos
  // =========================================================================

  // ---- l9u30m1: Correspondencia de Altura/Dirección ----
  l9u30m1: [
    {
      // note_id
      promptTemplate:
        'Identifica la altura mostrada en el pentagrama.',
      hintTemplate:
        'Utiliza alturas de referencia conocidas (A4 = 440 Hz, Do central = C4) para orientarte.',
    },
    {
      // note_id
      promptTemplate:
        'Identifica esta altura. Incluye una alteración.',
      hintTemplate:
        'Esta nota tiene un sostenido o un bemol. Escucha si suena más aguda o más grave que la nota natural más cercana.',
    },
  ],

  // ---- l9u30m2: Reconocimiento Mayor vs Menor ----
  l9u30m2: [
    {
      // interval_id
      promptTemplate:
        'Escucha e identifica este intervalo a partir de {root}. ¿Es mayor o menor?',
      hintTemplate:
        '3.ª mayor = 4 semitonos (brillante, alegre). 3.ª menor = 3 semitonos (sombría, triste). La diferencia es solo un semitono, pero el carácter cambia drásticamente.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Distingue la cualidad mayor de la menor de oído.',
      hintTemplate:
        'Mayor suena brillante y abierto. Menor suena sombrío y reflexivo. Céntrate en la 3.ª: 3.ª mayor = 4 semitonos, 3.ª menor = 3 semitonos.',
      choiceSets: [
        [
          'Un acorde mayor suena brillante porque tiene una 3.ª mayor (4 semitonos)',
          'Un acorde mayor suena brillante por la 5.ª justa',
          'Los acordes mayores y menores suenan idénticos',
          'La fundamental determina si un acorde suena brillante',
        ],
        [
          'Un acorde menor suena más sombrío porque tiene una 3.ª menor (3 semitonos)',
          'Los acordes menores tienen una fundamental más grave',
          'Los acordes menores no tienen 5.ª',
          'La 5.ª hace que un acorde suene menor',
        ],
      ],
    },
  ],

  // ---- l9u30m3: Reconocimiento de Intervalos P1-P5 ----
  l9u30m3: [
    {
      // interval_id
      promptTemplate:
        'Escucha e identifica este intervalo a partir de {root} en sentido {direction}. Céntrate en intervalos hasta la 5.ª justa.',
      hintTemplate:
        'Entrenamiento auditivo de intervalos: 2.ª m=1 (tensa), 2.ª M=2 (paso), 3.ª m=3 (triste), 3.ª M=4 (brillante), 4.ª J=5 (abierta), 5.ª J=7 (poderosa). A partir de {root}, cuenta los semitonos.',
    },
  ],

  // ---- l9u30m4: Reconocimiento de Intervalos 6.ª m-P8 ----
  l9u30m4: [
    {
      // interval_id
      promptTemplate:
        'Escucha e identifica este intervalo más amplio a partir de {root} en sentido {direction}.',
      hintTemplate:
        'Intervalos amplios: tritono=6 (tenso), 6.ª m=8 (agridulce), 6.ª M=9 (cálido), 7.ª m=10 (jazz), 7.ª M=11 (anhelante), 8.ª J=12 (octava). A partir de {root}.',
    },
  ],

  // ---- l9u30m5: Intervalos Armónicos ----
  l9u30m5: [
    {
      // interval_id
      promptTemplate:
        'Escucha estas dos notas tocadas simultáneamente a partir de {root} e identifica el intervalo armónico.',
      hintTemplate:
        'Los intervalos armónicos suenan con ambas notas a la vez. Las consonancias (3, 4, 5, 7, 8, 9, 12) se funden suavemente. Las disonancias (1, 2, 6, 10, 11) crean tensión. A partir de {root}.',
    },
  ],

  // =========================================================================
  // Unidad 31: Reconocimiento de Acordes y Escalas
  // =========================================================================

  // ---- l9u31m1: Reconocimiento de Escalas Mayor/Menor ----
  l9u31m1: [
    {
      // scale_build
      promptTemplate:
        'Tras escuchar, construye la escala de {root} {scaleType} que has oído. Selecciona todas las notas.',
      hintTemplate:
        'Escala mayor: T-T-S-T-T-T-S (brillante, resuelta). Menor natural: T-S-T-T-S-T-T (sombría, abierta). Menor armónica: eleva el 7.º. Construye a partir de {root}.',
    },
  ],

  // ---- l9u31m2: Reconocimiento de Escalas Modales ----
  l9u31m2: [
    {
      // scale_build
      promptTemplate:
        'Construye la escala de {root} {scaleType}. Escucha la nota característica que define este modo.',
      hintTemplate:
        'Identificadores modales: dórico = 6.ª natural en contexto menor, frigio = b2, lidio = #4, mixolidio = b7 en contexto mayor. Construye a partir de {root}.',
    },
  ],

  // ---- l9u31m3: Cualidad de Tríadas de Oído ----
  l9u31m3: [
    {
      // chord_build
      promptTemplate:
        'Escucha y construye la tríada de {root} {quality}. Identifica la cualidad del acorde de oído.',
      hintTemplate:
        'Mayor = brillante/estable. Menor = sombrío/estable. Disminuido = tenso/inestable. Aumentado = brillante/sin resolución. Construye la tríada sobre {root}.',
    },
  ],

  // ---- l9u31m4: Cualidad de Acordes de Séptima de Oído ----
  l9u31m4: [
    {
      // chord_build
      promptTemplate:
        'Escucha y construye el acorde de {root} {quality}. Identifica la cualidad del acorde de séptima de oído.',
      hintTemplate:
        '7.ª M = etéreo/exuberante. 7.ª m = suave/cálido. 7.ª dom = brillante/necesita resolución. semidism7 = sombrío/sin resolver. dism7 = muy tenso. Construye sobre {root}.',
    },
  ],

  // ---- l9u31m5: Progresión de Acordes de Oído ----
  l9u31m5: [
    {
      // multiple_choice
      promptTemplate:
        'Escucha esta progresión de acordes e identifica el análisis en numeración romana.',
      hintTemplate:
        'Céntrate en el movimiento del bajo y la cualidad de cada acorde. Progresiones comunes: I-IV-V-I, I-V-vi-IV, ii-V-I. Escucha patrones de resolución y tensión.',
      choiceSets: [
        [
          'I - IV - V - I: la progresión armónica más básica en la música tonal',
          'I - ii - iii - IV',
          'I - V - IV - I',
          'I - vi - ii - V',
        ],
        [
          'I - V - vi - IV: la progresión pop más común',
          'I - IV - V - vi',
          'I - vi - V - IV',
          'I - ii - V - I',
        ],
        [
          'ii - V - I: la progresión fundamental del jazz',
          'I - V - ii: el patrón jazz',
          'V - ii - I: la resolución jazz típica',
          'I - ii - V: el enfoque jazz',
        ],
        [
          'I - vi - IV - V: la «progresión de los años 50»',
          'I - V - IV - vi',
          'vi - I - IV - V',
          'I - IV - vi - V',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 32: Dictado Melódico y Lectura a Primera Vista
  // =========================================================================

  // ---- l9u32m1: Dictado Melódico por Grados Conjuntos ----
  l9u32m1: [
    {
      // note_id
      promptTemplate:
        'Identifica la nota mostrada en el pentagrama.',
      hintTemplate:
        'En melodías por grados conjuntos, cada nota está a un semitono o un tono de la anterior. Canta la escala para orientarte.',
    },
    {
      // interval_id
      promptTemplate:
        'Identifica el paso a partir de {root}: ¿es un semitono o un tono?',
      hintTemplate:
        'Los semitonos (1 semitono) suenan más próximos/tensos. Los tonos (2 semitonos) suenan más abiertos. A partir de {root}, escucha con atención.',
    },
  ],

  // ---- l9u32m2: Dictado Melódico con Saltos ----
  l9u32m2: [
    {
      // interval_id
      promptTemplate:
        'Escucha este salto a partir de {root} e identifica el intervalo.',
      hintTemplate:
        'Saltos melódicos comunes: 3.ª M (4, brillante), 4.ª J (5, abierta), 5.ª J (7, fuerte), 6.ª m (8, expresiva), 8.ª J (12, octava). A partir de {root}, identifica el intervalo.',
    },
  ],

  // ---- l9u32m3: Dictado Melódico Cromático ----
  l9u32m3: [
    {
      // note_id
      promptTemplate:
        'Identifica esta nota cromática.',
      hintTemplate:
        'Las notas cromáticas son alteraciones que no pertenecen a la tonalidad actual. Crean tensión que resuelve hacia notas diatónicas cercanas.',
    },
    {
      // interval_id
      promptTemplate:
        'Identifica este intervalo cromático a partir de {root}.',
      hintTemplate:
        'Los intervalos cromáticos incluyen cualidades aumentadas y disminuidas. A partir de {root}, este intervalo utiliza una nota ajena a la escala diatónica.',
    },
  ],

  // ---- l9u32m4: Lectura a Primera Vista — Diatónica ----
  l9u32m4: [
    {
      // scale_degree_id
      promptTemplate:
        'En la escala de {root} {scaleType}, identifica el grado {degree}. Canta desde la tónica para encontrarlo.',
      hintTemplate:
        'La lectura a primera vista utiliza solfeo (do-re-mi-fa-sol-la-si) o números de grados. En {root} {scaleType}, cuenta a partir de {root} para encontrar el grado {degree}.',
    },
    {
      // scale_build
      promptTemplate:
        'Canta y después construye la escala de {root} {scaleType}. Selecciona las 7 notas.',
      hintTemplate:
        'Canta mentalmente la escala comenzando en {root} usando solfeo o números antes de seleccionar notas. La escala {scaleType} tiene un patrón sonoro distintivo.',
    },
  ],

  // l9u32m5 (Escucha Contextual) no tiene plantillas generadas — usa los
  // ejercicios multiple_choice escritos a mano en exercisesL9.ts.
};

export default overlay;
