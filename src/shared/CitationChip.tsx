import { HoverChip } from './HoverChip'
import { getSource } from './sources'

/** Inline citation like [Brooks 1975] with a hover card showing the source and its key idea. */
export function CitationChip({ sourceId }: { sourceId: string }) {
  const source = getSource(sourceId)
  return (
    <HoverChip
      className={`citation${source ? '' : ' citation--unknown'}`}
      dataAttrs={{ 'data-source-id': sourceId }}
      card={
        source ? (
          <>
            <div className="hovercard__kind">citation</div>
            <div className="hovercard__title">{source.title}</div>
            <div className="hovercard__meta">
              {source.author} · {source.year}
            </div>
            <div className="hovercard__body">{source.definition}</div>
            <div className="hovercard__note">Prof. Vane: “{source.profNote}”</div>
            <code className="hovercard__id">{source.id}</code>
          </>
        ) : (
          <div className="hovercard__body">Unknown source: {sourceId}</div>
        )
      }
    >
      [{source?.short ?? sourceId}]
    </HoverChip>
  )
}
