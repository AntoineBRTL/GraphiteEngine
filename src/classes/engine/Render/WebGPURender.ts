import { Actor } from "../Entity/Actor.js";
import { Matrix4 } from "../Math/Matrix4.js";
import { Vector3 } from "../Math/Vector3.js";
import { RenderingCanvas } from "./RenderingCanvas.js";
import { WebGPUCamera } from "./WebGPUCamera.js";

let vertexShader = `
struct VertexOutput 
{
    @builtin(position) vertPosition : vec4<f32>,
    @location(0) uv : vec2<f32>,
};

@vertex
fn main(@location(0) position: vec3<f32>) -> VertexOutput
{
    var output : VertexOutput;
    output.vertPosition = vec4<f32>(position, 1.0);
    output.uv = position.xy;
    return output;
}`;

let fragmentShader = `
@group(0) @binding(0) var texture : texture_2d<f32>;
@group(0) @binding(1) var samp : sampler;

@fragment
fn main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32>
{
    let coord = vec2<f32>((uv.x + 1.0) / 2.0, (1.0 - uv.y) / 2.0);
    let color = textureSample(texture, samp, coord);
    return sqrt(color);
}`;

export class WebGPURenderer
{
    private renderingCanvas: RenderingCanvas;
    private postProcessingRenderingCanvas: RenderingCanvas;
    private gpu: GPU;

    private adapter: GPUAdapter | null;
    private device: GPUDevice | null;
    private context: GPUCanvasContext | null;
    private postProcessingContext: GPUCanvasContext | null;
    private postProcessingPipeline: GPURenderPipeline | null;
    private depthView: GPUTextureView | null;

    private quadVertexBuffer: GPUBuffer | null;

    private primitiveTopology: GPUPrimitiveTopology;

    public constructor()
    {
        this.renderingCanvas = new RenderingCanvas();
        // this.renderingCanvas.displayCanvas();
        this.postProcessingRenderingCanvas = new RenderingCanvas();
        this.postProcessingRenderingCanvas.displayCanvas();
        this.gpu = this.setupGPU();

        this.device = null;
        this.adapter = null;
        this.context = null;
        this.postProcessingContext = null;
        this.postProcessingPipeline = null;
        this.depthView = null;

        this.quadVertexBuffer = null;

        this.setup();
        
        this.primitiveTopology = "triangle-list";
    }

    private setup(): void
    {
        this.setupAdapter().then(function(this: WebGPURenderer, adapter: GPUAdapter)
        {
            this.adapter = adapter;

            this.setupDevice().then(function(this: WebGPURenderer, device: GPUDevice)
            {
                this.device = device;
                this.context = this.setupContext();
                this.postProcessingContext = this.setupPostProcessingContext();
                this.postProcessingPipeline = this.setupPostProcessingPipeline(device);
                this.depthView = this.setupDepthView(device);
                this.quadVertexBuffer = this.setupQuadBuffer(device);

                this.resize(device);
                window.addEventListener("resize", this.resize.bind(this, device));
            }.bind(this));
        }.bind(this));
    }

    private setupPostProcessingPipeline(device: GPUDevice): GPURenderPipeline
    {
        let pipeline = device.createRenderPipeline(
            {
                layout: "auto",
                vertex: {
                    entryPoint: "main",
                    module: device.createShaderModule(
                        {
                            code: vertexShader
                        }
                    ),
                    buffers: [
                        {
                            attributes: [
                                {
                                    shaderLocation: 0,
                                    format: "float32x3",
                                    offset: 0
                                }
                            ], 
                            arrayStride: 12,
                            stepMode: "vertex"
                        }
                    ]
                }, 
                fragment: {
                    entryPoint: "main",
                    module: device.createShaderModule(
                        {
                            code: fragmentShader
                        }
                    ),
                    targets: [
                        {
                            format: this.gpu.getPreferredCanvasFormat()
                        }
                    ]
                }
            }
        );

        return pipeline;
    }

    private setupDepthView(device: GPUDevice): GPUTextureView
    {
        let depthTexture = device.createTexture({
            size: {width: this.renderingCanvas.getCanvas().width, height: this.renderingCanvas.getCanvas().height}, 
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        })
        let depthView = depthTexture.createView();
        return depthView;
    }

    private setupGPU(): GPU
    {
        let gpu = navigator.gpu;
        if(!gpu)
        {
            throw new Error("Can't get the GPU");
        }

        return gpu;
    }

    private async setupAdapter(): Promise<GPUAdapter>
    {
        let adapter = await this.gpu.requestAdapter({
            powerPreference: "high-performance"
        });
        if(!adapter)
        {
            throw new Error("Can't get adapter");
        }

        return adapter;
    }

    private async setupDevice(): Promise<GPUDevice>
    {
        let device = await this.adapter?.requestDevice();
        if(!device)
        {
            throw new Error("Can't get device");
        }
        return device;
    }

    private resize(device: GPUDevice): void
    {
        this.renderingCanvas.resize();
        this.postProcessingRenderingCanvas.resize();
        this.depthView = this.setupDepthView(device);
    }

    private setupContext(): GPUCanvasContext
    {
        let context = this.renderingCanvas.getCanvas().getContext("webgpu");
        if(!context || !this.device)
        {
            throw new Error("Can't get context");
        }

        context.configure(
            {
                device: this.device,
                format: this.gpu.getPreferredCanvasFormat(),
                alphaMode: "opaque",
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
            }
        );

        return context;
    }

    private setupPostProcessingContext(): GPUCanvasContext
    {
        let context = this.postProcessingRenderingCanvas.getCanvas().getContext("webgpu");
        if(!context || !this.device)
        {
            throw new Error("Can't get context");
        }

        context.configure(
            {
                device: this.device,
                format: this.gpu.getPreferredCanvasFormat(),
                alphaMode: "opaque"
            }
        );

        return context;
    }

    private getActorPipeline(actor: Actor): GPURenderPipeline
    {
        return actor.getMaterial().getRenderPipeline(this);
    }

    private renderActor(actor: Actor, camera: WebGPUCamera, passEncoder: GPURenderPassEncoder, device: GPUDevice): void
    {
        let pipeline = this.getActorPipeline(actor);

        passEncoder.setPipeline(pipeline);
        // passEncoder.setScissorRect(0, 0, this.renderingCanvas.getCanvas().width, this.renderingCanvas.getCanvas().height);
        // passEncoder.setViewport(0, 0, this.renderingCanvas.getCanvas().width, this.renderingCanvas.getCanvas().height, 0, 1);

        let vertexBuffer = actor.getMesh().getVertexBuffer(device);
        passEncoder.setVertexBuffer(0, vertexBuffer);

        let mActor = this.matrix4x4ToGPUBuffer(actor.getTransform().getTransformationMatrix(), device);
        let mView = this.matrix4x4ToGPUBuffer(camera.getTransform().getViewTransformationMatrix(), device);
        let mProj = camera.getProjectionBuffer(device);
        let mActorRot = this.matrix4x4ToGPUBuffer(actor.getTransform().getRotationMatrix(), device);

        let uniformBuffer = this.setupUniformBuffer(mActor, mView, mProj, mActorRot, device, pipeline);
        passEncoder.setBindGroup(0, uniformBuffer);
        
        passEncoder.draw(actor.getMesh().getVertices().length / (3 + 2 + 3));
    }

    private setupUniformBuffer(mActor: GPUBuffer, mView: GPUBuffer, mProj: GPUBuffer, mActorRot: GPUBuffer, device: GPUDevice, pipeline: GPURenderPipeline): GPUBindGroup
    {
        return device.createBindGroup(
            {
                layout: pipeline.getBindGroupLayout(0),
                entries: [
                    {
                        binding: 0,
                        resource: 
                        {
                            buffer: mActor
                        }
                    },
                    {
                        binding: 1,
                        resource: 
                        {
                            buffer: mView
                        }
                    },
                    {
                        binding: 2,
                        resource: 
                        {
                            buffer: mProj
                        }
                    },
                    {
                        binding: 3,
                        resource: 
                        {
                            buffer: mActorRot
                        }
                    }
                ]
            }
        );
    }

    private matrix4x4ToGPUBuffer(matrix: Matrix4, device: GPUDevice): GPUBuffer
    {
        let buffer = device.createBuffer(
            {
                size: matrix.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            }
        );
        device.queue.writeBuffer(buffer, 0, matrix);
        return buffer;
    }

    private vector3ToGPUBuffer(vector: Vector3, device: GPUDevice): GPUBuffer
    {
        let buffer = device.createBuffer(
            {
                size: vector.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            }
        );
        device.queue.writeBuffer(buffer, 0, vector);
        return buffer;
    }

    private setupPostProcessingUniformBuffer(device: GPUDevice, texture: GPUTexture, sampler:GPUSampler, pipeline: GPURenderPipeline): GPUBindGroup
    {
        return device.createBindGroup(
            {
                layout: pipeline.getBindGroupLayout(0),
                entries: [
                    {
                        binding: 0,
                        resource: texture.createView()
                    },
                    {
                        binding: 1,
                        resource: sampler
                    }
                ]
            }
        )
    }

    private setupQuadBuffer(device: GPUDevice): GPUBuffer
    {
        let quad: Float32Array;
        quad = new Float32Array([
            -1.0, 1.0, 0.0,
            -1.0 , -1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, 1.0, 0.0, 
            1.0, -1.0, 0.0
        ]);

        let buffer = device.createBuffer(
            {
                size: quad.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
            }
        );
        device.queue.writeBuffer(buffer, 0, quad);
        return buffer;
    }

    private getTextureFromCanvas(device: GPUDevice, canvas: HTMLCanvasElement, commandEncoder:GPUCommandEncoder, swapChainTexture: GPUTexture): GPUTexture
    {
        let texture = device.createTexture(
            {
                size: {width: canvas.width, height: canvas.height},
                format: this.gpu.getPreferredCanvasFormat(),
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
            }
        );
        commandEncoder.copyTextureToTexture(
            {
              texture: swapChainTexture,
            },
            {
              texture: texture,
            },
            [canvas.width, canvas.height]
        );
        // device.queue.copyExternalImageToTexture({source: canvas}, {texture: texture}, {width: canvas.width, height: canvas.height});
        return texture;
    }

    private renderPostProcessing(device: GPUDevice, context: GPUCanvasContext, quadBuffer: GPUBuffer, pipeline: GPURenderPipeline, frameTexture: GPUTexture): void
    {
        let sampler = device.createSampler({magFilter: 'linear', minFilter: 'linear'});
        let commandEncoder = device.createCommandEncoder();
        let view = context.getCurrentTexture().createView();
        let renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: view,
                    clearValue: {r: 0.09, g: 0.09, b: 0.09, a: 1.0},
                    loadOp: "clear",
                    storeOp: "store"
                }
            ]
        }

        let passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setVertexBuffer(0, quadBuffer);

        let uniformBuffer = this.setupPostProcessingUniformBuffer(device, frameTexture, sampler, pipeline);
        passEncoder.setBindGroup(0, uniformBuffer);

        passEncoder.draw(6);
        passEncoder.end();
        device.queue.submit([commandEncoder.finish()]);
    }

    public render(actors: Actor[], camera: WebGPUCamera): void
    {
        if(!this.device || !this.context || !this.depthView || !this.postProcessingContext || !this.quadVertexBuffer || !this.postProcessingPipeline)
            return;

        let commandEncoder = this.device.createCommandEncoder();
        let view = this.context.getCurrentTexture().createView();
        let renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: view,
                    clearValue: {r: 0.09, g: 0.09, b: 0.09, a: 1.0},
                    loadOp: "clear",
                    storeOp: "store"
                }
            ],
            depthStencilAttachment: {
                view: this.depthView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            }
        }

        let passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

        for(let actor of actors)
        {
            if(actor != camera)
                this.renderActor(actor, camera, passEncoder, this.device);
        }

        passEncoder.end();
        let frameTexture = this.getTextureFromCanvas(this.device, this.renderingCanvas.getCanvas(), commandEncoder, this.context.getCurrentTexture());
        this.device.queue.submit([commandEncoder.finish()]);
        this.renderPostProcessing(this.device, this.postProcessingContext, this.quadVertexBuffer, this.postProcessingPipeline, frameTexture);
    }

    public getPrimitiveTopology(): GPUPrimitiveTopology
    {
        return this.primitiveTopology;
    }

    public getDevice(): GPUDevice
    {
        if(!this.device)
            throw new Error("Error: Device not found");
        return this.device;
    }

    public getGPU(): GPU
    {
        return this.gpu;
    }

    public getRenderingCanvas(): RenderingCanvas
    {
        return this.renderingCanvas;
    }

    public getPostProcessingRenderingCanvas(): RenderingCanvas
    {
        return this.postProcessingRenderingCanvas;
    }
}