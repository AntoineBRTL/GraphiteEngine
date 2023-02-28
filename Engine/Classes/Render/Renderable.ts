import { Transform } from "../Math/Transform.js";
import { Camera } from "./Camera.js";
import { Material } from "./Material.js";
import { Mesh } from "./Mesh.js";

export class Renderable
{
    protected mesh: Mesh;
    protected material: Material;

    public constructor(mesh: Mesh, material: Material)
    {
        this.mesh       = mesh;
        this.material   = material;
    }

    public render(device: GPUDevice, passEncoder: GPURenderPassEncoder, camera: Camera): void
    {
        let pipeline: GPURenderPipeline;
        let vertexBuffer: GPUBuffer;

        pipeline                = this.material.getRenderPipeline(camera.getRenderer());
        vertexBuffer            = this.mesh.getVertexBuffer(device);

        camera.getRenderer().draw(passEncoder, pipeline, this.mesh, vertexBuffer);
    }

    public getMesh(): Mesh
    {
        return this.mesh;
    }

    public getMaterial(): Material
    {
        return this.material;
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