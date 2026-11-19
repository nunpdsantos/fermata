/**
 * The test sheet in the browser (/test/, 2026-11-14): bundled ON ITS OWN into
 * /test/sheet.js by scripts/pages/build.ts (never part of the app's bundle),
 * loaded as an external same-origin file (the site's CSP allows no inline
 * script). The words come from the page's JSON data block (#sheet-data),
 * written at build time with every app label taken from the app's locale
 * files by key (resolve.ts).
 *
 * Behaviour, as the owner's private sheet had it, plus "Send my answers":
 *  - three sheets and a guide, chosen by #new / #player / #instrument /
 *    #watching; EN / PT / ES (`?lang=` first, then the saved choice, then the
 *    browser's language, then English);
 *  - answers saved in this browser only, under SHEET_STORAGE_KEY (never an
 *    app key: model.ts says why), and only once the person answers something;
 *    each save re-reads what is saved and writes only that one answer on top
 *    (audit A5, 2026-11-18: two sheets open in two tabs used to write each
 *    tab's whole memory over the other's), and a tab left open takes the
 *    other tabs' answers into its controls as they are saved — into its own,
 *    never over them: for a visit the page's answers are the truth, so a key
 *    cleared underneath or a write the browser ignored never empties Send or
 *    Copy, and the page's own answers are saved again (second fix pass);
 *  - "Send my answers" with nothing answered (no result, note or closing
 *    answer on this sheet) opens nothing and says so (audit A20);
 *  - "Send my answers" opens the test form in a new tab FROM THE TAP, its
 *    boxes filled in (answers.ts `planSend`); too long → nothing opens, the
 *    page says so and shows the text to copy; offline → one line, nothing
 *    opens. Nothing is requested from another origin before that tap;
 *  - "Copy my answers" and "Clear this sheet" (two taps) as before.
 */
import { answeredCount, answerOf, answersText, chooseLanguage, closingKey, hasAnswers, planSend, readState } from './answers';
import {
  RESULTS, SHEET_LANGS, SHEET_STORAGE_KEY, SHORT_CLOSING, isSheetLang, isView,
  type SheetContent, type SheetId, type SheetLang, type ViewId,
} from './model';

type Attrs = Record<string, string | boolean | null | undefined | Record<string, EventListener>>;

export interface MountOptions {
  /** The clock (tests pass a fixed one). */
  now?: () => Date;
}

export function mountSheet(doc: Document, win: Window, opts: MountOptions = {}): { render: () => void; destroy: () => void } {
  const now = opts.now ?? (() => new Date());
  const dataEl = doc.getElementById('sheet-data');
  const DATA = JSON.parse(dataEl?.textContent ?? '{}') as Record<SheetLang, SheetContent>;
  for (const lang of SHEET_LANGS) if (!DATA[lang]) throw new Error(`test sheet: no "${lang}" in #sheet-data`);

  // ── Saved answers: this browser only, one key, and nothing written until the person answers ──
  const storage = (() => {
    try {
      return win.localStorage;
    } catch {
      return null;
    }
  })();
  /** What is saved now (another tab may have saved since), or null when storage cannot be read. */
  const stored = () => {
    try {
      return storage ? readState(storage.getItem(SHEET_STORAGE_KEY)) : null;
    } catch {
      return null;
    }
  };
  const S = stored() ?? readState(null);
  S.lang = chooseLanguage(win.location.search, S.lang, win.navigator.languages?.length ? win.navigator.languages : [win.navigator.language ?? '']);
  const blank = () => ({ r: '' as const, note: '', hint: false });
  /**
   * For a visit, the page's answers (S, what is on screen) are the truth
   * (second fix pass, 2026-11-19: a key emptied underneath, or a write the
   * browser ignored without a word, read as "nothing answered" while the
   * radios showed answers). What is stored is merged INTO them, answer by
   * answer (a task's result, note and hint, a closing answer), and never over
   * them: an answer given in this page this visit (`own`) stays this page's;
   * another tab's answers fill the rest as they are saved; nothing on screen
   * is taken away because the store lacks it.
   */
  const own = new Set<string>();
  const FIELDS = ['r', 'note', 'hint'] as const;
  type Field = (typeof FIELDS)[number];
  /** An answer's key: `a <task> <field>` or `q <closing key>`. */
  const part = (k: string) => k.split(' ') as ['a' | 'q', string, Field];
  const has = (s: typeof S, k: string) => { const [kind, id] = part(k); return kind === 'q' ? id in s.q : !!s.a[id]; };
  const copy = (from: typeof S, to: typeof S, k: string) => {
    const [kind, id, f] = part(k);
    if (kind === 'q') to.q[id] = from.q[id];
    else ((to.a[id] ??= blank())[f] as unknown) = from.a[id][f];
  };
  /** Another tab's answers into this page's, except this page's own and the tasks in `skip`. */
  const into = (now: typeof S, skip: Set<string> = new Set()) => {
    for (const [id, x] of Object.entries(now.a)) {
      if (skip.has(id)) continue;
      const mine = (S.a[id] ??= blank());
      for (const f of FIELDS) if (!own.has(`a ${id} ${f}`)) (mine[f] as unknown) = x[f];
    }
    for (const [k, v] of Object.entries(now.q)) if (!own.has(`q ${k}`)) S.q[k] = v;
  };
  /** Take the answers saved by any tab into this page's (it keeps its language and its own answers). */
  const refresh = () => {
    const now = stored();
    if (now) into(now);
  };
  /**
   * One change (`keys`: the answers it makes this page's own): made in this
   * page's memory and, on what is saved NOW, written back with this page's
   * language — never this page's other answers over another tab's, but each
   * answer of this page's own that the store has lost (cleared underneath, a
   * write refused or ignored) is written again.
   */
  const commit = (keys: string[], change: (s: typeof S) => void) => {
    change(S);
    for (const k of keys) own.add(k);
    const now = stored();
    if (now) {
      const lost = [...own].filter((k) => has(S, k) && !has(now, k));
      change(now);
      for (const k of lost) copy(S, now, k);
      into(now, new Set(lost.map((k) => part(k)[1])));
    }
    const next = now ?? S;
    next.lang = S.lang;
    try {
      storage?.setItem(SHEET_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage full or blocked: the sheet still works for this visit, from its memory
    }
  };
  const taskKeys = (id: string) => FIELDS.map((f) => `a ${id} ${f}`);
  const content = () => DATA[S.lang!];
  /** The sheet on screen puts saved answers into its controls in place (set by renderSheet). */
  let showSaved: (() => void) | null = null;

  function h(tag: string, attrs?: Attrs | null, ...children: (Node | string | null | undefined | false)[]): HTMLElement {
    const el = doc.createElement(tag);
    for (const [k, v] of Object.entries(attrs ?? {})) {
      if (k === 'text') el.textContent = String(v);
      else if (k === 'on') for (const [ev, fn] of Object.entries(v as Record<string, EventListener>)) el.addEventListener(ev, fn);
      else if (v !== null && v !== undefined && v !== false) el.setAttribute(k, v === true ? '' : String(v));
    }
    for (const c of children) if (c) el.appendChild(typeof c === 'string' ? doc.createTextNode(c) : c);
    return el;
  }
  const byId = (id: string) => doc.getElementById(id);
  const current = (): ViewId => {
    const v = win.location.hash.replace('#', '');
    return isView(v) ? v : 'new';
  };

  function renderChrome() {
    const { ui, htmlLang } = content();
    doc.documentElement.lang = htmlLang;
    doc.title = ui.title;
    byId('t-title')!.textContent = ui.title;
    byId('t-lead')!.textContent = ui.lead;
    const open = byId('open-app') as HTMLAnchorElement;
    open.textContent = ui.open;
    open.setAttribute('href', `/?lang=${S.lang}`);
    byId('t-appnote')!.textContent = ui.appnote;
    const switcher = byId('lang-switch')!;
    switcher.setAttribute('aria-label', ui.languageLabel);
    switcher.hidden = false;
    for (const b of Array.from(switcher.querySelectorAll<HTMLButtonElement>('button[data-lang]'))) b.setAttribute('aria-pressed', String(b.dataset.lang === S.lang));
    const tabs = byId('tabs')!;
    tabs.setAttribute('aria-label', ui.sheetsLabel);
    const cur = current();
    tabs.textContent = '';
    for (const v of ['new', 'player', 'instrument', 'watching'] as const) {
      tabs.appendChild(h('a', { href: `#${v}`, 'aria-current': v === cur ? 'page' : null, text: ui.tabs[v] }));
    }
  }

  function say(status: HTMLElement, text: string, tone: 'ok' | 'warn' | '') {
    status.className = `status${tone ? ` ${tone}` : ''}`;
    status.textContent = text;
  }

  function renderSheet(id: SheetId): HTMLElement {
    const { ui } = content();
    const sheet = content().sheets[id];
    const labels = ui[sheet.kind];
    const progress = h('p', { class: 'progress', id: 'progress' });
    const setProgress = () => { progress.textContent = ui.progress.replace('{n}', String(answeredCount(sheet, S))).replace('{t}', String(sheet.tasks.length)); };
    setProgress();

    const list = h('ol', { class: 'tasks' });
    sheet.tasks.forEach((task, i) => {
      const a = answerOf(S, task.id);
      const goalId = `goal-${task.id}`;
      const box = h('div', { class: 'task' }, h('p', { class: 'goal', id: goalId, text: task.goal }));
      if (sheet.kind === 'check') {
        const dl = h('dl', { class: 'facts' });
        if (task.where) dl.appendChild(h('div', null, h('dt', { text: ui.where }), h('dd', { text: task.where })));
        if (task.expect) dl.appendChild(h('div', null, h('dt', { text: ui.expect }), h('dd', { text: task.expect })));
        box.appendChild(dl);
      }
      const fs = h('fieldset', { class: 'result', 'aria-describedby': goalId }, h('legend', { class: 'sr-only', text: `${ui.result} ${i + 1}` }));
      for (const r of RESULTS) {
        const input = h('input', {
          type: 'radio', name: `r-${task.id}`, id: `r-${task.id}-${r}`, value: r,
          on: { change: () => { commit([`a ${task.id} r`], (s) => { (s.a[task.id] ??= blank()).r = r; }); setProgress(); } },
        }) as HTMLInputElement;
        if (a.r === r) input.checked = true;
        fs.appendChild(h('label', { class: `pill ${r}`, for: `r-${task.id}-${r}` }, input, h('span', { text: labels[r] })));
      }
      box.appendChild(fs);
      const note = h('textarea', {
        id: `note-${task.id}`, rows: '2', placeholder: ui.notes, 'aria-label': `${ui.notes} ${i + 1}`,
        on: { input: (e) => { const v = (e.target as HTMLTextAreaElement).value; commit([`a ${task.id} note`], (s) => { (s.a[task.id] ??= blank()).note = v; }); } },
      }) as HTMLTextAreaElement;
      note.value = a.note;
      box.appendChild(note);
      if (sheet.kind === 'find') {
        if (task.hint) {
          box.appendChild(h('details', {
            class: 'hint', id: `hint-${task.id}`,
            on: { toggle: (e) => { if ((e.target as HTMLDetailsElement).open) commit([`a ${task.id} hint`], (s) => { (s.a[task.id] ??= blank()).hint = true; }); } },
          }, h('summary', { text: ui.hint }), h('p', { text: task.hint })));
        } else {
          box.appendChild(h('p', { class: 'nohint small', text: ui.nohint }));
        }
      }
      list.appendChild(h('li', null, h('span', { class: 'num', 'aria-hidden': 'true', text: String(i + 1) }), box));
    });

    const closing = h('section', { class: 'panel', 'aria-labelledby': 'before-h' }, h('h2', { id: 'before-h', text: ui.before }));
    for (const q of sheet.closing) {
      const qid = closingKey(id, q);
      const field = (SHORT_CLOSING.includes(q) ? h('input', { type: 'text', id: qid }) : h('textarea', { id: qid, rows: '2' })) as HTMLInputElement | HTMLTextAreaElement;
      field.value = S.q[qid] ?? '';
      field.addEventListener('input', () => { const v = field.value; commit([`q ${qid}`], (s) => { s.q[qid] = v; }); });
      closing.appendChild(h('div', { class: 'field' }, h('label', { for: qid, text: ui.q[q] }), field));
    }

    // Another tab's answers, as they are saved: into the controls, never into the one being typed in.
    showSaved = () => {
      for (const task of sheet.tasks) {
        const a = answerOf(S, task.id);
        for (const r of RESULTS) {
          const input = doc.getElementById(`r-${task.id}-${r}`) as HTMLInputElement | null;
          if (input) input.checked = a.r === r;
        }
        const note = doc.getElementById(`note-${task.id}`) as HTMLTextAreaElement | null;
        if (note && doc.activeElement !== note) note.value = a.note;
      }
      for (const q of sheet.closing) {
        const field = doc.getElementById(closingKey(id, q)) as HTMLInputElement | null;
        if (field && doc.activeElement !== field) field.value = S.q[closingKey(id, q)] ?? '';
      }
      setProgress();
    };

    const status = h('p', { id: 'sheet-status', class: 'status', role: 'status', 'aria-live': 'polite' });
    const out = h('textarea', { id: 'out', readonly: true, hidden: true, rows: '10', 'aria-label': ui.send }) as HTMLTextAreaElement;
    const text = (withBrowser: boolean) => answersText(content(), id, S, { now: now(), userAgent: win.navigator.userAgent ?? '', withBrowser });
    const showText = () => { out.value = text(true); out.hidden = false; };

    const sendBtn = h('button', {
      type: 'button', class: 'button', id: 'send-btn', 'aria-describedby': 'send-note', text: ui.sendButton,
      on: {
        click: () => {
          // Offline: one line, nothing opens.
          if (win.navigator.onLine === false) {
            say(status, ui.offline, 'warn');
            return;
          }
          refresh();
          // Nothing answered on this sheet (A20): no form full of "not answered"; say what to do.
          if (!hasAnswers(sheet, id, S)) {
            say(status, ui.empty, 'warn');
            return;
          }
          const plan = planSend(content(), id, S, { now: now(), userAgent: win.navigator.userAgent ?? '' });
          if (plan.kind === 'tooLong') {
            say(status, ui.tooLong, 'warn');
            showText();
            return;
          }
          say(status, '', '');
          // From the tap itself, so no popup blocker stands in the way; no opener, no referrer.
          win.open(plan.url, '_blank', 'noopener,noreferrer');
        },
      },
    });
    const copyBtn = h('button', {
      type: 'button', class: 'btn', id: 'copy-btn', text: ui.copy,
      on: {
        click: () => {
          refresh();
          const value = text(true);
          out.value = value;
          out.hidden = false;
          const fail = () => { say(status, ui.copyfail, 'warn'); out.focus(); out.select(); };
          try {
            if (win.navigator.clipboard?.writeText) win.navigator.clipboard.writeText(value).then(() => say(status, ui.copied, 'ok'), fail);
            else fail();
          } catch {
            fail();
          }
        },
      },
    });
    let armed = false;
    const clearBtn = h('button', {
      type: 'button', class: 'btn quiet', id: 'clear-btn', text: ui.clear,
      on: {
        click: () => {
          if (!armed) {
            armed = true;
            clearBtn.textContent = ui.clear2;
            return;
          }
          // This sheet's answers only: the other sheets', the language, and every other key stay.
          commit([...sheet.tasks.flatMap((task) => taskKeys(task.id)), ...sheet.closing.map((q) => `q ${closingKey(id, q)}`)], (s) => {
            for (const task of sheet.tasks) delete s.a[task.id];
            for (const q of sheet.closing) delete s.q[closingKey(id, q)];
          });
          render();
        },
      },
    });
    const send = h('section', { class: 'panel', 'aria-labelledby': 'send-h' },
      h('h2', { id: 'send-h', text: ui.send }),
      h('p', { text: ui.sendtext }),
      h('p', { class: 'small', text: ui.ua }),
      h('div', { class: 'send-main' }, sendBtn, h('p', { class: 'small', id: 'send-note', text: ui.sendNote })),
      h('div', { class: 'row' }, copyBtn, clearBtn),
      status,
      out);

    return h('div', { class: 'sheet' },
      h('div', { class: 'sheet-head' }, h('h2', { text: ui.tabs[id] }), h('p', { text: sheet.intro }), progress),
      list, closing, send);
  }

  function renderGuide(): HTMLElement {
    showSaved = null;
    const g = content().guide;
    const wrap = h('div', { class: 'guide' }, h('div', { class: 'sheet-head' }, h('h2', { text: g.title }), h('p', { text: g.intro })));
    for (const s of g.sections) {
      const ul = h('ul');
      for (const item of s.items) ul.appendChild(h('li', { text: item }));
      wrap.appendChild(h('section', null, h('h3', { text: s.h }), s.say ? h('p', { class: 'say', text: s.say }) : null, ul));
    }
    return wrap;
  }

  function render() {
    const tabFocused = !!doc.activeElement?.closest?.('#tabs');
    renderChrome();
    const view = byId('view')!;
    const cur = current();
    view.textContent = '';
    view.appendChild(cur === 'watching' ? renderGuide() : renderSheet(cur));
    // A tab chosen from the keyboard keeps the focus on the tab now shown (the chooser was rebuilt).
    if (tabFocused) (byId('tabs')!.querySelector('[aria-current="page"]') as HTMLElement | null)?.focus();
  }

  for (const b of Array.from(doc.querySelectorAll<HTMLButtonElement>('#lang-switch button[data-lang]'))) {
    b.addEventListener('click', () => {
      const l = b.dataset.lang;
      if (!isSheetLang(l) || l === S.lang) return;
      S.lang = l;
      commit([], () => {});
      // The choice now wins over a `?lang=` in the address: take it out, so a reload keeps the choice.
      if (new URLSearchParams(win.location.search).has('lang')) {
        try {
          win.history.replaceState(null, '', `${win.location.pathname}${win.location.hash}`);
        } catch {
          // a sandboxed frame: the choice still applies in this visit
        }
      }
      render();
    });
  }
  const onHash = () => {
    render();
    win.scrollTo(0, 0);
  };
  // Another tab saved (A5): take its answers; the sheet on screen shows them in place.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== SHEET_STORAGE_KEY && e.key !== null) return;
    refresh();
    showSaved?.();
  };
  win.addEventListener('hashchange', onHash);
  win.addEventListener('storage', onStorage);
  render();
  return {
    render,
    destroy: () => {
      win.removeEventListener('hashchange', onHash);
      win.removeEventListener('storage', onStorage);
    },
  };
}
