import { ProjectionMatrix } from "../Math/ProjectionMatrix.js";
import { Vector3 } from "../Math/Vector3.js";
import { Renderer } from "../Render/Renderer.js";
import { Actor } from "./Actor.js";

export class Camera extends Actor
{
    private static Cameras: Camera[] = [];

    protected fov: number;
    protected near: number;
    protected far: number;

    protected renderer: Renderer;

    public setFov(fov: number)
    {
        this.fov = fov;
    }

    public constructor()
    {
        super();
        Camera.Cameras.push(this);

        this.fov = 90.0;
        this.near = 0.1;
        this.far = 1000.0;
        this.renderer = new Renderer();

        this.transform.setLocation(new Vector3(0.0, 0.0, -2.0));
    }

    public override update(): void
    {
        this.renderer.render(Actor.getActors(), this);    
    }

    public getRenderer(): Renderer
    {
        return this.renderer;
    }

    public getProjectionMatrix(): ProjectionMatrix
    {
        let canvas = this.renderer.getRenderingCanvas().getCanvas();
        return new ProjectionMatrix(this.fov * (Math.PI / 180.0), canvas.width / canvas.height, this.near, this.far);
    }

    public getNear(): number
    {
        return this.near;
    }

    public getFar(): number
    {
        return this.far;
    }

    public getFov(): number
    {
        return this.fov;
    }
}