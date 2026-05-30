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
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  url: string;
  stack: string[];
  bullets: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
}

export interface Resume {
  profile: ResumeProfile;
  summary: string;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
}

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
  bullets: Schema.Array(Schema.String)
});

export const ProjectItemSchema = Schema.Struct({
  name: Schema.String,
  description: Schema.String,
  url: Schema.String,
  stack: Schema.Array(Schema.String),
  bullets: Schema.Array(Schema.String)
});

export const EducationItemSchema = Schema.Struct({
  school: Schema.String,
  degree: Schema.String,
  period: Schema.String
});

export const ResumeSchema = Schema.Struct({
  profile: ResumeProfileSchema,
  summary: Schema.String,
  skills: Schema.Array(SkillGroupSchema),
  experience: Schema.Array(ExperienceItemSchema),
  projects: Schema.Array(ProjectItemSchema),
  education: Schema.Array(EducationItemSchema)
});
