import { Thread } from "../Core/Thread.js";
import { Actor } from "./Actor.js";

export class FrameRateDebuger extends Actor
{
    private thread: Thread;
    private div: HTMLDivElement;

    public constructor(thread: Thread)
    {
        super();
        this.thread = thread;

        this.div = document.createElement("div");
        this.div.style.position = "absolute";
        this.div.style.left = "0px";
        this.div.style.top = "0px";
        this.div.style.padding = "5px";
        this.div.style.backgroundColor = "#000";
        this.div.style.color = "#fff";
        this.div.style.fontFamily = "sans-serif";
        this.div.style.fontSize = "12px";
        document.body.appendChild(this.div);
    }

    public override update(): void 
    {
        this.div.innerHTML = (1.0 / this.thread.getDeltaTime()).toFixed(1).toString();
    }
}