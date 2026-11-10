import { create } from 'zustand';

/**
 * A link the browser would neither share nor copy (wave 1, stream E): the
 * ShareLinkHost shows it in a sheet, in a selectable field, until closed.
 * In memory only.
 */
interface ShareFallbackState {
  url: string | null;
}

export const useShareFallbackStore = create<ShareFallbackState>(() => ({ url: null }));

export function showShareFallback(url: string): void {
  useShareFallbackStore.setState({ url });
}

export function closeShareFallback(): void {
  useShareFallbackStore.setState({ url: null });
}
