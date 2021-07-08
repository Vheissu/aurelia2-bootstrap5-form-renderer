import { DOM } from '@aurelia/runtime';

import { ValidationResult } from '@aurelia/validation';

import {
  ValidationEvent,
  ValidationResultsSubscriber,
  ValidationResultTarget,
} from '@aurelia/validation-html';

export class BootstrapPresenterService implements ValidationResultsSubscriber {
  public handleValidationEvent(event: ValidationEvent): void {
    for (const [target, results] of this.reverseMap(event.removedResults)) {
      this.remove(target, results);
    }

    for (const [target, results] of this.reverseMap(event.addedResults)) {
      this.add(target, results);
    }
  }

  public remove(target: Element, results: ValidationResult[]): void {
    target.classList.remove('is-invalid');

    for (const result of results) {
        const error = target.parentElement.querySelector(`#validation-message-${result.id}`);

        if (error) {
            error.remove();
        }
    }
  }

  public add(target: Element, results: ValidationResult[]): void {
    let container = target.parentElement.querySelector('.invalid-feedback');

    if (!container) {
      container = document.createElement('div');
      container.classList.add('invalid-feedback');
    }

    for (const result of results) {
      if (!result.valid) {
        target.classList.add('is-invalid');

        const message = document.createElement('span');
        message.textContent = result.message;
        message.id = `validation-message-${result.id}`;

        container.appendChild(message);
      }
    }

    if (container.children.length) {
      target.after(container);
    }
  }

  private reverseMap(results: ValidationResultTarget[]) {
    const map = new Map<Element, ValidationResult[]>();
    for (const { result, targets } of results) {
      for (const target of targets) {
        let targetResults = map.get(target);
        if (targetResults === void 0) {
          map.set(target, (targetResults = []));
        }
        targetResults.push(result);
      }
    }
    return map;
  }
}
