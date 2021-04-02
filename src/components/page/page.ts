import { BaseComponent, Component } from "./component.js";

export interface Composable {
  addChild(child: Component):void;
}

type OncloseListener = () => void;
type DragState = 'start' | 'stop' | 'enter' | 'leave';
type OnDragStateListener <T extends Component> = (target: T, state: DragState) =>void; //T는 어떤것이든 되는데 컴포넌트를 상속해야만함.
interface SectionContainer extends Component,Composable { //여러가지 자식들을 함께 추가해주는 composable
  setOnCloseListener(listener: OncloseListener):void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>):void;
}

type SectionContainerConstructor = {
  new(): SectionContainer; //생성자를 정의하는 타입
}

export class PageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer {
  private closeListener?: OncloseListener;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;
  constructor() {
    super(
      `<li draggable="true" class="page-item">
      <section class="page-item__body"></section>
      <div class="page-item__controls">
        <button class="close">&times;</button>
      </div>
    </li>`);
    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener(); //this.closeListener가 있으면 close함수 호출
    };

    this.element.addEventListener('dragstart',(event: DragEvent) => {
      this.onDragStart(event);
    });
    this.element.addEventListener('dragend',(event: DragEvent) => {
      this.onDragEnd(event);
    });
    this.element.addEventListener('dragenter',(event: DragEvent) => {
      this.onDragEnter(event);
    });
    this.element.addEventListener('dragleave',(event: DragEvent) => {
      this.onDragLeave(event);
    });
  }

  onDragStart(_: DragEvent) {
    this.notifyDragObservers('start'); 
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragObservers('stop');
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragObservers('enter');
  }
  onDragLeave(_: DragEvent) {
    this.notifyDragObservers('leave');
  }

  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this,state);
  }

  addChild(child: Component) {
    const container= this.element.querySelector('.page-item__body')! as HTMLElement;
    child.attachTo(container);
  }
  setOnCloseListener(listener: OncloseListener) {
    this.closeListener = listener;
  }
  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>){
    this.dragStateListener = listener;
    
  }
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
    constructor(private pageItemConstructor: SectionContainerConstructor){
    super('<ul class="page"></ul>');
    this.element.addEventListener('dragover',(event: DragEvent) => {
      this.onDragOver(event);
    });
    this.element.addEventListener('dragend',(event: DragEvent) => {
      this.onDragEnd(event);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); //drag 오류방지를 위한 선언
    console.log('onDragOver');
  };
  onDragEnd(event: DragEvent) {
    event.preventDefault(); //drag 오류방지를 위한 선언
    console.log('onDragEnd');
  };
  
  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
    });
    item.setOnDragStateListener((target: SectionContainer, state: DragState) => {
      console.log(target,state);
    });
  }
}