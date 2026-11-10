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

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++nextId}`;
    set((state) => ({
      toasts: [...state.toasts.slice(-4), { ...toast, id }],
    }));
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
