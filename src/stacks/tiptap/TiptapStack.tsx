import { useMemo, useState } from 'react'
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react'
import { renderToReactElement } from '@tiptap/static-renderer/pm/react'
import { MentionChip } from '../../shared/MentionChip'
import { CitationChip } from '../../shared/CitationChip'
import { StackLayout } from '../../shared/StackLayout'
import { extensions } from './extensions'
import { SEED_TIPTAP } from './seed'
import { Toolbar } from './Toolbar'

export default function TiptapStack() {
  const [doc, setDoc] = useState<JSONContent>(SEED_TIPTAP)
  const editor = useEditor({
    extensions,
    content: SEED_TIPTAP,
    onUpdate: ({ editor: e }) => setDoc(e.getJSON()),
  })

  const rendered = useMemo(
    () =>
      renderToReactElement({
        content: doc,
        extensions,
        options: {
          nodeMapping: {
            mention: ({ node }) => <MentionChip id={node.attrs.id} label={node.attrs.label} />,
            citation: ({ node }) => <CitationChip sourceId={node.attrs.sourceId} />,
          },
        },
      }),
    [doc],
  )

  return (
    <StackLayout
      serializedLabel="ProseMirror JSON"
      serialized={JSON.stringify(doc, null, 2)}
      editor={
        <div className="rte">
          <Toolbar editor={editor} />
          <EditorContent editor={editor} className="rte__content" />
        </div>
      }
      rendered={rendered}
    />
  )
}
