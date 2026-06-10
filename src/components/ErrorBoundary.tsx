import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import i18n from '../i18n';
import { Button } from './ui/Button';
import { DRILL_STORE_KEY, useDrillStore } from '../state/drillStore';

interface Props {
  children: ReactNode;
  /** When this value changes, the boundary resets (clears the error). */
  resetKey?: string;
  /** Custom fallback UI. If omitted, renders the default full-page error card. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  /**
   * Last-resort recovery: corrupted persisted state can crash the app on
   * every reload. Clears all app localStorage (keys prefixed 'music-theory'
   * or matching known fermata-* store keys) and reloads fresh.
   */
  private handleResetAppData = () => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('music-theory')) {
        localStorage.removeItem(key);
      }
    }
    // Drill store uses a 'fermata-' prefix — clear it explicitly and reset
    // the in-memory store so a hot reload doesn't serve stale state.
    localStorage.removeItem(DRILL_STORE_KEY);
    useDrillStore.getState().resetDrillData();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const error = this.state.error ?? new Error('An unexpected error occurred.');

      if (this.props.fallback) {
        return this.props.fallback(error, this.handleReset);
      }

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: 420,
              padding: 32,
              borderRadius: 16,
              border: '1px solid var(--border)',
              backgroundColor: 'var(--card)',
              textAlign: 'center',
            }}
          >
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {i18n.t('error.somethingWentWrong')}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
              {error.message}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Button variant="accent" onClick={() => window.location.reload()}>
                {i18n.t('common.reload')}
              </Button>
              <Button variant="ghost" onClick={this.handleResetAppData}>
                {i18n.t('error.resetAppData')}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
