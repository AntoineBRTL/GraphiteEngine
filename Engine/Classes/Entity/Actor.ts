import { Transform } from "../Math/Transform.js";
import { WebGPUCamera } from "../Render/WebGPUCamera.js";
import { WebGPUMaterial } from "../Render/WebGPUMaterial.js";
import { WebGPUMesh } from "../Render/WebGPUMesh.js";

export class Actor
{
    private static actors: Array<Actor> = new Array<Actor>();

    protected transform: Transform;
    private mesh: WebGPUMesh;
    private material: WebGPUMaterial;

    public constructor()
    {
        Actor.actors.push(this);

        this.transform  = new Transform();
        this.mesh       = new WebGPUMesh();
        this.material   = new WebGPUMaterial();
    }
    
    public update(deltaTime: number): void {};

    public render(device: GPUDevice, passEncoder: GPURenderPassEncoder, camera: WebGPUCamera): void
    {
        let pipeline: GPURenderPipeline;
        let vertexBuffer: GPUBuffer;
        let mActorBuffer: GPUBuffer;
        let mViewBuffer: GPUBuffer;
        let mProjBuffer: GPUBuffer;
        let mActorRotBuffer: GPUBuffer;
        let uniformBindingGroup: GPUBindGroup;

        pipeline                = this.material.getRenderPipeline(camera.getRenderer());
        vertexBuffer            = this.mesh.getVertexBuffer(device);
        mActorBuffer            = camera.getRenderer().toUniformGPUBuffer(device, this.transform.getTransformationMatrix());
        mViewBuffer             = camera.getRenderer().toUniformGPUBuffer(device, camera.getTransform().getViewTransformationMatrix());
        mProjBuffer             = camera.getProjectionMatrixBuffer(device);
        mActorRotBuffer         = camera.getRenderer().toUniformGPUBuffer(device, this.transform.getRotationMatrix());
        uniformBindingGroup     = camera.getRenderer().setupUniformBindGroup(device, pipeline, 0, mActorBuffer, mViewBuffer, mProjBuffer, mActorRotBuffer);

        camera.getRenderer().draw(passEncoder, pipeline, this.mesh, vertexBuffer, uniformBindingGroup);
    }

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