import { Actor } from "../Entity/Actor.js";
import { Matrix4 } from "../Math/Matrix4";
import { RenderingCanvas } from "./RenderingCanvas.js";
import { WebGPUCamera } from "./WebGPUCamera.js";

export class WebGPURenderer
{
    private renderingCanvas: RenderingCanvas;
    private gpu: GPU;

    private adapter: GPUAdapter | null;
    private device: GPUDevice | null;
    private context: GPUCanvasContext | null;
    private depthView: GPUTextureView | null;

    private primitiveTopology: GPUPrimitiveTopology;

    public constructor()
    {
        this.renderingCanvas = new RenderingCanvas();
        this.renderingCanvas.displayCanvas();
        this.gpu = this.setupGPU();

        this.device = null;
        this.adapter = null;
        this.context = null;
        this.depthView = null;

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
                this.depthView = this.setupDepthView(device);

                this.resize(device);
                window.addEventListener("resize", this.resize.bind(this, device));
            }.bind(this));
        }.bind(this));
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
        let adapter = await this.gpu.requestAdapter();
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
        )
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

    public render(actors: Actor[], camera: WebGPUCamera): void
    {
        if(!this.device || !this.context || !this.depthView)
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
        this.device.queue.submit([commandEncoder.finish()]);
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
}