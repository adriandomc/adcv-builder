<script lang="ts">
  import type { SkillGroup } from '$lib/effect/ResumeSchema';

  export let group: SkillGroup;

  $: isFlatGroup = group.name.trim().toLowerCase() === 'core';
</script>

<div class={`skill-group${isFlatGroup ? ' skill-group--flat' : ''}`}>
  {#if !isFlatGroup}
    <h3 class="skill-group__name">{group.name}</h3>
  {/if}
  <div class="skill-group__items">
    {#each group.items as item}
      <span class="adc-pill skill-pill">{item}</span>
    {/each}
  </div>
</div>
