import { SEED, type Inline } from '../../shared/seed'
import type { BNPartialBlock } from './schema'

// BlockNote has no dedicated highlight mark; highlight = backgroundColor style.
export const HIGHLIGHT_COLOR = 'yellow'

function inline(node: Inline) {
  if ('mention' in node) return { type: 'mention' as const, props: { id: node.mention, label: node.label } }
  if ('cite' in node) return { type: 'citation' as const, props: { sourceId: node.cite } }
  if ('link' in node) return { type: 'link' as const, href: node.link, content: node.text }
  const marks = node.marks ?? []
  return {
    type: 'text' as const,
    text: node.text,
    styles: {
      ...(marks.includes('bold') && { bold: true }),
      ...(marks.includes('italic') && { italic: true }),
      ...(marks.includes('highlight') && { backgroundColor: HIGHLIGHT_COLOR }),
    },
  }
}

export const SEED_BLOCKNOTE: BNPartialBlock[] = SEED.map((b): BNPartialBlock => {
  switch (b.type) {
    case 'heading':
      return { type: 'heading', props: { level: b.level }, content: b.text }
    case 'paragraph':
      return { type: 'paragraph', content: b.content.map(inline) }
    case 'quote':
      return { type: 'quote', content: b.content.map(inline) }
    case 'image':
      return { type: 'image', props: { url: b.src, caption: b.alt } }
  }
})
