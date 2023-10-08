# Why The Hell Not Library/Framework

## Example

### functional with HTML binding

```js
import { AutoInitContainer } from '@wthn/ioc';
import { autoInit } from 'wthn';
// we set up the IOC container
// create http instance
const container = AutoInitContainer.instance;

// mock HttpClient
class HttpClient {}
container.set(new HttpClient(), config.httpInstanceId);
```

In the folder components: popover.js

```js
export function init(element) {
  return {
    afterContruct: () => {},
    afterInit: () => {
      console.log('Popover initialized!');
    },
    handleClick: (event) => {
      console.log('Popover button clicked!', event);
    },
    handleMouseOver: (event) => {
      console.log('Button was hovered over!', event);
    },
    // ... add more functions as needed
  };
}
```

```js
autoInit();
```

html template

```html
<div wthn-init wthn-component="Popover">
  <button ev-click="handleClick">Toggle Popover</button>
  <div>Popover Content</div>
  <div>
    <button ev-mouseover="handleMouseOver">Hover over me</button>
  </div>
</div>
```

### Class base

```js
import { HTMLElementComponent } from 'wthn';

export class GameMatchComponent extends HTMLElementComponent {
  get gameId() {
    return this.getAttribute('game-id');
  }

  /**
   * @param {string} name
   * @param {*} oldValue
   * @param {*} newValue
   * @memberof GameMComponentatch
   */
  attributeChangedCallback(name, oldValue, newValue) {}

  connectedCallback() {
    return `<h1>HELLO WORLD</h1>`;
  }
}
```
