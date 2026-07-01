<script lang="ts">
  import type { PageData } from './$types';
  import ResumePreview from '$components/ResumePreview.svelte';
  import CoverLetterPreview from '$components/CoverLetterPreview.svelte';

  export let data: PageData;

  $: doc = data.document;
  $: kind = doc.document === 'cover-letter' ? 'Cover Letter' : 'Resume';
  $: name = doc.profile?.name?.trim();
  // Drives the exported PDF's /Title metadata. Mirrors src/routes/+page.svelte.
  $: title = name ? `${name} — ${kind}` : 'ADCV Builder';
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#if doc.document === 'cover-letter'}
  <CoverLetterPreview coverLetter={doc} />
{:else}
  <ResumePreview resume={doc} />
{/if}
