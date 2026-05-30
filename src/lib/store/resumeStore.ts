import { writable } from 'svelte/store';
import { parseYamlToAstResult } from '$lib/effect/YamlService';
import type { Resume } from '$lib/effect/ResumeSchema';
import type { ResumeResponse } from '$lib/resume/api';
import { DEFAULT_RESUME, DEFAULT_RESUME_YAML } from '$lib/resume/defaultResume';

const STORAGE_KEY = 'adcv_resume';

export type SaveState = 'loading' | 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export interface ResumeState {
  yaml: string;
  resume: Resume;
  parseError: string | null;
  saveError: string | null;
  loadError: string | null;
  saveState: SaveState;
  updatedAt: string | null;
}

const initialState: ResumeState = {
  yaml: DEFAULT_RESUME_YAML,
  resume: DEFAULT_RESUME,
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
  resumeStore.update((state) => ({
    ...state,
    saveState: 'loading',
    loadError: null
  }));

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const payload = JSON.parse(stored) as ResumeResponse;
      parseVersion += 1;
      resumeStore.set({
        yaml: payload.yaml,
        resume: payload.data,
        parseError: null,
        saveError: null,
        loadError: null,
        saveState: 'saved',
        updatedAt: payload.updatedAt
      });
    } else {
      const parsed = await parseYamlToAstResult(DEFAULT_RESUME_YAML);
      if (!parsed.ok) {
        throw new Error('Default resume does not match the schema');
      }
      const now = new Date().toISOString();
      const payload: ResumeResponse = {
        yaml: DEFAULT_RESUME_YAML,
        data: parsed.value,
        updatedAt: now,
        schemaVersion: 1
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      parseVersion += 1;
      resumeStore.set({
        yaml: DEFAULT_RESUME_YAML,
        resume: parsed.value,
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
      saveState: 'error',
      loadError: error instanceof Error ? error.message : 'Could not load resume',
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
    resume: parsed.value,
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
    resume: parsed.value,
    saveState: 'saving',
    saveError: null
  }));

  try {
    const now = new Date().toISOString();
    const payload: ResumeResponse = {
      yaml,
      data: parsed.value,
      updatedAt: now,
      schemaVersion: 1
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    if (version !== parseVersion) {
      return;
    }

    resumeStore.update((state) => ({
      ...state,
      resume: parsed.value,
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
      saveError: error instanceof Error ? error.message : 'Could not save resume'
    }));
  }
}


