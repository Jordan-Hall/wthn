/**
 * @param {any} o
 * @returns {boolean}
 */
export function isNode(o) {
  return typeof Node === 'object'
    ? o instanceof Node
    : o &&
        typeof o === 'object' &&
        typeof o.nodeType === 'number' &&
        typeof o.nodeName === 'string';
}

/**
 * @param {any} o
 * @returns {boolean}
 */
export function isElement(o) {
  return typeof HTMLElement === 'object'
    ? o instanceof HTMLElement //DOM2
    : o &&
        typeof o === 'object' &&
        o !== null &&
        o.nodeType === 1 &&
        typeof o.nodeName === 'string';
}

/**
 * @param {any} o
 * @returns {boolean}
 */
export function isDomObj(o) {
  return isElement(o) || isNode(o);
}
