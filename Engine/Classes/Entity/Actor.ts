import { Mesh, fileReader } from "../../Graphite.js";
import { Transform } from "../Math/Transform.js";
import { Camera } from "../Render/Camera.js";
import { Material } from "../Render/Material.js";
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
        this.transform  = new Transform();
        Actor.actors.push(this);
    }
    
    public update(deltaTime: number): void 
    {
        return;
    }

    protected override async start(): Promise<void> 
    {
        try { this.getMaterial(); }
        catch (error)
        {
            let fragmentSource: string;
            let vertexSource: string;
            fragmentSource  = await fileReader.readFileAsync(new URL("../../Shader/Default.frag", import.meta.url).pathname);
            vertexSource    = await fileReader.readFileAsync(new URL("../../Shader/Default.vert", import.meta.url).pathname);

            this.setMaterial(new Material(vertexSource, fragmentSource, true));
        }

        try { this.getMesh(); }
        catch (error){ this.setMesh(new Mesh()); }

        await super.start();
    }

    public override render(device: GPUDevice, passEncoder: GPURenderPassEncoder, camera: Camera): void
    {
        let pipeline: GPURenderPipeline;
        let vertexBuffer: GPUBuffer;
        let mActorBuffer: GPUBuffer;
        let mViewBuffer: GPUBuffer;
        let mProjBuffer: GPUBuffer;
        let mActorRotBuffer: GPUBuffer;
        let uniformBindingGroup: GPUBindGroup;

        pipeline                = this.getMaterial().getRenderPipeline(camera.getRenderer());
        vertexBuffer            = this.getMesh().getVertexBuffer(device);
        mActorBuffer            = camera.getRenderer().toUniformGPUBuffer(device, this.transform.getTransformationMatrix());
        mViewBuffer             = camera.getRenderer().toUniformGPUBuffer(device, camera.getTransform().getViewTransformationMatrix());
        mProjBuffer             = camera.getProjectionMatrixBuffer(device);
        mActorRotBuffer         = camera.getRenderer().toUniformGPUBuffer(device, this.transform.getRotationMatrix());
        uniformBindingGroup     = camera.getRenderer().setupUniformBindGroup(device, pipeline, 0, mActorBuffer, mViewBuffer, mProjBuffer, mActorRotBuffer);

        camera.getRenderer().draw(passEncoder, pipeline, this.getMesh(), vertexBuffer, uniformBindingGroup);
    }

    public getTransform(): Transform
    {
        return this.transform;
    }
}