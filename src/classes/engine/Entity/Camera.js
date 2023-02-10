import { ProjectionMatrix } from "../Math/ProjectionMatrix.js";
import { Vector3 } from "../Math/Vector3.js";
import { Renderer } from "../Render/Renderer.js";
import { Actor } from "./Actor.js";
export class Camera extends Actor {
    setFov(fov) {
        this.fov = fov;
    }
    constructor() {
        super();
        Camera.Cameras.push(this);
        this.fov = 90.0;
        this.near = 0.1;
        this.far = 1000.0;
        this.renderer = new Renderer();
        this.transform.setLocation(new Vector3(0.0, 0.0, -2.0));
    }
    update() {
        this.renderer.render(Actor.getActors(), this);
    }
    getRenderer() {
        return this.renderer;
    }
    getProjectionMatrix() {
        let canvas = this.renderer.getRenderingCanvas().getCanvas();
        return new ProjectionMatrix(this.fov * (Math.PI / 180.0), canvas.width / canvas.height, this.near, this.far);
    }
    getNear() {
        return this.near;
    }
    getFar() {
        return this.far;
    }
    getFov() {
        return this.fov;
    }
}
Camera.Cameras = [];
