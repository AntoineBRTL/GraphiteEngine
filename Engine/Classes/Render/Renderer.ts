import { Actor } from "../Entity/Actor.js";
import { Matrix4 } from "../Math/Matrix4.js";
import { Vector3 } from "../Math/Vector3.js";
import { Frame } from "./Frame.js";
import { Sky } from "./Sky.js";
import { Vertex } from "./Vertex.js";
import { Camera } from "./Camera.js";
import { Material } from "./Material.js";
import { Mesh } from "./Mesh.js";
import { Shader } from "./Shader.js";
import { Renderable } from "./Renderable.js";
import StaticVert from "../../Shader/Static.vert.js";
import TextureFrag from "../../Shader/Texture.frag.js";
import { Engine } from "../Core/Engine.js";
import { Context } from "vm";

export class Renderer
{
    private depthView: GPUTextureView;

    private sampler: GPUSampler;

    private primitiveTopology: GPUPrimitiveTopology;

    /**
     * Device
     */
    private device: GPUDevice;

    /**
     * Context
     */
    private context: GPUCanvasContext;

    /**
     * Creates a new WebGPURenderer.
     */
    public constructor(device: GPUDevice, context: GPUCanvasContext)
    {
        this.device     = device;
        this.context    = context;

        this.depthView  = this.setupDepthView();
        this.sampler    = this.setupSampler();

        this.primitiveTopology = "triangle-list";

        window.addEventListener("resize", this.resize.bind(this));
    }

    private resize()
    {
        this.depthView = this.setupDepthView();
    }

    /**
     * Draws.
     */
    public draw(passEncoder: GPURenderPassEncoder, pipeline: GPURenderPipeline, mesh:Mesh, vertexBuffer: GPUBuffer, ...uniformBindingGroups: Array<GPUBindGroup>): void
    {
        passEncoder.setPipeline(pipeline);
        passEncoder.setVertexBuffer(0, vertexBuffer);
        for(let uniformBindingGroup of uniformBindingGroups) passEncoder.setBindGroup(0, uniformBindingGroup);
        passEncoder.draw(mesh.getVertices().length / (3 + 2 + 3)); /** POSITION UV NORMAL */
    }

    /**
     * Render an array of actors using a specific camera.
     */
    public render(renderables: Renderable[], camera: Camera, sky: Sky): void
    {
        let commandEncoder: GPUCommandEncoder;
        let view: GPUTextureView;
        let passEncoder: GPURenderPassEncoder;

        commandEncoder              = this.device.createCommandEncoder();
        view                        = this.getTextureView(this.context);
        passEncoder                 = this.getPassEncoder(commandEncoder, view, this.depthView);

        if(sky.getIsRenderable())
            sky.render(passEncoder, camera);

        for(let renderable of renderables) if(renderable != camera)
            renderable.render(passEncoder, camera);

        passEncoder.end();
        this.device.queue.submit([commandEncoder.finish()]);
    }

    /**
     * Setups a sampler.
     */
    private setupSampler(): GPUSampler
    {
        return this.device.createSampler({magFilter: 'linear', minFilter: 'linear'});
    }

    /**
     * Setups a depth texture.
     */
    private setupDepthTexture(): GPUTexture
    {
        let depthTexture: GPUTexture;
        depthTexture = this.device.createTexture(
        {   size: {width: Engine.getFrame().getCanvas().width, height: Engine.getFrame().getCanvas().height}, 
            format: 'depth24plus', usage: GPUTextureUsage.RENDER_ATTACHMENT
        });

        return depthTexture;
    }

    /**
     * Setups a depth view.
     */
    private setupDepthView(): GPUTextureView
    {
        let depthTexture: GPUTexture;
        let depthView: GPUTextureView;

        depthTexture = this.setupDepthTexture();
        depthView = depthTexture.createView();

        return depthView;
    }

    /**
     * Gets the primitive topology of a renderer.
     */
    public getPrimitiveTopology(): GPUPrimitiveTopology
    {
        return this.primitiveTopology;
    }

    /**
     * Gets the device of a renderer.
     */
    public getDevice(): GPUDevice
    {
        return this.device;
    }

    /**
     * Generates a buffer from an iterable.
     */
    public toUniformGPUBuffer(iterable: Float32Array): GPUBuffer
    {
        let buffer: GPUBuffer;
        buffer = this.device.createBuffer({size: iterable.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST});
        this.device.queue.writeBuffer(buffer, 0, iterable);
        
        return buffer;
    }

    /**
     * Gets a texture from the last render.
     */
    private getTextureFromRender(canvas: HTMLCanvasElement, commandEncoder:GPUCommandEncoder, swapChainTexture: GPUTexture): GPUTexture
    {
        let texture: GPUTexture;

        texture = this.device.createTexture({size: {width: canvas.width, height: canvas.height}, 
            format: Engine.getFrame().getGPU().getPreferredCanvasFormat(), 
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST});
        commandEncoder.copyTextureToTexture({texture: swapChainTexture}, {texture: texture}, [canvas.width, canvas.height]);
        
        return texture;
    }

    /**
     * Gets a view from the last render.
     */
    private getTextureView(context: GPUCanvasContext): GPUTextureView
    {
        return context.getCurrentTexture().createView();
    }

    /**
     * Gets a pass encoder.
     */
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

    /**
     * Gets a bind-group entry resource from a buffer, a texture or a sampler.
     */
    private getBindGroupEntryResource(entry: GPUBuffer | GPUTexture | GPUSampler): GPUBindingResource
    {        
        if(entry instanceof GPUBuffer)
            return {buffer: entry};

        if(entry instanceof GPUTexture)
            return entry.createView();

        return entry;
    }

    /**
     * Setups a bind group used for uniforms.
     */
    public setupUniformBindGroup(device: GPUDevice, pipeline: GPURenderPipeline, bindingIndex:number, ...buffers: Array<GPUBuffer | GPUTexture | GPUSampler>): GPUBindGroup
    {
        let entries: Array<GPUBindGroupEntry>;
        entries = new Array<GPUBindGroupEntry>();

        for(let i = 0; i < buffers.length; i++) 
            entries.push({binding: i, resource: this.getBindGroupEntryResource(buffers[i])});

        return device.createBindGroup({layout: pipeline.getBindGroupLayout(bindingIndex), entries: entries});
    }
}