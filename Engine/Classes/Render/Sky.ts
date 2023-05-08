import { Engine } from "../../Graphite.js";
import SkyFrag from "../../Shader/Sky.frag.js";
import SkyVert from "../../Shader/Sky.vert.js";
import { Camera } from "./Camera.js";
import { Material } from "./Material.js";
import { Mesh } from "./Mesh.js";
import { Renderable } from "./Renderable.js";

export class Sky extends Renderable
{
    public constructor()
    {
        super();

        this.setMaterial(new Material(SkyVert, SkyFrag, false));
        this.initMesh();
    }

    private async initMesh(): Promise<void>
    {
        let sphereOBJ: string;
        let sphereMesh: Mesh;
        sphereOBJ       = await Engine.getFileReader().readFileAsync(new URL("../../Model/Cube.obj", import.meta.url).pathname);
        sphereMesh      = Mesh.fromString(sphereOBJ);

        this.setMesh(sphereMesh);
    }

    public override render(passEncoder: GPURenderPassEncoder, camera: Camera): void
    {
        let device: GPUDevice = Engine.getRenderer().getDevice();

        let pipeline: GPURenderPipeline;
        let vertexBuffer: GPUBuffer;
        let mViewRotBuffer: GPUBuffer;
        let mProjBuffer: GPUBuffer;
        let uniformBindingGroup0: GPUBindGroup;

        pipeline                = this.getMaterial().getRenderPipeline();
        vertexBuffer            = this.getMesh().getVertexBuffer();
        mViewRotBuffer          = Engine.getRenderer().toUniformGPUBuffer(camera.getTransform().getRotationMatrix());
        mProjBuffer             = camera.getProjectionMatrixBuffer(device);
        uniformBindingGroup0    = Engine.getRenderer().setupUniformBindGroup(device, pipeline, 0, mViewRotBuffer, mProjBuffer);

        Engine.getRenderer().draw(passEncoder, pipeline, this.getMesh(), vertexBuffer, uniformBindingGroup0);
    }
}
