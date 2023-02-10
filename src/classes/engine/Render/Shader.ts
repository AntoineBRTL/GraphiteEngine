export class Shader
{
    private source: string;
    private glShader: WebGLShader | null;
    private glType: number;

    public constructor(source: string, glType: number)
    {
        this.source = source;
        this.glShader = null;
        this.glType = glType;
    }

    public compile(gl: WebGL2RenderingContext): boolean
    {
        this.glShader = gl.createShader(this.glType);
        if(!this.glShader)
            throw new Error("An error occurred while creating shader");

        gl.shaderSource(this.glShader, this.source);
        gl.compileShader(this.glShader);

        if(!gl.getShaderParameter(this.glShader, gl.COMPILE_STATUS))
        {
            console.error(gl.getShaderInfoLog(this.glShader));
            return false;
        }

        return true;
    }

    public getGlShader(): WebGLShader | null
    {
        return this.glShader;
    }
}