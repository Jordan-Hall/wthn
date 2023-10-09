import { getContextForElement } from './context';
/**
 *
 * @param {Element} rootElement
 */
export function interpolation(rootElement) {
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let node;
  // eslint-disable-next-line no-cond-assign
  while ((node = walker.nextNode())) {
    if (node.nodeValue.includes('{{') && node.nodeValue.includes('}}')) {
      node.nodeValue = node.nodeValue.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
        const context = getContextForElement(node.parentElement, key);
        return context ? context[key] : '';
      });
    }
  }
}
