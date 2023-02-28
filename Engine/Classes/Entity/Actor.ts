import { Transform } from "../Math/Transform.js";
import { Camera } from "../Render/Camera.js";
import { Material } from "../Render/Material.js";
import { Mesh } from "../Render/Mesh.js";
import { Renderable } from "../Render/Renderable.js";

export class Actor extends Renderable
{
    private static actors: Array<Actor> = new Array<Actor>();

    protected transform: Transform;

    public constructor()
    {
        super(new Mesh(), new Material());

        Actor.actors.push(this);

        this.transform  = new Transform();
    }
    
    public update(deltaTime: number): void {};

    public override render(device: GPUDevice, passEncoder: GPURenderPassEncoder, camera: Camera): void
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

    public getTransform(): Transform
    {
        return this.transform;
    }
}