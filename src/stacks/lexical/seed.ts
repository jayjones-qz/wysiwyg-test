import { $createParagraphNode, $createTextNode, $getRoot, type LexicalNode } from 'lexical'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $createLinkNode } from '@lexical/link'
import { SEED, type Inline } from '../../shared/seed'
import { $createCitationNode, $createImageNode, $createMentionNode } from './nodes'

function $inline(node: Inline): LexicalNode {
  if ('mention' in node) return $createMentionNode(node.mention, node.label)
  if ('cite' in node) return $createCitationNode(node.cite)
  if ('link' in node) return $createLinkNode(node.link).append($createTextNode(node.text))
  const text = $createTextNode(node.text)
  for (const mark of node.marks ?? []) text.toggleFormat(mark)
  return text
}

/** Builds the shared seed doc inside an editor.update / initial editorState callback. */
export function $buildSeed() {
  const root = $getRoot()
  for (const b of SEED) {
    switch (b.type) {
      case 'heading':
        root.append($createHeadingNode(`h${b.level}`).append($createTextNode(b.text)))
        break
      case 'paragraph':
        root.append($createParagraphNode().append(...b.content.map($inline)))
        break
      case 'quote':
        root.append($createQuoteNode().append(...b.content.map($inline)))
        break
      case 'image':
        root.append($createParagraphNode().append($createImageNode(b.src, b.alt)))
        break
    }
  }
}
