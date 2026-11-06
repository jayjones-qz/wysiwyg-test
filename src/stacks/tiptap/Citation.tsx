import { mergeAttributes, Node, NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from '@tiptap/react'
import { CitationChip } from '../../shared/CitationChip'
import { getSource } from '../../shared/sources'

function CitationView({ node }: ReactNodeViewProps) {
  return (
    <NodeViewWrapper as="span" className="chip-wrapper">
      <CitationChip sourceId={node.attrs.sourceId} />
    </NodeViewWrapper>
  )
}

/** Custom inline atom node: { type: 'citation', attrs: { sourceId } } */
export const Citation = Node.create({
  name: 'citation',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      sourceId: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-source-id'),
        renderHTML: (attrs) => ({ 'data-source-id': attrs.sourceId }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="citation"]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const short = getSource(node.attrs.sourceId)?.short ?? node.attrs.sourceId
    return ['span', mergeAttributes({ 'data-type': 'citation' }, HTMLAttributes), `[${short}]`]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CitationView)
  },

  // Markdown round-trip (used only when the Markdown extension is loaded): `:cite{#id}`
  markdownTokenizer: {
    name: 'citation',
    level: 'inline',
    start: (src: string) => src.indexOf(':cite'),
    tokenize(src: string) {
      const m = /^:cite\{#([\w-]+)\}/.exec(src)
      if (m) return { type: 'citation', raw: m[0], sourceId: m[1] }
    },
  },
  parseMarkdown: (token, h) => h.createNode('citation', { sourceId: token.sourceId }),
  renderMarkdown: (node) => `:cite{#${node.attrs?.sourceId ?? ''}}`,
})
