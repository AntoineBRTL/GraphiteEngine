import { WebGPUCamera } from "./WebGPUCamera.js";
import { WebGPUMaterial } from "./WebGPUMaterial.js";
import { Primitive, WebGPUMesh } from "./WebGPUMesh.js";

let vertexShader = `
@group(0) @binding(0) var<uniform> mViewRot : mat4x4<f32>;
@group(0) @binding(1) var<uniform> mProj : mat4x4<f32>;

struct VertexOutput 
{
    @builtin(position) vertPosition : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragNormal: vec4<f32>
};

@vertex
fn main(@location(0) position: vec3<f32>, @location(1) uv: vec2<f32>, @location(2) normal: vec3<f32>) -> VertexOutput
{
    var output : VertexOutput;
    output.vertPosition = mProj * mViewRot * vec4<f32>(position.x, position.y, position.z, 1.0);
    output.fragUV = uv;
    output.fragNormal = normalize(vec4<f32>(normal, 1.0));
    return output;
}`;

let fragmentShader = `
@fragment
fn main(@location(0) uv: vec2<f32>, @location(1) normal: vec4<f32>) -> @location(0) vec4<f32>
{
    let t: f32 = uv.x;
    let color: vec3<f32> = (1.0 - t)*vec3<f32>(1.0, 1.0, 1.0) + t*vec3<f32>(0.5, 0.7, 1.0);
    return vec4<f32>(color, 1.0);
}`;

export class Sky
{
    private mesh: WebGPUMesh;
    private material: WebGPUMaterial;

    public constructor()
    {
        this.mesh = WebGPUMesh.generate(Primitive.Sphere);
        this.material = new WebGPUMaterial(vertexShader, fragmentShader, false);
    }

    public render(device: GPUDevice, passEncoder: GPURenderPassEncoder, camera: WebGPUCamera): void
    {
        let pipeline: GPURenderPipeline;
        let vertexBuffer: GPUBuffer;
        let mViewRotBuffer: GPUBuffer;
        let mProjBuffer: GPUBuffer;
        let uniformBindingGroup: GPUBindGroup;

        pipeline                = this.material.getRenderPipeline(camera.getRenderer());
        vertexBuffer            = this.mesh.getVertexBuffer(device);
        mViewRotBuffer          = camera.getRenderer().toUniformGPUBuffer(device, camera.getTransform().getRotationMatrix());
        mProjBuffer             = camera.getProjectionMatrixBuffer(device);
        uniformBindingGroup     = camera.getRenderer().setupUniformBindGroup(device, pipeline, 0, mViewRotBuffer, mProjBuffer);

        camera.getRenderer().draw(passEncoder, pipeline, this.mesh, vertexBuffer, uniformBindingGroup);
    }
}