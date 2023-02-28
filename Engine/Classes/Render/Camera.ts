import { Actor } from "../Entity/Actor.js";
import { ProjectionMatrix } from "../Math/ProjectionMatrix.js";
import { Sky } from "./Sky.js";
import { Renderer } from "./Renderer.js";

export class Camera extends Actor
{
    protected fov: number;
    protected near: number;
    protected far: number;

    protected sky: Sky;

    private projectionMatrix: ProjectionMatrix;
    private projectionMatrixBuffer: GPUBuffer | null;

    public setFov(fov: number)
    {
        this.fov = fov;
        this.onChange();
    }

    private renderer: Renderer;

    public constructor()
    {
        super();
        this.renderer = new Renderer(this.onChange.bind(this));

        this.fov = 60.0;
        this.near = 0.01;
        this.far = 1000.0;

        this.sky = new Sky();

        this.projectionMatrix = this.setupProjectionMatrix();
        this.projectionMatrixBuffer = null;
    }

    private onChange()
    {
        this.projectionMatrix = this.setupProjectionMatrix();
        this.projectionMatrixBuffer = null;
    }

    private setupProjectionMatrixBuffer(device: GPUDevice): GPUBuffer
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

    private setupProjectionMatrix(): ProjectionMatrix
    {
        let canvas = this.renderer.getUsedCanvas().getCanvas();
        return new ProjectionMatrix(this.fov * (Math.PI / 180.0), canvas.width / canvas.height, this.near, this.far);
    }

    public getProjectionMatrixBuffer(device: GPUDevice): GPUBuffer
    {
        if(!this.projectionMatrixBuffer)
            this.projectionMatrixBuffer = this.setupProjectionMatrixBuffer(device);
        return this.projectionMatrixBuffer;
    }

    public override update(deltaTime: number): void 
    {
        this.renderer.render(Actor.getActors(), this, this.sky);
    }

    public override render(device: GPUDevice, passEncoder: GPURenderPassEncoder, camera: Camera): void {
        return;
    }

    public getRenderer(): Renderer
    {
        return this.renderer;
    }

    public getProjectionMatrix(): ProjectionMatrix
    {
        return this.projectionMatrix;
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