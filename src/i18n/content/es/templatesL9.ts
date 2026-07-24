import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 9 exercise templates
// 14 modules with templates (l9u32m5 relies on hand-authored exercises).
// All "listen" templates are real ear_training exercises (F-03).
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 30: Entrenamiento de Altura e Intervalos
  // =========================================================================

  // ---- l9u30m1: Correspondencia de Altura/Dirección ----
  l9u30m1: [
    {
      // ear_training (note)
      promptTemplate:
        'Escucha la altura e identifícala.',
      hintTemplate:
        'Utiliza alturas de referencia conocidas (A4 = 440 Hz, Do central = C4) para orientarte.',
    },
    {
      // ear_training (note, con alteración)
      promptTemplate:
        'Escucha esta altura e identifícala. Incluye una alteración.',
      hintTemplate:
        'Esta nota tiene un sostenido o un bemol. Escucha si suena más aguda o más grave que la nota natural más cercana.',
    },
  ],

  // ---- l9u30m2: Reconocimiento Mayor vs Menor ----
  l9u30m2: [
    {
      // ear_training (interval)
      promptTemplate:
        'Escucha este intervalo e identifícalo. ¿La tercera es mayor o menor?',
      hintTemplate:
        '3.ª mayor = 4 semitonos (brillante, alegre). 3.ª menor = 3 semitonos (sombría, triste). La diferencia es solo un semitono, pero el carácter cambia drásticamente.',
    },
    {
      // ear_training (chord)
      promptTemplate:
        'Escucha este acorde e identifica su cualidad.',
      hintTemplate:
        'El mayor suena brillante y abierto. El menor suena sombrío y pensativo. Céntrate en la 3.ª: 3.ª mayor = 4 semitonos, 3.ª menor = 3 semitonos.',
    },
  ],

  // ---- l9u30m3: Reconocimiento de Intervalos P1-P5 ----
  l9u30m3: [
    {
      // ear_training (interval)
      promptTemplate:
        'Escucha este intervalo, tocado en movimiento {direction}, e identifícalo. Céntrate en intervalos hasta la 5.ª justa.',
      hintTemplate:
        'Entrenamiento auditivo de intervalos: 2m=1 (tenso), 2M=2 (paso), 3m=3 (triste), 3M=4 (brillante), 4J=5 (abierto), 5J=7 (fuerte). Cuenta los semitonos que oyes.',
    },
  ],

  // ---- l9u30m4: Reconocimiento de Intervalos 6.ª m-P8 ----
  l9u30m4: [
    {
      // ear_training (interval)
      promptTemplate:
        'Escucha este intervalo más amplio, tocado en movimiento {direction}, e identifícalo.',
      hintTemplate:
        'Intervalos amplios: tritono=6 (tenso), 6m=8 (agridulce), 6M=9 (cálido), 7m=10 (jazz), 7M=11 (anhelante), 8J=12 (octava).',
    },
  ],

  // ---- l9u30m5: Intervalos Armónicos ----
  l9u30m5: [
    {
      // ear_training (interval, armónico)
      promptTemplate:
        'Escucha estas dos notas tocadas simultáneamente e identifica el intervalo armónico.',
      hintTemplate:
        'Los intervalos armónicos hacen sonar ambas notas a la vez. Las consonancias (3, 4, 5, 7, 8, 9, 12 semitonos) se funden suavemente. Las disonancias (1, 2, 6, 10, 11) crean tensión.',
    },
  ],

  // =========================================================================
  // Unidad 31: Reconocimiento de Acordes y Escalas
  // =========================================================================

  // ---- l9u31m1: Reconocimiento de Escalas Mayor/Menor ----
  l9u31m1: [
    {
      // ear_training (scale)
      promptTemplate:
        'Escucha esta escala e identifica su tipo.',
      hintTemplate:
        'Escala mayor: T-T-S-T-T-T-S (brillante, resuelta). Menor natural: T-S-T-T-S-T-T (sombría, abierta). Menor armónica: eleva el 7.º, creando un salto distintivo de tono y medio.',
    },
  ],

  // ---- l9u31m2: Reconocimiento de Escalas Modales ----
  l9u31m2: [
    {
      // ear_training (scale)
      promptTemplate:
        'Escucha esta escala e identifica el modo. Presta atención a la nota característica.',
      hintTemplate:
        'Identificadores de los modos: dórico = 6 natural en contexto menor, frigio = b2, lidio = #4, mixolidio = b7 en contexto mayor.',
    },
  ],

  // ---- l9u31m3: Reconocimiento de Escalas Pentatónicas, Blues y Simétricas ----
  l9u31m3: [
    {
      // ear_training (scale)
      promptTemplate:
        'Escucha esta escala e identifica su tipo.',
      hintTemplate:
        'Las escalas pentatónicas tienen cinco notas y ninguna tensión de semitono. La escala de blues añade la «blue note» (b5). La escala de tonos enteros es toda de tonos — onírica y sin centro.',
    },
  ],

  // ---- l9u31m4: Reconocimiento de Cualidad de Tríadas ----
  l9u31m4: [
    {
      // ear_training (chord)
      promptTemplate:
        'Escucha esta tríada e identifica su cualidad.',
      hintTemplate:
        'Mayor = brillante/estable. Menor = sombría/estable. Disminuida = tensa/inestable. Aumentada = brillante/sin resolución.',
    },
  ],

  // ---- l9u31m5: Reconocimiento de Cualidad de Acordes de Séptima ----
  l9u31m5: [
    {
      // ear_training (chord)
      promptTemplate:
        'Escucha este acorde de séptima e identifica su cualidad.',
      hintTemplate:
        'maj7 = etéreo/exuberante. m7 = suave/cálido. 7 de dominante = brillante/pide resolución. semidisminuido = sombrío/sin resolución. dim7 = muy tenso.',
    },
  ],

  // =========================================================================
  // Unidad 32: Dictado Melódico y Lectura a Primera Vista
  // =========================================================================

  // ---- l9u32m1: Dictado Melódico Diatónico ----
  l9u32m1: [
    {
      // ear_training (note)
      promptTemplate:
        'Escucha esta altura de una melodía por grados conjuntos e identifícala.',
      hintTemplate:
        'En melodías por grados conjuntos, cada nota está a un semitono o un tono de la anterior. Canta la escala para orientarte.',
    },
    {
      // ear_training (interval)
      promptTemplate:
        'Escucha este intervalo melódico, tocado en movimiento {direction}, e identifícalo.',
      hintTemplate:
        'Las melodías diatónicas mezclan pasos (1-2 semitonos) y saltos (3M=4, 4J=5, 5J=7, 8J=12). Canta lo que has oído antes de responder.',
    },
  ],

  // ---- l9u32m2: Dictado Melódico Cromático ----
  l9u32m2: [
    {
      // ear_training (note)
      promptTemplate:
        'Escucha esta nota cromática e identifícala.',
      hintTemplate:
        'Las notas cromáticas son alteraciones que no pertenecen a la tonalidad actual. Crean tensión que resuelve hacia notas diatónicas cercanas.',
    },
    {
      // ear_training (interval)
      promptTemplate:
        'Escucha este intervalo cromático, tocado en movimiento {direction}, e identifícalo.',
      hintTemplate:
        'Los intervalos cromáticos incluyen cualidades aumentadas y disminuidas. Este intervalo utiliza una nota fuera de la escala diatónica.',
    },
  ],

  // ---- l9u32m3: Dictado Armónico — Cadencias y Progresiones ----
  l9u32m3: [
    {
      // ear_training (progression, cadencias)
      promptTemplate:
        'Escucha esta cadencia en C mayor e identifícala.',
      hintTemplate:
        'Auténtica (V-I) = llegada conclusiva. Plagal (IV-I) = la cadencia del «Amén». Rota (V-vi) = llegada esperada desviada. Semicadencia (I-V) = pausa en la tensión.',
    },
    {
      // ear_training (progression)
      promptTemplate:
        'Escucha esta progresión de acordes en C mayor e identifica el patrón de números romanos.',
      hintTemplate:
        'Céntrate en el movimiento del bajo y en la cualidad de cada acorde. Progresiones comunes: I-IV-V-I (básica), I-V-vi-IV (pop), ii-V-I (jazz), I-vi-IV-V (años 50).',
    },
  ],

  // ---- l9u32m4: Lectura a Primera Vista — Diatónica ----
  l9u32m4: [
    {
      // scale_degree_id
      promptTemplate:
        'En la escala de {root} {scaleType}, ¿qué grado es {note}? Canta desde la tónica para encontrarlo.',
      hintTemplate:
        'La lectura a primera vista usa solfeo (do-re-mi-fa-sol-la-si) o números de grados. En {root} {scaleType}, cuenta desde {root} para encontrar el grado {degree}.',
    },
    {
      // scale_build
      promptTemplate:
        'Canta y luego construye la escala de {root} {scaleType}. Selecciona las 7 notas.',
      hintTemplate:
        'Canta mentalmente la escala desde {root} usando solfeo o números antes de seleccionar las notas. La escala {scaleType} tiene un patrón sonoro distintivo.',
    },
  ],
};

export default overlay;
