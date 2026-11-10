import { create } from 'zustand';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  /** One button beside the message (e.g. a shared link's "Open"): it runs, then the toast closes. */
  action?: { label: string; onSelect: () => void };
}

interface ToastState {
  toasts: Toast[];
  /** Returns the new toast's id. */
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
}

let nextId = 0;
const MAX_TOASTS = 5;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++nextId}`;
    set((state) => {
      // At most five; the oldest go first, but a toast waiting for the
      // learner's choice (one with an action, e.g. a held link's "Open") is
      // never pushed out by newer plain ones.
      const next = [...state.toasts, { ...toast, id }];
      while (next.length > MAX_TOASTS) {
        const i = next.findIndex((t) => !t.action);
        next.splice(i === -1 ? 0 : i, 1);
      }
      return { toasts: next };
    });
    if (toast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, toast.duration);
    }
    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

/** Imperative toast helper */
export function toast(message: string, type: ToastType = 'info', duration = 3000) {
  useToastStore.getState().addToast({ type, message, duration });
}
