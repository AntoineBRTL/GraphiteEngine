import { Vector3 } from "../Math/Vector3.js";
export class InputSystem {
    constructor(thread) {
        this.keyPress = [];
        this.keyDown = [];
        this.keyUp = [];
        window.addEventListener('keydown', function (e) {
            if (!this.keyDown.includes(e.key) && !this.keyPress.includes(e.key))
                this.keyDown.push(e.key);
        }.bind(this));
        window.addEventListener('keyup', function (e) {
            this.keyPress = this.keyPress.filter(function (key) { return key != e.key; });
            this.keyDown = this.keyDown.filter(function (key) { return key != e.key; });
            this.keyUp = this.keyUp.filter(function (key) { return key != e.key; });
            this.keyUp.push(e.key);
        }.bind(this));
        this.thread = thread;
        this.thread.onInputTick = this.inputTick.bind(this);
        this.mousePosition = new Vector3();
        window.addEventListener('mousemove', function (e) {
            this.mousePosition = new Vector3(e.screenX, e.screenY, 0.0);
        }.bind(this));
    }
    getKeyDown(key) {
        return this.keyDown.includes(key);
    }
    getKeyPress(key) {
        return this.keyPress.includes(key);
    }
    getKeyUp(key) {
        return this.keyUp.includes(key);
    }
    getMousePosition() {
        return this.mousePosition;
    }
    inputTick() {
        this.keyPress.push(...this.keyDown);
        this.keyDown = new Array();
        this.keyUp = new Array();
    }
}
