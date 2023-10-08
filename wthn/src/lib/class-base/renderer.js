/**
 * @typedef {import('./element.js').HTMLElementComponent} HTMLElementComponent
 */
import { isDomObj } from '@wthn/utils';
export class Renderer {
  /**
   * @export
   * @param {HTMLElement} element
   * @param {HTMLElementComponent} customElement
   */
  static appendChild(element, customElement) {
    const proxyCustomElement = new Proxy(customElement, {
      /**
       * @param {Component} target
       * @param {string} propKey
       * @param {*} receiver
       * @returns
       */
      get(target, propKey, receiver) {
        const origMethod = target[propKey];
        if (propKey !== 'connectedCallback') {
          return origMethod;
        }
        return function () {
          let rendered = origMethod.apply(this);
          if (isDomObj(rendered)) {
            element.appendChild(rendered);
          } else if (typeof rendered === 'string') {
            element.innerHTML = `${element.innerHTML}${rendered}`;
          }
        };
      },
    });
    proxyCustomElement.connectedCallback();
  }
}
