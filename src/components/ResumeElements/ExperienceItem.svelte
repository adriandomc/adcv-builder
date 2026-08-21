<script lang="ts">
  import type { ExperienceItem } from '$lib/effect/ResumeSchema';

  export let item: ExperienceItem;

  $: bullets = item.bullets ?? [];
</script>

<article class="resume-item">
  <div class="resume-item__head">
    <div>
      <h3 class="resume-item__title">{item.role}</h3>
      <p class="resume-item__sub">{item.company} · {item.location}</p>
    </div>
    <p class="resume-item__meta">{item.period}</p>
  </div>

  {#if item.description}
    <p class="resume-description">{item.description}</p>
  {/if}

  {#if bullets.length}
    <ul class="resume-bullets">
      {#each bullets as bullet}
        <li>{bullet}</li>
      {/each}
    </ul>
  {/if}
</article>
