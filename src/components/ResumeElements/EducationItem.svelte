<script lang="ts">
  import type { EducationItem } from '$lib/effect/ResumeSchema';

  export let item: EducationItem;
</script>

<article class="resume-item">
  <div class="resume-item__head">
    <div>
      <h3 class="resume-item__title">{item.school}</h3>
      <p class="resume-item__sub">{item.degree}</p>
    </div>
    <p class="resume-item__meta">{item.period}</p>
  </div>
</article>
