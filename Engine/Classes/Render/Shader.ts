export class Shader
{
    private source: string;
    private shader: GPUShaderModule | null;

    public constructor(source: string)
    {
        this.source = source;
        this.shader = null;
    }

    public compile(device: GPUDevice): GPUShaderModule
    {
        this.shader = device.createShaderModule(
            {
                code: this.source,
            }
        );

        return this.shader;
    }

    public getShader(): GPUShaderModule | null
    {
        return this.shader;
    }
}