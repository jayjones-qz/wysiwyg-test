import type { JSONContent } from '@tiptap/react'
import { SEED, type Inline } from '../../shared/seed'

function inline(node: Inline): JSONContent {
  if ('mention' in node) return { type: 'mention', attrs: { id: node.mention, label: node.label } }
  if ('cite' in node) return { type: 'citation', attrs: { sourceId: node.cite } }
  if ('link' in node) return { type: 'text', text: node.text, marks: [{ type: 'link', attrs: { href: node.link } }] }
  return node.marks?.length
    ? { type: 'text', text: node.text, marks: node.marks.map((type) => ({ type })) }
    : { type: 'text', text: node.text }
}

export const SEED_TIPTAP: JSONContent = {
  type: 'doc',
  content: SEED.map((b): JSONContent => {
    switch (b.type) {
      case 'heading':
        return { type: 'heading', attrs: { level: b.level }, content: [{ type: 'text', text: b.text }] }
      case 'paragraph':
        return { type: 'paragraph', content: b.content.map(inline) }
      case 'quote':
        return { type: 'blockquote', content: [{ type: 'paragraph', content: b.content.map(inline) }] }
      case 'image':
        return { type: 'image', attrs: { src: b.src, alt: b.alt } }
    }
  }),
}
