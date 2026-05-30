<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { EditorState } from '@codemirror/state';
  import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
  import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
  import { bracketMatching, foldGutter, foldKeymap, HighlightStyle, indentOnInput, syntaxHighlighting } from '@codemirror/language';
  import { yaml } from '@codemirror/lang-yaml';
  import { lintKeymap } from '@codemirror/lint';
  import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
  import {
    crosshairCursor,
    drawSelection,
    dropCursor,
    EditorView,
    highlightActiveLine,
    highlightActiveLineGutter,
    keymap,
    lineNumbers,
    rectangularSelection
  } from '@codemirror/view';
  import { tags } from '@lezer/highlight';

  export let value: string;
  export let onChange: (value: string) => void;

  let editorHost: HTMLDivElement;
  let view: EditorView | null = null;
  let isSyncingFromProp = false;

  const adcYamlTheme = EditorView.theme(
    {
      '&': {
        backgroundColor: 'var(--adc-accent-1)',
        color: '#f4f9e1',
        height: '100%'
      },
      '.cm-scroller': {
        fontFamily: 'var(--adc-font-mono)',
        fontSize: '13px',
        lineHeight: '1.6'
      },
      '.cm-content': {
        caretColor: 'var(--adc-secondary)',
        padding: '20px'
      },
      '.cm-line': {
        padding: '0 2px'
      },
      '.cm-gutters': {
        backgroundColor: 'rgba(156, 198, 155, 0.88)',
        borderRight: '1px solid rgba(243, 250, 223, 0.24)',
        color: 'var(--adc-text)'
      },
      '.cm-lineNumbers .cm-gutterElement': {
        minWidth: '2.6rem',
        padding: '0 10px 0 8px'
      },
      '.cm-activeLine': {
        backgroundColor: 'rgba(37, 50, 7, 0.28)'
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'rgba(189, 228, 168, 0.64)',
        color: 'var(--adc-text)'
      },
      '&.cm-focused .cm-cursor': {
        borderLeftColor: 'var(--adc-secondary)'
      },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
        backgroundColor: 'rgba(121, 180, 169, 0.36)'
      },
      '.cm-foldPlaceholder': {
        backgroundColor: 'var(--adc-accent-1)',
        border: '1px solid var(--adc-accent-2)',
        color: 'var(--adc-white)'
      }
    },
    { dark: true }
  );

  const adcYamlHighlight = HighlightStyle.define([
    {
      tag: [tags.comment, tags.quote],
      color: '#9cc69b',
      fontStyle: 'italic'
    },
    {
      tag: [tags.keyword, tags.atom, tags.bool, tags.null, tags.standard(tags.tagName)],
      color: '#dbc665'
    },
    {
      tag: [tags.string, tags.regexp, tags.special(tags.string)],
      color: '#bde4a8'
    },
    {
      tag: [tags.heading, tags.name, tags.tagName, tags.labelName],
      color: '#79b4a9'
    },
    {
      tag: [tags.propertyName, tags.attributeName, tags.definition(tags.propertyName)],
      color: '#d7f2ba'
    },
    {
      tag: [tags.number, tags.integer, tags.float, tags.literal, tags.character],
      color: '#f2d36b'
    },
    {
      tag: [tags.punctuation, tags.separator, tags.derefOperator],
      color: '#f4f9e1'
    },
    {
      tag: [tags.operator, tags.definitionOperator],
      color: '#79b4a9'
    }
  ]);

  const updateListener = EditorView.updateListener.of((update) => {
    if (!update.docChanged || isSyncingFromProp) {
      return;
    }

    onChange(update.state.doc.toString());
  });

  const editorSetup = [
    lineNumbers(),
    highlightActiveLineGutter(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      indentWithTab,
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap
    ])
  ];

  onMount(() => {
    view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          editorSetup,
          yaml(),
          EditorView.lineWrapping,
          adcYamlTheme,
          syntaxHighlighting(adcYamlHighlight),
          updateListener
        ]
      }),
      parent: editorHost
    });
  });

  $: if (view && value !== view.state.doc.toString()) {
    isSyncingFromProp = true;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: value
      }
    });
    isSyncingFromProp = false;
  }

  onDestroy(() => {
    view?.destroy();
  });
</script>

<div class="yaml-editor">
  <div bind:this={editorHost} class="yaml-editor__codemirror" aria-label="Resume YAML"></div>
</div>
