import type { Document } from '$lib/effect/ResumeSchema';

export interface DocumentResponse {
  yaml: string;
  data: Document;
  updatedAt: string;
  schemaVersion: 1;
}

export interface SaveResumeRequest {
  yaml: string;
}

export interface ApiErrorResponse {
  error: string;
}
