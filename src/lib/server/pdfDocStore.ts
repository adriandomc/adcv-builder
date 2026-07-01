import type { Document } from '$lib/effect/ResumeSchema';

// Short-lived handoff from POST /api/pdf to the headless render of GET /print.
// Mirrors the in-memory Map + sweeper pattern already used by the rate limiter
// in src/hooks.server.ts.

interface Entry {
  doc: Document;
  expires: number;
}

const TTL_MS = 60_000;
const store = new Map<string, Entry>();

export function putDoc(doc: Document): string {
  const token = crypto.randomUUID();
  store.set(token, { doc, expires: Date.now() + TTL_MS });
  return token;
}

// Single-use: reads and deletes. Returns undefined if missing or expired.
export function takeDoc(token: string): Document | undefined {
  const entry = store.get(token);
  if (!entry) return undefined;
  store.delete(token);
  return entry.expires < Date.now() ? undefined : entry.doc;
}

// Sweep tokens whose render never happened (e.g. navigation failed).
setInterval(() => {
  const now = Date.now();
  for (const [token, entry] of store.entries()) {
    if (entry.expires < now) store.delete(token);
  }
}, TTL_MS).unref();
