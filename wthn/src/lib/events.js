/**
 * Binds events from HTML elements to the corresponding functions in the provided instance.
 *
 * @param {HTMLElement} mainElement - The main component element that might contain child elements with ev-* attributes.
 * @param {Object} instance - The JavaScript instance corresponding to the component, which contains the methods to bind.
 */
export function bindEvents(mainElement, instance) {
  const elementsWithEvents = mainElement.querySelectorAll('[ev-*]');
  elementsWithEvents.forEach((element) => {
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name.startsWith('ev-')) {
        const eventType = attr.name.slice(8);
        const funcName = attr.value;
        if (funcName && instance[funcName]) {
          element.addEventListener(
            eventType,
            instance[funcName].bind(instance)
          );
        }
      }
    });
  });
}
