import { BaseComponent } from "../component.js";

export class TodoComponent extends BaseComponent<HTMLElement>{
  constructor(title: string, todo: string) {
    super(
      `
      <section class="todo">
  <h2 class="todo__title"></h2>
  <input type="checkbox" class="todo_checkbox">
</section> `
    );

  const titleElement = this.element.querySelector('.todo__title')! as HTMLHeadElement;
  titleElement.textContent = title;
  const todoElement = this.element.querySelector('.todo_checkbox')! as HTMLInputElement;
  todoElement.insertAdjacentText('afterend',todo);
}
}
