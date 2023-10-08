/* eslint-disable @nx/enforce-module-boundaries */
import { AutoInitContainer } from '@wthn/ioc';
import { isObservable } from '@wthn/utils';
import { interpolation } from '@wthn/interpolation';

export class ForDirective {
  constructor(mainElement, context) {
    this.mainElement = mainElement;
    this.context = context;
    this.templates = new Map();
    this.subscription = null;
    this.mode = mainElement.getAttribute('mode') || 'default';
    this.handleForDirective();
  }

  handleForDirective() {
    const directiveStr = this.mainElement.getAttribute('wthn-for');

    const match =
      /let (\w+) of (\w+)(?:; trackBy: (\w+))?(?:; let (\w+) = (\w+))?(?:; let (\w+) = (\w+))?/.exec(
        directiveStr
      );

    if (!match) {
      console.error('Invalid wthn-for directive format!');
      return;
    }

    const [, itemVar, itemsVar, trackByFnName] = match;

    // Fetch data using the context
    const data =
      this.context[itemsVar] ||
      this.getDataFromAncestors(this.mainElement, itemsVar);
    const trackByFn = this.getTrackByFunction(trackByFnName);

    if (isObservable(data)) {
      this.subscription = data.subscribe((items) => {
        this.mode === 'swap'
          ? this.renderSwap(this.mainElement, itemVar, items, trackByFn)
          : this.renderLoop(this.mainElement, itemVar, items, trackByFn);
      });
    } else if (Array.isArray(data)) {
      this.mode === 'swap'
        ? this.renderSwap(this.mainElement, itemVar, data, trackByFn)
        : this.renderLoop(this.mainElement, itemVar, data, trackByFn);
    }
  }

  getTrackByFunction(trackByAttr) {
    if (!trackByAttr) return null;
    if (typeof this.context[trackByAttr] === 'function') {
      return this.context[trackByAttr];
    }
    return (index, item) => item[trackByAttr];
  }

  renderSwap(
    element,
    itemVar,
    items,
    trackByFn,
    firstVar,
    firstAssignment,
    secondVar,
    secondAssignment
  ) {
    const parent = element.parentElement;
    const previousNodes = Array.from(parent.children);

    items.forEach((item, index) => {
      const trackById = trackByFn ? trackByFn(index, item) : index;
      const existingNode = previousNodes.find(
        (node) => node.getAttribute('trackby') === trackById
      );

      let clone;
      if (existingNode) {
        clone = existingNode.cloneNode(true);
        existingNode.remove();
      } else {
        clone = this.template.cloneNode(true);
      }

      clone.setAttribute('trackby', trackById);
      this.instance[itemVar] = item;

      if (firstVar && firstAssignment === 'index')
        this.instance[firstVar] = index;
      if (secondVar && secondAssignment === 'index')
        this.instance[secondVar] = index;
      if (firstVar && firstAssignment === 'even')
        this.instance[firstVar] = index % 2 === 0;
      if (secondVar && secondAssignment === 'even')
        this.instance[secondVar] = index % 2 === 0;
      if (firstVar && firstAssignment === 'odd')
        this.instance[firstVar] = index % 2 !== 0;
      if (secondVar && secondAssignment === 'odd')
        this.instance[secondVar] = index % 2 !== 0;

      interpolation(clone);
      parent.appendChild(clone);
    });

    // Cleanup nodes that no longer match any items
    previousNodes.forEach((node) => {
      if (
        !items.some((item) =>
          trackByFn
            ? trackByFn(items.indexOf(item), item) ===
              node.getAttribute('trackby')
            : items.indexOf(item) === parseInt(node.getAttribute('trackby'))
        )
      ) {
        node.remove();
      }
    });
  }

  renderLoop(
    element,
    itemVar,
    items,
    trackByFn,
    firstVar,
    firstAssignment,
    secondVar,
    secondAssignment
  ) {
    const parent = element.parentElement;
    const template = this.templates.get(element) || element.cloneNode(true);
    this.templates.set(element, template);

    const previousNodes = Array.from(parent.children).slice(
      Array.from(parent.children).indexOf(element) + 1
    );

    items.forEach((item, index) => {
      const trackById = trackByFn ? trackByFn(index, item) : index;
      const existingNode = previousNodes[index];

      if (existingNode && existingNode.getAttribute('trackby') === trackById) {
        return;
      }

      const clone = template.cloneNode(true);
      clone.setAttribute('trackby', trackById);
      this.instance[itemVar] = item;

      if (firstVar && firstAssignment === 'index')
        this.instance[firstVar] = index;
      if (secondVar && secondAssignment === 'index')
        this.instance[secondVar] = index;
      if (firstVar && firstAssignment === 'even')
        this.instance[firstVar] = index % 2 === 0;
      if (secondVar && secondAssignment === 'even')
        this.instance[secondVar] = index % 2 === 0;
      if (firstVar && firstAssignment === 'odd')
        this.instance[firstVar] = index % 2 !== 0;
      if (secondVar && secondAssignment === 'odd')
        this.instance[secondVar] = index % 2 !== 0;

      interpolation(clone);

      if (existingNode) {
        parent.replaceChild(clone, existingNode);
      } else {
        parent.appendChild(clone);
      }
    });

    while (parent.children.length > items.length + 1) {
      parent.lastChild.remove();
    }
  }

  getDataFromAncestors(element, key) {
    let currentElement = element.parentElement;
    while (currentElement) {
      const instance = AutoInitContainer.instance.get(currentElement);
      if (instance && key in instance) {
        return instance[key];
      }
      currentElement = currentElement.parentElement;
    }
    return null;
  }

  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
