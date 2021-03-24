import { BaseComponent } from "../component.js";
export class VideoCompoent extends BaseComponent {
    constructor(title, url) {
        super(`<section class="video">
    <div class="video__holder">
      <iframe class="video__thumbnail"></iframe>
    </div>
    <p class="video__title"></p>
  </section>`);
        const videoElement = this.element.querySelector('.video__thumbnail');
        videoElement.src = url;
        const titleElement = this.element.querySelector('.video__title');
        titleElement.textContent = title;
    }
}
