import { Engine } from "../../Graphite.js";
import { Transform } from "../Math/Transform.js";
import { Camera } from "../Render/Camera.js";
import { Renderable } from "../Render/Renderable.js";

export class Actor extends Renderable
{
    private static actors: Array<Actor> = new Array<Actor>();

    public static getActors(): Array<Actor>
    {
        return Actor.actors;
    }

    protected transform: Transform;

    public constructor()
    {
        super();
        this.transform = new Transform();

        Actor.actors.push(this);
    }
    
    public update(deltaTime: number): void 
    {
        return;
    }

    public override render(passEncoder: GPURenderPassEncoder, camera: Camera): void
    {
        let device: GPUDevice = Engine.getRenderer().getDevice();

        let pipeline: GPURenderPipeline;
        let vertexBuffer: GPUBuffer;
        let mActorBuffer: GPUBuffer;
        let mViewBuffer: GPUBuffer;
        let mProjBuffer: GPUBuffer;
        let mActorRotBuffer: GPUBuffer;
        let uniformBindingGroup: GPUBindGroup;

        pipeline                = this.getMaterial().getRenderPipeline();
        vertexBuffer            = this.getMesh().getVertexBuffer();
        mActorBuffer            = Engine.getRenderer().toUniformGPUBuffer(this.transform.getTransformationMatrix());
        mViewBuffer             = Engine.getRenderer().toUniformGPUBuffer(camera.getTransform().getViewTransformationMatrix());
        mProjBuffer             = camera.getProjectionMatrixBuffer(device);
        mActorRotBuffer         = Engine.getRenderer().toUniformGPUBuffer(this.transform.getRotationMatrix());
        uniformBindingGroup     = Engine.getRenderer().setupUniformBindGroup(device, pipeline, 0, mActorBuffer, mViewBuffer, mProjBuffer, mActorRotBuffer);

        Engine.getRenderer().draw(passEncoder, pipeline, this.getMesh(), vertexBuffer, uniformBindingGroup);
    }

    public getTransform(): Transform
    {
        return this.transform;
    }
}