import { WebGPURenderer } from "./WebGPURender.js";
import { WebGPUShader } from "./WebGPUShader.js";

let vertexShader = `
@group(0) @binding(0) var<uniform> mActor : mat4x4<f32>;
@group(0) @binding(1) var<uniform> mView : mat4x4<f32>;
@group(0) @binding(2) var<uniform> mProj : mat4x4<f32>;

@vertex
fn main(@location(0) position: vec3<f32>) -> @builtin(position) vec4<f32>
{
    return mProj * mView * mActor * vec4<f32>(position.x, -position.y, position.z, 1.0);
}`;

let fragmentShader = `
@fragment
fn main() -> @location(0) vec4<f32>
{
    return vec4<f32>(1.0, 0.0, 0.0, 1.0);
}`;

export class WebGPUMaterial
{
    private vertexShader: WebGPUShader;
    private fragmentShader: WebGPUShader;

    public constructor()
    {
        this.vertexShader = new WebGPUShader(vertexShader);
        this.fragmentShader = new WebGPUShader(fragmentShader);
    }

    private getVertexShader(device: GPUDevice): GPUShaderModule
    {
        let shader = this.vertexShader.getShader();
        if(!shader)
            shader = this.vertexShader.compile(device);
        return shader;
    }

    private getFragmentShader(device: GPUDevice): GPUShaderModule
    {
        let shader = this.fragmentShader.getShader();
        if(!shader)
            shader = this.fragmentShader.compile(device);
        return shader;
    }

    private getBuffersDescriptor(): Iterable<GPUVertexBufferLayout>
    {
        return [
            {
                attributes: [
                    {
                        shaderLocation: 0,
                        format: "float32x3",
                        offset: 0
                    }
                ],
                stepMode: "vertex",
                arrayStride: 12
            }
        ];
    }

    public getRenderPipeline(renderer: WebGPURenderer): GPURenderPipeline
    {
        let pipeline = renderer.getDevice().createRenderPipeline(
            {
                vertex: {
                    module: this.getVertexShader(renderer.getDevice()),
                    entryPoint: "main",
                    buffers: this.getBuffersDescriptor()
                },
                layout: "auto",
                fragment: {
                    module: this.getFragmentShader(renderer.getDevice()),
                    entryPoint: "main",
                    targets: [
                        {
                            format: renderer.getGPU().getPreferredCanvasFormat()
                        }
                    ]
                },
                primitive: {
                    topology: renderer.getPrimitiveTopology(),
                }
            }
        );

        return pipeline;
    }
}