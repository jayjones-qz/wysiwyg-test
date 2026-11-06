import { Suspense } from 'react'
import { Navigate, NavLink, Route, Routes } from 'react-router'
import { STACKS, type StackDef } from './stacks/registry'

function StackPage({ stack }: { stack: StackDef }) {
  const { Component } = stack
  return (
    <div className="stack">
      <header className="stack__header">
        <h2>{stack.name}</h2>
        <dl className="stack__meta">
          <dt>Editor</dt>
          <dd>{stack.editor}</dd>
          <dt>Storage</dt>
          <dd>{stack.storage}</dd>
          <dt>Renderer</dt>
          <dd>{stack.renderer}</dd>
          <dt>Custom nodes</dt>
          <dd>{stack.customNodes}</dd>
        </dl>
        <details className="stack__mobile">
          <summary>Mobile compatibility</summary>
          <dl className="stack__meta">
            <dt>Mobile web</dt>
            <dd>{stack.mobile.mobileWeb}</dd>
            <dt>React Native editor</dt>
            <dd>{stack.mobile.reactNativeEditor}</dd>
            <dt>Native rendering</dt>
            <dd>{stack.mobile.nativeRendering}</dd>
          </dl>
        </details>
      </header>
      <Suspense fallback={<p className="loading">Loading {stack.name}…</p>}>
        <Component />
      </Suspense>
    </div>
  )
}

export default function App() {
  return (
    <div className="app">
      <nav className="sidebar">
        <h1>WYSIWYG stacks</h1>
        <ul>
          {STACKS.map((s) => (
            <li key={s.slug}>
              <NavLink to={`/${s.slug}`}>
                <span className="sidebar__name">{s.name}</span>
                <span className="sidebar__sub">{s.storage}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main className="main">
        <Routes>
          <Route index element={<Navigate to={`/${STACKS[0].slug}`} replace />} />
          {STACKS.map((s) => (
            <Route key={s.slug} path={s.slug} element={<StackPage stack={s} />} />
          ))}
          <Route path="*" element={<p>Unknown stack.</p>} />
        </Routes>
      </main>
    </div>
  )
}
