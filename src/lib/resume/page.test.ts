import { describe, expect, it } from 'vitest';
import { hasPageOverflow, PAGE_HEIGHT_PX } from './page';

describe('page preview', () => {
  it('detects content that will continue onto another PDF page', () => {
    expect(hasPageOverflow(PAGE_HEIGHT_PX)).toBe(false);
    expect(hasPageOverflow(PAGE_HEIGHT_PX + 2)).toBe(true);
  });
});
