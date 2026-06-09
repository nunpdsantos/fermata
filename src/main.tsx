import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/index.ts'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { registerSampledPiano } from './services/pianoVoiceRegistration.ts'

// One-time eviction of the persisted stores for the removed gamification +
// concept-tracking features. After the first load the keys are gone and
// removeItem is a harmless no-op.
['music-theory-gamification', 'music-theory-concept-tracking'].forEach((k) => localStorage.removeItem(k));

// Sampled piano (Salamander) replaces the FM synth voice once its samples load.
registerSampledPiano();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
