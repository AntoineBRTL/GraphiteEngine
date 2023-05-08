import { Engine } from "../Core/Engine.js";

export class Shader
{
    private source: string;
    private shader: GPUShaderModule;

    public constructor(source: string)
    {
        this.source = source;
        this.shader = this.compile();
    }

    private compile(): GPUShaderModule
    {
        let device = Engine.getRenderer().getDevice();
        return device.createShaderModule(
            {
                code: this.source,
            }
        );
    }

    public getShader(): GPUShaderModule
    {
        return this.shader;
    }
}