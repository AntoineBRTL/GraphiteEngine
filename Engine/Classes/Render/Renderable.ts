import DefaultFrag from "../../Shader/Default.frag.js";
import DefaultVert from "../../Shader/Default.vert.js";
import { Engine } from "../Core/Engine.js";
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

    private mesh: Mesh;
    private material: Material;
    private isRenderable: boolean;

    public constructor()
    {
        this.mesh               = new Mesh();
        this.material           = new Material(DefaultVert, DefaultFrag);
        this.isRenderable       = false;

        Renderable.renderables.push(this);
    }

    public render(passEncoder: GPURenderPassEncoder, camera: Camera): void
    {
        let pipeline: GPURenderPipeline;
        let vertexBuffer: GPUBuffer;

        pipeline                = this.getMaterial().getRenderPipeline();
        vertexBuffer            = this.getMesh().getVertexBuffer();

        Engine.getRenderer().draw(passEncoder, pipeline, this.getMesh(), vertexBuffer);
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