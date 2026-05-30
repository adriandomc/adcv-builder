<script lang="ts">
  import type { SaveState } from '$lib/store/resumeStore';

  export let state: SaveState;
  export let updatedAt: string | null = null;

  $: label = getLabel(state, updatedAt);
  $: tone = state === 'error' ? 'error' : state === 'dirty' || state === 'saving' ? 'saving' : 'saved';

  function getLabel(saveState: SaveState, savedAt: string | null): string {
    if (saveState === 'loading') {
      return 'Loading';
    }

    if (saveState === 'dirty') {
      return 'Unsaved';
    }

    if (saveState === 'saving') {
      return 'Saving';
    }

    if (saveState === 'error') {
      return 'Save error';
    }

    if (savedAt) {
      return `Saved ${new Date(savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return 'Ready';
  }
</script>

<span class={`adc-status adc-status--${tone}`} aria-live="polite">
  <span class="adc-status__dot"></span>
  <span>{label}</span>
</span>
