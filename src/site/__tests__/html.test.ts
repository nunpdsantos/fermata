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

describe('a task\'s quoted queries (the lesson text\'s one markup)', () => {
  it('become ‘query’ as the app shows them, whatever quotes the text used', () => {
    expect(instructionHtml("Type 'C major scale' and trace the pattern")).toBe('Type <span class="query">‘C major scale’</span> and trace the pattern');
    expect(instructionHtml('Toca “G7” e depois «C major chord»')).toBe('Toca <span class="query">‘G7’</span> e depois <span class="query">‘C major chord’</span>');
    expect(rawQueryTokens("Type 'C major scale' then 'G major scale'")).toEqual(["'C major scale'", "'G major scale'"]);
  });

  it('leave apostrophes and quoted prose that is not a query as written, escaped', () => {
    expect(instructionHtml("Don't shift your clap to the 'and' between beats")).toBe('Don&#39;t shift your clap to the &#39;and&#39; between beats');
    expect(instructionHtml('Compare <1,0,1> & "Diabelli"')).toBe('Compare &lt;1,0,1&gt; &amp; &quot;Diabelli&quot;');
  });

  it('over the whole curriculum, no raw token is left and every query reads as the app reads it', () => {
    let tokens = 0;
    for (const lang of SITE_LANGS) {
      for (const { module } of siteLessons(lang)) {
        for (const task of module.tasks) {
          const html = instructionHtml(task.instruction);
          const shown = textOf(html);
          for (const raw of rawQueryTokens(task.instruction)) {
            tokens++;
            expect(shown, `${module.id} ${lang}`).not.toContain(raw);
          }
          expect(html).not.toMatch(/<(?!\/?span[\s>])/);
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
