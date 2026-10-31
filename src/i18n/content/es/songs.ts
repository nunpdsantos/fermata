import type { SongOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish translations for song reference context strings (L1–L3 + l4u14m2)
// Only the `context` field is translated — song titles and artist names are
// kept in their original language.
// ---------------------------------------------------------------------------

const overlay: SongOverlay = {
  // =========================================================================
  // Nivel 1
  // =========================================================================

  // ---- L1U1: Notación y Altura ----

  'l1u1m1': [
    'Escrita predominantemente en la clave de sol, lo que la convierte en una pieza clásica de iniciación a la lectura en el pentagrama.',
    'Utiliza movimiento por grados conjuntos en un registro estrecho — ideal para practicar la lectura de notas en la clave de sol.',
  ],
  'l1u1m2': [
    'La mano izquierda se aventura frecuentemente por las líneas adicionales por debajo de la clave de fa, demostrando la extensión del registro en el sistema de pentagramas.',
    'Escrita en ambos pentagramas del sistema, con figuras arpegiadas que abarcan un registro amplio.',
  ],
  'l1u1m3': [
    'Construida enteramente sobre semitonos cromáticos, ilustrando sostenidos y bemoles en sucesión rápida.',
    'El riff icónico utiliza notas de paso cromáticas (semitonos) entre grados diatónicos de la escala.',
  ],
  'l1u1m4': [
    'Una de las primeras obras maestras construida en torno a extensos pasajes de escala cromática.',
    'La melodía incorpora notas auxiliares cromáticas que colorean la tonalidad mayor.',
  ],

  // ---- L1U2: Ritmo y Compás ----

  'l1u2m1': [
    'Utiliza solo negras y blancas en compás 4/4 — el vocabulario rítmico más sencillo.',
    'La línea de bajo demuestra un pulso constante de negras con subdivisiones en corcheas.',
  ],
  'l1u2m2': [
    'El vals por excelencia — cuenta UN-dos-tres de principio a fin y el compás de 3/4 se revela al instante.',
    'Una marcha enérgica en 2/4 — dos tiempos por compás, con el patrón fuerte-débil que define el compás binario.',
  ],

  // ---- L1U3: Escalas, Intervalos y Primeros Acordes ----

  'l1u3m1': [
    'La melodía sube y baja literalmente la escala mayor, enseñando cada grado por nombre.',
    'La melodía inicial es una escala mayor descendente de la tónica a la tónica.',
  ],
  'l1u3m2': [
    'Escrita en G mayor (un sostenido — F#), demostrando cómo una armadura de clave sencilla moldea el sonido de una canción clásica.',
    'En la tonalidad de F mayor (un bemol), un buen punto de partida para leer armaduras de clave más allá de C mayor.',
  ],
  'l1u3m3': [
    'Abre con una cuarta justa — uno de los intervalos más reconocibles en la música occidental.',
    'El salto inicial es una octava, el mayor intervalo básico. Una referencia clásica para el reconocimiento de intervalos.',
    'Abre con una quinta justa, un intervalo fundamental para el entrenamiento auditivo.',
  ],
  'l1u3m4': [
    'Construida sobre una progresión de cuatro acordes (C–G–Am–F) en que todos los acordes mayores son tríadas en posición fundamental.',
    'Utiliza tríadas mayores simples (A, D, E) en un patrón repetitivo — la esencia de la armonía básica de acordes.',
  ],

  // =========================================================================
  // Nivel 2
  // =========================================================================

  // ---- L2U4: Todas las Tonalidades Mayores y Grados de la Escala ----

  'l2u4m1': [
    'En C mayor — demuestra cómo el ciclo de quintas coloca la tonalidad más sencilla en la posición de las 12 en punto.',
    'Escrita en A mayor (tres sostenidos), mostrando cómo los compositores trabajan cómodamente en tonalidades con sostenidos.',
  ],
  'l2u4m2': [
    'La melodía sigue el movimiento 1–1–5–5–6–6–5, delineando claramente los grados de tónica, dominante y submediante.',
    'Contiene movimientos prominentes del 5.º grado (dominante) y del 1.er grado (tónica) — un ejemplo natural de grados funcionales.',
  ],

  // ---- L2U5: Escalas Menores y Relaciones entre Tonalidades ----

  'l2u5m1': [
    'Construida sobre la escala menor natural (eólico) en A menor, con la característica séptima rebajada.',
    'Se basa en los acordes Em y C, con un sabor modal que mezcla el eólico y el dórico — en algunos momentos la melodía eleva la 6.ª (C♯), lo que le da una cualidad modal y no la de un menor puramente diatónico.',
  ],
  'l2u5m2': [
    'Utiliza la escala menor armónica — la segunda aumentada entre el b6 y el #7 le confiere su sonoridad distintiva.',
    'El uso de E mayor (V) sobre una tonalidad de A menor implica la menor armónica, con el 7.º grado elevado (G#) creando una fuerte atracción de vuelta a la tónica.',
  ],
  'l2u5m3': [
    'Comienza en A menor (relativa menor de C mayor), modulando después — una relación clásica entre tonalidades relativas.',
    'Alterna entre los versos en A menor y el contexto de su relativa mayor (C mayor), demostrando la relación cercana entre tonalidades relativas que comparten la misma armadura de clave.',
  ],

  // ---- L2U6: Compás Compuesto y Síncopa ----

  'l2u6m1': [
    'El acompañamiento arpegiado en compás 6/8 demuestra el compás compuesto binario, donde cada uno de los dos tiempos principales se subdivide en grupos de tres corcheas (algunas ediciones lo escriben en 12/8; la sensación de compás compuesto binario es la misma).',
    'El verso está en 6/8 antes de que el estribillo cambie de sensación — un contraste entre compás compuesto y simple.',
    'Alterna entre 6/8 y 3/4 — las mismas seis corcheas reagrupadas, la hemiolia clásica entre compás compuesto y simple.',
  ],
  'l2u6m2': [
    'Un ejemplo definitorio de síncopa en el ragtime — los acentos caen consistentemente entre los tiempos.',
    'Síncopa intensa tanto en el riff de clavinet como en la línea vocal, con acentos en el contratiempo.',
  ],

  // ---- L2U7: Intervalos, Tríadas y Armonía Diatónica ----

  'l2u7m1': [
    'Abre con un salto de cuarta justa, y la melodía delinea intervalos mayores y menores a lo largo de la pieza.',
    'La figura inicial de cuatro notas (C–E–F–G) comienza con un brillante salto de tercera mayor — una de las referencias clásicas de entrenamiento auditivo para identificar el intervalo de 3.ª mayor.',
  ],
  'l2u7m2': [
    'Abre con una cuarta aumentada (tritono) — el «intervalo del diablo» utilizado para efecto dramático.',
    'Contiene intervalos compuestos (novenas, décimas) en la melodía, extendiéndose más allá de la octava.',
  ],
  'l2u7m3': [
    'Presenta tríadas mayores, menores y aumentadas — el acorde de E aumentado crea tensión antes de resolver, demostrando cómo diferentes cualidades de tríadas sirven diferentes funciones armónicas.',
    'La progresión I–III–IV–iv (G–B–C–Cm) presenta un acorde mayor cromático (III) tomado de fuera de la tonalidad y un subdominante menor prestado (iv), mostrando cómo la cualidad de las tríadas crea color emocional.',
  ],
  'l2u7m4': [
    'La línea de bajo se mueve por tríadas en posición fundamental y primera inversión — un ejemplo clásico de conducción de voces en el bajo cifrado.',
    'Cada compás arpeggia un acorde, muchos en primera o segunda inversión, siguiendo las convenciones del bajo cifrado.',
  ],
  'l2u7m5': [
    'La progresión I–V–vi–iii–IV–I–IV–V demuestra cinco de las siete tríadas diatónicas en un patrón de bajo descendente que se convirtió en una de las progresiones de acordes más famosas de la música occidental.',
    'Utiliza la progresión I–V–vi–IV — el patrón de números romanos diatónicos más común en la música pop.',
  ],

  // =========================================================================
  // Nivel 3
  // =========================================================================

  // ---- L3U9: Acordes de Séptima y Armonía Diatónica ----

  'l3u9m1': [
    'Los cambios de acorde recorren acordes de séptima mayor, séptima menor y séptima de dominante — tres de las cinco cualidades de acordes de séptima en un solo estándar.',
    'Abre con un acorde de séptima mayor, estableciendo la cualidad cálida que define la armonía de la bossa nova.',
  ],
  'l3u9m2': [
    'Utiliza acordes de séptima en varias inversiones para una conducción de voces suave entre acordes.',
    'El arreglo para piano presenta acordes de séptima en inversiones de posición cerrada a lo largo de toda la pieza.',
  ],
  'l3u9m3': [
    'Recorre acordes de séptima diatónicos en tonalidades mayores usando el movimiento del ciclo de quintas (vi7–ii7–V7–Imaj7).',
    'La progresión de «rhythm changes» (Imaj7–vi7–ii7–V7) se convirtió en un modelo para cientos de composiciones de jazz.',
  ],
  'l3u9m4': [
    'Abre en C menor con una progresión i7–iv7–iiø7–V7, demostrando cómo los acordes de séptima diatónicos y el movimiento cadencial ii–V funcionan en una tonalidad menor.',
    'La progresión de acordes de séptima en tonalidad menor (i–iiø7–V7–i) crea la sensación lánguida de la canción.',
  ],

  // ---- L3U10: Conducción de Voces y Escritura a Partes ----

  'l3u10m1': [
    'Las secciones corales son un modelo de escritura SATB — cada voz se mueve suavemente dentro de su registro.',
    'La armonización de Bach es un ejemplo clásico de escritura coral a cuatro voces (SATB).',
  ],
  'l3u10m2': [
    'A pesar de ser arpegiada, la conducción de voces subyacente evita quintas y octavas paralelas a lo largo de toda la pieza.',
  ],
  'l3u10m3': [
    'Las armonizaciones de himnos estándar utilizan tríadas en posición fundamental enlazadas por una conducción de voces correcta — un ejercicio clásico de escritura a partes.',
  ],
  'l3u10m4': [
    'El acompañamiento presenta tríadas en inversión que se mueven por grado conjunto, creando líneas de bajo suaves bajo la melodía.',
  ],

  // ---- L3U11: Cadencias, Frases y Ornamentación ----

  'l3u11m1': [
    'Cada verso termina con una cadencia auténtica clara (V–I) en la palabra «Hallelujah». La letra narra su propia armonía: «the fourth, the fifth» (IV–V), «the minor fall» (vi), «the major lift» (IV) — y ese movimiento V–vi es un gesto ejemplar de cadencia rota.',
    'Contiene tanto semicadencias (reposo en el V) como cadencias auténticas dentro de su estructura fraseológica.',
  ],
  'l3u11m2': [
    'La melodía está estructurada como un período paralelo — dos frases, la primera terminando en una semicadencia, la segunda en una cadencia auténtica perfecta.',
    'Un ejemplo clásico de estructura antecedente-consecuente formando un período musical.',
  ],
  'l3u11m3': [
    'Utiliza un ritmo armónico dramáticamente variado — desde acordes lentos de balada hasta cambios operáticos en cadencia rápida.',
    'Mantiene un ritmo armónico regular con un acorde por compás, haciendo que el tempo armónico sea fácil de sentir y analizar.',
  ],
  'l3u11m4': [
    'El acompañamiento arpegiado presenta notas de paso y notas auxiliares entre las notas del acorde.',
    'Rica en notas extrañas al acorde — suspensiones, apoyaturas y notas de paso crean su cualidad onírica.',
  ],
  'l3u11m5': [
    'La línea melódica ornamentada está construida sobre cadenas de suspensiones y notas de paso sobre un bajo simple.',
    'La melodía ornamentada entrelaza notas de paso cromáticas y notas auxiliares en torno a las notas estructurales del acorde.',
  ],

  // =========================================================================
  // Nivel 4
  // =========================================================================

  // ---- L4U14: Compases Asimétricos y Mixtos ----

  'l4u14m2': [
    'Escrita en 5/4 (3+2), demuestra cómo los compases asimétricos crean un carácter rítmico propio.',
    'El famoso riff de bajo está en 7/4 — cuenta el ciclo y siente el tiempo de más que un compás simple no permitiría.',
  ],
};

export default overlay;
