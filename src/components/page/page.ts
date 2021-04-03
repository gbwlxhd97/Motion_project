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
  muteChildren(state: 'mute' | 'unmute'): void;
  getBoundingRect(): DOMRect;
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
  muteChildren(state: 'mute' | 'unmute') {
    if(state === 'mute') {
      this.element.classList.add('mute-children');
    } else  {
      this.element.classList.remove('mute-children')
    }
  }

  getBoundingRect():DOMRect {
    return this.element.getBoundingClientRect();
  }
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
  private children = new Set<SectionContainer>();
  private dropTarget?: SectionContainer;  
  private dragTarget?: SectionContainer;

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
    //여기에서 위치 변경
    if(!this.dropTarget) {
      return;
    }
    if(this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();
      this.dragTarget.removeFrom(this.element); //this.elememt는 현재 페이지
      this.dropTarget.attach(this.dragTarget, dropY < srcElement.y? 'beforebegin': 'afterend');
    }
  };
  
  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragStateListener((target: SectionContainer, state: DragState) => {
      switch(state) {
        case 'start':
          this.dragTarget = target;
          this.updateSections('mute');
          break;
        case 'stop':
          this.dragTarget = undefined;
          this.updateSections('unmute');
          break;
        case 'enter':
          console.log('enter', target);
          this.dropTarget = target;
          break;
        case 'leave':
          console.log('leave', target);
          this.dropTarget = undefined;
          break
        default:
          throw new Error(`unsupported state ${state}`);
      }
    });
  }

  private updateSections(state: 'mute' | 'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state); //이동할떄 이동된 아이템제외 나머지는 작동하지않게 해주기
    })
  }
}