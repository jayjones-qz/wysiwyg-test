import { BlockNoteSchema, defaultInlineContentSpecs } from '@blocknote/core'
import { createReactInlineContentSpec } from '@blocknote/react'
import { CitationChip } from '../../shared/CitationChip'
import { MentionChip } from '../../shared/MentionChip'

const MentionInline = createReactInlineContentSpec(
  { type: 'mention', propSchema: { id: { default: '' }, label: { default: '' } }, content: 'none' },
  { render: ({ inlineContent }) => <MentionChip id={inlineContent.props.id} label={inlineContent.props.label} /> },
)

const CitationInline = createReactInlineContentSpec(
  { type: 'citation', propSchema: { sourceId: { default: '' } }, content: 'none' },
  { render: ({ inlineContent }) => <CitationChip sourceId={inlineContent.props.sourceId} /> },
)

export const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: MentionInline,
    citation: CitationInline,
  },
})

export type BNEditor = typeof schema.BlockNoteEditor
export type BNBlock = typeof schema.Block
export type BNPartialBlock = typeof schema.PartialBlock
