import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type SerializedEditorState,
  type TextNode,
} from 'lexical'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { $isLinkNode, AutoLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $findMatchingParent } from '@lexical/utils'
import { LexicalComposer, type InitialConfigType } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { searchEntities, type Entity } from '../../shared/entities'
import { SourcePicker } from '../../shared/SourcePicker'
import { StackLayout } from '../../shared/StackLayout'
import { ToolbarButton } from '../../shared/ToolbarButton'
import { promptUrl, safeLinkUrl } from '../../shared/url'
import { LexicalRenderer } from './LexicalRenderer'
import { $createCitationNode, $createImageNode, $createMentionNode, CitationNode, ImageNode, MentionNode } from './nodes'
import { $buildSeed } from './seed'

const initialConfig: InitialConfigType = {
  namespace: 'lexical-stack',
  nodes: [HeadingNode, QuoteNode, LinkNode, AutoLinkNode, MentionNode, CitationNode, ImageNode],
  editorState: $buildSeed,
  theme: {
    quote: 'lx-quote',
    text: { bold: 'lx-bold', italic: 'lx-italic', underline: 'lx-underline', highlight: 'lx-highlight' },
    link: 'lx-link',
    paragraph: 'lx-p',
  },
  onError: (error) => {
    throw error
  },
}

// ---- Toolbar ----

function Toolbar() {
  const [editor] = useLexicalComposerContext()
  const [active, setActive] = useState({ bold: false, italic: false, highlight: false, link: false })

  useEffect(
    () =>
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const sel = $getSelection()
          if (!$isRangeSelection(sel)) return
          const node = sel.anchor.getNode()
          setActive({
            bold: sel.hasFormat('bold'),
            italic: sel.hasFormat('italic'),
            highlight: sel.hasFormat('highlight'),
            link: $isLinkNode(node) || $findMatchingParent(node, $isLinkNode) !== null,
          })
        })
      }),
    [editor],
  )

  return (
    <div className="toolbar">
      <ToolbarButton label="Bold" active={active.bold} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
        <b>B</b>
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={active.italic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
      >
        <i>I</i>
      </ToolbarButton>
      <ToolbarButton
        label="Highlight"
        active={active.highlight}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')}
      >
        <mark>H</mark>
      </ToolbarButton>
      <ToolbarButton
        label="Link"
        active={active.link}
        onClick={() => {
          if (active.link) return void editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
          const url = promptUrl('link')
          if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
        }}
      >
        🔗
      </ToolbarButton>
      <ToolbarButton
        label="Image"
        onClick={() => {
          const src = promptUrl('image')
          if (src) editor.update(() => $insertNodes([$createImageNode(src)]))
        }}
      >
        🖼
      </ToolbarButton>
      <ToolbarButton
        label="Mention"
        onClick={() => {
          editor.focus()
          editor.update(() => $getSelection()?.insertText('@'))
        }}
      >
        @
      </ToolbarButton>
      <SourcePicker
        onPick={(sourceId) => {
          editor.focus()
          editor.update(() => $insertNodes([$createCitationNode(sourceId)]))
        }}
      />
    </div>
  )
}

// ---- @mention typeahead ----

class EntityOption extends MenuOption {
  entity: Entity
  constructor(entity: Entity) {
    super(entity.id)
    this.entity = entity
  }
}

function MentionsPlugin() {
  const [editor] = useLexicalComposerContext()
  const [query, setQuery] = useState<string | null>(null)
  const triggerFn = useBasicTypeaheadTriggerMatch('@', { minLength: 0 })
  const options = useMemo(() => (query === null ? [] : searchEntities(query).map((e) => new EntityOption(e))), [query])

  const onSelectOption = useCallback(
    (option: EntityOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        const mention = $createMentionNode(option.entity.id, option.entity.label)
        if (nodeToReplace) nodeToReplace.replace(mention)
        mention.selectNext()
        closeMenu()
      })
    },
    [editor],
  )

  return (
    <LexicalTypeaheadMenuPlugin<EntityOption>
      onQueryChange={setQuery}
      onSelectOption={onSelectOption}
      triggerFn={triggerFn}
      options={options}
      menuRenderFn={(anchorRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) =>
        anchorRef.current && options.length
          ? createPortal(
              <ul className="suggest" role="listbox">
                {options.map((opt, i) => (
                  <li
                    key={opt.key}
                    ref={opt.setRefElement}
                    role="option"
                    aria-selected={selectedIndex === i}
                    onMouseEnter={() => setHighlightedIndex(i)}
                    onClick={() => selectOptionAndCleanUp(opt)}
                  >
                    <span>{opt.entity.label}</span>
                    <span className="suggest__kind">{opt.entity.kind}</span>
                  </li>
                ))}
              </ul>,
              anchorRef.current,
            )
          : null
      }
    />
  )
}

// ---- Stack ----

// Must be referentially stable: LinkPlugin re-registers a node transform when it changes,
// which triggers an editor update (→ onChange → setState → re-render → loop).
const validateUrl = (url: string) => safeLinkUrl(url) !== null

/** Reports the initial state once; OnChangePlugin skips the initial (history-merge) update. */
function InitialStatePlugin({ onChange }: { onChange: (state: SerializedEditorState) => void }) {
  const [editor] = useLexicalComposerContext()
  useEffect(() => onChange(editor.getEditorState().toJSON()), [editor, onChange])
  return null
}

export default function LexicalStack() {
  const [state, setState] = useState<SerializedEditorState | null>(null)
  const onChange = useCallback((s: SerializedEditorState) => setState(s), [])

  // Memoized so serialized-state updates don't re-render the editor tree.
  const editor = useMemo(
    () => (
      <LexicalComposer initialConfig={initialConfig}>
        <div className="rte">
          <Toolbar />
          <div className="rte__content">
            <RichTextPlugin
              contentEditable={<ContentEditable className="lx-editable" />}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </div>
        <HistoryPlugin />
        <LinkPlugin validateUrl={validateUrl} />
        <MentionsPlugin />
        <InitialStatePlugin onChange={onChange} />
        <OnChangePlugin ignoreSelectionChange onChange={(editorState) => onChange(editorState.toJSON())} />
      </LexicalComposer>
    ),
    [onChange],
  )

  return (
    <StackLayout
      serializedLabel="Lexical JSON"
      serialized={state ? JSON.stringify(state, null, 2) : ''}
      editor={editor}
      rendered={state ? <LexicalRenderer state={state} /> : null}
    />
  )
}
