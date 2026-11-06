import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { MentionChip } from '../../shared/MentionChip'

export function MentionView({ node }: ReactNodeViewProps) {
  return (
    <NodeViewWrapper as="span" className="chip-wrapper">
      <MentionChip id={node.attrs.id} label={node.attrs.label} />
    </NodeViewWrapper>
  )
}
