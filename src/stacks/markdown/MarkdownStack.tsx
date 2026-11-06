import { useState } from 'react'
import '@mdxeditor/editor/style.css'
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  directivesPlugin,
  headingsPlugin,
  HighlightToggle,
  imagePlugin,
  insertDirective$,
  InsertImage,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  toolbarPlugin,
  UndoRedo,
  type DirectiveDescriptor,
} from '@mdxeditor/editor'
import { usePublisher } from '@mdxeditor/gurx'
import { ENTITIES } from '../../shared/entities'
import { MentionChip } from '../../shared/MentionChip'
import { CitationChip } from '../../shared/CitationChip'
import { SourcePicker } from '../../shared/SourcePicker'
import { StackLayout } from '../../shared/StackLayout'
import { SEED_MARKDOWN } from './seed'
import { MarkdownRenderer } from './MarkdownRenderer'

// Custom inlines are stored as text directives: `:mention{#id}`, `:cite{#id}`.
// Labels are resolved from the registries at render time, not stored.
const MentionDirectiveDescriptor: DirectiveDescriptor = {
  name: 'mention',
  type: 'textDirective',
  testNode: (node) => node.name === 'mention',
  attributes: ['id'],
  hasChildren: false,
  Editor: ({ mdastNode }) => <MentionChip id={mdastNode.attributes?.id ?? ''} />,
}

const CiteDirectiveDescriptor: DirectiveDescriptor = {
  name: 'cite',
  type: 'textDirective',
  testNode: (node) => node.name === 'cite',
  attributes: ['id'],
  hasChildren: false,
  Editor: ({ mdastNode }) => <CitationChip sourceId={mdastNode.attributes?.id ?? ''} />,
}

function InsertMention() {
  const insertDirective = usePublisher(insertDirective$)
  return (
    <select
      className="tb-select"
      aria-label="Insert mention"
      value=""
      onChange={(e) => {
        if (!e.target.value) return
        insertDirective({ type: 'textDirective', name: 'mention', attributes: { id: e.target.value } })
      }}
    >
      <option value="">@ Mention…</option>
      {ENTITIES.map((e) => (
        <option key={e.id} value={e.id}>
          {e.label} ({e.kind})
        </option>
      ))}
    </select>
  )
}

function InsertCitation() {
  const insertDirective = usePublisher(insertDirective$)
  return (
    <SourcePicker
      onPick={(id) => insertDirective({ type: 'textDirective', name: 'cite', attributes: { id } })}
    />
  )
}

const plugins = [
  headingsPlugin(),
  listsPlugin(),
  quotePlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  imagePlugin(),
  directivesPlugin({ directiveDescriptors: [MentionDirectiveDescriptor, CiteDirectiveDescriptor] }),
  markdownShortcutPlugin(),
  toolbarPlugin({
    toolbarContents: () => (
      <>
        <UndoRedo />
        <Separator />
        {/* Underline omitted: markdown has no underline syntax (MDXEditor would emit <u>). */}
        <BoldItalicUnderlineToggles options={['Bold', 'Italic']} />
        <HighlightToggle />
        <Separator />
        <BlockTypeSelect />
        <ListsToggle />
        <Separator />
        <CreateLink />
        <InsertImage />
        <InsertMention />
        <InsertCitation />
      </>
    ),
  }),
]

export default function MarkdownStack() {
  const [markdown, setMarkdown] = useState(SEED_MARKDOWN)
  return (
    <StackLayout
      serializedLabel="Markdown"
      serialized={markdown}
      editor={<MDXEditor className="mdx-editor" markdown={SEED_MARKDOWN} onChange={setMarkdown} plugins={plugins} />}
      rendered={
        <MarkdownRenderer markdown={markdown} />
      }
    />
  )
}
