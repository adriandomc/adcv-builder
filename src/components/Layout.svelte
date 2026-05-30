<script lang="ts">
  import type { ResumeState } from '$lib/store/resumeStore';
  import ErrorConsole from './ErrorConsole.svelte';
  import PrintButton from './PrintButton.svelte';
  import ResumePreview from './ResumePreview.svelte';
  import SaveStatus from './SaveStatus.svelte';
  import YamlEditor from './YamlEditor.svelte';

  type ConsoleItem = {
    source: string;
    message: string;
    tone: 'error' | 'warn';
  };

  export let state: ResumeState;
  export let onYamlChange: (value: string) => void;

  $: consoleItems = [
    state.parseError ? { source: 'YAML', message: state.parseError, tone: 'error' } : null,
    state.saveError ? { source: 'Save', message: state.saveError, tone: 'error' } : null,
    state.loadError ? { source: 'Load', message: state.loadError, tone: 'warn' } : null
  ].filter((item): item is ConsoleItem => item !== null);

  let workspaceEl: HTMLElement;
  let editorPct = 43;
  let dragging = false;

  function startDrag(e: MouseEvent) {
    dragging = true;
    e.preventDefault();
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging || !workspaceEl) return;
    const rect = workspaceEl.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    editorPct = Math.min(75, Math.max(20, pct));
  }

  function onMouseUp() {
    dragging = false;
  }
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<div class="app-shell">
  <header class="app-header">
    <div class="app-title">
      <h1>ADCV Builder</h1>
    </div>

    <div class="app-actions">
      <SaveStatus state={state.saveState} updatedAt={state.updatedAt} />
      <PrintButton disabled={state.saveState === 'loading'} />
    </div>
  </header>

  <main
    class="workspace"
    class:workspace--dragging={dragging}
    bind:this={workspaceEl}
    style="grid-template-columns: {editorPct}% 6px 1fr;"
  >
    <section class="editor-pane" aria-label="YAML editor">
      <div class="pane-header">
        <h2 class="pane-title">YAML</h2>
      </div>

      <YamlEditor value={state.yaml} onChange={onYamlChange} />
    </section>

    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
      class="workspace-divider"
      role="separator"
      aria-label="Resize panels"
      on:mousedown={startDrag}
    ></div>

    <section class="preview-pane" aria-label="Resume preview">
      <div class="pane-header">
        <h2 class="pane-title">Preview</h2>
      </div>

      <ResumePreview resume={state.resume} />
    </section>
  </main>

  <ErrorConsole items={consoleItems} />
</div>
