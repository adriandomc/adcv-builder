import { writable } from 'svelte/store';
import { parseYamlToAstResult } from '$lib/effect/YamlService';
import type { Document } from '$lib/effect/ResumeSchema';
import type { DocumentResponse } from '$lib/resume/api';
import { DEFAULT_RESUME, DEFAULT_RESUME_YAML } from '$lib/resume/defaultResume';
import { DEFAULT_COVER_LETTER, DEFAULT_COVER_LETTER_YAML } from '$lib/resume/defaultCoverLetter';
import { DEFAULT_SHORT_RESUME, DEFAULT_SHORT_RESUME_YAML } from '$lib/resume/defaultShortResume';

export type DocumentType = 'resume' | 'short-resume' | 'cover-letter';

const STORAGE_KEYS: Record<DocumentType, string> = {
  'resume': 'adcv_resume',
  'short-resume': 'adcv_short_resume',
  'cover-letter': 'adcv_cover_letter'
};

const DEFAULT_YAMLS: Record<DocumentType, string> = {
  'resume': DEFAULT_RESUME_YAML,
  'short-resume': DEFAULT_SHORT_RESUME_YAML,
  'cover-letter': DEFAULT_COVER_LETTER_YAML
};

const DEFAULT_DOCS: Record<DocumentType, Document> = {
  'resume': DEFAULT_RESUME,
  'short-resume': DEFAULT_SHORT_RESUME,
  'cover-letter': DEFAULT_COVER_LETTER
};

export type SaveState = 'loading' | 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export interface ResumeState {
  documentType: DocumentType;
  yaml: string;
  document: Document;
  parseError: string | null;
  saveError: string | null;
  loadError: string | null;
  saveState: SaveState;
  updatedAt: string | null;
}

const initialState: ResumeState = {
  documentType: 'resume',
  yaml: DEFAULT_RESUME_YAML,
  document: DEFAULT_RESUME,
  parseError: null,
  saveError: null,
  loadError: null,
  saveState: 'idle',
  updatedAt: null
};

export const resumeStore = writable<ResumeState>(initialState);

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let parseVersion = 0;

export async function initializeResume(): Promise<void> {
  await loadDocumentType('resume');
}

export async function switchDocumentType(type: DocumentType): Promise<void> {
  let currentType: DocumentType = 'resume';
  const unsubscribe = resumeStore.subscribe(s => currentType = s.documentType);
  unsubscribe();
  
  if (currentType === type) return;

  clearPendingSave();
  await loadDocumentType(type);
}

async function loadDocumentType(type: DocumentType): Promise<void> {
  resumeStore.update((state) => ({
    ...state,
    documentType: type,
    saveState: 'loading',
    loadError: null
  }));

  try {
    const key = STORAGE_KEYS[type];
    const stored = localStorage.getItem(key);

    if (stored) {
      const payload = JSON.parse(stored) as DocumentResponse;
      parseVersion += 1;
      resumeStore.set({
        documentType: type,
        yaml: payload.yaml,
        document: payload.data,
        parseError: null,
        saveError: null,
        loadError: null,
        saveState: 'saved',
        updatedAt: payload.updatedAt
      });
    } else {
      const defaultYaml = DEFAULT_YAMLS[type];
      const defaultDoc = DEFAULT_DOCS[type];
      const parsed = await parseYamlToAstResult(defaultYaml);
      
      const doc = parsed.ok ? parsed.value : defaultDoc;

      const now = new Date().toISOString();
      const payload: DocumentResponse = {
        yaml: defaultYaml,
        data: doc,
        updatedAt: now,
        schemaVersion: 1
      };
      localStorage.setItem(key, JSON.stringify(payload));
      parseVersion += 1;
      resumeStore.set({
        documentType: type,
        yaml: defaultYaml,
        document: doc,
        parseError: null,
        saveError: null,
        loadError: null,
        saveState: 'saved',
        updatedAt: now
      });
    }
  } catch (error) {
    resumeStore.update((state) => ({
      ...state,
      documentType: type,
      saveState: 'error',
      loadError: error instanceof Error ? error.message : 'Could not load document',
      saveError: null
    }));
  }
}

export async function updateYaml(nextYaml: string): Promise<void> {
  parseVersion += 1;
  const currentVersion = parseVersion;
  clearPendingSave();

  resumeStore.update((state) => ({
    ...state,
    yaml: nextYaml,
    parseError: null,
    saveError: null,
    saveState: 'dirty'
  }));

  const parsed = await parseYamlToAstResult(nextYaml);

  if (currentVersion !== parseVersion) {
    return;
  }

  if (!parsed.ok) {
    resumeStore.update((state) => ({
      ...state,
      parseError: parsed.error,
      saveState: 'dirty'
    }));
    return;
  }

  resumeStore.update((state) => ({
    ...state,
    document: parsed.value,
    parseError: null,
    saveState: 'dirty'
  }));

  saveTimer = setTimeout(() => {
    void saveYaml(nextYaml, currentVersion);
  }, 500);
}

export async function saveCurrentYaml(): Promise<void> {
  let yaml = DEFAULT_RESUME_YAML;
  const unsubscribe = resumeStore.subscribe((state) => {
    yaml = state.yaml;
  });
  unsubscribe();

  parseVersion += 1;
  const currentVersion = parseVersion;
  clearPendingSave();
  await saveYaml(yaml, currentVersion);
}

function clearPendingSave(): void {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
}

async function saveYaml(yaml: string, version: number): Promise<void> {
  const parsed = await parseYamlToAstResult(yaml);

  if (!parsed.ok) {
    resumeStore.update((state) => ({
      ...state,
      parseError: parsed.error,
      saveState: 'dirty'
    }));
    return;
  }

  if (version !== parseVersion) {
    return;
  }

  resumeStore.update((state) => ({
    ...state,
    document: parsed.value,
    saveState: 'saving',
    saveError: null
  }));

  try {
    let type: DocumentType = 'resume';
    const unsubscribe = resumeStore.subscribe(s => type = s.documentType);
    unsubscribe();

    const now = new Date().toISOString();
    const payload: DocumentResponse = {
      yaml,
      data: parsed.value,
      updatedAt: now,
      schemaVersion: 1
    };
    
    localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(payload));

    if (version !== parseVersion) {
      return;
    }

    resumeStore.update((state) => ({
      ...state,
      document: parsed.value,
      saveState: 'saved',
      saveError: null,
      updatedAt: now
    }));
  } catch (error) {
    if (version !== parseVersion) {
      return;
    }

    resumeStore.update((state) => ({
      ...state,
      saveState: 'error',
      saveError: error instanceof Error ? error.message : 'Could not save document'
    }));
  }
}

