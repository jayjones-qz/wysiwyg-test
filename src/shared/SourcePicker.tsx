import { SOURCES } from './sources'

/** Toolbar <select> for inserting a citation. Used by every stack. */
export function SourcePicker({ onPick }: { onPick: (sourceId: string) => void }) {
  return (
    <select
      className="tb-select"
      aria-label="Insert citation"
      value=""
      onChange={(e) => e.target.value && onPick(e.target.value)}
    >
      <option value="">Cite…</option>
      {SOURCES.map((s) => (
        <option key={s.id} value={s.id}>
          {s.short} — {s.title}
        </option>
      ))}
    </select>
  )
}
