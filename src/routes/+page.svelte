<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '$components/Layout.svelte';
  import { initializeResume, resumeStore, updateYaml } from '$lib/store/resumeStore';

  onMount(() => {
    void initializeResume();
  });

  $: documentTitle = "ADCV Builder";
  $: documentDescription = "Custom resume builder for ADC";
</script>

<svelte:head>
  <title>{documentTitle}</title>
  <meta name="description" content={documentDescription} />
  <meta name="author" content={$resumeStore.resume.profile.name} />
</svelte:head>

<Layout state={$resumeStore} onYamlChange={updateYaml} />
