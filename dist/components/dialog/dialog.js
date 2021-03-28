import { BaseComponent } from "../page/component.js";
export class InputDialog extends BaseComponent {
    constructor() {
        super(`<section class="dialog">
      <button class="close">&times;</button>
      <div id="dialog__body"></div>
      <button class="dialog__submit">ADD</button>
    </section>`);
        const closeBtn = this.element.querySelector('.close');
        closeBtn.onclick = () => {
            this.closeListener && this.closeListener();
        };
        const submitBtn = this.element.querySelector('.dialog__submit');
        submitBtn.onclick = () => {
            this.submitListener && this.submitListener();
        };
    }
    setOncloseListener(listener) {
        this.closeListener = listener;
    }
    setOnsubmitListener(listener) {
        this.submitListener = listener;
    }
    addChild(child) {
        const body = this.element.querySelector('.dialog__body');
        child.attachTo(body);
    }
}
