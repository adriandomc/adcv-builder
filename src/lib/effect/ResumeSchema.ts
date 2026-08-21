import { Schema } from 'effect';

export interface ResumeLink {
  label: string;
  url: string;
}

export interface ResumeProfile {
  name: string;
  title: string;
  location: string;
  email: string;
  website?: string | ResumeLink[];
  links: ResumeLink[];
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  description?: string;
  bullets?: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  url: string;
  stack: string[];
  bullets?: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
}

export interface ResumeSettings {
  fontSize?: number;
  page?: ResumePage;
}

export type ResumePage =
  | { format: 'letter' | 'a4' | 'legal' }
  | { width: number; height: number; unit: 'in' | 'mm' };

export interface Resume {
  document?: 'resume';
  settings?: ResumeSettings;
  profile: ResumeProfile;
  summary: string;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
}

export interface CoverLetterRecipient {
  company: string;
  hiringManager?: string;
  address?: string;
}

export interface CoverLetter {
  document: 'cover-letter';
  profile: ResumeProfile;
  recipient: CoverLetterRecipient;
  date?: string;
  greeting: string;
  body: string[];
  closing: string;
}

export interface ShortResume {
  document: 'short-resume';
  profile: ResumeProfile;
  body: string;
}

export type Document = Resume | CoverLetter | ShortResume;

export const ResumeLinkSchema = Schema.Struct({
  label: Schema.String,
  url: Schema.String
});

export const ResumeProfileSchema = Schema.Struct({
  name: Schema.String,
  title: Schema.String,
  location: Schema.String,
  email: Schema.String,
  website: Schema.optional(Schema.Union(Schema.String, Schema.Array(ResumeLinkSchema))),
  links: Schema.Array(ResumeLinkSchema)
});

export const SkillGroupSchema = Schema.Struct({
  name: Schema.String,
  items: Schema.Array(Schema.String)
});

export const ExperienceItemSchema = Schema.Struct({
  company: Schema.String,
  role: Schema.String,
  period: Schema.String,
  location: Schema.String,
  description: Schema.optional(Schema.String),
  bullets: Schema.optional(Schema.Array(Schema.String))
});

export const ProjectItemSchema = Schema.Struct({
  name: Schema.String,
  description: Schema.String,
  url: Schema.String,
  stack: Schema.Array(Schema.String),
  bullets: Schema.optional(Schema.Array(Schema.String))
});

export const EducationItemSchema = Schema.Struct({
  school: Schema.String,
  degree: Schema.String,
  period: Schema.String
});

export const ResumeSettingsSchema = Schema.Struct({
  fontSize: Schema.optional(Schema.Number.pipe(Schema.between(7, 12))),
  page: Schema.optional(Schema.Union(
    Schema.Struct({ format: Schema.Literal('letter', 'a4', 'legal') }),
    Schema.Struct({
      width: Schema.Number.pipe(Schema.between(5, 20)),
      height: Schema.Number.pipe(Schema.between(5, 20)),
      unit: Schema.Literal('in')
    }),
    Schema.Struct({
      width: Schema.Number.pipe(Schema.between(127, 508)),
      height: Schema.Number.pipe(Schema.between(127, 508)),
      unit: Schema.Literal('mm')
    })
  ))
});

export const ResumeSchema = Schema.Struct({
  document: Schema.optional(Schema.Literal('resume')),
  settings: Schema.optional(ResumeSettingsSchema),
  profile: ResumeProfileSchema,
  summary: Schema.String,
  skills: Schema.Array(SkillGroupSchema),
  experience: Schema.Array(ExperienceItemSchema),
  projects: Schema.Array(ProjectItemSchema),
  education: Schema.Array(EducationItemSchema)
});

export const CoverLetterRecipientSchema = Schema.Struct({
  company: Schema.String,
  hiringManager: Schema.optional(Schema.String),
  address: Schema.optional(Schema.String)
});

export const CoverLetterSchema = Schema.Struct({
  document: Schema.Literal('cover-letter'),
  profile: ResumeProfileSchema,
  recipient: CoverLetterRecipientSchema,
  date: Schema.optional(Schema.String),
  greeting: Schema.String,
  body: Schema.Array(Schema.String),
  closing: Schema.String
});

export const ShortResumeSchema = Schema.Struct({
  document: Schema.Literal('short-resume'),
  profile: ResumeProfileSchema,
  body: Schema.String
});

export const DocumentSchema = Schema.Union(CoverLetterSchema, ShortResumeSchema, ResumeSchema);
