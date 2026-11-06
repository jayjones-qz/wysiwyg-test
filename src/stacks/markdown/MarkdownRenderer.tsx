import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import { CitationChip } from '../../shared/CitationChip'
import { MentionChip } from '../../shared/MentionChip'
import { remarkCustomInlines, remarkHighlight } from './remarkPlugins'

const components: Components = {
  span({ node, ...props }) {
    const mentionId = node?.properties?.dataMentionId
    if (typeof mentionId === 'string') return <MentionChip id={mentionId} />
    const citeId = node?.properties?.dataCiteId
    if (typeof citeId === 'string') return <CitationChip sourceId={citeId} />
    return <span {...props} />
  },
  a({ node: _node, ...props }) {
    return <a {...props} target="_blank" rel="noopener noreferrer" />
  },
}

const remarkPlugins = [remarkGfm, remarkDirective, remarkHighlight, remarkCustomInlines]

/**
 * Renders markdown + `==highlight==` + `:mention[..]{#id}` / `:cite{#id}` directives.
 * No rehype-raw: raw HTML in the markdown is not rendered (XSS-safe default).
 * Shared by every markdown-storage stack.
 */
export function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <Markdown remarkPlugins={remarkPlugins} components={components}>
      {markdown}
    </Markdown>
  )
}
