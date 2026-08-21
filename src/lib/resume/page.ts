import type { Document, ResumePage } from '$lib/effect/ResumeSchema';

const DPI = 96;
const MM_PER_INCH = 25.4;

export interface PageSize {
  widthIn: number;
  heightIn: number;
  widthPx: number;
  heightPx: number;
}

const PAGE_FORMATS: Record<'letter' | 'a4' | 'legal', [number, number]> = {
  letter: [8.5, 11],
  a4: [210 / MM_PER_INCH, 297 / MM_PER_INCH],
  legal: [8.5, 14]
};

export const DEFAULT_PAGE_SIZE = pageSize(9.5, 11);

function pageSize(widthIn: number, heightIn: number): PageSize {
  return { widthIn, heightIn, widthPx: widthIn * DPI, heightPx: heightIn * DPI };
}

export function resolvePageSize(page?: ResumePage): PageSize {
  if (!page) return DEFAULT_PAGE_SIZE;
  if ('format' in page) return pageSize(...PAGE_FORMATS[page.format]);
  const divisor = page.unit === 'mm' ? MM_PER_INCH : 1;
  return pageSize(page.width / divisor, page.height / divisor);
}

export function documentPageSize(document: Document): PageSize {
  return document.document !== 'cover-letter' && document.document !== 'short-resume'
    ? resolvePageSize(document.settings?.page)
    : DEFAULT_PAGE_SIZE;
}

export function hasPageOverflow(scrollHeight: number, pageHeightPx = DEFAULT_PAGE_SIZE.heightPx): boolean {
  return scrollHeight > pageHeightPx + 1;
}
