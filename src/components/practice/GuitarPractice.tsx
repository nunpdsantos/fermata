import '../../i18n/practice';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../state/store';
import { noteToString, type ScaleType } from '../../core/types/music';
import { withGlyphs } from '../../core/utils/accidentalGlyphs';
import { getTuningById } from '../../core/constants/guitarTunings';
import { EXAM_SCALE_TYPES, ROUTE_SCALE_TYPES, maxScaleOctaves } from '../../core/utils/scaleRoutes';
import { RIGHT_HAND_PATTERNS, DEFAULT_PROGRESSION } from '../../core/utils/rightHandPatterns';
import { useChooseScale } from '../navigation/keyChoice';
import { Segment } from '../ui/Segment';
import { SelectTrigger } from '../ui/SelectTrigger';
import { ChipGroup } from '../ui/ChoiceChip';
import { PracticePlayer } from './PracticePlayer';
import { WordsButton } from '../../glossary/Term';
import { useCapoFret } from '../../state/capo';
import { CAPO_TERM } from '../instruments/capoView';
import type { TermId } from '../../glossary/termIds';

const TAB_TERM: Partial<Record<string, TermId>> = { walk: 'positionWalk', technical: 'technicalSet', rightHand: 'rightHandFingers' };
/** The glossary entry for a technical-set exercise, for "Words on this screen". */
function itemTerm(id: string): TermId | undefined {
  if (/^(thirds|sixths|octaves)-/.test(id)) return 'intervalScale';
  if (id.startsWith('brokenChord')) return 'brokenChord';
  if (id === 'tonicArpeggio') return 'arpeggio';
  if (id === 'dominantSeventh') return 'dominantSeventh';
  if (id === 'diminishedSeventh') return 'diminishedSeventh';
  if (id === 'chromatic') return 'scale_chromatic';
  return undefined;
}
import { keyMode, positionWalkPractice, rightHandPractice, scalePractice, technicalSet } from './practiceModel';

type Tab = 'scales' | 'walk' | 'technical' | 'rightHand';

/** Lazy entry: the fingering search and technical engines never enter the app bundle. */
export default function GuitarPractice() {
  const { t } = useTranslation();
  const root = useAppStore((s) => s.selectedKey);
  const scale = useAppStore((s) => s.selectedScale);
  const tuningId = useAppStore((s) => s.guitarTuningId);
  const tuning = useMemo(() => getTuningById(tuningId), [tuningId]);
  const [tab, setTab] = useState<Tab>('scales');
  const [octaves, setOctaves] = useState(2);
  const [scheme, setScheme] = useState<'im' | 'ma'>('im');
  const [stroke, setStroke] = useState<'tirando' | 'apoyando'>('tirando');
  const [item, setItem] = useState('scale');
  const [pattern, setPattern] = useState(RIGHT_HAND_PATTERNS[0].id);
  const chooseScale = useChooseScale();
  // The practice exercises use the neck without a capo (wave 2): say so while one is on.
  const capo = useCapoFret();
  const range = Math.min(3, maxScaleOctaves(root, tuning));
  const shownOctaves = Math.min(octaves, range);
  const scaleRoute = useMemo(() => tab === 'scales' ? scalePractice(root, scale, tuning, shownOctaves, scheme) : null, [tab, root, scale, tuning, shownOctaves, scheme]);
  const items = useMemo(() => tab === 'technical' ? technicalSet(root, scale, tuning) : [], [tab, root, scale, tuning]);
  const study = useMemo(() => tab === 'rightHand' ? rightHandPractice(root, scale, tuning, pattern) : null, [tab, root, scale, tuning, pattern]);
  const walk = useMemo(() => tab === 'walk' ? positionWalkPractice(root, scale, tuning) : null, [tab, root, scale, tuning]);
  const selected = items.find((entry) => entry.id === item);
  const route = tab === 'walk' ? walk : tab === 'scales' ? scaleRoute : tab === 'technical' ? selected?.route : study;
  const reason = tab === 'scales' ? ROUTE_SCALE_TYPES.includes(scale) ? 'noRoute' : 'heptatonic'
    : tab === 'walk' ? 'noWalk' : tab === 'technical' ? selected?.reason ?? 'noRoute' : tuning.id !== 'standard' ? 'standardOnly' : keyMode(scale) ? 'noGrip' : 'majorMinor';
  const routeTypes = [...EXAM_SCALE_TYPES, ...ROUTE_SCALE_TYPES.filter((s) => !EXAM_SCALE_TYPES.includes(s))];
  const playerKey = [noteToString(root), scale, tuning.id, tab, route?.id, route?.octaves, scheme, stroke].join('|');

  return <div className="practice-content space-y-4">
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <p className="text-ui" data-term="key">{t('practice.keyOfPiece', { key: `${withGlyphs(root)} ${t(`scaleName.${scale}`)}` })}</p>
      <WordsButton />
    </div>
    {capo > 0 && <p className="text-ui" data-testid="practice-capo-note" data-term={CAPO_TERM}>{t('capo.practiceNote')}</p>}
    <Segment mode="tabs" className="practice-tabs" label={t('practice.title')} value={tab} onChange={setTab}
      options={(['scales', 'walk', 'technical', 'rightHand'] as const).map((value) => ({ value, label: TAB_TERM[value] ? <span data-term={TAB_TERM[value]}>{t(`practice.tabs.${value}`)}</span> : t(`practice.tabs.${value}`), id: `practice-tab-${value}`, controls: 'practice-panel' }))} />
    <div id="practice-panel" role="tabpanel" aria-labelledby={`practice-tab-${tab}`} className="space-y-3">
      {tab === 'walk' && <p className="text-ui">{t('practice.walkHint')}</p>}
      {tab === 'scales' && <>
        <div className="flex flex-wrap gap-3 items-center">
          <label className="practice-select-label">{t('keySelector.scale')}
            <SelectTrigger value={scale} onChange={(e) => chooseScale(e.target.value as ScaleType)}>
              {!routeTypes.includes(scale) && <option value={scale}>{t(`scaleName.${scale}`)}</option>}
              {routeTypes.map((type) => <option key={type} value={type}>{t(`scaleName.${type}`)}</option>)}
            </SelectTrigger>
          </label>
          <ChipGroup label={t('practice.octaves')} value={shownOctaves} onChange={setOctaves}
            options={Array.from({ length: range }, (_, i) => ({ value: i + 1, label: t('practice.octaveCount', { count: i + 1 }) }))} />
        </div>
        <div className="flex flex-wrap gap-3">
          <ChipGroup label={t('practice.alternation')} value={scheme} onChange={setScheme} options={[{ value: 'im', label: 'i–m', data: { 'data-term': 'rightHandFingers' } }, { value: 'ma', label: 'm–a', data: { 'data-term': 'rightHandFingers' } }]} />
          <ChipGroup label={t('practice.stroke')} value={stroke} onChange={setStroke}
            options={[{ value: 'tirando', label: 'tirando', data: { 'data-term': 'tirandoApoyando' } }, { value: 'apoyando', label: 'apoyando', data: { 'data-term': 'tirandoApoyando' } }]} />
        </div>
        <p className="text-caption">{t('practice.strokeHint')}</p>
      </>}
      {tab === 'technical' && <>
        <p className="text-ui">{t('practice.technicalHint')}</p>
        <label className="practice-select-label" data-term={itemTerm(item)}>{t('practice.exercise')}
          <SelectTrigger data-testid="practice-exercise" value={item} onChange={(e) => setItem(e.target.value)}>
            {items.map((entry) => <option value={entry.id} key={entry.id}>{t(`practice.items.${entry.id}`)} · {t(entry.route ? 'practice.available' : 'practice.unavailable')}</option>)}
          </SelectTrigger>
        </label>
        <details className="practice-availability">
          <summary>{t('practice.availability')}</summary>
          <ul className="space-y-2 pt-2">{items.map((entry) => <li key={entry.id}>
            <strong>{t(`practice.items.${entry.id}`)}</strong>: {entry.route ? t('practice.available') : t(`practice.reason.${entry.reason}`)}
          </li>)}</ul>
        </details>
        <p className="text-caption">{t('practice.tirando')}{item === 'chromatic' ? ` ${t('practice.chromaticSpelling')}` : ''}</p>
      </>}
      {tab === 'rightHand' && <>
        <label className="practice-select-label">{t('practice.pattern')}
          <SelectTrigger data-testid="practice-pattern" value={pattern} onChange={(e) => setPattern(e.target.value)}>
            {RIGHT_HAND_PATTERNS.map((p) => <option value={p.id} key={p.id}>{p.name} · {t(`practice.contour.${p.contour}`)}</option>)}
          </SelectTrigger>
        </label>
        <p className="text-ui">{keyMode(scale) && DEFAULT_PROGRESSION[keyMode(scale)!].join(' → ')} · {t('practice.tirando')}</p>
        <p className="text-caption">{t('practice.rightHandLegend')}</p>
      </>}
      {route ? <PracticePlayer key={playerKey} route={route} root={root} scale={scale} tuning={tuning} editable={tab !== 'rightHand'} />
        : <p role="status" className="text-ui">{t(`practice.reason.${reason}`)}</p>}
    </div>
  </div>;
}
