import { describe, it, expect } from 'vitest';
import { esc, instructionHtml, jsonLdHtml, proseHtml, rawQueryTokens } from '../html';
import { siteLessons, SITE_LANGS } from '../content';
import { textOf } from '../check';

describe('escaping', () => {
  it('escapes & < > " \' in text and attributes', () => {
    expect(esc(`Theme & Variations <0,0,1> "a" 'b'`)).toBe('Theme &amp; Variations &lt;0,0,1&gt; &quot;a&quot; &#39;b&#39;');
    expect(esc('Gr+6 <-> V7')).toBe('Gr+6 &lt;-&gt; V7');
  });

  it('a concept\'s explanation is plain text, as ModuleView renders it', () => {
    expect(proseHtml('For [0, 4, 7], the ICV is <0,0,1,1,1,0>: one IC3 & one IC4.')).toBe('For [0, 4, 7], the ICV is &lt;0,0,1,1,1,0&gt;: one IC3 &amp; one IC4.');
  });
});

/** A lesson's "open in Fermatina" address, as the lesson page passes it (2026-11-19). */
const OPEN = 'https://fermatina.com/?lesson=l1u3m1&lang=en';
const LINK = '<a class="query" href="https://fermatina.com/?lesson=l1u3m1&amp;lang=en">';

describe('a task\'s quoted queries (the lesson text\'s one markup)', () => {
  it('become ‘query’ as the app shows them, whatever quotes the text used, each an ordinary link to the lesson in the app (2026-11-19), its address escaped', () => {
    expect(instructionHtml("Type 'C major scale' and trace the pattern", OPEN)).toBe(`Type ${LINK}‘C major scale’</a> and trace the pattern`);
    expect(instructionHtml("Tap 'C major scale' then 'G major scale'", OPEN)).toBe(`Tap ${LINK}‘C major scale’</a> then ${LINK}‘G major scale’</a>`);
    expect(instructionHtml('Toca “G7” e depois «C major chord»', OPEN)).toBe(`Toca ${LINK}‘G7’</a> e depois ${LINK}‘C major chord’</a>`);
    expect(rawQueryTokens("Type 'C major scale' then 'G major scale'")).toEqual(["'C major scale'", "'G major scale'"]);
  });

  it('leave apostrophes and quoted prose that is not a query as written, escaped, and link nothing', () => {
    expect(instructionHtml("Don't shift your clap to the 'and' between beats", OPEN)).toBe('Don&#39;t shift your clap to the &#39;and&#39; between beats');
    expect(instructionHtml('Compare <1,0,1> & "Diabelli"', OPEN)).toBe('Compare &lt;1,0,1&gt; &amp; &quot;Diabelli&quot;');
  });

  it('over the whole curriculum, no raw token is left and every query reads as the app reads it', () => {
    let tokens = 0;
    for (const lang of SITE_LANGS) {
      for (const { module } of siteLessons(lang)) {
        for (const task of module.tasks) {
          const html = instructionHtml(task.instruction, OPEN);
          const shown = textOf(html);
          for (const raw of rawQueryTokens(task.instruction)) {
            tokens++;
            expect(shown, `${module.id} ${lang}`).not.toContain(raw);
          }
          expect(html).not.toMatch(/<(?!\/?a[\s>])/);
        }
      }
    }
    expect(tokens).toBeGreaterThan(300);
  });
});

describe('the JSON-LD block', () => {
  it('cannot be closed or read as markup by its text, and parses back unchanged', () => {
    const data = { name: '</script><script>alert(1)</script>', note: 'a & b <c>', sep: 'x\u2028y' };
    const html = jsonLdHtml(data);
    expect(html.startsWith('<script type="application/ld+json">')).toBe(true);
    const body = html.slice('<script type="application/ld+json">'.length, -'</script>'.length);
    expect(body).not.toMatch(/[<>&\u2028]/);
    expect(JSON.parse(body)).toEqual(data);
  });
});
