import { AutoInitContainer } from '@wthn/ioc';
import { SwapDirective } from './swap.js';
export function ManualInit() {
  const directives = document.querySelectorAll('[wthn-swap]');
  directives.forEach((directiveElement) => {
    // Find the closest parent component for the directive
    const parentComponent = directiveElement.closest('[wthn-component]');
    const context = parentComponent
      ? AutoInitContainer.instance.get(parentComponent)
      : // eslint-disable-next-line no-undef
      typeof window !== 'undefined'
      ? window
      : globalThis;

    // Assuming ForDirective looks something like this: new ForDirective(element, context);
    new SwapDirective(directiveElement, context);
  });
}

export function Init(parentElement, directiveElement) {
  const context = parentElement
    ? AutoInitContainer.instance.get(parentElement)
    : // eslint-disable-next-line no-undef
    typeof window !== 'undefined'
    ? window
    : globalThis;
  new SwapDirective(directiveElement, context);
}
