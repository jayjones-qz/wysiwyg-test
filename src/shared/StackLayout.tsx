import { useState, type ReactNode } from 'react'

interface Props {
  editor: ReactNode
  /** Output of the stack's renderer, given the serialized content. */
  rendered: ReactNode
  serialized: string
  serializedLabel: string
}

/** Two panes: WYSIWYG (with an Edit/Rendered toggle) | serialized storage. */
export function StackLayout({ editor, rendered, serialized, serializedLabel }: Props) {
  const [view, setView] = useState<'edit' | 'rendered'>('edit')
  return (
    <div className="panes">
      <section className="pane">
        <header className="pane__header">
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={view === 'edit'} onClick={() => setView('edit')}>
              Editor
            </button>
            <button role="tab" aria-selected={view === 'rendered'} onClick={() => setView('rendered')}>
              Rendered
            </button>
          </div>
        </header>
        {/* Keep the editor mounted so its state survives tab switches. */}
        <div className="pane__body" hidden={view !== 'edit'}>
          {editor}
        </div>
        {view === 'rendered' && <div className="pane__body rendered">{rendered}</div>}
      </section>
      <section className="pane">
        <header className="pane__header">
          <span className="pane__title">Serialized · {serializedLabel}</span>
          <button className="small" onClick={() => void navigator.clipboard?.writeText(serialized)}>
            Copy
          </button>
        </header>
        <pre className="pane__body serialized">{serialized}</pre>
      </section>
    </div>
  )
}
