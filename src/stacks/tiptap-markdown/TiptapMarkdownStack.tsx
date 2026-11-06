import { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { Markdown } from '@tiptap/markdown'
import { StackLayout } from '../../shared/StackLayout'
import { extensions } from '../tiptap/extensions'
import { Toolbar } from '../tiptap/Toolbar'
import { MarkdownRenderer } from '../markdown/MarkdownRenderer'
import { SEED_MARKDOWN } from '../markdown/seed'

// Same Tiptap schema as the JSON stack; the Markdown extension uses each node's
// parseMarkdown/renderMarkdown hooks (see tiptap/extensions.ts and tiptap/Citation.tsx).
const mdExtensions = [...extensions, Markdown]

export default function TiptapMarkdownStack() {
  const [markdown, setMarkdown] = useState(SEED_MARKDOWN)
  const editor = useEditor({
    extensions: mdExtensions,
    content: SEED_MARKDOWN,
    contentType: 'markdown',
    onCreate: ({ editor: e }) => setMarkdown(e.getMarkdown()),
    onUpdate: ({ editor: e }) => setMarkdown(e.getMarkdown()),
  })

  return (
    <StackLayout
      serializedLabel="Markdown (from Tiptap)"
      serialized={markdown}
      editor={
        <div className="rte">
          <Toolbar editor={editor} />
          <EditorContent editor={editor} className="rte__content" />
        </div>
      }
      rendered={<MarkdownRenderer markdown={markdown} />}
    />
  )
}
