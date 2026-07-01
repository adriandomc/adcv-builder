<script lang="ts">
  import { get } from 'svelte/store';
  import { Printer } from '@lucide/svelte';
  import { resumeStore } from '$lib/store/resumeStore';

  export let disabled = false;

  let busy = false;

  async function exportPdf(): Promise<void> {
    busy = true;
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yaml: get(resumeStore).yaml })
      });
      // A parse error is already surfaced in the ErrorConsole; nothing to add here.
      if (!res.ok) return;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filenameFrom(res) ?? 'document.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      busy = false;
    }
  }

  function filenameFrom(res: Response): string | null {
    const match = res.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/);
    return match ? match[1] : null;
  }
</script>

<button
  class="adc-btn adc-btn--secondary"
  type="button"
  onclick={exportPdf}
  disabled={busy || disabled}
>
  <Printer size={16} strokeWidth={2} aria-hidden="true" />
  <span>{busy ? 'Exporting…' : 'Export PDF'}</span>
</button>
