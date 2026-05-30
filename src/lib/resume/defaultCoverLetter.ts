import { parse } from 'yaml';
import type { CoverLetter } from '$lib/effect/ResumeSchema';

export const DEFAULT_COVER_LETTER_YAML = `document: "cover-letter"
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
    - label: "LinkedIn"
      url: "https://linkedin.com/in/janedoe"
recipient:
  company: "Tech Solutions Inc."
  hiringManager: "Hiring Manager"
  address: "123 Tech Lane, San Francisco, CA"
date: "October 24, 2024"
greeting: "Dear Hiring Manager,"
body:
  - "I am writing to express my interest in the Software Engineer position at Tech Solutions Inc. With over 5 years of experience in full-stack development, I am confident in my ability to contribute effectively to your team."
  - "In my previous role at Web Dev Agency, I successfully led the migration of a legacy monolithic application to a microservices architecture, improving system performance by 40% and reducing deployment times by half. I am particularly drawn to Tech Solutions Inc. because of your commitment to building scalable and innovative products."
  - "I would welcome the opportunity to discuss how my skills and experiences align with the needs of your team. Thank you for considering my application."
closing: "Sincerely,"
`;

export const DEFAULT_COVER_LETTER = parse(DEFAULT_COVER_LETTER_YAML) as CoverLetter;
