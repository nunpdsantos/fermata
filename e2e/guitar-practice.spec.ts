import { test, expect } from '@playwright/test';

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
