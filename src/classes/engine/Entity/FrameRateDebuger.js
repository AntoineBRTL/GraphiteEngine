import { Actor } from "./Actor.js";
export class FrameRateDebuger extends Actor {
    constructor(thread) {
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
    update() {
        this.div.innerHTML = (1.0 / this.thread.getDeltaTime()).toFixed(1).toString();
    }
}
