import { TodoComponent } from './components/page/item/todo.js';
import { NoteComponent } from './components/page/item/note.js';
import { ImageComponent } from './components/page/item/image.js';
import { VideoCompoent } from './components/page/item/video.js';
import { PageComponent, PageItemComponent } from "./components/page/page.js";
import { InputDialog } from './components/dialog/dialog.js';
class App {
    constructor(appRoot) {
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);
        const image = new ImageComponent('Image Title', 'https://picsum.photos/600/300');
        this.page.addChild(image);
        const video = new VideoCompoent('Video Title', 'https://www.youtube.com/embed/Nb5u2vcVxVs?start=12');
        this.page.addChild(video);
        const note = new NoteComponent('Note Title', 'Note boty');
        this.page.addChild(note);
        const todo = new TodoComponent('Todo Title', 'Todo item');
        this.page.addChild(todo);
        const imageBtn = document.querySelector('#new-image');
        imageBtn.addEventListener('click', () => {
            const dialog = new InputDialog();
            dialog.setOncloseListener(() => {
                dialog.removeFrom(document.body);
            });
            dialog.setOnsubmitListener(() => {
                dialog.removeFrom(document.body);
            });
            dialog.attachTo(document.body);
        });
    }
}
new App(document.querySelector('.document'));
