export interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void; //등록함수
  removeFrom(parent: HTMLElement):void;
  attach(component: Component, position?: InsertPosition): void; //전달받은 컴포넌트를 나 자신 안에다가 붙이는 역할
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

  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin' ) { //랜더링시켜주기
    parent.insertAdjacentElement(position,this.element);
  }
  removeFrom(parent: HTMLElement) {
    if(parent !== this.element.parentElement) { //부모가 맞다면 remove해주기.
      throw new Error('parent mismatch');
    }
    parent.removeChild(this.element); //자신 제거
  }
  attach(component: Component, position?: InsertPosition) {
    component.attachTo(this.element, position);
  }


}