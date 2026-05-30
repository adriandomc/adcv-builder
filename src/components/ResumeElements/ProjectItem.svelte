<script lang="ts">
  import type { ProjectItem } from '$lib/effect/ResumeSchema';
  import { Link } from '@lucide/svelte';

  export let item: ProjectItem;

  $: stack = item.stack ?? [];
</script>

<article class="resume-item">
  <div class="resume-item__head">
    <div>
      <h3 class="resume-item__title">{item.name}</h3>
      <p class="resume-item__sub">{item.description}</p>
      {#if stack.length}
        <div class="project-stack" aria-label={`${item.name} stack`}>
          {#each stack as tool}
            <span class="adc-pill">{tool}</span>
          {/each}
        </div>
      {/if}
    </div>
    {#if item.url}
      <a class="resume-item__meta" href={item.url} target="_blank" rel="noreferrer" title="Link"><Link size={16} strokeWidth={2} aria-hidden="true"/></a>
    {/if}
  </div>

  {#if item.bullets.length}
    <ul class="resume-bullets">
      {#each item.bullets as bullet}
        <li>{bullet}</li>
      {/each}
    </ul>
  {/if}
</article>
