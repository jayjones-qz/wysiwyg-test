import { createElement, type ReactNode } from 'react'
import type { SerializedEditorState } from 'lexical'
import { MentionChip } from '../../shared/MentionChip'
import { CitationChip } from '../../shared/CitationChip'
import { safeImageUrl, safeLinkUrl } from '../../shared/url'

/**
 * Standalone renderer: Lexical JSON -> React, without loading the editor.
 * Unknown node types render their children (or nothing), never raw HTML.
 */

type SNode = { type: string; children?: SNode[]; [key: string]: unknown }

// Lexical text format bitmask
const BOLD = 1
const ITALIC = 2
const STRIKE = 4
const UNDERLINE = 8
const CODE = 16
const HIGHLIGHT = 128

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

function renderText(node: SNode): ReactNode {
  const format = typeof node.format === 'number' ? node.format : 0
  let out: ReactNode = String(node.text ?? '')
  if (format & CODE) out = <code>{out}</code>
  if (format & HIGHLIGHT) out = <mark>{out}</mark>
  if (format & STRIKE) out = <s>{out}</s>
  if (format & UNDERLINE) out = <u>{out}</u>
  if (format & ITALIC) out = <em>{out}</em>
  if (format & BOLD) out = <strong>{out}</strong>
  return out
}

function renderNode(node: SNode, key: number | string): ReactNode {
  const children = node.children?.map((c, i) => renderNode(c, i))
  switch (node.type) {
    case 'root':
      return <div key={key}>{children}</div>
    case 'paragraph':
      return <p key={key}>{children}</p>
    case 'heading': {
      const tag = HEADINGS.has(String(node.tag)) ? String(node.tag) : 'h2'
      return createElement(tag, { key }, children)
    }
    case 'quote':
      return <blockquote key={key}>{children}</blockquote>
    case 'linebreak':
      return <br key={key} />
    case 'text':
      return <span key={key}>{renderText(node)}</span>
    case 'link':
    case 'autolink': {
      const href = safeLinkUrl(String(node.url ?? ''))
      return href ? (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <span key={key}>{children}</span>
      )
    }
    case 'mention':
      return <MentionChip key={key} id={String(node.entityId ?? '')} label={String(node.label ?? '')} />
    case 'citation':
      return <CitationChip key={key} sourceId={String(node.sourceId ?? '')} />
    case 'image': {
      const src = safeImageUrl(String(node.src ?? ''))
      return src ? <img key={key} src={src} alt={String(node.altText ?? '')} className="rte-img" /> : null
    }
    default:
      return children ? <span key={key}>{children}</span> : null
  }
}

export function LexicalRenderer({ state }: { state: SerializedEditorState }) {
  return <>{renderNode(state.root as unknown as SNode, 'root')}</>
}
