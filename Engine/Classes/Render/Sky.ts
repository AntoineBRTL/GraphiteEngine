import { fileReader } from "../../Graphite.js";
import { Camera } from "./Camera.js";
import { Material } from "./Material.js";
import { Mesh } from "./Mesh.js";
import { Renderable } from "./Renderable.js";

export class Sky extends Renderable
{
    public constructor()
    {
        super(false);
    }

    protected override async start(): Promise<void>
    {
        let fragmentSource: string;
        let vertexSource: string;
        fragmentSource  = await fileReader.readFileAsync(new URL("../../Shader/Sky.frag", import.meta.url).pathname);
        vertexSource    = await fileReader.readFileAsync(new URL("../../Shader/Sky.vert", import.meta.url).pathname);

        let sphereOBJ: string;
        let sphereMesh: Mesh;
        sphereOBJ       = await fileReader.readFileAsync(new URL("../../Model/Sphere.obj", import.meta.url).pathname);
        sphereMesh      = Mesh.fromString(sphereOBJ);

        this.setMaterial(new Material(vertexSource, fragmentSource, false));
        this.setMesh(sphereMesh);
    }

    public override render(device: GPUDevice, passEncoder: GPURenderPassEncoder, camera: Camera): void
    {
        let pipeline: GPURenderPipeline;
        let vertexBuffer: GPUBuffer;
        let mViewRotBuffer: GPUBuffer;
        let mProjBuffer: GPUBuffer;
        let uniformBindingGroup0: GPUBindGroup;

        pipeline                = this.material.getRenderPipeline(camera.getRenderer());
        vertexBuffer            = this.mesh.getVertexBuffer(device);
        mViewRotBuffer          = camera.getRenderer().toUniformGPUBuffer(device, camera.getTransform().getRotationMatrix());
        mProjBuffer             = camera.getProjectionMatrixBuffer(device);
        uniformBindingGroup0    = camera.getRenderer().setupUniformBindGroup(device, pipeline, 0, mViewRotBuffer, mProjBuffer);

        camera.getRenderer().draw(passEncoder, pipeline, this.mesh, vertexBuffer, uniformBindingGroup0);
    }
}
