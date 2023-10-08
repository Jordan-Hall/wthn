import { isDomObj } from '@wthn/utils';

export class HTMLElementComponent {
  /**
   * @type {HTMLElement}
   * @memberof Component
   */
  #elementRef;

  /**
   *Creates an instance of Component.
   * @param {HTMLElement} elementRef
   * @memberof Component
   */
  constructor(elementRef = document.createElement('div')) {
    // hack to keep this context in proxy to access the private field
    const this2 = this;

    this.#elementRef = new Proxy(elementRef, {
      /**
       * @param {Component} target
       * @param {string} propKey
       * @param {*} receiver
       * @returns
       */
      get(target, propKey, receiver) {
        let original = target[propKey];
        if (propKey !== 'setAttribute') {
          if (elementRef[propKey].bind) {
            return elementRef[propKey].bind(elementRef);
          }
          return elementRef[propKey];
        }

        /**
         * @type {HTMLElement}
         */
        const elmenet = this2.#elementRef;

        return function (attr, value) {
          this2.attributeChangedCallback(
            attr,
            elmenet.getAttribute(attr),
            value
          );
          let result = original.apply(elementRef, [attr, value]);
          this2.connectedCallback();
          return result;
        };
      },
    });
    const componentConnectCallback = this.connectedCallback.bind(this);
    this.connectedCallback = () => {
      const totlaChildren = elementRef.children.length;
      for (let i = 0; i < totlaChildren; i++) {
        const element = elementRef.children.item(0);
        element.remove();
      }
      let rendered = componentConnectCallback();
      if (isDomObj(rendered)) {
        elementRef.appendChild(rendered);
      } else if (typeof rendered === 'string') {
        elementRef.innerHTML = rendered;
      }
      return elementRef;
    };
  }

  /**
   * @param {string} name
   * @param {*} oldValue
   * @param {*} newValue
   * @memberof HTMLElementComponent
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  attributeChangedCallback(name, oldValue, newValue) {}

  /**
   * @param {HTMLElement} value
   * @memberof HTMLElementComponent
   */
  set innerHtml(value) {
    this.#elementRef.innerHTML = value;
  }

  /**
   * @param {string} quialifiedattributeChangedCallbackName
   * @memberof HTMLElementComponent
   */
  getAttribute(quialifiedName) {
    return this.#elementRef.getAttribute(quialifiedName);
  }

  setAttribute(quialifiedName, value) {
    const oldValue = this.getAttribute(quialifiedName);
    this.#elementRef.setAttribute(quialifiedName, value);
    this.attributeChangedCallback(quialifiedName, oldValue, value);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  connectedCallback() {}
}
