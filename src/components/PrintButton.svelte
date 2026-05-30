<script lang="ts">
  import { Printer } from '@lucide/svelte';

  export let disabled = false;

  function printResume(): void {
    window.print();
  }
</script>

<button class="adc-btn adc-btn--secondary" type="button" onclick={printResume} {disabled}>
  <Printer size={16} strokeWidth={2} aria-hidden="true" />
  <span>Export PDF</span>
</button>
