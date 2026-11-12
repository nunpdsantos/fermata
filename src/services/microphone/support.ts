/**
 * Can this page use a microphone at all? (wave 3, brief T) — tiny and eager,
 * so a control is offered only where it can work; the microphone code itself
 * (`microphone.ts`, the detector) loads only when the learner turns it on.
 *
 * Verified 2026-11-11 against MDN: getUserMedia exists only in a secure
 * context (https or localhost; `navigator.mediaDevices` is undefined
 * otherwise) and a Permissions-Policy that does not allow `microphone`
 * makes it reject with NotAllowedError. Chromium also reports the policy
 * beforehand (`document.featurePolicy.allowsFeature`); where that is missing
 * the request itself says so.
 */
interface PolicyDocument {
  featurePolicy?: { allowsFeature?: (feature: string) => boolean };
  permissionsPolicy?: { allowsFeature?: (feature: string) => boolean };
}

export function microphoneSupported(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (window.isSecureContext === false) return false;
  if (typeof navigator.mediaDevices?.getUserMedia !== 'function') return false;
  const w = window as unknown as { AudioContext?: unknown; webkitAudioContext?: unknown };
  if (!w.AudioContext && !w.webkitAudioContext) return false;
  const doc = document as unknown as PolicyDocument;
  const policy = doc.permissionsPolicy ?? doc.featurePolicy;
  try {
    if (policy?.allowsFeature && !policy.allowsFeature('microphone')) return false;
  } catch {
    // An unknown feature name in an older engine: let the request decide.
  }
  return true;
}

/** A new audio context, made where it is called (inside the learner's tap: iOS starts audio only there). */
export function makeAudioContext(): AudioContext {
  const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
  const Ctor = (w.AudioContext ?? w.webkitAudioContext)!;
  return new Ctor();
}
