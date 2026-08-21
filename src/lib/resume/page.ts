export const PAGE_WIDTH_PX = 912; // 9.5in at 96dpi
export const PAGE_HEIGHT_PX = 1056; // 11in at 96dpi

export function hasPageOverflow(scrollHeight: number): boolean {
  return scrollHeight > PAGE_HEIGHT_PX + 1;
}
