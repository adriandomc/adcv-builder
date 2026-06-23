<script lang="ts">
  import type { CoverLetter } from '$lib/effect/ResumeSchema';
  import Header from './ResumeElements/Header.svelte';

  export let coverLetter: CoverLetter;

  // 8.5in × 11in at 96 dpi
  const PAGE_W = 816;
  const PAGE_H = 1056;
  const FRAME_PAD = 32; // matches --adc-space-7 (24px) × 2 sides + breathing room
  const FRAME_PAD_MOBILE = 12; // matches .resume-frame padding below 700px

  let frameWidth = 0;
  let docHeight = PAGE_H;

  // Below 700px the frame padding shrinks (see _resume.scss) so the scaled
  // miniature can use more of the narrow viewport width.
  $: pad = frameWidth > 0 && frameWidth < 700 ? FRAME_PAD_MOBILE : FRAME_PAD;
  $: scale = frameWidth > 0
    ? Math.min(1, (frameWidth - pad * 2) / PAGE_W)
    : 1;
  $: viewportW = Math.round(PAGE_W * scale);
  $: viewportH = Math.round(docHeight * scale);
</script>

<div class="resume-frame" bind:clientWidth={frameWidth}>
  <div
    class="resume-scale-container"
    style="width: {viewportW}px; height: {viewportH}px;"
  >
    <article
      class="resume-document"
      aria-label={`${coverLetter.profile.name} cover letter`}
      style="transform: scale({scale}); transform-origin: top left;"
      bind:clientHeight={docHeight}
    >
    <Header profile={coverLetter.profile} />

    <div class="cover-letter-content">
      {#if coverLetter.date}
        <p class="cl-date">{coverLetter.date}</p>
      {/if}

      <div class="cl-recipient">
        {#if coverLetter.recipient.hiringManager}
          <p>{coverLetter.recipient.hiringManager}</p>
        {/if}
        <p><strong>{coverLetter.recipient.company}</strong></p>
        {#if coverLetter.recipient.address}
          <p style="white-space: pre-wrap;">{coverLetter.recipient.address}</p>
        {/if}
      </div>

      <p class="cl-greeting">{coverLetter.greeting}</p>

      <div class="cl-body">
        {#each coverLetter.body as paragraph}
          <p>{paragraph}</p>
        {/each}
      </div>

      <div class="cl-closing">
        <p>{coverLetter.closing}</p>
        <p class="cl-signature">{coverLetter.profile.name}</p>
      </div>
    </div>
    </article>
  </div>
</div>

<style>
  .cover-letter-content {
    padding: var(--adc-space-6) 0;
    display: flex;
    flex-direction: column;
    gap: var(--adc-space-5);
    font-size: var(--adc-fs-sm);
    line-height: 1.6;
    color: var(--adc-text);
  }

  .cl-date {
    margin-bottom: var(--adc-space-4);
  }

  .cl-recipient {
    margin-bottom: var(--adc-space-4);
  }

  .cl-recipient p {
    margin: 0;
  }

  .cl-greeting {
    margin-top: var(--adc-space-2);
  }

  .cl-body {
    display: flex;
    flex-direction: column;
    gap: var(--adc-space-4);
    text-align: justify;
  }

  .cl-body p {
    margin: 0;
  }

  .cl-closing {
    margin-top: var(--adc-space-6);
  }

  .cl-closing p {
    margin: 0;
  }

  .cl-signature {
    margin-top: var(--adc-space-4);
    font-weight: 600;
  }

  @media print {
    .cover-letter-content {
      padding: 0.1in 0;
      gap: 0.1in;
      font-size: 9.5pt;
      line-height: 1.42;
    }

    .cl-date,
    .cl-recipient {
      margin-bottom: 0.06in;
    }

    /* Keep the recipient block and the whole sign-off (closing + name)
       from splitting across pages — prevents an orphaned signature. */
    .cl-recipient,
    .cl-closing {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .cl-greeting {
      margin-top: 0.03in;
    }

    .cl-body {
      gap: 0.085in;
    }

    .cl-body p {
      orphans: 2;
      widows: 2;
    }

    .cl-closing {
      margin-top: 0.14in;
    }
  }
</style>
