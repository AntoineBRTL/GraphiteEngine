import { Actor } from "../Entity/Actor.js";
import { ProjectionMatrix } from "../Math/ProjectionMatrix.js";
import { WebGPURenderer } from "./WebGPURender.js";

export class WebGPUCamera extends Actor
{
    protected fov: number;
    protected near: number;
    protected far: number;

    public setFov(fov: number)
    {
        this.fov = fov;
    }

    private renderer: WebGPURenderer;

    public constructor()
    {
        super();
        this.renderer = new WebGPURenderer();

        this.fov = 60.0;
        this.near = 0.01;
        this.far = 100.0;
    }

    /** TODO: OPTIMISATION, PROJECTION MATRIX IS COMPUTED MORE THAN ONE TIME PER FRAME */
    public getProjectionMatrixBuffer(device: GPUDevice): GPUBuffer
    {
        let matrix = this.getProjectionMatrix();
        let buffer = device.createBuffer(
            {
                size: matrix.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            }
        );
        device.queue.writeBuffer(buffer, 0, matrix);

        return buffer;
    }

    public override update(deltaTime: number): void 
    {
        this.renderer.render(Actor.getActors(), this);
    }

    public override render(device: GPUDevice, passEncoder: GPURenderPassEncoder, camera: WebGPUCamera): void 
    {
        return;
    }

    public getRenderer(): WebGPURenderer
    {
        return this.renderer;
    }

    public getProjectionMatrix(): ProjectionMatrix
    {
        let canvas = this.renderer.getUsedCanvas().getCanvas();
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