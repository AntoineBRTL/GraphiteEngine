import { Vector3 } from "../Math/Vector3.js";
import { Thread } from "./Thread.js";

export class Input
{
    private keyPress: string[];
    private keyDown: string[];
    private keyUp: string[];

    private thread: Thread;

    private mousePosition: Vector3;

    public constructor(thread: Thread)
    {
        this.keyPress = [];
        this.keyDown = [];
        this.keyUp = [];

        window.addEventListener('keydown', function(this:Input, e: KeyboardEvent)
        {
            if(!this.keyDown.includes(e.key) && !this.keyPress.includes(e.key))
                this.keyDown.push(e.key);
        }.bind(this));

        window.addEventListener('keyup', function(this:Input, e: KeyboardEvent)
        {
            this.keyPress = this.keyPress.filter(function(key){return key != e.key;});
            this.keyDown = this.keyDown.filter(function(key){return key != e.key;});
            this.keyUp = this.keyUp.filter(function(key){return key != e.key;});
            this.keyUp.push(e.key);
        }.bind(this));

        this.thread = thread;
        this.thread.launch();
        this.thread.onTick = this.inputTick.bind(this);

        this.mousePosition = new Vector3();

        window.addEventListener('mousemove', function(this:Input, e: MouseEvent)
        {
            this.mousePosition = new Vector3(e.screenX, e.screenY, 0.0);
        }.bind(this));
    }

    public getKeyDown(key: string): boolean
    {
        return this.keyDown.includes(key);
    }

    public getKeyPress(key: string): boolean
    {
        return this.keyPress.includes(key);
    }

    public getKeyUp(key: string): boolean
    {
        return this.keyUp.includes(key);
    }

    public getMousePosition(): Vector3
    {
        return this.mousePosition;
    }

    private inputTick()
    {
        this.keyPress.push(...this.keyDown);
        this.keyDown = new Array();
        this.keyUp = new Array();
    }
}