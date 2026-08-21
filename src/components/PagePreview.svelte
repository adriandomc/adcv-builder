<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { hasPageOverflow, PAGE_HEIGHT_PX, PAGE_WIDTH_PX } from '$lib/resume/page';

  export let label: string;
  export let fontSize = 9.5;

  const FRAME_PAD = 32;
  const FRAME_PAD_MOBILE = 12;

  let frameEl: HTMLElement;
  let frameWidth = 0;
  let documentEl: HTMLElement;
  let overflows = false;
  let measureFrame = 0;
  let resizeFrame = 0;

  $: pad = frameWidth > 0 && frameWidth < 700 ? FRAME_PAD_MOBILE : FRAME_PAD;
  $: scale = frameWidth > 0 ? Math.min(1, (frameWidth - pad * 2) / PAGE_WIDTH_PX) : 1;
  $: viewportW = Math.round(PAGE_WIDTH_PX * scale);
  $: viewportH = Math.round(PAGE_HEIGHT_PX * scale);

  afterUpdate(() => {
    cancelAnimationFrame(measureFrame);
    measureFrame = requestAnimationFrame(() => {
      const next = hasPageOverflow(documentEl.scrollHeight);
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
  style="--resume-page-width: {PAGE_WIDTH_PX}px;"
  bind:this={frameEl}
>
  <div class="resume-scale-container" style="width: {viewportW}px; height: {viewportH}px;">
    <article
      class="resume-document"
      aria-label={label}
      style="--resume-page-width: {PAGE_WIDTH_PX}px; --resume-page-height: {PAGE_HEIGHT_PX}px; font-size: {fontSize}pt; transform: scale({scale}); transform-origin: top left;"
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
