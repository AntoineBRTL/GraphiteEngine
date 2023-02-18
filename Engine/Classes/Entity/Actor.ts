import { Transform } from "../Math/Transform.js";
import { WebGPUMaterial } from "../Render/WebGPUMaterial.js";
import { WebGPUMesh } from "../Render/WebGPUMesh.js";
import { WebGPURenderer } from "../Render/WebGPURender.js";

export class Actor
{
    private static actors: Actor[] = [];

    protected transform: Transform;
    private mesh: WebGPUMesh;
    private material: WebGPUMaterial;

    public constructor()
    {
        Actor.actors.push(this);

        this.transform = new Transform();
        this.mesh = new WebGPUMesh();
        this.material = new WebGPUMaterial();
    }
    
    public update(): void {};

    public static getActors(): Actor[]
    {
        return Actor.actors;
    }

    public getMesh(): WebGPUMesh
    {
        return this.mesh;
    }

    public getMaterial(): WebGPUMaterial
    {
        return this.material;
    }

    public getTransform(): Transform
    {
        return this.transform;
    }

    protected setMesh(mesh: WebGPUMesh): void
    {
        this.mesh = mesh;
    }

    protected setMaterial(material: WebGPUMaterial): void
    {
        this.material = material;
    }
}