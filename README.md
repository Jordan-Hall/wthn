# WTHN - A Lightweight Web Component Framework **Why The Hell Not**

WTHN is a minimalist framework designed to provide the power of modern web components without the overhead. It offers a unique blend of data binding, reactive programming, and component-based architecture. Inspired by libraries like HTMX and Angular (kinda), WTHN aims to be a lightweight alternative for smaller applications or when performance is crucial.

## Features:

- **Attribute-Driven**: Easily bind JavaScript to your HTML with data attributes.
- **Reactivity**: Built-in support for observables. - You bring any Obserivable library such as RXJS and we will support it in some built in modules
- **Directives**: Utilize built-in directives like `wthn-for` and `wthn-if` for dynamic content.
- **Swappable Components**: Inspired by HTMX, swap parts of the page with fresh content seamlessly.
- **No Dependencies**: The core of CustomJS doesn't rely on external libraries, keeping it lightweight and fast.

## Getting Started:

### Bind Component to HTML:

Using the `wthn-init` and `wthn-component` attributes, you can associate your JavaScript with the HTML.

```html
<div wthn-init wthn-component="SomeComponent">
  <!-- ... -->
</div>
```

### 4. Use Directives:

Directives like `wthn-for` and `wthn-if` allow for dynamic content rendering.

```html
<ul wthn-component="ListComponent">
  <li wthn-for="user in users">{{ user.name }}</li>
</ul>
```

### 5. Reactivity:

WTHN supports observables for reactive programming. If a property in your component is an observable, the framework will react to changes in its value.

```javascript
class ListComponent {
  constructor() {
    this.users = new BehaviorSubject([]);
  }

  addUser(user) {
    const currentUsers = this.users.value;
    currentUsers.push(user);
    this.users.next(currentUsers);
  }
}
```

## Contributing:

We welcome contributions! If you find a bug or have a feature request, please create an issue. Pull requests are also appreciated.

## License:

WTHN is licensed under the I DON'T GIVE A F\*\*\* LICENSE (IDGAF-1.0).
