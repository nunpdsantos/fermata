/**
 * Test helper: every Drill item rendered as the learner meets it, in one
 * language — the question, what each answer chip says, the explanation, and
 * the answer the feedback names. Built from the same functions the view
 * calls (drillText, qualityName), never from the bank's raw strings.
 */
import i18n from '../../../i18n';
import { generateDrillBank } from '../../../core/utils/drillBank';
import type { DrillItem } from '../../../core/types/drill';
import { qualityName } from '../../../utils/qualityName';
import { choiceLabel, itemPrompt, itemWhy } from '../drillText';
import { answerLabel } from '../answerText';

export type Lang = 'en' | 'pt' | 'es';
export const LANGS: readonly Lang[] = ['en', 'pt', 'es'];

export interface RenderedItem {
  id: string;
  family: DrillItem['family'];
  question: string;
  choices: string[];
  explanation: string;
  answer: string;
}

export const BANK: readonly DrillItem[] = generateDrillBank({ includeRead: true });

export function renderItem(item: DrillItem, lang: Lang): RenderedItem {
  const t = i18n.getFixedT(lang);
  let choices: string[] = [];
  switch (item.input.format) {
    case 'choice':
      choices = item.input.choices.map((c) => choiceLabel(item, c, t, lang));
      break;
    case 'rootQuality':
      // RootQualityChips: the root chips as given, the quality chips by qualityName.
      choices = [...item.input.roots, ...item.input.qualities.map((q) => qualityName(q, lang))];
      break;
    case 'noteChips':
      choices = [...item.input.chips];
      break;
    case 'accidentalSlots':
      choices = [...item.input.letters];
      break;
    case 'fretboard':
      choices = [];
      break;
  }
  return {
    id: item.id,
    family: item.family,
    question: itemPrompt(item, t, lang),
    choices,
    explanation: item.family === 'read' ? t('drill.reading.explanation', item.whyParams) : itemWhy(item, t, lang),
    answer: answerLabel(item, t, lang),
  };
}

export function renderBank(lang: Lang): RenderedItem[] {
  return BANK.map((item) => renderItem(item, lang));
}
