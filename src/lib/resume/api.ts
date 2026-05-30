import type { Resume } from '$lib/effect/ResumeSchema';

export interface ResumeResponse {
  yaml: string;
  data: Resume;
  updatedAt: string;
  schemaVersion: 1;
}

export interface SaveResumeRequest {
  yaml: string;
}

export interface ApiErrorResponse {
  error: string;
}
