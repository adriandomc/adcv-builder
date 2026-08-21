import { describe, expect, it } from 'vitest';
import { DEFAULT_PAGE_SIZE, hasPageOverflow, resolvePageSize } from './page';

describe('page preview', () => {
  it('detects content that will continue onto another PDF page', () => {
    expect(hasPageOverflow(DEFAULT_PAGE_SIZE.heightPx)).toBe(false);
    expect(hasPageOverflow(DEFAULT_PAGE_SIZE.heightPx + 2)).toBe(true);
  });

  it('resolves preset and custom page dimensions', () => {
    expect(resolvePageSize({ format: 'letter' })).toMatchObject({ widthIn: 8.5, heightIn: 11 });
    expect(resolvePageSize({ format: 'a4' }).widthIn).toBeCloseTo(8.27, 2);
    expect(resolvePageSize({ width: 210, height: 297, unit: 'mm' }).heightIn).toBeCloseTo(11.69, 2);
  });
});
