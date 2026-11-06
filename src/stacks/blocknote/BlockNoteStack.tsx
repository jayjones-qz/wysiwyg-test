import { useState } from 'react'
import '@blocknote/mantine/style.css'
import { filterSuggestionItems } from '@blocknote/core'
import { SuggestionMenuController, useCreateBlockNote, type DefaultReactSuggestionItem } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import { ENTITIES } from '../../shared/entities'
import { SOURCES } from '../../shared/sources'
import { SourcePicker } from '../../shared/SourcePicker'
import { StackLayout } from '../../shared/StackLayout'
import { BlockNoteRenderer } from './BlockNoteRenderer'
import { schema, type BNEditor } from './schema'
import { SEED_BLOCKNOTE } from './seed'

const mentionItems = (editor: BNEditor): DefaultReactSuggestionItem[] =>
  ENTITIES.map((e) => ({
    title: e.label,
    subtext: e.kind,
    onItemClick: () => editor.insertInlineContent([{ type: 'mention', props: { id: e.id, label: e.label } }, ' ']),
  }))

const citationItems = (editor: BNEditor): DefaultReactSuggestionItem[] =>
  SOURCES.map((s) => ({
    title: s.short,
    subtext: s.title,
    aliases: [s.author, s.title],
    onItemClick: () => editor.insertInlineContent([{ type: 'citation', props: { sourceId: s.id } }, ' ']),
  }))

export default function BlockNoteStack() {
  const editor = useCreateBlockNote({ schema, initialContent: SEED_BLOCKNOTE })
  const [doc, setDoc] = useState(() => editor.document)

  return (
    <StackLayout
      serializedLabel="BlockNote JSON"
      serialized={JSON.stringify(doc, null, 2)}
      editor={
        <div className="rte">
          <div className="toolbar">
            <span className="toolbar__hint">
              Type <kbd>@</kbd> mention · <kbd>^</kbd> cite · <kbd>/</kbd> blocks · select text for formatting
            </span>
            <SourcePicker
              onPick={(sourceId) => {
                editor.focus()
                editor.insertInlineContent([{ type: 'citation', props: { sourceId } }, ' '])
              }}
            />
          </div>
          <div className="rte__content bn-content">
            <BlockNoteView editor={editor} theme="light" onChange={() => setDoc(editor.document)}>
              <SuggestionMenuController
                triggerCharacter="@"
                getItems={async (query) => filterSuggestionItems(mentionItems(editor), query)}
              />
              <SuggestionMenuController
                triggerCharacter="^"
                getItems={async (query) => filterSuggestionItems(citationItems(editor), query)}
              />
            </BlockNoteView>
          </div>
        </div>
      }
      rendered={<BlockNoteRenderer blocks={doc} />}
    />
  )
}
