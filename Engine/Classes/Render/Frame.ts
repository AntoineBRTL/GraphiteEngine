import { Engine } from "../Core/Engine.js";

export class Frame
{
    /**
     * Canvas of a frame
     */
    private canvas: HTMLCanvasElement;

    /**
     * Gets an adapter
     * @param gpu 
     * @returns 
     */
    private static async getAdapter(gpu: GPU): Promise<GPUAdapter>
    {
        let adapter: GPUAdapter | null;
        adapter = await gpu.requestAdapter({powerPreference: "high-performance"});
        if(!adapter) throw new Error("Can't get adapter");

        return adapter;
    }

    /**
     * Gets a device
     * @param gpu 
     * @returns 
     */
    private static async getDevice(adapter: GPUAdapter): Promise<GPUDevice>
    {
        let device: GPUDevice | null;
        device = await adapter.requestDevice();
        if(!device) throw new Error("Can't get adapter");

        return device;
    }

    /**
     * Gets the gpu used by the navigator
     * @returns 
     */
    private static getGPU(): GPU
    {
        let gpu: GPU | null = navigator.gpu;
        if(!gpu) throw "Can't get gpu";

        return gpu;
    }

    /**
     * Generates context
     * @param device 
     * @param canvas 
     * @returns 
     */
    private static getContext(device: GPUDevice, gpu: GPU, canvas: HTMLCanvasElement): GPUCanvasContext
    {
        let context: GPUCanvasContext | null;
        context = canvas.getContext("webgpu");
        if(!context) throw new Error("Can't get context");
        context.configure({
            device: device,
            format: gpu.getPreferredCanvasFormat(),
            alphaMode: "opaque",
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        });

        return context;
    }

    /** 
     * GPU
     */
    private gpu: GPU;

    /**
     * Adapter
     */
    private adapter: GPUAdapter | null;

    /**
     * Device
     */
    private device: GPUDevice | null;

    /**
     * Context
     */
    private ctx: GPUCanvasContext | null;

    /**
     * Creates a frame
     */
    public constructor()
    {
        this.canvas = document.createElement('canvas');
        this.display();

        this.gpu                            = Frame.getGPU();
        this.device                         = null;
        this.adapter                        = null;
        this.ctx                            = null;
    }

    /**
     * Inits a frame 
     */
    public async init()
    {
        this.adapter = await Frame.getAdapter(this.gpu);
        this.device  = await Frame.getDevice(this.adapter);
        this.ctx     =       Frame.getContext(this.device, this.gpu, Engine.getFrame().getCanvas());

        this.resize();
        window.addEventListener("resize", this.resize.bind(this));
    }

    /**
     * Displays a frame
     */
    private display(): void
    {
        document.body.appendChild(this.canvas);
        document.body.style.margin = '0px';
        document.body.style.padding = '0px';
    }

    /**
     * Resizes a frame
     */
    private resize():void
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Gets the canvas of a frame
     * @returns 
     */
    public getCanvas():HTMLCanvasElement
    {
        return this.canvas;
    }

    /**
     * Gets the gpu device of a frame
     * @returns 
     */
    public getDevice(): GPUDevice
    {
        if(!this.device) throw new Error("Init a frame before");
        return this.device;
    }

    /**
     * Gets the context of a frame
     * @returns 
     */
    public getContext(): GPUCanvasContext
    {
        if(!this.ctx) throw new Error("Init a frame before");
        return this.ctx;
    }

    /**
     * Gets the gpu
     * @returns 
     */
    public getGPU(): GPU
    {
        return this.gpu;
    }
}