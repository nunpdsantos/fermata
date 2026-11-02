import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/index.ts'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { registerInstrumentVoices } from './services/instrumentVoices.ts'
import { registerDrillWorkInProgress } from './state/drillWork.ts'

// One-time eviction of the persisted stores for the removed gamification +
// concept-tracking features. After the first load the keys are gone and
// removeItem is a harmless no-op.
['music-theory-gamification', 'music-theory-concept-tracking'].forEach((k) => localStorage.removeItem(k));

// The active instrument voice (sampled Salamander piano or Karplus-Strong
// guitar) follows the selected instrument; the FM synth remains the piano
// fallback while samples load.
registerInstrumentVoices();

// A waiting app update never applies itself while a Drill session or Sprint
// is under way (W9b, services/workInProgress.ts). Registered at boot, before
// the Drill view's code loads, so it holds from the first moment of a launch.
registerDrillWorkInProgress();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
