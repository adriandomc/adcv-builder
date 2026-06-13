<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '$components/Layout.svelte';
  import { initializeResume, resumeStore, updateYaml } from '$lib/store/resumeStore';

  onMount(() => {
    void initializeResume();
  });

  $: activeDocument = $resumeStore.document;
  $: documentKind = activeDocument.document === 'cover-letter' ? 'Cover Letter' : 'Resume';
  $: personName = activeDocument.profile?.name?.trim();
  // Drives the browser tab AND the exported PDF's /Title metadata (what a
  // screen reader announces and what an ATS reads as the document title).
  $: documentTitle = personName ? `${personName} — ${documentKind}` : 'ADCV Builder';
  $: documentDescription = personName
    ? `${documentKind} of ${personName}`
    : 'Custom resume builder for ADC';
</script>

<svelte:head>
  <title>{documentTitle}</title>
  <meta name="description" content={documentDescription} />
  <meta name="author" content={$resumeStore.document.profile.name} />
</svelte:head>

<Layout state={$resumeStore} onYamlChange={updateYaml} />
