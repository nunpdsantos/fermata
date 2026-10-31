import { PWAPrompts } from './PWAPrompts.tsx';
import { ToastContainer } from './Toast.tsx';

/**
 * The ONE place toasts appear (W11-A / W9-22). Phones: just under the top
 * bar, where they cover neither the instrument sheet nor Drill's answers in
 * the thumb zone. Wider screens: bottom-right, ABOVE the instrument dock
 * (`--dock-h`, published by AppShell; 0 in Drill). The PWA stack (update,
 * then offline-ready, then install) comes first, then app toasts.
 */
export function ToastRegion() {
  return (
    <div className="toast-region" data-testid="toast-region">
      <PWAPrompts />
      <ToastContainer />
    </div>
  );
}
