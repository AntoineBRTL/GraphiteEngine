import { Renderer } from "./Renderer.js";
import { Shader } from "./Shader.js";

export class Material
{
    private vertexShader: Shader;
    private fragmentShader: Shader;
    private pipeline: GPURenderPipeline | null;
    private depthWriteEnabled: boolean;

    public constructor(vertexShaderSource?: string, fragmentShaderSource?: string, depthWriteEnabled: boolean = true)
    {
        this.vertexShader = new Shader(vertexShaderSource || vertexShader);
        this.fragmentShader = new Shader(fragmentShaderSource || fragmentShader);
        this.pipeline = null;
        this.depthWriteEnabled = depthWriteEnabled;
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

    public useShader(vertexShader: Shader, fragmentShader: Shader): void
    {
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;

        this.pipeline = null;
    }

    private setupRenderPipeline(renderer: Renderer): GPURenderPipeline
    {
        let pipeline: GPURenderPipeline;

        pipeline = renderer.getDevice().createRenderPipeline(
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
                    topology: renderer.getPrimitiveTopology()
                },
                depthStencil: {
                    depthWriteEnabled: this.depthWriteEnabled,
                    depthCompare: 'less',
                    format: 'depth24plus',
                }
            }
        );

        return pipeline;
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
                    },
                    {
                        shaderLocation: 1,
                        format: "float32x2",
                        offset: 3 * 4
                    },
                    {
                        shaderLocation: 2,
                        format: "float32x3",
                        offset: (3 + 2) * 4
                    },
                ],
                stepMode: "vertex",
                arrayStride: (3 + 2 + 3) * 4
            }
        ];
    }

    public getRenderPipeline(renderer: Renderer): GPURenderPipeline
    {
        if(this.pipeline)
            return this.pipeline;
        this.pipeline = this.setupRenderPipeline(renderer);
        return this.pipeline;
    }
}

let vertexShader = `
@group(0) @binding(0) var<uniform> mActor : mat4x4<f32>;
@group(0) @binding(1) var<uniform> mView : mat4x4<f32>;
@group(0) @binding(2) var<uniform> mProj : mat4x4<f32>;
@group(0) @binding(3) var<uniform> mActorRot : mat4x4<f32>;

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
    output.vertPosition = mProj * mView * mActor * vec4<f32>(position.x, position.y, position.z, 1.0);
    output.fragUV = uv;
    output.fragNormal = normalize(mActorRot * vec4<f32>(normal, 1.0));
    return output;
}`;

let fragmentShader = `
@fragment
fn main(@location(0) uv: vec2<f32>, @location(1) normal: vec4<f32>) -> @location(0) vec4<f32>
{
    let color: vec3<f32> = vec3<f32>(0.5, 0.5, 0.5) * max(0.1, dot(normal.xyz, normalize(vec3<f32>(1.0, 1.0, 0.0))));
    return vec4<f32>(color, 1.0);
}`;