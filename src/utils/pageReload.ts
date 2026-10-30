/**
 * Full page reload. A one-line seam so components that recover by reloading
 * (the error screen) can be tested — jsdom's `location.reload` can be neither
 * spied on nor redefined.
 */
export function reloadPage(): void {
  window.location.reload();
}
