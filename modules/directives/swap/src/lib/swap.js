export class SwapDirective {
  constructor(element, instanceContext) {
    this.element = element;
    this.instance = instanceContext;
    this.variableName = this.element.getAttribute('wthn-swap');
    this.lastValue = this.getValueFromInstance();

    this.setupProxy();
  }

  setupProxy() {
    const handler = {
      set: (obj, prop, value) => {
        if (prop === this.variableName && value !== this.lastValue) {
          this.handleSwap(value);
          this.lastValue = value;
        }
        obj[prop] = value;
        return true;
      },
    };
    // eslint-disable-next-line no-undef
    this.instance = new Proxy(this.instance, handler);
  }

  handleSwap(newValue) {
    this.element.textContent = newValue;
  }

  getValueFromInstance() {
    return this.instance[this.variableName];
  }
}
