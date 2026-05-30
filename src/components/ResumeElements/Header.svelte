<script lang="ts">
  import type { ResumeLink, ResumeProfile } from '$lib/effect/ResumeSchema';

  export let profile: ResumeProfile;

  $: websiteLinks = getWebsiteLinks(profile.website);

  function getWebsiteLinks(website: ResumeProfile['website']): ResumeLink[] {
    if (Array.isArray(website)) {
      return website;
    }

    return website ? [{ label: website, url: website }] : [];
  }
</script>

<header class="resume-header">
  <div class="resume-header__main">
    <h1 class="resume-name">{profile.name}</h1>
    <p class="resume-title">{profile.title}</p>
  </div>

  <div class="resume-contact">
    {#if profile.location}
      <span class="adc-pill">{profile.location}</span>
    {/if}
    {#if profile.email}
      <a class="adc-pill" href={`mailto:${profile.email}`}>{profile.email}</a>
    {/if}
    {#each websiteLinks as website}
      <a class="adc-pill" href={website.url} target="_blank" rel="noreferrer">{website.label}</a>
    {/each}
    {#each profile.links as link}
      <a class="adc-pill" href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
    {/each}
  </div>
</header>
