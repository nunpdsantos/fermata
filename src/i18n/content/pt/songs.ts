import type { SongOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for song reference context strings (L1–L3)
// Only the `context` field is translated — song titles and artist names are
// kept in their original language.
// ---------------------------------------------------------------------------

const overlay: SongOverlay = {
  // =========================================================================
  // Nível 1
  // =========================================================================

  // ---- L1U1: Notação e Altura ----

  'l1u1m1': [
    'Escrita predominantemente na clave de sol, o que a torna numa peça clássica de iniciação à leitura na pauta.',
    'Utiliza movimento por graus conjuntos num registo estreito — ideal para praticar a leitura de notas na clave de sol.',
  ],
  'l1u1m2': [
    'A mão esquerda aventura-se frequentemente pelas linhas suplementares abaixo da clave de fá, demonstrando a extensão do registo na pauta dupla.',
    'Escrita em ambas as pautas do sistema de pautas, com figuras arpejadas que abrangem um registo amplo.',
  ],
  'l1u1m3': [
    'Construída inteiramente sobre meios-tons cromáticos, ilustrando sustenidos e bemóis em sucessão rápida.',
    'O riff icónico utiliza notas de passagem cromáticas (meios-tons) entre graus diatónicos da escala.',
  ],
  'l1u1m4': [
    'Uma das primeiras obras-primas construída em torno de extensas passagens de escala cromática.',
    'A melodia incorpora notas auxiliares cromáticas que colorem a tonalidade maior.',
  ],

  // ---- L1U2: Ritmo e Compasso ----

  'l1u2m1': [
    'Utiliza apenas semínimas e mínimas em compasso 4/4 — o vocabulário rítmico mais simples.',
    'A linha de baixo demonstra um pulso constante de semínimas com subdivisões em colcheias.',
  ],
  'l1u2m2': [
    'Alterna entre compasso 6/8 e 3/4, evidenciando como as indicações de compasso moldam a sensação rítmica.',
    'Escrita em compasso 5/4, demonstrando como compassos irregulares criam um carácter rítmico distinto.',
  ],

  // ---- L1U3: Escalas, Intervalos e Primeiros Acordes ----

  'l1u3m1': [
    'A melodia sobe e desce literalmente a escala maior, ensinando cada grau pelo nome.',
    'A melodia inicial é uma escala maior descendente da tónica à tónica.',
  ],
  'l1u3m2': [
    'Escrita em Sol maior (um sustenido — Fá#), demonstrando como uma armação de clave simples molda o som de uma canção clássica.',
    'Na tonalidade de Fá maior (um bemol), um bom ponto de partida para ler armações de clave além de Dó maior.',
  ],
  'l1u3m3': [
    'Abre com uma quarta perfeita — um dos intervalos mais reconhecíveis na música ocidental.',
    'O salto inicial é uma oitava, o maior intervalo básico. Uma referência clássica para o reconhecimento de intervalos.',
    'Abre com uma quinta perfeita, um intervalo fundamental para o treino auditivo.',
  ],
  'l1u3m4': [
    'Construída sobre uma progressão de quatro acordes (Dó–Sol–Lám–Fá) em que todos os acordes maiores são tríades em posição fundamental.',
    'Utiliza tríades maiores simples (Lá, Ré, Mi) num padrão repetitivo — a essência da harmonia básica de acordes.',
  ],

  // =========================================================================
  // Nível 2
  // =========================================================================

  // ---- L2U4: Todas as Tonalidades Maiores e Graus da Escala ----

  'l2u4m1': [
    'Em Dó maior — demonstra como o ciclo de quintas coloca a tonalidade mais simples na posição das 12 horas.',
    'Escrita em Lá maior (três sustenidos), mostrando como os compositores trabalham confortavelmente em tonalidades com sustenidos.',
  ],
  'l2u4m2': [
    'A melodia segue o movimento 1–1–5–5–6–6–5, delineando claramente os graus de tónica, dominante e submediante.',
    'Contém movimentos proeminentes do 5.o grau (dominante) e do 1.o grau (tónica) — um exemplo natural de graus funcionais.',
  ],

  // ---- L2U5: Escalas Menores e Relações entre Tonalidades ----

  'l2u5m1': [
    'Construída sobre a escala menor natural (eólio) em Lá menor, com a característica sétima bemol.',
    'Escrita inteiramente em Mi menor usando apenas os acordes de Em e C — um som menor natural (eólio) puro, sem sexta ou sétima elevadas, tornando-a um exemplo de manual do modo eólio.',
  ],
  'l2u5m2': [
    'Utiliza a escala menor harmónica — a segunda aumentada entre o b6 e o #7 confere-lhe a sua sonoridade distintiva.',
    'O uso de Mi maior (V) sobre uma tonalidade de Lá menor implica a menor harmónica, com o 7.o grau elevado (Sol#) a criar uma forte atração de volta à tónica.',
  ],
  'l2u5m3': [
    'Começa em Lá menor (relativa menor de Dó maior), modulando depois — uma relação clássica entre tonalidades relativas.',
    'Alterna entre os versos em Lá menor e o contexto da sua relativa maior (Dó maior), demonstrando a relação próxima entre tonalidades relativas que partilham a mesma armação de clave.',
  ],

  // ---- L2U6: Compasso Composto e Síncopa ----

  'l2u6m1': [
    'O acompanhamento arpejado em compasso 6/8 demonstra o compasso composto binário, em que cada um dos dois tempos principais se subdivide em grupos de três colcheias.',
    'O verso está em 6/8 antes de o refrão mudar de sensação — um contraste entre compasso composto e simples.',
  ],
  'l2u6m2': [
    'Um exemplo definidor de síncopa no ragtime — os acentos caem consistentemente entre os tempos.',
    'Síncopa intensa tanto no riff de clavinet como na linha vocal, com acentos no contratempo.',
  ],

  // ---- L2U7: Intervalos, Tríades e Harmonia Diatónica ----

  'l2u7m1': [
    'Abre com um salto de quarta perfeita, e a melodia delineia intervalos maiores e menores ao longo da peça.',
    'A figura inicial de quatro notas (Dó–Mi–Fá–Sol) começa com um salto brilhante de terça maior — uma das referências clássicas de treino auditivo para identificar o intervalo de 3.a maior.',
  ],
  'l2u7m2': [
    'Abre com uma quarta aumentada (trítono) — o "intervalo do diabo" utilizado para efeito dramático.',
    'Contém intervalos compostos (nonas, décimas) na melodia, estendendo-se para além da oitava.',
  ],
  'l2u7m3': [
    'Apresenta tríades maiores, menores e aumentadas — o acorde de Mi aumentado cria tensão antes de resolver, demonstrando como diferentes qualidades de tríades servem diferentes funções harmónicas.',
    'A progressão I–III–IV–iv (Sol–Si–Dó–Dóm) apresenta um acorde maior cromático (III) emprestado de fora da tonalidade e um subdominante menor emprestado (iv), mostrando como a qualidade das tríades cria cor emocional.',
  ],
  'l2u7m4': [
    'A linha de baixo move-se por tríades em posição fundamental e primeira inversão — um exemplo clássico de condução de vozes no baixo cifrado.',
    'Cada compasso arpeja um acorde, muitos em primeira ou segunda inversão, seguindo as convenções do baixo cifrado.',
  ],
  'l2u7m5': [
    'A progressão I–V–vi–iii–IV–I–IV–V demonstra cinco das sete tríades diatónicas num padrão de baixo descendente que se tornou uma das progressões de acordes mais famosas da música ocidental.',
    'Utiliza a progressão I–V–vi–IV — o padrão de numerais romanos diatónicos mais comum na música pop.',
  ],

  // =========================================================================
  // Nível 3
  // =========================================================================

  // ---- L3U9: Acordes de Sétima e Harmonia Diatónica ----

  'l3u9m1': [
    'As mudanças de acorde percorrem acordes de sétima maior, sétima menor e sétima da dominante — três das cinco qualidades de acordes de sétima num único standard.',
    'Abre com um acorde de sétima maior, estabelecendo a qualidade calorosa que define a harmonia da bossa nova.',
  ],
  'l3u9m2': [
    'Utiliza acordes de sétima em várias inversões para uma condução de vozes suave entre acordes.',
    'O arranjo para piano apresenta acordes de sétima em inversões de posição cerrada ao longo de toda a peça.',
  ],
  'l3u9m3': [
    'Percorre acordes de sétima diatónicos em tonalidades maiores usando o movimento do ciclo de quintas (vi7–ii7–V7–Imaj7).',
    'A progressão de "rhythm changes" (Imaj7–vi7–ii7–V7) tornou-se um modelo para centenas de composições de jazz.',
  ],
  'l3u9m4': [
    'Abre em Dó menor com uma progressão i7–iv7–iiø7–V7, demonstrando como os acordes de sétima diatónicos e o movimento cadencial ii–V funcionam numa tonalidade menor.',
    'A progressão de acordes de sétima em tonalidade menor (i–iv7–V7) cria a sensação lânguida da canção.',
  ],

  // ---- L3U10: Condução de Vozes e Escrita a Partes ----

  'l3u10m1': [
    'As secções corais são um modelo de escrita SATB — cada voz move-se suavemente dentro do seu registo.',
    'A harmonização de Bach é um exemplo clássico de escrita coral a quatro vozes (SATB).',
  ],
  'l3u10m2': [
    'Apesar de ser arpejada, a condução de vozes subjacente evita quintas e oitavas paralelas ao longo de toda a peça.',
  ],
  'l3u10m3': [
    'As harmonizações de hinos padrão utilizam tríades em posição fundamental ligadas por uma condução de vozes correta — um exercício clássico de escrita a partes.',
  ],
  'l3u10m4': [
    'O acompanhamento apresenta tríades em inversão que se movem por grau conjunto, criando linhas de baixo suaves sob a melodia.',
  ],

  // ---- L3U11: Cadências, Frases e Ornamentação ----

  'l3u11m1': [
    'Cada verso termina com uma cadência perfeita clara (V–I) na palavra "Hallelujah".',
    'Contém tanto meias-cadências (repouso no V) como cadências perfeitas dentro da sua estrutura fraseológica.',
  ],
  'l3u11m2': [
    'A melodia está estruturada como um período paralelo — duas frases, a primeira terminando numa meia-cadência, a segunda numa cadência perfeita.',
    'Um exemplo clássico de estrutura antecedente-consequente formando um período musical.',
  ],
  'l3u11m3': [
    'Utiliza um ritmo harmónico dramaticamente variado — desde acordes lentos de balada até mudanças operáticas em cadência rápida.',
    'Mantém um ritmo harmónico regular com um acorde por compasso, tornando o andamento harmónico fácil de sentir e analisar.',
  ],
  'l3u11m4': [
    'O acompanhamento arpejado apresenta notas de passagem e notas auxiliares entre as notas do acorde.',
    'Rica em notas estranhas ao acorde — suspensões, apogiaturas e notas de passagem criam a sua qualidade onírica.',
  ],
  'l3u11m5': [
    'A linha melódica ornamentada é construída sobre cadeias de suspensões e notas de passagem sobre um baixo simples.',
    'A melodia ornamentada entrelaça notas de passagem cromáticas e notas auxiliares em torno das notas estruturais do acorde.',
  ],
};

export default overlay;
