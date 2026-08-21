<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { DEFAULT_PAGE_SIZE, hasPageOverflow } from '$lib/resume/page';

  export let label: string;
  export let fontSize = 9.5;
  export let pageWidth = DEFAULT_PAGE_SIZE.widthPx;
  export let pageHeight = DEFAULT_PAGE_SIZE.heightPx;

  const FRAME_PAD = 32;
  const FRAME_PAD_MOBILE = 12;

  let frameEl: HTMLElement;
  let frameWidth = 0;
  let documentEl: HTMLElement;
  let overflows = false;
  let measureFrame = 0;
  let resizeFrame = 0;

  $: pad = frameWidth > 0 && frameWidth < 700 ? FRAME_PAD_MOBILE : FRAME_PAD;
  $: scale = frameWidth > 0 ? Math.min(1, (frameWidth - pad * 2) / pageWidth) : 1;
  $: viewportW = Math.round(pageWidth * scale);
  $: viewportH = Math.round(pageHeight * scale);

  afterUpdate(() => {
    cancelAnimationFrame(measureFrame);
    measureFrame = requestAnimationFrame(() => {
      const next = hasPageOverflow(documentEl.scrollHeight, pageHeight);
      if (next !== overflows) overflows = next;
    });
  });

  onMount(() => {
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        frameWidth = frameEl.clientWidth;
      });
    });
    observer.observe(frameEl);
    frameWidth = frameEl.clientWidth;

    return () => {
      observer.disconnect();
      cancelAnimationFrame(measureFrame);
      cancelAnimationFrame(resizeFrame);
    };
  });
</script>

<div
  class="resume-frame"
  style="--resume-page-width: {pageWidth}px;"
  bind:this={frameEl}
>
  <div class="resume-scale-container" style="width: {viewportW}px; height: {viewportH}px;">
    <article
      class="resume-document"
      aria-label={label}
      style="--resume-page-width: {pageWidth}px; --resume-page-height: {pageHeight}px; font-size: {fontSize}pt; transform: scale({scale}); transform-origin: top left;"
      bind:this={documentEl}
    >
      <slot />
    </article>
  </div>

  {#if overflows}
    <p class="page-overflow-warning" role="status">
      This content continues onto another PDF page.
    </p>
  {/if}
</div>

<style>
  .page-overflow-warning {
    max-width: var(--resume-page-width);
    margin: var(--adc-space-3) auto 0;
    color: var(--adc-text);
    font-size: var(--adc-fs-xs);
    font-weight: var(--adc-fw-bold);
    text-align: center;
  }

  @media print {
    .page-overflow-warning {
      display: none;
    }
  }
</style>
