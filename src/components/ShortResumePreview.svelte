<script lang="ts">
  import type { ShortResume } from '$lib/effect/ResumeSchema';
  import Header from './ResumeElements/Header.svelte';

  export let shortResume: ShortResume;

  const PAGE_W = 816;
  const PAGE_H = 1056;
  const FRAME_PAD = 32;
  const FRAME_PAD_MOBILE = 12;

  let frameWidth = 0;
  let docHeight = PAGE_H;

  $: pad = frameWidth > 0 && frameWidth < 700 ? FRAME_PAD_MOBILE : FRAME_PAD;
  $: scale = frameWidth > 0 ? Math.min(1, (frameWidth - pad * 2) / PAGE_W) : 1;
  $: viewportW = Math.round(PAGE_W * scale);
  $: viewportH = Math.round(docHeight * scale);
</script>

<div class="resume-frame" bind:clientWidth={frameWidth}>
  <div class="resume-scale-container" style="width: {viewportW}px; height: {viewportH}px;">
    <article
      class="resume-document short-resume-document"
      aria-label={`${shortResume.profile.name} short resume`}
      style="transform: scale({scale}); transform-origin: top left;"
      bind:clientHeight={docHeight}
    >
      <Header profile={shortResume.profile} />
      <main class="short-resume-body">
        <p>{shortResume.body}</p>
      </main>
    </article>
  </div>
</div>

<style>
  .short-resume-document {
    display: flex;
    flex-direction: column;
  }

  .short-resume-body {
    display: grid;
    flex: 1;
    place-items: center;
    padding: var(--adc-space-7) 0;
  }

  .short-resume-body p {
    width: 100%;
    margin: 0;
    font-size: var(--adc-fs-md);
    line-height: 1.7;
    white-space: pre-wrap;
  }

  @media print {
    .short-resume-body {
      padding: 0.25in 0;
    }

    .short-resume-body p {
      font-size: 10pt;
      line-height: 1.55;
    }
  }
</style>
