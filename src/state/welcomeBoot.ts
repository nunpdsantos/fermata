/**
 * MUST stay the first import of main.tsx: it reads storage before any store
 * module is evaluated (and writes), so "nothing saved yet" really means a
 * first visit. See state/welcomeGate.ts.
 */
import { bootWelcome } from './welcomeGate.ts';

bootWelcome();
