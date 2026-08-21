<script lang="ts">
  import type { ShortResume } from '$lib/effect/ResumeSchema';
  import Header from './ResumeElements/Header.svelte';
  import PagePreview from './PagePreview.svelte';

  export let shortResume: ShortResume;
</script>

<PagePreview label={`${shortResume.profile.name} short resume`}>
  <Header profile={shortResume.profile} />
  <main class="short-resume-body">
    <p>{shortResume.body}</p>
  </main>
</PagePreview>

<style>
  .short-resume-body {
    padding-top: 0.1in;
  }

  .short-resume-body p {
    width: 100%;
    margin: 0;
    font-size: 10pt;
    line-height: 1.55;
    white-space: pre-wrap;
  }
</style>
