import { describe, expect, it } from 'vitest';
import { DEFAULT_RESUME_YAML } from '$lib/resume/defaultResume';
import { DEFAULT_SHORT_RESUME_YAML } from '$lib/resume/defaultShortResume';
import { parseYamlToAstResult } from './YamlService';

describe('YamlService', () => {
  it('parses a valid resume YAML document', async () => {
    const result = await parseYamlToAstResult(DEFAULT_RESUME_YAML);

    expect(result.ok).toBe(true);

    if (
      result.ok &&
      result.value.document !== 'cover-letter' &&
      result.value.document !== 'short-resume'
    ) {
      expect(result.value.profile.name).toBe('Jane Doe');
      expect(result.value.profile.website).toEqual([
        {
          label: 'Portfolio',
          url: 'https://portfolio.example.com'
        }
      ]);
      expect(result.value.skills[0]?.items).toContain('React');
    }
  });

  it('keeps backwards compatibility with a website string', async () => {
    const legacyYaml = DEFAULT_RESUME_YAML.replace(
      'website:\n    - label: "Portfolio"\n      url: "https://portfolio.example.com"',
      'website: "https://portfolio.example.com"'
    );

    const result = await parseYamlToAstResult(legacyYaml);

    expect(result.ok).toBe(true);

    if (
      result.ok &&
      result.value.document !== 'cover-letter' &&
      result.value.document !== 'short-resume'
    ) {
      expect(result.value.profile.website).toBe('https://portfolio.example.com');
    }
  });

  it('parses a short resume with free text', async () => {
    const result = await parseYamlToAstResult(DEFAULT_SHORT_RESUME_YAML);

    expect(result.ok).toBe(true);

    if (result.ok && result.value.document === 'short-resume') {
      expect(result.value.profile.links.some((link) => link.label === 'LinkedIn')).toBe(true);
      expect(result.value.body).toContain('I build useful software');
    }
  });

  it('rejects invalid YAML syntax', async () => {
    const result = await parseYamlToAstResult('profile:\n  name: "broken');

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toContain('YAML syntax error');
    }
  });

  it('rejects documents that do not match the document schema', async () => {
    const result = await parseYamlToAstResult('profile:\n  name: "Only a name"\n');

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toContain('Document schema mismatch');
    }
  });
});
