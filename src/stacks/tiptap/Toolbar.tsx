import { useEditorState, type Editor } from '@tiptap/react'
import { SourcePicker } from '../../shared/SourcePicker'
import { ToolbarButton } from '../../shared/ToolbarButton'
import { promptUrl } from '../../shared/url'

export function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      highlight: e.isActive('highlight'),
      link: e.isActive('link'),
    }),
  })
  const chain = () => editor.chain().focus()
  return (
    <div className="toolbar">
      <ToolbarButton label="Bold" active={state.bold} onClick={() => chain().toggleBold().run()}>
        <b>B</b>
      </ToolbarButton>
      <ToolbarButton label="Italic" active={state.italic} onClick={() => chain().toggleItalic().run()}>
        <i>I</i>
      </ToolbarButton>
      <ToolbarButton label="Highlight" active={state.highlight} onClick={() => chain().toggleHighlight().run()}>
        <mark>H</mark>
      </ToolbarButton>
      <ToolbarButton
        label="Link"
        active={state.link}
        onClick={() => {
          if (state.link) return void chain().unsetLink().run()
          const href = promptUrl('link')
          if (href) chain().extendMarkRange('link').setLink({ href }).run()
        }}
      >
        🔗
      </ToolbarButton>
      <ToolbarButton
        label="Image"
        onClick={() => {
          const src = promptUrl('image')
          if (src) chain().setImage({ src }).run()
        }}
      >
        🖼
      </ToolbarButton>
      <ToolbarButton label="Mention" onClick={() => chain().insertContent('@').run()}>
        @
      </ToolbarButton>
      <SourcePicker
        onPick={(sourceId) => chain().insertContent({ type: 'citation', attrs: { sourceId } }).run()}
      />
    </div>
  )
}

