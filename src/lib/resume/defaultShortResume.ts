import { parse } from 'yaml';
import type { ShortResume } from '$lib/effect/ResumeSchema';

export const DEFAULT_SHORT_RESUME_YAML = `document: "short-resume"
profile:
  name: "Jane Doe"
  title: "Software Engineer"
  location: "New York, USA"
  email: "jane.doe@example.com"
  website:
    - label: "Portfolio"
      url: "https://portfolio.example.com"
  links:
    - label: "+1 (555) 123-4567"
      url: "tel:+15551234567"
    - label: "GitHub"
      url: "https://github.com/janedoe"
    - label: "LinkedIn"
      url: "https://linkedin.com/in/janedoe"
body: |-
  I build useful software and care about making complex products feel simple. Over the last five years, I have worked across frontend and backend systems, shipped reliable features, and helped teams improve how they build.

  I am looking for a small, ambitious team where clear writing, direct communication, and measurable impact matter.
`;

export const DEFAULT_SHORT_RESUME = parse(DEFAULT_SHORT_RESUME_YAML) as ShortResume;
