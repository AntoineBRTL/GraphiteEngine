import { Actor } from "../Entity/Actor.js";
export class Engine {
    constructor(thread) {
        this.thread = thread;
        this.thread.launch();
        this.thread.onTick = this.update.bind(this);
    }
    update() {
        let actors = Actor.getActors();
        for (let actor of actors) {
            actor.update();
        }
    }
    getThread() {
        return this.thread;
    }
}
