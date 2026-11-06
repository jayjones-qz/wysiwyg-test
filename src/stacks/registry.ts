import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export interface MobileNotes {
  /** iOS Safari / Android Chrome, i.e. this web app on a phone. */
  mobileWeb: string
  /** Editing inside a React Native app. */
  reactNativeEditor: string
  /** Rendering the stored content natively (RN, iOS, Android) without a WebView. */
  nativeRendering: string
}

export interface StackDef {
  slug: string
  name: string
  editor: string
  storage: string
  renderer: string
  customNodes: string
  mobile: MobileNotes
  Component: LazyExoticComponent<ComponentType>
}

// Add a stack: create src/stacks/<slug>/<Name>Stack.tsx (default export) and add an entry here.
export const STACKS: StackDef[] = [
  {
    slug: 'markdown',
    name: 'Markdown',
    editor: 'MDXEditor (Lexical-based)',
    storage: 'Markdown + directives',
    renderer: 'react-markdown + remark-directive',
    customNodes: 'remark directives: :mention{#id}, :cite{#id}; ==highlight==',
    mobile: {
      mobileWeb: 'Works. MDXEditor toolbar is dense on small screens.',
      reactNativeEditor: 'Web-only (DOM). In RN, use a WebView or an Expo DOM component.',
      nativeRendering:
        'Best of the three: plain text, with native markdown renderers on every platform (react-native-markdown-display, Markwon on Android, swift-markdown on iOS). Directives and ==highlight== need a custom rule in each renderer.',
    },
    Component: lazy(() => import('./markdown/MarkdownStack')),
  },
  {
    slug: 'tiptap',
    name: 'Tiptap',
    editor: 'Tiptap 3 (ProseMirror)',
    storage: 'ProseMirror JSON',
    renderer: '@tiptap/static-renderer',
    customNodes: 'Node.create() + ReactNodeViewRenderer; Mention extension with @ suggestion',
    mobile: {
      mobileWeb: 'Works; ProseMirror has the most mature mobile contenteditable handling.',
      reactNativeEditor: '10tap-editor (@10play/tentap-editor) wraps Tiptap in a WebView with an RN bridge.',
      nativeRendering:
        'No official native renderer. JSON is a simple tree, so a custom JSON → RN/SwiftUI/Compose walker is straightforward.',
    },
    Component: lazy(() => import('./tiptap/TiptapStack')),
  },
  {
    slug: 'lexical',
    name: 'Lexical',
    editor: 'Lexical (Meta)',
    storage: 'Lexical JSON',
    renderer: 'Custom JSON → React walker',
    customNodes: 'DecoratorNode subclasses; LexicalTypeaheadMenuPlugin for @',
    mobile: {
      mobileWeb: 'Works.',
      reactNativeEditor: 'Web-only in JS. In RN, use a WebView or an Expo DOM component.',
      nativeRendering:
        'Meta’s lexical-ios is a native Swift editor (no Android port). Otherwise a custom JSON walker, like this stack’s renderer.',
    },
    Component: lazy(() => import('./lexical/LexicalStack')),
  },
  {
    slug: 'tiptap-markdown',
    name: 'Tiptap + Markdown',
    editor: 'Tiptap 3 + @tiptap/markdown',
    storage: 'Markdown + directives',
    renderer: 'react-markdown + remark-directive (same as Markdown stack)',
    customNodes:
      'Same Tiptap nodes as the Tiptap stack, plus markdownTokenizer / parseMarkdown / renderMarkdown hooks per node',
    mobile: {
      mobileWeb: 'Works (ProseMirror).',
      reactNativeEditor: '10tap-editor (Tiptap in a WebView); add the Markdown extension and the same node hooks.',
      nativeRendering:
        'Same as the Markdown stack: native markdown renderers everywhere; directives and ==highlight== need a custom rule per renderer.',
    },
    Component: lazy(() => import('./tiptap-markdown/TiptapMarkdownStack')),
  },
  {
    slug: 'blocknote',
    name: 'BlockNote',
    editor: 'BlockNote (Notion-style blocks, on Tiptap)',
    storage: 'BlockNote block JSON',
    renderer: 'Custom JSON → React walker',
    customNodes: 'createReactInlineContentSpec; SuggestionMenuController per trigger (@ mention, ^ cite)',
    mobile: {
      mobileWeb: 'Works; block drag handles and side menu are hover-oriented, so less natural on touch.',
      reactNativeEditor: 'No RN package. WebView or Expo DOM component.',
      nativeRendering:
        'No official native renderer. Block JSON is regular (blocks → inline content), so a custom walker is simple.',
    },
    Component: lazy(() => import('./blocknote/BlockNoteStack')),
  },
]
