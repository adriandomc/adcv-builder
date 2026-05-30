<script lang="ts">
  import type { Resume } from '$lib/effect/ResumeSchema';
  import EducationItem from './ResumeElements/EducationItem.svelte';
  import ExperienceItem from './ResumeElements/ExperienceItem.svelte';
  import Header from './ResumeElements/Header.svelte';
  import ProjectItem from './ResumeElements/ProjectItem.svelte';
  import ResumeSection from './ResumeElements/ResumeSection.svelte';
  import SkillsGroup from './ResumeElements/SkillsGroup.svelte';

  export let resume: Resume;

  // 8.5in × 11in at 96 dpi
  const PAGE_W = 816;
  const PAGE_H = 1056;
  const FRAME_PAD = 32; // matches --adc-space-7 (24px) × 2 sides + breathing room

  let frameWidth = 0;
  let docHeight = PAGE_H;

  $: scale = frameWidth > 0
    ? Math.min(1, (frameWidth - FRAME_PAD * 2) / PAGE_W)
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
      aria-label={`${resume.profile.name} resume`}
      style="transform: scale({scale}); transform-origin: top left;"
      bind:clientHeight={docHeight}
    >
    <Header profile={resume.profile} />

    <ResumeSection title="Summary">
      <p class="resume-summary">{resume.summary}</p>
    </ResumeSection>

    <ResumeSection title="Skills">
      <div class="skills-grid">
        {#each resume.skills as group}
          <SkillsGroup {group} />
        {/each}
      </div>
    </ResumeSection>

    <ResumeSection title="Experience">
      <div class="resume-list">
        {#each resume.experience as item}
          <ExperienceItem {item} />
        {/each}
      </div>
    </ResumeSection>

    <ResumeSection title="Projects">
      <div class="resume-list">
        {#each resume.projects as item}
          <ProjectItem {item} />
        {/each}
      </div>
    </ResumeSection>

    <ResumeSection title="Education">
      <div class="resume-list">
        {#each resume.education as item}
          <EducationItem {item} />
        {/each}
      </div>
    </ResumeSection>
    </article>
  </div>
</div>
