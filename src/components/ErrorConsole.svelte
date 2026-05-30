<script lang="ts">
  import { CheckCircle2, ChevronDown, ChevronUp, CircleAlert } from '@lucide/svelte';

  interface ConsoleItem {
    source: string;
    message: string;
    tone: 'error' | 'warn';
  }

  export let items: ConsoleItem[] = [];

  let isExpanded = false;

  $: count = items.length;
  $: hasErrors = count > 0;
  $: summary = hasErrors ? `${count} ${count === 1 ? 'issue' : 'issues'}` : 'No errors';

  function toggle(): void {
    isExpanded = !isExpanded;
  }
</script>

<section class={`app-error-console${hasErrors ? ' app-error-console--active' : ' app-error-console--ok'}`} aria-label="Error console">
  <button
    class="app-error-console__toggle"
    type="button"
    aria-expanded={isExpanded}
    aria-controls="app-error-console-panel"
    onclick={toggle}
  >
    {#if hasErrors}
      <CircleAlert size={16} strokeWidth={2} aria-hidden="true" />
    {:else}
      <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
    {/if}
    <span class="app-error-console__title">Console</span>
    <span class="app-error-console__summary">{summary}</span>
    {#if isExpanded}
      <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
    {:else}
      <ChevronUp size={16} strokeWidth={2} aria-hidden="true" />
    {/if}
  </button>

  {#if isExpanded}
    <div id="app-error-console-panel" class="app-error-console__panel" aria-live="polite">
      {#if hasErrors}
        <ul class="app-error-console__list">
          {#each items as item}
            <li class={`app-error-console__item app-error-console__item--${item.tone}`}>
              <div class="app-error-console__item-head">
                <span class="app-error-console__badge">{item.source}</span>
                <span class="app-error-console__tone">{item.tone}</span>
              </div>
              <pre class="app-error-console__message">{item.message}</pre>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="app-error-console__empty">No errors have been detected in the editor.</p>
      {/if}
    </div>
  {/if}
</section>
