<script lang="ts">
  import { switchDocumentType, type ResumeState } from '$lib/store/resumeStore';
  import ErrorConsole from './ErrorConsole.svelte';
  import PrintButton from './PrintButton.svelte';
  import ResumePreview from './ResumePreview.svelte';
  import CoverLetterPreview from './CoverLetterPreview.svelte';
  import SaveStatus from './SaveStatus.svelte';
  import YamlEditor from './YamlEditor.svelte';
  import { FileText, Mail } from '@lucide/svelte';

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
  let mobileView: 'editor' | 'preview' = 'preview';

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

    <div class="adc-tabs document-selector">
      <button 
        class="adc-tab {state.documentType === 'resume' ? 'is-active' : ''}" 
        on:click={() => switchDocumentType('resume')}
      >
        <FileText size={16} strokeWidth={2} aria-hidden="true" />
        <span>Resume</span>
      </button>
      <button 
        class="adc-tab {state.documentType === 'cover-letter' ? 'is-active' : ''}" 
        on:click={() => switchDocumentType('cover-letter')}
      >
        <Mail size={16} strokeWidth={2} aria-hidden="true" />
        <span>Cover Letter</span>
      </button>
    </div>

    <div class="app-actions">
      <SaveStatus state={state.saveState} updatedAt={state.updatedAt} />
      <PrintButton disabled={state.saveState === 'loading'} />
    </div>
  </header>

  <div class="adc-tabs mobile-view-switch" role="tablist" aria-label="Editor or preview">
    <button
      class="adc-tab {mobileView === 'editor' ? 'is-active' : ''}"
      role="tab"
      aria-selected={mobileView === 'editor'}
      on:click={() => (mobileView = 'editor')}
    >
      <span>Editor</span>
    </button>
    <button
      class="adc-tab {mobileView === 'preview' ? 'is-active' : ''}"
      role="tab"
      aria-selected={mobileView === 'preview'}
      on:click={() => (mobileView = 'preview')}
    >
      <span>Preview</span>
    </button>
  </div>

  <main
    class="workspace"
    class:workspace--dragging={dragging}
    bind:this={workspaceEl}
    style="--editor-pct: {editorPct}%;"
  >
    <section
      class="editor-pane"
      class:is-hidden-mobile={mobileView !== 'editor'}
      aria-label="YAML editor"
    >
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

    <section
      class="preview-pane"
      class:is-hidden-mobile={mobileView !== 'preview'}
      aria-label="Document preview"
    >
      <div class="pane-header">
        <h2 class="pane-title">Preview</h2>
      </div>

      {#if state.document.document === 'cover-letter'}
        <CoverLetterPreview coverLetter={state.document} />
      {:else}
        <ResumePreview resume={state.document} />
      {/if}
    </section>
  </main>

  <ErrorConsole items={consoleItems} />
</div>
