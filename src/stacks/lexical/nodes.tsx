import type { JSX } from 'react'
import {
  DecoratorNode,
  type LexicalUpdateJSON,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical'
import { MentionChip } from '../../shared/MentionChip'
import { CitationChip } from '../../shared/CitationChip'
import { safeImageUrl } from '../../shared/url'

// ---- Mention ----

export type SerializedMentionNode = Spread<{ entityId: string; label: string }, SerializedLexicalNode>

export class MentionNode extends DecoratorNode<JSX.Element> {
  __entityId: string
  __label: string

  static getType() {
    return 'mention'
  }
  static clone(node: MentionNode) {
    return new MentionNode(node.__entityId, node.__label, node.__key)
  }
  static importJSON(json: SerializedMentionNode) {
    return $createMentionNode(json.entityId, json.label).updateFromJSON(json)
  }

  constructor(entityId = '', label = '', key?: NodeKey) {
    super(key)
    this.__entityId = entityId
    this.__label = label
  }

  updateFromJSON(json: LexicalUpdateJSON<SerializedMentionNode>) {
    return super.updateFromJSON(json)
  }
  exportJSON(): SerializedMentionNode {
    return { ...super.exportJSON(), entityId: this.__entityId, label: this.__label }
  }
  createDOM() {
    return document.createElement('span')
  }
  updateDOM() {
    return false
  }
  isInline() {
    return true
  }
  getTextContent() {
    return `@${this.__label}`
  }
  decorate() {
    return <MentionChip id={this.__entityId} label={this.__label} />
  }
}

export function $createMentionNode(entityId: string, label: string) {
  return new MentionNode(entityId, label)
}

// ---- Image ----

export type SerializedImageNode = Spread<{ src: string; altText: string }, SerializedLexicalNode>

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string
  __altText: string

  static getType() {
    return 'image'
  }
  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__altText, node.__key)
  }
  static importJSON(json: SerializedImageNode) {
    return $createImageNode(json.src, json.altText).updateFromJSON(json)
  }

  constructor(src = '', altText = '', key?: NodeKey) {
    super(key)
    this.__src = src
    this.__altText = altText
  }

  updateFromJSON(json: LexicalUpdateJSON<SerializedImageNode>) {
    return super.updateFromJSON(json)
  }
  exportJSON(): SerializedImageNode {
    return { ...super.exportJSON(), src: this.__src, altText: this.__altText }
  }
  createDOM() {
    return document.createElement('span')
  }
  updateDOM() {
    return false
  }
  isInline() {
    return true
  }
  decorate() {
    const src = safeImageUrl(this.__src)
    return src ? <img src={src} alt={this.__altText} className="rte-img" /> : <span>[blocked image]</span>
  }
}

export function $createImageNode(src: string, altText = '') {
  return new ImageNode(src, altText)
}

// ---- Citation ----

export type SerializedCitationNode = Spread<{ sourceId: string }, SerializedLexicalNode>

export class CitationNode extends DecoratorNode<JSX.Element> {
  __sourceId: string

  static getType() {
    return 'citation'
  }
  static clone(node: CitationNode) {
    return new CitationNode(node.__sourceId, node.__key)
  }
  static importJSON(json: SerializedCitationNode) {
    return $createCitationNode(json.sourceId).updateFromJSON(json)
  }

  constructor(sourceId = '', key?: NodeKey) {
    super(key)
    this.__sourceId = sourceId
  }

  updateFromJSON(json: LexicalUpdateJSON<SerializedCitationNode>) {
    return super.updateFromJSON(json)
  }
  exportJSON(): SerializedCitationNode {
    return { ...super.exportJSON(), sourceId: this.__sourceId }
  }
  createDOM() {
    return document.createElement('span')
  }
  updateDOM() {
    return false
  }
  isInline() {
    return true
  }
  getTextContent() {
    return `[${this.__sourceId}]`
  }
  decorate() {
    return <CitationChip sourceId={this.__sourceId} />
  }
}

export function $createCitationNode(sourceId: string) {
  return new CitationNode(sourceId)
}
