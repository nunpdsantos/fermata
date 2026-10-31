import type { ContentLanguage } from './content/types';

/**
 * The chord panel's scale-suggestion notes (`ScaleSuggestion.context`, shown
 * as the suggestion button's tooltip) in Portuguese (pt-PT) and Spanish. They
 * used to show in English in every language (W11-A review). Keyed by the
 * English sentence in core/constants/chordScaleRelationships.ts; a unit test
 * fails when a sentence there has no PT or ES entry here (or an entry here no
 * longer matches one there). Terms follow the lessons: «nota a evitar»,
 * voicing, lídio / lidio, menor melódica, b9 / #11 written as symbols.
 */
export const SCALE_CONTEXT_PT: Record<string, string> = {
  "Contains all chord tones (1-3-5)":
    "Contém todas as notas do acorde (1-3-5)",
  "Raised 4th avoids the clash with the major 3rd":
    "O 4.º grau elevado evita o choque com a 3.ª maior",
  "No avoid notes — always safe":
    "Sem notas a evitar — sempre segura",
  "All chord tones present (1-3-5-7)":
    "Todas as notas do acorde presentes (1-3-5-7)",
  "#4 avoids the \"avoid note\" clash — preferred in jazz":
    "O #4 evita o choque da «nota a evitar» — preferida no jazz",
  "Safe melodic choice":
    "Escolha melódica segura",
  "Contains the natural 6th":
    "Contém a 6.ª natural",
  "Clean, simple melodic lines":
    "Linhas melódicas limpas e simples",
  "9th is the 2nd degree of major scale":
    "A 9.ª é o 2.º grau da escala maior",
  "Adds brightness with #4":
    "Acrescenta brilho com o #4",
  "Contains every chord tone, including the natural 11 — the chord omits the 3rd, so the 11 does not clash":
    "Contém todas as notas do acorde, incluindo a 11.ª natural — o acorde omite a 3.ª, por isso a 11.ª não choca",
  "Raises the 11th to #11 — that is the maj7#11 sound, a different chord":
    "Eleva a 11.ª para #11 — é o som maj7#11, outro acorde",
  "Full scale coverage of all extensions":
    "A escala cobre todas as extensões",
  "Brighter with the #4":
    "Mais brilhante com o #4",
  "6th and 9th are scale degrees 6 and 2":
    "A 6.ª e a 9.ª são os graus 6 e 2 da escala",
  "Sweet, simple lines":
    "Linhas doces e simples",
  "9th is natural in major scale":
    "A 9.ª é natural na escala maior",
  "Clean melodic approach":
    "Abordagem melódica limpa",
  "Contains every chord tone, including the natural 11 the symbol asks for":
    "Contém todas as notas do acorde, incluindo a 11.ª natural que a cifra pede",
  "Swaps the natural 11 for #11 — brighter, but no longer the add11 chord":
    "Troca a 11.ª natural pela #11 — mais brilhante, mas deixa de ser o acorde add11",
  "Natural 6th adds brightness — most versatile":
    "A 6.ª natural dá brilho — a mais versátil",
  "Classic minor sound with b6":
    "Som menor clássico com b6",
  "Five notes, no wrong choices":
    "Cinco notas, nenhuma escolha errada",
  "Adds b5 blue note for soulful feel":
    "Acrescenta a blue note b5 para um toque soul",
  "Bright minor — natural 6 works over m7 chords":
    "Menor brilhante — a 6.ª natural funciona sobre acordes m7",
  "Darker with the b6":
    "Mais escura com o b6",
  "Safe, bluesy choice":
    "Escolha segura, com sabor a blues",
  "b2 adds dark, Spanish character":
    "O b2 dá um carácter escuro e espanhol",
  "Natural 6th matches the chord 6th exactly":
    "A 6.ª natural coincide exatamente com a 6.ª do acorde",
  "Also has natural 6 and 7":
    "Também tem 6.ª e 7.ª naturais",
  "9th is natural 2nd in dorian":
    "A 9.ª é a 2.ª natural do dórico",
  "Works but less bright":
    "Funciona, mas é menos brilhante",
  "11th (4th) is natural in dorian":
    "A 11.ª (4.ª) é natural no dórico",
  "Same 4th, darker 6th":
    "A mesma 4.ª, 6.ª mais escura",
  "13th is the natural 6th in dorian":
    "A 13.ª é a 6.ª natural do dórico",
  "Natural 6 and 2 match chord":
    "A 6.ª e a 2.ª naturais coincidem com o acorde",
  "Also works with 6 and 2":
    "Também funciona com a 6.ª e a 2.ª",
  "Natural 7 + minor 3rd = melodic minor character":
    "7.ª natural + 3.ª menor = carácter de menor melódica",
  "Natural 7 but b6 darker sound":
    "7.ª natural, mas o b6 escurece o som",
  "b7 in scale matches the chord — THE dominant scale":
    "O b7 da escala coincide com o acorde — a escala da dominante por excelência",
  "Blues/rock idiom: the scale's b3 rubs against the chord's major 3rd — that clash is the blues sound":
    "Linguagem blues/rock: o b3 da escala roça na 3.ª maior do acorde — esse choque é o som do blues",
  "Chromatic passing tone for jazz lines":
    "Nota de passagem cromática para linhas de jazz",
  "Natural 9 (2nd) in mixolydian":
    "9.ª natural (2.ª) no mixolídio",
  "Smooth chromatic lines":
    "Linhas cromáticas fluidas",
  "11th is natural 4th in mixolydian":
    "A 11.ª é a 4.ª natural do mixolídio",
  "Minor feel over sus4 voicings":
    "Sabor menor sobre voicings sus4",
  "13th is natural 6th":
    "A 13.ª é a 6.ª natural",
  "#11 adds modern tension":
    "A #11 acrescenta tensão moderna",
  "Sus4 with b7 — unresolved dominant":
    "Sus4 com b7 — dominante por resolver",
  "Minor context works over sus voicing":
    "Um contexto menor funciona sobre o voicing sus",
  "9 and 4 with b7 — modern jazz voicing":
    "9.ª e 4.ª com b7 — voicing de jazz moderno",
  "Half-whole pattern fits all chord tones including b9":
    "O padrão meio-tom/tom serve todas as notas do acorde, incluindo a b9",
  "Spanish/Flamenco flavor with b2":
    "Sabor espanhol/flamenco com b2",
  "Maximum tension for resolving to minor":
    "Tensão máxima para resolver para menor",
  "Contains every chord tone — the #9 plus the major 3rd, perfect 5th and b7":
    "Contém todas as notas do acorde — a #9 mais a 3.ª maior, a 5.ª perfeita e a b7",
  "Blues/rock context (the \"Hendrix chord\"): the scale's b3 is the chord's #9":
    "Contexto blues/rock (o «acorde de Hendrix»): o b3 da escala é a #9 do acorde",
  "For a 7alt context: keeps the #9 but replaces the perfect 5th with b5/#5":
    "Para um contexto 7alt: mantém a #9, mas troca a 5.ª perfeita por b5/#5",
  "#11 (=b5) built into lydian dominant — jazz standard":
    "A #11 (=b5) faz parte do lídio dominante — padrão no jazz",
  "All notes a whole step apart — dreamy":
    "Todas as notas a um tom de distância — onírica",
  "Full altered sound for maximum tension":
    "Som alterado completo para tensão máxima",
  "Contains every chord tone (1-3-#5-b7) plus the 9th and #11 — symmetric and dreamy":
    "Contém todas as notas do acorde (1-3-#5-b7) mais a 9.ª e a #11 — simétrica e onírica",
  "#5 is part of the altered scale":
    "O #5 faz parte da escala alterada",
  "THE altered scale — 7th mode of melodic minor":
    "A escala alterada por excelência — 7.º modo da menor melódica",
  "Similar b9/#9/#11 tension, but with a natural 13 instead of the chord's b13":
    "Tensão b9/#9/#11 semelhante, mas com 13.ª natural em vez da b13 do acorde",
  "#11 defines this chord — 4th mode of melodic minor":
    "A #11 define este acorde — 4.º modo da menor melódica",
  "#11 over a dominant 7th — lydian dominant (4th mode of melodic minor)":
    "#11 sobre uma sétima da dominante — lídio dominante (4.º modo da menor melódica)",
  "Has the b7 and #11 but replaces the chord's perfect 5th with #5 — for voicings that omit the 5th":
    "Tem a b7 e a #11, mas troca a 5.ª perfeita do acorde por #5 — para voicings que omitem a 5.ª",
  "#11 IS the lydian 4th, with the major 7th and 9th":
    "A #11 É a 4.ª lídia, com a 7.ª maior e a 9.ª",
  "b6 (=b13) over a dominant 7th — 5th mode of melodic minor":
    "b6 (=b13) sobre uma sétima da dominante — 5.º modo da menor melódica",
  "Keeps the b13 but also alters the 5th — a darker, fully altered colour":
    "Mantém a b13, mas também altera a 5.ª — uma cor mais escura, totalmente alterada",
  "Contains b9 and natural 13 — symmetric scale":
    "Contém a b9 e a 13.ª natural — escala simétrica",
  "2nd degree replaces 3rd — open, ambiguous":
    "O 2.º grau substitui a 3.ª — aberto, ambíguo",
  "Bluesy feel with b7 available":
    "Sabor a blues com a b7 disponível",
  "Clean melodic lines":
    "Linhas melódicas limpas",
  "4th wants to resolve — dominant function":
    "A 4.ª quer resolver — função de dominante",
  "Minor context for sus4 voicing":
    "Contexto menor para o voicing sus4",
  "Suspended pentatonic (1-2-4-5-b7): no 3rd at all, so the sus sound stays intact":
    "Pentatónica suspensa (1-2-4-5-b7): sem 3.ª nenhuma, por isso o som sus mantém-se intacto",
  "Open sound — 2 and 4 with no 3rd":
    "Som aberto — 2.ª e 4.ª sem 3.ª",
  "Suspended pentatonic (1-2-4-5-b7): contains the 2 and 4, no 3rd":
    "Pentatónica suspensa (1-2-4-5-b7): contém a 2.ª e a 4.ª, sem 3.ª",
  "Symmetric 8-note scale — whole step first, then alternating":
    "Escala simétrica de 8 notas — primeiro um tom, depois alternando",
  "Natural mode with b5 — darker sound":
    "Modo natural com b5 — som mais escuro",
  "All chord tones present — start whole step from root":
    "Todas as notas do acorde presentes — começa com um tom a partir da fundamental",
  "Natural fit for ii chord in minor keys":
    "Encaixe natural para o acorde ii em tonalidades menores",
  "Natural 2 avoids b2 clash — smoother":
    "A 2.ª natural evita o choque do b2 — mais suave",
  "Rare chord — symmetric scale provides options":
    "Acorde raro — a escala simétrica dá opções",
  "Every note whole step apart — dreamy, symmetric":
    "Todas as notas a um tom de distância — onírica, simétrica",
  "#5 matches chord — mode 3 of melodic minor":
    "O #5 coincide com o acorde — 3.º modo da menor melódica",
  "b7 and #5 both in whole tone scale":
    "A b7 e o #5 estão ambos na escala de tons inteiros",
  "#5 is part of altered — dominant function":
    "O #5 faz parte da alterada — função de dominante",
  "#4 and #5 with maj7 — 3rd mode of melodic minor":
    "#4 e #5 com maj7 — 3.º modo da menor melódica",
  "#4 (=b5 enharmonic) — lydian character":
    "#4 (enarmónico de b5) — carácter lídio",
  "Rock/metal standard":
    "Clássico do rock/metal",
  "#11 IS the lydian sound — perfect match":
    "A #11 É o som lídio — encaixe perfeito",
  "#5 and b9 are both altered tones":
    "O #5 e a b9 são ambos notas alteradas",
  "#5 and b7 fit, but the scale's natural 9 rubs against the chord's b9 — use sparingly":
    "O #5 e a b7 encaixam, mas a 9.ª natural da escala roça na b9 do acorde — usar com moderação",
  "b5 and b9 define the altered sound":
    "O b5 e a b9 definem o som alterado",
  "b5 and b9 in symmetric scale":
    "O b5 e a b9 numa escala simétrica",
  "#5 and #9 — full altered dominant":
    "#5 e #9 — dominante totalmente alterada",
  "#5 and b7 fit, but the scale has a natural 9 where the chord has #9":
    "O #5 e a b7 encaixam, mas a escala tem 9.ª natural onde o acorde tem #9",
  "b5 and #9 — classic altered combination":
    "b5 e #9 — combinação alterada clássica",
  "Symmetric scale option":
    "Opção de escala simétrica",
};

export const SCALE_CONTEXT_ES: Record<string, string> = {
  "Contains all chord tones (1-3-5)":
    "Contiene todas las notas del acorde (1-3-5)",
  "Raised 4th avoids the clash with the major 3rd":
    "El 4.º grado elevado evita el choque con la 3.ª mayor",
  "No avoid notes — always safe":
    "Sin notas a evitar — siempre segura",
  "All chord tones present (1-3-5-7)":
    "Todas las notas del acorde presentes (1-3-5-7)",
  "#4 avoids the \"avoid note\" clash — preferred in jazz":
    "El #4 evita el choque de la «nota a evitar» — preferida en el jazz",
  "Safe melodic choice":
    "Opción melódica segura",
  "Contains the natural 6th":
    "Contiene la 6.ª natural",
  "Clean, simple melodic lines":
    "Líneas melódicas limpias y sencillas",
  "9th is the 2nd degree of major scale":
    "La 9.ª es el 2.º grado de la escala mayor",
  "Adds brightness with #4":
    "Añade brillo con el #4",
  "Contains every chord tone, including the natural 11 — the chord omits the 3rd, so the 11 does not clash":
    "Contiene todas las notas del acorde, incluida la 11.ª natural — el acorde omite la 3.ª, así que la 11.ª no choca",
  "Raises the 11th to #11 — that is the maj7#11 sound, a different chord":
    "Eleva la 11.ª a #11 — es el sonido maj7#11, otro acorde",
  "Full scale coverage of all extensions":
    "La escala cubre todas las extensiones",
  "Brighter with the #4":
    "Más brillante con el #4",
  "6th and 9th are scale degrees 6 and 2":
    "La 6.ª y la 9.ª son los grados 6 y 2 de la escala",
  "Sweet, simple lines":
    "Líneas dulces y sencillas",
  "9th is natural in major scale":
    "La 9.ª es natural en la escala mayor",
  "Clean melodic approach":
    "Enfoque melódico limpio",
  "Contains every chord tone, including the natural 11 the symbol asks for":
    "Contiene todas las notas del acorde, incluida la 11.ª natural que pide el cifrado",
  "Swaps the natural 11 for #11 — brighter, but no longer the add11 chord":
    "Cambia la 11.ª natural por la #11 — más brillante, pero ya no es el acorde add11",
  "Natural 6th adds brightness — most versatile":
    "La 6.ª natural da brillo — la más versátil",
  "Classic minor sound with b6":
    "Sonido menor clásico con b6",
  "Five notes, no wrong choices":
    "Cinco notas, ninguna opción equivocada",
  "Adds b5 blue note for soulful feel":
    "Añade la blue note b5 para un toque soul",
  "Bright minor — natural 6 works over m7 chords":
    "Menor brillante — la 6.ª natural funciona sobre acordes m7",
  "Darker with the b6":
    "Más oscura con el b6",
  "Safe, bluesy choice":
    "Opción segura, con sabor a blues",
  "b2 adds dark, Spanish character":
    "El b2 aporta un carácter oscuro y español",
  "Natural 6th matches the chord 6th exactly":
    "La 6.ª natural coincide exactamente con la 6.ª del acorde",
  "Also has natural 6 and 7":
    "También tiene 6.ª y 7.ª naturales",
  "9th is natural 2nd in dorian":
    "La 9.ª es la 2.ª natural del dórico",
  "Works but less bright":
    "Funciona, pero es menos brillante",
  "11th (4th) is natural in dorian":
    "La 11.ª (4.ª) es natural en el dórico",
  "Same 4th, darker 6th":
    "La misma 4.ª, 6.ª más oscura",
  "13th is the natural 6th in dorian":
    "La 13.ª es la 6.ª natural del dórico",
  "Natural 6 and 2 match chord":
    "La 6.ª y la 2.ª naturales coinciden con el acorde",
  "Also works with 6 and 2":
    "También funciona con la 6.ª y la 2.ª",
  "Natural 7 + minor 3rd = melodic minor character":
    "7.ª natural + 3.ª menor = carácter de menor melódica",
  "Natural 7 but b6 darker sound":
    "7.ª natural, pero el b6 oscurece el sonido",
  "b7 in scale matches the chord — THE dominant scale":
    "El b7 de la escala coincide con el acorde — la escala de dominante por excelencia",
  "Blues/rock idiom: the scale's b3 rubs against the chord's major 3rd — that clash is the blues sound":
    "Lenguaje blues/rock: el b3 de la escala roza con la 3.ª mayor del acorde — ese choque es el sonido del blues",
  "Chromatic passing tone for jazz lines":
    "Nota de paso cromática para líneas de jazz",
  "Natural 9 (2nd) in mixolydian":
    "9.ª natural (2.ª) en el mixolidio",
  "Smooth chromatic lines":
    "Líneas cromáticas fluidas",
  "11th is natural 4th in mixolydian":
    "La 11.ª es la 4.ª natural del mixolidio",
  "Minor feel over sus4 voicings":
    "Color menor sobre voicings sus4",
  "13th is natural 6th":
    "La 13.ª es la 6.ª natural",
  "#11 adds modern tension":
    "La #11 añade tensión moderna",
  "Sus4 with b7 — unresolved dominant":
    "Sus4 con b7 — dominante sin resolver",
  "Minor context works over sus voicing":
    "Un contexto menor funciona sobre el voicing sus",
  "9 and 4 with b7 — modern jazz voicing":
    "9.ª y 4.ª con b7 — voicing de jazz moderno",
  "Half-whole pattern fits all chord tones including b9":
    "El patrón semitono/tono abarca todas las notas del acorde, incluida la b9",
  "Spanish/Flamenco flavor with b2":
    "Sabor español/flamenco con b2",
  "Maximum tension for resolving to minor":
    "Máxima tensión para resolver a menor",
  "Contains every chord tone — the #9 plus the major 3rd, perfect 5th and b7":
    "Contiene todas las notas del acorde — la #9 más la 3.ª mayor, la 5.ª justa y la b7",
  "Blues/rock context (the \"Hendrix chord\"): the scale's b3 is the chord's #9":
    "Contexto blues/rock (el «acorde de Hendrix»): el b3 de la escala es la #9 del acorde",
  "For a 7alt context: keeps the #9 but replaces the perfect 5th with b5/#5":
    "Para un contexto 7alt: mantiene la #9, pero cambia la 5.ª justa por b5/#5",
  "#11 (=b5) built into lydian dominant — jazz standard":
    "La #11 (=b5) forma parte del lidio dominante — estándar en el jazz",
  "All notes a whole step apart — dreamy":
    "Todas las notas a un tono de distancia — onírica",
  "Full altered sound for maximum tension":
    "Sonido alterado completo para máxima tensión",
  "Contains every chord tone (1-3-#5-b7) plus the 9th and #11 — symmetric and dreamy":
    "Contiene todas las notas del acorde (1-3-#5-b7) más la 9.ª y la #11 — simétrica y onírica",
  "#5 is part of the altered scale":
    "El #5 forma parte de la escala alterada",
  "THE altered scale — 7th mode of melodic minor":
    "La escala alterada por excelencia — 7.º modo de la menor melódica",
  "Similar b9/#9/#11 tension, but with a natural 13 instead of the chord's b13":
    "Tensión b9/#9/#11 similar, pero con 13.ª natural en lugar de la b13 del acorde",
  "#11 defines this chord — 4th mode of melodic minor":
    "La #11 define este acorde — 4.º modo de la menor melódica",
  "#11 over a dominant 7th — lydian dominant (4th mode of melodic minor)":
    "#11 sobre una séptima de dominante — lidio dominante (4.º modo de la menor melódica)",
  "Has the b7 and #11 but replaces the chord's perfect 5th with #5 — for voicings that omit the 5th":
    "Tiene la b7 y la #11, pero cambia la 5.ª justa del acorde por #5 — para voicings que omiten la 5.ª",
  "#11 IS the lydian 4th, with the major 7th and 9th":
    "La #11 ES la 4.ª lidia, con la 7.ª mayor y la 9.ª",
  "b6 (=b13) over a dominant 7th — 5th mode of melodic minor":
    "b6 (=b13) sobre una séptima de dominante — 5.º modo de la menor melódica",
  "Keeps the b13 but also alters the 5th — a darker, fully altered colour":
    "Mantiene la b13, pero también altera la 5.ª — un color más oscuro, totalmente alterado",
  "Contains b9 and natural 13 — symmetric scale":
    "Contiene la b9 y la 13.ª natural — escala simétrica",
  "2nd degree replaces 3rd — open, ambiguous":
    "El 2.º grado sustituye a la 3.ª — abierto, ambiguo",
  "Bluesy feel with b7 available":
    "Sabor a blues con la b7 disponible",
  "Clean melodic lines":
    "Líneas melódicas limpias",
  "4th wants to resolve — dominant function":
    "La 4.ª quiere resolver — función de dominante",
  "Minor context for sus4 voicing":
    "Contexto menor para el voicing sus4",
  "Suspended pentatonic (1-2-4-5-b7): no 3rd at all, so the sus sound stays intact":
    "Pentatónica suspendida (1-2-4-5-b7): sin ninguna 3.ª, así que el sonido sus se mantiene intacto",
  "Open sound — 2 and 4 with no 3rd":
    "Sonido abierto — 2.ª y 4.ª sin 3.ª",
  "Suspended pentatonic (1-2-4-5-b7): contains the 2 and 4, no 3rd":
    "Pentatónica suspendida (1-2-4-5-b7): contiene la 2.ª y la 4.ª, sin 3.ª",
  "Symmetric 8-note scale — whole step first, then alternating":
    "Escala simétrica de 8 notas — primero un tono, luego alternando",
  "Natural mode with b5 — darker sound":
    "Modo natural con b5 — sonido más oscuro",
  "All chord tones present — start whole step from root":
    "Todas las notas del acorde presentes — empieza con un tono desde la fundamental",
  "Natural fit for ii chord in minor keys":
    "Encaje natural para el acorde ii en tonalidades menores",
  "Natural 2 avoids b2 clash — smoother":
    "La 2.ª natural evita el choque del b2 — más suave",
  "Rare chord — symmetric scale provides options":
    "Acorde poco común — la escala simétrica ofrece opciones",
  "Every note whole step apart — dreamy, symmetric":
    "Todas las notas a un tono de distancia — onírica, simétrica",
  "#5 matches chord — mode 3 of melodic minor":
    "El #5 coincide con el acorde — 3.er modo de la menor melódica",
  "b7 and #5 both in whole tone scale":
    "La b7 y el #5 están ambos en la escala de tonos enteros",
  "#5 is part of altered — dominant function":
    "El #5 forma parte de la alterada — función de dominante",
  "#4 and #5 with maj7 — 3rd mode of melodic minor":
    "#4 y #5 con maj7 — 3.er modo de la menor melódica",
  "#4 (=b5 enharmonic) — lydian character":
    "#4 (enarmónico de b5) — carácter lidio",
  "Rock/metal standard":
    "Clásico del rock/metal",
  "#11 IS the lydian sound — perfect match":
    "La #11 ES el sonido lidio — encaje perfecto",
  "#5 and b9 are both altered tones":
    "El #5 y la b9 son ambas notas alteradas",
  "#5 and b7 fit, but the scale's natural 9 rubs against the chord's b9 — use sparingly":
    "El #5 y la b7 encajan, pero la 9.ª natural de la escala roza con la b9 del acorde — úsala con moderación",
  "b5 and b9 define the altered sound":
    "El b5 y la b9 definen el sonido alterado",
  "b5 and b9 in symmetric scale":
    "El b5 y la b9 en una escala simétrica",
  "#5 and #9 — full altered dominant":
    "#5 y #9 — dominante totalmente alterada",
  "#5 and b7 fit, but the scale has a natural 9 where the chord has #9":
    "El #5 y la b7 encajan, pero la escala tiene 9.ª natural donde el acorde tiene #9",
  "b5 and #9 — classic altered combination":
    "b5 y #9 — combinación alterada clásica",
  "Symmetric scale option":
    "Opción de escala simétrica",
};

/** The note in the learner's language; in PT/ES no English fallback (no tooltip). */
export function scaleContext(context: string | undefined, lang: ContentLanguage): string | undefined {
  if (!context || lang === 'en') return context;
  return (lang === 'pt' ? SCALE_CONTEXT_PT : SCALE_CONTEXT_ES)[context];
}
