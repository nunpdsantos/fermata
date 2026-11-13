import { test, expect, type Locator, type Page } from '@playwright/test';

for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1440, height: 900 }]) {
  test(`guitar practice, four tabs and teacher fingerings at ${viewport.width}×${viewport.height}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport, hasTouch: viewport.width < 1000, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await context.addInitScript(() => {
      if (sessionStorage.getItem('practice-seeded')) return;
      localStorage.setItem('music-theory-app', JSON.stringify({ state: { instrument: 'guitar', lastView: 'explore', language: 'en', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major' }, version: 6 }));
      sessionStorage.setItem('practice-seeded', '1');
    });
    const page = await context.newPage();
    await page.goto('/');
    await page.getByTestId('practice-open').click();
    const sheet = page.getByTestId('practice-sheet');
    await expect(sheet.getByTestId('practice-player')).toBeVisible();
    await expect(sheet.getByTestId('practice-staff').locator('svg')).toBeVisible();
    const current = sheet.getByTestId('practice-current');
    await expect(current).toContainText('1 of 29');
    await sheet.getByRole('button', { name: 'Next note or chord' }).click();
    await expect(current).toContainText('2 of 29');
    await sheet.getByRole('button', { name: 'Previous note or chord' }).click();
    await sheet.getByRole('button', { name: 'Edit fingering' }).click();
    const finger = sheet.getByRole('combobox', { name: /Finger for/ });
    const suggested = await finger.inputValue();
    const chosen = suggested === '1' ? '2' : '1';
    await finger.selectOption(chosen);
    await expect(sheet.locator('[data-edited-mark]')).not.toHaveCount(0);
    await sheet.getByRole('button', { name: 'Close', exact: true }).click();
    await page.reload();
    await page.getByTestId('practice-open').click();
    await sheet.getByRole('button', { name: 'Edit fingering' }).click();
    await expect(finger).toHaveValue(chosen);
    await sheet.getByRole('button', { name: 'Reset to suggested' }).click();
    await expect(finger).toHaveValue(suggested);
    await sheet.getByRole('tab', { name: 'Position walk' }).click();
    await expect(sheet.getByTestId('walk-positions').getByRole('button')).toHaveCount(4);
    await sheet.locator('.practice-event[data-guide]').first().click();
    await expect(sheet.getByTestId('practice-shift')).toContainText(/Guide finger [1-4], string [1-6]/);
    await expect(sheet.getByTestId('neck-guide')).toHaveText(await sheet.getByTestId('practice-shift').innerText());
    await expect(sheet.getByTestId('practice-staff').locator('svg')).toBeVisible();
    await sheet.getByRole('button', { name: 'Next note or chord' }).click();
    await expect(sheet.getByTestId('neck-guide')).toHaveCount(0);
    await sheet.getByRole('combobox', { name: 'Tempo' }).selectOption('120');
    await sheet.getByRole('button', { name: '▶ Play' }).click();
    await expect(sheet.getByRole('button', { name: '■ Stop' })).toBeVisible();
    await sheet.getByRole('button', { name: '■ Stop' }).click();
    await sheet.getByRole('tab', { name: 'Technical set' }).click();
    await sheet.getByTestId('practice-exercise').selectOption('sixths-together');
    await expect(sheet.getByTestId('practice-staff').locator('svg')).toBeVisible();
    await sheet.getByTestId('practice-exercise').selectOption('brokenChord-upper');
    await expect(sheet.getByRole('status')).toContainText('three strings');
    await sheet.getByRole('tab', { name: 'Right hand' }).click();
    await sheet.getByTestId('practice-pattern').selectOption('p+a-i-m-i');
    await expect(sheet).toContainText('I → V7 → I');
    await expect(sheet.getByTestId('practice-current')).toContainText('p · C');
    await sheet.getByRole('combobox', { name: 'Tempo' }).selectOption('120');
    await sheet.getByRole('button', { name: '▶ Play' }).click();
    await expect(sheet.getByRole('button', { name: '■ Stop' })).toBeVisible();
    await sheet.getByRole('button', { name: '■ Stop' }).click();
    await expect(sheet.getByRole('button', { name: '▶ Play' })).toBeVisible();
    // Physical orientation stays settled in the practice neck too.
    const neck = sheet.getByTestId('practice-neck');
    const bass = await neck.locator('[data-string-row="0"]').first().boundingBox();
    const treble = await neck.locator('[data-string-row="5"]').first().boundingBox();
    expect(bass!.y).toBeLessThan(treble!.y);
    const fretNumbers = await neck.locator('[data-string-row="0"]').evaluateAll((cells) => cells.map((c) => Number(c.getAttribute('data-fret'))));
    expect(fretNumbers).toEqual([...fretNumbers].sort((a, b) => b - a));
    await sheet.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(sheet).toHaveCount(0);
    await expect(page.getByTestId('practice-open')).toBeFocused();
    await context.close();
  });
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`Drop D dock positions and walk at ${viewport.width}×${viewport.height}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport, hasTouch: viewport.width < 1000, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await context.addInitScript(() => {
      if (sessionStorage.getItem('tuning-seeded')) return;
      localStorage.setItem('music-theory-app', JSON.stringify({ state: {
        instrument: 'guitar', lastView: 'explore', language: 'en', guitarTuningId: 'drop-d', guitarScalePosition: 5,
        selectedKey: { natural: 'D', accidental: '' }, selectedScale: 'major',
        dockDetents: { explore: 'full', learn: 'peek' }, dockChosen: { explore: true, learn: false },
      }, version: 6 }));
      sessionStorage.setItem('tuning-seeded', '1');
    });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('combobox', { name: 'Guitar tuning' })).toHaveValue('drop-d');
    await expect(page.getByTestId('position-badge')).toHaveText('V');
    const board = page.getByRole('grid').first();
    await expect(board.locator('[data-dot="position"]').first()).toBeVisible();
    await expect(board.locator('[data-string-name]').first()).toHaveText('D');
    const tuning = page.getByRole('combobox', { name: 'Guitar tuning' });
    expect(await tuning.locator('option').evaluateAll((els) => els.slice(0, 3).map((el) => (el as HTMLOptionElement).value))).toEqual(['standard', 'drop-d', 'd-g']);
    await tuning.selectOption('standard');
    await expect(tuning).toBeVisible(); // Also accessible from Standard on a phone.
    await tuning.selectOption('drop-d');
    await page.reload();
    await expect(tuning).toHaveValue('drop-d');
    await expect(page.getByTestId('position-badge')).toHaveText('V');
    // Fold the phone dock so the Explore action is reachable.
    if (viewport.width < 1000) {
      await page.getByRole('separator').press('Home');
    }
    await page.getByTestId('practice-open').click();
    const sheet = page.getByTestId('practice-sheet');
    await sheet.getByRole('tab', { name: 'Position walk' }).click();
    await expect(sheet.getByTestId('practice-player')).toBeVisible();
    await sheet.locator('.practice-event[data-guide]').first().click();
    await expect(sheet.getByTestId('neck-guide')).toContainText('Guide finger');
    await context.close();
  });
}

/**
 * Fret lines on the practice neck (2026-11-13). The dock's neck draws one
 * 1 px `--border` line per fret on that fret's nut side (Fretboard.tsx);
 * the practice neck now does too. Measured here, for the owner's view
 * (nut right, thick string on top) and nut left / thin string on top, on a
 * phone and a laptop, for a window that starts at fret 1 and one that
 * starts higher (a 24 px break between the cells and the nut): every line's
 * x is its fret cell's nut-side edge (within 1 px) on all six strings, it
 * spans the first string row's top to the last one's bottom, it wears the
 * `--border` colour, and a tap on a line or on a dot still lands on the
 * cell under it (the overlay never takes a tap).
 */
async function fretLines(neck: Locator) {
  // Under reduced motion the app gives every property a 0.01 ms transition
  // (index.css), so a new inset (the break coming or going) reaches the
  // overlay's box a frame or two after the cells: measure once it has.
  await neck.locator('[data-fret-wires]').evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  return neck.evaluate((root) => {
    const header = root.querySelector(':scope > .flex.text-caption')!;
    const numbers = Array.from(header.children).map((c) => Number(c.textContent));
    const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-dock-row="string"]'));
    const nutLeft = rows[0].firstElementChild!.hasAttribute('data-open-string');
    const probe = document.createElement('span');
    probe.style.color = 'var(--border)';
    root.appendChild(probe);
    const token = getComputedStyle(probe).color;
    probe.remove();
    const wires = Array.from(root.querySelector('[data-fret-wires]')?.children ?? []);
    const top = rows[0].getBoundingClientRect().top;
    const bottom = rows[rows.length - 1].getBoundingClientRect().bottom;
    const lines = wires.map((wire, k) => {
      const box = wire.getBoundingClientRect();
      const cs = getComputedStyle(wire);
      const width = parseFloat(nutLeft ? cs.borderLeftWidth : cs.borderRightWidth);
      const x = nutLeft ? box.left : box.right - width; // the line's left edge
      // The same fret's cell on every string: its nut-side pixel.
      const edges = rows.map((row) => {
        const cell = row.querySelector(`[data-fret="${numbers[k]}"]`)!.getBoundingClientRect();
        return nutLeft ? cell.left : cell.right - 1;
      });
      return {
        fret: numbers[k], x, width, top: box.top, bottom: box.bottom, edges,
        colour: nutLeft ? cs.borderLeftColor : cs.borderRightColor,
        style: nutLeft ? cs.borderLeftStyle : cs.borderRightStyle,
        far: nutLeft ? cs.borderRightWidth : cs.borderLeftWidth,
      };
    });
    return { numbers, nutLeft, lines, top, bottom, token, breaks: root.querySelectorAll('[data-fret-break]').length };
  });
}

function expectLinesOnCells(m: Awaited<ReturnType<typeof fretLines>>, nut: 'left' | 'right', where: string) {
  expect(m.nutLeft, `${where}: nut side`).toBe(nut === 'left');
  expect(m.lines.map((l) => l.fret), `${where}: one line per drawn fret`).toEqual(m.numbers);
  for (const l of m.lines) {
    expect(l.width, `${where}, fret ${l.fret}: 1 px`).toBe(1);
    expect(l.style, `${where}, fret ${l.fret}: solid`).toBe('solid');
    expect(l.far, `${where}, fret ${l.fret}: nothing on the far side`).toBe('0px');
    expect(l.colour, `${where}, fret ${l.fret}: the --border token`).toBe(m.token);
    for (const [s, edge] of l.edges.entries()) {
      expect(Math.abs(l.x - edge), `${where}, fret ${l.fret}, row ${s}: line ${l.x} vs the cell's nut-side edge ${edge}`).toBeLessThanOrEqual(1);
    }
    expect(Math.abs(l.top - m.top), `${where}, fret ${l.fret}: from the first string's top`).toBeLessThanOrEqual(1);
    expect(Math.abs(l.bottom - m.bottom), `${where}, fret ${l.fret}: to the last string's bottom`).toBeLessThanOrEqual(1);
  }
}

/** Taps a dotted cell of another event, ON its fret line, then another one on its dot: each becomes the current note. */
async function tapThroughLines(page: Page, neck: Locator, touch: boolean, nut: 'left' | 'right', where: string) {
  await neck.scrollIntoViewIfNeeded();
  const targets = await neck.evaluate((root, nutLeft) => {
    const cells = Array.from(root.querySelectorAll<HTMLElement>('[data-fret]'))
      .filter((c) => c.querySelector('[data-dot]') && !c.hasAttribute('data-focus-note'));
    return cells.slice(0, 2).map((c, i) => {
      const r = c.getBoundingClientRect();
      const y = Math.round(r.top + r.height / 2);
      // The line's own pixel: nothing there may belong to the overlay.
      const onLine = document.elementFromPoint(nutLeft ? r.left + 0.5 : r.right - 0.5, y);
      // The first tap right beside the line, inside the cell (2 px from its
      // nut-side edge: a tap's point is whole pixels, and the line's centre
      // may round onto the neighbouring cell), the second on the dot.
      const x = Math.round(i === 0 ? (nutLeft ? r.left + 2 : r.right - 2) : r.left + r.width / 2);
      const hit = document.elementFromPoint(x, y);
      return { string: c.dataset.stringRow!, fret: c.dataset.fret!, x, y, hitInCell: !!hit && c.contains(hit),
        lineTaken: !onLine || !!onLine.closest('[data-fret-wires]') };
    });
  }, nut === 'left');
  expect(targets, `${where}: two dots of other notes to tap`).toHaveLength(2);
  for (const t of targets) {
    expect(t.lineTaken, `${where}: string ${t.string}, fret ${t.fret}: the line never takes the point`).toBe(false);
    expect(t.hitInCell, `${where}: string ${t.string}, fret ${t.fret} is what is under the point`).toBe(true);
    if (touch) await page.touchscreen.tap(t.x, t.y);
    else await page.mouse.click(t.x, t.y);
    await expect(neck.locator(`[data-string-row="${t.string}"][data-fret="${t.fret}"]`), `${where}: the tapped note is now the current one`)
      .toHaveAttribute('data-focus-note', 'true');
  }
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  for (const [nut, top] of [['right', 'low'], ['left', 'high']] as const) {
    test(`fret lines on the practice neck, nut ${nut}, ${top === 'low' ? 'thick' : 'thin'} string on top, at ${viewport.width}×${viewport.height}`, async ({ browser }) => {
      const touch = viewport.width < 1000;
      const context = await browser.newContext({ viewport, hasTouch: touch, reducedMotion: 'reduce', serviceWorkers: 'block' });
      // The legacy save carries no neck fields (the owner's view).
      const neckFields = nut === 'right' ? {} : { neckNutSide: nut, neckTopString: top };
      await context.addInitScript((fields) => {
        if (sessionStorage.getItem('frets-seeded')) return;
        localStorage.setItem('music-theory-app', JSON.stringify({ state: { instrument: 'guitar', lastView: 'explore', language: 'en', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', ...fields }, version: 6 }));
        sessionStorage.setItem('frets-seeded', '1');
      }, neckFields);
      const page = await context.newPage();
      await page.goto('/');
      await page.getByTestId('practice-open').click();
      const sheet = page.getByTestId('practice-sheet');
      const neck = sheet.getByTestId('practice-neck');
      await expect(sheet.getByTestId('practice-staff').locator('svg')).toBeVisible();
      await expect(neck.locator('[data-dock-row="string"]')).toHaveCount(6);

      // A window from fret 1 (Scales, the first note): no break.
      const first = await fretLines(neck);
      expect(Math.min(...first.numbers)).toBe(1);
      expect(first.breaks).toBe(0);
      expectLinesOnCells(first, nut, 'from fret 1');
      await tapThroughLines(page, neck, touch, nut, 'from fret 1');

      // A window that starts higher (the walk's last position): the break stands between the cells and the nut.
      await sheet.getByRole('tab', { name: 'Position walk' }).click();
      await sheet.getByTestId('walk-positions').getByRole('button').last().click();
      await expect(neck.locator('[data-fret-break]')).toHaveCount(6);
      const higher = await fretLines(neck);
      expect(Math.min(...higher.numbers)).toBeGreaterThan(1);
      expectLinesOnCells(higher, nut, 'above fret 1');
      await tapThroughLines(page, neck, touch, nut, 'above fret 1');
      await context.close();
    });
  }
}
