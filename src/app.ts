import { TodoComponent } from './components/page/item/todo.js';
import { NoteComponent } from './components/page/item/note.js';
import { ImageComponent } from './components/page/item/image.js';
import { VideoCompoent } from './components/page/item/video.js';
import { PageComponent } from "./components/page/page.js";

class App {
  private readonly page: PageComponent;
  
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.page.attachTo(appRoot);

    const image = new ImageComponent('Image Title', 'https://picsum.photos/600/300');
    image.attachTo(appRoot, 'beforeend');

    const video = new VideoCompoent('Video Title','https://www.youtube.com/embed/Nb5u2vcVxVs?start=12');
    video.attachTo(appRoot, 'beforeend');

    const note = new NoteComponent('Note Title', 'Note boty');
    note.attachTo(appRoot, 'beforeend');

    const todo = new TodoComponent('Todo Title', 'Todo item');
    todo.attachTo(appRoot, 'beforeend');
  }
}

new App(document.querySelector('.document')! as HTMLElement)