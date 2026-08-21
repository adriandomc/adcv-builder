<script lang="ts">
  import type { Resume } from '$lib/effect/ResumeSchema';
  import EducationItem from './ResumeElements/EducationItem.svelte';
  import ExperienceItem from './ResumeElements/ExperienceItem.svelte';
  import Header from './ResumeElements/Header.svelte';
  import ProjectItem from './ResumeElements/ProjectItem.svelte';
  import ResumeSection from './ResumeElements/ResumeSection.svelte';
  import SkillsGroup from './ResumeElements/SkillsGroup.svelte';
  import PagePreview from './PagePreview.svelte';

  export let resume: Resume;
</script>

<PagePreview label={`${resume.profile.name} resume`}>
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
</PagePreview>
