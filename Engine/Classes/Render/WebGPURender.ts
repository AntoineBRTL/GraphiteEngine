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
    private usePostProcessing: boolean;

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
    private sampler: GPUSampler | null;

    private primitiveTopology: GPUPrimitiveTopology;

    public constructor()
    {
        this.usePostProcessing              = false;
        this.device                         = null;
        this.adapter                        = null;
        this.context                        = null;
        this.postProcessingContext          = null;
        this.postProcessingPipeline         = null;
        this.depthView                      = null;
        this.quadVertexBuffer               = null;
        this.sampler                        = null;
        this.renderingCanvas                = new RenderingCanvas();
        this.postProcessingRenderingCanvas  = new RenderingCanvas();
        this.gpu                            = this.setupGPU();

        this.renderingCanvas.displayCanvas();

        this.setup();
        
        this.primitiveTopology = "triangle-list";
    }

    private setup(): void
    {
        this.setupAdapter()
        .then(function(this: WebGPURenderer, adapter: GPUAdapter)
        {
            this.adapter = adapter;
            this.setupDevice(this.adapter).then(this.finalize.bind(this));
        }.bind(this));
    }

    private finalize(device: GPUDevice): void
    {
        this.device                 = device;
        this.context                = this.setupContext(device, this.renderingCanvas.getCanvas());
        this.postProcessingContext  = this.setupContext(device, this.postProcessingRenderingCanvas.getCanvas());
        this.postProcessingPipeline = this.setupPostProcessingPipeline(device);
        this.depthView              = this.setupDepthView(device);
        this.quadVertexBuffer       = this.setupQuadBuffer(device);
        this.sampler                = this.setupSampler(device);

        this.resize(device);
        window.addEventListener("resize", this.resize.bind(this, device));
    }

    public getPrimitiveTopology(): GPUPrimitiveTopology
    {
        return this.primitiveTopology;
    }

    public getDevice(): GPUDevice
    {
        if(!this.device) throw new Error("Error: Device not found");
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

    private setupSampler(device: GPUDevice): GPUSampler
    {
        return device.createSampler({magFilter: 'linear', minFilter: 'linear'});
    }

    private setupDepthTexture(device: GPUDevice, canvas:HTMLCanvasElement): GPUTexture
    {
        let depthTexture: GPUTexture;
        depthTexture = device.createTexture(
        {   size: {width: canvas.width, height: canvas.height}, 
            format: 'depth24plus', usage: GPUTextureUsage.RENDER_ATTACHMENT
        });

        return depthTexture;
    }

    private setupDepthView(device: GPUDevice): GPUTextureView
    {
        let depthTexture: GPUTexture;
        let depthView: GPUTextureView;

        depthTexture = this.setupDepthTexture(device, this.renderingCanvas.getCanvas());
        depthView = depthTexture.createView();

        return depthView;
    }

    private setupGPU(): GPU
    {
        let gpu: GPU;
        gpu = navigator.gpu;
        if(!gpu) throw new Error("Can't get the GPU");

        return gpu;
    }

    private async setupAdapter(): Promise<GPUAdapter>
    {
        let adapter: GPUAdapter | null;
        adapter = await this.gpu.requestAdapter({powerPreference: "high-performance"});
        if(!adapter) throw new Error("Can't get adapter");

        return adapter;
    }

    private async setupDevice(adapter: GPUAdapter): Promise<GPUDevice>
    {
        let device: GPUDevice | undefined;
        device = await adapter.requestDevice();
        if(!device) throw new Error("Can't get device");

        return device;
    }

    private resize(device: GPUDevice): void
    {
        this.renderingCanvas.resize();
        this.postProcessingRenderingCanvas.resize();
        this.depthView = this.setupDepthView(device);
    }

    private getContextConfig(device: GPUDevice): GPUCanvasConfiguration
    {
        return {
            device: device,
            format: this.gpu.getPreferredCanvasFormat(),
            alphaMode: "opaque",
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        };
    }

    private setupContext(device: GPUDevice, canvas: HTMLCanvasElement): GPUCanvasContext
    {
        let context: GPUCanvasContext | null;
        context = canvas.getContext("webgpu");
        if(!context) throw new Error("Can't get context");
        context.configure(this.getContextConfig(device));

        return context;
    }

    private getActorPipeline(actor: Actor): GPURenderPipeline
    {
        return actor.getMaterial().getRenderPipeline(this);
    }

    private renderActor(actor: Actor, camera: WebGPUCamera, passEncoder: GPURenderPassEncoder, device: GPUDevice): void
    {
        let pipeline: GPURenderPipeline;
        let vertexBuffer: GPUBuffer;
        let mActorBuffer: GPUBuffer;
        let mViewBuffer: GPUBuffer;
        let mProjBuffer: GPUBuffer;
        let mActorRotBuffer: GPUBuffer;
        let uniformBuffer: GPUBindGroup;

        pipeline        = this.getActorPipeline(actor);
        vertexBuffer    = actor.getMesh().getVertexBuffer(device);
        mActorBuffer    = this.toUniformGPUBuffer(actor.getTransform().getTransformationMatrix(), device);
        mViewBuffer     = this.toUniformGPUBuffer(camera.getTransform().getViewTransformationMatrix(), device);
        mProjBuffer     = camera.getProjectionBuffer(device);
        mActorRotBuffer = this.toUniformGPUBuffer(actor.getTransform().getRotationMatrix(), device);
        uniformBuffer   = this.setupUniformBindGroup(mActorBuffer, mViewBuffer, mProjBuffer, mActorRotBuffer, device, pipeline);

        passEncoder.setPipeline(pipeline);
        passEncoder.setVertexBuffer(0, vertexBuffer);
        passEncoder.setBindGroup(0, uniformBuffer);
        
        passEncoder.draw(actor.getMesh().getVertices().length / (3 + 2 + 3)); /** POSITION UV NORMAL */
    }

    public render(actors: Actor[], camera: WebGPUCamera): void
    {
        if(!this.device 
        || !this.context 
        || !this.depthView)
            return;

        let commandEncoder: GPUCommandEncoder;
        let view: GPUTextureView;
        let passEncoder: GPURenderPassEncoder;

        commandEncoder  = this.device.createCommandEncoder();
        view            = this.getTextureView(this.context);
        passEncoder     = this.getPassEncoder(commandEncoder, view, this.depthView);

        for(let actor of actors) if(actor != camera)
            this.renderActor(actor, camera, passEncoder, this.device);

        passEncoder.end();
        this.device.queue.submit([commandEncoder.finish()]);

        /** IMPORTANT NUMBER OF LOST FRAMES */
        // if(this.usePostProcessing && this.postProcessingContext && this.quadVertexBuffer && this.postProcessingPipeline && this.sampler))
        // {
        //     let frameTexture = this.getTextureFromCanvas(this.device, this.renderingCanvas.getCanvas(), commandEncoder, this.context.getCurrentTexture());
        //     this.device.queue.submit([commandEncoder.finish()]);

        //     this.renderPostProcessing(this.device, this.postProcessingContext, this.quadVertexBuffer, this.postProcessingPipeline, frameTexture, this.sampler);
        // }
        // else
        // {
            
        // }
    }

    private toUniformGPUBuffer(value: Float32Array, device: GPUDevice): GPUBuffer
    {
        let buffer: GPUBuffer;
        buffer = device.createBuffer({size: value.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST});
        device.queue.writeBuffer(buffer, 0, value);
        
        return buffer;
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

    private renderPostProcessing(device: GPUDevice, context: GPUCanvasContext, quadBuffer: GPUBuffer, pipeline: GPURenderPipeline, frameTexture: GPUTexture, sampler: GPUSampler): void
    {
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

    private getTextureView(context: GPUCanvasContext): GPUTextureView
    {
        return context.getCurrentTexture().createView();
    }

    private getPassEncoder(commandEncoder: GPUCommandEncoder, view: GPUTextureView, depthView: GPUTextureView): GPURenderPassEncoder
    {
        let renderPassDescriptor: GPURenderPassDescriptor;

        renderPassDescriptor = {
            colorAttachments: [
                {
                    view: view,
                    clearValue: {r: 0.09, g: 0.09, b: 0.09, a: 1.0},
                    loadOp: "clear",
                    storeOp: "store"
                }
            ],
            depthStencilAttachment: {
                view: depthView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            }
        }

        return commandEncoder.beginRenderPass(renderPassDescriptor);
    }

    public setUsePostProcessing(use: boolean): void
    {
        this.usePostProcessing = use;
        if(use)
        {   
            this.renderingCanvas.hideCanvas();
            this.postProcessingRenderingCanvas.displayCanvas();
        }
        else
        {
            this.renderingCanvas.displayCanvas();
            this.postProcessingRenderingCanvas.hideCanvas();
        }
    }

    private setupPostProcessingPipeline(device: GPUDevice): GPURenderPipeline
    {
        let pipeline: GPURenderPipeline;
        pipeline = device.createRenderPipeline(
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

    private setupUniformBindGroup(mActor: GPUBuffer, mView: GPUBuffer, mProj: GPUBuffer, mActorRot: GPUBuffer, device: GPUDevice, pipeline: GPURenderPipeline): GPUBindGroup
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
}