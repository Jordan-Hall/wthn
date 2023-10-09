/* eslint-disable @nx/enforce-module-boundaries */
import { bindEvents } from './events';
import { AutoInitContainer } from '@wthn/ioc';

/**
 * Automatically initializes components based on data attributes.
 * @param {boolean} includeInternalModules
 */
export function autoInit(includeInternalModules = true) {
  const elements = document.querySelectorAll('[wthn-init]');

  elements.forEach((element, i) => {
    const componentName = element.getAttribute('wthn-component');
    import(`./components/${componentName}.js`).then((m) => {
      // eslint-disable-next-line no-undef
      const uuid = (globalThis || self).crypto.randomUUID();
      element.setAttribute('wthn-uuid', uuid);
      const instance = m.init(element);
      bindEvents(element, instance);
      AutoInitContainer.instance.set(instance, uuid);
      if (i === elements.length - 1) {
        document.dispatchEvent(new Event('autoinit-init'));
      }

      if (instance) {
        if (instance.afterContruct) {
          instance.afterContruct();
        }

        if (instance.afterInit) {
          instance.afterInit();
        }
      }

      // Internal Directives init
      if (includeInternalModules) {
        element.querySelectorAll('[wthn-for]').forEach((forElement) => {
          import('@wthn/for').then((m) => m.init(forElement, element));
        });
        element.querySelectorAll('[wthn-if]').forEach((forElement) => {
          import('@wthn/if-else').then((m) => m.init(forElement, element));
        });
        element.querySelectorAll('[wthn-swap]').forEach((forElement) => {
          import('@wthn/swap').then((m) => m.init(forElement, element));
        });
      }
    });
  });

  // if Interpolation exists then init
  import('@wthn/interpolation')
    .then((m) => {
      m.interpolation(document.body);
    })
    .catch(() => {});
}
