import { Actor } from "../Entity/Actor.js";
import { Thread } from "./Thread.js";

export class Engine
{
    private thread: Thread;

    public constructor(thread: Thread)
    {
        this.thread = thread;
        this.thread.onTick = this.update.bind(this);
        this.thread.launch();
    }

    private update(): void
    {
        let actors: Array<Actor>;
        actors = Actor.getActors();

        for(let actor of actors) actor.update();
    }

    public getThread(): Thread
    {
        return this.thread;
    }
}