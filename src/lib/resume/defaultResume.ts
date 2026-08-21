import { parse } from 'yaml';
import type { Resume } from '$lib/effect/ResumeSchema';

export const DEFAULT_RESUME_YAML = `profile:
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
settings:
  # Font size in points (7-12). Lower values fit more content on one page.
  fontSize: 9.5
summary: "Experienced software engineer specializing in building scalable web applications. Passionate about clean code, modern frontend frameworks, and robust backend architectures."
skills:
  - name: "Core"
    items:
      - "JavaScript"
      - "TypeScript"
      - "React"
      - "Node.js"
      - "Python"
      - "SQL"
      - "Docker"
      - "Git"
experience:
  - company: "Tech Solutions Inc."
    role: "Senior Developer"
    period: "2022 - Present"
    location: "Remote"
    bullets:
      - "Lead the development of the core product platform, improving performance by 40%."
      - "Mentored junior developers and established CI/CD best practices."
  - company: "Web Dev Agency"
    role: "Full Stack Developer"
    period: "2019 - 2022"
    location: "New York"
    description: "Delivered client projects using React and Node.js, including third-party API and payment integrations."
projects:
  - name: "Open Source Tool"
    description: "A CLI tool for automating deployment workflows."
    url: "https://github.com/janedoe/cli-tool"
    stack:
      - "Node.js"
      - "CLI"
  - name: "E-commerce Platform"
    description: "A scalable e-commerce backend built with microservices."
    url: "https://github.com/janedoe/ecommerce"
    stack:
      - "Python"
      - "PostgreSQL"
      - "Docker"
education:
  - school: "State University"
    degree: "Bachelor of Science in Computer Science"
    period: "2015 - 2019"
`;

export const DEFAULT_RESUME = parse(DEFAULT_RESUME_YAML) as Resume;
