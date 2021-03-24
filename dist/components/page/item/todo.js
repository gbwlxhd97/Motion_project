import { BaseComponent } from "../component.js";
export class TodoComponent extends BaseComponent {
    constructor(title, todo) {
        super(`
      <section class="todo">
  <h2 class="todo__title"></h2>
  <input type="checkbox" class="todo_checkbox">
</section> `);
        const titleElement = this.element.querySelector('.todo__title');
        titleElement.textContent = title;
        const todoElement = this.element.querySelector('.todo_checkbox');
        todoElement.insertAdjacentText('afterend', todo);
    }
}
