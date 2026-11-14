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
 *  - "Send my answers" opens the test form in a new tab FROM THE TAP, its
 *    boxes filled in (answers.ts `planSend`); too long → nothing opens, the
 *    page says so and shows the text to copy; offline → one line, nothing
 *    opens. Nothing is requested from another origin before that tap;
 *  - "Copy my answers" and "Clear this sheet" (two taps) as before.
 */
import { answeredCount, answerOf, answersText, chooseLanguage, closingKey, planSend, readState } from './answers';
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
  const S = (() => {
    try {
      return readState(storage?.getItem(SHEET_STORAGE_KEY) ?? null);
    } catch {
      return readState(null);
    }
  })();
  S.lang = chooseLanguage(win.location.search, S.lang, win.navigator.languages?.length ? win.navigator.languages : [win.navigator.language ?? '']);
  const save = () => {
    try {
      storage?.setItem(SHEET_STORAGE_KEY, JSON.stringify(S));
    } catch {
      // storage full or blocked: the sheet still works for this visit
    }
  };
  const ans = (id: string) => (S.a[id] ??= { r: '', note: '', hint: false });
  const content = () => DATA[S.lang!];

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
          on: { change: () => { ans(task.id).r = r; save(); setProgress(); } },
        }) as HTMLInputElement;
        if (a.r === r) input.checked = true;
        fs.appendChild(h('label', { class: `pill ${r}`, for: `r-${task.id}-${r}` }, input, h('span', { text: labels[r] })));
      }
      box.appendChild(fs);
      const note = h('textarea', {
        id: `note-${task.id}`, rows: '2', placeholder: ui.notes, 'aria-label': `${ui.notes} ${i + 1}`,
        on: { input: (e) => { ans(task.id).note = (e.target as HTMLTextAreaElement).value; save(); } },
      }) as HTMLTextAreaElement;
      note.value = a.note;
      box.appendChild(note);
      if (sheet.kind === 'find') {
        if (task.hint) {
          box.appendChild(h('details', {
            class: 'hint', id: `hint-${task.id}`,
            on: { toggle: (e) => { if ((e.target as HTMLDetailsElement).open) { ans(task.id).hint = true; save(); } } },
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
      field.addEventListener('input', () => { S.q[qid] = field.value; save(); });
      closing.appendChild(h('div', { class: 'field' }, h('label', { for: qid, text: ui.q[q] }), field));
    }

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
          for (const task of sheet.tasks) delete S.a[task.id];
          for (const q of sheet.closing) delete S.q[closingKey(id, q)];
          save();
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
      save();
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
  win.addEventListener('hashchange', onHash);
  render();
  return { render, destroy: () => win.removeEventListener('hashchange', onHash) };
}
