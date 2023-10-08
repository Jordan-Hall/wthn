export class DIContainer {
  /**
   * @type {DIContainer}
   * @private
   * @memberof DIContainer
   */
  static #instance;

  #container = {};

  constructor() {
    this.#container = new Map();
  }

  get(uuid) {
    const instance = this.#container[uuid];
    return instance;
  }

  add(uuid, instance) {
    this.#container[uuid] = instance;
  }

  /**
   *
   *
   * @static
   * @returns {DIContainer}
   * @memberof DIContainer
   */
  static singleton() {
    if (!this.#instance) {
      this.#instance = new this();
    }
    return this.#instance;
  }

  /**
   *
   *
   * @static
   * @returns {DIContainer}
   * @memberof DIContainer
   */
  static get instance() {
    return this.singleton();
  }
}
