import { Camera } from "./Camera.js";
import { Material } from "./Material.js";
import { Mesh } from "./Mesh.js";

export class Renderable
{
    private static renderables: Array<Renderable> = new Array<Renderable>();

    public static getRenderables(): Array<Renderable>
    {
        return this.renderables;
    }

    private mesh?: Mesh;
    private material?: Material;
    private addToRenderList: boolean;
    private isRenderable: boolean;

    public constructor(material?: Material, mesh?: Mesh, addToRenderList: boolean = true)
    {
        this.mesh               = mesh;
        this.material           = material;
        this.addToRenderList    = addToRenderList;
        this.isRenderable       = false;
        this.init();
    }

    public render(device: GPUDevice, passEncoder: GPURenderPassEncoder, camera: Camera): void
    {
        let pipeline: GPURenderPipeline;
        let vertexBuffer: GPUBuffer;

        pipeline                = this.getMaterial().getRenderPipeline(camera.getRenderer());
        vertexBuffer            = this.getMesh().getVertexBuffer(device);

        camera.getRenderer().draw(passEncoder, pipeline, this.getMesh(), vertexBuffer);
    }

    private async init()
    {
        await this.start();
        
        this.isRenderable = true;
        if(this.addToRenderList)
            Renderable.renderables.push(this);
    }

    protected async start()
    {
        return;
    }

    public getMesh(): Mesh
    {
        if(!this.mesh) throw new Error("Trying to access mesh before initialization");
        return this.mesh;
    }

    public getMaterial(): Material
    {
        if(!this.material) throw new Error("Trying to access material before initialization");
        return this.material;
    }

    public getIsRenderable(): boolean
    {
        return this.isRenderable;
    }

    protected setMesh(mesh: Mesh): void
    {
        this.mesh = mesh;
    }

    protected setMaterial(material: Material): void
    {
        this.material = material;
    }
}