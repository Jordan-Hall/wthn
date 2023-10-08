import { AutoInitContainer } from '@wthn/ioc';
/**
 *
 * @param {HTMLElement} element
 * @param {string} key
 * @returns
 */
export function getContextForElement(element, key) {
  let currentElement = element;
  while (currentElement) {
    const instance = AutoInitContainer.instance.get(currentElement);
    if (instance && key in instance) {
      return instance;
    }
    currentElement = currentElement.parentElement;
  }
  return null;
}
