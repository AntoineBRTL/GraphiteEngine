export class RenderingCanvas {
    constructor() {
        this.canvas = document.createElement('canvas');
    }
    displayCanvas() {
        document.body.appendChild(this.canvas);
        document.body.style.margin = '0px';
        document.body.style.padding = '0px';
    }
    generateGlContext() {
        return this.canvas.getContext("webgl2");
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    getCanvas() {
        return this.canvas;
    }
}
