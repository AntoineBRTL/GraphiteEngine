import { Actor } from "../Entity/Actor.js";
import { Renderer } from "../Render/Renderer.js";
import { InputSystem } from "./InputSystem.js";
import { Thread } from "./Thread.js";

export class Engine
{
    private thread: Thread;

    public constructor(thread: Thread)
    {
        this.thread = thread;
        this.thread.launch();
        this.thread.onTick = this.update.bind(this);
    }

    private update(): void
    {
        let actors = Actor.getActors();

        for(let actor of actors)
        {
            actor.update();
        }
    }

    public getThread(): Thread
    {
        return this.thread;
    }
}