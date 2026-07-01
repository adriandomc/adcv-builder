import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import puppeteer from 'puppeteer';
import { parseYamlToAstResult } from '$lib/effect/YamlService';
import { putDoc } from '$lib/server/pdfDocStore';
import type { Document } from '$lib/effect/ResumeSchema';

// Origin the headless browser navigates to. Always loopback — never the public
// (possibly proxied/TLS) origin, which the in-process Chromium can't reach.
function renderOrigin(): string {
  if (env.PDF_RENDER_ORIGIN) return env.PDF_RENDER_ORIGIN;
  if (dev) return 'http://localhost:5173';
  return `http://127.0.0.1:${env.PORT ?? '3000'}`;
}

function fileName(doc: Document): string {
  const kind = doc.document === 'cover-letter' ? 'Cover Letter' : 'Resume';
  const name = doc.profile?.name?.trim();
  const base = name ? `${name} - ${kind}` : `ADCV ${kind}`;
  // Keep it ASCII-safe for the Content-Disposition header.
  return base.replace(/[^\w.\- ]+/g, '').trim() || 'document';
}

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const yaml = body?.yaml;
  if (typeof yaml !== 'string') {
    return json({ error: 'Missing "yaml" string in request body.' }, { status: 400 });
  }

  const parsed = await parseYamlToAstResult(yaml);
  if (!parsed.ok) {
    return json({ error: parsed.error }, { status: 400 });
  }

  const token = putDoc(parsed.value);

  // ponytail: launch por request; si el export se vuelve frecuente, cachear un
  // browser singleton (con relaunch en crash + handlers de shutdown).
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.goto(`${renderOrigin()}/print?token=${token}`, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');
    // Fonts use font-display: swap — wait so the PDF gets real glyphs, not fallbacks.
    await page.evaluate(() => document.fonts.ready.then(() => undefined));

    const pdf = await page.pdf({
      tagged: true, // accessible/tagged PDF — the whole point (default true; explicit for clarity)
      outline: true, // document bookmarks
      printBackground: true,
      preferCSSPageSize: true // honor @page { size: letter } from _resume.scss
    });

    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName(parsed.value)}.pdf"`
      }
    });
  } finally {
    await browser.close();
  }
};
