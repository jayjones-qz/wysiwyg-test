import type { Root, Nodes } from 'mdast'
import type { Processor } from 'unified'
import { visit } from 'unist-util-visit'
import { highlightMark } from 'micromark-extension-highlight-mark'
import { highlightMarkFromMarkdown } from 'mdast-util-highlight-mark'
import 'mdast-util-directive'

/** Parses `==text==` (same syntax MDXEditor writes) and renders it as <mark>. */
export function remarkHighlight(this: Processor) {
  // Extension slots are declared by remark-parse's types, which aren't a direct dependency.
  const data = this.data() as { micromarkExtensions?: unknown[]; fromMarkdownExtensions?: unknown[] }
  ;(data.micromarkExtensions ??= []).push(highlightMark())
  ;(data.fromMarkdownExtensions ??= []).push(highlightMarkFromMarkdown)
  return (tree: Root) => {
    visit(tree, (node: Nodes) => {
      if ((node.type as string) === 'highlight') {
        node.data = { ...node.data, hName: 'mark' }
      }
    })
  }
}

/**
 * Turns `:mention{#id}` / `:cite{#id}` text directives into
 * <span data-mention-id> / <span data-cite-id>, which the react-markdown
 * `span` component swaps for chips. Requires remark-directive to run first.
 */
export function remarkCustomInlines() {
  return (tree: Root) => {
    visit(tree, 'textDirective', (node) => {
      const id = node.attributes?.id ?? ''
      if (node.name === 'mention') {
        node.data = { ...node.data, hName: 'span', hProperties: { dataMentionId: id } }
      } else if (node.name === 'cite') {
        node.data = { ...node.data, hName: 'span', hProperties: { dataCiteId: id } }
      }
    })
  }
}
