/*
 * Fermata service-worker add-on (W9b), imported by the generated sw.js
 * (vite.config.ts workbox.importScripts). Not a page script.
 *
 * Before an update applies itself silently, the page asks the app's other
 * open tabs whether they are busy (src/services/otherTabs.ts). A tab that
 * cannot answer — one still on an older version — must count as busy, so the
 * page first asks a service worker how many app windows are open:
 *   page → worker   { type: 'FERMATA_COUNT_WINDOWS', id }
 *   worker → page   { type: 'FERMATA_WINDOW_COUNT', id, windows }
 * Any worker of this registration answers, including a waiting one.
 */
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'FERMATA_COUNT_WINDOWS' || !event.source) return;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      event.source.postMessage({ type: 'FERMATA_WINDOW_COUNT', id: data.id, windows: windows.length });
    }),
  );
});
