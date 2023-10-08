import { isObservable } from '@wthn/utils';
export class IfElseDirective {
  constructor(mainElement, instanceContext) {
    this.mainElement = mainElement;
    this.instance = instanceContext;
    this.subscription = null;

    this.handleCondition();
  }

  handleCondition() {
    const ifCondition = this.evaluateExpression(
      this.mainElement.getAttribute('wthn-if')
    );

    let sibling = this.mainElement.nextElementSibling;
    const elseIfConditions = [];
    while (sibling) {
      if (sibling.hasAttribute('wthn-else-if')) {
        elseIfConditions.push(sibling);
      } else if (
        sibling.hasAttribute('wthn-if') ||
        sibling.hasAttribute('wthn-else')
      ) {
        break;
      }
      sibling = sibling.nextElementSibling;
    }

    const elseElement =
      sibling && sibling.hasAttribute('wthn-else') ? sibling : null;

    if (isObservable(ifCondition)) {
      this.subscription = ifCondition.subscribe((value) => {
        this.processConditions(value, elseIfConditions, elseElement);
      });
    } else {
      this.processConditions(ifCondition, elseIfConditions, elseElement);
    }
  }

  processConditions(ifCondition, elseIfConditions, elseElement) {
    if (ifCondition) {
      this.showElement(this.mainElement);
      elseIfConditions.forEach((el) => this.hideElement(el));
      if (elseElement) this.hideElement(elseElement);
    } else if (elseIfConditions.length) {
      let conditionMet = false;
      for (let el of elseIfConditions) {
        if (this.evaluateExpression(el.getAttribute('wthn-else-if'))) {
          this.showElement(el);
          conditionMet = true;
          break;
        } else {
          this.hideElement(el);
        }
      }
      if (!conditionMet && elseElement) {
        this.showElement(elseElement);
      }
    } else if (elseElement) {
      this.showElement(elseElement);
    }
  }

  evaluateExpression(expression) {
    try {
      const functionBody = `
              with (this) {
                  return ${expression};
              }
          `;
      return new Function(functionBody).call(this.instance);
    } catch (error) {
      console.warn('Failed to evaluate expression:', expression, error);
      return false;
    }
  }

  showElement(element) {
    element.style.display = '';
  }

  hideElement(element) {
    element.style.display = 'none';
  }

  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
