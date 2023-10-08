import { DIContainer } from './di.js';
import { isDomObj } from '../utils/is-dom-element.js';
/**
 * @export
 * @class AutoInitContainer
 */
export class AutoInitContainer {
  /**
   * @type {AutoInitContainer}
   * @private
   * @memberof AutoInitContainer
   */
  static #instance;

  /**
   *
   * @type {DIContainer}
   * @memberof VideoExperience
   */
  #jsContainer;

  constructor() {
    this.#jsContainer = DIContainer.singleton();
  }

  /**
   *
   *
   * @returns
   * @memberof AutoInitContainer
   */
  get(obj) {
    if (isDomObj(obj)) {
      const aaUUID = obj.getAttribute('data-uuid');
      return this.#jsContainer.get(aaUUID);
    } else {
      return this.#jsContainer.get(obj);
    }
  }

  /**
   * internal use only. Do not use
   * @ignore
   * @param {string} name
   * @param {any} instance
   * @memberof AutoInitContainer
   */
  set(instance, name) {
    this.#jsContainer.add(name, instance);
  }

  /**
   *
   * @static
   * @returns {AutoInitContainer}
   * @memberof AutoInitContainer
   */
  static singleton() {
    if (!this.#instance) {
      this.#instance = new this();
    }
    return this.#instance;
  }

  /**
   * @readonly
   * @static
   * @memberof AutoInitContainer
   * @returns {AutoInitContainer}
   */
  static get instance() {
    return this.singleton();
  }
}
