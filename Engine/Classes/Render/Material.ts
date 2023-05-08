import DefaultFrag from "../../Shader/Default.frag.js";
import DefaultVert from "../../Shader/Default.vert.js";
import { Engine } from "../Core/Engine.js";
import { Renderer } from "./Renderer.js";
import { Shader } from "./Shader.js";

export class Material
{
    private vertexShader: Shader;
    private fragmentShader: Shader;
    private pipeline: GPURenderPipeline;
    private depthWriteEnabled: boolean;

    public constructor(vertexShaderSource?: string, fragmentShaderSource?: string, depthWriteEnabled: boolean = true)
    {
        this.vertexShader = new Shader(vertexShaderSource || DefaultVert);
        this.fragmentShader = new Shader(fragmentShaderSource || DefaultFrag);
        this.depthWriteEnabled = depthWriteEnabled;

        this.pipeline = this.setupRenderPipeline();
    }

    private getVertexShader(): GPUShaderModule
    {
        return this.vertexShader.getShader();
    }

    private getFragmentShader(): GPUShaderModule
    {
        return this.fragmentShader.getShader();
    }

    public useShader(vertexShader: Shader, fragmentShader: Shader): void
    {
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;

        this.pipeline = this.setupRenderPipeline();
    }

    private setupRenderPipeline(): GPURenderPipeline
    {
        let pipeline: GPURenderPipeline;

        pipeline = Engine.getRenderer().getDevice().createRenderPipeline(
            {
                vertex: {
                    module: this.getVertexShader(),
                    entryPoint: "main",
                    buffers: this.getBuffersDescriptor()
                },
                layout: "auto",
                fragment: {
                    module: this.getFragmentShader(),
                    entryPoint: "main",
                    targets: [
                        {
                            format: Engine.getFrame().getGPU().getPreferredCanvasFormat()
                        }
                    ]
                },
                primitive: {
                    topology: Engine.getRenderer().getPrimitiveTopology()
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

    public getRenderPipeline(): GPURenderPipeline
    {
        return this.pipeline;
    }
}