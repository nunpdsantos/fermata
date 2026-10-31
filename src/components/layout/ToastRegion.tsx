import { PWAPrompts } from './PWAPrompts.tsx';
import { ToastContainer } from './Toast.tsx';

/**
 * The ONE place toasts appear (W11-A / W9-22): a fixed overlay under the top
 * bar that grows down at most to the instrument dock / sheet or Drill's
 * answers (toastLayout.ts) — it covers neither, and since it is not in the
 * page flow nothing moves when a toast comes or goes. The PWA stack (update,
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
