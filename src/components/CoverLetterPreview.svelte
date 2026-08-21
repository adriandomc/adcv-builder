<script lang="ts">
  import type { CoverLetter } from '$lib/effect/ResumeSchema';
  import Header from './ResumeElements/Header.svelte';
  import PagePreview from './PagePreview.svelte';

  export let coverLetter: CoverLetter;
</script>

<PagePreview label={`${coverLetter.profile.name} cover letter`}>
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
</PagePreview>

<style>
  .cover-letter-content {
    padding: 0.1in 0;
    display: flex;
    flex-direction: column;
    gap: 0.1in;
    font-size: 9.5pt;
    line-height: 1.42;
    color: var(--adc-text);
  }

  .cl-date {
    margin-bottom: 0.06in;
  }

  .cl-recipient {
    margin-bottom: 0.06in;
  }

  .cl-recipient p {
    margin: 0;
  }

  .cl-greeting {
    margin-top: 0.03in;
  }

  .cl-body {
    display: flex;
    flex-direction: column;
    gap: 0.085in;
    text-align: justify;
  }

  .cl-body p {
    margin: 0;
  }

  .cl-closing {
    margin-top: 0.14in;
  }

  .cl-closing p {
    margin: 0;
  }

  .cl-signature {
    margin-top: var(--adc-space-4);
    font-weight: 600;
  }

  @media print {
    /* Keep the recipient block and the whole sign-off (closing + name)
       from splitting across pages — prevents an orphaned signature. */
    .cl-recipient,
    .cl-closing {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .cl-body p {
      orphans: 2;
      widows: 2;
    }
  }
</style>
