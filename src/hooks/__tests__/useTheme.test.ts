import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAppStore } from '../../state/store';
import { useTheme } from '../useTheme';

beforeEach(() => {
  // Reset store to the new default
  useAppStore.setState({ themeMode: 'fermata' });

  // Ensure meta tag exists
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', '#000000');
    document.head.appendChild(meta);
  }

  // Remove .fermata-night class if present
  document.documentElement.classList.remove('fermata-night');
});

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.classList.remove('fermata-night');
});

// ---------------------------------------------------------------------------
// Fermata (day)
// ---------------------------------------------------------------------------
describe('useTheme — fermata (day)', () => {
  it('applies no theme class to html element', () => {
    document.documentElement.classList.add('fermata-night');
    useAppStore.setState({ themeMode: 'fermata' });

    renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('fermata-night')).toBe(false);
  });

  it('sets meta theme-color to #f5efe2', () => {
    useAppStore.setState({ themeMode: 'fermata' });
    renderHook(() => useTheme());

    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute('content')).toBe('#f5efe2');
  });
});

// ---------------------------------------------------------------------------
// Fermata Night
// ---------------------------------------------------------------------------
describe('useTheme — fermata-night', () => {
  it('adds .fermata-night class to html element', () => {
    useAppStore.setState({ themeMode: 'fermata-night' });
    renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('fermata-night')).toBe(true);
  });

  it('sets meta theme-color to #181208', () => {
    useAppStore.setState({ themeMode: 'fermata-night' });
    renderHook(() => useTheme());

    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute('content')).toBe('#181208');
  });
});

// ---------------------------------------------------------------------------
// Switching between themes
// ---------------------------------------------------------------------------
describe('useTheme — switching', () => {
  it('adds .fermata-night when switching from fermata to fermata-night', () => {
    useAppStore.setState({ themeMode: 'fermata' });
    const { rerender } = renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('fermata-night')).toBe(false);

    useAppStore.setState({ themeMode: 'fermata-night' });
    rerender();

    expect(document.documentElement.classList.contains('fermata-night')).toBe(true);
  });

  it('removes .fermata-night when switching from fermata-night to fermata', () => {
    useAppStore.setState({ themeMode: 'fermata-night' });
    const { rerender } = renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('fermata-night')).toBe(true);

    useAppStore.setState({ themeMode: 'fermata' });
    rerender();

    expect(document.documentElement.classList.contains('fermata-night')).toBe(false);
  });

  it('updates meta theme-color when switching themes', () => {
    useAppStore.setState({ themeMode: 'fermata' });
    const { rerender } = renderHook(() => useTheme());

    let meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute('content')).toBe('#f5efe2');

    useAppStore.setState({ themeMode: 'fermata-night' });
    rerender();

    meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute('content')).toBe('#181208');
  });
});
