// Leaf node (inline text with formatting)
export type DocumentTextLeaf = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  keyboard?: boolean;
  // You can add more custom marks if needed
};

// Base node shared by all block elements
interface BaseDocumentNode {
  children: DocumentNode[] | DocumentTextLeaf[];
}

// Paragraph block
export interface ParagraphNode extends BaseDocumentNode {
  type: "paragraph";
}

// Heading block
export interface HeadingNode extends BaseDocumentNode {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

// Blockquote block
export interface BlockquoteNode extends BaseDocumentNode {
  type: "blockquote";
}

// Code block
export interface CodeNode extends BaseDocumentNode {
  type: "code";
}

// Divider (horizontal rule)
export interface DividerNode {
  type: "divider";
  children: [];
}

// Ordered or unordered list
export interface ListNode extends BaseDocumentNode {
  type: "list";
  listType: "ordered" | "unordered";
}

// List item
export interface ListItemNode extends BaseDocumentNode {
  type: "list-item";
}

// Layout block (columns/grid)
export interface LayoutNode {
  type: "layout";
  layout: number[]; // e.g., [1,1] for two equal columns
  children: LayoutColumnNode[];
}

// Each column inside a layout
export interface LayoutColumnNode extends BaseDocumentNode {
  type: "layout-area";
}

// Custom component blocks (if enabled)
export interface ComponentBlockNode {
  type: "component-block";
  component: string;
  props: Record<string, any>;
  children: DocumentNode[];
}

// Inline links
export interface LinkNode extends BaseDocumentNode {
  type: "link";
  href: string;
  children: DocumentTextLeaf[];
}

// Union of all possible document node types
export type DocumentNode =
  | ParagraphNode
  | HeadingNode
  | BlockquoteNode
  | CodeNode
  | DividerNode
  | ListNode
  | ListItemNode
  | LayoutNode
  | LayoutColumnNode
  | ComponentBlockNode
  | LinkNode;

// The full document is an array of block-level nodes
export type KeystoneDocument = DocumentNode[];
