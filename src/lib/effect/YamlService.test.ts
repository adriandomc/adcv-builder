import { describe, expect, it } from 'vitest';
import { DEFAULT_RESUME_YAML } from '$lib/resume/defaultResume';
import { parseYamlToAstResult } from './YamlService';

describe('YamlService', () => {
  it('parses a valid resume YAML document', async () => {
    const result = await parseYamlToAstResult(DEFAULT_RESUME_YAML);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.profile.name).toBe('Adrián Domínguez Casasola');
      expect(result.value.profile.website).toEqual([
        {
          label: 'Portfolio',
          url: 'https://portfolio.adriandomc.com'
        }
      ]);
      expect(result.value.skills[0]?.items).toContain('React');
    }
  });

  it('keeps backwards compatibility with a website string', async () => {
    const legacyYaml = DEFAULT_RESUME_YAML.replace(
      'website:\n    - label: "Portfolio"\n      url: "https://portfolio.adriandomc.com"',
      'website: "https://portfolio.adriandomc.com"'
    );

    const result = await parseYamlToAstResult(legacyYaml);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.profile.website).toBe('https://portfolio.adriandomc.com');
    }
  });

  it('rejects invalid YAML syntax', async () => {
    const result = await parseYamlToAstResult('profile:\n  name: "broken');

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toContain('YAML syntax error');
    }
  });

  it('rejects documents that do not match the resume schema', async () => {
    const result = await parseYamlToAstResult('profile:\n  name: "Only a name"\n');

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toContain('Resume schema mismatch');
    }
  });
});
