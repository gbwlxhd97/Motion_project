export interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
}

/*
캡슐화 htmlelement를 만드는것을 캡슐화
*/

export class BaseComponent<T extends HTMLElement> implements Component {
  protected readonly element: T;
  constructor(htmlString: string) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    this.element = template.content.firstElementChild! as T;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin' ) {
    parent.insertAdjacentElement(position,this.element);
  }
}