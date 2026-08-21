<script lang="ts">
  import type { PageData } from './$types';
  import ResumePreview from '$components/ResumePreview.svelte';
  import CoverLetterPreview from '$components/CoverLetterPreview.svelte';
  import ShortResumePreview from '$components/ShortResumePreview.svelte';

  export let data: PageData;

  $: doc = data.document;
  $: kind = doc.document === 'cover-letter'
    ? 'Cover Letter'
    : doc.document === 'short-resume' ? 'Short Resume' : 'Resume';
  $: name = doc.profile?.name?.trim();
  // Drives the exported PDF's /Title metadata. Mirrors src/routes/+page.svelte.
  $: title = name ? `${name} — ${kind}` : 'ADCV Builder';
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#if doc.document === 'cover-letter'}
  <CoverLetterPreview coverLetter={doc} />
{:else if doc.document === 'short-resume'}
  <ShortResumePreview shortResume={doc} />
{:else}
  <ResumePreview resume={doc} />
{/if}
