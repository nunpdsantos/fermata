/**
 * The tester's sheet (2026-11-14), ported from the owner's private page
 * (fermatina-test-sheet.v3.html, English and Portuguese) with Spanish added
 * (Spain's Spanish, tú; for the language review). Three sheets and a guide
 * for someone watching a tester.
 *
 * NO APP LABEL IS TYPED HERE. Wherever the sheet names something in the app
 * (a menu item, a tab, a button, a door of the start screen, a lesson), it
 * writes a placeholder that resolve.ts fills in at build time:
 *   {{app:<key>}}            the app's own locale files, by key (as the public
 *                            pages' `appText` does; a missing key fails the
 *                            build), e.g. {{app:report.menuItem}};
 *   {{app:<key>|name=value}} the same with its {{name}} places filled;
 *   {{lesson:<id>}}          a lesson's title, from the curriculum in that
 *                            language (with its overlay);
 *   {{sheet:<path>}}         the sheet's own words (its tabs, its buttons);
 *   {{site:<key>}}           a reviewed sentence of the public pages
 *                            (src/site/strings.ts).
 * So a label renamed in the app is renamed in every hint, and a key that
 * disappears fails the build. The tests (src/site/testSheet/__tests__/)
 * fail when a quoted span (“…” or «…») here is anything but one placeholder
 * or one of NOT_LABELS below, and when an app view or menu name is typed.
 */
import type { ClosingId, SheetId, SheetLang, SheetUi } from './model';

export type T3 = Record<SheetLang, string>;

export interface TaskTemplate {
  id: string;
  goal: T3;
  /** "find" sheets: the hint behind "Stuck? Show a hint" (null: no hint, said so). */
  hint?: T3 | null;
  /** "check" sheets: where to go, and what should happen. */
  where?: T3;
  expect?: T3;
}

export interface SheetTemplate {
  kind: 'find' | 'check';
  closing: ClosingId[];
  intro: T3;
  tasks: TaskTemplate[];
}

export interface GuideTemplate {
  title: T3;
  intro: T3;
  sections: { h: T3; items: T3[]; say?: T3 }[];
}

/**
 * Quoted spans that are not words of the app's locale files, each with why:
 *  - "⋯" and "⇄": glyphs drawn on the app's buttons (the menu's three dots,
 *    an SVG; the flip button's arrow, FlipNeckButton.tsx), not words;
 *  - "build this chord": a description of a kind of check, not a label.
 * A test proves none of these is a string of the app's locale files.
 */
export const NOT_LABELS: Record<SheetLang, readonly string[]> = {
  en: ['⋯', '⇄', 'build this chord'],
  pt: ['⋯', '⇄', 'constrói este acorde'],
  es: ['⋯', '⇄', 'construye este acorde'],
};

export const UI_TEMPLATES: Record<SheetLang, SheetUi> = {
  en: {
    title: 'Fermatina test sheet',
    lead: 'Allow about twenty minutes. Nothing you do here is wrong: when something is hard to find, that is the app’s fault, and it is exactly what we want to know.',
    open: '{{site:openApp}}',
    appnote: 'It opens in a new tab. Come back to this page to mark each task.',
    languageLabel: '{{app:nav.languageLabel}}',
    sheetsLabel: 'Sheets',
    tabs: { new: 'New to music', player: 'I play, no theory', instrument: 'Instrument and microphone', watching: 'Watching someone' },
    find: { ok: 'Did it', hard: 'Hard to find', no: 'Couldn’t' },
    check: { ok: 'Worked', hard: 'Partly', no: 'Didn’t work' },
    result: 'Result',
    hint: 'Stuck? Show a hint',
    nohint: 'No hint for this one. If you can’t find it, that is the finding.',
    where: 'Where',
    expect: 'What should happen',
    notes: 'What happened? (optional)',
    progress: '{n} of {t} answered',
    before: 'Before you go',
    q: {
      what: 'In your own words, what is this app for?',
      confusing: 'What was the most confusing moment?',
      again: 'Would you open it again? What for?',
      surprise: 'Did anything surprise you, good or bad?',
      device: 'Your device and browser (for example: iPhone 13, Safari)',
      lang: 'The language you used in the app',
    },
    send: 'Send your answers',
    sendtext: 'This page saves nothing online: your answers stay in this browser until you send them.',
    ua: 'Your browser’s own description is added at the end, so a problem can be reproduced.',
    sendButton: 'Send my answers',
    sendNote: 'A Google form opens with your answers already filled in. Press the button at the bottom of that page to send them.',
    tooLong: 'What you wrote is too long for this button. Shorten it, or use “{{sheet:copy}}” and send the copied text in a message to the person who gave you this page.',
    offline: '{{app:report.offline}}',
    empty: 'Nothing to send yet: mark at least one task, or write a note or an answer.',
    copy: 'Copy my answers',
    copied: 'Copied. Now paste it into a message.',
    copyfail: 'Copying did not work here. Select the text below and copy it by hand.',
    clear: 'Clear this sheet',
    clear2: 'Tap again to clear',
    none: 'not answered',
    hintused: 'hint used',
    browser: 'Browser',
    sheetword: 'Fermatina test',
    noscript: 'This sheet needs JavaScript to work.',
  },
  pt: {
    title: 'Folha de teste da Fermatina',
    lead: 'Conta com uns vinte minutos. Aqui não há respostas erradas: quando algo é difícil de encontrar, a falha é da app, e é isso mesmo que queremos saber.',
    open: '{{site:openApp}}',
    appnote: 'Abre num novo separador. Volta a esta página para marcar cada tarefa.',
    languageLabel: '{{app:nav.languageLabel}}',
    sheetsLabel: 'Folhas',
    tabs: { new: 'Estou a começar', player: 'Toco, sem teoria', instrument: 'Instrumento e microfone', watching: 'A observar alguém' },
    find: { ok: 'Consegui', hard: 'Foi difícil', no: 'Não consegui' },
    check: { ok: 'Funcionou', hard: 'Em parte', no: 'Não funcionou' },
    result: 'Resultado',
    hint: 'Sem saída? Ver uma dica',
    nohint: 'Esta não tem dica. Se não encontrares, é isso mesmo que interessa saber.',
    where: 'Onde',
    expect: 'O que deve acontecer',
    notes: 'O que aconteceu? (opcional)',
    progress: '{n} de {t} respondidas',
    before: 'Antes de terminares',
    q: {
      what: 'Por palavras tuas, para que serve esta app?',
      confusing: 'Qual foi o momento mais confuso?',
      again: 'Voltavas a abri-la? Para quê?',
      surprise: 'Alguma coisa te surpreendeu, pela positiva ou pela negativa?',
      device: 'O teu dispositivo e navegador (por exemplo: iPhone 13, Safari)',
      lang: 'A língua que usaste na app',
    },
    send: 'Envia as tuas respostas',
    sendtext: 'Esta página não guarda nada na internet: as tuas respostas ficam neste navegador até as enviares.',
    ua: 'A descrição que o teu navegador dá de si próprio é acrescentada no fim, para ser possível reproduzir um problema.',
    sendButton: 'Enviar as minhas respostas',
    sendNote: 'Abre-se um formulário Google com as tuas respostas já preenchidas. Carrega no botão no fim dessa página para as enviares.',
    tooLong: 'O que escreveste é demasiado longo para este botão. Encurta-o ou usa «{{sheet:copy}}» e envia o texto copiado numa mensagem a quem te deu esta página.',
    offline: '{{app:report.offline}}',
    empty: 'Ainda não há nada para enviar: marca pelo menos uma tarefa ou escreve uma nota ou uma resposta.',
    copy: 'Copiar as minhas respostas',
    copied: 'Copiado. Agora cola numa mensagem.',
    copyfail: 'Não foi possível copiar aqui. Seleciona o texto abaixo e copia-o à mão.',
    clear: 'Limpar esta folha',
    clear2: 'Toca outra vez para limpar',
    none: 'sem resposta',
    hintused: 'usou a dica',
    browser: 'Navegador',
    sheetword: 'Teste da Fermatina',
    noscript: 'Esta folha precisa de JavaScript para funcionar.',
  },
  es: {
    title: 'Hoja de prueba de Fermatina',
    lead: 'Calcula unos veinte minutos. Aquí nada de lo que hagas está mal: cuando algo es difícil de encontrar, la culpa es de la app, y es justo lo que queremos saber.',
    open: '{{site:openApp}}',
    appnote: 'Se abre en una pestaña nueva. Vuelve a esta página para marcar cada tarea.',
    languageLabel: '{{app:nav.languageLabel}}',
    sheetsLabel: 'Hojas',
    tabs: { new: 'Estoy empezando', player: 'Toco, sin teoría', instrument: 'Instrumento y micrófono', watching: 'Observar a alguien' },
    find: { ok: 'Lo conseguí', hard: 'Me costó', no: 'No lo conseguí' },
    check: { ok: 'Funcionó', hard: 'En parte', no: 'No funcionó' },
    result: 'Resultado',
    hint: '¿No lo encuentras? Ver una pista',
    nohint: 'Esta tarea no tiene pista. Si no lo encuentras, eso es justo lo que nos interesa saber.',
    where: 'Dónde',
    expect: 'Qué debería pasar',
    notes: '¿Qué ha pasado? (opcional)',
    progress: '{n} de {t} respondidas',
    before: 'Antes de terminar',
    q: {
      what: 'Con tus palabras, ¿para qué sirve esta app?',
      confusing: '¿Cuál ha sido el momento más confuso?',
      again: '¿Volverías a abrirla? ¿Para qué?',
      surprise: '¿Te ha sorprendido algo, para bien o para mal?',
      device: 'Tu dispositivo y navegador (por ejemplo: iPhone 13, Safari)',
      lang: 'El idioma que has usado en la app',
    },
    send: 'Envía tus respuestas',
    sendtext: 'Esta página no guarda nada en internet: tus respuestas se quedan en este navegador hasta que las envíes.',
    ua: 'Al final se añade la descripción que tu navegador da de sí mismo, para poder reproducir un problema.',
    sendButton: 'Enviar mis respuestas',
    sendNote: 'Se abre un formulario de Google con tus respuestas ya rellenadas. Pulsa el botón al final de esa página para enviarlas.',
    tooLong: 'Lo que has escrito es demasiado largo para este botón. Acórtalo o usa «{{sheet:copy}}» y envía el texto copiado en un mensaje a quien te dio esta página.',
    offline: '{{app:report.offline}}',
    empty: 'Todavía no hay nada que enviar: marca al menos una tarea o escribe una nota o una respuesta.',
    copy: 'Copiar mis respuestas',
    copied: 'Copiado. Ahora pégalo en un mensaje.',
    copyfail: 'Aquí no se ha podido copiar. Selecciona el texto de abajo y cópialo a mano.',
    clear: 'Borrar esta hoja',
    clear2: 'Pulsa otra vez para borrar',
    none: 'sin respuesta',
    hintused: 'pista usada',
    browser: 'Navegador',
    sheetword: 'Prueba de Fermatina',
    noscript: 'Esta hoja necesita JavaScript para funcionar.',
  },
};

// Shared tasks (the same goal and hint on both "find" sheets).
const OPEN_GOAL: T3 = {
  en: 'Open Fermatina and begin in whichever way suits you.',
  pt: 'Abre a Fermatina e começa da forma que te parecer melhor.',
  es: 'Abre Fermatina y empieza de la forma que mejor te parezca.',
};
const DOTTED_HINT: T3 = {
  en: 'Words with a dotted line under them can be tapped.',
  pt: 'Podes tocar nas palavras com um sublinhado pontilhado.',
  es: 'Puedes pulsar las palabras subrayadas con puntos.',
};
const TELL_GOAL: T3 = {
  en: 'Suppose something in the app looks wrong and you want to tell the people who make it. Find where you would do that. You don’t need to send anything.',
  pt: 'Imagina que algo na app parece errado e queres avisar quem a faz. Descobre onde o poderias fazer. Não precisas de enviar nada.',
  es: 'Imagina que algo de la app parece estar mal y quieres decírselo a quienes la hacen. Busca dónde podrías hacerlo. No hace falta que envíes nada.',
};
const TELL_HINT: T3 = {
  en: 'Open the “⋯” menu at the top and choose “{{app:report.menuItem}}”. A short form opens in a new tab; close it without sending.',
  pt: 'Abre o menu «⋯» no topo e escolhe «{{app:report.menuItem}}». Abre-se um formulário curto num novo separador; fecha-o sem enviar.',
  es: 'Abre el menú «⋯» de arriba y elige «{{app:report.menuItem}}». Se abre un formulario corto en una pestaña nueva; ciérralo sin enviarlo.',
};

export const SHEET_TEMPLATES: Record<SheetId, SheetTemplate> = {
  new: {
    kind: 'find',
    closing: ['what', 'confusing', 'again', 'device', 'lang'],
    intro: {
      en: 'For someone who has never studied music. Use your own phone or computer, with the sound on.',
      pt: 'Para quem nunca estudou música. Usa o teu telemóvel ou computador, com o som ligado.',
      es: 'Para quien nunca ha estudiado música. Usa tu propio móvil u ordenador, con el sonido activado.',
    },
    tasks: [
      {
        id: 'n1',
        goal: OPEN_GOAL,
        hint: {
          en: 'On the first screen, choose “{{app:start.door.new.title}}”.',
          pt: 'No primeiro ecrã, escolhe «{{app:start.door.new.title}}».',
          es: 'En la primera pantalla, elige «{{app:start.door.new.title}}».',
        },
      },
      {
        id: 'n2',
        goal: {
          en: 'Do the first lesson you are offered, right to the end.',
          pt: 'Faz a primeira lição que te é proposta, até ao fim.',
          es: 'Haz hasta el final la primera lección que te proponga la app.',
        },
        hint: {
          en: 'It is the first lesson of “{{app:tracks.sound.title}}”, under {{app:nav.learn}}.',
          pt: 'É a primeira lição de «{{app:tracks.sound.title}}», em {{app:nav.learn}}.',
          es: 'Es la primera lección de «{{app:tracks.sound.title}}», en {{app:nav.learn}}.',
        },
      },
      {
        id: 'n3',
        goal: {
          en: 'Leave the lessons and play five notes, any notes, on the instrument on screen.',
          pt: 'Sai das lições e toca cinco notas, quaisquer, no instrumento que aparece no ecrã.',
          es: 'Sal de las lecciones y toca cinco notas, las que quieras, en el instrumento de la pantalla.',
        },
        hint: {
          en: 'Go to {{app:nav.explore}} and tap the piano keys or the guitar strings.',
          pt: 'Vai a {{app:nav.explore}} e toca nas teclas do piano ou nas cordas da guitarra.',
          es: 'Ve a {{app:nav.explore}} y pulsa las teclas del piano o las cuerdas de la guitarra.',
        },
      },
      {
        id: 'n4',
        goal: {
          en: 'Change from the piano to the guitar, or the other way round.',
          pt: 'Muda do piano para a guitarra, ou ao contrário.',
          es: 'Cambia del piano a la guitarra, o al revés.',
        },
        hint: null,
      },
      {
        id: 'n5',
        goal: {
          en: 'Find a word on screen that you don’t understand, and get the app to explain it.',
          pt: 'Encontra no ecrã uma palavra que não percebas e faz com que a app a explique.',
          es: 'Busca en la pantalla una palabra que no entiendas y haz que la app te la explique.',
        },
        hint: DOTTED_HINT,
      },
      {
        id: 'n6',
        goal: {
          en: 'Find the one-minute tour of the app and watch it.',
          pt: 'Encontra a visita guiada de um minuto e vê-a.',
          es: 'Busca la visita guiada de un minuto y mírala.',
        },
        hint: {
          en: 'Open the “⋯” menu at the top and choose “{{app:showMe.menuItem}}”.',
          pt: 'Abre o menu «⋯» no topo e escolhe «{{app:showMe.menuItem}}».',
          es: 'Abre el menú «⋯» de arriba y elige «{{app:showMe.menuItem}}».',
        },
      },
      { id: 'n8', goal: TELL_GOAL, hint: TELL_HINT },
      {
        id: 'n7',
        goal: {
          en: 'Close the page completely. Open it again and carry on with your lessons where you stopped.',
          pt: 'Fecha a página por completo. Abre-a outra vez e continua as lições no ponto onde ficaste.',
          es: 'Cierra la página del todo. Vuelve a abrirla y sigue con tus lecciones donde lo dejaste.',
        },
        hint: {
          en: 'Open {{app:nav.learn}} and look for your lessons in “{{app:tracks.sound.title}}”.',
          pt: 'Abre {{app:nav.learn}} e procura as tuas lições em «{{app:tracks.sound.title}}».',
          es: 'Abre {{app:nav.learn}} y busca tus lecciones en «{{app:tracks.sound.title}}».',
        },
      },
    ],
  },
  player: {
    kind: 'find',
    closing: ['what', 'confusing', 'again', 'device', 'lang'],
    intro: {
      en: 'For someone who plays guitar or piano but never learned the theory behind it. Have a song in mind whose chords you know.',
      pt: 'Para quem toca guitarra ou piano mas nunca aprendeu a teoria. Pensa numa música de que saibas os acordes.',
      es: 'Para quien toca la guitarra o el piano pero nunca ha aprendido la teoría que hay detrás. Piensa en una canción cuyos acordes conozcas.',
    },
    tasks: [
      {
        id: 'p1',
        goal: OPEN_GOAL,
        hint: {
          en: 'On the first screen, choose “{{app:start.door.player.title}}”.',
          pt: 'No primeiro ecrã, escolhe «{{app:start.door.player.title}}».',
          es: 'En la primera pantalla, elige «{{app:start.door.player.title}}».',
        },
      },
      {
        id: 'p2',
        goal: {
          en: 'Take the chords of a song you know (or use G, D, Em and C). Get the app to tell you which key they belong to.',
          pt: 'Pega nos acordes de uma música que conheças (ou usa Sol, Ré, Mi menor e Dó: G, D, Em e C). Faz com que a app te diga a que tonalidade pertencem.',
          es: 'Elige los acordes de una canción que conozcas (o usa Sol, Re, Mi menor y Do: G, D, Em y C). Haz que la app te diga a qué tonalidad pertenecen.',
        },
        hint: {
          en: 'In {{app:nav.explore}}, open “{{app:progression.open}}” and add your chords.',
          pt: 'Em {{app:nav.explore}}, abre «{{app:progression.open}}» e adiciona os teus acordes.',
          es: 'En {{app:nav.explore}}, abre «{{app:progression.open}}» y añade tus acordes.',
        },
      },
      {
        id: 'p3',
        goal: {
          en: 'Make the app play those chords round and round. Then slow it down.',
          pt: 'Põe a app a tocar esses acordes em ciclo. Depois torna-a mais lenta.',
          es: 'Haz que la app toque esos acordes una y otra vez. Luego haz que suene más despacio.',
        },
        hint: {
          en: '“{{app:progression.loop}}” starts it. “{{app:progression.tempo}}” has slower and faster.',
          pt: '«{{app:progression.loop}}» começa a tocar. «{{app:progression.tempo}}» tem mais lento e mais rápido.',
          es: '«{{app:progression.loop}}» lo pone en marcha. «{{app:progression.tempo}}» tiene botones para ir más lento y más rápido.',
        },
      },
      {
        id: 'p4',
        goal: {
          en: 'Guitarists: you want to play the same song with a capo. Find out which chord shapes to play.',
          pt: 'Para guitarristas: queres tocar a mesma música com um capo. Descobre que formas de acordes deves tocar.',
          es: 'Para guitarristas: quieres tocar la misma canción con un capo. Averigua qué formas de acordes tienes que tocar.',
        },
        hint: {
          en: 'The {{app:progression.open}} panel has “{{app:progression.capoIdeas}}”. The guitar neck also has a “{{app:capo.setting}}” setting.',
          pt: 'O painel {{app:progression.open}} tem «{{app:progression.capoIdeas}}». O braço da guitarra também tem uma opção «{{app:capo.setting}}».',
          es: 'El panel {{app:progression.open}} tiene «{{app:progression.capoIdeas}}». El mástil de la guitarra también tiene una opción «{{app:capo.setting}}».',
        },
      },
      {
        id: 'p8',
        goal: {
          en: 'Guitarists: suppose the neck on screen is drawn the opposite way round to how you picture a guitar. Turn it round, then leave it the way you prefer.',
          pt: 'Para guitarristas: imagina que o braço, no ecrã, está desenhado ao contrário de como costumas ver uma guitarra. Inverte-o e, depois, deixa-o como preferires.',
          es: 'Para guitarristas: imagina que el mástil de la pantalla está dibujado al revés de como te imaginas una guitarra. Dale la vuelta y, después, déjalo como prefieras.',
        },
        hint: {
          en: 'In the row of buttons under the guitar neck there is a button “⇄” called “{{app:neckView.flip}}” (on a phone, drag the instrument panel at the bottom of the screen upwards if you don’t see it).',
          pt: 'Na linha de botões por baixo do braço da guitarra há um botão «⇄», chamado «{{app:neckView.flip}}» (num telemóvel, puxa para cima o painel do instrumento, ao fundo do ecrã, se não o vires).',
          es: 'En la fila de botones debajo del mástil de la guitarra hay un botón «⇄» llamado «{{app:neckView.flip}}» (en un móvil, arrastra hacia arriba el panel del instrumento, al pie de la pantalla, si no lo ves).',
        },
      },
      {
        id: 'p5',
        goal: {
          en: 'Do the first lesson of “{{app:tracks.chords.title}}”.',
          pt: 'Faz a primeira lição de «{{app:tracks.chords.title}}».',
          es: 'Haz la primera lección de «{{app:tracks.chords.title}}».',
        },
        hint: {
          en: 'It is under {{app:nav.learn}}.',
          pt: 'Está em {{app:nav.learn}}.',
          es: 'Está en {{app:nav.learn}}.',
        },
      },
      {
        id: 'p6',
        goal: {
          en: 'Find a word or symbol on screen that you don’t understand, and get the app to explain it.',
          pt: 'Encontra no ecrã uma palavra ou um símbolo que não percebas e faz com que a app o explique.',
          es: 'Busca en la pantalla una palabra o un símbolo que no entiendas y haz que la app te lo explique.',
        },
        hint: DOTTED_HINT,
      },
      {
        id: 'p7',
        goal: {
          en: 'Answer a few quick questions in {{app:nav.drill}}.',
          pt: 'Responde a algumas perguntas rápidas em {{app:nav.drill}}.',
          es: 'Responde a unas cuantas preguntas rápidas en {{app:nav.drill}}.',
        },
        hint: {
          en: '{{app:nav.drill}} is the third tab at the top. Press “{{app:drill.intro.start}}”.',
          pt: '{{app:nav.drill}} é o terceiro separador no topo. Carrega em «{{app:drill.intro.start}}».',
          es: '{{app:nav.drill}} es la tercera pestaña de arriba. Pulsa «{{app:drill.intro.start}}».',
        },
      },
      { id: 'p9', goal: TELL_GOAL, hint: TELL_HINT },
    ],
  },
  instrument: {
    kind: 'check',
    closing: ['surprise', 'device', 'lang'],
    intro: {
      en: 'For anyone with a real instrument to hand, somewhere fairly quiet. These parts were only ever tested with computer-made sound, so a real guitar, piano or voice in a real room is the test. A phone is the most useful device to try.',
      pt: 'Para quem tem um instrumento à mão, num sítio sossegado. Estas partes só foram testadas com som gerado por computador; por isso o teste é uma guitarra, um piano ou uma voz a sério, numa sala a sério. O telemóvel é o dispositivo mais útil para experimentar.',
      es: 'Para quien tenga un instrumento a mano, en un sitio bastante tranquilo. Estas partes solo se han probado con sonido generado por ordenador, así que hay que probarlas con una guitarra, un piano o una voz de verdad, en una sala de verdad. El móvil es el dispositivo más útil para la prueba.',
    },
    tasks: [
      {
        id: 'i1',
        goal: {
          en: 'Tune one string, or hold one steady note, with the tuner.',
          pt: 'Afina uma corda, ou segura uma nota firme, com o afinador.',
          es: 'Afina una cuerda, o mantén una nota firme, con el afinador.',
        },
        where: {
          en: '“⋯” menu → {{app:tunerEntry.menuItem}}, then tap the {{app:micSwitchEntry.label}} switch.',
          pt: 'Menu «⋯» → {{app:tunerEntry.menuItem}}; depois toca no interruptor {{app:micSwitchEntry.label}}.',
          es: 'Menú «⋯» → {{app:tunerEntry.menuItem}}; después pulsa el interruptor {{app:micSwitchEntry.label}}.',
        },
        expect: {
          en: 'Fermatina says in one sentence why it wants the microphone, then your browser asks permission. After that the note’s name appears and the needle shows how far off you are.',
          pt: 'A Fermatina diz numa frase porque quer o microfone e, depois, o navegador pede autorização. A seguir aparece o nome da nota e a agulha mostra quão desafinado estás.',
          es: 'Fermatina explica en una frase por qué quiere el micrófono y, después, el navegador pide permiso. A continuación aparece el nombre de la nota y la aguja muestra cuánto te desvías.',
        },
      },
      {
        id: 'i2',
        goal: {
          en: 'Turn the microphone off. Is it obvious at a glance that it is off?',
          pt: 'Desliga o microfone. Percebe-se logo, à primeira vista, que está desligado?',
          es: 'Desactiva el micrófono. ¿Se ve a simple vista que está desactivado?',
        },
        where: {
          en: 'The same {{app:micSwitchEntry.label}} switch.',
          pt: 'O mesmo interruptor {{app:micSwitchEntry.label}}.',
          es: 'El mismo interruptor {{app:micSwitchEntry.label}}.',
        },
        expect: {
          en: 'The switch says “{{app:micSwitchEntry.off}}” and its microphone icon is crossed out.',
          pt: 'O interruptor diz «{{app:micSwitchEntry.off}}» e o ícone do microfone fica riscado.',
          es: 'El interruptor dice «{{app:micSwitchEntry.off}}» y su icono de micrófono aparece tachado.',
        },
      },
      {
        id: 'i3',
        goal: {
          en: 'In {{app:nav.explore}}, turn the microphone on and play single notes, slowly.',
          pt: 'Em {{app:nav.explore}}, liga o microfone e toca notas soltas, devagar.',
          es: 'En {{app:nav.explore}}, activa el micrófono y toca notas sueltas, despacio.',
        },
        where: {
          en: 'The {{app:micSwitchEntry.label}} switch at the top of {{app:nav.explore}}.',
          pt: 'O interruptor {{app:micSwitchEntry.label}} no topo de {{app:nav.explore}}.',
          es: 'El interruptor {{app:micSwitchEntry.label}} en la parte de arriba de {{app:nav.explore}}.',
        },
        expect: {
          en: 'Each note you play lights up on the instrument on screen. Only single notes are recognised, not chords.',
          pt: 'Cada nota que tocas acende-se no instrumento do ecrã. Só são reconhecidas notas soltas, não acordes.',
          es: 'Cada nota que tocas se ilumina en el instrumento de la pantalla. Solo se reconocen notas sueltas, no acordes.',
        },
      },
      {
        id: 'i4',
        goal: {
          en: 'Answer a “build this chord” check by playing the notes on your instrument, one at a time.',
          pt: 'Responde a uma verificação «constrói este acorde» tocando as notas no teu instrumento, uma de cada vez.',
          es: 'Responde a una comprobación de «construye este acorde» tocando las notas en tu instrumento, una a una.',
        },
        where: {
          en: 'For example the check of “{{lesson:l1u34m5}}” ({{app:nav.learn}} → {{app:tracks.sound.title}}, lesson 5). Turn on the {{app:micSwitchEntry.label}} switch shown inside the check.',
          pt: 'Por exemplo, a verificação da lição 5 de «{{app:tracks.sound.title}}» (em {{app:nav.learn}}). Liga o interruptor {{app:micSwitchEntry.label}} que aparece dentro da verificação.',
          es: 'Por ejemplo, la comprobación de «{{lesson:l1u34m5}}» ({{app:nav.learn}} → {{app:tracks.sound.title}}, lección 5). Activa el interruptor {{app:micSwitchEntry.label}} que aparece dentro de la comprobación.',
        },
        expect: {
          en: 'Each note you play is added to your answer.',
          pt: 'Cada nota que tocas é acrescentada à tua resposta.',
          es: 'Cada nota que tocas se añade a tu respuesta.',
        },
      },
      {
        id: 'i5',
        goal: {
          en: 'With the microphone on in {{app:nav.explore}}, go to {{app:nav.learn}}.',
          pt: 'Com o microfone ligado em {{app:nav.explore}}, vai a {{app:nav.learn}}.',
          es: 'Con el micrófono activado en {{app:nav.explore}}, ve a {{app:nav.learn}}.',
        },
        expect: {
          en: 'The microphone turns itself off. When you come back to {{app:nav.explore}} it is still off.',
          pt: 'O microfone desliga-se sozinho. Quando voltas a {{app:nav.explore}}, continua desligado.',
          es: 'El micrófono se desactiva solo. Cuando vuelves a {{app:nav.explore}}, sigue desactivado.',
        },
      },
      {
        id: 'i6',
        goal: {
          en: 'With the microphone on, lock the phone or switch to another app. Then come back.',
          pt: 'Com o microfone ligado, bloqueia o telemóvel ou muda para outra app. Depois volta.',
          es: 'Con el micrófono activado, bloquea el móvil o cambia a otra app. Después vuelve.',
        },
        expect: {
          en: 'The microphone is off when you return.',
          pt: 'O microfone está desligado quando voltas.',
          es: 'Cuando vuelves, el micrófono está desactivado.',
        },
      },
      {
        id: 'i7',
        goal: {
          en: 'Leave the microphone on and play nothing for three minutes.',
          pt: 'Deixa o microfone ligado e não toques nada durante três minutos.',
          es: 'Deja el micrófono activado y no toques nada durante tres minutos.',
        },
        expect: {
          en: 'It turns itself off and says why in one line.',
          pt: 'Desliga-se sozinho e diz porquê numa linha.',
          es: 'Se desactiva solo y explica por qué en una línea.',
        },
      },
      {
        id: 'i8',
        goal: {
          en: 'Start the metronome and set its speed by tapping.',
          pt: 'Põe o metrónomo a funcionar e marca o andamento com toques.',
          es: 'Pon en marcha el metrónomo y marca el tempo con toques.',
        },
        where: {
          en: '“⋯” menu → {{app:metronomeToolEntry.menuItem}}.',
          pt: 'Menu «⋯» → {{app:metronomeToolEntry.menuItem}}.',
          es: 'Menú «⋯» → {{app:metronomeToolEntry.menuItem}}.',
        },
        expect: {
          en: 'A steady click that follows the speed you tap. Is the sound pleasant enough to practise with?',
          pt: 'Um clique regular que segue o andamento que marcas. O som é agradável o suficiente para estudar com ele?',
          es: 'Un clic regular que sigue el tempo que marcas. ¿El sonido es lo bastante agradable para practicar con él?',
        },
      },
      {
        id: 'i9',
        goal: {
          en: 'With the metronome clicking, start a chord loop in the {{app:progression.open}} panel.',
          pt: 'Com o metrónomo a tocar, inicia um ciclo de acordes no painel {{app:progression.open}}.',
          es: 'Con el metrónomo sonando, inicia un bucle de acordes en el panel {{app:progression.open}}.',
        },
        where: {
          en: '{{app:nav.explore}} → {{app:progression.open}} → {{app:progression.loop}}.',
          pt: '{{app:nav.explore}} → {{app:progression.open}} → {{app:progression.loop}}.',
          es: '{{app:nav.explore}} → {{app:progression.open}} → {{app:progression.loop}}.',
        },
        expect: {
          en: 'The metronome stops, because the loop keeps its own time, and says so in one line.',
          pt: 'O metrónomo para, porque o ciclo marca o seu próprio tempo, e di-lo numa linha.',
          es: 'El metrónomo se detiene, porque el bucle marca su propio tempo, y lo dice en una línea.',
        },
      },
      {
        id: 'i10',
        goal: {
          en: 'If you have a MIDI keyboard: connect it and play.',
          pt: 'Se tiveres um teclado MIDI: liga-o e toca.',
          es: 'Si tienes un teclado MIDI: conéctalo y toca.',
        },
        where: {
          en: '{{app:settings.title}} → {{app:midiInput.title}} → “{{app:midiInput.toggle}}”.',
          pt: '{{app:settings.title}} → {{app:midiInput.title}} → «{{app:midiInput.toggle}}».',
          es: '{{app:settings.title}} → {{app:midiInput.title}} → «{{app:midiInput.toggle}}».',
        },
        expect: {
          en: 'The keys you press sound in the app and light up on screen. If your browser cannot do MIDI, the app says so plainly.',
          pt: 'As teclas que tocas soam na app e acendem-se no ecrã. Se o teu navegador não suportar MIDI, a app di-lo claramente.',
          es: 'Las teclas que pulsas suenan en la app y se iluminan en la pantalla. Si tu navegador no admite MIDI, la app lo dice claramente.',
        },
      },
    ],
  },
};

export const GUIDE_TEMPLATE: GuideTemplate = {
  title: {
    en: 'If you are watching someone try it',
    pt: 'Se estiveres a observar alguém a experimentar',
    es: 'Si estás observando a alguien mientras prueba la app',
  },
  intro: {
    en: 'You learn most by staying quiet. Three to five people are usually enough: by then the same problems start to repeat.',
    pt: 'Aprende-se mais ficando calado. Três a cinco pessoas costumam bastar: a partir daí, os mesmos problemas começam a repetir-se.',
    es: 'Se aprende más estando en silencio. De tres a cinco personas suelen bastar: a partir de ahí, los mismos problemas empiezan a repetirse.',
  },
  sections: [
    {
      h: { en: 'Before', pt: 'Antes', es: 'Antes' },
      items: [
        {
          en: 'They use their own phone or computer, with the sound on, somewhere they can hear it.',
          pt: 'A pessoa usa o seu próprio telemóvel ou computador, com o som ligado, num sítio onde o consiga ouvir.',
          es: 'La persona usa su propio móvil u ordenador, con el sonido activado, en un sitio donde pueda oírlo.',
        },
        {
          en: 'Pick the sheet that fits them: “{{sheet:tabs.new}}” or “{{sheet:tabs.player}}”.',
          pt: 'Escolhe a folha que se adequa: «{{sheet:tabs.new}}» ou «{{sheet:tabs.player}}».',
          es: 'Elige la hoja que le encaje: «{{sheet:tabs.new}}» o «{{sheet:tabs.player}}».',
        },
        {
          en: 'Ask them to say out loud what they are looking for as they go.',
          pt: 'Pede-lhe que vá dizendo em voz alta o que procura.',
          es: 'Pídele que vaya diciendo en voz alta lo que está buscando.',
        },
      ],
      say: {
        en: 'I’m testing the app, not you. Nothing you do is wrong.',
        pt: 'Estou a testar a app, não a ti. Nada do que fizeres está errado.',
        es: 'Estoy probando la app, no a ti. Nada de lo que hagas está mal.',
      },
    },
    {
      h: { en: 'During', pt: 'Durante', es: 'Durante' },
      items: [
        {
          en: 'Give one task at a time, in the sheet’s own words. Don’t point and don’t explain.',
          pt: 'Dá uma tarefa de cada vez, com as palavras da folha. Não apontes nem expliques.',
          es: 'Da una tarea cada vez, con las palabras de la hoja. No señales ni expliques.',
        },
        {
          en: 'When they get stuck, count to ten before doing anything. If they are still stuck, open the hint on the sheet and mark the task “{{sheet:find.hard}}”.',
          pt: 'Quando a pessoa ficar sem saída, conta até dez antes de fazer seja o que for. Se continuar sem saída, abre a dica da folha e marca a tarefa como «{{sheet:find.hard}}».',
          es: 'Cuando se quede sin saber qué hacer, cuenta hasta diez antes de hacer nada. Si sigue sin saberlo, abre la pista de la hoja y marca la tarea como «{{sheet:find.hard}}».',
        },
        {
          en: 'Write down their own words for things. What they call a part of the screen tells you what its label should be.',
          pt: 'Escreve as palavras que a pessoa usa para as coisas. O nome que dá a uma parte do ecrã diz-te como essa parte se devia chamar.',
          es: 'Apunta las palabras que usa para las cosas. El nombre que le da a una parte de la pantalla te dice cómo debería llamarse.',
        },
        {
          en: 'Note every tap that does nothing, and every time they scroll around looking for something.',
          pt: 'Aponta cada toque que não faz nada e cada vez que a pessoa anda para cima e para baixo à procura de algo.',
          es: 'Anota cada toque que no hace nada y cada vez que sube y baja por la pantalla buscando algo.',
        },
        {
          en: 'No sound on an iPhone? Check the silent switch and the volume first, and note which it was.',
          pt: 'Sem som num iPhone? Vê primeiro o botão de silêncio e o volume, e aponta qual dos dois era.',
          es: '¿No hay sonido en un iPhone? Mira primero el interruptor de silencio y el volumen, y anota cuál de los dos era.',
        },
      ],
    },
    {
      h: { en: 'After', pt: 'Depois', es: 'Después' },
      items: [
        {
          en: 'Ask the closing questions before you explain anything about the app.',
          pt: 'Faz as perguntas finais antes de explicares seja o que for sobre a app.',
          es: 'Haz las preguntas finales antes de explicar nada sobre la app.',
        },
        {
          en: 'Use “{{sheet:sendButton}}” on the same day, while you still remember what you saw.',
          pt: 'Usa «{{sheet:sendButton}}» no próprio dia, enquanto ainda te lembras do que viste.',
          es: 'Usa «{{sheet:sendButton}}» el mismo día, mientras aún recuerdas lo que viste.',
        },
      ],
    },
    {
      h: { en: 'What to look for: someone new to music', pt: 'O que observar: quem está a começar', es: 'Qué observar: alguien que empieza' },
      items: [
        {
          en: 'Which of the three starting choices they pick, and how long it takes.',
          pt: 'Qual das três opções iniciais escolhe, e quanto tempo demora.',
          es: 'Cuál de las tres opciones iniciales elige y cuánto tarda.',
        },
        {
          en: 'Whether they notice they can choose piano or guitar.',
          pt: 'Se repara que pode escolher piano ou guitarra.',
          es: 'Si se da cuenta de que puede elegir piano o guitarra.',
        },
        {
          en: 'Whether the first lesson makes a sound within its first few seconds.',
          pt: 'Se a primeira lição produz som nos primeiros segundos.',
          es: 'Si la primera lección produce sonido en los primeros segundos.',
        },
        {
          en: 'Which musical words stop them.',
          pt: 'Que palavras musicais a fazem parar.',
          es: 'Qué palabras musicales le hacen pararse.',
        },
        {
          en: 'Whether they can find their lesson again after leaving it.',
          pt: 'Se consegue voltar a encontrar a lição depois de sair dela.',
          es: 'Si consigue volver a encontrar la lección después de salir de ella.',
        },
        {
          en: 'Whether they find where to report a problem, and what they call that place.',
          pt: 'Se encontra onde comunicar um problema e como lhe chama.',
          es: 'Si encuentra dónde avisar de un problema y cómo llama a ese sitio.',
        },
      ],
    },
    {
      h: { en: 'What to look for: someone who plays', pt: 'O que observar: quem já toca', es: 'Qué observar: alguien que ya toca' },
      items: [
        {
          en: 'Whether they find “{{app:progression.open}}” without help.',
          pt: 'Se encontra «{{app:progression.open}}» sem ajuda.',
          es: 'Si encuentra «{{app:progression.open}}» sin ayuda.',
        },
        {
          en: 'Whether the key the app names is the one they expected.',
          pt: 'Se a tonalidade que a app indica é a que esperava.',
          es: 'Si la tonalidad que indica la app es la que esperaba.',
        },
        {
          en: 'Whether the number under each chord means anything to them.',
          pt: 'Se o número por baixo de cada acorde lhe diz alguma coisa.',
          es: 'Si el número debajo de cada acorde le dice algo.',
        },
        {
          en: 'Whether the capo line makes sense to them (for example “{{app:capo.line|chord=E|shape=D|fret=2}}”).',
          pt: 'Se percebe a linha do capo (por exemplo, «{{app:capo.line|chord=E|shape=D|fret=2}}»).',
          es: 'Si entiende la línea del capo (por ejemplo, «{{app:capo.line|chord=E|shape=D|fret=2}}»).',
        },
        {
          en: 'Whether they find how to turn the neck round, and which way they leave it.',
          pt: 'Se descobre como inverter o braço e em que posição o deixa.',
          es: 'Si descubre cómo darle la vuelta al mástil y en qué posición lo deja.',
        },
      ],
    },
    {
      h: { en: 'What to look for: instrument and microphone', pt: 'O que observar: instrumento e microfone', es: 'Qué observar: instrumento y micrófono' },
      items: [
        {
          en: 'Whether the permission question worries them.',
          pt: 'Se o pedido de autorização a deixa desconfiada.',
          es: 'Si la petición de permiso le inquieta.',
        },
        {
          en: 'Whether they can tell, at any moment, if the microphone is on.',
          pt: 'Se percebe, em qualquer momento, se o microfone está ligado.',
          es: 'Si sabe, en todo momento, si el micrófono está activado.',
        },
        {
          en: 'How far the phone is from the instrument, and how noisy the room is, when a note is not recognised.',
          pt: 'A que distância está o telemóvel do instrumento, e quanto ruído há na sala, quando uma nota não é reconhecida.',
          es: 'A qué distancia está el móvil del instrumento, y cuánto ruido hay en la sala, cuando una nota no se reconoce.',
        },
      ],
    },
  ],
};
