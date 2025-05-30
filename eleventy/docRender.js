// import {
//   KeystoneDocument,
//   DocumentNode,
//   DocumentTextLeaf,
//   LayoutColumnNode,
// } from "./docType";

const escapeHTML = (str) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function renderKeystoneDocument(nodes) {
  if (!Array.isArray(nodes)) return "";

  return nodes.map(renderNode).join("");
}

function renderNode(node) {
  if ("text" in node) {
    let result = node.text;
    if (node.bold) result = `<strong>${result}</strong>`;
    if (node.italic) result = `<em>${result}</em>`;
    if (node.underline) result = `<u>${result}</u>`;
    if (node.strikethrough) result = `<s>${result}</s>`;
    if (node.code) result = `<code>${result}</code>`;
    if (node.subscript) result = `<sub>${result}</sub>`;
    if (node.superscript) result = `<sup>${result}</sup>`;
    if (node.keyboard) result = `<kbd>${result}</kbd>`;
    return result;
  }

  const { type, children = [] } = node;

  if (node.type === "layout") {
    let areas = [];
    let after = [];
    for (let i of children) {
      if (!("text" in i) && i.type === "layout-area") {
        areas.push(i);
      } else {
        after.push(i);
      }
    }
    let innerHTML = "<div>" + areas.map(renderNode).join("</div><div>") + "</div>";
    let afterHTML = after.map(renderNode).join("");
    return `<div style="display: grid; grid-template-columns: ${node.layout.join("fr ") + "fr"}">${innerHTML}</div>${afterHTML}`;
  }

  const innerHTML = children.map(renderNode).join("");

  switch (type) {
    case "paragraph":
      return `<p>${innerHTML}</p>`;
    case "heading":
      return `<h${node.level || 1}>${innerHTML}</h${node.level || 1}>`;
    case "blockquote":
      return `<blockquote>${innerHTML}</blockquote>`;
    case "code":
      return `<pre><code>${innerHTML}</code></pre>`;
    case "list":
      const Tag = node.listType === "ordered" ? "ol" : "ul";
      return `<${Tag}>${innerHTML}</${Tag}>`;
    case "list-item":
      return `<li>${innerHTML}</li>`;
    case "component-block":
      // custom code here.
      return innerHTML;
    case "divider":
      return `<hr />`;
    case "link":
      return `<a href="${escapeHTML(node.href)}">${innerHTML}</a>`;
    default:
      return innerHTML;
  }
}
